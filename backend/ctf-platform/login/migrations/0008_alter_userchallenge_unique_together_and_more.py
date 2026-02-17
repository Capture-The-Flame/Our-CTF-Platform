from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('login', '0007_alter_challenge_category'),
    ]
    
    operations = [
        # FIRST: Remove the old unique constraint with 'user'
        migrations.AlterUniqueTogether(
            name='userchallenge',
            unique_together=set(),
        ),
        # SECOND: Add the new username field
        migrations.AddField(
            model_name='userchallenge',
            name='username',
            field=models.CharField(default='anonymous', max_length=200),
            preserve_default=False,
        ),
        # THIRD: Remove the old user field
        migrations.RemoveField(
            model_name='userchallenge',
            name='user',
        ),
        # FOURTH: Create the new unique constraint with 'username'
        migrations.AlterUniqueTogether(
            name='userchallenge',
            unique_together={('username', 'challenge')},
        ),
    ]