import { mkdir, cp, writeFile } from "node:fs/promises";
await mkdir("dist", { recursive: true });
for (const file of ["index.html","styles.css","visual.css","app.js"]) await cp(file, `dist/${file}`);
await cp("public", "dist", { recursive: true });
await writeFile("dist/robots.txt", "User-agent: *\nAllow: /\nSitemap: https://kieuanhnails.vercel.app/sitemap.xml\n");
await writeFile("dist/sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://kieuanhnails.vercel.app/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>');