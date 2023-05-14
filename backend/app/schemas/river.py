from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from . import PaginatedResponse
from schemas.location import Location


class RiverBase(BaseModel):
    name: str


class River(RiverBase):
    id: int
    is_active: bool
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    locations: list[Location] = []
    
    class Config:
        orm_mode = True


class RiverCreate(RiverBase):
    pass


class RiverUpdate(RiverBase):
    pass


class PaginatedRiver(PaginatedResponse):
    data: list[River]
