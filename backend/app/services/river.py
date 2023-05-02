from typing import Optional

from . import AppService
from models.river import River as RiverModel
from schemas.river import River, RiverCreate, RiverUpdate


class RiverService(AppService):
  
  def get_rivers(self) -> list[RiverModel]:
    return self.session.query(RiverModel).filter(RiverModel.is_active==True).all()
  
  def create_river(self, river_data: RiverCreate) -> RiverModel:
    db_river = RiverModel(**river_data.dict())
    self.session.add(db_river)
    self.session.commit()
    self.session.refresh(db_river)
    return db_river
  
  def update_river(self, river_id: int, river_data: RiverUpdate) -> Optional[RiverModel]:
    db_user = self.session.query(RiverModel).filter(RiverModel.id == river_id).first()
    if db_user:
        for field, value in river_data.dict(exclude_unset=True).items():
            setattr(db_user, field, value)
        self.session.commit()
        self.session.refresh(db_user)

    return River.from_orm(db_user)
