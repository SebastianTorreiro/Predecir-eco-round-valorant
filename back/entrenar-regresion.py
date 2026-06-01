import numpy as np

class NormalizadorMinMax:
    def __init__(self):
        self.minimos_ = None
        self.maximos_ = None

    def fit(self, X: np.ndarray) -> None:
        self.minimos_ = np.min(X, axis=0)
        self.maximos_ = np.max(X, axis=0)

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
      self.fit(X)
      return self.transform(X)

    def transform(self, X: np.ndarray) -> np.ndarray:

        if self.minimos_ is None or self.maximos_ is None:
            raise ValueError("El Normalizador debe ser entrenado con 'fit' antes de usar 'transform'")

        denominador = (self.maximos_ - self.minimos_)
        denominador = np.where(denominador == 0, 1, denominador)
        return (X -  self.minimos_)/(denominador)





import numpy as np


class RegresionLogistica:
  def __init__(self, alpha=0.01, epocas=1000, lambda_=0.0) -> None:
    self.__alpha = alpha
    self.__epocas = epocas
    self.__W = None
    self.__b = None
    self.lambda_ = lambda_


 
  def __sigmoide(self, prediccion: np.ndarray):
  # 1 / 1 + e ^ -z
    return (1/ (1 + np.exp(-prediccion)))

  def calcular_costo(self, predicciones: np.ndarray, real: np.ndarray) -> float:
    # -[real .log(prediccion) + (1 - real) . log(1-prediccion)]
    epsilon = 1e-15
    predicciones_seguras = np.clip(predicciones, epsilon, 1 - epsilon)
    costo = np.mean(-(real * np.log(predicciones_seguras) + (1 - real) * np.log(1 - predicciones_seguras))) + (((self.lambda_)/(2 * predicciones_seguras.shape[0])) * (np.sum(np.square(self.__W))))
    return costo

  def fit(self, X, y) -> None:
    # Asegurar que las X sean 2D
    if X.ndim == 1:
        X = X.reshape(1, -1)
    if y.ndim == 1:
        y = y.reshape(-1, 1) # Aseguro que 'y' sea vector columna (m, 1)

    # Validación cruzada de filas
    if X.shape[0] != y.shape[0]:
        raise ValueError(f"Desajuste dimensional: X tiene {X.shape[0]} filas pero y tiene {y.shape[0]} filas.")

    # INICIALIZO DINÁMICAMENTE Extraigo n (cantidad de
    # columnas/características de X)(shape retorna un tupla (columnas/filas))
    columnas, n_caracteristicas = X.shape
    # Creo una matriz de ceros de tamaño (n, 1) e inicializo b para no tener errores en la reasignacion (calculo final)
    self.__W = np.zeros((n_caracteristicas, 1))
    self.__b = 0.0

    for epoca in range(self.__epocas):

      predicciones = self.predict(X)
      error = predicciones - y

      if epoca % 10 == 0:
        print(f"epocas {epoca} - Costo: {self.calcular_costo(predicciones, y)}")

      dw = (1/columnas) * (np.dot(X.T, error)) + (self.lambda_ / columnas) * self.__W

      db = (1 / columnas) * np.sum(error)

      self.__W = self.__W - self.__alpha * dw
      self.__b = self.__b - self.__alpha * db

  def validar_entrada(self, X):
    if X.ndim == 1:
       X = X.reshape(1, -1)
    if self.__W.shape[0] != X.shape[1]: raise ValueError("Las columnas de la matriz a predecir deben coincidir con las usadas para el entrenamiento")
    return X


  def predict(self, X):
    entrada_limpia = self.validar_entrada(X)
    z = np.dot(entrada_limpia, self.__W) + self.__b
    prediccion = self.__sigmoide(z)
    filtro = (prediccion >= 0.5).astype(int)
    return filtro


# Dataset: [Sueldo, Deudas]
X = np.array([
    [0.8, 0.1],
    [0.4, 0.8],
    [0.9, 0.2],
    [0.2, 0.9]
])

y_real = np.array([[1], [0], [1], [0]])

x_nuevo = np.array([
    [0.7, 0.3],
    [0.3, 0.7],
    [0.9, 0.9]
])

modelo = RegresionLogistica(alpha=0.00001, epocas=100)
modelo.fit(X, y_real)
predicciones_nuevas = modelo.predict(x_nuevo)


print(predicciones_nuevas)

