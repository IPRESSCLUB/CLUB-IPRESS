(() => {
  'use strict';
  const form = document.querySelector('#application-form');
  const opener = document.querySelector('#open-application-form');
  if (!form || !opener) return;

  const ENDPOINT = 'https://api.web3forms.com/submit';
  const PLACEHOLDER = 'REMPLACE_PAR_TA_CLE_WEB3FORMS';
  const status = document.querySelector('#form-status');
  const submit = document.querySelector('#app-submit');
  const label = submit.querySelector('.submit-label');
  const interestLabels = {
    design: 'Design graphique',
    editing: 'Montage vidéo',
    communication: 'Communication',
    photography: 'Photographie',
    camera: 'Caméraman / Camérawoman',
    journalism: 'Journalisme & reportage'
  };
  const reduceMotion = () => document.documentElement.classList.contains('reduce-motion') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ouvrir / refermer le formulaire sur la page
  opener.addEventListener('click', () => {
    const willOpen = form.hidden;
    form.hidden = !willOpen;
    opener.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) {
      form.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => document.querySelector('#app-name')?.focus({ preventScroll: true }), reduceMotion() ? 0 : 350);
    }
  });

  const fields = {
    name: { el: '#app-name', err: '#err-name', check: v => v.trim().length >= 3 || 'Indique ton nom complet.' },
    filiere: { el: '#app-track', err: '#err-track', check: v => v.trim().length >= 2 || 'Indique ta filière et ton année.' },
    whatsapp: { el: '#app-whatsapp', err: '#err-whatsapp', check: v => /^\+?[0-9\s().-]{8,20}$/.test(v.trim()) && v.replace(/\D/g, '').length >= 8 || 'Indique un numéro WhatsApp valide.' },
    email: { el: '#app-email', err: '#err-email', check: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Cette adresse e-mail semble incorrecte.' },
    motivation: { el: '#app-motivation', err: '#err-motivation', check: v => v.trim().length >= 20 || 'Écris au moins quelques lignes (20 caractères minimum).' }
  };

  function setError(input, errEl, message) {
    errEl.textContent = message || '';
    if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }

  Object.values(fields).forEach(f => {
    const input = document.querySelector(f.el), errEl = document.querySelector(f.err);
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid')) { const r = f.check(input.value); setError(input, errEl, r === true ? '' : r); } });
  });

  function validate() {
    let firstBad = null;
    Object.values(fields).forEach(f => {
      const input = document.querySelector(f.el), errEl = document.querySelector(f.err);
      const r = f.check(input.value);
      setError(input, errEl, r === true ? '' : r);
      if (r !== true && !firstBad) firstBad = input;
    });
    const consent = document.querySelector('#app-consent'), consentErr = document.querySelector('#err-consent');
    if (!consent.checked) { consentErr.textContent = 'Merci de cocher cette case pour envoyer ta candidature.'; if (!firstBad) firstBad = consent; }
    else consentErr.textContent = '';
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  document.querySelector('#app-consent').addEventListener('change', () => { document.querySelector('#err-consent').textContent = ''; });

  function showStatus(message, isError) {
    status.textContent = message || '';
    status.classList.toggle('is-error', !!(message && isError));
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    showStatus('');
    if (!validate()) return;

    // Anti-spam : le champ piège doit rester vide
    if (form.elements.botcheck.checked) return;

    const accessKey = (form.dataset.accessKey || '').trim();
    if (!accessKey || accessKey === PLACEHOLDER) {
      showStatus('Le formulaire n’est pas encore activé. Réessaie un peu plus tard ou rejoins la communauté WhatsApp pour rester informé.', true);
      return;
    }

    const selected = [...document.querySelectorAll('#interest-explorer input[name="interests"]:checked')].map(i => interestLabels[i.value] || i.value);
    const name = form.elements.name.value.trim();
    const payload = {
      access_key: accessKey,
      subject: `Nouvelle candidature IPRESS — ${name}`,
      from_name: 'Site IPRESS — Candidatures',
      'Nom complet': name,
      'Filière et année': form.elements.filiere.value.trim(),
      'WhatsApp': form.elements.whatsapp.value.trim(),
      'E-mail': form.elements.email.value.trim() || '(non renseigné)',
      'Domaines choisis': selected.length ? selected.join(', ') : '(aucun domaine coché)',
      'Motivation': form.elements.motivation.value.trim(),
      botcheck: ''
    };
    if (form.elements.email.value.trim()) payload.replyto = form.elements.email.value.trim();

    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    const original = label.textContent;
    label.textContent = 'Envoi en cours…';
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) throw new Error(result.message || 'send-failed');
      // Only a confirmed server success reaches this presentation step.
      const box = document.createElement('div');
      box.className = 'application-success ipress-success';
      box.setAttribute('role', 'region');
      box.setAttribute('aria-labelledby', 'success-title');
      box.setAttribute('tabindex', '-1');
      box.innerHTML = `
        <div class="success-rail"><span class="mono">IPRESS × TOI</span><span class="success-state"><i aria-hidden="true"></i> CANDIDATURE TRANSMISE</span></div>
        <div class="success-content">
          <div class="success-emblem" aria-hidden="true">
            <span class="success-orbit"></span>
            <svg viewBox="0 0 80 80" fill="none"><circle class="success-ring" cx="40" cy="40" r="34"/><path class="success-tick" d="M24 40.5 35 51 57 29"/></svg>
            <span class="success-spark spark-one">✳</span><span class="success-spark spark-two">✦</span>
          </div>
          <div class="success-copy" role="status" aria-live="polite" aria-atomic="true">
            <span class="success-kicker mono">UNE NOUVELLE HISTOIRE S’OUVRE.</span>
            <h4 id="success-title">Merci, ta candidature<br>est <em>envoyée.</em></h4>
            <p>L’équipe IPRESS va découvrir ton profil et te contactera sur WhatsApp. En attendant, tu peux rejoindre la communauté.</p>
          </div>
          <div class="success-next"><span class="success-next-number mono">À SUIVRE ↗</span><p>Ta créativité a sa place dans la conversation.<br><span>L’adhésion sera confirmée par l’équipe.</span></p></div>
          <div class="success-actions"><a class="primary-button" href="https://chat.whatsapp.com/GarYt66WwYnEFJseaH64WM?s=cl&amp;p=a&amp;mlu=4&amp;ilr=4" target="_blank" rel="noopener noreferrer">Rejoindre la communauté <span aria-hidden="true">↗</span></a><a class="text-link" href="#moments">Continuer l’exploration <span aria-hidden="true">→</span></a></div>
        </div>
        <div class="success-signature mono"><span>TON REGARD. NOTRE PROCHAINE HISTOIRE.</span><span aria-hidden="true">✳</span></div>`;
      form.removeAttribute('aria-busy');
      form.replaceWith(box);
      opener.hidden = true;
      box.focus({ preventScroll: true });
      box.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'nearest' });
    } catch (error) {
      showStatus('Ta candidature n’a pas pu être envoyée. Vérifie ta connexion et réessaie dans un instant.', true);
      form.removeAttribute('aria-busy');
      submit.disabled = false;
      label.textContent = original;
    }
  });
})();
