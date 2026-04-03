/* ============================================================
   GALAXY DEFENDER — Part 1: Start Screen Logic
   ============================================================ */

// ===== Function to get DOM elements =====
function getElement(id) {
    return document.getElementById(id);
}

// DOM References
const startScreen = getElement('startScreen');
const startBtn = getElement('startBtn');
const gameArea = getElement('gameArea');

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
    setupEvents();
}

// Run on page load
init();
