from fastapi import HTTPException, status
from sqlalchemy import exists, func

from services import AppService
from models.chemical_element import ChemicalElement
from models.location import Location
from models.measurement import Measurement
from schemas.measurement import MeasurementCreate, MeasurementUpdate


class MeasurementService(AppService):
    def get_measurements(self, location_id: int):
        return self.session.query(
            ChemicalElement.name.label('chemical_element'),
            ChemicalElement.units,
            Measurement.concentration_value,
            func.date(func.max(Measurement.created_at)).label('created_at')
        ).join(
            ChemicalElement, Measurement.chemical_element_id == ChemicalElement.id
        ).filter(
            Measurement.location_id == location_id
        ).group_by(
            'chemical_element',
            ChemicalElement.units,
            Measurement.concentration_value,
        ).order_by(
            'chemical_element'
        ).all()

    def create_measurement(self, measurement_data: MeasurementCreate):
        if not self.session.query(exists().where(Location.id == measurement_data.location_id)).scalar():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown location')

        if not self.session.query(exists().where(ChemicalElement.id == measurement_data.chemical_element_id)).scalar():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown chemical element')

        db_measurement = Measurement(**measurement_data.dict())
        self.session.add(db_measurement)
        self.session.commit()
        self.session.refresh(db_measurement)

        return db_measurement

    def update_measurement(self, measurement_id: int, measurement_data: MeasurementUpdate):
        if not self.session.query(exists().where(Location.id == measurement_data.location_id)).scalar():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown location')

        if not self.session.query(exists().where(ChemicalElement.id == measurement_data.chemical_element_id)).scalar():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown chemical element')

        db_measurement = self.session.query(Measurement).get(measurement_id)

        for field, value in measurement_data.dict(exclude_unset=True).items():
            setattr(db_measurement, field, value)

        self.session.commit()
        self.session.refresh(db_measurement)

        return db_measurement
