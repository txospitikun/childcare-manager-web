export async function fetchAccountData() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return null;
    }

    try {
        const response = await fetch('http://localhost:5000/api/get_self_info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            fillFormData(data);
            populateProfileData(data.user);
            document.getElementById('white-panel').style="display: none";
            return data.user;
        } else {
            alert('Eroare la preluarea datelor contului');
            return null;
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la preluarea datelor contului');
        return null;
    }
}

export function populateProfileData(userData) {
    const fullName = `${userData.FirstName || 'N/A'} ${userData.LastName || 'N/A'}`;
    const email = `Email: ${userData.Email || 'N/A'}`;
    const phoneNo = `Telefon: ${userData.PhoneNo || 'N/A'}`;
    const maritalStatus = `Căsătorit: ${userData.CivilState === 1 ? 'Da' : 'Nu'}`;
    const location = `Localizare: ${userData.Location || 'N/A'}`;
    const language = `Limbă: ${userData.Language || 'N/A'}`;
    const accountType = `Tipul contului: ${mapAccountTypeToString(userData.AccountType) || 'N/A'}`;
    const profilePhoto = userData.PictureRef ? `http://localhost:5000/api/src/${userData.PictureRef}` : 'default-profile-photo-url.jpg';

    document.querySelector('.profile-settings-container h1').textContent = fullName;
    document.querySelector('.profile-settings-container:nth-of-type(2) p:nth-of-type(2)').textContent = email;
    document.querySelector('.profile-settings-container:nth-of-type(2) p:nth-of-type(3)').textContent = phoneNo;
    document.querySelector('.profile-settings-container:nth-of-type(5) p:nth-of-type(2)').textContent = maritalStatus;
    document.querySelector('.profile-settings-container:nth-of-type(7) p:nth-of-type(2)').textContent = location;
    document.querySelector('.profile-settings-container:nth-of-type(7) p:nth-of-type(3)').textContent = language;
    document.querySelector('.profile-settings-container:nth-of-type(9) p:nth-of-type(2)').textContent = accountType;
    document.getElementById('user-profile-name').textContent = fullName;
    document.getElementById('user-profile-type').textContent = accountType;
    const profilePhotoElement = document.querySelector('.profile-photo');
    if (profilePhotoElement) {
        profilePhotoElement.src = profilePhoto;
    }

    if(userData.Privilege === 1)
    {
        document.getElementById('dashboard_admin_bttn').style.display = 'block';
    }
}


export function fillFormData(data) {
    const userData = data.user;
    document.getElementById('lastname').value = userData.LastName;
    document.getElementById('firstname').value = userData.FirstName;
    document.getElementById('email').value = userData.Email;
    document.getElementById('phoneNo').value = userData.PhoneNo;
    document.getElementById('location').value = userData.Location;
    document.getElementById('language').value = userData.Language;
    document.getElementById('accountType').value = mapAccountTypeToString(userData.AccountType);

    if (userData.CivilState == '1') {
        document.getElementById('casatorit').checked = true;
        document.getElementById('nume-partener-group').style.display = 'block';
        document.getElementById('civilPartner').value = userData.CivilPartner;
    } else {
        document.getElementById('casatorit').checked = false;
        document.getElementById('nume-partener-group').style.display = 'none';
        document.getElementById('civilPartner').value = '';
    }
}

export async function updateAccount(e) {
    e.preventDefault();

    const form = document.getElementById('edit-account-form');
    const formData = new FormData(form);

    const civilStateCheckbox = document.getElementById('casatorit');
    formData.append('civilState', civilStateCheckbox.checked ? '1' : '0');

    const numePartenerInput = document.getElementById('civilPartner');
    if (civilStateCheckbox.checked) {
        formData.append('civilPartner', numePartenerInput.value || '');
    } else {
        formData.append('civilPartner', '-1');
    }

    const accountTypeInput = document.getElementById('accountType');
    formData.set('accountType', mapAccountTypeToInteger(accountTypeInput.value));

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/modify_account_settings', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert('Contul a fost actualizat cu succes');
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la actualizarea contului');
    }
}

export function toggleCivilState() {
    const numePartenerGroup = document.getElementById('nume-partener-group');
    if (this.checked) {
        numePartenerGroup.style.display = 'block';
    } else {
        numePartenerGroup.style.display = 'none';
    }
}

document.getElementById('logout_bttn').addEventListener('click', async function ()
{
    await logout();
});

export async function logout() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return null;
    }

    try {
        const response = await fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            formData: null
        });

        if (response.ok) {

        } else {
            return null;
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la deconectare.');
        return null;
    }
}

export function mapAccountTypeToString(accountType) {
    switch (accountType) {
        case 1: return 'familie';
        case 2: return 'individual';
        case 3: return 'casa-de-copii';
        default: return '';
    }
}

export function mapAccountTypeToInteger(accountType) {
    switch (accountType) {
        case 'familie': return 1;
        case 'individual': return 2;
        case 'casa-de-copii': return 3;
        default: return 0;
    }
}
