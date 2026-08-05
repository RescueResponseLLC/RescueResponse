document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      var data = new FormData(form);
      data.append('_subject', 'New RescueRadius inquiry');
      data.append('_captcha', 'false');
      data.append('_template', 'table');

      fetch('https://formsubmit.co/ajax/RescueRadius@outlook.com', {
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
          if (note) { note.textContent = 'Something went wrong — please reach us directly at RescueRadius@outlook.com or (207) 350-9787.'; }
        });
    });
  });
});
