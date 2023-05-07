from typing import Optional

from . import AppService
from models.prediction_point import PredictionPoint as PredictionPointModel
from schemas.prediction_point import PredictionPointCreate


class PredictionPointService(AppService):
    def create_prediction_point(self, prediction_point_data: PredictionPointCreate) -> PredictionPointModel:
        db_prediction_point = PredictionPointModel(**prediction_point_data.dict())
        self.session.add(db_prediction_point)
        self.session.commit()
        self.session.refresh(db_prediction_point)
        return db_prediction_point
