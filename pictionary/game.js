// Pictionary Game
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Game state
const game = {
    score: 0,
    round: 1,
    timeLeft: 120,
    currentWord: '',
    timerInterval: null,
    isDrawing: false,
    currentColor: '#000000',
    brushSize: 3
};

// Word list (easy words!)
const words = [
    'cat', 'dog', 'sun', 'moon', 'star', 'fish', 'car', 'tree', 'house', 'ball',
    'heart', 'smile', 'eye', 'hand', 'flower', 'apple', 'banana', 'pizza', 'cake', 'ice cream',
    'boat', 'plane', 'bird', 'cloud', 'rainbow', 'snowman', 'hat', 'shoe', 'cup', 'spoon',
    'book', 'pencil', 'phone', 'clock', 'bed', 'chair', 'door', 'window', 'lamp', 'key',
    'butterfly', 'bee', 'frog', 'duck', 'pig', 'bunny', 'chick', 'bear', 'fox', 'mouse'
];

// Drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize game
function startGame() {
    pickNewWord();
    startTimer();
    updateUI();
}

// Pick a random word
function pickNewWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    game.currentWord = words[randomIndex];
    document.getElementById('wordDisplay').textContent = game.currentWord;
    document.getElementById('result').textContent = '';

    // Reset guessing section
    document.getElementById('guessingSection').style.display = 'none';
    document.getElementById('doneBtn').style.display = 'inline-block';
    document.getElementById('computerGuess').textContent = '';
}

// Start timer
function startTimer() {
    if (game.timerInterval) {
        clearInterval(game.timerInterval);
    }

    game.timeLeft = 120; // 2 minutes now!
    updateUI();

    game.timerInterval = setInterval(() => {
        game.timeLeft--;
        updateUI();

        if (game.timeLeft <= 0) {
            timeUp();
        }
    }, 1000);
}

// Time's up
function timeUp() {
    clearInterval(game.timerInterval);
    document.getElementById('result').textContent = `Time's up! The word was: ${game.currentWord}`;
    document.getElementById('result').className = 'result incorrect';

    setTimeout(() => {
        nextRound();
    }, 3000);
}

// Next round
function nextRound() {
    game.round++;
    clearCanvas();
    pickNewWord();
    startTimer();
    updateUI();
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = game.score;
    document.getElementById('timer').textContent = game.timeLeft;
    document.getElementById('round').textContent = game.round;
}

// Clear canvas
window.clearCanvas = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Skip word
window.skipWord = function() {
    document.getElementById('result').textContent = `Skipped! The word was: ${game.currentWord}`;
    document.getElementById('result').className = 'result incorrect';

    setTimeout(() => {
        nextRound();
    }, 2000);
}

// Show guessing section
window.showGuessing = function() {
    document.getElementById('doneBtn').style.display = 'none';
    document.getElementById('guessingSection').style.display = 'block';

    // Generate 3 random wrong words + the correct word
    const options = [game.currentWord];
    const otherWords = words.filter(w => w !== game.currentWord);

    while (options.length < 4) {
        const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
        if (!options.includes(randomWord)) {
            options.push(randomWord);
        }
    }

    // Shuffle the options
    options.sort(() => Math.random() - 0.5);

    // Display options
    const optionsDiv = document.getElementById('guessOptions');
    optionsDiv.innerHTML = '';
    options.forEach(word => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'guess-option';
        optionDiv.textContent = word;
        optionsDiv.appendChild(optionDiv);
    });

    // Computer "thinks" for a moment
    setTimeout(() => {
        computerMakesGuess(options);
    }, 1500);
}

// Computer makes a guess
function computerMakesGuess(options) {
    const resultDiv = document.getElementById('result');
    const guessDiv = document.getElementById('computerGuess');
    const optionDivs = document.querySelectorAll('.guess-option');

    // Computer has a 70% chance to guess correctly (rewarding good drawings)
    // and 30% chance to guess randomly (realistic that it might be wrong)
    let computerGuess;
    if (Math.random() < 0.7) {
        // Guess correctly
        computerGuess = game.currentWord;
    } else {
        // Random wrong guess
        const wrongOptions = options.filter(w => w !== game.currentWord);
        computerGuess = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    }

    // Highlight computer's pick
    optionDivs.forEach(div => {
        if (div.textContent === computerGuess) {
            div.classList.add('computer-pick');
        }
        if (div.textContent === game.currentWord) {
            div.classList.add('correct');
        } else {
            div.classList.add('wrong');
        }
    });

    guessDiv.textContent = `Computer guessed: "${computerGuess}"`;

    // Calculate points
    const timeBonus = Math.floor(game.timeLeft / 10);
    let points;

    if (computerGuess === game.currentWord) {
        // Computer guessed correctly!
        points = 200 + (timeBonus * 15);
        resultDiv.textContent = `✅ Computer guessed right! Great drawing! +${points} points!`;
        resultDiv.className = 'result correct';
    } else {
        // Computer guessed wrong
        points = 50 + (timeBonus * 5);
        resultDiv.textContent = `❌ Computer guessed wrong. The word was "${game.currentWord}". +${points} points`;
        resultDiv.className = 'result incorrect';
    }

    game.score += points;
    updateUI();
    clearInterval(game.timerInterval);

    setTimeout(() => {
        nextRound();
    }, 4000);
}

// Canvas drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = game.currentColor;
    ctx.lineWidth = game.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

// Touch support for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.strokeStyle = game.currentColor;
    ctx.lineWidth = game.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
});

// Color buttons
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        game.currentColor = btn.dataset.color;
    });
});

// Brush size
const brushSizeInput = document.getElementById('brushSize');
const sizeValue = document.getElementById('sizeValue');

brushSizeInput.addEventListener('input', (e) => {
    game.brushSize = parseInt(e.target.value);
    sizeValue.textContent = game.brushSize;
});

// Initialize
clearCanvas();
startGame();
