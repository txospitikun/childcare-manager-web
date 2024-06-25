import { deleteChild, loadChildren, addChild, getCurrentSelectedChild, openChildModal, editChild } from './childrenOperations.js';
import {
    addMeal, editMeal, fetchFeedingEntryData, deleteFeedingEntry,
    openMealModal, resetMealForm
} from './feedingOperations.js';
import {
    addSleeping, editSleeping, fetchSleepingEntryData, deleteSleepingEntry,
    resetSleepingForm, openSleepingModal
} from './sleepingOperations.js';
import {addMedia, deleteMedia, resetMediaForm} from './mediaOperations.js';
import { fetchAccountData, updateAccount } from './accountOperations.js';
import { fetchGroups } from './groupOperations.js';


import {deleteCookie, getCookie} from './../workers/cookie_worker.js';

(function() {
    const jwt = getCookie('JWT');
    if (!jwt) {
        console.error('Tokenul JWT nu a fost găsit');
        window.location.href = '/src/frontend/modals/login_modal/login.html';
        return;
    } else {

    }
})();
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

    document.getElementById('add-media-form').addEventListener('submit', addMedia);
    
    document.getElementById('delete').addEventListener('click', deleteMedia); 
    document.getElementById('delete-bttn').addEventListener('click', deleteChild);
    

    document.getElementById('add-entry-bttn').addEventListener('click', () => {
        if (getCurrentSelectedChild() === null) {
            alert("Vă rugăm să selectați mai întâi un copil.");
            return;
        }
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
            alert("Vă rugăm să selectați mai întâi o intrare.");
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
            alert("Vă rugăm să selectați mai întâi o intrare.");
            return;
        }

        if (currentSelectedAttribute.id === 'feeding-bttn') {
            deleteFeedingEntry();
        } else if (currentSelectedAttribute.id === 'sleeping-bttn') {
            deleteSleepingEntry();
        }
    });

    document.getElementById('edit-account-bttn').addEventListener('click', () => {
        showModal('edit-account-modal');
        fetchAccountData();
    });

    document.getElementById('add-child-bttn').addEventListener('click', () => {
        console.log('add child');
        openChildModal('Adaugă un copil nou', 'Confirm', addChild);
    });

    document.getElementById('edit-child-bttn').addEventListener('click', () => {
        console.log('edit child');
        if (getCurrentSelectedChild() === null) {
            alert("Vă rugăm să selectați mai întâi un copil.");
            return;
        }
        openChildModal('Modifică datele copilului', 'Modifică', editChild);
    });

    document.getElementById('addButton').addEventListener('click', () => {
        if (getCurrentSelectedChild() === null) {
            alert("Vă rugăm să selectați mai întâi un copil.");
            return;
        }
        showModal('addModal');
    });

    document.getElementById('add-photo-bttn').addEventListener('click', () => {
        if (getCurrentSelectedChild() === null) {
            alert("Vă rugăm să selectați mai întâi un copil.");
            return;
        }
        resetMediaForm();
        showModal('add-photo-modal');
    });

    
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
        if(sections[buttonId] === undefined || sections[buttonId] === null)
            return;
        document.querySelector(sections[buttonId]).style.display = '';
    }

    document.querySelectorAll('.dashboard-button').forEach(button => {

        if(localStorage.getItem('currentDashboardButton') === 'logout_bttn')
            localStorage.setItem('currentDashboardButton', 'dashboard_bttn');
        if(!currentDashboardButton && localStorage.getItem('currentDashboardButton') !== null) {
            currentDashboardButton = document.getElementById(localStorage.getItem('currentDashboardButton'));
            hideAllSections();
            showSection(currentDashboardButton.id);
            currentDashboardButton.style.backgroundColor = 'var(--button-color)';
        }

        if (!currentDashboardButton && button.id === 'dashboard_bttn') {
            hideAllSections();
            showSection(button.id);
            currentDashboardButton = button;
            currentDashboardButton.style.backgroundColor = 'var(--button-color)';
        }

        button.addEventListener('click', function () {
            if (currentDashboardButton) {
                currentDashboardButton.style.backgroundColor = '';
            }

            if(this.id === null || this.id === undefined)
                return;
            showSection(this.id);
            localStorage.setItem('currentDashboardButton', this.id);
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
document.getElementById('edit-account-form').addEventListener('submit', updateAccount);


toggleDateTimeInputs('use-current-date-checkbox-sleep', 'date-input-sleep');
toggleDateTimeInputs('use-current-date-time-checkbox-meal', 'date-and-time-inputs-meal');
toggleDateTimeInputs('use-current-date-time-checkbox-media', 'date-and-time-inputs-media');
document.getElementById('casatorit').addEventListener('change', function () {
    const numePartenerGroup = document.getElementById('nume-partener-group');
    if (this.checked) {
        numePartenerGroup.style.display = 'block';
    } else {
        numePartenerGroup.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    await fetchAccountData();
    addEventListeners();
    setupAttributeButtons();
    setupDashboardButtons();
    loadChildren();
    fetchGroups();
});