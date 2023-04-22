from fastapi import HTTPException, status, Depends

from core.auth import get_current_user
from models.user import User


class RoleChecker:
    def __init__(self, required_roles):
        self.required_roles = required_roles

    def __call__(self, current_user: User = Depends(get_current_user)):
        if self.required_roles == ['any'] or current_user.role.name in self.required_roles:
            return True

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied for user")
