'use strict';

// Corrected character association: Mohamed Amine, Aimade, Houssam, Rim, El Mamoune, Wassima, Zineb.
const team = [
  {id:'amine',first:'MOHAMED AMINE',last:'El Omri',role:'Responsable du son',short:'Son'},
  {id:'aimade',first:'AIMADE',last:'Oukessou',role:'Responsable de la communication',short:'Communication'},
  {id:'houssam',first:'HOUSSAM',last:'Assaoui',role:'Responsable du design',short:'Design'},
  {id:'rim',first:'RIM',last:'Ammerti',role:'Responsable des médias',short:'Médias'},
  {id:'mamoune',first:'EL MAMOUNE',last:'Beneladem',role:'Vice-président',short:'Vice-présidence'},
  {id:'wassima',first:'WASSIMA',last:'El Fakir',role:'Présidente',short:'Présidence'},
  {id:'zineb',first:'ZINEB',last:'El Kenz',role:'Responsable du montage',short:'Montage'}
];
const photos = [
  {src:'assets/crew.jpg',caption:'L’énergie du collectif.',alt:'Des membres d’IPRESS présentent leurs badges sur le campus'},
  {src:'assets/campus.jpg',caption:'Un campus qui rassemble.',alt:'Grande photographie de groupe devant l’entrée de l’IFMEREE'},
  {src:'assets/together.jpg',caption:'Les liens se créent.',alt:'Des membres réunis en extérieur devant l’école'},
  {src:'assets/badges.jpg',caption:'Dans les coulisses.',alt:'Trois membres IPRESS montrent leurs badges et leur matériel'},
  {src:'assets/welcome.jpg',caption:'Le plaisir d’être ensemble.',alt:'Le groupe réuni autour d’une table sur le campus'},
  {src:'assets/action.jpg',caption:'Toujours dans l’action.',alt:'Deux membres de l’équipe avec un appareil photo et du matériel'}
];
const missions = [
  {interest:'l’écriture et le journalisme',title:'Raconte une première impression.',description:'En cinq lignes, raconte un détail de ta première journée à l’IFMEREE. Le lieu, une rencontre, une surprise : ton point de vue suffit.'},
  {interest:'la photographie',title:'Un campus. Trois regards.',description:'Imagine trois photos de ton campus : un détail, un lieu et un moment de vie. Si tu photographies des personnes, demande-leur d’abord leur accord.'},
  {interest:'la vidéo',title:'Pense une histoire en trois plans.',description:'Imagine une mini-vidéo : une ouverture, une action, une fin. Dessine tes trois plans sur une feuille. Une bonne histoire commence souvent comme ça.'},
  {interest:'le design graphique',title:'Donne une forme à une idée.',description:'Imagine une petite affiche de bienvenue : un titre, du bleu, du vert et une seule idée forte. Fais un croquis et apporte ton regard à l’équipe.'},
  {interest:'le son et l’audio',title:'Écoute le campus autrement.',description:'Repère trois sons qui donnent une identité au campus. Imagine comment les assembler pour raconter une ambiance en dix secondes.'},
  {interest:'la communication',title:'Trouve les mots qui rassemblent.',description:'Écris une invitation au club en deux phrases. Ton défi : donner envie de créer ensemble avec des mots simples et une énergie qui te ressemble.'}
];
const $ = (selector,root=document) => root.querySelector(selector);
const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionQuery.matches;
let motionOverride = false;
try { const stored=sessionStorage.getItem('ipress-motion'); if(stored!==null){reducedMotion=stored==='reduce';motionOverride=true;} } catch {}
function updateMotion(){
  document.documentElement.classList.toggle('reduce-motion',reducedMotion);
  document.documentElement.classList.toggle('allow-motion',motionOverride&&!reducedMotion);
  const toggle=$('.motion-toggle');
  toggle.setAttribute('aria-pressed',String(reducedMotion));
  toggle.setAttribute('aria-label',reducedMotion?'Activer les animations':'Réduire les animations');
  toggle.title=reducedMotion?'Activer les animations':'Réduire les animations';
  $('.pause-icon').textContent=reducedMotion?'▷':'Ⅱ';
  window.dispatchEvent(new CustomEvent('ipress:motion',{detail:{reduced:reducedMotion}}));
}
$('.motion-toggle').addEventListener('click',()=>{reducedMotion=!reducedMotion;motionOverride=true;try{sessionStorage.setItem('ipress-motion',reducedMotion?'reduce':'full')}catch{}updateMotion()});
motionQuery.addEventListener('change',e=>{if(!motionOverride){reducedMotion=e.matches;updateMotion()}});
updateMotion();

const menuButton=$('.menu-toggle'), mobileNav=$('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Ouvrir le menu')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';mobileNav.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu')});
$$('a',mobileNav).forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus()}});
window.matchMedia('(min-width: 801px)').addEventListener('change',e=>{if(e.matches)closeMenu()});

if('IntersectionObserver' in window){
  const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveals.unobserve(entry.target)}}),{threshold:.08});
  $$('.reveal').forEach(el=>reveals.observe(el));
  document.documentElement.classList.add('enhanced');
}
let scrollPending=false;
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;$('.reading-progress').style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,window.scrollY/max)):0})`;scrollPending=false}
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateProgress)}},{passive:true});
window.addEventListener('resize',updateProgress);updateProgress();

const symbols=['Aa','◎','✳','ıılıı'];
const artImages={1:'assets/art-photo-video.jpg',2:'assets/art-design.jpg',3:'assets/art-sound.jpg'};
function artNode(index){
  if(index===1){const wrap=document.createElement('i');wrap.className='art-photo art-circles';wrap.innerHTML='<i class="art-ring"><i class="art-ring-inner"></i></i>';return wrap}
  if(index===2){const star=document.createElement('i');star.className='art-photo art-star';star.innerHTML='<i></i>';return star}
  if(index===3){const bars=document.createElement('i');bars.className='art-photo art-bars';bars.innerHTML='<i></i>';return bars}
  return document.createTextNode(symbols[index]);
}
(window.requestIdleCallback||window.setTimeout)(()=>Object.values(artImages).forEach(src=>{const img=new Image();img.src=src}));
$$('.discipline>button').forEach((button,index)=>button.addEventListener('click',()=>{
  $$('.discipline').forEach((row,i)=>{const active=i===index;row.classList.toggle('active',active);$('button',row).setAttribute('aria-expanded',String(active));$('.discipline-description',row).hidden=!active});
  const art=$('.discipline-art');art.dataset.art=String(index);$('.type-symbol',art).replaceChildren(artNode(index));
  if(index===0){const quote=document.createElement('span');quote.textContent='“';$('.type-symbol',art).append(quote)}
  if(!reducedMotion&&art.animate)art.animate([{opacity:0,transform:'scale(.88) rotate(-8deg)'},{opacity:1,transform:'scale(1) rotate(0)'}],{duration:500,easing:'cubic-bezier(.2,.7,.2,1)'});
}));

let memberIndex=0;
const stage=$('.team-stage'),characters=$('#characters'),selector=$('#crew-selector');
team.forEach((member,index)=>{
  const character=document.createElement('button');character.type='button';character.className='character';character.dataset.index=index;character.setAttribute('aria-label',`Découvrir ${member.first} ${member.last}, ${member.role}`);
  const img=document.createElement('img');img.src=`assets/${member.id}.webp`;img.alt='';img.width=650;img.height=960;img.loading='lazy';img.decoding='async';img.draggable=false;character.append(img);character.addEventListener('click',()=>{if(Date.now()>suppressClickUntil)selectMember(index)});characters.append(character);
  const tab=document.createElement('button');tab.type='button';tab.className='crew-tab';tab.dataset.index=index;tab.setAttribute('aria-label',`${member.first} ${member.last}, ${member.role}`);
  const number=document.createElement('span');number.className='mono';number.textContent=`0${index+1}`;
  const name=document.createElement('strong');name.textContent=member.first;
  const role=document.createElement('span');role.className='tab-role';role.textContent=member.short;
  tab.append(number,name,role);tab.addEventListener('click',()=>selectMember(index));selector.append(tab);
});
function layoutCharacters(){
  const step=stage.clientWidth*(window.innerWidth<561?.37:.34);
  $$('.character').forEach((character,index)=>{
    let offset=(index-memberIndex+team.length)%team.length;if(offset>3)offset-=team.length;
    const distance=Math.abs(offset),visible=distance<=1;
    character.classList.toggle('is-current',offset===0);
    character.style.transform=`translateX(${offset*step}px) translateZ(${-distance*105}px) rotateY(${-offset*18}deg) rotateZ(${offset*4}deg) scale(${1-distance*.23})`;
    character.style.opacity=visible?(offset===0?'1':'.7'):'0';
    character.style.zIndex=String(10-distance);character.style.pointerEvents=visible?'auto':'none';character.tabIndex=visible?0:-1;
    character.setAttribute('aria-hidden',String(!visible));character.setAttribute('aria-pressed',String(offset===0));
  });
}
function selectMember(index,animate=true){
  memberIndex=(index+team.length)%team.length;const member=team[memberIndex];
  $('#member-name').replaceChildren(document.createTextNode(member.first+' '),document.createElement('br'),document.createTextNode(member.last));
  $('#member-role').textContent=member.role;$('#member-number').textContent=String(memberIndex+1).padStart(2,'0');$('#team-counter').textContent=`0${memberIndex+1} / 07`;
  $$('.crew-tab').forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===memberIndex)));
  layoutCharacters();
  if(animate){const active=$$('.crew-tab')[memberIndex];const left=active.offsetLeft-selector.offsetLeft;if(selector.scrollWidth>selector.clientWidth)selector.scrollTo({left:Math.max(0,left-selector.clientWidth/2+active.clientWidth/2),behavior:reducedMotion?'instant':'smooth'});if(!reducedMotion&&$('.member-profile').animate)$('.member-profile').animate([{opacity:.35,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,easing:'ease-out'})}
}
let suppressClickUntil=0;
$('#team-prev').addEventListener('click',()=>selectMember(memberIndex-1));$('#team-next').addEventListener('click',()=>selectMember(memberIndex+1));
stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();selectMember(memberIndex+(event.key==='ArrowRight'?1:-1))}});
selector.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();selectMember(memberIndex+(event.key==='ArrowRight'?1:-1));$$('.crew-tab')[memberIndex].focus({preventScroll:true})}});
let swipeStart=null;
stage.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.team-arrows'))return;swipeStart={x:e.clientX,y:e.clientY,id:e.pointerId}});
stage.addEventListener('pointerup',e=>{if(!swipeStart||e.pointerId!==swipeStart.id)return;const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.4){suppressClickUntil=Date.now()+250;selectMember(memberIndex+(dx<0?1:-1))}});
stage.addEventListener('pointercancel',()=>swipeStart=null);
if('ResizeObserver' in window)new ResizeObserver(layoutCharacters).observe(stage);else window.addEventListener('resize',layoutCharacters);
selectMember(0,false);

const lightbox=$('#lightbox');let photoIndex=0;let lastDialogTrigger=null;
function openDialog(dialog,trigger){lastDialogTrigger=trigger||document.activeElement;dialog.showModal();document.body.classList.add('modal-open')}
function updatePhoto(index){photoIndex=(index+photos.length)%photos.length;const photo=photos[photoIndex];$('#lightbox-image').src=photo.src;$('#lightbox-image').alt=photo.alt;$('#lightbox-caption').textContent=photo.caption;$('#lightbox-counter').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`}
function openPhoto(index,trigger){updatePhoto(index);openDialog(lightbox,trigger)}
$$('[data-photo]').forEach(button=>button.addEventListener('click',()=>openPhoto(Number(button.dataset.photo),button)));
$('#photo-prev').addEventListener('click',()=>updatePhoto(photoIndex-1));$('#photo-next').addEventListener('click',()=>updatePhoto(photoIndex+1));
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();updatePhoto(photoIndex+(event.key==='ArrowRight'?1:-1))}});
$$('[data-close]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.close).close()));
$$('dialog').forEach(dialog=>{
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lastDialogTrigger?.isConnected)lastDialogTrigger.focus({preventScroll:true})});
});
const wall=$('#photo-wall');
function moveGallery(direction){wall.scrollBy({left:direction*Math.max(285,wall.clientWidth*.7),behavior:reducedMotion?'instant':'smooth'})}
$('#gallery-prev').addEventListener('click',()=>moveGallery(-1));$('#gallery-next').addEventListener('click',()=>moveGallery(1));
wall.addEventListener('keydown',event=>{if(event.target===wall&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){event.preventDefault();moveGallery(event.key==='ArrowRight'?1:-1)}});
function galleryState(){const atStart=wall.scrollLeft<5,atEnd=wall.scrollLeft+wall.clientWidth>=wall.scrollWidth-5;$('#gallery-prev').disabled=atStart;$('#gallery-next').disabled=atEnd}
wall.addEventListener('scroll',galleryState,{passive:true});window.addEventListener('resize',galleryState);galleryState();
let shutterBusy=false;
$('#shutter').addEventListener('click',()=>{if(shutterBusy)return;shutterBusy=true;const flash=$('.shutter-flash');if(!reducedMotion)flash.classList.add('flash');$('.snapshot-notice').textContent='Un instant. Toute une équipe.';window.dispatchEvent(new Event('ipress:shutter'));setTimeout(()=>{flash.classList.remove('flash');openPhoto(0,$('#shutter'));shutterBusy=false},reducedMotion?0:450)});

let interestIndex=0;
$('#open-join').addEventListener('click',event=>{openDialog($('#join-dialog'),event.currentTarget);$('#copy-status').textContent=''});
$$('[data-interest]').forEach(button=>button.addEventListener('click',()=>{
  interestIndex=Number(button.dataset.interest);$$('[data-interest]').forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
  $('#mission-title').textContent=missions[interestIndex].title;$('#mission-description').textContent=missions[interestIndex].description;$('#copy-status').textContent='';$('.copy-fallback')?.remove();
}));
$('#copy-intro').addEventListener('click',async()=>{
  const message=`Bonjour l’équipe IPRESS ! Je suis à l’IFMEREE Tanger et j’aimerais découvrir le club. Je m’intéresse à ${missions[interestIndex].interest} et j’ai envie d’apprendre et de créer avec vous. Comment puis-je vous rejoindre ?`;
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(message);$('#copy-status').textContent='Message copié ! Tu peux le partager dans votre groupe du club.'}
  catch{let field=$('.copy-fallback');if(!field){field=document.createElement('textarea');field.className='copy-fallback';field.readOnly=true;field.setAttribute('aria-label','Message à copier');$('#copy-status').after(field)}field.value=message;field.focus();field.select();$('#copy-status').textContent='Sélectionne et copie ce message pour le partager avec le club.'}
});
