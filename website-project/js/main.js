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
const clippyImg = document.getElementById('clippy-img');
const clippyTooltip = document.getElementById('clippy-tooltip');
const clippyClose = document.getElementById('clippy-close');
let menuOpen = false;

startBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    menuOpen = !menuOpen;
    startMenu.style.display = menuOpen ? 'block' : 'none';
    startBtn.classList.toggle('active', menuOpen);

    // Hide Clippy and tooltip when opening the start menu
    if (menuOpen) {
        clippyTooltip.style.display = 'none';
        clippyContainer.classList.add('fade-out');
    } else {
        clippyContainer.classList.remove('fade-out');
    }
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    if (menuOpen && !startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.style.display = 'none';
        startBtn.classList.remove('active');
        menuOpen = false;
        clippyContainer.classList.remove('fade-out');
    }
});

// Clippy tooltip logic
clippyClose.onclick = function() {
    clippyTooltip.style.display = 'none';
    clippyContainer.classList.add('fade-out');
};

// Show tooltip on load
window.addEventListener('DOMContentLoaded', function() {
    clippyTooltip.style.display = 'block';
    clippyContainer.classList.remove('fade-out');
});

// Rights/Wrongs toggle
const rightsLink = document.getElementById('rights-link');
let rightsState = true;
rightsLink.addEventListener('click', function(e) {
    e.preventDefault();
    rightsState = !rightsState;
    rightsLink.textContent = rightsState ? "Rights" : "Wrongs";
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