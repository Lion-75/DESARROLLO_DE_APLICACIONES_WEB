// ============================================
// TECHSTORE - JAVASCRIPT INTERACTIVO
// Proyecto Semana 8 - Bootstrap + JavaScript
// ============================================

// ============================================
// 1. CONSTANTES Y VARIABLES GLOBALES
// ============================================

// Datos de productos para la tabla
const productos = [
    {
        id: 1,
        nombre: "Laptop Gamer ASUS ROG",
        precio: 1499.99,
        calificacion: 4.8,
        stock: 12,
        categoria: "Laptops"
    },
    {
        id: 2,
        nombre: "Mouse Logitech G Pro",
        precio: 89.99,
        calificacion: 4.7,
        stock: 45,
        categoria: "Periféricos"
    },
    {
        id: 3,
        nombre: "Teclado Mecánico Razer",
        precio: 129.99,
        calificacion: 4.6,
        stock: 23,
        categoria: "Periféricos"
    },
    {
        id: 4,
        nombre: "Monitor Samsung 27\" 4K",
        precio: 399.99,
        calificacion: 4.9,
        stock: 8,
        categoria: "Monitores"
    },
    {
        id: 5,
        nombre: "Auriculares Sony WH-1000XM4",
        precio: 299.99,
        calificacion: 4.8,
        stock: 15,
        categoria: "Audio"
    },
    {
        id: 6,
        nombre: "Tarjeta Gráfica NVIDIA RTX 4080",
        precio: 1199.99,
        calificacion: 4.9,
        stock: 5,
        categoria: "Componentes"
    },
    {
        id: 7,
        nombre: "SSD NVMe 2TB Samsung",
        precio: 199.99,
        calificacion: 4.7,
        stock: 32,
        categoria: "Almacenamiento"
    },
    {
        id: 8,
        nombre: "Webcam Logitech C920",
        precio: 79.99,
        calificacion: 4.5,
        stock: 28,
        categoria: "Accesorios"
    },
    {
        id: 9,
        nombre: "Tablet Samsung S9",
        precio: 899.99,
        calificacion: 4.8,
        stock: 10,
        categoria: "Tablets"
    },
    {
        id: 10,
        nombre: "Smartwatch Apple Watch",
        precio: 399.99,
        calificacion: 4.6,
        stock: 18,
        categoria: "Wearables"
    },
    {
        id: 11,
        nombre: "Router WiFi 6 ASUS",
        precio: 199.99,
        calificacion: 4.4,
        stock: 14,
        categoria: "Redes"
    },
    {
        id: 12,
        nombre: "Impresora 3D Creality",
        precio: 299.99,
        calificacion: 4.3,
        stock: 7,
        categoria: "Impresión"
    }
];

// Referencias a elementos DOM
const elementos = {
    // Botones de interacción
    themeToggle: document.getElementById('themeToggle'),
    specialAlert: document.getElementById('specialAlert'),
    
    // Elementos de productos
    productsTable: document.getElementById('productsTable'),
    productCount: document.getElementById('productCount'),
    filteredCount: document.getElementById('filteredCount'),
    searchProducts: document.getElementById('searchProducts'),
    noResults: document.getElementById('noResults'),
    
    // Formulario de contacto
    contactForm: document.getElementById('contactForm'),
    nameInput: document.getElementById('name'),
    emailInput: document.getElementById('email'),
    messageInput: document.getElementById('message'),
    successMessage: document.getElementById('successMessage'),
    
    // Elementos de error
    nameError: document.getElementById('nameError'),
    emailError: document.getElementById('emailError'),
    messageError: document.getElementById('messageError')
};

// Estado de la aplicación
const appState = {
    currentTheme: 'light',
    filteredProducts: [...productos]
};

// Expresiones regulares para validación
const patterns = {
    name: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: /^[\s\S]{10,500}$/
};

// ============================================
// 2. FUNCIONES DE UTILIDAD
// ============================================

/**
 * Formatea un precio a formato monetario
 */
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(precio);
}

/**
 * Genera estrellas para la calificación
 */
function generarEstrellas(calificacion) {
    const estrellasLlenas = Math.floor(calificacion);
    const mediaEstrella = calificacion % 1 >= 0.5;
    
    let html = '';
    
    // Estrellas llenas
    for (let i = 0; i < estrellasLlenas; i++) {
        html += '<i class="bi bi-star-fill text-warning"></i>';
    }
    
    // Media estrella si aplica
    if (mediaEstrella) {
        html += '<i class="bi bi-star-half text-warning"></i>';
    }
    
    // Estrellas vacías
    const estrellasVacias = 5 - estrellasLlenas - (mediaEstrella ? 1 : 0);
    for (let i = 0; i < estrellasVacias; i++) {
        html += '<i class="bi bi-star text-warning"></i>';
    }
    
    return html;
}

/**
 * Muestra un mensaje temporal al usuario
 */
function mostrarMensaje(mensaje, tipo = 'info') {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-temporal alert alert-${tipo} alert-dismissible fade show`;
    mensajeDiv.innerHTML = `
        <strong>${tipo === 'success' ? 'Éxito' : tipo === 'danger' ? 'Error' : 'Información'}:</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Estilos adicionales
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(mensajeDiv);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (mensajeDiv.parentNode) {
            const bsAlert = new bootstrap.Alert(mensajeDiv);
            bsAlert.close();
        }
        if (style.parentNode) {
            style.remove();
        }
    }, 5000);
}

/**
 * Actualiza el estado del stock
 */
function obtenerEstadoStock(stock) {
    if (stock <= 0) {
        return '<span class="badge bg-danger">Agotado</span>';
    } else if (stock <= 5) {
        return '<span class="badge bg-warning text-dark">Últimas unidades</span>';
    } else if (stock <= 15) {
        return '<span class="badge bg-info">Stock limitado</span>';
    } else {
        return '<span class="badge bg-success">Disponible</span>';
    }
}

// ============================================
// 3. FUNCIONES DE RENDERIZADO DE PRODUCTOS
// ============================================

/**
 * Renderiza la tabla de productos
 */
function renderizarProductos(productosARenderizar = appState.filteredProducts) {
    elementos.productsTable.innerHTML = '';
    
    if (productosARenderizar.length === 0) {
        elementos.noResults.classList.remove('d-none');
        return;
    }
    
    elementos.noResults.classList.add('d-none');
    
    productosARenderizar.forEach((producto, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>
                <strong>${producto.nombre}</strong><br>
                <small class="text-muted">${producto.categoria}</small>
            </td>
            <td class="fw-bold text-primary">${formatearPrecio(producto.precio)}</td>
            <td>
                ${generarEstrellas(producto.calificacion)}
                <small class="text-muted ms-2">${producto.calificacion}/5</small>
            </td>
            <td>
                ${obtenerEstadoStock(producto.stock)}
                <small class="d-block text-muted">${producto.stock} unidades</small>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="verProducto(${producto.id})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success me-1" onclick="agregarAlCarrito(${producto.id})">
                    <i class="bi bi-cart-plus"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="marcarFavorito(${producto.id})">
                    <i class="bi bi-heart"></i>
                </button>
            </td>
        `;
        elementos.productsTable.appendChild(fila);
    });
    
    // Actualizar contadores
    elementos.productCount.textContent = productos.length;
    elementos.filteredCount.textContent = productosARenderizar.length;
}

/**
 * Filtra productos según el término de búsqueda
 */
function filtrarProductos(termino) {
    const terminoLower = termino.toLowerCase().trim();
    
    if (!terminoLower) {
        appState.filteredProducts = [...productos];
    } else {
        appState.filteredProducts = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(terminoLower) ||
            producto.categoria.toLowerCase().includes(terminoLower)
        );
    }
    
    renderizarProductos();
}

// ============================================
// 4. FUNCIONES DE INTERACTIVIDAD
// ============================================

/**
 * Cambia entre tema claro y oscuro
 */
function toggleTema() {
    const html = document.documentElement;
    
    if (appState.currentTheme === 'light') {
        html.setAttribute('data-bs-theme', 'dark');
        elementos.themeToggle.innerHTML = '<i class="bi bi-sun"></i> Modo Claro';
        appState.currentTheme = 'dark';
        mostrarMensaje('Tema oscuro activado', 'info');
    } else {
        html.setAttribute('data-bs-theme', 'light');
        elementos.themeToggle.innerHTML = '<i class="bi bi-moon"></i> Modo Oscuro';
        appState.currentTheme = 'light';
        mostrarMensaje('Tema claro activado', 'info');
    }
    
    // Guardar preferencia en localStorage
    localStorage.setItem('themePreference', appState.currentTheme);
}

/**
 * Muestra alerta especial (requerido por la tarea)
 */
function mostrarAlertaEspecial() {
    // Crear modal de alerta personalizada
    const alertHTML = `
        <div class="modal fade" id="specialOfferModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-warning">
                        <h5 class="modal-title">
                            <i class="bi bi-lightning me-2"></i> ¡Oferta Especial!
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="display-1 text-warning mb-3">
                            <i class="bi bi-gift"></i>
                        </div>
                        <h4 class="mb-3">Descuento del 30% en productos seleccionados</h4>
                        <p class="lead">Válido solo por hoy. Usa el código: <strong>TECH30</strong></p>
                        <div class="alert alert-info">
                            <i class="bi bi-clock"></i> La oferta expira en <span id="countdown">24:00:00</span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-warning" onclick="irAOfertas()">
                            <i class="bi bi-arrow-right"></i> Ver Ofertas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al DOM si no existe
    if (!document.getElementById('specialOfferModal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = alertHTML;
        document.body.appendChild(modalContainer);
    }
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('specialOfferModal'));
    modal.show();
    
    // Iniciar cuenta regresiva
    iniciarCuentaRegresiva();
}

/**
 * Inicia cuenta regresiva para la oferta
 */
function iniciarCuentaRegresiva() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    let tiempoRestante = 24 * 60 * 60; // 24 horas en segundos
    
    const actualizarCuentaRegresiva = () => {
        const horas = Math.floor(tiempoRestante / 3600);
        const minutos = Math.floor((tiempoRestante % 3600) / 60);
        const segundos = tiempoRestante % 60;
        
        countdownElement.textContent = 
            `${horas.toString().padStart(2, '0')}:` +
            `${minutos.toString().padStart(2, '0')}:` +
            `${segundos.toString().padStart(2, '0')}`;
        
        if (tiempoRestante > 0) {
            tiempoRestante--;
        } else {
            clearInterval(intervalo);
            countdownElement.textContent = '¡Oferta Expirada!';
            countdownElement.classList.add('text-danger');
        }
    };
    
    actualizarCuentaRegresiva();
    const intervalo = setInterval(actualizarCuentaRegresiva, 1000);
}

/**
 * Navega a la sección de productos
 */
function irAOfertas() {
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('specialOfferModal'));
    if (modal) modal.hide();
    
    // Desplazar a productos
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    
    // Filtrar productos con oferta (simulado)
    elementos.searchProducts.value = 'gamer';
    filtrarProductos('gamer');
    
    mostrarMensaje('Mostrando productos en oferta', 'success');
}

// ============================================
// 5. VALIDACIÓN DEL FORMULARIO DE CONTACTO
// ============================================

/**
 * Valida el campo nombre
 */
function validarNombre() {
    const nombre = elementos.nameInput.value.trim();
    const esValido = patterns.name.test(nombre);
    
    if (nombre === '') {
        elementos.nameInput.classList.remove('is-valid', 'is-invalid');
        return false;
    }
    
    elementos.nameInput.classList.remove('is-valid', 'is-invalid');
    elementos.nameInput.classList.add(esValido ? 'is-valid' : 'is-invalid');
    
    if (!esValido) {
        elementos.nameError.textContent = 'El nombre debe tener entre 3 y 50 caracteres y solo letras';
    }
    
    return esValido;
}

/**
 * Valida el campo email
 */
function validarEmail() {
    const email = elementos.emailInput.value.trim();
    const esValido = patterns.email.test(email);
    
    if (email === '') {
        elementos.emailInput.classList.remove('is-valid', 'is-invalid');
        return false;
    }
    
    elementos.emailInput.classList.remove('is-valid', 'is-invalid');
    elementos.emailInput.classList.add(esValido ? 'is-valid' : 'is-invalid');
    
    if (!esValido) {
        elementos.emailError.textContent = 'Por favor ingresa un email válido (ejemplo@correo.com)';
    }
    
    return esValido;
}

/**
 * Valida el campo mensaje
 */
function validarMensaje() {
    const mensaje = elementos.messageInput.value.trim();
    const esValido = patterns.message.test(mensaje);
    
    if (mensaje === '') {
        elementos.messageInput.classList.remove('is-valid', 'is-invalid');
        return false;
    }
    
    elementos.messageInput.classList.remove('is-valid', 'is-invalid');
    elementos.messageInput.classList.add(esValido ? 'is-valid' : 'is-invalid');
    
    if (!esValido) {
        if (mensaje.length < 10) {
            elementos.messageError.textContent = 'El mensaje debe tener al menos 10 caracteres';
        } else {
            elementos.messageError.textContent = 'El mensaje no puede exceder los 500 caracteres';
        }
    }
    
    return esValido;
}

/**
 * Valida todo el formulario
 */
function validarFormulario() {
    const nombreValido = validarNombre();
    const emailValido = validarEmail();
    const mensajeValido = validarMensaje();
    
    return nombreValido && emailValido && mensajeValido;
}

/**
 * Maneja el envío del formulario
 */
function manejarEnvioFormulario(event) {
    event.preventDefault();
    
    if (!validarFormulario()) {
        mostrarMensaje('Por favor corrige los errores en el formulario', 'danger');
        return;
    }
    
    // Simular envío del formulario
    elementos.successMessage.classList.remove('d-none');
    elementos.contactForm.reset();
    
    // Remover clases de validación
    elementos.nameInput.classList.remove('is-valid', 'is-invalid');
    elementos.emailInput.classList.remove('is-valid', 'is-invalid');
    elementos.messageInput.classList.remove('is-valid', 'is-invalid');
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        elementos.successMessage.classList.add('d-none');
    }, 5000);
    
    mostrarMensaje('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
    
    // Aquí normalmente enviarías los datos a un servidor
    const formData = {
        nombre: elementos.nameInput.value.trim(),
        email: elementos.emailInput.value.trim(),
        mensaje: elementos.messageInput.value.trim(),
        fecha: new Date().toISOString()
    };
    
    console.log('Datos del formulario:', formData);
}

// ============================================
// 6. FUNCIONES PARA BOTONES DE PRODUCTOS
// ============================================

/**
 * Muestra detalles de un producto
 */
function verProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    mostrarMensaje(`Viendo detalles de: ${producto.nombre}`, 'info');
    
    // En una aplicación real, aquí abrirías un modal o redirigirías
    console.log('Ver producto:', producto);
}

/**
 * Agrega producto al carrito
 */
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    if (producto.stock <= 0) {
        mostrarMensaje('Producto agotado', 'danger');
        return;
    }
    
    mostrarMensaje(`"${producto.nombre}" agregado al carrito`, 'success');
    
    // En una aplicación real, aquí actualizarías el carrito
    console.log('Agregar al carrito:', producto);
}

/**
 * Marca producto como favorito
 */
function marcarFavorito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    mostrarMensaje(`"${producto.nombre}" agregado a favoritos`, 'info');
    
    // En una aplicación real, aquí guardarías en favoritos
    console.log('Marcar favorito:', producto);
}

// ============================================
// 7. CONFIGURACIÓN DE EVENT LISTENERS
// ============================================

/**
 * Configura todos los event listeners
 */
function configurarEventListeners() {
    // Toggle de tema
    elementos.themeToggle.addEventListener('click', toggleTema);
    
    // Botón de alerta especial
    elementos.specialAlert.addEventListener('click', mostrarAlertaEspecial);
    
    // Búsqueda de productos
    elementos.searchProducts.addEventListener('input', function() {
        filtrarProductos(this.value);
    });
    
    // Validación en tiempo real del formulario
    elementos.nameInput.addEventListener('input', validarNombre);
    elementos.emailInput.addEventListener('input', validarEmail);
    elementos.messageInput.addEventListener('input', validarMensaje);
    
    // Envío del formulario
    elementos.contactForm.addEventListener('submit', manejarEnvioFormulario);
    
    // Reset del formulario
    elementos.contactForm.addEventListener('reset', function() {
        elementos.nameInput.classList.remove('is-valid', 'is-invalid');
        elementos.emailInput.classList.remove('is-valid', 'is-invalid');
        elementos.messageInput.classList.remove('is-valid', 'is-invalid');
        elementos.successMessage.classList.add('d-none');
    });
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 8. INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

/**
 * Inicializa la aplicación
 */
function inicializar() {
    console.log('TechStore - Aplicación inicializada');
    
    // Cargar preferencia de tema
    const temaGuardado = localStorage.getItem('themePreference');
    if (temaGuardado && temaGuardado === 'dark') {
        toggleTema(); // Cambia al tema oscuro si estaba guardado
    }
    
    // Renderizar productos iniciales
    renderizarProductos();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        mostrarMensaje('Bienvenido a TechStore. Explora nuestros productos tecnológicos.', 'info');
    }, 1000);
}

// ============================================
// 9. EJECUCIÓN
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializar);

// Hacer funciones disponibles globalmente para los botones onclick
window.verProducto = verProducto;
window.agregarAlCarrito = agregarAlCarrito;
window.marcarFavorito = marcarFavorito;
window.irAOfertas = irAOfertas;