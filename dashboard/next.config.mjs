/** @type {import('next').NextConfig} */
const nextConfig = {
  // "standalone" empaqueta un server.js propio + solo los node_modules que
  // realmente se usan en producción, en .next/standalone/. Pensado para
  // hostings sin acceso a terminal (cPanel "Setup Node.js App", por
  // ejemplo): se sube esa carpeta ya armada y se corre directo, sin
  // "npm install" en el servidor. Ver CLAUDE.md, sección "Desplegar en un
  // hosting con cPanel".
  output: "standalone",
};

export default nextConfig;
