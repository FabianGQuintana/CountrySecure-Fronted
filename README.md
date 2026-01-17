# CountrySecure - Frontend 🏰🛡️

**CountrySecure** es una solución tecnológica integral diseñada para la gestión operativa y el control de seguridad en barrios privados y comunidades cerradas. Este repositorio contiene el código de la interfaz de usuario (frontend), desarrollada con un enfoque en la eficiencia, la seguridad y una experiencia de navegación intuitiva para administradores, residentes y personal de seguridad.

## 📝 Origen del Proyecto y Despliegue

Este sistema fue desarrollado originalmente como proyecto final para el bootcamp de la empresa **Devlights**. Durante la fase activa del programa, la plataforma estuvo desplegada y operativa en la infraestructura de **Amazon Web Services (AWS)**, utilizando dominios específicos provistos por la organización para pruebas en entornos reales. 

> **Nota:** Tras la finalización del bootcamp, los servicios de hosting y dominios asociados han sido dados de baja, por lo que el acceso a la versión en vivo ya no se encuentra disponible. Este repositorio se mantiene como registro del desarrollo técnico y arquitectónico alcanzado.

## 🚀 Tecnologías Principales

El proyecto utiliza un stack moderno para garantizar un rendimiento óptimo y escalabilidad:

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) para un desarrollo tipado y seguro
* **Estilos y UI:** [Tailwind CSS 4](https://tailwindcss.com/) y [Framer Motion](https://www.framer.com/motion/) para una interfaz dinámica y animada
* **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/) con validaciones robustas mediante [Zod](https://zod.dev/)
* **Autenticación:** [NextAuth.js](https://next-auth.js.org/) para el manejo seguro de sesiones y roles
* **Iconografía:** [Lucide React](https://lucide.dev/) y [React Icons](https://react-icons.github.io/react-icons/)

## ✨ Características y Funcionalidades

El sistema segmenta sus funciones según el perfil del usuario para garantizar el control total del predio:

### 🔒 Seguridad y Acceso
* **Control de Roles:** Implementación de layouts y rutas protegidas específicamente para Administradores, Seguridad y Residentes.
* **Validación por QR:** Capacidad técnica para la generación de códigos QR destinados a agilizar el ingreso de visitas.

### 🛠️ Módulos para la Administración
* **Gestión de Comunidad:** Administración completa de residentes, personal y unidades habitacionales (lotes).
* **Control de Órdenes:** Seguimiento de solicitudes de servicios y mantenimiento dentro del country.
* **Gestión de Amenities:** Configuración y supervisión de espacios comunes (piscinas, canchas, gimnasios).

### 📑 Operaciones de Seguridad
* **Registro de Visitas:** Panel en tiempo real para el personal de guardia, permitiendo registrar ingresos y salidas de familiares y servicios externos.
* **Monitoreo:** Interfaz diseñada para la integración de visualización de cámaras de seguridad.
* **Logs de Auditoría:** Historial detallado de movimientos y acciones dentro del sistema para máxima transparencia.

### 👤 Portal del Residente
* **Autogestión:** Los residentes pueden autorizar visitas de forma anticipada y gestionar su perfil personal.
* **Reservas:** Sistema de turnos para el uso de amenities y espacios compartidos.

## 📦 Instalación Local

Si deseas explorar el código o ejecutarlo localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/fabiangquintana/countrysecure-fronted.git](https://github.com/fabiangquintana/countrysecure-fronted.git)
    cd countrysecure-fronted
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configuración de variables de entorno:**
    Crea un archivo `.env.local` y define las variables necesarias (URL de la API, secretos de NextAuth, etc.).

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

---
Desarrollado con enfoque profesional para la gestión de seguridad residencial.
