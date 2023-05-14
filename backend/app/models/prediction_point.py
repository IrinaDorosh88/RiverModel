from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Sequence, func, Float, Numeric, \
    UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.db import Base


table_name = 'prediction_points'

class PredictionPoint(Base):
    __tablename__ = "prediction_points"
    __table_args__ = (
        UniqueConstraint('measurement_id', 'time'),
    )

    id = Column(Integer, Sequence(f'{table_name}_id_seq'), primary_key=True, nullable=False)
    measurement_id = Column('measurement_id', Integer, ForeignKey('measurements.id'), nullable=False)
    value = Column(Numeric(10, 6), nullable=False)
    time = Column(Integer, nullable=False)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    modified_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    measurement = relationship('Measurement', back_populates='prediction_points')
