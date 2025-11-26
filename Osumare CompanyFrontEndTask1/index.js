// script.js - modal, validation, add-submission logic
document.addEventListener('DOMContentLoaded', () => {
  // elements
  const openForm = document.getElementById('openForm');
  const openForm2 = document.getElementById('openForm2');
  const formModal = document.getElementById('formModal');
  const closeForm = document.getElementById('closeForm');
  const cancelForm = document.getElementById('cancelForm');
  const leadForm = document.getElementById('leadForm');

  const thankYou = document.getElementById('thankYou');
  const closeThank = document.getElementById('closeThank');

  const subTableBody = document.querySelector('#subTable tbody');
  const yearSpan = document.getElementById('year');
  yearSpan.textContent = new Date().getFullYear();

  // show/hide modal helpers
  function showModal() { formModal.setAttribute('aria-hidden','false'); document.getElementById('firstName').focus(); }
  function hideModal() { formModal.setAttribute('aria-hidden','true'); }

  function showThank() { thankYou.setAttribute('aria-hidden','false'); }
  function hideThank() { thankYou.setAttribute('aria-hidden','true'); }

  // link buttons
  if(openForm) openForm.addEventListener('click', showModal);
  if(openForm2) openForm2.addEventListener('click', showModal);
  if(closeForm) closeForm.addEventListener('click', hideModal);
  if(cancelForm) cancelForm.addEventListener('click', hideModal);
  if(closeThank) closeThank.addEventListener('click', hideThank);

  // form validation helpers
  function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function gatherLanguages(){ return Array.from(document.querySelectorAll('.lang:checked')).map(i=>i.value).join(', '); }

  leadForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // clear previous errors
    ['err-first','err-last','err-gender','err-email','err-terms'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent=''; });

    // get values
    const first = document.getElementById('firstName').value.trim();
    const last = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const gender = genderEl ? genderEl.value : '';
    const langs = gatherLanguages();
    const terms = document.getElementById('terms').checked;

    let ok = true;
    if(!first){ document.getElementById('err-first').textContent='First name required'; ok=false; }
    if(!last){ document.getElementById('err-last').textContent='Last name required'; ok=false; }
    if(!gender){ document.getElementById('err-gender').textContent='Select gender'; ok=false; }
    if(!email){ document.getElementById('err-email').textContent='Email required'; ok=false; }
    else if(!validEmail(email)){ document.getElementById('err-email').textContent='Enter valid email'; ok=false; }
    if(!terms){ document.getElementById('err-terms').textContent='Accept terms to continue'; ok=false; }

    if(!ok) return;

    // create new table row (append newest at top)
    const tr = document.createElement('tr');
    const ts = new Date().toLocaleString();
    tr.innerHTML = `<td>${escapeHtml(first + ' ' + last)}</td>
                    <td>${escapeHtml(email)}</td>
                    <td>${escapeHtml('')}</td>
                    <td>${escapeHtml(gender)}</td>
                    <td>${escapeHtml(langs)}</td>
                    <td>${escapeHtml(ts)}</td>`;
    // prepend
    if(subTableBody.firstChild) subTableBody.insertBefore(tr, subTableBody.firstChild);
    else subTableBody.appendChild(tr);

    // reset & show thank you
    leadForm.reset();
    hideModal();
    showThank();
  });

  // close modal by clicking overlay
  formModal.addEventListener('click', (e)=>{ if(e.target === formModal) hideModal(); });
  thankYou.addEventListener('click', (e)=>{ if(e.target === thankYou) hideThank(); });

  // simple escaping to avoid basic injection
  function escapeHtml(text){
    return String(text).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
  }
});
