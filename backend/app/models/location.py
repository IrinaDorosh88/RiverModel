from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Sequence, func, Float, Numeric, \
    UniqueConstraint
from sqlalchemy.orm import relationship

from core.db import Base


table_name = 'locations'

class Location(Base):
    __tablename__ = table_name
    __table_args__ = (
        UniqueConstraint('name', 'river_id', 'longitude', 'latitude'),
    )

    id = Column(Integer, Sequence(f'{table_name}_id_seq'), primary_key=True, nullable=False)
    name = Column(String(50), nullable=False)
    river_id = Column('river_id', Integer, ForeignKey('rivers.id'), nullable=False)
    longitude = Column(Float, nullable=False)
    latitude = Column(Float, nullable=False)
    flow_rate = Column(Numeric(10, 2), nullable=False)
    turbulent_diffusive_coefficient = Column(Numeric(10, 2), nullable=False)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    modified_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    river = relationship("River", back_populates="locations")
