/* ============================================================
   GALAXY DEFENDER — Part 1: Start Screen Logic
   ============================================================ */

// ===== Function to get DOM elements =====
function getElement(id) {
    return document.getElementById(id);
}

// DOM References
const bgCanvas = getElement('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
const startScreen = getElement('startScreen');
const startBtn = getElement('startBtn');
const gameArea = getElement('gameArea');

// ===== Function to resize canvas =====
function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== STARFIELD — animated stars behind start screen =====
const stars = [];
const STAR_COUNT = 120;

// Function to create one star
function createStar() {
    return {
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.6 + 0.3
    };
}

// Function to fill the stars array
function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(createStar());
    }
}

// Function to update each star position
function updateStars() {
    for (let i = 0; i < stars.length; i++) {
        stars[i].y += stars[i].speed;
        if (stars[i].y > bgCanvas.height) {
            stars[i].y = 0;
            stars[i].x = Math.random() * bgCanvas.width;
        }
    }
}

// Function to draw all stars
function drawStars() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgCtx.fillStyle = '#050a18';
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    for (let i = 0; i < stars.length; i++) {
        bgCtx.beginPath();
        bgCtx.arc(stars[i].x, stars[i].y, stars[i].size, 0, Math.PI * 2);
        bgCtx.fillStyle = 'rgba(200, 230, 255, ' + stars[i].opacity + ')';
        bgCtx.fill();
    }
}

// Function to animate the background loop
function animateBackground() {
    updateStars();
    drawStars();
    requestAnimationFrame(animateBackground);
}

// ===== Function to start the game =====
function startGame() {
    // Hide start screen, show game area
    startScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');
}

// ===== Function to attach event listeners =====
function setupEvents() {
    startBtn.addEventListener('click', startGame);
}

// ===== Initialize everything =====
function init() {
    initStars();
    setupEvents();
    animateBackground();
}

// Run on page load
init();
