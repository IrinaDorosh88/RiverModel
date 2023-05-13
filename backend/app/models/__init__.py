from sqlalchemy import Table, Column, Integer, ForeignKey, Sequence, UniqueConstraint

from .user import User
from .river import River
from .role import Role
from .location import Location
from .chemical_element import ChemicalElement
from .measurement import Measurement
from core.db import Base


LocationChemicalElements = Table('location_chemical_elements', Base.metadata,
    Column('id', Integer, Sequence(f"location_chemical_elements_id_seq"), primary_key=True, nullable=False),
    Column('location_id', Integer, ForeignKey('locations.id')),
    Column('chemical_element_id', Integer, ForeignKey('chemical_elements.id')),
    UniqueConstraint('location_id', 'chemical_element_id')
)

__all__ = ['User', 'Role', 'River', 'ChemicalElement', 'Location', 'LocationChemicalElements']
