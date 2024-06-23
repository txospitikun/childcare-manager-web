export async function fetchGroups() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/get_user_groups', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            displayGroups(result.groups);
        } else {
            console.error('Error fetching groups:', result.message);
            displayGroups([]);
        }
    } catch (error) {
        console.error('Error:', error);
        displayGroups([]);
    }
}

export function displayGroups(groups) {
    const gallery = document.getElementById('groups-gallery');
    gallery.innerHTML = '';

    groups.forEach(group => {
        const figureElement = document.createElement('figure');

        const img = document.createElement('img');
        img.src = `http://localhost:5000/api/src/${group.PictureRef}`;
        img.alt = group.Title;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = group.Title;

        figureElement.appendChild(img);
        figureElement.appendChild(figcaption);
        gallery.appendChild(figureElement);
    });
}

export async function addGroup() {
    const form = document.getElementById('add-group-form');
    const formData = new FormData(form);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/insert_group', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert('Group added successfully');
            fetchGroups();
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the group');
    }
}