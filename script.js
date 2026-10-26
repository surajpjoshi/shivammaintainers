const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  toggle.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation'); toggle.textContent = '☰';
}));
document.getElementById('year').textContent = new Date().getFullYear();

// Paste the deployed Google Apps Script Web App URL here after completing SETUP.md.
const ENQUIRY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw_h91WW4Fuw4Wude_Ya_2HN2qsUVc4F8s3wKBzG9TNGzLjm3yeW9zZ75A8U0tJJYdfBA/exec';

const form = document.getElementById('enquiry-form');
const status = document.getElementById('form-status');
const submitButton = document.getElementById('submit-button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (!ENQUIRY_ENDPOINT.startsWith('https://script.google.com/macros/s/')) {
    status.textContent = 'The enquiry form is not connected yet. Please finish the setup in SETUP.md.';
    status.className = 'form-status error';
    return;
  }
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  status.textContent = 'Sending your enquiry…';
  status.className = 'form-status';
  try {
    const data = new URLSearchParams();
    for (const [key, value] of new FormData(form).entries()) data.append(key, value);
    // Apps Script accepts URL-encoded simple POST requests. no-cors prevents browser CORS
    // blocking; the response is opaque, so this UI cannot independently verify delivery.
    await fetch(ENQUIRY_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data });
    status.textContent = 'Your enquiry has been sent. SHIVAM will contact you using the details provided.';
    status.className = 'form-status success';
    form.reset();
  } catch (error) {
    status.textContent = 'We could not send your enquiry. Please call +91 97648 10096 or email shivammaintainers@yahoo.com.';
    status.className = 'form-status error';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send Enquiry <span>↗</span>';
  }
});
