// Color palette for balloons
const colors = ['#FF4444', '#4444FF', '#44FF44', '#FFFF44', '#FF44FF', '#FF8844'];

// Limit how many floating balloons at once (adjusted per screen size)
let MAX_BALLOONS = 10;
let SPAWN_INTERVAL = 1400;
if (window.innerWidth <= 480) {
    MAX_BALLOONS = 4;
    SPAWN_INTERVAL = 2000;
} else if (window.innerWidth <= 768) {
    MAX_BALLOONS = 6;
    SPAWN_INTERVAL = 1600;
}

// Update balloon counts when window resizes (handles orientation changes)
window.addEventListener('resize', () => {
    if (window.innerWidth <= 480) {
        MAX_BALLOONS = 4;
        SPAWN_INTERVAL = 2000;
    } else if (window.innerWidth <= 768) {
        MAX_BALLOONS = 6;
        SPAWN_INTERVAL = 1600;
    } else {
        MAX_BALLOONS = 10;
        SPAWN_INTERVAL = 1400;
    }
});

function createBalloon() {
    const container = document.getElementById('balloonsContainer');
    if (!container) return;

    // Avoid too many on screen
    if (container.children.length >= MAX_BALLOONS) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    const color = colors[Math.floor(Math.random() * colors.length)];

    // Create bulb
    const bulb = document.createElement('div');
    bulb.className = 'balloon-bulb';
    bulb.style.backgroundColor = color;
    bulb.style.position = 'relative';
    bulb.style.borderRadius = '50% 50% 55% 55%';

    // Add visual overlays
    const gloss = document.createElement('div');
    gloss.className = 'gloss';
    const edge = document.createElement('div');
    edge.className = 'edge';
    bulb.appendChild(gloss);
    bulb.appendChild(edge);

    // (knot removed per user request)

    // Wavy string as SVG so it never draws inside the bulb
    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 150');
    svg.setAttribute('xmlns', svgns);
    const path = document.createElementNS(svgns, 'path');
    // A gentle wavy path (fits the SVG viewBox)
    path.setAttribute('d', 'M12 0 C 6 40, 18 80, 12 120 C 6 140, 18 150, 12 150');
    path.setAttribute('stroke', '#222');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);

    // Build balloon DOM
    balloon.appendChild(bulb);
    balloon.appendChild(svg);

    // Random horizontal position (avoid placing too close to the very edges)
    // On phones avoid spawning balloons in the center so text stays clean
    let randomLeft;
    if (window.innerWidth <= 480) {
        // pick left or right side randomly
        if (Math.random() < 0.5) randomLeft = 5 + Math.random() * 20; // left 5-25%
        else randomLeft = 75 + Math.random() * 20; // right 75-95%
    } else {
        randomLeft = 5 + Math.random() * 90; // 5% - 95%
    }
    balloon.style.left = randomLeft + '%';

    // Random animation duration for floating up
    const duration = 8 + Math.random() * 6;
    balloon.style.animation = `balloonFly ${duration}s linear, sway ${3 + Math.random() * 2}s ease-in-out infinite`;
    balloon.style.transform = `rotate(${Math.random() * 12 - 6}deg)`;

    container.appendChild(balloon);

    // remove after animation
    setTimeout(() => {
        balloon.remove();
    }, duration * 1000);
}

// Spawn fewer balloons than before (interval depends on screen size)
setInterval(createBalloon, SPAWN_INTERVAL);

// initial small batch (smaller on phones)
const initialBatch = MAX_BALLOONS > 8 ? 4 : (MAX_BALLOONS > 5 ? 3 : 2);
for (let i = 0; i < initialBatch; i++) {
    setTimeout(createBalloon, i * (SPAWN_INTERVAL / 5));
}

// Click / touch create small bursts
document.addEventListener('click', function() {
    for (let i = 0; i < 2; i++) {
        setTimeout(createBalloon, i * 180);
    }
});

document.addEventListener('touchstart', function(e) {
    if (e.touches && e.touches.length) {
        for (let i = 0; i < 2; i++) setTimeout(createBalloon, i * 180);
    }
});

// occasional sparkle effect (kept simple)
document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.985) {
        const container = document.getElementById('balloonsContainer');
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = (e.clientX + (Math.random() - 0.5) * 80) + 'px';
        sparkle.style.top = (e.clientY + (Math.random() - 0.5) * 80) + 'px';
        sparkle.style.width = '8px';
        sparkle.style.height = '8px';
        sparkle.style.borderRadius = '50%';
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.pointerEvents = 'none';
        sparkle.style.opacity = '0.9';
        sparkle.style.animation = 'fadeOut 900ms ease-out forwards';
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 900);
    }
});

// Confetti sparkle effect on page load
function createConfettiBurst() {
    const textElement = document.querySelector('.birthday-text');
    if (!textElement) return;

    const rect = textElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const confettiCount = 60;
    const colors = ['#FF4444', '#4444FF', '#44FF44', '#FFFF44', '#FF44FF', '#FF8844'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = centerX + 'px';
        confetti.style.top = centerY + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Radial burst in all directions
        const angle = (Math.PI * 2 * i) / confettiCount;
        const distance = 200 + Math.random() * 150; // 200-350px distance
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        confetti.style.setProperty('--tx', tx + 'px');
        confetti.style.setProperty('--ty', ty + 'px');
        confetti.style.animation = 'confettiBurst 1.8s ease-out forwards';

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 1800);
    }
}

// Trigger confetti on page load
window.addEventListener('load', createConfettiBurst);

// fadeOut keyframes used by sparkles
const style = document.createElement('style');
style.textContent = `
@keyframes fadeOut { 0% { opacity:1; transform: translateY(0) scale(1);} 100% { opacity:0; transform: translateY(-20px) scale(0.5);} }
`;
document.head.appendChild(style);
