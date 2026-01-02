from fastapi import FastAPI
from pydantic import BaseModel, field_validator
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import joblib
import pandas as pd
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=['http://localhost:5173'], 
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

try:
    model = tf.keras.models.load_model('model.keras')
    scaler = joblib.load('scaler.pkl')
    print('Model loaded successfully')
except Exception as e:
    print('Failed to load model')

class PatientData(BaseModel):
    gender: str
    age: int
    ethnicity: str
    bmi: float
    waist_circ: float
    systolic_bp: float
    diastolic_bp: float
    calories: float
    sugar: int
    fiber: int

    @field_validator('gender')
    @classmethod
    def convert_gender(cls, v: str) -> int:
        mapping = {'Male': 1, 'Female': 2}
        return mapping[v]

    @field_validator('ethnicity')
    @classmethod
    def convert_ethnicity(cls, v: str) -> int:
        mapping = {'Mexican American': 1, 'Other Hispanic': 2, 'Non-Hispanic White': 3, 'Non-Hispanic Black': 4, 'Non-Hispanic Asian': 5, 'Other Race': 7}
        return mapping[v]



@app.post('/risk-factor')
def predict_risk(data: PatientData):
    try:
        input_list = list(data.model_dump().values())
        input_data = np.array([input_list])
        scaled_data = scaler.transform(input_data)
        
        # print(f"DEBUG - Input DataFrame:\n{input_data}")
        # print(f"DEBUG - Scaled Data:\n{scaled_data}")
        prediction = model.predict(scaled_data)
        risk_score = float(prediction[0][0])
        return {
            'risk_score': risk_score
        }
    except Exception as e:
        return {'error': str(e)}, 500

