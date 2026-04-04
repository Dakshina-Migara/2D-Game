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
    const BULLET_SPEED = 12; // Pixels per frame

    // Player local position tracking for bullet spawning
    let playerX = window.innerWidth / 2;
    const playerY = window.innerHeight - 60; // Based on CSS bottom: 60px

    // 1. Movement: Smooth follow across the whole screen
    document.addEventListener('mousemove', (e) => {
        playerX = e.clientX;
        player.style.left = `${playerX}px`;
    });

    // 2. Shooting: Spawn a new bullet on click
    document.addEventListener('mousedown', () => {
        createBullet();
        
        // Update score just for visual feedback (can be moved to hitting targets later)
        updateScore(5);
    });

    /**
     * Create a bullet element at the current player position
     */
    function createBullet() {
        const bulletEl = document.createElement('div');
        bulletEl.className = 'bullet';
        
        // Initial Position (relative to the game surface)
        // Adjust X by half-width of bullet (3px) and center on player
        const bX = playerX - 3;
        const bY = playerY - 72; // Start from the top of the player-icon (height 72px)
        
        bulletEl.style.left = `${bX}px`;
        bulletEl.style.top = `${bY}px`;
        
        gameSurface.appendChild(bulletEl);
        
        // Track the bullet data for animation
        bullets.push({
            element: bulletEl,
            y: bY
        });
    }

    /**
     * Main Game Loop for animating moving parts
     */
    function gameLoop() {
        // Move and clean up bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.y -= BULLET_SPEED; // Move UP
            
            // Update DOM element
            b.element.style.top = `${b.y}px`;
            
            // Remove if off screen
            if (b.y < -50) {
                gameSurface.removeChild(b.element);
                bullets.splice(i, 1);
            }
        }
        
        requestAnimationFrame(gameLoop);
    }

    /**
     * Update score and trigger pulse effect
     */
    function updateScore(points) {
        currentScore += points;
        scoreVal.textContent = currentScore;
        
        const parent = scoreVal.parentElement;
        parent.classList.remove('pulse');
        void parent.offsetWidth; // Reflow
        parent.classList.add('pulse');
    }

    // Start the game animation loop
    requestAnimationFrame(gameLoop);
    
    console.log('Stellar Dash - Bullet system ready. Click to Fire!');
});
