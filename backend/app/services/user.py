from typing import Optional

from . import AppService
from models.user import User as UserModel
from schemas.user import UserCreate, ViewerUpdate, User
from .role import RoleService


class UserService(AppService):

    def get_user_by_id(self, user_id: int) -> Optional[UserModel]:
        return self.session.get(UserModel, user_id)

    def get_user_by_login(self, login: str) -> Optional[UserModel]:
        return self.session.query(UserModel).filter(UserModel.login == login).first()

    def create_user(self, user_data: UserCreate) -> UserModel:
        role_id = RoleService(self.session).get_role_by_name('viewer').id
        db_user = UserModel(**user_data.dict(), role_id=role_id)
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        return db_user

    def update_user(self, user_id: int, user_data: ViewerUpdate) -> Optional[UserModel]:
        db_user = self.get_user_by_id(user_id)
        if db_user:
            for field, value in user_data.dict(exclude_unset=True).items():
                setattr(db_user, field, value)
            self.session.commit()
            self.session.refresh(db_user)

        return User.from_orm(db_user)
