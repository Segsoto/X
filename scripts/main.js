/**
 * BMWebSolutions CR - Main JavaScript File
 * Desarrollado por Brandon Soto y Manfred Zuñiga
 * Funcionalidades principales del sitio web
 */

// ============================
// 1. INICIALIZACIÓN Y CONFIGURACIÓN
// ============================

// Configuración global
const CONFIG = {
    particlesCount: 100,
    animationSpeed: 0.02,
    scrollOffset: 100,
    typewriterSpeed: 80,
    counterSpeed: 50,
    formDelay: 300
};

// Estado global de la aplicación
const APP_STATE = {
    isMenuOpen: false,
    isScrolled: false,
    currentTheme: 'dark',
    isFormSubmitting: false,
    particles: [],
    animationId: null
};

// ============================
// 2. DOM READY Y INICIALIZACIÓN
// ============================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BMWebSolutions CR - Inicializando...');
    
    // Inicializar todos los módulos
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeParticles();
    initializeHeroAnimations();
    initializeCounters();
    initializeTypewriter();
    initializeFormValidation();
    initializeAOS();
    initializeGSAP();
    initializeFloatingCV();
    initializeScrollToTop();
    
    console.log('✅ BMWebSolutions CR - Inicialización completa');
});

// ============================
// 3. SISTEMA DE TEMAS (DARK/LIGHT)
// ============================

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Aplicar tema guardado
    document.documentElement.setAttribute('data-theme', savedTheme);
    APP_STATE.currentTheme = savedTheme;
    updateThemeIcon();
    
    // Event listener para cambio de tema
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const newTheme = APP_STATE.currentTheme === 'dark' ? 'light' : 'dark';
    
    // Transición suave
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    APP_STATE.currentTheme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
    
    // Remover transición después de un tiempo
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 300);
    
    // Mostrar notificación
    showNotification(`Tema ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');
    
    if (APP_STATE.currentTheme === 'dark') {
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
    } else {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
    }
}

// ============================
// 4. NAVEGACIÓN Y MENÚ
// ============================

function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Toggle menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                closeMobileMenu();
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Resaltar enlace activo
    window.addEventListener('scroll', highlightActiveNavLink);
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    APP_STATE.isMenuOpen = !APP_STATE.isMenuOpen;
    
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
    
    if (navToggle) {
        navToggle.classList.toggle('active');
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = APP_STATE.isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    APP_STATE.isMenuOpen = false;
    
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    if (navToggle) {
        navToggle.classList.remove('active');
    }
    
    document.body.style.overflow = '';
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const scrolled = window.scrollY > 50;
    
    if (scrolled !== APP_STATE.isScrolled) {
        APP_STATE.isScrolled = scrolled;
        
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled);
        }
    }
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPos = window.scrollY + 200;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ============================
// 5. EFECTOS DE SCROLL Y ANIMACIONES
// ============================

function initializeScrollEffects() {
    // Smooth scroll para botones CTA
    const ctaButton = document.getElementById('cta-button');
    const portfolioButton = document.getElementById('portfolio-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const techSection = document.getElementById('technologies');
            if (techSection) {
                smoothScrollTo(techSection);
            }
        });
    }
    
    if (portfolioButton) {
        portfolioButton.addEventListener('click', () => {
            const portfolioSection = document.getElementById('portfolio');
            if (portfolioSection) {
                smoothScrollTo(portfolioSection);
            }
        });
    }
}

function smoothScrollTo(element) {
    if (!element) return;
    
    const targetPosition = element.offsetTop - 80;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// ============================
// 6. SISTEMA DE PARTÍCULAS (THREE.JS)
// ============================

function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    try {
        // Configurar Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Crear geometría de partículas
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = CONFIG.particlesCount;
        
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 5;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        // Material de partículas
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: '#00ff88',
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        // Crear mesh de partículas
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        camera.position.z = 2;
        
        // Animación de partículas
        function animateParticles() {
            const positions = particlesGeometry.attributes.position.array;
            
            for (let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                positions[i3 + 1] -= CONFIG.animationSpeed;
                
                if (positions[i3 + 1] < -2.5) {
                    positions[i3 + 1] = 2.5;
                }
            }
            
            particlesGeometry.attributes.position.needsUpdate = true;
            particlesMesh.rotation.y += 0.001;
            
            renderer.render(scene, camera);
            APP_STATE.animationId = requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
        
        // Responsive resize
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
        
    } catch (error) {
        console.warn('Three.js particles error:', error);
        // Fallback a partículas CSS
        initializeFallbackParticles();
    }
}

function initializeFallbackParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    // Crear partículas CSS como fallback
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'css-particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #00ff88;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        canvas.appendChild(particle);
    }
}

// ============================
// 7. ANIMACIONES DEL HERO
// ============================

function initializeHeroAnimations() {
    // Animación de entrada del hero
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 0.8s ease';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 600);
    }
    
    if (heroStats) {
        heroStats.style.opacity = '0';
        heroStats.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroStats.style.transition = 'all 0.8s ease';
            heroStats.style.opacity = '1';
            heroStats.style.transform = 'translateY(0)';
        }, 900);
    }
    
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroButtons.style.transition = 'all 0.8s ease';
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 1200);
    }
}

// ============================
// 8. CONTADORES ANIMADOS
// ============================

function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let countersActivated = false;
    
    function activateCounters() {
        if (countersActivated) return;
        
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;
        
        const rect = heroStats.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            countersActivated = true;
            
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const duration = 2000; // 2 segundos
                const steps = 60; // 60 frames
                const increment = target / steps;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    counter.textContent = Math.floor(current);
                }, duration / steps);
            });
        }
    }
    
    window.addEventListener('scroll', activateCounters);
    activateCounters(); // Check on load
}

// ============================
// 9. EFECTO TYPEWRITER
// ============================

function initializeTypewriter() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    
    let index = 0;
    
    function typeCharacter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeCharacter, CONFIG.typewriterSpeed);
        } else {
            // Agregar cursor parpadeante
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '|';
            typingElement.appendChild(cursor);
        }
    }
    
    // Iniciar después de un delay
    setTimeout(typeCharacter, 1500);
}

// ============================
// 10. VALIDACIÓN DE FORMULARIO
// ============================

function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const fieldName = field.name;
    const value = field.value.trim();
    
    clearFieldError(e);
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                showFieldError(field, 'El nombre debe tener al menos 2 caracteres');
                return false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Por favor ingrese un email válido');
                return false;
            }
            break;
            
        case 'subject':
            if (!value) {
                showFieldError(field, 'Por favor seleccione un asunto');
                return false;
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                showFieldError(field, 'El mensaje debe tener al menos 10 caracteres');
                return false;
            }
            break;
    }
    
    return true;
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    field.classList.remove('error');
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    field.classList.add('error');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (APP_STATE.isFormSubmitting) return;
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validar todos los campos
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Por favor corrija los errores en el formulario', 'error');
        return;
    }
    
    // Simular envío de formulario
    APP_STATE.isFormSubmitting = true;
    
    // Cambiar estado del botón
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mostrar éxito
        showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.', 'success');
        form.reset();
        
    } catch (error) {
        showNotification('Error al enviar el mensaje. Por favor intente nuevamente.', 'error');
    } finally {
        APP_STATE.isFormSubmitting = false;
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// ============================
// 11. INICIALIZACIÓN DE LIBRERÍAS
// ============================

function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }
}

function initializeGSAP() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animaciones con GSAP
        gsap.from('.hero-title .line-1', {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.5
        });
        
        gsap.from('.hero-title .line-2', {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.7
        });
        
        gsap.from('.hero-title .line-3', {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.9
        });
        
        // Animaciones con scroll trigger
        gsap.utils.toArray('.tech-category').forEach((category, index) => {
            gsap.from(category, {
                duration: 1,
                y: 100,
                opacity: 0,
                scrollTrigger: {
                    trigger: category,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
}

// ============================
// 12. BOTÓN FLOTANTE DE CV
// ============================

function initializeFloatingCV() {
    // Crear botón flotante de CV
    const cvButton = document.createElement('button');
    cvButton.className = 'floating-cv-btn';
    cvButton.innerHTML = '<i class="fas fa-download"></i> CV';
    cvButton.setAttribute('aria-label', 'Descargar CV');
    
    // Agregar estilos inline para el botón
    cvButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00ff88, #00cc6a);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 15px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
        transition: all 0.3s ease;
        transform: translateY(100px);
        opacity: 0;
    `;
    
    document.body.appendChild(cvButton);
    
    // Mostrar botón después del scroll
    function toggleCVButton() {
        const scrolled = window.scrollY > 500;
        
        if (scrolled) {
            cvButton.style.transform = 'translateY(0)';
            cvButton.style.opacity = '1';
        } else {
            cvButton.style.transform = 'translateY(100px)';
            cvButton.style.opacity = '0';
        }
    }
    
    window.addEventListener('scroll', toggleCVButton);
    
    // Evento click para descargar CV
    cvButton.addEventListener('click', () => {
        // Simular descarga de CV
        showNotification('CV descargado exitosamente', 'success');
        
        // Aquí iría la lógica real de descarga
        // const link = document.createElement('a');
        // link.href = 'path/to/cv.pdf';
        // link.download = 'BMWebSolutions_CV.pdf';
        // link.click();
    });
}

// ============================
// 13. SCROLL TO TOP
// ============================

function initializeScrollToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    function toggleBackToTop() {
        const scrolled = window.scrollY > 300;
        backToTopBtn.style.display = scrolled ? 'flex' : 'none';
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================
// 14. SISTEMA DE NOTIFICACIONES
// ============================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                type === 'error' ? 'exclamation-triangle' : 
                'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ============================
// 15. UTILIDADES Y HELPERS
// ============================

// Debounce function para optimizar eventos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para eventos de scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Detectar si el elemento está en el viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================
// 16. MANEJO DE ERRORES Y CLEANUP
// ============================

// Manejo global de errores
window.addEventListener('error', (e) => {
    console.error('Error capturado:', e.error);
    showNotification('Ha ocurrido un error. Por favor recargue la página.', 'error');
});

// Cleanup al cerrar la página
window.addEventListener('beforeunload', () => {
    if (APP_STATE.animationId) {
        cancelAnimationFrame(APP_STATE.animationId);
    }
});

// ============================
// 17. EVENTOS ADICIONALES
// ============================

// Lazy loading para imágenes
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Optimización de rendimiento
let ticking = false;

function updateAnimations() {
    // Actualizar animaciones aquí
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

// Eventos optimizados
window.addEventListener('scroll', throttle(requestTick, 16));
window.addEventListener('resize', debounce(() => {
    // Actualizar dimensiones y recalcular layouts
    location.reload();
}, 250));

// ============================
// 18. CONSOLE LOG PERSONALIZADO
// ============================

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🚀 BMWebSolutions CR - Sitio Web Cargado                 ║
║                                                              ║
║    Desarrollado por: Brandon Soto & Manfred Zuñiga          ║
║    Versión: 1.0.0                                           ║
║    Fecha: ${new Date().toLocaleDateString()}                                            ║
║                                                              ║
║    📌 Portafolio: GranimarCR, Taller Avena, Stone By Ric    ║
║    🌐 Tecnologías: HTML5, CSS3, JavaScript, Three.js, GSAP  ║
║    📱 Responsive: ✅ | Accesible: ✅ | PWA Ready: ✅        ║
║                                                              ║
║    ¿Necesitas un sitio web? ¡Contáctanos! 🇨🇷              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

// ============================
// FIN DEL ARCHIVO
// ============================
