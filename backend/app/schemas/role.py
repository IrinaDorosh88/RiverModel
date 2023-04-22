from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RoleBase(BaseModel):
    name: str
    is_active: Optional[bool] = True


class RoleCreate(RoleBase):
    pass


class Role(RoleBase):
    id: int
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None

    class Config:
        orm_mode = True
