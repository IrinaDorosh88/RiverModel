from typing import Optional

from . import AppService
from models.role import Role as RoleModel
from schemas.role import Role, RoleCreate, RoleUpdate


class RoleService(AppService):

    def get_role_by_id(self, role_id: int) -> Optional[RoleModel]:
        return self.session.get(RoleModel, role_id)

    def get_role_by_name(self, name: str) -> Optional[RoleModel]:
        return self.session.query(RoleModel).filter_by(name=name, is_active=True).first()

    def get_roles(self) -> list[RoleModel]:
        return self.session.query(RoleModel).filter(RoleModel.is_active==True).all()
    
    def create_role(self, role_data: RoleCreate) -> RoleModel:
        db_role = RoleModel(**role_data.dict())
        self.session.add(db_role)
        self.session.commit()
        self.session.refresh(db_role)
        return db_role
    
    def update_role(self, role_id: int, role_data: RoleUpdate) -> Optional[RoleModel]:
        db_role = self.session.query(RoleModel).filter(RoleModel.id == role_id).first()
        if db_role:
            for field, value in role_data.dict(exclude_unset=True).items():
                setattr(db_role, field, value)
            self.session.commit()
            self.session.refresh(db_role)

        return Role.from_orm(db_role)