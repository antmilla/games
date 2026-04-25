// Brain Test Game
const game = {
    score: 0,
    currentChallenge: 1,
    totalChallenges: 10,
    startTime: Date.now(),
    challengeTypes: ['memory', 'math', 'pattern', 'reaction', 'logic'],
    usedChallenges: []
};

// Update UI
function updateUI() {
    document.getElementById('score').textContent = game.score;
    document.getElementById('challengeNum').textContent = game.currentChallenge;
    const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
    document.getElementById('timer').textContent = elapsed;
}

// Show result
function showResult(correct) {
    const resultDiv = document.getElementById('result');
    if (correct) {
        resultDiv.textContent = 'Correct! ✓';
        resultDiv.className = 'correct';
        game.score++;
    } else {
        resultDiv.textContent = 'Wrong ✗';
        resultDiv.className = 'incorrect';
    }

    updateUI();

    setTimeout(() => {
        resultDiv.textContent = '';
        resultDiv.className = '';
        game.currentChallenge++;

        if (game.currentChallenge > game.totalChallenges) {
            endGame();
        } else {
            nextChallenge();
        }
    }, 1500);
}

// Memory Challenge
function memoryChallenge() {
    const challengeDiv = document.getElementById('challenge');
    challengeDiv.innerHTML = '<div class="question">Memorize the pattern!</div>';

    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 80px)';
    grid.style.justifyContent = 'center';

    // Generate random pattern
    const pattern = [];
    const numSquares = 3 + Math.floor(Math.random() * 3); // 3-5 squares

    for (let i = 0; i < 9; i++) {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.dataset.index = i;

        if (i < numSquares) {
            pattern.push(i);
            item.classList.add('active');
        }

        grid.appendChild(item);
    }

    // Shuffle pattern
    for (let i = pattern.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pattern[i], pattern[j]] = [pattern[j], pattern[i]];
    }

    // Show pattern
    pattern.forEach(index => {
        grid.children[index].classList.add('active');
    });

    challengeDiv.appendChild(grid);

    // Hide pattern after 3 seconds
    setTimeout(() => {
        Array.from(grid.children).forEach(item => item.classList.remove('active'));

        challengeDiv.querySelector('.question').textContent = 'Click the squares that were highlighted!';

        const userPattern = [];

        Array.from(grid.children).forEach(item => {
            item.addEventListener('click', function() {
                if (!this.classList.contains('active')) {
                    this.classList.add('active');
                    userPattern.push(parseInt(this.dataset.index));
                }
            });
        });

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit';
        submitBtn.onclick = () => {
            const correct = userPattern.length === pattern.length &&
                           userPattern.every(val => pattern.includes(val));
            showResult(correct);
        };
        challengeDiv.appendChild(submitBtn);
    }, 3000);
}

// Math Challenge
function mathChallenge() {
    const challengeDiv = document.getElementById('challenge');

    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let answer;
    switch(operation) {
        case '+': answer = num1 + num2; break;
        case '-': answer = num1 - num2; break;
        case '*': answer = num1 * num2; break;
    }

    challengeDiv.innerHTML = `
        <div class="question">What is ${num1} ${operation} ${num2}?</div>
        <input type="number" id="mathInput" autofocus>
        <br><br>
        <button id="mathSubmit">Submit</button>
    `;

    const checkAnswer = () => {
        const userAnswer = parseInt(document.getElementById('mathInput').value);
        showResult(userAnswer === answer);
    };

    document.getElementById('mathSubmit').addEventListener('click', checkAnswer);
    document.getElementById('mathInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
}

// Pattern Recognition
function patternChallenge() {
    const challengeDiv = document.getElementById('challenge');

    const patterns = [
        { sequence: [2, 4, 6, 8, '?'], answer: 10, options: [9, 10, 11, 12] },
        { sequence: [1, 4, 9, 16, '?'], answer: 25, options: [20, 25, 30, 36] },
        { sequence: [5, 10, 15, 20, '?'], answer: 25, options: [22, 24, 25, 30] },
        { sequence: [3, 6, 12, 24, '?'], answer: 48, options: [36, 40, 48, 50] },
        { sequence: [100, 50, 25, '?'], answer: 12.5, options: [10, 12.5, 15, 20] }
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    challengeDiv.innerHTML = `
        <div class="question">What number comes next?</div>
        <div style="font-size: 32px; margin: 20px 0;">${pattern.sequence.join(' → ')}</div>
    `;

    pattern.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => showResult(option === pattern.answer);
        challengeDiv.appendChild(btn);
    });
}

// Reaction Time Challenge
function reactionChallenge() {
    const challengeDiv = document.getElementById('challenge');
    challengeDiv.innerHTML = '<div class="question">Wait for it...</div>';

    const delay = 1000 + Math.random() * 3000; // 1-4 seconds
    let startTime;

    setTimeout(() => {
        challengeDiv.innerHTML = '<div class="question" style="color: #00c853; font-size: 48px;">CLICK NOW!</div>';
        startTime = Date.now();

        const btn = document.createElement('button');
        btn.textContent = 'CLICK!';
        btn.style.fontSize = '32px';
        btn.style.padding = '30px 60px';
        btn.onclick = () => {
            const reactionTime = Date.now() - startTime;
            const correct = reactionTime < 1500; // Under 1500ms is good (easier)
            challengeDiv.innerHTML = `<div class="question">Your time: ${reactionTime}ms</div>`;
            showResult(correct);
        };
        challengeDiv.appendChild(btn);
    }, delay);
}

// Logic Challenge
function logicChallenge() {
    const challengeDiv = document.getElementById('challenge');

    const puzzles = [
        {
            question: "If you have 3 apples and you take away 2, how many do you have?",
            answer: 2,
            options: [1, 2, 3, 4]
        },
        {
            question: "A farmer has 17 sheep. All but 9 die. How many are left?",
            answer: 9,
            options: [8, 9, 10, 17]
        },
        {
            question: "What has hands but cannot clap?",
            answer: "clock",
            options: ["clock", "tree", "glove", "statue"]
        },
        {
            question: "What gets wetter the more it dries?",
            answer: "towel",
            options: ["sponge", "towel", "cloth", "water"]
        },
        {
            question: "I am always hungry and must always be fed. What am I?",
            answer: "fire",
            options: ["fire", "baby", "dog", "plant"]
        }
    ];

    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    challengeDiv.innerHTML = `<div class="question">${puzzle.question}</div>`;

    puzzle.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => showResult(option === puzzle.answer);
        challengeDiv.appendChild(btn);
    });
}

// Next Challenge
function nextChallenge() {
    // Pick a random challenge type that hasn't been used recently
    let challengeType;
    let attempts = 0;

    do {
        challengeType = game.challengeTypes[Math.floor(Math.random() * game.challengeTypes.length)];
        attempts++;
    } while (game.usedChallenges.includes(challengeType) && attempts < 10);

    game.usedChallenges.push(challengeType);
    if (game.usedChallenges.length > 3) {
        game.usedChallenges.shift();
    }

    updateUI();

    switch(challengeType) {
        case 'memory': memoryChallenge(); break;
        case 'math': mathChallenge(); break;
        case 'pattern': patternChallenge(); break;
        case 'reaction': reactionChallenge(); break;
        case 'logic': logicChallenge(); break;
    }
}

// End Game
function endGame() {
    document.getElementById('challenge').style.display = 'none';
    document.getElementById('result').style.display = 'none';

    const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('finalTime').textContent = elapsed;
    document.getElementById('gameOver').style.display = 'block';
}

// Start game
updateUI();
nextChallenge();
setInterval(updateUI, 1000);
