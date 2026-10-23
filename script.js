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

// The explicit activation also works next to the interactive scene.
document.querySelectorAll('[data-enable-motion]').forEach(button => {
  button.addEventListener('click', () => {
    motionOverride = 'full';
    try { localStorage.setItem('portfolio-motion', motionOverride); } catch { /* Optional storage. */ }
    applyMotionPreference();
  });
});
