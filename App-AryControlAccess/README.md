# ARYControlAccess

**ARYControlAccess** es una aplicación de gestión de acceso y control de empleados, que incluye funcionalidades de
autenticación, visualización de perfiles, y administración de expedientes. Está construida con **React Native**
utilizando **Expo** y **TypeScript**.

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Pantalla de inicio con acceso a diversas funcionalidades.
- CRUD de empleados (por agregar).
- Consulta de expedientes (por agregar).

## Tecnologías utilizadas

- **React Native**: Framework para desarrollar aplicaciones móviles.
- **Expo**: Herramienta para facilitar el desarrollo y construcción de apps en React Native.
- **TypeScript**: Lenguaje de programación para mejorar la robustez del código.
- **React Navigation**: Biblioteca para la navegación en la app.
- **Axios/Fetch**: Para realizar solicitudes HTTP a la API.
- **Context API**: Para la gestión del estado global (autenticación, etc.).

## Instalación

Para instalar y ejecutar este proyecto localmente, sigue estos pasos:

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/

## Dependencias necesarias para el correcto desarrollo
   ```bash
  npm install @react-navigation/native react-native-gesture-handler react-native-reanimated react-native-screens
  npm install @react-navigation/stack 
  npm install @react-native-picker/picker
  npm install @react-navigation/drawer
  npm install react-native-screens 
  npm install react-native-safe-area-context
  npm install react-native-gesture-handler 
  npm install react-native-reanimated
  npm install @react-navigation/drawer
  npm install react-native-gesture-handler
  npm install @react-native-async-storage/async-storage
  npm install react-native-dotenv --save
  


   ```

## Estructura del Proyecto

ARY-AccessManager/
│── src/
│   ├── api/               # Llamadas a la API
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── documents.ts
│   ├── components/        # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   ├── context/           # Contexto global (Auth, permisos)
│   │   ├── AuthContext.tsx
│   ├── navigation/        # Configuración de navegación
│   │   ├── AuthStack.tsx
│   │   ├── AppNavigator.tsx
│   │   ├── AdminNavigator.tsx
│   │   ├── EmployeeNavigator.tsx
│   │   ├── GuestNavigator.tsx
│   ├── screens/           # Pantallas del proyecto
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── EmployeeDashboard.tsx
│   │   │   ├── GuestDashboard.tsx
│   │   ├── Users/
│   │   │   ├── UsersListScreen.tsx
│   │   │   ├── UserFormScreen.tsx
│   │   │   ├── UserEditScreen.tsx
│   │   ├── Documents/
│   │   │   ├── DocumentsList.tsx
│   │   │   ├── DocumentForm.tsx
│   │   │   ├── DocumentEdit.tsx
│   │   │   ├── DocumentDelete.tsx
│   ├── styles/            # Estilos globales
│   │   ├── theme.ts
│   ├── utils/             # Utilidades y helpers
│   │   ├── storage.ts
│── App.tsx                # Punto de entrada
│── babel.config.js         # Configuración de Babel
│── tsconfig.json           # Configuración de TypeScript
│── package.json            # Dependencias y scripts
│── .env                    # Variables de entorno

