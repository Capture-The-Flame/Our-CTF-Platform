from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Challenge, UserChallenge

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_user_can_login(self):
        """Test that a user can log in"""
        response = self.client.post('/accounts/login/', {
            'login': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, 302) 
    
    def test_authenticated_user_can_access_challenges(self):
        """Test that logged-in users can view challenges"""
        self.client.force_login(self.user)
        response = self.client.get('/api/challenges/')
        self.assertEqual(response.status_code, 200)
    
    def test_unauthenticated_user_cannot_access_challenges(self):
        """Test that non-logged-in users cannot view challenges"""
        response = self.client.get('/api/challenges/')
        self.assertEqual(response.status_code, 403)
    
    def test_session_persists_after_login(self):
        """Test that session cookies work correctly"""
        self.client.force_login(self.user)
        response = self.client.get('/api/me/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['authenticated'])
        self.assertEqual(data['email'], 'test@example.com')


class ChallengeTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.challenge = Challenge.objects.create(
            title='Test Challenge',
            description='Test description',
            prompt='Test prompt',
            category='OSINT',
            base_points=500,
            min_points=100,
            decrement=20,
            flag='flame{test_flag}',
            is_active=True
        )
    
    def test_correct_flag_submission(self):
        """Test submitting correct flag"""
        self.client.force_login(self.user)
        response = self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {'flag': 'flame{test_flag}'},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        # Check that points were awarded (should be base_points on first solve)
        self.assertEqual(data['points'], 500)
    
    def test_incorrect_flag_submission(self):
        """Test submitting incorrect flag"""
        self.client.force_login(self.user)
        response = self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {'flag': 'flame{wrong_flag}'},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertFalse(data['success'])
    
    def test_duplicate_flag_submission(self):
        """Test that users can't submit the same challenge twice"""
        self.client.force_login(self.user)

        self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {'flag': 'flame{test_flag}'},
            content_type='application/json'
        )


        response = self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {'flag': 'flame{test_flag}'},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn('already completed', data['error'])
    
    def test_challenge_completion_updates_user_stats(self):
        """Test that completing a challenge updates user stats"""
        self.client.force_login(self.user)
        self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {'flag': 'flame{test_flag}'},
            content_type='application/json'
        )
        response = self.client.get('/api/stats/')
        data = response.json()
        self.assertEqual(data['challenges_completed'], 1)
        self.assertEqual(data['total_points'], 500)
    
    def test_dynamic_scoring_decreases_points(self):
        """Test that points decrease as more people solve the challenge"""


        user2 = User.objects.create_user(username='user2', email='user2@test.com', password='pass')
        user3 = User.objects.create_user(username='user3', email='user3@test.com', password='pass')
        
        self.client.force_login(self.user)
        response1 = self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {'flag': 'flame{test_flag}'},
            content_type='application/json'
        )
        self.assertEqual(response1.json()['points'], 500)
        
        self.client.force_login(user2)
        response2 = self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {'flag': 'flame{test_flag}'},
            content_type='application/json'
        )
        self.assertEqual(response2.json()['points'], 480)
        
        # Third user solves (should get 460 points: 500 - 40)
        self.client.force_login(user3)
        response3 = self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {'flag': 'flame{test_flag}'},
            content_type='application/json'
        )
        self.assertEqual(response3.json()['points'], 460)
        

        self.challenge.refresh_from_db()
        self.assertEqual(self.challenge.solves_count, 3)
        self.assertEqual(self.challenge.current_points, 440) 
    
    def test_minimum_points_enforced(self):
        """Test that points don't go below minimum"""


        self.challenge.solves_count = 25  
        self.challenge.save()
        
        self.assertEqual(self.challenge.current_points, 100)



class ScoreboardTests(TestCase):
    def setUp(self):
        self.client = Client()

        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='pass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='pass123'
        )
        
        self.challenge1 = Challenge.objects.create(
            title='Challenge 1',
            description='Test',
            category='OSINT',
            base_points=500,
            min_points=100,
            decrement=20,
            flag='flag1',
            is_active=True
        )
        self.challenge2 = Challenge.objects.create(
            title='Challenge 2',
            description='Test',
            category='Web',
            base_points=300,
            min_points=100,
            decrement=15,
            flag='flag2',
            is_active=True
        )
        
        # User 1 completes both challenges (gets full points)
        UserChallenge.objects.create(
            user=self.user1, 
            challenge=self.challenge1,
            awarded_points=500
        )
        UserChallenge.objects.create(
            user=self.user1, 
            challenge=self.challenge2,
            awarded_points=300
        )
        
        # Update solve counts
        self.challenge1.solves_count = 1
        self.challenge1.save()
        self.challenge2.solves_count = 1
        self.challenge2.save()
        

        UserChallenge.objects.create(
            user=self.user2, 
            challenge=self.challenge1,
            awarded_points=480  # 500 - 20
        )
        
        self.challenge1.solves_count = 2
        self.challenge1.save()
    
    def test_scoreboard_ranking(self):
        """Test that scoreboard ranks users correctly"""
        response = self.client.get('/api/scoreboard/')
        data = response.json()
        

        print(f"Scoreboard data: {data}")
        
        self.assertGreaterEqual(len(data), 1)
        
        # User 1 should be first (800 points total)
        self.assertEqual(data[0]['username'], 'user1')
        self.assertEqual(data[0]['rank'], 1)
        self.assertEqual(data[0]['points'], 800)  # 500 + 300
        self.assertEqual(data[0]['challenges_completed'], 2)
        
        if len(data) >= 2:
            self.assertEqual(data[1]['username'], 'user2')
            self.assertEqual(data[1]['rank'], 2)
            self.assertEqual(data[1]['points'], 480)
            self.assertEqual(data[1]['challenges_completed'], 1)
        else:
            user2_challenges = UserChallenge.objects.filter(user=self.user2)
            print(f"User2 challenges count: {user2_challenges.count()}")
            print(f"User2 challenges: {list(user2_challenges.values())}")
            self.fail("User2 not appearing in scoreboard despite having completed challenges")


class ScoreboardIntegrationTests(TestCase):
    """Integration tests using actual API endpoints"""
    
    def setUp(self):
        self.client = Client()
        
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='pass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='pass123'
        )
        
        self.challenge1 = Challenge.objects.create(
            title='Challenge 1',
            description='Test',
            category='OSINT',
            base_points=500,
            min_points=100,
            decrement=20,
            flag='flag1',
            is_active=True
        )
        self.challenge2 = Challenge.objects.create(
            title='Challenge 2',
            description='Test',
            category='Web',
            base_points=300,
            min_points=100,
            decrement=15,
            flag='flag2',
            is_active=True
        )
    
    def test_scoreboard_with_real_submissions(self):
        """Test scoreboard with actual flag submissions"""
        # User 1 solves both challenges
        self.client.force_login(self.user1)
        self.client.post(
            f'/api/challenges/{self.challenge1.id}/submit/',
            {'flag': 'flag1'},
            content_type='application/json'
        )
        self.client.post(
            f'/api/challenges/{self.challenge2.id}/submit/',
            {'flag': 'flag2'},
            content_type='application/json'
        )
        
        # User 2 solves one challenge
        self.client.force_login(self.user2)
        self.client.post(
            f'/api/challenges/{self.challenge1.id}/submit/',
            {'flag': 'flag1'},
            content_type='application/json'
        )
        
        # Check scoreboard
        response = self.client.get('/api/scoreboard/')
        data = response.json()
        
        self.assertEqual(len(data), 2)
        
        # User 1 first with 800 points (500 + 300)
        self.assertEqual(data[0]['username'], 'user1')
        self.assertEqual(data[0]['points'], 800)
        self.assertEqual(data[0]['challenges_completed'], 2)
        
        # User 2 second with 480 points (500 - 20)
        self.assertEqual(data[1]['username'], 'user2')
        self.assertEqual(data[1]['points'], 480)
        self.assertEqual(data[1]['challenges_completed'], 1)