from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from . import PaginatedResponse

class ChemicalElementBase(BaseModel):
    name: str
    min_value: float
    max_value: float
    units: str
    timedelta_decay: int


class ChemicalElementCreate(ChemicalElementBase):
    pass

class ChemicalElementUpdate(ChemicalElementBase):
    is_active: bool

class ChemicalElement(ChemicalElementBase):
    id: int
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    is_active: Optional[bool] = None

    class Config:
        orm_mode = True

class PaginatedChemicalElement(PaginatedResponse):
    data: list[ChemicalElement]
