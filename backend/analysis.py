import pandas as pd
from pathlib import Path
import os

files = ['BMX_L.xpt', 'BPXO_L.xpt', 'DEMO_L.xpt', 'DR1TOT_L.xpt']
df = None
for file in files:
    base_path = Path(__file__).resolve().parents[1] / 'data' / 'raw' / file
    curr_df = pd.read_sas(base_path, format='xport', encoding='latin-1')
    
    if df is None:
        df = curr_df
    else:
        df = pd.merge(df, curr_df, on='SEQN', how='inner')


print(df.head())
