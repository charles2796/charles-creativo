/* ==========================================================
   script.js — lógica compartida de todo el sitio.
   Cada bloque comprueba que sus elementos existan antes de
   engancharse, así este mismo archivo sirve para todas las
   páginas (index, portafolio, categorías, contacto, etc.)
   sin duplicar código ni romper páginas que no tienen cierto
   componente (slider, filtros, canvas...).
   ========================================================== */

// ── SCROLL REVEAL ────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      // Animar barras de habilidades dentro del bloque revelado
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w;
      });
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => obs.observe(r));

// Respaldo: activa las barras de habilidad también si su sección ya es visible
document.querySelectorAll('.skill-fill').forEach(bar => {
  const sectionObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) bar.style.width = bar.dataset.w;
  }, { threshold: 0.3 });
  sectionObs.observe(bar);
});

// ── FILTRO DE PORTAFOLIO (solo existe en index.html) ─────
const filterBtns = document.querySelectorAll('.filter-btn');
const portItems = document.querySelectorAll('.port-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;

    const categoryCounts = {};
    portItems.forEach(item => {
      if (f === 'all') {
        const cat = item.dataset.cat;
        if (!categoryCounts[cat]) categoryCounts[cat] = 0;

        item.style.display = categoryCounts[cat] < 3 ? '' : 'none';
        if (item.style.display === '') categoryCounts[cat]++;
      } else {
        item.style.display = item.dataset.cat === f ? '' : 'none';
      }
    });
  });
});
document.querySelector('.filter-btn.active')?.click();

// ── NAV: fondo al hacer scroll + sección activa ──────────
const nav = document.querySelector('nav');
const sectionIds = document.querySelectorAll('section[id]');
const menuLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  if (nav) {
    nav.style.background = window.scrollY > 60
      ? 'rgba(12,12,12,.97)'
      : 'linear-gradient(to bottom, rgba(12,12,12,.95) 0%, transparent 100%)';
  }

  let current = '';
  sectionIds.forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) {
      current = section.getAttribute('id');
    }
  });

  menuLinks.forEach(link => {
    link.classList.remove('active');
    if (current && link.getAttribute('href')?.includes(current)) {
      link.classList.add('active');
    }
  });
});

// ── FONDO DE PARTÍCULAS ──────────────────────────────────
const canvas = document.getElementById('bgCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 55;
  const ORANGE = '226,103,46';

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.r = Math.random() * 1.2 + 0.2;          // tamaño diminuto
      this.vy = -(Math.random() * 0.25 + 0.08);    // deriva lenta hacia arriba
      this.vx = (Math.random() - 0.5) * 0.12;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.type = Math.random() < 0.25 ? 'line' : 'dot'; // 25% son líneas cortas
      this.len = Math.random() * 18 + 6;
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
      const a = alpha * 0.18; // muy sutil

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

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  function animCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animCanvas);
  }
  animCanvas();
}

// ── MENÚ MÓVIL ────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── SLIDER DE PORTAFOLIO (páginas de categoría) ──────────
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');
  if (!slider) return; // esta página no tiene slider

  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.dots');
  const btnNext = document.querySelector('.hero-slider .next');
  const btnPrev = document.querySelector('.hero-slider .prev');
  if (!slides.length || !dotsContainer || !btnNext || !btnPrev) return;

  let index = 0;
  let interval;

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

  function next() { goTo((index + 1) % slides.length); }
  function prev() { goTo((index - 1 + slides.length) % slides.length); }

  btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

  // Click a la derecha/izquierda del slide para avanzar/retroceder
  slider.addEventListener('click', (e) => {
    if (e.target.closest('.content, img, button')) return;
    const mid = window.innerWidth / 2;
    e.clientX > mid ? next() : prev();
  });

  function startAuto() { interval = setInterval(next, 5000); }
  function resetAuto() { clearInterval(interval); startAuto(); }

  startAuto();
});

// ── ACCESIBILIDAD (contraste, tamaño de fuente, lector) ──
document.addEventListener('DOMContentLoaded', () => {
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

  accBtn.addEventListener('click', () => accPanel.classList.toggle('active'));

  document.addEventListener('click', (e) => {
    if (accPanel.classList.contains('active') && !accPanel.contains(e.target) && e.target !== accBtn) {
      accPanel.classList.remove('active');
    }
  });

  let elementToHighlight = null;
  let originalText = '';

  document.getElementById('btn-contrast').addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });

  document.getElementById('btn-fontsize').addEventListener('click', () => {
    document.body.classList.toggle('font-large');
  });

  document.getElementById('btn-reader').addEventListener('click', () => {
    // Si ya se está leyendo algo, detenerlo y restaurar el texto original
    if (elementToHighlight) {
      elementToHighlight.textContent = originalText;
    }
    window.speechSynthesis.cancel();

    elementToHighlight = null;
    originalText = '';

    let targetEl = null;
    const activeSlideLabel = document.querySelector('.hero-slide.active .slide-label');
    const mainTitle = document.querySelector('h1, h2');

    if (activeSlideLabel) targetEl = activeSlideLabel;
    else if (mainTitle) targetEl = mainTitle;

    const textToRead = targetEl ? targetEl.textContent : document.title;
    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';

    // Solo resaltar si el elemento no tiene hijos complejos (evita romper el diseño)
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
