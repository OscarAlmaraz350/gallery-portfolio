OPTIMIZACIÓN DE IMÁGENES — GALLERY PORTFOLIO

- La galería carga versiones WebP desde src/assets/.
- Los originales JPG/PNG se conservan en original-assets/.
- El build copia los originales a docs/originals/ para que DOWNLOAD mantenga la descarga de alta resolución.
- Los originales no se descargan al abrir la galería, pero siguen siendo públicos en GitHub Pages. No incluyas allí material privado o exclusivo.

Aplicación:
1. Haz una copia de seguridad del proyecto.
2. Extrae este ZIP en la raíz de gallery-portfolio y permite reemplazar archivos. Conserva .git.
3. Ejecuta npm install y npm run build.
4. Comprueba docs/assets (WebP), docs/originals (originales), la galería y el botón DOWNLOAD.
5. No publiques hasta completar las pruebas.
