/**
 * Shooter: Full Page Game Controller
 * Features: Player movement and bullet shooting.
 */

document.addEventListener('DOMContentLoaded', () => {
    const gameSurface = document.getElementById('game-surface');
    const player = document.getElementById('player');
    const scoreVal = document.getElementById('score-value');
    const playerDisplayName = document.getElementById('player-display-name');
    
    // Get Player Name from session storage
    const currentName = sessionStorage.getItem('currentPlayerName') || 'Elite Pilot';
    if (playerDisplayName) playerDisplayName.textContent = currentName;

    let currentScore = 0;
    let bullets = [];
    let balls = [];
    let isGameOver = false;
    let isPaused = false;
    let spawnTimer;
    
    let currentBulletSpeed = 14; 
    let currentBallSpeed = 3;
    const SPAWN_INTERVAL = 3000; 
    let currentPlayerSpeed = 8;
    const keys = {};

    // Player local position tracking
    let playerX = window.innerWidth / 2;
    let playerY = window.innerHeight - 60;

    function updateViewDimensions() {
        const isMobile = window.innerWidth < 576;
        playerY = window.innerHeight - (isMobile ? 50 : 60);
        player.style.bottom = (isMobile ? 50 : 60) + 'px';
        
        // Keep player in bounds after resize
        const boundary = isMobile ? 30 : 40;
        playerX = Math.max(boundary, Math.min(window.innerWidth - boundary, playerX));
        player.style.left = `${playerX}px`;
    }

    window.addEventListener('resize', updateViewDimensions);
    updateViewDimensions();


    // 3. Control Handling (ESC: Pause, SPACE: Shoot, A/D/Arrows: Move)
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === 'Escape' && !isGameOver) {
            togglePause();
        }
        if (e.key === ' ' && !isGameOver && !isPaused) {
            createBullet();
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // 3.1 Mobile/Touch Controls
    let isTouching = false;
    gameSurface.addEventListener('touchstart', (e) => {
        if (isGameOver || isPaused) return;
        isTouching = true;
        handleTouch(e);
        // Start auto-shooting on touch
        startAutoShoot();
    }, { passive: false });

    gameSurface.addEventListener('touchmove', (e) => {
        if (isGameOver || isPaused) return;
        handleTouch(e);
        e.preventDefault(); // Prevent scrolling while playing
    }, { passive: false });

    gameSurface.addEventListener('touchend', () => {
        isTouching = false;
        stopAutoShoot();
    });

    function handleTouch(e) {
        const touch = e.touches[0];
        playerX = touch.clientX;
        playerX = Math.max(30, Math.min(window.innerWidth - 30, playerX));
        player.style.left = `${playerX}px`;
    }

    let autoShootInterval;
    function startAutoShoot() {
        if (autoShootInterval) return;
        createBullet(); // Shoot immediately
        autoShootInterval = setInterval(() => {
            if (!isGameOver && !isPaused && isTouching) {
                createBullet();
            }
        }, 350); // Slightly slower than manual tap but consistent
    }

    function stopAutoShoot() {
        clearInterval(autoShootInterval);
        autoShootInterval = null;
    }

    function togglePause() {
        isPaused = !isPaused;
        const pauseScreen = document.getElementById('pause-screen');
        if (isPaused) {
            pauseScreen.classList.remove('d-none');
            clearInterval(spawnTimer);
        } else {
            pauseScreen.classList.add('d-none');
            spawnTimer = setInterval(createBall, SPAWN_INTERVAL);
        }
    }
    // Expose for HTML button
    window.togglePause = togglePause;

    function createBullet() {
        const bulletEl = document.createElement('div');
        bulletEl.className = 'bullet';
        
        const bX = playerX - 3;
        const bY = playerY - 72;
        
        bulletEl.style.left = `${bX}px`;
        bulletEl.style.top = `${bY}px`;
        gameSurface.appendChild(bulletEl);
        
        bullets.push({ 
            element: bulletEl, 
            x: bX, 
            y: bY,
            width: 6,
            height: 18 
        });
    }

    const BALL_COLORS = [
        { color: '#ff004c', glow: 'rgba(255, 0, 76, 0.6)' }, // Rose
        { color: '#00f2ff', glow: 'rgba(0, 242, 255, 0.6)' }, // Cyan
        { color: '#aaff00', glow: 'rgba(170, 255, 0, 0.6)' }, // Lime
        { color: '#bc13fe', glow: 'rgba(188, 19, 254, 0.6)' }, // Purple
        { color: '#ff6b00', glow: 'rgba(255, 107, 0, 0.6)' }, // Orange
        { color: '#009dff', glow: 'rgba(0, 157, 255, 0.6)' }  // Sky Blue
    ];

    function createBall() {
        if (isGameOver || isPaused || balls.length > 0) return;
        const ballEl = document.createElement('div');
        ballEl.className = 'target-orb';
        
        // Random Color Selection
        const randomColorObj = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
        ballEl.style.backgroundColor = randomColorObj.color;
        ballEl.style.boxShadow = `0 0 30px ${randomColorObj.glow}`;
        
        const ballSize = window.innerWidth < 576 ? 30 : 40;
        const bX = Math.random() * (window.innerWidth - ballSize);
        const bY = -50; 
        
        ballEl.style.left = `${bX}px`;
        ballEl.style.top = `${bY}px`;
        gameSurface.appendChild(ballEl);
        
        balls.push({ element: ballEl, x: bX, y: bY, size: ballSize });
    }

    // Spawn balls at interval
    spawnTimer = setInterval(createBall, SPAWN_INTERVAL);

    function gameLoop() {
        if (isGameOver || isPaused) {
            if (!isGameOver) requestAnimationFrame(gameLoop);
            return;
        }

        // 0. Move Player (Keyboard)
        let moved = false;
        if (keys['a'] || keys['A'] || keys['ArrowLeft']) {
            playerX -= currentPlayerSpeed;
            moved = true;
        }
        if (keys['d'] || keys['D'] || keys['ArrowRight']) {
            playerX += currentPlayerSpeed;
            moved = true;
        }

        if (moved) {
            // Keep on screen
            const boundary = window.innerWidth < 576 ? 30 : 40;
            playerX = Math.max(boundary, Math.min(window.innerWidth - boundary, playerX));
            player.style.left = `${playerX}px`;
        }

        // 1. Move bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.y -= currentBulletSpeed;
            b.element.style.top = `${b.y}px`;
            
            if (b.y < -50) {
                gameSurface.removeChild(b.element);
                bullets.splice(i, 1);
            }
        }

        // 2. Move balls and Check Collisions
        for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[i];
            ball.y += currentBallSpeed;
            ball.element.style.top = `${ball.y}px`;

            let ballRemoved = false;

            // Hit collision logic
            for (let j = bullets.length - 1; j >= 0; j--) {
                const bullet = bullets[j];
                
                if (bullet.x > ball.x && bullet.x < ball.x + ball.size &&
                    bullet.y > ball.y && bullet.y < ball.y + ball.size) {
                    
                    gameSurface.removeChild(ball.element);
                    balls.splice(i, 1);

                    gameSurface.removeChild(bullet.element);
                    bullets.splice(j, 1);

                    updateScore(1);
                    ballRemoved = true;
                    break; 
                }
            }

            if (ballRemoved) continue;

            // Check if ball hits the shooter OR passes the player (GAME OVER)
            const playerPadding = window.innerWidth < 576 ? 26 : 36;
            const playerHit = (
                ball.x + ball.size > playerX - playerPadding &&
                ball.x < playerX + playerPadding &&
                ball.y + ball.size > playerY - playerPadding &&
                ball.y < playerY + playerPadding
            );

            if (playerHit || ball.y >= playerY + 50) {
                endGame();
                break;
            }

            if (ball.y > window.innerHeight + 50) {
                gameSurface.removeChild(ball.element);
                balls.splice(i, 1);
            }
        }
        
        requestAnimationFrame(gameLoop);
    }

    function updateScore(points) {
        currentScore += points;
        scoreVal.textContent = currentScore;
        
        // Difficulty increase: Speed up everything every 15 points
        if (currentScore > 0 && currentScore % 15 === 0) {
            currentBallSpeed += 1;   // Increase ball drop speed
            currentPlayerSpeed += 1; // Increase shooter movement speed
            currentBulletSpeed += 2; // Increase bullet flight speed
        }

        const parent = scoreVal.parentElement;
        parent.classList.remove('pulse');
        void parent.offsetWidth; 
        parent.classList.add('pulse');
    }

    function saveHighScore(score) {
        let highScores = JSON.parse(localStorage.getItem('shooter_high_scores')) || [];
        
        // Find if user already has a score
        const existingIndex = highScores.findIndex(entry => entry.name.toLowerCase() === currentName.toLowerCase());
        
        if (existingIndex !== -1) {
            // Update only if the new score is higher
            if (score > highScores[existingIndex].score) {
                highScores[existingIndex].score = score;
                highScores[existingIndex].date = new Date().toLocaleDateString();
            }
        } else {
            // Add new user
            highScores.push({
                name: currentName,
                score: score,
                date: new Date().toLocaleDateString()
            });
        }
        
        // Sort by score descending
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep top 5
        const topScores = highScores.slice(0, 5);
        localStorage.setItem('shooter_high_scores', JSON.stringify(topScores));
    }

    function displayLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        const highScores = JSON.parse(localStorage.getItem('shooter_high_scores')) || [];
        
        leaderboardList.innerHTML = '';
        
        if (highScores.length === 0) {
            leaderboardList.innerHTML = '<div class="text-center text-muted py-2">No high scores yet!</div>';
            return;
        }

        highScores.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item list-group-item';
            item.innerHTML = `
                <div class="leaderboard-name-container d-flex flex-column">
                    <div class="d-flex align-items-center">
                        <span class="leaderboard-rank">#${index + 1}</span>
                        <span class="leaderboard-player-name text-white fw-bold">${entry.name || 'Anonymous'}</span>
                    </div>
                    <span class="leaderboard-date ms-4">${entry.date}</span>
                </div>
                <span class="leaderboard-score flex-shrink-0">${entry.score} pts</span>
            `;
            leaderboardList.appendChild(item);
        });
    }

    function clearHighScores() {
        if (confirm('Are you sure you want to delete all high scores?')) {
            localStorage.removeItem('shooter_high_scores');
            displayLeaderboard();
        }
    }
    // Expose for HTML button
    window.clearHighScores = clearHighScores;

    function endGame() {
        isGameOver = true;
        
        // Stop current animation loops
        bullets.forEach(b => gameSurface.removeChild(b.element));
        balls.forEach(b => gameSurface.removeChild(b.element));
        bullets = [];
        balls = [];
        
        clearInterval(spawnTimer);
        
        const gameOverScreen = document.getElementById('game-over');
        const finalScoreEl = document.getElementById('final-score');
        
        finalScoreEl.textContent = currentScore;
        
        // Save and Show Leaderboard
        saveHighScore(currentScore);
        displayLeaderboard();
        
        gameOverScreen.classList.remove('d-none');
    }
    function restartGame() {
        // Reset variables
        currentScore = 0;
        scoreVal.textContent = '0';
        isGameOver = false;
        isPaused = false;
        bullets = [];
        balls = [];
        
        // Clean game surface
        const allBullets = document.querySelectorAll('.bullet');
        const allBalls = document.querySelectorAll('.target-orb');
        allBullets.forEach(el => el.remove());
        allBalls.forEach(el => el.remove());
        
        // Hide overlays
        document.getElementById('game-over').classList.add('d-none');
        document.getElementById('pause-screen').classList.add('d-none');
        
        // Reset player
        playerX = window.innerWidth / 2;
        updateViewDimensions();
        
        // Restart timers
        clearInterval(spawnTimer);
        spawnTimer = setInterval(createBall, SPAWN_INTERVAL);
        
        // Resume loop
        requestAnimationFrame(gameLoop);
    }
    window.restartGame = restartGame;

    requestAnimationFrame(gameLoop);
    console.log('Shooter - Game logic active with Game Over condition!');
});
