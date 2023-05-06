from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RiverBase(BaseModel):
    name: str


class River(RiverBase):
    id: int
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    
    class Config:
        orm_mode = True


class RiverCreate(RiverBase):
    pass


class RiverUpdate(RiverBase):
    is_active: Optional[bool] = None
    pass
