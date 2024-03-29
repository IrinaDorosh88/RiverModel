from collections import defaultdict

from fastapi import HTTPException, status
from sqlalchemy import desc
from sqlalchemy.orm import joinedload, aliased

from services import AppService
from services.prediction_point import PredictionPointService
from models import River, Location, Measurement, ChemicalElement, PredictionPoint
from schemas import PaginationParams
from schemas.measurement import MeasurementCreate, PaginatedMeasurement, GroupedMeasurement
from schemas.prediction_point import PredictionPointCreate


class MeasurementService(AppService):
    def get_measurements(self, location_id: int, pagination: PaginationParams):
        chemical_element_alias = aliased(ChemicalElement)
        prediction_points_alias = aliased(PredictionPoint)

        data = self.session.query(Measurement) \
            .join(Location, Location.id == Measurement.location_id) \
            .join(River, River.id == Location.river_id) \
            .filter(
                Measurement.location_id == location_id,
                River.is_active,
                Location.is_active,
                chemical_element_alias.is_active
            ) \
            .options(
                joinedload(Measurement.chemical_element.of_type(chemical_element_alias)),
                joinedload(Measurement.prediction_points.of_type(prediction_points_alias))
            ) \
            .order_by(
                desc(Measurement.created_at),
                chemical_element_alias.name,
                prediction_points_alias.time
            ).all()

        is_paginated_response = isinstance(pagination.limit, int) and isinstance(pagination.offset, int)

        grouped_data = defaultdict(list)
        for item in data:
            grouped_data[getattr(item, 'created_at')].append(item)

        data = [
            GroupedMeasurement(date=created_at.date(), measurements=measurements)
            for created_at, measurements in grouped_data.items()
        ]

        if is_paginated_response:
            data = data[pagination.offset:pagination.limit]

        return PaginatedMeasurement(
            total=len(data),
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
                prediction_points_data = prediction_point_service.run_model(measurement.concentration_value, measurement.chemical_element.max_value)
                prediction_point_service.create_prediction_points(prediction_point_data=PredictionPointCreate(measurement_id=measurement.id, values=prediction_points_data))

        return measurements

    def validate_dependencies(self, measurement_data: MeasurementCreate):
        db_location = self.session.query(Location).join(River, River.id == Location.river_id) \
            .filter(Location.id == measurement_data.location_id, Location.is_active, River.is_active).first()
        if not db_location:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Specified an unknown location')

        ce_ids = [ce.id for ce in db_location.chemical_elements if ce.is_active]
        if set([item.chemical_element_id for item in measurement_data.values]).difference(ce_ids):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail='Specified an unavailable chemical element for the location')
