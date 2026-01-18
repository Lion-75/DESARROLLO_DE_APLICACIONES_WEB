// ============================================
// FORMULARIO CON VALIDACIÓN DINÁMICA - JAVASCRIPT
// Proyecto Semana 6 - Validación en Tiempo Real
// ============================================

// ============================================
// 1. CONSTANTES Y VARIABLES GLOBALES
// ============================================

// Referencias a elementos DOM
const elements = {
    // Formulario
    form: document.getElementById('registrationForm'),
    
    // Campos de entrada
    nombre: document.getElementById('nombre'),
    email: document.getElementById('email'),
    edad: document.getElementById('edad'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    terminos: document.getElementById('terminos'),
    newsletter: document.getElementById('newsletter'),
    
    // Botones de acción
    submitBtn: document.getElementById('submitBtn'),
    resetBtn: document.getElementById('resetBtn'),
    testBtn: document.getElementById('testBtn'),
    
    // Toggles de contraseña
    togglePassword: document.getElementById('togglePassword'),
    toggleConfirmPassword: document.getElementById('toggleConfirmPassword'),
    
    // Elementos de error
    nombreError: document.getElementById('nombreError'),
    emailError: document.getElementById('emailError'),
    edadError: document.getElementById('edadError'),
    passwordError: document.getElementById('passwordError'),
    confirmPasswordError: document.getElementById('confirmPasswordError'),
    terminosError: document.getElementById('terminosError'),
    
    // Elementos de resumen
    summaryNombre: document.getElementById('summaryNombre'),
    summaryEmail: document.getElementById('summaryEmail'),
    summaryEdad: document.getElementById('summaryEdad'),
    summaryPassword: document.getElementById('summaryPassword'),
    summaryConfirmPassword: document.getElementById('summaryConfirmPassword'),
    summaryTerminos: document.getElementById('summaryTerminos'),
    
    // Estadísticas
    completedFields: document.getElementById('completedFields'),
    formStatus: document.getElementById('formStatus'),
    formProgress: document.getElementById('formProgress'),
    progressPercentage: document.getElementById('progressPercentage'),
    
    // Requisitos de contraseña
    reqLength: document.getElementById('reqLength'),
    reqNumber: document.getElementById('reqNumber'),
    reqSpecial: document.getElementById('reqSpecial'),
    
    // Fortaleza de contraseña
    strengthBar: document.getElementById('strengthBar'),
    strengthText: document.getElementById('strengthText'),
    
    // Modal
    successModal: document.getElementById('successModal'),
    successMessage: document.getElementById('successMessage'),
    formDataPreview: document.getElementById('formDataPreview'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    printModalBtn: document.getElementById('printModalBtn')
};

// Expresiones regulares para validación
const patterns = {
    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    passwordNumber: /\d/,
    passwordSpecial: /[!@#$%^&*(),.?":{}|<>]/
};

// Estado del formulario
const formState = {
    nombre: { valid: false, value: '', touched: false },
    email: { valid: false, value: '', touched: false },
    edad: { valid: false, value: '', touched: false },
    password: { valid: false, value: '', touched: false },
    confirmPassword: { valid: false, value: '', touched: false },
    terminos: { valid: false, value: false, touched: false }
};

// Datos de prueba
const testData = {
    nombre: 'Ana García López',
    email: 'ana.garcia@ejemplo.com',
    edad: '25',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
    terminos: true,
    newsletter: true
};

// ============================================
// 2. FUNCIONES DE UTILIDAD
// ============================================

/**
 * Muestra u oculta un mensaje de error
 */
function showError(element, message) {
    if (message) {
        element.textContent = message;
        element.classList.add('show');
    } else {
        element.textContent = '';
        element.classList.remove('show');
    }
}

/**
 * Actualiza el estado visual de un campo
 */
function updateFieldVisual(field, isValid, isTouched = true) {
    const input = elements[field];
    
    if (!input) return;
    
    // Remover clases anteriores
    input.classList.remove('valid', 'invalid', 'pending', 'shake');
    
    if (!isTouched) {
        // Campo no tocado
        input.classList.add('pending');
    } else if (isValid) {
        // Campo válido
        input.classList.add('valid');
    } else {
        // Campo inválido
        input.classList.add('invalid');
        input.classList.add('shake');
        
        // Remover animación después de que termine
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);
    }
}

/**
 * Actualiza un elemento en el resumen de validación
 */
function updateSummaryItem(item, isValid, message) {
    const icon = item.querySelector('i');
    const text = item.querySelector('span');
    
    // Remover clases anteriores
    item.classList.remove('valid', 'invalid', 'pending');
    icon.classList.remove('fa-check-circle', 'fa-times-circle', 'fa-exclamation-circle');
    
    if (!formState[item.id.replace('summary', '').toLowerCase()].touched) {
        // Campo no tocado
        item.classList.add('pending');
        icon.classList.add('fa-exclamation-circle');
        text.textContent = message || 'Pendiente';
    } else if (isValid) {
        // Campo válido
        item.classList.add('valid');
        icon.classList.add('fa-check-circle');
        text.textContent = message || 'Válido';
    } else {
        // Campo inválido
        item.classList.add('invalid');
        icon.classList.add('fa-times-circle');
        text.textContent = message || 'Inválido';
    }
}

/**
 * Calcula el porcentaje de completado del formulario
 */
function calculateProgress() {
    const totalFields = Object.keys(formState).length;
    const completedFields = Object.values(formState).filter(field => field.valid).length;
    
    const percentage = Math.round((completedFields / totalFields) * 100);
    
    // Actualizar barra de progreso
    elements.formProgress.style.width = `${percentage}%`;
    elements.progressPercentage.textContent = `${percentage}%`;
    
    // Actualizar contador de campos completados
    elements.completedFields.textContent = `${completedFields}/${totalFields}`;
    
    return { percentage, completedFields, totalFields };
}

/**
 * Actualiza el estado general del formulario
 */
function updateFormStatus() {
    const { completedFields, totalFields, percentage } = calculateProgress();
    
    // Verificar si todos los campos son válidos
    const allValid = Object.values(formState).every(field => field.valid);
    
    // Actualizar botón de envío
    elements.submitBtn.disabled = !allValid;
    
    // Actualizar estado del formulario
    elements.formStatus.textContent = allValid ? 'Válido' : 'No válido';
    elements.formStatus.classList.remove('valid', 'invalid');
    elements.formStatus.classList.add(allValid ? 'valid' : 'invalid');
    
    // Actualizar mensaje del botón
    if (allValid) {
        elements.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Formulario';
        elements.submitBtn.title = 'Haz clic para enviar el formulario';
    } else {
        const remaining = totalFields - completedFields;
        elements.submitBtn.innerHTML = `<i class="fas fa-lock"></i> Faltan ${remaining} campo${remaining !== 1 ? 's' : ''}`;
        elements.submitBtn.title = `Completa ${remaining} campo${remaining !== 1 ? 's' : ''} más para habilitar el envío`;
    }
}

/**
 * Calcula la fortaleza de una contraseña
 */
function calculatePasswordStrength(password) {
    let strength = 0;
    const requirements = [];
    
    // Longitud mínima
    if (password.length >= 8) {
        strength += 25;
        requirements.push('length');
    }
    
    // Contiene número
    if (patterns.passwordNumber.test(password)) {
        strength += 25;
        requirements.push('number');
    }
    
    // Contiene carácter especial
    if (patterns.passwordSpecial.test(password)) {
        strength += 25;
        requirements.push('special');
    }
    
    // Longitud adicional (más de 12 caracteres)
    if (password.length >= 12) {
        strength += 25;
        requirements.push('long');
    }
    
    // Determinar nivel de fortaleza
    let level, text, color;
    
    if (strength <= 25) {
        level = 'weak';
        text = 'Débil';
        color = 'var(--strength-weak)';
    } else if (strength <= 50) {
        level = 'moderate';
        text = 'Moderada';
        color = 'var(--strength-moderate)';
    } else if (strength <= 75) {
        level = 'strong';
        text = 'Fuerte';
        color = 'var(--strength-strong)';
    } else {
        level = 'very-strong';
        text = 'Muy Fuerte';
        color = 'var(--strength-very-strong)';
    }
    
    return { strength, level, text, color, requirements };
}

/**
 * Actualiza la visualización de fortaleza de contraseña
 */
function updatePasswordStrength(password) {
    const { strength, level, text, color } = calculatePasswordStrength(password);
    
    // Actualizar barra y texto
    elements.strengthBar.style.width = `${strength}%`;
    elements.strengthBar.style.backgroundColor = color;
    elements.strengthText.textContent = text;
    elements.strengthText.style.color = color;
    
    // Actualizar niveles activos
    document.querySelectorAll('.strength-levels .level').forEach(levelEl => {
        levelEl.classList.remove('active');
    });
    
    const activeLevel = document.querySelector(`.level.${level.replace('-', '')}`);
    if (activeLevel) {
        activeLevel.classList.add('active');
    }
}

/**
 * Valida los requisitos de la contraseña
 */
function validatePasswordRequirements(password) {
    // Longitud
    const lengthValid = password.length >= 8;
    elements.reqLength.classList.toggle('valid', lengthValid);
    elements.reqLength.classList.toggle('invalid', !lengthValid);
    
    // Número
    const numberValid = patterns.passwordNumber.test(password);
    elements.reqNumber.classList.toggle('valid', numberValid);
    elements.reqNumber.classList.toggle('invalid', !numberValid);
    
    // Carácter especial
    const specialValid = patterns.passwordSpecial.test(password);
    elements.reqSpecial.classList.toggle('valid', specialValid);
    elements.reqSpecial.classList.toggle('invalid', !specialValid);
    
    return lengthValid && numberValid && specialValid;
}

// ============================================
// 3. FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Valida el campo nombre
 */
function validateNombre() {
    const value = elements.nombre.value.trim();
    let isValid = false;
    let errorMessage = '';
    
    formState.nombre.value = value;
    formState.nombre.touched = true;
    
    if (!value) {
        errorMessage = 'El nombre es obligatorio';
    } else if (value.length < 3) {
        errorMessage = 'El nombre debe tener al menos 3 caracteres';
    } else if (!patterns.nombre.test(value)) {
        errorMessage = 'Solo se permiten letras y espacios';
    } else {
        isValid = true;
    }
    
    formState.nombre.valid = isValid;
    showError(elements.nombreError, errorMessage);
    updateFieldVisual('nombre', isValid, formState.nombre.touched);
    updateSummaryItem(elements.summaryNombre, isValid, errorMessage || 'Válido');
    
    return isValid;
}

/**
 * Valida el campo email
 */
function validateEmail() {
    const value = elements.email.value.trim();
    let isValid = false;
    let errorMessage = '';
    
    formState.email.value = value;
    formState.email.touched = true;
    
    if (!value) {
        errorMessage = 'El email es obligatorio';
    } else if (!patterns.email.test(value)) {
        errorMessage = 'Por favor ingresa un email válido';
    } else {
        isValid = true;
    }
    
    formState.email.valid = isValid;
    showError(elements.emailError, errorMessage);
    updateFieldVisual('email', isValid, formState.email.touched);
    updateSummaryItem(elements.summaryEmail, isValid, errorMessage || 'Válido');
    
    return isValid;
}

/**
 * Valida el campo edad
 */
function validateEdad() {
    const value = parseInt(elements.edad.value);
    let isValid = false;
    let errorMessage = '';
    
    formState.edad.value = value;
    formState.edad.touched = true;
    
    if (isNaN(value)) {
        errorMessage = 'La edad es obligatoria';
    } else if (value < 18) {
        errorMessage = 'Debes ser mayor o igual a 18 años';
    } else if (value > 120) {
        errorMessage = 'Por favor ingresa una edad válida';
    } else {
        isValid = true;
    }
    
    formState.edad.valid = isValid;
    showError(elements.edadError, errorMessage);
    updateFieldVisual('edad', isValid, formState.edad.touched);
    updateSummaryItem(elements.summaryEdad, isValid, errorMessage || 'Válido');
    
    return isValid;
}

/**
 * Valida el campo contraseña
 */
function validatePassword() {
    const value = elements.password.value;
    let isValid = false;
    let errorMessage = '';
    
    formState.password.value = value;
    formState.password.touched = true;
    
    if (!value) {
        errorMessage = 'La contraseña es obligatoria';
    } else if (value.length < 8) {
        errorMessage = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!validatePasswordRequirements(value)) {
        errorMessage = 'La contraseña no cumple con los requisitos';
    } else {
        isValid = true;
    }
    
    // Actualizar fortaleza
    updatePasswordStrength(value);
    
    formState.password.valid = isValid;
    showError(elements.passwordError, errorMessage);
    updateFieldVisual('password', isValid, formState.password.touched);
    updateSummaryItem(elements.summaryPassword, isValid, errorMessage || 'Válido');
    
    // Si hay confirmación, validarla también
    if (formState.confirmPassword.touched) {
        validateConfirmPassword();
    }
    
    return isValid;
}

/**
 * Valida el campo confirmar contraseña
 */
function validateConfirmPassword() {
    const value = elements.confirmPassword.value;
    const passwordValue = elements.password.value;
    let isValid = false;
    let errorMessage = '';
    
    formState.confirmPassword.value = value;
    formState.confirmPassword.touched = true;
    
    if (!value) {
        errorMessage = 'La confirmación de contraseña es obligatoria';
    } else if (value !== passwordValue) {
        errorMessage = 'Las contraseñas no coinciden';
    } else {
        isValid = true;
    }
    
    formState.confirmPassword.valid = isValid;
    showError(elements.confirmPasswordError, errorMessage);
    updateFieldVisual('confirmPassword', isValid, formState.confirmPassword.touched);
    updateSummaryItem(elements.summaryConfirmPassword, isValid, errorMessage || 'Válido');
    
    return isValid;
}

/**
 * Valida el checkbox de términos
 */
function validateTerminos() {
    const isChecked = elements.terminos.checked;
    let isValid = false;
    let errorMessage = '';
    
    formState.terminos.value = isChecked;
    formState.terminos.touched = true;
    
    if (!isChecked) {
        errorMessage = 'Debes aceptar los términos y condiciones';
    } else {
        isValid = true;
    }
    
    formState.terminos.valid = isValid;
    showError(elements.terminosError, errorMessage);
    updateSummaryItem(elements.summaryTerminos, isValid, errorMessage || 'Aceptado');
    
    return isValid;
}

/**
 * Valida todos los campos del formulario
 */
function validateAllFields() {
    const validations = [
        validateNombre(),
        validateEmail(),
        validateEdad(),
        validatePassword(),
        validateConfirmPassword(),
        validateTerminos()
    ];
    
    updateFormStatus();
    return validations.every(v => v);
}

// ============================================
// 4. MANEJADORES DE EVENTOS
// ============================================

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    // ===== EVENTOS DE INPUT EN TIEMPO REAL =====
    
    // Nombre
    elements.nombre.addEventListener('input', validateNombre);
    elements.nombre.addEventListener('blur', validateNombre);
    
    // Email
    elements.email.addEventListener('input', validateEmail);
    elements.email.addEventListener('blur', validateEmail);
    
    // Edad
    elements.edad.addEventListener('input', validateEdad);
    elements.edad.addEventListener('blur', validateEdad);
    
    // Contraseña
    elements.password.addEventListener('input', function() {
        validatePassword();
        validatePasswordRequirements(this.value);
    });
    elements.password.addEventListener('blur', validatePassword);
    
    // Confirmar contraseña
    elements.confirmPassword.addEventListener('input', validateConfirmPassword);
    elements.confirmPassword.addEventListener('blur', validateConfirmPassword);
    
    // Términos
    elements.terminos.addEventListener('change', validateTerminos);
    
    // ===== TOGGLES DE CONTRASEÑA =====
    
    elements.togglePassword.addEventListener('click', function() {
        const type = elements.password.type === 'password' ? 'text' : 'password';
        elements.password.type = type;
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    elements.toggleConfirmPassword.addEventListener('click', function() {
        const type = elements.confirmPassword.type === 'password' ? 'text' : 'password';
        elements.confirmPassword.type = type;
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    // ===== BOTONES DE ACCIÓN =====
    
    // Envío del formulario
    elements.form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateAllFields()) {
            showSuccessModal();
        }
    });
    
    // Reinicio del formulario
    elements.resetBtn.addEventListener('click', function() {
        // Resetear estado
        Object.keys(formState).forEach(key => {
            formState[key] = { valid: false, value: '', touched: false };
            formState[key].value = key === 'terminos' ? false : '';
        });
        
        // Resetear visual
        document.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('valid', 'invalid', 'pending');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.classList.remove('show');
        });
        
        document.querySelectorAll('.requirement').forEach(req => {
            req.classList.remove('valid', 'invalid');
        });
        
        document.querySelectorAll('.summary-item').forEach(item => {
            item.classList.remove('valid', 'invalid', 'pending');
            const icon = item.querySelector('i');
            icon.classList.remove('fa-check-circle', 'fa-times-circle', 'fa-exclamation-circle');
            icon.classList.add('fa-times-circle');
            item.querySelector('span').textContent = 'Pendiente';
        });
        
        // Resetear fortaleza de contraseña
        elements.strengthBar.style.width = '0%';
        elements.strengthText.textContent = 'Débil';
        elements.strengthText.style.color = '';
        
        document.querySelectorAll('.strength-levels .level').forEach(level => {
            level.classList.remove('active');
        });
        
        // Actualizar estado
        updateFormStatus();
        
        // Mostrar mensaje
        showTemporaryMessage('Formulario reiniciado correctamente', 'success');
    });
    
    // Botón de prueba
    elements.testBtn.addEventListener('click', function() {
        // Llenar con datos de prueba
        elements.nombre.value = testData.nombre;
        elements.email.value = testData.email;
        elements.edad.value = testData.edad;
        elements.password.value = testData.password;
        elements.confirmPassword.value = testData.confirmPassword;
        elements.terminos.checked = testData.terminos;
        elements.newsletter.checked = testData.newsletter;
        
        // Forzar validación de todos los campos
        validateAllFields();
        
        // Mostrar mensaje
        showTemporaryMessage('Datos de prueba cargados. Valida que todos los campos sean correctos.', 'info');
    });
    
    // ===== MODAL =====
    
    elements.closeModalBtn.addEventListener('click', function() {
        elements.successModal.style.display = 'none';
    });
    
    elements.printModalBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === elements.successModal) {
            elements.successModal.style.display = 'none';
        }
    });
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.successModal.style.display === 'block') {
            elements.successModal.style.display = 'none';
        }
    });
}

/**
 * Muestra el modal de éxito con los datos del formulario
 */
function showSuccessModal() {
    // Crear preview de datos
    const dataHTML = `
        <h4>Datos enviados:</h4>
        <ul>
            <li><strong>Nombre:</strong> ${formState.nombre.value}</li>
            <li><strong>Email:</strong> ${formState.email.value}</li>
            <li><strong>Edad:</strong> ${formState.edad.value} años</li>
            <li><strong>Newsletter:</strong> ${elements.newsletter.checked ? 'Sí' : 'No'}</li>
            <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</li>
        </ul>
    `;
    
    elements.formDataPreview.innerHTML = dataHTML;
    elements.successMessage.textContent = '¡Felicidades! Todos los campos han sido validados correctamente.';
    
    // Mostrar modal
    elements.successModal.style.display = 'block';
    
    // Enfocar botón de cerrar
    elements.closeModalBtn.focus();
}

/**
 * Muestra un mensaje temporal al usuario
 */
function showTemporaryMessage(message, type = 'info') {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `temporary-message message-${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                       type === 'error' ? 'fa-exclamation-circle' : 
                       'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--valid-color)' :
                     type === 'error' ? 'var(--invalid-color)' :
                     'var(--info-color)'};
        color: white;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease;
    `;
    
    // Animación CSS
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
    
    document.body.appendChild(messageDiv);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 300);
    }, 3000);
}

// ============================================
// 5. INICIALIZACIÓN
// ============================================

/**
 * Inicializa la aplicación
 */
function init() {
    console.log('🚀 Formulario de Validación Dinámica inicializado');
    
    // Configurar event listeners
    setupEventListeners();
    
    // Inicializar estado visual
    updateFormStatus();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        showTemporaryMessage('¡Bienvenido! Completa el formulario para ver la validación en tiempo real.', 'info');
    }, 1000);
}

// ============================================
// 6. INICIAR APLICACIÓN
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);

// Exportar funciones para debugging
window.FormValidator = {
    validateNombre,
    validateEmail,
    validateEdad,
    validatePassword,
    validateConfirmPassword,
    validateTerminos,
    validateAllFields,
    formState,
    elements
};