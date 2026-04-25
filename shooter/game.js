// Space Shooter Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Sound effects
function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    switch(type) {
        case 'shoot':
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
        case 'explosion':
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;
        case 'powerup':
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.setValueAtTime(600, now + 0.1);
            oscillator.frequency.setValueAtTime(800, now + 0.2);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;
        case 'hit':
            oscillator.frequency.setValueAtTime(150, now);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
    }
}

// Game state
const game = {
    score: 0,
    health: 100,
    wave: 1,
    gameOver: false,
    paused: false,
    titleScreen: true,
    keys: {},
    player: {
        x: 375,
        y: 500,
        width: 50,
        height: 50,
        speed: 6,
        color: '#00ff00'
    },
    bullets: [],
    shootCooldown: 0,
    enemies: [],
    explosions: [],
    powerUps: [],
    enemyDirection: 1,
    enemyMoveDown: false,
    enemyMoveTimer: 0,
    enemyMoveRate: 30,
    stars: [],
    boss: null,
    bossActive: false,
    enemyBullets: []
};

// Create star background
for (let i = 0; i < 100; i++) {
    game.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 0.5,
        size: Math.random() * 2
    });
}

// Check collision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Spawn Space Invaders style grid
function spawnEnemyGrid() {
    game.enemies = [];
    const rows = 4;
    const cols = 8;
    const enemyWidth = 40;
    const enemyHeight = 30;
    const spacingX = 80;
    const spacingY = 60;
    const startX = 100;
    const startY = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let color = '#ff0000';
            let type = 'normal';

            if (row === 0) {
                color = '#ff00ff';
                type = 'fast';
            } else if (row === 3) {
                color = '#ff8800';
                type = 'tank';
            }

            game.enemies.push({
                x: startX + col * spacingX,
                y: startY + row * spacingY,
                width: enemyWidth,
                height: enemyHeight,
                health: type === 'tank' ? 2 : 1,
                color: color,
                type: type
            });
        }
    }
}

// Spawn Boss
function spawnBoss() {
    game.bossActive = true;
    // Boss gets stronger each wave (much easier now)
    const bossHealth = 80 + (game.wave * 10); // +10 health per wave
    const bossSpeed = Math.min(1.5 + (game.wave * 0.05), 3); // Gets faster but caps at 3
    const bossShootRate = Math.max(100 - (game.wave * 2), 60); // Shoots faster but caps at 60

    game.boss = {
        x: canvas.width / 2 - 100,
        y: 50,
        width: 200,
        height: 150,
        health: bossHealth,
        maxHealth: bossHealth,
        direction: 1,
        speed: bossSpeed,
        shootTimer: 0,
        shootRate: bossShootRate,
        color: '#ff0000'
    };
}

// Update game
function update() {
    if (game.titleScreen) return; // Don't update on title screen
    if (game.gameOver) return;
    if (game.paused) return; // Don't update if paused

    const player = game.player;

    // Player movement
    if (game.keys['arrowleft'] || game.keys['a']) {
        player.x -= player.speed;
    }
    if (game.keys['arrowright'] || game.keys['d']) {
        player.x += player.speed;
    }
    if (game.keys['arrowup'] || game.keys['w']) {
        player.y -= player.speed;
    }
    if (game.keys['arrowdown'] || game.keys['s']) {
        player.y += player.speed;
    }

    // Keep player in bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // Shooting with cooldown
    if (game.shootCooldown > 0) {
        game.shootCooldown--;
    }

    // Auto-shoot continuously
    if (game.shootCooldown === 0) {
        // Shoot bullet
        game.bullets.push({
            x: player.x + player.width / 2 - 3,
            y: player.y,
            width: 6,
            height: 20,
            speed: 10,
            color: '#00ff00'
        });
        playSound('shoot');
        game.shootCooldown = 10; // Cooldown between shots
    }

    // Update bullets
    game.bullets = game.bullets.filter(bullet => {
        bullet.y -= bullet.speed;
        return bullet.y > -bullet.height;
    });

    // Move enemies like Space Invaders
    game.enemyMoveTimer++;
    if (game.enemyMoveTimer > game.enemyMoveRate) {
        game.enemyMoveTimer = 0;

        // Check if any enemy hit the edge
        let hitEdge = false;
        game.enemies.forEach(enemy => {
            if ((enemy.x <= 0 && game.enemyDirection === -1) ||
                (enemy.x + enemy.width >= canvas.width && game.enemyDirection === 1)) {
                hitEdge = true;
            }
        });

        if (hitEdge) {
            game.enemyDirection *= -1;
            game.enemyMoveDown = true;
        }

        // Move all enemies together
        game.enemies.forEach(enemy => {
            if (game.enemyMoveDown) {
                enemy.y += 20;
            } else {
                enemy.x += game.enemyDirection * 15;
            }
        });

        game.enemyMoveDown = false;
    }

    // Update enemies
    game.enemies.forEach(enemy => {

        // Check collision with bullets
        game.bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, enemy)) {
                enemy.health--;
                game.bullets.splice(bulletIndex, 1);

                if (enemy.health <= 0) {
                    // Enemy destroyed
                    enemy.dead = true;
                    game.score += enemy.type === 'tank' ? 30 : enemy.type === 'fast' ? 20 : 10;
                    updateUI();
                    playSound('explosion');

                    // Create explosion
                    game.explosions.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        size: 0,
                        maxSize: 50,
                        life: 20
                    });

                    // Random power-up drop
                    if (Math.random() < 0.2) {
                        game.powerUps.push({
                            x: enemy.x + enemy.width / 2 - 15,
                            y: enemy.y,
                            width: 30,
                            height: 30,
                            speed: 2,
                            type: Math.random() < 0.5 ? 'health' : 'score'
                        });
                    }
                }
            }
        });

        // Check if enemy reached bottom
        if (enemy.y + enemy.height >= canvas.height - 100) {
            gameOver();
        }

        // Check collision with player
        if (checkCollision(player, enemy)) {
            game.health -= 10;
            enemy.dead = true;
            updateUI();
            playSound('hit');

            // Create explosion
            game.explosions.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                size: 0,
                maxSize: 50,
                life: 20
            });

            if (game.health <= 0) {
                gameOver();
            }
        }
    });

    // Remove dead enemies
    game.enemies = game.enemies.filter(enemy => !enemy.dead);

    // Boss logic
    if (game.bossActive && game.boss) {
        const boss = game.boss;

        // Boss movement
        boss.x += boss.direction * boss.speed;
        if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
            boss.direction *= -1;
        }

        // Boss shooting
        boss.shootTimer++;
        if (boss.shootTimer > boss.shootRate) {
            boss.shootTimer = 0;
            // Boss shoots 3 bullets
            for (let i = -1; i <= 1; i++) {
                game.enemyBullets.push({
                    x: boss.x + boss.width / 2 + i * 40,
                    y: boss.y + boss.height,
                    width: 6,
                    height: 15,
                    speed: 5,
                    color: '#ff0000'
                });
            }
            playSound('shoot');
        }

        // Check bullet collision with boss
        game.bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, boss)) {
                boss.health--;
                game.bullets.splice(bulletIndex, 1);
                game.score += 10;
                updateUI();

                if (boss.health <= 0) {
                    // Boss defeated!
                    game.bossActive = false;
                    game.boss = null;
                    game.score += 1000;
                    playSound('explosion');

                    // Huge explosion
                    for (let i = 0; i < 50; i++) {
                        game.explosions.push({
                            x: boss.x + Math.random() * boss.width,
                            y: boss.y + Math.random() * boss.height,
                            size: 0,
                            maxSize: 80,
                            life: 30
                        });
                    }

                    // Don't increment wave here - let the normal spawn logic handle it
                    updateUI();
                }
            }
        });

        // Check boss collision with player
        if (checkCollision(game.player, boss)) {
            game.health -= 50;
            updateUI();
            playSound('hit');
            if (game.health <= 0) {
                gameOver();
            }
        }
    }

    // Update enemy bullets
    game.enemyBullets.forEach(bullet => {
        bullet.y += bullet.speed;

        // Check collision with player
        if (checkCollision(bullet, game.player)) {
            bullet.dead = true;
            game.health -= 5;
            updateUI();
            playSound('hit');
            if (game.health <= 0) {
                gameOver();
            }
        }
    });

    // Remove off-screen enemy bullets
    game.enemyBullets = game.enemyBullets.filter(b => !b.dead && b.y < canvas.height);

    // Spawn new wave if all enemies destroyed
    if (game.enemies.length === 0 && !game.bossActive) {
        game.wave++;

        // Every 5 waves, spawn a boss! (changed from 100 so you can see it sooner)
        if (game.wave % 5 === 0) {
            spawnBoss();
        } else {
            game.enemyMoveRate = Math.max(10, game.enemyMoveRate - 3);
            spawnEnemyGrid();
        }
        updateUI();
    }

    // Update power-ups
    game.powerUps.forEach(powerUp => {
        powerUp.y += powerUp.speed;

        // Check collision with player
        if (checkCollision(player, powerUp)) {
            powerUp.collected = true;
            playSound('powerup');

            if (powerUp.type === 'health') {
                game.health = Math.min(100, game.health + 20);
            } else if (powerUp.type === 'score') {
                game.score += 50;
            }
            updateUI();
        }
    });

    // Remove collected power-ups
    game.powerUps = game.powerUps.filter(p => !p.collected && p.y < canvas.height);

    // Update explosions
    game.explosions.forEach(explosion => {
        explosion.size += 3;
        explosion.life--;
    });
    game.explosions = game.explosions.filter(e => e.life > 0);

    // Update stars
    game.stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = '#ffffff';
    game.stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Draw player - Space Invaders style (classic design)
    const px = game.player.x;
    const py = game.player.y;
    const blockSize = 5; // Pixel block size

    ctx.fillStyle = game.player.color;

    // Classic Space Invaders player ship pattern
    // Top center piece
    ctx.fillRect(px + 22, py, blockSize, blockSize);

    // Second row - 3 blocks
    ctx.fillRect(px + 17, py + 5, blockSize * 3, blockSize);

    // Third row - full width base
    ctx.fillRect(px + 7, py + 10, blockSize * 7, blockSize);

    // Bottom row - even wider with notches
    ctx.fillRect(px, py + 15, blockSize * 3, blockSize); // Left wing
    ctx.fillRect(px + 17, py + 15, blockSize * 3, blockSize); // Right wing
    ctx.fillRect(px + 32, py + 15, blockSize * 3, blockSize); // Far right

    // Middle bottom piece
    ctx.fillRect(px + 12, py + 15, blockSize, blockSize);
    ctx.fillRect(px + 27, py + 15, blockSize, blockSize);

    // Very bottom wings
    ctx.fillRect(px, py + 20, blockSize * 2, blockSize);
    ctx.fillRect(px + 33, py + 20, blockSize * 2, blockSize);

    // Draw bullets
    game.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Bullet glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
    });

    // Draw BOSS
    if (game.bossActive && game.boss) {
        const boss = game.boss;

        // Boss body - huge and menacing
        ctx.fillStyle = boss.color;
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);

        // Boss details
        ctx.fillStyle = '#aa0000';
        ctx.fillRect(boss.x + 20, boss.y + 20, boss.width - 40, boss.height - 40);

        // Boss eyes
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(boss.x + 40, boss.y + 40, 30, 30);
        ctx.fillRect(boss.x + boss.width - 70, boss.y + 40, 30, 30);

        // Evil pupils
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(boss.x + 50, boss.y + 50, 15, 15);
        ctx.fillRect(boss.x + boss.width - 65, boss.y + 50, 15, 15);

        // Boss cannons
        ctx.fillStyle = '#555';
        ctx.fillRect(boss.x + 30, boss.y + boss.height - 20, 15, 20);
        ctx.fillRect(boss.x + boss.width / 2 - 7, boss.y + boss.height - 20, 15, 20);
        ctx.fillRect(boss.x + boss.width - 45, boss.y + boss.height - 20, 15, 20);

        // BOSS HEALTH BAR
        ctx.fillStyle = '#000';
        ctx.fillRect(boss.x, boss.y - 20, boss.width, 15);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(boss.x, boss.y - 20, boss.width * (boss.health / boss.maxHealth), 15);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(boss.x, boss.y - 20, boss.width, 15);

        // BOSS text
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('BOSS', boss.x + boss.width / 2 - 30, boss.y - 25);

        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff0000';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.strokeRect(boss.x, boss.y, boss.width, boss.height);
        ctx.shadowBlur = 0;
    }

    // Draw enemy bullets
    game.enemyBullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Bullet glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
    });

    // Draw enemies - Space Invaders style
    game.enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;

        // Draw alien body
        ctx.fillRect(enemy.x + 10, enemy.y, enemy.width - 20, enemy.height);

        // Draw alien head
        ctx.fillRect(enemy.x + 5, enemy.y + 5, enemy.width - 10, enemy.height - 10);

        // Draw alien eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(enemy.x + 12, enemy.y + 8, 6, 6);
        ctx.fillRect(enemy.x + enemy.width - 18, enemy.y + 8, 6, 6);

        // Draw alien antennae/legs
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y + 15, 5, 10);
        ctx.fillRect(enemy.x + enemy.width - 5, enemy.y + 15, 5, 10);

        // Health bar for tanks
        if (enemy.type === 'tank' && enemy.health > 1) {
            ctx.fillStyle = '#000';
            ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 6);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * (enemy.health / 2), 6);
        }
    });

    // Draw power-ups
    game.powerUps.forEach(powerUp => {
        if (powerUp.type === 'health') {
            // Health power-up (green cross)
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(powerUp.x + 10, powerUp.y, 10, 30);
            ctx.fillRect(powerUp.x, powerUp.y + 10, 30, 10);
        } else {
            // Score power-up (yellow star)
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 144 - 90) * Math.PI / 180;
                const x = powerUp.x + 15 + Math.cos(angle) * 15;
                const y = powerUp.y + 15 + Math.sin(angle) * 15;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = powerUp.type === 'health' ? '#00ff00' : '#ffff00';
        ctx.shadowBlur = 0;
    });

    // Draw explosions
    game.explosions.forEach(explosion => {
        const alpha = explosion.life / 20;
        ctx.globalAlpha = alpha;

        // Outer ring
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
        ctx.stroke();

        // Inner ring
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.size * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;
    });

    // Draw pause overlay
    if (game.paused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);

        ctx.font = 'bold 24px Arial';
        ctx.fillText('Press P or ESC to Resume', canvas.width / 2, canvas.height / 2 + 50);
        ctx.textAlign = 'left';
    }

    // Draw title screen
    if (game.titleScreen) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SPACE SHOOTER', canvas.width / 2, canvas.height / 2 - 100);

        // Subtitle
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#00ff00';
        ctx.fillText('Defend the Galaxy!', canvas.width / 2, canvas.height / 2 - 40);

        // Author credit
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('by camilla f', canvas.width / 2, canvas.height / 2 + 10);

        // Instructions
        ctx.font = '24px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Arrow Keys or WASD to Move', canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText('Auto-Shoot Enabled', canvas.width / 2, canvas.height / 2 + 80);
        ctx.fillText('Defeat Boss Every 5 Waves', canvas.width / 2, canvas.height / 2 + 120);

        // Start prompt (blinking)
        const blink = Math.floor(Date.now() / 500) % 2;
        if (blink) {
            ctx.font = 'bold 50px Arial';
            ctx.fillStyle = '#ffff00';
            ctx.fillText('INSERT COIN', canvas.width / 2, canvas.height / 2 + 200);
        }

        // Small hint below
        ctx.font = '18px Arial';
        ctx.fillStyle = '#888';
        ctx.fillText('(Press SPACE)', canvas.width / 2, canvas.height / 2 + 240);

        ctx.textAlign = 'left';
    }
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = game.score;
    document.getElementById('health').textContent = game.health;
    document.getElementById('wave').textContent = game.wave;
}

// Game over
function gameOver() {
    game.gameOver = true;
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('gameOver').style.display = 'block';
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Input handling
document.addEventListener('keydown', (e) => {
    // Start game from title screen
    if (game.titleScreen && e.key === ' ') {
        game.titleScreen = false;
        spawnEnemyGrid();
        return;
    }

    game.keys[e.key.toLowerCase()] = true;

    // Toggle pause with P or ESC key
    if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'escape') {
        game.paused = !game.paused;
        game.keys[e.key.toLowerCase()] = false; // Prevent holding
    }
});

document.addEventListener('keyup', (e) => {
    game.keys[e.key.toLowerCase()] = false;
});

// Start game
updateUI();
gameLoop();
