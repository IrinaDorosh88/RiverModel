from typing import Optional

from . import AppService
from models.prediction_point import PredictionPoint as PredictionPointModel
from schemas.prediction_point import PredictionPointCreate
from rivermodel import RiverModel


class PredictionPointService(AppService):
    def create_prediction_points(self, prediction_point_data: PredictionPointCreate) -> PredictionPointModel:
        prediction_points = [
            PredictionPointModel(**prediction_point.dict(), measurement_id=prediction_point_data.measurement_id)
            for prediction_point in prediction_point_data.values
        ]

        self.session.add_all(prediction_points)
        self.session.commit()
        for prediction_point in prediction_points:
            self.session.refresh(prediction_point)

        return prediction_points

    def run_model(self, data, critical_value):
        time = 0
        prediction_points_data = [{'time': time, 'value': data}]

        while data > critical_value:
            time += 1
            data = RiverModel.solve(data, critical_value, 1)[1]
            prediction_points_data.append({'time': time, 'value': data})

        return prediction_points_data

            