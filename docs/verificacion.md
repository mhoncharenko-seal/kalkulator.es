# Verificación — 16-10-2026

38 pruebas automatizadas aprobadas con Node 20.20.2 (`node --test tests/*.test.mjs`).

- 27 casos del motor: umbrales 15 años, cotización específica, períodos inferiores a un año, solapamiento, nacional/convenio, edades 2026/2027/futuras, importe extranjero superior al mínimo, residencia y rentas, tope comunicado sin complemento inventado, 12/14 pagas, tipo de cambio y entradas inválidas.
- 6 casos de bases: calendario legal 2026–2039, cuentas independientes con bases constantes y no constantes, elección de fórmula antigua/nueva, confirmaciones y series inválidas.
- 4 casos de idiomas: 146 claves por idioma, llamadas traducibles resueltas y orden visual solicitado.
- 1 prueba integrada de builds preview/producción: cuatro rutas, texto prerenderizado, campos, imports y assets presentes, FAQ, canonical, hreflang, robots, sitemap y borradores sembrados excluidos.

Revisión estática de controles etiquetados, foco visible, skip link, navegación con elementos HTML nativos, tamaños móviles y preferencia de movimiento reducido. Revisión de sintaxis app.mjs superada.

NO realizada prueba real de móvil, teclado, interacción de idiomas ni consola del navegador: `cua.getState` devolvió inventario vacío; abrir IAB falló porque no está disponible. El servidor preparado no pudo iniciarse: `listen EPERM 127.0.0.1:4173`. No se sustituyen estas comprobaciones con la lectura de CSS o pruebas del motor.

NO publicado en Hostinger. Hay paquete de producción y backup local. El conector sí está operativo, pero Kalkulator.es no figura en los sitios ni los dominios asociados de esta cuenta; no se ha identificado el alojamiento que habría que copiar y actualizar. Ver despliegue.md.
