document.addEventListener('DOMContentLoaded', function() {
    const fenceImg = document.querySelector('.fence-img');
    const zzImg = document.querySelector('.zz-img');
    if (!fenceImg || !zzImg) return;

    let loaded = 0;
    function tryStartInterval() {
        if (loaded === 2) {
            let showFence = true;
            setInterval(() => {
                fenceImg.style.display = showFence ? 'block' : 'none';
                zzImg.style.display = showFence ? 'none' : 'block';
                showFence = !showFence;
            }, 1000);
        }
    }

    fenceImg.addEventListener('load', () => { loaded++; tryStartInterval(); });
    zzImg.addEventListener('load', () => { loaded++; tryStartInterval(); });

    // If already cached
    if (fenceImg.complete) { loaded++; }
    if (zzImg.complete) { loaded++; }
    tryStartInterval();
});