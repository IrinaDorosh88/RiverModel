from fastapi import APIRouter, Depends, Response, status

from schemas import PaginationParams
from schemas.location import Location, LocationCreate, LocationUpdate, PaginatedLocation
from services.location import LocationService

router = APIRouter()

@router.get("/", description="This endpoint returns all locations data by river_id.",
            response_model=list[Location] | PaginatedLocation)
def get(river_id: int = None, pagination: PaginationParams = Depends(), service: LocationService = Depends()):
    return service.get_locations(river_id, pagination)

@router.post("/", description="This endpoint creates a new location with the provided information and returns the location's data.",
             response_model=Location)
def create(location_data: LocationCreate, service: LocationService = Depends()):
    return service.create_location(location_data=location_data)

@router.patch("/{location_id}/", description="This endpoint updates location information with the given ID. "
                                         "The request body should contain a JSON object with the fields to be updated.",
               response_model=Location)
def update(location_id: int, location_data: LocationUpdate, service: LocationService = Depends()):
    return service.update_location(location_id=location_id, location_data=location_data)

@router.delete("/{location_id}/", description="This endpoint deletes a location entity with the specified ID "
                                              "from the database. Returns a 204 No Content response if the location "
                                              "entity was successfully deleted. Returns a 404 Not Found response "
                                              "if no location entity exists with the specified ID.")
def delete_location(location_id: int, response: Response, service: LocationService = Depends()):
    service.soft_delete_location(location_id=location_id)
    response.status_code = status.HTTP_204_NO_CONTENT
    response.headers["X-Status-Message"] = "Location deleted successfully."
