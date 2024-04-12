let currentDashboardButton = null;
let currentSelectedChild = null;
let currentSelectedAttribute = null;

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