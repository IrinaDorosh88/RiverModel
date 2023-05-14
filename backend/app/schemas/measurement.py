from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from schemas import PaginatedResponse
from schemas.chemical_element import ChemicalElement
from schemas.prediction_point import PredictionPoint


class MeasurementBase(BaseModel):
    chemical_element_id: int
    concentration_value: Decimal


class Measurement(BaseModel):
    id: int
    location_id: int
    concentration_value: Decimal
    chemical_element: Optional[ChemicalElement]
    prediction_points: Optional[list[PredictionPoint]]
    is_active: bool
    created_at: Optional[datetime]
    modified_at: Optional[datetime]

    class Config:
        orm_mode = True


class GroupedMeasurement(BaseModel):
    date: date
    measurements: list[Measurement]

    class Config:
        orm_mode = True


class MeasurementCreate(BaseModel):
    location_id: int
    values: list[MeasurementBase]


class PaginatedMeasurement(PaginatedResponse):
    data: list[GroupedMeasurement]
