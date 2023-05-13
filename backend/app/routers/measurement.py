from fastapi import APIRouter, Depends

from schemas import PaginationParams
from schemas.measurement import Measurement, MeasurementCreate, PaginatedMeasurement
from services.measurement import MeasurementService

router = APIRouter()

@router.get("/", description="This endpoint returns present measurements data by location_id.",
            response_model=list[Measurement] | PaginatedMeasurement)
def get(location_id: int, pagination: PaginationParams = Depends(), service: MeasurementService = Depends()):
    return service.get_measurements(location_id, pagination)

@router.post("/", description="This endpoint creates a new measurement with the provided information and returns the measurement's data.",
             response_model=list[Measurement])
def create(measurement_data: MeasurementCreate, service: MeasurementService = Depends()):
    return service.create_measurements(measurement_data=measurement_data)
