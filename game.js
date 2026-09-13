/* =========================================
   BHAVNANI GAMES
   MAIN GAME CONTROLLER
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

let gameState = "intro";
let gameTime = 0;


/* =========================================
   SCREEN CONTROL
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
   TITLE SCREEN
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
        "A new world is waiting. " +
        "Something has changed, and your journey is about to begin. " +
        "Explore the world, discover its secrets, and find out what happened.";

    showScreen(storyScreen);
}


/* =========================================
   GAME WORLD
   ========================================= */

function startGame() {

    gameState = "playing";

    showScreen(gameWorld);

    console.log("Bhavnani Games: Game Started");

    startGameClock();
}


/* =========================================
   GAME CLOCK
   ========================================= */

function startGameClock() {

    gameTime = 0;

    setInterval(() => {

        if (gameState !== "playing") {
            return;
        }

        gameTime++;

        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;

        const formattedTime =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

        document.getElementById("game-time").textContent =
            formattedTime;

    }, 1000);
}


/* =========================================
   BUTTON EVENTS
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
   KEYBOARD CONTROLS
   ========================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (gameState === "settings") {

            showMainMenu();

        }

    }

});


/* =========================================
   GAME INITIALIZATION
   ========================================= */

window.addEventListener("load", () => {

    console.log("=================================");
    console.log("BHAVNANI GAMES");
    console.log("Game System Initialized");
    console.log("=================================");

    startIntro();

});
