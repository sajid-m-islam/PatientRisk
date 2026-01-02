from fastapi import FastAPI
from pydantic import BaseModel, field_validator
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
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
    # scaler = joblib.load('scaler.pkl')
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
    MEANS = [1.539643211100099, 44.45655764783614, 3.285431119920714, 28.27094482986455, 95.64497852659397, 119.17690782953419, 72.78031053848694, 1944.2880740006608, 94.28305748265608, 15.454146019160886]
    SCALES = [0.4984259381429431, 22.597058122422418, 1.4556983382311077, 7.7236581879117105, 18.78407834658277, 18.152528565260944, 11.677599858557778, 802.4497147470026, 60.383422086297806, 8.971747408306832]
    try:
        input_list = list(data.model_dump().values())
        
        scaled_data=[]
        for value, mean, scale in zip(input_list, MEANS, SCALES):
            scaled_data.append((value - mean) / scale)

        scaled_data = np.array([scaled_data])
        
        # print(f"DEBUG - Input DataFrame:\n{input_data}")
        # print(f"DEBUG - Scaled Data:\n{scaled_data}")
        prediction = model.predict(scaled_data)
        risk_score = float(prediction[0][0])
        return {
            'risk_score': risk_score
        }
    except Exception as e:
        return {'error': str(e)}, 500

