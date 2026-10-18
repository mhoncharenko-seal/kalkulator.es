# SEO y lanzamiento — 16-10-2026

Las páginas activas se generan en cuatro idiomas con HTML editorial, título/descripción, canonical, hreflang, Open Graph, Twitter y WebApplication/BreadcrumbList. Portadas CollectionPage. El catálogo alimenta rutas y sitemap; herramientas futuras no tienen páginas vacías.

Investigación cualitativa de resultados de búsqueda: «calculadora pensión España Ucrania convenio jubilación 15 años» devuelve documentación oficial del convenio y requisitos, oportunidad para explicación práctica multilingüe. «calculadora donaciones Cataluña», «ITP Cataluña» y «sucesiones Cataluña» muestran calculadoras competidoras y guías oficiales. No disponemos de volúmenes, dificultad ni datos Search Console: no afirmar demanda cuantificada ni posiciones garantizadas.

Prioridades editoriales por intención (hipótesis para validar con Search Console):
- Pensión España–Ucrania: totalizar años, caso 13+2, edad, complemento condicionado.
- Donaciones Cataluña: dinero de padres a hijos, parentesco, escritura y vivienda; contrastar [ATC](https://atc.gencat.cat/es/tributs/isd/donacions/).
- ITP Cataluña: vivienda usada, base imponible/valor de referencia y tipos reducidos; [ATC](https://atc.gencat.cat/es/tributs/itpajd/tpo/base-imposable/index.html).
- Sucesiones: parentesco, patrimonio y comunidad aplicable; existe [calculadora oficial catalana](https://ecofin.gencat.cat/calculadoraimpostsuccessions/).
- Salario neto: bruto anual frente a mensual, 12/14 pagas, situación personal. Hipotecas: cuota, plazo, TIN/TAE, coste total. Jubilación España: edad, años y base reguladora. Investigar normativa y resultados específicos al activar cada módulo.

El dominio temporal permanece noindex y con robots bloqueado. Su canonical apunta al propio host temporal. No se ha cambiado DNS de kalkulator.es ni se presume que esté conectado.

Para activar dominio definitivo: verificar titularidad y servicios DNS afectados; obtener autorización DNS; conectar dominio y TLS; compilar `node scripts/build.mjs --production`; comprobar ocho URLs y sitemap; establecer redirecciones 301 del temporal al definitivo, y después verificar propiedad en Google Search Console y enviar sitemap. La verificación requiere cuenta/token del propietario; no se ha inventado ni enviado ninguno.

Privacidad: no se carga analítica, cookies ni servicios externos. Una futura analítica debe ser sin cookies, registrar solo ruta/eventos genéricos y nunca valores, parámetros de URL, resultados o datos económicos. La CSP actual bloquea conexiones externas; cambiarla solo tras elegir y autorizar proveedor. Search Console permite medir búsqueda sin instrumentar entradas del formulario.
