import config from './../../../config.js';
import { sha256 } from './../../workers/crypto_worker.js';

const register_fname = document.getElementById('register_fname');
const register_lname = document.getElementById('register_lname');
const register_email = document.getElementById('register_email');
const register_password = document.getElementById('register_password');
const register_confirm_password = document.getElementById('register_confirm_password');

const register_form = document.getElementById('registerFormId');

const register_response = document.getElementById('register_response');
const confirm_register_bttn = document.getElementById('confirm_register');

register_form.addEventListener('submit', (e) =>
{
  e.preventDefault();
});

confirm_register_bttn.addEventListener('click', () => {

  let data = {
    firstname: register_fname.value,
    lastname: register_lname.value,
    email: register_email.value,
    password: sha256(register_password.value),
    confirm_password: sha256(register_confirm_password.value)
  };

  fetch(`${config.apiUrl}/api/register`, {
    mode: 'no-cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    switch(data['RegisterResponse'])
    {
      case 102:
        register_response.style.color = 'red';
        register_response.innerHTML = "Există deja un cont inregistrat cu aceast email.";
        break;
      case 101:
        register_response.style.color = 'red';
        register_response.innerHTML = "Parolele nu coincid.";
        break;
      case 100:
        register_response.style.color = 'green';
        register_response.innerHTML = "Înregistrat cu succes! Confirmă pe email!";
        break;
    }
  })
  .catch(error => {
    console.error('Request failed', error);
  });
});