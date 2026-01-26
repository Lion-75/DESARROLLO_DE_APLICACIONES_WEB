// ============================================
// LISTA DINÁMICA DE PRODUCTOS - JAVASCRIPT
// Proyecto Semana 7 - Plantillas Básicas
// ============================================

// ============================================
// 1. DATOS INICIALES Y REFERENCIAS DOM
// ============================================

// Array inicial de productos (según requisitos de la tarea)
let productos = [
    {
        id: 1,
        nombre: "Laptop Gamer",
        precio: 1299.99,
        descripcion: "Laptop de alto rendimiento para gaming"
    },
    {
        id: 2,
        nombre: "Mouse Inalámbrico",
        precio: 29.99,
        descripcion: "Mouse ergonómico con conexión Bluetooth"
    },
    {
        id: 3,
        nombre: "Teclado Mecánico",
        precio: 89.99,
        descripcion: "Teclado con switches mecánicos RGB"
    },
    {
        id: 4,
        nombre: "Monitor 24\"",
        precio: 199.99,
        descripcion: "Monitor Full HD con tasa de refresco de 144Hz"
    },
    {
        id: 5,
        nombre: "Auriculares",
        precio: 59.99,
        descripcion: "Auriculares con cancelación de ruido"
    }
];

// Referencias a elementos DOM
const elementos = {
    // Lista de productos
    productList: document.getElementById('productList'),
    
    // Botones y formulario
    addProductBtn: document.getElementById('addProductBtn'),
    productForm: document.getElementById('productForm'),
    saveProductBtn: document.getElementById('saveProductBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    emptyMessage: document.getElementById('emptyMessage'),
    
    // Campos del formulario
    productName: document.getElementById('productName'),
    productPrice: document.getElementById('productPrice'),
    productDescription: document.getElementById('productDescription')
};

// Contador para IDs de nuevos productos
let nextProductId = productos.length + 1;

// ============================================
// 2. FUNCIONES DE UTILIDAD
// ============================================

/**
 * Formatea un precio para mostrarlo correctamente
 */
function formatearPrecio(precio) {
    return `$${precio.toFixed(2)}`;
}

/**
 * Muestra u oculta el mensaje de lista vacía
 */
function actualizarMensajeListaVacia() {
    if (productos.length === 0) {
        elementos.emptyMessage.style.display = 'block';
        elementos.productList.style.display = 'none';
    } else {
        elementos.emptyMessage.style.display = 'none';
        elementos.productList.style.display = 'block';
    }
}

/**
 * Limpia el formulario de agregar producto
 */
function limpiarFormulario() {
    elementos.productName.value = '';
    elementos.productPrice.value = '';
    elementos.productDescription.value = '';
}

// ============================================
// 3. PLANTILLAS Y RENDERIZADO DINÁMICO
// ============================================

/**
 * Crea una plantilla HTML para un producto individual
 */
function crearPlantillaProducto(producto) {
    return `
        <li class="product-item" data-id="${producto.id}">
            <div class="product-name">${producto.nombre}</div>
            <div class="product-price">${formatearPrecio(producto.precio)}</div>
            <div class="product-description">${producto.descripcion}</div>
        </li>
    `;
}

/**
 * Renderiza todos los productos en la lista
 */
function renderizarProductos() {
    // Limpiar la lista actual
    elementos.productList.innerHTML = '';
    
    // Renderizar cada producto usando la plantilla
    productos.forEach(producto => {
        const plantilla = crearPlantillaProducto(producto);
        elementos.productList.innerHTML += plantilla;
    });
    
    // Actualizar mensaje de lista vacía
    actualizarMensajeListaVacia();
}

/**
 * Agrega un nuevo producto al array y rerenderiza
 */
function agregarProducto(nombre, precio, descripcion) {
    // Crear nuevo producto
    const nuevoProducto = {
        id: nextProductId,
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        descripcion: descripcion.trim()
    };
    
    // Incrementar contador de IDs
    nextProductId++;
    
    // Agregar al array de productos
    productos.push(nuevoProducto);
    
    // Rerenderizar la lista
    renderizarProductos();
    
    // Mostrar mensaje de éxito
    mostrarMensajeTemporal(`Producto "${nombre}" agregado correctamente`, 'exito');
}

// ============================================
// 4. MANEJADORES DE EVENTOS
// ============================================

/**
 * Configura todos los event listeners
 */
function configurarEventListeners() {
    // Mostrar formulario al hacer clic en "Agregar Nuevo Producto"
    elementos.addProductBtn.addEventListener('click', function() {
        elementos.productForm.style.display = 'block';
        elementos.addProductBtn.style.display = 'none';
        elementos.productName.focus();
    });
    
    // Ocultar formulario al hacer clic en "Cancelar"
    elementos.cancelBtn.addEventListener('click', function() {
        elementos.productForm.style.display = 'none';
        elementos.addProductBtn.style.display = 'block';
        limpiarFormulario();
    });
    
    // Guardar nuevo producto
    elementos.saveProductBtn.addEventListener('click', function() {
        // Obtener valores del formulario
        const nombre = elementos.productName.value;
        const precio = elementos.productPrice.value;
        const descripcion = elementos.productDescription.value;
        
        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            mostrarMensajeTemporal('El nombre del producto es obligatorio', 'error');
            elementos.productName.focus();
            return;
        }
        
        if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
            mostrarMensajeTemporal('Por favor ingresa un precio válido (mayor a 0)', 'error');
            elementos.productPrice.focus();
            return;
        }
        
        if (!descripcion || descripcion.trim() === '') {
            mostrarMensajeTemporal('La descripción es obligatoria', 'error');
            elementos.productDescription.focus();
            return;
        }
        
        // Agregar el producto
        agregarProducto(nombre, precio, descripcion);
        
        // Ocultar formulario y limpiar
        elementos.productForm.style.display = 'none';
        elementos.addProductBtn.style.display = 'block';
        limpiarFormulario();
    });
    
    // Permitir enviar formulario con Enter
    elementos.productName.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            elementos.saveProductBtn.click();
        }
    });
    
    elementos.productPrice.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            elementos.saveProductBtn.click();
        }
    });
    
    elementos.productDescription.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (e.ctrlKey) {
                // Ctrl+Enter para nueva línea
                return;
            }
            elementos.saveProductBtn.click();
        }
    });
}

// ============================================
// 5. FUNCIONES AUXILIARES
// ============================================

/**
 * Muestra un mensaje temporal al usuario
 */
function mostrarMensajeTemporal(mensaje, tipo = 'info') {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-temporal mensaje-${tipo}`;
    mensajeDiv.textContent = mensaje;
    
    // Estilos básicos
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${tipo === 'exito' ? '#4CAF50' : tipo === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
        font-size: 14px;
        animation: deslizarEntrada 0.3s ease;
    `;
    
    // Agregar animación CSS
    const estilo = document.createElement('style');
    estilo.textContent = `
        @keyframes deslizarEntrada {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes deslizarSalida {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(estilo);
    
    document.body.appendChild(mensajeDiv);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        mensajeDiv.style.animation = 'deslizarSalida 0.3s ease';
        setTimeout(() => {
            if (mensajeDiv.parentNode) {
                mensajeDiv.remove();
            }
            if (estilo.parentNode) {
                estilo.remove();
            }
        }, 300);
    }, 3000);
}

/**
 * Carga datos de ejemplo adicionales (opcional, para testing)
 */
function cargarDatosAdicionales() {
    const datosAdicionales = [
        {
            nombre: "Tablet 10\"",
            precio: 299.99,
            descripcion: "Tablet con pantalla HD y 64GB de almacenamiento"
        },
        {
            nombre: "Disco Duro Externo",
            precio: 79.99,
            descripcion: "Disco duro de 1TB para backup de datos"
        },
        {
            nombre: "Webcam HD",
            precio: 49.99,
            descripcion: "Cámara web con micrófono integrado"
        }
    ];
    
    datosAdicionales.forEach(dato => {
        agregarProducto(dato.nombre, dato.precio, dato.descripcion);
    });
}

// ============================================
// 6. INICIALIZACIÓN
// ============================================

/**
 * Inicializa la aplicación
 */
function inicializar() {
    console.log('🚀 Aplicación de Lista de Productos inicializada');
    
    // Renderizar productos iniciales
    renderizarProductos();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        mostrarMensajeTemporal('¡Lista de productos cargada! Usa el botón para agregar más.', 'exito');
    }, 500);
    
    // Opcional: cargar datos adicionales después de 2 segundos (para demostración)
    setTimeout(() => {
        // Descomentar la siguiente línea para agregar datos de ejemplo automáticamente
        // cargarDatosAdicionales();
    }, 2000);
}

// ============================================
// 7. EJECUCIÓN
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializar);

// Exportar funciones para debugging (opcional)
window.ProductosApp = {
    productos,
    renderizarProductos,
    agregarProducto,
    elementos
};