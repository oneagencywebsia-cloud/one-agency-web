# Blog y páginas estáticas de one-agency.es

Fuente en `content/`; el HTML generado (`blog/`, `servicios/`, `recursos/`, `privacidad/`, `404.html`, `sitemap.xml`, `og-image.jpg`) se **commitea** para que el Dockerfile solo tenga que copiarlo.

## Publicar un artículo
1. Crear `content/blog/<slug>.md` con front-matter: `title`, `seoTitle` (≤60 car.), `description` (120-160), `lead`, `cluster` (id de `site.json`), `type` (`pillar`|`satellite`), `keyword`, `sector` (opcional; debe coincidir con una opción del desplegable del formulario), `date`.
2. Estructura: intro, `:::tip En 30 segundos`, H2 por sección, `## Preguntas frecuentes` con `### ¿...?` + respuesta (genera FAQPage).
3. Enlaces internos con `[texto](/blog/otro-slug/)`; el build falla si alguno está roto.
4. `node tools/build.mjs && python tools/og.py` (requiere Node y Pillow).
5. Commit + push a `main` + rebuild manual del Docker en el VPS.

## Reglas
- "Gratis/gratuito" solo acompaña a "diagnóstico". Nunca en otros servicios, precios o schema.
- Sin cifras inventadas: los ejemplos con números se marcan como ilustrativos.
- Datos legales cambiantes (Verifactu, ayudas, Reglamento de IA): redactar con "verifica el calendario vigente".
- Los CTAs enlazan a `/?sector=…&fuente=<slug>#contacto`; la home preselecciona el sector y envía `attribution` en el payload del formulario.

## Notas de mantenimiento (generador)

- `node tools/build.mjs` **borra y regenera** `blog/`, `servicios/`, `recursos/`, `privacidad/` y `casos/`. Las páginas escritas a mano dentro de esas carpetas deben estar en la lista `KEEP` de `tools/build.mjs` (hoy: `recursos/calculadora-coste-herramientas-ia`). Si no, se pierden.
- Los cambios de plantilla (tipografía, pie, cookies, favicons, schema, carga de analítica...) se hacen en `tools/build.mjs`, no en el HTML generado: el siguiente build los pisaría.
- Títulos y descripciones SEO: `seoTitle` y `description` en el frontmatter de cada `.md`; en los hubs del blog, `seoTitle`, `seoDesc` e `intro` en `content/site.json`.
- Tras generar, `tools/build_md.py` crea `index.md` en cada página (versión Markdown para agentes de IA) y `llms-full.txt`. Requiere `pip install beautifulsoup4 markdownify`.
- Páginas estáticas fuera del generador: `index.html`, `soluciones-para-instaladores/` y `sobre-nosotros/`.
