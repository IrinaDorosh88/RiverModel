from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RoleBase(BaseModel):
    name: str


class Role(RoleBase):
    id: int
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    
    class Config:
        orm_mode = True


class RoleCreate(RoleBase):
    pass


class RoleUpdate(RoleBase):
    is_active: Optional[bool] = None
    pass
