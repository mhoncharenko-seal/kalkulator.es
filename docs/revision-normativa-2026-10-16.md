# Revisión normativa independiente — 16 de octubre de 2026

Revisión de `engine.mjs`, `normative.mjs`, `scenario.mjs`, `app.mjs` y `docs/normativa.md` mediante consulta directa de fuentes oficiales. Es una revisión del modelo del producto, no una resolución individual. Los hallazgos describen el código leído antes de las correcciones de esta sesión.

## Resultado

Los parámetros de edad y porcentaje coinciden con las fuentes consultadas. El punto más débil es la conversión de hipótesis en confirmaciones internas: `scenario.mjs` fija `referenceConfirmed:true` y solapamientos cero; `app.mjs` fija `estimateConfirmed:true`. No equivalen a comprobaciones del historial o del complemento. La documentación que afirmaba que el motor nunca cuantificaba un complemento positivo ya no describía el comportamiento observado.

## Fuentes verificadas

- [Convenio España–Ucrania, BOE, artículos 10–13](https://www.boe.es/buscar/act.php?id=BOE-A-1998-8056): comparación nacional/convenio por cada institución, totalización, prorrata, períodos inferiores a un año y reglas especiales de bases y carencia. El artículo 10.4 remite a la legislación del país residente para mínimos; no elimina requisitos. El 12.2.b revaloriza la pensión obtenida. El 13.2 exige examinar la ventana ligada al reconocimiento en la otra parte.
- [LGSS, artículos 205, 209, 210, DT7, DT9 y DT40](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724): 15 años y carencia específica; escala de porcentajes y transición de bases. En 2026, 50% con 180 meses; siguientes 49 meses a 0,21 puntos y 209 a 0,19. Desde 2027: 248 a 0,19 y 16 a 0,18. Para la fórmula nueva de 2026: mejores 302 bases entre 304, divisor 352,33. Una base mensual aislada multiplicada por 12/14 no reproduce el historial legal.
- [Seguridad Social, requisitos de jubilación](https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/PrestacionesPensionesTrabajadores/10963/28393/28396/28472/6156?changeLanguage=es): 2026, 65 años con 38 años y 3 meses; en otro caso 66 años y 10 meses. Desde 2027, 65 con 38 años y 6 meses; en otro caso 67.
- [RD 241/2026, artículos 3, 9, 10, 18, 21 y anexo I](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-6977): máximo 3.359,60 ×14; mínimos >=65 de 17.592,40, 13.106,80 y 12.441,80 euros/año según familia. Umbrales 11.013/9.442; PNC 8.803,20. Artículo 18: mínimo proporcional, garantía residente, concurrencia y conversión monetaria administrativa. Artículo 9.2 impide convertir toda superación del umbral en exclusión automática.
- [Fondo de Pensiones de Ucrania, pensiones internacionales](https://www.pfu.gov.ua/2168764-mizhnarodni-pensiyi-komu-neobhidno-nadaty-pensijnomu-fondu-ukrayiny-dokument-pro-perebuvannya-v-zhyvyh/): incluye España y describe transferencias trimestrales. La periodicidad de transferencia no debe confundirse con la mensualidad devengada introducida por el usuario. Esta fuente no acredita el importe ni el derecho ucraniano individual.

## Caso 13 años Ucrania + 2 años España, siendo los españoles recientes

Si son 156 + 24 meses acreditados y no superpuestos, suman 180. Los dos años españoles satisfacen la carencia específica si pertenecen a la ventana legal aplicable; ser los últimos trabajados no basta por sí solo. Con edad ordinaria cumplida, cabe derecho español por totalización; no derecho exclusivamente nacional con solo 24 meses.

La pensión teórica española parte del 50% de la base reguladora correctamente determinada. La prorrata ordinaria sería 24/180, por lo que el resultado español es 1/15 de esa base, antes de otras reglas aplicables. La suma internacional exige el importe ucraniano real o una hipótesis identificada. No cabe deducir una pensión mínima garantizada únicamente de los 15 años.

## Hallazgos y criterios de corrección

1. **Prioridad alta: complemento incorporado al total sin confirmación suficiente.** `calculateMinimum` envía `estimateConfirmed:true` tras residencia, ingresos y familia. No recoge fecha/ámbito de reconocimiento, otras pensiones públicas, todos los requisitos de cónyuge a cargo ni verificación del importe extranjero. `assessMinimum` calcula déficit limitado por un tope y `renderMoney` lo suma al total principal. Corregir dejando el complemento pendiente o incorporando una declaración expresa de supuestos y ámbito; una cifra hipotética debe presentarse separada del total sin complemento. No afirmar que una declaración certifica derecho.
2. **Prioridad alta: ventana reciente presupuesta.** `simplifiedPeriods` confirma automáticamente la referencia y ausencia de superposición. Pedir confirmación explícita del supuesto de períodos no simultáneos y ventana aplicable; en desconocimiento devolver revisión. No presentar como denegación definitiva un escenario cuya ventana no está comprobada.
3. **Prioridad media: base estimada.** La transformación `contributionBase*12/14` solo modela una base constante hipotética. Mantener visible esa condición antes de calcular y en el resultado; permitir introducir una base reguladora ya determinada si se ofrece modo avanzado.
4. **Prioridad media: documentación desactualizada.** El último párrafo de auditoría de `docs/normativa.md` decía que el motor no cuantifica complementos positivos, en contradicción con el código revisado. Sincronizar documentación y pruebas con el comportamiento final.

## Límites de la revisión

No se han certificado períodos, nacionalidad/ámbito subjetivo, regímenes especiales, derechos ucranianos, cambio administrativo ni resoluciones. Tampoco se ha auditado exhaustivamente toda posible excepción histórica. Las reglas futuras aprobadas no justifican inventar mínimos, máximos o inflación de años aún no regulados. Los estados del motor y las pruebas de aritmética no sustituyen una comprobación jurídica individual.
