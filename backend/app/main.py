from fastapi import FastAPI

from routers.user import router as users_router
from routers.auth import router as auth_router


app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(auth_router, prefix='/auth', tags=['auth'])
app.include_router(users_router, prefix='/users', tags=['users'])
