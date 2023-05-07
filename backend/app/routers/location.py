from fastapi import APIRouter, Depends

from schemas.location import Location, LocationCreate, LocationUpdate
from services.location import LocationService

router = APIRouter()

@router.get("/", description="This endpoint returns all locations data by river_id.", response_model=list[Location])
def get(river_id: int, service: LocationService = Depends()):
    return service.get_locations(river_id)

@router.post("/", description="This endpoint creates a new location with the provided information and returns the location's data.",
             response_model=Location)
def create(location_data: LocationCreate, service: LocationService = Depends()):
    return service.create_location(location_data=location_data)

@router.patch("/{location_id}/", description="This endpoint updates location information with the given ID. "
                                         "The request body should contain a JSON object with the fields to be updated.",
               response_model=Location)
def update(location_id: int, location_data: LocationUpdate, service: LocationService = Depends()):
    return service.update_location(location_id=location_id, location_data=location_data)
