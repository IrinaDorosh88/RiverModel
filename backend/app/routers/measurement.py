from fastapi import APIRouter, Depends

from schemas.measurement import Measurement, MeasurementCreate, MeasurementUpdate, MeasurementGet
from services.measurement import MeasurementService

router = APIRouter()

@router.get("/", description="This endpoint returns present measurements data by location_id.", response_model=list[MeasurementGet])
def get(location_id: int, service: MeasurementService = Depends()):
    return service.get_measurements(location_id)

@router.post("/", description="This endpoint creates a new measurement with the provided information and returns the measurement's data.",
             response_model=Measurement)
def create(measurement_data: MeasurementCreate, service: MeasurementService = Depends()):
    return service.create_measurement(measurement_data=measurement_data)

@router.patch("/{measurement_id}/", description="This endpoint updates measurement information with the given ID. "
                                         "The request body should contain a JSON object with the fields to be updated.",
               response_model=Measurement)
def update(measurement_id: int, measurement_data: MeasurementUpdate, service: MeasurementService = Depends()):
    return service.update_measurement(measurement_id=measurement_id, measurement_data=measurement_data)
