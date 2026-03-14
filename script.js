﻿﻿﻿const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e,i) => {
    if(e.isIntersecting){
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      // Animate skill bars
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w;
      });
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => obs.observe(r));

// Also trigger skill bars when about section visible
document.querySelectorAll('.skill-fill').forEach(bar => {
  const sectionObs = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting) bar.style.width = bar.dataset.w;
  }, {threshold: 0.3});
  sectionObs.observe(bar);
});

// Nav scroll style
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.style.background = window.scrollY > 60
    ? 'rgba(12,12,12,.97)'
    : 'linear-gradient(to bottom, rgba(12,12,12,.95) 0%, transparent 100%)';
});
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const footers = document.querySelectorAll('footer');
  if (!footers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.2 });

  footers.forEach((footer) => observer.observe(footer));
});

/* ===== SLIDER NUEVO ===== */

document.addEventListener('DOMContentLoaded', () => {

const slides = document.querySelectorAll('.hero-slide');
const slider = document.getElementById('slider');
const dotsContainer = document.querySelector('.dots');

if (!slider) return; // Evita errores si el slider no existe en la pagina actual

let index = 0;
let interval;

// Crear dots
slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(i);
  });
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function goTo(i) {
  slides[index].classList.remove('active');
  dots[index].classList.remove('active');

  index = i;

  slides[index].classList.add('active');
  dots[index].classList.add('active');

  resetAuto();
}

function next() {
  goTo((index + 1) % slides.length);
}

function prev() {
  goTo((index - 1 + slides.length) % slides.length);
}

// Flechas
document.querySelector('.next').addEventListener('click', (e) => {
  e.stopPropagation();
  next();
});

document.querySelector('.prev').addEventListener('click', (e) => {
  e.stopPropagation();
  prev();
});

// Click en el slide (derecha / izquierda)
slider.addEventListener('click', (e) => {
  // evita clicks en texto o imagen
  if (e.target.closest('.content, img, button')) return;

  const mid = window.innerWidth / 2;
  e.clientX > mid ? next() : prev();
});

// Autoplay
function startAuto() {
  interval = setInterval(next, 5000);
}

function resetAuto() {
  clearInterval(interval);
  startAuto();
}

startAuto();

});

/* ===== SLIDER NUEVO FIN ===== */

/* ===== ACCESIBILIDAD ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Crear botón y panel
  const accBtn = document.createElement('button');
  accBtn.className = 'acc-toggle';
  accBtn.innerHTML = '♿';
  accBtn.setAttribute('aria-label', 'Opciones de accesibilidad');
  document.body.appendChild(accBtn);

  const accPanel = document.createElement('div');
  accPanel.className = 'acc-panel';
  accPanel.innerHTML = `
    <button class="acc-btn" id="btn-contrast">👁️ Alto Contraste</button>
    <button class="acc-btn" id="btn-fontsize">A⁺ Aumentar Fuente</button>
    <button class="acc-btn" id="btn-reader">🔊 Leer Texto</button>
  `;
  document.body.appendChild(accPanel);

  // Toggle Panel
  accBtn.addEventListener('click', () => accPanel.classList.toggle('active'));

  // Close panel on outside click
  document.addEventListener('click', (e) => {
    if (accPanel.classList.contains('active') && !accPanel.contains(e.target) && e.target !== accBtn) {
      accPanel.classList.remove('active');
    }
  });

  // Variable para highlighting
  let elementToHighlight = null;
  let originalText = '';

  // 1. Alto Contraste
  document.getElementById('btn-contrast').addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });

  // 2. Aumentar Fuente
  document.getElementById('btn-fontsize').addEventListener('click', () => {
    document.body.classList.toggle('font-large');
  });

  // 3. Lector de Pantalla (TTS) con highlighting
  document.getElementById('btn-reader').addEventListener('click', () => {
    // Si se está leyendo algo, detenerlo y restaurar el texto original
    if (elementToHighlight) {
      elementToHighlight.textContent = originalText;
    }
    window.speechSynthesis.cancel();

    elementToHighlight = null; // Resetear global
    originalText = '';

    let targetEl = null;
    const activeSlideLabel = document.querySelector('.hero-slide.active .slide-label');
    const mainTitle = document.querySelector('h1, h2');

    if (activeSlideLabel) targetEl = activeSlideLabel;
    else if (mainTitle) targetEl = mainTitle;

    let textToRead = targetEl ? targetEl.textContent : document.title;

    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES'; // Español

    // Solo resaltar si el elemento no tiene hijos complejos (tags HTML) para evitar romper el diseño
    if (targetEl && targetEl.children.length === 0) {
      elementToHighlight = targetEl;
      originalText = textToRead;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const { charIndex, charLength } = event;
          elementToHighlight.innerHTML =
            originalText.substring(0, charIndex) +
            `<span class="tts-highlight">${originalText.substring(charIndex, charIndex + charLength)}</span>` +
            originalText.substring(charIndex + charLength);
        }
      };

      utterance.onend = () => {
        if (elementToHighlight) {
          elementToHighlight.textContent = originalText;
          elementToHighlight = null;
          originalText = '';
        }
      };
    }

    window.speechSynthesis.speak(utterance);
  });
});

// --- CÓDIGO AÑADIDO DE MAIN.JS PARA CONSISTENCIA ---
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 55;
    const ORANGE = '242,101,34';

    class Particle {
      constructor() { this.reset(true); }
      reset(initial) {
        this.x  = Math.random() * canvas.width;
        this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.r  = Math.random() * 1.2 + 0.2;
        this.vy = -(Math.random() * 0.25 + 0.08);
        this.vx = (Math.random() - 0.5) * 0.12;
        this.life   = 0;
        this.maxLife = Math.random() * 300 + 200;
        this.type = Math.random() < 0.25 ? 'line' : 'dot';
        this.len  = Math.random() * 18 + 6;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life > this.maxLife || this.y < -20) this.reset(false);
      }
      draw() {
        const progress = this.life / this.maxLife;
        const alpha = progress < 0.15 ? progress / 0.15 : progress > 0.75 ? (1 - progress) / 0.25 : 1;
        const a = alpha * 0.18;

        ctx.save();
        if (this.type === 'dot') {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ORANGE},${a})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + this.vx * 20, this.y + this.len);
          ctx.strokeStyle = `rgba(${ORANGE},${a * 0.6})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    const particles = Array.from({length: PARTICLE_COUNT}, () => new Particle());

    function animCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animCanvas);
    }
    animCanvas();
  }

  // Mobile Nav
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }
});
