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
    is_active: bool

    class Config:
        orm_mode = True

class PaginatedChemicalElement(PaginatedResponse):
    data: list[ChemicalElement]
