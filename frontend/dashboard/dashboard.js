let lastPressedButton = null;

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