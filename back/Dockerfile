# ==============================================================================
# Dockerfile para FastAPI Backend
# ==============================================================================

# 1. Imagen base ligera oficial de Python 3.12 (slim-bookworm)
FROM python:3.12-slim

# 2. Configurar variables de entorno recomendadas para producción y Docker
# PYTHONDONTWRITEBYTECODE: Evita que Python escriba archivos .pyc a disco
# PYTHONUNBUFFERED: Fuerza a que stdout y stderr vayan directo al buffer del log
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 3. Directorio de trabajo del contenedor
WORKDIR /app

# 4. Crear grupo y usuario no privilegiados (Seguridad: Non-Root)
# Usamos IDs específicos > 10000 para evitar colisiones con usuarios del host
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -m -s /sbin/nologin appuser

# 5. Copiar requisitos para optimizar la caché de capas de Docker
# Si requirements.txt no cambia, Docker usará la caché para esta e instrucciones anteriores
COPY requirements.txt .

# 6. Instalar dependencias
# --no-cache-dir minimiza el tamaño de la imagen final descartando la caché de descargas de pip
RUN pip install --no-cache-dir -r requirements.txt

# 7. Copiar el resto del código fuente del backend, incluyendo 'modelo_entrenado.pkl'
# Usamos --chown para dar la propiedad de los archivos copiados directamente al usuario appuser
COPY --chown=appuser:appgroup . .

# 8. Cambiar al usuario sin privilegios
USER appuser

# 9. Exponer el puerto de FastAPI en el contenedor
EXPOSE 8000

# 10. Comando de ejecución usando Uvicorn, escuchando en todas las interfaces en el puerto 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
