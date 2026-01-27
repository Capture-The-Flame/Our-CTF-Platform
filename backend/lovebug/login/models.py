# login/models.py
from django.db import models
from django.contrib.auth.models import User

class Challenge(models.Model):
    CATEGORY_CHOICES = [
        ('OSINT', 'OSINT'),
        ('CRYPTO', 'Cryptography'),
        ('WEB', 'Web Exploitation'),
        ('FORENSICS', 'Forensics'),
        ('REVERSE', 'Reverse Engineering'),
        ('PWN', 'Binary Exploitation'),
        ('MISC', 'Miscellaneous'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    points = models.IntegerField()
    flag = models.CharField(max_length=200)  # The correct answer
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.points}pts)"

    class Meta:
        ordering = ['points', 'title']


class UserChallenge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='completed_challenges')
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'challenge']
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.username} - {self.challenge.title}"