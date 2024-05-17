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
    email: register_email.value,
    password: register_password.value,
    register_confirm_password: register_confirm_password.value
  };

  fetch('http://localhost:5000/account_register', {
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