from datetime import datetime, date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class MeasurementBase(BaseModel):
    chemical_element_id: int
    concentration_value: Decimal


class Measurement(MeasurementBase):
    id: int
    location_id: int
    is_active: bool
    created_at: Optional[datetime]
    modified_at: Optional[datetime]

    class Config:
        orm_mode = True


class MeasurementGet(BaseModel):
    chemical_element: str
    units: str
    concentration_value: Decimal
    created_at: Optional[date]
    modified_at: Optional[date]

    class Config:
        orm_mode = True

class MeasurementCreate(MeasurementBase):
    location_id: int

class MeasurementUpdate(MeasurementBase):
    pass
