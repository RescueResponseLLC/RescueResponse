document.addEventListener('DOMContentLoaded', function () {
  var BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwp4Snzqx1BiGlbOmJEXDK3ws7bhEMHFYJBdhkOvg6c0xamBGVWrmd9CDAIC_D7i92HxA/exec';

  document.querySelectorAll('.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      var data = new FormData(form);
      data.append('_subject', 'New RescueRadius inquiry');
      data.append('_captcha', 'false');
      data.append('_template', 'table');

      // Auto-create a pending kit in the Ops tool from whatever was typed,
      // so nothing has to be re-entered by hand later.
      var serviceType = form.dataset.serviceType || 'General Inquiry';
      var nameField = form.querySelector('[name="name"]');
      var emailField = form.querySelector('[name="email"]');
      var phoneField = form.querySelector('[name="phone"]');
      var messageField = form.querySelector('[name="message"]');
      fetch(BACKEND_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submitOrder',
          type: serviceType,
          client: nameField ? nameField.value : '',
          clientEmail: emailField ? emailField.value : '',
          clientPhone: phoneField ? phoneField.value : '',
          message: messageField ? messageField.value : ''
        })
      }).catch(function(){ /* non-critical — email still sends below */ });

      fetch('https://formsubmit.co/ajax/team@rescueradius.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          form.style.display = 'none';
          var success = form.nextElementSibling;
          if (success && success.classList.contains('form-success')) {
            success.style.display = 'block';
          }
        })
        .catch(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send'; }
          var note = form.querySelector('.submit-note');
          if (note) { note.textContent = 'Something went wrong — please reach us directly at team@rescueradius.com or (208) 918-3185.'; }
        });
    });
  });
});
