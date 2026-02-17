from django.db import models
from django.contrib.auth.models import User

class Challenge(models.Model):
    CATEGORY_CHOICES = [
        ('OSINT', 'OSINT'),
        ('Forensics', 'Forensics'),
        ('Web', 'Web Exploitation'),
        ('Crypto', 'Cryptography'),
        ('Reverse', 'Reverse Engineering'),
        ('Pwn', 'Binary Exploitation'),
        ('Misc', 'Miscellaneous'),
        ('Networking', 'Networking'),
        ('AI', 'Artificial Intelligence'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    prompt = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)

    # scoring config
    base_points = models.IntegerField(default=500)
    min_points = models.IntegerField(default=100)
    decrement = models.IntegerField(default=20)

    # state
    solves_count = models.PositiveIntegerField(default=0)
    
    flag = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    hint_1 = models.TextField(blank=True, null=True)
    hint_2 = models.TextField(blank=True, null=True)
    hint_3 = models.TextField(blank=True, null=True)

    artifact_path = models.CharField(max_length=300, blank=True, null=True)  

    @property
    def current_points(self) -> int:
        return max(self.min_points, self.base_points - self.decrement * self.solves_count)

    def __str__(self):
        return f"{self.title} ({self.category})"


class UserChallenge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='completed_challenges')
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    awarded_points = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'challenge')  # Changed back to 'user'

    def __str__(self):
        return f"{self.user.username} - {self.challenge.title}"