# Kalkulator.es

- NUNCA utilizar banderas: ni emojis, imágenes, SVG ni iconos. Idiomas exclusivamente Es · Ukr · En · Rus; Orden permanente: español, ucraniano, inglés, ruso. Ucraniano y ruso nunca adyacentes en selectores. Código BCP47 ucraniano `uk`.
- Conservar identidad visual: fondo crema, verde oscuro, acento terracota, Arial/Helvetica, tarjetas y controles grandes.
- Producción es estática; sin bases de datos ni servidor Node. Node >=20 solo para construir/probar.
- `catalog.mjs` registra módulos. Cada módulo activo declara ruta, plantilla y módulo de contenido; el build genera páginas por idioma, SEO y sitemap. Inactivos no generan rutas.
- Motor puro `engine.mjs`; parámetros/fuentes `normative.mjs`; adaptador simplificado `scenario.mjs`; presentación `pension-result.mjs`; textos de resultados `result-i18n.mjs`. No mezclar cálculo con DOM.
- No convertir desconocido en cero. Normalizar cantidades a anual antes de sumar; presentación comparable anual/12 y pago español anual/14 explícito.
- El escenario básico puede simular un complemento bajo hipótesis favorables visibles (sin cónyuge, residencia, cero otros ingresos/pensiones), según instrucción del usuario. No equivale a requisitos acreditados. Al afinar, los datos introducidos sustituyen hipótesis: cónyuge a cargo requiere convivencia, ausencia de pensiones incompatibles e ingresos conjuntos verificados; campos vacíos son desconocidos.
- Verificar fuentes oficiales al cambiar una regla; documentar alcance/fecha. No asumir que 15 años totalizados bastan para una cuantía.
- No enviar entradas del usuario a analítica ni guardar datos económicos. No secretos en Git o distribución.
- Ejecutar `npm test`, `npm run build`; probar recorrido, navegación de idiomas, móvil y teclado antes de publicar. No declarar Lighthouse/WCAG sin mediciones.
- Antes de desplegar: inspeccionar destino, guardar respaldo, comprobar build y versión remota. Solo sitio pink-eagle-584038.hostingersite.com cuenta u531355009 autorizado; DNS definitivo requiere autorización específica.
- Actualizar HANDOFF_CODEX.md con rama, pruebas y estado real. No publicar documentación operativa interna.
- Pregunta reciente española en años y meses exactos; Ucrania reciente desconocida no es cero ni denegación. Descontar solapamientos indicados. El refinamiento se sitúa antes del gráfico y los estados sin acceso no muestran importes normales.
