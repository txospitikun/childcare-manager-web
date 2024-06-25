import { fetchChildrenMedia } from "./mediaOperations.js";
import { fetchSleepingEntries } from "./sleepingOperations.js";
import { fetchFeedingEntries } from "./feedingOperations.js";
import { selectedDate } from "./calendar.js";
import { showModal } from "./dashboard.js";

export let currentSelectedChild = null;

export function setCurrentSelectedChild(child) {
    currentSelectedChild = child;
}

export function getCurrentSelectedChild() {
    return currentSelectedChild;
}


export async function deleteChild() {
    if (getCurrentSelectedChild() === null) {
        alert("Vă rugăm să selectați mai întâi un copil.");
        return;
    }

    const selectedChildId = getCurrentSelectedChild().dataset.childId;
    setCurrentSelectedChild(null);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/delete_children?childID=${selectedChildId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            loadChildren();
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la ștergerea copilului.');
    }
}

export function loadChildren() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    fetch('http://localhost:5000/api/get_user_children', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.status === 204)
                return null;
            return response.json();
        })
        .then(result => {
            if(result === null) return;
            if (result.childrenInfo) {
                displayChildren(result.childrenInfo);
                addChildSelectionHandler();
            } else {
                console.error('Eroare ' + result.message);
            }
        })
        .catch(error => {
            console.error('Eroare', error);
        });
}

export async function addChild(e) {
    e.preventDefault();

    const form = document.getElementById('child-form');
    const formData = new FormData(form);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/insert_children', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            const newChild = createChildElement({
                FirstName: formData.get('prenume'),
                LastName: formData.get('nume'),
                Gender: formData.get('sex'),
                DateOfBirth: formData.get('data-nasterii'),
                PictureRef: result.PictureRef
            });
            document.getElementById('user-children-id').insertBefore(newChild, document.getElementById('add-child-bttn'));
            addChildSelectionHandler();
        } else {
            if (result.status === 10) {
                alert('Token JWT invalid sau expirat. Redirecționare către pagina de conectare.');
                window.location.href = '/login';
            } else {
                alert('Eroare: ' + result.message);
            }
        }
    } catch (error) {
        console.error('Eroare', error);
    } finally {
        loadChildren();
    }
}

export async function editChild(e) {
    e.preventDefault();

    const selectedChildId = getCurrentSelectedChild().dataset.childId;

    const form = document.getElementById('child-form');
    const formData = new FormData(form);
    formData.append('ID', selectedChildId);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/edit_children`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            loadChildren();

        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la actualizarea copilului.');
    }
}



export function displayChildren(children) {
    const dashboardChildren = document.getElementById('user-children-id');
    const childrenAddButton = document.getElementById('add-child-bttn');

    while (dashboardChildren.firstChild && dashboardChildren.firstChild !== childrenAddButton) {
        dashboardChildren.removeChild(dashboardChildren.firstChild);
    }

    const header = document.createElement('p');
    header.textContent = 'Copiii tăi inregistrați';
    dashboardChildren.insertBefore(header, childrenAddButton);

    children.forEach(child => {
        const childContainer = createChildElement(child);
        dashboardChildren.insertBefore(childContainer, childrenAddButton);
    });
}

document.getElementById('category').addEventListener('click', () =>
{
    fetchMedical(getCurrentSelectedChild().dataset.childId);
});

export function fetchMedical(selectedChild) {
    
    const categorySelect = document.getElementById('category');
    const medicalRecordsDiv = document.getElementById('medicalRecords');
    const addModal = document.getElementById('addModal');
    const addForm = document.getElementById('addForm');
    const closeModal = document.getElementsByClassName('close')[0];
    const selectedChildId = selectedChild;

    let category = categorySelect.value;

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    categorySelect.onchange = async function () {
        category = categorySelect.value;
        document.getElementById('TypeOf').value = category;
        await fetchMedicalRecords(category);
    }

    closeModal.onclick = function () {
        addModal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == addModal) {
            addModal.style.display = "none";
        }
    }
    fetchMedicalRecords(categorySelect.value);

    addForm.onsubmit = async function (event) {
        event.preventDefault();

        const formData = new FormData(addForm);
        formData.append('TypeOf', category);
        formData.append('ChildID', selectedChildId);
        try {
            const response = await fetch('http://localhost:5000/api/insert_health', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            addModal.style.display = "none";
            const category = categorySelect.value;
            await fetchMedicalRecords(category);
        } catch (error) {
            console.error('Eroare la introducerea intrării medicale:', error);
        }
    }

    async function fetchMedicalRecords(category) {
        try {
            const response = await fetch(`http://localhost:5000/api/get_health?childID=${selectedChildId}&typeOf=${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            renderTable(data.health);
        } catch (error) {
            console.error('Eroare la preluarea intrărilor medicale:', error);
        }
    }

    async function deleteMedicalRecord(recordId) {
        try {
            const response = await fetch(`http://localhost:5000/api/delete_health?id=${recordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const category = categorySelect.value;
            await fetchMedicalRecords(category);
        } catch (error) {
            console.error('Eroare la ștergerea intrării medicale:', error);
        }
    }

    function renderTable(records) {
        let tableHtml = '<table><tr><th>Titlu</th><th>Descriere</th><th>Data</th><th>Actiune</th><th>Delete</th></tr>';
        for (const record of records) {
            tableHtml += `<tr>
                            <td>${record.Title}</td>
                            <td>${record.Description}</td>
                            <td>${record.Date}</td>
                            <td>${record.FileRef ? `<a href="http://localhost:5000/api/src/${record.FileRef}" target="_blank">Download document</a>` : ''}</td>
                            <td><button class="deleteButton" data-id="${record.ID}">Delete</button></td>
                          </tr>`;
        }
        tableHtml += '</table>';
        medicalRecordsDiv.innerHTML = tableHtml;

        const deleteButtons = document.querySelectorAll('.deleteButton');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const recordId = this.getAttribute('data-id');
                deleteMedicalRecord(recordId);
            });
        });
    }
}

export function createChildElement(child) {
    const childContainer = document.createElement('div');
    childContainer.className = 'children-container';
    childContainer.dataset.childId = child.ID;

    const img = document.createElement('img');
    img.src = child.PictureRef ? `http://localhost:5000/api/src/${child.PictureRef}` : './assets/placeholders/placeholder_child.jpg';
    img.className = 'photo-container';
    img.alt = 'child';

    const infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';

    const nameP = document.createElement('p');
    nameP.textContent = `${child.FirstName} ${child.LastName}`;

    const ageDetails = calculateAge(child.DateOfBirth);
    const ageCategory = getAgeCategory(child.DateOfBirth);
    const ageP = document.createElement('p');
    ageP.textContent = `${ageDetails.value} ${ageDetails.unit} - ${ageCategory} #${child.ID}`;

    infoContainer.appendChild(nameP);
    infoContainer.appendChild(ageP);

    childContainer.appendChild(img);
    childContainer.appendChild(infoContainer);

    return childContainer;
}

function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const ageInMilliseconds = today - birthDate;
    const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));

    if (ageInDays < 30) {
        return { value: ageInDays, unit: 'zile' };
    } else if (ageInDays < 365) {
        const ageInMonths = Math.floor(ageInDays / 30);
        return { value: ageInMonths, unit: 'luni' };
    } else {
        const ageInYears = Math.floor(ageInDays / 365);
        return { value: ageInYears, unit: ageInYears === 1 ? 'an' : 'ani' };
    }
}

function getAgeCategory(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const ageInMilliseconds = today - birthDate;
    const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
    const ageInYears = Math.floor(ageInDays / 365);

    if (ageInYears < 1) return 'infant';
    if (ageInYears < 3) return 'copil mic';
    if (ageInYears < 13) return 'copil';
    if (ageInYears < 18) return 'adol.';
    return 'adult';
}

export function addChildSelectionHandler() {
    document.querySelectorAll('.children-container').forEach(function (button) {

        if (getCurrentSelectedChild() === null) {
            setCurrentSelectedChild(button);
            const selectedChildId = getCurrentSelectedChild().dataset.childId;
            fetchFeedingEntries(selectedDate, selectedChildId);
            fetchSleepingEntries(selectedDate, selectedChildId);
            fetchChildrenMedia(selectedChildId);
            fetchMedical(selectedChildId);
            button.style.border = "2px solid gray";
        }

        button.addEventListener('click', function () {
            if (getCurrentSelectedChild() !== null) {
                getCurrentSelectedChild().style.border = "";
            }
            setCurrentSelectedChild(this);
            this.style.border = "2px solid gray";
            const selectedChildId = getCurrentSelectedChild().dataset.childId;
            fetchFeedingEntries(selectedDate, selectedChildId);
            fetchSleepingEntries(selectedDate, selectedChildId);
            fetchChildrenMedia(selectedChildId);
            fetchMedical(selectedChildId);
        });
    });
}

export function openChildModal(title, buttonText, submitHandler) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-button').textContent = buttonText;
    const form = document.getElementById('child-form');
    form.onsubmit = submitHandler;
    showModal('child-modal');
}