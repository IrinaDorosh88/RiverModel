from pydantic import BaseModel

from . import PaginatedResponse
from schemas.location import Location


class RiverBase(BaseModel):
    name: str


class River(RiverBase):
    id: int
    is_active: bool
    locations: list[Location] = []
    
    class Config:
        orm_mode = True


class RiverCreate(RiverBase):
    pass


class RiverUpdate(RiverBase):
    is_active: bool


class PaginatedRiver(PaginatedResponse):
    data: list[River]
