import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const width = 800;
        const height = 600;

        // Create sound effects
        this.createSounds();

        // Violet underwater gradient background
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x4A148C, 0x4A148C, 0x9C27B0, 0x9C27B0, 1);
        gradient.fillRect(0, 0, width, height);

        // Add floating bubbles in background
        this.bubbles = [];
        for (let i = 0; i < 15; i++) {
            const bubble = this.add.circle(
                Math.random() * width,
                Math.random() * height,
                Math.random() * 10 + 5,
                0xFFFFFF,
                0.3
            );
            bubble.speed = Math.random() * 2 + 1;
            this.bubbles.push(bubble);
        }

        // Add seaweed
        this.seaweeds = [];
        for (let i = 0; i < 10; i++) {
            const x = i * 80 + 40;
            const seaweed = this.createSeaweed(x, height - 50);
            this.seaweeds.push(seaweed);
        }

        // Create axolotl
        this.axolotl = this.add.container(400, 300);
        this.createAxolotl();

        // Axolotl properties
        this.axolotlSpeed = 3;
        this.axolotlVelX = 0;
        this.axolotlVelY = 0;
        this.axolotlDirection = 1;

        // Score
        this.treasureCount = 0;
        this.totalTreasures = 12;

        // Create treasure chests
        this.treasureGroup = this.physics.add.group();
        for (let i = 0; i < this.totalTreasures; i++) {
            const x = Math.random() * (width - 100) + 50;
            const y = Math.random() * (height - 100) + 50;
            const treasure = this.createTreasure(x, y);
            this.physics.add.existing(treasure);
            treasure.body.setSize(40, 30);
            this.treasureGroup.add(treasure);
        }

        // Enable physics for axolotl
        this.physics.add.existing(this.axolotl);
        this.axolotl.body.setSize(60, 40);

        // Collision detection
        this.physics.add.overlap(this.axolotl, this.treasureGroup, this.collectTreasure, null, this);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');

        // HUD
        this.scoreText = this.add.text(20, 20, '', {
            fontSize: '28px',
            fontFamily: 'Comic Sans MS',
            fill: '#fff',
            backgroundColor: '#4A148CAA',
            padding: { x: 15, y: 15 }
        });

        this.updateScore();
    }

    createSounds() {
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

        if (type === 'treasure') {
            // Treasure collect: magical sparkle!
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
        } else if (type === 'win') {
            // Win: magical fanfare!
            oscillator.frequency.setValueAtTime(500, now);
            oscillator.frequency.setValueAtTime(600, now + 0.1);
            oscillator.frequency.setValueAtTime(700, now + 0.2);
            oscillator.frequency.setValueAtTime(900, now + 0.3);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            oscillator.start(now);
            oscillator.stop(now + 0.4);
        }
    }

    createSeaweed(x, y) {
        const seaweed = this.add.container(x, y);

        // Multiple segments swaying
        for (let i = 0; i < 5; i++) {
            const segment = this.add.rectangle(0, -i * 20, 8, 25, 0x1B5E20);
            seaweed.add(segment);
        }

        // Sway animation
        this.tweens.add({
            targets: seaweed,
            angle: -10,
            duration: 2000 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return seaweed;
    }

    createAxolotl() {
        // Body (pink/purple)
        const body = this.add.ellipse(0, 0, 50, 30, 0xFFB6C1);

        // Head
        const head = this.add.ellipse(20, 0, 35, 30, 0xFFC0CB);

        // External gills (the cute frilly things on the HEAD!)
        // Left side gills
        const gill1 = this.createGill(10, -12);
        const gill2 = this.createGill(10, -8);
        const gill3 = this.createGill(10, -4);
        // Right side gills
        const gill4 = this.createGill(10, 4);
        const gill5 = this.createGill(10, 8);
        const gill6 = this.createGill(10, 12);

        // Tail
        const tail = this.add.triangle(-25, 0, 0, -12, -15, 0, 0, 12, 0xFFB6C1);

        // Eyes (big cute eyes!)
        const eye1 = this.add.circle(25, -5, 4, 0x000000);
        const eye2 = this.add.circle(25, 5, 4, 0x000000);

        // Cute smile
        const smile = this.add.arc(18, 8, 6, 0, Math.PI, false, 0x000000);
        smile.setStrokeStyle(2, 0x000000);
        smile.isFilled = false;

        // Legs (tiny!)
        const leg1 = this.add.rectangle(-5, 12, 3, 8, 0xFFB6C1);
        const leg2 = this.add.rectangle(5, 12, 3, 8, 0xFFB6C1);
        const leg3 = this.add.rectangle(-5, -12, 3, 8, 0xFFB6C1);
        const leg4 = this.add.rectangle(5, -12, 3, 8, 0xFFB6C1);

        this.axolotl.add([tail, body, leg1, leg2, leg3, leg4, head, gill1, gill2, gill3, gill4, gill5, gill6, eye1, eye2, smile]);
    }

    createGill(x, y) {
        const gill = this.add.container(x, y);

        // SIX branches for bigger frilly gills!
        for (let i = 0; i < 6; i++) {
            const angle = (i - 2.5) * 0.4;
            const branch = this.add.rectangle(0, 0, 4, 18, 0xFF1493);
            branch.rotation = angle;
            gill.add(branch);

            // Add little tips on each branch
            const tip = this.add.circle(Math.sin(angle) * 9, -Math.cos(angle) * 9, 3, 0xFF69B4);
            gill.add(tip);
        }

        // Gentle wave animation for gills
        this.tweens.add({
            targets: gill,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return gill;
    }

    createTreasure(x, y) {
        const treasure = this.add.container(x, y);

        // Chest body (brown/gold)
        const chestBody = this.add.rectangle(0, 5, 35, 25, 0x8B4513);
        const chestLid = this.add.rectangle(0, -8, 35, 10, 0xA0522D);

        // Gold lock
        const lock = this.add.circle(0, 5, 4, 0xFFD700);

        // Gold highlights
        const highlight1 = this.add.rectangle(-12, 5, 3, 20, 0xFFD700);
        const highlight2 = this.add.rectangle(12, 5, 3, 20, 0xFFD700);

        treasure.add([chestBody, chestLid, highlight1, highlight2, lock]);

        // Sparkle animation
        this.tweens.add({
            targets: treasure,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return treasure;
    }

    collectTreasure(axolotl, treasure) {
        // Create sparkles!
        for (let i = 0; i < 12; i++) {
            const particle = this.add.circle(treasure.x, treasure.y, 4, 0xFFD700);
            this.tweens.add({
                targets: particle,
                x: treasure.x + Phaser.Math.Between(-50, 50),
                y: treasure.y + Phaser.Math.Between(-50, 50),
                alpha: 0,
                scale: 0,
                duration: 800,
                onComplete: () => particle.destroy()
            });
        }

        treasure.destroy();
        this.treasureCount++;
        this.playSound('treasure');
        this.updateScore();
        this.checkWin();
    }

    updateScore() {
        this.scoreText.setText(`💎 Treasure: ${this.treasureCount}/${this.totalTreasures}`);
    }

    checkWin() {
        if (this.treasureCount === this.totalTreasures) {
            this.playSound('win');

            const winText = this.add.text(400, 300, '🎉 ALL TREASURE FOUND! 🎉', {
                fontSize: '48px',
                fontFamily: 'Comic Sans MS',
                fill: '#FFD700',
                align: 'center'
            }).setOrigin(0.5);

            const restartText = this.add.text(400, 360, 'Press R to hunt again!', {
                fontSize: '24px',
                fontFamily: 'Comic Sans MS',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5);

            this.add.rectangle(0, 0, 800, 600, 0x4A148C, 0.8).setOrigin(0, 0).setDepth(-1);
            winText.setDepth(1000);
            restartText.setDepth(1000);
        }
    }

    update() {
        // Restart check
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            if (this.treasureCount === this.totalTreasures) {
                this.scene.restart();
            }
        }

        // Move bubbles up
        this.bubbles.forEach(bubble => {
            bubble.y -= bubble.speed;
            if (bubble.y < -20) {
                bubble.y = 620;
                bubble.x = Math.random() * 800;
            }
        });

        // Swimming controls (smooth in water!)
        if (this.cursors.left.isDown) {
            this.axolotlVelX -= 0.5;
            if (this.axolotlDirection !== -1) {
                this.axolotl.scaleX = -1;
                this.axolotlDirection = -1;
            }
        } else if (this.cursors.right.isDown) {
            this.axolotlVelX += 0.5;
            if (this.axolotlDirection !== 1) {
                this.axolotl.scaleX = 1;
                this.axolotlDirection = 1;
            }
        }

        if (this.cursors.up.isDown) {
            this.axolotlVelY -= 0.5;
        } else if (this.cursors.down.isDown) {
            this.axolotlVelY += 0.5;
        }

        // Water resistance (slow down)
        this.axolotlVelX *= 0.95;
        this.axolotlVelY *= 0.95;

        // Max speed
        this.axolotlVelX = Phaser.Math.Clamp(this.axolotlVelX, -this.axolotlSpeed, this.axolotlSpeed);
        this.axolotlVelY = Phaser.Math.Clamp(this.axolotlVelY, -this.axolotlSpeed, this.axolotlSpeed);

        // Move axolotl
        this.axolotl.x += this.axolotlVelX;
        this.axolotl.y += this.axolotlVelY;

        // Keep on screen
        this.axolotl.x = Phaser.Math.Clamp(this.axolotl.x, 30, 770);
        this.axolotl.y = Phaser.Math.Clamp(this.axolotl.y, 30, 570);

        // Gentle bobbing animation
        this.axolotl.y += Math.sin(this.time.now / 500) * 0.5;
    }
}

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#4A148C',
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
