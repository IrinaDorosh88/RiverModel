from typing import Optional
from fastapi import HTTPException, status

from . import AppService
from models.river import River as RiverModel
from schemas import PaginationParams
from schemas.river import PaginatedRiver, River, RiverCreate, RiverUpdate


class RiverService(AppService):
    def get_rivers(self, pagination: PaginationParams) -> PaginatedRiver:
        query = self.session.query(RiverModel).order_by(RiverModel.name.asc())

        is_paginated_response = isinstance(pagination.limit, int) and isinstance(pagination.offset, int)

        total = query.count()

        if is_paginated_response:
            query = query.limit(pagination.limit).offset(pagination.offset)

        data = query.all()

        return PaginatedRiver(
            total=total,
            limit=pagination.limit,
            offset=pagination.offset,
            data=data
        ) if is_paginated_response else data
  
    def create_river(self, river_data: RiverCreate) -> RiverModel:
        db_river = RiverModel(**river_data.dict())
        self.session.add(db_river)
        self.session.commit()
        self.session.refresh(db_river)
        return db_river

    def update_river(self, river_id: int, river_data: RiverUpdate) -> Optional[RiverModel]:
        db_river = self.session.query(RiverModel).filter(RiverModel.id == river_id).first()
        if db_river:
            for field, value in river_data.dict(exclude_unset=True).items():
                setattr(db_river, field, value)
            self.session.commit()
            self.session.refresh(db_river)

        return River.from_orm(db_river)
  
    def delete_river(self, river_id: int):
        db_river = self.session.query(RiverModel).filter(RiverModel.id == river_id).first()
        if db_river:
            self.session.delete(db_river)
            self.session.commit()
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="River not found.")
