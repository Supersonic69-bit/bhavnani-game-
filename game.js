import * as THREE from "three";

// ==========================================
// BHAVNANI GAMES
// 3D GAME ENGINE
// ==========================================

// ---------- SCREENS ----------
const introScreen = document.getElementById("intro-screen");
const titleScreen = document.getElementById("title-screen");
const mainMenu = document.getElementById("main-menu");
const storyScreen = document.getElementById("story-screen");
const gameWorld = document.getElementById("game-world");
const settingsScreen = document.getElementById("settings-screen");

// ---------- BUTTONS ----------
const startButton = document.getElementById("start-button");
const newGameButton = document.getElementById("new-game-button");
const continueButton = document.getElementById("continue-button");
const settingsButton = document.getElementById("settings-button");
const storyContinueButton = document.getElementById("story-continue-button");
const backButton = document.getElementById("back-button");

const audioSettings = document.getElementById("audio-settings");
const graphicsSettings = document.getElementById("graphics-settings");
const controlsSettings = document.getElementById("controls-settings");

// ---------- GAME DATA ----------
const healthElement = document.getElementById("health");
const objectiveElement = document.getElementById("objective");
const gameTimeElement = document.getElementById("game-time");

let gameState = "intro";


// ==========================================
// SCREEN SYSTEM
// ==========================================

function hideAllScreens() {
    introScreen.classList.add("hidden");
    titleScreen.classList.add("hidden");
    mainMenu.classList.add("hidden");
    storyScreen.classList.add("hidden");
    gameWorld.classList.add("hidden");
    settingsScreen.classList.add("hidden");
}


function showScreen(screen) {
    hideAllScreens();
    screen.classList.remove("hidden");
}


// ==========================================
// INTRO
// ==========================================

setTimeout(() => {

    if (gameState === "intro") {
        gameState = "title";
        showScreen(titleScreen);
    }

}, 3500);


// ==========================================
// TITLE
// ==========================================

startButton.addEventListener("click", () => {

    gameState = "menu";
    showScreen(mainMenu);

});


// ==========================================
// MAIN MENU
// ==========================================

newGameButton.addEventListener("click", () => {

    gameState = "story";

    document.getElementById("story-title").textContent =
        "THE BEGINNING";

    document.getElementById("story-text").textContent =
        "A new world awaits. Your journey begins now.";

    showScreen(storyScreen);

});


continueButton.addEventListener("click", () => {

    start3DGame();

});


settingsButton.addEventListener("click", () => {

    gameState = "settings";
    showScreen(settingsScreen);

});


storyContinueButton.addEventListener("click", () => {

    start3DGame();

});


backButton.addEventListener("click", () => {

    gameState = "menu";
    showScreen(mainMenu);

});


// ==========================================
// SETTINGS
// ==========================================

let audioEnabled = true;

audioSettings.addEventListener("click", () => {

    audioEnabled = !audioEnabled;

    audioSettings.textContent =
        audioEnabled ? "AUDIO: ON" : "AUDIO: OFF";

});


graphicsSettings.addEventListener("click", () => {

    graphicsSettings.textContent =
        graphicsSettings.textContent === "GRAPHICS: HIGH"
            ? "GRAPHICS: LOW"
            : "GRAPHICS: HIGH";

});


controlsSettings.addEventListener("click", () => {

    alert(
        "CONTROLS\n\n" +
        "W / Arrow Up = Move Forward\n" +
        "S / Arrow Down = Move Backward\n" +
        "A / Arrow Left = Move Left\n" +
        "D / Arrow Right = Move Right"
    );

});


// ==========================================
// THREE.JS VARIABLES
// ==========================================

let scene;
let camera;
let renderer;

let player;
let ground;

let clock;

let gameStarted = false;
let gameStartTime = 0;

const keys = {};


// ==========================================
// KEYBOARD
// ==========================================

window.addEventListener("keydown", (event) => {

    keys[event.key.toLowerCase()] = true;

});


window.addEventListener("keyup", (event) => {

    keys[event.key.toLowerCase()] = false;

});


// ==========================================
// START 3D GAME
// ==========================================

function start3DGame() {

    gameState = "playing";

    showScreen(gameWorld);

    if (!gameStarted) {

        init3DWorld();

        gameStarted = true;

    }

    gameStartTime = Date.now();

}


// ==========================================
// CREATE 3D WORLD
// ==========================================

function init3DWorld() {

    const canvas = document.getElementById("gameCanvas");


    // ======================================
    // SCENE
    // ======================================

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x101820);


    // ======================================
    // CAMERA
    // ======================================

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(
        0,
        6,
        10
    );


    // ======================================
    // RENDERER
    // ======================================

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.shadowMap.enabled = true;


    // ======================================
    // LIGHTING
    // ======================================

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        1.5
    );

    scene.add(ambientLight);


    const sunLight = new THREE.DirectionalLight(
        0xffffff,
        2
    );

    sunLight.position.set(
        20,
        30,
        10
    );

    sunLight.castShadow = true;

    scene.add(sunLight);


    // ======================================
    // GROUND
    // ======================================

    const groundGeometry =
        new THREE.PlaneGeometry(
            200,
            200
        );

    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x263238,
            roughness: 0.9,
            metalness: 0
        });

    ground = new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

    ground.rotation.x = -Math.PI / 2;

    ground.receiveShadow = true;

    scene.add(ground);


    // ======================================
    // GRID
    // ======================================

    const grid = new THREE.GridHelper(
        200,
        100,
        0x555555,
        0x333333
    );

    grid.position.y = 0.02;

    scene.add(grid);


    // ======================================
    // PLAYER
    // ======================================

    createPlayer();


    // ======================================
    // TEST ENVIRONMENT
    // ======================================

    createEnvironment();


    // ======================================
    // CLOCK
    // ======================================

    clock = new THREE.Clock();


    // ======================================
    // RESIZE
    // ======================================

    window.addEventListener(
        "resize",
        resizeGame
    );


    // ======================================
    // START LOOP
    // ======================================

    animate();

}


// ==========================================
// CREATE PLAYER
// ==========================================

function createPlayer() {

    player = new THREE.Group();


    // BODY

    const bodyGeometry =
        new THREE.BoxGeometry(
            1.2,
            1.8,
            0.7
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3498db
        });

    const body = new THREE.Mesh(
        bodyGeometry,
        bodyMaterial
    );

    body.position.y = 1.3;

    body.castShadow = true;

    player.add(body);


    // HEAD

    const headGeometry =
        new THREE.SphereGeometry(
            0.5,
            24,
            24
        );

    const headMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xf1c27d
        });

    const head = new THREE.Mesh(
        headGeometry,
        headMaterial
    );

    head.position.y = 2.55;

    head.castShadow = true;

    player.add(head);


    // LEFT LEG

    const legGeometry =
        new THREE.BoxGeometry(
            0.35,
            1,
            0.35
        );

    const legMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x1f2937
        });


    const leftLeg =
        new THREE.Mesh(
            legGeometry,
            legMaterial
        );

    leftLeg.position.set(
        -0.3,
        0.5,
        0
    );

    leftLeg.castShadow = true;

    player.add(leftLeg);


    // RIGHT LEG

    const rightLeg =
        new THREE.Mesh(
            legGeometry,
            legMaterial
        );

    rightLeg.position.set(
        0.3,
        0.5,
        0
    );

    rightLeg.castShadow = true;

    player.add(rightLeg);


    // PLAYER POSITION

    player.position.set(
        0,
        0,
        0
    );

    scene.add(player);

}


// ==========================================
// ENVIRONMENT
// ==========================================

function createEnvironment() {

    // Trees / buildings / objects
    // Temporary environment for testing.
    // We will design the real map later.


    for (let i = 0; i < 20; i++) {

        const buildingGeometry =
            new THREE.BoxGeometry(
                3,
                3 + Math.random() * 5,
                3
            );

        const buildingMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x455a64
            });

        const building =
            new THREE.Mesh(
                buildingGeometry,
                buildingMaterial
            );


        const x =
            (Math.random() - 0.5) * 100;

        const z =
            (Math.random() - 0.5) * 100;


        // Keep buildings away from player

        if (
            Math.abs(x) < 10 &&
            Math.abs(z) < 10
        ) {
            continue;
        }


        building.position.set(
            x,
            buildingGeometry.parameters.height / 2,
            z
        );


        building.castShadow = true;
        building.receiveShadow = true;

        scene.add(building);

    }

}


// ==========================================
// PLAYER MOVEMENT
// ==========================================

function updatePlayer(delta) {

    if (!player) return;


    const speed = 7;


    let moveX = 0;
    let moveZ = 0;


    // FORWARD

    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        moveZ -= 1;

    }


    // BACKWARD

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        moveZ += 1;

    }


    // LEFT

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        moveX -= 1;

    }


    // RIGHT

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        moveX += 1;

    }


    // Normalize diagonal movement

    if (
        moveX !== 0 ||
        moveZ !== 0
    ) {

        const length =
            Math.sqrt(
                moveX * moveX +
                moveZ * moveZ
            );

        moveX /= length;
        moveZ /= length;


        player.position.x +=
            moveX * speed * delta;

        player.position.z +=
            moveZ * speed * delta;


        // Rotate player toward movement

        player.rotation.y =
            Math.atan2(
                moveX,
                moveZ
            );

    }

}


// ==========================================
// CAMERA
// ==========================================

function updateCamera() {

    if (!player || !camera) return;


    const cameraOffset =
        new THREE.Vector3(
            0,
            6,
            10
        );


    const desiredPosition =
        player.position.clone()
            .add(cameraOffset);


    camera.position.lerp(
        desiredPosition,
        0.08
    );


    const target =
        player.position.clone();

    target.y += 1.5;


    camera.lookAt(target);

}


// ==========================================
// GAME TIMER
// ==========================================

function updateTimer() {

    if (!gameStarted) return;


    const elapsed =
        Math.floor(
            (Date.now() - gameStartTime) / 1000
        );


    const minutes =
        Math.floor(elapsed / 60);

    const seconds =
        elapsed % 60;


    const formattedMinutes =
        String(minutes).padStart(2, "0");

    const formattedSeconds =
        String(seconds).padStart(2, "0");


    gameTimeElement.textContent =
        `${formattedMinutes}:${formattedSeconds}`;

}


// ==========================================
// ANIMATION
// ==========================================

function animate() {

    requestAnimationFrame(animate);


    if (!renderer || !scene || !camera) {
        return;
    }


    const delta =
        clock.getDelta();


    if (gameState === "playing") {

        updatePlayer(delta);

        updateCamera();

        updateTimer();

    }


    renderer.render(
        scene,
        camera
    );

}


// ==========================================
// RESIZE
// ==========================================

function resizeGame() {

    if (!camera || !renderer) return;


    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}
