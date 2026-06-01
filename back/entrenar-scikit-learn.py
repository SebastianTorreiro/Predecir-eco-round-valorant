import pickle
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LogisticRegression

X_crudo = np.array([
    [25000, 15],
    [4500, 45],
    [12000, 20]
])

y_real = np.array([1, 0, 0])

fabrica_ia = Pipeline([
    ('purificadora', MinMaxScaler()),
    ('motor', LogisticRegression())
])

fabrica_ia.fit(X_crudo,y_real )

with open("modelo_entrenado.pkl", "wb") as archivo:

    pickle.dump(fabrica_ia, archivo)
print("¡Modelo entrenado y guardado con éxito!")



