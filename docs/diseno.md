# Diseño, accesibilidad e idiomas

## Identidad

Kalkulator.es debe encabezar el producto. Una identidad tipográfica firme, fondo marfil, texto azul muy oscuro y un acento turquesa sobrio permiten distinguirlo sin fotografías ni adornos. Usar SVG original para explicar la parte española y la cantidad ucraniana, acompañado siempre por texto y cifras equivalentes. No comunicar derecho o incertidumbre únicamente mediante colores.

## Recorrido

Primero, cotizaciones y edad. Pedir información económica únicamente después. Etiquetas persistentes sobre los campos, ejemplos breves y un resultado grande con una frase que distinga cotización suficiente de acceso actual. La fecha de referencia de la carencia específica puede necesitar verificación; no resolverla mediante una hipótesis silenciosa. La base reguladora conocida permite un escenario económico limitado: no llamarlo cálculo detallado de bases.

Los resultados deben separar cantidades introducidas, calculadas y pendientes de comprobación. Expresar el total anual antes de comparar mensualidades. Las 14 pagas españolas y las 12 mensualidades equivalentes deben llevar etiquetas distintas. La parte ucraniana es un dato facilitado, no una pensión calculada por la plataforma.

## Accesibilidad

- Texto base recomendado: 18 px; interlineado de al menos 1,5. No reducir el texto de ayuda por debajo de 16 px.
- Objetivos táctiles de al menos 44 × 44 px y campos altos. Una acción principal por etapa.
- Enlace para saltar al contenido; regiones header, nav, main y footer; un único h1.
- Todos los campos requieren label conectado por for/id. Los grupos de años/meses necesitan fieldset y legend o una asociación equivalente.
- Ayudas y errores asociados con aria-describedby; aria-invalid únicamente tras validar. Un resumen de errores debe permitir ir al campo.
- Resultados anunciados mediante una región aria-live=polite y foco programático en el encabezado del resultado tras el envío.
- Mantener el orden visual y de tabulación. Mostrar un indicador de foco de alto contraste. No usar valores positivos de tabindex.
- Contraste de al menos 4,5:1 para texto normal y 3:1 en controles e indicadores. Comprobar contraste de texto secundario y estados desactivados.
- Respetar prefers-reduced-motion. No usar animaciones necesarias para entender el cálculo.
- A 320 px y con zoom del 200 %, evitar desplazamiento horizontal y columnas comprimidas. Los botones deben poder envolver su texto.
- Los gráficos deben tener una explicación textual, y los iconos decorativos aria-hidden=true.

## Idiomas

Orden fijo: Español · Українська · English · Русский. Para evitar que ucraniano y ruso queden visualmente contiguos al envolver, usar un selector de cuatro filas en móvil o una lista horizontal sin saltos por opción en pantalla ancha. No usar cuadrícula de dos columnas: podría poner ucraniano y ruso juntos en vertical. Sin banderas.

El documento debe actualizar lang, título, descripción, canonical y hreflang. Mantener el estado del formulario al cambiar de idioma y formar números y fechas con Intl y la configuración regional correspondiente. No usar una cadena española como fallback visible: una clave ausente es un fallo de integridad que debe resolverse antes de publicar.

Los diccionarios de i18n.mjs mantienen claves comunes. El ucraniano y el ruso usan terminología clara sin dar a entender que una categoría española tiene un equivalente jurídico idéntico. «Base reguladora» se explica como la base específica utilizada para calcular la pensión, no como el salario medio.

## Verificación propuesta

Completar el recorrido con teclado, cambiar de idioma con datos introducidos, probar las cuatro rutas por idioma, revisar a 320/375/768 px y 200 % de zoom, comprobar foco tras errores y resultado, y verificar que el lector de pantalla recibe etiquetas y mensajes completos. Revisar que los borradores del blog no aparecen en navegación, sitemap ni resultados públicos.
