"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ "X-Content-Type-Options": "nosniff" }, headers));
  res.end(body);
}

function serveStatic(req, res, urlPath) {
  // Resolve inside PUBLIC_DIR only — blocks ../ traversal.
  const safe = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safe === "/" ? "index.html" : safe);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return send(res, 404, "404 — Not Found", { "Content-Type": "text/plain; charset=utf-8" });
    }
    const type = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    send(res, 200, data, { "Content-Type": type });
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/health") {
    return send(
      res,
      200,
      JSON.stringify({
        status: "ok",
        node: process.version,
        uptimeSeconds: Math.round(process.uptime()),
        time: new Date().toISOString(),
      }),
      { "Content-Type": "application/json; charset=utf-8" }
    );
  }

  if (url.pathname === "/api/echo" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10_000) req.destroy();
    });
    req.on("end", () => {
      send(res, 200, JSON.stringify({ received: body }), {
        "Content-Type": "application/json; charset=utf-8",
      });
    });
    return;
  }

  serveStatic(req, res, url.pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
