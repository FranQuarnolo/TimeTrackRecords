# 🏁 TimeTracksRecords

**TimeTracksRecords** es una aplicación web mobile-first diseñada para entusiastas de las carreras, permitiéndote registrar y gestionar tus tiempos de vuelta en diversos circuitos. Construida con Next.js, TypeScript y Tailwind CSS, ofrece una experiencia premium con soporte nativo para modo oscuro y temas de escuderías.

## ✨ Características

-   **⏱️ Mis Tiempos**: Visualiza tus tiempos de vuelta categorizados por "Clasificación" y "Carrera".
    -   **Top 5**: El sistema guarda automáticamente solo tus 5 mejores tiempos por circuito y sesión.
    -   **Medallas**: Los 3 mejores tiempos reciben medallas de Oro, Plata y Bronce.
-   **🏎️ Cargar Tiempo**: Un asistente paso a paso para registrar nuevos tiempos:
    1.  **Seleccionar Circuito**: Lista visual con **Buscador Flotante (FAB)** y filtros mejorados (incluyendo "Favoritos").
    2.  **Seleccionar Sesión**: Elige entre Clasificación o Carrera.
    3.  **Ingresar Tiempo**: Selector preciso con milisegundos (3 dígitos) y selección de auto (WEC, F1, etc.).
-   **🎨 Temas de Escuderías**: Personaliza la app con los colores de tu equipo favorito (Ferrari, Mercedes, McLaren, etc.). ¡Toda la interfaz se adapta al color de tu equipo!
-   **📱 Mobile First**: Optimizada para interacciones táctiles y pantallas de móviles.
-   **💾 Guardado Local**: Todos los datos se guardan localmente en tu dispositivo.

## 🛠️ Tecnologías

-   **Framework**: Next.js 15 (App Router)
-   **Lenguaje**: TypeScript
-   **Estilos**: Tailwind CSS v4
-   **Estado**: Zustand (con persistencia)
-   **Animaciones**: Framer Motion, Vaul (Drawer)
-   **Iconos**: Lucide React

## 🚀 Comenzando

1.  Clona el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Corre el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## ⚙️ Configuración

Accede al menú de configuración a través del icono de engranaje en la esquina superior derecha para cambiar entre temas Claro/Oscuro y seleccionar tu Escudería favorita.
