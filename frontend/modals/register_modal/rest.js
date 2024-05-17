const register_email = document.getElementById('register_email');
const register_password = document.getElementById('register_password');
const register_confirm_password = document.getElementById('register_confirm_password');

const confirm_register_bttn = document.getElementById('confirm_register');

confirm_register_bttn.addEventListener('click', () => {

  let data = '';

  fetch('/account_register', {
    method: 'POST',
    body: data,
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Request succeeded with JSON response', data);
  })
  .catch(error => {
    console.error('Request failed', error);
  });
});