from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class PredictionPointBase(BaseModel):
    name: str


class PredictionPoint(PredictionPointBase):
    id: int
    measurement_id: int
    value: Decimal
    time: int

    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    
    class Config:
        orm_mode = True


class PredictionPointCreate(PredictionPointBase):
    pass
