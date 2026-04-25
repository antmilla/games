import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const width = 800;
        const height = 600;

        // Create sound effects using Web Audio API
        this.createSounds();

        // Sky background
        this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0, 0);

        // Ground
        this.ground = this.add.rectangle(0, height - 100, width, 100, 0x8FBC8F).setOrigin(0, 0);

        // Add moving clouds
        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.ellipse(
                Math.random() * width,
                Math.random() * 150 + 50,
                60 + Math.random() * 40,
                30 + Math.random() * 20,
                0xFFFFFF,
                0.7
            );
            cloud.speed = 0.2 + Math.random() * 0.3;
            this.clouds.push(cloud);
        }

        // Create ponds (on the ground!)
        this.ponds = [
            { x: 100, y: height - 80, width: 120, height: 60 },
            { x: 350, y: height - 75, width: 140, height: 70 },
            { x: 600, y: height - 80, width: 130, height: 65 }
        ];

        this.ponds.forEach(pond => {
            const ellipse = this.add.ellipse(
                pond.x + pond.width / 2,
                pond.y + pond.height / 2,
                pond.width,
                pond.height,
                0x4A90E2
            );
        });

        // Create trees (4 trees)
        this.trees = [];
        for (let i = 0; i < 4; i++) {
            const x = i * 200 + 100;
            const y = height - 150;

            // Trunk
            this.add.rectangle(x, y + 25, 16, 50, 0x8B4513);

            // Leaves
            const leaves = this.add.circle(x, y - 10, 28, 0x228B22);

            this.trees.push({ x, y });
        }

        // Create fox
        this.fox = this.add.container(400, 470);
        this.createFox();

        // Fox properties
        this.foxSpeed = 4;
        this.foxDirection = 1; // 1 = right, -1 = left
        this.foxVelocityY = 0;
        this.foxIsJumping = false;
        this.foxGroundY = 470;
        this.foxGravity = 0.5;
        this.foxJumpPower = -12;

        // Score
        this.berries = 0;
        this.fish = 0;
        this.combo = 0;
        this.comboTimer = 0;

        // Challenge mode!
        this.lives = 3; // 3 lives!
        this.gameOver = false;

        // Create bees (obstacles!)
        this.bees = [];
        for (let i = 0; i < 5; i++) {
            const bee = this.add.container(
                Math.random() * 700 + 50,
                Math.random() * 300 + 100
            );

            // Bee body (yellow and black stripes)
            const beeBody = this.add.ellipse(0, 0, 16, 12, 0xFFD700);
            const stripe1 = this.add.rectangle(-2, 0, 3, 12, 0x000000);
            const stripe2 = this.add.rectangle(2, 0, 3, 12, 0x000000);

            // Wings
            const wing1 = this.add.ellipse(-6, -4, 8, 6, 0xFFFFFF, 0.5);
            const wing2 = this.add.ellipse(6, -4, 8, 6, 0xFFFFFF, 0.5);

            bee.add([wing1, wing2, beeBody, stripe1, stripe2]);

            this.physics.add.existing(bee);
            bee.body.setSize(20, 20);

            // Random movement
            bee.speedX = (Math.random() - 0.5) * 3;
            bee.speedY = (Math.random() - 0.5) * 2;

            this.bees.push(bee);

            // Wing animation
            this.tweens.add({
                targets: [wing1, wing2],
                scaleY: 1.3,
                duration: 100,
                yoyo: true,
                repeat: -1
            });
        }

        // Create collectibles
        this.berryGroup = this.physics.add.group();
        this.fishGroup = this.physics.add.group();

        // Spawn berries in trees (with sparkle animation!)
        for (let i = 0; i < 15; i++) {
            const tree = Phaser.Utils.Array.GetRandom(this.trees);
            const berry = this.add.circle(
                tree.x + Phaser.Math.Between(-30, 30),
                tree.y - 10 + Phaser.Math.Between(-20, 20),
                8,
                0xE74C3C
            );
            this.physics.add.existing(berry);
            berry.body.setCircle(10); // Bigger collision area
            this.berryGroup.add(berry);

            // Add pulsing animation
            this.tweens.add({
                targets: berry,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Spawn fish near ponds (at fox level so you can catch them!)
        for (let i = 0; i < 10; i++) {
            const pond = Phaser.Utils.Array.GetRandom(this.ponds);
            const x = pond.x + Math.random() * pond.width;
            const y = 450 + Math.random() * 40; // Near the fox's level!

            // Create a container for each fish
            const fishContainer = this.add.container(x, y);

            // Fish body (bright orange goldfish!)
            const fishBody = this.add.ellipse(0, 0, 24, 14, 0xFF8C00);

            // Fish tail
            const fishTail = this.add.triangle(-12, 0, 0, -5, -6, 0, 0, 5, 0xFFA500);

            // Fish eye (white with black pupil)
            const fishEye = this.add.circle(6, -2, 3, 0xFFFFFF);
            const fishPupil = this.add.circle(7, -2, 1.5, 0x000000);

            fishContainer.add([fishTail, fishBody, fishEye, fishPupil]);

            this.physics.add.existing(fishContainer);
            fishContainer.body.setSize(30, 20); // Bigger collision area
            this.fishGroup.add(fishContainer);

            // Store original position for collision
            fishContainer.setData('fishData', true);

            // Add bobbing animation
            this.tweens.add({
                targets: fishContainer,
                y: fishContainer.y - 5,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Add slight rotation animation (swimming)
            this.tweens.add({
                targets: fishContainer,
                angle: -5,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Enable physics for fox
        this.physics.add.existing(this.fox);
        this.fox.body.setSize(60, 40); // Bigger collision area to make collecting easier!

        // Collision detection
        this.physics.add.overlap(this.fox, this.berryGroup, this.collectBerry, null, this);
        this.physics.add.overlap(this.fox, this.fishGroup, this.collectFish, null, this);

        // Bee collision - hit a bee and lose time!
        this.bees.forEach(bee => {
            this.physics.add.overlap(this.fox, bee, this.hitBee, null, this);
        });

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');

        // HUD
        this.scoreText = this.add.text(20, 20, '', {
            fontSize: '24px',
            fontFamily: 'Comic Sans MS',
            fill: '#fff',
            backgroundColor: '#000000AA',
            padding: { x: 10, y: 10 }
        });

        this.updateScore();
    }

    createSounds() {
        // Initialize audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
    }

    playSound(type) {
        const ctx = this.audioCtx;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'berry') {
            // Berry collect: cheerful boop!
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        } else if (type === 'fish') {
            // Fish collect: splash sound!
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.15);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
        } else if (type === 'jump') {
            // Jump: DEEP whoosh up!
            oscillator.frequency.setValueAtTime(80, now);
            oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.15);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
        } else if (type === 'combo') {
            // Combo: exciting ding!
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.setValueAtTime(1000, now + 0.05);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
        } else if (type === 'win') {
            // Win: victory fanfare!
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.setValueAtTime(500, now + 0.1);
            oscillator.frequency.setValueAtTime(600, now + 0.2);
            oscillator.frequency.setValueAtTime(800, now + 0.3);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            oscillator.start(now);
            oscillator.stop(now + 0.4);
        }
    }

    createFox() {
        // Body (more elongated for fox)
        const body = this.add.ellipse(15, 15, 45, 28, 0xFF8C42);

        // Bushy tail (bigger and fluffier!)
        const tail1 = this.add.ellipse(-15, 15, 30, 20, 0xFF8C42);
        const tail2 = this.add.ellipse(-20, 14, 22, 16, 0xFF8C42);
        const tailTip = this.add.ellipse(-28, 13, 12, 10, 0xFFFFFF);

        // Head
        const head = this.add.circle(38, 10, 11, 0xFFA07A);

        // Long fox snout (pointy!)
        const snout = this.add.triangle(45, 12, 0, -4, 8, 0, 0, 4, 0xFFA07A);

        // White chest/belly
        const chest = this.add.ellipse(20, 18, 25, 15, 0xFFFFFF);

        // Big triangular ears (fox ears are bigger!)
        const ear1 = this.add.triangle(33, 0, 0, 12, 6, 0, 12, 12, 0xFF8C42);
        const ear2 = this.add.triangle(43, 0, 0, 12, 6, 0, 12, 12, 0xFF8C42);

        // Black ear tips
        const earTip1 = this.add.triangle(33, 0, 3, 6, 6, 0, 9, 6, 0x000000);
        const earTip2 = this.add.triangle(43, 0, 3, 6, 6, 0, 9, 6, 0x000000);

        // Eyes
        const eye1 = this.add.circle(36, 9, 2, 0x000000);
        const eye2 = this.add.circle(41, 9, 2, 0x000000);

        // Black nose (at tip of snout)
        const nose = this.add.circle(53, 12, 2, 0x000000);

        this.fox.add([tail1, tail2, tailTip, body, chest, head, snout, ear1, ear2, earTip1, earTip2, eye1, eye2, nose]);
        this.foxParts = { body, head, snout, ear1, ear2, earTip1, earTip2, eye1, eye2, nose, tail1, tail2, tailTip, chest };
    }

    collectBerry(fox, berry) {
        // Play berry sound!
        this.playSound('berry');

        // Create sparkle particles!
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(berry.x, berry.y, 3, 0xFF0000);
            this.tweens.add({
                targets: particle,
                x: berry.x + Phaser.Math.Between(-30, 30),
                y: berry.y + Phaser.Math.Between(-30, 30),
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }

        berry.destroy();
        this.berries++;
        this.combo++;
        this.comboTimer = 120; // 2 seconds
        this.updateScore();
        this.checkWin();

        // Show combo text!
        if (this.combo > 1) {
            this.playSound('combo');
            const comboText = this.add.text(berry.x, berry.y - 20, `COMBO x${this.combo}!`, {
                fontSize: '20px',
                fontFamily: 'Comic Sans MS',
                fill: '#FFD700',
                stroke: '#000',
                strokeThickness: 3
            }).setOrigin(0.5);
            this.tweens.add({
                targets: comboText,
                y: comboText.y - 30,
                alpha: 0,
                duration: 1000,
                onComplete: () => comboText.destroy()
            });
        }
    }

    collectFish(fox, fish) {
        // Play fish sound!
        this.playSound('fish');

        // Create orange sparkle particles (for goldfish)!
        for (let i = 0; i < 10; i++) {
            const particle = this.add.circle(fish.x, fish.y, 4, 0xFF8C00);
            this.tweens.add({
                targets: particle,
                x: fish.x + Phaser.Math.Between(-40, 40),
                y: fish.y + Phaser.Math.Between(-40, 40),
                alpha: 0,
                scale: 0,
                duration: 600,
                onComplete: () => particle.destroy()
            });
        }

        fish.destroy();
        this.fish++;
        this.combo++;
        this.comboTimer = 120;
        this.updateScore();
        this.checkWin();

        // Show combo text!
        if (this.combo > 1) {
            this.playSound('combo');
            const comboText = this.add.text(fish.x, fish.y - 20, `COMBO x${this.combo}!`, {
                fontSize: '20px',
                fontFamily: 'Comic Sans MS',
                fill: '#FFD700',
                stroke: '#000',
                strokeThickness: 3
            }).setOrigin(0.5);
            this.tweens.add({
                targets: comboText,
                y: comboText.y - 30,
                alpha: 0,
                duration: 1000,
                onComplete: () => comboText.destroy()
            });
        }
    }

    updateScore() {
        let hearts = '❤️'.repeat(Math.max(0, this.lives));
        let text = `${hearts}\n🍓 Berries: ${this.berries}/15\n🐟 Fish: ${this.fish}/10`;
        if (this.combo > 1) {
            text += `\n🔥 COMBO x${this.combo}!`;
        }
        this.scoreText.setText(text);
    }

    hitBee(fox, bee) {
        if (!bee.justHit) {
            // Lose 1 life!
            this.lives--;
            this.updateScore();

            // Flash the bee
            bee.justHit = true;
            this.tweens.add({
                targets: bee,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    bee.justHit = false;
                }
            });

            // Flash the fox red
            this.tweens.add({
                targets: this.fox,
                alpha: 0.5,
                duration: 100,
                yoyo: true,
                repeat: 3
            });

            // Play hurt sound
            this.playSound('fish');

            // Show -1 LIFE text
            const penaltyText = this.add.text(this.fox.x, this.fox.y - 50, '-1 LIFE!', {
                fontSize: '28px',
                fontFamily: 'Comic Sans MS',
                fill: '#FF0000',
                stroke: '#000',
                strokeThickness: 4
            }).setOrigin(0.5);

            this.tweens.add({
                targets: penaltyText,
                y: penaltyText.y - 50,
                alpha: 0,
                duration: 1500,
                onComplete: () => penaltyText.destroy()
            });

            // Check if dead
            if (this.lives <= 0) {
                this.gameOver = true;
                const loseText = this.add.text(400, 300, '💀 GAME OVER! 💀', {
                    fontSize: '48px',
                    fontFamily: 'Comic Sans MS',
                    fill: '#FF0000',
                    align: 'center'
                }).setOrigin(0.5);

                const restartText = this.add.text(400, 360, 'Press R to try again!', {
                    fontSize: '24px',
                    fontFamily: 'Comic Sans MS',
                    fill: '#fff',
                    align: 'center'
                }).setOrigin(0.5);

                this.add.rectangle(0, 0, 800, 600, 0x000000, 0.7).setOrigin(0, 0).setDepth(-1);
                loseText.setDepth(1000);
                restartText.setDepth(1000);
            }
        }
    }

    checkWin() {
        if (this.berries === 15 && this.fish === 10) {
            this.playSound('win'); // Victory fanfare!

            const winText = this.add.text(400, 300, '🎉 YOU FOUND EVERYTHING! 🎉', {
                fontSize: '48px',
                fontFamily: 'Comic Sans MS',
                fill: '#FFD700',
                align: 'center'
            }).setOrigin(0.5);

            const restartText = this.add.text(400, 360, 'Press R to explore again!', {
                fontSize: '24px',
                fontFamily: 'Comic Sans MS',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5);

            this.add.rectangle(0, 0, 800, 600, 0x000000, 0.7).setOrigin(0, 0).setDepth(-1);
            winText.setDepth(1000);
            restartText.setDepth(1000);
        }
    }

    update() {
        // Restart game check (BEFORE game over check!)
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            if ((this.berries === 15 && this.fish === 10) || this.gameOver) {
                this.scene.restart();
            }
        }

        // Game over check
        if (this.gameOver) return;

        // Move clouds slowly
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > 850) {
                cloud.x = -50;
            }
        });

        // Move bees!
        this.bees.forEach(bee => {
            bee.x += bee.speedX;
            bee.y += bee.speedY;

            // Bounce off edges
            if (bee.x < 50 || bee.x > 750) {
                bee.speedX *= -1;
            }
            if (bee.y < 50 || bee.y > 400) {
                bee.speedY *= -1;
            }
        });

        // Combo timer countdown
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer === 0) {
                this.combo = 0; // Reset combo
                this.updateScore(); // Update display when combo resets
            }
        }

        // Handle movement
        if (this.cursors.left.isDown) {
            this.fox.x -= this.foxSpeed;
            if (this.foxDirection !== -1) {
                this.fox.scaleX = -1;
                this.foxDirection = -1;
            }
        } else if (this.cursors.right.isDown) {
            this.fox.x += this.foxSpeed;
            if (this.foxDirection !== 1) {
                this.fox.scaleX = 1;
                this.foxDirection = 1;
            }
        }

        // Jumping with Up Arrow
        if (this.cursors.up.isDown && !this.foxIsJumping) {
            this.foxVelocityY = this.foxJumpPower;
            this.foxIsJumping = true;
            this.playSound('jump'); // Whoosh!
        }

        // Apply gravity
        this.foxVelocityY += this.foxGravity;
        this.fox.y += this.foxVelocityY;

        // Check if fox hit the ground
        if (this.fox.y >= this.foxGroundY) {
            this.fox.y = this.foxGroundY;
            this.foxVelocityY = 0;
            this.foxIsJumping = false;
        }

        // Keep fox on screen
        this.fox.x = Phaser.Math.Clamp(this.fox.x, 0, 800);
    }
}

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [GameScene]
};

// Create game
const game = new Phaser.Game(config);
