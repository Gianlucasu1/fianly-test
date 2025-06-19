# Product Catalog - Angular Application

[![Angular](https://img.shields.io/badge/Angular-20.0.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.10-38B2AC.svg)](https://tailwindcss.com/)
[![JSON Server](https://img.shields.io/badge/JSON%20Server-1.0.0--beta.3-yellow.svg)](https://github.com/typicode/json-server)

## 📋 Descripción del Proyecto

Aplicación web desarrollada en Angular que implementa un sistema completo de autenticación y catálogo de productos. La aplicación incluye registro de usuarios, inicio de sesión, dashboard con listado de productos, filtros avanzados, paginación y vista detallada de productos.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con validación completa de formularios
- **Inicio de sesión** con verificación de credenciales
- **Protección de rutas** mediante guards de Angular
- **Gestión de sesión** con localStorage
- **Logout** con limpieza completa de datos

### 🛍️ Catálogo de Productos
- **Listado de productos** con diseño responsivo
- **Búsqueda en tiempo real** por nombre y categoría
- **Filtros y ordenamiento** por precio y nombre
- **Paginación** para mejor rendimiento
- **Vista detallada** de cada producto
- **Navegación intuitiva** entre secciones

### 🎨 Diseño y UX
- **Interfaz moderna** con Tailwind CSS
- **Diseño responsivo** para todos los dispositivos
- **Componentes reutilizables** siguiendo buenas prácticas de Angular
- **Feedback visual** en tiempo real
- **Estados de carga** y manejo de errores

## 🚀 Pasos para Correr el Proyecto Localmente

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** (versión 9 o superior)
- **Angular CLI** (se instalará automáticamente)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd fianly-test
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de API (JSON Server)**
   ```bash
   npm run api
   ```
   > 🌐 La API estará disponible en: `http://localhost:3000`

4. **Iniciar la aplicación Angular** (en otra terminal)
   ```bash
   npm start
   ```
   > 🌐 La aplicación estará disponible en: `http://localhost:4200`

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo de Angular |
| `npm run api` | Inicia JSON Server para la API mock |
| `npm run build` | Construye la aplicación para producción |
| `npm run watch` | Construye en modo watch para desarrollo |
| `npm test` | Ejecuta las pruebas unitarias |

## 📚 Librerías y Dependencias Utilizadas

### Dependencias Principales

#### **Angular 20.0.0**
- **Propósito**: Framework principal para el desarrollo de la aplicación
- **Por qué**: Versión más reciente con mejoras en rendimiento, standalone components y nuevas características
- **Módulos utilizados**:
  - `@angular/core`: Funcionalidades core del framework
  - `@angular/common`: Directivas y pipes comunes
  - `@angular/forms`: Reactive Forms para manejo de formularios
  - `@angular/router`: Sistema de enrutamiento y navegación
  - `@angular/platform-browser`: Soporte para ejecución en navegadores

#### **Tailwind CSS 4.1.10**
- **Propósito**: Framework de CSS para diseño y estilos
- **Por qué**: 
  - Desarrollo rápido con clases utilitarias
  - Diseño responsivo integrado
  - Consistencia en el diseño
  - Fácil personalización y mantenimiento
  - Optimización automática del CSS final

#### **RxJS 7.8.0**
- **Propósito**: Programación reactiva y manejo de streams de datos
- **Por qué**:
  - Manejo elegante de operaciones asíncronas
  - Composición de operadores para transformación de datos
  - Integración nativa con Angular
  - Gestión eficiente de subscripciones

#### **TypeScript 5.8.2**
- **Propósito**: Superset de JavaScript con tipado estático
- **Por qué**:
  - Detección temprana de errores
  - Mejor experiencia de desarrollo con IntelliSense
  - Refactoring seguro
  - Integración perfecta con Angular

### Dependencias de Desarrollo

#### **JSON Server 1.0.0-beta.3**
- **Propósito**: API REST mock para desarrollo
- **Por qué**:
  - Prototipado rápido de APIs
  - Desarrollo frontend independiente del backend
  - Datos persistentes durante el desarrollo
  - Fácil configuración y uso

#### **Angular CLI y Build Tools**
- **Angular CLI**: Herramientas de línea de comandos para Angular
- **Angular Build**: Sistema de construcción optimizado
- **PostCSS**: Procesamiento de CSS para Tailwind

#### **Testing Framework**
- **Jasmine**: Framework de testing para JavaScript
- **Karma**: Test runner para pruebas unitarias
- **Coverage**: Herramientas para análisis de cobertura de código

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios
```
src/
├── app/
│   ├── components/           # Componentes reutilizables
│   │   ├── navbar/          # Barra de navegación
│   │   ├── product-card/    # Tarjeta de producto
│   │   └── product-details/ # Vista detallada de producto
│   ├── dashboard/           # Página principal del dashboard
│   ├── guards/              # Guards de autenticación y navegación
│   │   ├── auth.guard.ts    # Protección de rutas autenticadas
│   │   └── redirect.guard.ts # Redirección inteligente
│   ├── login/               # Componente de inicio de sesión
│   ├── models/              # Interfaces y tipos TypeScript
│   │   ├── product.interface.ts
│   │   └── user.interface.ts
│   ├── registration/        # Componente de registro
│   ├── services/            # Servicios de datos
│   │   ├── product.service.ts
│   │   ├── user.service.ts
│   │   └── countries.service.ts
│   ├── validators/          # Validadores personalizados
│   └── app.routes.ts        # Configuración de rutas
├── styles.css               # Estilos globales con Tailwind
└── main.ts                  # Punto de entrada de la aplicación
```

### Patrones y Buenas Prácticas Implementadas

#### **Standalone Components**
- Todos los componentes utilizan el patrón standalone de Angular 20
- Imports explícitos para mejor tree-shaking
- Componentes más modulares y reutilizables

#### **Reactive Forms**
- Validación robusta en tiempo real
- Validadores personalizados para reglas específicas
- Feedback visual inmediato al usuario

#### **Route Guards**
- `AuthGuard`: Protege rutas que requieren autenticación
- `RedirectGuard`: Redirección inteligente basada en estado de autenticación

#### **Services con RxJS**
- Patrón de servicio para manejo de datos
- Observables para operaciones asíncronas
- Manejo centralizado del estado

#### **Type Safety**
- Interfaces TypeScript para todos los modelos de datos
- Tipado estricto en toda la aplicación
- Reducción de errores en tiempo de ejecución

## 🎯 Funcionalidades Implementadas

### ✅ Autenticación Completa
- [x] Registro de usuarios con validación avanzada
- [x] Validación de email duplicado
- [x] Validación de contraseña con indicador de fortaleza
- [x] Inicio de sesión con verificación de credenciales
- [x] Persistencia de sesión con localStorage
- [x] Logout con limpieza de datos

### ✅ Gestión de Productos
- [x] Listado de productos con imágenes, nombres, precios y categorías
- [x] Búsqueda en tiempo real por nombre y categoría
- [x] Ordenamiento por precio y nombre (ascendente/descendente)
- [x] Paginación eficiente (6 productos por página)
- [x] Vista detallada de productos individuales
- [x] Navegación fluida entre vistas

### ✅ Experiencia de Usuario
- [x] Diseño responsivo para móviles, tablets y desktop
- [x] Estados de carga y feedback visual
- [x] Manejo de errores y estados vacíos
- [x] Navegación intuitiva con breadcrumbs
- [x] Interfaz moderna y atractiva

## 📱 Capturas de Pantalla

### Página de Registro
*Vista del formulario de registro con validaciones en tiempo real*

### Página de Login
*Interfaz de inicio de sesión con validación de credenciales*

### Dashboard - Catálogo de Productos
*Vista principal con filtros, búsqueda y paginación*

### Vista Detallada de Producto
*Página individual de producto con información completa*

### Diseño Responsivo
*Adaptación automática a diferentes tamaños de pantalla*

## 🌐 Instrucciones para Demo Desplegada

### Opción 1: Netlify (Frontend) + Railway/Render (API)

#### Frontend en Netlify:
1. **Build Settings**:
   ```bash
   Build command: npm run build
   Publish directory: dist/fianly-test
   ```

2. **Environment Variables**: No requeridas para el frontend

#### API en Railway/Render:
1. **Configurar package.json** para producción (ya incluido):
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "build": "echo 'No build needed'"
     }
   }
   ```

2. **Variables de entorno**:
   ```
   PORT=3000
   NODE_ENV=production
   ```

### Opción 2: Vercel (Fullstack)
1. Configurar `vercel.json` para API routes
2. Deploy automático desde repositorio Git

### URLs de Demo
- **Frontend**: `https://your-app.netlify.app`
- **API**: `https://your-api.railway.app`

## 🔧 Configuración Adicional

### Variables de Entorno (Desarrollo)
```bash
# No se requieren variables de entorno para desarrollo local
# JSON Server corre en puerto 3000 por defecto
# Angular dev server corre en puerto 4200 por defecto
```

### Configuración de CORS
El proyecto incluye configuración CORS en `server.js` para permitir conexiones desde cualquier origen en producción.

## 🧪 Testing

### Ejecutar Pruebas
```bash
# Pruebas unitarias
npm test

# Pruebas con coverage
npm run test:coverage

# Pruebas en modo watch
npm run test:watch
```

### Cobertura de Testing
- Componentes principales
- Servicios de datos
- Validadores personalizados
- Guards de rutas

## 🔄 Flujo de Desarrollo

1. **Desarrollo Local**: `npm start` + `npm run api`
2. **Testing**: `npm test`
3. **Build**: `npm run build`
4. **Deploy**: Push a repositorio Git para deploy automático

## 📈 Rendimiento y Optimizaciones

### Implementadas
- **Lazy Loading**: Componentes cargados bajo demanda
- **OnPush Strategy**: Optimización de detección de cambios
- **Tree Shaking**: Eliminación de código no utilizado
- **Paginación**: Carga eficiente de productos
- **Optimización de imágenes**: Placeholder y lazy loading

## 👥 Contribución

### Guías de Estilo
- **TypeScript**: Tipado estricto requerido
- **HTML**: Semántica correcta y accesibilidad
- **CSS**: Uso preferente de Tailwind CSS
- **Commits**: Conventional Commits

### Workflow
1. Fork del repositorio
2. Crear feature branch
3. Implementar cambios con tests
4. Pull Request con descripción detallada



