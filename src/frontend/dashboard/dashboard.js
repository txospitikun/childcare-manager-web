import { deleteChild, loadChildren, addChild, getCurrentSelectedChild } from './childrenOperations.js';
import {
    addMeal, editMeal, fetchFeedingEntryData, deleteFeedingEntry,
    openMealModal, resetMealForm
} from './feedingOperations.js';
import {
    addSleeping, editSleeping, fetchSleepingEntryData, deleteSleepingEntry,
    resetSleepingForm, openSleepingModal
} from './sleepingOperations.js';
import { deleteMedia, resetMediaForm, addMedia } from './mediaOperations.js';
import { fetchAccountData } from './accountOperations.js';

export let selectedEntryId = null;
let currentSelectedAttribute = null;

export function setSelectedEntryId(entryId) {
    selectedEntryId = entryId;
}

export function getSelectedEntryId() {
    return selectedEntryId;
}

export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

export function getLocalISOString() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - timezoneOffset).toISOString().slice(0, 19);
    return localISOTime.replace('T', ' ');
}

function addEventListeners() {
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function () {
            this.closest('.main-modal').style.display = 'none';
        });
    });

    document.querySelectorAll('.confirm-button').forEach(button => {
        button.addEventListener('click', function () {
            this.closest('.main-modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        document.querySelectorAll('.main-modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    document.getElementById('delete').addEventListener('click', deleteMedia);

    document.getElementById('add-child-form').addEventListener('submit', addChild);

    document.getElementById('add-media-form').addEventListener('submit', addMedia);

    document.getElementById('add-photo-bttn').addEventListener('click', () => {
        resetMediaForm();
        showModal('add-photo-modal');
    });

    document.getElementById('add-entry-bttn').addEventListener('click', () => {
        if (currentSelectedAttribute.id === 'feeding-bttn') {
            resetMealForm();
            openMealModal('Adaugă o nouă masă', 'Adaugă', addMeal);
        } else if (currentSelectedAttribute.id === 'sleeping-bttn') {
            resetSleepingForm();
            openSleepingModal('Adaugă o perioadă de somn', 'Adaugă', addSleeping);
        }
    });

    document.getElementById('edit-entry-bttn').addEventListener('click', () => {
        if (!selectedEntryId) {
            alert("Please select an entry first.");
            return;
        }

        if (currentSelectedAttribute.id === 'feeding-bttn') {
            openMealModal('Modifică o masă curentă', 'Modifică', editMeal);
            fetchFeedingEntryData();
        } else if (currentSelectedAttribute.id === 'sleeping-bttn') {
            openSleepingModal('Modifică o perioadă de somn', 'Modifică', editSleeping);
            fetchSleepingEntryData();
        }
    });

    document.getElementById('delete-entry-bttn').addEventListener('click', () => {
        if (!selectedEntryId) {
            alert("Please select an entry first.");
            return;
        }

        if (currentSelectedAttribute.id === 'feeding-bttn') {
            deleteFeedingEntry();
        } else if (currentSelectedAttribute.id === 'sleeping-bttn') {
            deleteSleepingEntry();
        }
    });

    document.getElementById('delete-bttn').addEventListener('click', deleteChild);

    document.getElementById('edit-account-bttn').addEventListener('click', () => {
        showModal('edit-account-modal');
        fetchAccountData();
    });

    document.getElementById('add-child-bttn').addEventListener('click', () => {
        showModal('add-child-modal');
    });

    document.getElementById('addButton').addEventListener('click', () => {
        showModal('addModal');
    });

    document.getElementById('add-group-bttn').addEventListener('click', () => {
        showModal('add-group-modal');
    });
}

function fetchMedical() {
    const categorySelect = document.getElementById('category');
    const medicalRecordsDiv = document.getElementById('medicalRecords');
    const addButton = document.getElementById('addButton');
    const addModal = document.getElementById('addModal');
    const addForm = document.getElementById('addForm');
    const closeModal = document.getElementsByClassName('close')[0];
    const selectedChildId = getCurrentSelectedChild().dataset.childId;

    let category = categorySelect.value;
    console.log(selectedChildId);


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

    closeModal.onclick = function () {
        addModal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == addModal) {
            addModal.style.display = "none";
        }
    }

    addForm.onsubmit = async function (event) {
        event.preventDefault();

        const formData = new FormData(addForm);
        formData.append('TypeOf', category);
        formData.append('ChildID', selectedChildId);
        console.log(formData);
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
            console.log(recordId);
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


function setupAttributeButtons() {
    currentSelectedAttribute = document.getElementById('feeding-bttn');

    if (currentSelectedAttribute) {
        currentSelectedAttribute.style.border = "2px solid black";
    }

    const buttonDisplayMap = {
        "feeding-bttn": document.getElementById('feeding_items'),
        "sleeping-bttn": document.getElementById('sleeping_items'),
        "media-bttn": document.getElementById('mediaElement'),
        "evolution-bttn": document.getElementById('evolutionElement'),
        "medical-bttn": document.getElementById('medicalElement')
    };

    document.querySelectorAll('.attribute-button').forEach(function (button) {
        button.addEventListener('click', function () {
            if (currentSelectedAttribute) {
                currentSelectedAttribute.style.border = "";
            }
    
            for (var key in buttonDisplayMap) {
                if (buttonDisplayMap[key]) {
                    buttonDisplayMap[key].style.display = "none";
                }
            }
    
            if (this.id in buttonDisplayMap && buttonDisplayMap[this.id]) {
                buttonDisplayMap[this.id].style.display = "";
            }
    
            
            if (this.id === 'feeding-bttn' || this.id === 'sleeping-bttn') {
                document.getElementById('calendarContainer').style.display = "";
            } else {
                document.getElementById('calendarContainer').style.display = "none";
            }
    
            currentSelectedAttribute = this;
    
            if(this.id === "medical-bttn")
            {
                fetchMedical();
            }
            console.log(currentSelectedAttribute.id);
            this.style.border = "2px solid black";
        });
    });

    document.getElementById('feeding-bttn').click();
}

function setupDashboardButtons() {
    let currentDashboardButton = null;
    const sections = {
        dashboard_bttn: '#dashboard-main',
        profile_bttn: '#dashboard-profile',
        dashboard_admin_bttn: '#dashboard-admin-panel',
        groups_bttn: '#dashboard-groups',
    };

    function hideAllSections() {
        Object.values(sections).forEach(selector => {
            document.querySelector(selector).style.display = 'none';
        });
    }

    function showSection(buttonId) {
        hideAllSections();
        document.querySelector(sections[buttonId]).style.display = '';
    }

    document.querySelectorAll('.dashboard-button').forEach(button => {
        if (!currentDashboardButton && button.id === 'dashboard_bttn') {
            hideAllSections();
            showSection(button.id);
            currentDashboardButton = button;
            button.style.backgroundColor = 'var(--button-color)';
        }

        button.addEventListener('click', function () {
            if (currentDashboardButton) {
                currentDashboardButton.style.backgroundColor = '';
            }

            showSection(this.id);

            currentDashboardButton = this;
            this.style.backgroundColor = 'var(--button-color)';
        });
    });
}

function toggleDateTimeInputs(checkboxId, inputContainerId) {
    document.getElementById(checkboxId).addEventListener('change', function () {
        const inputContainer = document.getElementById(inputContainerId);
        if (this.checked) {
            inputContainer.style.display = 'none';
        } else {
            inputContainer.style.display = 'block';
        }
    });
}

toggleDateTimeInputs('use-current-date-checkbox-sleep', 'date-input-sleep');
toggleDateTimeInputs('use-current-date-time-checkbox-meal', 'date-and-time-inputs-meal');
toggleDateTimeInputs('use-current-date-time-checkbox-media', 'date-and-time-inputs-media');


document.addEventListener('DOMContentLoaded', async function () {
    await fetchAccountData();
    addEventListeners();
    setupAttributeButtons();
    setupDashboardButtons();
    loadChildren();
});