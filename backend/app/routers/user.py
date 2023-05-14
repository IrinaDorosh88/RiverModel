from fastapi import APIRouter, Depends, HTTPException

from core.auth import get_current_user, is_owner
from core.utils import RoleChecker

from schemas.user import UserCreate, ViewerUpdate, ResearcherUpdate, User
from services.user import UserService

router = APIRouter()


@router.post("/", description="This endpoint creates a new user with the provided information and returns the user's "
                              "data. The user will be created with a hashed password for security.",
             response_model=User)
def create(user_data: UserCreate, service: UserService = Depends()):
    db_user = service.get_user_by_login(login=user_data.login)
    if db_user:
        raise HTTPException(status_code=400, detail="Login has been already registered")

    return service.create_user(user_data=user_data)

@router.patch("/{user_id}/", description="This endpoint updates user information with the given ID. "
                                        "This endpoint requires a valid JWT access token in the Authorization header. "
                                        "The request body should contain a JSON object with the fields to be updated.",
              response_model=User, dependencies=[Depends(RoleChecker(['any'])), Depends(is_owner)])
def update(user_id: int, user_data: ViewerUpdate, user_service: UserService = Depends(),
           current_user: User = Depends(get_current_user)):
    return user_service.update_user(user_id=user_id, user_data=user_data)

@router.patch("/{user_id}/roles/", description="This endpoint allows an authorized user with an researcher role to "
                                              "update the role of an existing user. The role ID must be provided "
                                              "in a JSON object.",
              response_model=User, dependencies=[Depends(RoleChecker(['researcher']))])
def update(user_id: int, user_data: ResearcherUpdate, user_service: UserService = Depends(),
           current_user: User = Depends(get_current_user)):
    return user_service.update_user(user_id=user_id, user_data=user_data)
