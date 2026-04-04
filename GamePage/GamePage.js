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
    
    const BULLET_SPEED = 14; 
    const BALL_SPEED = 3;
    const SPAWN_INTERVAL = 1500; 

    // Player local position tracking
    let playerX = window.innerWidth / 2;
    const playerY = window.innerHeight - 60;

    // 1. Movement: Smooth follow
    document.addEventListener('mousemove', (e) => {
        playerX = e.clientX;
        player.style.left = `${playerX}px`;
    });

    // 2. Shooting
    document.addEventListener('mousedown', () => {
        createBullet();
    });

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
    setInterval(createBall, SPAWN_INTERVAL);

    function gameLoop() {
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
            ball.y += BALL_SPEED;
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

                    updateScore(100);
                    ballRemoved = true;
                    break; 
                }
            }

            if (ballRemoved) continue;

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
        
        const parent = scoreVal.parentElement;
        parent.classList.remove('pulse');
        void parent.offsetWidth; 
        parent.classList.add('pulse');
    }

    requestAnimationFrame(gameLoop);
    console.log('Stellar Dash - Falling balls logic active!');
});
