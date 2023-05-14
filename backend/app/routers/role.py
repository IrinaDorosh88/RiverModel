from fastapi import APIRouter, Depends

from schemas import PaginationParams
from schemas.role import Role, RoleCreate, RoleUpdate, PaginatedRole
from services.role import RoleService

router = APIRouter()

@router.get("/", description="This endpoint returns all role data.", response_model=list[Role] | PaginatedRole)
def get_roles(pagination: PaginationParams = Depends(), service: RoleService = Depends()):
    return service.get_roles(pagination)

@router.post("/", description="This endpoint creates a new role with the provided information and returns the role's data.",
             response_model=Role)
def create_role(role_data: RoleCreate, service: RoleService = Depends()):
    return service.create_role(role_data=role_data)

@router.patch("/{role_id}/", description="This endpoint updates role information with the given ID. "
                                         "The request body should contain a JSON object with the fields to be updated.",
               response_model=Role)
def update_role(role_id: int, role_data: RoleUpdate, service: RoleService = Depends()):
    return service.update_role(role_id=role_id, role_data=role_data)
