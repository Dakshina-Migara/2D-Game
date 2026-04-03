/* ============================================================
   GALAXY DEFENDER & PROJECT UTILITIES
   Unified Professional Logic Structure
   ============================================================ */

// ===== DOM UTILITY FUNCTIONS =====

/**
 * Shorthand for document.getElementById
 * @param {string} id 
 * @returns {HTMLElement | null}
 */
function getElem(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`[DOM Search] Element with id '${id}' not found.`);
    }
    return el;
}

/**
 * Gets number from an input field
 * @param {string} id 
 * @returns {number}
 */
function getValAsNumber(id) {
    const el = getElem(id);
    return el ? parseFloat(el.value) || 0 : 0;
}

/**
 * Gets string value from an input field
 * @param {string} id 
 * @returns {string}
 */
function getValAsString(id) {
    const el = getElem(id);
    return el ? el.value.trim() : "";
}


// ===== GLOBAL STATE / STORAGE =====

let globalRunningSum = 0;
let dataStoreArray = [];
const randomNumbersList = [];
const TOTAL_RANDOM_COUNT = 50;


// ===== GAME LOGIC: UI FLOW =====

/**
 * Transitions from the start screen to the main game area
 */
function startGame() {
    const startScreen = getElem('startScreen');
    const gameArea = getElem('gameArea');

    if (startScreen && gameArea) {
        startScreen.classList.add('hidden');
        gameArea.classList.remove('hidden');
        console.log("Game started!");
    }
}


// ===== UTILITY LOGIC: CALCULATORS & FORMATTERS =====

/**
 * Calculates sum of two numbers and displays it
 */
function calculateSum() {
    const num1 = getValAsNumber('inputNumber1');
    const num2 = getValAsNumber('inputNumber2');
    const sum = num1 + num2;

    const display = getElem('subtotal1');
    if (display) display.innerText = sum;
}

/**
 * Compares two strings for equality (case-insensitive)
 */
function calculateequal() {
    const str1 = getValAsString('inputNumber3').toLowerCase();
    const str2 = getValAsString('inputNumber4').toLowerCase();
    const display = getElem('subtotal2');

    if (display) {
        display.innerText = (str1 === str2) ? "equal" : "not equal";
    }
}

/**
 * Capitalizes the first letter of every word in a string
 */
function firstCapital() {
    const text = getValAsString('inputNumber5');
    const display = getElem('subtotal3');

    if (!display) return;
    if (text.length === 0) {
        display.innerText = "";
        return;
    }

    const capitalizedText = text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    display.innerText = capitalizedText;
}

/**
 * Adds the last digit of an input to a running total
 */
function enterSum() {
    const rawVal = getValAsString('inputNumber6');
    const lastDigit = Number(rawVal.slice(-1));

    if (!isNaN(lastDigit)) {
        globalRunningSum += lastDigit;
        const display = getElem('subtotal4');
        if (display) display.innerText = globalRunningSum;
    }
}


// ===== UTILITY LOGIC: GRADING & CLASSIFICATION =====

/**
 * Converts a numeric score to a letter grade
 */
function markGrade() {
    const score = getValAsNumber('inputNumber7');
    const display = getElem('subtotal5');

    if (!display) return;

    let grade = "W";
    if (score >= 75) grade = "A";
    else if (score >= 65) grade = "B";
    else if (score >= 55) grade = "C";
    else if (score >= 35) grade = "S";

    display.innerText = grade;
}

/**
 * Maps shortcodes to full job titles
 */
function findWho() {
    const code = getValAsString('inputNumber8').toLowerCase();
    const display = getElem('subtotal6');

    if (!display) return;

    const roleMap = {
        "intern": "Intern Software Engineer",
        "ase": "Associate Software Engineer",
        "se": "Software Engineer",
        "sse": "Senior Software Engineer",
        "tl": "Tech Lead"
    };

    display.innerText = roleMap[code] || "Key word not recognized";
}


// ===== UTILITY LOGIC: DATA & COLLECTIONS =====

/**
 * Pushes input value to the store and clears input
 */
function pushToArray() {
    const val = getValAsString('inputNumber9');
    if (val) {
        dataStoreArray.push(val);
        const input = getElem('inputNumber9');
        if (input) input.value = "";
    }
}

/**
 * Displays the current contents of the store
 */
function showArray() {
    const display = getElem('subtotal7');
    if (display) display.innerText = dataStoreArray.join(', ');
}

/**
 * Generates initial random numbers on load
 */
function initRandomPool() {
    for (let i = 0; i < TOTAL_RANDOM_COUNT; i++) {
        const num = Math.floor(Math.random() * 100) + 1;
        randomNumbersList.push(num);
    }
    const input = getElem('inputNumber10');
    if (input) input.value = randomNumbersList.join(', ');
}

/**
 * Filters the random pool by a divisor
 */
function generateNumbers() {
    const divisor = getValAsNumber('inputNumber11');
    const display = getElem('subtotal8');

    if (!display || divisor === 0) return;

    const filtered = randomNumbersList.filter(num => num % divisor === 0);
    display.innerText = filtered.join(', ');
}


// ===== INITIALIZATION & EVENTS =====

/**
 * Setup event listeners and handle initial load tasks
 */
function init() {
    // 1. Setup Start Screen logic
    const startBtn = getElem('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }

    // 2. Initialize Utility Data
    initRandomPool();

    console.log("System initialized and ready.");
}

// Run on page load
window.addEventListener('DOMContentLoaded', init);
