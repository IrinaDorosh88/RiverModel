from fastapi import APIRouter, Depends, Response, status

from schemas import PaginationParams
from schemas.river import PaginatedRiver, River, RiverCreate, RiverUpdate
from services.river import RiverService

router = APIRouter()

@router.get("/", description="This endpoint returns all river data.",
            response_model=list[River] | PaginatedRiver)
def get_rivers(pagination: PaginationParams = Depends(), service: RiverService = Depends()):
    return service.get_rivers(pagination)

@router.post("/", description="This endpoint creates a new river with the provided information and returns the river's data.",
             response_model=River)
def create_river(river_data: RiverCreate, service: RiverService = Depends()):
    return service.create_river(river_data=river_data)

@router.patch("/{river_id}/", description="This endpoint updates river information with the given ID. "
                                         "The request body should contain a JSON object with the fields to be updated.",
               response_model=River)
def update(river_id: int, river_data: RiverUpdate, service: RiverService = Depends()):
    return service.update_river(river_id=river_id, river_data=river_data)

@router.delete("/{river_id}/", description="This endpoint deletes a river entity with the specified ID "
                                              "from the database. Returns a 204 No Content response if the river "
                                              "entity was successfully deleted. Returns a 404 Not Found response "
                                              "if no river entity exists with the specified ID.")
def delete_river(river_id: int, response: Response, service: RiverService = Depends()):
    service.delete_river(river_id=river_id)
    response.status_code = status.HTTP_204_NO_CONTENT
    response.headers["X-Status-Message"] = "River deleted successfully."
