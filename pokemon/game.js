// Pokemon Resort Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio Context for sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Sound effect functions
function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    switch(type) {
        case 'catch':
            // Happy catch sound
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'coin':
            // Coin pickup sound
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.setValueAtTime(1000, now + 0.05);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;

        case 'attack':
            // Attack sound
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.setValueAtTime(100, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;

        case 'hit':
            // Hit sound
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(150, now);
            gainNode.gain.setValueAtTime(0.4, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;

        case 'heal':
            // Healing sound
            oscillator.frequency.setValueAtTime(440, now);
            oscillator.frequency.setValueAtTime(554.37, now + 0.1);
            oscillator.frequency.setValueAtTime(659.25, now + 0.2);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'bump':
            // Bump sound
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(100, now);
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            oscillator.start(now);
            oscillator.stop(now + 0.05);
            break;

        case 'fruit':
            // Fruit falling sound
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.setValueAtTime(300, now + 0.1);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;

        case 'build':
            // Building sound
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(300, now);
            oscillator.frequency.setValueAtTime(350, now + 0.1);
            gainNode.gain.setValueAtTime(0.25, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
    }
}

// Background Music - Real Pokemon song support
const backgroundMusic = new Audio();
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

// Try to load Pokemon music file (user needs to add this file)
// You can add a Pokemon song MP3 file named 'pokemon-music.mp3' to this folder
backgroundMusic.src = 'pokemon-music.mp3';

let musicPlaying = false;

function startMusic() {
    if (!musicPlaying) {
        musicPlaying = true;
        backgroundMusic.play().catch(err => {
            console.log('Music file not found. Add a pokemon-music.mp3 file to play music!');
            // Fallback: play simple beep melody if file not found
            playSimpleMelody();
        });
    }
}

function stopMusic() {
    musicPlaying = false;
    backgroundMusic.pause();
    if (melodyTimeoutId) {
        clearTimeout(melodyTimeoutId);
        melodyTimeoutId = null;
    }
}

// Fallback Pokemon-style chiptune melody
let melodyTimeoutId = null;

function playSimpleMelody() {
    if (!musicPlaying) return;

    // Pokemon Theme Song - "Gotta Catch 'Em All!"
    const melody = [
        // "I wanna be the very best"
        { note: 587.33, duration: 0.3 }, // D5
        { note: 587.33, duration: 0.3 }, // D5
        { note: 659.25, duration: 0.3 }, // E5
        { note: 783.99, duration: 0.3 }, // G5
        { note: 659.25, duration: 0.3 }, // E5
        { note: 587.33, duration: 0.6 }, // D5

        // "Like no one ever was"
        { note: 523.25, duration: 0.3 }, // C5
        { note: 587.33, duration: 0.3 }, // D5
        { note: 659.25, duration: 0.6 }, // E5
        { note: 587.33, duration: 0.6 }, // D5

        // "To catch them is my real test"
        { note: 587.33, duration: 0.3 }, // D5
        { note: 587.33, duration: 0.3 }, // D5
        { note: 659.25, duration: 0.3 }, // E5
        { note: 783.99, duration: 0.3 }, // G5
        { note: 880.00, duration: 0.3 }, // A5
        { note: 783.99, duration: 0.6 }, // G5

        // "To train them is my cause"
        { note: 659.25, duration: 0.3 }, // E5
        { note: 587.33, duration: 0.3 }, // D5
        { note: 523.25, duration: 0.6 }, // C5
        { note: 587.33, duration: 0.9 }, // D5

        // "POKEMON!"
        { note: 783.99, duration: 0.4 }, // G5
        { note: 880.00, duration: 0.4 }, // A5
        { note: 987.77, duration: 0.8 }, // B5

        // "Gotta catch 'em all!"
        { note: 880.00, duration: 0.3 }, // A5
        { note: 783.99, duration: 0.3 }, // G5
        { note: 659.25, duration: 0.3 }, // E5
        { note: 783.99, duration: 0.9 }, // G5

        // Repeat "Gotta catch 'em all!"
        { note: 880.00, duration: 0.3 }, // A5
        { note: 783.99, duration: 0.3 }, // G5
        { note: 659.25, duration: 0.3 }, // E5
        { note: 587.33, duration: 0.9 }, // D5
    ];

    // Harmony line
    const harmony = [
        { note: 493.88, duration: 0.3 }, // B4
        { note: 493.88, duration: 0.3 }, // B4
        { note: 523.25, duration: 0.3 }, // C5
        { note: 659.25, duration: 0.3 }, // E5
        { note: 523.25, duration: 0.3 }, // C5
        { note: 493.88, duration: 0.6 }, // B4

        { note: 440.00, duration: 0.3 }, // A4
        { note: 493.88, duration: 0.3 }, // B4
        { note: 523.25, duration: 0.6 }, // C5
        { note: 493.88, duration: 0.6 }, // B4

        { note: 493.88, duration: 0.3 }, // B4
        { note: 493.88, duration: 0.3 }, // B4
        { note: 523.25, duration: 0.3 }, // C5
        { note: 659.25, duration: 0.3 }, // E5
        { note: 698.46, duration: 0.3 }, // F5
        { note: 659.25, duration: 0.6 }, // E5

        { note: 523.25, duration: 0.3 }, // C5
        { note: 493.88, duration: 0.3 }, // B4
        { note: 440.00, duration: 0.6 }, // A4
        { note: 493.88, duration: 0.9 }, // B4

        { note: 659.25, duration: 0.4 }, // E5
        { note: 698.46, duration: 0.4 }, // F5
        { note: 783.99, duration: 0.8 }, // G5

        { note: 698.46, duration: 0.3 }, // F5
        { note: 659.25, duration: 0.3 }, // E5
        { note: 523.25, duration: 0.3 }, // C5
        { note: 659.25, duration: 0.9 }, // E5

        { note: 698.46, duration: 0.3 }, // F5
        { note: 659.25, duration: 0.3 }, // E5
        { note: 523.25, duration: 0.3 }, // C5
        { note: 493.88, duration: 0.9 }, // B4
    ];

    // Energetic bass line
    const bass = [
        { note: 146.83, duration: 0.6 }, // D3
        { note: 146.83, duration: 0.6 }, // D3
        { note: 130.81, duration: 0.6 }, // C3
        { note: 130.81, duration: 0.6 }, // C3

        { note: 146.83, duration: 0.6 }, // D3
        { note: 146.83, duration: 0.6 }, // D3
        { note: 196.00, duration: 0.6 }, // G3
        { note: 146.83, duration: 0.6 }, // D3

        { note: 164.81, duration: 0.6 }, // E3
        { note: 164.81, duration: 0.6 }, // E3
        { note: 130.81, duration: 0.6 }, // C3
        { note: 130.81, duration: 0.6 }, // C3

        { note: 146.83, duration: 1.2 }, // D3
        { note: 196.00, duration: 1.2 }, // G3
    ];

    let currentTime = audioContext.currentTime;

    // Play main melody (square wave - like Game Boy pulse channel 1)
    melody.forEach((noteData) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(noteData.note, currentTime);

        gain.gain.setValueAtTime(0.1, currentTime);
        gain.gain.linearRampToValueAtTime(0.08, currentTime + noteData.duration * 0.5);
        gain.gain.linearRampToValueAtTime(0.02, currentTime + noteData.duration);

        osc.start(currentTime);
        osc.stop(currentTime + noteData.duration);

        currentTime += noteData.duration;
    });

    // Play harmony (square wave - like Game Boy pulse channel 2)
    let harmonyTime = audioContext.currentTime + 0.05; // Slight delay for richness
    harmony.forEach((noteData) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(noteData.note, harmonyTime);

        gain.gain.setValueAtTime(0.06, harmonyTime);
        gain.gain.linearRampToValueAtTime(0.05, harmonyTime + noteData.duration * 0.5);
        gain.gain.linearRampToValueAtTime(0.01, harmonyTime + noteData.duration);

        osc.start(harmonyTime);
        osc.stop(harmonyTime + noteData.duration);

        harmonyTime += noteData.duration;
    });

    // Play bass line (triangle wave - like Game Boy wave channel)
    let bassTime = audioContext.currentTime;
    bass.forEach((noteData) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteData.note, bassTime);

        gain.gain.setValueAtTime(0.12, bassTime);
        gain.gain.linearRampToValueAtTime(0.1, bassTime + noteData.duration * 0.7);
        gain.gain.linearRampToValueAtTime(0.02, bassTime + noteData.duration);

        osc.start(bassTime);
        osc.stop(bassTime + noteData.duration);

        bassTime += noteData.duration;
    });

    const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
    melodyTimeoutId = setTimeout(() => playSimpleMelody(), totalDuration * 1000 + 200);
}

// Game State
const game = {
    view: 'top', // 'top' or 'side'
    player: {
        x: 400,
        y: 300,
        width: 32,
        height: 32,
        speed: 3,
        level: 1,
        xp: 0,
        xpToLevel: 10,
        character: null,
        color: '#FF6B6B',
        animFrame: 0,
        lastX: 400,
        lastY: 300,
        trail: [] // Store previous positions for followers
    },
    coins: 0,
    masterBalls: 0,
    rareCandies: 0,
    eggs: [],
    hasFishingRod: false,
    fishing: false,
    fishingTimer: 0,
    berrySeeds: 0,
    berryTrees: [],
    inShop: false,
    inCave: false,
    weather: 'sunny',
    weatherTimer: 0,
    raindrops: [],
    snowflakes: [],
    timeOfDay: 'day',
    dayTimer: 0,
    pokemon: [],
    caughtPokemon: [],
    typeCoins: [],
    masterBallItems: [],
    rareCandyItems: [],
    eggItems: [],
    fishingRodItem: null,
    berrySeedItems: [],
    shop: null,
    caveEntrance: null,
    cavePokemons: [],
    buildings: [],
    obstacles: [],
    particles: [],
    fallingFruit: [],
    keys: {},
    clickTarget: null,
    worldOffset: { x: 0, y: 0 },
    frameCount: 0,
    inBattle: false,
    battleState: null
};

// Character options
const characters = [
    { name: 'Girl 1', type: 'girl', color: '#FF69B4' },
    { name: 'Girl 2', type: 'girl', color: '#9370DB' },
    { name: 'Girl 3', type: 'girl', color: '#FFB6C1' },
    { name: 'Boy 1', type: 'boy', color: '#4169E1' },
    { name: 'Boy 2', type: 'boy', color: '#228B22' },
    { name: 'Boy 3', type: 'boy', color: '#FF8C00' }
];

// Pokemon data with types and sizes
const pokemonTypes = {
    'Pikachu': { type: 'electric', color: '#FFD700', size: 'small' },
    'Eevee': { type: 'normal', color: '#D2B48C', size: 'small' },
    'Charmander': { type: 'fire', color: '#FF4500', size: 'small' },
    'Squirtle': { type: 'water', color: '#4682B4', size: 'small' },
    'Bulbasaur': { type: 'grass', color: '#32CD32', size: 'small' },
    'Dragonite': { type: 'dragon', color: '#FF8C00', size: 'huge' },
    'Jigglypuff': { type: 'fairy', color: '#FFB6C1', size: 'small' },
    'Psyduck': { type: 'water', color: '#FFD700', size: 'medium' },
    'Geodude': { type: 'rock', color: '#8B7355', size: 'medium' },
    'Vulpix': { type: 'fire', color: '#FF6347', size: 'small' },
    'Oddish': { type: 'grass', color: '#9ACD32', size: 'small' },
    'Machop': { type: 'fighting', color: '#CD853F', size: 'medium' },
    'Gastly': { type: 'ghost', color: '#9370DB', size: 'medium' },
    'Magnemite': { type: 'electric', color: '#C0C0C0', size: 'small' },
    'Snorlax': { type: 'normal', color: '#2F4F4F', size: 'huge' },
    'Koffing': { type: 'poison', color: '#9966CC', size: 'medium' },
    'Goldeen': { type: 'water', color: '#FF9933', size: 'small' },
    'Raichu': { type: 'electric', color: '#FFA500', size: 'medium' },
    'Charmeleon': { type: 'fire', color: '#FF6347', size: 'medium' },
    'Charizard': { type: 'fire', color: '#FF4500', size: 'huge' },
    'Wartortle': { type: 'water', color: '#4682B4', size: 'medium' },
    'Blastoise': { type: 'water', color: '#0000CD', size: 'huge' },
    'Ivysaur': { type: 'grass', color: '#228B22', size: 'medium' },
    'Venusaur': { type: 'grass', color: '#006400', size: 'huge' },
    'Seaking': { type: 'water', color: '#FF6347', size: 'medium' },
    'Graveler': { type: 'rock', color: '#696969', size: 'medium' },
    'Golem': { type: 'rock', color: '#2F4F4F', size: 'huge' },
    'Haunter': { type: 'ghost', color: '#8B008B', size: 'medium' },
    'Gengar': { type: 'ghost', color: '#4B0082', size: 'medium' },
    'Machoke': { type: 'fighting', color: '#A0522D', size: 'medium' },
    'Machamp': { type: 'fighting', color: '#8B4513', size: 'huge' },
    'Mewtwo': { type: 'psychic', color: '#9370DB', size: 'huge' },
    'Lugia': { type: 'psychic', color: '#C0C0C0', size: 'huge' },
    'Ho-Oh': { type: 'fire', color: '#FFD700', size: 'huge' },
    'Rayquaza': { type: 'dragon', color: '#00FF00', size: 'huge' },
    'Articuno': { type: 'ice', color: '#00BFFF', size: 'huge' },
    'Zapdos': { type: 'electric', color: '#FFD700', size: 'huge' },
    'Moltres': { type: 'fire', color: '#FF4500', size: 'huge' },
    'Kyogre': { type: 'water', color: '#0000CD', size: 'huge' },
    'Groudon': { type: 'ground', color: '#DC143C', size: 'huge' }
};

// Pokemon Evolution Map - shows what evolves into what and at what level!
const evolutionMap = {
    'Charmander': { evolves: 'Charmeleon', level: 16 },
    'Charmeleon': { evolves: 'Charizard', level: 36 },
    'Squirtle': { evolves: 'Wartortle', level: 16 },
    'Wartortle': { evolves: 'Blastoise', level: 36 },
    'Bulbasaur': { evolves: 'Ivysaur', level: 16 },
    'Ivysaur': { evolves: 'Venusaur', level: 36 },
    'Pikachu': { evolves: 'Raichu', level: 20 },
    'Goldeen': { evolves: 'Seaking', level: 33 },
    'Geodude': { evolves: 'Graveler', level: 25 },
    'Graveler': { evolves: 'Golem', level: 40 },
    'Gastly': { evolves: 'Haunter', level: 25 },
    'Haunter': { evolves: 'Gengar', level: 40 },
    'Machop': { evolves: 'Machoke', level: 28 },
    'Machoke': { evolves: 'Machamp', level: 40 }
};

// Moves for each Pokemon type
const typeMoves = {
    'fire': [
        { name: 'Flame Burst', damage: 15, effect: 'strong' },
        { name: 'Ember', damage: 10, effect: 'normal' },
        { name: 'Fire Spin', damage: 12, effect: 'normal' }
    ],
    'water': [
        { name: 'Aqua Jet', damage: 15, effect: 'strong' },
        { name: 'Bubble', damage: 10, effect: 'normal' },
        { name: 'Water Gun', damage: 12, effect: 'normal' }
    ],
    'grass': [
        { name: 'Vine Whip', damage: 15, effect: 'strong' },
        { name: 'Absorb', damage: 10, effect: 'heal' },
        { name: 'Razor Leaf', damage: 12, effect: 'normal' }
    ],
    'electric': [
        { name: 'Thunder Shock', damage: 15, effect: 'strong' },
        { name: 'Spark', damage: 10, effect: 'normal' },
        { name: 'Thunder Wave', damage: 8, effect: 'stun' }
    ],
    'normal': [
        { name: 'Tackle', damage: 12, effect: 'normal' },
        { name: 'Quick Attack', damage: 10, effect: 'normal' },
        { name: 'Body Slam', damage: 15, effect: 'strong' }
    ],
    'dragon': [
        { name: 'Dragon Rage', damage: 20, effect: 'strong' },
        { name: 'Dragon Breath', damage: 15, effect: 'normal' },
        { name: 'Twister', damage: 12, effect: 'normal' }
    ],
    'fairy': [
        { name: 'Fairy Wind', damage: 12, effect: 'normal' },
        { name: 'Charm', damage: 8, effect: 'weak' },
        { name: 'Moonblast', damage: 15, effect: 'strong' }
    ],
    'rock': [
        { name: 'Rock Throw', damage: 15, effect: 'strong' },
        { name: 'Rock Smash', damage: 12, effect: 'normal' },
        { name: 'Stone Edge', damage: 18, effect: 'strong' }
    ],
    'fighting': [
        { name: 'Karate Chop', damage: 15, effect: 'strong' },
        { name: 'Low Kick', damage: 10, effect: 'normal' },
        { name: 'Dynamic Punch', damage: 18, effect: 'strong' }
    ],
    'ghost': [
        { name: 'Shadow Ball', damage: 15, effect: 'strong' },
        { name: 'Lick', damage: 10, effect: 'normal' },
        { name: 'Night Shade', damage: 12, effect: 'normal' }
    ],
    'poison': [
        { name: 'Sludge Bomb', damage: 16, effect: 'strong' },
        { name: 'Poison Gas', damage: 10, effect: 'normal' },
        { name: 'Acid', damage: 12, effect: 'normal' }
    ],
    'psychic': [
        { name: 'Psychic', damage: 20, effect: 'strong' },
        { name: 'Confusion', damage: 12, effect: 'normal' },
        { name: 'Psybeam', damage: 15, effect: 'strong' }
    ],
    'ice': [
        { name: 'Ice Beam', damage: 18, effect: 'strong' },
        { name: 'Blizzard', damage: 22, effect: 'strong' },
        { name: 'Powder Snow', damage: 10, effect: 'normal' }
    ],
    'ground': [
        { name: 'Earthquake', damage: 25, effect: 'strong' },
        { name: 'Dig', damage: 15, effect: 'normal' },
        { name: 'Mud Bomb', damage: 12, effect: 'normal' }
    ]
};

// Type coin colors
const typeColors = {
    'fire': '#FF4500',
    'water': '#4682B4',
    'grass': '#32CD32',
    'electric': '#FFD700',
    'normal': '#D2B48C',
    'dragon': '#FF8C00',
    'fairy': '#FFB6C1',
    'rock': '#8B7355',
    'fighting': '#CD853F',
    'ghost': '#9370DB',
    'poison': '#9966CC',
    'psychic': '#FF1493',
    'ice': '#87CEEB',
    'ground': '#CD853F'
};

// World biomes
const biomes = [
    { name: 'Meadow', x: 0, y: 0, width: 1200, height: 1200, color: '#90EE90' },
    { name: 'Beach', x: 1200, y: 0, width: 1200, height: 1200, color: '#F4A460' },
    { name: 'Forest', x: 0, y: 1200, width: 1200, height: 1200, color: '#228B22' },
    { name: 'Volcano', x: 1200, y: 1200, width: 1200, height: 1200, color: '#8B4513' }
];

// Helper function to darken colors
function darkenColor(hexColor, amount) {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Darken by reducing RGB values
    const newR = Math.max(0, Math.floor(r * (1 - amount)));
    const newG = Math.max(0, Math.floor(g * (1 - amount)));
    const newB = Math.max(0, Math.floor(b * (1 - amount)));

    // Convert back to hex
    const toHex = (val) => val.toString(16).padStart(2, '0');
    return '#' + toHex(newR) + toHex(newG) + toHex(newB);
}

// Helper function to make shiny colors - makes them sparkly and different!
function getShinyColor(hexColor) {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Shiny Pokemon get shifted colors - swap color channels for unique look!
    const newR = Math.min(255, Math.floor(g * 1.2));
    const newG = Math.min(255, Math.floor(b * 1.2));
    const newB = Math.min(255, Math.floor(r * 1.2));

    // Convert back to hex
    const toHex = (val) => val.toString(16).padStart(2, '0');
    return '#' + toHex(newR) + toHex(newG) + toHex(newB);
}

// Character selection
function setupCharacterSelect() {
    const container = document.getElementById('characterOptions');
    characters.forEach((char, index) => {
        const div = document.createElement('div');
        div.className = 'character-option';
        div.innerHTML = `
            <div style="background: ${char.color}; width: 80px; height: 80px; border-radius: 50%; border: 3px solid #333; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                ${char.name}
            </div>
        `;
        div.onclick = () => startGame(char);
        container.appendChild(div);
    });
}

function startGame(character) {
    game.player.character = character;
    game.player.color = character.color;

    document.getElementById('characterSelect').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('ui').style.display = 'block';
    document.getElementById('controls').style.display = 'block';

    // Try to load saved game first
    const loaded = loadGame();
    if (!loaded) {
        // No save found, start new game
        initGame();
    }

    gameLoop();

    // Start background music
    startMusic();

    // Auto-save every 10 seconds
    setInterval(saveGame, 10000);
}

function initGame() {
    // Spawn obstacles (trees, bushes, rocks, flowers)
    const obstacleTypes = [
        { type: 'tree', color: '#228B22', width: 40, height: 60 },
        { type: 'bush', color: '#90EE90', width: 30, height: 25 },
        { type: 'rock', color: '#808080', width: 35, height: 35 },
        { type: 'flower', color: '#FFB6C1', width: 15, height: 15 }
    ];

    for (let i = 0; i < 100; i++) {
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        const obsType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        const obstacle = {
            type: obsType.type,
            color: obsType.color,
            x: biome.x + Math.random() * biome.width,
            y: biome.y + Math.random() * biome.height,
            width: obsType.width,
            height: obsType.height,
            solid: obsType.type !== 'flower', // flowers you can walk through
            biome: biome.name
        };
        game.obstacles.push(obstacle);
    }

    // Add more trees to the forest
    const forestBiome = biomes.find(b => b.name === 'Forest');
    for (let i = 0; i < 40; i++) {
        game.obstacles.push({
            type: 'tree',
            color: '#228B22',
            x: forestBiome.x + Math.random() * forestBiome.width,
            y: forestBiome.y + Math.random() * forestBiome.height,
            width: 40,
            height: 60,
            solid: true,
            biome: 'Forest'
        });
    }

    // Add palm trees to the beach
    const beachBiome = biomes.find(b => b.name === 'Beach');
    for (let i = 0; i < 25; i++) {
        const hasBananas = Math.random() > 0.5;
        game.obstacles.push({
            type: 'palm',
            color: '#8B4513',
            x: beachBiome.x + Math.random() * beachBiome.width,
            y: beachBiome.y + Math.random() * beachBiome.height,
            width: 40,
            height: 70,
            solid: true,
            biome: 'Beach',
            fruit: hasBananas ? 'banana' : 'coconut'
        });
    }

    // Spawn Pokemon across different biomes
    // Separate legendaries from regular Pokemon
    const legendaryPokemon = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Rayquaza', 'Articuno', 'Zapdos', 'Moltres', 'Kyogre', 'Groudon'];
    const regularPokemon = Object.keys(pokemonTypes).filter(name => !legendaryPokemon.includes(name));

    // Spawn regular Pokemon
    for (let i = 0; i < 30; i++) {
        const pokemonName = regularPokemon[Math.floor(Math.random() * regularPokemon.length)];
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        const pokemonData = pokemonTypes[pokemonName];

        // SHINY CHECK! 1 in 30 chance of being shiny!
        const isShiny = Math.random() < 1/30;

        // Set size and HP based on Pokemon
        let size = 30;
        let maxHp = 50;
        if (pokemonData.size === 'small') {
            size = 25;
            maxHp = 40; // Small Pokemon have less HP
        } else if (pokemonData.size === 'medium') {
            size = 35;
            maxHp = 60; // Medium Pokemon have more HP
        } else if (pokemonData.size === 'huge') {
            size = 55;
            maxHp = 100; // HUGE Pokemon have LOTS of HP!
        }

        // Shiny Pokemon get a special color!
        let pokemonColor = pokemonData.color;
        if (isShiny) {
            // Make shiny color - lighter and more saturated!
            pokemonColor = getShinyColor(pokemonData.color);
        }

        game.pokemon.push({
            name: pokemonName,
            type: pokemonData.type,
            color: pokemonColor,
            size: pokemonData.size,
            x: biome.x + Math.random() * biome.width,
            y: biome.y + Math.random() * biome.height,
            width: size,
            height: size,
            injured: true,
            level: 1,
            animFrame: 0,
            hp: maxHp,
            maxHp: maxHp,
            attack: 10,
            shiny: isShiny
        });
    }

    // Spawn SUPER RARE legendary Pokemon (only 2-3 in the whole world!)
    const numLegendaries = 2 + Math.floor(Math.random() * 2); // 2 or 3 legendaries
    for (let i = 0; i < numLegendaries; i++) {
        const legendaryName = legendaryPokemon[Math.floor(Math.random() * legendaryPokemon.length)];
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        const pokemonData = pokemonTypes[legendaryName];

        game.pokemon.push({
            name: legendaryName,
            type: pokemonData.type,
            color: pokemonData.color,
            size: pokemonData.size,
            x: biome.x + Math.random() * biome.width,
            y: biome.y + Math.random() * biome.height,
            width: 55,
            height: 55,
            injured: true,
            level: 10, // Legendaries start at level 10!
            animFrame: 0,
            hp: 150, // Legendaries have 150 HP!
            maxHp: 150,
            attack: 25
        });
    }

    // Spawn type coins
    const types = Object.keys(typeColors);
    for (let i = 0; i < 50; i++) {
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        game.typeCoins.push({
            type: types[Math.floor(Math.random() * types.length)],
            x: biome.x + Math.random() * biome.width,
            y: biome.y + Math.random() * biome.height,
            width: 20,
            height: 20
        });
    }

    // Spawn SUPER RARE Master Balls (only 1-2 in the whole world!)
    const numMasterBalls = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numMasterBalls; i++) {
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        game.masterBallItems.push({
            x: biome.x + Math.random() * biome.width,
            y: biome.y + Math.random() * biome.height,
            width: 25,
            height: 25
        });
    }

    // Spawn Rare Candies (5-8 in the world!)
    const numRareCandies = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numRareCandies; i++) {
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        game.rareCandyItems.push({
            x: biome.x + Math.random() * biome.width,
            y: biome.y + Math.random() * biome.height,
            width: 20,
            height: 20
        });
    }

    // Spawn Pokemon Eggs (3-5 in the world!)
    const numEggs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numEggs; i++) {
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        const eggColors = ['#FFEBCD', '#F0E68C', '#E0FFFF', '#FFE4E1', '#E6E6FA'];
        game.eggItems.push({
            x: biome.x + Math.random() * biome.width,
            y: biome.y + Math.random() * biome.height,
            width: 25,
            height: 30,
            color: eggColors[Math.floor(Math.random() * eggColors.length)]
        });
    }

    // Spawn Fishing Rod (on the beach!)
    const beach = biomes.find(b => b.name === 'Beach');
    game.fishingRodItem = {
        x: beach.x + beach.width / 2,
        y: beach.y + beach.height / 2,
        width: 30,
        height: 30
    };

    // Spawn Berry Seeds (3-5 in the world!)
    const numBerrySeeds = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numBerrySeeds; i++) {
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        game.berrySeedItems.push({
            x: biome.x + Math.random() * biome.width,
            y: biome.y + Math.random() * biome.height,
            width: 15,
            height: 15
        });
    }

    // Spawn Shop (in the Meadow!)
    const meadow = biomes.find(b => b.name === 'Meadow');
    game.shop = {
        x: meadow.x + 200,
        y: meadow.y + 200,
        width: 60,
        height: 60,
        color: '#FFD700'
    };

    // Spawn Secret Cave (in the Forest!)
    const forest = biomes.find(b => b.name === 'Forest');
    game.caveEntrance = {
        x: forest.x + 800,
        y: forest.y + 900,
        width: 80,
        height: 60,
        color: '#2F4F4F'
    };

    // Spawn rare Pokemon inside the cave (only accessible when inside!)
    const rarePokemon = ['Dragonite', 'Snorlax', 'Gengar', 'Machamp'];
    for (let i = 0; i < 5; i++) {
        const pokemonName = rarePokemon[Math.floor(Math.random() * rarePokemon.length)];
        const pokemonData = pokemonTypes[pokemonName];
        const isShiny = Math.random() < 1/15; // Better shiny chance in cave!

        game.cavePokemons.push({
            name: pokemonName,
            type: pokemonData.type,
            color: isShiny ? getShinyColor(pokemonData.color) : pokemonData.color,
            size: pokemonData.size,
            x: 400 + Math.random() * 600,
            y: 300 + Math.random() * 400,
            width: 55,
            height: 55,
            injured: true,
            level: 10,
            animFrame: 0,
            hp: 100,
            maxHp: 100,
            attack: 20,
            shiny: isShiny
        });
    }
}

// Battle System Functions - Defined early so they can be used anywhere
function startBattle(wildPokemon, pokemonIndex) {
    if (game.caughtPokemon.length === 0) {
        alert('You need to catch a Pokemon first before you can battle!');
        return;
    }

    // Let player choose which Pokemon to use
    let pokemonChoice = 0;
    if (game.caughtPokemon.length > 1) {
        const list = game.caughtPokemon.map((p, i) =>
            `${i + 1}. ${p.name} (Level ${p.level}) HP: ${p.hp || p.maxHp}/${p.maxHp || 50}`
        ).join('\n');

        const choice = prompt(`Choose your Pokemon:\n\n${list}\n\nEnter a number (1-${game.caughtPokemon.length}):`);

        // Check if user clicked Cancel or didn't enter anything
        if (choice === null || choice === '') {
            // User cancelled, use first Pokemon
            pokemonChoice = 0;
        } else {
            const num = parseInt(choice);

            if (!isNaN(num) && num >= 1 && num <= game.caughtPokemon.length) {
                pokemonChoice = num - 1;
            } else {
                alert('Invalid choice! Using first Pokemon.');
                pokemonChoice = 0;
            }
        }
    }

    game.inBattle = true;
    const playerPokemon = game.caughtPokemon[pokemonChoice];

    // Get moves for this Pokemon type
    const playerMoves = typeMoves[playerPokemon.type] || typeMoves['normal'];

    game.battleState = {
        wildPokemon: wildPokemon,
        wildPokemonIndex: pokemonIndex,
        playerPokemon: playerPokemon,
        playerPokemonIndex: pokemonChoice,
        playerHp: playerPokemon.hp || playerPokemon.maxHp || 50,
        wildHp: wildPokemon.hp || wildPokemon.maxHp || 50,
        playerMaxHp: playerPokemon.maxHp || 50,
        wildMaxHp: wildPokemon.maxHp || 50,
        message: `Wild ${wildPokemon.name} appeared!`,
        canAct: true,
        playerMoves: playerMoves,
        showMoves: false,
        animation: null,
        animFrame: 0
    };
}

function peacefulCatch(pokemon, index) {
    const catchChance = Math.min(0.6 + (game.player.level * 0.05), 0.95);

    if (Math.random() < catchChance) {
        // Success! Create particle explosion
        for (let i = 0; i < 20; i++) {
            game.particles.push({
                x: pokemon.x + pokemon.width / 2,
                y: pokemon.y + pokemon.height / 2,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: pokemon.color,
                life: 30
            });
        }

        pokemon.level = game.player.level;
        pokemon.hp = pokemon.maxHp || 50;
        pokemon.maxHp = pokemon.maxHp || 50;
        pokemon.attack = 10;
        game.caughtPokemon.push(pokemon);
        game.pokemon.splice(index, 1);
        playSound('catch');

        const xpGain = pokemon.shiny ? 5 : 1; // BONUS XP for shinies!
        game.player.xp += xpGain;
        if (game.player.xp >= game.player.xpToLevel) {
            levelUp();
        }

        if (pokemon.shiny) {
            alert(`✨ WOW! You peacefully collected a SHINY ${pokemon.name}! ✨`);
        }
    } else {
        // Failed - move pokemon away
        pokemon.x += (Math.random() - 0.5) * 100;
        pokemon.y += (Math.random() - 0.5) * 100;
    }
}

// Input handling - Event listeners will be set up at the end of file

// Cooldown system to prevent rapid duplicate triggers
let buttonCooldowns = {
    switchView: 0,
    buildMenu: 0,
    pokemonList: 0,
    saveGame: 0
};

function switchView() {
    const now = Date.now();
    if (now - buttonCooldowns.switchView < 500) return; // 500ms cooldown
    buttonCooldowns.switchView = now;

    game.view = game.view === 'top' ? 'side' : 'top';
    document.getElementById('viewMode').textContent = game.view === 'top' ? 'Top' : 'Side';
}

function openBuildMenu() {
    const now = Date.now();
    if (now - buttonCooldowns.buildMenu < 500) return;
    buttonCooldowns.buildMenu = now;

    const options = `
Building Menu:
- House (10 coins)
- Trap (5 coins)
- Pokemon Clinic (20 coins) - Heals injured Pokemon!
- Pokemon Gym (30 coins) - Train Pokemon to level up!

Press 'H' to build a house at your location
Press 'T' to build a trap at your location
Press 'C' to build a Pokemon Clinic at your location
Press 'G' to build a Pokemon Gym at your location
    `;
    alert(options);
}

function openPokemonList() {
    const now = Date.now();
    if (now - buttonCooldowns.pokemonList < 500) return;
    buttonCooldowns.pokemonList = now;

    if (game.caughtPokemon.length === 0) {
        alert('No Pokemon caught yet! Go find some injured Pokemon to rescue!');
        return;
    }

    const list = game.caughtPokemon.map((p, i) =>
        `${i + 1}. ${p.name} (${p.type}) - Level ${p.level}`
    ).join('\n');

    alert(`Your Pokemon Collection:\n\n${list}`);
}

// Update game state
function update() {
    game.frameCount++;

    // Update weather system
    game.weatherTimer++;
    if (game.weatherTimer > 600) { // Change weather every ~10 seconds
        const weathers = ['sunny', 'rain', 'snow'];
        game.weather = weathers[Math.floor(Math.random() * weathers.length)];
        game.weatherTimer = 0;
        game.raindrops = [];
        game.snowflakes = [];
    }

    // Create rain/snow particles
    if (game.weather === 'rain' && game.frameCount % 2 === 0) {
        game.raindrops.push({
            x: Math.random() * canvas.width,
            y: -10,
            speed: 8 + Math.random() * 4
        });
    } else if (game.weather === 'snow' && game.frameCount % 3 === 0) {
        game.snowflakes.push({
            x: Math.random() * canvas.width,
            y: -10,
            speed: 2 + Math.random() * 2,
            drift: Math.random() * 2 - 1
        });
    }

    // Update weather particles
    game.raindrops = game.raindrops.filter(drop => {
        drop.y += drop.speed;
        return drop.y < canvas.height;
    });
    game.snowflakes = game.snowflakes.filter(flake => {
        flake.y += flake.speed;
        flake.x += flake.drift;
        return flake.y < canvas.height;
    });

    // Update day/night cycle
    game.dayTimer++;
    if (game.dayTimer > 1200) { // Change time every ~20 seconds
        game.timeOfDay = game.timeOfDay === 'day' ? 'night' : 'day';
        game.dayTimer = 0;
    }

    // Store old position for collision checking
    const oldX = game.player.x;
    const oldY = game.player.y;

    // Arrow key movement
    if (game.keys['arrowup'] || game.keys['w']) {
        game.player.y -= game.player.speed;
    }
    if (game.keys['arrowdown'] || game.keys['s']) {
        game.player.y += game.player.speed;
    }
    if (game.keys['arrowleft'] || game.keys['a']) {
        game.player.x -= game.player.speed;
    }
    if (game.keys['arrowright'] || game.keys['d']) {
        game.player.x += game.player.speed;
    }

    // Click movement
    if (game.clickTarget) {
        const dx = game.clickTarget.x - game.player.x;
        const dy = game.clickTarget.y - game.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
            game.player.x += (dx / dist) * game.player.speed;
            game.player.y += (dy / dist) * game.player.speed;
        } else {
            game.clickTarget = null;
        }
    }

    // Check collision with obstacles
    game.obstacles.forEach(obs => {
        if (obs.solid && checkCollision(game.player, obs)) {
            // Push player back
            game.player.x = oldX;
            game.player.y = oldY;

            // If it's a palm tree with fruit, make fruit fall
            if (obs.type === 'palm' && obs.fruit && !obs.fruitFallen) {
                const numFruits = obs.fruit === 'coconut' ? 3 : 4;
                for (let i = 0; i < numFruits; i++) {
                    game.fallingFruit.push({
                        x: obs.x + 12 + i * 5 + Math.random() * 5,
                        y: obs.y + 25,
                        velocityY: 0,
                        velocityX: (Math.random() - 0.5) * 3,
                        type: obs.fruit,
                        size: obs.fruit === 'coconut' ? 8 : 6
                    });
                }
                obs.fruitFallen = true;
                playSound('fruit');
            } else {
                playSound('bump');
            }
        }
    });

    // Update player animation and trail
    if (game.player.x !== oldX || game.player.y !== oldY) {
        game.player.animFrame = (game.frameCount / 10) % 2;

        // Record position in trail every few frames
        if (game.frameCount % 3 === 0) {
            game.player.trail.unshift({ x: game.player.x, y: game.player.y });

            // Keep trail length limited (3 Pokemon can follow)
            const maxTrailLength = game.caughtPokemon.length * 15;
            if (game.player.trail.length > maxTrailLength) {
                game.player.trail.pop();
            }
        }
    } else {
        game.player.animFrame = 0;
    }

    // Building shortcuts
    if (game.keys['h']) {
        buildHouse();
        game.keys['h'] = false;
    }
    if (game.keys['t']) {
        buildTrap();
        game.keys['t'] = false;
    }
    if (game.keys['c']) {
        buildClinic();
        game.keys['c'] = false;
    }
    if (game.keys['g']) {
        buildGym();
        game.keys['g'] = false;
    }
    if (game.keys['r']) {
        useRareCandy();
        game.keys['r'] = false;
    }
    if (game.keys['s']) {
        saveGame();
        alert('Game saved! ✅');
        game.keys['s'] = false;
    }
    if (game.keys['f']) {
        // Try to fish!
        if (!game.hasFishingRod) {
            alert('You need a Fishing Rod first! Look for it on the Beach!');
        } else {
            // Check if player is on the beach
            const beach = biomes.find(b => b.name === 'Beach');
            if (game.player.x >= beach.x && game.player.x <= beach.x + beach.width &&
                game.player.y >= beach.y && game.player.y <= beach.y + beach.height) {
                game.fishing = true;
                game.fishingTimer = 0;
                alert('Fishing... 🎣');
            } else {
                alert('You need to be near water (Beach) to fish!');
            }
        }
        game.keys['f'] = false;
    }
    if (game.keys['p'] && game.berrySeeds > 0) {
        // Plant a berry tree!
        game.berrySeeds--;
        game.berryTrees.push({
            x: game.player.x,
            y: game.player.y,
            growthStage: 0, // 0=seed, 1=sprout, 2=sapling, 3=tree with berries
            growthTimer: 0,
            hasBerries: false,
            width: 40,
            height: 40
        });
        playSound('heal');
        alert('Berry tree planted! It will grow in ~15 seconds! 🌱');
        updateUI();
        game.keys['p'] = false;
    }
    if (game.keys['m']) {
        // Money cheat! Give lots of coins!
        game.coins += 100;
        playSound('coin');
        alert('💰 +100 coins! You now have ' + game.coins + ' coins! 💰');
        updateUI();
        game.keys['m'] = false;
    }

    // Check collision with berry trees to harvest berries
    game.berryTrees.forEach(tree => {
        if (tree.hasBerries && checkCollision(game.player, tree)) {
            tree.hasBerries = false;
            game.coins += 5;
            playSound('coin');
            alert('You harvested berries! +5 coins! 🍓');
            updateUI();
        }
    });

    // Check collision with Shop
    if (game.shop && checkCollision(game.player, game.shop) && !game.inShop) {
        game.inShop = true;
        openShop();
    }

    // Check collision with Cave Entrance
    if (game.caveEntrance && checkCollision(game.player, game.caveEntrance) && !game.inCave) {
        const enterCave = confirm('Enter the Secret Cave? (Rare Pokemon inside!)');
        if (enterCave) {
            game.inCave = true;
            game.player.x = 600;
            game.player.y = 500;
            alert('You entered the Secret Cave! 🕳️ Press E to exit.');
        }
    }

    // Exit cave
    if (game.keys['e'] && game.inCave) {
        game.inCave = false;
        const forest = biomes.find(b => b.name === 'Forest');
        game.player.x = forest.x + 800;
        game.player.y = forest.y + 850;
        alert('You left the cave!');
        game.keys['e'] = false;
    }

    // Check collisions with Pokemon - bump starts battle!
    const pokemonToCheck = game.inCave ? game.cavePokemons : game.pokemon;
    if (!game.inBattle) {
        pokemonToCheck.forEach((pokemon, index) => {
            if (checkCollision(game.player, pokemon)) {
                if (game.caughtPokemon.length === 0) {
                    // No Pokemon yet, so peacefully collect this one
                    peacefulCatch(pokemon, index);
                } else {
                    // Have Pokemon, so start a battle!
                    startBattle(pokemon, index);
                }
            }
        });
    }

    // Check collisions with type coins
    game.typeCoins.forEach((coin, index) => {
        if (checkCollision(game.player, coin)) {
            collectCoin(coin, index);
        }
    });

    // Check collisions with Master Balls
    game.masterBallItems.forEach((ball, index) => {
        if (checkCollision(game.player, ball)) {
            game.masterBalls++;
            game.masterBallItems.splice(index, 1);
            playSound('catch');
            // Show particles
            for (let i = 0; i < 20; i++) {
                game.particles.push({
                    x: ball.x + ball.width / 2,
                    y: ball.y + ball.height / 2,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    color: '#9370DB',
                    life: 30
                });
            }
            alert('You found a Master Ball! Use it to catch legendaries!');
            updateUI();
        }
    });

    // Check collisions with Rare Candies
    game.rareCandyItems.forEach((candy, index) => {
        if (checkCollision(game.player, candy)) {
            game.rareCandies++;
            game.rareCandyItems.splice(index, 1);
            playSound('coin');
            // Show particles
            for (let i = 0; i < 20; i++) {
                game.particles.push({
                    x: candy.x + candy.width / 2,
                    y: candy.y + candy.height / 2,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    color: '#FF69B4',
                    life: 30
                });
            }
            alert('You found a Rare Candy! Press R to use it and level up a Pokemon!');
            updateUI();
        }
    });

    // Check collisions with Eggs
    game.eggItems.forEach((egg, index) => {
        if (checkCollision(game.player, egg)) {
            // Pick up the egg!
            game.eggs.push({
                color: egg.color,
                steps: 0,
                stepsToHatch: 100 + Math.floor(Math.random() * 100) // 100-200 steps
            });
            game.eggItems.splice(index, 1);
            playSound('catch');
            // Show particles
            for (let i = 0; i < 30; i++) {
                game.particles.push({
                    x: egg.x + egg.width / 2,
                    y: egg.y + egg.height / 2,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    color: egg.color,
                    life: 40
                });
            }
            alert('You found a Pokemon Egg! Walk around to hatch it!');
            updateUI();
        }
    });

    // Check collision with Fishing Rod
    if (game.fishingRodItem && checkCollision(game.player, game.fishingRodItem)) {
        game.hasFishingRod = true;
        game.fishingRodItem = null;
        playSound('catch');
        alert('You found a Fishing Rod! Press F near water to fish for Pokemon! 🎣');
        updateUI();
    }

    // Check collision with Berry Seeds
    game.berrySeedItems.forEach((seed, index) => {
        if (checkCollision(game.player, seed)) {
            game.berrySeeds++;
            game.berrySeedItems.splice(index, 1);
            playSound('coin');
            alert('You found Berry Seeds! Press P to plant them! 🌱');
            updateUI();
        }
    });

    // Update berry trees - they grow over time!
    game.berryTrees.forEach(tree => {
        if (tree.growthStage < 3) {
            tree.growthTimer++;
            if (tree.growthTimer >= 300) { // Grow every 5 seconds
                tree.growthStage++;
                tree.growthTimer = 0;
                if (tree.growthStage === 3) {
                    tree.hasBerries = true;
                }
            }
        }
    });

    // Update fishing
    if (game.fishing) {
        game.fishingTimer++;
        if (game.fishingTimer > 120) { // 2 seconds
            game.fishing = false;
            game.fishingTimer = 0;

            // Catch a water Pokemon!
            const waterPokemon = ['Squirtle', 'Psyduck', 'Goldeen'];
            const pokemonName = waterPokemon[Math.floor(Math.random() * waterPokemon.length)];
            const pokemonData = pokemonTypes[pokemonName];
            const isShiny = Math.random() < 1/25; // Slightly better shiny chance when fishing!

            const newPokemon = {
                name: pokemonName,
                type: pokemonData.type,
                color: isShiny ? getShinyColor(pokemonData.color) : pokemonData.color,
                size: pokemonData.size,
                width: 25,
                height: 25,
                level: 1,
                hp: 50,
                maxHp: 50,
                attack: 10,
                shiny: isShiny,
                x: game.player.x,
                y: game.player.y
            };

            game.caughtPokemon.push(newPokemon);
            playSound('catch');
            updateUI();

            if (isShiny) {
                alert(`🎣✨ You fished up a SHINY ${pokemonName}! ✨🎣`);
            } else {
                alert(`🎣 You fished up a ${pokemonName}! 🎣`);
            }
        }
    }

    // Update egg steps when player moves
    const playerMoved = game.player.x !== game.player.lastX || game.player.y !== game.player.lastY;
    if (playerMoved) {
        game.eggs.forEach((egg, index) => {
            if (egg.steps < egg.stepsToHatch) {
                egg.steps++;

                // Check if egg is ready to hatch!
                if (egg.steps >= egg.stepsToHatch) {
                    hatchEgg(index);
                }
            }
        });
    }

    // Check collisions with buildings (clinics heal Pokemon!)
    game.buildings.forEach(building => {
        if (checkCollision(game.player, building)) {
            if (building.type === 'clinic' && !building.justUsed) {
                // Heal all Pokemon!
                let healedAny = false;
                game.caughtPokemon.forEach(p => {
                    if (p.hp < p.maxHp) {
                        p.hp = p.maxHp;
                        healedAny = true;
                    }
                });

                if (healedAny) {
                    // Show healing particles
                    for (let i = 0; i < 30; i++) {
                        game.particles.push({
                            x: building.x + building.width / 2,
                            y: building.y + building.height / 2,
                            vx: (Math.random() - 0.5) * 5,
                            vy: (Math.random() - 0.5) * 5,
                            color: '#4CAF50',
                            life: 40
                        });
                    }
                    playSound('heal');
                    alert('All your Pokemon were healed! 💚');
                    building.justUsed = true;

                    // Reset the flag after a bit so you can use it again
                    setTimeout(() => {
                        building.justUsed = false;
                    }, 3000);
                } else {
                    if (!building.justUsed) {
                        alert('Your Pokemon are already at full health!');
                        building.justUsed = true;
                        setTimeout(() => {
                            building.justUsed = false;
                        }, 2000);
                    }
                }
            } else if (building.type === 'gym' && !building.justUsed) {
                // Train at the gym! All Pokemon gain XP
                if (game.caughtPokemon.length > 0) {
                    // Show training particles
                    for (let i = 0; i < 30; i++) {
                        game.particles.push({
                            x: building.x + building.width / 2,
                            y: building.y + building.height / 2,
                            vx: (Math.random() - 0.5) * 5,
                            vy: (Math.random() - 0.5) * 5,
                            color: '#FFD700',
                            life: 40
                        });
                    }

                    game.player.xp += 3;
                    let evolved = [];
                    game.caughtPokemon.forEach(p => {
                        p.level = Math.min(p.level + 1, 50);
                        if (checkEvolution(p)) {
                            evolved.push(p.name);
                        }
                    });

                    if (game.player.xp >= game.player.xpToLevel) {
                        levelUp();
                    }

                    playSound('heal');
                    if (evolved.length > 0) {
                        alert(`Your Pokemon trained at the gym! Pokemon evolved: ${evolved.join(', ')}! 💪🌟`);
                    } else {
                        alert('Your Pokemon trained at the gym! All Pokemon leveled up! 💪');
                    }
                    building.justUsed = true;

                    setTimeout(() => {
                        building.justUsed = false;
                    }, 5000);
                } else {
                    if (!building.justUsed) {
                        alert('You need Pokemon to train at the gym!');
                        building.justUsed = true;
                        setTimeout(() => {
                            building.justUsed = false;
                        }, 2000);
                    }
                }
            }
        }
    });

    // Update particles
    game.particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) {
            game.particles.splice(i, 1);
        }
    });

    // Update falling fruit
    game.fallingFruit.forEach((fruit, i) => {
        fruit.velocityY += 0.5; // gravity
        fruit.x += fruit.velocityX;
        fruit.y += fruit.velocityY;

        // Check if player catches the fruit
        const fruitObj = {
            x: fruit.x - fruit.size,
            y: fruit.y - fruit.size,
            width: fruit.size * 2,
            height: fruit.size * 2
        };

        if (checkCollision(game.player, fruitObj)) {
            game.coins += 2; // Get 2 coins for catching fruit
            game.fallingFruit.splice(i, 1);
            playSound('coin');
            updateUI();
        } else if (fruit.y > 3000) {
            // Remove fruit if it falls too far
            game.fallingFruit.splice(i, 1);
        }
    });

    // Animate Pokemon
    game.pokemon.forEach(p => {
        p.animFrame = (game.frameCount / 15) % 2;
    });

    updateUI();
}

function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// peacefulCatch function moved earlier in file

function collectCoin(coin, index) {
    game.coins++;
    game.typeCoins.splice(index, 1);
    playSound('coin');

    // Spawn new coin elsewhere
    const biome = biomes[Math.floor(Math.random() * biomes.length)];
    const types = Object.keys(typeColors);
    game.typeCoins.push({
        type: types[Math.floor(Math.random() * types.length)],
        x: biome.x + Math.random() * biome.width,
        y: biome.y + Math.random() * biome.height,
        width: 20,
        height: 20
    });
}

function checkEvolution(pokemon) {
    // Check if this Pokemon can evolve
    if (evolutionMap[pokemon.name]) {
        const evoData = evolutionMap[pokemon.name];
        if (pokemon.level >= evoData.level) {
            // EVOLVE!
            const oldName = pokemon.name;
            const newName = evoData.evolves;
            const newData = pokemonTypes[newName];

            // Keep shiny status!
            const wasShiny = pokemon.shiny;
            const shinyColor = wasShiny ? getShinyColor(newData.color) : newData.color;

            // Update Pokemon
            pokemon.name = newName;
            pokemon.type = newData.type;
            pokemon.color = shinyColor;
            pokemon.size = newData.size;

            // Update size based on new size
            if (newData.size === 'small') {
                pokemon.width = 25;
                pokemon.height = 25;
                pokemon.maxHp = 40;
            } else if (newData.size === 'medium') {
                pokemon.width = 35;
                pokemon.height = 35;
                pokemon.maxHp = 60;
            } else if (newData.size === 'huge') {
                pokemon.width = 55;
                pokemon.height = 55;
                pokemon.maxHp = 100;
            }

            pokemon.hp = pokemon.maxHp;
            pokemon.attack += 5;

            // Show evolution message!
            const shinyText = wasShiny ? ' SHINY' : '';
            alert(`🌟 Your${shinyText} ${oldName} evolved into ${newName}! 🌟`);
            playSound('heal');

            return true;
        }
    }
    return false;
}

function levelUp() {
    game.player.level++;
    game.player.xp = 0;
    game.player.xpToLevel = Math.floor(game.player.xpToLevel * 1.5);

    // Level up all caught Pokemon and check for evolutions!
    let evolved = [];
    game.caughtPokemon.forEach(p => {
        p.level++;
        if (checkEvolution(p)) {
            evolved.push(p.name);
        }
    });

    if (evolved.length > 0) {
        showMessage(`Level Up! Now level ${game.player.level}! Pokemon evolved: ${evolved.join(', ')}!`);
    } else {
        showMessage(`Level Up! Now level ${game.player.level}! All your Pokemon leveled up too!`);
    }
}

function buildHouse() {
    if (game.coins >= 10) {
        game.coins -= 10;
        game.buildings.push({
            type: 'house',
            x: game.player.x,
            y: game.player.y,
            width: 60,
            height: 60,
            color: '#8B4513'
        });
        playSound('build');
        showMessage('Built a house!');
    } else {
        showMessage('Need 10 coins to build a house!');
    }
}

function buildTrap() {
    if (game.coins >= 5) {
        game.coins -= 5;
        game.buildings.push({
            type: 'trap',
            x: game.player.x,
            y: game.player.y,
            width: 40,
            height: 40,
            color: '#654321'
        });
        playSound('build');
        showMessage('Built a trap!');
    } else {
        showMessage('Need 5 coins to build a trap!');
    }
}

function buildClinic() {
    if (game.coins >= 20) {
        game.coins -= 20;
        game.buildings.push({
            type: 'clinic',
            x: game.player.x,
            y: game.player.y,
            width: 80,
            height: 80,
            color: '#FF69B4'
        });
        playSound('build');
        showMessage('Built a Pokemon Clinic!');
    } else {
        showMessage('Need 20 coins to build a Pokemon Clinic!');
    }
}

function buildGym() {
    if (game.coins >= 30) {
        game.coins -= 30;
        game.buildings.push({
            type: 'gym',
            x: game.player.x,
            y: game.player.y,
            width: 100,
            height: 100,
            color: '#FFD700'
        });
        playSound('build');
        showMessage('Built a Pokemon Gym!');
    } else {
        showMessage('Need 30 coins to build a Pokemon Gym!');
    }
}

function showMessage(msg) {
    alert(msg);
}

function openShop() {
    const shopItems = `🏪 POKEMON SHOP 🏪

What would you like to buy?

1. Pokeball (10 coins) - Better catch rate!
2. Master Ball (100 coins) - Catch anything!
3. Rare Candy (50 coins) - Level up Pokemon!
4. Berry Seeds (20 coins) - Plant berry trees!
5. Fishing Rod (30 coins) - Fish for Pokemon!
6. Exit Shop

Enter 1-6:`;

    const choice = prompt(shopItems);
    game.inShop = false;

    if (choice === '1' && game.coins >= 10) {
        game.coins -= 10;
        alert('Pokeball purchased! Your catch rate is better now! ⚾');
        updateUI();
    } else if (choice === '2' && game.coins >= 100) {
        game.coins -= 100;
        game.masterBalls++;
        alert('Master Ball purchased! 💜');
        updateUI();
    } else if (choice === '3' && game.coins >= 50) {
        game.coins -= 50;
        game.rareCandies++;
        alert('Rare Candy purchased! 🍬');
        updateUI();
    } else if (choice === '4' && game.coins >= 20) {
        game.coins -= 20;
        game.berrySeeds++;
        alert('Berry Seeds purchased! 🌱');
        updateUI();
    } else if (choice === '5' && game.coins >= 30) {
        if (game.hasFishingRod) {
            alert('You already have a Fishing Rod!');
        } else {
            game.coins -= 30;
            game.hasFishingRod = true;
            alert('Fishing Rod purchased! 🎣');
            updateUI();
        }
    } else if (choice === '6' || choice === null) {
        alert('Come back anytime!');
    } else {
        alert('Not enough coins or invalid choice!');
    }
}

// Battle click handler and other battle functions
function handleBattleClick(clickX, clickY) {
    if (!game.battleState.canAct) return;

    // If showing moves, check which move was clicked
    if (game.battleState.showMoves) {
        // Move 1
        if (clickY >= 500 && clickY <= 540) {
            performMove(0);
        }
        // Move 2
        else if (clickY >= 545 && clickY <= 585) {
            performMove(1);
        }
        // Move 3
        else if (clickY >= 590 && clickY <= 630) {
            performMove(2);
        }
        return;
    }

    // Attack button area - now opens move selection
    if (clickX >= 50 && clickX <= 200 && clickY >= 500 && clickY <= 560) {
        game.battleState.showMoves = true;
        game.battleState.message = 'Choose a move!';
    }
    // Catch button area
    else if (clickX >= 210 && clickX <= 360 && clickY >= 500 && clickY <= 560) {
        tryToCatch();
    }
    // Run button area
    else if (clickX >= 370 && clickX <= 520 && clickY >= 500 && clickY <= 560) {
        runFromBattle();
    }
    // Master Ball button area
    else if (clickX >= 530 && clickX <= 680 && clickY >= 500 && clickY <= 560) {
        useMasterBall();
    }
}

function performMove(moveIndex) {
    if (!game.battleState) return;

    const move = game.battleState.playerMoves[moveIndex];
    game.battleState.canAct = false;
    game.battleState.showMoves = false;

    // Start animation
    game.battleState.animation = {
        type: 'playerAttack',
        moveType: game.battleState.playerPokemon.type,
        moveName: move.name,
        frame: 0,
        maxFrames: 30
    };

    const playerDamage = move.damage + game.player.level * 2;

    game.battleState.message = `${game.battleState.playerPokemon.name} used ${move.name}!`;
    playSound('attack');

    // Wait for animation, then deal damage
    setTimeout(() => {
        if (!game.battleState) return;

        game.battleState.wildHp -= playerDamage;
        game.battleState.message = `${playerDamage} damage!`;

        // Heal effect
        if (move.effect === 'heal') {
            const healAmount = 10;
            game.battleState.playerHp = Math.min(game.battleState.playerHp + healAmount, game.battleState.playerMaxHp);
            game.battleState.message += ` Healed ${healAmount} HP!`;
            playSound('heal');
        }

        game.battleState.animation = null;

        setTimeout(() => {
            if (!game.battleState) return;
            if (game.battleState.wildHp <= 0) {
                winBattle();
            } else {
                enemyAttack();
            }
        }, 1000);
    }, 800);
}

function performAttack() {
    // This is now replaced by performMove
    if (!game.battleState) return;

    game.battleState.canAct = false;
    const playerDamage = 10 + game.player.level * 5;
    game.battleState.wildHp -= playerDamage;
    game.battleState.message = `${game.battleState.playerPokemon.name} attacked for ${playerDamage} damage!`;

    setTimeout(() => {
        if (!game.battleState) return;
        if (game.battleState.wildHp <= 0) {
            winBattle();
        } else {
            enemyAttack();
        }
    }, 1000);
}

function enemyAttack() {
    if (!game.battleState) return; // Safety check

    // Start enemy animation
    game.battleState.animation = {
        type: 'enemyAttack',
        moveType: game.battleState.wildPokemon.type,
        frame: 0,
        maxFrames: 30
    };

    const enemyDamage = 5 + game.battleState.wildPokemon.level * 3;
    game.battleState.message = `Wild ${game.battleState.wildPokemon.name} attacks!`;
    playSound('attack');

    setTimeout(() => {
        if (!game.battleState) return;

        game.battleState.playerHp -= enemyDamage;
        game.battleState.message = `You took ${enemyDamage} damage!`;
        game.battleState.animation = null;
        playSound('hit');

        setTimeout(() => {
            if (!game.battleState) return; // Safety check
            if (game.battleState.playerHp <= 0) {
                loseBattle();
            } else {
                game.battleState.message = 'What will you do?';
                game.battleState.canAct = true;
            }
        }, 1000);
    }, 800);
}

function tryToCatch() {
    const catchChance = Math.min(0.3 + (game.player.level * 0.05) + (1 - game.battleState.wildHp / game.battleState.wildMaxHp) * 0.5, 0.95);

    if (Math.random() < catchChance) {
        // Success!
        for (let i = 0; i < 30; i++) {
            game.particles.push({
                x: game.battleState.wildPokemon.x + game.battleState.wildPokemon.width / 2,
                y: game.battleState.wildPokemon.y + game.battleState.wildPokemon.height / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: game.battleState.wildPokemon.color,
                life: 40
            });
        }

        game.battleState.wildPokemon.level = game.player.level;
        game.battleState.wildPokemon.hp = game.battleState.wildPokemon.maxHp || 50;
        game.battleState.wildPokemon.maxHp = game.battleState.wildPokemon.maxHp || 50;
        game.battleState.wildPokemon.attack = 10;
        game.caughtPokemon.push(game.battleState.wildPokemon);
        game.pokemon.splice(game.battleState.wildPokemonIndex, 1);
        playSound('catch');

        const xpGain = game.battleState.wildPokemon.shiny ? 8 : 2; // BONUS XP for shiny!
        game.player.xp += xpGain;
        if (game.player.xp >= game.player.xpToLevel) {
            levelUp();
        }

        if (game.battleState.wildPokemon.shiny) {
            alert(`✨ AMAZING! You caught a SHINY ${game.battleState.wildPokemon.name} in battle! ✨`);
        } else {
            alert(`You caught ${game.battleState.wildPokemon.name}!`);
        }
        game.inBattle = false;
        game.battleState = null;
        updateUI();
    } else {
        game.battleState.message = `${game.battleState.wildPokemon.name} broke free!`;
        game.battleState.canAct = false;

        setTimeout(() => {
            enemyAttack();
        }, 1000);
    }
}

function useMasterBall() {
    if (game.masterBalls <= 0) {
        alert('You don\'t have any Master Balls!');
        return;
    }

    game.masterBalls--;
    updateUI();

    // Master Ball = 100% catch rate for legendaries, 99% for others!
    const legendaries = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Rayquaza', 'Articuno', 'Zapdos', 'Moltres', 'Kyogre', 'Groudon'];
    const isLegendary = legendaries.includes(game.battleState.wildPokemon.name);
    const catchChance = isLegendary ? 1.0 : 0.99;

    if (Math.random() < catchChance) {
        // Success! Epic particle explosion!
        for (let i = 0; i < 50; i++) {
            game.particles.push({
                x: game.battleState.wildPokemon.x + game.battleState.wildPokemon.width / 2,
                y: game.battleState.wildPokemon.y + game.battleState.wildPokemon.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: isLegendary ? '#FFD700' : game.battleState.wildPokemon.color,
                life: 60
            });
        }

        game.battleState.wildPokemon.level = game.player.level;
        game.battleState.wildPokemon.hp = game.battleState.wildPokemon.maxHp || 50;
        game.battleState.wildPokemon.maxHp = game.battleState.wildPokemon.maxHp || 50;
        game.battleState.wildPokemon.attack = 10;
        game.caughtPokemon.push(game.battleState.wildPokemon);
        game.pokemon.splice(game.battleState.wildPokemonIndex, 1);
        playSound('catch');

        const isShiny = game.battleState.wildPokemon.shiny;
        let xpGain = isLegendary ? 10 : 5;
        if (isShiny) xpGain += 5; // Extra XP for shiny!

        game.player.xp += xpGain;
        if (game.player.xp >= game.player.xpToLevel) {
            levelUp();
        }

        if (isLegendary && isShiny) {
            alert(`🌟✨ ULTRA RARE! You caught a SHINY LEGENDARY ${game.battleState.wildPokemon.name} with a Master Ball! ✨🌟`);
        } else if (isLegendary) {
            alert(`🌟 AMAZING! You caught the legendary ${game.battleState.wildPokemon.name} with a Master Ball! 🌟`);
        } else if (isShiny) {
            alert(`✨ WOW! You caught a SHINY ${game.battleState.wildPokemon.name} with a Master Ball! ✨`);
        } else {
            alert(`You caught ${game.battleState.wildPokemon.name} with a Master Ball!`);
        }
        game.inBattle = false;
        game.battleState = null;
        updateUI();
    } else {
        // This should almost never happen!
        game.battleState.message = `${game.battleState.wildPokemon.name} somehow broke free!`;
        game.battleState.canAct = false;

        setTimeout(() => {
            enemyAttack();
        }, 1000);
    }
}

function winBattle() {
    game.player.xp += 3;
    if (game.player.xp >= game.player.xpToLevel) {
        levelUp();
    }
    alert(`You defeated ${game.battleState.wildPokemon.name}! Gained 3 XP!`);
    game.pokemon.splice(game.battleState.wildPokemonIndex, 1);
    game.inBattle = false;
    game.battleState = null;
    updateUI();
}

function loseBattle() {
    alert('Your Pokemon fainted! You ran back to safety!');
    // Heal the Pokemon that fainted
    game.caughtPokemon[game.battleState.playerPokemonIndex].hp = game.battleState.playerMaxHp;
    game.inBattle = false;
    game.battleState = null;
    updateUI();
}

function runFromBattle() {
    // Move the wild Pokemon far away so you don't bump into it again!
    const wildPokemon = game.battleState.wildPokemon;
    wildPokemon.x += (Math.random() - 0.5) * 300;
    wildPokemon.y += (Math.random() - 0.5) * 300;

    alert('You ran away safely!');
    game.inBattle = false;
    game.battleState = null;
    updateUI();
}

function updateUI() {
    document.getElementById('level').textContent = game.player.level;
    document.getElementById('coins').textContent = game.coins;
    document.getElementById('masterBalls').textContent = game.masterBalls;
    document.getElementById('rareCandies').textContent = game.rareCandies;
    document.getElementById('berrySeeds').textContent = game.berrySeeds;
    document.getElementById('pokemonCount').textContent = game.caughtPokemon.length;
}

// Save game to browser storage
function saveGame() {
    const saveData = {
        player: game.player,
        coins: game.coins,
        masterBalls: game.masterBalls,
        rareCandies: game.rareCandies,
        berrySeeds: game.berrySeeds,
        hasFishingRod: game.hasFishingRod,
        caughtPokemon: game.caughtPokemon,
        eggs: game.eggs,
        berryTrees: game.berryTrees,
        pokemon: game.pokemon,
        typeCoins: game.typeCoins,
        masterBallItems: game.masterBallItems,
        rareCandyItems: game.rareCandyItems,
        eggItems: game.eggItems,
        fishingRodItem: game.fishingRodItem,
        berrySeedItems: game.berrySeedItems,
        buildings: game.buildings,
        obstacles: game.obstacles
    };
    localStorage.setItem('pokemonResortSave', JSON.stringify(saveData));
}

// Load game from browser storage
function loadGame() {
    const saveData = localStorage.getItem('pokemonResortSave');
    if (saveData) {
        try {
            const data = JSON.parse(saveData);
            game.player = data.player;
            game.coins = data.coins;
            game.masterBalls = data.masterBalls || 0;
            game.rareCandies = data.rareCandies || 0;
            game.berrySeeds = data.berrySeeds || 0;
            game.hasFishingRod = data.hasFishingRod || false;
            game.caughtPokemon = data.caughtPokemon || [];
            game.eggs = data.eggs || [];
            game.berryTrees = data.berryTrees || [];
            game.pokemon = data.pokemon || [];
            game.typeCoins = data.typeCoins || [];
            game.masterBallItems = data.masterBallItems || [];
            game.rareCandyItems = data.rareCandyItems || [];
            game.eggItems = data.eggItems || [];
            game.fishingRodItem = data.fishingRodItem || null;
            game.berrySeedItems = data.berrySeedItems || [];
            game.buildings = data.buildings || [];
            game.obstacles = data.obstacles || [];
            updateUI();
            alert('Welcome back! Your game was loaded! 🎮');
            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
            return false;
        }
    }
    return false;
}

function hatchEgg(eggIndex) {
    const egg = game.eggs[eggIndex];

    // HATCH! Randomly pick any Pokemon (except legendaries)
    const legendaryPokemon = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Rayquaza', 'Articuno', 'Zapdos', 'Moltres', 'Kyogre', 'Groudon'];
    const allPokemon = Object.keys(pokemonTypes).filter(name => !legendaryPokemon.includes(name));
    const pokemonName = allPokemon[Math.floor(Math.random() * allPokemon.length)];
    const pokemonData = pokemonTypes[pokemonName];

    // 1 in 20 chance for egg to be SHINY!
    const isShiny = Math.random() < 1/20;
    const pokemonColor = isShiny ? getShinyColor(pokemonData.color) : pokemonData.color;

    // Set size and HP
    let size = 30;
    let maxHp = 50;
    if (pokemonData.size === 'small') {
        size = 25;
        maxHp = 40;
    } else if (pokemonData.size === 'medium') {
        size = 35;
        maxHp = 60;
    } else if (pokemonData.size === 'huge') {
        size = 55;
        maxHp = 100;
    }

    // Create the hatched Pokemon!
    const newPokemon = {
        name: pokemonName,
        type: pokemonData.type,
        color: pokemonColor,
        size: pokemonData.size,
        width: size,
        height: size,
        level: 1,
        hp: maxHp,
        maxHp: maxHp,
        attack: 10,
        shiny: isShiny,
        x: game.player.x,
        y: game.player.y
    };

    game.caughtPokemon.push(newPokemon);
    game.eggs.splice(eggIndex, 1);

    // EPIC hatching particles!
    for (let i = 0; i < 50; i++) {
        game.particles.push({
            x: game.player.x + game.player.width / 2,
            y: game.player.y + game.player.height / 2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            color: pokemonColor,
            life: 60
        });
    }

    playSound('catch');
    updateUI();

    if (isShiny) {
        alert(`🥚✨ The egg hatched! It's a SHINY ${pokemonName}! ✨🥚`);
    } else {
        alert(`🥚 The egg hatched! You got a ${pokemonName}! 🥚`);
    }
}

function useRareCandy() {
    if (game.rareCandies <= 0) {
        alert('You don\'t have any Rare Candies!');
        return;
    }

    if (game.caughtPokemon.length === 0) {
        alert('You need to catch a Pokemon first!');
        return;
    }

    // Let player choose which Pokemon to use it on
    let pokemonChoice = 0;
    if (game.caughtPokemon.length > 1) {
        const list = game.caughtPokemon.map((p, i) =>
            `${i + 1}. ${p.name}${p.shiny ? ' ✨' : ''} (Level ${p.level})`
        ).join('\n');

        const choice = prompt(`Use Rare Candy on which Pokemon?\n\n${list}\n\nEnter a number (1-${game.caughtPokemon.length}):`);

        if (choice === null || choice === '') {
            return; // Cancelled
        }

        const num = parseInt(choice);
        if (!isNaN(num) && num >= 1 && num <= game.caughtPokemon.length) {
            pokemonChoice = num - 1;
        } else {
            alert('Invalid choice!');
            return;
        }
    }

    const pokemon = game.caughtPokemon[pokemonChoice];

    // Use the rare candy!
    game.rareCandies--;
    pokemon.level++;
    updateUI();

    // Show particles
    for (let i = 0; i < 30; i++) {
        game.particles.push({
            x: game.player.x + game.player.width / 2,
            y: game.player.y + game.player.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color: '#FF69B4',
            life: 40
        });
    }

    playSound('heal');

    // Check for evolution!
    if (checkEvolution(pokemon)) {
        // Evolution message already shown in checkEvolution
    } else {
        alert(`${pokemon.name}${pokemon.shiny ? ' ✨' : ''} grew to Level ${pokemon.level}!`);
    }
}

// Rendering
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (game.inBattle && game.battleState) {
        drawBattleScreen();
        return;
    }

    // Calculate camera offset
    const offsetX = canvas.width / 2 - game.player.x;
    const offsetY = canvas.height / 2 - game.player.y;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    if (game.view === 'top') {
        drawTopView();
    } else {
        drawSideView();
    }

    ctx.restore();
}

function drawBattleScreen() {
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#32CD32');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Wild Pokemon
    const wildX = 550;
    const wildY = 150;
    ctx.fillStyle = game.battleState.wildPokemon.color;
    ctx.beginPath();
    ctx.arc(wildX, wildY, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Wild Pokemon eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(wildX - 15, wildY - 10, 6, 0, Math.PI * 2);
    ctx.arc(wildX + 15, wildY - 10, 6, 0, Math.PI * 2);
    ctx.fill();

    // Wild Pokemon smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wildX, wildY + 10, 15, 0, Math.PI, false);
    ctx.stroke();

    // Wild Pokemon name and HP
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(game.battleState.wildPokemon.name, wildX - 60, wildY - 70);

    // Wild HP bar
    const hpPercent = game.battleState.wildHp / game.battleState.wildMaxHp;
    ctx.fillStyle = '#333';
    ctx.fillRect(wildX - 80, wildY - 50, 160, 20);
    ctx.fillStyle = hpPercent > 0.5 ? '#4CAF50' : hpPercent > 0.2 ? '#FFC107' : '#F44336';
    ctx.fillRect(wildX - 80, wildY - 50, 160 * hpPercent, 20);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(wildX - 80, wildY - 50, 160, 20);

    // Player Pokemon
    const playerX = 200;
    const playerY = 350;
    ctx.fillStyle = game.battleState.playerPokemon.color;
    ctx.beginPath();
    ctx.arc(playerX, playerY, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Player Pokemon eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(playerX - 15, playerY - 10, 6, 0, Math.PI * 2);
    ctx.arc(playerX + 15, playerY - 10, 6, 0, Math.PI * 2);
    ctx.fill();

    // Player Pokemon smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(playerX, playerY + 10, 15, 0, Math.PI, false);
    ctx.stroke();

    // Player Pokemon name and HP
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(game.battleState.playerPokemon.name, playerX - 60, playerY + 80);

    // Player HP bar
    const playerHpPercent = game.battleState.playerHp / game.battleState.playerMaxHp;
    ctx.fillStyle = '#333';
    ctx.fillRect(playerX - 80, playerY + 90, 160, 20);
    ctx.fillStyle = playerHpPercent > 0.5 ? '#4CAF50' : playerHpPercent > 0.2 ? '#FFC107' : '#F44336';
    ctx.fillRect(playerX - 80, playerY + 90, 160 * playerHpPercent, 20);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(playerX - 80, playerY + 90, 160, 20);

    // Draw attack animations
    if (game.battleState.animation) {
        game.battleState.animation.frame++;

        if (game.battleState.animation.type === 'playerAttack') {
            // Player attacking - show projectile or effect moving to enemy
            const progress = game.battleState.animation.frame / game.battleState.animation.maxFrames;
            const startX = playerX + 50;
            const startY = playerY;
            const endX = wildX - 50;
            const endY = wildY;

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            // Draw attack effect based on type
            const attackColor = typeColors[game.battleState.animation.moveType] || '#FFD700';
            ctx.fillStyle = attackColor;
            ctx.beginPath();
            ctx.arc(currentX, currentY, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Add sparkles
            for (let i = 0; i < 5; i++) {
                const angle = (game.battleState.animation.frame * 10 + i * 72) * Math.PI / 180;
                const sparkX = currentX + Math.cos(angle) * 15;
                const sparkY = currentY + Math.sin(angle) * 15;
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (game.battleState.animation.type === 'enemyAttack') {
            // Enemy attacking - show projectile moving to player
            const progress = game.battleState.animation.frame / game.battleState.animation.maxFrames;
            const startX = wildX - 50;
            const startY = wildY;
            const endX = playerX + 50;
            const endY = playerY;

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            const attackColor = typeColors[game.battleState.animation.moveType] || '#FF4444';
            ctx.fillStyle = attackColor;
            ctx.beginPath();
            ctx.arc(currentX, currentY, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Message box
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(50, 430, 700, 60);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 430, 700, 60);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(game.battleState.message, 70, 465);

    // Battle buttons or moves
    if (game.battleState.showMoves) {
        // Show moves instead of buttons
        const moves = game.battleState.playerMoves;
        const moveColors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];

        moves.forEach((move, i) => {
            const y = 500 + i * 45;
            ctx.fillStyle = moveColors[i];
            ctx.fillRect(50, y, 700, 40);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeRect(50, y, 700, 40);

            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`${move.name} (${move.damage} damage)`, 70, y + 27);
        });
    } else {
        // Show normal buttons
        const buttons = [
            { text: 'ATTACK', x: 50, y: 500, width: 150, height: 60, color: '#F44336' },
            { text: 'CATCH', x: 210, y: 500, width: 150, height: 60, color: '#4CAF50' },
            { text: 'RUN', x: 370, y: 500, width: 150, height: 60, color: '#2196F3' }
        ];

        // Add Master Ball button if player has any
        if (game.masterBalls > 0) {
            buttons.push({ text: 'MASTER', x: 530, y: 500, width: 150, height: 60, color: '#9370DB' });
        }

        buttons.forEach(btn => {
            ctx.fillStyle = btn.color;
            ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 20px Arial';
            const textX = btn.text === 'MASTER' ? btn.x + 30 : btn.x + 40;
            ctx.fillText(btn.text, textX, btn.y + 40);
        });
    }
}

function drawTopView() {
    // Draw background
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(-5000, -5000, 10000, 10000);

    // Draw biomes with day/night tint
    biomes.forEach(biome => {
        ctx.fillStyle = biome.color;
        ctx.fillRect(biome.x, biome.y, biome.width, biome.height);

        // Draw night overlay
        if (game.timeOfDay === 'night') {
            ctx.fillStyle = 'rgba(0, 0, 50, 0.5)';
            ctx.fillRect(biome.x, biome.y, biome.width, biome.height);
        }

        // Draw biome name
        ctx.fillStyle = game.timeOfDay === 'night' ? 'rgba(200,200,255,0.7)' : 'rgba(0,0,0,0.5)';
        ctx.font = '40px Arial';
        ctx.fillText(biome.name, biome.x + 20, biome.y + 50);
    });

    // Draw obstacles
    game.obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        if (obs.type === 'tree') {
            // Tree trunk
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(obs.x + 12, obs.y + 30, 16, 30);
            // Tree leaves
            ctx.fillStyle = obs.color;
            ctx.beginPath();
            ctx.arc(obs.x + 20, obs.y + 20, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (obs.type === 'bush') {
            // Bush
            ctx.beginPath();
            ctx.arc(obs.x + 15, obs.y + 12, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#228B22';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (obs.type === 'rock') {
            // Rock
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        } else if (obs.type === 'flower') {
            // Flower
            ctx.beginPath();
            ctx.arc(obs.x + 7, obs.y + 7, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(obs.x + 7, obs.y + 7, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (obs.type === 'palm') {
            // Palm tree trunk
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(obs.x + 15, obs.y + 20, 10, 50);

            // Palm leaves
            ctx.fillStyle = '#228B22';
            ctx.strokeStyle = '#1a6b1a';
            ctx.lineWidth = 3;

            // Draw 5-6 palm fronds
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 * i) / 6;
                const endX = obs.x + 20 + Math.cos(angle) * 25;
                const endY = obs.y + 20 + Math.sin(angle) * 25;

                ctx.beginPath();
                ctx.moveTo(obs.x + 20, obs.y + 20);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }

            // Draw fruit (coconuts or bananas)
            if (obs.fruit === 'coconut') {
                ctx.fillStyle = '#8B4513';
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(obs.x + 15 + i * 5, obs.y + 25, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Bananas
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 1;
                for (let i = 0; i < 4; i++) {
                    ctx.beginPath();
                    ctx.arc(obs.x + 12 + i * 4, obs.y + 28 + i * 2, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
        ctx.lineWidth = 1;
    });

    // Draw buildings
    game.buildings.forEach(building => {
        ctx.fillStyle = building.color;
        ctx.fillRect(building.x, building.y, building.width, building.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeRect(building.x, building.y, building.width, building.height);

        // Draw building type
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        if (building.type === 'clinic') {
            ctx.fillText('CLINIC', building.x + 10, building.y + 45);
            // Draw a red cross
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(building.x + 35, building.y + 15, 10, 20);
            ctx.fillRect(building.x + 30, building.y + 20, 20, 10);
        } else if (building.type === 'gym') {
            ctx.fillStyle = '#000';
            ctx.fillText('GYM', building.x + 30, building.y + 55);
            // Draw dumbbells
            ctx.fillStyle = '#000';
            ctx.fillRect(building.x + 20, building.y + 20, 8, 25);
            ctx.fillRect(building.x + 17, building.y + 17, 14, 6);
            ctx.fillRect(building.x + 17, building.y + 42, 14, 6);
            ctx.fillRect(building.x + 72, building.y + 20, 8, 25);
            ctx.fillRect(building.x + 69, building.y + 17, 14, 6);
            ctx.fillRect(building.x + 69, building.y + 42, 14, 6);
        } else {
            ctx.fillText(building.type, building.x + 5, building.y + 30);
        }
        ctx.lineWidth = 1;
    });

    // Draw type coins
    game.typeCoins.forEach(coin => {
        ctx.fillStyle = typeColors[coin.type];
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 1;
    });

    // Draw Master Balls - SUPER RARE!
    game.masterBallItems.forEach(ball => {
        const ballX = ball.x + ball.width / 2;
        const ballY = ball.y + ball.height / 2;

        // Purple/white Master Ball
        // Top half - purple
        ctx.fillStyle = '#9370DB';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ball.width / 2, Math.PI, 0, true);
        ctx.fill();

        // Bottom half - white
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ball.width / 2, 0, Math.PI, true);
        ctx.fill();

        // Middle line
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ballX - ball.width / 2, ballY);
        ctx.lineTo(ballX + ball.width / 2, ballY);
        ctx.stroke();

        // Center button
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring
        ctx.strokeStyle = '#9370DB';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ballX, ballY, ball.width / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Sparkle effect
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(ballX - 8, ballY - 8, 2, 0, Math.PI * 2);
        ctx.arc(ballX + 8, ballY + 8, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1;
    });

    // Draw Rare Candies!
    game.rareCandyItems.forEach(candy => {
        const candyX = candy.x + candy.width / 2;
        const candyY = candy.y + candy.height / 2;

        // Pink candy wrapper
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(candyX, candyY, candy.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // White stripes
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(candyX - 5, candyY - 7);
        ctx.lineTo(candyX + 5, candyY + 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(candyX + 5, candyY - 7);
        ctx.lineTo(candyX - 5, candyY + 7);
        ctx.stroke();

        // Outline
        ctx.strokeStyle = '#FF1493';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(candyX, candyY, candy.width / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(candyX - 5, candyY - 5, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1;
    });

    // Draw Pokemon Eggs in the world!
    game.eggItems.forEach(egg => {
        const eggX = egg.x + egg.width / 2;
        const eggY = egg.y + egg.height / 2;

        // Egg shape (oval)
        ctx.fillStyle = egg.color;
        ctx.beginPath();
        ctx.ellipse(eggX, eggY, egg.width / 2, egg.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Egg spots/pattern
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.ellipse(eggX - 3, eggY - 5, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(eggX + 4, eggY + 2, 3, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Outline
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(eggX, eggY, egg.width / 2, egg.height / 2, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Shine/highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(eggX - 5, eggY - 8, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1;
    });

    // Draw Pokemon as cartoon characters
    game.pokemon.forEach(pokemon => {
        const pokX = pokemon.x + pokemon.width / 2;
        const pokY = pokemon.y + pokemon.height / 2;

        // Check if this is a legendary Pokemon
        const legendaries = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Rayquaza', 'Articuno', 'Zapdos', 'Moltres', 'Kyogre', 'Groudon'];
        const isLegendary = legendaries.includes(pokemon.name);

        // Draw sparkles for SHINY Pokemon! ✨
        if (pokemon.shiny) {
            // Shiny stars - twinkling effect!
            for (let i = 0; i < 4; i++) {
                const twinkle = Math.sin(game.frameCount * 0.1 + i) * 0.5 + 0.5; // Fade in/out
                const angle = (game.frameCount * 3 + i * 90) * Math.PI / 180;
                const sparkX = pokX + Math.cos(angle) * (pokemon.width / 2 + 10);
                const sparkY = pokY + Math.sin(angle) * (pokemon.width / 2 + 10);

                ctx.globalAlpha = twinkle;

                // Draw star
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                // Simple star shape
                for (let s = 0; s < 5; s++) {
                    const starAngle = (s * 144) * Math.PI / 180;
                    const sx = sparkX + Math.cos(starAngle) * 3;
                    const sy = sparkY + Math.sin(starAngle) * 3;
                    if (s === 0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.globalAlpha = 1;
            }
        }

        // Draw sparkles for legendary Pokemon!
        if (isLegendary) {
            // Glowing aura
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFD700';

            // Draw rotating sparkles around legendary Pokemon
            for (let i = 0; i < 8; i++) {
                const angle = (game.frameCount * 2 + i * 45) * Math.PI / 180;
                const sparkX = pokX + Math.cos(angle) * (pokemon.width / 2 + 15);
                const sparkY = pokY + Math.sin(angle) * (pokemon.width / 2 + 15);

                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);
                ctx.fill();

                // Add white center to sparkle
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.shadowBlur = 0;
        }

        // Pokemon body
        ctx.fillStyle = pokemon.color;
        ctx.beginPath();
        ctx.arc(pokX, pokY, pokemon.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pokemon tail (draw behind body)
        ctx.fillStyle = pokemon.color;
        ctx.beginPath();
        const tailX = pokX - pokemon.width / 2 - 5;
        const tailY = pokY + 5;
        ctx.moveTo(tailX, tailY);
        ctx.quadraticCurveTo(tailX - 10, tailY - 5, tailX - 8, tailY - 12);
        ctx.quadraticCurveTo(tailX - 6, tailY - 5, tailX, tailY);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pokemon ears
        ctx.fillStyle = pokemon.color;
        // Left ear
        ctx.beginPath();
        ctx.moveTo(pokX - 8, pokY - pokemon.height / 2);
        ctx.lineTo(pokX - 12, pokY - pokemon.height / 2 - 8);
        ctx.lineTo(pokX - 4, pokY - pokemon.height / 2 - 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Right ear
        ctx.beginPath();
        ctx.moveTo(pokX + 8, pokY - pokemon.height / 2);
        ctx.lineTo(pokX + 12, pokY - pokemon.height / 2 - 8);
        ctx.lineTo(pokX + 4, pokY - pokemon.height / 2 - 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pokemon eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(pokX - 5, pokY - 3, 3, 0, Math.PI * 2);
        ctx.arc(pokX + 5, pokY - 3, 3, 0, Math.PI * 2);
        ctx.fill();

        // Pokemon smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pokX, pokY + 3, 6, 0, Math.PI, false);
        ctx.stroke();

        // Draw name
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(pokemon.name, pokemon.x - 10, pokemon.y - 5);

        // Draw SHINY indicator!
        if (pokemon.shiny) {
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            ctx.font = 'bold 10px Arial';
            ctx.strokeText('✨SHINY✨', pokemon.x - 10, pokemon.y - 18);
            ctx.fillText('✨SHINY✨', pokemon.x - 10, pokemon.y - 18);
        }

        // Draw injured indicator
        if (pokemon.injured) {
            ctx.fillStyle = '#FF0000';
            ctx.font = '20px Arial';
            ctx.fillText('!', pokemon.x + pokemon.width + 5, pokemon.y + 15);
        }

        ctx.lineWidth = 1;
    });

    // Draw following Pokemon (behind player)
    const maxFollowers = Math.min(3, game.caughtPokemon.length); // Max 3 followers
    for (let i = 0; i < maxFollowers; i++) {
        const followPokemon = game.caughtPokemon[i];
        const trailIndex = (i + 1) * 15; // Space them out

        if (game.player.trail[trailIndex]) {
            const pos = game.player.trail[trailIndex];
            const followerX = pos.x + followPokemon.width / 2;
            const followerY = pos.y + followPokemon.height / 2;
            const followerSize = (followPokemon.width || 30) / 2;

            // Draw follower Pokemon body
            ctx.fillStyle = followPokemon.color;
            ctx.beginPath();
            ctx.arc(followerX, followerY, followerSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw follower tail
            ctx.fillStyle = followPokemon.color;
            ctx.beginPath();
            const fTailX = followerX - followerSize - 3;
            const fTailY = followerY + 3;
            ctx.moveTo(fTailX, fTailY);
            ctx.quadraticCurveTo(fTailX - 7, fTailY - 3, fTailX - 5, fTailY - 8);
            ctx.quadraticCurveTo(fTailX - 3, fTailY - 3, fTailX, fTailY);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw follower ears
            ctx.fillStyle = followPokemon.color;
            // Left ear
            ctx.beginPath();
            ctx.moveTo(followerX - 5, followerY - followerSize);
            ctx.lineTo(followerX - 8, followerY - followerSize - 5);
            ctx.lineTo(followerX - 2, followerY - followerSize - 2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();
            // Right ear
            ctx.beginPath();
            ctx.moveTo(followerX + 5, followerY - followerSize);
            ctx.lineTo(followerX + 8, followerY - followerSize - 5);
            ctx.lineTo(followerX + 2, followerY - followerSize - 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw follower eyes
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(followerX - 4, followerY - 2, 2, 0, Math.PI * 2);
            ctx.arc(followerX + 4, followerY - 2, 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw follower smile
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(followerX, followerY + 2, 5, 0, Math.PI, false);
            ctx.stroke();

            // Draw follower name
            ctx.fillStyle = '#000';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(followPokemon.name, followerX, followerY - followerSize - 5);
            ctx.textAlign = 'left';
        }
    }

    // Draw player as cartoon character
    const px = game.player.x + game.player.width / 2;
    const py = game.player.y + game.player.height / 2;

    // Draw hair BEHIND head for girl trainers
    if (game.player.character && game.player.character.type === 'girl') {
        // Hair color darker than skin
        const hairColor = darkenColor(game.player.color, 0.3);

        // Ponytail/long hair behind
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.ellipse(px, py + 5, 14, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Body
    ctx.fillStyle = game.player.color;
    ctx.beginPath();
    ctx.arc(px, py, game.player.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Hair in front for girls (bangs/side hair)
    if (game.player.character && game.player.character.type === 'girl') {
        const hairColor = darkenColor(game.player.color, 0.3);
        ctx.fillStyle = hairColor;

        // Side hair/pigtails
        ctx.beginPath();
        ctx.arc(px - 16, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px + 16, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // Draw hat for boy trainers
    if (game.player.character && game.player.character.type === 'boy') {
        // Hat brim
        ctx.fillStyle = '#000';
        ctx.fillRect(px - 18, py - 14, 36, 4);

        // Hat top
        ctx.fillStyle = game.player.color;
        ctx.fillRect(px - 12, py - 24, 24, 10);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(px - 12, py - 24, 24, 10);

        // Hat logo/button
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(px, py - 19, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Eyes
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(px - 6, py - 4, 5, 0, Math.PI * 2);
    ctx.arc(px + 6, py - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(px - 6, py - 4, 2, 0, Math.PI * 2);
    ctx.arc(px + 6, py - 4, 2, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py + 2, 8, 0, Math.PI, false);
    ctx.stroke();

    // Draw particles
    game.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw falling fruit
    game.fallingFruit.forEach(fruit => {
        if (fruit.type === 'coconut') {
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.arc(fruit.x, fruit.y, fruit.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            // Banana
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#DAA520';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(fruit.x, fruit.y, fruit.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    });

    // Draw Shop!
    if (game.shop && !game.inCave) {
        ctx.fillStyle = game.shop.color;
        ctx.fillRect(game.shop.x, game.shop.y, game.shop.width, game.shop.height);
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 4;
        ctx.strokeRect(game.shop.x, game.shop.y, game.shop.width, game.shop.height);

        // Shop sign
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SHOP', game.shop.x + game.shop.width / 2, game.shop.y + game.shop.height / 2 + 7);
        ctx.textAlign = 'left';

        // Coin icon on shop
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(game.shop.x + game.shop.width / 2, game.shop.y + 15, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.lineWidth = 1;
    }

    // Draw Secret Cave Entrance!
    if (game.caveEntrance && !game.inCave) {
        ctx.fillStyle = game.caveEntrance.color;
        ctx.fillRect(game.caveEntrance.x, game.caveEntrance.y, game.caveEntrance.width, game.caveEntrance.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.strokeRect(game.caveEntrance.x, game.caveEntrance.y, game.caveEntrance.width, game.caveEntrance.height);

        // Cave darkness effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(game.caveEntrance.x + 5, game.caveEntrance.y + 5, game.caveEntrance.width - 10, game.caveEntrance.height - 10);

        // Cave sign
        ctx.fillStyle = '#888';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SECRET', game.caveEntrance.x + game.caveEntrance.width / 2, game.caveEntrance.y + game.caveEntrance.height / 2 - 5);
        ctx.fillText('CAVE', game.caveEntrance.x + game.caveEntrance.width / 2, game.caveEntrance.y + game.caveEntrance.height / 2 + 10);
        ctx.textAlign = 'left';

        ctx.lineWidth = 1;
    }

    // Draw Cave Pokemon when inside cave!
    if (game.inCave) {
        // Dark cave background
        ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw cave pokemon
        game.cavePokemons.forEach(pokemon => {
            const pokX = pokemon.x + pokemon.width / 2;
            const pokY = pokemon.y + pokemon.height / 2;

            // Draw sparkles for SHINY Pokemon!
            if (pokemon.shiny) {
                for (let i = 0; i < 4; i++) {
                    const twinkle = Math.sin(game.frameCount * 0.1 + i) * 0.5 + 0.5;
                    const angle = (game.frameCount * 3 + i * 90) * Math.PI / 180;
                    const sparkX = pokX + Math.cos(angle) * (pokemon.width / 2 + 10);
                    const sparkY = pokY + Math.sin(angle) * (pokemon.width / 2 + 10);

                    ctx.globalAlpha = twinkle;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    for (let s = 0; s < 5; s++) {
                        const starAngle = (s * 144) * Math.PI / 180;
                        const sx = sparkX + Math.cos(starAngle) * 3;
                        const sy = sparkY + Math.sin(starAngle) * 3;
                        if (s === 0) ctx.moveTo(sx, sy);
                        else ctx.lineTo(sx, sy);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }

            // Pokemon body
            ctx.fillStyle = pokemon.color;
            ctx.beginPath();
            ctx.arc(pokX, pokY, pokemon.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Cave Pokemon tail
            ctx.fillStyle = pokemon.color;
            ctx.beginPath();
            const cTailX = pokX - pokemon.width / 2 - 5;
            const cTailY = pokY + 5;
            ctx.moveTo(cTailX, cTailY);
            ctx.quadraticCurveTo(cTailX - 10, cTailY - 5, cTailX - 8, cTailY - 12);
            ctx.quadraticCurveTo(cTailX - 6, cTailY - 5, cTailX, cTailY);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Cave Pokemon ears
            ctx.fillStyle = pokemon.color;
            // Left ear
            ctx.beginPath();
            ctx.moveTo(pokX - 8, pokY - pokemon.height / 2);
            ctx.lineTo(pokX - 12, pokY - pokemon.height / 2 - 8);
            ctx.lineTo(pokX - 4, pokY - pokemon.height / 2 - 4);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Right ear
            ctx.beginPath();
            ctx.moveTo(pokX + 8, pokY - pokemon.height / 2);
            ctx.lineTo(pokX + 12, pokY - pokemon.height / 2 - 8);
            ctx.lineTo(pokX + 4, pokY - pokemon.height / 2 - 4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Eyes
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(pokX - 8, pokY - 5, 5, 0, Math.PI * 2);
            ctx.arc(pokX + 8, pokY - 5, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(pokX - 8, pokY - 5, 2, 0, Math.PI * 2);
            ctx.arc(pokX + 8, pokY - 5, 2, 0, Math.PI * 2);
            ctx.fill();

            // Name and level
            ctx.fillStyle = pokemon.shiny ? '#FFD700' : '#000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            if (pokemon.shiny) {
                ctx.fillText('✨SHINY✨', pokX, pokY - pokemon.width / 2 - 15);
            }
            ctx.fillStyle = '#FFF';
            ctx.fillText(`${pokemon.name} Lv.${pokemon.level}`, pokX, pokY - pokemon.width / 2 - 5);
            ctx.textAlign = 'left';

            ctx.lineWidth = 1;
        });

        // Cave exit hint
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press E to Exit Cave', canvas.width / 2, 30);
        ctx.textAlign = 'left';
    }

    // Draw Fishing Rod item!
    if (game.fishingRodItem && !game.inCave) {
        const rodX = game.fishingRodItem.x + game.fishingRodItem.width / 2;
        const rodY = game.fishingRodItem.y + game.fishingRodItem.height / 2;

        // Fishing rod pole (brown)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rodX - 8, rodY + 8);
        ctx.lineTo(rodX + 8, rodY - 8);
        ctx.stroke();

        // Fishing line
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rodX + 8, rodY - 8);
        ctx.lineTo(rodX + 12, rodY - 2);
        ctx.stroke();

        // Hook
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rodX + 12, rodY, 3, 0, Math.PI);
        ctx.stroke();

        // Sparkle effect
        ctx.fillStyle = '#00CED1';
        ctx.beginPath();
        ctx.arc(rodX - 5, rodY - 10, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1;
    }

    // Draw Berry Seed items!
    game.berrySeedItems.forEach(seed => {
        const seedX = seed.x + seed.width / 2;
        const seedY = seed.y + seed.height / 2;

        // Seed packet
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(seed.x, seed.y, seed.width, seed.height);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(seed.x, seed.y, seed.width, seed.height);

        // Leaf icon on packet
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(seedX, seedY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1;
    });

    // Draw Berry Trees!
    game.berryTrees.forEach(tree => {
        const treeX = tree.x + tree.width / 2;
        const treeY = tree.y + tree.height / 2;

        if (tree.growthStage === 0) {
            // Seed - small brown dot
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.arc(treeX, treeY, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (tree.growthStage === 1) {
            // Sprout - small green stem
            ctx.strokeStyle = '#228B22';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(treeX, treeY);
            ctx.lineTo(treeX, treeY - 8);
            ctx.stroke();
            ctx.fillStyle = '#90EE90';
            ctx.beginPath();
            ctx.arc(treeX, treeY - 8, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (tree.growthStage === 2) {
            // Sapling - small tree
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(treeX, treeY);
            ctx.lineTo(treeX, treeY - 15);
            ctx.stroke();
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.arc(treeX, treeY - 15, 8, 0, Math.PI * 2);
            ctx.fill();
        } else if (tree.growthStage === 3) {
            // Full tree with berries!
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(treeX, treeY + 10);
            ctx.lineTo(treeX, treeY - 20);
            ctx.stroke();
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.arc(treeX, treeY - 15, 15, 0, Math.PI * 2);
            ctx.fill();

            // Berries!
            if (tree.hasBerries) {
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(treeX - 8, treeY - 15, 4, 0, Math.PI * 2);
                ctx.arc(treeX + 8, treeY - 15, 4, 0, Math.PI * 2);
                ctx.arc(treeX, treeY - 22, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.lineWidth = 1;
    });

    // Draw weather effects!
    if (game.weather === 'rain') {
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.6)';
        ctx.lineWidth = 2;
        game.raindrops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + 15);
            ctx.stroke();
        });
    } else if (game.weather === 'snow') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        game.snowflakes.forEach(flake => {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Draw stars at night!
    if (game.timeOfDay === 'night') {
        ctx.fillStyle = '#FFFF00';
        // Random twinkling stars
        for (let i = 0; i < 50; i++) {
            const starX = (i * 123 + game.frameCount) % canvas.width;
            const starY = (i * 456) % (canvas.height / 2);
            const twinkle = Math.sin(game.frameCount * 0.05 + i) * 0.5 + 0.5;
            ctx.globalAlpha = twinkle;
            ctx.beginPath();
            ctx.arc(starX, starY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    ctx.lineWidth = 1;
}

function drawSideView() {
    // Ground
    ctx.fillStyle = '#654321';
    ctx.fillRect(-10000, game.player.y + 100, 20000, 1000);

    // Sky gradient
    const gradient = ctx.createLinearGradient(0, game.player.y - 400, 0, game.player.y + 100);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8C8');
    ctx.fillStyle = gradient;
    ctx.fillRect(-10000, -10000, 20000, game.player.y + 100 + 10000);

    // Draw buildings (side view)
    game.buildings.forEach(building => {
        const buildingY = game.player.y + 100 - building.height;
        ctx.fillStyle = building.color;
        ctx.fillRect(building.x, buildingY, building.width, building.height);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(building.x, buildingY, building.width, building.height);
    });

    // Draw type coins (side view)
    game.typeCoins.forEach(coin => {
        const coinY = game.player.y + 80;
        ctx.fillStyle = typeColors[coin.type];
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coinY, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 1;
    });

    // Draw Master Balls (side view)
    game.masterBallItems.forEach(ball => {
        const ballX = ball.x + ball.width / 2;
        const ballY = game.player.y + 80;

        // Purple/white Master Ball
        // Top half - purple
        ctx.fillStyle = '#9370DB';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ball.width / 2, Math.PI, 0, true);
        ctx.fill();

        // Bottom half - white
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ball.width / 2, 0, Math.PI, true);
        ctx.fill();

        // Middle line
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ballX - ball.width / 2, ballY);
        ctx.lineTo(ballX + ball.width / 2, ballY);
        ctx.stroke();

        // Center button
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring
        ctx.strokeStyle = '#9370DB';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ballX, ballY, ball.width / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Sparkle effect
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(ballX - 8, ballY - 8, 2, 0, Math.PI * 2);
        ctx.arc(ballX + 8, ballY + 8, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1;
    });

    // Draw Rare Candies (side view)
    game.rareCandyItems.forEach(candy => {
        const candyX = candy.x + candy.width / 2;
        const candyY = game.player.y + 80;

        // Pink candy wrapper
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(candyX, candyY, candy.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // White stripes
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(candyX - 5, candyY - 7);
        ctx.lineTo(candyX + 5, candyY + 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(candyX + 5, candyY - 7);
        ctx.lineTo(candyX - 5, candyY + 7);
        ctx.stroke();

        // Outline
        ctx.strokeStyle = '#FF1493';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(candyX, candyY, candy.width / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(candyX - 5, candyY - 5, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1;
    });

    // Draw Pokemon Eggs (side view)
    game.eggItems.forEach(egg => {
        const eggX = egg.x + egg.width / 2;
        const eggY = game.player.y + 80;

        // Egg shape (oval)
        ctx.fillStyle = egg.color;
        ctx.beginPath();
        ctx.ellipse(eggX, eggY, egg.width / 2, egg.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Egg spots/pattern
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.ellipse(eggX - 3, eggY - 5, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(eggX + 4, eggY + 2, 3, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Outline
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(eggX, eggY, egg.width / 2, egg.height / 2, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Shine/highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(eggX - 5, eggY - 8, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1;
    });

    // Draw Pokemon (side view) as cartoon characters
    game.pokemon.forEach(pokemon => {
        const pokemonY = game.player.y + 70;
        const pokX = pokemon.x + pokemon.width / 2;
        const pokY = pokemonY + pokemon.height / 2;

        // Check if this is a legendary Pokemon
        const legendaries = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Rayquaza', 'Articuno', 'Zapdos', 'Moltres', 'Kyogre', 'Groudon'];
        const isLegendary = legendaries.includes(pokemon.name);

        // Draw sparkles for SHINY Pokemon in side view! ✨
        if (pokemon.shiny) {
            // Shiny stars - twinkling effect!
            for (let i = 0; i < 4; i++) {
                const twinkle = Math.sin(game.frameCount * 0.1 + i) * 0.5 + 0.5;
                const angle = (game.frameCount * 3 + i * 90) * Math.PI / 180;
                const sparkX = pokX + Math.cos(angle) * (pokemon.width / 2 + 10);
                const sparkY = pokY + Math.sin(angle) * (pokemon.width / 2 + 10);

                ctx.globalAlpha = twinkle;

                // Draw star
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                // Simple star shape
                for (let s = 0; s < 5; s++) {
                    const starAngle = (s * 144) * Math.PI / 180;
                    const sx = sparkX + Math.cos(starAngle) * 3;
                    const sy = sparkY + Math.sin(starAngle) * 3;
                    if (s === 0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.globalAlpha = 1;
            }
        }

        // Draw sparkles for legendary Pokemon in side view!
        if (isLegendary) {
            // Glowing aura
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFD700';

            // Draw rotating sparkles around legendary Pokemon
            for (let i = 0; i < 8; i++) {
                const angle = (game.frameCount * 2 + i * 45) * Math.PI / 180;
                const sparkX = pokX + Math.cos(angle) * (pokemon.width / 2 + 15);
                const sparkY = pokY + Math.sin(angle) * (pokemon.width / 2 + 15);

                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);
                ctx.fill();

                // Add white center to sparkle
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.shadowBlur = 0;
        }

        // Pokemon body
        ctx.fillStyle = pokemon.color;
        ctx.fillRect(pokemon.x, pokemonY, pokemon.width, pokemon.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(pokemon.x, pokemonY, pokemon.width, pokemon.height);

        // Pokemon tail (side view)
        ctx.fillStyle = pokemon.color;
        ctx.beginPath();
        const sTailX = pokemon.x + pokemon.width;
        const sTailY = pokemonY + pokemon.height / 2;
        ctx.moveTo(sTailX, sTailY);
        ctx.quadraticCurveTo(sTailX + 10, sTailY - 5, sTailX + 8, sTailY - 12);
        ctx.quadraticCurveTo(sTailX + 6, sTailY - 5, sTailX, sTailY);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pokemon ears (side view)
        ctx.fillStyle = pokemon.color;
        // Left ear
        ctx.beginPath();
        ctx.moveTo(pokX - 8, pokemonY);
        ctx.lineTo(pokX - 12, pokemonY - 8);
        ctx.lineTo(pokX - 4, pokemonY - 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Right ear
        ctx.beginPath();
        ctx.moveTo(pokX + 8, pokemonY);
        ctx.lineTo(pokX + 12, pokemonY - 8);
        ctx.lineTo(pokX + 4, pokemonY - 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pokemon eyes
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(pokX - 5, pokY - 5, 4, 0, Math.PI * 2);
        ctx.arc(pokX + 5, pokY - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(pokX - 5, pokY - 5, 2, 0, Math.PI * 2);
        ctx.arc(pokX + 5, pokY - 5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pokX, pokY + 2, 6, 0, Math.PI, false);
        ctx.stroke();

        // Draw name
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(pokemon.name, pokemon.x - 10, pokemonY - 5);

        // Draw SHINY indicator in side view!
        if (pokemon.shiny) {
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            ctx.font = 'bold 10px Arial';
            ctx.strokeText('✨SHINY✨', pokemon.x - 10, pokemonY - 18);
            ctx.fillText('✨SHINY✨', pokemon.x - 10, pokemonY - 18);
        }

        // Draw injured indicator
        if (pokemon.injured) {
            ctx.fillStyle = '#FF0000';
            ctx.font = '20px Arial';
            ctx.fillText('!', pokemon.x + pokemon.width + 5, pokemonY + 15);
        }

        ctx.lineWidth = 1;
    });

    // Draw following Pokemon (side view, behind player)
    const maxFollowersSide = Math.min(3, game.caughtPokemon.length);
    for (let i = 0; i < maxFollowersSide; i++) {
        const followPokemon = game.caughtPokemon[i];
        const trailIndex = (i + 1) * 15;

        if (game.player.trail[trailIndex]) {
            const pos = game.player.trail[trailIndex];
            const followerSideY = pos.y + 68;
            const followerSize = (followPokemon.width || 30);

            // Draw follower body
            ctx.fillStyle = followPokemon.color;
            ctx.fillRect(pos.x, followerSideY, followerSize, followerSize);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(pos.x, followerSideY, followerSize, followerSize);

            // Draw follower tail (side view)
            ctx.fillStyle = followPokemon.color;
            ctx.beginPath();
            const fsTailX = pos.x + followerSize;
            const fsTailY = followerSideY + followerSize / 2;
            ctx.moveTo(fsTailX, fsTailY);
            ctx.quadraticCurveTo(fsTailX + 7, fsTailY - 3, fsTailX + 5, fsTailY - 8);
            ctx.quadraticCurveTo(fsTailX + 3, fsTailY - 3, fsTailX, fsTailY);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw follower ears (side view)
            const fX = pos.x + followerSize / 2;
            ctx.fillStyle = followPokemon.color;
            // Left ear
            ctx.beginPath();
            ctx.moveTo(fX - 5, followerSideY);
            ctx.lineTo(fX - 8, followerSideY - 5);
            ctx.lineTo(fX - 2, followerSideY - 2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();
            // Right ear
            ctx.beginPath();
            ctx.moveTo(fX + 5, followerSideY);
            ctx.lineTo(fX + 8, followerSideY - 5);
            ctx.lineTo(fX + 2, followerSideY - 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw follower eyes
            const fY = followerSideY + followerSize / 2;
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(fX - 4, fY - 4, 3, 0, Math.PI * 2);
            ctx.arc(fX + 4, fY - 4, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Pupils
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(fX - 4, fY - 4, 1.5, 0, Math.PI * 2);
            ctx.arc(fX + 4, fY - 4, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Draw follower name
            ctx.fillStyle = '#000';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(followPokemon.name, fX, followerSideY - 5);
            ctx.textAlign = 'left';
        }
    }

    // Draw player (side view)
    const playerY = game.player.y + 68;
    const pSideX = game.player.x + game.player.width / 2;
    const pSideY = playerY + game.player.height / 2;

    // Draw hair BEHIND for girl trainers (side view)
    if (game.player.character && game.player.character.type === 'girl') {
        const hairColor = darkenColor(game.player.color, 0.3);
        ctx.fillStyle = hairColor;
        // Long hair flowing behind
        ctx.fillRect(game.player.x - 8, playerY, 10, game.player.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(game.player.x - 8, playerY, 10, game.player.height);
    }

    // Draw hat for boy trainers (side view)
    if (game.player.character && game.player.character.type === 'boy') {
        const hatX = game.player.x + game.player.width / 2;

        // Hat brim
        ctx.fillStyle = '#000';
        ctx.fillRect(hatX - 18, playerY - 14, 36, 4);

        // Hat top
        ctx.fillStyle = game.player.color;
        ctx.fillRect(hatX - 12, playerY - 24, 24, 10);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(hatX - 12, playerY - 24, 24, 10);

        // Hat logo/button
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(hatX, playerY - 19, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Player body
    ctx.fillStyle = game.player.color;
    ctx.fillRect(game.player.x, playerY, game.player.width, game.player.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeRect(game.player.x, playerY, game.player.width, game.player.height);

    // Draw falling fruit (side view)
    game.fallingFruit.forEach(fruit => {
        const fruitSideY = fruit.y + 68;
        if (fruit.type === 'coconut') {
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.arc(fruit.x, fruitSideY, fruit.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            // Banana
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#DAA520';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(fruit.x, fruitSideY, fruit.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    });

    // Draw egg hatching progress at bottom of screen
    if (game.eggs.length > 0) {
        const startY = canvas.height - 80;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, startY, 300, 70);

        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('🥚 Eggs Hatching:', 20, startY + 20);

        game.eggs.forEach((egg, index) => {
            const y = startY + 35 + (index * 20);
            const progress = egg.steps / egg.stepsToHatch;

            // Progress bar background
            ctx.fillStyle = '#444';
            ctx.fillRect(20, y, 200, 12);

            // Progress bar fill
            ctx.fillStyle = egg.color;
            ctx.fillRect(20, y, 200 * progress, 12);

            // Progress bar border
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(20, y, 200, 12);

            // Progress text
            ctx.fillStyle = '#FFF';
            ctx.font = '10px Arial';
            ctx.fillText(`${Math.floor(progress * 100)}%`, 230, y + 10);
        });
    }

    ctx.lineWidth = 1;
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Set up event listeners AFTER all functions are defined
document.addEventListener('keydown', (e) => {
    // Prevent actions if key is already pressed (held down)
    if (game.keys[e.key.toLowerCase()]) {
        return;
    }

    game.keys[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === 'v') {
        switchView();
    } else if (e.key.toLowerCase() === 'b') {
        openBuildMenu();
    } else if (e.key.toLowerCase() === 'p') {
        openPokemonList();
    } else if (e.key.toLowerCase() === 'm') {
        if (musicPlaying) {
            stopMusic();
            document.getElementById('toggleMusic').textContent = 'Music: OFF (M)';
        } else {
            startMusic();
            document.getElementById('toggleMusic').textContent = 'Music: ON (M)';
        }
    }
});

document.addEventListener('keyup', (e) => {
    game.keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Handle battle screen clicks
    if (game.inBattle) {
        handleBattleClick(clickX, clickY);
        return;
    }

    const worldX = clickX - canvas.width / 2 + game.player.x;
    const worldY = clickY - canvas.height / 2 + game.player.y;

    // Check if clicking on a Pokemon
    let clickedPokemon = false;
    game.pokemon.forEach((pokemon, index) => {
        if (worldX >= pokemon.x && worldX <= pokemon.x + pokemon.width &&
            worldY >= pokemon.y && worldY <= pokemon.y + pokemon.height) {
            // Ask what to do
            const choice = confirm(`You found ${pokemon.name}!\n\nClick OK to FIGHT\nClick CANCEL to COLLECT peacefully`);
            if (choice) {
                // Fight!
                if (game.caughtPokemon.length === 0) {
                    alert('You need at least 1 Pokemon before you can battle! Try collecting this one first.');
                    peacefulCatch(pokemon, index);
                } else {
                    startBattle(pokemon, index);
                }
            } else {
                // Collect
                peacefulCatch(pokemon, index);
            }
            clickedPokemon = true;
        }
    });

    // If didn't click a Pokemon, set as movement target
    if (!clickedPokemon) {
        game.clickTarget = {
            x: worldX,
            y: worldY
        };
    }
});

document.getElementById('switchView').onclick = (e) => {
    e.stopPropagation();
    switchView();
};
document.getElementById('buildMenu').onclick = (e) => {
    e.stopPropagation();
    openBuildMenu();
};
document.getElementById('pokemonList').onclick = (e) => {
    e.stopPropagation();
    openPokemonList();
};
document.getElementById('toggleMusic').onclick = (e) => {
    e.stopPropagation();
    if (musicPlaying) {
        stopMusic();
        document.getElementById('toggleMusic').textContent = 'Music: OFF (M)';
    } else {
        startMusic();
        document.getElementById('toggleMusic').textContent = 'Music: ON (M)';
    }
};
document.getElementById('saveGame').onclick = (e) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - buttonCooldowns.saveGame < 500) return;
    buttonCooldowns.saveGame = now;
    saveGame();
    alert('Game saved! ✅');
};
document.getElementById('newGame').onclick = (e) => {
    e.stopPropagation();
    if (confirm('Are you sure? This will delete your current game and start fresh!')) {
        localStorage.removeItem('pokemonResortSave');
        location.reload();
    }
};

// Start
setupCharacterSelect();
