#!/bin/bash
python manage.py migrate --noinput
gunicorn ctf-platform.wsgi --bind 0.0.0.0:$PORT --log-file -
