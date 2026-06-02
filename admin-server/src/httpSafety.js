import { existsSync } from "node:fs";
import { resolve } from "node:path";

export async function readJsonBody(req, maxBytes) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > maxBytes) {
      const error = new Error(`JSON body exceeds ${maxBytes} bytes`);
      error.statusCode = 413;
      throw error;
    }
    chunks.push(buffer);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function safeStaticTarget(staticDir, requestPath) {
  const dist = resolve(staticDir);
  const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
  const file = resolve(dist, `.${normalizedPath}`);
  const fallback = resolve(dist, "index.html");
  const safeFile = file.startsWith(`${dist}/`) ? file : fallback;
  return existsSync(safeFile) ? safeFile : fallback;
}
