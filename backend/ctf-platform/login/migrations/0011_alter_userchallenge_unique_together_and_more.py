from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0010_switch_to_oauth'),
    ]

    operations = [
        migrations.AddField(
            model_name='userchallenge',
            name='username',
            field=models.CharField(default='deleted', max_length=200),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='userchallenge',
            unique_together={('username', 'challenge')},
        ),
        migrations.RemoveField(
            model_name='userchallenge',
            name='user',
        ),
    ]