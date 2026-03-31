# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copia apenas package.json primeiro para cache de dependências
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

# Roda o build do Vite
RUN npm run build

# Production stage com Nginx
FROM nginx:alpine

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração do Nginx para SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
