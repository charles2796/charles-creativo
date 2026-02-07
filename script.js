function ShowHide(){
  const container_1 = document.getElementsByClassName("container_1")[0];
  container_1.style.visibility =
    container_1.style.visibility === "hidden" ? "visible" : "hidden";
}

function ShowHide_2(){
  const container_2 = document.getElementsByClassName("container_2")[0];
  container_2.style.visibility =
    container_2.style.visibility === "hidden" ? "visible" : "hidden";
}

/* ===== SLIDER NUEVO ===== */

const slides = document.querySelectorAll('.hero-slide');
const slider = document.getElementById('slider');
const dotsContainer = document.querySelector('.dots');

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

// Flechas (🔥 FIX CLAVE)
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

/* ===== SLIDER NUEVO FIN ===== */




