import pickle
import numpy as np
from sklearn.linear_model import LogisticRegression


# Para CONGELAR (En tu script de entrenamiento)
# with open("modelo_entrenado.pkl", "wb") as archivo:

#     pickle.dump(mi_motor_ia, archivo)

# Para DESCONGELAR (En tu backend FastAPI)
#with open("modelo_entrenado.pkl", "rb") as archivo:

#    motor_recuperado = pickle.load(archivo)

X_crudo = np.array([
    [25000, 15],
    [4500, 45],
    [12000, 20]
])

y_real = np.array([[1], [0], [0]])


clf = LogisticRegression().fit(X_crudo,y_real )
clf.predict_proba()
clf.predict()


