// Super Mario Game
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
        case 'jump':
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
        case 'coin':
            oscillator.frequency.setValueAtTime(988, now);
            oscillator.frequency.setValueAtTime(1319, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
        case 'hit':
            oscillator.frequency.setValueAtTime(100, now);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;
        case 'stomp':
            oscillator.frequency.setValueAtTime(150, now);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;
    }
}

// Game state
const game = {
    score: 0,
    coinCount: 0,
    lives: 10,
    gameOver: false,
    camera: { x: 0, y: 0 },
    keys: {},
    gravity: 0.4,
    mario: {
        x: 100,
        y: 384,
        width: 32,
        height: 48,
        vx: 0,
        vy: 0,
        speed: 6,
        jumpPower: -15,
        onGround: false,
        color: '#ffffff',
        direction: 1 // 1 = right, -1 = left
    },
    platforms: [],
    coinObjects: [],
    enemies: [],
    particles: [],
    powerUps: [],
    isPoweredUp: true,
    hasFire: true,
    isInvincible: true,
    invincibleTimer: 999999,
    fireballs: []
};

// Create level
function createLevel() {
    // Ground
    game.platforms.push({ x: 0, y: 550, width: 3000, height: 50, color: '#8B4513', type: 'ground' });

    // Floating platforms
    for (let i = 0; i < 20; i++) {
        game.platforms.push({
            x: 200 + i * 200,
            y: 450 - Math.random() * 150,
            width: 100,
            height: 20,
            color: '#00aa00',
            type: 'platform'
        });
    }

    // Pipes
    game.platforms.push({ x: 400, y: 490, width: 60, height: 60, color: '#00ff00', type: 'pipe' });
    game.platforms.push({ x: 800, y: 470, width: 60, height: 80, color: '#00ff00', type: 'pipe' });
    game.platforms.push({ x: 1400, y: 450, width: 60, height: 100, color: '#00ff00', type: 'pipe' });

    // Question blocks
    for (let i = 0; i < 15; i++) {
        game.platforms.push({
            x: 300 + i * 250,
            y: 380,
            width: 30,
            height: 30,
            color: '#ffaa00',
            type: 'question',
            hit: false
        });
    }

    // Coins
    for (let i = 0; i < 30; i++) {
        game.coinObjects.push({
            x: 150 + i * 150,
            y: 200 + Math.random() * 200,
            width: 20,
            height: 20,
            collected: false
        });
    }

    // No enemies - game is easy mode!
    // Enemies removed for easy gameplay
}

// Check collision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update game
function update() {
    if (game.gameOver) return;

    const mario = game.mario;

    // Apply gravity
    mario.vy += game.gravity;

    // Horizontal movement
    mario.vx = 0;
    if (game.keys['arrowleft'] || game.keys['a']) {
        mario.vx = -mario.speed;
        mario.direction = -1;
    }
    if (game.keys['arrowright'] || game.keys['d']) {
        mario.vx = mario.speed;
        mario.direction = 1;
    }

    // Jump
    if ((game.keys[' '] || game.keys['arrowup'] || game.keys['w']) && mario.onGround) {
        mario.vy = mario.jumpPower;
        mario.onGround = false;
        playSound('jump');
    }

    // Shoot fireball
    if (game.keys['f'] && game.hasFire) {
        game.keys['f'] = false; // Prevent holding
        game.fireballs.push({
            x: mario.x + (mario.direction > 0 ? mario.width : 0),
            y: mario.y + mario.height / 2,
            width: 12,
            height: 12,
            vx: mario.direction * 8,
            vy: 0,
            life: 100
        });
        playSound('jump');
    }

    // Update invincibility timer
    if (game.invincibleTimer > 0) {
        game.invincibleTimer--;
        if (game.invincibleTimer === 0) {
            game.isInvincible = false;
        }
    }

    // Apply velocity
    mario.x += mario.vx;
    mario.y += mario.vy;

    // Reset onGround
    mario.onGround = false;

    // Platform collision
    game.platforms.forEach(platform => {
        if (checkCollision(mario, platform)) {
            // Landing on top
            if (mario.vy > 0 && mario.y + mario.height - mario.vy < platform.y + 10) {
                mario.y = platform.y - mario.height;
                mario.vy = 0;
                mario.onGround = true;

                // Hit question block from below
                if (platform.type === 'question' && !platform.hit) {
                    platform.hit = true;
                    platform.color = '#8B4513';
                    game.score += 100;

                    // Randomly spawn different power-ups or coin - MORE POWER-UPS!
                    const rand = Math.random();
                    if (rand < 0.4) {
                        // Mushroom power-up
                        game.powerUps.push({
                            x: platform.x,
                            y: platform.y - 30,
                            width: 24,
                            height: 24,
                            vx: 2,
                            vy: 0,
                            type: 'mushroom',
                            collected: false
                        });
                    } else if (rand < 0.7) {
                        // Fire Flower
                        game.powerUps.push({
                            x: platform.x,
                            y: platform.y - 30,
                            width: 24,
                            height: 24,
                            vx: 0,
                            vy: 0,
                            type: 'fireflower',
                            collected: false
                        });
                    } else if (rand < 0.85) {
                        // Star (invincibility)
                        game.powerUps.push({
                            x: platform.x,
                            y: platform.y - 30,
                            width: 24,
                            height: 24,
                            vx: 3,
                            vy: -5,
                            type: 'star',
                            collected: false
                        });
                    } else {
                        // Give coin
                        game.coinCount++;
                        playSound('coin');
                    }
                    updateUI();
                }
            }
            // Hitting from below
            else if (mario.vy < 0 && mario.y - mario.vy > platform.y + platform.height) {
                mario.y = platform.y + platform.height;
                mario.vy = 0;

                // Hit question block
                if (platform.type === 'question' && !platform.hit) {
                    platform.hit = true;
                    platform.color = '#8B4513';
                    game.score += 100;

                    // Randomly spawn different power-ups or coin - MORE POWER-UPS!
                    const rand = Math.random();
                    if (rand < 0.4) {
                        // Mushroom power-up
                        game.powerUps.push({
                            x: platform.x,
                            y: platform.y - 30,
                            width: 24,
                            height: 24,
                            vx: 2,
                            vy: 0,
                            type: 'mushroom',
                            collected: false
                        });
                    } else if (rand < 0.7) {
                        // Fire Flower
                        game.powerUps.push({
                            x: platform.x,
                            y: platform.y - 30,
                            width: 24,
                            height: 24,
                            vx: 0,
                            vy: 0,
                            type: 'fireflower',
                            collected: false
                        });
                    } else if (rand < 0.85) {
                        // Star (invincibility)
                        game.powerUps.push({
                            x: platform.x,
                            y: platform.y - 30,
                            width: 24,
                            height: 24,
                            vx: 3,
                            vy: -5,
                            type: 'star',
                            collected: false
                        });
                    } else {
                        // Give coin
                        game.coinCount++;
                        playSound('coin');
                    }
                    updateUI();
                }
            }
            // Side collision
            else {
                if (mario.vx > 0) {
                    mario.x = platform.x - mario.width;
                } else if (mario.vx < 0) {
                    mario.x = platform.x + platform.width;
                }
                mario.vx = 0;
            }
        }
    });

    // Coin collection
    game.coinObjects.forEach(coin => {
        if (!coin.collected && checkCollision(mario, coin)) {
            coin.collected = true;
            game.coinCount++;
            game.score += 50;
            playSound('coin');
            updateUI();

            // Particle effect
            for (let i = 0; i < 10; i++) {
                game.particles.push({
                    x: coin.x + coin.width / 2,
                    y: coin.y + coin.height / 2,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 30,
                    color: '#ffaa00'
                });
            }
        }
    });

    // Enemy updates
    game.enemies.forEach(enemy => {
        if (!enemy.alive) return;

        enemy.x += enemy.vx;

        // Turn around at edges or platforms
        let shouldTurn = false;
        game.platforms.forEach(platform => {
            if (checkCollision(enemy, platform)) {
                if (enemy.vx > 0) {
                    enemy.x = platform.x - enemy.width;
                    shouldTurn = true;
                } else if (enemy.vx < 0) {
                    enemy.x = platform.x + platform.width;
                    shouldTurn = true;
                }
            }
        });
        if (shouldTurn) enemy.vx *= -1;

        // Enemy collision with Mario
        if (checkCollision(mario, enemy)) {
            // Invincible - kill enemy on touch
            if (game.isInvincible) {
                enemy.alive = false;
                game.score += 100;
                playSound('stomp');
                updateUI();

                // Death particles
                for (let i = 0; i < 15; i++) {
                    game.particles.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 40,
                        color: '#8B4513'
                    });
                }
            }
            // Stomp on enemy
            else if (mario.vy > 0 && mario.y + mario.height - 10 < enemy.y) {
                enemy.alive = false;
                mario.vy = -8;
                game.score += 100;
                playSound('stomp');
                updateUI();

                // Death particles
                for (let i = 0; i < 15; i++) {
                    game.particles.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 40,
                        color: '#8B4513'
                    });
                }
            } else {
                // Mario gets hit
                if (game.hasFire) {
                    // Lose fire power first
                    game.hasFire = false;
                    mario.color = '#ff0000';
                    playSound('hit');
                } else if (game.isPoweredUp) {
                    // Lose power-up (shrink back)
                    game.isPoweredUp = false;
                    mario.height = 32;
                    mario.y += 16;
                    mario.color = '#ff0000';
                    playSound('hit');
                } else {
                    // Lose a life
                    game.lives--;
                    updateUI();
                    playSound('hit');

                    if (game.lives <= 0) {
                        gameOver();
                    } else {
                        // Respawn
                        mario.x = 100;
                        mario.y = 400;
                        mario.vx = 0;
                        mario.vy = 0;
                        mario.color = '#ff0000';
                    }
                }
            }
        }
    });

    // Update power-ups
    game.powerUps.forEach(powerUp => {
        if (powerUp.collected) return;

        // Apply gravity
        powerUp.vy += game.gravity;
        powerUp.x += powerUp.vx;
        powerUp.y += powerUp.vy;

        // Platform collision for power-ups
        game.platforms.forEach(platform => {
            if (checkCollision(powerUp, platform)) {
                if (powerUp.vy > 0) {
                    powerUp.y = platform.y - powerUp.height;
                    powerUp.vy = 0;
                }
                // Bounce off walls
                if (powerUp.vx > 0 && powerUp.x + powerUp.width > platform.x) {
                    powerUp.vx = -2;
                } else if (powerUp.vx < 0 && powerUp.x < platform.x + platform.width) {
                    powerUp.vx = 2;
                }
            }
        });

        // Mario collects power-up
        if (checkCollision(mario, powerUp)) {
            powerUp.collected = true;
            game.score += 500;
            playSound('coin');
            updateUI();

            // Different effects based on power-up type
            if (powerUp.type === 'mushroom') {
                // Mushroom - make Mario bigger
                game.isPoweredUp = true;
                if (mario.height === 32) {
                    mario.height = 48;
                    mario.y -= 16;
                }
                // Red particles
                for (let i = 0; i < 20; i++) {
                    game.particles.push({
                        x: powerUp.x + powerUp.width / 2,
                        y: powerUp.y + powerUp.height / 2,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 50,
                        color: '#ff0000'
                    });
                }
            } else if (powerUp.type === 'fireflower') {
                // Fire Flower - give fire power
                game.isPoweredUp = true;
                game.hasFire = true;
                if (mario.height === 32) {
                    mario.height = 48;
                    mario.y -= 16;
                }
                mario.color = '#ffffff'; // White suit for fire power
                // Orange particles
                for (let i = 0; i < 20; i++) {
                    game.particles.push({
                        x: powerUp.x + powerUp.width / 2,
                        y: powerUp.y + powerUp.height / 2,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 50,
                        color: '#ff6600'
                    });
                }
            } else if (powerUp.type === 'star') {
                // Star - invincibility
                game.isInvincible = true;
                game.invincibleTimer = 300; // 5 seconds at 60fps
                // Rainbow particles
                for (let i = 0; i < 30; i++) {
                    const colors = ['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#0000ff', '#ff00ff'];
                    game.particles.push({
                        x: powerUp.x + powerUp.width / 2,
                        y: powerUp.y + powerUp.height / 2,
                        vx: (Math.random() - 0.5) * 8,
                        vy: (Math.random() - 0.5) * 8,
                        life: 60,
                        color: colors[Math.floor(Math.random() * colors.length)]
                    });
                }
            }
        }
    });

    // Remove collected power-ups
    game.powerUps = game.powerUps.filter(p => !p.collected);

    // Update fireballs
    game.fireballs.forEach(fireball => {
        fireball.x += fireball.vx;
        fireball.life--;

        // Check fireball hitting enemies
        game.enemies.forEach(enemy => {
            if (enemy.alive && checkCollision(fireball, enemy)) {
                enemy.alive = false;
                fireball.life = 0;
                game.score += 100;
                playSound('stomp');
                updateUI();

                // Death particles
                for (let i = 0; i < 15; i++) {
                    game.particles.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 40,
                        color: '#8B4513'
                    });
                }
            }
        });
    });

    // Remove dead fireballs
    game.fireballs = game.fireballs.filter(f => f.life > 0);

    // Update particles
    game.particles = game.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        return p.life > 0;
    });

    // Death by falling - DISABLED (Easy Mode)
    if (mario.y > 650) {
        // Just respawn without losing lives
        mario.x = 100;
        mario.y = 384;
        mario.vx = 0;
        mario.vy = 0;
    }

    // Camera follow Mario
    game.camera.x = mario.x - canvas.width / 3;
    if (game.camera.x < 0) game.camera.x = 0;
}

// Draw game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#5c94fc');
    gradient.addColorStop(1, '#87CEEB');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-game.camera.x, 0);

    // Draw platforms
    game.platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

        // Question mark on question blocks
        if (platform.type === 'question' && !platform.hit) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('?', platform.x + 8, platform.y + 22);
        }

        // Pipe details
        if (platform.type === 'pipe') {
            ctx.fillStyle = '#008800';
            ctx.fillRect(platform.x, platform.y, platform.width, 10);
        }
    });

    // Draw coins
    game.coinObjects.forEach(coin => {
        if (!coin.collected) {
            ctx.fillStyle = '#ffaa00';
            ctx.beginPath();
            ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ff8800';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    // Draw power-ups
    game.powerUps.forEach(powerUp => {
        if (!powerUp.collected) {
            if (powerUp.type === 'mushroom') {
                // Mushroom cap (red with white spots)
                ctx.fillStyle = '#ff0000';
                ctx.beginPath();
                ctx.arc(powerUp.x + powerUp.width / 2, powerUp.y + 8, 12, Math.PI, 0, false);
                ctx.fill();

                // White spots
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(powerUp.x + 6, powerUp.y + 6, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(powerUp.x + 18, powerUp.y + 6, 3, 0, Math.PI * 2);
                ctx.fill();

                // Mushroom stem (white)
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(powerUp.x + 6, powerUp.y + 8, 12, 12);

                // Mushroom eyes
                ctx.fillStyle = '#000000';
                ctx.fillRect(powerUp.x + 8, powerUp.y + 12, 2, 2);
                ctx.fillRect(powerUp.x + 14, powerUp.y + 12, 2, 2);
            } else if (powerUp.type === 'fireflower') {
                // Fire Flower - orange/red flower
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(powerUp.x + 10, powerUp.y + 12, 4, 12); // Stem

                // Petals
                ctx.fillStyle = '#ff6600';
                ctx.beginPath();
                ctx.arc(powerUp.x + 12, powerUp.y + 8, 8, 0, Math.PI * 2);
                ctx.fill();

                // Inner petals
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(powerUp.x + 12, powerUp.y + 8, 4, 0, Math.PI * 2);
                ctx.fill();
            } else if (powerUp.type === 'star') {
                // Star - rainbow flashing
                const colors = ['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#0000ff', '#ff00ff'];
                const colorIndex = Math.floor(Date.now() / 100) % colors.length;
                ctx.fillStyle = colors[colorIndex];

                // Draw star shape
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 144 - 90) * Math.PI / 180;
                    const x = powerUp.x + powerUp.width / 2 + Math.cos(angle) * 10;
                    const y = powerUp.y + powerUp.height / 2 + Math.sin(angle) * 10;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Outline
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        }
    });

    // Draw fireballs
    game.fireballs.forEach(fireball => {
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(fireball.x + fireball.width / 2, fireball.y + fireball.height / 2, fireball.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Flame effect
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(fireball.x + fireball.width / 2, fireball.y + fireball.height / 2, fireball.width / 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw enemies
    game.enemies.forEach(enemy => {
        if (enemy.alive) {
            // Goomba body
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

            // Eyes
            ctx.fillStyle = '#fff';
            ctx.fillRect(enemy.x + 8, enemy.y + 8, 6, 6);
            ctx.fillRect(enemy.x + 18, enemy.y + 8, 6, 6);
            ctx.fillStyle = '#000';
            ctx.fillRect(enemy.x + 10, enemy.y + 10, 3, 3);
            ctx.fillRect(enemy.x + 20, enemy.y + 10, 3, 3);

            // Angry eyebrows
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(enemy.x + 8, enemy.y + 8);
            ctx.lineTo(enemy.x + 14, enemy.y + 6);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(enemy.x + 18, enemy.y + 6);
            ctx.lineTo(enemy.x + 24, enemy.y + 8);
            ctx.stroke();
        }
    });

    // Draw particles
    game.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 40;
        ctx.fillRect(p.x, p.y, 4, 4);
        ctx.globalAlpha = 1;
    });

    // Draw Mario
    const mario = game.mario;

    // Flash colors when invincible
    if (game.isInvincible && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }

    // Mario body
    ctx.fillStyle = mario.color;
    ctx.fillRect(mario.x, mario.y, mario.width, mario.height);

    // Mario hat
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(mario.x + 4, mario.y, mario.width - 8, 10);

    // Mario face
    ctx.fillStyle = '#ffcc99';
    ctx.fillRect(mario.x + 8, mario.y + 10, mario.width - 16, 12);

    // Mario eyes
    ctx.fillStyle = '#000';
    if (mario.direction === 1) {
        ctx.fillRect(mario.x + 18, mario.y + 14, 4, 4);
    } else {
        ctx.fillRect(mario.x + 10, mario.y + 14, 4, 4);
    }

    // Mario mustache
    ctx.fillStyle = '#000';
    ctx.fillRect(mario.x + 10, mario.y + 20, 12, 4);

    // Mario overalls
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(mario.x + 8, mario.y + 24, mario.width - 16, 8);

    // Reset alpha
    ctx.globalAlpha = 1;

    ctx.restore();
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = game.score;
    document.getElementById('coins').textContent = game.coinCount;
    document.getElementById('lives').textContent = game.lives;
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
    game.keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    game.keys[e.key.toLowerCase()] = false;
});

// Start game
createLevel();
updateUI();
gameLoop();
