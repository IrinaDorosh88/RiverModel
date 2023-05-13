from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from . import PaginatedResponse
from .chemical_element import ChemicalElement


class LocationBase(BaseModel):
    name: str
    river_id: int
    longitude: float
    latitude: float
    flow_rate: Decimal
    turbulent_diffusive_coefficient: Decimal


class Location(LocationBase):
    id: int
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    chemical_elements: Optional[list[ChemicalElement]] = []

    class Config:
        orm_mode = True


class LocationCreate(LocationBase):
    chemical_elements: list[int]


class LocationUpdate(LocationBase):
    chemical_elements: list[int]


class PaginatedLocation(PaginatedResponse):
    data: list[Location]