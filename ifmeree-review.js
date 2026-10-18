/* Optional, separate review UI. Not loaded by index.html. */
(() => {
 'use strict';
 const art=window.IFMEREEArt;if(!art)return;
 const facade=document.querySelector('[data-artwork="facade"]');
 const campus=document.querySelector('[data-artwork="campus"]');
 const range=document.querySelector('#facade-range');
 const output=document.querySelector('#facade-value');
 const pause=document.querySelector('#pause-facade');
 let frame=0,start=0;
 const stop=()=>{cancelAnimationFrame(frame);frame=0;pause.disabled=true};
 function setFacade(p){range.value=p*100;output.value=`${Math.round(p*100)} %`;art.facade(facade,p)}
 range.addEventListener('input',()=>{stop();setFacade(+range.value/100)});
 document.querySelector('#campus-range').addEventListener('input',event=>{document.querySelector('#campus-value').value=event.target.value+' %';art.campus(campus,+event.target.value/100)});
 document.querySelector('#play-facade').addEventListener('click',()=>{
  stop();setFacade(0);start=performance.now();pause.disabled=false;
  const draw=time=>{const p=Math.min(1,(time-start)/6400);setFacade(p);if(p<1)frame=requestAnimationFrame(draw);else stop()};
  frame=requestAnimationFrame(draw);
 });
 pause.addEventListener('click',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 const preview=document.querySelector('#site-preview');let width=1440;
 function open(hash=''){preview.hidden=false;preview.width=width;preview.height=width<=390?844:900;preview.src='index.html'+hash}
 document.querySelectorAll('[data-width]').forEach(button=>button.addEventListener('click',()=>{width=+button.dataset.width;document.querySelectorAll('[data-width]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));open()}));
 document.querySelector('#reload-preview').addEventListener('click',()=>open());
 document.querySelector('#campus-preview').addEventListener('click',()=>open('#ifmeree-discover'));
})();
