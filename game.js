/* =========================================
   BHAVNANI GAMES
   GAME CONTROLLER
   ========================================= */

const introScreen = document.getElementById("intro-screen");
const titleScreen = document.getElementById("title-screen");
const mainMenu = document.getElementById("main-menu");
const storyScreen = document.getElementById("story-screen");
const settingsScreen = document.getElementById("settings-screen");
const gameWorld = document.getElementById("game-world");

const startButton = document.getElementById("start-button");
const newGameButton = document.getElementById("new-game-button");
const continueButton = document.getElementById("continue-button");
const settingsButton = document.getElementById("settings-button");
const storyContinueButton = document.getElementById("story-continue-button");
const backButton = document.getElementById("back-button");

const storyTitle = document.getElementById("story-title");
const storyText = document.getElementById("story-text");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = "intro";
let gameTime = 0;
let gameClock = null;

const player = {
    x: 0,
    y: 0,
    size: 35,
    speed: 4,
    health: 100
};

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};


/* =========================================
   SCREEN SYSTEM
   ========================================= */

function hideAllScreens() {

    introScreen.classList.add("hidden");
    titleScreen.classList.add("hidden");
    mainMenu.classList.add("hidden");
    storyScreen.classList.add("hidden");
    settingsScreen.classList.add("hidden");
    gameWorld.classList.add("hidden");

}


function showScreen(screen) {

    hideAllScreens();
    screen.classList.remove("hidden");

}


/* =========================================
   INTRO
   ========================================= */

function startIntro() {

    gameState = "intro";

    showScreen(introScreen);

    setTimeout(() => {

        showTitleScreen();

    }, 3500);

}


/* =========================================
   TITLE
   ========================================= */

function showTitleScreen() {

    gameState = "title";

    showScreen(titleScreen);

}


/* =========================================
   MAIN MENU
   ========================================= */

function showMainMenu() {

    gameState = "menu";

    showScreen(mainMenu);

}


/* =========================================
   STORY
   ========================================= */

function showStory() {

    gameState = "story";

    storyTitle.textContent = "THE BEGINNING";

    storyText.textContent =
        "Something has changed. " +
        "The world you are about to enter is full of unknown places, " +
        "dangerous situations and secrets waiting to be discovered. " +
        "Your journey begins now.";

    showScreen(storyScreen);

}


/* =========================================
   START GAME
   ========================================= */

function startGame() {

    gameState = "playing";

    showScreen(gameWorld);

    setupGame();

    startGameClock();

    requestAnimationFrame(gameLoop);

}


/* =========================================
   GAME SETUP
   ========================================= */

function setupGame() {

    resizeCanvas();

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.health = 100;

    updateHealth();

}


/* =========================================
   CANVAS SIZE
   ========================================= */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}


/* =========================================
   GAME LOOP
   ========================================= */

function gameLoop() {

    if (gameState !== "playing") {
        return;
    }

    updatePlayer();
    drawGame();

    requestAnimationFrame(gameLoop);

}


/* =========================================
   PLAYER MOVEMENT
   ========================================= */

function updatePlayer() {

    if (keys.up) {
        player.y -= player.speed;
    }

    if (keys.down) {
        player.y += player.speed;
    }

    if (keys.left) {
        player.x -= player.speed;
    }

    if (keys.right) {
        player.x += player.speed;
    }


    /* Keep player inside screen */

    if (player.x < player.size / 2) {
        player.x = player.size / 2;
    }

    if (player.y < player.size / 2) {
        player.y = player.size / 2;
    }

    if (player.x > canvas.width - player.size / 2) {
        player.x = canvas.width - player.size / 2;
    }

    if (player.y > canvas.height - player.size / 2) {
        player.y = canvas.height - player.size / 2;
    }

}


/* =========================================
   DRAW GAME
   ========================================= */

function drawGame() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* WORLD */

    ctx.fillStyle = "#111";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* GROUND GRID */

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;

    const gridSize = 60;

    for (
        let x = 0;
        x < canvas.width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        ctx.stroke();

    }


    for (
        let y = 0;
        y < canvas.height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);

        ctx.stroke();

    }


    /* PLAYER */

    drawPlayer();


    /* OBJECTIVE */

    const objective =
        document.getElementById("objective");

    if (objective) {

        objective.textContent =
            "Objective: Explore the area";

    }

}


/* =========================================
   PLAYER
   ========================================= */

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );


    /* Shadow */

    ctx.beginPath();

    ctx.ellipse(
        0,
        player.size / 2,
        player.size * 0.55,
        player.size * 0.18,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fill();


    /* Body */

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        -player.size / 2,
        -player.size / 2,
        player.size,
        player.size
    );


    /* Head */

    ctx.beginPath();

    ctx.arc(
        0,
        -player.size * 0.65,
        player.size * 0.3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#dddddd";
    ctx.fill();


    /* Direction */

    ctx.beginPath();

    ctx.moveTo(
        0,
        -player.size
    );

    ctx.lineTo(
        6,
        -player.size + 10
    );

    ctx.lineTo(
        -6,
        -player.size + 10
    );

    ctx.closePath();

    ctx.fillStyle = "#ffffff";
    ctx.fill();


    ctx.restore();

}


/* =========================================
   HEALTH
   ========================================= */

function updateHealth() {

    const healthElement =
        document.getElementById("health");

    if (healthElement) {

        healthElement.textContent =
            "❤️ Health: " + player.health;

    }

}


/* =========================================
   GAME CLOCK
   ========================================= */

function startGameClock() {

    if (gameClock) {
        clearInterval(gameClock);
    }

    gameTime = 0;

    gameClock = setInterval(() => {

        if (gameState !== "playing") {
            return;
        }

        gameTime++;

        const minutes =
            Math.floor(gameTime / 60);

        const seconds =
            gameTime % 60;

        const formattedTime =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

        const timeElement =
            document.getElementById("game-time");

        if (timeElement) {

            timeElement.textContent =
                formattedTime;

        }

    }, 1000);

}


/* =========================================
   KEYBOARD CONTROLS
   ========================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "w" || event.key === "ArrowUp") {
        keys.up = true;
    }

    if (event.key === "s" || event.key === "ArrowDown") {
        keys.down = true;
    }

    if (event.key === "a" || event.key === "ArrowLeft") {
        keys.left = true;
    }

    if (event.key === "d" || event.key === "ArrowRight") {
        keys.right = true;
    }

});


document.addEventListener("keyup", (event) => {

    if (event.key === "w" || event.key === "ArrowUp") {
        keys.up = false;
    }

    if (event.key === "s" || event.key === "ArrowDown") {
        keys.down = false;
    }

    if (event.key === "a" || event.key === "ArrowLeft") {
        keys.left = false;
    }

    if (event.key === "d" || event.key === "ArrowRight") {
        keys.right = false;
    }

});


/* =========================================
   BUTTONS
   ========================================= */

startButton.addEventListener("click", () => {

    showMainMenu();

});


newGameButton.addEventListener("click", () => {

    showStory();

});


continueButton.addEventListener("click", () => {

    startGame();

});


settingsButton.addEventListener("click", () => {

    gameState = "settings";

    showScreen(settingsScreen);

});


storyContinueButton.addEventListener("click", () => {

    startGame();

});


backButton.addEventListener("click", () => {

    showMainMenu();

});


/* =========================================
   WINDOW RESIZE
   ========================================= */

window.addEventListener("resize", () => {

    if (gameState === "playing") {

        resizeCanvas();

    }

});


/* =========================================
   INITIALIZE
   ========================================= */

window.addEventListener("load", () => {

    console.log(
        "BHAVNANI GAMES - SYSTEM INITIALIZED"
    );

    startIntro();

});
