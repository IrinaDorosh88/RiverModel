from typing import Optional

from . import AppService
from models.role import Role as RoleModel


class RoleService(AppService):

    def get_role_by_id(self, role_id: int) -> Optional[RoleModel]:
        return self.session.get(RoleModel, role_id)

    def get_role_by_name(self, name: str) -> Optional[RoleModel]:
        return self.session.query(RoleModel).filter_by(name=name, is_active=True).first()