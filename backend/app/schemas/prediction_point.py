from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class PredictionPointBase(BaseModel):
    value: Decimal
    time: int


class PredictionPoint(PredictionPointBase):
    id: int
    measurement_id: int

    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    
    class Config:
        orm_mode = True


class PredictionPointCreate(BaseModel):
    measurement_id: int
    values: list[PredictionPointBase]
