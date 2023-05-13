import os

DATABASE_URL = os.getenv('DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
AUTH_SCHEMA = 'auth'

def is_local_env():
    return os.getenv('ENVIRONMENT') == 'local'
