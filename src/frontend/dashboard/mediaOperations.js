import { getCurrentSelectedChild } from './childrenOperations.js';

export async function addMedia(e) {
    e.preventDefault();

    if (getCurrentSelectedChild() === null) {
        alert("Please select a child first.");
        return;
    }

    const selectedChildId = getCurrentSelectedChild().dataset.childId;
    const useCurrentDateTime = document.getElementById('use-current-date-time-checkbox-media').checked;
    const addToTimeline = document.getElementById('add-to-timeline-checkbox').checked;
    let date, time;

    if (useCurrentDateTime) {
        const now = new Date();
        date = now.toISOString().split('T')[0];
        time = now.toTimeString().split(' ')[0];
    } else {
        date = document.getElementById('data_media').value;
        time = document.getElementById('time_media').value + ":00";
    }

    const fileInput = document.getElementById('mediaInput');
    if (fileInput.files.length === 0) {
        alert('Please select a file.');
        return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('ChildrenID', selectedChildId);
    formData.append('Date', date);
    formData.append('Time', time);
    formData.append('InTimeline', addToTimeline ? '1' : '0');
    formData.append('MediaType', file.type);
    formData.append('PictureRef', file);

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/insert_media', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            fetchChildrenMedia(selectedChildId);
            document.getElementById('add-photo-modal').style.display = 'none';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the media entry.');
    }
}

export async function deleteMedia() {
    const entryId = this.dataset.entryId;

    if (!entryId) {
        alert("No media entry selected.");
        return;
    }

    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/delete_media?id=${entryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            const selectedChildId = getCurrentSelectedChild().dataset.childId;
            fetchChildrenMedia(selectedChildId);
            document.getElementById('myModal').style.display = 'none';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        alert('An error occurred while deleting the media entry.');
    }
}

export function fetchChildrenMedia(childID) {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('JWT token not found');
        alert('JWT token not found');
        return;
    }

    fetch(`http://localhost:5000/api/get_children_media?childID=${childID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.status === 204)
                return null;
            return response.json();
        })
        .then(result => {
            if(result === null) return;
            if (result.media) {
                displayMediaEntries(result.media);
                displayTimelineEntries(result.media);
            } else {
                displayMediaEntries([]);
                displayTimelineEntries([]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayMediaEntries([]);
            displayTimelineEntries([]);
        });
}

function displayMediaEntries(entries) {
    const gallery = document.getElementById('media-gallery');
    gallery.innerHTML = "";


    if (entries.length === 0) {
        gallery.innerHTML = "<p>No entries for the selected child.</p>";
        return;
    }

    entries.forEach(entry => {
        const figureElement = document.createElement('figure');

        const mediaType = entry.MediaType.toLowerCase();
        let mediaElement;

        if (mediaType.includes('.jpg') || mediaType.includes('.jpeg') || mediaType.includes('.png') || mediaType.includes('.gif')) {
            mediaElement = document.createElement('img');
            mediaElement.src = `http://localhost:5000/api/src/${entry.PictureRef}`;
            mediaElement.classList.add('modal-image');
        } else if (mediaType.includes('.mp4') || mediaType.includes('.webm') || mediaType.includes('.ogg')) {
            mediaElement = document.createElement('video');
            mediaElement.src = `http://localhost:5000/api/src/${entry.PictureRef}`;
            mediaElement.controls = true;
            mediaElement.classList.add('modal-video');
        } else if (mediaType.includes('.mp3') || mediaType.includes('.wav') || mediaType.includes('.ogg')) {
            mediaElement = document.createElement('audio');
            mediaElement.src = `http://localhost:5000/api/src/${entry.PictureRef}`;
            mediaElement.controls = true;
            mediaElement.classList.add('modal-audio');
        }

        figureElement.appendChild(mediaElement);

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = `${entry.Date.split('T')[0]} ${entry.Time.slice(0, 5)}`;
        figureElement.appendChild(figcaption);

        gallery.appendChild(figureElement);

        mediaElement.addEventListener('click', function () {
            openMediaModal(mediaElement, figcaption.textContent, entry.ID);
        });
    });
}

function displayTimelineEntries(entries) {
    const timelineContent = document.getElementById('timeline-content');
    timelineContent.innerHTML = '';

    const timelineEntries = entries.filter(entry => entry.InTimeline === 1);


    timelineEntries.forEach((entry, index) => {
        const containerDiv = document.createElement('div');
        containerDiv.className = `container ${index % 2 === 0 ? 'left' : 'right'}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        const date = new Date(entry.Date);
        const year = date.getFullYear();

        const h2 = document.createElement('h2');
        h2.textContent = year;

        let mediaElement;
        if (entry.MediaType.includes('.jpg') || entry.MediaType.includes('.jpeg') || entry.MediaType.includes('.png')) {
            mediaElement = document.createElement('img');
            mediaElement.src = `http://localhost:5000/api/src/${entry.PictureRef}`;
            mediaElement.alt = "Image description";
        } else if (entry.MediaType.includes('.mp4') || entry.MediaType.includes('.webm')) {
            mediaElement = document.createElement('video');
            mediaElement.src = `http://localhost:5000/api/src/${entry.PictureRef}`;
            mediaElement.controls = true;
        } else if (entry.MediaType.includes('.mp3') || entry.MediaType.includes('.wav')) {
            mediaElement = document.createElement('audio');
            mediaElement.src = `http://localhost:5000/api/src/${entry.PictureRef}`;
            mediaElement.controls = true;
        }

        const p = document.createElement('p');
        p.textContent = `${entry.Date.split('T')[0]} ${entry.Time.slice(0, 5)}`;

        contentDiv.appendChild(h2);
        contentDiv.appendChild(mediaElement);
        contentDiv.appendChild(p);
        containerDiv.appendChild(contentDiv);
        timelineContent.appendChild(containerDiv);
    });
}

function openMediaModal(mediaElement, caption, entryId) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const modalVideo = document.getElementById("vid01");
    const modalAudio = document.getElementById("aud01");
    const captionText = document.getElementById("caption");
    const deleteButton = document.getElementById("delete");
    const closeButton = modal.querySelector('.close');

    modal.style.display = "block";
    captionText.innerHTML = caption;
    deleteButton.dataset.entryId = entryId;

    if (mediaElement.tagName === 'IMG') {
        modalImg.src = mediaElement.src;
        modalImg.style.display = 'block';
        modalVideo.style.display = 'none';
        modalAudio.style.display = 'none';
    } else if (mediaElement.tagName === 'VIDEO') {
        modalVideo.src = mediaElement.src;
        modalVideo.style.display = 'block';
        modalImg.style.display = 'none';
        modalAudio.style.display = 'none';
    } else if (mediaElement.tagName === 'AUDIO') {
        modalAudio.src = mediaElement.src;
        modalAudio.style.display = 'block';
        modalImg.style.display = 'none';
        modalVideo.style.display = 'none';
    }

    closeButton.addEventListener('click', function () {
        modal.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        const modal = document.getElementById("myModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

export function resetMediaForm() {
    document.getElementById('add-photo-modal').querySelector('form').reset();
    document.getElementById('use-current-date-time-checkbox-media').checked = true;
    document.getElementById('date-and-time-inputs-media').style.display = 'none';
}