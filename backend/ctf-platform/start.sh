#!/bin/bash
python manage.py migrate --noinput
gunicorn ctf-platform.wsgi --log-file -
```

Then update your `Procfile`:
```
web: bash start.sh