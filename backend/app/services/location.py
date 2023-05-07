from fastapi import HTTPException, status

from services import AppService
from models.location import Location
from models.river import River
from schemas.location import LocationCreate, LocationUpdate
from sqlalchemy.exc import IntegrityError

unique_violation_error = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Unique constraint of fields has been broken. '
           'Please specify a unique set of fields: name, river, longitude and latitude'
)


class LocationService(AppService):
    def get_locations(self, river_id: int):
        return self.session.query(Location).filter(Location.river_id == river_id).order_by(Location.name.asc()).all()

    def create_location(self, location_data: LocationCreate):
        if self.session.query(River).get(location_data.river_id) is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown river')

        db_location = Location(**location_data.dict())

        try:
            self.session.add(db_location)
            self.session.commit()
            self.session.refresh(db_location)
        except IntegrityError:
            raise unique_violation_error

        return db_location

    def update_location(self, location_id: int, location_data: LocationUpdate):
        if self.session.query(River).get(location_data.river_id) is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown river')

        db_location = self.session.query(Location).get(location_id)
        for field, value in location_data.dict(exclude_unset=True).items():
            setattr(db_location, field, value)
        try:
            self.session.commit()
            self.session.refresh(db_location)
        except IntegrityError:
            raise unique_violation_error

        return db_location
