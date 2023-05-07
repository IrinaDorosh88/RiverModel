from decimal import Decimal

from pydantic import BaseModel


class LocationBase(BaseModel):
    name: str
    river_id: int
    longitude: float
    latitude: float
    flow_rate: Decimal
    turbulent_diffusive_coefficient: Decimal
    is_active: bool


class Location(LocationBase):
    id: int

    class Config:
        orm_mode = True


class LocationCreate(LocationBase):
    pass


class LocationUpdate(LocationBase):
    pass
