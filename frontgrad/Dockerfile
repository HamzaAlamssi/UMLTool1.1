# Stage 1: Build the Vite React app
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

RUN npm run build

# Stage 2: Serve the app with a static server
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 5000
CMD ["serve", "-s", "dist", "-l", "5000"]
