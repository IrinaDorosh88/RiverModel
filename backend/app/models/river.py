from sqlalchemy import Column, Integer, String, DateTime, Boolean, Sequence
from sqlalchemy.sql import func
from core.db import Base


table_name = 'rivers'

class River(Base):
    __tablename__ = "rivers"

    id = Column(Integer, Sequence(f'{table_name}_id_seq'), primary_key=True, nullable=False)
    name = Column(String(50), nullable=False)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    modified_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
  