let currentDashboardButton = null;
let currentSelectedChild = null;
let currentSelectedAttribute = null;
const currentDateToday = new Date();

let deleteChildrenButton = document.getElementById('delete-bttn');

const dashboardMain = document.querySelector('#dashboard-main');
const dashboardProfile = document.querySelector('#dashboard-profile');
const dashboardAdminPanel = document.querySelector('#dashboard-admin-panel');
const dashboardGroups = document.querySelector('#dashboard-groups');

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex'; // Set display to flex for centering
    }
}

const addChildForm = document.querySelector('.add-child-bttn');
const addTableForm = document.querySelector('.add-table-bttn');



document.getElementById('casatorit').addEventListener('change', function() {
    const partnerNameGroup = document.getElementById('nume-partener-group');
    if (this.checked) {
        partnerNameGroup.style.display = 'block';
    } else {
        partnerNameGroup.style.display = 'none';
    }
});




// Close button functionality
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.main-modal').style.display = 'none';
    });
});

document.querySelectorAll('.confirm-button').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.main-modal').style.display = 'none';
    });
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
    document.querySelectorAll('.main-modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

var buttonDisplayMap = {
    "feeding-bttn": document.getElementById('feeding_items'),
    "sleeping-bttn": document.getElementById('sleeping_items'),
    "media-bttn": document.getElementById('mediaElement'),
    "evolution-bttn": document.getElementById('evolutionElement'),
    "medical-bttn": document.getElementById('medicalElement')
};

currentSelectedAttribute = document.getElementById('feeding-bttn');

if (currentSelectedAttribute) {
    currentSelectedAttribute.style.border = "2px solid black";
}

if (buttonDisplayMap['feeding-bttn']) {
    buttonDisplayMap['feeding-bttn'].style.display = "";
}

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

var modal = document.getElementById("myModal");

var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    modal.style.display = "none";
}

var deleteBtn = document.getElementById("delete");

deleteBtn.onclick = function () {
    modal.style.display = "none";
}

var btn = document.getElementById("addPhoto");


document.addEventListener("DOMContentLoaded", function () {

    fetchAccountData();

    deleteChildrenButton.addEventListener('click', function()
    {
        if (!currentSelectedChild) {
            alert("Please select a child first.");
            return;
        }

        const selectedChildId = currentSelectedChild.dataset.childId;
        currentSelectedChild = null;

        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }

        fetch(`http://localhost:5000/api/delete_children?childID=${selectedChildId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(result => {
                console.log('Result:', result);
                if (result) {
                } else {
                    console.error('Error: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                loadChildren()});
    });

    document.querySelectorAll('.dashboard-button').forEach(function (button) {

        if (!currentDashboardButton && button.id == 'dashboard_bttn') {
            dashboardAdminPanel.style.display = "none";
            dashboardProfile.style.display = "none";
            dashboardMain.style.display = "";
            dashboardGroups.style.display = "none";
    
            currentDashboardButton = button;
            button.style.backgroundColor = "var(--button-color)";
        }
    
        button.addEventListener('click', function () {
            if (currentDashboardButton) {
                currentDashboardButton.style.backgroundColor = "";
            }
            if (this.id == "dashboard_bttn") {
                dashboardMain.style.display = "";
                dashboardProfile.style.display = "none";
                dashboardAdminPanel.style.display = "none";
                dashboardGroups.style.display = "none";
            }
            if (this.id == 'profile_bttn') {
                dashboardMain.style.display = "none";
                dashboardProfile.style.display = "";
                dashboardAdminPanel.style.display = "none";
                dashboardGroups.style.display = "none";
            }
            if (this.id == 'dashboard_admin_bttn') {
                dashboardMain.style.display = "none";
                dashboardProfile.style.display = "none";
                dashboardAdminPanel.style.display = "";
                dashboardGroups.style.display = "none";
            }
            if (this.id == 'groups_bttn') {
                dashboardMain.style.display = "none";
                dashboardProfile.style.display = "none";
                dashboardAdminPanel.style.display = "none";
                dashboardGroups.style.display = "";
            }
    
            currentDashboardButton = this;
            this.style.backgroundColor = "var(--button-color)";
        });
    });

    const calendarContainer = document.getElementById("calendarElement");
    const monthYearDisplay = document.getElementById("month-year");
    const previousMonthButton = document.getElementById("previous-month-button");
    const nextMonthButton = document.getElementById("next-month-button");
    const currentDayTitle = document.getElementById("current-day-title");

    let currentDate = new Date();
    let today = new Date();
    let selectedDate = new Date();

    function updateCalendar() {
        calendarContainer.innerHTML = "";

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        let dateString = currentDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        monthYearDisplay.textContent = dateString;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const prevMonthDays = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
        const prevMonthLastDate = new Date(year, month, 0).getDate();

        for (let i = prevMonthLastDate - prevMonthDays + 1; i <= prevMonthLastDate; i++) {
            calendarContainer.appendChild(createCalendarDate(i, "not-current", new Date(year, month - 1, i)));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            calendarContainer.appendChild(createCalendarDate(day, isSelected ? "current" : "", date));
            if (isToday && !selectedDate) {
                updateCurrentDayTitle(date);
            }
        }

        const totalDays = prevMonthDays + daysInMonth;
        let nextMonthDays = 35 - totalDays;
        if (nextMonthDays < 0) {
            nextMonthDays = 42 - totalDays;
        }

        
        for (let i = 1; i <= nextMonthDays; i++) {
            const date = new Date(year, month + 1, i);
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            calendarContainer.appendChild(createCalendarDate(i, "not-current", date));
            if (isSelected && date.getMonth() === month + 1) {
                const dateDiv = calendarContainer.lastChild;
                dateDiv.classList.add('current');
            }
        }

        const numRows = Math.ceil((prevMonthDays + daysInMonth + nextMonthDays) / 7);

        calendarContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    }

    function createCalendarDate(day, additionalClass, date) {
        const dateDiv = document.createElement("div");
        dateDiv.className = `calendar-date ${additionalClass}`;

        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-date-day";
        dayDiv.textContent = day;

        const feedCountDiv = document.createElement("div");
        feedCountDiv.className = "calendar-date-feed-count";
        feedCountDiv.textContent = "5*";

        dateDiv.appendChild(dayDiv);
        dateDiv.appendChild(feedCountDiv);

        dateDiv.addEventListener("click", function () {
            document.querySelectorAll('.calendar-date.current').forEach(el => {
                el.classList.remove('current');
            });
            dateDiv.classList.add('current');

            updateCurrentDayTitle(date);
            selectedDate = date;
            const selectedChildId = currentSelectedChild.dataset.childId;
            fetchFeedingEntries(date, selectedChildId);
        });

        return dateDiv;
    }

    function updateCurrentDayTitle(date) {
        const dayOfWeek = date.toLocaleDateString('ro-RO', { weekday: 'long' });
        const dayAndMonth = date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' });
        currentDayTitle.innerHTML = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}<br>${dayAndMonth.charAt(0).toUpperCase() + dayAndMonth.slice(1)}`;
    }

    previousMonthButton.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthButton.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    
    
    updateCalendar();
    updateCurrentDayTitle(selectedDate);

    function fetchFeedingEntries(date, childID) {
        // Retrieve the JWT token from cookies
        const cookieString = document.cookie;
        const token = cookieString.substring(4); // Assuming token starts at position 4
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        // Convert date to YYYY-MM-DD format
        const dateString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
    
        // Fetch the feeding entries data
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

    let selectedEntryId=null;

    function displayFeedingEntries(entries) {
        const feedingItemsContainer = document.getElementById("feeding_items");
        feedingItemsContainer.innerHTML = ""; // Clear existing entries

        if (entries.length === 0) {
            feedingItemsContainer.innerHTML = "<p>No entries for the selected date.</p>";
        }
    
        entries.forEach(entry => {
            const entryDiv = document.createElement("div");
            entryDiv.className = "calendar-item";
            entryDiv.dataset.entryId = entry.ID;
    
            const timeP = document.createElement("p");
            timeP.textContent = entry.Time.slice(0, 5); // Display time in HH:MM format
    
            const foodP = document.createElement("p");
            foodP.textContent = `- ${entry.Quantity}${entry.Unit} ${entry.FoodType}`;
    
            entryDiv.appendChild(timeP);
            entryDiv.appendChild(foodP);
            entryDiv.addEventListener('click', function() {
                document.querySelectorAll('.calendar-item.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                entryDiv.classList.add('selected');
                selectedEntryId = entry.ID; // Store the selected entry's ID
            });
            feedingItemsContainer.appendChild(entryDiv);
        });
    }

    document.getElementById('delete-meal-bttn').addEventListener('click', function() {
        if (!selectedEntryId) {
            alert("Please select a feeding entry first.");
            return;
        }
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        fetch(`http://localhost:5000/api/delete_feeding_entry?id=${selectedEntryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('Result:', result);
            if (response.ok) {
                alert('Feeding entry deleted successfully.');
                // Refresh the feeding entries after deletion
                const selectedChildId = currentSelectedChild.dataset.childId;
                fetchFeedingEntries(selectedDate, selectedChildId);
            } else {
                alert(`Error: ${result.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the feeding entry.');
        });
    });
    


    function loadChildren() {
        // Retrieve the JWT token from cookies
        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }

        // Fetch the children data
        fetch('http://localhost:5000/api/get_user_children', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            console.log('Result:', result);
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

    // Function to display children in the HTML
    function displayChildren(children) {
        const dashboardChildren = document.getElementById('user-children-id');
        const childrenAddButton = document.getElementById('add-child-bttn');
        console.log('Children:', children);

        // Remove existing children elements
        while (dashboardChildren.firstChild && dashboardChildren.firstChild !== childrenAddButton) {
            dashboardChildren.removeChild(dashboardChildren.firstChild);
        }

        // Re-append the header and add button
        const header = document.createElement('p');
        header.textContent = 'Copiii tăi inregistrați';
        dashboardChildren.insertBefore(header, childrenAddButton);

        children.forEach(child => {
            const childContainer = createChildElement(child);
            dashboardChildren.insertBefore(childContainer, childrenAddButton);
        });
    }

    // Function to create a child element
    function createChildElement(child) {
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

    // Function to calculate age
    function calculateAge(dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    // Function to get age category
    function getAgeCategory(age) {
        if (age < 3) return 'infant';
        if (age < 13) return 'copil';
        if (age < 18) return 'adolescent';
        return 'adult';
    }

    // Function to add event listeners for child selection
    function addChildSelectionHandler() {
        document.querySelectorAll('.children-container').forEach(function(button) {

            if (!currentSelectedChild) {
                currentSelectedChild = button;
                const selectedChildId = currentSelectedChild.dataset.childId;
                fetchFeedingEntries(currentDateToday, selectedChildId);
                button.style.border = "2px solid gray";
            }

            button.addEventListener('click', function() {
                if (currentSelectedChild) {
                    currentSelectedChild.style.border = "";
                }
                currentSelectedChild = this;
                this.style.border = "2px solid gray";
            });
        });
    }

    // Load children on page load
    loadChildren();

    document.getElementById('add-child-form').addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the default form submission
    
        const form = document.getElementById('add-child-form');
        const formData = new FormData(form);
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        // Log form data for debugging
        console.log('Form data entries:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/insert_children', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                const newChild = createChildElement({
                    FirstName: formData.get('prenume'),
                    LastName: formData.get('nume'),
                    Gender: formData.get('sex'),
                    DateOfBirth: formData.get('data-nasterii'),
                    PictureRef: result.PictureRef // Assuming the server returns the saved picture path
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
        } finally
        {
            loadChildren();
        }
    });

    document.getElementById('add-child-bttn').addEventListener('click', () => {
        showModal('add-child-modal');
    });
    
    document.getElementById('add-table-bttn').addEventListener('click', () => {
        showModal('add-meal-modal');
    });
    
    document.getElementById('add-group-bttn').addEventListener('click', () => {
        showModal('add-group-modal');
    });
    
    document.getElementById('edit-account-bttn').addEventListener('click', () => {
        showModal('edit-account-modal');
        fetchAccountData();
    });

    function mapAccountTypeToString(accountType) {
        switch (accountType) {
            case 1: return 'familie';
            case 2: return 'individual';
            case 3: return 'casa-de-copii';
            default: return '';
        }
    }
    
    function mapAccountTypeToInteger(accountType) {
        switch (accountType) {
            case 'familie': return 1;
            case 'individual': return 2;
            case 'casa-de-copii': return 3;
            default: return 0;
        }
    }

    document.getElementById('use-current-date-time-checkbox').addEventListener('change', function() {
        const dateTimeInputs = document.getElementById('date-and-time-inputs-add-table');
        if (this.checked) {
            dateTimeInputs.style.display = 'none';
        } else {
            dateTimeInputs.style.display = 'block';
        }
    });

    document.getElementById('add-meal-form').addEventListener('submit', async function(e) {
        e.preventDefault(); 

        if (!currentSelectedChild) {
            alert("Please select a child first.");
            return;
        }

        const selectedChildId = currentSelectedChild.dataset.childId;

        const useCurrentDateTime = document.getElementById('use-current-date-time-checkbox').checked;
        let date, time;
        
        if (useCurrentDateTime) {
            const now = new Date();
            date = now.toISOString().split('T')[0];
            time = now.toTimeString().split(' ')[0];
        } else {
            date = document.getElementById('data_add_table').value;
            time = document.getElementById('time_add_table').value + ":00";
        }

        const unit = document.getElementById('mass-selector').value === 'grame' ? 'g' : 'mg';
        const quantity = document.getElementById('mass-input').value;
        const foodType = document.getElementById('food').value;

        const payload = {
            SelectedChildren: selectedChildId,
            Date: date,
            Time: time,
            Unit: unit,
            Quantity: parseInt(quantity, 10),
            FoodType: foodType,
        };

        console.log(payload);

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

            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Result:', result);

            if (response.ok) {
                alert('Meal added successfully.');
                fetchFeedingEntries(currentDateToday, selectedChildId);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the meal.');
        }
    });

    addChildSelectionHandler();

    async function fetchAccountData() {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return null;
        }

        try {
            const response = await fetch('http://localhost:5000/api/get_self_info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                fillFormData(data);
                populateProfileData(data.user);
                return data.user;
            } else {
                console.error('Error fetching account data');
                alert('Error fetching account data');
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching account data');
            return null;
        }
    }

    function populateProfileData(userData) {
        const fullName = `${userData.FirstName} ${userData.LastName}`;
        const email = `Email: ${userData.Email}`;
        const phoneNo = `Telefon: ${userData.PhoneNo}`;
        const maritalStatus = `Căsătorit: ${userData.CivilState === 1 ? 'Da' : 'Nu'}`;
        const location = `Localizare: ${userData.Location}`;
        const language = `Limbă: ${userData.Language}`;
        const accountType = `Tipul contului: ${mapAccountTypeToString(userData.AccountType)}`;
        console.log(`http://localhost:5000/api/src/${userData.PictureRef}`);
        const profilePhoto = userData.PictureRef ? `http://localhost:5000/api/src/${userData.PictureRef}` : 'default-profile-photo-url.jpg';

    
        // Populate the profile data in the HTML
        document.querySelector('.profile-settings-container h1').textContent = fullName;
        document.querySelector('.profile-settings-container:nth-of-type(2) p:nth-of-type(2)').textContent = email;
        document.querySelector('.profile-settings-container:nth-of-type(2) p:nth-of-type(3)').textContent = phoneNo;
        document.querySelector('.profile-settings-container:nth-of-type(5) p:nth-of-type(2)').textContent = maritalStatus;
        document.querySelector('.profile-settings-container:nth-of-type(7) p:nth-of-type(2)').textContent = location;
        document.querySelector('.profile-settings-container:nth-of-type(7) p:nth-of-type(3)').textContent = language;
        document.querySelector('.profile-settings-container:nth-of-type(9) p:nth-of-type(2)').textContent = accountType;
        document.getElementById('user-profile-name').textContent = fullName;
        document.getElementById('user-profile-type').textContent = accountType;
        const profilePhotoElement = document.querySelector('.profile-photo'); // Adjust selector as needed
        if (profilePhotoElement) {
            profilePhotoElement.src = profilePhoto;
        }

    }
    

    // Fill the form with fetched data
    function fillFormData(data) {
        const userData = data.user;
        document.getElementById('lastname').value = userData.LastName;
        document.getElementById('firstname').value = userData.FirstName;
        document.getElementById('email').value = userData.Email;
        document.getElementById('phoneNo').value = userData.PhoneNo;
        document.getElementById('location').value = userData.Location;
        document.getElementById('language').value = userData.Language;
        document.getElementById('accountType').value = mapAccountTypeToString(userData.AccountType);

        if (userData.CivilState == '1') {
            document.getElementById('casatorit').checked = true;
            document.getElementById('nume-partener-group').style.display = 'block';
            document.getElementById('civilPartner').value = userData.CivilPartner;
        } else {
            document.getElementById('casatorit').checked = false;
            document.getElementById('nume-partener-group').style.display = 'none';
            document.getElementById('civilPartner').value = '';
        }
    }

    // Show or hide partner name input based on the checkbox
    document.getElementById('casatorit').addEventListener('change', function() {
        const numePartenerGroup = document.getElementById('nume-partener-group');
        if (this.checked) {
            numePartenerGroup.style.display = 'block';
        } else {
            numePartenerGroup.style.display = 'none';
        }
    });

    document.getElementById('edit-account-form').addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the default form submission
    
        // Collect form data
        const form = document.getElementById('edit-account-form');
        const formData = new FormData(form);
    
        // Handle checkbox and partner name
        const civilStateCheckbox = document.getElementById('casatorit');
        formData.append('civilState', civilStateCheckbox.checked ? '1' : '0');
        
        const numePartenerInput = document.getElementById('civilPartner');
        if (civilStateCheckbox.checked) {
            formData.append('civilPartner', numePartenerInput.value || '');
        } else {
            formData.append('civilPartner', '-1'); // Indicate no partner if not married
        }

        const accountTypeInput = document.getElementById('accountType');
        formData.set('accountType', mapAccountTypeToInteger(accountTypeInput.value));
    
        // Retrieve the JWT token from cookies
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/modify_account_settings', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                alert('Account updated successfully');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the account');
        }
    });

    
    
});


const figures = [
    { src: '../placeholders/child1.jpg', caption: '17 Mai 2024' },
    { src: '../placeholders/child2.jpg', caption: '23 aprilie 2023' },
    { src: '../placeholders/child3.jpg', caption: '19 decembrie 2022' },
    { src: '../placeholders/child4.jpg', caption: '14 mai 2024' },
    { src: '../placeholders/user1.jpg', caption: '23 august 2005' },
    { src: '../placeholders/user1.jpg', caption: '3 martie 2024' },
    { src: '../placeholders/user1.jpg', caption: '8 martie 2023' },
    { src: '../placeholders/user1.jpg', caption: '29 februarie 2020' },
    { src: '../placeholders/child1.jpg', caption: '30 iulie 2023' },
    { src: '../placeholders/child2.jpg', caption: '1 iunie 2022' },
    { src: '../placeholders/child3.jpg', caption: '26 septembrie 2022' },
    { src: '../placeholders/child4.jpg', caption: '2 octombrie 2023' },
];

const gallery = document.querySelector('.gallery');

for (const figure of figures) {
    const figureElement = document.createElement('figure');

    const img = document.createElement('img');
    img.src = figure.src;
    img.classList.add('modal-image');
    figureElement.appendChild(img);

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = figure.caption;
    figureElement.appendChild(figcaption);

    gallery.appendChild(figureElement);
}

var img = document.getElementsByClassName('modal-image');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
for (let i = 0; i < img.length; i++) {
    img[i].onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.nextElementSibling.innerHTML;
    }
}

