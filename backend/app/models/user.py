from passlib.context import CryptContext
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Sequence, func
from sqlalchemy.orm import relationship

from core.db import Base
from core.settings import AUTH_SCHEMA
from models.role import Role


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

table_name = 'users'

class User(Base):
    __tablename__ = table_name
    __table_args__ = {'schema': AUTH_SCHEMA}

    id = Column(Integer, Sequence(f'{table_name}_id_seq'), primary_key=True, nullable=False)
    login = Column(String(50), unique=True, nullable=False)
    password = Column(String(256), nullable=False)
    role_id = Column('role_id', Integer, ForeignKey(f'{AUTH_SCHEMA}.roles.id'), nullable=False)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    modified_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    role = relationship(Role, back_populates='users')

    def __setattr__(self, key, value):
        if key == 'password':
            value = pwd_context.hash(value)

        super().__setattr__(key, value)
