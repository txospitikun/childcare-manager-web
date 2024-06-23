export async function fetchAccountData() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
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
            return data.user;
        } else {
            alert('Error fetching account data');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching account data');
        return null;
    }
}

export function populateProfileData(userData) {
    const fullName = `${userData.FirstName} ${userData.LastName}`;
    const email = `Email: ${userData.Email}`;
    const phoneNo = `Telefon: ${userData.PhoneNo}`;
    const maritalStatus = `Căsătorit: ${userData.CivilState === 1 ? 'Da' : 'Nu'}`;
    const location = `Localizare: ${userData.Location}`;
    const language = `Limbă: ${userData.Language}`;
    const accountType = `Tipul contului: ${mapAccountTypeToString(userData.AccountType)}`;
    console.log(`http://localhost:5000/api/src/${userData.PictureRef}`);
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
        alert('JWT token not found');
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

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Result:', result);

        if (response.ok) {
            alert('Account updated successfully');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the account');
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
