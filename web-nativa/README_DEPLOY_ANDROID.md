### Ejecutar backend y frontend simultáneamente

Opción A — Dos terminales (recomendado para desarrollo)
- Terminal 1 (backend):
  cd web-nativa\backend
  npm install
  npm run dev
- Terminal 2 (frontend):
  cd web-nativa\frontend
  npm install
  npm start


2. Instala dependencias y ejecuta:
  npm install --save-dev concurrently
  npm run dev