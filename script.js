const $ = (selector) => document.querySelector(selector);

// Update this one date to make the counter personal (YYYY-MM-DD).
const anniversaryStart = new Date('2025-09-02T00:00:00');
const today = new Date();
const daysTogether = Math.max(1, Math.floor((today - anniversaryStart) / 86400000));
$('#dayCounter').textContent = daysTogether.toLocaleString();

// Reveal content as it enters view.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-block').forEach((el) => revealObserver.observe(el));

// Soft light that follows the pointer.
const glow = $('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

// Tiny card tilt on larger screens.
document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 761) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${y * -4}deg) scale(1.01)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

// Letter interaction.
const modal = $('#letterModal');
const envelope = $('#envelope');
function openLetter() {
  envelope.classList.add('open');
  setTimeout(() => {
    modal.hidden = false;
    document.body.classList.add('modal-open');
    $('#closeLetter').focus();
  }, 360);
}
function closeLetter() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
}
$('#openLetter').addEventListener('click', openLetter);
$('#closeLetter').addEventListener('click', closeLetter);
modal.addEventListener('click', (event) => { if (event.target === modal) closeLetter(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeLetter(); });

// Background instrumental music.
const music = $('#bgMusic');
let soundOn = false;

$('#soundButton').addEventListener('click', async () => {
  soundOn = !soundOn;

  $('#soundButton').querySelector('.sound-label').textContent =
    soundOn ? 'music on' : 'sound on';

  if (soundOn) {
    try {
      await music.play();
    } catch {
      soundOn = false;
      $('#soundButton').querySelector('.sound-label').textContent = 'sound on';
    }
  } else {
    music.pause();
  }
});

// Finale wish, with a small burst of stars.
const toast = $('#toast');
$('#wishButton').addEventListener('click', () => {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3400);
  for (let i = 0; i < 32; i += 1) createSpark();
});
function createSpark() {
  const spark = document.createElement('span');
  const angle = Math.random() * Math.PI * 2;
  const distance = 70 + Math.random() * 180;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  spark.textContent = Math.random() > .3 ? '✦' : '♡';
  spark.style.cssText = `position:fixed;z-index:24;left:50%;top:57%;color:${Math.random() > .35 ? '#e7a0a0' : '#f7eee9'};font-size:${9 + Math.random() * 15}px;pointer-events:none;transition:transform ${.65 + Math.random() * .6}s cubic-bezier(.15,.7,.25,1),opacity 1s;`;
  document.body.appendChild(spark);
  requestAnimationFrame(() => { spark.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 260}deg)`; spark.style.opacity = '0'; });
  setTimeout(() => spark.remove(), 1300);
}

// Header state.
window.addEventListener('scroll', () => $('.nav').classList.toggle('scrolled', window.scrollY > 40), { passive: true });

// Canvas star field.
const canvas = $('#stars');
const ctx = canvas.getContext('2d');
let starList = [];
function sizeStars() {
  const density = Math.min(135, Math.floor(window.innerWidth / 10));
  const ratio = Math.min(window.devicePixelRatio, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  starList = Array.from({ length: density }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, r: Math.random() * 1.15 + .18, a: Math.random() * .48 + .12, speed: Math.random() * .015 + .004 }));
}
function drawStars(time) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  starList.forEach((star) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(247,238,233,${star.a * (.72 + Math.sin(time * star.speed) * .28)})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
sizeStars();
drawStars(0);
window.addEventListener('resize', sizeStars);
