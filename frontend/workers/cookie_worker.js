export function setCookie(name, value, days) 
{
    console.log('cookie set');
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name)
{
    const returnedName = name + '=';
    const content = document.cookie.split(';');
    for(let i = 0; i < content.length; i++)
    {
        let currentContent = content[i];
        while(currentContent.charAt(0) === ' ')
        {
            currentContent = currentContent.substring(1, currentContent.length);
        }
        if(currentContent.indexOf(returnedName) === 0)
        {
            return currentContent.substring(returnedName.length, currentContent.length);
        }
        return null;
        
    }
}

export function deleteCookie(name)
{
    document.cookie = name + '=; Max-Age=-99999999;';
}