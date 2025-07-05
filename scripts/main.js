// ===============================
// MAIN JAVASCRIPT - DEVSPACE
// ===============================

class DevSpace {
  constructor() {
    this.init();
    this.bindEvents();
    this.initAOS();
    this.startLoading();
  }
  
  init() {
    this.navbar = document.getElementById('navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.getElementById('nav-menu');
    this.backToTop = document.getElementById('back-to-top');
    this.contactForm = document.getElementById('contact-form');
    this.loadingScreen = document.getElementById('loading-screen');
    
    this.isMenuOpen = false;
    this.scrollPosition = 0;
    this.isScrolling = false;
    
    this.setupSmoothScroll();
    this.setupFormValidation();
    this.setupTypewriterEffect();
    this.setupScrollAnimations();
  }
  
  bindEvents() {
    // Navigation events
    this.hamburger?.addEventListener('click', () => this.toggleMenu());
    
    // Scroll events
    window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));
    
    // Back to top button
    this.backToTop?.addEventListener('click', () => this.scrollToTop());
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });
    
    // Form submission
    this.contactForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));
    
    // Real-time form validation
    this.contactForm?.addEventListener('input', (e) => this.validateField(e.target));
    
    // Resize events
    window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    
    // Click outside menu
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }
  
  // ===============================
  // LOADING SCREEN
  // ===============================
  
  startLoading() {
    setTimeout(() => {
      this.loadingScreen?.classList.add('hidden');
      
      // Initialize animations after loading
      setTimeout(() => {
        this.initAnimations();
      }, 500);
    }, 2000);
  }
  
  initAnimations() {
    // Add entrance animations to elements
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(el => {
      el.classList.add('aos-animate');
    });
    
    // Start typewriter effect
    this.startTypewriter();
  }
  
  // ===============================
  // NAVIGATION
  // ===============================
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.hamburger?.classList.toggle('active');
    this.navMenu?.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
  
  closeMenu() {
    this.isMenuOpen = false;
    this.hamburger?.classList.remove('active');
    this.navMenu?.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        this.scrollToElement(target);
        this.closeMenu();
        this.updateActiveNav(href);
      }
    }
  }
  
  updateActiveNav(activeHref) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === activeHref) {
        link.classList.add('active');
      }
    });
  }
  
  handleOutsideClick(e) {
    if (this.isMenuOpen && 
        !this.navMenu?.contains(e.target) && 
        !this.hamburger?.contains(e.target)) {
      this.closeMenu();
    }
  }
  
  // ===============================
  // SCROLL HANDLING
  // ===============================
  
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Update scroll position
    this.scrollPosition = scrollTop;
    
    // Update navbar appearance
    this.updateNavbar(scrollTop);
    
    // Update back to top button
    this.updateBackToTop(scrollTop);
    
    // Update active navigation
    this.updateActiveNavOnScroll();
    
    // Parallax effects
    this.handleParallax(scrollTop);
  }
  
  updateNavbar(scrollTop) {
    if (scrollTop > 50) {
      this.navbar?.classList.add('scrolled');
    } else {
      this.navbar?.classList.remove('scrolled');
    }
  }
  
  updateBackToTop(scrollTop) {
    if (scrollTop > 300) {
      this.backToTop?.classList.add('visible');
    } else {
      this.backToTop?.classList.remove('visible');
    }
  }
  
  updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.updateActiveNav(`#${sectionId}`);
      }
    });
  }
  
  handleParallax(scrollTop) {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const parallaxSpeed = 0.5;
      heroSection.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
    }
    
    // Parallax for floating shapes
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    shapes.forEach((shape, index) => {
      const speed = 0.2 + (index * 0.1);
      shape.style.transform = `translateY(${scrollTop * speed}px)`;
    });
  }
  
  // ===============================
  // SMOOTH SCROLLING
  // ===============================
  
  setupSmoothScroll() {
    // Enable smooth scrolling for the document
    document.documentElement.style.scrollBehavior = 'smooth';
  }
  
  scrollToElement(element) {
    const offsetTop = element.offsetTop - 70; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
  
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // ===============================
  // TYPEWRITER EFFECT
  // ===============================
  
  setupTypewriterEffect() {
    this.typewriterElement = document.querySelector('.typewriter');
    this.typewriterText = 'una línea de código a la vez';
    this.typewriterIndex = 0;
    this.typewriterSpeed = 100;
    this.isTyping = false;
  }
  
  startTypewriter() {
    if (!this.typewriterElement || this.isTyping) return;
    
    this.isTyping = true;
    this.typewriterElement.textContent = '';
    this.typewriterIndex = 0;
    
    this.typeNextChar();
  }
  
  typeNextChar() {
    if (this.typewriterIndex < this.typewriterText.length) {
      this.typewriterElement.textContent += this.typewriterText.charAt(this.typewriterIndex);
      this.typewriterIndex++;
      setTimeout(() => this.typeNextChar(), this.typewriterSpeed);
    } else {
      this.isTyping = false;
      // Restart after delay
      setTimeout(() => this.startTypewriter(), 3000);
    }
  }
  
  // ===============================
  // FORM VALIDATION
  // ===============================
  
  setupFormValidation() {
    this.validators = {
      name: (value) => {
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return null;
      },
      email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'El email es requerido';
        if (!emailRegex.test(value)) return 'Por favor ingresa un email válido';
        return null;
      },
      subject: (value) => {
        if (!value) return 'Por favor selecciona un asunto';
        return null;
      },
      message: (value) => {
        if (!value.trim()) return 'El mensaje es requerido';
        if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
        return null;
      }
    };
  }
  
  validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (this.validators[fieldName]) {
      const error = this.validators[fieldName](fieldValue);
      
      if (error) {
        field.classList.add('error');
        if (errorElement) {
          errorElement.textContent = error;
          errorElement.style.display = 'block';
        }
        return false;
      } else {
        field.classList.remove('error');
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
        return true;
      }
    }
    
    return true;
  }
  
  validateForm() {
    const fields = this.contactForm.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  handleFormSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      this.showFormError('Por favor corrige los errores en el formulario');
      return;
    }
    
    // Show loading state
    const submitButton = this.contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      this.showFormSuccess('¡Mensaje enviado exitosamente! Te contactaremos pronto.');
      this.contactForm.reset();
      
      // Reset button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      
      // Clear all error messages
      const errorElements = this.contactForm.querySelectorAll('.error-message');
      errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
      });
      
      // Remove error classes
      const fields = this.contactForm.querySelectorAll('input, select, textarea');
      fields.forEach(field => field.classList.remove('error'));
      
    }, 2000);
  }
  
  showFormSuccess(message) {
    this.showNotification(message, 'success');
  }
  
  showFormError(message) {
    this.showNotification(message, 'error');
  }
  
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      max-width: 400px;
      animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
  
  // ===============================
  // SCROLL ANIMATIONS
  // ===============================
  
  setupScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animateElements = document.querySelectorAll('.tech-card, .portfolio-card, .team-card');
    animateElements.forEach(el => observer.observe(el));
  }
  
  // ===============================
  // AOS INITIALIZATION
  // ===============================
  
  initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        delay: 100,
        easing: 'ease-out-quart'
      });
    }
  }
  
  // ===============================
  // RESIZE HANDLING
  // ===============================
  
  handleResize() {
    // Close mobile menu on resize
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMenu();
    }
    
    // Refresh AOS
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }
  
  // ===============================
  // KEYBOARD NAVIGATION
  // ===============================
  
  handleKeydown(e) {
    // Close menu with Escape key
    if (e.key === 'Escape' && this.isMenuOpen) {
      this.closeMenu();
    }
    
    // Navigate with arrow keys
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateWithKeyboard(e.key === 'ArrowUp' ? -1 : 1);
    }
  }
  
  navigateWithKeyboard(direction) {
    const sections = document.querySelectorAll('section[id]');
    const currentIndex = this.getCurrentSectionIndex();
    let nextIndex = currentIndex + direction;
    
    if (nextIndex < 0) nextIndex = sections.length - 1;
    if (nextIndex >= sections.length) nextIndex = 0;
    
    const nextSection = sections[nextIndex];
    if (nextSection) {
      this.scrollToElement(nextSection);
    }
  }
  
  getCurrentSectionIndex() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        return i;
      }
    }
    
    return 0;
  }
  
  // ===============================
  // UTILITY FUNCTIONS
  // ===============================
  
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

// ===============================
// ADDITIONAL UTILITIES
// ===============================

// Lazy loading for images
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          lazyImageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => lazyImageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

// Performance monitoring
function initPerformanceMonitoring() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      // Report to analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_time', {
          value: loadTime,
          custom_parameter: 'performance'
        });
      }
    });
  }
}

// ===============================
// INITIALIZATION
// ===============================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main app
  window.devSpace = new DevSpace();
  
  // Initialize additional features
  initLazyLoading();
  initPerformanceMonitoring();
  
  // Add custom CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 0.25rem;
      margin-left: auto;
    }
    
    .error {
      border-color: #e74c3c !important;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
    console.log('Page hidden - pausing animations');
  } else {
    // Resume animations when tab becomes visible
    console.log('Page visible - resuming animations');
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DevSpace;
}
