# Estado real del despliegue

16 de octubre de 2026: desplegado mediante MCP Hostinger en https://lightpink-beaver-719798.hostingersite.com/es/ por autorización expresa del usuario. hosting_deploy-static-website devolvió upload success y deploy success (Request accepted). Lectura posterior del alojamiento confirma 27 archivos/directorios, las cuatro rutas y el HTML español con formulario, módulos y noindex.

La comprobación pública HTTPS NO está confirmada: curl no resuelve el dominio desde este entorno y la herramienta web informa que la URL no es accesible. No se afirma haber comprobado respuesta HTTP 200, móvil ni consola. No hay navegador conectado.

Antes del despliegue solo existía default.php (página de bienvenida Hostinger, 16417 bytes). Copia recuperable: backups/hostinger-lightpink-2026-10-16/default.php. Para restaurar, sustituir el contenido público por ese archivo mediante el administrador de archivos de hPanel. No se ha comprado nada ni cambiado DNS.

Se publica la compilación preview sin indexación en el dominio temporal; Kalkulator.es conserva su marca y canonical previsto. El dominio kalkulator.es no ha sido conectado. Esta implementación sigue siendo independiente de cualquier versión anterior de Sites. Administración: https://hpanel.hostinger.com.

Archivo desplegado: kalkulator_20261016_130000.zip; contenido estático con index.html en raíz. Código y pruebas en esta carpeta.
