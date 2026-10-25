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
    const scene=new T.Scene();const root=new T.Group();root.scale.setScalar(1.18);scene.add(root);
    const env=studioTexture(T);const generator=new T.PMREMGenerator(renderer);const environment=generator.fromEquirectangular(env);scene.environment=environment.texture;env.dispose();generator.dispose();
    scene.add(new T.HemisphereLight(0xfffbea,0x273e32,2.2));
    const key=new T.DirectionalLight(0xfff2dc,4);key.position.set(-3,5,5);scene.add(key);
    const rim=new T.DirectionalLight(0xd4ffad,2.8);rim.position.set(4,2,-3);scene.add(rim);
    const fill=new T.DirectionalLight(0xffffff,1.6);fill.position.set(0,-2,4);scene.add(fill);
    const cream=new T.MeshPhysicalMaterial({color:0xdcd9c7,metalness:.08,roughness:.4,clearcoat:.28,envMapIntensity:.65});
    const warm=new T.MeshStandardMaterial({color:0xa5ac97,metalness:.12,roughness:.48});
    const dark=new T.MeshStandardMaterial({color:0x183b2c,metalness:.25,roughness:.38});
    const rubber=new T.MeshStandardMaterial({color:0x16221c,roughness:.8});
    const lime=new T.MeshPhysicalMaterial({color:0xb8e97c,metalness:.12,roughness:.36,clearcoat:.4});
    const metal=new T.MeshPhysicalMaterial({color:0xc5cec3,metalness:.9,roughness:.3,envMapIntensity:1.2});
    const gold=new T.MeshStandardMaterial({color:0xc3b972,metalness:.7,roughness:.43});
    function roundedPath(w,h,r,Path=T.Shape){
      const p=new Path(),x=-w/2,y=-h/2;r=Math.min(r,w/2,h/2);
      p.moveTo(x+r,y);p.lineTo(x+w-r,y);p.quadraticCurveTo(x+w,y,x+w,y+r);p.lineTo(x+w,y+h-r);p.quadraticCurveTo(x+w,y+h,x+w-r,y+h);p.lineTo(x+r,y+h);p.quadraticCurveTo(x,y+h,x,y+h-r);p.lineTo(x,y+r);p.quadraticCurveTo(x,y,x+r,y);return p;
    }
    function roundedGeometry(w,h,d,r=.07){
      const bevel=Math.min(r*.4,d/4);const g=new T.ExtrudeGeometry(roundedPath(w-bevel*2,h-bevel*2,r),{depth:d-bevel*2,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,steps:1,curveSegments:8});g.translate(0,0,-d/2+bevel);return g;
    }
    function roundedMesh(w,h,d,material,r){return new T.Mesh(roundedGeometry(w,h,d,r),material);}
    const unitBox=new T.BoxGeometry(1,1,1);
    function box(parent,w,h,d,material,x=0,y=0,z=0){const m=new T.Mesh(unitBox,material);m.scale.set(w,h,d);m.position.set(x,y,z);parent.add(m);return m;}
    function frameMesh(w,h,iw,ih,d,r,material){const shape=roundedPath(w,h,r);shape.holes.push(roundedPath(iw,ih,Math.min(r,.14),T.Path));const g=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1,curveSegments:12});g.translate(0,0,-d/2);return new T.Mesh(g,material);}
    const parts=[];
    function part(name,offset){const group=new T.Group();group.name=name;root.add(group);parts.push({group,offset:new T.Vector3(...offset)});return group;}

    // A hollow rear case separates from the bezel to reveal the electronics.
    const housing=part('rear-case',[-1.15,.72,-1.05]);
    const walls=frameMesh(2.62,2.22,2.34,1.94,1.05,.19,cream);walls.position.set(0,.48,-.13);housing.add(walls);
    const back=roundedMesh(2.6,2.2,.14,cream,.17);back.position.set(0,.48,-.72);housing.add(back);
    for(let i=0;i<9;i++)box(housing,.026,.68,.012,warm,.77+i*.057,.62,-.801);
    box(housing,.55,.13,.035,dark,-.45,-.27,-.81);for(let i=0;i<3;i++)box(housing,.13,.06,.045,metal,-.62+i*.17,-.27,-.835);
    const neck=roundedMesh(1.8,.23,1.05,warm,.065);neck.position.set(0,-.72,-.1);root.add(neck);
    const foot=roundedMesh(2.25,.18,1.35,cream,.065);foot.position.set(0,-.91,-.02);root.add(foot);

    const bezel=part('front-bezel',[1.4,.12,.75]);
    const frontFrame=frameMesh(2.64,2.23,2.13,1.43,.22,.19,cream);frontFrame.position.set(0,.48,.48);bezel.add(frontFrame);
    // The frame's opening is centred; the lower fascia overlaps it to form a chin.
    const chin=roundedMesh(2.35,.31,.19,cream,.05);chin.position.set(0,-.38,.55);bezel.add(chin);
    box(bezel,.72,.055,.045,rubber,.53,-.39,.66);box(bezel,.055,.09,.055,warm,.95,-.39,.68);
    const power=new T.Mesh(new T.CylinderGeometry(.055,.055,.035,20),new T.MeshStandardMaterial({color:0xb9f67d,emissive:0x77aa44,emissiveIntensity:.45,roughness:.35}));power.rotation.x=Math.PI/2;power.position.set(-.99,-.39,.68);bezel.add(power);
    const badgeCanvas=document.createElement('canvas');badgeCanvas.width=512;badgeCanvas.height=80;const badgeContext=badgeCanvas.getContext('2d');badgeContext.fillStyle='#dcd9c7';badgeContext.fillRect(0,0,512,80);badgeContext.fillStyle='#344b3a';badgeContext.font='bold 30px monospace';badgeContext.fillText('FANTINI / 01',15,53);const badgeTexture=new T.CanvasTexture(badgeCanvas);badgeTexture.colorSpace=T.SRGBColorSpace;
    const badge=new T.Mesh(new T.PlaneGeometry(.8,.125),new T.MeshBasicMaterial({map:badgeTexture,toneMapped:false}));badge.position.set(-.43,-.39,.654);bezel.add(badge);

    // The curved screen carries a small terminal drawn locally, including a blinking cursor.
    const display=part('crt-display',[1.4,.25,1.12]);
    const screenFrame=roundedMesh(2.18,1.48,.19,rubber,.13);screenFrame.position.set(0,.55,.56);display.add(screenFrame);
    const screenCanvas=document.createElement('canvas');screenCanvas.width=1024;screenCanvas.height=656;const context=screenCanvas.getContext('2d');
    const screenTexture=new T.CanvasTexture(screenCanvas);screenTexture.colorSpace=T.SRGBColorSpace;screenTexture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);
    let lastCursor=null;
    function drawScreen(cursor){
      if(lastCursor===cursor)return;lastCursor=cursor;
      const glow=context.createRadialGradient(470,280,30,512,328,650);glow.addColorStop(0,'#244b35');glow.addColorStop(1,'#091b12');context.fillStyle=glow;context.fillRect(0,0,1024,656);
      context.fillStyle='#8da981';context.font='24px monospace';context.fillText('FANTINI PERSONAL COMPUTER',62,76);context.fillStyle='#42664a';context.fillRect(62,100,900,2);
      context.fillStyle='#d2efab';context.shadowColor='#a4e979';context.shadowBlur=9;context.font='bold 66px monospace';context.fillText('olá, mundo.',62,230);context.shadowBlur=0;
      context.font='29px monospace';context.fillStyle='#a4ce8c';context.fillText('> explorar ideias',62,325);context.fillText('> criar possibilidades',62,381);context.fillText('> continuar a aprender',62,437);
      context.fillStyle='#7f9e72';context.font='23px monospace';context.fillText('READY',62,578);if(cursor){context.fillStyle='#d2efab';context.fillRect(155,555,18,27);}
      context.fillStyle='rgba(0,0,0,.12)';for(let y=0;y<656;y+=5)context.fillRect(0,y,1024,1);
      screenTexture.needsUpdate=true;
    }
    drawScreen(true);
    const screenGeometry=new T.PlaneGeometry(1.96,1.25,32,24);const positions=screenGeometry.attributes.position;
    for(let i=0;i<positions.count;i++){const x=positions.getX(i)/.98,y=positions.getY(i)/.625;positions.setZ(i,.065*(1-x*x)*(1-y*y));}screenGeometry.computeVertexNormals();
    const screen=new T.Mesh(screenGeometry,new T.MeshBasicMaterial({map:screenTexture,toneMapped:false}));screen.position.set(0,.55,.665);display.add(screen);
    const glass=new T.Mesh(screenGeometry,new T.MeshPhysicalMaterial({color:0xc4e1ca,metalness:.06,roughness:.16,transparent:true,opacity:.08,clearcoat:1,envMapIntensity:.7,depthWrite:false}));glass.position.copy(screen.position);glass.position.z+=.009;display.add(glass);

    const electronics=part('logic-board',[-.2,-.06,.1]);
    const pcb=roundedMesh(1.95,1.52,.07,dark,.035);pcb.position.set(0,.5,-.1);electronics.add(pcb);
    for(let i=0;i<11;i++){
      const x=-.85+i*.16;box(electronics,.012,.56,.008,gold,x,.16,-.058);box(electronics,.1,.012,.008,gold,x+.045,.43,-.055);
      box(electronics,.28,.012,.008,gold,x,.95-(i%3)*.07,-.055);
    }
    box(electronics,.51,.48,.15,rubber,-.36,.58,.012);box(electronics,.35,.33,.03,metal,-.36,.58,.102);
    for(let j=0;j<7;j++)for(const side of [-1,1]){box(electronics,.065,.025,.024,metal,-.36+side*.29,.38+j*.065,.015);}
    for(let i=0;i<3;i++){box(electronics,.17,.83,.08,lime,.24+i*.23,.56,.008);for(let j=0;j<3;j++)box(electronics,.105,.16,.05,rubber,.24+i*.23,.32+j*.23,.073);}
    for(let i=0;i<5;i++){const cap=new T.Mesh(new T.CylinderGeometry(.055,.055,.13,12),metal);cap.rotation.x=Math.PI/2;cap.position.set(-.76+i*.29,1.12,.02);electronics.add(cap);}
    const powerSupply=roundedMesh(.41,.43,.34,warm,.035);powerSupply.position.set(.72,.03,-.36);electronics.add(powerSupply);

    const keyboard=part('keyboard',[0,-.2,.5]);
    const keyboardCase=roundedMesh(2.65,.18,.93,cream,.07);keyboardCase.position.set(0,-1.06,1.18);keyboardCase.rotation.x=.05;keyboard.add(keyboardCase);
    const keyboardInset=roundedMesh(2.43,.035,.75,warm,.025);keyboardInset.position.set(0,-.956,1.17);keyboard.add(keyboardInset);
    const keyGeometry=roundedGeometry(.15,.072,.13,.018);const keys=new T.InstancedMesh(keyGeometry,cream,52);const matrix=new T.Object3D();let k=0;
    for(let row=0;row<4;row++)for(let col=0;col<13;col++){matrix.position.set(-1.09+col*.18,-.902, .9+row*.16);matrix.updateMatrix();keys.setMatrixAt(k++,matrix.matrix);}keyboard.add(keys);
    const space=roundedMesh(.85,.078,.13,cream,.018);space.position.set(0,-.9,1.53);keyboard.add(space);
    for(let i=0;i<2;i++){const accent=roundedMesh(.16,.08,.14,lime,.02);accent.position.set(1.1-i*.19,-.895,1.53);keyboard.add(accent);}
    const cablePath=new T.CatmullRomCurve3([new T.Vector3(.7,-1.06,.77),new T.Vector3(1.22,-1.07,.48),new T.Vector3(1.18,-.93,-.3),new T.Vector3(.75,-.8,-.55)]);const cable=new T.Mesh(new T.TubeGeometry(cablePath,24,.019,6,false),rubber);root.add(cable);
    const mouse=part('mouse',[.18,-.12,.3]);const mouseBody=new T.Mesh(new T.SphereGeometry(1,24,16),cream);mouseBody.scale.set(.19,.105,.28);mouseBody.position.set(1.65,-1.05,1.2);mouse.add(mouseBody);box(mouse,.012,.009,.16,warm,1.65,-.943,1.13);
    const mouseWire=new T.CatmullRomCurve3([new T.Vector3(1.65,-1.07,.96),new T.Vector3(1.76,-1.08,.52),new T.Vector3(1.49,-.97,.05),new T.Vector3(1.25,-.7,-.45)]);root.add(new T.Mesh(new T.TubeGeometry(mouseWire,22,.014,6,false),rubber));

    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d');const sg=sc.createRadialGradient(64,64,0,64,64,64);sg.addColorStop(0,'rgba(5,20,12,.32)');sg.addColorStop(1,'rgba(5,20,12,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);
    const shadow=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.scale.set(5.7,1.05,1);shadow.position.set(.1,-1.55,.15);scene.add(shadow);
    return {scene,root,parts,environment,shadow,drawScreen};
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
  function resizeView(view){if(!view.renderer)return;const width=view.host.clientWidth,height=view.host.clientHeight;if(!width||!height)return;view.renderer.setSize(width,height,false);view.camera.aspect=width/height;view.camera.position.set(0,1.4,view.host.dataset.scene==='lab'?(innerWidth<761?10.7:9.3):(innerWidth<761?Math.max(8.6,7.4/view.camera.aspect):Math.max(8.4,7/view.camera.aspect)));view.baseCameraZ=view.camera.position.z;view.camera.lookAt(0,0,0);view.camera.updateProjectionMatrix();}
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
      const targetY=-.42+view.yaw+mouseYaw+phase*1.15+(moving?Math.sin(t*.3)*.08:0);const targetX=.08+view.pitch+mousePitch+phase*.1;
      if(moving){w.root.rotation.y+=(targetY-w.root.rotation.y)*.12;w.root.rotation.x+=(targetX-w.root.rotation.x)*.12;}else{w.root.rotation.y=targetY;w.root.rotation.x=targetX;}
      w.root.rotation.z=-.025+(moving?Math.sin(t*.38)*.018:0)-phase*.06;w.root.position.y=moving?Math.sin(t*.7)*.045:0;
      view.camera.position.z=view.baseCameraZ+(isLab?explode*2.5:0);view.camera.lookAt(0,0,0);
      w.parts.forEach(part=>{part.group.position.copy(part.offset).multiplyScalar(explode);});
      w.drawScreen(!moving||Math.floor(t/.65)%2===0);
      view.host.dataset.assembly=explode.toFixed(3);
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
