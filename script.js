function ShowHide(){
  const container_1 = document.getElementsByClassName("container_1")[0];
  container_1.style.visibility =
    (container_1.style.visibility === "hidden" || container_1.style.visibility === "") ? "visible" : "hidden";
}

function ShowHide_2(){
  const container_2 = document.getElementsByClassName("container_2")[0];
  container_2.style.visibility =
    (container_2.style.visibility === "hidden" || container_2.style.visibility === "") ? "visible" : "hidden";
}

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const pageLoader = document.getElementById('page-loader');
  if (!pageLoader) return;

  const navigationEntry = performance.getEntriesByType('navigation')[0];
  const isReload = navigationEntry?.type === 'reload';
  let isFromSameSite = false;

  if (document.referrer) {
    try {
      isFromSameSite = new URL(document.referrer).origin === window.location.origin;
    } catch (_) {
      isFromSameSite = false;
    }
  }

  const shouldShowLoader = isReload || !isFromSameSite;
  if (!shouldShowLoader) {
    pageLoader.classList.add('is-hidden');
    document.body.classList.remove('loading-screen');
    return;
  }

  pageLoader.classList.remove('is-hidden');
  document.body.classList.add('loading-screen');

  setTimeout(() => {
    pageLoader.classList.add('is-hidden');
    document.body.classList.remove('loading-screen');
  }, 1000);
});

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

document.addEventListener('DOMContentLoaded', () => {
  const estudiosSection = document.querySelector('.estudios');
  if (!estudiosSection) return;

  const estudiosBtn = estudiosSection.querySelector('.estudios__es .btn.btn-1');
  const experienciaBtn = estudiosSection.querySelector('.experiencia .btn.btn-1');
  const container1 = estudiosSection.querySelector('.container_1');
  const container2 = estudiosSection.querySelector('.container_2');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      setTimeout(() => {
        if (estudiosBtn && container1 && getComputedStyle(container1).visibility === 'hidden') {
          estudiosBtn.click();
        }
        if (experienciaBtn && container2 && getComputedStyle(container2).visibility === 'hidden') {
          experienciaBtn.click();
        }
      }, 1000);

      obs.disconnect();
    });
  }, { threshold: 0.35 });

  observer.observe(estudiosSection);
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
