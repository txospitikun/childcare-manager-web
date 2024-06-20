import { addChild, fetchUserChildren } from './dashboard_post_operations.js';

let currentDashboardButton = null;
let currentSelectedChild = null;
let currentSelectedAttribute = null;


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
});

document.getElementById('casatorit').addEventListener('change', function() {
    const partnerNameGroup = document.getElementById('nume-partener-group');
    if (this.checked) {
        partnerNameGroup.style.display = 'block';
    } else {
        partnerNameGroup.style.display = 'none';
    }
});

const confirmBttn = document.querySelector('.confirm-button');
const confirmBttnTable = document.getElementById('confirm-add-table-bttn');



// Close button functionality
document.querySelectorAll('.close-button').forEach(button => {
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

// confirmBttn.addEventListener('click', (event) => {
//     event.preventDefault();
//     // addChildForm.style.display = 'none';
//     document.getElementById('prenume').value = '';
//     document.getElementById('sex').value = '';
//     document.getElementById('data-nasterii').value = '';
// });


const checkbox = document.getElementById('use-current-date-time-checkbox');
const dataSiTimpInputs = document.getElementById('date-and-time-inputs-add-table');

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        dataSiTimpInputs.style.display = 'none';
    } else {
        dataSiTimpInputs.style.display = 'block';
    }
});

confirmBttnTable.addEventListener('click', (event) => {
    event.preventDefault();
    addTableForm.style.display = 'none';
    document.getElementById('data_add_table').value = '';
    document.getElementById('time_add_table').value = '';
    document.getElementById('text_add_table').value = '';
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


document.querySelectorAll('.children-container').forEach(function (button) {
    if (!currentSelectedChild) {
        currentSelectedChild = button;
        button.style.border = "2px solid gray";
    }

    button.addEventListener('click', function () {
        if (currentSelectedChild) {
            currentSelectedChild.style.border = "";
        }
        currentSelectedChild = this;
        this.style.border = "2px solid gray";
    });
});


var btn = document.getElementById("addPhoto");


document.addEventListener("DOMContentLoaded", function () {
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

document.getElementById('add-child-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect form data
    const nume = document.getElementById('nume').value;
    const prenume = document.getElementById('prenume').value;
    const sex = document.getElementById('sex').value;
    const dataNasterii = document.getElementById('data-nasterii').value;

    // Create the data object
    const data = {
        FirstName: prenume,
        LastName: nume,
        Gender: sex,
        DateOfBirth: dataNasterii
    };

    // Retrieve the JWT token from cookies
    const cookieString = document.cookie;
    console.log('Cookie string:', cookieString);
    const token = cookieString.split('; ').find(row => row.startsWith('JWT=')).split('=')[1];
    console.log('JWT Token:', token);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
        return;
    }

    console.log('Form data:', data);

    // Send the data to the server
    fetch('http://localhost:5000/api/insert_children', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(result => {
        console.log('Result:', result);
        if (result.InsertChildrenResponse === 300) {
            alert('Child successfully added.');
        } else if (result.InsertChildrenResponse === 10) {
            alert('Invalid or expired JWT token. Redirecting to login page.');
            window.location.href = '/login';
        } else {
            alert('Error: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
