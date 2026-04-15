# Aplicaciones_Web_Proyecto_Final
Repositorio el cual contiene el proyecto final de la materia de Aplicaciones Web

## REQUISITOS
Node.js instalado
XAMPP (Apache y MySQL activos)
phpmyAdmin

## BASE DE DATOS

1. Abrir phpMyAdmin    
3. Importar el archivo "nocturna.sql" incluido en el proyecto

## INSTALACION DE DEPENDENCIAS Y NODE MODULES EN EL BACKEND
Antes de ejecutar el proyecto, se debe ingresar a la direccion de la carpeta del backend desde la terminal (PowerShell o CMD) con el comando "cd /ruta de la carpeta", una vez ahi escribir los siguientes comandos: 
- npm init -y,
- npm install express
- npm install cors
- npm install mysql2
- npm install express-session bcrypt
- npm install --save-dev nodemon 
de esta manera se instalaran todas las dependencias necesarias para el proyecto.

Una vez instaladas todas las dependencias, se debe ingresar al archivo "package.json" de la carpeta del backend y el apartado de "scripts" se coloca lo siguiente:
"start": "node index.js",
"dev": "nodemon server.js",

y se guardan los cambios. Esto permitira que cada vez que se realice un cambio en el back de la aplicación, no se tenga detener el servicio y volverlo a empezar, sino que el servicio se actualizara segun los cambios de manera automatica.

## EJECUCION DE LA APLICACION
Una vez realizado lo anterior, se escribe el comando "npm run dev" en la terminal con la direccion de la carpeta del back para correr el backend del proyecto, es importante asegurarse de tener los servicios de apache y mysql corriendo en el servidor de XAMPP, de lo contrario el servicio no funcionara.

Una vez hecho esto, se abre el archivo de login.html en el navegador o con Live Server y la aplicacion comenzara con su funcionamiento.
