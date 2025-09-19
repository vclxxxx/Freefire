// script.js
async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('result').innerHTML = 'Error fetching data.';
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
    document.getElementById('result').innerHTML = data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : 'No data';
}

async function checkInfo() {
    const uid = getUID();
    if (!uid) return;
    const data = await fetchAPI(`http://raw.thug4ff.com/info?uid=${uid}`);
    document.getElementById('result').innerHTML = data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : 'No data';
}

function getCover() {
    const uid = getUID();
    if (!uid) return;
    const img = document.getElementById('coverImage');
    img.src = `http://profile.thug4ff.com/api/profile_card?uid=${uid}`;
    img.style.display = 'block';
    document.getElementById('result').innerHTML = '';
}

async function getOutfits() {
    const uid = getUID();
    if (!uid) return;
    const data = await fetchAPI(`http://profile.thug4ff.com/api/profile?uid=${uid}`);
    document.getElementById('outfits').innerHTML = data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : 'No data';
    document.getElementById('result').innerHTML = '';
}