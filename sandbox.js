import * as THREE from "./vendor-three.mjs";

const canvas = document.getElementById("gameCanvas");
const minimapCanvas = document.getElementById("minimapCanvas");
const minimapCtx = minimapCanvas?.getContext("2d");
const lifeValue = document.getElementById("lifeValue");
const shieldValue = document.getElementById("shieldValue");
const starValue = document.getElementById("starValue");
const weaponValue = document.getElementById("weaponValue");
const cameraValue = document.getElementById("cameraValue");
const bossValue = document.getElementById("bossValue");
const bossHud = document.getElementById("bossHud");
const bossName = document.getElementById("bossName");
const bossHpText = document.getElementById("bossHpText");
const bossHpBar = document.getElementById("bossHpBar");
const inventoryGrid = document.getElementById("inventoryGrid");
const toolbelt = document.getElementById("toolbelt");
const shopPanel = document.getElementById("shopPanel");
const shopButton = document.getElementById("shopButton");
const modeButton = document.getElementById("modeButton");
const closeShopButton = document.getElementById("closeShopButton");
const saveButton = document.getElementById("saveButton");
const resetButton = document.getElementById("resetButton");
const playButton = document.getElementById("playButton");
const introPanel = document.getElementById("introPanel");
const messageFeed = document.getElementById("messageFeed");
const shopStars = document.getElementById("shopStars");
const skinShop = document.getElementById("skinShop");
const racketShop = document.getElementById("racketShop");
const abilityShop = document.getElementById("abilityShop");
const spinButton = document.getElementById("spinButton");

const QA_ENABLED = new URLSearchParams(window.location.search).has("qa");
const SAVE_KEY = "bear3dSurvivalSandboxV2";
const WORLD_SIZE = 1440;
const HALF_WORLD = WORLD_SIZE / 2;
const RENDER_RADIUS = 42;
const RENDER_REFRESH_DISTANCE = 6;
const PLAYER_MAX_LIVES = 100;
const PLAYER_MAX_SHIELDS = 3;
const PLAYER_RADIUS = 0.36;
const PLAYER_HEIGHT = 1.85;
const GRAVITY = 18;
const JUMP_FORCE = 8.2;
const INTERACT_RANGE = 8;
const CREATIVE_INTERACT_RANGE = 18;
const EPIC_EFFECT_MULTIPLIER = 10;
const SURVIVAL_CREATIVE_SURGE_CHANCE = 0.2;
const SURVIVAL_CREATIVE_SURGE_DURATION = 12;
const VOLCANO_COUNT = 12;
const VOLCANO_ERUPTION_INTERVAL = 20;
const LAVA_BURN_DURATION = 10;
const LAVA_BURN_DPS = 0.5;
const BLOCKS = {
  grass: { name: "草方块", color: 0x67a75c, count: 64 },
  dirt: { name: "泥土", color: 0x7a5835, count: 64 },
  stone: { name: "石头", color: 0x7d8790, count: 36 },
  wood: { name: "原木", color: 0x8d5e33, count: 24 },
  lamp: { name: "灯", color: 0xf0c64a, count: 12 },
};

const SHOP_SKINS = {
  bear: { name: "原皮小熊", price: 0, body: 0xd99058, shirt: 0x3d7893 },
  gundam: { name: "经典机甲皮肤", price: 50, body: 0xe8eef4, shirt: 0x17438d },
  homelander: { name: "祖国人风格皮肤", price: 50, body: 0xf0c692, shirt: 0x1f4f99 },
  momota: { name: "桃田贤斗风格皮肤", price: 50, body: 0xe8d0aa, shirt: 0x111827 },
};

const SHOP_RACKETS = {
  starter: {
    name: "Starter Bear Racket",
    price: 0,
    damage: 4,
    range: 2.8,
    cooldown: 0.42,
    color: 0x4cc4dc,
    frame: 0x4cc4dc,
    frame2: 0x2f2358,
    string: 0xffffff,
    shaft: 0x2f2358,
    grip: 0x121722,
    trail: "spark",
    radius: 1,
    shot: "Basic Smash",
  },
  victor100x: {
    name: "Auraspeed 100X Ultra",
    price: 100000,
    damage: 14,
    range: 4.2,
    cooldown: 0.24,
    color: 0x6bd6a0,
    frame: 0x6bd6a0,
    frame2: 0x0a1712,
    string: 0xe7fff4,
    shaft: 0x16392f,
    grip: 0x07130e,
    trail: "ghostWind",
    radius: 1.9,
    shot: "Ghost Wind Cage",
  },
  arcsaber7tour: {
    name: "Yonex Arcsaber 7 Tour",
    price: 1000,
    damage: 8,
    range: 3.2,
    cooldown: 0.34,
    color: 0xd9343e,
    frame: 0xd9343e,
    frame2: 0xf8fafc,
    string: 0xf8d8d8,
    shaft: 0x343434,
    grip: 0x222222,
    trail: "arc",
    radius: 1.45,
    shot: "Arc Smash",
  },
  nanoflare700game: {
    name: "Yonex Nanoflare 700 Game",
    price: 1000,
    damage: 7,
    range: 3.6,
    cooldown: 0.28,
    color: 0x56d3ff,
    frame: 0x56d3ff,
    frame2: 0xf5d34d,
    string: 0xeaf9ff,
    shaft: 0x25305a,
    grip: 0x101827,
    trail: "spark",
    radius: 1.25,
    shot: "Flash Chain",
  },
  antaDingyin1000: {
    name: "Anta Dingyin 1000",
    price: 10000,
    damage: 10,
    range: 3.7,
    cooldown: 0.3,
    color: 0x41ead4,
    frame: 0x0f172a,
    frame2: 0x41ead4,
    string: 0xf4fffa,
    shaft: 0xff3d8b,
    grip: 0x111827,
    trail: "anta",
    radius: 1.55,
    shot: "Dingyin Shock",
  },
};

const SHOP_ABILITIES = {
  shoes: { name: "跑鞋", price: 100000, label: "I 键穿戴", color: 0xe8eef4 },
  barefootPower: { name: "赤脚攻击强化", price: 10000, label: "未穿跑鞋 +40% 伤害", color: 0xf2eee4 },
  jumpSmash: { name: "Jump Smash Ability", price: 10000, label: "空中重击", color: 0xf0c64a },
  pigCompanion: { name: "Pig Pistol Companion", price: 10000, label: "Q 切伙伴，E 开火", color: 0xff9fbe },
  bareHands: { name: "Bare Hands Sprint", price: 30000, label: "徒手冲刺", color: 0x8ee5ff },
};

const TOOL_SLOTS = [
  { id: "racket", label: "球拍", type: "weapon" },
  { id: "pistol", label: "手枪", type: "weapon" },
  { id: "grass", label: "草", type: "block" },
  { id: "dirt", label: "土", type: "block" },
  { id: "stone", label: "石", type: "block" },
  { id: "wood", label: "木", type: "block" },
  { id: "lamp", label: "灯", type: "block" },
  { id: "pickaxe", label: "镐", type: "tool" },
];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8bd7ec);
scene.fog = new THREE.Fog(0x8bd7ec, 70, 170);

const camera = new THREE.PerspectiveCamera(62, 16 / 9, 0.1, 220);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const hemi = new THREE.HemisphereLight(0xe9fbff, 0x35553e, 2.05);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff1c9, 2.75);
sun.position.set(18, 30, 14);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.camera.left = -48;
sun.shadow.camera.right = 48;
sun.shadow.camera.top = 48;
sun.shadow.camera.bottom = -48;
scene.add(sun);

const rimLight = new THREE.DirectionalLight(0x82d8ff, 0.8);
rimLight.position.set(-24, 16, -18);
scene.add(rimLight);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
const blockMaterials = new Map();
const blocks = new Map();
const placedBlockKeys = new Set();
const minedBlockKeys = new Set();
const itemDrops = [];
const volcanoes = [];
const blockMeshes = new THREE.Group();
const enemies = [];
const projectiles = [];
const particles = [];
let boss = null;
let lastRenderCenter = new THREE.Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

scene.add(blockMeshes);

const state = {
  started: false,
  mode: "survival",
  stars: 0,
  lives: PLAYER_MAX_LIVES,
  shields: 0,
  selectedSlot: 0,
  equippedSkin: "bear",
  equippedRacket: "starter",
  equippedAbility: "none",
  shoesOn: false,
  weaponMode: "racket",
  cameraMode: "third",
  inventory: Object.fromEntries(Object.entries(BLOCKS).map(([id, item]) => [id, item.count])),
  ownedSkins: { bear: true },
  ownedRackets: { starter: true },
  ownedAbilities: { pigCompanion: true },
  yaw: 0,
  pitch: -0.38,
  messageTimer: 0,
  attackCooldown: 0,
  shotCooldown: 0,
  invulnerable: 0,
  survivalCreativeSurge: 0,
  creativeRollTimer: 20,
  lavaBurn: 0,
};

const player = {
  position: new THREE.Vector3(0, 1.2, 0),
  velocity: new THREE.Vector3(),
  group: new THREE.Group(),
  speed: 6,
};

const input = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
  jump: false,
  mouseDown: false,
  rightMouseDown: false,
  jumpQueued: false,
};

const clock = new THREE.Clock();

init();

function init() {
  setupWorld();
  setupPlayerModel();
  setupEnemies();
  setupUI();
  bindEvents();
  loadGame();
  exposeQaHooks();
  resize();
  updateUI();
  renderer.setAnimationLoop(loop);
}

function exposeQaHooks() {
  if (!QA_ENABLED) return;
  window.__bearSandboxDebug = () => ({
    mode: state.mode,
    playerY: Number(player.position.y.toFixed(3)),
    enemies: enemies
      .filter((enemy) => !enemy.defeated && enemy.active && enemy.type !== "turret")
      .slice(0, 6)
      .map((enemy) => ({
        type: enemy.type,
        x: Number(enemy.position.x.toFixed(3)),
        y: Number(enemy.position.y.toFixed(3)),
        z: Number(enemy.position.z.toFixed(3)),
      })),
  });
}

function updateQaDebug() {
  if (!QA_ENABLED) return;
  document.body.dataset.playerY = player.position.y.toFixed(3);
  document.body.dataset.mode = state.mode;
  document.body.dataset.enemySample = enemies
    .filter((enemy) => !enemy.defeated && enemy.active && enemy.type !== "turret")
    .slice(0, 6)
    .map((enemy) => `${enemy.type}:${enemy.position.x.toFixed(2)},${enemy.position.z.toFixed(2)}`)
    .join("|");
}

function setupWorld() {
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE),
    new THREE.MeshStandardMaterial({
      color: 0x55abc3,
      roughness: 0.42,
      metalness: 0.05,
      transparent: true,
      opacity: 0.86,
    }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.08;
  water.receiveShadow = true;
  scene.add(water);
  addAtmosphereDetails();
  setupVolcanoes();
  refreshWorldWindow(true);
  addBlock(2, 3, 3, "lamp", true, false, true);
  addBlock(-2, 2, -3, "wood", true, false, true);
}

function setupVolcanoes() {
  volcanoes.length = 0;
  for (let i = 0; i < VOLCANO_COUNT; i += 1) {
    const angle = (i / VOLCANO_COUNT) * Math.PI * 2 + seededNoise(i, 11) * 0.6;
    const distance = 140 + seededNoise(i, 29) * (HALF_WORLD - 190);
    const x = Math.round(Math.cos(angle) * distance);
    const z = Math.round(Math.sin(angle) * distance);
    volcanoes.push({
      x,
      z,
      radius: 7 + Math.floor(seededNoise(i, 47) * 5),
      height: 9 + Math.floor(seededNoise(i, 71) * 7),
      timer: seededNoise(i, 97) * VOLCANO_ERUPTION_INTERVAL,
      erupting: 0,
    });
  }
}

function refreshWorldWindow(force = false) {
  const centerX = Math.round(player.position.x);
  const centerZ = Math.round(player.position.z);
  if (
    !force &&
    Math.abs(centerX - lastRenderCenter.x) < RENDER_REFRESH_DISTANCE &&
    Math.abs(centerZ - lastRenderCenter.y) < RENDER_REFRESH_DISTANCE
  ) {
    return;
  }
  lastRenderCenter.set(centerX, centerZ);

  for (const [key, mesh] of Array.from(blocks.entries())) {
    if (mesh.userData.persist || !mesh.userData.natural) continue;
    const { x, z } = mesh.userData;
    if (Math.abs(x - centerX) > RENDER_RADIUS + 8 || Math.abs(z - centerZ) > RENDER_RADIUS + 8) {
      blockMeshes.remove(mesh);
      blocks.delete(key);
    }
  }

  const minX = Math.max(-HALF_WORLD, centerX - RENDER_RADIUS);
  const maxX = Math.min(HALF_WORLD - 1, centerX + RENDER_RADIUS);
  const minZ = Math.max(-HALF_WORLD, centerZ - RENDER_RADIUS);
  const maxZ = Math.min(HALF_WORLD - 1, centerZ + RENDER_RADIUS);
  for (let x = minX; x <= maxX; x += 1) {
    for (let z = minZ; z <= maxZ; z += 1) {
      addNaturalColumn(x, z);
      if (shouldHaveTree(x, z)) addTree(x, z, true);
    }
  }
}

function addNaturalColumn(x, z) {
  const height = terrainHeight(x, z);
  for (let y = 0; y <= height; y += 1) {
    const key = keyFor(x, y, z);
    if (minedBlockKeys.has(key)) continue;
    const volcano = getVolcanoAt(x, z);
    const type = volcano && y >= height - 1 ? "stone" : y === height ? "grass" : y > height - 2 ? "dirt" : "stone";
    addBlock(x, y, z, type, false, true, false);
  }
}

function addAtmosphereDetails() {
  for (const [x, y, z, s] of [
    [-26, 14, -22, 1.2],
    [8, 16, -28, 0.9],
    [28, 13, 16, 1.05],
    [-12, 18, 24, 1.0],
  ]) {
    const cloud = new THREE.Group();
    cloud.add(ellipsoid(1.7 * s, 0.42 * s, 0.72 * s, mat(0xffffff, 0.55), 0, 0, 0));
    cloud.add(ellipsoid(1.05 * s, 0.5 * s, 0.62 * s, mat(0xf3fbff, 0.55), -1.0 * s, 0.08 * s, 0.1 * s));
    cloud.add(ellipsoid(1.15 * s, 0.55 * s, 0.68 * s, mat(0xe6f7ff, 0.55), 1.0 * s, 0.02 * s, -0.08 * s));
    cloud.position.set(x, y, z);
    cloud.traverse((child) => {
      if (child.isMesh) child.castShadow = false;
    });
    scene.add(cloud);
  }
}

function terrainHeight(x, z) {
  const wave = Math.sin(x * 0.08) + Math.cos(z * 0.075) + Math.sin((x + z) * 0.045);
  let height = Math.max(0, Math.floor(2 + wave * 1.4 + seededNoise(x, z) * 2.2));
  const volcano = getVolcanoAt(x, z);
  if (volcano) {
    const distance = Math.hypot(x - volcano.x, z - volcano.z);
    const rim = Math.max(0, 1 - distance / volcano.radius);
    height += Math.floor(volcano.height * rim);
  }
  return height;
}

function shouldHaveTree(x, z) {
  if (getVolcanoAt(x, z)) return false;
  return seededNoise(x * 3, z * 5) > 0.984;
}

function getVolcanoAt(x, z) {
  return volcanoes.find((volcano) => Math.hypot(x - volcano.x, z - volcano.z) <= volcano.radius);
}

function seededNoise(a, b) {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function addTree(x, z, natural = false) {
  const baseY = terrainHeight(x, z) + 1;
  for (let y = 0; y < 4; y += 1) addBlock(x, baseY + y, z, "wood", false, natural, false);
  for (let ox = -2; ox <= 2; ox += 1) {
    for (let oz = -2; oz <= 2; oz += 1) {
      for (let oy = 0; oy <= 2; oy += 1) {
        if (Math.abs(ox) + Math.abs(oz) + oy < 5) addBlock(x + ox, baseY + 3 + oy, z + oz, "grass", false, natural, false);
      }
    }
  }
}

function keyFor(x, y, z) {
  return `${x},${y},${z}`;
}

function getBlockMaterial(type) {
  if (!blockMaterials.has(type)) {
    blockMaterials.set(
      type,
      new THREE.MeshStandardMaterial({
        color: BLOCKS[type]?.color || 0xffffff,
        roughness: 0.78,
        metalness: type === "lamp" ? 0.18 : 0,
        emissive: type === "lamp" ? 0x6a4d10 : 0x000000,
        emissiveIntensity: type === "lamp" ? 0.65 : 0,
      }),
    );
  }
  return blockMaterials.get(type);
}

function addBlock(x, y, z, type, sparkle = true, natural = false, persist = false) {
  if (x < -HALF_WORLD || x >= HALF_WORLD || z < -HALF_WORLD || z >= HALF_WORLD || y < 0) return false;
  const key = keyFor(x, y, z);
  if (blocks.has(key)) return false;
  const mesh = new THREE.Mesh(blockGeometry, getBlockMaterial(type));
  mesh.position.set(x, y + 0.5, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = { kind: "block", type, x, y, z, natural, persist };
  blockMeshes.add(mesh);
  blocks.set(key, mesh);
  if (!natural) placedBlockKeys.add(key);

  if (type === "lamp") {
    const light = new THREE.PointLight(0xf0c64a, 1.8, 9);
    light.position.set(0, 0.8, 0);
    mesh.add(light);
  }
  if (sparkle) spawnParticles(new THREE.Vector3(x, y + 0.8, z), BLOCKS[type]?.color || 0xffffff);
  return true;
}

function removeBlock(mesh) {
  const { x, y, z, type } = mesh.userData;
  if (y <= 0) {
    announce("基底不能挖掉");
    return false;
  }
  const key = keyFor(x, y, z);
  blockMeshes.remove(mesh);
  blocks.delete(key);
  if (mesh.userData.natural) minedBlockKeys.add(key);
  placedBlockKeys.delete(key);
  spawnItemDrop(type, mesh.position.clone());
  spawnParticles(mesh.position, BLOCKS[type]?.color || 0xffffff, 90, 2.8);
  announce(`${BLOCKS[type]?.name || "方块"} 掉落`);
  return true;
}

function highestBlockY(x, z) {
  let top = terrainHeight(x, z) + 1;
  for (let y = 0; y < 32; y += 1) {
    if (blocks.has(keyFor(x, y, z))) top = y + 1;
  }
  return top;
}

function spawnItemDrop(type, position) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.28, 0.28),
    new THREE.MeshStandardMaterial({
      color: BLOCKS[type]?.color || 0xffffff,
      emissive: BLOCKS[type]?.color || 0xffffff,
      emissiveIntensity: 0.22,
      roughness: 0.42,
    }),
  );
  mesh.position.copy(position).add(new THREE.Vector3(0, 0.35, 0));
  mesh.castShadow = true;
  scene.add(mesh);
  itemDrops.push({
    type,
    mesh,
    velocity: new THREE.Vector3((Math.random() - 0.5) * 1.6, 3.4, (Math.random() - 0.5) * 1.6),
    life: 26,
  });
}

function setupPlayerModel() {
  scene.add(player.group);
  rebuildPlayerModel();
}

function rebuildPlayerModel() {
  player.group.clear();
  const skin = SHOP_SKINS[state.equippedSkin] || SHOP_SKINS.bear;
  const bodyMat = mat(skin.body, 0.55, 0.02);
  const shirtMat = mat(skin.shirt, 0.48, 0.03);
  const darkMat = mat(0x1b2528, 0.6);
  const faceMat = mat(0xf3cda2, 0.45);
  const eyeMat = mat(0x101820, 0.32);

  const body = ellipsoid(0.46, 0.55, 0.34, shirtMat, 0, 0.82, 0);
  const belly = ellipsoid(0.32, 0.28, 0.16, faceMat, 0, 0.72, -0.25);
  const head = ellipsoid(0.45, 0.42, 0.4, bodyMat, 0, 1.48, 0);
  const muzzle = ellipsoid(0.25, 0.16, 0.15, faceMat, 0, 1.38, -0.34);
  const earL = ellipsoid(0.16, 0.18, 0.1, bodyMat, -0.31, 1.78, -0.02);
  const earR = ellipsoid(0.16, 0.18, 0.1, bodyMat, 0.31, 1.78, -0.02);
  const innerEarL = ellipsoid(0.08, 0.09, 0.04, faceMat, -0.31, 1.78, -0.09);
  const innerEarR = ellipsoid(0.08, 0.09, 0.04, faceMat, 0.31, 1.78, -0.09);
  const eyeL = sphere(0.045, eyeMat, -0.14, 1.54, -0.36);
  const eyeR = sphere(0.045, eyeMat, 0.14, 1.54, -0.36);
  const nose = sphere(0.05, eyeMat, 0, 1.41, -0.48);
  const blushL = ellipsoid(0.055, 0.03, 0.015, mat(0xff9aa9, 0.5), -0.22, 1.38, -0.39);
  const blushR = ellipsoid(0.055, 0.03, 0.015, mat(0xff9aa9, 0.5), 0.22, 1.38, -0.39);
  const legL = ellipsoid(0.13, 0.28, 0.13, darkMat, -0.18, 0.22, 0);
  const legR = ellipsoid(0.13, 0.28, 0.13, darkMat, 0.18, 0.22, 0);
  const armL = ellipsoid(0.11, 0.34, 0.1, bodyMat, -0.47, 0.88, -0.02);
  const armR = ellipsoid(0.11, 0.34, 0.1, bodyMat, 0.47, 0.88, -0.02);
  armR.rotation.z = -0.52;
  armL.rotation.z = 0.26;
  player.group.add(
    body,
    belly,
    head,
    muzzle,
    earL,
    earR,
    innerEarL,
    innerEarR,
    eyeL,
    eyeR,
    nose,
    blushL,
    blushR,
    legL,
    legR,
    armL,
    armR,
  );

  if (state.equippedSkin === "gundam") {
    player.group.add(box(0.84, 0.18, 0.5, mat(0xe8eef4), 0, 1.22, 0));
    player.group.add(box(0.1, 0.52, 0.14, mat(0xf0c64a), -0.36, 0.74, 0));
    player.group.add(box(0.1, 0.52, 0.14, mat(0xd9343e), 0.36, 0.74, 0));
  }

  const racket = SHOP_RACKETS[state.equippedRacket] || SHOP_RACKETS.starter;
  const racketGroup = new THREE.Group();
  racketGroup.name = "racket";
  const handle = cyl(0.045, 0.045, 0.82, mat(racket.grip || 0x2b2420, 0.38, 0.08), 0.58, 0.7, -0.38);
  handle.rotation.x = 0.86;
  const shaft = cyl(0.022, 0.026, 0.9, mat(racket.shaft || 0x26303a, 0.3, 0.18), 0.68, 0.92, -0.52);
  shaft.rotation.x = 0.86;
  const frame = new THREE.Mesh(
    new THREE.TorusGeometry(0.25 * (racket.radius || 1), 0.026, 14, 40),
    mat(racket.frame || racket.color, 0.26, 0.14),
  );
  frame.position.set(0.78, 1.02, -0.62);
  frame.rotation.x = 0.92;
  frame.rotation.z = 0.22;
  const frameGlow = new THREE.Mesh(
    new THREE.TorusGeometry(0.29 * (racket.radius || 1), 0.008, 10, 40),
    new THREE.MeshStandardMaterial({
      color: racket.frame2 || racket.color,
      emissive: racket.frame2 || racket.color,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      transparent: true,
      opacity: 0.66,
    }),
  );
  frameGlow.position.copy(frame.position);
  frameGlow.rotation.copy(frame.rotation);
  const strings = new THREE.Group();
  strings.position.copy(frame.position);
  strings.rotation.copy(frame.rotation);
  for (let i = -2; i <= 2; i += 1) {
    const lineA = box(0.012, 0.42 * (racket.radius || 1), 0.01, mat(racket.string || 0xffffff, 0.32), i * 0.065, 0, 0);
    const lineB = box(0.42 * (racket.radius || 1), 0.012, 0.01, mat(racket.string || 0xffffff, 0.32), 0, i * 0.065, 0);
    strings.add(lineA, lineB);
  }
  racketGroup.add(handle, shaft, frame, frameGlow, strings);
  player.group.add(racketGroup);

  if (state.weaponMode === "pistol") {
    player.group.add(box(0.34, 0.12, 0.16, mat(0x26303a), 0.64, 0.9, -0.42));
    if (state.ownedAbilities.pigCompanion) {
      const pig = new THREE.Group();
      pig.name = "pigCompanion";
      pig.add(sphere(0.2, mat(0xff9fbe), -0.72, 0.52, 0.62));
      pig.add(sphere(0.09, mat(0xffc0d3), -0.86, 0.6, 0.48));
      pig.add(sphere(0.09, mat(0xffc0d3), -0.58, 0.6, 0.48));
      pig.add(box(0.28, 0.12, 0.14, mat(0x26303a), -0.72, 0.5, 0.34));
      player.group.add(pig);
    }
  }
}

function box(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function sphere(r, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 18), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function ellipsoid(rx, ry, rz, material, x, y, z) {
  const mesh = sphere(1, material, x, y, z);
  mesh.scale.set(rx, ry, rz);
  return mesh;
}

function cyl(r1, r2, h, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 24), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function mat(color, roughness = 0.65, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function setupEnemies() {
  const monsterSpawns = [
    ["zombie", -16, -8],
    ["zombie", -8, 18],
    ["zombie", 16, -17],
    ["zombie", 24, 8],
    ["zombie", -25, 14],
    ["racketMonster", 12, 15],
    ["racketMonster", -19, 22],
    ["racketMonster", 26, -24],
    ["turret", 0, -24],
    ["turret", 24, 0],
    ["turret", -28, -22],
  ];

  for (const [type, x, z] of monsterSpawns) {
    spawnEnemy(type, x, z);
  }

  boss = spawnEnemy("rabbitBoss", 30, 30);
  boss.active = false;
  spawnEnemy("zombieBoss", -31, 28).active = false;
  spawnEnemy("gundamBoss", 31, -31).active = false;
}

function spawnEnemy(type, x, z) {
  const isBoss = type.includes("Boss");
  const enemy = {
    type,
    name: getEnemyName(type),
    position: new THREE.Vector3(x, highestBlockY(Math.round(x), Math.round(z)), z),
    velocity: new THREE.Vector3(),
    hp: isBoss ? (type === "gundamBoss" ? 180 : 130) : type === "turret" ? 28 : 22,
    maxHp: isBoss ? (type === "gundamBoss" ? 180 : 130) : type === "turret" ? 28 : 22,
    damage: isBoss ? 8 : type === "turret" ? 4 : 3,
    speed: type === "zombie" ? 2.2 : type === "racketMonster" ? 2.7 : type === "turret" ? 0 : 1.8,
    cooldown: 1 + Math.random(),
    invulnerable: 0,
    active: true,
    defeated: false,
    group: createEnemyModel(type),
  };
  enemy.group.position.copy(enemy.position);
  scene.add(enemy.group);
  enemies.push(enemy);
  return enemy;
}

function getEnemyName(type) {
  return {
    zombie: "毒雾僵尸怪",
    racketMonster: "原皮球拍小熊怪",
    turret: "机关枪炮台",
    rabbitBoss: "Rabbit Boss",
    zombieBoss: "Zombie Boss",
    gundamBoss: "Gundam Mech Boss",
  }[type];
}

function createEnemyModel(type) {
  const group = new THREE.Group();
  const eyeMat = mat(0x111827, 0.35);
  const glowMat = mat(0xfff1a8, 0.25, 0.08);
  if (type === "zombie") {
    group.add(ellipsoid(0.44, 0.58, 0.34, mat(0x6aa05c, 0.5), 0, 0.72, 0));
    group.add(ellipsoid(0.38, 0.36, 0.34, mat(0xaed982, 0.46), 0, 1.38, 0));
    group.add(sphere(0.05, eyeMat, -0.13, 1.44, -0.32));
    group.add(sphere(0.05, eyeMat, 0.13, 1.44, -0.32));
    group.add(ellipsoid(0.12, 0.25, 0.12, mat(0x31433f, 0.6), -0.17, 0.22, 0));
    group.add(ellipsoid(0.12, 0.25, 0.12, mat(0x31433f, 0.6), 0.17, 0.22, 0));
    group.add(ellipsoid(0.09, 0.28, 0.08, mat(0xaed982, 0.48), -0.42, 0.86, -0.03));
    group.add(ellipsoid(0.09, 0.28, 0.08, mat(0xaed982, 0.48), 0.42, 0.86, -0.03));
  } else if (type === "racketMonster") {
    group.add(ellipsoid(0.45, 0.54, 0.35, mat(0xd99058, 0.5), 0, 0.75, 0));
    group.add(ellipsoid(0.42, 0.4, 0.36, mat(0xd99058, 0.48), 0, 1.42, 0));
    group.add(ellipsoid(0.15, 0.16, 0.1, mat(0xd99058, 0.48), -0.29, 1.76, 0));
    group.add(ellipsoid(0.15, 0.16, 0.1, mat(0xd99058, 0.48), 0.29, 1.76, 0));
    group.add(sphere(0.045, eyeMat, -0.13, 1.49, -0.34));
    group.add(sphere(0.045, eyeMat, 0.13, 1.49, -0.34));
    group.add(ellipsoid(0.18, 0.1, 0.08, mat(0xf0c692, 0.44), 0, 1.38, -0.37));
    const racket = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.026, 10, 36), mat(0xff3d8b, 0.35, 0.08));
    racket.position.set(0.58, 1.02, -0.38);
    racket.rotation.x = 1.1;
    group.add(racket);
  } else if (type === "turret") {
    group.add(cyl(0.42, 0.5, 0.42, mat(0x4b6760, 0.42, 0.12), 0, 0.22, 0));
    group.add(ellipsoid(0.36, 0.25, 0.36, mat(0x6b8078, 0.38, 0.18), 0, 0.56, 0));
    const barrel = box(0.22, 0.22, 1.2, mat(0x26303a, 0.42, 0.3), 0, 0.55, -0.48);
    group.add(barrel);
    group.add(sphere(0.16, glowMat, 0, 0.55, -1.08));
  } else if (type === "rabbitBoss") {
    group.add(ellipsoid(0.78, 0.95, 0.55, mat(0xb7e85a, 0.45), 0, 1.03, 0));
    group.add(ellipsoid(0.62, 0.58, 0.52, mat(0xcdf06e, 0.42), 0, 2.0, 0));
    group.add(ellipsoid(0.12, 0.58, 0.09, mat(0xcdf06e, 0.42), -0.33, 2.62, 0));
    group.add(ellipsoid(0.12, 0.58, 0.09, mat(0xcdf06e, 0.42), 0.33, 2.62, 0));
    group.add(sphere(0.075, eyeMat, -0.2, 2.06, -0.48));
    group.add(sphere(0.075, eyeMat, 0.2, 2.06, -0.48));
    group.add(ellipsoid(0.26, 0.13, 0.1, mat(0xf6f2df, 0.4), 0, 1.9, -0.52));
  } else if (type === "zombieBoss") {
    group.add(ellipsoid(0.74, 1.05, 0.58, mat(0x3f744e, 0.46), 0, 1.12, 0));
    group.add(ellipsoid(0.68, 0.62, 0.56, mat(0x78ff79, 0.43), 0, 2.18, 0));
    group.add(sphere(0.08, eyeMat, -0.22, 2.24, -0.52));
    group.add(sphere(0.08, eyeMat, 0.22, 2.24, -0.52));
    group.add(box(1.72, 0.18, 0.18, mat(0x1f3f3b, 0.5), 0, 1.48, -0.48));
    group.add(ellipsoid(0.22, 0.12, 0.08, mat(0xff6f72, 0.35, 0.08), 0, 2.03, -0.57));
  } else {
    group.add(ellipsoid(0.82, 1.05, 0.62, mat(0xe8eef4, 0.35, 0.25), 0, 1.1, 0));
    group.add(box(1.18, 0.78, 1.08, mat(0x17438d, 0.34, 0.22), 0, 2.28, 0));
    group.add(sphere(0.08, mat(0x8ee5ff, 0.28, 0.2), -0.24, 2.34, -0.58));
    group.add(sphere(0.08, mat(0x8ee5ff, 0.28, 0.2), 0.24, 2.34, -0.58));
    group.add(box(0.26, 1.15, 0.32, mat(0xd9343e, 0.38, 0.18), -0.88, 1.18, 0));
    group.add(box(0.26, 1.15, 0.32, mat(0xf0c64a, 0.38, 0.18), 0.88, 1.18, 0));
  }
  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.userData.kind = "enemyMesh";
    }
  });
  group.userData.kind = "enemy";
  return group;
}

function setupUI() {
  inventoryGrid.innerHTML = "";
  for (const [id, block] of Object.entries(BLOCKS)) {
    const row = document.createElement("div");
    row.className = "inventory-row";
    row.innerHTML = `<span class="inventory-chip"></span><span>${block.name}</span><span class="inventory-count" data-count="${id}">0</span>`;
    row.querySelector(".inventory-chip").style.background = `#${block.color.toString(16).padStart(6, "0")}`;
    inventoryGrid.append(row);
  }

  toolbelt.innerHTML = "";
  TOOL_SLOTS.forEach((slot, index) => {
    const button = document.createElement("button");
    button.className = "tool-slot";
    button.type = "button";
    button.innerHTML = `<span class="tool-icon">${slot.label}</span><span class="tool-count" data-tool-count="${slot.id}"></span>`;
    button.addEventListener("click", () => selectSlot(index));
    toolbelt.append(button);
  });

  renderShop();
}

function renderShop() {
  renderShopGroup(skinShop, SHOP_SKINS, "skin");
  renderShopGroup(racketShop, SHOP_RACKETS, "racket");
  renderShopGroup(abilityShop, SHOP_ABILITIES, "ability");
}

function renderShopGroup(container, items, kind) {
  container.innerHTML = "";
  Object.entries(items).forEach(([id, item]) => {
    const owned =
      kind === "skin"
        ? state.ownedSkins[id]
        : kind === "racket"
          ? state.ownedRackets[id]
          : state.ownedAbilities[id];
    const equipped =
      (kind === "skin" && state.equippedSkin === id) ||
      (kind === "racket" && state.equippedRacket === id) ||
      (kind === "ability" && state.equippedAbility === id);
    const row = document.createElement("div");
    row.className = "shop-item";
    row.innerHTML = `
      <span class="shop-preview"></span>
      <span class="shop-copy">
        <strong>${item.name}</strong>
        <span>${kind === "ability" ? item.label : item.price === 0 ? "默认拥有" : `${item.price} 星星`}</span>
      </span>
      <button type="button">${equipped ? "已装备" : owned ? "装备" : "购买"}</button>
    `;
    row.querySelector(".shop-preview").style.background = `#${(item.color || item.shirt || item.body || 0xf6f2df).toString(16).padStart(6, "0")}`;
    const button = row.querySelector("button");
    button.disabled = equipped;
    button.addEventListener("click", () => buyOrEquip(kind, id));
    container.append(row);
  });
}

function buyOrEquip(kind, id) {
  const collections = {
    skin: [SHOP_SKINS, state.ownedSkins, "equippedSkin"],
    racket: [SHOP_RACKETS, state.ownedRackets, "equippedRacket"],
    ability: [SHOP_ABILITIES, state.ownedAbilities, "equippedAbility"],
  };
  const [items, owned, equippedKey] = collections[kind];
  const item = items[id];
  if (!owned[id]) {
    if (state.stars < item.price) {
      announce("星星不够");
      return;
    }
    state.stars -= item.price;
    owned[id] = true;
    announce(`已购买 ${item.name}`);
  }
  state[equippedKey] = id;
  if (kind === "skin") rebuildPlayerModel();
  if (kind === "racket") announce(`${item.name} 已装备`);
  if (kind === "ability") announce(`${item.name} 已启用`);
  renderShop();
  updateUI();
}

function selectSlot(index) {
  state.selectedSlot = index;
  const slot = TOOL_SLOTS[index];
  if (slot.id === "racket" || slot.id === "pistol") {
    state.weaponMode = slot.id;
    rebuildPlayerModel();
  }
  announce(slot.label);
  updateUI();
}

function bindEvents() {
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", (event) => onKey(event, true));
  window.addEventListener("keyup", (event) => onKey(event, false));
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", () => {
    input.mouseDown = false;
    input.rightMouseDown = false;
  });
  canvas.addEventListener("contextmenu", (event) => event.preventDefault());

  playButton.addEventListener("click", () => {
    state.started = true;
    introPanel.classList.add("is-hidden");
    requestMouseLock();
    announce("生存模式开始");
  });
  shopButton.addEventListener("click", () => {
    shopPanel.classList.toggle("is-hidden");
    renderShop();
  });
  modeButton.addEventListener("click", toggleMode);
  closeShopButton.addEventListener("click", () => shopPanel.classList.add("is-hidden"));
  saveButton.addEventListener("click", () => saveGame(true));
  resetButton.addEventListener("click", resetGame);
  spinButton.addEventListener("click", spinWheel);
  window.addEventListener("pagehide", () => saveGame(false));
}

function onKey(event, pressed) {
  if (event.code === "KeyW") input.forward = pressed;
  else if (event.code === "KeyS") input.backward = pressed;
  else if (event.code === "KeyA") input.left = pressed;
  else if (event.code === "KeyD") input.right = pressed;
  else if (event.code === "ShiftLeft" || event.code === "ShiftRight") input.sprint = pressed;
  else if (event.code === "Space") {
    input.jump = pressed;
    if (pressed && !event.repeat) input.jumpQueued = true;
  }
  else if (pressed && event.code.startsWith("Digit")) {
    const index = Number(event.code.replace("Digit", "")) - 1;
    if (index >= 0 && index < TOOL_SLOTS.length) selectSlot(index);
  } else if (pressed && event.code === "KeyQ") {
    state.ownedAbilities.pigCompanion = true;
    state.weaponMode = state.weaponMode === "pistol" ? "racket" : "pistol";
    state.selectedSlot = state.weaponMode === "pistol" ? 1 : 0;
    rebuildPlayerModel();
    announce(state.weaponMode === "pistol" ? "小猪伙伴/手枪模式" : "球拍模式");
  } else if (pressed && event.code === "KeyE") {
    fireProjectile(true);
  } else if (pressed && event.code === "KeyC") {
    toggleMode();
  } else if (pressed && event.code === "KeyY") {
    toggleCameraMode();
  } else if (pressed && event.code === "KeyG") {
    announce("Forehand Drive / Backhand Smash / Drop Shot");
  } else if (pressed && event.code === "KeyI") {
    if (state.ownedAbilities.shoes) {
      state.shoesOn = !state.shoesOn;
      announce(state.shoesOn ? "跑鞋已穿上" : "跑鞋已脱下");
    } else {
      announce("商店解锁跑鞋后可穿戴");
    }
  } else {
    return;
  }
  event.preventDefault();
}

function onMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  if (document.pointerLockElement === canvas) {
    state.yaw -= event.movementX * 0.0024;
    state.pitch = THREE.MathUtils.clamp(state.pitch - event.movementY * 0.0018, -0.95, 0.55);
  }
}

function onMouseDown(event) {
  if (!state.started) return;
  if (document.pointerLockElement !== canvas) requestMouseLock();
  if (event.button === 2) {
    input.rightMouseDown = true;
    placeSelectedBlock();
  } else {
    input.mouseDown = true;
    useSelectedTool();
  }
}

function toggleMode() {
  state.mode = state.mode === "creative" ? "survival" : "creative";
  if (state.mode === "creative") {
    state.lives = PLAYER_MAX_LIVES;
    state.shields = PLAYER_MAX_SHIELDS;
  }
  announce(state.mode === "creative" ? "创造模式：无限方块、无伤害，但不再飞天" : "生存模式：怪物和 Boss 会攻击");
  updateUI();
}

function hasCreativeBuildPower() {
  return state.mode === "creative" || state.survivalCreativeSurge > 0;
}

function toggleCameraMode() {
  state.cameraMode = state.cameraMode === "first" ? "third" : "first";
  player.group.visible = state.cameraMode !== "first";
  announce(state.cameraMode === "first" ? "第一视角" : "第三视角");
  updateUI();
}

function requestMouseLock() {
  try {
    const lock = canvas.requestPointerLock?.();
    if (lock && typeof lock.catch === "function") lock.catch(() => {});
  } catch {
    // Some embedded previews disallow pointer lock; normal mouse controls still work.
  }
}

function loop() {
  const dt = Math.min(clock.getDelta(), 0.033);
  update(dt);
  render();
}

function update(dt) {
  if (state.started) {
    updateSurvivalCreativeSurge(dt);
    updatePlayer(dt);
    refreshWorldWindow(false);
    updateEnemies(dt);
    updateProjectiles(dt);
    updateItemDrops(dt);
    updateVolcanoes(dt);
    if (input.mouseDown) useSelectedTool();
  }
  state.attackCooldown = Math.max(0, state.attackCooldown - dt);
  state.shotCooldown = Math.max(0, state.shotCooldown - dt);
  state.invulnerable = Math.max(0, state.invulnerable - dt);
  updateParticles(dt);
  updateCamera();
  updateUI();
  updateQaDebug();
  updateMinimap();
  if (state.messageTimer > 0) {
    state.messageTimer -= dt;
    if (state.messageTimer <= 0) messageFeed.classList.remove("is-visible");
  }
}

function updateSurvivalCreativeSurge(dt) {
  state.survivalCreativeSurge = Math.max(0, state.survivalCreativeSurge - dt);
  if (state.mode !== "survival" || state.survivalCreativeSurge > 0) return;
  state.creativeRollTimer -= dt;
  if (state.creativeRollTimer > 0) return;
  state.creativeRollTimer = 20;
  if (Math.random() < SURVIVAL_CREATIVE_SURGE_CHANCE) {
    state.survivalCreativeSurge = SURVIVAL_CREATIVE_SURGE_DURATION;
    spawnParticles(player.position.clone().add(new THREE.Vector3(0, 1.1, 0)), 0x8ee5ff, 180, 3.6);
    announce("生存模式触发创造能量：12 秒无限建造");
  }
}

function updatePlayer(dt) {
  const forward = new THREE.Vector3(Math.sin(state.yaw), 0, Math.cos(state.yaw));
  const right = new THREE.Vector3(Math.cos(state.yaw), 0, -Math.sin(state.yaw));
  const move = new THREE.Vector3();
  if (input.forward) move.add(forward);
  if (input.backward) move.sub(forward);
  if (input.right) move.add(right);
  if (input.left) move.sub(right);
  if (move.lengthSq() > 0) move.normalize();

  const speedBoost = state.shoesOn ? 1.5 : 1;
  const sprintBoost = input.sprint ? 1.35 : 1;
  const modeBoost = state.mode === "creative" ? 1.18 : 1;
  player.velocity.x = move.x * player.speed * speedBoost * sprintBoost * modeBoost;
  player.velocity.z = move.z * player.speed * speedBoost * sprintBoost * modeBoost;
  player.velocity.y -= GRAVITY * dt;

  const groundY = getGroundY(player.position.x, player.position.z) + 0.03;
  if (player.position.y <= groundY + 0.22) {
    player.position.y = groundY;
    player.velocity.y = Math.max(0, player.velocity.y);
    if (input.jumpQueued) {
      player.velocity.y = state.ownedAbilities.jumpSmash ? 9.4 : JUMP_FORCE;
      spawnParticles(player.position.clone().add(new THREE.Vector3(0, 0.12, 0)), 0xf6f2df, 12, 0.36);
    }
  }
  input.jumpQueued = false;

  movePlayerWithCollision(dt);
  player.position.x = THREE.MathUtils.clamp(player.position.x, -HALF_WORLD + 1, HALF_WORLD - 1);
  player.position.z = THREE.MathUtils.clamp(player.position.z, -HALF_WORLD + 1, HALF_WORLD - 1);
  player.group.position.copy(player.position);
  player.group.rotation.y = state.yaw + Math.PI;
}

function movePlayerWithCollision(dt) {
  const nextX = player.position.x + player.velocity.x * dt;
  if (!bodyCollides(nextX, player.position.y, player.position.z, PLAYER_RADIUS)) {
    player.position.x = nextX;
  } else {
    player.velocity.x = 0;
  }

  const nextZ = player.position.z + player.velocity.z * dt;
  if (!bodyCollides(player.position.x, player.position.y, nextZ, PLAYER_RADIUS)) {
    player.position.z = nextZ;
  } else {
    player.velocity.z = 0;
  }

  const nextY = player.position.y + player.velocity.y * dt;
  if (!bodyCollides(player.position.x, nextY, player.position.z, PLAYER_RADIUS)) {
    player.position.y = nextY;
  } else if (player.velocity.y > 0) {
    player.velocity.y = 0;
  } else {
    const groundY = getGroundY(player.position.x, player.position.z) + 0.03;
    if (player.position.y <= groundY + 0.35) player.position.y = groundY;
    player.velocity.y = 0;
  }

  const groundY = getGroundY(player.position.x, player.position.z) + 0.03;
  if (player.position.y < groundY) {
    player.position.y = groundY;
    player.velocity.y = 0;
  }
}

function bodyCollides(x, y, z, radius = 0.36, height = PLAYER_HEIGHT) {
  const minX = Math.floor(x - radius - 0.5);
  const maxX = Math.ceil(x + radius + 0.5);
  const minY = Math.floor(y + 0.05);
  const maxY = Math.ceil(y + height);
  const minZ = Math.floor(z - radius - 0.5);
  const maxZ = Math.ceil(z + radius + 0.5);

  for (let bx = minX; bx <= maxX; bx += 1) {
    for (let by = minY; by <= maxY; by += 1) {
      for (let bz = minZ; bz <= maxZ; bz += 1) {
        if (!blocks.has(keyFor(bx, by, bz))) continue;
        const blockMinX = bx - 0.5;
        const blockMaxX = bx + 0.5;
        const blockMinY = by;
        const blockMaxY = by + 1;
        const blockMinZ = bz - 0.5;
        const blockMaxZ = bz + 0.5;
        const overlaps =
          x + radius > blockMinX &&
          x - radius < blockMaxX &&
          y + height > blockMinY &&
          y + 0.08 < blockMaxY &&
          z + radius > blockMinZ &&
          z - radius < blockMaxZ;
        if (overlaps) return true;
      }
    }
  }
  return false;
}

function getGroundY(x, z) {
  const tx = Math.round(x);
  const tz = Math.round(z);
  return highestBlockY(tx, tz);
}

function updateEnemies(dt) {
  const activeBoss = getActiveBoss();
  for (const enemy of enemies) {
    if (enemy.defeated) continue;
    const distance = enemy.position.distanceTo(player.position);
    if (enemy.type.includes("Boss") && !enemy.active && distance < 34) {
      enemy.active = true;
      boss = enemy;
      announce(`${enemy.name} 出现`);
    }
    if (!enemy.active) continue;

    enemy.invulnerable = Math.max(0, enemy.invulnerable - dt);
    enemy.cooldown -= dt;
    const toPlayer = player.position.clone().sub(enemy.position);
    toPlayer.y = 0;
    if (toPlayer.lengthSq() > 0.01) {
      enemy.group.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
      toPlayer.normalize();
    }

    const stopDistance = enemy.type.includes("Boss") ? 2.35 : 1.25;
    if (enemy.type !== "turret" && distance > stopDistance) {
      moveEnemyWithCollision(enemy, toPlayer, enemy.speed * dt);
      enemy.position.y = getGroundY(enemy.position.x, enemy.position.z);
    }

    if (enemy.cooldown <= 0) {
      if (enemy.type === "turret" || enemy.type === "racketMonster" || enemy.type === "gundamBoss") {
        shootEnemy(enemy);
      } else if (distance < (enemy.type.includes("Boss") ? 2.4 : 1.3)) {
        hurtPlayer(enemy.damage, enemy.name);
      }
      enemy.cooldown = enemy.type.includes("Boss") ? 0.8 : enemy.type === "turret" ? 0.7 : 1.2;
    }

    enemy.group.position.copy(enemy.position);
    enemy.group.position.y += Math.sin(performance.now() / 230 + enemy.position.x) * (enemy.type.includes("Boss") ? 0.045 : 0.035);
    enemy.group.rotation.z = Math.sin(performance.now() / 280 + enemy.position.z) * (enemy.type === "turret" ? 0 : 0.035);
  }
  if (!activeBoss && boss && boss.defeated) boss = null;
}

function moveEnemyWithCollision(enemy, direction, amount) {
  const radius = enemy.type.includes("Boss") ? 0.9 : 0.42;
  const height = enemy.type.includes("Boss") ? 2.35 : 1.45;
  const sideways = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
  const candidates = [
    direction,
    direction.clone().addScaledVector(sideways, 0.85).normalize(),
    direction.clone().addScaledVector(sideways, -0.85).normalize(),
    sideways,
    sideways.clone().multiplyScalar(-1),
  ];

  for (const candidate of candidates) {
    if (tryMoveEnemy(enemy, candidate, amount, radius, height)) return;
  }
}

function tryMoveEnemy(enemy, direction, amount, radius, height) {
  const nx = enemy.position.x + direction.x * amount;
  const nz = enemy.position.z + direction.z * amount;
  const groundY = getGroundY(nx, nz);
  const stepDelta = groundY - enemy.position.y;
  if (stepDelta > 1.1 || stepDelta < -2.2) return false;
  if (bodyCollides(nx, groundY + 0.03, nz, radius, height)) return false;
  enemy.position.x = nx;
  enemy.position.z = nz;
  enemy.position.y = groundY;
  return true;
}

function getActiveBoss() {
  return enemies.find((enemy) => enemy.active && enemy.type.includes("Boss") && !enemy.defeated);
}

function useSelectedTool() {
  const slot = TOOL_SLOTS[state.selectedSlot];
  if (slot.type === "weapon") {
    if (slot.id === "pistol") fireProjectile(false);
    else meleeAttack();
  } else if (slot.type === "tool") {
    mineTargetBlock();
  } else {
    mineTargetBlock();
  }
}

function meleeAttack() {
  const racket = SHOP_RACKETS[state.equippedRacket] || SHOP_RACKETS.starter;
  if (state.attackCooldown > 0) return;
  state.attackCooldown = racket.cooldown;
  const direction = getLookDirection();
  const origin = player.position.clone().add(new THREE.Vector3(0, 1.1, 0));
  let hit = null;
  let best = Math.max(racket.range + 1.2, 4.4);
  for (const enemy of enemies) {
    if (!enemy.active || enemy.defeated || enemy.invulnerable > 0) continue;
    const toEnemy = enemy.position.clone().add(new THREE.Vector3(0, 1, 0)).sub(origin);
    const distance = toEnemy.length();
    const angle = direction.angleTo(toEnemy.normalize());
    if (distance < best && angle < 1.2) {
      best = distance;
      hit = enemy;
    }
  }
  swingRacket();
  if (hit) damageEnemy(hit, getPlayerDamage(racket.damage), racket.shot);
  else mineTargetBlock();
}

function getPlayerDamage(base) {
  const barefoot = state.ownedAbilities.barefootPower && !state.shoesOn ? 1.4 : 1;
  const bareHands = state.equippedAbility === "bareHands" ? 1.25 : 1;
  return Math.max(1, Math.ceil(base * barefoot * bareHands));
}

function swingRacket() {
  const racket = player.group.getObjectByName("racket");
  if (!racket) return;
  const equipped = SHOP_RACKETS[state.equippedRacket] || SHOP_RACKETS.starter;
  racket.rotation.x = -0.95;
  racket.rotation.y = -0.28;
  racket.position.z = -0.32;
  spawnRacketTrail(equipped);
  setTimeout(() => {
    racket.rotation.x = 0;
    racket.rotation.y = 0;
    racket.position.z = 0;
  }, 130);
}

function spawnRacketTrail(racket) {
  const direction = getLookDirection();
  const origin = player.position.clone().add(new THREE.Vector3(0, 1.1, 0)).addScaledVector(direction, 1.35);
  const color =
    racket.trail === "ghostWind"
      ? [0x6bd6a0, 0x8edebb, 0xd7eadf][Math.floor(Math.random() * 3)]
      : racket.trail === "arc"
        ? 0xff3b45
        : racket.trail === "anta"
          ? 0xff3d8b
          : racket.frame2 || racket.color;
  spawnParticles(origin, color, 220, 5.4);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.62 * (racket.radius || 1), 0.018, 10, 54),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.78,
      roughness: 0.18,
    }),
  );
  ring.position.copy(origin);
  ring.lookAt(origin.clone().add(direction));
  scene.add(ring);
  particles.push({
    mesh: ring,
    velocity: direction.multiplyScalar(1.8),
    life: 0.28,
  });
}

function fireProjectile(forcePig) {
  if (state.shotCooldown > 0) return;
  if (!forcePig && state.weaponMode !== "pistol") return;
  state.shotCooldown = forcePig && state.ownedAbilities.pigCompanion ? 0.3 : 0.42;
  const direction = getLookDirection();
  const origin = player.position.clone().add(new THREE.Vector3(0, 1.1, 0)).addScaledVector(direction, 0.8);
  projectiles.push({
    position: origin,
    velocity: direction.multiplyScalar(forcePig && state.ownedAbilities.pigCompanion ? 18 : 15),
    life: 1.5,
    damage: forcePig && state.ownedAbilities.pigCompanion ? 3 : 2,
    source: "player",
    mesh: makeProjectile(forcePig && state.ownedAbilities.pigCompanion ? 0xff9fbe : 0x8ee5ff),
  });
  projectiles[projectiles.length - 1].mesh.position.copy(origin);
  scene.add(projectiles[projectiles.length - 1].mesh);
}

function makeProjectile(color) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 18, 12),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.72,
      roughness: 0.28,
      metalness: 0.08,
    }),
  );
  mesh.castShadow = true;
  return mesh;
}

function shootEnemy(enemy) {
  const direction = player.position.clone().add(new THREE.Vector3(0, 0.8, 0)).sub(enemy.position).normalize();
  const origin = enemy.position.clone().add(new THREE.Vector3(0, 0.9, 0)).addScaledVector(direction, 0.8);
  projectiles.push({
    position: origin,
    velocity: direction.multiplyScalar(enemy.type === "gundamBoss" ? 13 : 10),
    life: 2.2,
    damage: enemy.damage,
    source: "enemy",
    mesh: makeProjectile(enemy.type === "turret" ? 0xffcd6a : 0xb7ff7b),
  });
  projectiles[projectiles.length - 1].mesh.position.copy(origin);
  scene.add(projectiles[projectiles.length - 1].mesh);
}

function updateProjectiles(dt) {
  for (const shot of projectiles) {
    shot.life -= dt;
    shot.position.addScaledVector(shot.velocity, dt);
    shot.mesh.position.copy(shot.position);
    if (shot.source === "player") {
      for (const enemy of enemies) {
        if (!enemy.active || enemy.defeated || enemy.invulnerable > 0) continue;
        if (enemy.position.distanceTo(shot.position) < (enemy.type.includes("Boss") ? 1.4 : 0.8)) {
          damageEnemy(enemy, shot.damage, "Pistol Ready");
          shot.life = 0;
          break;
        }
      }
    } else if (player.position.distanceTo(shot.position) < 0.9) {
      if (shot.source === "lava") {
        state.lavaBurn = LAVA_BURN_DURATION;
        spawnParticles(player.position.clone().add(new THREE.Vector3(0, 1.0, 0)), 0xff3b1f, 240, 4.2);
        hurtPlayer(shot.damage, "火山熔岩");
      } else {
        hurtPlayer(shot.damage, "远程攻击");
      }
      shot.life = 0;
    }
  }
  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    if (projectiles[i].life <= 0) {
      scene.remove(projectiles[i].mesh);
      projectiles.splice(i, 1);
    }
  }
}

function updateItemDrops(dt) {
  for (const drop of itemDrops) {
    drop.life -= dt;
    const toPlayer = player.position.clone().add(new THREE.Vector3(0, 0.9, 0)).sub(drop.mesh.position);
    if (toPlayer.length() < 5.5) {
      drop.velocity.addScaledVector(toPlayer.normalize(), 20 * dt);
    }
    drop.velocity.y -= GRAVITY * 0.28 * dt;
    drop.mesh.position.addScaledVector(drop.velocity, dt);
    const groundY = getGroundY(drop.mesh.position.x, drop.mesh.position.z) + 0.28;
    if (drop.mesh.position.y < groundY) {
      drop.mesh.position.y = groundY;
      drop.velocity.y *= -0.22;
    }
    drop.mesh.rotation.x += dt * 4;
    drop.mesh.rotation.y += dt * 6;
    if (drop.mesh.position.distanceTo(player.position.clone().add(new THREE.Vector3(0, 0.85, 0))) < 0.9) {
      addInventory(drop.type, 1);
      spawnParticles(drop.mesh.position, BLOCKS[drop.type]?.color || 0xffffff, 45, 2.2);
      announce(`${BLOCKS[drop.type]?.name || "物品"} +1`);
      drop.life = 0;
    }
  }
  for (let i = itemDrops.length - 1; i >= 0; i -= 1) {
    if (itemDrops[i].life <= 0) {
      scene.remove(itemDrops[i].mesh);
      itemDrops.splice(i, 1);
    }
  }
}

function updateVolcanoes(dt) {
  if (state.lavaBurn > 0) {
    state.lavaBurn = Math.max(0, state.lavaBurn - dt);
    if (!hasCreativeBuildPower()) {
      state.lives -= LAVA_BURN_DPS * dt;
      if (state.lives <= 0) {
        state.lives = PLAYER_MAX_LIVES;
        state.shields = PLAYER_MAX_SHIELDS;
        player.position.set(0, highestBlockY(0, 0) + 0.05, 0);
        state.lavaBurn = 0;
        announce("被熔岩击倒，已在基地复活");
      }
    }
  }

  for (const volcano of volcanoes) {
    volcano.timer -= dt;
    volcano.erupting = Math.max(0, volcano.erupting - dt);
    if (volcano.timer > 0) continue;
    volcano.timer = VOLCANO_ERUPTION_INTERVAL;
    volcano.erupting = 3.2;
    eruptVolcano(volcano);
  }
}

function eruptVolcano(volcano) {
  const craterY = terrainHeight(volcano.x, volcano.z) + 2.2;
  const origin = new THREE.Vector3(volcano.x, craterY, volcano.z);
  const distanceToPlayer = origin.distanceTo(player.position);
  if (distanceToPlayer > 240) return;
  spawnParticles(origin, 0xff3b1f, 900, 7);
  spawnParticles(origin.clone().add(new THREE.Vector3(0, 1.2, 0)), 0xffd166, 520, 5.6);

  const toPlayer = player.position.clone().add(new THREE.Vector3(0, 1.1, 0)).sub(origin);
  const nearPlayer = toPlayer.length() < 180;
  const shots = nearPlayer ? 7 : 3;
  for (let i = 0; i < shots; i += 1) {
    const spread = new THREE.Vector3((Math.random() - 0.5) * 0.55, Math.random() * 0.55, (Math.random() - 0.5) * 0.55);
    const direction = nearPlayer
      ? toPlayer.clone().normalize().add(spread).normalize()
      : new THREE.Vector3(Math.random() - 0.5, 0.75, Math.random() - 0.5).normalize();
    const mesh = makeProjectile(0xff4a1f);
    mesh.scale.setScalar(2.4);
    mesh.add(new THREE.PointLight(0xff531f, 2.8, 8));
    projectiles.push({
      position: origin.clone(),
      velocity: direction.multiplyScalar(13 + Math.random() * 6),
      life: 7,
      damage: 2,
      source: "lava",
      mesh,
    });
    mesh.position.copy(origin);
    scene.add(mesh);
  }
  announce("火山喷发！");
}

function damageEnemy(enemy, amount, label) {
  enemy.hp -= amount;
  enemy.invulnerable = 0.18;
  spawnParticles(enemy.position.clone().add(new THREE.Vector3(0, 1, 0)), 0xff6f72);
  announce(`${label} -${amount}`);
  if (enemy.hp <= 0) {
    enemy.defeated = true;
    scene.remove(enemy.group);
    state.stars += enemy.type.includes("Boss") ? 500 : enemy.type === "turret" ? 30 : 20;
    if (enemy.type === "zombieBoss") summonPack(enemy.position, "zombie");
    if (enemy.type === "rabbitBoss") summonPack(enemy.position, "racketMonster");
    announce(`${enemy.name} 已击败`);
  }
}

function summonPack(origin, type) {
  for (let i = 0; i < 3; i += 1) {
    const enemy = spawnEnemy(type, origin.x + i - 1, origin.z + 2);
    enemy.active = true;
  }
}

function hurtPlayer(amount, source) {
  if (hasCreativeBuildPower()) return;
  if (state.invulnerable > 0) return;
  state.invulnerable = 0.75;
  if (state.shields > 0) {
    state.shields -= 1;
    announce(`护盾挡下 ${source}`);
    return;
  }
  state.lives -= amount;
  announce(`${source} 造成伤害`);
  if (state.lives <= 0) {
    state.lives = PLAYER_MAX_LIVES;
    state.shields = PLAYER_MAX_SHIELDS;
    player.position.set(0, highestBlockY(0, 0) + 0.05, 0);
    announce("已在基地复活");
  }
}

function mineTargetBlock() {
  const hit = raycastBlock();
  if (!hit) return;
  if (hit.distance > getInteractRange()) {
    announce("距离太远");
    return;
  }
  removeBlock(hit.object);
}

function placeSelectedBlock() {
  const slot = TOOL_SLOTS[state.selectedSlot];
  if (slot.type !== "block") return;
  if (!hasCreativeBuildPower() && (state.inventory[slot.id] || 0) <= 0) {
    announce("背包没有这个方块");
    return;
  }
  const hit = raycastBlock();
  if (!hit || hit.distance > getInteractRange()) return;
  const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).round();
  const pos = hit.object.position.clone().add(normal);
  const x = Math.round(pos.x);
  const y = Math.round(pos.y - 0.5);
  const z = Math.round(pos.z);
  if (!hasCreativeBuildPower() && blockOverlapsPlayer(x, y, z)) {
    announce("不能把方块放进身体里");
    return;
  }
  if (addBlock(x, y, z, slot.id, true, false, true)) {
    if (!hasCreativeBuildPower()) state.inventory[slot.id] -= 1;
    announce(`${BLOCKS[slot.id].name}已放置`);
  }
}

function getInteractRange() {
  return hasCreativeBuildPower() ? CREATIVE_INTERACT_RANGE : INTERACT_RANGE;
}

function blockOverlapsPlayer(x, y, z) {
  return (
    player.position.x + PLAYER_RADIUS > x - 0.5 &&
    player.position.x - PLAYER_RADIUS < x + 0.5 &&
    player.position.y + PLAYER_HEIGHT > y &&
    player.position.y + 0.08 < y + 1 &&
    player.position.z + PLAYER_RADIUS > z - 0.5 &&
    player.position.z - PLAYER_RADIUS < z + 0.5
  );
}

function raycastBlock() {
  const aimPoint = state.cameraMode === "first" ? new THREE.Vector2(0, 0) : pointer;
  raycaster.setFromCamera(aimPoint, camera);
  const hits = raycaster.intersectObjects(blockMeshes.children, false);
  return hits[0] || null;
}

function getLookDirection() {
  const pitchStrength = state.cameraMode === "first" ? 1 : 0.35;
  return new THREE.Vector3(
    Math.sin(state.yaw),
    Math.sin(-state.pitch) * pitchStrength,
    Math.cos(state.yaw),
  ).normalize();
}

function updateCamera() {
  player.group.visible = state.cameraMode !== "first";
  if (state.cameraMode === "first") {
    const eye = player.position.clone().add(new THREE.Vector3(0, 1.55, 0));
    const direction = new THREE.Vector3(Math.sin(state.yaw), Math.sin(-state.pitch), Math.cos(state.yaw)).normalize();
    camera.position.copy(eye);
    camera.lookAt(eye.clone().add(direction));
    return;
  }

  const cameraOffset = new THREE.Vector3(
    -Math.sin(state.yaw) * 7,
    4.3 + Math.sin(-state.pitch) * 2.4,
    -Math.cos(state.yaw) * 7,
  );
  camera.position.copy(player.position).add(cameraOffset);
  camera.lookAt(player.position.x, player.position.y + 1.25, player.position.z);
}

function render() {
  const activeBoss = getActiveBoss();
  if (activeBoss) {
    bossHud.classList.remove("is-hidden");
    bossName.textContent = activeBoss.name;
    bossHpText.textContent = `${Math.max(0, activeBoss.hp)}/${activeBoss.maxHp}`;
    bossHpBar.style.width = `${Math.max(0, activeBoss.hp / activeBoss.maxHp) * 100}%`;
  } else {
    bossHud.classList.add("is-hidden");
  }
  renderer.render(scene, camera);
}

function spawnParticles(position, color, count = 14, force = 1) {
  const total = Math.min(1500, Math.max(1, Math.ceil(count * EPIC_EFFECT_MULTIPLIER)));
  const boostedForce = force * 1.8;
  for (let i = 0; i < total; i += 1) {
    const size = 0.045 + Math.random() * 0.075;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.18,
        roughness: 0.52,
      }),
    );
    mesh.position.copy(position);
    scene.add(mesh);
    particles.push({
      mesh,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 3.8 * boostedForce,
        (0.6 + Math.random() * 3.2) * boostedForce,
        (Math.random() - 0.5) * 3.8 * boostedForce,
      ),
      life: 0.38 + Math.random() * 0.36,
    });
  }
}

function updateParticles(dt) {
  for (const particle of particles) {
    particle.life -= dt;
    particle.velocity.y -= 6 * dt;
    particle.mesh.position.addScaledVector(particle.velocity, dt);
    particle.mesh.rotation.x += dt * 7;
    particle.mesh.rotation.y += dt * 5;
  }
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    if (particles[i].life <= 0) {
      scene.remove(particles[i].mesh);
      particles.splice(i, 1);
    }
  }
}

function addInventory(type, amount) {
  if (!state.inventory[type]) state.inventory[type] = 0;
  state.inventory[type] += amount;
}

function updateMinimap() {
  if (!minimapCtx || !minimapCanvas) return;
  const size = minimapCanvas.width;
  const halfView = 92;
  minimapCtx.clearRect(0, 0, size, size);
  minimapCtx.fillStyle = "#153326";
  minimapCtx.fillRect(0, 0, size, size);

  for (let px = 0; px < size; px += 2) {
    for (let py = 0; py < size; py += 2) {
      const wx = Math.round(player.position.x + ((px / size) * 2 - 1) * halfView);
      const wz = Math.round(player.position.z + ((py / size) * 2 - 1) * halfView);
      const volcano = getVolcanoAt(wx, wz);
      const h = terrainHeight(wx, wz);
      minimapCtx.fillStyle = volcano ? "#75321f" : h > 5 ? "#5f7f57" : "#6ea663";
      minimapCtx.fillRect(px, py, 2, 2);
    }
  }

  minimapCtx.strokeStyle = "rgba(255, 248, 216, 0.55)";
  minimapCtx.lineWidth = 2;
  minimapCtx.strokeRect(1, 1, size - 2, size - 2);

  for (const volcano of volcanoes) {
    const x = size / 2 + ((volcano.x - player.position.x) / halfView) * (size / 2);
    const y = size / 2 + ((volcano.z - player.position.z) / halfView) * (size / 2);
    if (x < 0 || x > size || y < 0 || y > size) continue;
    minimapCtx.fillStyle = volcano.erupting > 0 ? "#ff3b1f" : "#d35c4a";
    minimapCtx.beginPath();
    minimapCtx.arc(x, y, volcano.erupting > 0 ? 5 : 3, 0, Math.PI * 2);
    minimapCtx.fill();
  }

  for (const enemy of enemies) {
    if (!enemy.active || enemy.defeated) continue;
    const x = size / 2 + ((enemy.position.x - player.position.x) / halfView) * (size / 2);
    const y = size / 2 + ((enemy.position.z - player.position.z) / halfView) * (size / 2);
    if (x < 0 || x > size || y < 0 || y > size) continue;
    minimapCtx.fillStyle = enemy.type.includes("Boss") ? "#ff4d57" : "#ffe66a";
    minimapCtx.fillRect(x - 2, y - 2, 4, 4);
  }

  minimapCtx.save();
  minimapCtx.translate(size / 2, size / 2);
  minimapCtx.rotate(-state.yaw);
  minimapCtx.fillStyle = "#8ee5ff";
  minimapCtx.beginPath();
  minimapCtx.moveTo(0, -7);
  minimapCtx.lineTo(5, 6);
  minimapCtx.lineTo(0, 3);
  minimapCtx.lineTo(-5, 6);
  minimapCtx.closePath();
  minimapCtx.fill();
  minimapCtx.restore();
}

function updateUI() {
  lifeValue.textContent = Number.isInteger(state.lives) ? state.lives.toString() : state.lives.toFixed(1);
  shieldValue.textContent = state.shields.toString();
  starValue.textContent = state.stars.toString();
  shopStars.textContent = state.stars.toString();
  modeButton.textContent = state.mode === "creative" ? "创造" : "生存";
  weaponValue.textContent = state.weaponMode === "pistol" ? "手枪/伙伴" : SHOP_RACKETS[state.equippedRacket].name;
  if (cameraValue) cameraValue.textContent = state.cameraMode === "first" ? "第一" : "第三";
  const activeBoss = getActiveBoss();
  bossValue.textContent = activeBoss ? activeBoss.name : "未激活";

  for (const id of Object.keys(BLOCKS)) {
    const node = document.querySelector(`[data-count="${id}"]`);
    if (node) node.textContent = hasCreativeBuildPower() ? "∞" : String(state.inventory[id] || 0);
  }
  Array.from(toolbelt.children).forEach((button, index) => {
    const slot = TOOL_SLOTS[index];
    button.classList.toggle("is-selected", index === state.selectedSlot);
    const count = button.querySelector(".tool-count");
    count.textContent = slot.type === "block" ? (hasCreativeBuildPower() ? "∞" : String(state.inventory[slot.id] || 0)) : "";
  });
}

function announce(message) {
  messageFeed.textContent = message;
  messageFeed.classList.add("is-visible");
  state.messageTimer = 1.8;
}

function saveGame(showMessage) {
  const placedBlocks = [];
  for (const mesh of blocks.values()) {
    if (mesh.userData.natural) continue;
    const { x, y, z, type } = mesh.userData;
    placedBlocks.push([x, y, z, type]);
  }
  const payload = {
    stars: state.stars,
    mode: state.mode,
    lives: state.lives,
    shields: state.shields,
    selectedSlot: state.selectedSlot,
    equippedSkin: state.equippedSkin,
    equippedRacket: state.equippedRacket,
    equippedAbility: state.equippedAbility,
    shoesOn: state.shoesOn,
    weaponMode: state.weaponMode,
    cameraMode: state.cameraMode,
    inventory: state.inventory,
    ownedSkins: state.ownedSkins,
    ownedRackets: state.ownedRackets,
    ownedAbilities: state.ownedAbilities,
    player: player.position.toArray(),
    blocks: placedBlocks,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  if (showMessage) announce("世界已保存");
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      announce("新 3D 生存世界已生成");
      return;
    }
    const save = JSON.parse(raw);
    Object.assign(state, {
      stars: save.stars || 0,
      mode: save.mode === "creative" ? "creative" : "survival",
      lives: PLAYER_MAX_LIVES,
      shields: save.shields || 0,
      selectedSlot: save.selectedSlot || 0,
      equippedSkin: save.equippedSkin || "bear",
      equippedRacket: save.equippedRacket || "starter",
      equippedAbility: save.equippedAbility || "none",
      shoesOn: Boolean(save.shoesOn),
      weaponMode: save.weaponMode || "racket",
      cameraMode: save.cameraMode === "first" ? "first" : "third",
      inventory: { ...state.inventory, ...(save.inventory || {}) },
      ownedSkins: { bear: true, ...(save.ownedSkins || {}) },
      ownedRackets: { starter: true, ...(save.ownedRackets || {}) },
      ownedAbilities: { pigCompanion: true, ...(save.ownedAbilities || {}) },
    });
    if (Array.isArray(save.player)) player.position.fromArray(save.player);
    if (Array.isArray(save.blocks)) {
      for (const [x, y, z, type] of save.blocks.slice(0, 1200)) {
        addBlock(x, y, z, type, false, false, true);
      }
    }
    rebuildPlayerModel();
    player.group.visible = state.cameraMode !== "first";
    announce("已读取上次 3D 生存世界");
  } catch {
    announce("存档读取失败，已进入新世界");
  }
}

function resetGame() {
  if (!window.confirm("重开会清除当前 3D 生存存档，确定吗？")) return;
  localStorage.removeItem(SAVE_KEY);
  window.location.reload();
}

function spinWheel() {
  if (state.stars < 7777) {
    announce("星星不够抽奖");
    return;
  }
  state.stars -= 7777;
  const roll = Math.random();
  if (roll < 0.001) {
    state.inventory.lamp += 10;
    announce("超稀有：背景灯组 +10");
  } else if (roll < 0.02) {
    state.ownedAbilities.pigCompanion = true;
    announce("抽到小猪伙伴");
  } else {
    const lockedSkin = Object.keys(SHOP_SKINS).find((id) => !state.ownedSkins[id]);
    if (lockedSkin) {
      state.ownedSkins[lockedSkin] = true;
      announce(`抽到 ${SHOP_SKINS[lockedSkin].name}`);
    } else {
      state.stars += 1;
      announce("重复奖励转成 1 星星");
    }
  }
  renderShop();
  updateUI();
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
