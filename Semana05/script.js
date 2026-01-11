// ============================================
// GALERÍA INTERACTIVA - JAVASCRIPT
// Proyecto Semana 5 - Manipulación del DOM
// ============================================

// ============================================
// 1. CONSTANTES Y VARIABLES GLOBALES
// ============================================

// Referencias a elementos DOM
const elements = {
    // Inputs y botones
    imageUrlInput: document.getElementById('imageUrl'),
    addImageBtn: document.getElementById('addImageBtn'),
    deleteSelectedBtn: document.getElementById('deleteSelectedBtn'),
    clearGalleryBtn: document.getElementById('clearGalleryBtn'),
    clearInputBtn: document.getElementById('clearInput'),
    
    // Contenedores
    galleryContainer: document.getElementById('galleryContainer'),
    messageContainer: document.getElementById('messageContainer'),
    
    // Elementos de estadísticas
    totalImages: document.getElementById('totalImages'),
    selectedImage: document.getElementById('selectedImage'),
    gallerySize: document.getElementById('gallerySize'),
    galleryCount: document.getElementById('galleryCount'),
    
    // Elementos de vista
    gridViewBtn: document.getElementById('gridViewBtn'),
    listViewBtn: document.getElementById('listViewBtn'),
    sortSelect: document.getElementById('sortSelect'),
    
    // Modal
    imageModal: document.getElementById('imageModal'),
    modalImage: document.getElementById('modalImage'),
    modalTitle: document.getElementById('modalTitle'),
    modalUrl: document.getElementById('modalUrl').querySelector('a'),
    modalSize: document.getElementById('modalSize'),
    modalDimensions: document.getElementById('modalDimensions'),
    modalDeleteBtn: document.getElementById('modalDeleteBtn'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    closeModalBtn: document.querySelector('.close-modal'),
    
    // Botones de muestra
    sampleButtons: document.querySelectorAll('.sample-btn')
};

// Estado de la aplicación
const state = {
    images: [], // Array de objetos {id, url, name, size, addedDate, selected}
    selectedImageId: null, // ID de la imagen seleccionada
    currentView: 'grid', // 'grid' o 'list'
    currentSort: 'added' // 'added', 'name', 'size'
};

// ============================================
// 2. FUNCIONES DE UTILIDAD
// ============================================

/**
 * Genera un ID único para cada imagen
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Valida si una URL es una imagen válida
 */
function isValidImageUrl(url) {
    if (!url) return false;
    
    try {
        const urlObj = new URL(url);
        
        // Verificar protocolo
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }
        
        // Verificar extensión de archivo de imagen
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const pathname = urlObj.pathname.toLowerCase();
        
        return imageExtensions.some(ext => pathname.endsWith(ext));
    } catch (error) {
        // URL inválida
        return false;
    }
}

/**
 * Obtiene el nombre del archivo desde una URL
 */
function getFileNameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        return pathname.substring(pathname.lastIndexOf('/') + 1) || 'imagen';
    } catch {
        return 'imagen';
    }
}

/**
 * Formatea el tamaño en bytes a formato legible
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calcula el tamaño total de todas las imágenes
 */
function calculateTotalSize() {
    return state.images.reduce((total, image) => total + image.size, 0);
}

/**
 * Muestra un mensaje al usuario
 */
function showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                       type === 'error' ? 'fa-exclamation-circle' : 
                       'fa-info-circle'}"></i>
        <span>${text}</span>
    `;
    
    elements.messageContainer.appendChild(messageDiv);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(20px)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Actualiza todas las estadísticas en la UI
 */
function updateStats() {
    // Total de imágenes
    elements.totalImages.textContent = state.images.length;
    elements.galleryCount.textContent = state.images.length;
    
    // Imagen seleccionada
    if (state.selectedImageId) {
        const selectedImg = state.images.find(img => img.id === state.selectedImageId);
        elements.selectedImage.textContent = selectedImg ? selectedImg.name : 'Ninguna';
    } else {
        elements.selectedImage.textContent = 'Ninguna';
    }
    
    // Tamaño total
    const totalSize = calculateTotalSize();
    elements.gallerySize.textContent = formatFileSize(totalSize);
    
    // Estado del botón eliminar
    elements.deleteSelectedBtn.disabled = !state.selectedImageId;
}

/**
 * Ordena las imágenes según el criterio seleccionado
 */
function sortImages() {
    switch (state.currentSort) {
        case 'name':
            state.images.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'size':
            state.images.sort((a, b) => b.size - a.size);
            break;
        case 'added':
        default:
            state.images.sort((a, b) => b.addedDate - a.addedDate);
            break;
    }
}

/**
 * Limpia el campo de entrada de URL
 */
function clearInputField() {
    elements.imageUrlInput.value = '';
    elements.imageUrlInput.focus();
}

// ============================================
// 3. FUNCIONES DE MANIPULACIÓN DEL DOM
// ============================================

/**
 * Crea el elemento DOM para una imagen
 */
function createImageElement(image) {
    const imageId = image.id;
    const isSelected = imageId === state.selectedImageId;
    
    const imageElement = document.createElement('div');
    imageElement.className = `gallery-item ${isSelected ? 'selected' : ''}`;
    imageElement.dataset.id = imageId;
    
    imageElement.innerHTML = `
        <img src="${image.url}" alt="${image.name}" class="gallery-image" 
             onerror="this.src='https://via.placeholder.com/300x200/cccccc/969696?text=Error+al+cargar'">
        <div class="image-info">
            <div class="image-name">${image.name}</div>
            <div class="image-size">${formatFileSize(image.size)}</div>
        </div>
        <div class="image-actions">
            <button class="action-btn view" title="Ver en grande">
                <i class="fas fa-expand"></i>
            </button>
            <button class="action-btn delete" title="Eliminar imagen">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return imageElement;
}

/**
 * Renderiza todas las imágenes en la galería
 */
function renderGallery() {
    // Ordenar imágenes
    sortImages();
    
    // Limpiar galería
    elements.galleryContainer.innerHTML = '';
    
    // Aplicar clase de vista actual
    elements.galleryContainer.className = `gallery-container ${state.currentView}-view`;
    
    if (state.images.length === 0) {
        // Mostrar estado vacío
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-gallery';
        emptyState.innerHTML = `
            <div class="empty-icon">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <h3>Galería vacía</h3>
            <p>Agrega tu primera imagen usando el campo de URL arriba</p>
        `;
        elements.galleryContainer.appendChild(emptyState);
    } else {
        // Renderizar cada imagen
        state.images.forEach(image => {
            const imageElement = createImageElement(image);
            elements.galleryContainer.appendChild(imageElement);
        });
    }
    
    // Actualizar estadísticas
    updateStats();
}

/**
 * Agrega una nueva imagen a la galería
 */
async function addImage(url) {
    // Validar URL
    if (!isValidImageUrl(url)) {
        showMessage('Por favor ingresa una URL válida de imagen (JPG, PNG, GIF, SVG)', 'error');
        elements.imageUrlInput.focus();
        return null;
    }
    
    try {
        // Crear objeto de imagen
        const imageId = generateId();
        const imageName = getFileNameFromUrl(url);
        
        const newImage = {
            id: imageId,
            url: url,
            name: imageName,
            size: 0, // Se calculará después
            addedDate: Date.now(),
            selected: false
        };
        
        // Intentar obtener información de la imagen
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentLength = response.headers.get('content-length');
            if (contentLength) {
                newImage.size = parseInt(contentLength);
            }
        } catch (error) {
            // Si falla la petición HEAD, usar tamaño por defecto
            newImage.size = 1024 * 100; // 100KB por defecto
        }
        
        // Agregar imagen al estado
        state.images.unshift(newImage); // Agregar al inicio
        
        // Renderizar galería
        renderGallery();
        
        // Mostrar mensaje de éxito
        showMessage(`Imagen "${imageName}" agregada correctamente`, 'success');
        
        // Limpiar campo de entrada
        clearInputField();
        
        return newImage;
    } catch (error) {
        showMessage('Error al agregar la imagen. Verifica la URL e intenta nuevamente.', 'error');
        console.error('Error adding image:', error);
        return null;
    }
}

/**
 * Selecciona una imagen por su ID
 */
function selectImage(imageId) {
    // Deseleccionar imagen anterior si existe
    if (state.selectedImageId) {
        const prevSelected = document.querySelector(`.gallery-item[data-id="${state.selectedImageId}"]`);
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }
    }
    
    // Seleccionar nueva imagen
    state.selectedImageId = imageId;
    
    // Aplicar clase selected al elemento
    const newSelected = document.querySelector(`.gallery-item[data-id="${imageId}"]`);
    if (newSelected) {
        newSelected.classList.add('selected');
        
        // Scroll suave a la imagen seleccionada
        newSelected.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    // Actualizar estadísticas
    updateStats();
    
    showMessage('Imagen seleccionada', 'info');
}

/**
 * Elimina la imagen seleccionada
 */
function deleteSelectedImage() {
    if (!state.selectedImageId) {
        showMessage('No hay ninguna imagen seleccionada para eliminar', 'error');
        return;
    }
    
    // Encontrar la imagen a eliminar
    const imageIndex = state.images.findIndex(img => img.id === state.selectedImageId);
    
    if (imageIndex !== -1) {
        const deletedImage = state.images[imageIndex];
        
        // Animar eliminación
        const imageElement = document.querySelector(`.gallery-item[data-id="${state.selectedImageId}"]`);
        if (imageElement) {
            imageElement.classList.add('removing');
            
            // Esperar a que termine la animación
            setTimeout(() => {
                // Eliminar del estado
                state.images.splice(imageIndex, 1);
                state.selectedImageId = null;
                
                // Re-renderizar galería
                renderGallery();
                
                // Mostrar mensaje
                showMessage(`Imagen "${deletedImage.name}" eliminada`, 'success');
            }, 500);
        }
    }
}

/**
 * Limpia toda la galería
 */
function clearGallery() {
    if (state.images.length === 0) {
        showMessage('La galería ya está vacía', 'info');
        return;
    }
    
    if (confirm(`¿Estás seguro de que deseas eliminar todas las imágenes (${state.images.length})?`)) {
        // Animar eliminación de todas las imágenes
        const imageElements = document.querySelectorAll('.gallery-item');
        imageElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('removing');
            }, index * 100);
        });
        
        // Esperar a que terminen las animaciones
        setTimeout(() => {
            state.images = [];
            state.selectedImageId = null;
            renderGallery();
            showMessage('Galería limpiada correctamente', 'success');
        }, imageElements.length * 100 + 500);
    }
}

/**
 * Cambia la vista de la galería (grid/list)
 */
function changeView(viewType) {
    if (state.currentView === viewType) return;
    
    state.currentView = viewType;
    
    // Actualizar botones activos
    elements.gridViewBtn.classList.toggle('active', viewType === 'grid');
    elements.listViewBtn.classList.toggle('active', viewType === 'list');
    
    // Aplicar clase de vista
    elements.galleryContainer.classList.remove('grid-view', 'list-view');
    elements.galleryContainer.classList.add(`${viewType}-view`);
    
    showMessage(`Vista cambiada a ${viewType === 'grid' ? 'cuadrícula' : 'lista'}`, 'info');
}

/**
 * Abre el modal con la vista previa de una imagen
 */
function openImageModal(imageId) {
    const image = state.images.find(img => img.id === imageId);
    if (!image) return;
    
    // Cargar datos en el modal
    elements.modalImage.src = image.url;
    elements.modalTitle.textContent = image.name;
    elements.modalUrl.href = image.url;
    elements.modalUrl.textContent = image.url.length > 50 ? image.url.substring(0, 50) + '...' : image.url;
    elements.modalSize.textContent = `Tamaño: ${formatFileSize(image.size)}`;
    
    // Intentar obtener dimensiones
    elements.modalDimensions.textContent = 'Dimensiones: Cargando...';
    const img = new Image();
    img.onload = function() {
        elements.modalDimensions.textContent = `Dimensiones: ${this.width} × ${this.height} px`;
    };
    img.onerror = function() {
        elements.modalDimensions.textContent = 'Dimensiones: No disponibles';
    };
    img.src = image.url;
    
    // Configurar botón de eliminar en el modal
    elements.modalDeleteBtn.onclick = function() {
        selectImage(imageId);
        deleteSelectedImage();
        closeImageModal();
    };
    
    // Mostrar modal
    elements.imageModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

/**
 * Cierra el modal de vista previa
 */
function closeImageModal() {
    elements.imageModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

// ============================================
// 4. MANEJADORES DE EVENTOS
// ============================================

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    // ===== EVENTOS DE FORMULARIO =====
    
    // Agregar imagen al hacer clic en el botón
    elements.addImageBtn.addEventListener('click', () => {
        const url = elements.imageUrlInput.value.trim();
        if (url) {
            addImage(url);
        } else {
            showMessage('Por favor ingresa una URL de imagen', 'error');
            elements.imageUrlInput.focus();
        }
    });
    
    // Agregar imagen al presionar Enter
    elements.imageUrlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            elements.addImageBtn.click();
        }
    });
    
    // Validación en tiempo real de la URL
    elements.imageUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url && isValidImageUrl(url)) {
            elements.imageUrlInput.classList.add('valid');
        } else {
            elements.imageUrlInput.classList.remove('valid');
        }
    });
    
    // Limpiar campo de entrada
    elements.clearInputBtn.addEventListener('click', clearInputField);
    
    // ===== EVENTOS DE ACCIONES =====
    
    // Eliminar imagen seleccionada
    elements.deleteSelectedBtn.addEventListener('click', deleteSelectedImage);
    
    // Limpiar toda la galería
    elements.clearGalleryBtn.addEventListener('click', clearGallery);
    
    // Eliminar con tecla Delete
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' && state.selectedImageId) {
            e.preventDefault();
            deleteSelectedImage();
        }
        
        // Navegación con flechas
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            navigateImages(e.key);
        }
        
        // Cerrar modal con Escape
        if (e.key === 'Escape' && elements.imageModal.style.display === 'block') {
            closeImageModal();
        }
    });
    
    // ===== EVENTOS DE GALERÍA =====
    
    // Delegación de eventos para las imágenes (porque se crean dinámicamente)
    elements.galleryContainer.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (!galleryItem) return;
        
        const imageId = galleryItem.dataset.id;
        
        // Si se hizo clic en el botón de eliminar
        if (e.target.closest('.action-btn.delete')) {
            selectImage(imageId);
            deleteSelectedImage();
            return;
        }
        
        // Si se hizo clic en el botón de vista
        if (e.target.closest('.action-btn.view')) {
            openImageModal(imageId);
            return;
        }
        
        // Si se hizo clic en la imagen misma
        selectImage(imageId);
    });
    
    // ===== EVENTOS DE VISTA =====
    
    // Cambiar a vista de cuadrícula
    elements.gridViewBtn.addEventListener('click', () => changeView('grid'));
    
    // Cambiar a vista de lista
    elements.listViewBtn.addEventListener('click', () => changeView('list'));
    
    // Ordenar imágenes
    elements.sortSelect.addEventListener('change', (e) => {
        state.currentSort = e.target.value;
        renderGallery();
        showMessage(`Imágenes ordenadas por ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });
    
    // ===== EVENTOS DE MODAL =====
    
    // Cerrar modal
    elements.closeModalBtn.addEventListener('click', closeImageModal);
    elements.modalCloseBtn.addEventListener('click', closeImageModal);
    
    // Cerrar modal al hacer clic fuera
    elements.imageModal.addEventListener('click', (e) => {
        if (e.target === elements.imageModal) {
            closeImageModal();
        }
    });
    
    // ===== EVENTOS DE MUESTRAS =====
    
    // URLs de ejemplo
    elements.sampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.dataset.url;
            elements.imageUrlInput.value = url;
            elements.imageUrlInput.focus();
            showMessage('URL de ejemplo cargada. Haz clic en "Agregar Imagen" para añadirla.', 'info');
        });
    });
}

/**
 * Navega entre imágenes con las flechas del teclado
 */
function navigateImages(direction) {
    if (state.images.length === 0) return;
    
    let currentIndex = state.images.findIndex(img => img.id === state.selectedImageId);
    
    if (direction === 'ArrowRight') {
        // Siguiente imagen
        currentIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % state.images.length;
    } else if (direction === 'ArrowLeft') {
        // Imagen anterior
        currentIndex = currentIndex === -1 ? state.images.length - 1 : 
                      (currentIndex - 1 + state.images.length) % state.images.length;
    }
    
    selectImage(state.images[currentIndex].id);
}

// ============================================
// 5. INICIALIZACIÓN
// ============================================

/**
 * Inicializa la aplicación
 */
function init() {
    console.log('🚀 Galería Interactiva inicializada');
    
    // Configurar event listeners
    setupEventListeners();
    
    // Establecer vista inicial
    changeView('grid');
    
    // Enfocar el campo de entrada
    elements.imageUrlInput.focus();
    
    // Agregar algunas imágenes de ejemplo al inicio (opcional)
    setTimeout(() => {
        if (state.images.length === 0) {
            // Estas son imágenes de Unsplash (dominio público)
            const sampleImages = [
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
                'https://images.unsplash.com/photo-1519681393784-d120267933ba',
                'https://images.unsplash.com/photo-1518837695005-2083093ee35b'
            ];
            
            // Agregar una imagen de ejemplo
            addImage(sampleImages[0]);
        }
    }, 1000);
    
    // Mostrar mensaje de bienvenida
    showMessage('¡Bienvenido a la Galería Interactiva! Usa el campo de arriba para agregar imágenes.', 'info');
}

// ============================================
// 6. INICIAR APLICACIÓN
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);

// Exportar funciones para usar en la consola (para debugging)
window.GalleryApp = {
    addImage,
    deleteSelectedImage,
    clearGallery,
    selectImage,
    changeView,
    state,
    elements
};