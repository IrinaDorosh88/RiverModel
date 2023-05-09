from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.chemical_element import ChemicalElement
from schemas import PaginationParams
from schemas.chemical_element import ChemicalElementCreate, ChemicalElementUpdate, PaginatedChemicalElement

def get_chemical_elements(db: Session, pagination: PaginationParams):
    query = db.query(ChemicalElement)

    data = query.order_by(ChemicalElement.name.asc()) \
            .limit(pagination.limit) \
            .offset(pagination.offset) \
            .all()

    return PaginatedChemicalElement(
            total=query.count(),
            limit=pagination.limit,
            offset=pagination.offset,
            data=data
    )

def create_chemical_element(db: Session, chemical_element: ChemicalElementCreate):
    db_chemical_element = ChemicalElement(name=chemical_element.name, min_value=chemical_element.min_value, max_value=chemical_element.max_value, units=chemical_element.units, timedelta_decay=chemical_element.timedelta_decay)
    db.add(db_chemical_element)
    db.commit()
    db.refresh(db_chemical_element)
    return db_chemical_element

def update_chemical_element(db: Session, chemical_element_id: int, chemical_element: ChemicalElementUpdate):
    db_chemical_element = db.query(ChemicalElement).filter(ChemicalElement.id == chemical_element_id).first()
    db_chemical_element.name = chemical_element.name
    db_chemical_element.min_value = chemical_element.min_value
    db_chemical_element.max_value = chemical_element.max_value
    db_chemical_element.units = chemical_element.units
    db_chemical_element.timedelta_decay = chemical_element.timedelta_decay
    db.commit()
    db.refresh(db_chemical_element)
    return db_chemical_element

def delete_chemical_element(db: Session, chemical_element_id: int):
    Cdb_chemical_element = db.query(ChemicalElement).filter(ChemicalElement.id == chemical_element_id).first()
    if Cdb_chemical_element:
        db.delete(Cdb_chemical_element)
        db.commit()
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="River not found.")
