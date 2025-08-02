// Pendulum Cursor Effect: position fixed to mouse, physics only for rotation
window.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('wii-cursor');
    if (!cursor) {
        console.error('`wii-cursor` element not found');
        return;
    }

    let lastX = window.innerWidth / 2;
    let angle = 0; // current angle in radians
    let angularVelocity = 0;
    const maxAngle = Math.PI / 2; // 90 degrees in radians
    const maxDelta = Math.PI / 72; // max change per frame (~2.5 degrees, less jitter)
    const returnSpring = 0.015; // even slower return to zero
    const damping = 0.85; // much more damping for less jitter and more smoothness
    let lastMoveTime = performance.now();
    const returnDelay = 220; // ms delay before returning to zero

    document.addEventListener('mousemove', e => {
        const dx = e.clientX - lastX;
        lastX = e.clientX;

        let targetAngle = Math.max(-maxAngle, Math.min(maxAngle, dx * 0.05));
        let delta = targetAngle - angle;
        if (delta > maxDelta) delta = maxDelta;
        if (delta < -maxDelta) delta = -maxDelta;
        angularVelocity += delta;

        lastMoveTime = performance.now();
    });

    function animate() {
        const now = performance.now();
        // Only apply spring return if enough time has passed since last movement
        if (now - lastMoveTime > returnDelay) {
            angularVelocity += -angle * returnSpring;
        }
        // Damping for dramatic swinging
        angularVelocity *= damping;
        angle += angularVelocity;

        // Clamp angle to maxAngle
        if (angle > maxAngle) {
            angle = maxAngle;
            angularVelocity = 0;
        }
        if (angle < -maxAngle) {
            angle = -maxAngle;
            angularVelocity = 0;
        }

        // Update cursor position and rotation
        cursor.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;

        requestAnimationFrame(animate);
    }

    // Always follow the mouse
    document.addEventListener('mousemove', e => {
        cursor.style.position = 'absolute';
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    animate();
});

// --- Second Player Cursor: Sporadic Wild Animation ---
// Wait for SOURCES to be loaded before setting image
document.addEventListener('sourcesLoaded', () => {
    const cursor2 = document.getElementById('wii-cursor-2');
    if (!cursor2) {
        console.error('`wii-cursor-2` element not found');
        return;
    }
    cursor2.src = window.SOURCES.wii_cursor_2;

    // State
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let vx = 0, vy = 0;
    let angle = 0;
    let angularVelocity = 0;

    let lastMouseX = x;
    let lastMouseY = y;

    // Track mouse movement
    document.addEventListener('mousemove', e => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    function animate() {
        if (!handEnabled) {
            cursor2.style.display = 'none';
            requestAnimationFrame(animate);
            return;
        } else {
            cursor2.style.display = '';
        }

        // Random "jerk" force
        vx += (Math.random() - 0.5) * 2.5;
        vy += (Math.random() - 0.5) * 2.5;

        // Attraction to mouse, but not too strong
        vx += (lastMouseX - x) * 0.0005;
        vy += (lastMouseY - y) * 0.0005;

        // Occasional wild burst
        if (Math.random() < 0.02) {
            vx += (Math.random() - 0.5) * 40;
            vy += (Math.random() - 0.5) * 40;
        }

        // Damping
        vx *= 0.89;
        vy *= 0.89;

        // Move
        x += vx;
        y += vy;

        // Bounce off edges
        if (x < 0) { x = 0; vx = -vx * 0.7; }
        if (y < 0) { y = 0; vy = -vy * 0.7; }
        if (x > window.innerWidth) { x = window.innerWidth; vx = -vx * 0.7; }
        if (y > window.innerHeight) { y = window.innerHeight; vy = -vy * 0.7; }

        // Angle based on velocity for extra chaos
        angularVelocity += (Math.random() - 0.5) * 0.2 + (vx + vy) * 0.002;
        angularVelocity *= 0.92;
        angle += angularVelocity;

        // Update cursor2 position and rotation
        cursor2.style.left = `${x - 24}px`;
        cursor2.style.top = `${y - 24}px`;
        cursor2.style.transform = `rotate(${angle}rad)`;

        requestAnimationFrame(animate);
    }
    animate();
});

let STATIC_PLACEHOLDER = "media/Static.gif"; // fallback
const CHANNEL_OPEN_SOUND = window.SOURCES?.channel_open || "media/Click Channel.mp3";
const CHANNEL_CLOSE_SOUND = window.SOURCES?.channel_close || "media/Return.mp3";

// Example Wii font, adjust as needed in your CSS
const WII_FONT = "'Press Start 2P', 'Calibri', sans-serif";

let CHANNELS = [];

function loadChannels(callback) {
    fetch('Channels.json')
        .then(res => res.json())
        .then(data => {
            CHANNELS = data;
            if (typeof callback === 'function') callback();
        })
        .catch(() => {
            CHANNELS = [];
            if (typeof callback === 'function') callback();
        });
}

function renderChannels() {
    const container = document.getElementById('channels-container');
    container.innerHTML = '';
    const sections = ["3D Modeling", "Misc", "Engineering"];
    sections.forEach(section => {
        // Section wrapper (vertical column)
        const sectionWrapper = document.createElement('div');
        sectionWrapper.className = 'wii-section-wrapper';

        // Section label
        const sectionBar = document.createElement('div');
        sectionBar.className = 'wii-section-bar';
        sectionBar.textContent = section;
        sectionWrapper.appendChild(sectionBar);

        // Channels row
        const row = document.createElement('div');
        row.className = 'wii-channels-row';
        const channels = CHANNELS.filter(c => c.section === section);

        // Always use Sources.json for static_placeholder
        const staticImg = window.SOURCES.static_placeholder;

        let items = [];
        if (channels.length === 0) {
            for (let i = 0; i < 15; i++) {
                items.push({
                    icon: staticImg,
                    html: null,
                    isPlaceholder: true
                });
            }
        } else {
            items = channels.slice(0, 15).map(c => ({
                ...c,
                icon: window.SOURCES[c.iconKey] || staticImg,
                isPlaceholder: false
            }));
            for (let i = items.length; i < 15; i++) {
                items.push({
                    icon: staticImg,
                    html: null,
                    isPlaceholder: true
                });
            }
        }

        items.forEach(channel => {
            const chanDiv = document.createElement('div');
            chanDiv.className = 'wii-channel';
            chanDiv.style.position = "relative";

            // Thumbnail
            const img = document.createElement('img');
            img.src = channel.icon;
            img.alt = channel.isPlaceholder ? "Static" : channel.title;
            img.style.top = "0";
            img.style.left = "0";
            img.style.width = "170%";
            img.style.height = "170%";
            img.style.objectFit = "cover";
            img.style.borderRadius = "18px";
            img.style.zIndex = "1";
            chanDiv.appendChild(img);

            chanDiv.onclick = () => openProject(channel);

            // Caption inside channel, bottom right
            if (!channel.isPlaceholder) {
                const caption = document.createElement('span');
                caption.textContent = channel.title;
                caption.className = 'wii-channel-caption';
                chanDiv.appendChild(caption);
            }

            row.appendChild(chanDiv);
        });

        sectionWrapper.appendChild(row);
        container.appendChild(sectionWrapper);
    });
}

// Load channels and render after sources are loaded
document.addEventListener('sourcesLoaded', () => {
    loadChannels(renderChannels);
});

function openProject(channel) {
    // Remove channel open sound

    // Show filter
    document.getElementById('modal-bg-filter').style.display = 'block';
    // Show modal
    const modal = document.getElementById('win95-project-modal');
    modal.style.display = 'flex';
    document.getElementById('win95-modal-title').textContent = channel.title;
    // Use the same icon for all project windows
    document.getElementById('win95-modal-icon').src = window.SOURCES.windows_icon;
    // Load HTML content
    fetch(channel.html)
        .then(res => res.text())
        .then(html => {
            document.getElementById('win95-modal-content').innerHTML = html;
        })
        .catch(() => {
            document.getElementById('win95-modal-content').innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <img src="${window.SOURCES.static_placeholder}" alt="Unavailable" style="width:96px;height:96px;margin-bottom:1em;">
                    <p>Project unavailable.</p>
                </div>
            `;
        });
}
function closeProjectModal() {
    // Play channel close sound from Sources.json
    const audio = new Audio(window.SOURCES.channel_close);
    audio.volume = 0.7;
    audio.play();

    document.getElementById('win95-project-modal').style.display = 'none';
    document.getElementById('modal-bg-filter').style.display = 'none';
}

// Hand cursor toggle logic
let handEnabled = getCookie('wiiHandEnabled') !== '0'; // default true

document.addEventListener('sourcesLoaded', () => {
    const cursor2 = document.getElementById('wii-cursor-2');
    if (!cursor2) {
        console.error('`wii-cursor-2` element not found');
        return;
    }
    cursor2.src = window.SOURCES.wii_cursor_2;

    // State
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let vx = 0, vy = 0;
    let angle = 0;
    let angularVelocity = 0;

    let lastMouseX = x;
    let lastMouseY = y;

    // Track mouse movement
    document.addEventListener('mousemove', e => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    function animate() {
        if (!handEnabled) {
            cursor2.style.display = 'none';
            requestAnimationFrame(animate);
            return;
        } else {
            cursor2.style.display = '';
        }

        // Random "jerk" force
        vx += (Math.random() - 0.5) * 2.5;
        vy += (Math.random() - 0.5) * 2.5;

        // Attraction to mouse, but not too strong
        vx += (lastMouseX - x) * 0.0005;
        vy += (lastMouseY - y) * 0.0005;

        // Occasional wild burst
        if (Math.random() < 0.02) {
            vx += (Math.random() - 0.5) * 40;
            vy += (Math.random() - 0.5) * 40;
        }

        // Damping
        vx *= 0.89;
        vy *= 0.89;

        // Move
        x += vx;
        y += vy;

        // Bounce off edges
        if (x < 0) { x = 0; vx = -vx * 0.7; }
        if (y < 0) { y = 0; vy = -vy * 0.7; }
        if (x > window.innerWidth) { x = window.innerWidth; vx = -vx * 0.7; }
        if (y > window.innerHeight) { y = window.innerHeight; vy = -vy * 0.7; }

        // Angle based on velocity for extra chaos
        angularVelocity += (Math.random() - 0.5) * 0.2 + (vx + vy) * 0.002;
        angularVelocity *= 0.92;
        angle += angularVelocity;

        // Update cursor2 position and rotation
        cursor2.style.left = `${x - 24}px`;
        cursor2.style.top = `${y - 24}px`;
        cursor2.style.transform = `rotate(${angle}rad)`;

        requestAnimationFrame(animate);
    }
    animate();
});

// Hand toggle button logic
document.addEventListener('DOMContentLoaded', () => {
    const handBtn = document.getElementById('wii-hand-toggle');
    const handBtnEmoji = document.getElementById('wii-hand-toggle-emoji');
    function updateHandBtn() {
        if (handBtnEmoji) {
            handBtnEmoji.style.opacity = handEnabled ? '1' : '0.3';
        }
    }
    updateHandBtn();
    if (!handBtn) return;
    handBtn.onclick = function() {
        handEnabled = !handEnabled;
        setCookie('wiiHandEnabled', handEnabled ? '1' : '0', 365);
        updateHandBtn();
    };
});

// Menu sections horizontal scroll
document.addEventListener('DOMContentLoaded', function() {
    const menuSections = document.querySelector('.wii-menu-sections');
    if (menuSections) {
        menuSections.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                menuSections.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }
});