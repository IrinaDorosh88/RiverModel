from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.user import router as users_router
from routers.auth import router as auth_router
from routers.chemical_element import router as chemical_element_router
from routers.river import router as river_router
from routers.role import router as role_router
from routers.location import router as location_router
from routers.measurement import router as measurement_router


app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix='/auth', tags=['auth'])
app.include_router(users_router, prefix='/users', tags=['users'])
app.include_router(chemical_element_router, prefix='/elements', tags=['elements'])
app.include_router(river_router, prefix='/rivers', tags=['rivers'])
app.include_router(role_router, prefix='/roles', tags=['roles'])
app.include_router(location_router, prefix='/locations', tags=['locations'])
app.include_router(measurement_router, prefix='/measurements', tags=['measurements'])
