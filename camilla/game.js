const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let robot;
let toys;
let score = 0;
let scoreText;
let restartButton;
let cursors;
let robotSpeed = 250;
let obstacles = [];
let timerText;
let startTime;
let audioContext;
let lastSoundTime = 0;
let isJumping = false;
let jumpStartY = 0;
let spaceKey;

function preload() {
    // Nothing to preload
}

function playBeep() {
    const now = Date.now();
    if (now - lastSoundTime < 100) return; // Prevent too many sounds at once
    lastSoundTime = now;

    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600 + Math.random() * 400;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
        // Sound failed, continue without sound
    }
}

function create() {
    // Create playground background
    this.add.rectangle(400, 300, 800, 600, 0x90EE90);

    // Add playground elements
    this.add.rectangle(150, 150, 100, 100, 0x228B22);
    this.add.rectangle(650, 450, 120, 120, 0x228B22);
    this.add.rectangle(400, 500, 150, 80, 0x228B22);

    // Sandbox
    this.add.rectangle(650, 150, 150, 100, 0xF4A460);

    // Slide
    this.add.rectangle(150, 450, 80, 120, 0xFF6347);

    // Swings
    this.add.rectangle(400, 150, 60, 100, 0x8B4513);
    this.add.circle(370, 200, 20, 0xFFD700);
    this.add.circle(430, 200, 20, 0xFFD700);

    // Add obstacles
    obstacles = [];

    // Rocks - now as containers so they can move!
    const rocks = [
        {x: 200, y: 350, size: 25},
        {x: 500, y: 250, size: 22},
        {x: 350, y: 400, size: 28},
        {x: 600, y: 400, size: 24}
    ];
    rocks.forEach(rock => {
        const rockContainer = this.add.container(rock.x, rock.y);
        const mainRock = this.add.circle(0, 0, rock.size, 0x808080);
        const detail1 = this.add.circle(-10, -5, 8, 0x696969);
        const detail2 = this.add.circle(8, 5, 6, 0x696969);
        rockContainer.add([mainRock, detail1, detail2]);

        obstacles.push({
            container: rockContainer,
            x: rock.x,
            y: rock.y,
            radius: rock.size,
            type: 'rock'
        });
    });

    // Trees - as containers so they can move!
    const trees = [
        {x: 300, y: 200},
        {x: 500, y: 150},
        {x: 150, y: 300},
        {x: 650, y: 300}
    ];
    trees.forEach(tree => {
        const treeContainer = this.add.container(tree.x, tree.y);
        const trunk = this.add.rectangle(0, 5, 10, 25, 0x8B4513);
        const leaves1 = this.add.circle(0, -10, 20, 0x228B22);
        const leaves2 = this.add.circle(-10, -3, 15, 0x228B22);
        const leaves3 = this.add.circle(10, -3, 15, 0x228B22);
        treeContainer.add([trunk, leaves1, leaves2, leaves3]);

        obstacles.push({
            container: treeContainer,
            x: tree.x,
            y: tree.y,
            radius: 25,
            type: 'tree'
        });
    });

    // Fences - simplified as moving containers!
    const fences = [
        {x: 85, y: 250, width: 70, height: 8, vertical: false},
        {x: 450, y: 340, width: 8, height: 80, vertical: true},
        {x: 600, y: 500, width: 100, height: 8, vertical: false}
    ];
    fences.forEach(fence => {
        const fenceContainer = this.add.container(fence.x, fence.y);
        const fenceRect = this.add.rectangle(0, 0, fence.width, fence.height, 0x8B4513);
        fenceContainer.add(fenceRect);

        obstacles.push({
            container: fenceContainer,
            x: fence.x,
            y: fence.y,
            radius: Math.max(fence.width, fence.height) / 2,
            type: 'fence'
        });
    });

    // Create robot
    robot = this.add.container(400, 300);

    const robotBody = this.add.rectangle(0, 0, 50, 60, 0x4169E1);
    const robotHead = this.add.rectangle(0, -40, 40, 30, 0x6495ED);
    const robotEye1 = this.add.circle(-10, -40, 5, 0x00FF00);
    const robotEye2 = this.add.circle(10, -40, 5, 0x00FF00);
    const robotArm1 = this.add.rectangle(-30, -10, 15, 40, 0x4682B4);
    const robotArm2 = this.add.rectangle(30, -10, 15, 40, 0x4682B4);
    const robotLeg1 = this.add.rectangle(-15, 40, 15, 30, 0x483D8B);
    const robotLeg2 = this.add.rectangle(15, 40, 15, 30, 0x483D8B);

    robot.add([robotBody, robotHead, robotEye1, robotEye2, robotArm1, robotArm2, robotLeg1, robotLeg2]);
    robot.setData('baseY', 300);

    // Set up arrow keys and spacebar for jumping
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Create toys group
    toys = this.physics.add.group();

    // Add toys
    const toyPositions = [
        {x: 100, y: 100, color: 0xFF69B4},
        {x: 700, y: 100, color: 0xFFFF00},
        {x: 100, y: 500, color: 0xFF1493},
        {x: 700, y: 500, color: 0x00FFFF},
        {x: 400, y: 450, color: 0xFF00FF},
        {x: 250, y: 250, color: 0xFFA500},
        {x: 550, y: 350, color: 0x9370DB},
        {x: 300, y: 100, color: 0xFFD700},
        {x: 180, y: 180, color: 0x00FF00},
        {x: 620, y: 200, color: 0xFF0000},
        {x: 220, y: 450, color: 0x0000FF},
        {x: 600, y: 250, color: 0xFFFFFF},
        {x: 380, y: 200, color: 0xFF69B4},
        {x: 480, y: 450, color: 0x00CED1},
        {x: 330, y: 320, color: 0xFFD700}
    ];

    toyPositions.forEach(pos => {
        const toy = this.add.container(pos.x, pos.y);
        const toyShape = this.add.star(0, 0, 5, 10, 20, pos.color);
        const toyGlow = this.add.circle(0, 0, 15, pos.color, 0.3);
        toy.add([toyGlow, toyShape]);
        toy.setData('visible', true);
        toy.setData('color', pos.color);
        toys.add(toy);
    });

    // Make toys move to new hiding spots every 3 seconds!
    this.time.addEvent({
        delay: 3000,
        callback: () => {
            toys.children.entries.forEach(toy => {
                if (toy.active) {
                    // Pick a random new position
                    const newX = 100 + Math.random() * 600;
                    const newY = 100 + Math.random() * 400;

                    // Move toy to new spot smoothly
                    this.tweens.add({
                        targets: toy,
                        x: newX,
                        y: newY,
                        duration: 500,
                        ease: 'Power2'
                    });
                }
            });
        },
        loop: true
    });

    // Make obstacles move around every 4 seconds!
    this.time.addEvent({
        delay: 4000,
        callback: () => {
            obstacles.forEach(obstacle => {
                if (obstacle.container) {
                    // Pick a random new position
                    const newX = 100 + Math.random() * 600;
                    const newY = 100 + Math.random() * 400;

                    // Move obstacle smoothly
                    this.tweens.add({
                        targets: obstacle.container,
                        x: newX,
                        y: newY,
                        duration: 600,
                        ease: 'Power2',
                        onUpdate: () => {
                            // Update obstacle position for collision detection
                            obstacle.x = obstacle.container.x;
                            obstacle.y = obstacle.container.y;
                        }
                    });
                }
            });
        },
        loop: true
    });

    // Score text
    scoreText = this.add.text(16, 16, 'Toys: 0/15', {
        fontSize: '24px',
        fill: '#000',
        backgroundColor: '#fff',
        padding: { x: 10, y: 5 }
    });

    // Timer text
    timerText = this.add.text(16, 50, 'Time: 0s', {
        fontSize: '24px',
        fill: '#000',
        backgroundColor: '#fff',
        padding: { x: 10, y: 5 }
    });

    startTime = this.time.now;

    // Restart button
    restartButton = this.add.text(680, 16, 'Restart', {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#FF4500',
        padding: { x: 10, y: 5 }
    });
    restartButton.setInteractive();
    restartButton.on('pointerdown', () => {
        this.scene.restart();
        score = 0;
    });
}

function update() {
    // Update timer
    if (score < 15) {
        const elapsed = Math.floor((this.time.now - startTime) / 1000);
        timerText.setText('Time: ' + elapsed + 's');
    }

    // Handle jumping with spacebar
    if (Phaser.Input.Keyboard.JustDown(spaceKey) && !isJumping) {
        isJumping = true;
        jumpStartY = robot.y;

        // Jump animation
        this.tweens.add({
            targets: robot,
            y: robot.y - 100,
            duration: 300,
            ease: 'Quad.easeOut',
            yoyo: true,
            onComplete: () => {
                isJumping = false;
            }
        });
    }

    // Store old position
    const oldX = robot.x;
    const oldY = robot.y;

    // Move robot
    if (cursors.left.isDown) {
        robot.x -= robotSpeed * (1/60);
    } else if (cursors.right.isDown) {
        robot.x += robotSpeed * (1/60);
    }

    if (cursors.up.isDown) {
        robot.y -= robotSpeed * (1/60);
    } else if (cursors.down.isDown) {
        robot.y += robotSpeed * (1/60);
    }

    // Keep robot in bounds
    robot.x = Phaser.Math.Clamp(robot.x, 30, 770);
    robot.y = Phaser.Math.Clamp(robot.y, 60, 570);

    // Check obstacles - can jump over them!
    let hitObstacle = false;
    if (!isJumping) {
        obstacles.forEach(obstacle => {
            const distance = Phaser.Math.Distance.Between(robot.x, robot.y, obstacle.x, obstacle.y);
            if (distance < obstacle.radius + 25) {
                hitObstacle = true;
            }
        });

        if (hitObstacle) {
            robot.x = oldX;
            robot.y = oldY;
        }
    }

    // Check toy collection
    toys.children.entries.forEach(toy => {
        if (toy.active) {
            const distance = Phaser.Math.Distance.Between(robot.x, robot.y, toy.x, toy.y);
            const isVisible = toy.getData('visible');

            if (distance < 50 && isVisible) {
                playBeep();
                toy.destroy();
                score++;
                scoreText.setText('Toys: ' + score + '/15');

                if (score === 15) {
                    const finalTime = Math.floor((this.time.now - startTime) / 1000);
                    const winText = this.add.text(400, 300, 'YOU WIN!\nAll 15 toys found!\nTime: ' + finalTime + 's', {
                        fontSize: '40px',
                        fill: '#FFD700',
                        backgroundColor: '#000',
                        padding: { x: 20, y: 10 },
                        align: 'center'
                    });
                    winText.setOrigin(0.5);
                }
            }
        }
    });
}
