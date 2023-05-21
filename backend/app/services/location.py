from fastapi import HTTPException, status
from sqlalchemy import or_, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import contains_eager

from services import AppService
from models import Location, River, ChemicalElement, LocationChemicalElements
from schemas import PaginationParams
from schemas.location import LocationCreate, LocationUpdate, PaginatedLocation


unique_violation_error = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Unique constraint of fields has been broken. '
           'Please specify a unique set of fields: name, river, longitude and latitude'
)


class LocationService(AppService):
    def get_location_by_id(self, location_id: int):
        return self.session.query(Location).get(location_id)

    def get_locations(self, river_id: int, pagination: PaginationParams):
        query = self.session.query(Location) \
            .join(River, Location.river_id == River.id) \
            .join(LocationChemicalElements, Location.id == LocationChemicalElements.c.location_id, isouter=True) \
            .join(ChemicalElement, ChemicalElement.id == LocationChemicalElements.c.chemical_element_id, isouter=True) \
            .options(contains_eager(Location.chemical_elements)) \
            .populate_existing() \
            .filter(
                River.is_active,
                Location.is_active,
                or_(ChemicalElement.is_active.isnot(False), ChemicalElement.is_active.is_(None))
            )

        total_query = self.session.query(func.count(Location.id)) \
            .join(River, Location.river_id == River.id) \
            .filter(River.is_active, Location.is_active)

        is_paginated_response = isinstance(pagination.limit, int) and isinstance(pagination.offset, int)

        if river_id:
            query = query.filter(Location.river_id == river_id)
            total_query = total_query.filter(Location.river_id == river_id)

        query = query.order_by(Location.name.asc())

        if is_paginated_response:
            query = query.limit(pagination.limit).offset(pagination.offset)

        data = query.all()

        return PaginatedLocation(
            total=total_query.scalar(),
            limit=pagination.limit,
            offset=pagination.offset,
            data=data
        ) if is_paginated_response else data

    def create_location(self, location_data: LocationCreate):
        if self.session.query(River).filter(River.id == location_data.river_id, River.is_active).first() is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown river')

        location_data_dict = location_data.dict()
        input_chemical_elements = location_data_dict.pop('chemical_elements')
        db_chemical_elements = self.session.query(ChemicalElement) \
            .filter(ChemicalElement.id.in_(input_chemical_elements), ChemicalElement.is_active).all()

        if len(db_chemical_elements) != len(input_chemical_elements):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown chemical element')

        try:
            db_location = Location(**location_data_dict)
            for db_chemical_element in db_chemical_elements:
                db_location.chemical_elements.append(db_chemical_element)
            self.session.add(db_location)
            self.session.commit()
            self.session.refresh(db_location)
        except IntegrityError:
            raise unique_violation_error

        return db_location

    def update_location(self, location_id: int, location_data: LocationUpdate):
        if self.session.query(River).filter(River.id == location_data.river_id, River.is_active).first() is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown river')

        location_data_dict = location_data.dict(exclude_unset=True)
        input_chemical_elements = location_data_dict.pop('chemical_elements')
        db_chemical_elements = self.session.query(ChemicalElement) \
            .filter(ChemicalElement.id.in_(input_chemical_elements), ChemicalElement.is_active).all()

        if len(db_chemical_elements) != len(input_chemical_elements):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown chemical element')

        db_location = self.session.query(Location).get(location_id)
        for field, value in location_data_dict.items():
            setattr(db_location, field, value)

        db_location.chemical_elements = [
            db_chemical_element for db_chemical_element in db_chemical_elements
            if db_chemical_element.id in input_chemical_elements
        ]

        try:
            self.session.commit()
            self.session.refresh(db_location)
        except IntegrityError:
            raise unique_violation_error

        return db_location

    def delete_location(self, location_id: int):
        db_location = self.get_location_by_id(location_id)
        if db_location:
            db_location.chemical_elements = []
            self.session.delete(db_location)
            self.session.commit()
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found.")

    def soft_delete_location(self, location_id: int):
        db_location = self.get_location_by_id(location_id)
        if db_location.is_active:
            setattr(db_location, 'is_active', False)
            self.session.commit()
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found.")
