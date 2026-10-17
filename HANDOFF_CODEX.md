# Estado — 16-10-2026

Rama: `codex/mision-integral`, basada en `codex/menu-calculadoras` 069626fe3ff62c78b71274c81ec217d64dd081fa. Se conserva historial main y trabajo previo.

Implementado: catálogo declarativo de 7 herramientas; únicamente pensiones activa; cuatro idiomas, etiquetas ES/RU/UK/EN sin banderas; futuras grises; resultado total/componente español/complemento/ucraniano/gráfico/aviso en ese orden. Cantidades comparables anual/12; desconocidos excluidos del subtotal. Complemento positivo pendiente de verificación; pensión ucraniana vacía se conserva desconocida. Confirmaciones explícitas de ventana, ausencia de solapamiento y supuesto de base constante.

SEO estático desde módulos, contenido editorial, metadatos, canonical/hreflang y sitemap producción. Cambiar idioma conserva entradas y traduce también contenido editorial/metadatos. Sin dependencias de producción.

Validación: suite Node y builds preview/producción; 16 auditorías axe-core 4.14.0 (home/resultado, 4 idiomas, 390/1280 px) sin infracciones detectadas. Recorrido 13 UA+2 ES probado con edad67, base1500 y UA80: español anual/12=100, UA=80, subtotal180 y complemento pendiente. Prueba manual adicional UA desconocida: subtotal100 sin inventar cero. No equivale a certificación WCAG ni prueba con personas mayores; Lighthouse no medido.

Destino autorizado: pink-eagle-584038.hostingersite.com, u531355009. Copia previa en ../work/production-backup (27 archivos; docs/.htaccess reconstruido del build original después de bloqueo 403 del endpoint de lectura). No se modifican otros sitios ni DNS.

Despliegue: Hostinger aceptó publicación del ZIP kalkulator_20261016_204500.zip. Verificados portada y recorrido completo en 4 idiomas y 390/1280 px contra la URL pública, sin errores JavaScript. Axe se ejecutó localmente; en producción la CSP impide inyectar el auditor y se comprobó funcionalidad sin desactivar seguridad. Los 10 sitios de la cuenta conservan su estado enabled; no se escribieron recursos de otros sitios. Preparar con PowerShell: `$env:KALKULATOR_ORIGIN='https://pink-eagle-584038.hostingersite.com'; node scripts/build.mjs`. Comprimir contenido de dist incluyendo .htaccess con index.html en raíz. Usar Hostinger hosting_deploy-static-website.

Pendiente de acceso/decisión del propietario: dominio definitivo/DNS, propiedad Search Console y eventual proveedor de analítica. Las seis herramientas futuras no se implementan en esta entrega por especificación.

## Actualización solicitada: total con complemento
El bloque principal suma ahora el escenario condicionado de complemento de 2026 tras tres confirmaciones específicas (ámbito, ingresos/familia y simulación). Desglose y gráfico incluyen sus tres componentes; debajo aparecen requisitos, mínimo, tope y fórmula anual. Sin datos suficientes permanece Por verificar. Se añade revalidación HTTP de caché para evitar versiones antiguas. Validación: 58 pruebas Node, 16 auditorías axe locales sin infracciones y 8 recorridos con complemento en 4 idiomas/2 tamaños. Publicado y verificado en producción: 8 recorridos con complemento, 4 idiomas y 2 tamaños, sin errores JavaScript.

Portada compacta: iconos 32px con tamaño SVG intrínseco, accesos 132px mínimos en escritorio/118px móvil, nombres y disponibilidad visibles. Recursos CSS/JS con versión de contenido para evitar caché antigua. 58 pruebas y 16 auditorías locales pasan.
Orden de idiomas corregido por petición expresa: ES · UK · EN · RU en portada y calculadora, con regla permanente en AGENTS.md.
Etiquetas visibles actualizadas por petición del usuario: Es · Ukr · En · Rus; rutas y códigos de idioma sin cambios.

## Refinamiento 17.10.2026
Acento existente del gráfico hero #d4784c compartido. Cotización reciente en cuartos de año (3 meses exactos), hipótesis sin casilla. 60 pruebas pasan; recorridos y axe locales 4 idiomas x 390/1280 sin incidencias. ITP sigue pendiente: agentes interrumpidos por límite de uso, no hay módulo publicado. Publicación de este refinamiento por verificar.


## Comparación de pensiones · 17.10.2026
Módulos nuevos comparison-view.mjs/comparison-i18n.mjs; modelo compareScenarios en pension-result.mjs. Sin pregunta de residencia, detalle opcional, dos escenarios y gráfico común; datos incompletos no fabrican complemento. 66 pruebas pasan y 8 recorridos locales (4 idiomas x móvil/escritorio), axe sin incidencias. No cambia el motor jurídico. Fuentes revisadas en docs/normativa.md. Destino autorizado y respaldo previo conservados. Verificar despliegue tras subir ZIP.

## ITP Cataluña · borrador privado 17.10.2026
Preparado itp-engine.mjs y scripts/build-itp-draft.mjs. Genera cuatro páginas autocontenidas en ../outputs/itp-borrador. No se activa el catálogo, no hay ruta pública ni inclusión de estos archivos en dist. Alcance: compraventa ordinaria de segunda mano en pleno dominio, tarifa general y jóvenes condicionada; otras operaciones/beneficios quedan pendientes. Fuentes ATC de tarifas y base imponible consultadas el 17.10.2026. Antes de activarlo, ampliar supuestos especiales, completar revisión fiscal y revisar redondeos del modelo 600. Pruebas de tramos, referencia/mercado, participación, condiciones TUJ y fechas incluidas. Total de pruebas del proyecto: 69.

Despliegue comparación verificado en Hostinger: 8 recorridos reales (4 idiomas x 390/1280), sin errores JavaScript ni desbordamiento; importe condicionado 913,60 y base 180,00 en el ejemplo. Auditoría axe realizada localmente. ITP borrador: 4 recorridos locales pasan; catálogo público permanece desactivado. Archivo de despliegue kalkulator_20261017_011500.zip. Rama codex/mision-integral, PR #2.


## Simplificación automática · 17.10.2026
Comparación directa desde paso 5, sin pantalla previa de complemento y sin casilla obligatoria de base. minimum-simulation.mjs separa hipótesis favorables y afinado. Desplegable después de resultados: familia, ingresos propios, otras pensiones y datos progresivos del cónyuge; recalcula sin tocar columna base y preserva el foco del formulario. 74 pruebas y 8 recorridos locales (4 idiomas x 390/1280) pasan; axe sin incidencias. ITP continúa privado/inactivo. Pendiente verificar despliegue de esta revisión.

Despliegue kalkulator_20261017_020000.zip verificado en Hostinger: ocho recorridos publicados (cuatro idiomas, móvil/escritorio), simulación automática y cambios de cónyuge correctos; columna sin complemento estable. Backups previos conservados. GitHub PR #2 actualizado.


## UX y períodos prospectivos · 17.10.2026
Pregunta española en años y meses; Ucrania reciente y solapamientos opcionales. Motor permite carencia específica suficientemente acreditada en España sin inventar períodos ucranianos; menos de dos años con Ucrania desconocida produce revisión. Totales prospectivos y validaciones preservados. Comparación con jerarquía visual, refinamiento antes del gráfico con nodo persistente (no pierde foco), estados alternativos sin importes y cálculo de espera con transición normativa anual. 80 pruebas pasan, 8 recorridos completos (axe local sin incidencias) y 16 recorridos alternativos/convenio. ITP permanece inactivo. Pendiente verificación pública de este despliegue.

Publicación completada mediante hPanel tras timeout del conector. ZIP kalkulator_20261017_023000.zip extraído sobre public_html del sitio autorizado; ZIP movido a papelera, copia local conservada. Verificados 8 recorridos completos publicados (4 idiomas x móvil/escritorio) y 16 alternativos/convenio. Captura outputs/formulario-publicado.png. ITP continúa sin activar. No queda pendiente el despliegue.

