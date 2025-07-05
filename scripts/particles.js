// ===============================
// PARTICLES SYSTEM
// ===============================

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseMoving = false;
    
    this.settings = {
      particleCount: 100,
      particleSize: 2,
      connectionDistance: 100,
      speed: 0.5,
      colors: ['#00d4ff', '#ff2f87', '#39ff14', '#bc13fe']
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.settings.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.settings.speed,
        vy: (Math.random() - 0.5) * this.settings.speed,
        color: this.settings.colors[Math.floor(Math.random() * this.settings.colors.length)],
        size: Math.random() * this.settings.particleSize + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.isMouseMoving = true;
      
      setTimeout(() => {
        this.isMouseMoving = false;
      }, 100);
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.isMouseMoving = false;
    });
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off walls
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
      
      // Mouse interaction
      if (this.isMouseMoving) {
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += dx * force * 0.01;
          particle.vy += dy * force * 0.01;
        }
      }
      
      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Keep particles within bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    });
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fill();
    });
  }
  
  drawConnections() {
    this.particles.forEach((particle, i) => {
      this.particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.settings.connectionDistance) {
          const alpha = (this.settings.connectionDistance - distance) / this.settings.connectionDistance;
          
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${alpha * 0.3})`;
          this.ctx.lineWidth = 1;
          this.ctx.globalAlpha = alpha;
          this.ctx.stroke();
        }
      });
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
    
    requestAnimationFrame(() => this.animate());
  }
}

// ===============================
// MATRIX RAIN EFFECT
// ===============================

class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()";
    this.drops = [];
    this.fontSize = 12;
    this.columns = 0;
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createDrops();
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.createDrops();
  }
  
  createDrops() {
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * this.canvas.height;
    }
  }
  
  animate() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#00d4ff';
    this.ctx.font = `${this.fontSize}px monospace`;
    
    for (let i = 0; i < this.drops.length; i++) {
      const text = this.matrix[Math.floor(Math.random() * this.matrix.length)];
      this.ctx.fillText(text, i * this.fontSize, this.drops[i]);
      
      if (this.drops[i] > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i] += this.fontSize;
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// ===============================
// GEOMETRIC BACKGROUND
// ===============================

class GeometricBackground {
  constructor(container) {
    this.container = container;
    this.shapes = [];
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.init();
  }
  
  init() {
    this.createShapes();
    this.bindEvents();
    this.animate();
  }
  
  createShapes() {
    const shapeCount = 20;
    
    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement('div');
      shape.className = 'floating-shape';
      shape.style.position = 'absolute';
      shape.style.width = Math.random() * 100 + 20 + 'px';
      shape.style.height = Math.random() * 100 + 20 + 'px';
      shape.style.background = `linear-gradient(45deg, 
        rgba(0, 212, 255, 0.1), 
        rgba(255, 43, 135, 0.1))`;
      shape.style.borderRadius = Math.random() * 50 + '%';
      shape.style.left = Math.random() * 100 + '%';
      shape.style.top = Math.random() * 100 + '%';
      shape.style.animation = `float ${Math.random() * 20 + 10}s linear infinite`;
      shape.style.animationDelay = Math.random() * 10 + 's';
      
      this.container.appendChild(shape);
      this.shapes.push({
        element: shape,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 100 + 20
      });
    }
  }
  
  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }
  
  animate() {
    this.shapes.forEach(shape => {
      const dx = this.mouseX - shape.x;
      const dy = this.mouseY - shape.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        const force = (200 - distance) / 200;
        shape.vx += dx * force * 0.001;
        shape.vy += dy * force * 0.001;
      }
      
      shape.x += shape.vx;
      shape.y += shape.vy;
      
      shape.element.style.transform = `translate(${shape.x}px, ${shape.y}px)`;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ===============================
// INITIALIZATION
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize particle system
  const particlesCanvas = document.getElementById('particles-canvas');
  if (particlesCanvas) {
    new ParticleSystem(particlesCanvas);
  }
  
  // Initialize geometric background
  const geometricBg = document.querySelector('.geometric-bg');
  if (geometricBg) {
    new GeometricBackground(geometricBg);
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    // Clean up any running animations
    if (window.particleSystem) {
      window.particleSystem = null;
    }
  });
});

// ===============================
// PERFORMANCE OPTIMIZATION
// ===============================

// Throttle function for performance
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
  };
}

// Debounce function for performance
function debounce(func, wait, immediate) {
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ParticleSystem,
    MatrixRain,
    GeometricBackground,
    throttle,
    debounce
  };
}
