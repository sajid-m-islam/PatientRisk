import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
path = Path.cwd()
dir = path / 'data' / 'cleaned_nhanes_data.csv'

df = pd.read_csv(dir)

X = df.drop(columns=['patient_id', 'diabetes_target'])
y = df['diabetes_target']
# print(df.isnull().sum())
X = X.fillna(X.median())
# print(X.isnull().sum())
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
# y_train.head()

from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

import tensorflow as tf
from tensorflow import keras
from sklearn.metrics import accuracy_score
model = keras.Sequential([
    keras.layers.Input(shape=(X.shape[1],)),
    keras.layers.Dense(units=64, activation='relu'),
    keras.layers.Dropout(0.3),
    keras.layers.Dense(units=32, activation='relu'),
    keras.layers.Dense(units=16, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(units=1, activation='sigmoid')
])
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])


callback = tf.keras.callbacks.EarlyStopping(monitor='loss', patience=3)
model.fit(X_train_scaled, y_train, epochs=200)
y_hat = model.predict(X_test_scaled)
y_hat = [0 if val < 0.3 else 1 for val in y_hat]
model.summary()
print(accuracy_score(y_test, y_hat))

cm = confusion_matrix(y_test, y_hat)
print(cm)