// Game constants
const TILE_SIZE = 32;
const GRAVITY = 0.5;
const FRICTION = 0.8;
const JUMP_FORCE = 12;
const MOVEMENT_SPEED = 5;

// Game state
let canvas, ctx;
let score = 0;
let level = 1;
let gameRunning = true;
let lastTime = 0;

// Assets
const assets = {
    sprites: {},
    sounds: {},
    loaded: false
};

// Game objects
const mario = {
    x: 100,
    y: 100,
    width: 32,
    height: 64,
    velX: 0,
    velY: 0,
    speed: MOVEMENT_SPEED,
    jumping: false,
    grounded: false,
    facingRight: true,
    frame: 0,
    frameCount: 3,
    frameDelay: 5,
    frameTimer: 0
};

let platforms = [];
let coins = [];
let enemies = [];

// Level designs (1 = platform, 2 = coin, 3 = enemy)
// Level designs with 8 levels total
const levels = [
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0],
        [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 2, 2, 2, 0, 1, 1, 1, 0, 2, 2, 2, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 2, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 2, 2, 2, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 3, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

// Initialize game
window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 480;
    
    // Show start screen
    showStartScreen();
};

// Show start screen
function showStartScreen() {
    // Create start screen overlay
    const overlay = document.createElement('div');
    overlay.className = 'start-screen-overlay';
    overlay.innerHTML = `
        <div class="start-screen-content">
            <h1>Mini Mario Adventures</h1>
            <p>Use arrow keys to move and space/up arrow to jump</p>
            <p>Collect coins and stomp on enemies</p>
            <button id="startButton">Start Game</button>
        </div>
    `;
    
    // Add overlay styles
    const style = document.createElement('style');
    style.textContent = `
        .start-screen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
        .start-screen-content {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        .start-screen-content h1 {
            color: #E52521;
            font-size: 2.2rem;
            margin-bottom: 1rem;
        }
        .start-screen-content p {
            font-size: 1.1rem;
            margin-bottom: 0.8rem;
        }
        #startButton {
            background-color: #E52521;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            font-size: 1.2rem;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
            transition: background-color 0.3s;
        }
        #startButton:hover {
            background-color: #ff3c38;
        }
    `;
    
    // Add to document
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    // Add start button functionality
    document.getElementById('startButton').addEventListener('click', function() {
        // Remove overlay
        document.body.removeChild(overlay);
        
        // Start the game
        startGame();
    });
}

// Start the game
function startGame() {
    // Load assets
    loadAssets().then(() => {
        // Initialize level
        loadLevel(level - 1);
        
        // Start game loop
        gameRunning = true;
        requestAnimationFrame(gameLoop);
        
        // Set up event listeners for controls
        setupControls();
    });
}

// Load game assets
async function loadAssets() {
    const marioSprite = new Image();
    marioSprite.src = 'assets/mario.png';
    
    const platformImg = new Image();
    platformImg.src = 'assets/platform.png';
    
    const coinImg = new Image();
    coinImg.src = 'assets/coin.png';
    
    const enemyImg = new Image();
    enemyImg.src = 'assets/enemy.png';
    
    // Load audio
    const jumpSound = new Audio('assets/jump.mp3');
    const coinSound = new Audio('assets/coin.mp3');
    const bgMusic = new Audio('assets/bg-music.mp3');
    
    // Wait for images to load
    await Promise.all([
        new Promise(resolve => marioSprite.onload = resolve),
        new Promise(resolve => platformImg.onload = resolve),
        new Promise(resolve => coinImg.onload = resolve),
        new Promise(resolve => enemyImg.onload = resolve)
    ]).catch(err => console.error('Error loading assets:', err));
    
    // Store loaded assets
    assets.sprites.mario = marioSprite;
    assets.sprites.platform = platformImg;
    assets.sprites.coin = coinImg;
    assets.sprites.enemy = enemyImg;
    
    assets.sounds.jump = jumpSound;
    assets.sounds.coin = coinSound;
    assets.sounds.bgMusic = bgMusic;
    
    // Loop background music
    assets.sounds.bgMusic.loop = true;
    assets.sounds.bgMusic.volume = 0.5;
    
    // Mark assets as loaded
    assets.loaded = true;
    
    // Create placeholder assets for testing until real assets are available
    createPlaceholderAssets();
    
    // Play background music
    assets.sounds.bgMusic.play().catch(e => console.log("Audio couldn't autoplay:", e));
}

// Create placeholder sprite assets if actual assets fail to load
function createPlaceholderAssets() {
    // Create placeholder canvas for mario
    const marioCanvas = document.createElement('canvas');
    marioCanvas.width = 32;
    marioCanvas.height = 64;
    const marioCtx = marioCanvas.getContext('2d');
    marioCtx.fillStyle = 'red';
    marioCtx.fillRect(0, 0, 32, 64);
    
    // Create placeholder canvas for platform
    const platformCanvas = document.createElement('canvas');
    platformCanvas.width = 32;
    platformCanvas.height = 32;
    const platformCtx = platformCanvas.getContext('2d');
    platformCtx.fillStyle = 'brown';
    platformCtx.fillRect(0, 0, 32, 32);
    
    // Create placeholder canvas for coin
    const coinCanvas = document.createElement('canvas');
    coinCanvas.width = 16;
    coinCanvas.height = 16;
    const coinCtx = coinCanvas.getContext('2d');
    coinCtx.fillStyle = 'gold';
    coinCtx.beginPath();
    coinCtx.arc(8, 8, 8, 0, Math.PI * 2);
    coinCtx.fill();
    
    // Create placeholder canvas for enemy
    const enemyCanvas = document.createElement('canvas');
    enemyCanvas.width = 32;
    enemyCanvas.height = 32;
    const enemyCtx = enemyCanvas.getContext('2d');
    enemyCtx.fillStyle = '#333';
    enemyCtx.fillRect(0, 0, 32, 32);
    
    // Use placeholders if real assets didn't load
    if (!assets.sprites.mario.complete) assets.sprites.mario = marioCanvas;
    if (!assets.sprites.platform.complete) assets.sprites.platform = platformCanvas;
    if (!assets.sprites.coin.complete) assets.sprites.coin = coinCanvas;
    if (!assets.sprites.enemy.complete) assets.sprites.enemy = enemyCanvas;
}

// Load level data
function loadLevel(levelIdx) {
    platforms = [];
    coins = [];
    enemies = [];
    
    const levelData = levels[levelIdx];
    
    // Reset player position
    mario.x = 100;
    mario.y = 100;
    mario.velX = 0;
    mario.velY = 0;
    
    // Parse level data
    for (let row = 0; row < levelData.length; row++) {
        for (let col = 0; col < levelData[row].length; col++) {
            const cellType = levelData[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;
            
            switch (cellType) {
                case 1: // Platform
                    platforms.push({ x, y, width: TILE_SIZE, height: TILE_SIZE });
                    break;
                case 2: // Coin
                    coins.push({ 
                        x, 
                        y, 
                        width: TILE_SIZE, 
                        height: TILE_SIZE, 
                        collected: false,
                        type: 'coin' // Explicitly mark as coin
                    });
                    break;
                case 3: // Enemy
                    enemies.push({ 
                        x, 
                        y, 
                        width: TILE_SIZE, 
                        height: TILE_SIZE,
                        velX: -2,
                        direction: -1,
                        type: 'enemy' // Explicitly mark as enemy
                    });
                    break;
            }
        }
    }
    
    console.log(`Level ${level} loaded with ${coins.length} coins and ${enemies.length} enemies`);
}

// Set up game controls
function setupControls() {
    const keys = {};
    
    // Key press event
    window.addEventListener('keydown', function(e) {
        keys[e.key] = true;
        
        // Prevent space bar scrolling
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
        }
    });
    
    // Key release event
    window.addEventListener('keyup', function(e) {
        keys[e.key] = false;
    });
    
    // Update player controls in game loop
    window.gameControls = function() {
        // Left movement
        if (keys['ArrowLeft']) {
            mario.velX = -mario.speed;
            mario.facingRight = false;
        }
        // Right movement
        else if (keys['ArrowRight']) {
            mario.velX = mario.speed;
            mario.facingRight = true;
        }
        // No horizontal input - slow down with friction
        else {
            mario.velX *= FRICTION;
        }
        
        // Jump (only when on ground) - with spacebar or up arrow
        if ((keys[' '] || keys['ArrowUp']) && mario.grounded) {
            mario.velY = -JUMP_FORCE;
            mario.grounded = false;
            // Play jump sound
            assets.sounds.jump.currentTime = 0;
            assets.sounds.jump.play().catch(e => console.log("Couldn't play jump sound"));
        }
    };
}

// Main game loop
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Skip if assets aren't loaded
    if (!assets.loaded) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // Process controls
    if (typeof window.gameControls === 'function') {
        window.gameControls();
    }
    
    // Update game logic
    update(deltaTime);
    
    // Render game
    render();
    
    // Continue game loop if game is running
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Update game logic
function update(deltaTime) {
    // Apply physics to player
    mario.velY += GRAVITY;
    
    // Reset grounded state
    mario.grounded = false;
    
    // Update player position
    mario.x += mario.velX;
    mario.y += mario.velY;
    
    // Prevent leaving screen to the left
    if (mario.x < 0) {
        mario.x = 0;
    }
    
    // Prevent leaving screen to the right
    if (mario.x + mario.width > canvas.width) {
        mario.x = canvas.width - mario.width;
    }
    
    // Update animation frame
    if (Math.abs(mario.velX) > 0.5) {
        mario.frameTimer++;
        
        if (mario.frameTimer >= mario.frameDelay) {
            mario.frame = (mario.frame + 1) % mario.frameCount;
            mario.frameTimer = 0;
        }
    } else {
        mario.frame = 0;
    }
    
    // Check collision with platforms
    platforms.forEach(platform => {
        const collision = checkCollision(mario, platform);
        
        if (collision.x) {
            mario.x = collision.x;
            mario.velX = 0;
        }
        
        if (collision.y) {
            mario.y = collision.y;
            mario.velY = 0;
            
            // Set grounded if collision from above
            if (collision.direction === 'bottom') {
                mario.grounded = true;
            }
        }
    });
    
    // Check collision with coins
    coins.forEach(coin => {
        if (!coin.collected && checkSimpleCollision(mario, coin)) {
            coin.collected = true;
            score += 10;
            updateScore();
            
            // Play coin sound
            assets.sounds.coin.currentTime = 0;
            assets.sounds.coin.play().catch(e => console.log("Couldn't play coin sound"));
        }
    });
    
    // Debug - log coin count
    const debugRemainingCoins = coins.filter(coin => !coin.collected).length;
    if (debugRemainingCoins === 0 && coins.length > 0) {
        console.log("All coins collected in level " + level);
    }
    
    // Update enemies
    enemies.forEach(enemy => {
        // Move enemy
        enemy.x += enemy.velX;
        
        // Check if enemy hits a platform edge to reverse direction
        let onPlatform = false;
        let hitWall = false;
        
        platforms.forEach(platform => {
            // Check if enemy is on a platform
            if (enemy.y + enemy.height === platform.y && 
                enemy.x + enemy.width > platform.x && 
                enemy.x < platform.x + platform.width) {
                onPlatform = true;
            }
            
            // Check if enemy hits a wall
            if (checkSimpleCollision(enemy, platform) &&
                ((enemy.direction === -1 && enemy.x <= platform.x + platform.width && enemy.x > platform.x) ||
                 (enemy.direction === 1 && enemy.x + enemy.width >= platform.x && enemy.x < platform.x))) {
                hitWall = true;
            }
        });
        
        // Check platform edges
        const aheadX = enemy.x + (enemy.direction === -1 ? -1 : enemy.width + 1);
        let willFall = true;
        
        platforms.forEach(platform => {
            if (aheadX >= platform.x && 
                aheadX <= platform.x + platform.width &&
                enemy.y + enemy.height === platform.y) {
                willFall = false;
            }
        });
        
        // Reverse direction if will fall off platform or hit wall
        if (willFall || hitWall) {
            enemy.direction *= -1;
            enemy.velX *= -1;
        }
        
        // Check collision with player
        if (checkSimpleCollision(mario, enemy)) {
            // If player is above enemy (jumping on it)
            if (mario.velY > 0 && mario.y + mario.height - mario.velY <= enemy.y + enemy.height/2) {
                // Remove enemy
                const idx = enemies.indexOf(enemy);
                if (idx !== -1) {
                    enemies.splice(idx, 1);
                    console.log("Enemy defeated!");
                }
                
                // Bounce player
                mario.velY = -JUMP_FORCE / 1.5;
                
                // Add score
                score += 50;
                updateScore();
            } else {
                // Player hit by enemy - restart from level 1
                console.log("Player hit by enemy - restarting from level 1");
                level = 1;
                document.getElementById('level').textContent = level;
                loadLevel(level - 1);
                score -= 50;
                if (score < 0) score = 0;
                updateScore();
            }
        }
    });
    
    // Check if player fell off the bottom of the screen
    if (mario.y > canvas.height) {
        // Reset to level 1
        level = 1;
        document.getElementById('level').textContent = level;
        loadLevel(level - 1);
        score -= 50;
        if (score < 0) score = 0;
        updateScore();
    }
    
    // Check if all coins are collected
    const remainingCoins = coins.filter(coin => !coin.collected).length;
    if (remainingCoins === 0 && coins.length > 0) {
        // Advance to next level or show completion screen
        level++;
        if (level > levels.length) {
            showGameCompleteScreen();
            return;
        }
        document.getElementById('level').textContent = level;
        loadLevel(level - 1);
        console.log("Advanced to level " + level);
    }
}

// Render game objects
function render() {
    // Draw background
    ctx.fillStyle = '#6B8CFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw platforms
    platforms.forEach(platform => {
        try {
            ctx.drawImage(assets.sprites.platform, platform.x, platform.y, platform.width, platform.height);
        } catch(e) {
            // Fallback to rectangle if image fails
            ctx.fillStyle = 'brown';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    });
    
    // Draw coins (only if not collected)
    coins.forEach(coin => {
        if (!coin.collected) {
            try {
                ctx.drawImage(assets.sprites.coin, coin.x, coin.y, coin.width, coin.height);
            } catch(e) {
                // Fallback to circle if image fails
                ctx.fillStyle = 'gold';
                ctx.beginPath();
                ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
    
    // Draw enemies
    enemies.forEach(enemy => {
        try {
            ctx.drawImage(assets.sprites.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
        } catch(e) {
            // Fallback to rectangle if image fails
            ctx.fillStyle = '#333';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
    
    // Draw player
    ctx.save();
    try {
        if (!mario.facingRight) {
            ctx.scale(-1, 1);
            ctx.drawImage(assets.sprites.mario, mario.x * -1 - mario.width, mario.y, mario.width, mario.height);
        } else {
            ctx.drawImage(assets.sprites.mario, mario.x, mario.y, mario.width, mario.height);
        }
    } catch(e) {
        // Fallback to rectangle if image fails
        ctx.fillStyle = 'red';
        ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
    }
    ctx.restore();
}

// Check collision between two rectangular objects with direction
function checkCollision(obj1, obj2) {
    const result = { x: null, y: null, direction: null };
    
    // Calculate edges of objects
    const obj1Left = obj1.x;
    const obj1Right = obj1.x + obj1.width;
    const obj1Top = obj1.y;
    const obj1Bottom = obj1.y + obj1.height;
    
    const obj2Left = obj2.x;
    const obj2Right = obj2.x + obj2.width;
    const obj2Top = obj2.y;
    const obj2Bottom = obj2.y + obj2.height;
    
    // Check if objects overlap
    if (obj1Right <= obj2Left || obj1Left >= obj2Right || 
        obj1Bottom <= obj2Top || obj1Top >= obj2Bottom) {
        return result;
    }
    
    // Calculate overlap amounts
    const overlapLeft = obj1Right - obj2Left;
    const overlapRight = obj2Right - obj1Left;
    const overlapTop = obj1Bottom - obj2Top;
    const overlapBottom = obj2Bottom - obj1Top;
    
    // Find smallest overlap - this is the collision direction
    const minOverlapX = Math.min(overlapLeft, overlapRight);
    const minOverlapY = Math.min(overlapTop, overlapBottom);
    
    // Resolve collision based on smallest overlap
    if (minOverlapX < minOverlapY) {
        if (overlapLeft < overlapRight) {
            result.x = obj2Left - obj1.width;
            result.direction = 'right';
        } else {
            result.x = obj2Right;
            result.direction = 'left';
        }
    } else {
        if (overlapTop < overlapBottom) {
            result.y = obj2Top - obj1.height;
            result.direction = 'bottom';
        } else {
            result.y = obj2Bottom;
            result.direction = 'top';
        }
    }
    
    return result;
}

// Simple bounding box collision check
function checkSimpleCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Show game complete screen
function showGameCompleteScreen() {
    // Stop game loop
    gameRunning = false;
    
    // Create game complete overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-complete-overlay';
    overlay.innerHTML = `
        <div class="game-complete-content">
            <h2>Congratulations!</h2>
            <p>You completed Mini Mario Adventures!</p>
            <p>Final Score: ${score}</p>
            <button id="restartButton">Play Again</button>
        </div>
    `;
    
    // Add overlay styles
    const style = document.createElement('style');
    style.textContent = `
        .game-complete-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
        .game-complete-content {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        .game-complete-content h2 {
            color: #E52521;
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        .game-complete-content p {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
        #restartButton {
            background-color: #E52521;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            font-size: 1.2rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #restartButton:hover {
            background-color: #ff3c38;
        }
    `;
    
    // Add to document
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    // Add restart button functionality
    document.getElementById('restartButton').addEventListener('click', function() {
        // Remove overlay
        document.body.removeChild(overlay);
        
        // Reset game
        score = 0;
        level = 1;
        updateScore();
        document.getElementById('level').textContent = level;
        loadLevel(level - 1);
        
        // Restart game loop
        gameRunning = true;
        requestAnimationFrame(gameLoop);
    });
} 