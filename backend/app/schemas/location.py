from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from . import PaginatedResponse


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

    class Config:
        orm_mode = True


class LocationCreate(LocationBase):
    pass


class LocationUpdate(LocationBase):
    is_active: bool


class PaginatedLocation(PaginatedResponse):
    data: list[Location]