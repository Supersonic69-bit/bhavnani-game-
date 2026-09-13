// BHAVNANI GAMES
// BASIC SCREEN TEST

const introScreen = document.getElementById("introScreen");
const titleScreen = document.getElementById("titleScreen");
const mainMenu = document.getElementById("mainMenu");
const storyScreen = document.getElementById("storyScreen");
const gameWorld = document.getElementById("gameWorld");
const settingsScreen = document.getElementById("settingsScreen");

function hideAll() {
    if (introScreen) introScreen.classList.add("hidden");
    if (titleScreen) titleScreen.classList.add("hidden");
    if (mainMenu) mainMenu.classList.add("hidden");
    if (storyScreen) storyScreen.classList.add("hidden");
    if (gameWorld) gameWorld.classList.add("hidden");
    if (settingsScreen) settingsScreen.classList.add("hidden");
}

function show(screen) {
    hideAll();

    if (screen) {
        screen.classList.remove("hidden");
    }
}

// INTRO → TITLE
setTimeout(function () {
    show(titleScreen);
}, 3500);


// START → MENU
const startButton = document.getElementById("startButton");

if (startButton) {
    startButton.onclick = function () {
        show(mainMenu);
    };
}


// NEW GAME → STORY
const newGameButton = document.getElementById("newGameButton");

if (newGameButton) {
    newGameButton.onclick = function () {
        show(storyScreen);
    };
}


// CONTINUE → GAME
const continueButton = document.getElementById("continueButton");

if (continueButton) {
    continueButton.onclick = function () {
        show(gameWorld);
    };
}


// STORY CONTINUE → GAME
const storyContinue = document.getElementById("storyContinue");

if (storyContinue) {
    storyContinue.onclick = function () {
        show(gameWorld);
    };
}


// SETTINGS
const settingsButton = document.getElementById("settingsButton");

if (settingsButton) {
    settingsButton.onclick = function () {
        show(settingsScreen);
    };
}


// BACK
const backButton = document.getElementById("backButton");

if (backButton) {
    backButton.onclick = function () {
        show(mainMenu);
    };
}
