let currentDashboardButton = null;
let currentSelectedChild = null;
let currentSelectedAttribute = null;


const dashboardMain = document.querySelector('#dashboard-main');
const dashboardProfile = document.querySelector('#dashboard-profile');
const dashboardAdminPanel = document.querySelector('#dashboard-admin-panel');

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