FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

RUN npm install -g http-server@14.1.1 --no-audit --no-fund \
    && npm cache clean --force

COPY --from=build /app/dist ./dist
# Der Port steht in config.json und wird beim Start daraus gelesen.
COPY config.json ./config.json

USER node
# EXPOSE ist reine Dokumentation und muss dem Port in config.json entsprechen.
EXPOSE 3005

# Anders als die Dokumentation braucht diese Seite keinen --proxy: sie hat eine
# einzige Adresse, unbekannte Pfade sollen ein 404 bekommen und keine Seite.
# `String(…)` verhindert, dass Node die Zahl eingefärbt ausgibt und
# Escape-Sequenzen im Port landen.
CMD ["sh", "-c", "port=$(node -p \"String(require('./config.json').port)\") && exec http-server dist -p \"$port\" -c-1"]
