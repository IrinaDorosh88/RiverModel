from sqlalchemy import Column, Integer, String, Numeric, DateTime, Boolean, Sequence
from sqlalchemy.sql import func
from core.db import Base

table_name = "chemical_elements"

class ChemicalElement(Base):
    __tablename__ = table_name

    id = Column(Integer, Sequence(f"{table_name}_id_seq"),primary_key=True, nullable=False)
    name = Column(String(50), unique=True, nullable=False)
    min_value = Column(Numeric(10, 2))
    max_value = Column(Numeric(10, 2))
    units = Column(String(20))
    timedelta_decay = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    modified_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    is_active = Column(Boolean, default=True)