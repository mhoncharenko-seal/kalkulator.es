# Idiomas, accesibilidad textual y SEO

Implementación independiente de Kalkulator.es. Revisión: 16 de octubre de 2026.

- Idiomas y rutas: `/es/`, `/uk/`, `/en/`, `/ru/`.
- Orden de navegación: Español · Українська · English · Русский. Sin banderas. El diseño debe mantener este orden y evitar que ruso y ucraniano queden juntos por redistribución visual.
- Las traducciones están en `i18n.mjs`: navegación, campos, mensajes, explicaciones, preguntas frecuentes, resultados, aviso y metadatos. La paridad de claves se comprueba automáticamente.
- Los importes usan `Intl.NumberFormat` con `es-ES`, `uk-UA`, `en-GB` y `ru-RU`. Los controles de fecha nativos siguen las preferencias del navegador; no se simula un formato fijo.
- Las fuentes conservan sus URL oficiales españolas; el texto visible del enlace dispone de traducción. BOE identifica al organismo y no se traduce.
- Cada página generada contiene un título, descripción, texto principal y FAQ en su idioma desde el HTML inicial. No depende de JavaScript para que un buscador lea esas explicaciones.
- Canonical: URL del idioma. `hreflang`: cuatro idiomas y `x-default` en español.
- La compilación normal genera `noindex,nofollow`, robots que bloquea todo y sitemap vacío. La compilación `--production` permite indexar exclusivamente las cuatro rutas públicas en su sitemap.
- Los borradores no se copian a `dist`; no forman parte de la navegación ni del sitemap. Los documentos técnicos quedan excluidos por robots. No se añaden reseñas ni datos estructurados ficticios.

## Verificación reproducible

`node --test tests/i18n.test.mjs` verifica paridad de claves no vacías, las referencias literales de las plantillas y del código, formato numérico soportado y orden de navegación. Debe repetirse junto con la suite completa después de cambios de interfaz.

La prueba de claves comprueba cobertura y evita mensajes técnicos visibles como `minimumNotNeeded`; no sustituye la revisión lingüística contextual ni una prueba real del navegador. Las tres pruebas pasaron en la revisión indicada. Se comprobó además que `node scripts/build.mjs` termina correctamente y genera HTML localizado con FAQ.

La suite `tests/build.test.mjs` compila en una carpeta temporal aislada tanto la versión previa como la de producción. Comprueba los cuatro idiomas, las claves `data-t` del HTML generado, la conservación de todos los campos, los recursos e imports relativos, las FAQ, títulos y descripciones, canonical y hreflang, robots y el número de URLs del sitemap. Siembra borradores en `blog/drafts` y `docs` para verificar que no pasan al paquete. Esta comprobación inspecciona la estructura HTML estática; no sustituye las pruebas interactivas de teclado, móvil o consola. Las cuatro pruebas conjuntas de idiomas y build pasaron tras añadir los avisos de revisión económica y JavaScript.

Revisión adicional: el HTML inicial señala con `aria-current="page"` el idioma activo. Los documentos metodológicos publicados reciben `X-Robots-Tag: noindex, nofollow` en Apache mediante `docs/.htaccess`, además de su exclusión en robots. Los estados de resultado seleccionados dinámicamente también tienen comprobación de traducción; una prueba rechaza mensajes largos idénticos al español en los demás idiomas. Las etiquetas de cotización reciente pendiente se han adaptado para acompañar una cifra de meses sin mezclarla con una frase completa.
