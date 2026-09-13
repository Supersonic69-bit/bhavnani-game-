import * as THREE from "three";

// =====================================================
// BHAVNANI CITY - OPEN WORLD PROTOTYPE
// Organic tropical luxury city
// =====================================================

// -------------------- GAME STATE --------------------

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

let gameStarted = false;
let audioOn = true;
let graphicsHigh = true;

function showScreen(screen) {
    [
        introScreen,
        titleScreen,
        mainMenu,
        storyScreen,
        gameWorld,
        settingsScreen
    ].forEach(s => {
        if (s) s.classList.add("hidden");
    });

    if (screen) screen.classList.remove("hidden");
}

setTimeout(() => {
    showScreen(titleScreen);
}, 3500);

startButton?.addEventListener("click", () => {
    showScreen(mainMenu);
});

newGameButton?.addEventListener("click", () => {
    showScreen(storyScreen);
});

continueButton?.addEventListener("click", () => {
    showScreen(gameWorld);
    startGame();
});

storyContinue?.addEventListener("click", () => {
    showScreen(gameWorld);
    startGame();
});

settingsButton?.addEventListener("click", () => {
    showScreen(settingsScreen);
});

backButton?.addEventListener("click", () => {
    showScreen(mainMenu);
});

// =====================================================
// THREE.JS
// =====================================================

let scene;
let camera;
let renderer;
let player;

const clock = new THREE.Clock();

const keys = {};

let playerSpeed = 0.16;

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

// =====================================================
// MATERIALS
// =====================================================

const materials = {

    grass: new THREE.MeshStandardMaterial({
        color: 0x3d713f,
        roughness: 1
    }),

    sand: new THREE.MeshStandardMaterial({
        color: 0xd9c28c,
        roughness: 1
    }),

    road: new THREE.MeshStandardMaterial({
        color: 0x24262a,
        roughness: 0.95
    }),

    sidewalk: new THREE.MeshStandardMaterial({
        color: 0x888887,
        roughness: 1
    }),

    white: new THREE.MeshStandardMaterial({
        color: 0xf2f2f2
    }),

    ocean: new THREE.MeshStandardMaterial({
        color: 0x167ca0,
        roughness: 0.35,
        metalness: 0.05
    }),

    glass: new THREE.MeshStandardMaterial({
        color: 0x76b9d2,
        metalness: 0.35,
        roughness: 0.2
    }),

    concrete: new THREE.MeshStandardMaterial({
        color: 0xaaa59b,
        roughness: 0.9
    }),

    dark: new THREE.MeshStandardMaterial({
        color: 0x151515,
        roughness: 0.7
    }),

    palm: new THREE.MeshStandardMaterial({
        color: 0x704522
    }),

    leaves: new THREE.MeshStandardMaterial({
        color: 0x26703b
    }),

    red: new THREE.MeshStandardMaterial({
        color: 0x9d302c
    }),

    blue: new THREE.MeshStandardMaterial({
        color: 0x315b8e
    })
};

// =====================================================
// CITY ROOT
// =====================================================

const city = new THREE.Group();

function add(object) {
    city.add(object);
    return object;
}

// =====================================================
// GROUND
// =====================================================

function createGround() {

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(900, 900),
        materials.grass
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.25;

    add(ground);
}

// =====================================================
// OCEAN
// =====================================================

function createOcean() {

    const ocean = new THREE.Mesh(
        new THREE.PlaneGeometry(900, 320),
        materials.ocean
    );

    ocean.rotation.x = -Math.PI / 2;

    // Ocean on eastern side
    ocean.position.set(260, -0.18, 0);

    add(ocean);
}

// =====================================================
// BEACH
// =====================================================

function createBeach() {

    const beach = new THREE.Mesh(
        new THREE.PlaneGeometry(170, 500),
        materials.sand
    );

    beach.rotation.x = -Math.PI / 2;
    beach.position.set(105, -0.08, 0);

    add(beach);

    // Curved beach strip
    for (let z = -230; z <= 230; z += 35) {

        const palm = createPalm();

        palm.position.set(
            75 + Math.sin(z * 0.025) * 5,
            0,
            z
        );

        palm.scale.setScalar(0.8 + Math.random() * 0.35);

        add(palm);
    }
}

// =====================================================
// ROAD CURVE
// =====================================================

function createRoad(points, width = 10) {

    const curve = new THREE.CatmullRomCurve3(
        points.map(p => new THREE.Vector3(p.x, 0, p.z))
    );

    const roadGeometry = new THREE.TubeGeometry(
        curve,
        120,
        width / 2,
        8,
        false
    );

    const road = new THREE.Mesh(
        roadGeometry,
        materials.road
    );

    road.scale.y = 0.08;

    add(road);

    return curve;
}

// =====================================================
// MAIN CITY ROADS
// =====================================================

function createRoadNetwork() {

    // Main coastal boulevard
    createRoad([
        { x: -280, z: 180 },
        { x: -190, z: 130 },
        { x: -100, z: 110 },
        { x: 0, z: 120 },
        { x: 90, z: 105 },
        { x: 170, z: 70 }
    ], 14);

    // Main downtown road
    createRoad([
        { x: -240, z: 20 },
        { x: -170, z: 35 },
        { x: -80, z: 10 },
        { x: 10, z: -15 },
        { x: 90, z: -5 },
        { x: 180, z: 25 }
    ], 13);

    // Residential winding road
    createRoad([
        { x: -210, z: -170 },
        { x: -140, z: -120 },
        { x: -80, z: -145 },
        { x: -20, z: -105 },
        { x: 50, z: -130 },
        { x: 110, z: -100 }
    ], 10);

    // Hill road
    createRoad([
        { x: -180, z: -230 },
        { x: -120, z: -205 },
        { x: -50, z: -220 },
        { x: 10, z: -190 },
        { x: 70, z: -210 }
    ], 8);

    // Port road
    createRoad([
        { x: -260, z: 210 },
        { x: -180, z: 235 },
        { x: -80, z: 245 },
        { x: 20, z: 235 },
        { x: 100, z: 250 }
    ], 12);

    // Highway around the city
    createRoad([
        { x: -360, z: -280 },
        { x: -270, z: -315 },
        { x: -100, z: -330 },
        { x: 80, z: -315 },
        { x: 250, z: -270 }
    ], 18);
}

// =====================================================
// BUILDINGS
// =====================================================

function createBuilding(x, z, w, h, d, type = "normal") {

    let material = materials.concrete;

    if (type === "glass") {
        material = materials.glass;
    }

    if (type === "dark") {
        material = materials.dark;
    }

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
    );

    building.position.set(x, h / 2, z);

    // Slight organic rotation
    building.rotation.y = (Math.random() - 0.5) * 0.15;

    add(building);

    // Rooftop
    if (h > 18) {

        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(
                w * 0.75,
                1,
                d * 0.75
            ),
            materials.dark
        );

        roof.position.set(
            x,
            h + 0.5,
            z
        );

        roof.rotation.y = building.rotation.y;

        add(roof);
    }

    return building;
}

// =====================================================
// DOWNTOWN
// =====================================================

function createDowntown() {

    const towers = [
        [-115, 35, 24, 70, 22],
        [-75, 0, 32, 105, 25],
        [-25, 45, 25, 85, 22],
        [30, 10, 35, 125, 30],
        [80, 45, 28, 90, 25],
        [125, 0, 24, 65, 22],
        [-35, -55, 30, 75, 28],
        [55, -60, 25, 95, 25]
    ];

    towers.forEach((b, i) => {

        createBuilding(
            b[0],
            b[1],
            b[2],
            b[3],
            b[4],
            i % 2 === 0 ? "glass" : "dark"
        );
    });
}

// =====================================================
// RESIDENTIAL VILLAS
// =====================================================

function createVilla(x, z) {

    const width = 14 + Math.random() * 8;
    const depth = 12 + Math.random() * 7;
    const height = 5 + Math.random() * 3;

    createBuilding(
        x,
        z,
        width,
        height,
        depth,
        "normal"
    );

    // Pool
    const pool = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.3, 4),
        materials.ocean
    );

    pool.position.set(
        x + 9,
        0.2,
        z
    );

    add(pool);

    // Garden palms
    for (let i = 0; i < 3; i++) {

        const palm = createPalm();

        palm.position.set(
            x - 9 + i * 4,
            0,
            z + 8
        );

        palm.scale.setScalar(0.7);

        add(palm);
    }
}

function createResidentialArea() {

    const villas = [
        [-170, -100],
        [-125, -150],
        [-70, -105],
        [-15, -150],
        [45, -105],
        [90, -145],
        [-180, -205],
        [-115, -215],
        [-45, -205],
        [30, -230],
        [100, -195]
    ];

    villas.forEach(v => {
        createVilla(v[0], v[1]);
    });
}

// =====================================================
// NIGHTLIFE
// =====================================================

function createNightlife() {

    const clubs = [
        [-145, 85],
        [-90, 105],
        [-25, 90],
        [35, 105],
        [95, 85]
    ];

    clubs.forEach((p, i) => {

        createBuilding(
            p[0],
            p[1],
            25 + Math.random() * 10,
            8 + Math.random() * 5,
            20 + Math.random() * 8,
            i % 2 === 0 ? "dark" : "glass"
        );

        // Neon-style sign
        const sign = new THREE.Mesh(
            new THREE.BoxGeometry(10, 2, 0.5),
            i % 2 === 0 ? materials.red : materials.blue
        );

        sign.position.set(
            p[0],
            8,
            p[1] - 11
        );

        add(sign);
    });
}

// =====================================================
// PORT
// =====================================================

function createPort() {

    const dock = new THREE.Mesh(
        new THREE.BoxGeometry(260, 1, 35),
        materials.dark
    );

    dock.position.set(-70, 0, 250);

    add(dock);

    // Containers
    for (let i = 0; i < 18; i++) {

        const container = new THREE.Mesh(
            new THREE.BoxGeometry(10, 5, 6),
            i % 2 === 0 ? materials.red : materials.blue
        );

        container.position.set(
            -180 + (i % 9) * 22,
            2.5,
            240 + Math.floor(i / 9) * 12
        );

        add(container);
    }

    // Warehouses
    createBuilding(-190, 280, 35, 10, 25, "dark");
    createBuilding(-110, 285, 45, 12, 28, "dark");
    createBuilding(-20, 280, 40, 11, 30, "dark");
}

// =====================================================
// INDUSTRIAL AREA
// =====================================================

function createIndustrialArea() {

    const factories = [
        [180, 240],
        [230, 200],
        [285, 250],
        [205, 300]
    ];

    factories.forEach(p => {

        createBuilding(
            p[0],
            p[1],
            35 + Math.random() * 20,
            12 + Math.random() * 8,
            30 + Math.random() * 15,
            "dark"
        );
    });
}

// =====================================================
// PALM TREE
// =====================================================

function createPalm() {

    const group = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.45,
            0.7,
            7,
            8
        ),
        materials.palm
    );

    trunk.position.y = 3.5;

    group.add(trunk);

    for (let i = 0; i < 7; i++) {

        const leaf = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                0.2,
                4.5
            ),
            materials.leaves
        );

        leaf.position.y = 7;

        leaf.rotation.y =
            (Math.PI * 2 / 7) * i;

        leaf.rotation.x = -0.35;

        group.add(leaf);
    }

    return group;
}

// =====================================================
// NATURAL TREES
// =====================================================

function createTree(x, z, scale = 1) {

    const tree = createPalm();

    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);

    add(tree);
}

function createNature() {

    const locations = [
        [-280, -80],
        [-250, -30],
        [-300, 30],
        [-230, -60],
        [-200, 80],
        [-260, 110],

        [-170, -250],
        [-100, -270],
        [-20, -260],
        [60, -280],
        [140, -250],

        [140, 120],
        [180, 140],
        [210, 100],
        [250, 130],

        [10, 160],
        [55, 175],
        [105, 155]
    ];

    locations.forEach((p, i) => {
        createTree(
            p[0],
            p[1],
            0.8 + (i % 3) * 0.25
        );
    });
}

// =====================================================
// CARS
// =====================================================

function createCar(x, z, rotation = 0) {

    const car = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 1.1, 2),
        Math.random() > 0.5
            ? materials.red
            : materials.blue
    );

    body.position.y = 1;

    car.add(body);

    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.9, 1.7),
        materials.dark
    );

    roof.position.set(
        0,
        1.8,
        0
    );

    car.add(roof);

    car.position.set(x, 0, z);
    car.rotation.y = rotation;

    add(car);
}

function createTraffic() {

    createCar(-150, 30, 0.2);
    createCar(-50, 5, 0.1);
    createCar(65, -8, 0.15);

    createCar(120, 105, Math.PI / 2);
    createCar(180, 70, Math.PI / 2);

    createCar(-100, -145, 0.4);
    createCar(30, -120, -0.3);
}

// =====================================================
// PLAYER
// =====================================================

function createPlayer() {

    player = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2.2, 1),
        materials.blue
    );

    body.position.y = 2.1;

    player.add(body);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 16, 16),
        materials.white
    );

    head.position.y = 3.7;

    player.add(head);

    const leg1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 1.4, 0.5),
        materials.dark
    );

    leg1.position.set(-0.4, 0.7, 0);

    player.add(leg1);

    const leg2 = leg1.clone();

    leg2.position.x = 0.4;

    player.add(leg2);

    // Start near residential district
    player.position.set(
        -40,
        0,
        -90
    );

    add(player);
}

// =====================================================
// LIGHTING
// =====================================================

function createLights() {

    const hemi = new THREE.HemisphereLight(
        0xbfe8ff,
        0x355333,
        2
    );

    scene.add(hemi);

    const sun = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    sun.position.set(
        -150,
        250,
        -100
    );

    sun.castShadow = true;

    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;

    scene.add(sun);
}

// =====================================================
// WORLD CREATION
// =====================================================

function buildCity() {

    createGround();
    createOcean();
    createBeach();

    createRoadNetwork();

    createDowntown();
    createResidentialArea();
    createNightlife();

    createPort();
    createIndustrialArea();

    createNature();
    createTraffic();
    createPlayer();
}

// =====================================================
// GAME START
// =====================================================

function startGame() {

    if (gameStarted) return;

    gameStarted = true;

    scene = new THREE.Scene();

    scene.background = new THREE.Color(
        0x8bc9e8
    );

    scene.fog = new THREE.Fog(
        0x8bc9e8,
        180,
        650
    );

    city.clear();

    scene.add(city);

    camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(
        -45,
        12,
        -105
    );

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

    gameWorld.innerHTML = "";
    gameWorld.appendChild(renderer.domElement);

    createLights();
    buildCity();

    animate();
}

// =====================================================
// PLAYER MOVEMENT
// =====================================================

function updatePlayer() {

    if (!player) return;

    const direction = new THREE.Vector3();

    if (keys["w"] || keys["arrowup"]) {
        direction.z -= 1;
    }

    if (keys["s"] || keys["arrowdown"]) {
        direction.z += 1;
    }

    if (keys["a"] || keys["arrowleft"]) {
        direction.x -= 1;
    }

    if (keys["d"] || keys["arrowright"]) {
        direction.x += 1;
    }

    if (direction.length() > 0) {

        direction.normalize();

        player.position.x +=
            direction.x * playerSpeed;

        player.position.z +=
            direction.z * playerSpeed;

        player.rotation.y =
            Math.atan2(
                direction.x,
                direction.z
            );
    }

    // City boundary
    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -390,
            390
        );

    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -390,
            300
        );
}

// =====================================================
// CAMERA
// =====================================================

function updateCamera() {

    if (!player || !camera) return;

    const desired = new THREE.Vector3(
        player.position.x,
        player.position.y + 10,
        player.position.z + 14
    );

    camera.position.lerp(
        desired,
        0.08
    );

    const target = new THREE.Vector3(
        player.position.x,
        player.position.y + 2,
        player.position.z
    );

    camera.lookAt(target);
}

// =====================================================
// ANIMATION
// =====================================================

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    updatePlayer();
    updateCamera();

    if (renderer && scene && camera) {
        renderer.render(
            scene,
            camera
        );
    }
}

// =====================================================
// RESIZE
// =====================================================

window.addEventListener("resize", () => {

    if (!camera || !renderer) return;

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});
