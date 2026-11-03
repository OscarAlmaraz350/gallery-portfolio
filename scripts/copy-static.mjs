import { cp, copyFile, mkdir, writeFile } from "node:fs/promises";

await mkdir("docs", { recursive: true });
await copyFile("src/index.html", "docs/index.html");
await copyFile("src/styles.css", "docs/styles.css");
await cp("src/assets", "docs/assets", { recursive: true });
// Full-resolution originals are requested only when a visitor downloads an image.
await mkdir("docs/originals", { recursive: true });
for (const file of ["dibujo1.jpg", "dibujo2.jpg", "dibujo3.jpg"]) {
  await copyFile(`original-assets/${file}`, `docs/originals/${file}`);
}
await writeFile("docs/.nojekyll", "");

console.log("Static files copied to docs/.");

// Anime.js is installed locally through npm and served from the published site.
await mkdir("docs/vendor", { recursive: true });
await cp("node_modules/animejs/dist/modules", "docs/vendor/animejs", { recursive: true });
