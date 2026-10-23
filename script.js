// Follow the OS by default, with an explicit, persistent choice on this site.
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionControl = document.querySelector('.motion-toggle');
let motionOverride = null;
try {
  const stored = localStorage.getItem('portfolio-motion');
  if (stored === 'full' || stored === 'reduced') motionOverride = stored;
} catch { /* Private browsing or file URLs can disallow storage. */ }

function motionIsReduced() {
  return document.documentElement.dataset.motion !== 'full';
}
function applyMotionPreference() {
  const enabled = motionOverride === 'full' || (motionOverride !== 'reduced' && !systemMotion.matches);
  document.documentElement.dataset.motion = enabled ? 'full' : 'reduced';
  motionControl.hidden = false;
  motionControl.textContent = enabled ? 'Pausar efeitos' : 'Ativar efeitos';
  motionControl.setAttribute('aria-pressed', String(enabled));
  motionControl.title = enabled ? 'Pausar as animações deste site' : 'Ativar as animações deste site, mesmo com movimento reduzido no sistema';
  document.dispatchEvent(new Event('motionchange'));
}
motionControl.addEventListener('click', () => {
  motionOverride = motionIsReduced() ? 'full' : 'reduced';
  try { localStorage.setItem('portfolio-motion', motionOverride); } catch { /* Session choice still works. */ }
  applyMotionPreference();
});
systemMotion.addEventListener('change', applyMotionPreference);
applyMotionPreference();

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});

navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll('a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}

document.querySelector('#year').textContent = new Date().getFullYear();

// Effects are optional; content and links work without animation support.
const finePointer = window.matchMedia('(any-pointer: fine)');
const header = document.querySelector('.header');
const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
header.append(progress);

let scrollFrame = 0;
function updateScroll() {
  scrollFrame = 0;
  const range = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
  progress.style.transform = `scaleX(${fraction})`;
  header.classList.toggle('is-scrolled', window.scrollY > 16);
  const heroOffset = motionIsReduced() ? 0 : Math.min(window.scrollY * 0.12, 55);
  document.querySelector('.profile').style.setProperty('--scroll-offset', `${heroOffset}px`);
}
function requestScrollUpdate() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });
window.addEventListener('load', requestScrollUpdate, { once: true });
if ('ResizeObserver' in window) new ResizeObserver(requestScrollUpdate).observe(document.body);
updateScroll();

// Entrances remain visible without JS; replay when entering the viewport.
const runningAnimations = new Set();
const entranceByElement = new WeakMap();
const entranceElements = [...document.querySelectorAll('.hero-copy, .about > div, .section-heading, .featured-project, .personal-projects article, .timeline-entry, .skills-grid article, .people-skills, .contact > h2')];
function playEntrance(element) {
  if (motionIsReduced() || typeof element.animate !== 'function') return;
  entranceByElement.get(element)?.cancel();
  const animation = element.animate([
    { opacity: 0.15, transform: 'translateY(45px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 1050, easing: 'cubic-bezier(.2,.7,.2,1)' });
  entranceByElement.set(element, animation);
  runningAnimations.add(animation);
  animation.onfinish = animation.oncancel = () => runningAnimations.delete(animation);
}
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) playEntrance(entry.target); });
  }, { threshold: 0.08 });
  entranceElements.forEach(element => reveal.observe(element));
}
document.addEventListener('motionchange', () => {
  if (motionIsReduced()) return;
  entranceElements.forEach(element => {
    const bounds = element.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < window.innerHeight) playEntrance(element);
  });
});

// Pointer work is batched into one frame, limited to decorative surfaces.
const surfaces = [...document.querySelectorAll('.profile, .project-art')];
const resetSurfaces = [];
surfaces.forEach(surface => {
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    ['--tilt-x', '--tilt-y', '--scan-x', '--scan-y', '--light-x', '--light-y', '--light-opacity'].forEach(name => surface.style.removeProperty(name));
  }
  resetSurfaces.push(reset);
  surface.addEventListener('pointermove', event => {
    if (motionIsReduced() || !finePointer.matches || event.pointerType === 'touch') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = surface.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (pointerX - bounds.left) / bounds.width));
      const y = Math.min(1, Math.max(0, (pointerY - bounds.top) / bounds.height));
      surface.style.setProperty('--light-x', `${x * 100}%`);
      surface.style.setProperty('--light-y', `${y * 100}%`);
      surface.style.setProperty('--light-opacity', '1');
      surface.style.setProperty('--tilt-x', `${(0.5 - y) * 12}deg`);
      surface.style.setProperty('--tilt-y', `${(x - 0.5) * 12}deg`);
      surface.style.setProperty('--scan-x', `${(x - 0.5) * 32}px`);
      surface.style.setProperty('--scan-y', `${(y - 0.5) * 32}px`);
    });
  }, { passive: true });
  surface.addEventListener('pointerleave', reset);
  surface.addEventListener('pointercancel', reset);
});
function resetMotion() {
  requestScrollUpdate();
  resetSurfaces.forEach(reset => reset());
  if (motionIsReduced()) runningAnimations.forEach(animation => animation.cancel());
}
document.addEventListener('motionchange', resetMotion);
finePointer.addEventListener('change', resetMotion);
window.addEventListener('blur', resetMotion);
