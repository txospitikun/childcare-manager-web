import { setCookie, getCookie, deleteCookie } from '../workers/cookie_worker.js';
import config from './../../../../config.js';

const logged_user_profile_name = document.getElementById("user-profile-name");
const logged_user_profile_type = document.getElementById("user-profile-type");

const user_children = document.getElementById("added-children-container");

const confirm_add_child_bttn = document.getElementById("confirm-add-child");
const add_child_input_fname = document.getElementById("add_child_input_fname");
const add_child_input_lname = document.getElementById("add_child_input_lname");
const add_child_input_sex = document.getElementById("add_child_input_sex");
const add_child_input_birthdate = document.getElementById("add_child_input_birthdate");

confirm_add_child_bttn.addEventListener('click', () =>
{
    console.log("b");
    const fname = add_child_input_fname.value;
    const lname = add_child_input_lname.value;
    const sex = add_child_input_sex.value;
    const birthdate = add_child_input_birthdate.value;

    const jwtToken = getCookie('JWT');
    const token = cookieString.substring(4);
    fetch(`${config.apiUrl}/insert_children`, {
        mode: 'no-cors',
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ChildrenInfo: {FirstName: fname, LastName: lname, Sex: sex, Birthdate: birthdate}}),
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
                console.log(data);
                fetch(`${config.apiUrl}/load_children`, {
                    mode: 'no-cors',
                    method: 'POST',
                    headers: 
                    {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    })
                    .then(response =>
                        {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                            }
                            return response.json();
                        }
                    ).then(data => {
                        
                    });
                    
            }

        );
})

function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

document.addEventListener('DOMContentLoaded', (e) =>
{
    let currentJWTToken = getCookie('JWT');
    if(currentJWTToken == null)
    {
        window.location.href = "/frontend/modals/login_modal/login.html";
        return;
    }
    fetch(`${config.apiUrl}/load_user`, {
        mode: 'no-cors',
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        },
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
                switch(data['Response'])
                {
                    case 200:
                        localStorage.setItem('userInfo', JSON.stringify(data["UserInfo"]));
                        break;
                    case 201:
                        console.log("Failed to authentificate JWT Token.");
                        window.location.href = '/frontend/modals/login_modal/login.html'
                        break;
                }
            }
        );

    fetch(`${config.apiUrl}/load_children`, {
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
        ).then(data => {
            data["ChildrenInfo"].forEach(element => {
                const dob = new Date(element.dateofbirth);
                const age = calculateAge(dob);
        
                user_children.innerHTML += `
                <a class="children-container">
                    <img src="../placeholders/child2.jpg" class="photo-container" alt="child2">
                    <div class="info-container">
                        <p>${element.firstname + " " + element.lastname}</p>
                        <p>Age: ${age}</p>
                    </div>
                </a>`;
            });
        });
        
        
    
    

    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let profile_name = '';
    profile_name = userInfo["firstname"] + " " + userInfo["lastname"];
    logged_user_profile_name.innerHTML = profile_name;
    logged_user_profile_type.innerHTML = userInfo["accounttype"];
})


function loadAllChildren()
{
    
}