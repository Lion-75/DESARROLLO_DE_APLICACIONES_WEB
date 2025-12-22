// script.js - Funcionalidades adicionales para Bootstrap

// Inicializar tooltips y popovers de Bootstrap
document.addEventListener('DOMContentLoaded', function() {
    // Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Validación de formulario Bootstrap
    const contactoForm = document.getElementById('contactoForm');
    if (contactoForm) {
        // Validación al enviar
        contactoForm.addEventListener('submit', function(event) {
            if (!contactoForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                // Simular envío exitoso
                mostrarMensajeExito();
                contactoForm.reset();
                contactoForm.classList.remove('was-validated');
            }
            
            contactoForm.classList.add('was-validated');
        }, false);
        
        // Resetear validación al limpiar
        contactoForm.addEventListener('reset', function() {
            contactoForm.classList.remove('was-validated');
        });
    }
    
    // Función para mostrar mensaje de éxito
    function mostrarMensajeExito() {
        // Crear alerta de Bootstrap
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
        alertDiv.style.zIndex = '1060';
        alertDiv.innerHTML = `
            <strong>¡Éxito!</strong> Tu mensaje ha sido enviado correctamente.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    // Efecto de scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});