
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.textContent = open ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.textContent = '☰';
    });
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

// Existing SHIVAM Google Apps Script endpoint
const ENQUIRY_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbw_h91WW4Fuw4Wude_Ya_2HN2qsUVc4F8s3wKBzG9TNGzLjm3yeW9zZ75A8U0tJJYdfBA/exec';

const form = document.getElementById('enquiry-form');
const status = document.getElementById('form-status');
const submitButton = document.getElementById('submit-button');

if (form && status && submitButton) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    status.textContent = 'Sending your enquiry…';
    status.className = 'form-status';

    try {
      const data = new URLSearchParams();

      for (const [key, value] of new FormData(form).entries()) {
        data.append(key, value);
      }

      await fetch(ENQUIRY_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: data
      });

      status.textContent =
        'Your enquiry has been sent. SHIVAM will contact you using the details provided.';
      status.className = 'form-status success';
      form.reset();

    } catch (error) {
      status.textContent =
        'Unable to send your enquiry. Please call +91 97648 10096 or email shivammaintainers@yahoo.com.';
      status.className = 'form-status error';

    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send Enquiry <span>↗</span>';
    }
  });
}
