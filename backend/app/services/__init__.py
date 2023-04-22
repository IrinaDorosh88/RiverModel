from fastapi import Depends
from sqlalchemy.orm import Session

from core.db import get_db


class DBSessionMixin:
    def __init__(self, session: Session = Depends(get_db)) -> None:
        self.session = session

class AppService(DBSessionMixin):
    pass
