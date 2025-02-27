# ARYControlAccess

## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js]
- [npm]
- [Base de datos SQL (MySQL)]

## Instalación de las Dependencias

Para iniciar el proyecto y asegurarte de que todas las dependencias necesarias estén instaladas, sigue estos pasos:

* npm install
* npm init -y
* npm install bcryptjs jsonwebtoken -- Para la encriptación de contraseñas y jsonwebtoken
* npm install express  -Manejo de Rutas: Te permite definir diferentes rutas para manejar diversas solicitudes HTTP como GET, POST, PUT, DELETE,
* npm install mysql


## Estructura del proyecto

/aryaccesscontrol
/services
│
├── /node_modules          # Módulos de dependencias (generado por npm)
├── /db                    # Conexión con la base de datos
│   └── connection.js      # Archivo con la conexión a la base de datos
├── /routes                # Rutas de la API
│   ├── auth.js            # Rutas de autenticación (Login, Registro)
│   ├── registros.js       # Rutas de manejo de registros
│   └── index.js           # Rutas principales, incluir todas las rutas
├── /controllers           # Lógica de negocio para cada ruta
│   ├── authController.js  # Lógica de autenticación
│   ├── registrosController.js
├── /middlewares           # Middlewares personalizados
│   ├── authMiddleware.js  # Verificación de token de autenticación
├── /models                # Modelos de datos (si lo necesitas)
│   ├── usuario.js         # Modelo para usuarios
├── app.js                 # Archivo principal que inicia el servidor
├── package.json           # Dependencias del proyecto
├── .env                   # Variables de entorno (clave de JWT, base de datos, etc.)
└── README.md              # Documentación básica del proyecto

## Prueba de la Api
* http://localhost:3001/api/auth
