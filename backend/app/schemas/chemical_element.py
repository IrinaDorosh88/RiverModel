from pydantic import BaseModel
from datetime import datetime

class ChemicalElementBase(BaseModel):
    name: str
    min_value: float
    max_value: float
    units: str
    timedelta_decay: int

    class Config:
        orm_mode = True

class ChemicalElementCreate(ChemicalElementBase):
    pass

class ChemicalElementUpdate(ChemicalElementBase):
    id: int

class ChemicalElement(ChemicalElementBase):
    id: int
    created_at: Optional[datetime]
    modified_at: Optional[datetime]
    is_active: bool

