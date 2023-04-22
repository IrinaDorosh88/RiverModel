from sqlalchemy import Column, Integer, String, Boolean, DateTime, Sequence, func
from sqlalchemy.orm import relationship

from core.db import Base

from core.settings import AUTH_SCHEMA

table_name = 'roles'

class Role(Base):
    __tablename__ = table_name
    __table_args__ = {'schema': AUTH_SCHEMA}

    id = Column(Integer, Sequence(f'{table_name}_id_seq'), primary_key=True, nullable=False)
    name = Column(String(length=50), unique=True, nullable=False)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    modified_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    users = relationship('User', back_populates='role')
