// Navigation Menu Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const bars = navToggle.children;
        if (navMenu.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'rotate(0) translate(0, 0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    });
}

// Close menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        
        // Reset hamburger
        const bars = navToggle.children;
        bars[0].style.transform = 'rotate(0) translate(0, 0)';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'rotate(0) translate(0, 0)';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(212, 175, 55, 0.2)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Active navigation link highlighting
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '#f5f3f0';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = '#d4af37';
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0s';
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.lugar-item, .chica-card, .evento-card, .servicio-card, .entrada-card').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

// Ticket purchase buttons
document.querySelectorAll('.btn-comprar').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get ticket type from parent element
        const ticketCard = this.closest('.entrada-card');
        const ticketType = ticketCard.querySelector('h3').textContent;
        const ticketPrice = ticketCard.querySelector('.precio-entrada').textContent;
        
        // Add loading state
        const originalText = this.textContent;
        this.textContent = 'Procesando...';
        this.style.opacity = '0.7';
        this.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showNotification(`¡Entrada ${ticketType} (${ticketPrice}) agregada al carrito!`, 'success');
            
            // Reset button
            this.textContent = originalText;
            this.style.opacity = '1';
            this.disabled = false;
        }, 2000);
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)' : 'linear-gradient(135deg, #ff6b9d 0%, #ffd700 100%)'};
        color: #000;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Calendar events interaction
document.querySelectorAll('.evento-card').forEach(card => {
    card.addEventListener('click', function() {
        const eventName = this.querySelector('h3').textContent;
        const eventDate = this.querySelector('.dia').textContent + ' ' + this.querySelector('.mes').textContent;
        const eventPrice = this.querySelector('.evento-precio span').textContent;
        
        showEventDetails(eventName, eventDate, eventPrice);
    });
});

function showEventDetails(name, date, price) {
    const modal = document.createElement('div');
    modal.className = 'event-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${name}</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p><strong>Fecha:</strong> ${date}</p>
                <p><strong>Precio:</strong> ${price}</p>
                <p><strong>Descripción:</strong> Evento exclusivo en Club Pandora. Una noche única llena de elegancia, música y entretenimiento de primera clase.</p>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="showNotification('¡Reserva confirmada para ${name}!', 'success'); closeModal()">Reservar Ahora</button>
                    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: linear-gradient(145deg, #000000 0%, #0a0a0a 50%, #111111 100%);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        border: 1px solid rgba(212, 175, 55, 0.3);
        box-shadow: 0 20px 60px rgba(212, 175, 55, 0.3);
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    window.closeModal = () => {
        document.body.removeChild(modal);
    };
}

// Service cards hover effects
document.querySelectorAll('.servicio-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        this.style.boxShadow = '0 30px 60px rgba(212, 175, 55, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.transform = `translateY(${scrolled * -0.3}px)`;
    }
});

// Loading screen
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <img src="pandoralogo.jpeg" alt="Club Pandora" class="loader-logo">
            <div class="loader-text">Club Pandora</div>
            <div class="loader-subtitle">Cargando experiencia exclusiva...</div>
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #111111 50%, #0a0a0a 75%, #000000 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
        text-align: center;
    `;
    
    document.body.appendChild(loader);
    
    // Simulate loading
    let progress = 0;
    const progressBar = loader.querySelector('.loader-progress');
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                }, 500);
            }, 500);
        }
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }, 100);
});

// Add some dynamic styles for the loader
const loaderStyles = document.createElement('style');
loaderStyles.textContent = `
    .loader-logo {
        width: 100px;
        height: 100px;
        border-radius: 15px;
        margin-bottom: 30px;
        filter: drop-shadow(0 0 20px rgba(255, 107, 157, 0.5));
        animation: logoSpin 2s ease-in-out infinite;
    }
    
    @keyframes logoSpin {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(5deg); }
    }
    
    .loader-text {
        font-family: 'Playfair Display', serif;
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #ffffff 0%, #ffd700 40%, #d4af37 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 10px;
    }
    
    .loader-subtitle {
        color: #e8e0d0;
        opacity: 0.8;
        margin-bottom: 30px;
    }
    
    .loader-bar {
        width: 300px;
        height: 4px;
        background: rgba(212, 175, 55, 0.2);
        border-radius: 2px;
        overflow: hidden;
        margin: 0 auto;
    }
    
    .loader-progress {
        height: 100%;
        background: linear-gradient(90deg, #d4af37, #ffd700);
        border-radius: 2px;
        transition: width 0.3s ease;
        width: 0%;
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(400px); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(loaderStyles);

// Console welcome message
console.log(`
%c
    ╔═══════════════════════════════════════╗
    ║           🌟 CLUB PANDORA 🌟          ║
    ║                                       ║
    ║     WHERE BEAUTY MEETS ELEGANCE       ║
    ║                                       ║
    ║        Palma de Mallorca              ║
    ║      La experiencia más exclusiva     ║
    ╚═══════════════════════════════════════╝

`, 'color: #d4af37; font-family: monospace; font-size: 12px;');

console.log('%c✨ Bienvenido al código fuente de Club Pandora ✨', 'color: #ff6b9d; font-size: 16px; font-weight: bold;');
