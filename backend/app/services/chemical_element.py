from sqlalchemy.orm import Session
from models.chemical_element import ChemicalElement
from schemas.chemical_element import ChemicalElementCreate, ChemicalElementUpdate

def get_chemical_elements(db: Session):
    return db.query(ChemicalElement).filter(ChemicalElement.is_active==True).all()

def create_chemical_element(db: Session, chemical_element: ChemicalElementCreate):
    db_chemical_element = ChemicalElement(name=chemical_element.name, min_value=chemical_element.min_value, max_value=chemical_element.max_value, units=chemical_element.units, timedelta_decay=chemical_element.timedelta_decay)
    db.add(db_chemical_element)
    db.commit()
    db.refresh(db_chemical_element)
    return db_chemical_element

def update_chemical_element(db: Session, chemical_element_id: int):
    db_chemical_element = db.query(ChemicalElement).filter(ChemicalElement.id == chemical_element_id).first()
    db_chemical_element.name = chemical_element.name
    db_chemical_element.min_value = chemical_element.min_value
    db_chemical_element.max_value = chemical_element.max_value
    db_chemical_element.units = chemical_element.units
    db_chemical_element.timedelta_decay = chemical_element.timedelta_decay
    db.commit()
    db.refresh(db_chemical_element)
    return db_chemical_element