from decimal import Decimal

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
    is_active: bool

    class Config:
        orm_mode = True


class LocationCreate(LocationBase):
    pass


class LocationUpdate(LocationBase):
    is_active: bool


class PaginatedLocation(PaginatedResponse):
    data: list[Location]