// Counter
function incrementCounter() {
  const counter = document.getElementById('counter');
  counter.textContent = parseInt(counter.textContent, 10) + 1;
  counter.style.transform = 'scale(1.2)';
  setTimeout(() => counter.style.transform = 'scale(1)', 100);
}
document.getElementById('click-btn').onclick = incrementCounter;

// Start Menu logic
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
const clippyContainer = document.getElementById('clippy-container');
let menuOpen = false;

startBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    menuOpen = !menuOpen;
    startMenu.style.display = menuOpen ? 'block' : 'none';
    startBtn.classList.toggle('active', menuOpen);

    // Fade Clippy when opening the start menu
    if (menuOpen) {
        clippyContainer.classList.add('fade-out');
    } else {
        clippyContainer.classList.remove('fade-out');
    }
});

document.addEventListener('click', function(e) {
    if (menuOpen && !startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.style.display = 'none';
        startBtn.classList.remove('active');
        menuOpen = false;
        clippyContainer.classList.remove('fade-out');
    }
});

// Rights/Wrongs toggle
window.addEventListener('DOMContentLoaded', function() {
    const rightsLink = document.getElementById('rights-link');
    let rightsState = true;
    if (rightsLink) {
        rightsLink.addEventListener('click', function(e) {
            e.preventDefault();
            rightsState = !rightsState;
            rightsLink.textContent = rightsState ? "Rights" : "Wrongs";
        });
    }
});

// Add event handler for Shut Down (BSOD)
document.getElementById('shutdown-link').onclick = function(e) {
    e.preventDefault();
    document.getElementById('bsod').style.display = 'flex';
    // Play BSOD sound if available
    var audio = document.getElementById('bsod-audio');
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
    startMenu.style.display = 'none';
    startBtn.classList.remove('active');
    menuOpen = false;
};

// Add event handler for all BSOD triggers (Start Menu links)
document.querySelectorAll('.bsod-trigger').forEach(link => {
    link.onclick = function(e) {
        e.preventDefault();
        document.getElementById('bsod').style.display = 'flex';
        // Play BSOD sound if available
        var audio = document.getElementById('bsod-audio');
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
        startMenu.style.display = 'none';
        startBtn.classList.remove('active');
        menuOpen = false;
    };
});

// Notification system
const notificationNames = [
    "Phil del Futuro", "Mia", "Levy", "Gabriel", "Lyle", "Thermo", "Benni", "BB", "Dak"
    , "DB"
];
const notificationMessages = [
    "42", "Donde esta la biblioteca?", "Why did the graveyard have good test scores? They all passed",
    "I used to think I was indecisive, but now I’m not so sure", "Did you get the memo?",
    "Okay man, you can have your stapler. No fires.", "viva la vida.", "viva la vida loca.", 
    "What's life without whimsy?", "Who's David?"
];

function showNotification() {
    const name = notificationNames[Math.floor(Math.random() * notificationNames.length)];
    const message = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
    const notifId = 'notif-' + Date.now() + '-' + Math.floor(Math.random()*10000);

    const notif = document.createElement('div');
    notif.className = 'win95-notification';
    notif.id = notifId;
    notif.innerHTML = `
        <div class="win95-notif-titlebar">
            <span>${name}</span>
            <button class="win95-notif-close" title="Close" onclick="fadeOutNotification(this.closest('.win95-notification'))">✖</button>
        </div>
        <div class="win95-notif-content">${message}</div>
    `;
    document.getElementById('notification-container').appendChild(notif);

    // Fade out after 7 seconds, then remove
    setTimeout(() => {
        fadeOutNotification(notif);
    }, 7000);
}

// Helper to fade out and remove notification
function fadeOutNotification(notif) {
    if (!notif) return;
    notif.classList.add('fade-out');
    setTimeout(() => {
        if (notif && notif.parentNode) notif.parentNode.removeChild(notif);
    }, 700); // Match the CSS transition duration
}

// Random interval between 20-80 seconds
function scheduleNotification() {
    const next = Math.random() * (80 - 20) + 20;
    setTimeout(() => {
        showNotification();
        scheduleNotification();
    }, next * 1000);
}

// Start notifications after page load
window.addEventListener('DOMContentLoaded', () => {
    scheduleNotification();
});

// Pinball popup logic
const pinballPopup = document.getElementById('pinball-popup');
const pinballBar = document.getElementById('pinball-bar');
const pinballIframeContainer = document.getElementById('pinball-iframe-container');
const pinballLink = document.getElementById('pinball-link');
const closePinballBtn = document.getElementById('close-pinball');

pinballLink.onclick = function(e) {
    e.preventDefault();
    // Make iframe taller and shift up to crop bottom
    pinballIframeContainer.innerHTML = `
        <iframe 
            src="https://alula.github.io/SpaceCadetPinball/" 
            width="900px" 
            height="470px" 
            frameborder="0" 
            style="
                border:0;
                display:block;
                position:relative;
                top:-32px;      /* crop top */
                bottom:-150px;  /* crop bottom */
                left:-150px;    /* scroll right */
            ">
        </iframe>
    `;
    pinballPopup.style.display = 'block';
    pinballPopup.style.zIndex = 999;
};

closePinballBtn.onclick = function() {
    // Remove iframe to stop the game
    pinballIframeContainer.innerHTML = '';
    pinballPopup.style.display = 'none';
};

// Drag logic for pinball popup
(function() {
    let isDragging = false, offsetX = 0, offsetY = 0;

    pinballBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - pinballPopup.offsetLeft;
        offsetY = e.clientY - pinballPopup.offsetTop;
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            pinballPopup.style.left = (e.clientX - offsetX) + 'px';
            pinballPopup.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
    });
})();

// Info popup logic
document.addEventListener('DOMContentLoaded', function() {
    const infoLink = document.getElementById('info-link');
    const infoPopup = document.getElementById('info-popup');
    const closeInfo = document.getElementById('close-info');
    const infoContent = document.getElementById('info-content');

    function getOSInfo() {
        const ua = navigator.userAgent;
        let os = "Unknown";
        if (ua.indexOf("Win") !== -1) os = "Windows";
        else if (ua.indexOf("Mac") !== -1) os = "MacOS";
        else if (ua.indexOf("Linux") !== -1) os = "Linux";
        else if (ua.indexOf("Android") !== -1) os = "Android";
        else if (ua.indexOf("like Mac") !== -1) os = "iOS";
        return os;
    }

    function getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.indexOf("Chrome") !== -1) return "Chrome";
        if (ua.indexOf("Firefox") !== -1) return "Firefox";
        if (ua.indexOf("Safari") !== -1) return "Safari";
        if (ua.indexOf("Edge") !== -1) return "Edge";
        if (ua.indexOf("MSIE") !== -1 || ua.indexOf("Trident") !== -1) return "Internet Explorer";
        return "Unknown";
    }

    function showInfo() {
        infoContent.innerHTML = "Loading info...";
        infoPopup.style.display = "block";
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
                const ip = data.ip || "Unknown";
                infoContent.innerHTML = `
                    <b>IP Address:</b> ${ip}<br>
                    <b>Operating System:</b> ${getOSInfo()}<br>
                    <b>Browser:</b> ${getBrowserInfo()}<br>
                    <b>Screen Size:</b> ${window.screen.width} x ${window.screen.height}<br>
                    <b>Window Size:</b> ${window.innerWidth} x ${window.innerHeight}<br>
                    <b>Device Pixel Ratio:</b> ${window.devicePixelRatio}<br>
                    <b>Current Language:</b> ${navigator.language || 'Unknown'}<br>
                    <b>Languages:</b> ${navigator.languages ? navigator.languages.join(', ') : 'Unknown'}<br>
                    <b>Timezone:</b> ${Intl.DateTimeFormat().resolvedOptions().timeZone}<br>
                    <b>Platform:</b> ${navigator.platform}<br>
                    <b>Online:</b> ${navigator.onLine ? "Yes" : "No"}<br>
                    <b>Referrer:</b> ${document.referrer || "None"}<br>
                    <b>User Agent:</b> ${navigator.userAgent}<br>
                    <b>Cookies Enabled:</b> ${navigator.cookieEnabled ? "Yes" : "No"}<br>
                    <b>Java Enabled:</b> ${navigator.javaEnabled ? navigator.javaEnabled() : "Unknown"}<br>
                    <b>Color Depth:</b> ${window.screen.colorDepth}<br>
                    <b>Pixel Depth:</b> ${window.screen.pixelDepth}<br>
                    <b>Hardware Concurrency:</b> ${navigator.hardwareConcurrency || "Unknown"}<br>
                    <b>Memory (GB):</b> ${navigator.deviceMemory || "Unknown"}<br>
                    <b>Touch Support:</b> ${('ontouchstart' in window) ? "Yes" : "No"}<br>
                    <b>Last Visit:</b> ${window.lastVisit || "Unknown"}<br>
                    <b>Number of Visits:</b> ${window.pageVisits || "Unknown"}<br>
                    <b>Click Counter:</b> ${window.clickCounter || 0}<br>
                `;
            })
            .catch(() => {
                infoContent.innerHTML = `
                    <b>IP Address:</b> Unknown<br>
                    <b>Operating System:</b> ${getOSInfo()}<br>
                    <b>Browser:</b> ${getBrowserInfo()}<br>
                    <b>Screen Size:</b> ${window.screen.width} x ${window.screen.height}<br>
                    <b>Window Size:</b> ${window.innerWidth} x ${window.innerHeight}<br>
                    <b>Device Pixel Ratio:</b> ${window.devicePixelRatio}<br>
                    <b>Languages:</b> ${navigator.languages ? navigator.languages.join(', ') : 'Unknown'}<br>
                    <b>Timezone:</b> ${Intl.DateTimeFormat().resolvedOptions().timeZone}<br>
                    <b>Platform:</b> ${navigator.platform}<br>
                    <b>Online:</b> ${navigator.onLine ? "Yes" : "No"}<br>
                    <b>Referrer:</b> ${document.referrer || "None"}<br>
                    <b>User Agent:</b> ${navigator.userAgent}<br>
                    <b>Cookies Enabled:</b> ${navigator.cookieEnabled ? "Yes" : "No"}<br>
                    <b>Java Enabled:</b> ${navigator.javaEnabled ? navigator.javaEnabled() : "Unknown"}<br>
                    <b>Color Depth:</b> ${window.screen.colorDepth}<br>
                    <b>Pixel Depth:</b> ${window.screen.pixelDepth}<br>
                    <b>Hardware Concurrency:</b> ${navigator.hardwareConcurrency || "Unknown"}<br>
                    <b>Memory (GB):</b> ${navigator.deviceMemory || "Unknown"}<br>
                    <b>Touch Support:</b> ${('ontouchstart' in window) ? "Yes" : "No"}<br>
                    <b>Last Visit:</b> ${window.lastVisit || "Unknown"}<br>
                    <b>Number of Visits:</b> ${window.pageVisits || "Unknown"}<br>
                    <b>Click Counter:</b> ${window.clickCounter || 0}<br>
                `;
            });
    }

    if (infoLink) {
        infoLink.onclick = function(e) {
            e.preventDefault();
            showInfo();
        };
    }
    if (closeInfo) {
        closeInfo.onclick = function() {
            infoPopup.style.display = "none";
        };
    }
});

// Drag logic for info popup
(function() {
    const infoPopup = document.getElementById('info-popup');
    const infoBar = infoPopup.querySelector('div[style*="height:32px"]');
    let isDragging = false, offsetX = 0, offsetY = 0;

    infoBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - infoPopup.offsetLeft;
        offsetY = e.clientY - infoPopup.offsetTop;
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            infoPopup.style.left = (e.clientX - offsetX) + 'px';
            infoPopup.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
    });
})();

