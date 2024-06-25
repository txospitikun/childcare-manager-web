import { getLocalISOString, showModal } from "./dashboard.js";

let currentGroupId = null;
let currentChildId = null;
let groupChildrenInfo = {};


export async function fetchGroups() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/get_user_groups', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response);
        if(response.status === 204)
        {
            return;
        }
        const result = await response.json();
        if (response.ok) {
            displayGroups(result);
        } else {
            console.error('Eroare la preluarea grupurilor:', result.message);
            displayGroups([]);
        }
    } catch (error) {
        console.error('Eroare:', error);
        displayGroups([]);
    }
}

export function displayGroups(groups) {
    const gallery = document.getElementById('groups-gallery');
    gallery.innerHTML = '';

    groups.forEach(group => {
        const figureElement = document.createElement('figure');

        const img = document.createElement('img');
        img.src = group.PictureRef ? `http://localhost:5000/api/src/${group.PictureRef}` : './assets/placeholders/group_placeholder.jpg';
        img.alt = group.Title;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = group.Title;

        figureElement.appendChild(img);
        figureElement.appendChild(figcaption);
        figureElement.addEventListener('click', () => fetchGroupContent(group.ID));
        gallery.appendChild(figureElement);
    });

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
            alert('Tokenul JWT nu a fost găsit');
            return;
        }

        const response = await fetch(`http://localhost:5000/api/get_group_children_info?groupId=${groupId}`, {
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
                groupChildrenInfo = result.foundChildrens.reduce((acc, child) => {
                    acc[child.ID] = `${child.FirstName} ${child.LastName}`;
                    return acc;
                }, {});
                displayGroupContent(result.foundChildrens, groupId);
            } else {
                const errorText = await response.text(); // Read response as text
                console.error('Răspuns de eroare:', errorText);
            }
        }
    } catch (error) {
        console.error('Eroare:', error);
    }
}


function displayGroupContent(content, groupId) {
    const gallery = document.getElementById('groups-gallery');
    gallery.innerHTML = '';

    currentGroupId = groupId;

    content.forEach(item => {
        const figureElement = document.createElement('figure');

        const img = document.createElement('img');
        img.src = `http://localhost:5000/api/src/${item.PictureRef}`;
        img.alt = `${item.FirstName} ${item.LastName}`;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = `${item.FirstName} ${item.LastName} ID:${item.ID}`;

        figureElement.appendChild(img);
        figureElement.appendChild(figcaption);
        figureElement.addEventListener('click', () => {
            openGroupChildModal(item);
        });
        gallery.appendChild(figureElement);
    });

    const buttonsContainer = document.getElementById('group-buttons');

    while (buttonsContainer.children.length > 1) {
        buttonsContainer.removeChild(buttonsContainer.lastChild);
    }

    document.getElementById('add-group-bttn').style.display = 'none';

    const backButton = document.createElement('button');
    backButton.className = 'default-button';
    backButton.textContent = 'Înapoi';
    backButton.addEventListener('click', () => {
        document.getElementById('add-group-bttn').style.display = '';
        fetchGroups();
    });

    const addChildButton = document.createElement('button');
    addChildButton.className = 'default-button';
    addChildButton.textContent = 'Adaugă copil';
    addChildButton.addEventListener('click', () => {
        showModal('add-group-child-modal');
        document.getElementById('add-group-child-form').dataset.groupId = groupId;
    });

    const editButton = document.createElement('button');
    editButton.className = 'default-button';
    editButton.textContent = 'Editează grup';
    editButton.addEventListener('click', () => {
        const group = { Title: document.getElementById('groupName').value }; 
        openEditGroupModal(group);
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'default-button';
    deleteButton.textContent = 'Șterge grup';
    deleteButton.addEventListener('click', () => {
        deleteGroup(groupId);
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
        alert('Tokenul JWT nu a fost găsit');
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
            fetchGroups();
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la adăugarea grupului');
    }
}

async function addChildToGroup(e) {
    e.preventDefault();

    const form = document.getElementById('add-group-child-form');
    const groupId = form.dataset.groupId;
    const formData = new FormData(form);
    formData.append('GroupID', groupId);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
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
        if (!response.ok) {
            const result = await response.json();
            console.error('Răspuns de eroare:', result);
            throw new Error(result.message || 'Failed to add child to the group');

        }

        const result = await response.json();
        fetchGroupContent(groupId);
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la adăugarea copilului la grup: ' + error.message);
    }
}

async function editGroup(e) {
    e.preventDefault();

    const form = document.getElementById('add-group-form');
    const formData = new FormData(form);
    formData.append('ID', currentGroupId); 

    const now=getLocalISOString().split('T')[0];
    formData.append('Creation_Date', now);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/edit_group', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            fetchGroups();
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la actualizarea grupului');
    }
}

async function deleteGroup(groupId) {
    
    try {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            alert('Tokenul JWT nu a fost găsit');
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
            fetchGroups();
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la ștergerea grupului');
    }
}

function openGroupModal(title, buttonText, submitHandler) {
    showModal('add-group-modal');

    const form = document.getElementById('add-group-form');
    
    form.removeEventListener('submit', addGroup);
    form.removeEventListener('submit', editGroup);

    form.addEventListener('submit', submitHandler);

    document.getElementById('group-title').textContent = title;
    document.getElementById('group-button').textContent = buttonText;
}


function openEditGroupModal(group) {
    openGroupModal('Edit current group', 'Save Changes', editGroup);

    document.getElementById('groupName').value = group.Title;
    document.getElementById('groupPhoto').required = false;
}


document.getElementById('add-group-child-form').addEventListener('submit', addChildToGroup);

document.getElementById('add-group-bttn').addEventListener('click', () => {
    openGroupModal('Adaugă un grup nou', 'Adaugă grup', addGroup);
});

document.getElementById('add-group-form').addEventListener('submit', addGroup);

function openGroupChildModal(child) {
    const modal = document.getElementById('groupChildModal');
    const img = document.getElementById('img02');
    const caption = document.getElementById('caption2');
    
    img.src = `http://localhost:5000/api/src/${child.PictureRef}`;
    caption.textContent = `${child.FirstName} ${child.LastName} ID:${child.ID}`;

    let relationsList = document.getElementById('relations-list');
    currentChildId = child.ID;
    if (!relationsList) {
        relationsList = document.createElement('ul');
        relationsList.id = 'relations-list';
        caption.appendChild(relationsList);
    }
    relationsList.innerHTML = '';

    fetchRelations(child.ID, currentGroupId);

    modal.style.display = 'flex';

    modal.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    document.getElementById('add-relation').addEventListener('click', () => {
        showModal('addRelationModal');
        document.getElementById('add-relation-form').dataset.childId = child.ID;
    });
}

async function addChildRelation(childId) {
    const form = document.getElementById('add-relation-form');
    const formData = new FormData(form);
    formData.append('ChildrenRelationOne', childId);
    formData.append('GroupID', currentGroupId);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/insert_group_relation', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            fetchRelations(childId, currentGroupId);
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la adăugarea relației');
    }
}

async function deleteChildFromGroup(groupId, childId) {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/delete_children_group?groupId=${groupId}&childrenId=${childId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            fetchGroupContent(groupId);
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la eliminarea copilului din grup');
    }
}

async function fetchRelations(childId, groupId) {
    try {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            alert('Tokenul JWT nu a fost găsit');
            return;
        }

        const response = await fetch(`http://localhost:5000/api/get_group_relations?childrenId=${childId}&groupId=${groupId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            displayRelations(result.groupRelations, childId);
        } else {
            console.error('Eroare la preluarea relațiilor:', result.message);
        }
    } catch (error) {
        console.error('Eroare:', error);
    }
}


function displayRelations(relations, currentChildId) {
    const relationsList = document.getElementById('relations-list');
    relationsList.innerHTML = '';

    if (!relations || relations.length === 0) {
        const noRelationsMessage = document.createElement('p');
        noRelationsMessage.textContent = 'Acest copil nu are nicio relație.';
        relationsList.appendChild(noRelationsMessage);
    } else {
        relations.forEach(relation => {
            let relatedChildId;
            if (relation.ChildrenRelationOne == currentChildId) {
                relatedChildId = relation.ChildrenRelationTwo;
            } else if (relation.ChildrenRelationTwo == currentChildId) {
                relatedChildId = relation.ChildrenRelationOne;
            } else {
                relatedChildId = null;
            }

            const relatedChildName = relatedChildId && groupChildrenInfo[relatedChildId] ? 
                groupChildrenInfo[relatedChildId] : 
                'Unknown Child';

            const relationItem = document.createElement('li');
            relationItem.textContent = `Relație: ${relation.TypeOfRelation}, Copil: ${relatedChildName}`;
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-relation-button';
            deleteButton.textContent = 'Șterge relația';
            deleteButton.addEventListener('click', () => {
                deleteRelation(relation.ID);
            });
            
            relationItem.appendChild(deleteButton);
            relationsList.appendChild(relationItem);
        });
    }
}

async function deleteRelation(relationId) {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/delete_group_relation?relationId=${relationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            fetchRelations(currentChildId, currentGroupId);
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la ștergerea relației');
    }
}

 document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('groupChildModal').style.display = "none";
});

document.getElementById('add-relation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addChildRelation(currentChildId);
});

document.getElementById('delete-group-child').addEventListener('click', () => {
    deleteChildFromGroup(currentGroupId, currentChildId);
    document.getElementById('groupChildModal').style.display = "none";
});
