// Punto de entrada para hostings tipo cPanel (Passenger / "Setup Node.js App"),
// que no usan "npm start" directamente sino que ejecutan un archivo .js
// específico ("Application startup file"). No se usa en desarrollo (ahí se
// usa "npm run dev") ni en Vercel — solo para este tipo de hosting. Ver
// CLAUDE.md, sección "Desplegar en un hosting con cPanel".
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`Dashboard listo en el puerto ${port}`);
  });
});
