document.addEventListener('DOMContentLoaded', event => {
  let message_CB = {
    'first-name' : ['First Name is a required field', (event) => event.target.value.length === 0],
    'last-name' : ['Last Name is required', (event) => event.target.value.length === 0],
    'email' : ['Valid Email is required', (event) => !event.target.value.match(/.+@.+/)],
    'password' : ['Password must be at least 10 characters', (event) => event.target.value.length < 10],
    'phone-number' : ['Please enter phone number in format 123-123-1234', (event) => !event.target.value.match(/\d{3}-\d{3}-\d{4}/) && event.target.value !== ''],
  };

  let form = document.querySelector('form');

  function focused(event, id, error) {
    event.target.classList.remove('borderRed');
    event.target.classList.add('borderGreen');
    if (event.target.id === id) document.getElementById(error).innerText = '';
  }

  function blurred(event, id, error, message, cb) {
    if (event.target.id === id) {
      let errors = document.getElementById(error);
      if (cb(event)) {
        errors.innerText = message;
        event.target.classList.add('borderRed');
      } else {
        event.target.classList.remove('borderRed');
        event.target.classList.remove('borderGreen');
      }
    }
  }

  function allFocused(event) {
    ['first-name', 'last-name', 'email', 'password', 'phone-number'].forEach(id => {
      focused(event, id, `${id}-error`);
    });
  }
  
  function allBlurred(event) {
    ['first-name', 'last-name', 'email', 'password', 'phone-number'].forEach(id => {
      blurred(event, id, `${id}-error`, message_CB[id][0], message_CB[id][1]);
    });
  }
  
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', allFocused);
    input.addEventListener('blur', allBlurred);
  });

  document.getElementById('signup').addEventListener('keypress', event => {
    let id = event.target.id
    if (id.match(/name/)) {
      if (!event.key.match(/[a-zA-Z'\s]/)) event.preventDefault()
    } else if (id.match(/phone/)) {
      if (!event.key.match(/[\d-]/)) event.preventDefault()
    } else if (event.target.classList.contains('credit-card-input')) {
      if (!event.key.match(/[\d]/)) event.preventDefault()
    }
  })
  
  form.addEventListener('submit', event => {
    event.preventDefault();
    ['first-name', 'last-name', 'email', 'password', 'phone-number'].forEach(id => {
      blurred({ target: document.getElementById(id) }, id, `${id}-error`, message_CB[id][0], message_CB[id][1]);
    });
    if (Array.from(document.querySelectorAll('input')).every(input => !input.classList.contains('borderRed'))) {
      document.querySelector('#error').innerText = '';
      let formData = new FormData(form);
      let ccNum = []
      document.querySelectorAll('.credit-card-inputs input').forEach(n => ccNum.push(n.value));
      formData.append('credit-card', ccNum.join(''))
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
    } else {
      document.querySelector('#error').innerText = 'Please fix errors in the form';
    }
  });
});