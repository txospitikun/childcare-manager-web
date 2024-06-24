const baseURL = 'http://192.168.1.242:5000/api/authorized';

let selectedUser = null;
let selectedChild = null;
let selectedUserDiv = null;
let selectedChildDiv = null;

export async function fetchAPI(endpoint, method, body = null, params = {}) {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);
    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
    }

    const url = new URL(`${baseURL}/${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

export async function fetchAllUsers() {
    const users = await fetchAPI('get_all_users', 'GET');
    displayUsers(users);
}

export async function fetchUserChildren(userId) {
    const children = await fetchAPI('get_all_children', 'GET', null, { userId });
    displayChildren(children);
}

export function displayUsers(users) {
    const usersList = document.getElementById('all-users');
    usersList.innerHTML = '';
    if (Array.isArray(users)) {
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'found-user';
            userDiv.innerHTML = `
                <div class="found-user-photo"></div>
                <div class="found-user-info">
                    <span>Nume: ${user.FirstName == null ? "N/A" : user.FirstName}</span>
                    <span>Prenume: ${user.LastName == null ? "N/A" : user.LastName}</span>
                    <span>Email: ${user.Email == null ? "N/A" : user.Email}</span>
                    <span>Suspendat: ${user.Suspended == 0 ? "NU" : "DA"}</span>
                    <span>Tip: ${mapAccountTypeToString(user.AccountType)}</span>
                    <span>Telefon: ${user.PhoneNo == null ? "N/A" : user.PhoneNo}</span>
                    <span>Locatie: ${user.Location == null ? "N/A" : user.Location}</span>
                    <span>Limbă: ${user.Language == null ? "N/A" : user.Language}</span>
                    <span>Statut civil: ${user.CivilState == null ? "Necăsătorit" : user.CivilState}</span>
                </div>
            `;
            userDiv.onclick = () => selectUser(user, userDiv);
            usersList.appendChild(userDiv);
        });
    } else {
        alert('Nu am putut încărca utilizatorii!.');
    }
}

export function displayChildren(children) {
    const childrenList = document.getElementById('children-list');
    childrenList.innerHTML = '';
    if (Array.isArray(children)) {
        children.forEach(child => {
            const childDiv = document.createElement('div');
            childDiv.className = 'found-child';
            childDiv.innerHTML = `
                <div class="found-child-photo"></div>
                <div class="found-child-info">
                    <span>Nume: ${child.FirstName == null ? "N/A" : child.FirstName}</span>
                    <span>Prenume:${child.LastName == null ? "N/A" : child.LastName}</span>
                    <span>Gen: ${child.Gender == null ? "N/A" : child.Gender}</span>
                    <span>Data nasterii: ${extractDate(child.DateOfBirth)}</span>
                </div>
            `;
            childDiv.onclick = () => selectChild(child, childDiv);
            childrenList.appendChild(childDiv);
        });
    } else {
        alert('Nu am putut încărca copiii!');
    }
}

function extractDate(dateTimeString) {
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function selectUser(user, userDiv) {
    if (selectedUserDiv) {
        selectedUserDiv.classList.remove('selected-user');
    }
    selectedUser = user;
    selectedUserDiv = userDiv;
    userDiv.classList.add('selected-user');
    fetchUserChildren(user.ID);
}

export function selectChild(child, childDiv) {
    if (selectedChildDiv) {
        selectedChildDiv.classList.remove('selected-child');
    }
    selectedChild = child;
    selectedChildDiv = childDiv;
    childDiv.classList.add('selected-child');
}

export async function deleteUser() {
    if (!selectedUser) return alert('Selectează un utilizator mai întâi!');
    await fetchAPI(`delete_user?userID=${selectedUser.ID}`, 'DELETE');
    alert('User deleted successfully');
    fetchAllUsers();
    selectedUser = null;
    selectedUserDiv = null;
}

export async function deactivateUser() {
    if (!selectedUser) return alert('Selectează un utilizator mai întâi!');
    await fetchAPI(`edit_user`, 'PUT', { ID: selectedUser.ID, Suspended: 1 });
    alert('Suspendarea a fost schimbata!');
    fetchAllUsers();
    selectedUser = null;
    selectedUserDiv = null;
}

export async function editUser(field) {
    if (!selectedUser) return alert('Selectează un utilizator mai întâi!');
    const newValue = prompt(`Introdu noua valoare pentru ${field}`);
    await fetchAPI(`edit_user`, 'PUT', { ID: selectedUser.ID, [field]: newValue });
    alert('Utilizator editat!');
    fetchAllUsers();
    selectedUser = null;
    selectedUserDiv = null;
}

export async function deleteChild() {
    if (!selectedChild) return alert('Selectează un copil mai întâi!');
    await fetchAPI(`delete_child?childID=${selectedChild.ID}`, 'DELETE');
    alert('Copil șters!');
    fetchUserChildren(selectedUser.ID);
}

export async function editChild(field) {
    if (!selectedChild) return alert('Selectează un copil mai întâi!');
    const newValue = prompt(`Introdu noua valoare pentru ${field}`);
    await fetchAPI(`edit_child`, 'PUT', { ID: selectedChild.ID, [field]: newValue });
    alert('Copil editat!');
    selectedChild = null;
    fetchUserChildren(selectedUser.ID);
}
export function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

document.querySelectorAll('.edit_user_button').forEach(button => {
    button.addEventListener('click', () => {
        const field = button.getAttribute('data-field');
        if(field === "DeleteAccount")
        {
            deleteUser();
        }
        else if(field === "DeactivateAccount")
        {
            deactivateUser();
        }
        else
            editUser(field);
    });
});

document.querySelectorAll('.edit_children_button').forEach(button => {
    button.addEventListener('click', () => {
        const field = button.getAttribute('data-field');
        if(field === "DeleteChild")
        {
            deleteChild();
        }
        else
            editChild(field);
    });
});
export function mapAccountTypeToString(accountType) {
    switch (accountType) {
        case 1: return 'Părinte';
        case 2: return 'Copil';
        case 3: return 'Casă de plasament';
        default: return 'N/A';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() =>
    {
        console.log(document.getElementById('dashboard_admin_bttn').style.display)
        if(document.getElementById('dashboard_admin_bttn').style.display === 'block')
            fetchAllUsers();
    }, 500);
});
