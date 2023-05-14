from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from core.db import get_db

from schemas import PaginationParams
from schemas.chemical_element import ChemicalElement, ChemicalElementCreate, ChemicalElementUpdate, \
    PaginatedChemicalElement
import services.chemical_element as chemical_element_service

router = APIRouter()

@router.get("/", response_model=list[ChemicalElement] | PaginatedChemicalElement, description="This endpoint allows to get list of chemical elements")
def get_chemical_elements(db: Session = Depends(get_db), pagination: PaginationParams = Depends()):
    chemical_elements = chemical_element_service.get_chemical_elements(db, pagination)
    return chemical_elements

@router.post("/", response_model=ChemicalElement, description="This endpoint allows to create new chemical element")
def create_chemical_element(chemical_element: ChemicalElementCreate, db: Session = Depends(get_db)):
    db_chemical_element = chemical_element_service.create_chemical_element(db, chemical_element)
    return db_chemical_element

@router.patch("/{chemical_element_id}/", response_model=ChemicalElement, description="This endpoint allows to update chemical element given by id")
def update_chemical_element(chemical_element_id:int, chemical_element: ChemicalElementUpdate, db: Session = Depends(get_db)):
    db_chemical_element = chemical_element_service.update_chemical_element(db, chemical_element_id, chemical_element)
    return db_chemical_element

@router.delete("/{chemical_element_id}/", description="This endpoint deletes a chemical element entity with the specified ID "
                                              "from the database. Returns a 204 No Content response if the chemical element "
                                              "entity was successfully deleted. Returns a 404 Not Found response "
                                              "if no chemical element entity exists with the specified ID.")
def delete_chemical_element(chemical_element_id: int, response: Response, db: Session = Depends(get_db)):
    chemical_element_service.delete_chemical_element(db, chemical_element_id=chemical_element_id)
    response.status_code = status.HTTP_204_NO_CONTENT
    response.headers["X-Status-Message"] = "Chemical element deleted successfully."
