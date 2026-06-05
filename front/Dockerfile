# ==============================================================================
# Dockerfile para Frontend React (Vite SPA) - Multi-Stage Build
# ==============================================================================

# --- STAGE 1: Compilación (Build Stage) ---
FROM node:20-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias para aprovechar la caché de capas de Docker
COPY package.json package-lock.json ./

# Instalar dependencias limpias e ignorar scripts adicionales innecesarios
RUN npm ci

# Declarar argumento de construcción para la URL del API (FastAPI)
# Vite requiere que las variables de entorno comiencen con VITE_ y estén presentes en compilación
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copiar el resto del código del frontend
COPY . .

# Compilar la aplicación React (SPA estática) -> Genera carpeta /app/dist
RUN npm run build


# --- STAGE 2: Servidor de Producción (Production Stage) ---
FROM nginx:1.25-alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos compilados desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto estándar HTTP de Nginx
EXPOSE 80

# Iniciar Nginx en primer plano (daemon off) para que Docker pueda rastrear el proceso correctamente
CMD ["nginx", "-g", "daemon off;"]
