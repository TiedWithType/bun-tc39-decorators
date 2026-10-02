import index from "./index.html";

const server = Bun.serve({
  hostname: "0.0.0.0",
  port: Number(Bun.env.PORT ?? 3000),
  routes: { "/": index },
  // Bez hot.accept() Bun automatycznie przeładuje stronę po zmianie TS.
  development: Bun.env.NODE_ENV !== "production" ? { hmr: true } : false,
  fetch() {
    return new Response("Nie znaleziono", { status: 404 });
  },
});

console.log(`Otwórz http://localhost:${server.port}`);
