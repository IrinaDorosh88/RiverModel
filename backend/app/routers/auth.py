from fastapi import APIRouter, Depends

from core.auth import authenticate_user, create_access_token
from schemas.token import Token, TokenCreate
from services.user import UserService

router = APIRouter()

@router.post("/", description="Generate a new authentication token by providing a valid login and password.",
             response_model=Token)
def create(user_data: TokenCreate, user_service: UserService = Depends()):
    user = authenticate_user(user_data.login, user_data.password, user_service)
    access_token = create_access_token(data={"sub": user.login})
    return {"access_token": access_token, "token_type": "bearer"}
