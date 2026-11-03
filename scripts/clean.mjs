import { rm, mkdir } from "node:fs/promises";

await rm("docs", { recursive: true, force: true });
await mkdir("docs", { recursive: true });

console.log("Previous docs/ output cleaned.");
