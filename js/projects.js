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