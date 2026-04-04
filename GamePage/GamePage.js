/**
 * Stellar Dash: Full Page Game Controller
 * Features: Player movement and bullet shooting.
 */

document.addEventListener('DOMContentLoaded', () => {
    const gameSurface = document.getElementById('game-surface');
    const player = document.getElementById('player');
    const scoreVal = document.getElementById('score-value');
    
    let currentScore = 0;
    let bullets = [];
    let balls = [];
    let isGameOver = false;
    let isPaused = false;
    let spawnTimer;
    
    const BULLET_SPEED = 14; 
    let currentBallSpeed = 3;
    const SPAWN_INTERVAL = 3000; 
    const PLAYER_SPEED = 8;
    const keys = {};

    // Player local position tracking
    let playerX = window.innerWidth / 2;
    const playerY = window.innerHeight - 60;


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
        
        bullets.push({ element: bulletEl, x: bX, y: bY });
    }

    function createBall() {
        if (isGameOver || isPaused || balls.length > 0) return;
        const ballEl = document.createElement('div');
        ballEl.className = 'target-orb';
        
        const bX = Math.random() * (window.innerWidth - 40);
        const bY = -50; 
        
        ballEl.style.left = `${bX}px`;
        ballEl.style.top = `${bY}px`;
        gameSurface.appendChild(ballEl);
        
        balls.push({ element: ballEl, x: bX, y: bY });
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
            playerX -= PLAYER_SPEED;
            moved = true;
        }
        if (keys['d'] || keys['D'] || keys['ArrowRight']) {
            playerX += PLAYER_SPEED;
            moved = true;
        }

        if (moved) {
            // Keep on screen
            playerX = Math.max(40, Math.min(window.innerWidth - 40, playerX));
            player.style.left = `${playerX}px`;
        }

        // 1. Move bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.y -= BULLET_SPEED;
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
                
                if (bullet.x > ball.x && bullet.x < ball.x + 40 &&
                    bullet.y > ball.y && bullet.y < ball.y + 40) {
                    
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
            const playerHit = (
                ball.x + 40 > playerX - 36 &&
                ball.x < playerX + 36 &&
                ball.y + 40 > playerY - 36 &&
                ball.y < playerY + 36
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
        
        // Difficulty increase: Speed up every 20 points
        if (currentScore > 0 && currentScore % 20 === 0) {
            currentBallSpeed += 1; // Increase speed by 1 unit
        }

        const parent = scoreVal.parentElement;
        parent.classList.remove('pulse');
        void parent.offsetWidth; 
        parent.classList.add('pulse');
    }

    function endGame() {
        isGameOver = true;
        clearInterval(spawnTimer);
        
        const gameOverScreen = document.getElementById('game-over');
        const finalScoreEl = document.getElementById('final-score');
        
        finalScoreEl.textContent = currentScore;
        gameOverScreen.classList.remove('d-none');
    }

    requestAnimationFrame(gameLoop);
    console.log('Stellar Dash - Game logic active with Game Over condition!');
});
