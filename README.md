# Kalkulator.es

Calculadora orientativa de jubilación entre España y Ucrania. Web estática en español, ucraniano, inglés y ruso, sin dependencias externas. Los datos se procesan en el navegador: no hay cuentas, analítica ni envío del historial.

Versión desplegada: https://pink-eagle-584038.hostingersite.com/es/.

## Usar el proyecto en otro ordenador

Instala Node.js 20 o posterior y Git. Si utilizas nvm, `nvm install` selecciona la versión indicada en `.nvmrc`.

```sh
git clone https://github.com/mhoncharenko-seal/kalkulator.es.git
cd kalkulator.es
npm run build
npm start
```

Abre http://localhost:4173/es/. También están disponibles `/uk/`, `/en/` y `/ru/`. Para detener el servidor, pulsa Ctrl+C. No hay paquetes externos que instalar.

Si el repositorio es privado, inicia sesión en GitHub con una cuenta con acceso. También puedes descargar el código desde **Code → Download ZIP**, extraerlo y ejecutar los dos comandos npm dentro de la carpeta extraída.

## Guardar y recuperar cambios

Antes de trabajar en otro ordenador, descarga los últimos cambios:

```sh
git pull --ff-only
```

Después de editar y comprobar el proyecto:

```sh
npm test
npm run build
git add .
git commit -m "Describe los cambios"
git push
```

Guarda o confirma tus cambios locales antes de cambiar de ordenador. El repositorio conserva el código fuente; `dist/`, los ZIP y las copias de seguridad locales se excluyen con `.gitignore`.

## Menú de calculadoras

La portada de cada idioma (`/es/`, `/uk/`, `/en/`, `/ru/`) muestra el menú. Pensiones está activa en `/{idioma}/pensiones/`. Donaciones Cataluña, ITP Cataluña, Sucesiones, Salario neto, Hipotecas y Jubilación España aparecen desactivadas en gris. El registro declarativo está en catalog.mjs. La portada funciona sin JavaScript.

## Recorrido actual

1. Años completos cotizados en España, sin meses.
2. Años aproximados cotizados en Ucrania, sin meses.
3. Edad actual, jubilación prevista y cotizaciones recientes en cada país.
4. Base de cotización mensual con explicación de dónde encontrarla en la nómina.
5. Pensión ucraniana mensual prevista, en euros.
6. Residencia, familia y otros ingresos anuales, con ejemplos.
7. Total mensual orientativo en grande; después, reparto por país y explicación del cálculo.

Los datos se conservan al cambiar de idioma. Se puede imprimir o descargar el resultado.

## Cálculo y límites

El recorrido simplificado utiliza una base mensual constante y la referencia `base de cotización × 12 / 14` para ambos escenarios españoles. Es un supuesto orientativo, no la determinación oficial de la base reguladora ni la aplicación completa del artículo 12 del convenio. Se supone que no hay cotizaciones simultáneas y se usa como ventana reciente el período de 15 años anterior a la jubilación prevista. Estos supuestos se explican en la interfaz.

La edad se introduce en años cumplidos; cuando la fecha exacta de nacimiento puede cambiar el acceso, se solicita revisar la edad en vez de inventar una fecha. La pensión ucraniana se introduce por el usuario y se anualiza en 12 meses. La parte española se expresa en 14 pagas y el total se compara como promedio de 12 meses. Los complementos son escenarios condicionados a la residencia, ingresos, familia y reglas aplicables; no son una concesión del INSS. No se calculan impuestos ni pensiones ucranianas.

Detalles: [pasos simplificados](docs/pasos-simplificados.md), [motor](docs/motor.md) y [normativa](docs/normativa.md). Algunos documentos conservan el historial de versiones y despliegues anteriores.

## Archivos principales

- `index.html`, `app.mjs`, `style.css`: interfaz y recorrido.
- `i18n.mjs`: textos en los cuatro idiomas.
- `scenario.mjs`: adaptación de las entradas simplificadas y sus supuestos.
- `engine.mjs`, `normative.mjs`: motor y parámetros.
- `base-regulator.mjs`: cálculo detallado nacional independiente, conservado y probado; el recorrido simplificado no lo solicita.
- `scripts/`: compilación y servidor local.
- `tests/`: pruebas del motor, escenarios, idiomas y compilación.
- `content/posts/`: borradores excluidos del sitio publicado.

## Verificar y desplegar

```sh
npm test
npm run build
```

La compilación crea `dist/` con el contenido público completo. Por defecto, se genera una versión de prueba con `noindex`, apropiada para el dominio temporal de Hostinger. Solo cuando `kalkulator.es` esté conectado y listo para indexarse:

```sh
npm run build -- --production
```

Para Hostinger, comprime **el contenido de `dist/`**, incluidos los archivos `.htaccess`, con `index.html` directamente en la raíz del ZIP. Sube ese paquete a `public_html` y despliega o extrae su contenido. Las actualizaciones en GitHub no se despliegan automáticamente en Hostinger.

Consulta HANDOFF_CODEX.md para pruebas y estado real del despliegue. Los complementos positivos se muestran Por verificar; no se suman al total. La pensión ucraniana desconocida se deja vacía.
