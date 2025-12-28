# Documentación del Proyecto Click Logística

Esta documentación ofrece una visión general técnica y funcional del proyecto de sitio web para **Click Logística**. El proyecto está construido utilizando **Astro** como framework principal, priorizando el rendimiento y una arquitectura moderna.

## 🛠 Stack Tecnológico

El proyecto utiliza las siguientes tecnologías y librerías clave:

*   **Framework Principal**: [Astro](https://astro.build/) (v5.x) - Generador de sitios estáticos optimizado para velocidad.
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/) (v3.4.x) - Framework de CSS utilitario.
*   **Iconos**: [FontAwesome](https://fontawesome.com/) (Free v6.5.1) - Librería de iconos vectoriales.
*   **Animaciones y UI**:
    *   `gsap` (v3.12.4): Para animaciones complejas.
    *   `lenis` (v1.0.42): Para efectos de "smooth scrolling" (desplazamiento suave).
    *   `canvas` (nativo): Implementación personalizada para el fondo de red neuronal (`network-canvas.js`).
*   **Gestor de Paquetes**: Configurado para uso con `npm` o `yarn` (basado en la presencia de `package.json`).

## 📂 Estructura del Proyecto

La estructura de directorios sigue las convenciones estándar de Astro:

```text
/
├── public/                 # Archivos estáticos públicos (imágenes, favicon, etc.)
├── src/                    # Código fuente del proyecto
│   ├── css/                # Estilos globales y específicos
│   │   └── style.css       # Importaciones de Tailwind y estilos base
│   ├── js/                 # Lógica JavaScript del lado del cliente
│   │   ├── main.js         # Lógica principal (menú, scroll, inicialización)
│   │   ├── form-wizard.js  # Lógica para formularios de múltiples pasos
│   │   └── network-canvas.js # Animación de fondo (red de nodos)
│   ├── layouts/            # Plantillas de diseño reutilizables
│   │   └── Layout.astro    # Layout principal (Header, Footer, Meta tags)
│   └── pages/              # Rutas del sitio web (generación automática)
│       ├── index.astro     # Página de inicio
│       ├── empresas.astro  # Página de servicios para empresas
│       ├── equipo.astro    # Página de equipo
│       ├── historia.astro  # Historia de la empresa
│       ├── marcas.astro    # Marcas aliadas
│       ├── politica.astro  # Política de tratamiento de datos
│       └── terminos.astro  # Términos y condiciones
├── astro.config.mjs        # Configuración de Astro
├── tailwind.config.cjs     # Configuración de Tailwind CSS
└── package.json            # Dependencias y scripts
```

## 🧩 Componentes y Funcionalidad Clave

### 1. Sistema de Layout (`Layout.astro`)
Define la estructura común de todas las páginas:
*   **Header**: Barra de navegación responsiva con menú móvil.
*   **Contenido Principal**: Inyectado a través del slot `<slot />`.
*   **Footer**: Pie de página con enlaces legales e información de contacto.
*   **Scripts Globales**: Carga diferida de scripts principales.

### 2. Páginas Principales
*   **Inicio (`index.astro`)**: Landing page principal con hero section, contadores animados y accesos directos.
*   **Empresas (`empresas.astro`)**: Orientada a captación de clientes corporativos, incluye un formulario de "wizard" de varios pasos.
*   **Marcas y Equipo**: Páginas informativas que presentan la trayectoria y aliados de la empresa.

### 3. Lógica JavaScript (`src/js/`)
*   **`main.js`**:
    *   Inicializa **Lenis** para el scroll suave.
    *   Controla el menú móvil (hamburguesa) y submenús.
    *   Gestiona el botón flotante de WhatsApp (efecto de desvanecimiento al hacer scroll sobre otros elementos).
    *   Maneja el "Ticker" de clientes (carrusel infinito de texto).
    *   Implementa contadores animados (Intersection Observer).
*   **`form-wizard.js`**:
    *   Controla la lógica de los formularios de múltiples pasos (Empresas y Reclutamiento).
    *   Maneja validaciones simples y transiciones entre pasos (Paso 1 -> Paso 2 -> Éxito).
    *   Actualiza la barra de progreso visual.
*   **`network-canvas.js`**:
    *   Dibuja una animación de red neuronal en el fondo (nodos conectados por líneas) que responde al movimiento del mouse. Carga diferida para no impactar el rendimiento inicial.

### 4. Configuración de Estilos (`tailwind.config.cjs`)
*   **Fuentes**: Inter (San-serif).
*   **Colores de Marca**:
    *   `brand-black` (#09090b)
    *   `brand-primary` (#eab308 - Amarillo)
    *   `brand-accent` (#facc15)
*   **Animaciones Personalizadas**: `float`, `pulse-slow`, `scroll-left`.

## 🚀 Scripts Disponibles

En la terminal, puedes ejecutar los siguientes comandos definidos en `package.json`:

*   `npm run dev`: Inicia el servidor de desarrollo local (generalmente en http://localhost:4321).
*   `npm run build`: Compila el sitio para producción en la carpeta `dist/`.
*   `npm run preview`: Sirve la versión compilada localmente para probar antes de desplegar.

## ⚠️ Notas Importantes
*   **Integración de Ngrok**: La configuración de Vite (`astro.config.mjs`) permite hosts específicos para túneles de Ngrok, útil para pruebas en dispositivos móviles externos.
*   **Optimización**: El uso de islas de arquitectura de Astro y la carga diferida de scripts pesados (como el canvas) asegura un alto rendimiento (Core Web Vitals).
