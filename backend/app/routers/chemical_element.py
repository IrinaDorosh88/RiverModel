from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import services.chemical_element as chemical_element_service
import schemas.chemical_element as chemical_element_schema
from core.db import get_db

router = APIRouter()

@router.get("/", response_model=list[chemical_element_schema.ChemicalElement], description="This endpoint allows to get list of chemical elements")
def get_chemical_elements(db: Session = Depends(get_db)):
    chemical_elements = chemical_element_service.get_chemical_elements(db)
    return chemical_elements

@router.post("/", response_model=chemical_element_schema.ChemicalElement, description="This endpoint allows to create new chemical element")
def create_chemical_element(chemical_element: chemical_element_schema.ChemicalElementCreate, db: Session = Depends(get_db)):
    db_chemical_element = chemical_element_service.create_chemical_element(db, chemical_element)
    return db_chemical_element

@router.patch("/{chemical_element.id}", response_model=chemical_element_schema.ChemicalElement, description="This endpoint allows to update chemical element given by id")
def update_chemical_element(chemical_element: chemical_element_schema.ChemicalElementUpdate, db: Session = Depends(get_db)):
    db_chemical_element = chemical_element_service.update_chemical_element(db, chemical_element)
    return db_chemical_element