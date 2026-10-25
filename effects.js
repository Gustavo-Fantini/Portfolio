/* Editorial motion stays independent from the WebGL scene. */
(() => {
  const enabled = () => document.documentElement.dataset.motion === 'full';
  const clamp = value => Math.min(1, Math.max(0, value));
  const header = document.querySelector('.header');
  const progress = document.createElement('div'); progress.className = 'reading-progress'; progress.setAttribute('aria-hidden','true'); header.append(progress);
  const headings = [...document.querySelectorAll('h2:not(#lab-title)')].map(heading => {
    heading.setAttribute('aria-label',heading.innerText.replace(/\s+/g,' ').trim());
    const walker = document.createTreeWalker(heading,NodeFilter.SHOW_TEXT); const nodes=[]; const words=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment=document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(text=>{
        if(!text.trim()){fragment.append(document.createTextNode(text));return;}
        const word=document.createElement('span');word.className='reveal-word';word.textContent=text;fragment.append(word);words.push(word);
      });node.replaceWith(fragment);
    });return {heading,words};
  });
  const entries=[...document.querySelectorAll('.timeline-entry')];const skills=[...document.querySelectorAll('.skills-grid article')];
  let frame=0;
  function update(){
    frame=0;const range=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${range>0?clamp(scrollY/range):0})`;header.classList.toggle('is-scrolled',scrollY>16);
    if(!enabled())return;
    headings.forEach(({heading,words})=>{const phase=clamp((innerHeight*.9-heading.getBoundingClientRect().top)/(innerHeight*.48));words.forEach((word,i)=>word.style.setProperty('--word-progress',clamp(phase*words.length-i).toFixed(3)));});
    entries.forEach(entry=>{const r=entry.getBoundingClientRect();entry.style.setProperty('--entry-progress',clamp((innerHeight*.8-r.top)/r.height).toFixed(3));});
    skills.forEach((card,i)=>card.style.setProperty('--row-progress',clamp((innerHeight*.9-card.getBoundingClientRect().top-i*35)/(innerHeight*.3)).toFixed(3)));
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});document.addEventListener('motionchange',schedule);schedule();
  if('ResizeObserver'in window)new ResizeObserver(schedule).observe(document.body);
  [...skills,document.querySelector('.contact'),document.querySelector('.project-art')].forEach(surface=>{
    surface.addEventListener('pointermove',e=>{
      if(!enabled()||e.pointerType==='touch')return;const r=surface.getBoundingClientRect();surface.style.setProperty('--light-x',`${(e.clientX-r.left)/r.width*100}%`);surface.style.setProperty('--light-y',`${(e.clientY-r.top)/r.height*100}%`);surface.style.setProperty('--light-opacity','1');
    },{passive:true});surface.addEventListener('pointerleave',()=>surface.style.removeProperty('--light-opacity'));
  });
})();
