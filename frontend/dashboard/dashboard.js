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

// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
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

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}

// Get the delete button
var deleteBtn = document.getElementById("delete");

// When the user clicks on the delete button, delete the photo and close the modal
deleteBtn.onclick = function() {
  // Delete the photo
  modal.style.display = "none";
  // Add your code here to delete the photo
}


document.querySelectorAll('.children-container').forEach(function(button) {
    if(!currentSelectedChild)
    {
        console.log("a");
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