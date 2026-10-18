(() => {
  'use strict';
  const form=document.querySelector('#interest-explorer'); if(!form)return;
  const labelMap={design:'Design graphique',editing:'Montage vidéo',communication:'Communication',photography:'Photographie',camera:'Caméraman / Camérawoman',journalism:'Journalisme & reportage'};
  const passions={design:['Donne une forme à tes idées.','Des affiches aux identités visuelles, ton regard peut faire la différence.'],editing:['Trouve ton rythme.','Une séquence, un montage, une histoire : imagine les récits que tu aimerais construire.'],communication:['Fais circuler l’énergie.','Des mots justes et de belles idées pour créer des liens avec le campus.'],photography:['Vois l’instant autrement.','Un détail ou une émotion : il y a toujours une histoire à saisir.'],camera:['Passe derrière la caméra.','Pense tes plans, explore les cadrages et donne du mouvement aux histoires.'],journalism:['Chaque voix a une histoire.','Pose des questions, écoute et raconte les rencontres qui font vivre l’école.']};
  const interests=()=>[...form.querySelectorAll('input[name="interests"]:checked')].map(el=>el.value);
  form.querySelectorAll('input[name="interests"]').forEach(input=>input.addEventListener('change',()=>{
    const selected=interests(),count=selected.length,last=selected[selected.length-1];
    document.querySelector('#selection-feedback').textContent=count?`${count} domaine${count>1?'s':''} sélectionné${count>1?'s':''} · ${selected.map(value=>labelMap[value]).join(' + ')}`:'Plusieurs passions ? Ne te limite pas à une seule.';
    document.querySelector('#pass-count').textContent=count?`${count} ENVIE${count>1?'S':''} DE CRÉER`:'∞ POSSIBILITÉS';
    document.querySelector('#pass-title').textContent=last?passions[last][0]:'Un regard de plus. Une idée de plus.';
    document.querySelector('#pass-description').textContent=last?passions[last][1]:'Choisis tes domaines et imagine ce que tu pourrais créer avec l’équipe.';
  }));
})();
