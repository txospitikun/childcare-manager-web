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
    password: login_password.value,
  };


  fetch('http://localhost:5000/account_login', {
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
            login_response.style.color = 'green';
            login_response.innerHTML = "Te-ai logat cu succes!";
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