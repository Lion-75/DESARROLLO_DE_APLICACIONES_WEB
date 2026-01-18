# Formulario con Validación Dinámica - Semana 6

Un formulario interactivo con validación en tiempo real implementado en JavaScript puro.

## Características

- **Validación en tiempo real** para todos los campos
- **Feedback visual inmediato** con colores diferenciados
- **Progress bar dinámica** que muestra el completado
- **Fortaleza de contraseña** con indicador visual
- **Resumen de validación** con estado de cada campo
- **Modal de éxito** con datos enviados
- **Diseño completamente responsivo**
- **Accesibilidad** y usabilidad mejorada

## Campos del Formulario

### 1. Información Personal
- **Nombre**: Mínimo 3 caracteres, solo letras y espacios
- **Email**: Formato válido de correo electrónico
- **Edad**: Mayor o igual a 18 años

### 2. Seguridad
- **Contraseña**: 
  - Mínimo 8 caracteres
  - Al menos un número
  - Al menos un carácter especial (!@#$%^&*)
- **Confirmar Contraseña**: Coincidencia exacta

### 3. Términos y Condiciones
- Aceptación obligatoria de términos
- Suscripción opcional al newsletter

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica del formulario
- **CSS3**: 
  - Variables CSS para consistencia
  - Grid y Flexbox para layouts
  - Animaciones y transiciones
  - Media queries para responsive design
- **JavaScript (ES6+)**:
  - Manipulación del DOM
  - Expresiones regulares para validación
  - Eventos en tiempo real
  - Estado local del formulario

## Características de Diseño

### Feedback Visual
- **Válido**: Borde verde, fondo verde claro
- **Inválido**: Borde rojo, fondo rojo claro, animación shake
- **Pendiente**: Borde naranja, fondo naranja claro

### Componentes Interactivos
- **Progress Bar**: Muestra porcentaje de completado
- **Indicador de Fortaleza**: Barra de colores para contraseña
- **Resumen de Validación**: Estado individual de cada campo
- **Modal de Éxito**: Confirmación visual al enviar

### Mejoras UX
- **Toggle de contraseña**: Mostrar/ocultar contraseña
- **Botón de prueba**: Rellena automáticamente con datos válidos
- **Mensajes toast**: Feedback temporal al usuario
- **Validación mientras se escribe**: Respuesta inmediata
