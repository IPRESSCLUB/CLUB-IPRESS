import * as THREE from './vendor/three.module.min.js';

const canvas=document.querySelector('#camera-canvas');
const container=document.querySelector('#camera-stage');
const hero=document.querySelector('.hero-art');
const finePointer=window.matchMedia('(pointer:fine)');
const systemMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced=document.documentElement.classList.contains('reduce-motion')||(!document.documentElement.classList.contains('allow-motion')&&systemMotion.matches);
let renderer;
try {
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
} catch {
  // The CSS camera stays visible when WebGL is unavailable.
}

if(renderer){
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.1,60);
  camera.position.set(0,.3,7.7);camera.lookAt(0,.05,0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.35;
  scene.add(new THREE.HemisphereLight(0xffffff,0x5a6650,3));
  const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(-3,5,6);scene.add(key);
  const fill=new THREE.DirectionalLight(0xc9ddff,3);fill.position.set(5,1,3);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xecffcf,4);rim.position.set(1,4,-3);scene.add(rim);

  const blue=new THREE.MeshStandardMaterial({color:0x244bd8,roughness:.3,metalness:.16});
  const blueDark=new THREE.MeshStandardMaterial({color:0x163698,roughness:.36,metalness:.2});
  const green=new THREE.MeshStandardMaterial({color:0xb8dd70,roughness:.37,metalness:.06});
  const graphite=new THREE.MeshStandardMaterial({color:0x172332,roughness:.3,metalness:.45});
  const silver=new THREE.MeshStandardMaterial({color:0xe4e8e0,roughness:.29,metalness:.7});
  const white=new THREE.MeshStandardMaterial({color:0xfffff5,roughness:.2,metalness:.12});
  const glass=new THREE.MeshPhysicalMaterial({color:0x143e63,roughness:.13,metalness:.6,clearcoat:1,clearcoatRoughness:.08});
  const model=new THREE.Group();scene.add(model);
  function box(w,h,d,r,mat){
    const s=new THREE.Shape(),x=-w/2,y=-h/2;
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
    const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.065,bevelThickness:.065,curveSegments:8}),mat);mesh.position.z=-d/2;return mesh;
  }
  function cylinder(radius,depth,mat,z,x=.25,y=-.02){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,depth,64),mat);mesh.rotation.x=Math.PI/2;mesh.position.set(x,y,z);model.add(mesh);return mesh}
  function torus(radius,tube,mat,z,x=.25,y=-.02){const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,12,64),mat);mesh.position.set(x,y,z);model.add(mesh);return mesh}
  model.add(box(3.4,2.02,.82,.22,blue));
  const grip=box(.5,1.84,.36,.18,blueDark);grip.position.set(-1.35,0,.33);model.add(grip);
  const top=box(1.12,.48,.63,.1,blue);top.position.set(.05,1.06,-.14);model.add(top);
  const shoe=box(.65,.1,.4,.03,silver);shoe.position.set(.05,1.36,-.19);model.add(shoe);
  cylinder(.96,.20,silver,.56);
  cylinder(.90,.52,graphite,.86);
  cylinder(.86,.28,blueDark,1.19);
  torus(.83,.04,green,1.32);
  cylinder(.76,.17,graphite,1.39);
  cylinder(.65,.03,glass,1.49);
  torus(.65,.025,silver,1.51);
  torus(.48,.035,blueDark,1.515);
  cylinder(.405,.016,new THREE.MeshStandardMaterial({color:0x091c38,roughness:.12,metalness:.6}),1.525);
  const glint=new THREE.Mesh(new THREE.CircleGeometry(.19,40),new THREE.MeshBasicMaterial({color:0x9edbd7,transparent:true,opacity:.33}));glint.position.set(.03,.18,1.54);glint.scale.set(1.15,.5,1);glint.rotation.z=.55;model.add(glint);
  const glintSmall=new THREE.Mesh(new THREE.CircleGeometry(.065,30),new THREE.MeshBasicMaterial({color:0xe6fff3,transparent:true,opacity:.65}));glintSmall.position.set(.11,.24,1.543);model.add(glintSmall);
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2;const tooth=new THREE.Mesh(new THREE.BoxGeometry(.025,.065,.31),graphite);tooth.position.set(.25+Math.sin(a)*.899,-.02+Math.cos(a)*.899,.85);tooth.rotation.z=-a;model.add(tooth)}
  const shutter=new THREE.Mesh(new THREE.CylinderGeometry(.20,.23,.14,32),green);shutter.position.set(-1.12,1.13,.05);model.add(shutter);
  const dial=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.14,32),graphite);dial.position.set(1.03,1.1,-.15);model.add(dial);
  for(let i=0;i<12;i++){const dot=new THREE.Mesh(new THREE.SphereGeometry(.018,8,6),silver);const a=i/12*Math.PI*2;dot.position.set(1.03+Math.cos(a)*.22,1.176,-.15+Math.sin(a)*.22);model.add(dot)}
  const flash=box(.44,.23,.07,.03,white);flash.position.set(1.12,.59,.45);model.add(flash);
  const led=new THREE.Mesh(new THREE.SphereGeometry(.052,12,8),green);led.position.set(.94,.29,.47);model.add(led);
  const labelCanvas=document.createElement('canvas');labelCanvas.width=512;labelCanvas.height=128;
  const ctx=labelCanvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.font='bold 70px Arial';ctx.textBaseline='middle';ctx.fillText('IPRESS',12,63);
  const labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;
  const label=new THREE.Mesh(new THREE.PlaneGeometry(.92,.23),new THREE.MeshBasicMaterial({map:labelTexture,transparent:true}));label.position.set(-.78,.61,.491);model.add(label);
  const strapLeft=new THREE.Mesh(new THREE.TorusGeometry(.12,.035,8,24),silver);strapLeft.rotation.y=Math.PI/2;strapLeft.position.set(-1.77,.51,0);model.add(strapLeft);
  const strapRight=strapLeft.clone();strapRight.position.x=1.77;model.add(strapRight);
  // Contact shadow follows the model, using a tiny procedural texture.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sctx=shadowCanvas.getContext('2d');
  const gradient=sctx.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(26,45,24,.24)');gradient.addColorStop(1,'rgba(26,45,24,0)');sctx.fillStyle=gradient;sctx.fillRect(0,0,128,128);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(4.8,1.1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.position.set(0,-1.65,-.7);shadow.rotation.x=-.6;scene.add(shadow);
  let targetX=0,targetY=0,currentX=0,currentY=0,inView=true,frame=0,shutterTime=0,dirty=true;
  function size(){const rect=container.getBoundingClientRect();if(!rect.width||!rect.height)return;renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();dirty=true;requestFrame()}
  function render(time){
    frame=0;if(!inView||document.hidden)return;
    const t=time*.001;
    currentX+=(targetX-currentX)*.065;currentY+=(targetY-currentY)*.065;
    const bounce=shutterTime&&!reduced?Math.max(0,1-(time-shutterTime)/500):0;
    model.rotation.set(.13+currentY*.17,-.38+currentX*.34,-.14+(reduced?0:Math.sin(t*.65)*.025));
    model.position.y=(reduced?0:Math.sin(t*.8)*.065)+bounce*.08;
    shutter.position.y=1.13-bounce*.065;
    model.scale.setScalar(1+bounce*.015);
    renderer.render(scene,camera);dirty=false;
    container.classList.add('ready');
    if(!reduced)requestFrame();
  }
  function requestFrame(){if(!frame&&inView&&!document.hidden)frame=requestAnimationFrame(render)}
  hero.addEventListener('pointermove',event=>{if(reduced||!finePointer.matches)return;const rect=hero.getBoundingClientRect();targetX=(event.clientX-rect.left)/rect.width*2-1;targetY=(event.clientY-rect.top)/rect.height*2-1;requestFrame()},{passive:true});
  hero.addEventListener('pointerleave',()=>{targetX=0;targetY=0;requestFrame()});
  window.addEventListener('ipress:motion',event=>{reduced=event.detail.reduced;targetX=0;targetY=0;currentX=0;currentY=0;dirty=true;requestFrame()});
  window.addEventListener('ipress:shutter',()=>{shutterTime=performance.now();requestFrame()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0}else requestFrame()});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)requestFrame();else if(frame){cancelAnimationFrame(frame);frame=0}},{rootMargin:'80px'}).observe(container);
  if('ResizeObserver' in window)new ResizeObserver(size).observe(container);else window.addEventListener('resize',size);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();container.classList.remove('ready');if(frame)cancelAnimationFrame(frame);frame=0;inView=false});
  canvas.addEventListener('webglcontextrestored',()=>{inView=true;size()});
  window.addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame);frame=0});
  window.addEventListener('pageshow',()=>requestFrame());
  size();
}
