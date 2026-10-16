# Motor de escenarios

Consultado el 16-10-2026. Fuentes exclusivas: [LGSS consolidada](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724), artículos 205, 209, 210 y disposiciones transitorias 7, 9 y 40; [Convenio España Ucrania](https://www.boe.es/buscar/act.php?id=BOE-A-1998-8056), artículos 10–13, 23. No calcula pensiones ucranianas.

`evaluateEligibility` trabaja con meses completos declarados y descontando superposición. No sustituye la certificación por días del INSS. Art. 205 exige 15 años y dos dentro de los 15 de referencia. Esa referencia puede cambiar en alta asimilada sin obligación de cotizar; art. 13 del convenio permite examinar la referencia al reconocimiento en la otra parte. Por eso `referenceConfirmed` debe ser explícito y no se presume por defecto. Las cotizaciones recientes de ambos países se consideran en una ventana válida confirmada; si falta la ventana el resultado exige comprobación, nunca una negativa automática.

Edad ordinaria: 2026, 65 con 38 años y 3 meses, o 66 y 10 meses. Desde 2027, 65 con 38 años y 6 meses, o 67. Se usa el año de jubilación elegido. No se proyectan futuras cotizaciones automáticamente. La cotización potencial y el cumplimiento de edad son resultados separados.

Porcentaje: en 2026, 50% a los 180 meses, primeros 49 meses adicionales al 0,21%, siguientes al 0,19%; desde 2027 primeros 248 adicionales al 0,19% y restantes al 0,18%, máximo 100%. Art. 10.2.c limita períodos extranjeros necesarios para pensión completa: 438 meses 2026 y 444 desde 2027. Art. 10.3 compara ambas pensiones españolas y selecciona la superior cuando existen bases comparables. La nacional y la convencional requieren bases reguladoras distintas si corresponde.

La base reguladora NO se deduce de una media salarial. Debe introducirse una base ya calculada bajo la legislación de su año/régimen. Desde 2026 coexisten alternativas transitorias del art. 209 y DT40; integración de lagunas, actualización y aplicación del art. 12 del convenio requieren historia mensual y datos oficiales. Esta versión ofrece escenario condicionado con base aportada; el cálculo mensual nacional limitado se documenta a continuación y no promete equivalencia a una resolución. Art.12 puede exigir cotizaciones españolas anteriores a la última española y posteriores revalorizaciones. No aplica tipos de revalorización futuros inventados ni máximo anual futuro desconocido: importes sin comprobación de topes.

Art.11: menos de un año en España no produce una prorrata española automática; se deriva a comprobación. Menos de un año ucraniano, sin derecho propio allí, puede ser absorbido por España sin prorrata (art.11.1); debe comprobarse previamente que no existe prestación ucraniana por ese período. Superposiciones históricas previas a 27-03-1998 requieren revisión del art.23.2; el escenario normal descuenta coincidencias.

El complemento a mínimos no se reconoce como derecho automático. `assessMinimum` puede detectar exclusión por residencia o una exclusión por rentas ya confirmada y ausencia de déficit; para cuantía positiva puede ofrecer un escenario condicionado con todos los datos y `estimateConfirmed`; sin esos datos devuelve revisión institucional. Superar el límite general de rentas devuelve revisión de la regla diferencial del art.9.2 RD241/2026, nunca exclusión automática. Se necesitan norma anual, situación familiar, rentas, reconocimiento, pensiones extranjeras y aplicación de mínimos internacionales/prorrata. La regla del art.10.4 se aplica de acuerdo con la legislación española; no elimina condiciones ni topes.

Importes brutos: base española y pensión española mensual en 14 pagas; Ucrania con pagas introducidas. Totales anuales antes de ofrecer equivalente mensual 12. Tipo de cambio suministrado por usuario en euros por unidad de moneda; el motor no obtiene cotizaciones. La UI debe registrar fecha y fuente del cambio. No se declara un mejor resultado internacional usando una única pensión ucraniana.

## Verificación

Los parámetros están separados en `normative.mjs`. En 2026 si la cuantía nacional o teórica supera 3.359,60 euros en 14 pagas se bloquea el resultado principal (`maximum-review`): no se aplica sin más el tope nacional a la prorrata internacional. Años posteriores devuelven `beforeMaximumCap=true`: escenario previo al máximo anual futuro, todavía no aprobado. La UI debe mostrarlo. Las coincidencias precisan `overlapAllocationConfirmed` para calcular resultado económico; en ausencia de confirmación se ofrece solo comprobación de carencia. Los períodos inferiores a un año ucraniano también bloquean declarar una mejor pensión hasta confirmar su tratamiento.

No se rechaza automáticamente empleo previo a los 16 años: existen antecedentes históricos y períodos asimilados que requieren certificación. Sí se rechazan duraciones de seguro superiores a toda la vida de la persona. El reparto real de coincidencias requiere historia certificada.

`node --test tests/engine.test.mjs`. Casos de 15 años, carencia específica, menos de un año, coincidencias, nacional/convenio, edades 2026/2027+, porcentajes comprobados aritméticamente, límite de totalización, 12/14 pagas, mínimos sin automatismos y datos inválidos.

La validación exige una unión reciente de como máximo 180 meses y coherencia entre coincidencias recientes y el historial completo. El resultado de requisitos conserva el reparto España/Ucrania y no puede reutilizarse para calcular otro reparto con igual total. La normalización rechaza divisas inválidas y desbordamientos numéricos.

## Base nacional mensual: módulo `base-regulator.mjs`

Consulta: 16-10-2026. [LGSS, art.209, DT40 y DT4.7](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724). Ámbito 2026–2039, Régimen General, sin lagunas ni reglas especiales. Se compara la fórmula anterior 300/350 con la selección gradual; vence la mayor. Desde 2037: 324 mejores bases entre 348, divisor 378. Los divisores transitorios literales están en el módulo. No se extiende a 2040 por el límite temporal literal de DT4.7.

API: `baseRules(year)` informa longitud; `calculateNationalBase({year,bases,adjustedConfirmed,noGapsConfirmed,generalRegimeConfirmed})`. Las tres confirmaciones son obligatorias. `bases` contiene todos los meses consecutivos, de antiguo a reciente; termina DOS meses naturales antes del mes de jubilación (noviembre si jubilación en enero). Últimos 24 nominales, anteriores ya actualizados por IPC según art.209; nunca salarios medios. La entrada debe tener cotizaciones admisibles, topes reconciliados y sin supuestos especiales. El módulo no obtiene IPC ni rellena lagunas. No usar bases nominales antiguas sin actualizar.

Devuelve `nationalBase`, alternativas `oldBase/newBase`, regla y método elegido; `treatyBase=null`: la base convencional del art.12 requiere cálculo separado validado. Pruebas independientes comprueban ambas alternativas, descarte de mínimos, longitud, límites temporales e inmutabilidad.

## Ejemplos aritméticos independientes

Para jubilación en 2027, con 180 meses españoles y 120 ucranianos sin coincidencias: el porcentaje teórico es 50 + 120 × 0,19 = 72,8 %. Con base nacional de 1.000 euros y base convencional de 2.000 euros, la nacional es 500 y la convencional 2.000 × 0,728 × 180/300 = 873,60 euros por paga. Con las bases invertidas, gana la nacional. Estas cifras son escenarios con bases ya determinadas conforme a su regla; no representan salarios ni un cálculo ucraniano.

Para 240 meses españoles y 6 ucranianos sin derecho propio allí, si se confirma la excepción del artículo 11, el porcentaje de 246 meses es 50 + 66 × 0,19 = 62,54 %. Con base convencional 1.000, el resultado es 625,40 sin prorrata. Sin esa confirmación no se declara un resultado español ganador.

El módulo valida también importes negativos o no finitos en el análisis de mínimos: devuelve datos inválidos y nunca una exclusión o un complemento basados en ellos. Las llamadas vacías devuelven estados explícitos sin lanzar excepciones.

## Asistente y complemento orientativo (16-10-2026)

El recorrido tiene siete pantallas: España (años y meses), Ucrania (años y meses), fechas y carencia específica, bases reguladoras, pensión ucraniana, residencia y familia, resultado. Mantiene fechas exactas y cotizaciones recientes en vez de sustituirlas por una sola selección de edad. Menos de 65 años no habilita una jubilación ordinaria anticipada; esa modalidad queda fuera del motor.

`minimumMonthly2026` selecciona las seis tarifas oficiales según edad en meses y familia. Fuente: https://www.seg-social.es/wps/portal/wss/internet/Pensionistas/Revalorizacion/30434?changeLanguage=es . No se proyectan las tarifas de 2026 a años posteriores.

`assessMinimum` ofrece ahora una estimación positiva solo con `estimateConfirmed`, residencia declarada en España, pensión española positiva y todos los datos económicos. Calcula el déficit ANUAL entre el mínimo en 14 pagas y ambas pensiones anualizadas y aplica el límite anual del complemento. No es reconocimiento de derecho. Rentas que exceden el umbral general, datos ausentes y situaciones fuera de ámbito conservan revisión individual. La situación de cónyuge a cargo se declara, no se certifica automáticamente. La concesión y las reglas internacionales quedan sujetas a comprobación del INSS.

El resultado muestra complemento por paga española (14), total anual y promedio bruto en 12 meses. No promete un neto ni suma directamente mensualidades de países con diferente número de pagas. Se conserva el porcentaje legal por meses; la aproximación del 2,5 % anual no corresponde a la escala de 2026.
