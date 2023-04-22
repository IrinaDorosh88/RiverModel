import re
from typing import Optional
from pydantic import BaseModel, validator

from schemas.role import Role


class UserCreate(BaseModel):
    login: str
    password: str


class ViewerUpdate(BaseModel):
    login: Optional[str] = None
    password: Optional[str] = None

    @validator('login')
    def login_must_contain_only_alphabets_and_digits(cls, value):
        if not re.match('^[a-zA-Z0-9]+$', value):
            raise ValueError('Only alphabets and digits are allowed in login')
        return value

    @validator('password')
    def password_validator(cls, value):
        if len(value) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return value


class ResearcherUpdate(BaseModel):
    role_id: int


class UserInDBBase(BaseModel):
    id: int
    login: str
    role: Role

    class Config:
        orm_mode = True


class UserInDB(UserInDBBase):
    password: str


class User(UserInDBBase):
    pass
