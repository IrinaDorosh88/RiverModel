from pydantic import BaseModel

class ChemicalElementBase(BaseModel):
    name: str
    min_value: float
    max_value: float
    units: str
    timedelta_decay: int

class ChemicalElementCreate(ChemicalElementBase):
    pass

class ChemicalElementUpdate(ChemicalElementBase):
    id: int

class ChemicalElement(ChemicalElementBase):
    id: int
    created_at: str
    modified_at: str
    is_active: bool

class Config:
    orm_mode = True