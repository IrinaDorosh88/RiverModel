from fastapi import HTTPException, status
from sqlalchemy import desc

from services import AppService
from models.location import Location
from models.measurement import Measurement
from models.chemical_element import ChemicalElement
from schemas import PaginationParams
from schemas.measurement import MeasurementCreate, PaginatedMeasurement
from sqlalchemy.orm import joinedload
from services.prediction_point import PredictionPointService
from schemas.prediction_point import PredictionPointCreate


class MeasurementService(AppService):
    def get_measurements(self, location_id: int, pagination: PaginationParams):
        query = self.session.query(Measurement) \
            .options(joinedload(Measurement.chemical_element)) \
            .filter(Measurement.location_id == location_id) \
            .order_by(desc(Measurement.created_at))

        is_paginated_response = isinstance(pagination.limit, int) and isinstance(pagination.offset, int)

        total = query.count()

        if is_paginated_response:
            query = query.limit(pagination.limit).offset(pagination.offset)

        data = query.all()

        return PaginatedMeasurement(
            total=total,
            limit=pagination.limit,
            offset=pagination.offset,
            data=data
        ) if is_paginated_response else data

    def create_measurements(self, measurement_data: MeasurementCreate):
        self.validate_dependencies(measurement_data)

        measurements = [
            Measurement(**measurement.dict(), location_id=measurement_data.location_id)
            for measurement in measurement_data.values
        ]
        self.session.add_all(measurements)
        self.session.commit()
        for measurement in measurements:
            self.session.refresh(measurement)

        prediction_point_service = PredictionPointService(self.session)
        for measurement in measurements:
            if measurement.concentration_value > measurement.chemical_element.max_value:
                print(measurement.concentration_value)
                prediction_points_data = prediction_point_service.run_model(measurement.concentration_value, measurement.chemical_element.max_value)
                prediction_point_service.create_prediction_points(prediction_point_data=PredictionPointCreate(measurement_id=measurement.id, values=prediction_points_data))

        return measurements

    def validate_dependencies(self, measurement_data: MeasurementCreate):
        db_location = self.session.query(Location).get(measurement_data.location_id)
        if not db_location:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown location')

        ce_ids = [ce.id for ce in db_location.chemical_elements]
        if set([item.chemical_element_id for item in measurement_data.values]).difference(ce_ids):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail='Specified an unavailable chemical element for the location')
