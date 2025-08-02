// 1. Add your photos and captions here.
const photoList = [
    { key: "photo_breakfast", caption: "Breakfast" },
    { key: "photo_caprisun", caption: "Caprisun" },
    { key: "photo_c_and_c", caption: "C&C.webp" },
    { key: "photo_desparation", caption: "Desparation" },
    { key: "photo_eclipse", caption: "Eclipse" },
    { key: "photo_joint_fix", caption: "Joint Fix" },
    { key: "photo_laptop_repair", caption: "Laptop Repair" },
    { key: "photo_lovely_cake", caption: "Lovely Cake" },
    { key: "photo_my_pc", caption: "My PC" },
    { key: "photo_ocean", caption: "Ocean" },
    { key: "photo_painting", caption: "Painting" },
    { key: "photo_pinout", caption: "Pinout" },
    { key: "photo_pixel_art", caption: "Pixel Art" }
];

// 2. Shuffle the array for random order
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// 3. Render the mosaic as draggable polaroids and use native scrolling
function renderPhotoMosaic() {
    const mosaic = document.querySelector('#photos-window .win95-window95-content');
    if (!mosaic) return;
    mosaic.innerHTML = '';
    const photos = [...photoList];
    shuffleArray(photos);

    // Wait for SOURCES to be loaded
    if (!window.SOURCES) {
        document.addEventListener('sourcesLoaded', renderPhotoMosaic, { once: true });
        return;
    }

    // Grid layout: 3 columns, centered
    const cols = 3;
    const winW = 220, winH = 260, gap = 32;
    const total = photos.length;
    const rows = Math.ceil(total / cols);

    // Calculate horizontal centering
    const mosaicWidth = mosaic.clientWidth || 900;
    const gridWidth = cols * winW + (cols - 1) * gap;
    const startX = Math.max(0, (mosaicWidth - gridWidth) / 2);

    // Set up corkboard background and sizing
    mosaic.style.position = 'relative';
    mosaic.style.height = (rows * winH + (rows - 1) * gap + 40) + 'px';
    mosaic.style.minHeight = '800px';
    mosaic.style.overflowY = 'auto';

    photos.forEach((photo, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const win = document.createElement('div');
        win.className = 'polaroid';

        // Make the scatter more pronounced but still in the grid area
        const scatterX = (Math.random() - 0.5) * 240; // -30px to +30px
        const scatterY = (Math.random() - 0.5) * 240; // -30px to +30px

        const left = startX + col * (winW + gap) + scatterX;
        const top = row * (winH + gap) + scatterY;
        win.style.left = left + 'px';
        win.style.top = top + 'px';
        win.style.width = winW + 'px';
        win.style.height = winH + 'px';
        win.style.transform = `rotate(${(Math.random() - 0.5) * 16}deg)`;

        // Use SOURCES to get the image URL
        const imgUrl = window.SOURCES[photo.key] || "";
        win.innerHTML = `
            <div class="polaroid-photo">
                <img src="${imgUrl}" alt="Photo" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
            </div>
            <div class="polaroid-caption">${photo.caption}</div>
        `;
        mosaic.appendChild(win);
    });

    makePhotoWindowsDraggable();
}

// 4. Make polaroids draggable from anywhere on the polaroid
function makePhotoWindowsDraggable() {
    const mosaic = document.querySelector('#photos-window .win95-window95-content');
    const mosaicWidth = mosaic.clientWidth;
    const mosaicHeight = mosaic.scrollHeight;

    const windows = document.querySelectorAll('.polaroid');
    windows.forEach(win => {
        let startX = 0, startY = 0, origLeft = 0, origTop = 0, dragging = false;
        let lastX = 0, lastTime = 0;

        // --- Retro sound helpers ---
        function playJumpSound() {
            if (!window.AudioContext) return;
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.13);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.14);
            osc.onended = () => ctx.close();
        }
        function playDropSound() {
            if (!window.AudioContext) return;
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(660, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.13);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.14);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
            osc.onended = () => ctx.close();
        }

        win.onmousedown = function(e) {
            if (e.button !== 0) return;
            e.preventDefault();
            dragging = true;
            win.style.zIndex = Date.now();
            startX = e.clientX;
            startY = e.clientY;
            origLeft = parseInt(win.style.left, 10) || 0;
            origTop = parseInt(win.style.top, 10) || 0;
            lastX = startX;
            lastTime = Date.now();
            playJumpSound();

            function onMouseMove(ev) {
                if (!dragging) return;
                let dx = ev.clientX - startX;
                let dy = ev.clientY - startY;
                let newLeft = origLeft + dx;
                let newTop = origTop + dy;

                // Clamp to the mosaic area
                const winW = win.offsetWidth, winH = win.offsetHeight;
                const minLeft = 0;
                const maxLeft = mosaic.clientWidth - winW;
                const minTop = 0;
                const maxTop = mosaic.scrollHeight - winH;

                win.style.left = Math.max(minLeft, Math.min(newLeft, maxLeft)) + "px";
                win.style.top = Math.max(minTop, Math.min(newTop, maxTop)) + "px";

                // Calculate velocity for rotation
                const now = Date.now();
                const dt = now - lastTime || 1;
                const vx = (ev.clientX - lastX) / dt; // px/ms
                // Angle is proportional to velocity, capped
                let rot = Math.max(-18, Math.min(18, vx * 180));
                win.style.transform = `rotate(${rot}deg)`;

                lastX = ev.clientX;
                lastTime = now;
            }
            function onMouseUp() {
                dragging = false;
                playDropSound();
                // Snap to a small random rotation for realism
                win.style.transform = `rotate(${(Math.random() - 0.5) * 8}deg)`;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
    });
}

// Render on load
window.addEventListener('DOMContentLoaded', renderPhotoMosaic);