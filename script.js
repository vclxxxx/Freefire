// script.js
async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return text || 'Empty response';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('result').innerHTML = `Error: ${error.message}`;
        return null;
    }
}

function getUID() {
    const uid = document.getElementById('uid').value.trim();
    if (!uid) {
        alert('Please enter a UID');
        return null;
    }
    return uid;
}

async function checkBan() {
    const uid = getUID();
    if (!uid) return;
    const data = await fetchAPI(`http://raw.thug4ff.com/check_ban/${uid}`);
    displayResult(data);
}

async function checkInfo() {
    const uid = getUID();
    if (!uid) return;
    const data = await fetchAPI(`http://raw.thug4ff.com/info?uid=${uid}`);
    displayResult(data);
}

function getCover() {
    const uid = getUID();
    if (!uid) return;
    const img = document.getElementById('coverImage');
    img.src = `http://profile.thug4ff.com/api/profile_card?uid=${uid}`;
    img.style.display = 'block';
    img.onerror = () => { document.getElementById('result').innerHTML = 'Error loading image.'; };
    document.getElementById('result').innerHTML = '';
}

async function getOutfits() {
    const uid = getUID();
    if (!uid) return;
    const data = await fetchAPI(`http://profile.thug4ff.com/api/profile?uid=${uid}`);
    displayResult(data);
    document.getElementById('result').innerHTML = '';
}

function displayResult(data) {
    const resultDiv = document.getElementById('result') || document.getElementById('outfits');
    if (typeof data === 'string') {
        resultDiv.innerHTML = `<pre>${data}</pre>`;
    } else if (data) {
        resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } else {
        resultDiv.innerHTML = 'No data';
    }
}
