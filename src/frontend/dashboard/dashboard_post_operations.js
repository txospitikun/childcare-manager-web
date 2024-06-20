import { getCookie } from '../workers/cookie_worker.js';
import config from '../../config.js';

async function fetchUserChildren() {
    const jwtToken = getCookie('JWT');
    console.log('Fetching user children with JWT:', jwtToken); // Debug log

    const response = await fetch(`${config.apiUrl}/api/get_user_children`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    });
    const children = await response.json();
    console.log('Received children data:', children); // Debug log
    return children;
}

async function addChild(childData) {
    const jwtToken = getCookie('JWT');
    const formData = new FormData();

    formData.append('FirstName', childData.FirstName);
    formData.append('LastName', childData.LastName);
    formData.append('Gender', childData.Gender);
    formData.append('DateOfBirth', childData.DateOfBirth);
    formData.append('Photo', childData.Photo);

    console.log('Adding child with data:', childData); // Debug log

    const response = await fetch(`${config.apiUrl}/api/insert_children`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        },
        body: formData
    });

    const result = await response.json();
    console.log('Add child response:', result); // Debug log
    return result;
}

export { addChild, fetchUserChildren };
