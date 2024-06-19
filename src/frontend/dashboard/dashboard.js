let currentDashboardButton = null;
let currentSelectedChild = null;
let currentSelectedAttribute = null;


const dashboardMain = document.querySelector('#dashboard-main');
const dashboardProfile = document.querySelector('#dashboard-profile');
const dashboardAdminPanel = document.querySelector('#dashboard-admin-panel');
const dashboardGroups = document.querySelector('#dashboard-groups');

const addChildBttn = document.getElementById('add-child-bttn');
const addChildForm = document.querySelector('.add-child-bttn');

const addTableBttn = document.getElementById('add-table-bttn');
const addTableForm = document.querySelector('.add-table-bttn');

const confirmBttn = document.querySelector('.confirm-button');
const confirmBttnTable = document.getElementById('confirm-add-table-bttn');

addChildBttn.addEventListener('click', () => {
    addChildForm.style.display = 'block';
});

addTableBttn.addEventListener('click', () => {
    addTableForm.style.display = 'block';
});
  

confirmBttn.addEventListener('click', (event) => {
  event.preventDefault();
  addChildForm.style.display = 'none';
});


const checkbox = document.getElementById('use-current-date-time-checkbox');
const dataSiTimpInputs = document.getElementById('date-and-time-inputs-add-table');

checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    dataSiTimpInputs.style.display = 'none';
  } else {
    dataSiTimpInputs.style.display = 'block';
  }
});

addTableBttn.addEventListener('click', () => {
    addTableForm.style.display = 'block';
});

confirmBttnTable.addEventListener('click', (event) => {
  event.preventDefault();
  addTableForm.style.display = 'none';
  document.getElementById('data_add_table').value = '';
  document.getElementById('time_add_table').value = '';
  document.getElementById('text_add_table').value = '';
});




document.querySelectorAll('.dashboard-button').forEach(function(button) {

    if(!currentDashboardButton && button.id == 'dashboard_bttn')
    {
        dashboardAdminPanel.style.display = "none";
        dashboardProfile.style.display = "none";
        dashboardMain.style.display = "";
        dashboardGroups.style.display = "none";

        currentDashboardButton = button;
        button.style.backgroundColor = "var(--button-color)";
    }

    button.addEventListener('click', function() {
        if(currentDashboardButton)
        {
            currentDashboardButton.style.backgroundColor = "";
        }
        if(this.id == "dashboard_bttn")
        {
            dashboardMain.style.display = "";
            dashboardProfile.style.display = "none";
            dashboardAdminPanel.style.display = "none";
            dashboardGroups.style.display = "none";
        }
        if(this.id == 'profile_bttn')
        {
            dashboardMain.style.display = "none";
            dashboardProfile.style.display = "";
            dashboardAdminPanel.style.display = "none";
            dashboardGroups.style.display = "none";
        }
        if(this.id == 'dashboard_admin_bttn')
        {
            dashboardMain.style.display = "none";
            dashboardProfile.style.display = "none";
            dashboardAdminPanel.style.display = "";
            dashboardGroups.style.display = "none";
        }
        if(this.id == 'groups_bttn')
        {
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
    "feeding-bttn": document.getElementById('feedingElement'),
    "sleeping-bttn": document.getElementById('sleepingElement'),
    "media-bttn": document.getElementById('mediaElement'),
    "evolution-bttn": document.getElementById('evolutionElement'),
    "medical-bttn": document.getElementById('medicalElement')
};

currentSelectedAttribute = document.getElementById('evolution-bttn');

if (currentSelectedAttribute) {
    currentSelectedAttribute.style.border = "2px solid black";
}

if (buttonDisplayMap['evolution-bttn']) {
    buttonDisplayMap['evolution-bttn'].style.display = "";
}

document.querySelectorAll('.attribute-button').forEach(function(button) {
    button.addEventListener('click', function() {
        if(currentSelectedAttribute)
        {
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

        currentSelectedAttribute = this;
        this.style.border = "2px solid black";
    });
});

var modal = document.getElementById("myModal");

var img = document.getElementsByClassName('modal-image');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
for (let i = 0; i < img.length; i++) {
  img[i].onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.nextElementSibling.innerHTML;
  }
}

var span = document.getElementsByClassName("close")[0];

span.onclick = function() { 
  modal.style.display = "none";
}

var deleteBtn = document.getElementById("delete");

deleteBtn.onclick = function() {
  modal.style.display = "none";
}


document.querySelectorAll('.children-container').forEach(function(button) {
    if(!currentSelectedChild)
    {
        currentSelectedChild = button;
        button.style.border = "2px solid gray";
    }

    button.addEventListener('click', function() {
        if(currentSelectedChild)
        {
            currentSelectedChild.style.border = "";
        }
        currentSelectedChild = this;
        this.style.border = "2px solid gray";
    });
});

var modal2 = document.getElementById("myModal2");

var btn = document.getElementById("addPhoto");

var span = modal2.getElementsByClassName("close2")[0];

btn.onclick = function() {
  modal2.style.display = "block";
}

span.onclick = function() {
  modal2.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    const calendarContainer = document.getElementById("feedingCalendar");
    const monthYearDisplay = document.getElementById("month-year");
    const previousMonthButton = document.getElementById("previous-month-button");
    const nextMonthButton = document.getElementById("next-month-button");
  
    let currentDate = new Date();
    
    function updateCalendar() {
      calendarContainer.innerHTML = "";
  
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
  
      monthYearDisplay.textContent = currentDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
  
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
  
      const prevMonthDays = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
      const prevMonthLastDate = new Date(year, month, 0).getDate();
  
      for (let i = prevMonthLastDate - prevMonthDays + 1; i <= prevMonthLastDate; i++) {
        calendarContainer.appendChild(createCalendarDate(i, "not-current"));
      }
  
      for (let day = 1; day <= daysInMonth; day++) {
        calendarContainer.appendChild(createCalendarDate(day, ""));
      }
  
      const nextMonthDays = (35 - prevMonthDays - daysInMonth);
      for (let i = 1; i <= nextMonthDays; i++) {
        calendarContainer.appendChild(createCalendarDate(i, "not-current"));
      }
    }
  
    function createCalendarDate(day, additionalClass) {
      const dateDiv = document.createElement("div");
      dateDiv.className = `feeding-calendar-date ${additionalClass}`;
      
      const dayDiv = document.createElement("div");
      dayDiv.className = "feeding-calendar-date-day";
      dayDiv.textContent = day;
      
      const feedCountDiv = document.createElement("div");
      feedCountDiv.className = "feeding-calendar-date-feed-count";
      feedCountDiv.textContent = "5*";
      
      dateDiv.appendChild(dayDiv);
      dateDiv.appendChild(feedCountDiv);
      
      dateDiv.addEventListener("click", function() {
        document.querySelectorAll('.feeding-calendar-date.current').forEach(el => {
          el.classList.remove('current');
        });
        dateDiv.classList.add('current');
      });
      
      return dateDiv;
    }
  
    previousMonthButton.addEventListener("click", function() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendar();
    });
  
    nextMonthButton.addEventListener("click", function() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendar();
    });
  
    updateCalendar();
  });
  