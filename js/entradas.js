// JavaScript para la página de Entradas - Club Pandora

document.addEventListener('DOMContentLoaded', function() {
    // Precios base para cada tipo de entrada
    const PRECIOS = {
        general: 40,
        premium: 80,
        vip: 150
    };

    // Servicios adicionales con precios
    const SERVICIOS_ADICIONALES = {
        transporte: 50,
        gastronomia: 75,
        botella: 280
    };

    // Elementos del formulario
    const paqueteSelect = document.getElementById('paquete');
    const personasSelect = document.getElementById('personas');
    const serviciosCheckboxes = document.querySelectorAll('input[name="servicios[]"]');
    const totalPrecioElement = document.getElementById('total-precio');

    // Función para calcular precio total
    function calcularTotal() {
        let total = 0;
        
        // Precio base del paquete seleccionado
        const paqueteSeleccionado = paqueteSelect.value;
        if (paqueteSeleccionado && PRECIOS[paqueteSeleccionado]) {
            total = PRECIOS[paqueteSeleccionado];
        }

        // Multiplicar por número de personas
        const numPersonas = parseInt(personasSelect.value) || 1;
        total *= numPersonas;

        // Agregar servicios adicionales
        serviciosCheckboxes.forEach(checkbox => {
            if (checkbox.checked && SERVICIOS_ADICIONALES[checkbox.value]) {
                total += SERVICIOS_ADICIONALES[checkbox.value];
            }
        });

        // Actualizar el precio mostrado
        totalPrecioElement.textContent = `${total}€`;
        
        return total;
    }

    // Event listeners para actualizar precio en tiempo real
    if (paqueteSelect) {
        paqueteSelect.addEventListener('change', calcularTotal);
    }
    
    if (personasSelect) {
        personasSelect.addEventListener('change', calcularTotal);
    }

    serviciosCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calcularTotal);
    });

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const chevron = question.querySelector('i');

        question.addEventListener('click', () => {
            const isOpen = answer.style.display === 'block';
            
            // Cerrar todas las preguntas
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherChevron = otherItem.querySelector('.faq-question i');
                otherAnswer.style.display = 'none';
                otherChevron.style.transform = 'rotate(0deg)';
            });

            // Si no estaba abierta, abrir esta
            if (!isOpen) {
                answer.style.display = 'block';
                chevron.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Smooth scroll para los botones de reservar
    const botonesReservar = document.querySelectorAll('.btn-reservar');
    botonesReservar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el tipo de entrada del botón
            const card = this.closest('.paquete-card');
            let tipoEntrada = 'general';
            
            if (card.classList.contains('premium')) {
                tipoEntrada = 'premium';
            } else if (card.classList.contains('vip')) {
                tipoEntrada = 'vip';
            }
            
            // Preseleccionar el paquete en el formulario
            if (paqueteSelect) {
                paqueteSelect.value = tipoEntrada;
                calcularTotal();
            }
            
            // Scroll hacia el formulario
            const formulario = document.querySelector('.formulario-reserva');
            if (formulario) {
                formulario.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Validación y envío del formulario
    const formularioReserva = document.querySelector('.reserva-form');
    if (formularioReserva) {
        formularioReserva.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const fecha = document.getElementById('fecha').value;
            const paquete = paqueteSelect.value;
            const terminos = document.querySelector('input[name="terminos"]').checked;

            if (!nombre || !email || !telefono || !fecha || !paquete || !terminos) {
                mostrarNotificacion('Por favor, completa todos los campos obligatorios', 'error');
                return;
            }

            // Validar fecha (no puede ser en el pasado)
            const fechaSeleccionada = new Date(fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaSeleccionada < hoy) {
                mostrarNotificacion('La fecha debe ser posterior a hoy', 'error');
                return;
            }

            // Simular envío del formulario
            mostrarCargando();
            
            setTimeout(() => {
                ocultarCargando();
                mostrarNotificacion('¡Reserva enviada correctamente! Te contactaremos pronto para confirmar los detalles.', 'success');
                formularioReserva.reset();
                calcularTotal();
            }, 2000);
        });
    }

    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <div class="notificacion-content">
                <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                <span>${mensaje}</span>
            </div>
        `;

        // Estilos inline para la notificación
        notificacion.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background: ${tipo === 'success' ? 'rgba(76, 175, 80, 0.95)' : tipo === 'error' ? 'rgba(244, 67, 54, 0.95)' : 'rgba(33, 150, 243, 0.95)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notificacion);

        // Animar entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 5 segundos
        setTimeout(() => {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 5000);
    }

    // Función para mostrar estado de carga
    function mostrarCargando() {
        const botonEnviar = document.querySelector('.btn-enviar');
        if (botonEnviar) {
            botonEnviar.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <span>Procesando...</span>
            `;
            botonEnviar.disabled = true;
            botonEnviar.style.opacity = '0.7';
        }
    }

    // Función para ocultar estado de carga
    function ocultarCargando() {
        const botonEnviar = document.querySelector('.btn-enviar');
        if (botonEnviar) {
            botonEnviar.innerHTML = `
                <i class="fas fa-lock"></i>
                <span>Confirmar Reserva Segura</span>
            `;
            botonEnviar.disabled = false;
            botonEnviar.style.opacity = '1';
        }
    }

    // Efectos de hover para las tarjetas de paquetes
    const paqueteCards = document.querySelectorAll('.paquete-card');
    paqueteCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Agregar efecto de glow
            this.style.boxShadow = '0 20px 80px rgba(212, 175, 55, 0.2)';
        });

        card.addEventListener('mouseleave', function() {
            // Remover efecto de glow
            this.style.boxShadow = '';
        });
    });

    // Animación de aparición progresiva para las secciones
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Aplicar observador a elementos que queremos animar
    const elementosAnimados = document.querySelectorAll('.paquete-card, .servicio-adicional, .paso, .politica-card');
    elementosAnimados.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observador.observe(el);
    });

    // Establecer fecha mínima en el input de fecha (hoy)
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const hoy = new Date();
        const fechaMinima = hoy.toISOString().split('T')[0];
        fechaInput.min = fechaMinima;
    }

    // Efecto de particles en el hero (opcional)
    createParticles();

    function createParticles() {
        const hero = document.querySelector('.entradas-hero');
        if (!hero) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: ${Math.random() > 0.5 ? '#d4af37' : '#ff6b9d'};
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: float ${Math.random() * 10 + 15}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            hero.appendChild(particle);
        }
    }

    // CSS para la animación de partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(-100vh) rotate(360deg); }
        }
        
        .notificacion-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);

    // Inicializar precio total
    calcularTotal();
});
