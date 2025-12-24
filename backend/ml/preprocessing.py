import pandas as pd
from pathlib import Path

path = Path(__file__).resolve().parents[2] / 'data' / 'cleaned_nhanes_data.csv'

df = pd.read_csv(path)

print(df['ethnicity'])