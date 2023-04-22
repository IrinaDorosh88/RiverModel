from pydantic import BaseModel

from .user import UserCreate


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenCreate(UserCreate):
    pass
