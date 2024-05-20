import { setCookie, getCookie, deleteCookie } from '../workers/cookie_worker.js';


const logged_user_profile_name = document.getElementById("user-profile-name");
const logged_user_profile_type = document.getElementById("user-profile-type");


document.addEventListener('DOMContentLoaded', (e) =>
{
    let currentJWTToken = getCookie('JWT');
    fetch('http://localhost:5000/load_user', {
        mode: 'no-cors',
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentJWTToken),
        })
        .then(response =>
            {
            if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            }
        ).then(data => 
            {
                console.log("logged-in");
                switch(data['Response'])
                {

                }
            }
        )
    )

    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let profile_name = '';
    profile_name = userInfo["firstname"] + " " + userInfo["lastname"];
    logged_user_profile_name.innerHTML = profile_name;
    logged_user_profile_type.innerHTML = userInfo["accounttype"];
})


function loadAllChildren()
{
    
}