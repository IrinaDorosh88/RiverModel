from fastapi import Depends
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from main import app
from core.db import engine, get_db
from services.user import UserService


def override_get_db():
    connection = engine.connect()

    # begin a non-ORM transaction
    transaction = connection.begin()

    # bind an individual Session to the connection
    db = Session(bind=connection)

    yield db

    db.close()
    transaction.rollback()
    connection.close()

app.dependency_overrides[get_db] = override_get_db


def get_test_user(user_service: UserService = Depends(UserService)):
    return user_service.get_user_by_login('test')

def get_authentication_headers(client: TestClient, login: str, password: str):
    data = {"login": login, "password": password}
    r = client.post("/auth", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers
