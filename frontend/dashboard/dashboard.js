let currentDashboardButton = null;
let currentSelectedChild = null;
let currentSelectedAttribute = null;


const dashboardMain = document.querySelector('#dashboard-main');
const dashboardProfile = document.querySelector('#dashboard-profile');
const dashboardAdminPanel = document.querySelector('#dashboard-admin-panel');

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
  document.getElementById('prenume').value = '';
  document.getElementById('sex').value = '';
  document.getElementById('data-nasterii').value = '';
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
        }
        if(this.id == 'profile_bttn')
        {
            dashboardMain.style.display = "none";
            dashboardProfile.style.display = "";
            dashboardAdminPanel.style.display = "none";
        }
        if(this.id == 'dashboard_admin_bttn')
        {
            console.log(" aaa ");
            dashboardMain.style.display = "none";
            dashboardProfile.style.display = "none";
            dashboardAdminPanel.style.display = "";
        }
        currentDashboardButton = this;
        this.style.backgroundColor = "var(--button-color)";
    });
});


document.querySelectorAll('.attribute-button').forEach(function(button) {
    if(!currentSelectedAttribute)
    {
        currentSelectedAttribute = button;
        button.style.border = "2px solid black";
    }

    button.addEventListener('click', function() {
        if(currentSelectedAttribute)
        {
            currentSelectedAttribute.style.border = "";
        }

        currentSelectedAttribute = this;
        this.style.border = "2px solid black";
    });
});


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