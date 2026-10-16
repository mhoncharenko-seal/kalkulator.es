# Estado — 16-10-2026

Rama: `codex/mision-integral`, basada en `codex/menu-calculadoras` 069626fe3ff62c78b71274c81ec217d64dd081fa. Se conserva historial main y trabajo previo.

Implementado: catálogo declarativo de 7 herramientas; únicamente pensiones activa; cuatro idiomas, etiquetas ES/RU/UK/EN sin banderas; futuras grises; resultado total/componente español/complemento/ucraniano/gráfico/aviso en ese orden. Cantidades comparables anual/12; desconocidos excluidos del subtotal. Complemento positivo pendiente de verificación; pensión ucraniana vacía se conserva desconocida. Confirmaciones explícitas de ventana, ausencia de solapamiento y supuesto de base constante.

SEO estático desde módulos, contenido editorial, metadatos, canonical/hreflang y sitemap producción. Cambiar idioma conserva entradas y traduce también contenido editorial/metadatos. Sin dependencias de producción.

Validación: suite Node y builds preview/producción; 16 auditorías axe-core 4.14.0 (home/resultado, 4 idiomas, 390/1280 px) sin infracciones detectadas. Recorrido 13 UA+2 ES probado con edad67, base1500 y UA80: español anual/12=100, UA=80, subtotal180 y complemento pendiente. Prueba manual adicional UA desconocida: subtotal100 sin inventar cero. No equivale a certificación WCAG ni prueba con personas mayores; Lighthouse no medido.

Destino autorizado: pink-eagle-584038.hostingersite.com, u531355009. Copia previa en ../work/production-backup (27 archivos; docs/.htaccess reconstruido del build original después de bloqueo 403 del endpoint de lectura). No se modifican otros sitios ni DNS.

Despliegue: Hostinger aceptó publicación del ZIP kalkulator_20261016_204500.zip. Verificados portada y recorrido completo en 4 idiomas y 390/1280 px contra la URL pública, sin errores JavaScript. Axe se ejecutó localmente; en producción la CSP impide inyectar el auditor y se comprobó funcionalidad sin desactivar seguridad. Los 10 sitios de la cuenta conservan su estado enabled; no se escribieron recursos de otros sitios. Preparar con PowerShell: `$env:KALKULATOR_ORIGIN='https://pink-eagle-584038.hostingersite.com'; node scripts/build.mjs`. Comprimir contenido de dist incluyendo .htaccess con index.html en raíz. Usar Hostinger hosting_deploy-static-website.

Pendiente de acceso/decisión del propietario: dominio definitivo/DNS, propiedad Search Console y eventual proveedor de analítica. Las seis herramientas futuras no se implementan en esta entrega por especificación.
