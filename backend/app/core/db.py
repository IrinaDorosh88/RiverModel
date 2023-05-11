from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from .settings import DATABASE_URL


Base = declarative_base()

engine = create_engine(DATABASE_URL, echo=True)
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
