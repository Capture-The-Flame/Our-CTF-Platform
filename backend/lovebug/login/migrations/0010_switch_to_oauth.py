from django.db import migrations, models
from django.contrib.auth import get_user_model

User = get_user_model()

def migrate_username_to_user(apps, schema_editor):
    """Convert username strings to User ForeignKeys"""
    UserChallenge = apps.get_model('login', 'UserChallenge')
    
    # For each UserChallenge with a username, find or create the User
    for uc in UserChallenge.objects.all():
        if hasattr(uc, 'username') and uc.username:
            # Try to find user by username or email
            user = User.objects.filter(username=uc.username).first()
            if not user:
                user = User.objects.filter(email=uc.username).first()
            
            # If still no user, create one
            if not user:
                user = User.objects.create_user(
                    username=uc.username,
                    email=f"{uc.username}@lovebug-ctf.temp"
                )
            
            if hasattr(uc, 'user_temp_id'):
                uc.user_temp_id = user.id
                uc.save()


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0009_challenge_artifact_path'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        # Step 1: Add user field (nullable temporarily)
        migrations.AddField(
            model_name='userchallenge',
            name='user_temp',
            field=models.ForeignKey(
                null=True,
                blank=True,
                on_delete=models.CASCADE,
                related_name='completed_challenges_temp',
                to='auth.User'
            ),
        ),
        
        # Step 2: Migrate data
        migrations.RunPython(migrate_username_to_user, migrations.RunPython.noop),
        
        # Step 3: Remove old constraint
        migrations.AlterUniqueTogether(
            name='userchallenge',
            unique_together=set(),
        ),
        
        # Step 4: Remove username field
        migrations.RemoveField(
            model_name='userchallenge',
            name='username',
        ),
        
        # Step 5: Rename user_temp to user
        migrations.RenameField(
            model_name='userchallenge',
            old_name='user_temp',
            new_name='user',
        ),
        
        # Step 6: Make user required
        migrations.AlterField(
            model_name='userchallenge',
            name='user',
            field=models.ForeignKey(
                on_delete=models.CASCADE,
                related_name='completed_challenges',
                to='auth.User'
            ),
        ),
        
        # Step 7: Add new constraint
        migrations.AlterUniqueTogether(
            name='userchallenge',
            unique_together={('user', 'challenge')},
        ),
    ]