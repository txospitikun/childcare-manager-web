import { selectedDate } from './calendar.js';
import { getCurrentSelectedChild } from './childrenOperations.js';
import { setSelectedEntryId, getSelectedEntryId, getLocalISOString, showModal } from './dashboard.js';

export function fetchSleepingEntries(date, childID) {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    const dateString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];

    fetch(`http://localhost:5000/api/get_sleeping_entries_by_date?date=${dateString}&childID=${childID}`, {
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
            if(result === null){
                displaySleepingEntries([]);
                return;
            }
            if (result.sleepingEntries) {
                displaySleepingEntries(result.sleepingEntries);
            } else {
                displaySleepingEntries([]);
            }
        })
        .catch(error => {
            console.error('Eroare:', error);
            displaySleepingEntries([]);
        });
}

export function displaySleepingEntries(entries) {
    const sleepingItemsContainer = document.getElementById("sleeping_items");
    sleepingItemsContainer.innerHTML = "";

    if (entries.length === 0) {
        sleepingItemsContainer.innerHTML = "<p>Nu există înregistrări pentru această dată.</p>";
        return;
    }

    entries.forEach(entry => {
        const entryDiv = document.createElement("div");
        entryDiv.className = "calendar-item";
        entryDiv.dataset.entryId = entry.ID;

        const sleepTime = entry.SleepTime.slice(0, 5);
        const awakeTime = entry.AwakeTime.slice(0, 5);

        const sleepDuration = calculateSleepDuration(entry.SleepTime, entry.AwakeTime);

        const timeP = document.createElement("p");
        timeP.textContent = `${sleepTime} - ${awakeTime}`;

        const durationP = document.createElement("p");
        durationP.textContent = `- ${sleepDuration}`;

        entryDiv.appendChild(timeP);
        entryDiv.appendChild(durationP);
        entryDiv.addEventListener('click', function () {
            document.querySelectorAll('.calendar-item.selected').forEach(el => {
                el.classList.remove('selected');
            });
            entryDiv.classList.add('selected');
            setSelectedEntryId(entry.ID);
        });
        sleepingItemsContainer.appendChild(entryDiv);
    });
}

export async function addSleeping(e) {
    e.preventDefault();

    const selectedChildId = getCurrentSelectedChild().dataset.childId;

    const useCurrentDateTime = document.getElementById('use-current-date-checkbox-sleep').checked;
    let date, sleepTime, awakeTime;

    if (useCurrentDateTime) {
        const selectedDateObj = new Date(selectedDate);
        const year = selectedDateObj.getFullYear();
        const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDateObj.getDate()).padStart(2, '0');
        date = `${year}-${month}-${day}`;
    } else {
        date = document.getElementById('data_sleep').value;
    }
    sleepTime = document.getElementById('time_sleep').value + ":00";
    awakeTime = document.getElementById('time_awake').value + ":00";

    const payload = {
        ID: selectedChildId,
        Date: date,
        SleepTime: sleepTime,
        AwakeTime: awakeTime
    };

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/insert_sleeping_entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            fetchSleepingEntries(selectedDate, selectedChildId);
            document.getElementById('sleeping-modal').style.display = 'none';
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la adăugarea somnului');
    }
}

export async function editSleeping(e) {
    e.preventDefault();

    const selectedChildId = getCurrentSelectedChild().dataset.childId;

    const useCurrentDateTime = document.getElementById('use-current-date-checkbox-sleep').checked;
    let date, sleepTime, awakeTime;

    if (useCurrentDateTime) {
        const selectedDateObj = new Date(selectedDate);
        const year = selectedDateObj.getFullYear();
        const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDateObj.getDate()).padStart(2, '0');
        date = `${year}-${month}-${day}`;
    } else {
        date = document.getElementById('data_sleep').value;
    }

    sleepTime = document.getElementById('time_sleep').value + ":00";
    awakeTime = document.getElementById('time_awake').value + ":00";

    const payload = {
        ID: getSelectedEntryId(),
        Date: date,
        SleepTime: sleepTime,
        AwakeTime: awakeTime
    };


    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/edit_sleeping_entry', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            fetchSleepingEntries(selectedDate, selectedChildId);
            document.getElementById('sleeping-modal').style.display = 'none';
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare: ', error);
        alert('A apărut o eroare la actualizarea somnului');
    }
}

export function fetchSleepingEntryData() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    fetch(`http://localhost:5000/api/get_sleeping_entry?id=${getSelectedEntryId()}`, {
        method: 'GET',
        headers: {
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
            if (result.sleepingEntry) {
                autoCompleteSleepingForm(result.sleepingEntry);
            } else {
                alert('Intrarea de dormit nu a fost găsită');
            }
        })
        .catch(error => {
            console.error('Eroare la preluarea detaliilor intrării:', error);
            alert('A apărut o eroare la preluarea detaliilor intrării');
        });
}

export async function deleteSleepingEntry() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/delete_sleeping_entry?id=${getSelectedEntryId()}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            const selectedChildId = getCurrentSelectedChild().dataset.childId;
            fetchSleepingEntries(selectedDate, selectedChildId);
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        alert('A apărut o eroare la ștergerea somnului.');
    }
}

function calculateSleepDuration(sleepTime, awakeTime) {
    const sleepDate = new Date(`1970-01-01T${sleepTime}Z`);
    const awakeDate = new Date(`1970-01-01T${awakeTime}Z`);

    if (awakeDate < sleepDate) {
        awakeDate.setDate(awakeDate.getDate() + 1);
    }

    const durationMs = awakeDate - sleepDate;
    const hours = Math.floor(durationMs / 1000 / 60 / 60);
    const minutes = Math.floor((durationMs / 1000 / 60) % 60);

    return `${hours} hours and ${minutes} minutes`;
}

export function resetSleepingForm() {
    document.getElementById('sleeping-form').reset();
    document.getElementById('use-current-date-checkbox-sleep').checked = true;
    document.getElementById('date-input-sleep').style.display = 'none';
}

export function autoCompleteSleepingForm(entry) {
    document.getElementById('data_sleep').value = entry.Date.split('T')[0];
    document.getElementById('time_sleep').value = entry.SleepTime.slice(0, 5);
    document.getElementById('time_awake').value = entry.AwakeTime.slice(0, 5);
}

export function openSleepingModal(title, buttonText, submitHandler) {
    document.getElementById('sleeping-modal-title').textContent = title;
    document.getElementById('confirm-sleeping-bttn').textContent = buttonText;
    const form = document.getElementById('sleeping-form');
    form.onsubmit = submitHandler;
    showModal('sleeping-modal');
}