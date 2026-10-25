/* Three.js r180 is vendored locally. No models, trackers or runtime CDN requests. */
(() => {
  const hosts=[...document.querySelectorAll('[data-scene]')];
  const lab=document.querySelector('.lab-section');
  const full=()=>document.documentElement.dataset.motion==='full';
  const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  let library;
  let frame=0;
  let previous=0;
  let labProgress=0;
  const views=hosts.map(host=>({host,visible:false,renderer:null,world:null,frames:0,yaw:0,pitch:0,mouseX:0,mouseY:0,dragging:false,lost:false}));

  function loadLibrary(){
    if(library)return library;
    library=new Promise((resolve,reject)=>{
      try {
        const probe=document.createElement('canvas');const gl=probe.getContext('webgl2',{failIfMajorPerformanceCaveat:false});
        if(!gl)throw new Error('WebGL2 unavailable');gl.getExtension('WEBGL_lose_context')?.loseContext();
        const script=document.createElement('script');script.src='vendor/three.min.js?v=r180';script.onload=()=>window.THREE?resolve(window.THREE):reject(new Error('3D engine unavailable'));script.onerror=()=>reject(new Error('3D engine could not load'));document.head.append(script);
      } catch(error){reject(error);}
    });return library;
  }
  function studioTexture(T){
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const c=canvas.getContext('2d');
    const g=c.createLinearGradient(0,0,0,512);g.addColorStop(0,'#e5eddf');g.addColorStop(.25,'#839484');g.addColorStop(.5,'#1d2923');g.addColorStop(.76,'#556d51');g.addColorStop(1,'#b8c69b');c.fillStyle=g;c.fillRect(0,0,1024,512);
    c.fillStyle='#ffffff';c.fillRect(60,40,170,240);c.fillRect(500,65,90,210);c.fillStyle='#d5f99d';c.fillRect(820,120,120,220);c.fillStyle='#14251c';c.fillRect(260,100,120,300);
    const texture=new T.CanvasTexture(canvas);texture.mapping=T.EquirectangularReflectionMapping;texture.colorSpace=T.SRGBColorSpace;return texture;
  }
  function makeWorld(T,renderer){
    const scene=new T.Scene();const root=new T.Group();scene.add(root);
    const env=studioTexture(T);const generator=new T.PMREMGenerator(renderer);const environment=generator.fromEquirectangular(env);scene.environment=environment.texture;env.dispose();generator.dispose();
    scene.add(new T.HemisphereLight(0xf5ffe9,0x1c3326,2));
    const key=new T.DirectionalLight(0xfff6df,5);key.position.set(-3,5,5);scene.add(key);
    const rim=new T.DirectionalLight(0xd3ff92,4);rim.position.set(4,1,-2);scene.add(rim);
    const fill=new T.DirectionalLight(0xffffff,2);fill.position.set(0,-3,4);scene.add(fill);
    const chrome=new T.MeshPhysicalMaterial({color:0xe2e9df,metalness:1,roughness:.2,envMapIntensity:1.8,clearcoat:1,clearcoatRoughness:.15});
    const dark=new T.MeshPhysicalMaterial({color:0x183d2d,metalness:.8,roughness:.3,envMapIntensity:1.3,clearcoat:.7});
    const lime=new T.MeshPhysicalMaterial({color:0xc9ff74,metalness:.25,roughness:.25,clearcoat:1,envMapIntensity:1.4});
    const face=new T.MeshStandardMaterial({color:0x0c241b,metalness:.5,roughness:.42});
    const base=new T.Group();root.add(base);
    const body=new T.Mesh(new T.CylinderGeometry(1.3,1.3,.32,96),dark);body.rotation.x=Math.PI/2;base.add(body);
    const rimFront=new T.Mesh(new T.TorusGeometry(1.29,.065,16,128),chrome);rimFront.position.z=.16;base.add(rimFront);
    const rimBack=rimFront.clone();rimBack.position.z=-.16;base.add(rimBack);
    const front=new T.Mesh(new T.CylinderGeometry(1.2,1.2,.04,96),face);front.rotation.x=Math.PI/2;front.position.z=.18;base.add(front);
    const engraving=new T.Mesh(new T.TorusGeometry(1.1,.012,8,96),lime);engraving.position.z=.207;base.add(engraving);
    const letters=new T.Group();root.add(letters);letters.position.z=.24;
    const g=new T.Shape();g.moveTo(-.12,.56);g.lineTo(-.8,.56);g.quadraticCurveTo(-1,.56,-1,.36);g.lineTo(-1,-.36);g.quadraticCurveTo(-1,-.56,-.8,-.56);g.lineTo(-.1,-.56);g.lineTo(-.1,.06);g.lineTo(-.5,.06);g.lineTo(-.5,-.14);g.lineTo(-.33,-.14);g.lineTo(-.33,-.32);g.lineTo(-.75,-.32);g.lineTo(-.75,.32);g.lineTo(-.12,.32);g.closePath();
    const f=new T.Shape();f.moveTo(.12,-.56);f.lineTo(.36,-.56);f.lineTo(.36,-.03);f.lineTo(.83,-.03);f.lineTo(.83,.19);f.lineTo(.36,.19);f.lineTo(.36,.32);f.lineTo(.99,.32);f.lineTo(.99,.56);f.lineTo(.12,.56);f.closePath();
    const letterGeometry=new T.ExtrudeGeometry([g,f],{depth:.17,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.045,bevelThickness:.045,curveSegments:20});
    letters.add(new T.Mesh(letterGeometry,chrome));
    const outline=new T.Mesh(new T.TorusGeometry(1.83,.045,12,160),chrome);outline.rotation.set(1.05,.2,-.4);root.add(outline);
    const orbit=new T.Mesh(new T.TorusGeometry(1.98,.026,10,144),lime);orbit.rotation.set(.3,1.15,.1);root.add(orbit);
    const satellites=[];
    for(let i=0;i<5;i++){
      const satellite=new T.Group();const core=new T.Mesh(new T.SphereGeometry(i===0?.19:.12,24,16),i%2?lime:chrome);satellite.add(core);
      const band=new T.Mesh(new T.TorusGeometry(i===0?.23:.17,.013,6,36),dark);band.rotation.x=1.1;satellite.add(band);root.add(satellite);satellites.push(satellite);
    }
    const chips=[];
    for(let i=0;i<3;i++){
      const chip=new T.Group();const block=new T.Mesh(new T.BoxGeometry(.33,.32,.13),dark);chip.add(block);
      const cap=new T.Mesh(new T.BoxGeometry(.24,.23,.04),i%2?lime:chrome);cap.position.z=.09;chip.add(cap);
      for(let j=0;j<3;j++)for(const side of [-1,1]){const pin=new T.Mesh(new T.BoxGeometry(.09,.035,.045),chrome);pin.position.set(side*.2,(j-1)*.09,0);chip.add(pin);}
      root.add(chip);chips.push(chip);
    }
    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d');const sg=sc.createRadialGradient(64,64,0,64,64,64);sg.addColorStop(0,'rgba(5,20,12,.4)');sg.addColorStop(1,'rgba(5,20,12,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);
    const shadow=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.scale.set(5.5,1.1,1);shadow.position.set(0,-2.22,-1);scene.add(shadow);
    return {scene,root,base,letters,outline,orbit,satellites,chips,environment,shadow};
  }
  async function prepare(view){
    if(view.preparing||view.renderer)return;view.preparing=true;
    try {
      const T=await loadLibrary();
      const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<761?1.25:1.6));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.setClearColor(0,0);
      view.renderer=renderer;view.camera=new T.PerspectiveCamera(36,1,.1,60);view.world=makeWorld(T,renderer);
      renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','Peça 3D interativa: arrasta ou usa as setas para rodar; Home repõe a vista');
      view.host.append(renderer.domElement);bindDrag(view);resizeView(view);view.host.dataset.ready='true';view.host.dataset.renderer='webgl';
      renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();view.lost=true;view.host.dataset.ready='false';});
      renderer.domElement.addEventListener('webglcontextrestored',()=>{view.lost=false;view.host.dataset.ready='true';invalidate();});
      invalidate();
    } catch(error){view.host.dataset.renderer='fallback';view.host.dataset.ready='false';}
  }
  function bindDrag(view){
    const canvas=view.renderer.domElement;let lastX=0,lastY=0;
    canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;view.dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{
      const r=canvas.getBoundingClientRect();view.mouseX=(e.clientX-r.left)/r.width-.5;view.mouseY=(e.clientY-r.top)/r.height-.5;
      if(view.dragging){view.yaw+=(e.clientX-lastX)*.009;view.pitch=clamp(view.pitch+(e.clientY-lastY)*.007,-1.1,1.1);lastX=e.clientX;lastY=e.clientY;}
      invalidate();
    },{passive:true});
    const release=()=>{view.dragging=false;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);canvas.addEventListener('pointerleave',()=>{view.mouseX=view.mouseY=0;invalidate();});
    canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')view.yaw=view.pitch=0;else if(e.key==='ArrowLeft')view.yaw-=.2;else if(e.key==='ArrowRight')view.yaw+=.2;else if(e.key==='ArrowUp')view.pitch=clamp(view.pitch-.15,-1.1,1.1);else view.pitch=clamp(view.pitch+.15,-1.1,1.1);invalidate();});
  }
  function resizeView(view){if(!view.renderer)return;const width=view.host.clientWidth,height=view.host.clientHeight;if(!width||!height)return;view.renderer.setSize(width,height,false);view.camera.aspect=width/height;view.camera.position.set(0,.1,view.host.dataset.scene==='lab'?(innerWidth<761?10.7:9.3):(innerWidth<761?Math.max(8.6,7.4/view.camera.aspect):Math.max(7.3,6.4/view.camera.aspect)));view.camera.lookAt(0,0,0);view.camera.updateProjectionMatrix();}
  function updateScroll(){
    const bounds=lab.getBoundingClientRect();const top=innerWidth<761?72:88;const sticky=lab.querySelector('.lab-sticky').clientHeight;
    labProgress=full()?clamp((top-bounds.top)/Math.max(1,lab.offsetHeight-sticky)):0;
    lab.style.setProperty('--lab-progress',labProgress.toFixed(3));const chapter=Math.min(2,Math.floor(labProgress*3));lab.querySelectorAll('.lab-chapter').forEach((element,i)=>element.classList.toggle('is-current',i===chapter));invalidate();
  }
  function render(time){
    frame=0;const dt=Math.min((time-previous)/1000||.016,.05);previous=time;const moving=full();
    views.forEach(view=>{
      if(!view.visible||!view.renderer||view.lost)return;const w=view.world;const isLab=view.host.dataset.scene==='lab';
      if(moving)view.time=(view.time||0)+dt;const t=view.time||0;const phase=isLab&&moving?labProgress:0;const explode=Math.sin(phase*Math.PI)*1.0;
      const mouseYaw=moving?view.mouseX*.65:0,mousePitch=moving?view.mouseY*.4:0;
      const targetY=-.35+view.yaw+mouseYaw+phase*1.7+(moving?Math.sin(t*.3)*.12:0);const targetX=-.14+view.pitch+mousePitch+phase*.32;
      if(moving){w.root.rotation.y+=(targetY-w.root.rotation.y)*.12;w.root.rotation.x+=(targetX-w.root.rotation.x)*.12;}else{w.root.rotation.y=targetY;w.root.rotation.x=targetX;}
      w.root.rotation.z=-.12+(moving?Math.sin(t*.38)*.045:0)-phase*.25;w.root.position.y=moving?Math.sin(t*.7)*.08:0;
      w.base.position.z=-explode*.55;w.letters.position.z=.24+explode*.9;
      w.outline.scale.setScalar(1+explode*.23);w.outline.rotation.z=-.4+t*.09+phase*1.2;w.orbit.scale.setScalar(1+explode*.25);w.orbit.rotation.z=.1-t*.08-phase*.8;
      w.satellites.forEach((satellite,i)=>{const a=i/5*Math.PI*2+t*.12;const radius=1.95+explode*.6;satellite.position.set(Math.cos(a)*radius,Math.sin(a)*radius*.75,Math.sin(a+1.2)*.9);});
      w.chips.forEach((chip,i)=>{const a=i/3*Math.PI*2+.5;const radius=1.65+explode*.7;chip.position.set(Math.cos(a)*radius,Math.sin(a)*radius*.65,-.7-explode*(i+1)*.3);chip.rotation.set(t*.16+i,a+t*.1,-a);});
      view.renderer.render(w.scene,view.camera);view.frames++;view.host.dataset.frames=String(view.frames);
    });
    if(moving&&views.some(v=>v.visible&&v.renderer&&!v.lost))invalidate();
  }
  function invalidate(){if(!frame&&!document.hidden)frame=requestAnimationFrame(render);}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{const view=views.find(v=>v.host===entry.target);view.visible=entry.isIntersecting;if(view.visible)prepare(view);invalidate();}),{rootMargin:'100px'});views.forEach(view=>observer.observe(view.host));
  const sizes=new ResizeObserver(()=>{views.forEach(resizeView);updateScroll();});views.forEach(view=>sizes.observe(view.host));sizes.observe(lab);
  addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',()=>{views.forEach(resizeView);updateScroll();},{passive:true});document.addEventListener('motionchange',()=>{previous=0;views.forEach(resizeView);updateScroll();});document.addEventListener('visibilitychange',()=>{previous=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else invalidate();});
  updateScroll();
})();
