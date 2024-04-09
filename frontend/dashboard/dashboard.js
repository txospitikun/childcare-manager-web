let lastPressedButton = null;
let currentSelectedChild = null;

document.querySelectorAll('.dashboard-button').forEach(function(button) {
    if(!lastPressedButton && button.id == 'dashboard_bttn')
    {
        console.log(button.id);
        lastPressedButton = button;
        button.style.filter = "invert(1)";
    }

    button.addEventListener('click', function() {
        if(lastPressedButton)
        {
            lastPressedButton.style.filter = "";
        }
        lastPressedButton = this;
        this.style.filter = "invert(1)";
        console.log("Button pressed: " + button.id);
    });
});


document.querySelectorAll('.children-container').forEach(function(button) {
    if(!currentSelectedChild)
    {
        console.log("a");
        currentSelectedChild = button;
        button.style.border = "2px solid red";
        console.log(button.id);
       
    }

    button.addEventListener('click', function() {
        if(currentSelectedChild)
        {
            currentSelectedChild.style.border = "";
        }
        currentSelectedChild = this;
        this.style.border = "2px solid red";
        console.log("Button pressed: " + button.id);
    });
});