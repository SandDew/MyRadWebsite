const loadedImages = new Set();

fetch('Sources.json')
  .then(response => response.json())
  .then(SOURCES => {
    // Preload all images in SOURCES only if not already loaded
    Object.values(SOURCES).forEach(src => {
      if (
        typeof src === 'string' &&
        /\.(png|jpg|jpeg|gif|svg)$/i.test(src) &&
        !loadedImages.has(src)
      ) {
        const img = new Image();
        img.src = src;
        loadedImages.add(src);
      }
    });

    // Set sources for <img data-source="...">
    document.querySelectorAll('img[data-source]').forEach(img => {
      const key = img.getAttribute('data-source');
      if (SOURCES[key]) img.src = SOURCES[key];
    });

    // Set sources for background images
    document.querySelectorAll('[data-bg-source]').forEach(el => {
      const key = el.getAttribute('data-bg-source');
      if (SOURCES[key]) el.style.backgroundImage = `url('${SOURCES[key]}')`;
    });

    // Make SOURCES globally available and signal it's loaded
    window.SOURCES = SOURCES;
    document.dispatchEvent(new Event('sourcesLoaded'));
  });

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function checkAspectRatio() {
    const warning = document.getElementById('screen-warning');
    if (!warning) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    const ignored = getCookie('ignoreScreenWarning');
    if (aspect < 1.3 && !ignored) {
        warning.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        warning.style.display = 'none';
        document.body.style.overflow = '';
    }
    // Attach ignore button handler
    const ignoreBtn = document.getElementById('ignore-warning-btn');
    if (ignoreBtn) {
        ignoreBtn.onclick = function() {
            setCookie('ignoreScreenWarning', '1', 7);
            warning.style.display = 'none';
            document.body.style.overflow = '';
        };
    }
}

window.addEventListener('resize', checkAspectRatio);
window.addEventListener('DOMContentLoaded', checkAspectRatio);

// Track last visit
function setLastVisit() {
    const now = new Date().toISOString();
    setCookie('lastVisit', now, 365);
    window.lastVisit = getCookie('lastVisit');
}
window.addEventListener('DOMContentLoaded', setLastVisit);

// Track page visits/reloads
function incrementPageVisitCounter() {
    let visits = parseInt(getCookie('pageVisits') || '0', 10);
    visits += 1;
    setCookie('pageVisits', visits, 365);
    window.pageVisits = visits;
}
window.addEventListener('DOMContentLoaded', incrementPageVisitCounter);

// Persist click counter
function loadClickCounter() {
    const counter = parseInt(getCookie('clickCounter') || '0', 10);
    window.clickCounter = counter;
    const counterElem = document.getElementById('counter');
    if (counterElem) counterElem.textContent = counter;
}
function saveClickCounter() {
    setCookie('clickCounter', window.clickCounter, 365);
}
window.addEventListener('DOMContentLoaded', loadClickCounter);

// If you have a click button, update the counter and save
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('click-btn');
    if (btn) {
        btn.onclick = function() {
            window.clickCounter = (window.clickCounter || 0) + 1;
            document.getElementById('counter').textContent = window.clickCounter;
            saveClickCounter();
        };
    }
});


