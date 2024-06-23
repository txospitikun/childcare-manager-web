import { getLocalISOString, showModal } from "./dashboard.js";

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
        figureElement.addEventListener('click', () => fetchGroupContent(group.ID)); // Make the group clickable
        gallery.appendChild(figureElement);
    });

    // Clear existing buttons (except the "Adaugă grup" button)
    const buttonsContainer = document.getElementById('group-buttons');
    while (buttonsContainer.children.length > 1) {
        buttonsContainer.removeChild(buttonsContainer.lastChild);
    }

    document.getElementById('add-group-bttn').style.display = 'block';
}

async function fetchGroupContent(groupId) {
    try {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            alert('JWT token not found');
            return;
        }

        const response = await fetch(`http://localhost:5000/api/get_group_content?groupId=${groupId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 404) {
            displayGroupContent([], groupId);
        } else {
            const result = await response.json();
            if (response.ok) {
                displayGroupContent(result.content, groupId);
            } else {
                console.error('Error fetching group content:', result.message);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayGroupContent(content, groupId) {
    const gallery = document.getElementById('groups-gallery');
    gallery.innerHTML = '';

    // Add group content here (e.g., images, text, etc.)
    content.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = item; // Customize this based on your content
        gallery.appendChild(itemElement);
    });

    // Add group buttons
    const buttonsContainer = document.getElementById('group-buttons');

    // Clear existing buttons (except the "Adaugă grup" button)
    while (buttonsContainer.children.length > 1) {
        buttonsContainer.removeChild(buttonsContainer.lastChild);
    }

    // Hide "Adaugă grup" button when inside a group
    document.getElementById('add-group-bttn').style.display = 'none';

    const backButton = document.createElement('button');
    backButton.className = 'default-button';
    backButton.textContent = 'Back';
    backButton.addEventListener('click', fetchGroups);

    const addChildButton = document.createElement('button');
    addChildButton.className = 'default-button';
    addChildButton.textContent = 'Add Child';
    addChildButton.addEventListener('click', () => {
        showModal('add-group-child-modal');
        document.getElementById('add-group-child-form').dataset.groupId = groupId;
    });

    const editButton = document.createElement('button');
    editButton.className = 'default-button';
    editButton.textContent = 'Edit Group';
    editButton.addEventListener('click', () => {
        const selectedGroup = prompt('Enter the ID of the group you want to edit:');
        if (selectedGroup) {
            editGroup(selectedGroup);
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'default-button';
    deleteButton.textContent = 'Delete Group';
    deleteButton.addEventListener('click', () => {
        const selectedGroup = prompt('Enter the ID of the group you want to delete:');
        if (selectedGroup) {
            deleteGroup(selectedGroup);
        }
    });

    buttonsContainer.appendChild(backButton);
    buttonsContainer.appendChild(addChildButton);
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);
}


export async function addGroup(e) {
    e.preventDefault();

    const form = document.getElementById('add-group-form');
    const formData = new FormData(form);
    const now=getLocalISOString().split('T')[0];
    formData.append('Creation_Date', now);
    
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

export async function addChildToGroup(groupId) {
    const form = document.getElementById('add-child-form');
    const formData = new FormData(form);
    formData.append('GroupID', groupId);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/insert_children_group', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert('Child added to the group successfully');
            fetchGroupContent(groupId);
            closeModal('add-child-modal');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the child to the group');
    }
}

async function editGroup(groupId) {
    // Implement edit group functionality
    alert('Edit group functionality to be implemented.');
}

async function deleteGroup(groupId) {
    if (!confirm('Are you sure you want to delete this group?')) {
        return;
    }

    try {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            alert('JWT token not found');
            return;
        }

        const response = await fetch(`http://localhost:5000/api/delete_group?groupId=${groupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            alert('Group deleted successfully');
            fetchGroups();
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the group');
    }
}

document.getElementById('add-group-child-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const groupId = document.getElementById('add-child-form').dataset.groupId;
    addChildToGroup(groupId);
});