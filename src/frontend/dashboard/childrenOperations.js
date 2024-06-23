import { fetchChildrenMedia } from "./mediaOperations.js";
import { fetchSleepingEntries } from "./sleepingOperations.js";
import { fetchFeedingEntries } from "./feedingOperations.js";
import { selectedDate } from "./calendar.js";

export let currentSelectedChild = null;

export function setCurrentSelectedChild(child) {
    currentSelectedChild = child;
}

export function getCurrentSelectedChild() {
    return currentSelectedChild;
}


export async function deleteChild() {
    if (getCurrentSelectedChild() === null) {
        alert("Please select a child first.");
        return;
    }

    const selectedChildId = getCurrentSelectedChild().dataset.childId;
    setCurrentSelectedChild(null);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
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
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the child.');
    }
}

export function loadChildren() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
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
                console.error('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export async function addChild(e) {
    e.preventDefault();

    const form = document.getElementById('add-child-form');
    const formData = new FormData(form);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
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
                alert('Invalid or expired JWT token. Redirecting to login page.');
                window.location.href = '/login';
            } else {
                alert('Error: ' + result.message);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        loadChildren();
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
    const selectElement = document.getElementById('category');
    const selectedValue = selectElement.value;
    fetchMedical(getCurrentSelectedChild().dataset.childId);
});

// find me id category of a select and add event listener on the change of the value
// fetch medical records based on the selected category
// render the table with the fetched records
// please complete with code
// fetchMedicalRecords(categorySelect.value);
// renderTable(data.health);
// add event listener on the change of the value of the select
// fetch medical records based on the selected category
// render the table with the fetched records

export function fetchMedical(selectedChild) {
    const categorySelect = document.getElementById('category');
    const medicalRecordsDiv = document.getElementById('medicalRecords');
    const addButton = document.getElementById('addButton');
    const addModal = document.getElementById('addModal');
    const addForm = document.getElementById('addForm');
    const closeModal = document.getElementsByClassName('close')[0];
    const selectedChildId = selectedChild;

    let category = categorySelect.value;


    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
        return;
    }

    categorySelect.onchange = async function () {
        category = categorySelect.value;
        document.getElementById('TypeOf').value = category;
        await fetchMedicalRecords(category);
    }

    addButton.onclick = function () {
        addModal.style.display = "block";
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
            console.error('Error inserting medical record:', error);
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
            console.error('Error fetching medical records:', error);
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
            console.error('Error deleting medical record:', error);
        }
    }

    function renderTable(records) {
        let tableHtml = '<table><tr><th>Title</th><th>Description</th><th>Action</th><th>Delete</th></tr>';
        for (const record of records) {
            tableHtml += `<tr>
                            <td>${record.Title}</td>
                            <td>${record.Description}</td>
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
    img.src = child.PictureRef ? `http://localhost:5000/api/src/${child.PictureRef}` : '../placeholders/child2.jpg';
    img.className = 'photo-container';
    img.alt = 'child';

    const infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';

    const nameP = document.createElement('p');
    nameP.textContent = `${child.FirstName} ${child.LastName}`;

    const ageP = document.createElement('p');
    ageP.textContent = calculateAge(child.DateOfBirth) + ' ani - ' + getAgeCategory(calculateAge(child.DateOfBirth));

    infoContainer.appendChild(nameP);
    infoContainer.appendChild(ageP);

    childContainer.appendChild(img);
    childContainer.appendChild(infoContainer);

    return childContainer;
}

export function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export function getAgeCategory(age) {
    if (age < 3) return 'infant';
    if (age < 13) return 'copil';
    if (age < 18) return 'adolescent';
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