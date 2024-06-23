import { selectedDate } from './calendar.js';
import { getCurrentSelectedChild } from './childrenOperations.js';
import { setSelectedEntryId, getSelectedEntryId, getLocalISOString, showModal } from './dashboard.js';

export function fetchFeedingEntries(date, childID) {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
        return;
    }

    const dateString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];

    fetch(`http://localhost:5000/api/get_feeding_entries_by_date?date=${dateString}&childID=${childID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(result => {
            console.log('Result:', result);
            if (result.feedingEntries) {
                displayFeedingEntries(result.feedingEntries);
            } else {
                displayFeedingEntries([]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayFeedingEntries([]);
        });
}

export function displayFeedingEntries(entries) {
    const feedingItemsContainer = document.getElementById("feeding_items");
    feedingItemsContainer.innerHTML = "";

    if (entries.length === 0) {
        feedingItemsContainer.innerHTML = "<p>No entries for the selected date.</p>";
    }

    entries.forEach(entry => {
        const entryDiv = document.createElement("div");
        entryDiv.className = "calendar-item";
        entryDiv.dataset.entryId = entry.ID;

        const timeP = document.createElement("p");
        timeP.textContent = entry.Time.slice(0, 5);

        const foodP = document.createElement("p");
        foodP.textContent = `- ${entry.Quantity}${entry.Unit} ${entry.FoodType}`;

        entryDiv.appendChild(timeP);
        entryDiv.appendChild(foodP);
        entryDiv.addEventListener('click', function () {
            document.querySelectorAll('.calendar-item.selected').forEach(el => {
                el.classList.remove('selected');
            });
            entryDiv.classList.add('selected');
            setSelectedEntryId(entry.ID);
        });
        feedingItemsContainer.appendChild(entryDiv);
    });
}

export async function addMeal(e) {
    e.preventDefault();

    if (getCurrentSelectedChild() === null) {
        alert("Please select a child first.");
        return;
    }

    const selectedChildId = getCurrentSelectedChild().dataset.childId;

    const useCurrentDateTime = document.getElementById('use-current-date-time-checkbox-meal').checked;
    let date, time;

    if (useCurrentDateTime) {
        const selectedDateObj = new Date(selectedDate);
        const year = selectedDateObj.getFullYear();
        const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDateObj.getDate()).padStart(2, '0');
        date = `${year}-${month}-${day}`;
        time = getLocalISOString().split(' ')[1];
    } else {
        date = document.getElementById('data_meal').value;
        time = document.getElementById('time_meal').value + ":00";
    }

    const unit = document.getElementById('mass-selector').value === 'grame' ? 'g' : 'mg';
    const quantity = document.getElementById('mass-input').value;
    const foodType = document.getElementById('food').value;

    const payload = {
        ID: selectedChildId,
        Date: date,
        Time: time,
        Unit: unit,
        Quantity: parseInt(quantity, 10),
        FoodType: foodType,
    };

    console.log('Add meal payload:', payload);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/insert_feeding_entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        console.log('Response status (addMeal):', response.status);
        const result = await response.json();
        console.log('Result (addMeal):', result);

        if (response.ok) {
            fetchFeedingEntries(selectedDate, selectedChildId);
            document.getElementById('meal-modal').style.display = 'none';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error (addMeal):', error);
        alert('An error occurred while adding the meal.');
    }
}

export async function editMeal(e) {
    e.preventDefault();

    if (getCurrentSelectedChild() === null) {
        alert("Please select a child first.");
        return;
    }

    const selectedChildId = getCurrentSelectedChild().dataset.childId;

    const useCurrentDateTime = document.getElementById('use-current-date-time-checkbox-meal').checked;
    let date, time;

    if (useCurrentDateTime) {
        date = getLocalISOString().split(' ')[0];
        time = getLocalISOString().split(' ')[1];
    } else {
        date = document.getElementById('data_meal').value;
        time = document.getElementById('time_meal').value + ":00";
    }

    const unit = document.getElementById('mass-selector').value === 'grame' ? 'g' : 'mg';
    const quantity = document.getElementById('mass-input').value;
    const foodType = document.getElementById('food').value;

    const payload = {
        ID: getSelectedEntryId(),
        Date: date,
        Time: time,
        Unit: unit,
        Quantity: parseInt(quantity, 10),
        FoodType: foodType,
    };

    console.log('Edit meal payload:', payload);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/edit_feeding_entry', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        console.log('Response status (editMeal):', response.status);
        const result = await response.json();
        console.log('Result (editMeal):', result);

        if (response.ok) {
            fetchFeedingEntries(selectedDate, selectedChildId);
            document.getElementById('meal-modal').style.display = 'none';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error (editMeal):', error);
        alert('An error occurred while updating the meal.');
    }
}

export function fetchFeedingEntryData() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
        return;
    }

    fetch(`http://localhost:5000/api/get_feeding_entry?id=${getSelectedEntryId()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(result => {
            if (result.feedingEntry) {
                autoCompleteFeedingForm(result.feedingEntry);
            } else {
                alert('Feeding entry not found');
            }
        })
        .catch(error => {
            console.error('Error fetching entry details:', error);
            alert('An error occurred while fetching the entry details.');
        });
}

export async function deleteFeedingEntry() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/delete_feeding_entry?id=${getSelectedEntryId()}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        console.log('Result:', result);

        if (response.ok) {
            const selectedChildId = getCurrentSelectedChild().dataset.childId;
            fetchFeedingEntries(selectedDate, selectedChildId);
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        alert('An error occurred while deleting the feeding entry.');
    }
}

export function openMealModal(title, buttonText, submitHandler) {
    document.getElementById('meal-modal-title').textContent = title;
    document.getElementById('confirm-meal-bttn').textContent = buttonText;
    const form = document.getElementById('meal-form');
    form.onsubmit = submitHandler;
    showModal('meal-modal');
}

export function autoCompleteFeedingForm(entry) {
    console.log('Auto-completing form with entry:', entry);
    document.getElementById('data_meal').value = entry.Date.split('T')[0];
    document.getElementById('time_meal').value = entry.Time.slice(0, 5);
    document.getElementById('mass-selector').value = entry.Unit === 'g' ? 'grame' : 'miligrame';
    document.getElementById('mass-input').value = entry.Quantity;
    document.getElementById('food').value = entry.FoodType;
}

export function resetMealForm() {
    document.getElementById('meal-form').reset();
    document.getElementById('use-current-date-time-checkbox-meal').checked = true;
    document.getElementById('date-and-time-inputs-meal').style.display = 'none';
}