import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const base = "https://tool.waterfish.ren";
const skip = new Set([
  "node_modules",
  ".git",
  ".github",
  ".vercel",
  ".uploads",
  ".well-known",
  "assets",
  "api",
  "md",
  "scripts"
]);

const pages = [];

function walk(dir, prefix) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      if (!prefix && skip.has(name)) {
        continue;
      }
      walk(abs, prefix ? `${prefix}/${name}` : name);
      continue;
    }
    if (!name.endsWith(".html")) {
      continue;
    }
    if (name === "api-docs.html" && !prefix) {
      continue;
    }
    const clean = `${prefix ? prefix + "/" : ""}${name.replace(/\.html$/, "")}`;
    pages.push(clean === "index" ? `${base}/` : `${base}/${clean}`);
  }
}

walk(root, "");

pages.sort((a, b) => {
  if (a === `${base}/`) {
    return -1;
  }
  if (b === `${base}/`) {
    return 1;
  }
  return a.localeCompare(b);
});

const urls = pages
  .map((url) => {
    const home = url === `${base}/`;
    return `<url><loc>${url}</loc><changefreq>${home ? "weekly" : "monthly"}</changefreq><priority>${home ? "1.0" : "0.9"}</priority></url>`;
  })
  .join("\n");

writeFileSync(
  join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

console.log(`sitemap.xml generated with ${pages.length} urls`);
