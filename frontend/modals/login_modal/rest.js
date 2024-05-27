import { sha256 } from './../../workers/crypto_worker.js';
import { setCookie, getCookie, deleteCookie } from '../../workers/cookie_worker.js';
import config from './../../../config.js';

function hash(text) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(text);
  return hmac.digest('hex');
}

const login_email = document.getElementById('login_email');
const login_password = document.getElementById('login_password');

const login_form = document.getElementById('loginFormId');

const login_response = document.getElementById('login_response');
const confirm_login_bttn = document.getElementById('confirm_login');

login_form.addEventListener('submit', (e) =>
{
    e.preventDefault();
});

confirm_login_bttn.addEventListener('click', () => {

  let data = {
    email: login_email.value,
    password: sha256(login_password.value),
  };


  fetch(`${config.apiUrl}/account_login`, {
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
    switch(data['LoginResponse'])
    {
        case 110:
            console.log(data);
            login_response.style.color = 'green';
            login_response.innerHTML = "Te-ai logat cu succes!";
            console.log("begin cookie set1");
            setCookie('JWT', data['JWTToken'], 1);
            console.log("end cookie set");
            localStorage.setItem('userInfo', JSON.stringify(data['UserInfo']));

            window.location.href = '/frontend/dashboard/dashboard.html';
            break;
        case 111:
            login_response.style.color = 'red';
            login_response.innerHTML = "Parola sau email-ul este incorectă!";
            break;
        case 112:
            login_response.style.color = 'red';
            login_response.innerHTML = "Contul este suspendat!";
            break;
        case 113:
            register_response.style.color = 'red';
            login_response.innerHTML = "Contul nu are adresa de email verificata!";
            break;
    }
  })
  .catch(error => {
    console.error('Request failed', error);
  });
});