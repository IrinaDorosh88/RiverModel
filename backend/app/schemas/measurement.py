from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from schemas import PaginatedResponse
from schemas.chemical_element import ChemicalElement


class MeasurementBase(BaseModel):
    chemical_element_id: int
    concentration_value: Decimal


class Measurement(BaseModel):
    id: int
    location_id: int
    concentration_value: Decimal
    chemical_element: Optional[ChemicalElement]
    is_active: bool
    created_at: Optional[datetime]
    modified_at: Optional[datetime]

    class Config:
        orm_mode = True


class MeasurementCreate(BaseModel):
    location_id: int
    values: list[MeasurementBase]


class PaginatedMeasurement(PaginatedResponse):
    data: list[Measurement]
