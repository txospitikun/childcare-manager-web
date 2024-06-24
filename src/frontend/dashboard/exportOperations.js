document.getElementById('export-childrens').addEventListener('click', () =>
{
    console.log("test");
    exportChildrens();
});

document.getElementById('export-media').addEventListener('click', () =>
{
    exportMedia();
});

document.getElementById('export-groups').addEventListener('click', () =>
{
    exportGroups();
});

document.getElementById('export-profile').addEventListener('click', () =>
{
    exportProfile();
});

export async function exportChildrens() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
        return null;
    }

    try {
        const response = await fetch('http://localhost:5000/api/get_user_children', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            saveToFile(data, 'childrens.json');
        } else {
            alert('Error exporting children data');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while exporting children data');
        return null;
    }
}

export async function exportMedia() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
        return null;
    }
    let userChildren = null;
    try {
        const response = await fetch('http://localhost:5000/api/get_user_children', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            userChildren = await response.json();
        } else {
            alert('Error exporting children data');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while exporting children data');
        return null;
    }
    let result = [];
    let childmedia = null;
    for (const child of userChildren.childrenInfo) {
        try {

            const response = await fetch(`http://localhost:5000/api/get_children_media?childID=${child.ID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                childmedia = await response.json();

            } else {
                alert('Error exporting media data');
                null;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while exporting media data');

        }
        result.push(childmedia);
    }
    result.pop();
    saveToFile(result, 'media.json');
}

export async function exportGroups() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
        return null;
    }

    try {
        const response = await fetch('http://localhost:5000/api/get_user_groups', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            saveToFile(data, 'groups.json');
        } else {
            alert('Error exporting groups data');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while exporting groups data');
        return null;
    }
}

export async function exportProfile() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('JWT token not found');
        return null;
    }

    try {
        const response = await fetch('http://localhost:5000/api/get_self_info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            saveToFile(data, 'profile.json');
        } else {
            alert('Error exporting account data');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while exporting account data');
        return null;
    }
}

function saveToFile(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}