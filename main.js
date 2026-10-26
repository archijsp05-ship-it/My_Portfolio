(function () {
  'use strict';

  document.documentElement.classList.add('js');

  
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('primary-menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open)); // tells screen readers the state
    menu.classList.toggle('is-open', open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

  
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    
    window.matchMedia('(min-width: 48em)').addEventListener('change', function (e) {
      if (e.matches) { setMenu(false); }
    });
  }

  
  var yearEl = document.getElementById('current-year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  
  var form = document.getElementById('contact-form');
  if (!form) { return; }   

  var summary = document.getElementById('form-summary');
  var statusBox = document.getElementById('form-status');

  
  var rules = {
    name: function (value) {
      if (value.trim() === '') { return 'Enter your name.'; }
      if (value.trim().length < 2) { return 'Your name must be at least 2 characters.'; }
      return '';
    },
    email: function (value, field) {
      if (value.trim() === '') { return 'Enter your email address.'; }
      if (!field.validity.valid) { return 'Enter an email address in the format name@example.com.'; }
      return '';
    },
    subject: function (value) {
      if (value.trim() === '') { return 'Enter a subject.'; }
      return '';
    },
    message: function (value) {
      if (value.trim() === '') { return 'Enter a message.'; }
      if (value.trim().length < 10) { return 'Your message must be at least 10 characters.'; }
      return '';
    }
  };

  
  function validateField(field) {
    var message = rules[field.name](field.value, field);
    var errorEl = document.getElementById(field.id + '-error');

    errorEl.textContent = message ? 'Error: ' + message : '';
    if (message) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
    return message;
  }

  function fieldsList() {
    return Array.prototype.slice.call(form.querySelectorAll('input, textarea'));
  }

  
  function showSummary(problems) {
    summary.innerHTML = '';
    var heading = document.createElement('h3');
    heading.textContent = 'There ' + (problems.length === 1 ? 'is 1 problem' : 'are ' + problems.length + ' problems') + ' with your message';
    var list = document.createElement('ul');

    problems.forEach(function (problem) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + problem.field.id;
      link.textContent = problem.message;
      link.addEventListener('click', function (event) {
        event.preventDefault();
        problem.field.focus();
      });
      item.appendChild(link);
      list.appendChild(item);
    });

    summary.appendChild(heading);
    summary.appendChild(list);
    summary.hidden = false;
    summary.focus();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    statusBox.textContent = '';
    summary.hidden = true;

    var problems = [];
    fieldsList().forEach(function (field) {
      var message = validateField(field);
      if (message) { problems.push({ field: field, message: message }); }
    });

    if (problems.length > 0) {
      showSummary(problems);
      return;
    }

    
    statusBox.textContent =
      'Thank you, ' + form.elements.name.value.trim() + '. Your message passed validation. ' +
      'This demo form has no backend, so nothing was actually sent. ' +
      'Connect a form service to deliver real messages.';
    form.reset();
    updateCount();
  });


  fieldsList().forEach(function (field) {
    field.addEventListener('blur', function () {
      if (field.value !== '' || field.hasAttribute('aria-invalid')) { validateField(field); }
    });
    field.addEventListener('input', function () {
      if (field.hasAttribute('aria-invalid')) { validateField(field); }
    });
  });


  var messageField = document.getElementById('message');
  var counter = document.getElementById('message-count');

  function updateCount() {
    if (messageField && counter) {
      counter.textContent = messageField.value.length + ' of ' + messageField.maxLength + ' characters';
    }
  }
  if (messageField) {
    messageField.addEventListener('input', updateCount);
    updateCount();
  }
})();
