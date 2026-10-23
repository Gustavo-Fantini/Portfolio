/* Interactions share one animation loop; no animation library is required. */
(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const scene = document.querySelector('.profile-scene');
  const profile = document.querySelector('.profile');
  const project = document.querySelector('.project-art');
  const contact = document.querySelector('.contact');
  const header = document.querySelector('.header');
  const finePointer = matchMedia('(any-pointer: fine)');
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  header.append(progress);
  const enabled = () => root.dataset.motion === 'full';
  const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));

  // Split text nodes, preserving emphasis, line breaks and accessible heading text.
  const headings = [...document.querySelectorAll('h2')].map(heading => {
    heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    const words = [];
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(text => {
        if (!text.trim()) { fragment.append(document.createTextNode(text)); return; }
        const word = document.createElement('span');
        word.className = 'reveal-word';
        word.textContent = text;
        fragment.append(word);
        words.push(word);
      });
      node.replaceWith(fragment);
    });
    return { element: heading, words };
  });
  const entries = [...document.querySelectorAll('.timeline-entry')];
  const skillCards = [...document.querySelectorAll('.skills-grid article')];

  // Stable hit areas avoid tilt feedback from measuring a rotating card.
  const surfaces = [
    { hit: scene, target: profile, strength: 1 },
    { hit: project, target: project, strength: .65 },
    ...skillCards.map(card => ({ hit: card, target: card, strength: .25 })),
    { hit: contact, target: contact, strength: .2 }
  ].map(surface => ({ ...surface, x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, light: 0, active: false }));

  let frame = 0;
  let dirtyScroll = true;
  let heroVisible = true;
  let lastTime = 0;
  let pointer = { x: -1000, y: -1000, active: false };
  const canvas = document.querySelector('.hero-network');
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let points = [];

  function resizeCanvas() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = innerWidth < 761 ? 25 : 52;
    // Deterministic positions avoid jumps between resizes.
    points = Array.from({ length: count }, (_, i) => ({
      x: ((i * 173.13 + 71) % 997) / 997 * width,
      y: ((i * 269.71 + 29) % 991) / 991 * height,
      phase: i * 2.4,
      radius: i % 6 === 0 ? 2.5 : 1.3
    }));
    dirtyScroll = true;
    schedule();
  }

  function drawNetwork(time) {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    const positions = points.map(point => {
      let x = point.x + Math.sin(time * .00022 + point.phase) * 15;
      let y = point.y + Math.cos(time * .00018 + point.phase) * 16;
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (pointer.active && distance < 170 && distance > 0) {
        const push = (1 - distance / 170) * 35;
        x += dx / distance * push;
        y += dy / distance * push;
      }
      return { x, y, radius: point.radius };
    });
    positions.forEach((point, i) => {
      for (let j = i + 1; j < positions.length; j++) {
        const other = positions[j];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance > 150) continue;
        context.strokeStyle = `rgba(83,116,54,${(1 - distance / 150) * .18})`;
        context.lineWidth = .7;
        context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke();
      }
      context.fillStyle = 'rgba(94,131,57,.34)';
      context.beginPath(); context.arc(point.x, point.y, point.radius, 0, Math.PI * 2); context.fill();
      if (pointer.active && Math.hypot(point.x - pointer.x, point.y - pointer.y) < 160) {
        context.strokeStyle = 'rgba(94,131,57,.2)';
        context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(pointer.x, pointer.y); context.stroke();
      }
    });
  }

  function updateScroll() {
    dirtyScroll = false;
    const range = root.scrollHeight - innerHeight;
    const fraction = range > 0 ? clamp(scrollY / range) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    header.classList.toggle('is-scrolled', scrollY > 16);
    if (!enabled()) return;
    const heroProgress = clamp(-hero.getBoundingClientRect().top / hero.offsetHeight);
    profile.style.setProperty('--card-scroll-y', `${heroProgress * -85}px`);
    profile.style.setProperty('--card-scroll-r', `${heroProgress * -9}deg`);
    hero.style.setProperty('--hero-drift', `${heroProgress * -45}px`);
    hero.style.setProperty('--orbit-turn', `${heroProgress * 65}deg`);
    headings.forEach(({ element, words }) => {
      const phase = clamp((innerHeight * .88 - element.getBoundingClientRect().top) / (innerHeight * .48));
      words.forEach((word, index) => {
        const value = clamp(phase * words.length - index);
        word.style.setProperty('--word-progress', value.toFixed(3));
      });
    });
    entries.forEach(entry => {
      const bounds = entry.getBoundingClientRect();
      entry.style.setProperty('--entry-progress', clamp((innerHeight * .8 - bounds.top) / bounds.height).toFixed(3));
    });
    skillCards.forEach((card, index) => {
      card.style.setProperty('--row-progress', clamp((innerHeight * .9 - card.getBoundingClientRect().top - index * 35) / (innerHeight * .3)).toFixed(3));
    });
    const projectBounds = project.getBoundingClientRect();
    project.style.setProperty('--project-progress', clamp((innerHeight - projectBounds.top) / (innerHeight + projectBounds.height)).toFixed(3));
  }

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  function render(time) {
    frame = 0;
    const step = Math.min((time - lastTime) / 16.67 || 1, 2);
    lastTime = time;
    if (dirtyScroll) updateScroll();
    if (!enabled()) return;
    let moving = false;
    surfaces.forEach(surface => {
      surface.vx = (surface.vx + (surface.tx - surface.x) * .065 * step) * Math.pow(.74, step);
      surface.vy = (surface.vy + (surface.ty - surface.y) * .065 * step) * Math.pow(.74, step);
      surface.x += surface.vx * step;
      surface.y += surface.vy * step;
      surface.light += ((surface.active ? 1 : 0) - surface.light) * .12;
      const settled = Math.abs(surface.tx - surface.x) + Math.abs(surface.ty - surface.y) + Math.abs(surface.vx) + Math.abs(surface.vy) < .002;
      if (settled) { surface.x = surface.tx; surface.y = surface.ty; surface.vx = surface.vy = 0; }
      moving ||= !settled || Math.abs(surface.light - (surface.active ? 1 : 0)) > .01;
      const renderKey = `${surface.x.toFixed(4)},${surface.y.toFixed(4)},${surface.light.toFixed(3)}`;
      if (surface.renderKey === renderKey) return;
      surface.renderKey = renderKey;
      surface.target.style.setProperty('--rx', `${-surface.y * 14 * surface.strength}deg`);
      surface.target.style.setProperty('--ry', `${surface.x * 18 * surface.strength}deg`);
      surface.target.style.setProperty('--move-x', `${surface.x * 15 * surface.strength}px`);
      surface.target.style.setProperty('--move-y', `${surface.y * 12 * surface.strength}px`);
      surface.target.style.setProperty('--light-opacity', surface.light.toFixed(3));
    });
    if (heroVisible) drawNetwork(time);
    if (moving || (heroVisible && context)) schedule();
  }

  surfaces.forEach(surface => {
    surface.hit.addEventListener('pointermove', event => {
      if (!enabled() || event.pointerType === 'touch' || !finePointer.matches) return;
      const bounds = surface.hit.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width);
      const y = clamp((event.clientY - bounds.top) / bounds.height);
      surface.tx = (x - .5) * 2;
      surface.ty = (y - .5) * 2;
      surface.active = true;
      surface.target.style.setProperty('--light-x', `${x * 100}%`);
      surface.target.style.setProperty('--light-y', `${y * 100}%`);
      schedule();
    }, { passive: true });
    const leave = () => { surface.tx = surface.ty = 0; surface.active = false; schedule(); };
    surface.hit.addEventListener('pointerleave', leave);
    surface.hit.addEventListener('pointercancel', leave);
  });
  hero.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
    schedule();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });

  const entrances = new Set();
  const activeEntrance = new WeakMap();
  function playEntrance(element) {
    if (!enabled() || !element.animate) return;
    activeEntrance.get(element)?.cancel();
    const animation = element.animate([
      { opacity: .2, transform: 'translateY(55px) rotateX(7deg)' },
      { opacity: 1, transform: 'translateY(0) rotateX(0)' }
    ], { duration: 1000, easing: 'cubic-bezier(.16,1,.3,1)' });
    entrances.add(animation); activeEntrance.set(element, animation);
    animation.onfinish = animation.oncancel = () => entrances.delete(animation);
  }
  const entranceElements = [...document.querySelectorAll('.about-copy > p, .personal-projects article, .timeline-entry, .people-skills, .project-body')];
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(items => items.forEach(item => { if (item.isIntersecting) playEntrance(item.target); }), { threshold: .12 });
    entranceElements.forEach(element => reveal.observe(element));
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      canvas.style.visibility = heroVisible ? '' : 'hidden';
      if (!heroVisible) pointer.active = false;
      schedule();
    }).observe(hero);
  }
  function resetPointer() {
    surfaces.forEach(surface => {
      surface.tx = surface.ty = surface.x = surface.y = surface.vx = surface.vy = surface.light = 0;
      surface.active = false;
      surface.renderKey = null;
      ['--rx','--ry','--move-x','--move-y','--light-opacity','--light-x','--light-y'].forEach(key => surface.target.style.removeProperty(key));
    });
    pointer.active = false;
  }
  function motionChanged() {
    resetPointer();
    dirtyScroll = true;
    if (!enabled()) {
      entrances.forEach(animation => animation.cancel());
      context?.clearRect(0, 0, width, height);
    } else {
      entranceElements.forEach(element => {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < innerHeight) playEntrance(element);
      });
    }
    schedule();
  }
  addEventListener('scroll', () => { dirtyScroll = true; schedule(); }, { passive: true });
  addEventListener('resize', resizeCanvas, { passive: true });
  addEventListener('load', resizeCanvas, { once: true });
  addEventListener('blur', resetPointer);
  finePointer.addEventListener('change', resetPointer);
  document.addEventListener('visibilitychange', () => {
    lastTime = 0;
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; resetPointer(); }
    else { dirtyScroll = true; schedule(); }
  });
  document.addEventListener('motionchange', motionChanged);
  if ('ResizeObserver' in window) new ResizeObserver(resizeCanvas).observe(hero);
  resizeCanvas();
})();
