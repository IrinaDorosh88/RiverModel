from sqlalchemy import Column, Integer, String, Numeric, DateTime, Boolean
from sqlalchemy.sql import func
from core.db import Base

class ChemicalElement(Base):
    __tablename__ = "chemical_elements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    min_value = Column(Numeric(10, 2))
    max_value = Column(Numeric(10, 2))
    units = Column(String(20))
    timedelta_decay = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    modified_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)