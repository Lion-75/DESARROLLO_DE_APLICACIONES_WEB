# Galería Interactiva con JavaScript - Semana 5

Una aplicación web moderna para gestionar galerías de imágenes de forma dinámica utilizando manipulación del DOM y eventos en JavaScript.

## Características

- **Agregar imágenes por URL**: Soporta JPG, PNG, GIF, SVG, WebP
- **Selección única**: Solo una imagen puede estar seleccionada a la vez
- **Eliminación dinámica**: Elimina imágenes con efectos de animación
- **Vista previa modal**: Ver imágenes en tamaño completo
- **Dos vistas**: Cuadrícula y Lista
- **Ordenamiento**: Por fecha, nombre o tamaño
- **Estadísticas en tiempo real**: Contador, tamaño total, selección actual
- **Atajos de teclado**: Navegación rápida con teclado
- **Diseño responsivo**: Adaptable a móviles, tablets y desktop
- **Mensajes de feedback**: Información visual para el usuario

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: 
  - Grid y Flexbox para layouts
  - Variables CSS personalizadas
  - Animaciones y transiciones
  - Diseño responsivo con media queries
- **JavaScript (ES6+)**:
  - Manipulación del DOM
  - Manejo de eventos
  - Fetch API para validación
  - Programación orientada a objetos
- **Font Awesome**: Iconos
- **Google Fonts**: Tipografía Inter


## Funcionalidades Implementadas

### 1. Agregar Imágenes
- Validación de URLs de imágenes
- Feedback visual inmediato
- Soporte para múltiples formatos
- Cálculo automático de tamaño

### 2. Selección de Imágenes
- Selección única con resalte visual
- Navegación con teclado (flechas)
- Scroll automático a la selección
- Indicador visual de selección

### 3. Gestión de Imágenes
- Eliminación con animaciones
- Limpieza total de la galería
- Ordenamiento por diferentes criterios
- Cambio entre vistas (Grid/Lista)

### 4. Experiencia de Usuario
- Modal de vista previa
- Estadísticas en tiempo real
- Mensajes toast informativos
- Atajos de teclado
- Diseño responsive

## Atajos de Teclado

| Tecla | Función |
|-------|---------|
| `Enter` | Agregar imagen desde el campo URL |
| `Delete` | Eliminar imagen seleccionada |
| `←` `→` | Navegar entre imágenes |
| `Esc` | Cerrar modal de vista previa |

## Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos**: Móviles, Tablets, Desktop
- **Sistemas**: Windows, macOS, Linux, iOS, Android

