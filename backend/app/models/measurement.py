from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, Sequence, func, Numeric, UniqueConstraint
from sqlalchemy.orm import relationship

from core.db import Base


table_name = 'measurements'

class Measurement(Base):
    __tablename__ = table_name

    id = Column(Integer, Sequence(f'{table_name}_id_seq'), primary_key=True, nullable=False)
    location_id = Column('location_id', Integer, ForeignKey('locations.id'), nullable=False)
    chemical_element_id = Column('chemical_element_id', Integer, ForeignKey('chemical_elements.id'), nullable=False)
    concentration_value = Column(Numeric(10, 6), nullable=False)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    modified_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    location = relationship('Location', back_populates='measurements')
    chemical_element = relationship('ChemicalElement', back_populates='measurements')
    prediction_points = relationship('PredictionPoint', back_populates='measurement')
