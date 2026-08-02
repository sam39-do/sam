import * as THREE from "./vendor-three.mjs";

const canvas = document.getElementById("gameCanvas");
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

const SAVE_KEY = "bear3dSurvivalSandboxV2";
const WORLD_SIZE = 72;
const HALF_WORLD = WORLD_SIZE / 2;
const PLAYER_MAX_LIVES = 15;
const PLAYER_MAX_SHIELDS = 3;
const PLAYER_RADIUS = 0.36;
const PLAYER_HEIGHT = 1.85;
const INTERACT_RANGE = 8;
const CREATIVE_INTERACT_RANGE = 18;
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
    damage: 1,
    range: 2.8,
    cooldown: 0.42,
    color: 0x4cc4dc,
    shot: "Basic Smash",
  },
  victor100x: {
    name: "Auraspeed 100X Ultra",
    price: 100000,
    damage: 4,
    range: 4.2,
    cooldown: 0.24,
    color: 0x6bd6a0,
    shot: "Ghost Wind Cage",
  },
  arcsaber7tour: {
    name: "Yonex Arcsaber 7 Tour",
    price: 1000,
    damage: 2,
    range: 3.2,
    cooldown: 0.34,
    color: 0xd9343e,
    shot: "Arc Smash",
  },
  nanoflare700game: {
    name: "Yonex Nanoflare 700 Game",
    price: 1000,
    damage: 2,
    range: 3.6,
    cooldown: 0.28,
    color: 0x56d3ff,
    shot: "Flash Chain",
  },
  antaDingyin1000: {
    name: "Anta Dingyin 1000",
    price: 10000,
    damage: 3,
    range: 3.7,
    cooldown: 0.3,
    color: 0x41ead4,
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
scene.background = new THREE.Color(0x6db8d2);
scene.fog = new THREE.Fog(0x6db8d2, 54, 150);

const camera = new THREE.PerspectiveCamera(62, 16 / 9, 0.1, 220);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const hemi = new THREE.HemisphereLight(0xdff7ff, 0x30402c, 1.8);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff0c2, 2.2);
sun.position.set(12, 22, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -35;
sun.shadow.camera.right = 35;
sun.shadow.camera.top = 35;
sun.shadow.camera.bottom = -35;
scene.add(sun);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
const blockMaterials = new Map();
const blocks = new Map();
const blockMeshes = new THREE.Group();
const enemies = [];
const projectiles = [];
const particles = [];
let boss = null;

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
  resize();
  updateUI();
  renderer.setAnimationLoop(loop);
}

function setupWorld() {
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshStandardMaterial({ color: 0x4f9db3, roughness: 0.7, metalness: 0.05 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.08;
  water.receiveShadow = true;
  scene.add(water);

  for (let x = -HALF_WORLD; x < HALF_WORLD; x += 1) {
    for (let z = -HALF_WORLD; z < HALF_WORLD; z += 1) {
      const height = terrainHeight(x, z);
      for (let y = 0; y <= height; y += 1) {
        const type = y === height ? "grass" : y > height - 2 ? "dirt" : "stone";
        addBlock(x, y, z, type, false);
      }
    }
  }

  for (const tree of [
    [-22, -18],
    [-16, 18],
    [-8, -7],
    [-5, 7],
    [6, -8],
    [10, 4],
    [18, -20],
    [22, 16],
    [-28, 9],
    [28, -4],
  ]) {
    addTree(tree[0], tree[1]);
  }

  addBlock(2, 3, 3, "lamp", true);
  addBlock(-2, 2, -3, "wood", true);
}

function terrainHeight(x, z) {
  const wave = Math.sin(x * 0.5) + Math.cos(z * 0.46) + Math.sin((x + z) * 0.22);
  return Math.max(0, Math.floor(1 + wave * 0.55));
}

function addTree(x, z) {
  const baseY = terrainHeight(x, z) + 1;
  for (let y = 0; y < 4; y += 1) addBlock(x, baseY + y, z, "wood", false);
  for (let ox = -2; ox <= 2; ox += 1) {
    for (let oz = -2; oz <= 2; oz += 1) {
      for (let oy = 0; oy <= 2; oy += 1) {
        if (Math.abs(ox) + Math.abs(oz) + oy < 5) addBlock(x + ox, baseY + 3 + oy, z + oz, "grass", false);
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

function addBlock(x, y, z, type, sparkle = true) {
  const key = keyFor(x, y, z);
  if (blocks.has(key)) return false;
  const mesh = new THREE.Mesh(blockGeometry, getBlockMaterial(type));
  mesh.position.set(x, y + 0.5, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = { kind: "block", type, x, y, z };
  blockMeshes.add(mesh);
  blocks.set(key, mesh);

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
  blockMeshes.remove(mesh);
  blocks.delete(keyFor(x, y, z));
  addInventory(type, 1);
  spawnParticles(mesh.position, BLOCKS[type]?.color || 0xffffff);
  announce(`${BLOCKS[type]?.name || "方块"} +1`);
  return true;
}

function highestBlockY(x, z) {
  let top = 0;
  for (let y = 0; y < 12; y += 1) {
    if (blocks.has(keyFor(x, y, z))) top = y + 1;
  }
  return top;
}

function setupPlayerModel() {
  scene.add(player.group);
  rebuildPlayerModel();
}

function rebuildPlayerModel() {
  player.group.clear();
  const skin = SHOP_SKINS[state.equippedSkin] || SHOP_SKINS.bear;
  const bodyMat = mat(skin.body, 0.76);
  const shirtMat = mat(skin.shirt, 0.7);
  const darkMat = mat(0x1b2528, 0.82);
  const faceMat = mat(0xf0c692, 0.62);

  const body = box(0.72, 0.9, 0.42, shirtMat, 0, 0.78, 0);
  const head = sphere(0.42, bodyMat, 0, 1.45, 0);
  const face = sphere(0.29, faceMat, 0, 1.4, -0.3);
  const earL = sphere(0.15, bodyMat, -0.29, 1.8, -0.04);
  const earR = sphere(0.15, bodyMat, 0.29, 1.8, -0.04);
  const legL = box(0.18, 0.56, 0.2, darkMat, -0.18, 0.18, 0);
  const legR = box(0.18, 0.56, 0.2, darkMat, 0.18, 0.18, 0);
  const armL = box(0.16, 0.58, 0.18, bodyMat, -0.48, 0.82, 0);
  const armR = box(0.16, 0.58, 0.18, bodyMat, 0.48, 0.82, 0);
  armR.rotation.z = -0.52;
  armL.rotation.z = 0.26;
  player.group.add(body, head, face, earL, earR, legL, legR, armL, armR);

  if (state.equippedSkin === "gundam") {
    player.group.add(box(0.84, 0.18, 0.5, mat(0xe8eef4), 0, 1.22, 0));
    player.group.add(box(0.1, 0.52, 0.14, mat(0xf0c64a), -0.36, 0.74, 0));
    player.group.add(box(0.1, 0.52, 0.14, mat(0xd9343e), 0.36, 0.74, 0));
  }

  const racket = SHOP_RACKETS[state.equippedRacket] || SHOP_RACKETS.starter;
  const racketGroup = new THREE.Group();
  racketGroup.name = "racket";
  const handle = cyl(0.04, 0.04, 0.86, mat(0x2b2420), 0.58, 0.72, -0.38);
  handle.rotation.x = 0.86;
  const frame = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.024, 10, 28),
    mat(racket.color, 0.38, 0.08),
  );
  frame.position.set(0.78, 1.02, -0.62);
  frame.rotation.x = 0.92;
  frame.rotation.z = 0.22;
  racketGroup.add(handle, frame);
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
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cyl(r1, r2, h, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 16), material);
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
  const enemy = {
    type,
    name: getEnemyName(type),
    position: new THREE.Vector3(x, highestBlockY(Math.round(x), Math.round(z)), z),
    velocity: new THREE.Vector3(),
    hp: type.includes("Boss") ? (type === "gundamBoss" ? 70 : 48) : type === "turret" ? 8 : 6,
    maxHp: type.includes("Boss") ? (type === "gundamBoss" ? 70 : 48) : type === "turret" ? 8 : 6,
    damage: type.includes("Boss") ? 2 : 1,
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
  if (type === "zombie") {
    group.add(box(0.75, 1, 0.45, mat(0x6aa05c), 0, 0.62, 0));
    group.add(sphere(0.36, mat(0xaed982), 0, 1.32, 0));
    group.add(box(0.18, 0.5, 0.16, mat(0x1f3f3b), -0.18, 0.18, 0));
    group.add(box(0.18, 0.5, 0.16, mat(0x1f3f3b), 0.18, 0.18, 0));
  } else if (type === "racketMonster") {
    group.add(box(0.74, 0.9, 0.44, mat(0xd99058), 0, 0.68, 0));
    group.add(sphere(0.4, mat(0xd99058), 0, 1.38, 0));
    group.add(sphere(0.14, mat(0xd99058), -0.28, 1.72, 0));
    group.add(sphere(0.14, mat(0xd99058), 0.28, 1.72, 0));
    const racket = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 8, 24), mat(0xff3d8b));
    racket.position.set(0.58, 1.02, -0.38);
    racket.rotation.x = 1.1;
    group.add(racket);
  } else if (type === "turret") {
    group.add(cyl(0.42, 0.5, 0.42, mat(0x4b6760), 0, 0.22, 0));
    const barrel = box(0.22, 0.22, 1.2, mat(0x26303a, 0.42, 0.3), 0, 0.55, -0.48);
    group.add(barrel);
    group.add(sphere(0.16, mat(0xffcd6a), 0, 0.55, -1.08));
  } else if (type === "rabbitBoss") {
    group.add(box(1.35, 1.65, 0.8, mat(0xb7e85a), 0, 0.95, 0));
    group.add(sphere(0.62, mat(0xcdf06e), 0, 1.9, 0));
    group.add(cyl(0.11, 0.16, 1.1, mat(0xcdf06e), -0.34, 2.48, 0));
    group.add(cyl(0.11, 0.16, 1.1, mat(0xcdf06e), 0.34, 2.48, 0));
  } else if (type === "zombieBoss") {
    group.add(box(1.35, 1.85, 0.9, mat(0x3f744e), 0, 1.04, 0));
    group.add(sphere(0.66, mat(0x78ff79), 0, 2.06, 0));
    group.add(box(1.7, 0.18, 0.18, mat(0x1f3f3b), 0, 1.42, -0.42));
  } else {
    group.add(box(1.5, 1.95, 1, mat(0xe8eef4, 0.44, 0.25), 0, 1.05, 0));
    group.add(box(1.1, 0.75, 1.08, mat(0x17438d, 0.42, 0.22), 0, 2.3, 0));
    group.add(box(0.22, 1.2, 0.28, mat(0xd9343e), -0.9, 1.2, 0));
    group.add(box(0.22, 1.2, 0.28, mat(0xf0c64a), 0.9, 1.2, 0));
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
  else if (event.code === "Space") input.jump = pressed;
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
  announce(state.mode === "creative" ? "创造模式：无限方块、飞行、无伤害" : "生存模式：怪物和 Boss 会攻击");
  updateUI();
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
    updatePlayer(dt);
    updateEnemies(dt);
    updateProjectiles(dt);
    if (input.mouseDown) useSelectedTool();
  }
  state.attackCooldown = Math.max(0, state.attackCooldown - dt);
  state.shotCooldown = Math.max(0, state.shotCooldown - dt);
  state.invulnerable = Math.max(0, state.invulnerable - dt);
  updateParticles(dt);
  updateCamera();
  updateUI();
  if (state.messageTimer > 0) {
    state.messageTimer -= dt;
    if (state.messageTimer <= 0) messageFeed.classList.remove("is-visible");
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
  const modeBoost = state.mode === "creative" ? 1.4 : 1;
  player.velocity.x = move.x * player.speed * speedBoost * sprintBoost * modeBoost;
  player.velocity.z = move.z * player.speed * speedBoost * sprintBoost * modeBoost;
  player.velocity.y -= state.mode === "creative" ? 0 : 18 * dt;

  const groundY = getGroundY(player.position.x, player.position.z) + 0.03;
  if (state.mode === "creative") {
    if (input.jump) player.velocity.y = 5.5;
    else if (input.sprint) player.velocity.y = -5.5;
    else player.velocity.y = 0;
  } else if (player.position.y <= groundY + 0.01) {
    player.position.y = groundY;
    player.velocity.y = Math.max(0, player.velocity.y);
    if (input.jump) player.velocity.y = state.ownedAbilities.jumpSmash ? 9 : 7.2;
  }

  movePlayerWithCollision(dt);
  player.position.x = THREE.MathUtils.clamp(player.position.x, -HALF_WORLD + 1, HALF_WORLD - 1);
  player.position.z = THREE.MathUtils.clamp(player.position.z, -HALF_WORLD + 1, HALF_WORLD - 1);
  player.group.position.copy(player.position);
  player.group.rotation.y = state.yaw;
}

function movePlayerWithCollision(dt) {
  const nextX = player.position.x + player.velocity.x * dt;
  if (state.mode === "creative" || !bodyCollides(nextX, player.position.y, player.position.z, PLAYER_RADIUS)) {
    player.position.x = nextX;
  } else {
    player.velocity.x = 0;
  }

  const nextZ = player.position.z + player.velocity.z * dt;
  if (state.mode === "creative" || !bodyCollides(player.position.x, player.position.y, nextZ, PLAYER_RADIUS)) {
    player.position.z = nextZ;
  } else {
    player.velocity.z = 0;
  }

  const nextY = player.position.y + player.velocity.y * dt;
  if (state.mode === "creative" || !bodyCollides(player.position.x, nextY, player.position.z, PLAYER_RADIUS)) {
    player.position.y = nextY;
  } else if (player.velocity.y > 0) {
    player.velocity.y = 0;
  }

  if (state.mode !== "creative") {
    const groundY = getGroundY(player.position.x, player.position.z) + 0.03;
    if (player.position.y < groundY) {
      player.position.y = groundY;
      player.velocity.y = 0;
    }
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
    if (enemy.type.includes("Boss") && !enemy.active && distance < 10) {
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

    if (enemy.type !== "turret" && distance > 1.5) {
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
    enemy.group.position.y += Math.sin(performance.now() / 260 + enemy.position.x) * 0.03;
  }
  if (!activeBoss && boss && boss.defeated) boss = null;
}

function moveEnemyWithCollision(enemy, direction, amount) {
  const radius = enemy.type.includes("Boss") ? 0.9 : 0.42;
  const nextX = enemy.position.x + direction.x * amount;
  if (!bodyCollides(nextX, enemy.position.y, enemy.position.z, radius, enemy.type.includes("Boss") ? 2.4 : 1.5)) {
    enemy.position.x = nextX;
  }
  const nextZ = enemy.position.z + direction.z * amount;
  if (!bodyCollides(enemy.position.x, enemy.position.y, nextZ, radius, enemy.type.includes("Boss") ? 2.4 : 1.5)) {
    enemy.position.z = nextZ;
  }
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
    placeSelectedBlock();
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
  racket.rotation.z = -0.8;
  setTimeout(() => {
    racket.rotation.z = 0;
  }, 110);
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
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), mat(color, 0.35, 0.15));
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
      hurtPlayer(shot.damage, "远程攻击");
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
  if (state.mode === "creative") return;
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
  if (state.mode !== "creative" && (state.inventory[slot.id] || 0) <= 0) {
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
  if (state.mode !== "creative" && blockOverlapsPlayer(x, y, z)) {
    announce("不能把方块放进身体里");
    return;
  }
  if (addBlock(x, y, z, slot.id, true)) {
    if (state.mode !== "creative") state.inventory[slot.id] -= 1;
    announce(`${BLOCKS[slot.id].name}已放置`);
  }
}

function getInteractRange() {
  return state.mode === "creative" ? CREATIVE_INTERACT_RANGE : INTERACT_RANGE;
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

function spawnParticles(position, color) {
  for (let i = 0; i < 9; i += 1) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), mat(color));
    mesh.position.copy(position);
    scene.add(mesh);
    particles.push({
      mesh,
      velocity: new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 3, (Math.random() - 0.5) * 3),
      life: 0.55,
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

function updateUI() {
  lifeValue.textContent = state.lives.toString();
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
    if (node) node.textContent = state.mode === "creative" ? "∞" : String(state.inventory[id] || 0);
  }
  Array.from(toolbelt.children).forEach((button, index) => {
    const slot = TOOL_SLOTS[index];
    button.classList.toggle("is-selected", index === state.selectedSlot);
    const count = button.querySelector(".tool-count");
    count.textContent = slot.type === "block" ? (state.mode === "creative" ? "∞" : String(state.inventory[slot.id] || 0)) : "";
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
      lives: save.lives || PLAYER_MAX_LIVES,
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
