import * as THREE from "three";

// ======================================================
// BHAVNANI GAMES - SAFE VERSION
// ======================================================

const introScreen = document.getElementById("introScreen");
const titleScreen = document.getElementById("titleScreen");
const mainMenu = document.getElementById("mainMenu");
const storyScreen = document.getElementById("storyScreen");
const gameWorld = document.getElementById("gameWorld");
const settingsScreen = document.getElementById("settingsScreen");

const startButton = document.getElementById("startButton");
const newGameButton = document.getElementById("newGameButton");
const continueButton = document.getElementById("continueButton");
const storyContinue = document.getElementById("storyContinue");
const settingsButton = document.getElementById("settingsButton");
const backButton = document.getElementById("backButton");

// ======================================================
// SCREEN SYSTEM
// ======================================================

function hideAllScreens() {

    const screens = [
        introScreen,
        titleScreen,
        mainMenu,
        storyScreen,
        gameWorld,
        settingsScreen
    ];

    screens.forEach(screen => {

        if (screen) {
            screen.classList.add("hidden");
        }

    });
}

function showScreen(screen) {

    hideAllScreens();

    if (screen) {
        screen.classList.remove("hidden");
    }

}

// ======================================================
// INTRO
// ======================================================

setTimeout(() => {

    if (titleScreen) {
        showScreen(titleScreen);
    } else if (mainMenu) {
        showScreen(mainMenu);
    }

}, 3500);

// ======================================================
// MENU BUTTONS
// ======================================================

if (startButton) {

    startButton.addEventListener("click", () => {

        showScreen(mainMenu);

    });

}

if (newGameButton) {

    newGameButton.addEventListener("click", () => {

        showScreen(storyScreen);

    });

}

if (continueButton) {

    continueButton.addEventListener("click", () => {

        showScreen(gameWorld);

        startGame();

    });

}

if (storyContinue) {

    storyContinue.addEventListener("click", () => {

        showScreen(gameWorld);

        startGame();

    });

}

if (settingsButton) {

    settingsButton.addEventListener("click", () => {

        showScreen(settingsScreen);

    });

}

if (backButton) {

    backButton.addEventListener("click", () => {

        showScreen(mainMenu);

    });

}

// ======================================================
// THREE.JS VARIABLES
// ======================================================

let scene;
let camera;
let renderer;
let player;

const keys = {};

window.addEventListener("keydown", event => {

    keys[event.key.toLowerCase()] = true;

});

window.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

});

// ======================================================
// START GAME
// ======================================================

function startGame() {

    // Prevent duplicate game
    if (renderer) return;

    if (!gameWorld) {

        alert("Game World element is missing from index.html.");

        return;

    }

    // Clear ONLY the game canvas area
    gameWorld.innerHTML = "";

    // Scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x87ceeb);

    scene.fog = new THREE.Fog(
        0x87ceeb,
        150,
        600
    );

    // Camera
    camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(
        0,
        8,
        15
    );

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.shadowMap.enabled = true;

    gameWorld.appendChild(renderer.domElement);

    // Lighting
    const ambientLight =
        new THREE.HemisphereLight(
            0xffffff,
            0x446644,
            2
        );

    scene.add(ambientLight);

    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    sun.position.set(
        -100,
        200,
        100
    );

    sun.castShadow = true;

    scene.add(sun);

    // World
    createWorld();

    // Player
    createPlayer();

    // Start animation
    animate();

}

// ======================================================
// WORLD
// ======================================================

function createWorld() {

    // Ground
    const groundGeometry =
        new THREE.PlaneGeometry(
            700,
            700
        );

    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x477a45
        });

    const ground =
        new THREE.Mesh(
            groundGeometry,
            groundMaterial
        );

    ground.rotation.x = -Math.PI / 2;

    ground.position.y = -0.5;

    ground.receiveShadow = true;

    scene.add(ground);

    // Ocean
    const oceanGeometry =
        new THREE.PlaneGeometry(
            500,
            300
        );

    const oceanMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x167fa5,
            roughness: 0.4
        });

    const ocean =
        new THREE.Mesh(
            oceanGeometry,
            oceanMaterial
        );

    ocean.rotation.x = -Math.PI / 2;

    ocean.position.set(
        280,
        -0.4,
        0
    );

    scene.add(ocean);

    // Beach
    const beachGeometry =
        new THREE.PlaneGeometry(
            100,
            500
        );

    const beachMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xd9c28b
        });

    const beach =
        new THREE.Mesh(
            beachGeometry,
            beachMaterial
        );

    beach.rotation.x = -Math.PI / 2;

    beach.position.set(
        180,
        -0.3,
        0
    );

    scene.add(beach);

    // Main road
    createRoad(
        0,
        0,
        500,
        14
    );

    // Downtown buildings
    createBuildings();

    // Palm trees
    createPalmTrees();

}

// ======================================================
// ROAD
// ======================================================

function createRoad(
    x,
    z,
    length,
    width
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            0.25,
            length
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x292929
        });

    const road =
        new THREE.Mesh(
            geometry,
            material
        );

    road.position.set(
        x,
        -0.25,
        z
    );

    scene.add(road);

}

// ======================================================
// BUILDINGS
// ======================================================

function createBuildings() {

    const positions = [

        [-45, -80, 20, 50, 20],
        [45, -120, 25, 70, 25],
        [-55, 20, 22, 45, 20],
        [50, 80, 30, 85, 25],
        [-40, 140, 25, 60, 25],
        [55, 180, 22, 50, 20]

    ];

    positions.forEach(data => {

        const [
            x,
            z,
            width,
            height,
            depth
        ] = data;

        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                depth
            );

        const material =
            new THREE.MeshStandardMaterial({
                color:
                    Math.random() > 0.5
                        ? 0xb9b9b9
                        : 0x789bb2
            });

        const building =
            new THREE.Mesh(
                geometry,
                material
            );

        building.position.set(
            x,
            height / 2,
            z
        );

        building.castShadow = true;

        building.receiveShadow = true;

        scene.add(building);

    });

}

// ======================================================
// PALMS
// ======================================================

function createPalmTrees() {

    for (
        let z = -220;
        z <= 220;
        z += 35
    ) {

        createPalm(
            145,
            z
        );

    }

}

function createPalm(
    x,
    z
) {

    const group =
        new THREE.Group();

    // Trunk
    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.4,
                0.6,
                7,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x704523
            })
        );

    trunk.position.y = 3.5;

    group.add(trunk);

    // Leaves
    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const leaf =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.3,
                    0.2,
                    4
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x28733b
                })
            );

        leaf.position.y = 7;

        leaf.rotation.y =
            (Math.PI * 2 / 6) * i;

        leaf.rotation.x = -0.35;

        group.add(leaf);

    }

    group.position.set(
        x,
        0,
        z
    );

    scene.add(group);

}

// ======================================================
// PLAYER
// ======================================================

function createPlayer() {

    player =
        new THREE.Group();

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                2,
                1
            ),
            new THREE.MeshStandardMaterial({
                color: 0x315b8e
            })
        );

    body.position.y = 2;

    player.add(body);

    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.65,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0xf0c5a0
            })
        );

    head.position.y = 3.5;

    player.add(head);

    player.position.set(
        0,
        0,
        0
    );

    scene.add(player);

}

// ======================================================
// PLAYER MOVEMENT
// ======================================================

function updatePlayer() {

    if (!player) return;

    const speed = 0.18;

    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        player.position.z -= speed;

    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        player.position.z += speed;

    }

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        player.position.x -= speed;

    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        player.position.x += speed;

    }

}

// ======================================================
// CAMERA
// ======================================================

function updateCamera() {

    if (!player) return;

    const targetX =
        player.position.x;

    const targetY =
        player.position.y + 8;

    const targetZ =
        player.position.z + 12;

    camera.position.lerp(
        new THREE.Vector3(
            targetX,
            targetY,
            targetZ
        ),
        0.08
    );

    camera.lookAt(
        player.position.x,
        player.position.y + 2,
        player.position.z
    );

}

// ======================================================
// ANIMATION
// ======================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    updatePlayer();

    updateCamera();

    renderer.render(
        scene,
        camera
    );

}

// ======================================================
// RESIZE
// ======================================================

window.addEventListener(
    "resize",
    () => {

        if (!camera || !renderer)
            return;

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);
