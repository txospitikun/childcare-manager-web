let currentDashboardButton = null;
let currentSelectedChild = null;
let currentSelectedAttribute = null;


const dashboardMain = document.querySelector('#dashboard-main');
const dashboardProfile = document.querySelector('#dashboard-profile');

document.querySelectorAll('.attribute-button').forEach(function(button) {
    if(!currentSelectedAttribute)
    {
        currentSelectedAttribute = button;
        button.style.border = "2px solid black";
        dashboardProfile.style.display = "none";
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

document.querySelectorAll('.dashboard-button').forEach(function(button) {
    if(!currentDashboardButton && button.id == 'dashboard_bttn')
    {
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
        }
        if(this.id == 'profile_bttn')
        {
            dashboardMain.style.display = "none";
            dashboardProfile.style.display = "";
        }
        currentDashboardButton = this;
        this.style.backgroundColor = "var(--button-color)";
    });
});


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