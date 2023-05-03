from fastapi import APIRouter, Depends, HTTPException

from core.utils import RoleChecker

from schemas.river import River, RiverCreate, RiverUpdate
from services.river import RiverService

router = APIRouter()

@router.get("/", description="This endpoint returns all river data.",
            response_model=list[River])
def get_rivers(service: RiverService = Depends()):
    return service.get_rivers()

@router.post("/", description="This endpoint creates a new river with the provided information and returns the river's data.",
             response_model=River)
def create_river(river_data: RiverCreate, service: RiverService = Depends()):
    return service.create_river(river_data=river_data)

@router.patch("/{river_id}", description="This endpoint updates river information with the given ID. "
                                         "The request body should contain a JSON object with the fields to be updated.",
               response_model=River)
def update(river_id: int, river_data: RiverUpdate, service: RiverService = Depends()):
    return service.update_river(river_id=river_id, river_data=river_data)
