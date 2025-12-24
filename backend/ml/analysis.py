import pandas as pd
from pathlib import Path
import os

files = ['BMX_L.xpt', 'BPXO_L.xpt', 'DEMO_L.xpt', 'DIQ_L.xpt', 'DR1TOT_L.xpt']
df = None
for file in files:
    base_path = Path(__file__).resolve().parents[2] / 'data' / 'raw' / file
    curr_df = pd.read_sas(base_path, format='xport', encoding='latin-1')
    
    if df is None:
        df = curr_df
    else:
        df = pd.merge(df, curr_df, on='SEQN', how='inner')

mapping = {
    'SEQN': 'patient_id',
    'RIAGENDR': 'gender',
    'RIDAGEYR': 'age',
    'RIDRETH3': 'ethnicity',
    'BMXBMI': 'bmi',
    'BMXWAIST': 'waist_circ',
    'BPXOSY1': 'systolic_bp',
    'BPXODI1': 'diastolic_bp',
    'DR1TKCAL': 'calories',
    'DR1TSUGR': 'sugar',
    'DR1TFIBE': 'fiber',
    'DIQ010': 'diabetes_target'
}

df_final = df[list(mapping.keys())].rename(columns=mapping)
df_final['diabetes_target'] = df_final['diabetes_target'].map({1: 1, 2: 0})
df_final = df_final.dropna(subset=['diabetes_target'])


print(df_final.shape[0])
print(df_final.shape[1])

# df_final.to_csv('cleaned_nhanes_data.csv', index=False)

