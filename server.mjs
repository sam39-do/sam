import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, normalize, resolve, sep } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 5173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = normalize(resolve(root, `.${requested}`));
  const insideRoot = filePath === root || filePath.startsWith(`${root}${sep}`);
  return insideRoot ? filePath : null;
}

const server = createServer(async (request, response) => {
  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const data = await readFile(filePath);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": types[extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`星原沙盒: http://127.0.0.1:${port}`);
});
