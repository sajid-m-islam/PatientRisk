import joblib
import numpy as np

# Load your scaler
scaler = joblib.load('scaler.pkl') 

print(f"MEANS = {scaler.mean_.tolist()}")
print(f"SCALES = {scaler.scale_.tolist()}")