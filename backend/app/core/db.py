import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from .settings import DATABASE_URL, is_local_env


Base = declarative_base()

if is_local_env():
    logging.basicConfig()
    logging.getLogger('sqlalchemy.engine').setLevel(logging.DEBUG)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class MySuperContextManager:
    def __init__(self):
        self.db = SessionLocal()

    def __enter__(self):
        return self.db

    def __exit__(self, exc_type, exc_value, traceback):
        self.db.close()


def get_db() -> Session:
    with MySuperContextManager() as db:
        yield db
