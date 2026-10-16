# Actualización preparada, no desplegada

Destino: lightpink-beaver-719798.hostingersite.com, cuenta u531355009.

Se ha compilado la calculadora nueva en modo preview/noindex. Las 42 pruebas pasan. El CSS nuevo conserva íntegramente el CSS publicado como prefijo y añade los estilos del asistente.

Paquete: kalkulator_20261016_actualizacion.zip, index.html en raíz. Copia del sitio remoto: backups/hostinger-pre-update-20261016/site-backup.zip y remote-files.json. Los archivos de texto se recuperaron por MCP y mark.svg del paquete previo (190 bytes, tamaño coincidente).

El listado remoto confirma que sigue publicada la versión anterior (app.mjs 11623 bytes; style.css 6410 bytes). No se ha desplegado la actualización.

Bloqueo: la subida TUS indicada por Hostinger falla en Node fetch con ENOTFOUND; curl tampoco resuelve el dominio público. No hay navegadores disponibles para una subida alternativa. La herramienta MCP disponible despliega solamente archivos ya subidos al alojamiento. No se llamó al despliegue porque el ZIP no llegó a subirse. No se cambió DNS ni el dominio kalkulator.es.
