import * as THREE from "three";

// =====================================================
// BHAVNANI GAMES
// BHAVNANI CITY - FIRST 3D CITY BLOCK
// =====================================================


// =====================================================
// UI ELEMENTS
// =====================================================

const introScreen = document.getElementById("intro-screen");
const titleScreen = document.getElementById("title-screen");
const mainMenu = document.getElementById("main-menu");
const storyScreen = document.getElementById("story-screen");
const gameWorld = document.getElementById("game-world");
const settingsScreen = document.getElementById("settings-screen");

const startButton = document.getElementById("start-button");
const newGameButton = document.getElementById("new-game-button");
const continueButton = document.getElementById("continue-button");
const settingsButton = document.getElementById("settings-button");
const storyContinueButton =
    document.getElementById("story-continue-button");
const backButton = document.getElementById("back-button");

const audioSettings = document.getElementById("audio-settings");
const graphicsSettings =
    document.getElementById("graphics-settings");
const controlsSettings =
    document.getElementById("controls-settings");

const healthElement = document.getElementById("health");
const objectiveElement =
    document.getElementById("objective");
const gameTimeElement =
    document.getElementById("game-time");


// =====================================================
// GAME STATE
// =====================================================

let gameState = "intro";

let scene;
let camera;
let renderer;
let player;
let clock;

let gameStarted = false;
let gameStartTime = 0;

const keys = {};


// =====================================================
// SCREEN SYSTEM
// =====================================================

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


// =====================================================
// INTRO
// =====================================================

setTimeout(() => {

    if (gameState === "intro") {

        gameState = "title";
        showScreen(titleScreen);

    }

}, 3500);


// =====================================================
// TITLE
// =====================================================

startButton.addEventListener("click", () => {

    gameState = "menu";
    showScreen(mainMenu);

});


// =====================================================
// MAIN MENU
// =====================================================

newGameButton.addEventListener("click", () => {

    gameState = "story";

    document.getElementById("story-title").textContent =
        "THE BEGINNING";

    document.getElementById("story-text").textContent =
        "Welcome to Bhavnani City. " +
        "A new life begins on the coast.";

    showScreen(storyScreen);

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

    gameState = "menu";
    showScreen(mainMenu);

});


// =====================================================
// SETTINGS
// =====================================================

let audioEnabled = true;

audioSettings.addEventListener("click", () => {

    audioEnabled = !audioEnabled;

    audioSettings.textContent =
        audioEnabled
            ? "AUDIO: ON"
            : "AUDIO: OFF";

});


let highGraphics = true;

graphicsSettings.addEventListener("click", () => {

    highGraphics = !highGraphics;

    graphicsSettings.textContent =
        highGraphics
            ? "GRAPHICS: HIGH"
            : "GRAPHICS: LOW";

});


controlsSettings.addEventListener("click", () => {

    alert(
        "BHAVNANI CITY CONTROLS\n\n" +
        "W / ↑  Move Forward\n" +
        "S / ↓  Move Backward\n" +
        "A / ←  Move Left\n" +
        "D / →  Move Right"
    );

});


// =====================================================
// KEYBOARD INPUT
// =====================================================

window.addEventListener("keydown", (event) => {

    keys[event.key.toLowerCase()] = true;

});


window.addEventListener("keyup", (event) => {

    keys[event.key.toLowerCase()] = false;

});


// =====================================================
// START GAME
// =====================================================

function startGame() {

    gameState = "playing";

    showScreen(gameWorld);

    if (!gameStarted) {

        initializeCity();

        gameStarted = true;

    }

    gameStartTime = Date.now();

}


// =====================================================
// INITIALIZE CITY
// =====================================================

function initializeCity() {

    const canvas =
        document.getElementById("gameCanvas");


    // =================================================
    // SCENE
    // =================================================

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x87ceeb);

    scene.fog =
        new THREE.Fog(
            0x87ceeb,
            80,
            220
        );


    // =================================================
    // CAMERA
    // =================================================

    camera =
        new THREE.PerspectiveCamera(
            60,
            window.innerWidth /
                window.innerHeight,
            0.1,
            500
        );

    camera.position.set(
        0,
        6,
        10
    );


    // =================================================
    // RENDERER
    // =================================================

    renderer =
        new THREE.WebGLRenderer({

            canvas: canvas,

            antialias: true

        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;


    // =================================================
    // LIGHTING
    // =================================================

    createLighting();


    // =================================================
    // GROUND
    // =================================================

    createGround();


    // =================================================
    // ROAD SYSTEM
    // =================================================

    createRoad();


    // =================================================
    // SIDEWALKS
    // =================================================

    createSidewalks();


    // =================================================
    // BUILDINGS
    // =================================================

    createBuildings();


    // =================================================
    // STREET LIGHTS
    // =================================================

    createStreetLights();


    // =================================================
    // PALM TREES
    // =================================================

    createPalmTrees();


    // =================================================
    // PARKED CARS
    // =================================================

    createCars();


    // =================================================
    // PLAYER
    // =================================================

    createPlayer();


    // =================================================
    // CLOCK
    // =================================================

    clock = new THREE.Clock();


    // =================================================
    // RESIZE
    // =================================================

    window.addEventListener(
        "resize",
        resizeGame
    );


    // =================================================
    // START RENDER LOOP
    // =================================================

    animate();

}


// =====================================================
// LIGHTING
// =====================================================

function createLighting() {

    const skyLight =
        new THREE.HemisphereLight(
            0xffffff,
            0x667788,
            2.2
        );

    scene.add(skyLight);


    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    sun.position.set(
        -40,
        60,
        30
    );

    sun.castShadow = true;

    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;

    sun.shadow.camera.left = -80;
    sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80;
    sun.shadow.camera.bottom = -80;

    scene.add(sun);

}


// =====================================================
// GROUND
// =====================================================

function createGround() {

    const geometry =
        new THREE.PlaneGeometry(
            250,
            250
        );

    const material =
        new THREE.MeshStandardMaterial({

            color: 0x477447,

            roughness: 1

        });

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.rotation.x =
        -Math.PI / 2;

    mesh.receiveShadow = true;

    scene.add(mesh);

}


// =====================================================
// ROAD
// =====================================================

function createRoad() {

    // Main road

    const roadGeometry =
        new THREE.BoxGeometry(
            32,
            0.08,
            150
        );

    const roadMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x252525,

            roughness: 0.95

        });

    const road =
        new THREE.Mesh(
            roadGeometry,
            roadMaterial
        );

    road.position.y = 0.04;

    road.receiveShadow = true;

    scene.add(road);


    // Road center markings

    for (
        let z = -70;
        z <= 70;
        z += 8
    ) {

        const lineGeometry =
            new THREE.BoxGeometry(
                0.35,
                0.1,
                4
            );

        const lineMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xf5f5f5
            });

        const line =
            new THREE.Mesh(
                lineGeometry,
                lineMaterial
            );

        line.position.set(
            0,
            0.1,
            z
        );

        scene.add(line);

    }

}


// =====================================================
// SIDEWALKS
// =====================================================

function createSidewalks() {

    const sidewalkMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xb7b7b7,

            roughness: 0.9

        });


    const leftGeometry =
        new THREE.BoxGeometry(
            7,
            0.3,
            150
        );

    const left =
        new THREE.Mesh(
            leftGeometry,
            sidewalkMaterial
        );

    left.position.set(
        -19.5,
        0.15,
        0
    );

    left.receiveShadow = true;

    scene.add(left);


    const right =
        new THREE.Mesh(
            leftGeometry,
            sidewalkMaterial
        );

    right.position.set(
        19.5,
        0.15,
        0
    );

    right.receiveShadow = true;

    scene.add(right);

}


// =====================================================
// BUILDINGS
// =====================================================

function createBuildings() {

    // LEFT SIDE

    createBuilding(
        -25,
        -48,
        10,
        12,
        9,
        0xc9b29b
    );

    createBuilding(
        -25,
        -20,
        10,
        18,
        9,
        0xe0c097
    );

    createBuilding(
        -25,
        15,
        10,
        10,
        9,
        0xd6d6d6
    );

    createBuilding(
        -25,
        48,
        10,
        20,
        9,
        0xb89f87
    );


    // RIGHT SIDE

    createBuilding(
        25,
        -48,
        10,
        16,
        9,
        0xd4c2a8
    );

    createBuilding(
        25,
        -15,
        10,
        9,
        9,
        0xc7d0d8
    );

    createBuilding(
        25,
        18,
        10,
        22,
        9,
        0xe4d2b8
    );

    createBuilding(
        25,
        52,
        10,
        13,
        9,
        0xc1b5a6
    );

}


function createBuilding(
    x,
    z,
    width,
    height,
    depth,
    color
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({

            color: color,

            roughness: 0.8

        });

    const building =
        new THREE.Mesh(
            geometry,
            material
        );

    building.position.set(
        x,
        height / 2 + 0.3,
        z
    );

    building.castShadow = true;
    building.receiveShadow = true;

    scene.add(building);


    // Windows

    const windowMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x7fc8e8,

            metalness: 0.2,

            roughness: 0.25

        });


    const rows =
        Math.max(
            2,
            Math.floor(height / 3)
        );


    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = -1;
            col <= 1;
            col++
        ) {

            const windowGeometry =
                new THREE.BoxGeometry(
                    1.2,
                    1.1,
                    0.12
                );

            const window =
                new THREE.Mesh(
                    windowGeometry,
                    windowMaterial
                );

            window.position.set(
                x + col * 2.5,
                1.8 + row * 2.7,
                z - depth / 2 - 0.08
            );

            scene.add(window);

        }

    }

}


// =====================================================
// STREET LIGHTS
// =====================================================

function createStreetLights() {

    for (
        let z = -65;
        z <= 65;
        z += 20
    ) {

        createStreetLight(
            -14,
            z
        );

        createStreetLight(
            14,
            z + 10
        );

    }

}


function createStreetLight(x, z) {

    const poleGeometry =
        new THREE.CylinderGeometry(
            0.12,
            0.12,
            5,
            12
        );

    const poleMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x303030,

            metalness: 0.7,

            roughness: 0.4

        });

    const pole =
        new THREE.Mesh(
            poleGeometry,
            poleMaterial
        );

    pole.position.set(
        x,
        2.5,
        z
    );

    pole.castShadow = true;

    scene.add(pole);


    const lampGeometry =
        new THREE.SphereGeometry(
            0.35,
            16,
            16
        );

    const lampMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xffffcc,

            emissive: 0xffdd88,

            emissiveIntensity: 1.5

        });

    const lamp =
        new THREE.Mesh(
            lampGeometry,
            lampMaterial
        );

    lamp.position.set(
        x,
        5.1,
        z
    );

    scene.add(lamp);

}


// =====================================================
// PALM TREES
// =====================================================

function createPalmTrees() {

    const positions = [

        [-17, -58],
        [17, -42],
        [-17, -10],
        [17, 8],
        [-17, 32],
        [17, 62]

    ];


    positions.forEach(
        ([x, z]) => {

            createPalmTree(
                x,
                z
            );

        }
    );

}


function createPalmTree(x, z) {

    // Trunk

    const trunkGeometry =
        new THREE.CylinderGeometry(
            0.35,
            0.55,
            5,
            10
        );

    const trunkMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x8b5a2b

        });

    const trunk =
        new THREE.Mesh(
            trunkGeometry,
            trunkMaterial
        );

    trunk.position.set(
        x,
        2.5,
        z
    );

    trunk.castShadow = true;

    scene.add(trunk);


    // Leaves

    const leafMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x1d7a3a

        });


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const leafGeometry =
            new THREE.BoxGeometry(
                0.35,
                0.15,
                3.5
            );

        const leaf =
            new THREE.Mesh(
                leafGeometry,
                leafMaterial
            );

        leaf.position.set(
            x,
            5.2,
            z
        );

        leaf.rotation.y =
            (Math.PI * 2 / 7) * i;

        leaf.rotation.x =
            -0.3;

        scene.add(leaf);

    }

}


// =====================================================
// PARKED CARS
// =====================================================

function createCars() {

    createCar(
        -8,
        -30,
        0xff3333
    );

    createCar(
        8,
        5,
        0xffffff
    );

    createCar(
        -8,
        38,
        0x222222
    );

}


function createCar(
    x,
    z,
    color
) {

    const car =
        new THREE.Group();


    const bodyGeometry =
        new THREE.BoxGeometry(
            3.5,
            0.8,
            1.8
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color: color,

            roughness: 0.5

        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y = 0.7;

    body.castShadow = true;

    car.add(body);


    const roofGeometry =
        new THREE.BoxGeometry(
            1.9,
            0.7,
            1.5
        );

    const roofMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x202020,

            roughness: 0.4

        });

    const roof =
        new THREE.Mesh(
            roofGeometry,
            roofMaterial
        );

    roof.position.set(
        0,
        1.35,
        0
    );

    roof.castShadow = true;

    car.add(roof);


    // Wheels

    const wheelGeometry =
        new THREE.CylinderGeometry(
            0.4,
            0.4,
            0.35,
            16
        );

    const wheelMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x111111

        });


    const wheelPositions = [

        [-1.25, 0.4, -0.95],
        [1.25, 0.4, -0.95],
        [-1.25, 0.4, 0.95],
        [1.25, 0.4, 0.95]

    ];


    wheelPositions.forEach(
        ([wx, wy, wz]) => {

            const wheel =
                new THREE.Mesh(
                    wheelGeometry,
                    wheelMaterial
                );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                wx,
                wy,
                wz
            );

            wheel.castShadow = true;

            car.add(wheel);

        }
    );


    car.position.set(
        x,
        0,
        z
    );

    car.rotation.y =
        Math.PI / 2;

    scene.add(car);

}


// =====================================================
// PLAYER
// =====================================================

function createPlayer() {

    player =
        new THREE.Group();


    // BODY

    const bodyGeometry =
        new THREE.BoxGeometry(
            1.2,
            1.7,
            0.7
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x2468d7

        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y = 1.3;

    body.castShadow = true;

    player.add(body);


    // HEAD

    const headGeometry =
        new THREE.SphereGeometry(
            0.48,
            24,
            24
        );

    const headMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xd89b6a

        });

    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );

    head.position.y = 2.45;

    head.castShadow = true;

    player.add(head);


    // LEGS

    const legGeometry =
        new THREE.BoxGeometry(
            0.38,
            1,
            0.38
        );

    const legMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x202530

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


    // START POSITION

    player.position.set(
        0,
        0,
        45
    );


    scene.add(player);

}


// =====================================================
// PLAYER MOVEMENT
// =====================================================

function updatePlayer(delta) {

    if (!player) {
        return;
    }


    const speed = 8;


    let x = 0;
    let z = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        z -= 1;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        z += 1;

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        x -= 1;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        x += 1;

    }


    if (
        x !== 0 ||
        z !== 0
    ) {

        const length =
            Math.sqrt(
                x * x +
                z * z
            );

        x /= length;
        z /= length;


        player.position.x +=
            x * speed * delta;

        player.position.z +=
            z * speed * delta;


        // Face movement direction

        player.rotation.y =
            Math.atan2(
                x,
                z
            );

    }


    // Keep player within test city

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -13,
            13
        );


    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -70,
            70
        );

}


// =====================================================
// THIRD PERSON CAMERA
// =====================================================

function updateCamera() {

    if (!player) {
        return;
    }


    const desiredPosition =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 6,
            player.position.z + 10
        );


    camera.position.lerp(
        desiredPosition,
        0.08
    );


    const target =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 1.5,
            player.position.z
        );


    camera.lookAt(target);

}


// =====================================================
// TIMER
// =====================================================

function updateTimer() {

    if (!gameStarted) {
        return;
    }


    const elapsed =
        Math.floor(
            (Date.now() - gameStartTime) /
            1000
        );


    const minutes =
        Math.floor(
            elapsed / 60
        );


    const seconds =
        elapsed % 60;


    gameTimeElement.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

}


// =====================================================
// ANIMATION
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    if (
        !renderer ||
        !scene ||
        !camera
    ) {

        return;

    }


    const delta =
        clock.getDelta();


    if (
        gameState === "playing"
    ) {

        updatePlayer(delta);

        updateCamera();

        updateTimer();

    }


    renderer.render(
        scene,
        camera
    );

}


// =====================================================
// RESIZE
// =====================================================

function resizeGame() {

    if (
        !camera ||
        !renderer
    ) {

        return;

    }


    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}
