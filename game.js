const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let renderScale = 1;
const scoreLabel = document.getElementById("score");
const livesLabel = document.getElementById("lives");
const shieldsLabel = document.getElementById("shields");
const timerLabel = document.getElementById("timer");
const startPanel = document.getElementById("startPanel");
const startButton = document.getElementById("startButton");
const panelTitle = startPanel.querySelector("h1");
const gameStage = document.querySelector(".game-stage");
const shopPanel = document.getElementById("shopPanel");
const shopStarsLabel = document.getElementById("shopStars");
const levelSelect = document.getElementById("levelSelect");
const levelButtons = Array.from(document.querySelectorAll(".level-button"));
const buySkinButtons = Array.from(document.querySelectorAll(".buy-skin-button"));
const equipSkinButtons = Array.from(document.querySelectorAll(".equip-skin-button"));
const buyRacketButtons = Array.from(document.querySelectorAll(".buy-racket-button"));
const equipRacketButtons = Array.from(document.querySelectorAll(".equip-racket-button"));
const buyBackgroundButtons = Array.from(document.querySelectorAll(".buy-background-button"));
const equipBackgroundButtons = Array.from(document.querySelectorAll(".equip-background-button"));
const buyGearButtons = Array.from(document.querySelectorAll(".buy-gear-button"));
const equipGearButtons = Array.from(document.querySelectorAll(".equip-gear-button"));
const buyPerkButtons = Array.from(document.querySelectorAll(".buy-perk-button"));
const equipPerkButtons = Array.from(document.querySelectorAll(".equip-perk-button"));
const buyAbilityButtons = Array.from(document.querySelectorAll(".buy-ability-button"));
const equipAbilityButtons = Array.from(document.querySelectorAll(".equip-ability-button"));
const shopTokensLabel = document.getElementById("shopTokens");
const wheelResultLabel = document.getElementById("wheelResult");
const spinWheelButton = document.getElementById("spinWheelButton");
const redeemSkinButton = document.getElementById("redeemSkinButton");
const redeemBackgroundButton = document.getElementById("redeemBackgroundButton");

const VIEW_WIDTH = 1500;
const VIEW_HEIGHT = 500;
const WORLD_WIDTH = 121200;
const GROUND_Y = 430;
const BOSS_ARENA_X = 14900;
const SECOND_BOSS_X = 33200;
const FINAL_BOSS_X = 52200;
const MACHINE_GUN_STAGE_X = 57400;
const GRAVITY = 2450;
const MOVE_SPEED = 410;
const MOVE_ACCEL = 2800;
const FRICTION = 3300;
const JUMP_SPEED = 925;
const PLAYER_MAX_LIVES = 15;
const PLAYER_MAX_SHIELDS = 3;
const TRIPLE_JUMP_CHANCE = 0.2;
const POND_DAMAGE_INTERVAL = 1;
const TRUE_DAMAGE_CHANCE = 0.16;
const EXECUTE_NORMAL_COOLDOWN = 1;
const EXECUTE_BOSS_COOLDOWN = 1;
const STOMP_HEAL_COOLDOWN = 1.8;
const ENEMY_DAMAGE_MULTIPLIER = 1.2;
const KILL_PASSIVE_REQUIRED_STACKS = 3;
const KILL_PASSIVE_DURATION = 15;
const KILL_PASSIVE_COOLDOWN = 30;
const MAX_RENDER_SCALE = 2.5;
const CINEMA_GRAIN_COUNT = 36;
const INK_AFTERIMAGE_PALETTE = [
  "#1f3f3b",
  "#3f6f63",
  "#7cae9d",
  "#9bb8c7",
  "#d6c58f",
  "#b86f67",
  "#f2eee4",
];
const EPIC_EFFECT_MULTIPLIER = 1.45;
const GHOST_WIND_COLORS = ["#6bd6a0", "#8edebb", "#b7d8c7", "#d7eadf", "#5fb68b", "#eff8f1"];
const BOSS_MAX_HEALTH = 18;
const MECH_MAX_HEALTH = 40;
const BOSS_RAGE_THRESHOLD = 0.5;
const BOSS_RAGE_DURATION = 12;
const SAVE_KEY = "bearHeartAdventureSaveV2";
const STOMP_STAR_REWARD = 5;
const WHEEL_COST = 7777;
const USD_TO_STARS = 10000;
const SHOP_BACKGROUNDS = {
  badmintonCourt: { name: "Olympic Court Background", priceUsd: 1, authorFree: true },
  judoDojo: { name: "Championship Judo Dojo Background", priceUsd: 1, authorFree: true },
  skyClouds: { name: "Blue Sky Clouds Background", priceUsd: 1, authorFree: true },
  livingJungle: { name: "Living Jungle Background", priceUsd: 1, authorFree: true },
};
const SHOP_GEAR = {
  victorP9200Tty: { name: "Yonex Power Cushion 65X4", price: 100000, authorFree: true },
};
const SHOP_PERKS = {
  barefootPower: { name: "Barefoot Power Boost", priceUsd: 1, authorFree: true },
};
const SHOP_ABILITIES = {
  jumpSmash: { name: "Jump Smash Ability", priceUsd: 1, authorFree: true },
  pigCompanion: { name: "Pig Pistol Companion", price: 10000 },
  bareHands: { name: "Bare Hands Sprint", price: 30000, authorFree: true },
};
const SHOP_SKINS = {
  gundam: { name: "Classic Mecha Skin", price: 50 },
  homelander: { name: "Hero Cape Skin", price: 50 },
  momota: { name: "Momota Badminton Skin", price: 50 },
};
const SHOP_RACKETS = {
  starter: { name: "Starter Bear Racket", price: 0, frame: "#4cc4dc", frame2: "#2f2358", string: "rgba(255, 255, 255, 0.76)", shaft: "#2f2358", grip: "#121722", label: "START", shuttle: "#56d3ff", lightning: "#ffffff", impact: "#56d3ff", trail: "spark", hitWord: "Basic Smash", speed: 1, radius: 44 },
  victor100x: { name: "Global Launch Limited Auraspeed 100X Ultra", price: 100000, authorFree: true, limitedCopies: 2, randomRefresh: true, frame: "#6bd6a0", frame2: "#0a1712", string: "rgba(231, 255, 244, 0.94)", shaft: "#16392f", grip: "#07130e", label: "LIMIT", shuttle: "#6bd6a0", lightning: "#d8fff0", impact: "#6bd6a0", trail: "ghostWind", hitWord: "Ghost Wind Cage", speed: 1.32, radius: 92 },
  arcsaber7tour: { name: "Yonex Arcsaber 7 Tour", price: 1000, frame: "#d9343e", frame2: "#f8fafc", string: "#f8d8d8", shaft: "#343434", grip: "#222222", label: "7T", shuttle: "#ff4d57", lightning: "#ffd0d0", impact: "#ff3b45", trail: "arc", hitWord: "Arc Smash", speed: 1, radius: 76 },
  nanoflare700game: { name: "Yonex Nanoflare 700 Game", price: 1000, frame: "#56d3ff", frame2: "#f5d34d", string: "#eaf9ff", shaft: "#25305a", grip: "#101827", label: "700G", shuttle: "#56d3ff", lightning: "#ffe66a", impact: "#56d3ff", trail: "spark", hitWord: "Flash Chain", speed: 1.2, radius: 58 },
  antaDingyin1000: { name: "Anta Dingyin 1000", priceUsd: 1, authorFree: true, frame: "#0f172a", frame2: "#41ead4", string: "rgba(244, 255, 250, 0.95)", shaft: "#ff3d8b", grip: "#111827", label: "DY1000", shuttle: "#41ead4", lightning: "#f9f871", impact: "#ff3d8b", trail: "anta", hitWord: "Dingyin Shock", speed: 1.16, radius: 70 },
};
const SKIN_EFFECTS = {
  bear: { aura: "#ffd0d7", impact: "#ff9fbe", word: "Bear Hit", radius: 1, style: "heart" },
  gundam: { aura: "#5edbff", impact: "#f0c64a", word: "Mecha Boost", radius: 1.22, style: "thruster" },
  homelander: { aura: "#ff4050", impact: "#ffd94d", word: "Red Pressure", radius: 1.18, style: "laser" },
  momota: { aura: "#f7fafc", impact: "#d8323f", word: "Footwork Echo", radius: 1.08, style: "footwork" },
};
const SHUTTLE_MODES = [
  { id: "forehandDrive", name: "Forehand Drive", vx: 1760, vy: 0, gravity: 0 },
  { id: "backhandSmash", name: "Backhand Smash", vx: 1500, vy: 1500, gravity: 0 },
  { id: "dropShot", name: "Drop Shot", vx: 1080, vy: 520, gravity: 520 },
];
const LEVELS = [
  { id: 1, name: "Level 1", startX: 86, goalX: 14560, time: 260 },
  { id: 2, name: "Level 2", startX: BOSS_ARENA_X - 720, goalX: 36640, time: 520 },
  { id: 3, name: "Level 3", startX: FINAL_BOSS_X - 1320, goalX: 60420, time: 540 },
];

const input = {
  left: false,
  right: false,
  jump: false,
  jumpPressed: false,
  attack: false,
  attackPressed: false,
  shootPressed: false,
  toggleWeaponPressed: false,
  executePressed: false,
  toggleJumpSmashPressed: false,
};

const basePlatforms = [
  { x: 0, y: GROUND_Y, w: 1500, h: 70, kind: "ground" },
  { x: 1600, y: GROUND_Y, w: 820, h: 70, kind: "ground" },
  { x: 2530, y: GROUND_Y, w: 1770, h: 70, kind: "ground" },
  { x: 4420, y: GROUND_Y, w: 920, h: 70, kind: "ground" },
  { x: 5480, y: GROUND_Y, w: 620, h: 70, kind: "ground" },
  { x: 6240, y: GROUND_Y, w: 1100, h: 70, kind: "ground" },
  { x: 7500, y: GROUND_Y, w: 620, h: 70, kind: "ground" },
  { x: 8280, y: GROUND_Y, w: 1200, h: 70, kind: "ground" },
  { x: 9700, y: GROUND_Y, w: 780, h: 70, kind: "ground" },
  { x: 10650, y: GROUND_Y, w: 1050, h: 70, kind: "ground" },
  { x: 11920, y: GROUND_Y, w: 690, h: 70, kind: "ground" },
  { x: 12780, y: GROUND_Y, w: 1040, h: 70, kind: "ground" },
  { x: 14040, y: GROUND_Y, w: 700, h: 70, kind: "ground" },
  { x: BOSS_ARENA_X, y: GROUND_Y, w: 1880, h: 70, kind: "boss-ground" },
  { x: MACHINE_GUN_STAGE_X, y: GROUND_Y, w: 3300, h: 70, kind: "gun-ground" },
  { x: 360, y: 365, w: 230, h: 22, kind: "grass" },
  { x: 710, y: 315, w: 180, h: 22, kind: "grass" },
  { x: 1030, y: 365, w: 270, h: 22, kind: "grass" },
  { x: 1450, y: 300, w: 220, h: 22, kind: "grass" },
  { x: 1840, y: 380, w: 260, h: 22, kind: "grass" },
  { x: 2200, y: 321, w: 210, h: 22, kind: "grass" },
  { x: 2530, y: 260, w: 190, h: 22, kind: "grass" },
  { x: 2860, y: 351, w: 300, h: 22, kind: "grass" },
  { x: 3340, y: 294, w: 240, h: 22, kind: "grass" },
  { x: 3740, y: 379, w: 260, h: 22, kind: "grass" },
  { x: 4460, y: 370, w: 220, h: 22, kind: "grass" },
  { x: 4800, y: 320, w: 190, h: 22, kind: "grass" },
  { x: 5140, y: 365, w: 240, h: 22, kind: "grass" },
  { x: 5580, y: 382, w: 180, h: 22, kind: "grass" },
  { x: 5880, y: 330, w: 180, h: 22, kind: "grass" },
  { x: 6340, y: 292, w: 210, h: 22, kind: "grass" },
  { x: 6690, y: 355, w: 230, h: 22, kind: "grass" },
  { x: 7110, y: 310, w: 190, h: 22, kind: "grass" },
  { x: 7600, y: 370, w: 180, h: 22, kind: "grass" },
  { x: 7960, y: 318, w: 170, h: 22, kind: "grass" },
  { x: 8400, y: 275, w: 190, h: 22, kind: "grass" },
  { x: 8790, y: 340, w: 220, h: 22, kind: "grass" },
  { x: 9220, y: 290, w: 180, h: 22, kind: "grass" },
  { x: 9840, y: 384, w: 180, h: 22, kind: "grass" },
  { x: 10220, y: 332, w: 180, h: 22, kind: "grass" },
  { x: 10690, y: 290, w: 190, h: 22, kind: "grass" },
  { x: 11120, y: 356, w: 230, h: 22, kind: "grass" },
  { x: 11540, y: 306, w: 180, h: 22, kind: "grass" },
  { x: 12060, y: 390, w: 170, h: 22, kind: "grass" },
  { x: 12440, y: 338, w: 170, h: 22, kind: "grass" },
  { x: 12930, y: 286, w: 180, h: 22, kind: "grass" },
  { x: 13380, y: 344, w: 200, h: 22, kind: "grass" },
  { x: 13790, y: 302, w: 180, h: 22, kind: "grass" },
  { x: 14300, y: 360, w: 210, h: 22, kind: "grass" },
  { x: 17080, y: 372, w: 190, h: 22, kind: "metal" },
  { x: 17470, y: 318, w: 200, h: 22, kind: "metal" },
  { x: 17920, y: 372, w: 180, h: 22, kind: "metal" },
  { x: 18350, y: 300, w: 190, h: 22, kind: "metal" },
  { x: 18820, y: 350, w: 200, h: 22, kind: "metal" },
  { x: 19300, y: 312, w: 190, h: 22, kind: "metal" },
  { x: 19720, y: 374, w: 210, h: 22, kind: "metal" },
];

const baseHearts = [
  { x: 430, y: 329 },
  { x: 770, y: 278 },
  { x: 1150, y: 329 },
  { x: 1515, y: 261 },
  { x: 1960, y: 344 },
  { x: 2285, y: 283 },
  { x: 2590, y: 221 },
  { x: 2970, y: 314 },
  { x: 3420, y: 257 },
  { x: 3845, y: 342 },
  { x: 4070, y: 393 },
  { x: 4550, y: 334 },
  { x: 4875, y: 283 },
  { x: 5230, y: 328 },
  { x: 5660, y: 345 },
  { x: 5960, y: 293 },
  { x: 6425, y: 255 },
  { x: 6785, y: 318 },
  { x: 7185, y: 273 },
  { x: 7685, y: 333 },
  { x: 8030, y: 281 },
  { x: 8485, y: 238 },
  { x: 8885, y: 303 },
  { x: 9300, y: 254 },
  { x: 9915, y: 347 },
  { x: 10300, y: 295 },
  { x: 10775, y: 253 },
  { x: 11220, y: 319 },
  { x: 11610, y: 269 },
  { x: 12135, y: 353 },
  { x: 12510, y: 301 },
  { x: 13010, y: 249 },
  { x: 13470, y: 307 },
  { x: 13865, y: 265 },
  { x: 14400, y: 323 },
  { x: 15190, y: 382 },
  { x: 16080, y: 382 },
  { x: 17160, y: 335 },
  { x: 17560, y: 281 },
  { x: 18000, y: 335 },
  { x: 18440, y: 263 },
  { x: 18920, y: 313 },
  { x: 19390, y: 275 },
  { x: 19820, y: 337 },
];

const baseHazards = [
  { x: 910, y: 402, w: 50, h: 28 },
  { x: 1710, y: 402, w: 50, h: 28 },
  { x: 2385, y: 402, w: 50, h: 28 },
  { x: 3230, y: 402, w: 50, h: 28 },
  { x: 4620, y: 402, w: 50, h: 28 },
  { x: 5205, y: 402, w: 50, h: 28 },
  { x: 5830, y: 402, w: 50, h: 28 },
  { x: 6520, y: 402, w: 50, h: 28 },
  { x: 6845, y: 402, w: 50, h: 28 },
  { x: 7720, y: 402, w: 50, h: 28 },
  { x: 8580, y: 402, w: 50, h: 28 },
  { x: 8910, y: 402, w: 50, h: 28 },
  { x: 10150, y: 402, w: 50, h: 28 },
  { x: 10860, y: 402, w: 50, h: 28 },
  { x: 11320, y: 402, w: 50, h: 28 },
  { x: 12210, y: 402, w: 50, h: 28 },
  { x: 13090, y: 402, w: 50, h: 28 },
  { x: 13420, y: 402, w: 50, h: 28 },
  { x: 14280, y: 402, w: 50, h: 28 },
  { x: 14600, y: 402, w: 50, h: 28 },
  { x: 17190, y: 402, w: 50, h: 28 },
  { x: 17620, y: 402, w: 50, h: 28 },
  { x: 18140, y: 402, w: 50, h: 28 },
  { x: 18670, y: 402, w: 50, h: 28 },
  { x: 19180, y: 402, w: 50, h: 28 },
  { x: 19670, y: 402, w: 50, h: 28 },
];

const baseRollers = [
  { x: 1240, y: 392, w: 40, h: 40, min: 1040, max: 1380, speed: 86 },
  { x: 2010, y: 342, w: 40, h: 40, min: 1845, max: 2050, speed: 72 },
  { x: 3030, y: 313, w: 40, h: 40, min: 2870, max: 3120, speed: 96 },
  { x: 3900, y: 341, w: 40, h: 40, min: 3750, max: 3980, speed: 88 },
  { x: 4960, y: 390, w: 40, h: 40, min: 4430, max: 5300, speed: 104 },
  { x: 6040, y: 390, w: 40, h: 40, min: 5500, max: 6070, speed: 112 },
  { x: 7040, y: 390, w: 40, h: 40, min: 6260, max: 7310, speed: 118 },
  { x: 8110, y: 390, w: 40, h: 40, min: 7520, max: 8090, speed: 126 },
  { x: 9250, y: 390, w: 40, h: 40, min: 8300, max: 9450, speed: 134 },
  { x: 10260, y: 390, w: 40, h: 40, min: 9720, max: 10450, speed: 144 },
  { x: 11580, y: 390, w: 40, h: 40, min: 10680, max: 11680, speed: 152 },
  { x: 12490, y: 390, w: 40, h: 40, min: 11940, max: 12580, speed: 160 },
  { x: 13620, y: 390, w: 40, h: 40, min: 12810, max: 13800, speed: 168 },
  { x: 14500, y: 390, w: 40, h: 40, min: 14060, max: 14710, speed: 176 },
  { x: 4570, y: 390, w: 40, h: 40, min: 4430, max: 5300, speed: 98 },
  { x: 5750, y: 390, w: 40, h: 40, min: 5500, max: 6070, speed: 124 },
  { x: 6470, y: 390, w: 40, h: 40, min: 6260, max: 7310, speed: 132 },
  { x: 7890, y: 390, w: 40, h: 40, min: 7520, max: 8090, speed: 142 },
  { x: 8720, y: 390, w: 40, h: 40, min: 8300, max: 9450, speed: 150 },
  { x: 10040, y: 390, w: 40, h: 40, min: 9720, max: 10450, speed: 156 },
  { x: 11080, y: 390, w: 40, h: 40, min: 10680, max: 11680, speed: 164 },
  { x: 13220, y: 390, w: 40, h: 40, min: 12810, max: 13800, speed: 176 },
  { x: 17100, y: 390, w: 40, h: 40, min: 16890, max: 17530, speed: 136 },
  { x: 18080, y: 390, w: 40, h: 40, min: 17700, max: 18490, speed: 152 },
  { x: 19030, y: 390, w: 40, h: 40, min: 18650, max: 19480, speed: 166 },
];

const baseSprings = [
  { x: 1608, y: 404, w: 48, h: 26 },
  { x: 2678, y: 404, w: 48, h: 26 },
  { x: 5350, y: 404, w: 48, h: 26 },
  { x: 7350, y: 404, w: 48, h: 26 },
  { x: 9480, y: 404, w: 48, h: 26 },
  { x: 11705, y: 404, w: 48, h: 26 },
  { x: 13830, y: 404, w: 48, h: 26 },
  { x: 16980, y: 404, w: 48, h: 26 },
  { x: 18580, y: 404, w: 48, h: 26 },
];

const baseTurrets = [
  { x: BOSS_ARENA_X - 1260, y: 388, dir: -1, rate: 0.74, cooldown: 0.15 },
  { x: BOSS_ARENA_X - 1040, y: 388, dir: -1, rate: 0.68, cooldown: 0.42 },
  { x: BOSS_ARENA_X - 820, y: 388, dir: -1, rate: 0.64, cooldown: 0.7 },
  { x: BOSS_ARENA_X - 600, y: 388, dir: -1, rate: 0.6, cooldown: 0.26 },
  { x: BOSS_ARENA_X - 380, y: 388, dir: -1, rate: 0.56, cooldown: 0.52 },
  { x: BOSS_ARENA_X - 160, y: 388, dir: -1, rate: 0.54, cooldown: 0.84 },
  { x: SECOND_BOSS_X - 1460, y: 388, dir: -1, rate: 0.66, cooldown: 0.2 },
  { x: SECOND_BOSS_X - 1220, y: 388, dir: -1, rate: 0.62, cooldown: 0.48 },
  { x: SECOND_BOSS_X - 980, y: 388, dir: -1, rate: 0.58, cooldown: 0.76 },
  { x: SECOND_BOSS_X - 740, y: 388, dir: -1, rate: 0.54, cooldown: 0.36 },
  { x: SECOND_BOSS_X - 500, y: 388, dir: -1, rate: 0.5, cooldown: 0.62 },
  { x: SECOND_BOSS_X - 260, y: 388, dir: -1, rate: 0.48, cooldown: 0.88 },
  { x: FINAL_BOSS_X - 1580, y: 388, dir: -1, rate: 0.58, cooldown: 0.2 },
  { x: FINAL_BOSS_X - 1320, y: 388, dir: -1, rate: 0.54, cooldown: 0.5 },
  { x: FINAL_BOSS_X - 1060, y: 388, dir: -1, rate: 0.5, cooldown: 0.8 },
  { x: FINAL_BOSS_X - 800, y: 388, dir: -1, rate: 0.47, cooldown: 0.35 },
  { x: FINAL_BOSS_X - 540, y: 388, dir: -1, rate: 0.44, cooldown: 0.65 },
  { x: FINAL_BOSS_X - 280, y: 388, dir: -1, rate: 0.42, cooldown: 0.92 },
  { x: MACHINE_GUN_STAGE_X + 360, y: 388, dir: -1, rate: 0.62, cooldown: 0.2 },
  { x: MACHINE_GUN_STAGE_X + 900, y: 388, dir: -1, rate: 0.56, cooldown: 0.55 },
  { x: MACHINE_GUN_STAGE_X + 1490, y: 388, dir: -1, rate: 0.5, cooldown: 0.8 },
  { x: MACHINE_GUN_STAGE_X + 2070, y: 388, dir: -1, rate: 0.46, cooldown: 0.35 },
  { x: MACHINE_GUN_STAGE_X + 2670, y: 388, dir: -1, rate: 0.42, cooldown: 0.68 },
];

const baseZombies = [
  { x: 2680, y: 352, w: 66, h: 78, min: 2520, max: 3150, speed: 52, hp: 3 },
  { x: 4380, y: 352, w: 66, h: 78, min: 4300, max: 5200, speed: 58, hp: 3 },
  { x: 6200, y: 352, w: 66, h: 78, min: 6120, max: 7100, speed: 64, hp: 4 },
  { x: 8420, y: 352, w: 66, h: 78, min: 8280, max: 9360, speed: 70, hp: 4 },
  { x: 10880, y: 352, w: 66, h: 78, min: 10650, max: 11640, speed: 76, hp: 4 },
];

const baseRacketMonsters = [
  { x: 2160, y: 352, w: 62, h: 78, min: 1960, max: 2820, speed: 72, hp: 3 },
  { x: 3520, y: 352, w: 62, h: 78, min: 3260, max: 4100, speed: 78, hp: 3 },
  { x: 5360, y: 352, w: 62, h: 78, min: 5120, max: 6100, speed: 84, hp: 3 },
  { x: 7560, y: 352, w: 62, h: 78, min: 7240, max: 8240, speed: 90, hp: 3 },
  { x: 9880, y: 352, w: 62, h: 78, min: 9600, max: 10780, speed: 96, hp: 3 },
  { x: 12280, y: 352, w: 62, h: 78, min: 11960, max: 13120, speed: 102, hp: 3 },
  { x: 15180, y: 352, w: 62, h: 78, min: 14920, max: 16040, speed: 108, hp: 3 },
  { x: 18120, y: 352, w: 62, h: 78, min: 17760, max: 18880, speed: 114, hp: 3 },
  { x: 19620, y: 352, w: 62, h: 78, min: 19180, max: 20080, speed: 120, hp: 3 },
  { x: 20480, y: 352, w: 62, h: 78, min: 20100, max: 21080, speed: 126, hp: 3 },
];

const goal = { x: 121020, y: 315, w: 76, h: 115 };

let platforms = [];
let hearts = [];
let hazards = [];
let ponds = [];
let rollers = [];
let zombies = [];
let racketMonsters = [];
let springs = [];
let turrets = [];
let bullets = [];
let playerShots = [];
let extraBosses = [];
let damagePopups = [];
let impactEffects = [];
let scorchMarks = [];
let rainbowTimer = 0;
let cinemaGrain = [];
let playerAfterimageTrail = [];
let playerAfterimageHueSeed = Math.random();
let player;
let boss;
let cameraX = 0;
let state = "ready";
let score = 0;
let lives = 3;
let timeLeft = 90;
let lastTime = 0;
let coyoteTime = 0;
let selectedLevel = 1;
let activeLevel = LEVELS[0];
let activeGoal = { ...goal, x: LEVELS[0].goalX };
let saveData = loadSave();
let tripleJumpPity = 0;

function setupCanvasResolution() {
  renderScale = Math.min(MAX_RENDER_SCALE, Math.max(1, window.devicePixelRatio || 1));
  const width = Math.round(VIEW_WIDTH * renderScale);
  const height = Math.round(VIEW_HEIGHT * renderScale);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
}

function createCinemaGrain() {
  cinemaGrain = Array.from({ length: CINEMA_GRAIN_COUNT }, () => ({
    x: Math.random() * VIEW_WIDTH,
    y: Math.random() * VIEW_HEIGHT,
    r: 0.4 + Math.random() * 1.4,
    a: 0.018 + Math.random() * 0.035,
  }));
}

function createPlayer() {
  return {
    x: 86,
    y: 344,
    w: 62,
    h: 78,
    vx: 0,
    vy: 0,
    dir: 1,
    onGround: false,
    invulnerable: 0,
    attackTimer: 0,
    attackCooldown: 0,
    attackHitActive: false,
    poisonTicksRemaining: 0,
    poisonTickTimer: 0,
    poisonSource: null,
    hasPistol: false,
    pistolMode: "gun",
    shotCooldown: 0,
    pigAttackCooldown: 0,
    pigX: 44,
    pigY: 382,
    pigVx: 0,
    pigVy: 0,
    shuttleCooldown: 0,
    executeCooldown: 0,
    stompHealCooldown: 0,
    shuttleModeIndex: 0,
    oppressionTimer: 0,
    oppressionCooldown: 0,
    oppressionPulse: 0,
    oppressionKillTimer: 0,
    passiveStacks: 0,
    passiveInvincibleTimer: 0,
    passiveCooldown: 0,
    extraJumpsAvailable: 0,
    tripleJumpActive: false,
    jumpSmashCharges: getJumpSmashEnabled() ? 1 : 0,
    jumpSmashCritCounter: 0,
    pondDamageTimer: POND_DAMAGE_INTERVAL,
    shields: 0,
  };
}

function createBoss() {
  return {
    x: 15830,
    y: GROUND_Y - 118,
    w: 98,
    h: 118,
    vx: 0,
    vy: 0,
    dir: -1,
    hp: 54,
    maxHp: 54,
    mech: false,
    mechHp: MECH_MAX_HEALTH,
    mechMaxHp: MECH_MAX_HEALTH,
    active: false,
    defeated: false,
    onGround: false,
    attackTimer: 0,
    attackCooldown: 1.1,
    invulnerable: 0,
    stepTimer: 0,
    type: "rabbitBoss",
    name: "\u5c0f\u5154\u5b50",
    arenaX: BOSS_ARENA_X,
    damage: 3.5,
    critImmune: 6,
    nextSummonAt: 8,
    rageTriggered: false,
    minions: [],
  };
}

function createExtraBosses() {
  return [
    {
      x: SECOND_BOSS_X + 780,
      y: GROUND_Y - 108,
      w: 92,
      h: 108,
      vx: 0,
      vy: 0,
      dir: -1,
      hp: 48,
      maxHp: 48,
      active: false,
      defeated: false,
      onGround: false,
      attackTimer: 0,
      attackCooldown: 1.2,
      invulnerable: 0,
      type: "zombieBoss",
      name: "Zombie Boss",
      arenaX: SECOND_BOSS_X,
      damage: 2,
      rewardStars: 25,
      critImmune: 4,
      rageTriggered: false,
      nextZombieSummonAt: 16,
    },
    {
      x: FINAL_BOSS_X + 860,
      y: GROUND_Y - 132,
      w: 118,
      h: 132,
      vx: 0,
      vy: 0,
      dir: -1,
      hp: 72,
      maxHp: 72,
      active: false,
      defeated: false,
      onGround: true,
      attackTimer: 0,
      attackCooldown: 1.15,
      invulnerable: 0,
      type: "gundamBoss",
      name: "婵°倕鍊归…鍫ュ箵閻欑兊SS",
      arenaX: FINAL_BOSS_X,
      damage: 3,
      rewardStars: 40,
      critImmune: 5,
      rageTriggered: false,
      nextDroneSummonAt: 18,
    },
  ];
}

function createExtendedPlatforms() {
  const generated = [];
  for (let x = 20300; x < WORLD_WIDTH - 600; x += 1720) {
    const width = x > MACHINE_GUN_STAGE_X - 300 ? 1500 : 1040 + ((x / 1720) % 3) * 230;
    generated.push({ x, y: GROUND_Y, w: width, h: 70, kind: x > MACHINE_GUN_STAGE_X - 400 ? "gun-ground" : "ground" });
    generated.push({ x: x + 220, y: 365 - ((x / 1720) % 3) * 34, w: 190, h: 22, kind: x > MACHINE_GUN_STAGE_X - 400 ? "metal" : "grass" });
    generated.push({ x: x + 680, y: 302 + ((x / 1720) % 2) * 48, w: 210, h: 22, kind: x > MACHINE_GUN_STAGE_X - 400 ? "metal" : "grass" });
  }
  generated.push({ x: SECOND_BOSS_X, y: GROUND_Y, w: 1800, h: 70, kind: "boss-ground" });
  generated.push({ x: FINAL_BOSS_X, y: GROUND_Y, w: 2050, h: 70, kind: "boss-ground" });
  return generated;
}

function createExtendedHearts() {
  const generated = [];
  for (let x = 20850; x < WORLD_WIDTH - 900; x += 980) {
    generated.push({ x, y: 255 + ((x / 980) % 4) * 32 });
  }
  return generated;
}

function createExtendedHazards() {
  const generated = [];
  for (let x = 21240; x < WORLD_WIDTH - 900; x += 1380) {
    generated.push({ x, y: 402, w: 50, h: 28 });
    if (x > 30000) generated.push({ x: x + 110, y: 402, w: 50, h: 28 });
  }
  return generated;
}

function createPonds() {
  const fixed = [
    { x: 1820, w: 230 },
    { x: 5780, w: 260 },
    { x: 10420, w: 290 },
    { x: 17880, w: 310 },
    { x: 24640, w: 330 },
    { x: 31220, w: 350 },
    { x: 38640, w: 360 },
    { x: 46880, w: 380 },
    { x: 54680, w: 390 },
    { x: 58880, w: 340 },
  ];
  return fixed.map((pond) => ({ ...pond, y: GROUND_Y - 8, h: 38, damageTimer: POND_DAMAGE_INTERVAL }));
}

function createExtendedRollers() {
  const generated = [];
  for (let x = 21480; x < WORLD_WIDTH - 1200; x += 1540) {
    generated.push({ x, y: 390, w: 40, h: 40, min: x - 260, max: x + 620, speed: 140 + ((x / 1540) % 5) * 12 });
  }
  return generated;
}

function createExtendedZombies() {
  const generated = [];
  for (let x = 22600; x < WORLD_WIDTH - 1600; x += 3400) {
    generated.push({ x, y: 352, w: 66, h: 78, min: x - 300, max: x + 720, speed: 68 + ((x / 3400) % 4) * 8, hp: 4 });
  }
  return generated;
}

function createExtendedSprings() {
  const generated = [];
  for (let x = 21800; x < WORLD_WIDTH - 1500; x += 4200) {
    generated.push({ x, y: 404, w: 48, h: 26 });
  }
  return generated;
}

function resetGame() {
  platforms = [
    { x: 0, y: GROUND_Y, w: WORLD_WIDTH, h: 70, kind: "ground" },
    ...basePlatforms.map((item) => ({ ...item })),
    ...createExtendedPlatforms(),
  ];
  hearts = [...baseHearts, ...createExtendedHearts()].map((item) => ({ ...item, taken: false, phase: Math.random() * 6 }));
  hazards = [...baseHazards.map((item) => ({ ...item })), ...createExtendedHazards()];
  ponds = createPonds();
  rollers = [...baseRollers, ...createExtendedRollers()].map((item) => ({
    ...item,
    type: "roller",
    dir: Math.random() > 0.5 ? 1 : -1,
    aimDir: Math.random() > 0.5 ? 1 : -1,
    alive: true,
    evolved: false,
    gun: false,
    shootCooldown: 0.8 + Math.random() * 0.8,
  }));
  zombies = [...baseZombies, ...createExtendedZombies()].map((item) => ({
    ...item,
    type: "zombie",
    dir: Math.random() > 0.5 ? 1 : -1,
    aimDir: -1,
    alive: true,
    maxHp: item.hp,
    poisonCooldown: 0.7 + Math.random() * 0.7,
    refund: 0,
  }));
  racketMonsters = [...baseRacketMonsters, ...createExtendedRacketMonsters()].map((item) => ({
    ...item,
    type: "racketMonster",
    dir: Math.random() > 0.5 ? 1 : -1,
    aimDir: -1,
    alive: true,
    maxHp: 3,
    hp: 3,
    attackCooldown: 2 + Math.random() * 3,
    attackTimer: 0,
    hitFlash: 0,
  }));
  springs = [...baseSprings.map((item) => ({ ...item })), ...createExtendedSprings()];
  turrets = baseTurrets.map((item) => ({ ...item, alive: true, hp: 1 }));
  bullets = [];
  playerShots = [];
  extraBosses = createExtraBosses();
  damagePopups = [];
  impactEffects = [];
  scorchMarks = [];
  playerAfterimageTrail = [];
  playerAfterimageHueSeed = Math.random();
  player = createPlayer();
  boss = createBoss();
  cameraX = 0;
  score = saveData.stars;
  lives = PLAYER_MAX_LIVES;
  coyoteTime = 0;
  configureLevel();
  syncShop();
  syncLevelButtons();
  setHud();
}

function configureLevel() {
  activeLevel = LEVELS.find((level) => level.id === selectedLevel) || LEVELS[0];
  activeGoal = { ...goal, x: activeLevel.goalX };
  if (activeLevel.id === 3) {
    activeGoal.x = WORLD_WIDTH - 180;
    activeLevel = { ...activeLevel, time: 1080 };
  }
  player.x = activeLevel.startX;
  player.y = 344;
  player.vx = 0;
  player.vy = 0;
  player.dir = 1;
  player.hasPistol = Boolean(saveData.ownedAbilities.pigCompanion);
  player.pistolMode = player.hasPistol ? "pig" : "gun";
  syncPigCompanion(true);
  timeLeft = activeLevel.time;

  if (activeLevel.id === 3) {
    boss.defeated = true;
    player.hasPistol = true;
    player.pistolMode = "gun";
    const zombieBoss = extraBosses.find((extraBoss) => extraBoss.type === "zombieBoss");
    if (zombieBoss) zombieBoss.defeated = true;
  }

  cameraX = clamp(player.x - VIEW_WIDTH * 0.36, 0, WORLD_WIDTH - VIEW_WIDTH);
}

function setHud() {
  scoreLabel.textContent = score.toString();
  livesLabel.textContent = lives.toString();
  if (shieldsLabel) shieldsLabel.textContent = (player ? player.shields : 0).toString();
  timerLabel.textContent = Math.max(0, Math.ceil(timeLeft)).toString();
}

function loadSave() {
  const fallback = {
    stars: 0,
    shopTokens: 0,
    ownedSkins: {},
    ownedRackets: { starter: true, victor100x: true, antaDingyin1000: true },
    ownedBackgrounds: { badmintonCourt: true, judoDojo: true, skyClouds: true, livingJungle: true },
    ownedGear: { victorP9200Tty: true },
    ownedPerks: { barefootPower: true },
    ownedAbilities: { jumpSmash: true, pigCompanion: false, bareHands: true },
    limitedRacketRefresh: {},
    equippedSkin: "bear",
    equippedRacket: "starter",
    equippedBackground: "default",
    equippedGear: "none",
    equippedPerk: "barefootPower",
    equippedAbility: "none",
  };
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    const parsed = raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
    parsed.ownedSkins = { ...fallback.ownedSkins, ...(parsed.ownedSkins || {}) };
    parsed.ownedRackets = { ...fallback.ownedRackets, ...(parsed.ownedRackets || {}) };
    parsed.ownedBackgrounds = { ...fallback.ownedBackgrounds, ...(parsed.ownedBackgrounds || {}) };
    parsed.ownedGear = { ...fallback.ownedGear, ...(parsed.ownedGear || {}) };
    parsed.ownedPerks = { ...fallback.ownedPerks, ...(parsed.ownedPerks || {}) };
    parsed.ownedAbilities = { ...fallback.ownedAbilities, ...(parsed.ownedAbilities || {}) };
    parsed.limitedRacketRefresh = { ...fallback.limitedRacketRefresh, ...(parsed.limitedRacketRefresh || {}) };
    parsed.shopTokens = Number(parsed.shopTokens || 0);
    if (parsed.gundamSkinOwned) parsed.ownedSkins.gundam = true;
    if (!SHOP_SKINS[parsed.equippedSkin]) parsed.equippedSkin = "bear";
    if (parsed.equippedRacket !== "starter" && !SHOP_RACKETS[parsed.equippedRacket]) parsed.equippedRacket = "starter";
    if (parsed.equippedBackground !== "default" && !SHOP_BACKGROUNDS[parsed.equippedBackground]) parsed.equippedBackground = "default";
    if (parsed.equippedGear !== "none" && !SHOP_GEAR[parsed.equippedGear]) parsed.equippedGear = "none";
    if (parsed.equippedPerk !== "none" && !SHOP_PERKS[parsed.equippedPerk]) parsed.equippedPerk = "none";
    if (parsed.equippedAbility !== "none" && !SHOP_ABILITIES[parsed.equippedAbility]) parsed.equippedAbility = "none";
    return parsed;
  } catch {
    return fallback;
  }
}

function createExtendedRacketMonsters() {
  const generated = [];
  for (let x = 21600; x < WORLD_WIDTH - 1500; x += 1700) {
    generated.push({ x, y: 352, w: 62, h: 78, min: x - 320, max: x + 760, speed: 92 + ((x / 1700) % 5) * 9, hp: 3 });
  }
  return generated;
}

function saveProgress() {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch {
    // Local storage can be unavailable in private/file contexts; the game still works for the session.
  }
}

function addStars(amount) {
  if (amount <= 0) return;
  saveData.stars += amount;
  score = saveData.stars;
  saveProgress();
  syncShop();
  setHud();
}

function spendStars(amount) {
  if (saveData.stars < amount) return false;
  saveData.stars -= amount;
  score = saveData.stars;
  saveProgress();
  syncShop();
  setHud();
  return true;
}

function getUsdStarPrice(item) {
  return item && item.priceUsd ? item.priceUsd * USD_TO_STARS : 0;
}

function getItemStarPrice(item) {
  if (!item) return 0;
  return item.price != null ? item.price : getUsdStarPrice(item);
}

function addShopToken(amount) {
  saveData.shopTokens += amount;
  saveProgress();
  syncShop();
}

function unlockSkinReward(skin, sourceLabel = "Skin") {
  if (saveData.ownedSkins[skin]) {
    addStars(1);
    return `${sourceLabel}: duplicate skin -> 1 star`;
  }
  saveData.ownedSkins[skin] = true;
  saveProgress();
  syncShop();
  return `${sourceLabel}: ${SHOP_SKINS[skin].name}`;
}

function unlockBackgroundReward(background, sourceLabel = "Background") {
  if (saveData.ownedBackgrounds[background]) {
    addStars(1);
    return `${sourceLabel}: duplicate background -> 1 star`;
  }
  saveData.ownedBackgrounds[background] = true;
  saveProgress();
  syncShop();
  return `${sourceLabel}: ${SHOP_BACKGROUNDS[background].name}`;
}

function pickBackgroundReward() {
  const backgrounds = Object.keys(SHOP_BACKGROUNDS);
  return backgrounds.find((id) => !saveData.ownedBackgrounds[id]) || backgrounds[Math.floor(Math.random() * backgrounds.length)];
}

function spinLuckyWheel() {
  if (!spendStars(WHEEL_COST)) return;
  const roll = Math.random();
  let result;
  if (roll < 0.00001) {
    result = unlockBackgroundReward(pickBackgroundReward(), "Wheel");
  } else if (roll < 0.01) {
    addShopToken(1);
    result = "Wheel: token +1";
  } else {
    const skins = Object.keys(SHOP_SKINS);
    const skin = skins[Math.floor(Math.random() * skins.length)];
    result = unlockSkinReward(skin, "Wheel");
  }
  if (wheelResultLabel) wheelResultLabel.textContent = result;
}

function redeemSkinToken() {
  if (saveData.shopTokens < 1) return;
  const skin = Object.keys(SHOP_SKINS).find((id) => !saveData.ownedSkins[id]) || Object.keys(SHOP_SKINS)[0];
  saveData.shopTokens -= 1;
  const result = unlockSkinReward(skin, "Token");
  if (wheelResultLabel) wheelResultLabel.textContent = result;
  saveProgress();
  syncShop();
}

function redeemBackgroundToken() {
  if (saveData.shopTokens < 10) return;
  saveData.shopTokens -= 10;
  const result = unlockBackgroundReward(pickBackgroundReward(), "Token");
  if (wheelResultLabel) wheelResultLabel.textContent = result;
  saveProgress();
  syncShop();
}

function isLimitedRacketAvailable(racket) {
  const item = SHOP_RACKETS[racket];
  if (!item || !item.randomRefresh || saveData.ownedRackets[racket]) return true;
  if (saveData.limitedRacketRefresh[racket] == null) {
    saveData.limitedRacketRefresh[racket] = Math.random() < 0.35;
    saveProgress();
  }
  return Boolean(saveData.limitedRacketRefresh[racket]);
}

function syncShop() {
  if (!shopPanel) return;
  score = saveData.stars;
  if (shopStarsLabel) shopStarsLabel.textContent = saveData.stars.toString();
  if (shopTokensLabel) shopTokensLabel.textContent = saveData.shopTokens.toString();
  buySkinButtons.forEach((button) => {
    const skin = button.dataset.skin;
    const item = SHOP_SKINS[skin];
    const owned = Boolean(saveData.ownedSkins[skin]);
    button.disabled = owned || saveData.stars < item.price;
    button.textContent = owned ? "Owned" : `Buy ${item.price} stars`;
  });
  equipSkinButtons.forEach((button) => {
    const skin = button.dataset.skin;
    const owned = Boolean(saveData.ownedSkins[skin]);
    button.disabled = !owned;
    button.textContent = saveData.equippedSkin === skin ? "Equipped" : "Equip";
  });
  buyRacketButtons.forEach((button) => {
    const racket = button.dataset.racket;
    const item = SHOP_RACKETS[racket];
    const owned = Boolean(saveData.ownedRackets[racket]);
    if (!item) return;
    const limitedAvailable = isLimitedRacketAvailable(racket);
    const starPrice = getItemStarPrice(item);
    button.disabled = owned || !limitedAvailable || saveData.stars < starPrice;
    button.textContent = owned ? "Owned" : !limitedAvailable ? "Refresh Soon" : `Buy ${starPrice} stars`;
  });
  equipRacketButtons.forEach((button) => {
    const racket = button.dataset.racket;
    const owned = Boolean(saveData.ownedRackets[racket]);
    button.disabled = !owned;
    button.textContent = saveData.equippedRacket === racket ? "Equipped" : "Equip";
  });
  buyBackgroundButtons.forEach((button) => {
    const background = button.dataset.background;
    const item = SHOP_BACKGROUNDS[background];
    const owned = Boolean(saveData.ownedBackgrounds[background]);
    const starPrice = getItemStarPrice(item);
    button.disabled = owned || saveData.stars < starPrice;
    button.textContent = owned ? "Owned" : `Buy ${starPrice} stars`;
  });
  equipBackgroundButtons.forEach((button) => {
    const background = button.dataset.background;
    const owned = Boolean(saveData.ownedBackgrounds[background]);
    button.disabled = !owned;
    button.textContent = saveData.equippedBackground === background ? "Equipped" : "Equip";
  });
  buyGearButtons.forEach((button) => {
    const gear = button.dataset.gear;
    const item = SHOP_GEAR[gear];
    const owned = Boolean(saveData.ownedGear[gear]);
    const starPrice = getItemStarPrice(item);
    button.disabled = owned || saveData.stars < starPrice;
    button.textContent = owned ? "Owned" : `Buy ${starPrice} stars`;
  });
  equipGearButtons.forEach((button) => {
    const gear = button.dataset.gear;
    const owned = Boolean(saveData.ownedGear[gear]);
    button.disabled = !owned;
    button.textContent = saveData.equippedGear === gear ? "Wearing" : "Equip";
  });
  buyPerkButtons.forEach((button) => {
    const perk = button.dataset.perk;
    const item = SHOP_PERKS[perk];
    const owned = Boolean(saveData.ownedPerks[perk]);
    const starPrice = getItemStarPrice(item);
    button.disabled = owned || saveData.stars < starPrice;
    button.textContent = owned ? "Owned" : `Buy ${starPrice} stars`;
  });
  equipPerkButtons.forEach((button) => {
    const perk = button.dataset.perk;
    const owned = Boolean(saveData.ownedPerks[perk]);
    button.disabled = !owned;
    button.textContent = saveData.equippedPerk === perk ? "Enabled" : "Enable";
  });
  buyAbilityButtons.forEach((button) => {
    const ability = button.dataset.ability;
    const item = SHOP_ABILITIES[ability];
    const owned = Boolean(saveData.ownedAbilities[ability]);
    const starPrice = getItemStarPrice(item);
    button.disabled = owned || saveData.stars < starPrice;
    button.textContent = owned ? "Owned" : `Buy ${starPrice} stars`;
  });
  equipAbilityButtons.forEach((button) => {
    const ability = button.dataset.ability;
    const owned = Boolean(saveData.ownedAbilities[ability]);
    button.disabled = !owned;
    button.textContent = ability === "pigCompanion" ? (owned ? "Ready" : "Locked") : saveData.equippedAbility === ability ? "Enabled" : "Enable";
  });
  if (spinWheelButton) spinWheelButton.disabled = saveData.stars < WHEEL_COST;
  if (redeemSkinButton) redeemSkinButton.disabled = saveData.shopTokens < 1;
  if (redeemBackgroundButton) redeemBackgroundButton.disabled = saveData.shopTokens < 10;
}

function syncLevelButtons() {
  if (!levelSelect) return;
  levelButtons.forEach((button) => {
    const isSelected = Number(button.dataset.level) === selectedLevel;
    button.classList[isSelected ? "add" : "remove"]("is-selected");
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

function update(dt) {
  if (state !== "running") return;

  timeLeft -= dt;
  if (timeLeft <= 0) {
    timeLeft = 0;
    setHud();
    finishGame("lost");
    return;
  }

  updateRollers(dt);
  updateZombies(dt);
  updateRacketMonsters(dt);
  updateBoss(dt);
  updateExtraBosses(dt);
  updateTurrets(dt);
  updateBullets(dt);
  updateEnemySenseHistory();
  updatePigCompanion(dt);
  updatePlayerShots(dt);
  updatePoison(dt);
  updateDamagePopups(dt);
  updateImpactEffects(dt);
  updateScorchMarks(dt);
  rainbowTimer = Math.max(0, rainbowTimer - dt);
  updateOppression(dt);
  if (state !== "running") return;
  updatePlayer(dt);
  handlePlayerAttack();
  collectHearts();
  checkHazards();
  checkPonds(dt);
  checkZombieDamage();
  checkRacketMonsterDamage();
  checkBossDamage();
  checkExtraBossDamage();
  checkGoal();

  const targetCamera = clamp(player.x - VIEW_WIDTH * 0.36, 0, WORLD_WIDTH - VIEW_WIDTH);
  cameraX += (targetCamera - cameraX) * Math.min(1, dt * 7);
  setHud();
}

function updatePlayer(dt) {
  const move = Number(input.right) - Number(input.left);

  if (move !== 0) {
    player.vx = approach(player.vx, move * getPlayerMoveSpeed(), MOVE_ACCEL * dt * getShoesBoost());
    player.dir = move;
  } else {
    player.vx = approach(player.vx, 0, FRICTION * dt);
  }

  if (input.jumpPressed) {
    if (player.onGround || coyoteTime > 0) {
      player.vy = -JUMP_SPEED;
      player.onGround = false;
      coyoteTime = 0;
      rollTripleJump();
      player.jumpSmashCharges = getJumpSmashEnabled() ? 1 : 0;
    } else if (player.extraJumpsAvailable > 0) {
      player.vy = -JUMP_SPEED * 0.92;
      player.extraJumpsAvailable -= 1;
      player.jumpSmashCharges = getJumpSmashEnabled() ? 1 : 0;
      showDamagePopup(player.x + player.w / 2, player.y - 12, `Triple Jump ${2 - player.extraJumpsAvailable}/2`, false);
    }
  }
  input.jumpPressed = false;

  if (!getBareHandsEnabled() && input.attackPressed && player.attackCooldown <= 0) {
    player.attackTimer = 0.2;
    player.attackCooldown = getPlayerAttackCooldown();
    player.attackHitActive = true;
    launchShuttlecock();
  }
  input.attackPressed = false;

  if (!getBareHandsEnabled() && input.toggleWeaponPressed && player.hasPistol) {
    player.pistolMode = player.pistolMode === "pig" ? "gun" : "pig";
    if (player.pistolMode === "pig") syncPigCompanion(true);
    showDamagePopup(player.x + player.w / 2, player.y - 34, player.pistolMode === "pig" ? "Pig Partner" : "Pistol", false);
  }
  input.toggleWeaponPressed = false;

  if (!getBareHandsEnabled() && input.shootPressed && player.hasPistol && player.pistolMode === "pig" && player.pigAttackCooldown <= 0) {
    shootPigCompanion(true);
    player.pigAttackCooldown = 0.42;
  } else if (!getBareHandsEnabled() && input.shootPressed && player.hasPistol && player.shotCooldown <= 0) {
    shootPlayerPistol();
    player.shotCooldown = 0.28;
  }
  input.shootPressed = false;

  if (!getBareHandsEnabled() && input.executePressed) {
    triggerExecuteSlash();
  }
  input.executePressed = false;

  if (input.toggleJumpSmashPressed) {
    toggleJumpSmashAbility();
  }
  input.toggleJumpSmashPressed = false;

  const oldOnGround = player.onGround;
  if (oldOnGround) {
    coyoteTime = 0.09;
  } else {
    coyoteTime -= dt;
  }

  player.vy += GRAVITY * dt;
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.attackTimer = Math.max(0, player.attackTimer - dt);
  player.shotCooldown = Math.max(0, player.shotCooldown - dt);
  player.pigAttackCooldown = Math.max(0, player.pigAttackCooldown - dt);
  player.shuttleCooldown = Math.max(0, player.shuttleCooldown - dt);
  player.executeCooldown = Math.max(0, player.executeCooldown - dt);
  player.stompHealCooldown = Math.max(0, player.stompHealCooldown - dt);
  player.oppressionTimer = Math.max(0, player.oppressionTimer - dt);
  player.oppressionCooldown = Math.max(0, player.oppressionCooldown - dt);
  player.oppressionPulse = Math.max(0, player.oppressionPulse - dt);
  player.oppressionKillTimer = Math.max(0, player.oppressionKillTimer - dt);
  player.passiveInvincibleTimer = Math.max(0, player.passiveInvincibleTimer - dt);
  player.passiveCooldown = Math.max(0, player.passiveCooldown - dt);
  if (player.attackTimer <= 0) player.attackHitActive = false;

  moveHorizontal(dt);
  moveVertical(dt);

  if (player.x < 0) {
    player.x = 0;
    player.vx = 0;
  }
  if (player.x + player.w > WORLD_WIDTH) {
    player.x = WORLD_WIDTH - player.w;
    player.vx = 0;
  }
  if (player.y > VIEW_HEIGHT + 160) {
    loseLife(true);
  }
}

function moveHorizontal(dt) {
  player.x += player.vx * dt;
  for (const platform of platforms) {
    if (!overlaps(player, platform)) continue;
    if (player.vx > 0) player.x = platform.x - player.w;
    if (player.vx < 0) player.x = platform.x + platform.w;
    player.vx = 0;
  }
}

function getShoesBoost() {
  return saveData.equippedGear === "victorP9200Tty" ? 1.5 : 1;
}

function getPlayerMoveSpeed() {
  return MOVE_SPEED * getShoesBoost() * (getBareHandsEnabled() ? 1.3 : 1);
}

function getPlayerAttackCooldown() {
  return 0.42 / getShoesBoost();
}

function getNoShoesDamageBoost() {
  if (saveData.equippedGear === "victorP9200Tty") return 1;
  return saveData.equippedPerk === "barefootPower" ? 1.4 : 1;
}

function getJumpSmashEnabled() {
  return saveData.equippedAbility === "jumpSmash";
}

function getBareHandsEnabled() {
  return saveData.equippedAbility === "bareHands";
}

function toggleJumpSmashAbility() {
  if (!saveData.ownedAbilities.jumpSmash) {
    showDamagePopup(player.x + player.w / 2, player.y - 42, "Jump Smash Locked", false);
    return;
  }
  saveData.equippedAbility = getJumpSmashEnabled() ? "none" : "jumpSmash";
  player.jumpSmashCharges = getJumpSmashEnabled() && !player.onGround ? Math.max(player.jumpSmashCharges || 0, 1) : 0;
  showDamagePopup(player.x + player.w / 2, player.y - 42, getJumpSmashEnabled() ? "Jump Smash On" : "Jump Smash Off", false);
  saveProgress();
  syncShop();
}

function moveVertical(dt) {
  const previousY = player.y;
  player.y += player.vy * dt;
  player.onGround = false;

  for (const spring of springs) {
    if (!overlaps(player, spring)) continue;
    const landed = player.vy > 0 && previousY + player.h <= spring.y + 12;
    if (landed) {
      player.y = spring.y - player.h;
      player.vy = -1120;
      player.onGround = false;
      return;
    }
  }

  for (const platform of platforms) {
    if (!overlaps(player, platform)) continue;

    const wasAbove = previousY + player.h <= platform.y + 12;
    const wasBelow = previousY >= platform.y + platform.h - 12;

    if (player.vy >= 0 && wasAbove) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.onGround = true;
      player.extraJumpsAvailable = 0;
      player.tripleJumpActive = false;
      player.jumpSmashCharges = getJumpSmashEnabled() ? 1 : 0;
    } else if (player.vy < 0 && wasBelow) {
      player.y = platform.y + platform.h;
      player.vy = 0;
    }
  }
}

function rollTripleJump() {
  tripleJumpPity += 1;
  const triggered = getBareHandsEnabled() || saveData.equippedGear === "victorP9200Tty" || Math.random() < TRIPLE_JUMP_CHANCE || tripleJumpPity >= 5;
  if (!triggered) {
    player.extraJumpsAvailable = 0;
    player.tripleJumpActive = false;
    return;
  }

  tripleJumpPity = 0;
  player.extraJumpsAvailable = 2;
  player.tripleJumpActive = true;
  if (player.shields < PLAYER_MAX_SHIELDS) player.shields += 1;
  showDamagePopup(player.x + player.w / 2, player.y - 18, `Shield ${player.shields}`, true);
}

function updateRollers(dt) {
  for (const roller of rollers) {
    if (!roller.alive) continue;
    roller.empoweredTimer = Math.max(0, (roller.empoweredTimer || 0) - dt);
    roller.invulnerable = Math.max(0, (roller.invulnerable || 0) - dt);
    roller.x += roller.speed * (roller.empoweredTimer > 0 ? 1.3 : 1) * roller.dir * dt;
    if (roller.x < roller.min || roller.x + roller.w > roller.max) {
      roller.dir *= -1;
      roller.x = clamp(roller.x, roller.min, roller.max - roller.w);
    }

    if (!roller.gun) continue;

    const playerCenter = player.x + player.w / 2;
    const rollerCenter = roller.x + roller.w / 2;
    const distance = Math.abs(playerCenter - rollerCenter);
    roller.aimDir = playerCenter < rollerCenter ? -1 : 1;
    roller.shootCooldown -= dt;

    if (distance < 760 && roller.shootCooldown <= 0) {
      spawnBullet({
        x: rollerCenter + roller.aimDir * 30,
        y: roller.y + roller.h * 0.44,
        vx: roller.aimDir * 430,
        vy: 0,
        kind: "pistol",
        source: roller,
      });
      roller.shootCooldown = 1.25 + Math.random() * 0.35;
    }
  }
}

function updateZombies(dt) {
  for (const zombie of zombies) {
    if (!zombie.alive) continue;

    zombie.hitFlash = Math.max(0, (zombie.hitFlash || 0) - dt);
    zombie.empoweredTimer = Math.max(0, (zombie.empoweredTimer || 0) - dt);
    zombie.invulnerable = Math.max(0, (zombie.invulnerable || 0) - dt);
    zombie.x += zombie.speed * (zombie.empoweredTimer > 0 ? 1.3 : 1) * zombie.dir * dt;
    if (zombie.x < zombie.min || zombie.x + zombie.w > zombie.max) {
      zombie.dir *= -1;
      zombie.x = clamp(zombie.x, zombie.min, zombie.max - zombie.w);
    }

    const playerCenter = player.x + player.w / 2;
    const zombieCenter = zombie.x + zombie.w / 2;
    const distance = Math.abs(playerCenter - zombieCenter);
    zombie.aimDir = playerCenter < zombieCenter ? -1 : 1;
    zombie.poisonCooldown -= dt;

    if (distance < 720 && zombie.poisonCooldown <= 0) {
      spawnBullet({
        x: zombieCenter + zombie.aimDir * 32,
        y: zombie.y + 24,
        vx: zombie.aimDir * 330,
        vy: -20,
        kind: "venom",
        source: zombie,
      });
      zombie.poisonCooldown = 1.6 + Math.random() * 0.55;
    }
  }
}

function updatePoison(dt) {
  if (player.poisonTicksRemaining <= 0) return;

  player.poisonTickTimer -= dt;
  if (player.poisonTickTimer > 0) return;

  const lost = loseLife(false, 1, { ignoreInvulnerability: true, noKnockback: true, source: player.poisonSource });
  if (lost > 0 && player.poisonSource && player.poisonSource.alive) {
    player.poisonSource.refund += lost;
  }

  player.poisonTicksRemaining -= 1;
  player.poisonTickTimer += 1;
  if (player.poisonTicksRemaining <= 0) {
    player.poisonSource = null;
  }
}

function updateTurrets(dt) {
  for (const turret of turrets) {
    if (!turret.alive) continue;
    const playerCenter = player.x + player.w / 2;
    const playerAirY = player.y + player.h * 0.38;
    const turretCenter = turret.x + 22;
    const turretMuzzleY = turret.y + 14;
    const distance = Math.abs(playerCenter - turretCenter);
    turret.dir = playerCenter < turretCenter ? -1 : 1;
    const airGap = turretMuzzleY - playerAirY;
    const antiAirReady = (!player.onGround || player.vy < -80) && airGap > 42 && distance < 980;
    turret.antiAir = antiAirReady;
    turret.aimPitch = antiAirReady ? clamp(Math.atan2(playerAirY - turretMuzzleY, Math.max(70, distance)), -1.05, -0.18) : Math.sin(performance.now() / 120 + turret.x) * 0.04;
    turret.cooldown -= dt;

    if (distance > (antiAirReady ? 980 : 900) || turret.cooldown > 0) continue;

    const speed = antiAirReady ? 650 : 560;
    const vx = antiAirReady ? Math.cos(turret.aimPitch) * speed * turret.dir : turret.dir * speed;
    const vy = antiAirReady ? Math.sin(turret.aimPitch) * speed : Math.sin(performance.now() / 120 + turret.x) * 18;
    spawnBullet({
      x: turretCenter + turret.dir * 36,
      y: turretMuzzleY,
      vx,
      vy,
      kind: "machine",
      antiAir: antiAirReady,
      source: turret,
    });
    turret.cooldown = antiAirReady ? Math.max(0.18, turret.rate * 0.72) : turret.rate;
  }
}

function updateBullets(dt) {
  for (const bullet of bullets) {
    if (!bullet.alive) continue;
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.ttl -= dt;

    if (
      bullet.ttl <= 0 ||
      bullet.x < cameraX - 220 ||
      bullet.x > cameraX + VIEW_WIDTH + 220 ||
      (bullet.kind === "venom" && bullet.source && !bullet.source.alive)
    ) {
      bullet.alive = false;
      continue;
    }

    if (overlaps(player, bullet)) {
      bullet.alive = false;
      if (bullet.kind === "venom") {
        applyPoison(bullet.source);
      } else if (bullet.kind === "monsterShuttle") {
        loseLife(false, monsterDamage(1), { source: bullet.source });
      } else {
        loseLife(false, empoweredDamage(bullet.source, 1), { source: bullet.source });
        empowerEnemy(bullet.source);
      }
    }
  }

  bullets = bullets.filter((bullet) => bullet.alive);
}

function updatePlayerShots(dt) {
  for (const shot of playerShots) {
    if (!shot.alive) continue;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    if (shot.kind === "shuttle") {
      shot.vy += (shot.gravity || 0) * dt;
      shot.spin += dt * 18;
    }
    shot.ttl -= dt;

    if (shot.ttl <= 0 || shot.x < cameraX - 180 || shot.x > cameraX + VIEW_WIDTH + 180) {
      shot.alive = false;
      continue;
    }

    const source = shot.kind === "shuttle" ? `shuttle:${shot.mode}` : shot.kind || "pistol";
    if (hitDamageableTarget(shot, source, shot)) {
      shot.alive = false;
    }
  }

  playerShots = playerShots.filter((shot) => shot.alive);
}

function updateDamagePopups(dt) {
  for (const popup of damagePopups) {
    popup.ttl -= dt;
    popup.y += popup.vy * dt;
  }
  damagePopups = damagePopups.filter((popup) => popup.ttl > 0);
}

function updateImpactEffects(dt) {
  for (const effect of impactEffects) {
    effect.ttl -= dt;
    effect.radius += effect.grow * dt;
  }
  impactEffects = impactEffects.filter((effect) => effect.ttl > 0);
}

function updateScorchMarks(dt) {
  for (const mark of scorchMarks) mark.ttl -= dt;
  scorchMarks = scorchMarks.filter((mark) => mark.ttl > 0);
}

function updateOppression(dt) {
  if (player.oppressionTimer <= 0) return;
  if (player.oppressionKillTimer > 0) return;
  const target = findNearestVisibleEnemy();
  if (!target) return;
  killTargetByOppression(target);
  player.oppressionKillTimer = 1.35;
}

function updateRacketMonsters(dt) {
  for (const monster of racketMonsters) {
    if (!monster.alive) continue;
    monster.hitFlash = Math.max(0, (monster.hitFlash || 0) - dt);
    monster.attackTimer = Math.max(0, (monster.attackTimer || 0) - dt);
    monster.attackCooldown = Math.max(0, (monster.attackCooldown || 0) - dt);
    monster.x += monster.dir * monster.speed * dt;
    if (monster.x < monster.min || monster.x > monster.max) {
      monster.dir *= -1;
      monster.x = clamp(monster.x, monster.min, monster.max);
    }
    const distance = player.x - monster.x;
    if (Math.abs(distance) < 780) monster.aimDir = distance >= 0 ? 1 : -1;
    if (monster.attackCooldown <= 0 && Math.abs(distance) < 760 && Math.abs(player.y - monster.y) < 170) {
      monster.attackTimer = 0.24;
      monster.attackCooldown = 10;
      fireRacketMonsterShuttles(monster);
    }
  }
}

function fireRacketMonsterShuttles(monster) {
  const dir = monster.aimDir || monster.dir || -1;
  [-32, 0, 32].forEach((vy, index) => {
    bullets.push({
      x: monster.x + monster.w / 2 + dir * 36,
      y: monster.y + 24 + index * 3,
      vx: dir * 620,
      vy,
      w: 24,
      h: 12,
      kind: "monsterShuttle",
      source: monster,
      alive: true,
      ttl: 2.2,
    });
  });
  showImpact(monster.x + monster.w / 2, monster.y + 24, "#f2eee4", 34);
}

function shootPlayerPistol() {
  const originX = player.x + player.w / 2 + player.dir * 36;
  const originY = player.y + 34;
  playerShots.push({
    x: originX,
    y: originY,
    vx: player.dir * 720,
    vy: 0,
    w: 18,
    h: 8,
    kind: "pistol",
    alive: true,
    ttl: 2.1,
  });
}

function updatePigCompanion(dt) {
  if (getBareHandsEnabled()) {
    syncPigCompanion(false);
    return;
  }
  if (!player.hasPistol) return;
  if (player.pistolMode !== "pig") {
    syncPigCompanion(false);
    return;
  }
  const target = getPigFollowTarget(performance.now());
  player.pigVx = approach(player.pigVx, (target.x - player.pigX) * 7, 1800 * dt);
  player.pigVy = approach(player.pigVy, (target.y - player.pigY) * 8, 1600 * dt);
  player.pigX += player.pigVx * dt;
  player.pigY += player.pigVy * dt;
  const maxGap = 230;
  if (Math.abs(player.pigX - player.x) > maxGap || Math.abs(player.pigY - player.y) > maxGap) {
    syncPigCompanion(true);
  }
  if (state !== "running") return;
  if (player.pigAttackCooldown > 0) return;
  if (shootPigCompanion(false)) {
    player.pigAttackCooldown = 0.82;
  }
}

function updateEnemySenseHistory() {
  if (getBareHandsEnabled()) return;
  if (!player || !player.hasPistol || player.pistolMode !== "pig") return;
  const now = performance.now();
  const pig = getPigCompanionPosition(now);
  const remember = (target) => {
    if (!target || target.alive === false || target.defeated || target.active === false) return;
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    const distance = Math.hypot(cx - pig.x, cy - pig.y);
    if (distance > 620 || cx < cameraX - 120 || cx > cameraX + VIEW_WIDTH + 120) return;
    if (!target.pigSenseHistory) target.pigSenseHistory = [];
    target.pigSenseHistory.push({ time: now, x: cx, y: cy });
    target.pigSenseHistory = target.pigSenseHistory.filter((sample) => now - sample.time <= 1300);
  };

  zombies.forEach(remember);
  rollers.forEach(remember);
  if (boss && boss.active) remember(boss);
  extraBosses.forEach((target) => {
    if (target.active) remember(target);
  });
}

function syncPigCompanion(force) {
  const target = getPigFollowTarget(performance.now());
  if (force || !Number.isFinite(player.pigX) || !Number.isFinite(player.pigY)) {
    player.pigX = target.x;
    player.pigY = target.y;
    player.pigVx = 0;
    player.pigVy = 0;
  }
}

function getPigFollowTarget(now = performance.now()) {
  const behind = player.dir > 0 ? -58 : player.w + 58;
  return {
    x: player.x + behind,
    y: player.y + player.h - 26 + Math.sin(now / 170) * 5,
  };
}

function getPigCompanionPosition(now = performance.now()) {
  if (Number.isFinite(player.pigX) && Number.isFinite(player.pigY)) {
    return {
      x: player.pigX,
      y: player.pigY + Math.sin(now / 150) * 2,
    };
  }
  const fallback = getPigFollowTarget(now);
  return {
    x: fallback.x,
    y: fallback.y,
  };
}

function findPigCompanionTarget() {
  const pig = getPigCompanionPosition();
  const now = performance.now();
  const candidates = [];
  const addCandidate = (target, type) => {
    if (!target || target.alive === false || target.defeated || target.active === false) return;
    const locked = getPigLockedPoint(target, now);
    if (!locked) return;
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    const dx = cx - pig.x;
    const dy = cy - pig.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 620 || cx < cameraX - 80 || cx > cameraX + VIEW_WIDTH + 80) return;
    candidates.push({ target, type, distance, locked });
  };
  zombies.forEach((target) => addCandidate(target, "zombie"));
  rollers.forEach((target) => addCandidate(target, "roller"));
  addCandidate(boss && boss.active ? boss : null, "boss");
  extraBosses.forEach((target) => addCandidate(target.active ? target : null, "extraBoss"));
  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0] || null;
}

function getPigLockedPoint(target, now) {
  const history = target && target.pigSenseHistory;
  if (!history || !history.length) return null;
  const desired = now - 1000;
  let locked = null;
  for (const sample of history) {
    if (sample.time <= desired) locked = sample;
    else break;
  }
  return locked;
}

function shootPigCompanion(force) {
  const entry = findPigCompanionTarget();
  if (!entry) {
    if (force) showDamagePopup(player.x + player.w / 2, player.y - 28, "No Target", false);
    return false;
  }
  const pig = getPigCompanionPosition();
  const tx = entry.locked.x;
  const ty = entry.locked.y;
  const angle = Math.atan2(ty - pig.y, tx - pig.x);
  const speed = force ? 780 : 650;
  const spark = randomGhostWindColor(Math.random());
  playerShots.push({
    x: pig.x,
    y: pig.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    w: 16,
    h: 10,
    kind: "pig",
    color: "#ff9fbe",
    lightning: spark,
    alive: true,
    ttl: 1.35,
  });
  showImpact(pig.x, pig.y, spark, 36);
  return true;
}

function launchShuttlecock() {
  if (getBareHandsEnabled()) return;
  if (player.shuttleCooldown > 0) return;
  const racket = getEquippedRacket();
  const skin = getSkinEffect();
  const jumpSmashReady = getJumpSmashEnabled() && !player.onGround && Math.abs(player.vy) > 45 && player.jumpSmashCharges > 0;
  const mode = jumpSmashReady
    ? { id: "jumpSmash", name: "Jump Smash", vx: 1560, vy: 1360, gravity: 140 }
    : SHUTTLE_MODES[player.shuttleModeIndex] || SHUTTLE_MODES[0];
  const effectColor = resolveRacketEffectColor(racket);
  const lightningColor = racket.trail === "ghostWind" ? randomGhostWindColor(Math.random()) : racket.lightning;
  if (jumpSmashReady) {
    player.jumpSmashCharges -= 1;
    player.vy = Math.min(player.vy, 120);
    addPlayerAfterimage();
    showImpact(player.x + player.w / 2, player.y + player.h * 0.34, lightningColor, 62);
  }
  playerShots.push({
    x: player.x + player.w / 2 + player.dir * 48,
    y: player.y + (jumpSmashReady ? 10 : 22),
    vx: player.dir * mode.vx * racket.speed * (jumpSmashReady ? 1.12 : 1),
    vy: mode.vy * racket.speed,
    w: jumpSmashReady ? 34 : 28,
    h: jumpSmashReady ? 18 : 16,
    kind: "shuttle",
    color: effectColor,
    lightning: lightningColor,
    impact: racket.trail === "ghostWind" ? effectColor : skin.impact || racket.impact,
    racketImpact: racket.trail === "ghostWind" ? effectColor : racket.impact,
    trail: racket.trail,
    tailStyle: racket.trail,
    tailColor: effectColor,
    tailAccent: lightningColor,
    hitWord: racket.hitWord,
    skinWord: jumpSmashReady ? "Jump Smash" : skin.word,
    radius: racket.radius * skin.radius * (jumpSmashReady ? 1.28 : 1),
    mode: mode.id,
    gravity: mode.gravity,
    jumpSmash: jumpSmashReady,
    alive: true,
    ttl: jumpSmashReady ? 0.9 : 1.15,
    spin: 0,
  });
  showDamagePopup(player.x + player.w / 2, player.y - 34, mode.name, false);
  player.shuttleCooldown = jumpSmashReady ? 0.48 : 0.34;
}

function hitDamageableTarget(hitbox, source = "pistol", projectile = null) {
  const impactColor = projectile ? projectile.impact : "#e9fbff";
  const racketColor = projectile ? projectile.racketImpact : impactColor;
  const impactRadius = projectile ? projectile.radius : 46;
  for (const turret of turrets) {
    if (!turret.alive || !overlaps(hitbox, getTurretBox(turret))) continue;
    if (projectile && projectile.execute) {
      executeSlashTarget({ target: turret, type: "turret", projectile });
      return true;
    }
    if (source.startsWith("shuttle")) {
      maybeTriggerOppression(source, turret.x + 28, turret.y - 16);
      turret.alive = false;
      addKillPassiveStack(turret);
      addStars(10);
      showRacketImpact(turret.x + 28, turret.y + 10, projectile, impactRadius);
      showDamagePopup(turret.x + 28, turret.y - 18, "Turret Break", true);
      return true;
    }
    const hit = rollPlayerDamage();
    showDamagePopup(turret.x + 28, turret.y - 18, hit.amount, hit.crit);
    showImpact(turret.x + 28, turret.y + 10, hit.crit ? "#ffd94d" : "#ffe27a", hit.crit ? 60 : 34);
    if (!projectile) showEquippedRacketMeleeImpact(turret.x + 28, turret.y + 10, hit.crit ? 70 : 52);
    if (hit.crit) {
      turret.alive = false;
      addKillPassiveStack(turret);
      addStars(10);
    }
    return true;
  }

  for (const zombie of zombies) {
    if (!zombie.alive || zombie.invulnerable > 0 || !overlaps(hitbox, zombie)) continue;
    if (projectile && projectile.execute) {
      executeSlashTarget({ target: zombie, type: "zombie", projectile });
      return true;
    }
    if (projectile && projectile.kind === "pig") {
      damageZombie(zombie, pigShotDamage(zombie.hp, zombie.maxHp));
      showImpact(zombie.x + zombie.w / 2, zombie.y + zombie.h / 2, "#ff9fbe", 34);
      showDamagePopup(zombie.x + zombie.w, zombie.y - 10, "Pig 10%", false);
      return true;
    }
    if (source.startsWith("shuttle")) {
      const hit = rollShuttleHit(projectile, zombie.hp, zombie.maxHp || zombie.hp);
      damageZombie(zombie, hit.amount);
      maybeTriggerOppression(source, zombie.x + zombie.w, zombie.y);
      showRacketImpact(zombie.x + zombie.w / 2, zombie.y + zombie.h / 2, projectile, impactRadius);
      showDamagePopup(zombie.x + zombie.w, zombie.y - 10, hit.crit ? `Jump Crit ${hit.amount}` : projectile ? projectile.skinWord : "Shuttle Hit", true);
      return true;
    }
    const hit = rollPlayerDamage();
    damageZombie(zombie, hit.amount);
    if (!projectile) showEquippedRacketMeleeImpact(zombie.x + zombie.w / 2, zombie.y + zombie.h / 2, hit.crit ? 72 : 54);
    showDamagePopup(zombie.x + zombie.w, zombie.y, hit.amount, hit.crit);
    return true;
  }

  for (const monster of racketMonsters) {
    if (!monster.alive || overlaps(hitbox, monster) === false) continue;
    if (projectile && projectile.execute) {
      damageRacketMonster(monster, 2);
      return true;
    }
    if (projectile && projectile.kind === "pig") {
      damageRacketMonster(monster, 1);
      return true;
    }
    if (source.startsWith("shuttle")) {
      const hit = rollShuttleHit(projectile, monster.hp, monster.maxHp);
      damageRacketMonster(monster, hit.amount);
      maybeTriggerOppression(source, monster.x + monster.w, monster.y);
      showRacketImpact(monster.x + monster.w / 2, monster.y + monster.h / 2, projectile, impactRadius);
      showDamagePopup(monster.x + monster.w, monster.y - 10, hit.crit ? `Jump Crit ${hit.amount}` : projectile ? projectile.skinWord : "Shuttle Hit", true);
      return true;
    }
    const hit = rollPlayerDamage();
    damageRacketMonster(monster, hit.amount);
    if (!projectile) showEquippedRacketMeleeImpact(monster.x + monster.w / 2, monster.y + monster.h / 2, hit.crit ? 72 : 54);
    showDamagePopup(monster.x + monster.w, monster.y, hit.amount, hit.crit);
    return true;
  }

  if (boss && boss.active && !boss.defeated && boss.type === "rabbitBoss") {
    for (const minion of boss.minions || []) {
      if (!minion.alive || !overlaps(hitbox, minion)) continue;
      if (projectile && projectile.execute) {
        damageRabbitGuard(minion, { amount: Math.max(2, Math.ceil(minion.hp * 0.5 * getNoShoesDamageBoost())), crit: true });
      } else if (projectile && projectile.kind === "pig") {
        damageRabbitGuard(minion, { amount: pigShotDamage(minion.hp, minion.maxHp), crit: false });
      } else if (source.startsWith("shuttle")) {
        const hit = rollShuttleHit(projectile, minion.hp, minion.maxHp);
        damageRabbitGuard(minion, hit);
        showRacketImpact(minion.x + minion.w / 2, minion.y + minion.h / 2, projectile, impactRadius);
      } else {
        damageRabbitGuard(minion, rollPlayerDamage());
        if (!projectile) showEquippedRacketMeleeImpact(minion.x + minion.w / 2, minion.y + minion.h / 2, 50);
      }
      return true;
    }
  }

  for (const extraBoss of extraBosses) {
    if (!extraBoss.active || extraBoss.defeated || extraBoss.type !== "rabbitBoss") continue;
    for (const minion of extraBoss.minions || []) {
      if (!minion.alive || !overlaps(hitbox, minion)) continue;
      if (projectile && projectile.execute) {
        damageRabbitGuard(minion, { amount: Math.max(2, Math.ceil(minion.hp * 0.5 * getNoShoesDamageBoost())), crit: true });
      } else if (projectile && projectile.kind === "pig") {
        damageRabbitGuard(minion, { amount: pigShotDamage(minion.hp, minion.maxHp), crit: false });
      } else if (source.startsWith("shuttle")) {
        const hit = rollShuttleHit(projectile, minion.hp, minion.maxHp);
        damageRabbitGuard(minion, hit);
        showRacketImpact(minion.x + minion.w / 2, minion.y + minion.h / 2, projectile, impactRadius);
      } else {
        damageRabbitGuard(minion, rollPlayerDamage());
        if (!projectile) showEquippedRacketMeleeImpact(minion.x + minion.w / 2, minion.y + minion.h / 2, 50);
      }
      return true;
    }
  }

  for (const roller of rollers) {
    if (!roller.alive || roller.invulnerable > 0 || !overlaps(hitbox, roller)) continue;
    if (projectile && projectile.execute) {
      executeSlashTarget({ target: roller, type: "roller", projectile });
      return true;
    }
    if (projectile && projectile.kind === "pig") {
      roller.alive = false;
      addKillPassiveStack(roller);
      addStars(1);
      showImpact(roller.x + roller.w / 2, roller.y + roller.h / 2, "#ff9fbe", 34);
      showDamagePopup(roller.x + roller.w, roller.y, "Pig Hit", false);
      return true;
    }
    if (source.startsWith("shuttle")) {
      roller.alive = false;
      addKillPassiveStack(roller);
      addStars(2);
      maybeTriggerOppression(source, roller.x + roller.w, roller.y);
      showRacketImpact(roller.x + roller.w / 2, roller.y + roller.h / 2, projectile, impactRadius);
      showDamagePopup(roller.x + roller.w, roller.y, "Stomp Hit", true);
      return true;
    }
    const hit = rollPlayerDamage();
    roller.alive = false;
    addKillPassiveStack(roller);
    addStars(hit.crit ? 8 : 2);
    showImpact(roller.x + roller.w / 2, roller.y + roller.h / 2, hit.crit ? "#ffd94d" : "#ff9fbe", hit.crit ? 58 : 38);
    if (!projectile) showEquippedRacketMeleeImpact(roller.x + roller.w / 2, roller.y + roller.h / 2, hit.crit ? 68 : 50);
    showDamagePopup(roller.x + roller.w, roller.y, hit.amount, hit.crit);
    return true;
  }

  if (boss && boss.active && !boss.defeated && boss.invulnerable <= 0 && overlaps(hitbox, boss)) {
    if (projectile && projectile.execute) {
      executeSlashTarget({ target: boss, type: "boss", projectile });
      player.executeCooldown = EXECUTE_BOSS_COOLDOWN;
      return true;
    }
    if (projectile && projectile.kind === "pig") {
      const hp = boss.mech ? boss.mechHp : boss.hp;
      damageBoss(boss, { amount: pigShotDamage(hp, boss.mech ? boss.mechMaxHp : boss.maxHp), crit: false });
      return true;
    }
    if (source.startsWith("shuttle")) {
      if (projectile && projectile.jumpSmash && boss.type === "rabbitBoss") {
        showRacketImpact(boss.x + boss.w / 2, boss.y + boss.h / 2, projectile, impactRadius + 10);
        showDamagePopup(boss.x + boss.w, boss.y - 8, "Rabbit Boss Immune", false);
        return true;
      }
      const hit = rollShuttleHit(projectile, boss.mech ? boss.mechHp : boss.hp, boss.mech ? boss.mechMaxHp : boss.maxHp);
      damageBoss(boss, hit);
      maybeTriggerOppression(source, boss.x + boss.w, boss.y);
      showRacketImpact(boss.x + boss.w / 2, boss.y + boss.h / 2, projectile, impactRadius + 18);
      showDamagePopup(boss.x + boss.w, boss.y - 8, hit.crit ? `Jump Crit ${hit.amount}` : projectile ? projectile.hitWord : "Heavy Hit", true);
      return true;
    }
    damageBoss(boss, rollPlayerDamage());
    if (!projectile) showEquippedRacketMeleeImpact(boss.x + boss.w / 2, boss.y + boss.h / 2, 68);
    return true;
  }

  for (const extraBoss of extraBosses) {
    if (!extraBoss.active || extraBoss.defeated || extraBoss.invulnerable > 0 || !overlaps(hitbox, extraBoss)) continue;
    if (projectile && projectile.execute) {
      executeSlashTarget({ target: extraBoss, type: "extraBoss", projectile });
      player.executeCooldown = EXECUTE_BOSS_COOLDOWN;
      return true;
    }
    if (projectile && projectile.kind === "pig") {
      damageExtraBoss(extraBoss, { amount: pigShotDamage(extraBoss.hp, extraBoss.maxHp), crit: false });
      return true;
    }
    if (source.startsWith("shuttle")) {
      if (projectile && projectile.jumpSmash && extraBoss.type === "rabbitBoss") {
        showRacketImpact(extraBoss.x + extraBoss.w / 2, extraBoss.y + extraBoss.h / 2, projectile, impactRadius + 10);
        showDamagePopup(extraBoss.x + extraBoss.w, extraBoss.y - 8, "Rabbit Boss Immune", false);
        return true;
      }
      const hit = rollShuttleHit(projectile, extraBoss.hp, extraBoss.maxHp);
      damageExtraBoss(extraBoss, hit);
      maybeTriggerOppression(source, extraBoss.x + extraBoss.w, extraBoss.y);
      showRacketImpact(extraBoss.x + extraBoss.w / 2, extraBoss.y + extraBoss.h / 2, projectile, impactRadius + 18);
      showDamagePopup(extraBoss.x + extraBoss.w, extraBoss.y - 8, hit.crit ? `Jump Crit ${hit.amount}` : projectile ? projectile.hitWord : "Heavy Hit", true);
      return true;
    }
    damageExtraBoss(extraBoss, rollPlayerDamage());
    if (!projectile) showEquippedRacketMeleeImpact(extraBoss.x + extraBoss.w / 2, extraBoss.y + extraBoss.h / 2, 68);
    return true;
  }

  return false;
}

function rollPlayerDamage() {
  const attackBoost = (player && player.oppressionTimer > 0 ? 1.22 : 1) * getNoShoesDamageBoost();
  if (Math.random() >= 0.1) return { amount: Math.ceil(1 * attackBoost), crit: false };
  const crits = [3, 5, 8, 12, 18];
  const amount = Math.ceil(crits[Math.floor(Math.random() * crits.length)] * attackBoost);
  return { amount, crit: true };
}

function fifthDamage(currentHp, maxHp) {
  const boost = (player && player.oppressionTimer > 0 ? 1.22 : 1) * getNoShoesDamageBoost();
  return Math.max(1, Math.ceil(((maxHp || currentHp || 1) / 7) * boost));
}

function rollShuttleHit(projectile, currentHp, maxHp) {
  if (!projectile || !projectile.jumpSmash) return { amount: fifthDamage(currentHp, maxHp), crit: false };
  const boost = (player && player.oppressionTimer > 0 ? 1.22 : 1) * getNoShoesDamageBoost();
  player.jumpSmashCritCounter = (player.jumpSmashCritCounter || 0) + 1;
  const crit = player.jumpSmashCritCounter % 3 === 0;
  const hpBase = maxHp || currentHp || 1;
  const luckyScale = 0.62 + Math.random() * 1.28;
  const critScale = crit ? 1.85 : 1;
  return {
    amount: Math.max(2, Math.ceil((hpBase / 5) * luckyScale * critScale * boost)),
    crit,
  };
}

function pressureDamage(currentHp, maxHp) {
  return Math.max(1, Math.ceil((maxHp || currentHp || 1) * 0.24 * getNoShoesDamageBoost()));
}

function pigShotDamage(currentHp, maxHp) {
  return Math.max(1, Math.ceil((maxHp || currentHp || 1) * 0.1));
}

function randomGhostWindColor(seed = Math.random()) {
  return GHOST_WIND_COLORS[Math.floor(Math.abs(seed) * GHOST_WIND_COLORS.length) % GHOST_WIND_COLORS.length];
}

function resolveRacketEffectColor(racket) {
  if (racket && racket.trail === "ghostWind") return randomGhostWindColor();
  return racket ? racket.shuttle : "#56d3ff";
}

function maybeTriggerOppression(source, x, y) {
  if (source !== "shuttle:backhandSmash") return;
  if (player.oppressionCooldown > 0) {
    showDamagePopup(x, y - 20, "Pressure CD", false);
    return;
  }
  player.oppressionTimer = 12;
  player.oppressionCooldown = 32;
  player.oppressionPulse = 1.2;
  showImpact(player.x + player.w / 2, player.y + player.h, "#8ce7ff", 86);
  showDamagePopup(player.x + player.w / 2, player.y - 28, "Pressure Boost", true);
}

function showImpact(x, y, color = "#ffe27a", radius = 38) {
  const skin = getSkinEffect();
  const racket = getEquippedRacket();
  const isGhostWind = racket.trail === "ghostWind" && (color === racket.impact || GHOST_WIND_COLORS.includes(color));
  const boostedRadius = radius * EPIC_EFFECT_MULTIPLIER * (isGhostWind ? 1.18 : 1);
  impactEffects.push({
    x,
    y,
    color,
    skinColor: skin.impact,
    radius: 8,
    maxRadius: boostedRadius,
    grow: boostedRadius * 5.4,
    ttl: isGhostWind ? 0.42 : 0.34,
    style: isGhostWind ? "ghostWind" : skin.style || "heart",
  });
}

function showRacketImpact(x, y, projectile, radius = 46) {
  const style = projectile ? projectile.tailStyle || projectile.trail || "spark" : "spark";
  const color = projectile ? projectile.tailColor || projectile.racketImpact || projectile.impact : "#56d3ff";
  const accent = projectile ? projectile.tailAccent || projectile.lightning || color : "#ffffff";
  const boostedRadius = radius * EPIC_EFFECT_MULTIPLIER;
  impactEffects.push({
    x,
    y,
    color,
    skinColor: accent,
    radius: 8,
    maxRadius: boostedRadius,
    grow: boostedRadius * 5.2,
    ttl: style === "ghostWind" ? 0.42 : 0.36,
    style: `racket-${style}`,
  });
  if (style === "ghostWind") showGhostWindCage(x, y, radius * 1.15);
}

function showGhostWindCage(x, y, radius = 56) {
  impactEffects.push({
    x,
    y,
    color: "#6bd6a0",
    skinColor: randomGhostWindColor(Math.random()),
    radius: 8,
    maxRadius: radius * 0.92,
    grow: radius * 6.2,
    ttl: 0.44,
    style: "ghostWindCage",
  });
}

function showEquippedRacketMeleeImpact(x, y, radius = 52) {
  const racket = getEquippedRacket();
  if (!racket || racket.trail !== "ghostWind") return;
  showImpact(x, y, randomGhostWindColor(Math.random()), radius);
  showGhostWindCage(x, y, radius);
}

function getEquippedRacket() {
  return SHOP_RACKETS[saveData.equippedRacket] || {
    frame: "#4cc4dc",
    frame2: "#2f2358",
    string: "rgba(255, 255, 255, 0.76)",
    shaft: "#2f2358",
    grip: "#121722",
    label: "START",
    shuttle: "#56d3ff",
    lightning: "#ffffff",
    impact: "#56d3ff",
    trail: "spark",
    hitWord: "Basic Smash",
    speed: 1,
    radius: 44,
  };
}

function getSkinEffect() {
  return SKIN_EFFECTS[saveData.equippedSkin] || SKIN_EFFECTS.bear;
}

function findNearestVisibleEnemy() {
  const visibleMin = cameraX;
  const visibleMax = cameraX + VIEW_WIDTH;
  const candidates = [];
  const addCandidate = (target, type) => {
    if (!target || target.defeated || target.alive === false) return;
    const center = target.x + target.w / 2;
    if (center < visibleMin || center > visibleMax) return;
    candidates.push({ target, type, distance: Math.abs(center - (player.x + player.w / 2)) });
  };
  rollers.forEach((target) => addCandidate(target, "roller"));
  zombies.forEach((target) => addCandidate(target, "zombie"));
  if (boss && boss.type === "rabbitBoss") {
    (boss.minions || []).forEach((target) => addCandidate(target.alive ? target : null, "rabbitGuard"));
  }
  extraBosses.forEach((extraBoss) => {
    if (extraBoss.type !== "rabbitBoss") return;
    (extraBoss.minions || []).forEach((target) => addCandidate(target.alive ? target : null, "rabbitGuard"));
  });
  addCandidate(boss && boss.active ? boss : null, "boss");
  extraBosses.forEach((target) => addCandidate(target.active ? target : null, "extraBoss"));
  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0] || null;
}

function killTargetByOppression(entry) {
  const { target, type } = entry;
  scorchMarks.push({ x: target.x + target.w / 2, y: GROUND_Y - 4, radius: Math.max(34, target.w * 0.52), ttl: 8 });
  showImpact(target.x + target.w / 2, target.y + target.h / 2, "#ff8a45", 84);
  showDamagePopup(target.x + target.w, target.y - 20, "Pressure Burst", true);
  if (type === "zombie") damageZombie(target, pressureDamage(target.hp, target.maxHp || target.hp));
  else if (type === "roller") {
    target.alive = false;
    addKillPassiveStack(target);
    addStars(5);
  } else if (type === "boss") {
    damageBoss(target, {
      amount: pressureDamage(target.mech ? target.mechHp : target.hp, target.mech ? target.mechMaxHp : target.maxHp),
      crit: true,
    });
  } else if (type === "extraBoss") {
    damageExtraBoss(target, { amount: pressureDamage(target.hp, target.maxHp), crit: true });
  } else if (type === "rabbitGuard") {
    damageRabbitGuard(target, { amount: pressureDamage(target.hp, target.maxHp), crit: true });
  }
}

function addKillPassiveStack(target = null) {
  if (!player || (target && target.passiveCounted)) return;
  if (target) target.passiveCounted = true;
  if (saveData.equippedBackground === "skyClouds") rainbowTimer = 3;
  if (player.passiveInvincibleTimer > 0 || player.passiveCooldown > 0) return;
  player.passiveStacks = Math.min(KILL_PASSIVE_REQUIRED_STACKS, player.passiveStacks + 1);
  showDamagePopup(player.x + player.w / 2, player.y - 54, `Passive ${player.passiveStacks}/${KILL_PASSIVE_REQUIRED_STACKS}`, false);
  if (player.passiveStacks >= KILL_PASSIVE_REQUIRED_STACKS) {
    player.passiveStacks = 0;
    player.passiveInvincibleTimer = KILL_PASSIVE_DURATION;
    player.passiveCooldown = KILL_PASSIVE_COOLDOWN;
    showImpact(player.x + player.w / 2, player.y + player.h / 2, "#f2eee4", 96);
    showDamagePopup(player.x + player.w / 2, player.y - 70, "Invincible Dance", true);
  }
}

function monstersAreDancing() {
  return player && player.passiveInvincibleTimer > 0;
}

function showDamagePopup(worldX, worldY, amount, crit) {
  const isNumber = typeof amount === "number";
  damagePopups.push({
    x: worldX,
    y: worldY,
    text: crit && isNumber ? `闂佸搫妫欏娆撳吹?${amount}` : amount.toString(),
    crit,
    ttl: 0.9,
    vy: crit ? -58 : -34,
  });
}

function getTurretBox(turret) {
  return { x: turret.x - 12, y: turret.y - 4, w: 70, h: 48 };
}

function applyPoison(source) {
  player.poisonTicksRemaining = 3;
  player.poisonTickTimer = 1;
  player.poisonSource = source || null;
}

function spawnBullet({ x, y, vx, vy, kind, source = null, antiAir = false }) {
  bullets.push({
    x,
    y,
    vx,
    vy,
    kind,
    source,
    antiAir,
    w: kind === "machine" ? 18 : kind === "venom" ? 18 : 14,
    h: kind === "venom" ? 18 : 8,
    ttl: 4,
    alive: true,
  });
}

function updateBossOverdrive(target, dt, distance, playerCenter, bossCenter) {
  if (!target || target.defeated || !(target.type === "gundamBoss" || target.mech) || !target.rageTriggered) return;
  if (distance > 840) return;
  target.overdriveCooldown = Math.max(0, (target.overdriveCooldown || 0) - dt);
  if (target.overdriveCooldown > 0) return;

  const muzzleY = target.y + target.h * 0.42;
  const playerY = player.y + player.h * 0.38;
  const dir = playerCenter < bossCenter ? -1 : 1;
  const antiAir = !player.onGround || player.vy < -60;
  const pitch = antiAir ? clamp(Math.atan2(playerY - muzzleY, Math.max(90, distance)), -0.95, -0.08) : 0;
  const speed = antiAir ? 720 : 650;
  spawnBullet({
    x: bossCenter + dir * (target.w * 0.42),
    y: muzzleY,
    vx: Math.cos(pitch) * speed * dir,
    vy: antiAir ? Math.sin(pitch) * speed : Math.sin(performance.now() / 110 + target.x) * 24,
    kind: "machine",
    antiAir,
    source: target,
  });
  target.overdriveCooldown = antiAir ? 0.48 : 0.58;
}

function updateBoss(dt) {
  if (!boss || boss.defeated) return;

  if (player.x > BOSS_ARENA_X - 700) boss.active = true;
  if (!boss.active) return;

  const bossCenter = boss.x + boss.w / 2;
  const playerCenter = player.x + player.w / 2;
  const distance = Math.abs(playerCenter - bossCenter);
  const lostBossHealth = boss.mech ? boss.mechMaxHp - boss.mechHp : boss.maxHp - boss.hp;
  const difficulty = 1 + lostBossHealth * (boss.mech ? 0.042 : 0.065);
  const phaseBoost = getBossPhaseBoost(boss);
  const attackRange = (boss.type === "rabbitBoss" ? 154 : boss.mech ? 184 : 128) * phaseBoost.range;
  boss.dir = playerCenter < bossCenter ? -1 : 1;
  boss.attackCooldown = Math.max(0, boss.attackCooldown - dt);
  boss.attackTimer = Math.max(0, boss.attackTimer - dt);
  boss.invulnerable = Math.max(0, boss.invulnerable - dt);
  boss.empoweredTimer = Math.max(0, (boss.empoweredTimer || 0) - dt);
  boss.stepTimer += dt;
  updateBossOverdrive(boss, dt, distance, playerCenter, bossCenter);

  boss.minions = boss.type === "rabbitBoss" ? (boss.minions || []).filter((minion) => minion.alive) : boss.minions;
  if (boss.type === "rabbitBoss") updateRabbitGuards(boss, dt);

  if (distance > attackRange) {
    const speed = boss.type === "rabbitBoss" ? 228 : boss.mech ? 150 + difficulty * 26 : 160 + difficulty * 40;
    boss.vx = approach(boss.vx, boss.dir * speed * phaseBoost.speed * (boss.empoweredTimer > 0 ? 1.3 : 1), 1040 * dt);
  } else {
    boss.vx = approach(boss.vx, 0, 1200 * dt);
    if (boss.attackCooldown <= 0) {
      boss.attackTimer = boss.type === "rabbitBoss" ? 0.42 : boss.mech ? 0.48 : 0.36;
      boss.attackCooldown = (boss.type === "rabbitBoss" ? 0.64 : boss.mech
        ? Math.max(0.72, 1.28 - lostBossHealth * 0.035)
        : Math.max(0.5, 1.08 - lostBossHealth * 0.06)) * phaseBoost.cooldown;
    }
  }

  if (boss.onGround && distance > 330 && boss.attackCooldown < 0.5 && !boss.mech && boss.type !== "rabbitBoss") {
    boss.vy = -620;
    boss.onGround = false;
  }

  boss.vy += GRAVITY * dt;
  boss.x += boss.vx * dt;
  boss.y += boss.vy * dt;
  boss.x = clamp(boss.x, BOSS_ARENA_X + 92, BOSS_ARENA_X + 1760);

  if (boss.y + boss.h >= GROUND_Y) {
    boss.y = GROUND_Y - boss.h;
    boss.vy = 0;
    boss.onGround = true;
  }
}

function updateExtraBosses(dt) {
  for (const extraBoss of extraBosses) {
    if (extraBoss.defeated) continue;
    if (player.x > extraBoss.arenaX - 760) extraBoss.active = true;
    if (!extraBoss.active) continue;

    const bossCenter = extraBoss.x + extraBoss.w / 2;
    const playerCenter = player.x + player.w / 2;
    const distance = Math.abs(playerCenter - bossCenter);
    const phaseBoost = getBossPhaseBoost(extraBoss);
    const attackRange = (extraBoss.type === "gundamBoss" ? 196 : extraBoss.type === "rabbitBoss" ? 154 : 150) * phaseBoost.range;
    extraBoss.dir = playerCenter < bossCenter ? -1 : 1;
    extraBoss.attackCooldown = Math.max(0, extraBoss.attackCooldown - dt);
    extraBoss.attackTimer = Math.max(0, extraBoss.attackTimer - dt);
    extraBoss.invulnerable = Math.max(0, extraBoss.invulnerable - dt);
    extraBoss.empoweredTimer = Math.max(0, (extraBoss.empoweredTimer || 0) - dt);
    updateBossOverdrive(extraBoss, dt, distance, playerCenter, bossCenter);
    if (extraBoss.type === "rabbitBoss") {
      extraBoss.minions = (extraBoss.minions || []).filter((minion) => minion.alive);
      updateRabbitGuards(extraBoss, dt);
    }

    if (distance > attackRange) {
      const speed = (extraBoss.type === "gundamBoss" ? 176 : extraBoss.type === "rabbitBoss" ? 228 : 206) * phaseBoost.speed * (extraBoss.empoweredTimer > 0 ? 1.3 : 1);
      extraBoss.vx = approach(extraBoss.vx, extraBoss.dir * speed, 980 * dt);
    } else {
      extraBoss.vx = approach(extraBoss.vx, 0, 1100 * dt);
      if (extraBoss.attackCooldown <= 0) {
        extraBoss.attackTimer = extraBoss.type === "gundamBoss" ? 0.5 : extraBoss.type === "rabbitBoss" ? 0.42 : 0.38;
        extraBoss.attackCooldown = (extraBoss.type === "gundamBoss" ? 0.84 : extraBoss.type === "rabbitBoss" ? 0.64 : 0.72) * phaseBoost.cooldown;
      }
    }

    extraBoss.vy += GRAVITY * dt;
    extraBoss.x += extraBoss.vx * dt;
    extraBoss.y += extraBoss.vy * dt;
    extraBoss.x = clamp(extraBoss.x, extraBoss.arenaX + 80, extraBoss.arenaX + 1780);

    if (extraBoss.y + extraBoss.h >= GROUND_Y) {
      extraBoss.y = GROUND_Y - extraBoss.h;
      extraBoss.vy = 0;
      extraBoss.onGround = true;
    }
  }
}

function handlePlayerAttack() {
  if (getBareHandsEnabled()) {
    player.attackHitActive = false;
    return;
  }
  if (!player.attackHitActive) return;
  const hitbox = getPlayerAttackBox();

  if (hitDamageableTarget(hitbox)) {
    player.attackHitActive = false;
    return;
  }

  for (const zombie of zombies) {
    if (!zombie.alive || zombie.invulnerable > 0 || !overlaps(hitbox, zombie)) continue;
    damageZombie(zombie, 1);
    player.attackHitActive = false;
    return;
  }

  for (const roller of rollers) {
    if (!roller.alive || roller.invulnerable > 0 || !overlaps(hitbox, roller)) continue;
    roller.alive = false;
    addKillPassiveStack(roller);
    addStars(2);
    player.attackHitActive = false;
    return;
  }

  if (boss && boss.active && !boss.defeated && boss.invulnerable <= 0 && overlaps(hitbox, boss)) {
    if (boss.mech) {
      boss.mechHp -= 1;
    } else {
      boss.hp -= 1;
    }
    boss.invulnerable = 0.34;
    boss.vx = player.dir * (boss.mech ? 150 : 260);
    boss.vy = Math.min(boss.vy, boss.mech ? -160 : -260);
    const defeatedThisHit = boss.mech ? boss.mechHp <= 0 : boss.hp <= 0;
    addStars(defeatedThisHit ? 15 : 3);
    player.attackHitActive = false;

    if (!boss.mech && boss.hp <= 0) {
      boss.hp = 0;
      enterBossMech();
    } else if (boss.mech && boss.mechHp <= 0) {
      boss.mechHp = 0;
      boss.defeated = true;
      addKillPassiveStack(boss);
      boss.attackTimer = 0;
    }
  }
}

function triggerExecuteSlash() {
  const mode = SHUTTLE_MODES[player.shuttleModeIndex] || SHUTTLE_MODES[0];
  if (mode.id !== "forehandDrive") {
    showDamagePopup(player.x + player.w / 2, player.y - 38, "Use Forehand Drive", false);
    return;
  }
  if (player.executeCooldown > 0) {
    showDamagePopup(player.x + player.w / 2, player.y - 38, "Slash CD", false);
    return;
  }

  launchExecuteShuttle();
  player.executeCooldown = EXECUTE_NORMAL_COOLDOWN;
  player.attackTimer = Math.max(player.attackTimer, 0.24);
  player.attackHitActive = false;
  playerAfterimageTrail.push({
    x: player.x,
    y: player.y,
    dir: player.dir,
    vx: player.dir * MOVE_SPEED * 1.45,
    attack: true,
    color: "#f2eee4",
    time: performance.now(),
  });
}

function launchExecuteShuttle() {
  const racket = getEquippedRacket();
  const skin = getSkinEffect();
  const effectColor = resolveRacketEffectColor(racket);
  const lightningColor = racket.trail === "ghostWind" ? randomGhostWindColor(Math.random()) : "#1f3f3b";
  playerShots.push({
    x: player.x + player.w / 2 + player.dir * 50,
    y: player.y + 22,
    vx: player.dir * 1920 * racket.speed,
    vy: 0,
    w: 34,
    h: 18,
    kind: "shuttle",
    execute: true,
    color: racket.trail === "ghostWind" ? effectColor : "#f2eee4",
    lightning: lightningColor,
    impact: racket.trail === "ghostWind" ? effectColor : skin.impact || racket.impact,
    racketImpact: racket.trail === "ghostWind" ? effectColor : racket.impact,
    trail: racket.trail,
    tailStyle: racket.trail,
    tailColor: racket.trail === "ghostWind" ? effectColor : racket.impact,
    tailAccent: lightningColor,
    hitWord: "Execute Shuttle",
    skinWord: skin.word,
    radius: racket.radius * skin.radius + 18,
    mode: "executeForehand",
    gravity: 0,
    alive: true,
    ttl: 0.95,
    spin: 0,
  });
  showDamagePopup(player.x + player.w / 2, player.y - 34, "Execute Shuttle", true);
  showImpact(player.x + player.dir * 84, player.y + 28, "#f2eee4", 56);
}

function findExecuteSlashTarget() {
  const startX = player.x + player.w / 2;
  const minX = player.dir > 0 ? startX : startX - 620;
  const maxX = player.dir > 0 ? startX + 620 : startX;
  const minY = player.y - 95;
  const maxY = player.y + player.h + 95;
  const candidates = [];
  const addCandidate = (target, type) => {
    if (!target) return;
    if (target.alive === false || target.defeated) return;
    if (target.active === false) return;
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    if (cx < minX || cx > maxX || cy < minY || cy > maxY) return;
    if (cx < cameraX - 120 || cx > cameraX + VIEW_WIDTH + 120) return;
    candidates.push({ target, type, distance: Math.abs(cx - startX) });
  };

  turrets.forEach((target) => addCandidate(target, "turret"));
  zombies.forEach((target) => addCandidate(target, "zombie"));
  rollers.forEach((target) => addCandidate(target, "roller"));
  bullets.forEach((target) => addCandidate(target, "bullet"));
  addCandidate(boss && boss.active ? boss : null, "boss");
  extraBosses.forEach((target) => addCandidate(target.active ? target : null, "extraBoss"));
  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0] || null;
}

function executeSlashTarget(entry) {
  const { target, type, projectile } = entry;
  const x = target.x + target.w / 2;
  const y = target.y + target.h / 2;
  if (projectile) {
    showRacketImpact(x, y, projectile, 96);
    showRacketImpact(x + player.dir * 18, y, projectile, 64);
  } else {
    showImpact(x, y, "#f2eee4", 96);
    showImpact(x + player.dir * 18, y, "#1f3f3b", 72);
  }
  showDamagePopup(target.x + target.w, target.y - 18, "Execute", true);

  if (type === "turret") {
    target.alive = false;
    addKillPassiveStack(target);
    addStars(10);
  } else if (type === "bullet") {
    target.alive = false;
  } else if (type === "zombie") {
    damageZombie(target, Math.max(1, Math.ceil((target.maxHp || target.hp || 1) * 0.5 * getNoShoesDamageBoost())));
  } else if (type === "roller") {
    target.alive = false;
    addKillPassiveStack(target);
    addStars(5);
  } else if (type === "boss") {
    const hp = target.mech ? target.mechHp : target.hp;
    damageBoss(target, { amount: Math.max(2, Math.ceil(hp * 0.21 * getNoShoesDamageBoost())), crit: true });
  } else if (type === "extraBoss") {
    damageExtraBoss(target, { amount: Math.max(2, Math.ceil(target.hp * 0.21 * getNoShoesDamageBoost())), crit: true });
  }
}

function damageBoss(targetBoss, hit) {
  hit = applyCritImmunity(targetBoss, hit);
  if (targetBoss.mech) {
    targetBoss.mechHp -= hit.amount;
  } else {
    targetBoss.hp -= hit.amount;
  }
  targetBoss.invulnerable = hit.crit ? 0.18 : 0.34;
  targetBoss.vx = player.dir * (targetBoss.mech ? 150 : 260);
  targetBoss.vy = Math.min(targetBoss.vy, targetBoss.mech ? -160 : -260);
  showImpact(targetBoss.x + targetBoss.w / 2, targetBoss.y + targetBoss.h / 2, hit.crit ? "#ffd94d" : "#ff6f72", hit.crit ? 70 : 48);
  showDamagePopup(targetBoss.x + targetBoss.w, targetBoss.y + 8, hit.amount, hit.crit);
  maybeTriggerBossRage(targetBoss);

  if (!targetBoss.mech && targetBoss.hp <= 0) {
    targetBoss.hp = 0;
    targetBoss.defeated = true;
    addKillPassiveStack(targetBoss);
    targetBoss.attackTimer = 0;
    awardPistol();
    addStars(25);
  } else if (targetBoss.mech && targetBoss.mechHp <= 0) {
    targetBoss.mechHp = 0;
    targetBoss.defeated = true;
    addKillPassiveStack(targetBoss);
    targetBoss.attackTimer = 0;
    addStars(25);
  } else {
    addStars(hit.crit ? 5 : 3);
    maybeSummonRabbitGuards(targetBoss);
  }
}

function damageExtraBoss(extraBoss, hit) {
  hit = applyCritImmunity(extraBoss, hit);
  extraBoss.hp -= hit.amount;
  extraBoss.invulnerable = hit.crit ? 0.18 : 0.34;
  extraBoss.vx = player.dir * (extraBoss.type === "gundamBoss" ? 120 : 210);
  extraBoss.vy = Math.min(extraBoss.vy, -140);
  showImpact(extraBoss.x + extraBoss.w / 2, extraBoss.y + extraBoss.h / 2, hit.crit ? "#ffd94d" : "#ff6f72", hit.crit ? 70 : 48);
  showDamagePopup(extraBoss.x + extraBoss.w, extraBoss.y + 8, hit.amount, hit.crit);
  maybeTriggerBossRage(extraBoss);
  maybeSummonZombieBossPack(extraBoss);
  maybeSummonGundamDrones(extraBoss);

  if (extraBoss.hp <= 0) {
    extraBoss.hp = 0;
    extraBoss.defeated = true;
    addKillPassiveStack(extraBoss);
    extraBoss.attackTimer = 0;
    addStars(extraBoss.rewardStars);
  } else {
    addStars(hit.crit ? 5 : 3);
    maybeSummonRabbitGuards(extraBoss);
  }
}

function applyCritImmunity(target, hit) {
  if (!target || !hit || !hit.crit || (target.critImmune || 0) <= 0) return hit;
  target.critImmune -= 1;
  showDamagePopup(target.x + target.w / 2, target.y - 18, `Crit Immune ${target.critImmune}`, false);
  return { ...hit, crit: false, amount: Math.max(1, Math.ceil(hit.amount * 0.35)) };
}

function getBossHealthRatio(target) {
  if (!target) return 1;
  if (target.mech) return Math.max(0, target.mechHp / target.mechMaxHp);
  return Math.max(0, target.hp / target.maxHp);
}

function getBossPhaseBoost(target) {
  const raging = target && (target.rageTriggered || target.empoweredTimer > 0 || getBossHealthRatio(target) <= BOSS_RAGE_THRESHOLD);
  return raging ? { speed: 1.22, cooldown: 0.72, range: 1.12 } : { speed: 1, cooldown: 1, range: 1 };
}

function maybeTriggerBossRage(target) {
  if (!target || target.defeated || target.rageTriggered || getBossHealthRatio(target) > BOSS_RAGE_THRESHOLD) return;
  if (target.mech ? target.mechHp <= 0 : target.hp <= 0) return;
  target.rageTriggered = true;
  target.empoweredTimer = Math.max(target.empoweredTimer || 0, BOSS_RAGE_DURATION);
  target.invulnerable = Math.max(target.invulnerable || 0, 0.85);
  target.attackCooldown = Math.min(target.attackCooldown || 1, 0.28);
  if (target.type === "gundamBoss" || target.mech) target.critImmune = (target.critImmune || 0) + 2;
  showImpact(target.x + target.w / 2, target.y + target.h / 2, "#ff7a45", 112);
  showDamagePopup(target.x + target.w / 2, target.y - 46, "BOSS RAGE", true);
}

function maybeSummonZombieBossPack(extraBoss) {
  if (!extraBoss || extraBoss.type !== "zombieBoss" || extraBoss.defeated) return;
  if (extraBoss.hp <= 0) return;
  const lost = extraBoss.maxHp - extraBoss.hp;
  while (lost >= (extraBoss.nextZombieSummonAt || 16) && extraBoss.nextZombieSummonAt <= extraBoss.maxHp - 8) {
    summonZombieBossPack(extraBoss);
    extraBoss.nextZombieSummonAt += 16;
  }
}

function summonZombieBossPack(extraBoss) {
  const dir = extraBoss.dir || -1;
  for (let i = 0; i < 3; i += 1) {
    const x = clamp(extraBoss.x + dir * (120 + i * 74), extraBoss.arenaX + 70, extraBoss.arenaX + 1700);
    zombies.push({
      x,
      y: GROUND_Y - 78,
      w: 60,
      h: 78,
      min: x - 220,
      max: x + 520,
      speed: 118 + i * 14,
      type: "zombie",
      hp: 5,
      maxHp: 5,
      dir,
      aimDir: dir,
      alive: true,
      poisonCooldown: 0.45 + i * 0.18,
      refund: 0,
      bossSummon: true,
      empoweredTimer: 4,
      invulnerable: 0.35,
    });
  }
  showImpact(extraBoss.x + extraBoss.w / 2, extraBoss.y + extraBoss.h / 2, "#78ff79", 86);
  showDamagePopup(extraBoss.x + extraBoss.w / 2, extraBoss.y - 32, "Zombie Pack", true);
}

function maybeSummonGundamDrones(extraBoss) {
  if (!extraBoss || extraBoss.type !== "gundamBoss" || extraBoss.defeated || extraBoss.hp <= 0) return;
  const lost = extraBoss.maxHp - extraBoss.hp;
  while (lost >= (extraBoss.nextDroneSummonAt || 18) && extraBoss.nextDroneSummonAt <= extraBoss.maxHp - 10) {
    summonGundamDrones(extraBoss);
    extraBoss.nextDroneSummonAt += 18;
  }
}

function summonGundamDrones(extraBoss) {
  const dir = extraBoss.dir || -1;
  for (let i = 0; i < 3; i += 1) {
    const x = clamp(extraBoss.x + dir * (150 + i * 86), extraBoss.arenaX + 80, extraBoss.arenaX + 1740);
    rollers.push({
      x,
      y: GROUND_Y - 54,
      w: 58,
      h: 54,
      min: x - 260,
      max: x + 560,
      speed: 118 + i * 16,
      type: "roller",
      dir,
      aimDir: dir,
      alive: true,
      evolved: true,
      gun: true,
      shootCooldown: 0.35 + i * 0.16,
      empoweredTimer: 5,
      invulnerable: 0.3,
      bossSummon: true,
    });
  }
  showImpact(extraBoss.x + extraBoss.w / 2, extraBoss.y + extraBoss.h / 2, "#8ee5ff", 92);
  showDamagePopup(extraBoss.x + extraBoss.w / 2, extraBoss.y - 34, "Drone Squad", true);
}

function maybeSummonRabbitGuards(extraBoss) {
  if (!extraBoss || extraBoss.type !== "rabbitBoss" || extraBoss.defeated) return;
  const lost = extraBoss.maxHp - extraBoss.hp;
  while (lost >= (extraBoss.nextSummonAt || 8) && extraBoss.nextSummonAt <= extraBoss.maxHp - 8) {
    summonRabbitGuards(extraBoss);
    extraBoss.nextSummonAt += 8;
  }
}

function summonRabbitGuards(extraBoss) {
  const dir = extraBoss.dir || -1;
  extraBoss.minions = (extraBoss.minions || []).filter((minion) => minion.alive);
  for (let i = 0; i < 5; i += 1) {
    const x = clamp(extraBoss.x + dir * (86 + i * 54) - 22, extraBoss.arenaX + 48, extraBoss.arenaX + 1720);
    extraBoss.minions.push({
      x,
      y: GROUND_Y - 58,
      w: 44,
      h: 58,
      hp: 14,
      maxHp: 14,
      critImmune: 3,
      alive: true,
      dir,
      slot: i,
      knockbackTimer: 0,
      parent: extraBoss,
    });
  }
  showImpact(extraBoss.x + extraBoss.w / 2, extraBoss.y + 24, "#b7e85a", 76);
  showDamagePopup(extraBoss.x + extraBoss.w / 2, extraBoss.y - 36, "Rabbit Guards", true);
}

function updateRabbitGuards(rabbitBoss, dt) {
  const guards = (rabbitBoss.minions || []).filter((minion) => minion.alive);
  for (let i = 0; i < guards.length; i += 1) {
    const minion = guards[i];
    const slot = minion.slot ?? i;
    minion.dir = rabbitBoss.dir || minion.dir || -1;
    minion.knockbackTimer = Math.max(0, (minion.knockbackTimer || 0) - dt);
    const row = slot % 2;
    const targetX = clamp(rabbitBoss.x + minion.dir * (92 + slot * 50) - minion.w / 2, rabbitBoss.arenaX + 44, rabbitBoss.arenaX + 1740);
    const targetY = GROUND_Y - minion.h - row * 12;
    const follow = minion.knockbackTimer > 0 ? 5.5 : 10;
    minion.x = approach(minion.x, targetX, follow * 120 * dt);
    minion.y = approach(minion.y, targetY, follow * 90 * dt);
  }
}

function damageRabbitGuard(minion, hit) {
  hit = applyCritImmunity(minion, hit);
  minion.hp -= hit.amount;
  minion.x += player.dir * 26;
  minion.knockbackTimer = 0.22;
  showImpact(minion.x + minion.w / 2, minion.y + minion.h / 2, hit.crit ? "#ffd94d" : "#b7e85a", hit.crit ? 52 : 34);
  showDamagePopup(minion.x + minion.w, minion.y - 8, hit.amount, hit.crit);
  if (minion.hp <= 0) {
    minion.alive = false;
    addKillPassiveStack(minion);
    addStars(1);
  }
}

function awardPistol() {
  saveData.ownedAbilities.pigCompanion = true;
  saveProgress();
  syncShop();
  if (player.hasPistol) return;
  player.hasPistol = true;
  player.pistolMode = "pig";
  syncPigCompanion(true);
  showDamagePopup(player.x + player.w, player.y - 24, "Pistol Ready", true);
}

function enterBossMech() {
  boss.mech = true;
  boss.w = 118;
  boss.h = 132;
  boss.y = GROUND_Y - boss.h;
  boss.vx = 0;
  boss.vy = 0;
  boss.invulnerable = 0.9;
  boss.attackCooldown = 1.15;
  boss.attackTimer = 0;
}

function damageZombie(zombie, amount) {
  zombie.hp -= amount;
  zombie.hitFlash = 0.18;
  showImpact(zombie.x + zombie.w / 2, zombie.y + zombie.h / 2, "#b7ff7b", 38);
  if (zombie.hp <= 0) {
    defeatZombie(zombie);
  }
}

function defeatZombie(zombie) {
  zombie.alive = false;
  addKillPassiveStack(zombie);
  healPlayer(zombie.refund || 0);
  if (player.poisonSource === zombie) {
    player.poisonTicksRemaining = 0;
    player.poisonTickTimer = 0;
    player.poisonSource = null;
  }
  addStars(5);
}

function damageRacketMonster(monster, amount) {
  monster.hp -= amount;
  monster.hitFlash = 0.18;
  showImpact(monster.x + monster.w / 2, monster.y + monster.h / 2, "#f2eee4", 36);
  if (monster.hp <= 0) {
    monster.alive = false;
    addKillPassiveStack(monster);
    addStars(4);
  }
}

function checkBossDamage() {
  if (!boss || !boss.active || boss.defeated) return;

  const bossBody = {
    x: boss.x + 8,
    y: boss.y + 12,
    w: boss.w - 16,
    h: boss.h - 12,
  };
  const bossWeapon = getBossAttackBox();
  const damage = boss.type === "rabbitBoss" ? boss.damage : boss.mech ? 2 : 1;

  if (boss.attackTimer > 0.08 && overlaps(player, bossWeapon)) {
    loseLife(false, empoweredDamage(boss, damage), { source: boss });
    empowerEnemy(boss);
    return;
  }

  if (overlaps(player, bossBody)) {
    loseLife(false, empoweredDamage(boss, damage), { source: boss });
    empowerEnemy(boss);
  }
}

function checkExtraBossDamage() {
  for (const extraBoss of extraBosses) {
    if (!extraBoss.active || extraBoss.defeated) continue;
    const bossBody = {
      x: extraBoss.x + 8,
      y: extraBoss.y + 12,
      w: extraBoss.w - 16,
      h: extraBoss.h - 12,
    };
    const weaponBox = getExtraBossAttackBox(extraBoss);

    if (extraBoss.attackTimer > 0.08 && overlaps(player, weaponBox)) {
      loseLife(false, empoweredDamage(extraBoss, extraBoss.damage), { source: extraBoss });
      empowerEnemy(extraBoss);
      return;
    }

    if (overlaps(player, bossBody)) {
      loseLife(false, empoweredDamage(extraBoss, extraBoss.damage), { source: extraBoss });
      empowerEnemy(extraBoss);
      return;
    }
  }
}

function getPlayerAttackBox() {
  const w = 94;
  const h = 58;
  return {
    x: player.dir > 0 ? player.x + player.w - 8 : player.x - w + 8,
    y: player.y + 12,
    w,
    h,
  };
}

function getBossAttackBox() {
  const w = boss.type === "rabbitBoss" ? 132 : boss.mech ? 132 : 96;
  const h = boss.type === "rabbitBoss" ? 72 : boss.mech ? 78 : 58;
  return {
    x: boss.dir > 0 ? boss.x + boss.w - 6 : boss.x - w + 6,
    y: boss.y + (boss.type === "rabbitBoss" ? 32 : boss.mech ? 32 : 20),
    w,
    h,
  };
}

function getExtraBossAttackBox(extraBoss) {
  const w = extraBoss.type === "gundamBoss" ? 138 : extraBoss.type === "rabbitBoss" ? 132 : 112;
  const h = extraBoss.type === "gundamBoss" ? 80 : extraBoss.type === "rabbitBoss" ? 72 : 66;
  return {
    x: extraBoss.dir > 0 ? extraBoss.x + extraBoss.w - 8 : extraBoss.x - w + 8,
    y: extraBoss.y + (extraBoss.type === "gundamBoss" ? 30 : extraBoss.type === "rabbitBoss" ? 32 : 24),
    w,
    h,
  };
}

function collectHearts() {
  for (const heart of hearts) {
    if (heart.taken) continue;
    const pickup = { x: heart.x - 17, y: heart.y - 17, w: 34, h: 34 };
    if (overlaps(player, pickup)) {
      heart.taken = true;
      addStars(1);
    }
  }
}

function checkHazards() {
  for (const hazard of hazards) {
    if (overlaps(player, hazard)) {
      loseLife(false);
      return;
    }
  }

  for (const roller of rollers) {
    if (!roller.alive || !overlaps(player, roller)) continue;
    const isStomp = player.vy > 0 && player.y + player.h - roller.y < 28;
    if (isStomp) {
      roller.alive = false;
      addKillPassiveStack(roller);
      player.vy = -650;
      tryStompHeal();
      addStars(STOMP_STAR_REWARD);
    } else {
      if (player.invulnerable <= 0) evolveRoller(roller);
      loseLife(false, empoweredDamage(roller, 1), { source: roller });
      empowerEnemy(roller);
    }
    return;
  }
}

function checkPonds(dt) {
  const feet = {
    x: player.x + player.w * 0.18,
    y: player.y + player.h - 8,
    w: player.w * 0.64,
    h: 12,
  };
  const inPond = ponds.some((pond) => overlaps(feet, pond));

  if (!inPond) {
    player.pondDamageTimer = POND_DAMAGE_INTERVAL;
    return;
  }

  player.pondDamageTimer -= dt;
  while (player.pondDamageTimer <= 0 && state === "running") {
    loseLife(false, 1, { ignoreInvulnerability: true, noKnockback: true });
    player.pondDamageTimer += POND_DAMAGE_INTERVAL;
  }
}

function checkZombieDamage() {
  for (const zombie of zombies) {
    if (!zombie.alive || !overlaps(player, zombie)) continue;
    const isStomp = player.vy > 0 && player.y + player.h - zombie.y < 24;

    if (isStomp) {
      player.vy = -660;
      damageZombie(zombie, 1);
    } else {
      loseLife(false, empoweredDamage(zombie, 1), { source: zombie });
      empowerEnemy(zombie);
    }
    return;
  }
}

function checkRacketMonsterDamage() {
  for (const monster of racketMonsters) {
    if (!monster.alive || !overlaps(player, monster)) continue;
    const isStomp = player.vy > 0 && player.y + player.h - monster.y < 24;
    if (isStomp) {
      player.vy = -650;
      damageRacketMonster(monster, 1);
    } else {
      loseLife(false, monsterDamage(1), { source: monster });
      monster.attackCooldown = Math.max(monster.attackCooldown, 1.2);
    }
    return;
  }
}

function healPlayer(amount) {
  lives = Math.min(PLAYER_MAX_LIVES, lives + amount);
}

function tryStompHeal() {
  if (player.stompHealCooldown > 0 || lives >= PLAYER_MAX_LIVES) return;
  healPlayer(1);
  player.stompHealCooldown = STOMP_HEAL_COOLDOWN;
}

function empoweredDamage(enemy, baseDamage) {
  const multiplier = enemy && enemy.empoweredTimer > 0 ? 1.3 : 1;
  return Math.max(1, Math.ceil(baseDamage * multiplier * ENEMY_DAMAGE_MULTIPLIER));
}

function monsterDamage(baseDamage) {
  return Math.max(1, Math.ceil(baseDamage * ENEMY_DAMAGE_MULTIPLIER));
}

function rollEnemyTrueDamage(source) {
  if (!source || source.hazard || source.kind === "hazard") return false;
  if (!["roller", "zombie", "racketMonster", "rabbitBoss", "zombieBoss", "gundamBoss"].includes(source.type)) return false;
  if (source.rate != null || source.antiAir != null) return false;
  if (source.alive === false || source.defeated) return false;
  return Math.random() < TRUE_DAMAGE_CHANCE;
}

function empowerEnemy(enemy) {
  if (!enemy || enemy.w == null || enemy.h == null) return;
  enemy.empoweredTimer = 7;
  enemy.invulnerable = Math.max(enemy.invulnerable || 0, 1.4);
  showImpact(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#ff7a45", 46);
  showDamagePopup(enemy.x + enemy.w, enemy.y - 10, "Power +30%", true);
}

function evolveRoller(roller) {
  if (roller.evolved) return;
  const floor = roller.y + roller.h;
  roller.evolved = true;
  roller.gun = true;
  roller.w = 62;
  roller.h = 56;
  roller.y = floor - roller.h;
  roller.speed = Math.max(90, roller.speed * 0.74);
  roller.shootCooldown = 0.45;
}

function checkGoal() {
  if (overlaps(player, activeGoal) && levelGoalUnlocked()) {
    addStars(hearts.filter((heart) => !heart.taken).length === 0 ? 5 : 1);
    finishGame("won");
  }
}

function levelGoalUnlocked() {
  if (activeLevel.id === 1) return true;
  if (activeLevel.id === 2) {
    const zombieBoss = extraBosses.find((extraBoss) => extraBoss.type === "zombieBoss");
    return Boolean(boss && boss.defeated && zombieBoss && zombieBoss.defeated);
  }
  return allBossesDefeated();
}

function allBossesDefeated() {
  return (!boss || boss.defeated) && extraBosses.every((extraBoss) => extraBoss.defeated);
}

function finalBossDefeated() {
  const finalBoss = extraBosses.find((extraBoss) => extraBoss.type === "gundamBoss");
  return Boolean(finalBoss && finalBoss.defeated);
}

function loseLife(respawn, amount = 1, options = {}) {
  if (player.passiveInvincibleTimer > 0) {
    showImpact(player.x + player.w / 2, player.y + player.h / 2, "#f2eee4", 52);
    showDamagePopup(player.x + player.w / 2, player.y - 16, "Invincible", false);
    return 0;
  }
  if (!options.ignoreInvulnerability && player.invulnerable > 0) return 0;
  let damage = Math.max(1, Math.floor(amount));
  if (player.oppressionTimer > 0) damage = Math.max(1, Math.ceil(damage * 0.78));
  const trueDamage = Boolean(options.trueDamage || rollEnemyTrueDamage(options.source));
  if (player.shields > 0) {
    const broken = trueDamage ? player.shields : 1;
    player.shields = trueDamage ? 0 : Math.max(0, player.shields - 1);
    damage = 1;
    showImpact(player.x + player.w / 2, player.y + player.h / 2, trueDamage ? "#ff4050" : "#8ce7ff", trueDamage ? 72 : 54);
    showDamagePopup(player.x + player.w / 2, player.y - 12, trueDamage ? `True Break -${broken}` : "Shield -1", trueDamage);
  } else if (trueDamage) {
    showImpact(player.x + player.w / 2, player.y + player.h / 2, "#ff4050", 62);
    showDamagePopup(player.x + player.w / 2, player.y - 12, "True Damage", true);
  }
  lives = Math.max(0, lives - damage);
  if (lives <= 0) {
    finishGame("lost");
    return damage;
  }

  if (!options.noKnockback) {
    player.invulnerable = 1.25;
    player.vy = -560;
    player.vx = -player.dir * 260;
  }

  if (respawn) {
    player.x = Math.max(86, cameraX + 60);
    player.y = 330;
    player.vx = 0;
    player.vy = 0;
  }

  return damage;
}

function render(now = 0) {
  setupCanvasResolution();
  ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  drawBackground(now);
  drawGoal(now);
  drawSprings(now);
  drawPlatforms();
  drawPonds(now);
  drawHearts(now);
  drawHazards(now);
  drawTurrets(now);
  drawRollers(now);
  drawZombies(now);
  drawRacketMonsters(now);
  drawBullets(now);
  drawBoss(now);
  drawExtraBosses(now);
  drawPlayer(now);
  drawShieldEffect(now);
  drawOppressionEffect(now);
  drawPistolCompanion(now);
  drawPlayerShots(now);
  drawPoisonEffect(now);
  drawForeground();
  drawScorchMarks(now);
  drawImpactEffects(now);
  drawDamagePopups(now);
  drawBossHud();
}

function drawBackground(now) {
  if (saveData.equippedBackground === "badmintonCourt") {
    drawBadmintonCourtBackground(now);
    return;
  }
  if (saveData.equippedBackground === "judoDojo") {
    drawJudoDojoBackground(now);
    return;
  }
  if (saveData.equippedBackground === "skyClouds") {
    drawSkyCloudsBackground(now);
    return;
  }
  if (saveData.equippedBackground === "livingJungle") {
    drawLivingJungleBackground(now);
    return;
  }
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  sky.addColorStop(0, "#5dbfe7");
  sky.addColorStop(0.42, "#b9e9f4");
  sky.addColorStop(0.78, "#e7f3cf");
  sky.addColorStop(1, "#c3dd8d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.18;
  const light = ctx.createLinearGradient(80, 0, 760, VIEW_HEIGHT);
  light.addColorStop(0, "rgba(255,255,255,0.9)");
  light.addColorStop(0.46, "rgba(255,244,185,0.2)");
  light.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.moveTo(80, 0);
  ctx.lineTo(460, 0);
  ctx.lineTo(900, VIEW_HEIGHT);
  ctx.lineTo(360, VIEW_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.54;
  ctx.translate(-cameraX * 0.04, 0);
  const mountainStart = Math.floor((cameraX * 0.04 - 800) / 900) * 900;
  for (let x = mountainStart; x < cameraX * 0.04 + VIEW_WIDTH + 1000; x += 900) {
    drawMountain(x - 80, 418, 560, x % 1800 === 0 ? "#86b5bd" : "#7da9b3");
  }
  ctx.restore();

  ctx.save();
  ctx.translate(-cameraX * 0.08, 0);
  drawSun(136, 78, now);
  const cloudStart = Math.floor((cameraX * 0.08 - 360) / 580) * 580;
  for (let x = cloudStart; x < cameraX * 0.08 + VIEW_WIDTH + 520; x += 580) {
    drawCloud(x + 330, 70 + ((x / 580) % 3) * 13, 0.9 + ((Math.abs(x) / 580) % 3) * 0.1);
  }
  ctx.restore();

  ctx.save();
  ctx.translate(-cameraX * 0.22, 0);
  const hillStart = Math.floor((cameraX * 0.22 - 520) / 620) * 620;
  for (let x = hillStart; x < cameraX * 0.22 + VIEW_WIDTH + 760; x += 620) {
    const palette = x % 1240 === 0 ? "#6ab675" : "#5aa96f";
    drawHill(x - 80, 408 + ((x / 620) % 2) * 12, 480 + ((Math.abs(x) / 620) % 3) * 45, palette);
  }
  ctx.restore();
}

function drawBadmintonCourtBackground() {
  const wall = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  wall.addColorStop(0, "#16232b");
  wall.addColorStop(0.48, "#24343a");
  wall.addColorStop(1, "#0f1e24");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.92;
  const glow = ctx.createRadialGradient(VIEW_WIDTH / 2, 95, 40, VIEW_WIDTH / 2, 95, 620);
  glow.addColorStop(0, "rgba(255,255,245,0.52)");
  glow.addColorStop(0.36, "rgba(95,190,180,0.18)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  for (let i = 0; i < 7; i += 1) {
    const lx = 260 + i * 165;
    roundRect(lx, 46, 96, 10, 5, "rgba(255,255,245,0.58)");
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.moveTo(lx + 10, 56);
    ctx.lineTo(lx + 86, 56);
    ctx.lineTo(lx + 170, 300);
    ctx.lineTo(lx - 72, 300);
    ctx.closePath();
    ctx.fill();
  }

  roundRect(270, 76, 960, 72, 8, "rgba(9, 18, 24, 0.42)");
  ctx.strokeStyle = "rgba(228, 238, 232, 0.72)";
  ctx.lineWidth = 3;
  ctx.strokeRect(284, 90, 932, 45);
  ctx.fillStyle = "#e8f0ec";
  ctx.font = "900 26px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("WORLD CHAMPIONSHIP BADMINTON", VIEW_WIDTH / 2, 121);

  const floor = ctx.createLinearGradient(0, 260, 0, VIEW_HEIGHT);
  floor.addColorStop(0, "#1d8f81");
  floor.addColorStop(0.62, "#16786f");
  floor.addColorStop(1, "#0c4f52");
  ctx.fillStyle = floor;
  ctx.beginPath();
  ctx.moveTo(130, VIEW_HEIGHT);
  ctx.lineTo(430, 252);
  ctx.lineTo(1070, 252);
  ctx.lineTo(1370, VIEW_HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(245, 250, 236, 0.9)";
  ctx.lineWidth = 4;
  const offset = 0;
  ctx.beginPath();
  ctx.moveTo(430 + offset, 252);
  ctx.lineTo(130 + offset, VIEW_HEIGHT);
  ctx.moveTo(1070 + offset, 252);
  ctx.lineTo(1370 + offset, VIEW_HEIGHT);
  ctx.moveTo(750 + offset, 252);
  ctx.lineTo(750 + offset, VIEW_HEIGHT);
  ctx.moveTo(360 + offset, 330);
  ctx.lineTo(1140 + offset, 330);
  ctx.moveTo(260 + offset, 410);
  ctx.lineTo(1240 + offset, 410);
  ctx.stroke();

  ctx.strokeStyle = "rgba(230, 238, 232, 0.72)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(360, 258);
  ctx.lineTo(1140, 258);
  ctx.stroke();
  ctx.fillStyle = "rgba(230, 238, 232, 0.7)";
  ctx.fillRect(356, 240, 5, 120);
  ctx.fillRect(1139, 240, 5, 120);
  for (let x = 370; x < 1138; x += 22) {
    ctx.fillRect(x, 260, 10, 2);
  }

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  for (let i = 0; i < 8; i += 1) {
    ctx.beginPath();
    ctx.ellipse(210 + i * 155, 188 + (i % 3) * 4, 44, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawJudoDojoBackground() {
  const wall = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  wall.addColorStop(0, "#2a211b");
  wall.addColorStop(0.48, "#4a382b");
  wall.addColorStop(1, "#19130f");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  ctx.save();
  for (let x = 0; x < VIEW_WIDTH; x += 96) {
    ctx.fillStyle = x % 192 === 0 ? "rgba(190, 134, 74, 0.18)" : "rgba(255, 226, 174, 0.08)";
    ctx.fillRect(x, 0, 92, 254);
    ctx.fillStyle = "rgba(66, 42, 28, 0.34)";
    ctx.fillRect(x + 92, 0, 4, 254);
  }

  roundRect(430, 48, 640, 78, 6, "rgba(18, 16, 14, 0.52)");
  ctx.strokeStyle = "rgba(239, 218, 176, 0.78)";
  ctx.lineWidth = 3;
  ctx.strokeRect(448, 66, 604, 42);
  ctx.fillStyle = "#f1ddbc";
  ctx.font = "900 28px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("JUDO CHAMPIONSHIP", VIEW_WIDTH / 2, 96);

  ctx.fillStyle = "rgba(255, 244, 218, 0.5)";
  for (let i = 0; i < 6; i += 1) {
    roundRect(260 + i * 180, 34, 90, 10, 5, "rgba(255, 244, 218, 0.48)");
  }

  ctx.fillStyle = "rgba(12, 10, 9, 0.34)";
  ctx.fillRect(0, 236, VIEW_WIDTH, 34);

  const mat = ctx.createLinearGradient(0, 248, 0, VIEW_HEIGHT);
  mat.addColorStop(0, "#d9c487");
  mat.addColorStop(0.58, "#c8a75f");
  mat.addColorStop(1, "#9b743d");
  ctx.fillStyle = mat;
  ctx.beginPath();
  ctx.moveTo(70, VIEW_HEIGHT);
  ctx.lineTo(390, 252);
  ctx.lineTo(1110, 252);
  ctx.lineTo(1430, VIEW_HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(170, 58, 48, 0.72)";
  ctx.beginPath();
  ctx.moveTo(260, VIEW_HEIGHT);
  ctx.lineTo(485, 300);
  ctx.lineTo(1015, 300);
  ctx.lineTo(1240, VIEW_HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#d7bd74";
  ctx.beginPath();
  ctx.moveTo(390, VIEW_HEIGHT);
  ctx.lineTo(552, 332);
  ctx.lineTo(948, 332);
  ctx.lineTo(1110, VIEW_HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 246, 222, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(390, 252);
  ctx.lineTo(70, VIEW_HEIGHT);
  ctx.moveTo(1110, 252);
  ctx.lineTo(1430, VIEW_HEIGHT);
  ctx.moveTo(485, 300);
  ctx.lineTo(260, VIEW_HEIGHT);
  ctx.moveTo(1015, 300);
  ctx.lineTo(1240, VIEW_HEIGHT);
  ctx.moveTo(552, 332);
  ctx.lineTo(390, VIEW_HEIGHT);
  ctx.moveTo(948, 332);
  ctx.lineTo(1110, VIEW_HEIGHT);
  ctx.moveTo(380, 385);
  ctx.lineTo(1120, 385);
  ctx.moveTo(280, 452);
  ctx.lineTo(1220, 452);
  ctx.stroke();

  ctx.strokeStyle = "rgba(90, 60, 36, 0.3)";
  ctx.lineWidth = 2;
  for (let x = 170; x < 1340; x += 110) {
    ctx.beginPath();
    ctx.moveTo(x, VIEW_HEIGHT);
    ctx.lineTo(560 + (x - 170) * 0.18, 252);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSkyCloudsBackground(now) {
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  sky.addColorStop(0, "#5cb9ee");
  sky.addColorStop(0.42, "#bcecff");
  sky.addColorStop(0.72, "#f7fbff");
  sky.addColorStop(1, "#d9f1b0");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  drawSun(132, 78, now);

  ctx.save();
  const drift = (now / 36) % 1900;
  for (let i = -2; i < 7; i += 1) {
    const x = ((i * 330 + drift * (0.34 + (i % 3) * 0.08)) % 1900) - 210;
    const y = 54 + ((i * 41) % 118);
    drawCloud(x, y, 0.72 + (i % 4) * 0.12);
  }
  ctx.globalAlpha = 0.42;
  for (let i = -1; i < 8; i += 1) {
    const x = ((i * 260 - drift * 0.22) % 1750) - 120;
    drawCloud(x, 180 + ((i * 29) % 54), 0.48 + (i % 2) * 0.08);
  }
  ctx.restore();

  if (rainbowTimer > 0) {
    const alpha = clamp(rainbowTimer / 0.7, 0, 1) * clamp((3 - rainbowTimer) / 0.35, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha * 0.86;
    const colors = ["#ff6b7a", "#ffcf5a", "#75d46f", "#58c6f2", "#8e7cff"];
    ctx.lineCap = "round";
    for (let i = 0; i < colors.length; i += 1) {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.arc(VIEW_WIDTH * 0.56, 430, 330 - i * 13, Math.PI * 1.05, Math.PI * 1.86);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.save();
  const meadow = ctx.createLinearGradient(0, 355, 0, VIEW_HEIGHT);
  meadow.addColorStop(0, "#9ed36b");
  meadow.addColorStop(1, "#5f9e55");
  ctx.fillStyle = meadow;
  ctx.beginPath();
  ctx.moveTo(0, 386);
  for (let x = 0; x <= VIEW_WIDTH; x += 90) {
    ctx.quadraticCurveTo(x + 45, 374 + Math.sin((x + now / 40) / 80) * 6, x + 90, 386);
  }
  ctx.lineTo(VIEW_WIDTH, VIEW_HEIGHT);
  ctx.lineTo(0, VIEW_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLivingJungleBackground(now) {
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  sky.addColorStop(0, "#234d45");
  sky.addColorStop(0.45, "#426f54");
  sky.addColorStop(1, "#1f3b2a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  drawJungleLayer(now, 0.05, 285, "#2f634d", 0.72, 260);
  drawJungleBeasts(now, 0.075);
  drawJungleLayer(now, 0.13, 340, "#2c6c45", 0.86, 190);
  drawJungleLayer(now, 0.26, 405, "#1f5635", 1, 130);

  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#d5f5b2";
  for (let i = 0; i < 28; i += 1) {
    const x = ((i * 137 - cameraX * 0.18 + Math.sin(now / 900 + i) * 16) % (VIEW_WIDTH + 180)) - 70;
    const y = 60 + ((i * 53) % 250);
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawJungleLayer(now, parallax, baseY, color, alpha, spacing) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(-cameraX * parallax, 0);
  const start = Math.floor((cameraX * parallax - 240) / spacing) * spacing;
  for (let x = start; x < cameraX * parallax + VIEW_WIDTH + spacing; x += spacing) {
    const sway = Math.sin(now / 900 + x * 0.02) * 5;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, VIEW_HEIGHT);
    ctx.lineTo(x + 16, baseY + sway);
    ctx.lineTo(x + 32, VIEW_HEIGHT);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 16, baseY - 26 + sway, 58, 28, -0.2, 0, Math.PI * 2);
    ctx.ellipse(x - 22, baseY + 6 + sway, 45, 22, 0.35, 0, Math.PI * 2);
    ctx.ellipse(x + 58, baseY + 12 + sway, 52, 24, -0.28, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawJungleBeasts(now, parallax) {
  ctx.save();
  ctx.translate(-cameraX * parallax, 0);
  const start = Math.floor((cameraX * parallax - 900) / 1500) * 1500;
  for (let x = start; x < cameraX * parallax + VIEW_WIDTH + 1500; x += 1500) {
    const pulse = 0.18 + Math.max(0, Math.sin(now / 1200 + x)) * 0.22;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = "#101c17";
    const bx = x + 720 + Math.sin(now / 1800 + x) * 24;
    const by = 292 + Math.sin(now / 1300 + x) * 10;
    ctx.beginPath();
    ctx.ellipse(bx, by, 42, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(bx + 38, by - 12, 20, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d5f5b2";
    ctx.beginPath();
    ctx.arc(bx + 44, by - 15, 2.3, 0, Math.PI * 2);
    ctx.arc(bx + 54, by - 15, 2.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSun(x, y, now) {
  const pulse = Math.sin(now / 700) * 4;
  ctx.fillStyle = "#fff2a8";
  ctx.beginPath();
  ctx.arc(x, y, 54 + pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 184, 80, 0.24)";
  ctx.beginPath();
  ctx.arc(x, y, 76 + pulse, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloud(x, y, scale) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  ctx.beginPath();
  ctx.ellipse(x, y + 20 * scale, 58 * scale, 28 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 52 * scale, y + 16 * scale, 50 * scale, 25 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 21 * scale, y - 4 * scale, 42 * scale, 32 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 86 * scale, y + 4 * scale, 35 * scale, 26 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawHill(x, y, width, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, VIEW_HEIGHT);
  ctx.quadraticCurveTo(x + width * 0.5, y - width * 0.42, x + width, VIEW_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawMountain(x, y, width, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, VIEW_HEIGHT);
  ctx.lineTo(x + width * 0.28, y - width * 0.42);
  ctx.lineTo(x + width * 0.54, VIEW_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
  ctx.beginPath();
  ctx.moveTo(x + width * 0.28, y - width * 0.42);
  ctx.lineTo(x + width * 0.2, y - width * 0.24);
  ctx.lineTo(x + width * 0.34, y - width * 0.26);
  ctx.closePath();
  ctx.fill();
}

function drawPlatforms() {
  for (const platform of platforms) {
    const screenX = platform.x - cameraX;
    if (screenX > VIEW_WIDTH + 80 || screenX + platform.w < -80) continue;
    drawPlatform(screenX, platform.y, platform.w, platform.h, platform.kind);
  }
}

function drawPlatform(x, y, w, h, kind) {
  const theme = getTerrainTheme(kind);
  if (kind === "ground" || kind === "boss-ground" || kind === "gun-ground") {
    ctx.save();
    ctx.shadowColor = theme.shadow;
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = theme.top;
    ctx.fillRect(x, y, w, 18);
    ctx.shadowBlur = 0;
    const bevel = ctx.createLinearGradient(0, y, 0, y + h);
    bevel.addColorStop(0, theme.bevel0);
    bevel.addColorStop(0.22, theme.bevel1);
    bevel.addColorStop(1, theme.bevel2);
    ctx.fillStyle = bevel;
    ctx.fillRect(x, y + 18, w, h - 18);
    ctx.restore();
    ctx.fillStyle = theme.line;
    const spacing = theme.spacing || 58;
    for (let tile = Math.floor((cameraX + x) / spacing) * spacing - cameraX; tile < x + w; tile += spacing) {
      ctx.fillRect(tile, y + 18, theme.lineWidth || 3, h - 18);
      if (theme.grass) {
        ctx.fillStyle = theme.grass;
        ctx.beginPath();
        ctx.moveTo(tile + 8, y + 18);
        ctx.lineTo(tile + 17, y + 7);
        ctx.lineTo(tile + 23, y + 18);
        ctx.fill();
        ctx.fillStyle = theme.line;
      }
    }
    return;
  }

  roundRect(x, y, w, h, 8, kind === "metal" ? theme.platformMetal : theme.platformTop);
  ctx.fillStyle = kind === "metal" ? theme.platformMetalEdge : theme.platformEdge;
  ctx.fillRect(x, y, w, 9);
  ctx.fillStyle = kind === "metal" ? theme.platformMetalBody : theme.platformBody;
  ctx.fillRect(x + 4, y + 13, w - 8, h - 13);
  if (theme.platformAccent) {
    ctx.fillStyle = theme.platformAccent;
    for (let px = x + 18; px < x + w - 12; px += 42) ctx.fillRect(px, y + 5, 18, 2);
  }
}

function getTerrainTheme(kind) {
  const isGun = kind === "gun-ground" || kind === "metal";
  const isBoss = kind === "boss-ground";
  const themes = {
    badmintonCourt: {
      top: isGun ? "#6d8c91" : isBoss ? "#1f9b8b" : "#168878",
      bevel0: isGun ? "#8fb5bc" : "#39b7a7",
      bevel1: isGun ? "#657b83" : "#0f665f",
      bevel2: isGun ? "#3d4a52" : "#0a464b",
      line: "rgba(245, 250, 236, 0.38)",
      shadow: "rgba(13, 36, 38, 0.42)",
      spacing: 84,
      lineWidth: 4,
      platformTop: "#2aa796",
      platformEdge: "#e9f4eb",
      platformBody: "#0c6664",
      platformMetal: "#7ba4aa",
      platformMetalEdge: "#dbe7e7",
      platformMetalBody: "#607982",
      platformAccent: "rgba(245,250,236,0.8)",
    },
    judoDojo: {
      top: isGun ? "#7f6d5d" : isBoss ? "#c99d58" : "#d6b76e",
      bevel0: isGun ? "#9a8773" : "#ead497",
      bevel1: isGun ? "#66564a" : "#9a6634",
      bevel2: isGun ? "#3d322c" : "#5d3820",
      line: "rgba(88, 55, 31, 0.28)",
      shadow: "rgba(43, 25, 14, 0.42)",
      spacing: 72,
      lineWidth: 2,
      platformTop: "#d7bd74",
      platformEdge: "#f3e0aa",
      platformBody: "#9b743d",
      platformMetal: "#8e8176",
      platformMetalEdge: "#b7a998",
      platformMetalBody: "#5f5148",
      platformAccent: "rgba(90,60,36,0.34)",
    },
    skyClouds: {
      top: isGun ? "#8fa6aa" : isBoss ? "#7cc85e" : "#8ed56a",
      bevel0: isGun ? "#b4c9cc" : "#c7ef89",
      bevel1: isGun ? "#6e8589" : "#78a84a",
      bevel2: isGun ? "#46575c" : "#5c3d2b",
      line: "rgba(88, 57, 32, 0.22)",
      shadow: "rgba(56, 92, 50, 0.28)",
      spacing: 58,
      lineWidth: 3,
      grass: "#c7ef89",
      platformTop: "#9bdd73",
      platformEdge: "#74b954",
      platformBody: "#b07a52",
      platformMetal: "#91adb0",
      platformMetalEdge: "#6f898d",
      platformMetalBody: "#6d7982",
      platformAccent: "rgba(255,255,255,0.38)",
    },
    livingJungle: {
      top: isGun ? "#4b6760" : isBoss ? "#2d7a46" : "#246b3b",
      bevel0: isGun ? "#6f8a82" : "#4d9b57",
      bevel1: isGun ? "#3f514d" : "#24462c",
      bevel2: isGun ? "#273331" : "#2a2016",
      line: "rgba(16, 28, 18, 0.34)",
      shadow: "rgba(7, 18, 12, 0.5)",
      spacing: 46,
      lineWidth: 4,
      grass: "#3d8d49",
      platformTop: "#2e7a43",
      platformEdge: "#4b9b56",
      platformBody: "#5b4126",
      platformMetal: "#4f6d64",
      platformMetalEdge: "#6d8b80",
      platformMetalBody: "#344942",
      platformAccent: "rgba(143, 196, 113, 0.28)",
    },
    default: {
      top: isGun ? "#6d8c91" : isBoss ? "#6ab07a" : "#78bd57",
      bevel0: isGun ? "#8fb5bc" : "#9fdb72",
      bevel1: isGun ? "#657b83" : "#865f3e",
      bevel2: isGun ? "#3d4a52" : "#5c3d2b",
      line: "rgba(84, 52, 34, 0.23)",
      shadow: "rgba(36, 61, 45, 0.32)",
      platformTop: "#8dcf5f",
      platformEdge: "#6fb24c",
      platformBody: "#aa7750",
      platformMetal: "#7ba4aa",
      platformMetalEdge: "#587780",
      platformMetalBody: "#6d7982",
    },
  };
  return themes[saveData.equippedBackground] || themes.default;
}

function drawSprings(now) {
  for (const spring of springs) {
    const x = spring.x - cameraX;
    if (x > VIEW_WIDTH + 80 || x + spring.w < -80) continue;
    const squash = Math.max(0, Math.sin(now / 120 + spring.x) * 2);
    ctx.fillStyle = "#3d7893";
    ctx.fillRect(x + 6, spring.y + 22 + squash, spring.w - 12, 8);
    ctx.strokeStyle = "#ec4764";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x + 10, spring.y + 22);
    ctx.lineTo(x + 18, spring.y + 8);
    ctx.lineTo(x + 28, spring.y + 22);
    ctx.lineTo(x + 38, spring.y + 8);
    ctx.lineTo(x + spring.w - 8, spring.y + 22);
    ctx.stroke();
  }
}

function drawHearts(now) {
  for (const heart of hearts) {
    if (heart.taken) continue;
    const bob = Math.sin(now / 260 + heart.phase) * 5;
    drawHeart(heart.x - cameraX, heart.y + bob, 0.82, "#c6223b", "#ffd0d7");
  }
}

function drawHeart(x, y, scale, fill, shine) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0, 19);
  ctx.bezierCurveTo(-36, -10, -18, -34, 0, -16);
  ctx.bezierCurveTo(18, -34, 36, -10, 0, 19);
  ctx.fill();
  ctx.fillStyle = shine;
  ctx.beginPath();
  ctx.arc(-9, -11, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHazards(now) {
  for (const hazard of hazards) {
    const x = hazard.x - cameraX;
    if (x > VIEW_WIDTH + 80 || x + hazard.w < -80) continue;
    ctx.fillStyle = "#6b4240";
    ctx.fillRect(x + 6, hazard.y + 24, hazard.w - 12, 9);
    ctx.fillStyle = "#d9574f";
    const spikes = 4;
    for (let i = 0; i < spikes; i += 1) {
      const sx = x + i * (hazard.w / spikes);
      ctx.beginPath();
      ctx.moveTo(sx + 3, hazard.y + 27);
      ctx.lineTo(sx + hazard.w / spikes / 2, hazard.y + 2 + Math.sin(now / 180 + i) * 2);
      ctx.lineTo(sx + hazard.w / spikes - 3, hazard.y + 27);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function drawPonds(now) {
  for (const pond of ponds) {
    const x = pond.x - cameraX;
    if (x > VIEW_WIDTH + 120 || x + pond.w < -120) continue;
    const wave = Math.sin(now / 170 + pond.x * 0.02) * 3;

    ctx.save();
    ctx.globalAlpha = 0.95;
    roundRect(x, pond.y, pond.w, pond.h, 8, "#4bb7d9");
    ctx.fillStyle = "#76dff1";
    ctx.beginPath();
    ctx.moveTo(x, pond.y + 9 + wave);
    for (let sx = 0; sx <= pond.w; sx += 24) {
      ctx.quadraticCurveTo(x + sx + 12, pond.y + 3 - wave, x + sx + 24, pond.y + 9 + wave);
    }
    ctx.lineTo(x + pond.w, pond.y + 18);
    ctx.lineTo(x, pond.y + 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
    for (let sx = 18; sx < pond.w; sx += 72) {
      ctx.beginPath();
      ctx.ellipse(x + sx, pond.y + 17 + Math.sin(now / 220 + sx) * 2, 18, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function applyKomusanDance(now, actor, intensity = 1) {
  if (!monstersAreDancing()) return;
  const phase = (actor.x || 0) * 0.035 + (actor.y || 0) * 0.011;
  const beat = Math.sin(now / 88 + phase);
  ctx.translate(Math.sin(now / 68 + phase) * 5 * intensity, Math.abs(beat) * -4 * intensity);
  ctx.rotate(beat * 0.16 * intensity);
}

function drawDanceCueLocal(now, scale = 1) {
  if (!monstersAreDancing()) return;
  const step = Math.sin(now / 75);
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#f2eee4";
  ctx.shadowColor = "#7dd3fc";
  ctx.shadowBlur = 16;
  ctx.lineWidth = 3 * scale;
  for (let i = 0; i < 2; i += 1) {
    const side = i === 0 ? -1 : 1;
    ctx.beginPath();
    ctx.arc(side * (18 + step * 7), 38 + i * 3, 10 * scale, 0.25, Math.PI * 1.25);
    ctx.stroke();
  }
  ctx.strokeStyle = "#41ead4";
  ctx.beginPath();
  ctx.moveTo(-32 * scale, -50 * scale);
  ctx.quadraticCurveTo(-44 * scale, -62 * scale, -28 * scale, -70 * scale);
  ctx.moveTo(32 * scale, -50 * scale);
  ctx.quadraticCurveTo(48 * scale, -62 * scale, 36 * scale, -74 * scale);
  ctx.stroke();
  ctx.restore();
}

function drawDanceCueWorld(x, y, now, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  drawDanceCueLocal(now, scale);
  ctx.restore();
}

function drawRollers(now) {
  for (const roller of rollers) {
    if (!roller.alive) continue;
    const x = roller.x - cameraX;
    if (x > VIEW_WIDTH + 80 || x + roller.w < -80) continue;
    const cx = x + roller.w / 2;
    const cy = roller.y + roller.h / 2 + Math.sin(now / 160 + roller.x) * 2;
    if (roller.empoweredTimer > 0) {
      ctx.save();
      ctx.strokeStyle = "#ff7a45";
      ctx.shadowColor = "#ff7a45";
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, roller.w * 0.68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.translate(cx, cy);
    applyKomusanDance(now, roller, 0.9);
    ctx.fillStyle = roller.evolved ? "#5f456f" : "#7e4d65";
    ctx.beginPath();
    ctx.ellipse(0, 0, roller.w / 2, roller.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffcf6c";
    ctx.beginPath();
    ctx.arc(-10, -7, 5, 0, Math.PI * 2);
    ctx.arc(10, -7, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2b2331";
    ctx.fillRect(-12, -9, 4, 4);
    ctx.fillRect(8, -9, 4, 4);

    if (roller.gun) {
      const aim = roller.aimDir || roller.dir || 1;
      ctx.save();
      ctx.translate(aim * 24, 4);
      ctx.scale(aim, 1);
      ctx.fillStyle = "#3f4b55";
      roundRect(0, -5, 26, 9, 3, "#3f4b55");
      ctx.fillRect(7, 3, 8, 9);
      ctx.fillStyle = "#ffc857";
      ctx.fillRect(24, -2, 6, 3);
      ctx.restore();
    }
    drawDanceCueLocal(now, 0.7);
    ctx.restore();
  }
}

function drawZombies(now) {
  for (const zombie of zombies) {
    if (!zombie.alive) continue;
    const x = zombie.x - cameraX;
    if (x > VIEW_WIDTH + 100 || x + zombie.w < -100) continue;
    const cx = x + zombie.w / 2;
    const cy = zombie.y + zombie.h / 2;
    const flash = zombie.hitFlash > 0 && Math.floor(now / 60) % 2 === 0;

    ctx.save();
    ctx.translate(cx, cy + Math.sin(now / 180 + zombie.x) * 2);
    applyKomusanDance(now, zombie, 0.85);
    ctx.scale(zombie.aimDir || zombie.dir || 1, 1);
    if (zombie.empoweredTimer > 0) {
      ctx.shadowColor = "#ff7a45";
      ctx.shadowBlur = 20;
    }

    ctx.fillStyle = flash ? "#f5f2df" : "#8ab16f";
    ctx.beginPath();
    ctx.ellipse(0, 8, zombie.w * 0.42, zombie.h * 0.43, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#6f9b62";
    ctx.beginPath();
    ctx.ellipse(0, -23, zombie.w * 0.38, zombie.h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2b4a38";
    ctx.fillRect(-16, -28, 7, 7);
    ctx.fillRect(9, -28, 7, 7);
    ctx.strokeStyle = "#284331";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, -10);
    ctx.quadraticCurveTo(0, -2, 14, -10);
    ctx.stroke();

    ctx.fillStyle = "#4d7f6d";
    ctx.fillRect(-20, 12, 40, 28);
    ctx.fillStyle = "#b3d78d";
    ctx.fillRect(-8, 40, 6, 12);
    ctx.fillRect(8, 40, 6, 12);

    ctx.strokeStyle = "#6ee26e";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(18, -14);
    ctx.quadraticCurveTo(42, -20, 52, -10 + Math.sin(now / 90) * 3);
    ctx.stroke();
    ctx.fillStyle = "#78ff79";
    ctx.beginPath();
    ctx.arc(56, -10, zombie.poisonCooldown < 0.18 ? 7 : 3, 0, Math.PI * 2);
    ctx.fill();
    drawDanceCueLocal(now, 0.78);

    ctx.restore();
  }
}

function drawRacketMonsters(now) {
  for (const monster of racketMonsters) {
    if (!monster.alive) continue;
    const x = monster.x - cameraX;
    if (x > VIEW_WIDTH + 120 || x + monster.w < -120) continue;
    ctx.save();
    ctx.translate(x + monster.w / 2, monster.y + monster.h / 2);
    applyKomusanDance(now, monster, 1);
    ctx.scale(monster.aimDir || monster.dir || 1, 1);
    if (monster.hitFlash > 0) {
      ctx.globalAlpha = 0.65;
      ctx.shadowColor = "#f2eee4";
      ctx.shadowBlur = 18;
    }
    drawChibiBear(now, { actor: monster, weapon: "antaRacket", angry: true });
    drawDanceCueLocal(now, 0.82);
    ctx.fillStyle = "rgba(72, 38, 48, 0.78)";
    ctx.fillRect(-20, -61, 40, 5);
    ctx.fillStyle = "#f2eee4";
    ctx.fillRect(-20, -61, 40 * Math.max(0, monster.hp / monster.maxHp), 5);
    ctx.restore();
  }
}

function drawTurrets(now) {
  for (const turret of turrets) {
    if (!turret.alive) continue;
    const x = turret.x - cameraX;
    if (x > VIEW_WIDTH + 80 || x < -80) continue;

    ctx.save();
    ctx.translate(x + 22, turret.y + 18);
    ctx.scale(turret.dir || -1, 1);
    roundRect(-18, 10, 36, 16, 4, "#485a63");
    if (turret.antiAir) {
      ctx.strokeStyle = "#8ee5ff";
      ctx.shadowColor = "#8ee5ff";
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -2, 25 + Math.sin(now / 90) * 3, -Math.PI * 0.95, Math.PI * 0.05);
      ctx.stroke();
    }
    ctx.fillStyle = "#6f8790";
    ctx.beginPath();
    ctx.arc(0, 4, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2f3f46";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(12, 2);
    const pitch = turret.aimPitch || 0;
    ctx.lineTo(52 * Math.cos(pitch), 2 + 52 * Math.sin(pitch));
    ctx.stroke();
    ctx.fillStyle = turret.antiAir ? "#8ee5ff" : "#ffcd6a";
    ctx.beginPath();
    ctx.arc(56 * Math.cos(pitch), 2 + 56 * Math.sin(pitch), turret.cooldown < 0.08 ? 7 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawBullets(now) {
  for (const bullet of bullets) {
    const x = bullet.x - cameraX;
    if (x > VIEW_WIDTH + 60 || x < -60) continue;
    ctx.save();
    ctx.translate(x, bullet.y);
    if (bullet.kind === "venom") {
      ctx.shadowColor = "#78ff79";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#6eff63";
      ctx.beginPath();
      ctx.arc(0, 0, 8 + Math.sin(now / 90 + bullet.x) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
      ctx.beginPath();
      ctx.arc(-3, -3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (bullet.kind === "monsterShuttle") {
      ctx.rotate(Math.atan2(bullet.vy || 0, bullet.vx || 1));
      ctx.shadowColor = "#f2eee4";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#f8fbff";
      ctx.beginPath();
      ctx.moveTo(-10, -7);
      ctx.lineTo(14, -3);
      ctx.lineTo(14, 3);
      ctx.lineTo(-10, 7);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#5ba7cc";
      ctx.beginPath();
      ctx.arc(16, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.rotate(Math.atan2(bullet.vy || 0, bullet.vx || 1) + Math.sin(now / 80 + bullet.x) * 0.02);
      ctx.shadowColor = bullet.antiAir ? "#8ee5ff" : bullet.kind === "machine" ? "#ffcd6a" : "#9be7ff";
      ctx.shadowBlur = bullet.antiAir ? 24 : bullet.kind === "machine" ? 20 : 12;
      roundRect(-bullet.w / 2 - (bullet.antiAir ? 24 : 14), -2, bullet.antiAir ? 26 : 16, 4, 3, bullet.antiAir ? "rgba(142,229,255,0.46)" : "rgba(255,255,255,0.42)");
      roundRect(-bullet.w / 2, -bullet.h / 2, bullet.w, bullet.h, 4, bullet.antiAir ? "#b9fbff" : bullet.kind === "machine" ? "#ffe27a" : "#c5e8ff");
      ctx.fillStyle = bullet.antiAir ? "#4fb8e8" : bullet.kind === "machine" ? "#f2854d" : "#65a9d6";
      ctx.fillRect(-bullet.w / 2 - 4, -2, 5, 4);
    }
    ctx.restore();
  }
}

function drawGoal(now) {
  const x = activeGoal.x - cameraX;
  if (x > VIEW_WIDTH + 180 || x < -180) return;
  const locked = !levelGoalUnlocked();

  ctx.fillStyle = "#5e4c40";
  ctx.fillRect(x + 50, activeGoal.y, 10, activeGoal.h);
  ctx.fillStyle = locked ? "#c9c4bb" : "#f7efc4";
  ctx.beginPath();
  ctx.moveTo(x + 58, activeGoal.y + 12);
  ctx.lineTo(x + 126, activeGoal.y + 33);
  ctx.lineTo(x + 58, activeGoal.y + 58);
  ctx.closePath();
  ctx.fill();
  drawHeart(x + 84, activeGoal.y + 38 + Math.sin(now / 260) * 2, 0.35, locked ? "#7a7270" : "#c6223b", "#ffd0d7");
  ctx.fillStyle = "#6fb24c";
  ctx.fillRect(x + 24, activeGoal.y + activeGoal.h - 10, 92, 18);

  if (locked) {
    ctx.strokeStyle = "rgba(75, 56, 65, 0.65)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x + 32, activeGoal.y + 72);
    ctx.lineTo(x + 112, activeGoal.y + 112);
    ctx.moveTo(x + 112, activeGoal.y + 72);
    ctx.lineTo(x + 32, activeGoal.y + 112);
    ctx.stroke();
  }
}

function drawPlayer(now) {
  const x = player.x - cameraX;
  const y = player.y;
  const blink = player.invulnerable > 0 && Math.floor(now / 85) % 2 === 0;

  drawPlayerAfterimages(now, x, y);

  ctx.save();
  ctx.globalAlpha = blink ? 0.45 : 1;
  ctx.fillStyle = "rgba(30, 44, 39, 0.18)";
  ctx.beginPath();
  ctx.ellipse(x + player.w / 2, y + player.h + 6, player.w * 0.45, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(x + player.w / 2, y + player.h / 2);
  ctx.rotate(player.vx * 0.00018);
  if (player.dir < 0) ctx.scale(-1, 1);
  drawShoeSpeedEffect(now);
  drawSkinPassiveEffect(now);
  if (saveData.equippedSkin === "gundam") drawPlayerMechSkin(now);
  else if (saveData.equippedSkin === "homelander") drawHomelanderSkin(now);
  else if (saveData.equippedSkin === "momota") drawMomotaSkin(now);
  else drawChibiBear(now, { actor: player, weapon: getBareHandsEnabled() ? "none" : "racket" });

  ctx.restore();
}

function drawShoeSpeedEffect(now) {
  if (saveData.equippedGear !== "victorP9200Tty") return;
  const speedPower = clamp(Math.abs(player.vx) / Math.max(1, MOVE_SPEED), 0, 1.8);
  const active = speedPower > 0.18 || !player.onGround;
  if (!active) return;
  ctx.save();
  ctx.globalAlpha = clamp(0.18 + speedPower * 0.18, 0.18, 0.52);
  ctx.strokeStyle = "#8ee5ff";
  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.shadowColor = "#58c6f2";
  ctx.shadowBlur = 22;
  ctx.lineCap = "round";
  for (let i = 0; i < 5; i += 1) {
    const y = 22 + i * 8 + Math.sin(now / 80 + i) * 3;
    const len = 24 + speedPower * 20 + i * 4;
    ctx.lineWidth = 2.2 + (i % 2);
    ctx.beginPath();
    ctx.moveTo(-22 - i * 7, y);
    ctx.lineTo(-22 - len, y + Math.sin(now / 90 + i) * 4);
    ctx.stroke();
  }
  ctx.globalAlpha *= 0.9;
  ctx.beginPath();
  ctx.ellipse(-18, 52, 18 + speedPower * 7, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(18, 52, 18 + speedPower * 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayerAfterimages(now, x, y) {
  const speed = Math.abs(player.vx);
  const activeMotion = !player.onGround || player.attackTimer > 0;
  if (activeMotion) {
    const last = playerAfterimageTrail[playerAfterimageTrail.length - 1];
    const moved = !last || Math.hypot(player.x - last.x, player.y - last.y) > 9;
    const shouldSample = !last || now - last.time > 34 || moved || player.attackTimer > 0;
    if (shouldSample) {
      playerAfterimageTrail.push({
        x: player.x,
        y: player.y,
        dir: player.dir,
        vx: player.vx,
        attack: player.attackTimer > 0,
        color: pickInkAfterimageColor(now, player.attackTimer > 0),
        time: now,
      });
    }
  }

  playerAfterimageTrail = playerAfterimageTrail
    .filter((sample) => now - sample.time < 260)
    .slice(-8);
  if (!playerAfterimageTrail.length) return;

  ctx.save();
  for (let i = 0; i < playerAfterimageTrail.length; i += 1) {
    const sample = playerAfterimageTrail[i];
    const age = clamp((now - sample.time) / 260, 0, 1);
    const alpha = (1 - age) * (sample.attack ? 0.24 : 0.17);
    const color = sample.color || (i % 2 === 0 ? "#05070a" : "#ffffff");
    const inkLayer = color !== "#05070a" && color !== "#ffffff";
    const blur = sample.attack ? 18 : inkLayer ? 15 : 11;
    const scale = 1 + (1 - age) * 0.05;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.translate(sample.x - cameraX + player.w / 2, sample.y + player.h / 2);
    ctx.rotate(sample.vx * 0.00018);
    if (sample.dir < 0) ctx.scale(-1, 1);
    ctx.scale(scale, scale);
    drawPlayerAfterimageSilhouette(now, color, i, sample.attack);
    ctx.restore();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function addPlayerAfterimage(color = null) {
  if (!player) return;
  playerAfterimageTrail.push({
    x: player.x,
    y: player.y,
    dir: player.dir,
    vx: player.vx || player.dir * MOVE_SPEED,
    attack: true,
    color: color || pickInkAfterimageColor(performance.now(), true),
    time: performance.now(),
  });
  playerAfterimageTrail = playerAfterimageTrail.slice(-8);
}

function pickInkAfterimageColor(now, attack) {
  const cameraMood = Math.floor((cameraX * 0.006 + now * 0.001 + playerAfterimageHueSeed * 7) % INK_AFTERIMAGE_PALETTE.length);
  const jumpMood = player.vy < -120 ? 1 : player.vy > 180 ? 3 : 0;
  const attackMood = attack ? 2 : 0;
  const index = (cameraMood + jumpMood + attackMood + Math.floor(Math.random() * 2)) % INK_AFTERIMAGE_PALETTE.length;
  const base = INK_AFTERIMAGE_PALETTE[index];
  if (Math.random() < 0.34) return Math.random() < 0.5 ? "#05070a" : "#ffffff";
  return base;
}

function drawPlayerAfterimageSilhouette(now, color, layerIndex, attack) {
  const stride = Math.sin(now / 75 + layerIndex) * 3;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.ellipse(-30, -38, 15, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(30, -38, 15, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(0, -19, 40, 36, 0, 0, Math.PI * 2);
  ctx.fill();

  roundRect(-28, -1, 56, 58, 17, color);

  ctx.beginPath();
  ctx.ellipse(-34 - stride, 20, 12, 31, 0.18, 0, Math.PI * 2);
  ctx.ellipse(34 + stride, 20, 12, 31, -0.18, 0, Math.PI * 2);
  ctx.ellipse(-17 - stride, 48, 14, 18, -0.1, 0, Math.PI * 2);
  ctx.ellipse(17 + stride, 48, 14, 18, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = attack ? 6 : 3.5;
  ctx.beginPath();
  ctx.moveTo(32, 9);
  ctx.quadraticCurveTo(56, 4 - stride, 72, -10);
  ctx.stroke();

  if (attack) {
    ctx.globalAlpha *= 0.72;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(38, -3, 46 + layerIndex * 5, -0.7, 0.5);
    ctx.stroke();
  }
}

function drawPlayerMechSkin(now) {
  ctx.save();
  ctx.scale(0.72, 0.72);
  drawMechBoss(now, player);
  ctx.restore();
  if (!getBareHandsEnabled()) drawEquippedRacket(player.attackTimer || 0);
}

function drawSkinPassiveEffect(now) {
  const skin = getSkinEffect();
  const movePower = clamp(Math.abs(player.vx) / Math.max(1, getPlayerMoveSpeed()), 0, 1);
  const pulse = 1 + Math.sin(now / 180) * 0.06;
  ctx.save();
  ctx.globalAlpha = 0.28 + movePower * 0.18;
  ctx.strokeStyle = skin.aura;
  ctx.shadowColor = skin.aura;
  ctx.shadowBlur = 22;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 36, 34 * pulse, 8 * pulse, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (saveData.equippedSkin === "gundam") {
    ctx.strokeStyle = "#5edbff";
    ctx.fillStyle = "rgba(240, 198, 74, 0.72)";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-20 + i * 20, 54);
      ctx.lineTo(-28 + i * 20 + Math.sin(now / 80 + i) * 6, 86);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-20 + i * 20, 52 + Math.sin(now / 90 + i) * 3, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (saveData.equippedSkin === "homelander") {
    ctx.strokeStyle = "#ff4050";
    ctx.shadowColor = "#ffd94d";
    ctx.beginPath();
    ctx.moveTo(-11, -24);
    ctx.lineTo(-54, -34 + Math.sin(now / 80) * 4);
    ctx.moveTo(11, -24);
    ctx.lineTo(54, -34 - Math.sin(now / 80) * 4);
    ctx.moveTo(-24, 8);
    ctx.quadraticCurveTo(0, 24 + Math.sin(now / 100) * 4, 24, 8);
    ctx.stroke();
  } else if (saveData.equippedSkin === "momota") {
    ctx.strokeStyle = "#d8323f";
    ctx.shadowColor = "#f7fafc";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(-20 + i * 20 + Math.sin(now / 95 + i) * 4, 58, 14 + i * 3, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-34, 16);
    ctx.lineTo(34, -4 + Math.sin(now / 120) * 5);
    ctx.stroke();
  } else {
    ctx.strokeStyle = "#ffd0d7";
    ctx.shadowColor = "#ff9fbe";
    ctx.beginPath();
    ctx.arc(0, 4, 48 + Math.sin(now / 210) * 3, -0.22, Math.PI + 0.22);
    ctx.stroke();
    drawHeart(0, -60 + Math.sin(now / 220) * 3, 0.16, skin.aura, "#fff");
  }
  ctx.restore();
}

function drawHomelanderSkin(now) {
  drawFullBodyBearSkin(now, {
    fur: "#f0d8b5",
    innerEar: "#d9b78f",
    muzzle: "#fff0d8",
    suit: "#17458f",
    suitDark: "#0f2e66",
    trim: "#f0cf55",
    boots: "#bd2631",
    cape: "#c92834",
    chest: "star",
    hair: "#f2d25a",
    label: "H",
  });
}

function drawMomotaSkin(now) {
  drawFullBodyBearSkin(now, {
    fur: "#e7d4bd",
    innerEar: "#c7a98d",
    muzzle: "#fff2df",
    suit: "#111827",
    suitDark: "#0b1018",
    trim: "#f7fafc",
    accent: "#d8323f",
    boots: "#111827",
    cape: null,
    chest: "momota",
    hair: "#2c211c",
    label: "MOMOTA",
  });
}

function drawFullBodyBearSkin(now, config) {
  const actor = player;
  const bounce = Math.sin(now / 120 + actor.x * 0.01) * Math.min(1, Math.abs(actor.vx) / MOVE_SPEED) * 2;
  ctx.save();
  ctx.translate(0, bounce);

  if (config.cape) {
    ctx.fillStyle = config.cape;
    ctx.beginPath();
    ctx.moveTo(-23, -8);
    ctx.quadraticCurveTo(-48, 18, -45, 58);
    ctx.lineTo(-12, 48);
    ctx.lineTo(0, 10);
    ctx.lineTo(12, 48);
    ctx.lineTo(45, 58);
    ctx.quadraticCurveTo(48, 18, 23, -8);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = config.fur;
  ctx.beginPath();
  ctx.ellipse(-31, 19, 13, 31, 0.16, 0, Math.PI * 2);
  ctx.ellipse(31, 19, 13, 31, -0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = config.boots;
  ctx.beginPath();
  ctx.ellipse(-16, 45, 14, 19, -0.04, 0, Math.PI * 2);
  ctx.ellipse(16, 45, 14, 19, 0.04, 0, Math.PI * 2);
  ctx.fill();

  roundRect(-27, -2, 54, 58, 17, config.suit);
  ctx.fillStyle = config.suitDark;
  ctx.fillRect(-27, 30, 54, 12);
  ctx.fillStyle = config.trim;
  ctx.fillRect(-27, 7, 54, 5);
  ctx.fillRect(-3, -2, 6, 58);
  if (config.accent) {
    ctx.fillStyle = config.accent;
    ctx.fillRect(-6, -2, 12, 58);
    ctx.fillRect(-27, 7, 54, 4);
  }

  if (config.chest === "star") {
    drawTinyStar(0, 23, 18, config.trim);
  } else {
    ctx.fillStyle = config.trim;
    ctx.font = "900 15px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(config.label, 0, 24);
  }

  ctx.fillStyle = config.fur;
  ctx.beginPath();
  ctx.arc(-25, -37, 15, 0, Math.PI * 2);
  ctx.arc(25, -37, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = config.innerEar;
  ctx.beginPath();
  ctx.arc(-25, -37, 9, 0, Math.PI * 2);
  ctx.arc(25, -37, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = config.fur;
  ctx.beginPath();
  ctx.ellipse(0, -20, 39, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = config.hair;
  ctx.beginPath();
  ctx.moveTo(-28, -39);
  ctx.quadraticCurveTo(-8, -58, 10, -45);
  ctx.quadraticCurveTo(24, -37, 29, -25);
  ctx.quadraticCurveTo(8, -34, -8, -27);
  ctx.quadraticCurveTo(-20, -24, -31, -29);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = config.muzzle;
  ctx.beginPath();
  ctx.ellipse(0, -10, 22, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#4a302b";
  roundedRectPath(-18, -23, 5, 13, 2);
  ctx.fill();
  roundedRectPath(13, -23, 5, 13, 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -9, 9, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.quadraticCurveTo(-5, 3, -12, -1);
  ctx.moveTo(0, -4);
  ctx.quadraticCurveTo(5, 3, 12, -1);
  ctx.stroke();

  ctx.strokeStyle = config.trim;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-34, 8);
  ctx.lineTo(-48, 27);
  ctx.moveTo(34, 8);
  ctx.lineTo(48, 27);
  ctx.stroke();

  if (!getBareHandsEnabled()) drawEquippedRacket(actor.attackTimer || 0);
  ctx.restore();
}

function drawTinyStar(x, y, radius, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const pointRadius = i % 2 === 0 ? radius : radius * 0.44;
    const px = x + Math.cos(angle) * pointRadius;
    const py = y + Math.sin(angle) * pointRadius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawPoisonEffect(now) {
  if (player.poisonTicksRemaining <= 0) return;
  const x = player.x - cameraX + player.w / 2;
  const y = player.y + player.h / 2;

  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "#68ff69";
  for (let i = 0; i < 6; i += 1) {
    const angle = now / 260 + i * 1.05;
    const radius = 34 + Math.sin(now / 180 + i) * 5;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, 4 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawShieldEffect(now) {
  if (!player || player.shields <= 0) return;
  const x = player.x - cameraX + player.w / 2;
  const y = player.y + player.h / 2;

  ctx.save();
  ctx.globalAlpha = 0.34 + player.shields * 0.12;
  ctx.shadowColor = player.shields >= PLAYER_MAX_SHIELDS ? "#64ffb6" : "#8ce7ff";
  ctx.shadowBlur = 34;
  ctx.strokeStyle = player.shields >= PLAYER_MAX_SHIELDS ? "#f9f871" : "#8ce7ff";
  ctx.lineWidth = 5 + player.shields;
  ctx.beginPath();
  ctx.ellipse(x, y, player.w * 0.66, player.h * 0.64, Math.sin(now / 480) * 0.12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(x, y, player.w * 0.78, player.h * 0.74, -Math.sin(now / 420) * 0.14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#b7ffe4";
  for (let i = 0; i < player.shields; i += 1) {
    ctx.beginPath();
    ctx.arc(x, y, player.w * (0.42 + i * 0.11), now / 230 + i, now / 230 + i + 1.7);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = "#d9fbff";
  ctx.font = "900 16px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`闂?{player.shields}`, x, y - player.h * 0.64);
  ctx.restore();
}

function drawOppressionEffect(now) {
  if (!player || player.oppressionTimer <= 0) return;
  const x = player.x - cameraX + player.w / 2;
  const y = player.y + player.h / 2;
  const pulse = 1 + Math.sin(now / 70) * 0.08;

  ctx.save();
  ctx.globalAlpha = 0.72;
  ctx.shadowColor = "#8ce7ff";
  ctx.shadowBlur = 28;
  ctx.strokeStyle = "#8ce7ff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(x, y, player.w * 0.82 * pulse, player.h * 0.9 * pulse, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    const lx = x - 34 + i * 17 + Math.sin(now / 80 + i) * 5;
    ctx.beginPath();
    ctx.moveTo(lx, y - 52);
    ctx.lineTo(lx + 12, y - 22);
    ctx.lineTo(lx - 3, y + 8);
    ctx.lineTo(lx + 10, y + 38);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(220, 235, 240, 0.55)";
  for (let i = 0; i < 7; i += 1) {
    ctx.beginPath();
    ctx.ellipse(x - 40 + i * 14, player.y + player.h + 4 - Math.sin(now / 110 + i) * 8, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPistolCompanion(now) {
  if (getBareHandsEnabled()) return;
  if (!player.hasPistol) return;
  const pig = getPigCompanionPosition(now);
  const x = player.pistolMode === "pig" ? pig.x - cameraX : player.x - cameraX - 34 + Math.sin(now / 220) * 3;
  const y = player.pistolMode === "pig" ? pig.y : player.y + 38 + Math.sin(now / 180) * 4;

  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = player.pistolMode === "pig" ? "#ff9fbe" : "#8ee5ff";
  ctx.shadowBlur = 8 + Math.sin(now / 100) * 3;
  if (player.pistolMode === "pig") {
    const facing = player.pigVx > 12 ? 1 : player.pigVx < -12 ? -1 : player.dir;
    const trot = Math.sin(now / 95) * clamp(Math.abs(player.pigVx) / 260, 0.2, 1);
    ctx.scale(facing, 1);
    ctx.fillStyle = "#ff9fbe";
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 16, trot * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-14, -12, 7, 0, Math.PI * 2);
    ctx.arc(14, -12, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d96b8c";
    ctx.fillRect(-13, 12 + trot * 2, 5, 8);
    ctx.fillRect(8, 12 - trot * 2, 5, 8);
    ctx.fillStyle = "#ffd1df";
    ctx.beginPath();
    ctx.ellipse(0, 2, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#673344";
    ctx.fillRect(-8, -5, 3, 3);
    ctx.fillRect(5, -5, 3, 3);
    ctx.fillStyle = "#673344";
    ctx.fillRect(-4, 1, 3, 3);
    ctx.fillRect(2, 1, 3, 3);
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 27 + Math.sin(now / 160) * 2, -0.7, 0.7);
    ctx.stroke();
  } else {
    ctx.scale(player.dir, 1);
    roundRect(-18, -6, 36, 12, 4, "#3f4b55");
    ctx.fillStyle = "#ffc857";
    ctx.fillRect(15, -2, 8, 4);
    ctx.fillStyle = "#2b333b";
    ctx.fillRect(-2, 5, 8, 12);
  }
  ctx.restore();
}

function drawPlayerShots(now) {
  for (const shot of playerShots) {
    const x = shot.x - cameraX;
    if (x < -80 || x > VIEW_WIDTH + 80) continue;
    ctx.save();
    ctx.translate(x, shot.y);
    if (shot.kind === "shuttle") {
      ctx.rotate(Math.atan2(shot.vy, shot.vx) + Math.sin(shot.spin || 0) * 0.18);
      ctx.shadowColor = shot.color || "#e9fbff";
      ctx.shadowBlur = shot.trail === "ghostWind" ? 22 : 24;
      if (shot.trail === "ghostWind") {
        const ghost = shot.lightning || "#b7ffe4";
        ctx.globalAlpha = 0.82;
        ctx.strokeStyle = ghost;
        ctx.lineWidth = shot.jumpSmash ? 4.6 : 3.6;
        ctx.shadowColor = shot.color || "#64ffb6";
        ctx.shadowBlur = shot.jumpSmash ? 28 : 22;
        for (let i = 0; i < 5; i += 1) {
          const burst = 18 + i * 7;
          const spread = (i - 2) * (shot.jumpSmash ? 6 : 4);
          ctx.beginPath();
          ctx.moveTo(-18 - i * 4, 0);
          ctx.lineTo(-burst - i * 8, spread + Math.sin(now / 70 + i) * 3);
          ctx.stroke();
        }
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = shot.color || "#64ffb6";
        for (let i = 0; i < 10; i += 1) {
          const angle = -Math.PI + i * 0.34 + Math.sin(now / 120 + i) * 0.12;
          const dist = 18 + (i % 5) * 7;
          ctx.beginPath();
          ctx.ellipse(-16 + Math.cos(angle) * dist, Math.sin(angle) * dist * 0.42, 2.8 + (i % 2), 1.2, angle, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.68;
        ctx.strokeStyle = "#e8fff5";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(-18, 0, shot.jumpSmash ? 22 : 17, -2.6, 2.6);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (shot.trail === "sonic") {
        ctx.strokeStyle = shot.lightning || "#b9fbff";
        ctx.lineWidth = 5;
        for (let r = 12; r <= 26; r += 7) {
          ctx.beginPath();
          ctx.ellipse(-18, 0, r, r * 0.28, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (shot.trail === "arc") {
        ctx.strokeStyle = shot.lightning || "#ffd0d0";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(-10, 0, 28, -0.85, 0.85);
        ctx.stroke();
      } else {
        ctx.fillStyle = shot.lightning || "#ffe66a";
        for (let i = 0; i < 9; i += 1) {
          ctx.beginPath();
          ctx.arc(-28 + i * 6, Math.sin((shot.spin || 0) + i) * 7, 2 + (i % 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
      ctx.beginPath();
      ctx.ellipse(-18, 0, 22, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = shot.lightning || "#8ce7ff";
      ctx.lineWidth = shot.trail === "ghostWind" ? 4 : 3;
      ctx.beginPath();
      ctx.moveTo(-36, -7);
      ctx.lineTo(-24, 2);
      ctx.lineTo(-12, -5);
      ctx.lineTo(0, 4);
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(-30, 8);
      ctx.lineTo(-18, -1);
      ctx.lineTo(-6, 6);
      ctx.stroke();
      ctx.fillStyle = "#f8fbff";
      ctx.beginPath();
      ctx.moveTo(-10, -8);
      ctx.lineTo(15, -3);
      ctx.lineTo(15, 3);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = shot.color || "#56d3ff";
      ctx.beginPath();
      ctx.arc(17, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const pigShot = shot.kind === "pig";
      ctx.rotate(Math.atan2(shot.vy || 0, shot.vx || player.dir));
      ctx.shadowColor = pigShot ? (shot.lightning || "#ff9fbe") : "#8ee5ff";
      ctx.shadowBlur = pigShot ? 24 : 18;
      roundRect(-shot.w / 2 - 28, -3, 28, 6, 3, pigShot ? "rgba(255, 159, 190, 0.42)" : "rgba(255,255,255,0.46)");
      if (pigShot) {
        ctx.strokeStyle = shot.lightning || "#fff0f6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-34, -8);
        ctx.quadraticCurveTo(-22, 7, -8, -2);
        ctx.stroke();
      }
      roundRect(-shot.w / 2, -shot.h / 2, shot.w, shot.h, 4, pigShot ? "#ff9fbe" : "#bce9ff");
      ctx.fillStyle = pigShot ? "#fff0f6" : "#5aa9d6";
      ctx.fillRect(-shot.w / 2 - 5, -2, 6, 4);
    }
    ctx.restore();
  }
}

function drawImpactEffects(now) {
  for (const effect of impactEffects) {
    const x = effect.x - cameraX;
    if (x < -120 || x > VIEW_WIDTH + 120) continue;
    const alpha = clamp(effect.ttl / 0.28, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = effect.color;
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 22;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, effect.y, Math.min(effect.radius, effect.maxRadius), 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      const angle = now / 90 + i * Math.PI / 4;
      const inner = effect.radius * 0.45;
      const outer = effect.radius * 0.95;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * inner, effect.y + Math.sin(angle) * inner);
      ctx.lineTo(x + Math.cos(angle) * outer, effect.y + Math.sin(angle) * outer);
      ctx.stroke();
    }
    ctx.restore();
    if (effect.style && effect.style.startsWith("racket-")) {
      const racketStyle = effect.style.replace("racket-", "");
      ctx.save();
      ctx.globalAlpha = alpha * 0.92;
      ctx.strokeStyle = effect.color;
      ctx.fillStyle = effect.skinColor;
      ctx.shadowColor = effect.color;
      ctx.shadowBlur = racketStyle === "ghostWind" ? 24 : 30;
      ctx.lineCap = "round";
      if (racketStyle === "sonic") {
        ctx.lineWidth = 4;
        for (let i = 0; i < 4; i += 1) {
          ctx.beginPath();
          ctx.ellipse(x - 20 - i * 9, effect.y, 22 + i * 9, 7 + i * 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (racketStyle === "arc") {
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x, effect.y, effect.radius * 0.78, -0.95, 1.05);
        ctx.stroke();
        ctx.strokeStyle = effect.skinColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x - 6, effect.y, effect.radius * 0.55, -1.2, 0.72);
        ctx.stroke();
      } else if (racketStyle === "anta") {
        ctx.lineWidth = 3.5;
        for (let i = 0; i < 3; i += 1) {
          ctx.beginPath();
          ctx.moveTo(x - effect.radius * 0.7, effect.y - 14 + i * 12);
          ctx.quadraticCurveTo(x - 12, effect.y - 34 + i * 14, x + effect.radius * 0.7, effect.y - 10 + i * 8);
          ctx.stroke();
        }
        ctx.fillStyle = effect.skinColor;
        for (let i = 0; i < 6; i += 1) {
          ctx.beginPath();
          ctx.arc(x - 24 + i * 10, effect.y + Math.sin(now / 90 + i) * 13, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (racketStyle === "ghostWind") {
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i += 1) {
          ctx.beginPath();
          ctx.moveTo(x - effect.radius * 0.75 - i * 7, effect.y - 14 + i * 9);
          ctx.bezierCurveTo(x - 24, effect.y - 32 + i * 7, x + 20, effect.y + 18 - i * 5, x + effect.radius * 0.58, effect.y - 2 + i * 4);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = effect.skinColor;
        for (let i = 0; i < 10; i += 1) {
          ctx.beginPath();
          ctx.arc(x - 34 + i * 8, effect.y + Math.sin(now / 70 + i) * 10, 2 + (i % 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (effect.style === "thruster") {
      ctx.save();
      ctx.globalAlpha = alpha * 0.75;
      ctx.fillStyle = effect.skinColor;
      ctx.beginPath();
      ctx.moveTo(x, effect.y - effect.radius);
      ctx.lineTo(x - 16, effect.y + 20);
      ctx.lineTo(x + 16, effect.y + 20);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (effect.style === "ghostWind") {
      ctx.save();
      ctx.globalAlpha = alpha * 0.9;
      ctx.strokeStyle = effect.skinColor;
      ctx.shadowColor = effect.color;
      ctx.shadowBlur = 26;
      ctx.lineWidth = 4;
      for (let i = 0; i < 5; i += 1) {
        const drift = i * 11;
        ctx.beginPath();
        ctx.moveTo(x - effect.radius * 0.8 - drift, effect.y - 22 + i * 9);
        ctx.bezierCurveTo(x - effect.radius * 0.35, effect.y - 46 + i * 10, x + effect.radius * 0.55, effect.y + 24 - i * 7, x + effect.radius * 0.86, effect.y - 4 + i * 3);
        ctx.stroke();
      }
      ctx.globalAlpha = alpha * 0.52;
      ctx.fillStyle = effect.color;
      for (let i = 0; i < 10; i += 1) {
        ctx.beginPath();
        ctx.arc(x + Math.cos(now / 80 + i) * effect.radius * 0.72, effect.y + Math.sin(now / 95 + i) * effect.radius * 0.5, 2.5 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (effect.style === "ghostWindCage") {
      ctx.save();
      const pulse = 1 + Math.sin(now / 70) * 0.04;
      ctx.globalAlpha = alpha * 0.78;
      ctx.strokeStyle = "#8edebb";
      ctx.fillStyle = "rgba(107, 214, 160, 0.055)";
      ctx.shadowColor = "#6bd6a0";
      ctx.shadowBlur = 22;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.ellipse(x, effect.y, effect.radius * 0.86 * pulse, effect.radius * 0.5, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.64;
      ctx.strokeStyle = effect.skinColor;
      ctx.lineWidth = 1.8;
      for (let i = -2; i <= 2; i += 1) {
        const offset = i * effect.radius * 0.2;
        ctx.beginPath();
        ctx.ellipse(x + offset, effect.y, effect.radius * (0.19 + Math.abs(i) * 0.04), effect.radius * 0.42, 0.08 * i, -Math.PI * 0.38, Math.PI * 0.38);
        ctx.stroke();
      }
      for (let i = 0; i < 5; i += 1) {
        const angle = now / 130 + i * Math.PI / 2.5;
        const px = x + Math.cos(angle) * effect.radius * 0.58;
        const py = effect.y + Math.sin(angle) * effect.radius * 0.28;
        ctx.beginPath();
        ctx.moveTo(px - 14, py + 4);
        ctx.quadraticCurveTo(px, py - 12, px + 18, py - 3);
        ctx.stroke();
      }
      ctx.globalAlpha = alpha * 0.5;
      ctx.fillStyle = "#e8fff5";
      ctx.beginPath();
      ctx.ellipse(x - effect.radius * 0.16, effect.y - effect.radius * 0.14, effect.radius * 0.12, effect.radius * 0.045, -0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (effect.style === "laser") {
      ctx.save();
      ctx.globalAlpha = alpha * 0.82;
      ctx.strokeStyle = effect.skinColor;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x - effect.radius, effect.y - 12);
      ctx.lineTo(x + effect.radius, effect.y + 12);
      ctx.moveTo(x - effect.radius, effect.y + 12);
      ctx.lineTo(x + effect.radius, effect.y - 12);
      ctx.stroke();
      ctx.restore();
    } else if (effect.style === "footwork") {
      ctx.save();
      ctx.globalAlpha = alpha * 0.7;
      ctx.strokeStyle = effect.skinColor;
      ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.ellipse(x + i * 18, effect.y + 20, 16, 5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}

function drawScorchMarks(now) {
  for (const mark of scorchMarks) {
    const x = mark.x - cameraX;
    if (x < -120 || x > VIEW_WIDTH + 120) continue;
    ctx.save();
    ctx.globalAlpha = clamp(mark.ttl / 8, 0, 1) * 0.78;
    ctx.fillStyle = "#2b201d";
    ctx.beginPath();
    ctx.ellipse(x, mark.y, mark.radius, mark.radius * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 116, 64, 0.36)";
    ctx.beginPath();
    ctx.ellipse(x, mark.y - 2, mark.radius * 0.58, mark.radius * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawChibiBear(now, options = {}) {
  const actor = options.actor || player;
  const bounce = Math.sin(now / 120 + actor.x * 0.01) * Math.min(1, Math.abs(actor.vx) / MOVE_SPEED) * 2;
  ctx.translate(0, bounce);

  ctx.fillStyle = "#ded2bf";
  ctx.beginPath();
  ctx.ellipse(-30, 20, 12, 30, 0.18, 0, Math.PI * 2);
  ctx.ellipse(30, 20, 12, 30, -0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ede4d4";
  ctx.beginPath();
  ctx.ellipse(-16, 43, 13, 20, -0.06, 0, Math.PI * 2);
  ctx.ellipse(16, 43, 13, 20, 0.06, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  roundedRectPath(-25, 2, 50, 54, 18);
  ctx.clip();
  ctx.fillStyle = "#f9fbf4";
  ctx.fillRect(-25, 2, 50, 54);
  for (let stripe = 6; stripe < 58; stripe += 10) {
    ctx.fillStyle = "#5ba7cc";
    ctx.fillRect(-25, stripe, 50, 5);
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(36, 74, 84, 0.22)";
  ctx.lineWidth = 2;
  roundedRectPath(-25, 2, 50, 54, 18);
  ctx.stroke();
  drawHeart(0, 29, 0.42, "#bf1730", "#ffd4da");

  ctx.fillStyle = "#e9decd";
  ctx.beginPath();
  ctx.arc(-24, -36, 15, 0, Math.PI * 2);
  ctx.arc(24, -36, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#d1bfa8";
  ctx.beginPath();
  ctx.arc(-24, -36, 9, 0, Math.PI * 2);
  ctx.arc(24, -36, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#eee5d6";
  ctx.beginPath();
  ctx.ellipse(0, -20, 39, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f7efe2";
  ctx.beginPath();
  ctx.ellipse(0, -10, 22, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#573a32";
  ctx.save();
  ctx.rotate(options.angry ? 0.22 : -0.14);
  roundedRectPath(-18, -23, 5, 13, 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.rotate(options.angry ? -0.22 : 0.14);
  roundedRectPath(13, -23, 5, 13, 2);
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.ellipse(0, -9, 9, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.quadraticCurveTo(-5, 3, -12, -1);
  ctx.moveTo(0, -4);
  ctx.quadraticCurveTo(5, 3, 12, -1);
  ctx.stroke();

  if (options.weapon === "racket") {
    drawEquippedRacket(actor.attackTimer || 0);
  }

  if (options.weapon === "antaRacket") {
    drawAntaDingyinRacket(actor.attackTimer || 0);
  }

  if (options.weapon === "butterfly") {
    drawButterflyKnife(actor.attackTimer || 0);
  }
}

function drawEquippedRacket(attackTimer) {
  const racket = getEquippedRacket();
  if (saveData.equippedRacket === "antaDingyin1000") {
    drawAntaDingyinRacket(attackTimer);
    return;
  }
  drawRacketModel(attackTimer, racket);
}

function drawRacketModel(attackTimer, racket) {
  const swing = attackTimer > 0 ? attackTimer / 0.2 : 0;
  const angle = -0.72 + (1 - swing) * 1.05;
  const ghostColor = racket.trail === "ghostWind" ? randomGhostWindColor(Math.sin(performance.now() / 130)) : racket.frame;

  ctx.save();
  ctx.translate(31, 11);
  ctx.rotate(angle);
  ctx.lineCap = "round";

  if (attackTimer > 0) {
    ctx.globalAlpha = racket.trail === "ghostWind" ? 0.46 : 0.58;
    ctx.strokeStyle = ghostColor;
    ctx.shadowColor = ghostColor;
    ctx.shadowBlur = racket.trail === "ghostWind" ? 18 : 28;
    if (racket.trail === "ghostWind") {
      ctx.lineWidth = 8;
      for (let i = 0; i < 2; i += 1) {
        ctx.beginPath();
        ctx.arc(30 - i * 4, -24 + Math.sin(performance.now() / 120 + i) * 2, 34 + i * 8, -0.58, 0.72);
        ctx.stroke();
      }
      ctx.strokeStyle = "#d7eadf";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(34, -26, 43, -0.48, 0.58);
      ctx.stroke();
    } else if (racket.trail === "arc") {
      ctx.lineWidth = 17;
      ctx.beginPath();
      ctx.arc(24, -18, 66, -0.65, 1.1);
      ctx.stroke();
      ctx.strokeStyle = racket.frame2;
      ctx.lineWidth = 6;
      ctx.stroke();
    } else if (racket.trail === "sonic") {
      ctx.lineWidth = 10;
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.arc(24, -18, 48 + i * 12, -0.35, 0.88);
        ctx.stroke();
      }
    } else {
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.arc(24, -18, 58, -0.45, 0.95);
      ctx.stroke();
      ctx.fillStyle = racket.frame2;
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.arc(4 + i * 12, -35 + Math.sin(i) * 10, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  ctx.strokeStyle = racket.shaft;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 26);
  ctx.lineTo(42, -32);
  ctx.stroke();

  ctx.strokeStyle = racket.grip;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-5, 35);
  ctx.lineTo(8, 17);
  ctx.stroke();

  ctx.strokeStyle = racket.frame;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(1, 31);
  ctx.lineTo(10, 19);
  ctx.stroke();

  ctx.save();
  ctx.translate(52, -45);
  ctx.rotate(0.24);
  ctx.shadowColor = attackTimer > 0 ? ghostColor : "transparent";
  ctx.shadowBlur = attackTimer > 0 ? (racket.trail === "ghostWind" ? 28 : 22) : 0;
  ctx.strokeStyle = racket.frame2;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 31, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = racket.frame;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 17, 26, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = racket.string;
  ctx.lineWidth = 1;
  for (let x = -12; x <= 12; x += 6) {
    ctx.beginPath();
    ctx.moveTo(x, -24);
    ctx.lineTo(x, 24);
    ctx.stroke();
  }
  for (let y = -18; y <= 18; y += 6) {
    ctx.beginPath();
    ctx.moveTo(-15, y);
    ctx.lineTo(15, y);
    ctx.stroke();
  }

  ctx.fillStyle = racket.frame2;
  ctx.font = "700 8px system-ui, sans-serif";
  ctx.fillText(racket.label, -13, 4);
  ctx.restore();
  ctx.restore();
}

function drawAntaDingyinRacket(attackTimer) {
  const swing = attackTimer > 0 ? attackTimer / 0.28 : 0;
  const racket = SHOP_RACKETS.antaDingyin1000;
  drawRacketModel(attackTimer, racket);

  ctx.save();
  ctx.translate(31, 11);
  ctx.rotate(-0.72 + (1 - swing) * 1.05);
  ctx.globalAlpha = attackTimer > 0 ? 0.9 : 0.48;
  ctx.shadowColor = "#41ead4";
  ctx.shadowBlur = 22;
  ctx.strokeStyle = "#41ead4";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(52, -45, 33 + i * 5, -0.4 + i * 0.18, 0.22 + i * 0.22);
    ctx.stroke();
  }
  ctx.fillStyle = "#f9f871";
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.arc(22 + i * 12, -70 + Math.sin(i + swing * 4) * 8, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawButterflyKnife(attackTimer) {
  const swing = attackTimer > 0 ? attackTimer / 0.36 : 0;
  const angle = -0.42 + (1 - swing) * 0.95;

  ctx.save();
  ctx.translate(34, 4);
  ctx.rotate(angle);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#563b70";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-3, 26);
  ctx.lineTo(16, -2);
  ctx.stroke();
  ctx.strokeStyle = "#7e5aa5";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(7, 27);
  ctx.lineTo(23, 4);
  ctx.stroke();

  ctx.fillStyle = "#d8dee6";
  ctx.beginPath();
  ctx.moveTo(19, 0);
  ctx.quadraticCurveTo(57, -25, 72, -24);
  ctx.quadraticCurveTo(61, -8, 27, 11);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#788391";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawBoss(now) {
  if (!boss || boss.defeated) return;
  const x = boss.x - cameraX;
  if (x > VIEW_WIDTH + 180 || x + boss.w < -180) return;

  ctx.save();
  ctx.fillStyle = "rgba(30, 44, 39, 0.2)";
  ctx.beginPath();
  ctx.ellipse(x + boss.w / 2, boss.y + boss.h + 6, boss.w * 0.5, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  if (boss.type === "rabbitBoss") {
    for (const minion of boss.minions || []) {
      if (!minion.alive) continue;
      const mx = minion.x - cameraX + minion.w / 2;
      if (mx < -80 || mx > VIEW_WIDTH + 80) continue;
      ctx.save();
      ctx.translate(mx, minion.y + minion.h / 2);
      if (minion.dir < 0) ctx.scale(-1, 1);
      drawRabbitBody(now, minion, 0.52);
      ctx.restore();
    }
  }

  ctx.translate(x + boss.w / 2, boss.y + boss.h / 2);
  applyKomusanDance(now, boss, boss.mech ? 0.52 : 0.72);
  if (boss.dir < 0) ctx.scale(-1, 1);
  if (boss.invulnerable > 0 && Math.floor(now / 65) % 2 === 0) ctx.globalAlpha = 0.52;
  if (boss.empoweredTimer > 0) {
    ctx.shadowColor = "#ff7a45";
    ctx.shadowBlur = 24;
  }
  if (boss.type === "rabbitBoss") {
    drawRabbitBody(now, boss, 1);
  } else if (boss.mech) {
    drawMechBoss(now);
  } else {
    drawChibiBear(now, { actor: boss, weapon: "butterfly", angry: true });
  }
  drawDanceCueLocal(now, boss.mech ? 1.16 : 0.9);
  ctx.restore();
}

function drawExtraBosses(now) {
  for (const extraBoss of extraBosses) {
    if (extraBoss.defeated) continue;
    const x = extraBoss.x - cameraX;
    if (x > VIEW_WIDTH + 220 || x + extraBoss.w < -220) continue;

    ctx.save();
    ctx.fillStyle = "rgba(30, 44, 39, 0.22)";
    ctx.beginPath();
    ctx.ellipse(x + extraBoss.w / 2, extraBoss.y + extraBoss.h + 7, extraBoss.w * 0.48, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    if (extraBoss.type === "rabbitBoss") {
      for (const minion of extraBoss.minions || []) {
        if (!minion.alive) continue;
        const mx = minion.x - cameraX + minion.w / 2;
        if (mx < -80 || mx > VIEW_WIDTH + 80) continue;
        ctx.save();
        ctx.translate(mx, minion.y + minion.h / 2);
        if (minion.dir < 0) ctx.scale(-1, 1);
        drawRabbitBody(now, minion, 0.52);
        ctx.restore();
      }
    }
    ctx.translate(x + extraBoss.w / 2, extraBoss.y + extraBoss.h / 2);
    applyKomusanDance(now, extraBoss, extraBoss.type === "gundamBoss" ? 0.52 : 0.72);
    if (extraBoss.dir < 0) ctx.scale(-1, 1);
    if (extraBoss.invulnerable > 0 && Math.floor(now / 65) % 2 === 0) ctx.globalAlpha = 0.52;
    if (extraBoss.empoweredTimer > 0) {
      ctx.shadowColor = "#ff7a45";
      ctx.shadowBlur = 24;
    }

    if (extraBoss.type === "gundamBoss") {
      drawMechBoss(now, extraBoss);
    } else if (extraBoss.type === "rabbitBoss") {
      drawRabbitBody(now, extraBoss, 1);
    } else {
      ctx.scale(1.18, 1.18);
      drawZombieBossBody(now, extraBoss);
    }
    drawDanceCueLocal(now, extraBoss.type === "gundamBoss" ? 1.18 : 1.05);
    ctx.restore();
  }
}

function drawRabbitBody(now, actor, scale = 1) {
  const swing = actor.attackTimer > 0 ? Math.sin((actor.attackTimer || 0) * 18) * 7 : 0;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(0, Math.sin(now / 150 + actor.x * 0.02) * 2);

  ctx.fillStyle = "rgba(112, 149, 74, 0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 62, 44, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff8ef";
  ctx.beginPath();
  ctx.ellipse(-24 - swing, 18, 14, 32, -0.28, 0, Math.PI * 2);
  ctx.ellipse(24 + swing, 18, 14, 32, 0.28, 0, Math.PI * 2);
  ctx.ellipse(-18, 52, 18, 14, -0.08, 0, Math.PI * 2);
  ctx.ellipse(18, 52, 18, 14, 0.08, 0, Math.PI * 2);
  ctx.fill();

  const bodyGradient = ctx.createLinearGradient(0, -4, 0, 56);
  bodyGradient.addColorStop(0, "#e7ff78");
  bodyGradient.addColorStop(1, "#76b947");
  ctx.fillStyle = bodyGradient;
  roundRect(-34, -2, 68, 62, 18, bodyGradient);
  ctx.fillStyle = "#6bab3f";
  ctx.beginPath();
  ctx.moveTo(-34, 39);
  ctx.quadraticCurveTo(0, 54, 34, 39);
  ctx.lineTo(34, 60);
  ctx.lineTo(-34, 60);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fffdf8";
  ctx.beginPath();
  ctx.ellipse(0, -38, 44, 37, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-18, -80, 13, 43, -0.15, 0, Math.PI * 2);
  ctx.ellipse(18, -80, 13, 43, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c7ef45";
  ctx.beginPath();
  ctx.ellipse(-18, -80, 7, 31, -0.13, 0, Math.PI * 2);
  ctx.ellipse(18, -80, 7, 31, 0.13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#c7ef45";
  ctx.beginPath();
  ctx.arc(24, -70, 12, 0, Math.PI * 2);
  ctx.arc(42, -68, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#93c82f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(30, -64);
  ctx.lineTo(38, -74);
  ctx.stroke();

  ctx.fillStyle = "#1e2426";
  ctx.beginPath();
  ctx.arc(-16, -43, 7, 0, Math.PI * 2);
  ctx.arc(16, -43, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-18, -46, 2.4, 0, Math.PI * 2);
  ctx.arc(14, -46, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff6c80";
  ctx.beginPath();
  ctx.ellipse(0, -32, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1e2426";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -27);
  ctx.quadraticCurveTo(-6, -21, -12, -25);
  ctx.moveTo(0, -27);
  ctx.quadraticCurveTo(6, -21, 12, -25);
  ctx.stroke();

  if ((actor.critImmune || 0) > 0) {
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = "#d8ff83";
    ctx.shadowColor = "#d8ff83";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.ellipse(0, -14, 54, 82, Math.sin(now / 220) * 0.08, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawZombieBossBody(now, actor) {
  ctx.fillStyle = "#7ea766";
  ctx.beginPath();
  ctx.ellipse(0, 8, 36, 43, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#668f58";
  ctx.beginPath();
  ctx.ellipse(0, -31, 34, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#243d2f";
  ctx.fillRect(-17, -36, 7, 7);
  ctx.fillRect(10, -36, 7, 7);
  ctx.strokeStyle = "#243d2f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-17, -16);
  ctx.quadraticCurveTo(0, -6, 17, -16);
  ctx.stroke();
  ctx.fillStyle = "#5c786c";
  roundRect(-28, 10, 56, 44, 8, "#5c786c");
  ctx.strokeStyle = "#72ff6d";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(25, -14);
  ctx.quadraticCurveTo(58, -26, 74, -10 + Math.sin(now / 100 + actor.x) * 4);
  ctx.stroke();
}

function drawMechBoss(now, actor = boss) {
  const swing = actor.attackTimer > 0 ? actor.attackTimer / 0.48 : 0;

  ctx.save();
  ctx.translate(0, Math.sin(now / 160) * 1.6);

  ctx.fillStyle = "#dfe7ef";
  roundRect(-26, 8, 52, 48, 8, "#dfe7ef");
  ctx.fillStyle = "#17438d";
  roundRect(-20, 14, 40, 33, 6, "#17438d");
  ctx.fillStyle = "#d83b3f";
  ctx.beginPath();
  ctx.moveTo(-16, 47);
  ctx.lineTo(0, 66);
  ctx.lineTo(16, 47);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f0c64a";
  ctx.fillRect(-8, 17, 16, 8);

  ctx.fillStyle = "#eef3f8";
  roundRect(-48, 8, 20, 54, 7, "#eef3f8");
  roundRect(28, 8, 20, 54, 7, "#eef3f8");
  ctx.fillStyle = "#d63c3f";
  roundRect(-54, 58, 24, 16, 4, "#d63c3f");
  roundRect(30, 58, 24, 16, 4, "#d63c3f");

  ctx.strokeStyle = "#eef3f8";
  ctx.lineWidth = 11;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-28, 20);
  ctx.lineTo(-58, 36);
  ctx.moveTo(28, 20);
  ctx.lineTo(58 + (1 - swing) * 18, 30 - (1 - swing) * 12);
  ctx.stroke();

  ctx.strokeStyle = "#5e7280";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(56, 30);
  ctx.lineTo(104 + (1 - swing) * 28, 10 - (1 - swing) * 18);
  ctx.stroke();
  ctx.strokeStyle = "#5edbff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(88, 16);
  ctx.lineTo(124 + (1 - swing) * 28, -2 - (1 - swing) * 22);
  ctx.stroke();

  ctx.fillStyle = "#eef3f8";
  ctx.beginPath();
  ctx.ellipse(0, -30, 33, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#333e4c";
  ctx.fillRect(-22, -36, 44, 8);
  ctx.fillStyle = "#f0c64a";
  ctx.beginPath();
  ctx.moveTo(-6, -56);
  ctx.lineTo(-35, -70);
  ctx.lineTo(-12, -44);
  ctx.lineTo(0, -58);
  ctx.lineTo(12, -44);
  ctx.lineTo(35, -70);
  ctx.lineTo(6, -56);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#7e4d65";
  ctx.beginPath();
  ctx.arc(0, -25, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffcf6c";
  ctx.beginPath();
  ctx.arc(-4, -28, 2, 0, Math.PI * 2);
  ctx.arc(4, -28, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBossHud() {
  const hudBoss = boss && boss.active && !boss.defeated
    ? boss
    : extraBosses.find((extraBoss) => extraBoss.active && !extraBoss.defeated);
  if (!hudBoss) return;

  const width = 360;
  const height = 16;
  const x = VIEW_WIDTH / 2 - width / 2;
  const y = 26;
  const currentHp = hudBoss.mech ? hudBoss.mechHp : hudBoss.hp;
  const maxHp = hudBoss.mech ? hudBoss.mechMaxHp : hudBoss.maxHp;
  const fill = width * (currentHp / maxHp);
  const name = hudBoss.name || (hudBoss.mech ? "MECH BOSS" : "BOSS");

  roundRect(x - 14, y - 10, width + 28, 44, 8, "rgba(255, 255, 255, 0.78)");
  ctx.fillStyle = "#4b3841";
  ctx.font = "800 14px system-ui, sans-serif";
  ctx.fillText(name, x, y + 2);
  roundRect(x, y + 9, width, height, 8, "#d9cbc3");
  roundRect(x, y + 9, Math.max(0, fill), height, 8, hudBoss.mech || hudBoss.type === "gundamBoss" ? "#e2b23c" : "#c6404f");
}

function drawDamagePopups() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const popup of damagePopups) {
    const x = popup.x - cameraX;
    if (x < -120 || x > VIEW_WIDTH + 120) continue;
    ctx.globalAlpha = clamp(popup.ttl / 0.35, 0, 1);
    ctx.font = popup.crit ? "900 34px system-ui, sans-serif" : "800 18px system-ui, sans-serif";
    ctx.lineWidth = popup.crit ? 6 : 4;
    ctx.strokeStyle = popup.crit ? "#46151d" : "#233642";
    ctx.fillStyle = popup.crit ? "#ffd94d" : "#ffffff";
    ctx.strokeText(popup.text, x, popup.y);
    ctx.fillText(popup.text, x, popup.y);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawForeground() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  for (let x = 80 - (cameraX % 260); x < VIEW_WIDTH + 80; x += 260) {
    ctx.beginPath();
    ctx.ellipse(x, 462, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCinemaGrade(now) {
  // Keep the global post-process neutral; moment-to-moment skill effects carry the visual upgrade.
}

function roundRect(x, y, w, h, radius, fill) {
  ctx.fillStyle = fill;
  roundedRectPath(x, y, w, h, radius);
  ctx.fill();
}

function roundedRectPath(x, y, w, h, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function approach(value, target, step) {
  if (value < target) return Math.min(value + step, target);
  if (value > target) return Math.max(value - step, target);
  return target;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function startGame() {
  resetGame();
  state = "running";
  startPanel.classList.add("is-hidden");
  shopPanel.classList.add("is-hidden");
  startButton.blur();
}

function finishGame(result) {
  state = result;
  panelTitle.textContent = result === "won" ? "Adventure Clear!" : "Try Again!";
  startButton.textContent = result === "won" ? "Play Again" : "Restart";
  startPanel.classList.remove("is-hidden");
  shopPanel.classList.remove("is-hidden");
  syncShop();
}

function queueAttack() {
  input.attack = true;
  input.attackPressed = true;
}

function setKey(code, value) {
  if (code === "ArrowLeft" || code === "KeyA") input.left = value;
  if (code === "ArrowRight" || code === "KeyD") input.right = value;
  if (code === "ArrowUp" || code === "KeyW" || code === "Space") {
    input.jump = value;
    if (value) input.jumpPressed = true;
  }
  if (code === "KeyE" && value) input.shootPressed = true;
  if (code === "KeyQ" && value) input.toggleWeaponPressed = true;
  if (code === "KeyX" && value) input.executePressed = true;
  if (code === "KeyP" && value) input.toggleJumpSmashPressed = true;
  if (code === "KeyI" && value && saveData.ownedGear.victorP9200Tty) {
    saveData.equippedGear = saveData.equippedGear === "victorP9200Tty" ? "none" : "victorP9200Tty";
    showDamagePopup(player.x + player.w / 2, player.y - 46, saveData.equippedGear === "victorP9200Tty" ? "Shoes On" : "Shoes Off", false);
    saveProgress();
    syncShop();
  }
  if (code === "KeyG" && value && player) {
    player.shuttleModeIndex = (player.shuttleModeIndex + 1) % SHUTTLE_MODES.length;
    showDamagePopup(player.x + player.w / 2, player.y - 42, SHUTTLE_MODES[player.shuttleModeIndex].name, false);
  }
}

window.addEventListener("keydown", (event) => {
  const playableKey = ["ArrowLeft", "ArrowRight", "ArrowUp", "KeyA", "KeyD", "KeyW", "Space", "KeyE", "KeyQ", "KeyG", "KeyX", "KeyI", "KeyP"].includes(
    event.code,
  );
  if (!playableKey && event.code !== "Enter") return;
  event.preventDefault();

  if (state !== "running" && (event.code === "Enter" || event.code === "Space")) {
    startGame();
    return;
  }

  if (!event.repeat) setKey(event.code, true);
});

window.addEventListener("keyup", (event) => {
  setKey(event.code, false);
});

window.addEventListener("resize", () => {
  setupCanvasResolution();
  createCinemaGrain();
});

gameStage.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

canvas.addEventListener("pointerdown", (event) => {
  if (state !== "running" || event.button !== 0) return;
  event.preventDefault();
  queueAttack();
});

document.querySelectorAll(".touch-button").forEach((button) => {
  const key = button.dataset.key;
  const setTouch = (value) => {
    if (key === "left") input.left = value;
    if (key === "right") input.right = value;
    if (key === "jump") {
      input.jump = value;
      if (value) input.jumpPressed = true;
    }
    if (key === "attack") {
      input.attack = value;
      if (value) queueAttack();
    }
  };

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    setTouch(true);
    if (state !== "running") startGame();
  });
  button.addEventListener("pointerup", () => setTouch(false));
  button.addEventListener("pointercancel", () => setTouch(false));
  button.addEventListener("pointerleave", () => setTouch(false));
});

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedLevel = Number(button.dataset.level) || 1;
    syncLevelButtons();
  });
});

startButton.addEventListener("click", startGame);

buySkinButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const skin = button.dataset.skin;
    const item = SHOP_SKINS[skin];
    if (!item || saveData.ownedSkins[skin]) return;
    if (!spendStars(item.price)) return;
    saveData.ownedSkins[skin] = true;
    saveData.equippedSkin = skin;
    saveProgress();
    syncShop();
  });
});

equipSkinButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const skin = button.dataset.skin;
    if (!saveData.ownedSkins[skin]) return;
    saveData.equippedSkin = saveData.equippedSkin === skin ? "bear" : skin;
    saveProgress();
    syncShop();
  });
});

buyRacketButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const racket = button.dataset.racket;
    const item = SHOP_RACKETS[racket];
    if (!item || saveData.ownedRackets[racket]) return;
    if (!isLimitedRacketAvailable(racket)) return;
    const starPrice = getItemStarPrice(item);
    if (!spendStars(starPrice)) return;
    saveData.ownedRackets[racket] = true;
    saveData.equippedRacket = racket;
    if (wheelResultLabel) wheelResultLabel.textContent = `Purchased ${item.name}`;
    saveProgress();
    syncShop();
  });
});

equipRacketButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const racket = button.dataset.racket;
    if (!saveData.ownedRackets[racket]) return;
    saveData.equippedRacket = racket;
    saveProgress();
    syncShop();
  });
});

buyBackgroundButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const background = button.dataset.background;
    const item = SHOP_BACKGROUNDS[background];
    if (!item || saveData.ownedBackgrounds[background]) return;
    if (!spendStars(getItemStarPrice(item))) return;
    saveData.ownedBackgrounds[background] = true;
    if (wheelResultLabel) wheelResultLabel.textContent = `Purchased ${item.name}`;
    saveProgress();
    syncShop();
  });
});

equipBackgroundButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const background = button.dataset.background;
    if (!saveData.ownedBackgrounds[background]) return;
    saveData.equippedBackground = background;
    saveProgress();
    syncShop();
  });
});

if (spinWheelButton) spinWheelButton.addEventListener("click", spinLuckyWheel);
if (redeemSkinButton) redeemSkinButton.addEventListener("click", redeemSkinToken);
if (redeemBackgroundButton) redeemBackgroundButton.addEventListener("click", redeemBackgroundToken);

buyGearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const gear = button.dataset.gear;
    const item = SHOP_GEAR[gear];
    if (!item || saveData.ownedGear[gear]) return;
    if (!spendStars(getItemStarPrice(item))) return;
    saveData.ownedGear[gear] = true;
    saveProgress();
    syncShop();
  });
});

equipGearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const gear = button.dataset.gear;
    if (!saveData.ownedGear[gear]) return;
    saveData.equippedGear = gear;
    saveProgress();
    syncShop();
  });
});

buyPerkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const perk = button.dataset.perk;
    const item = SHOP_PERKS[perk];
    if (!item || saveData.ownedPerks[perk]) return;
    if (!spendStars(getItemStarPrice(item))) return;
    saveData.ownedPerks[perk] = true;
    saveProgress();
    syncShop();
  });
});

equipPerkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const perk = button.dataset.perk;
    if (!saveData.ownedPerks[perk]) return;
    saveData.equippedPerk = saveData.equippedPerk === perk ? "none" : perk;
    saveProgress();
    syncShop();
  });
});

buyAbilityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const ability = button.dataset.ability;
    const item = SHOP_ABILITIES[ability];
    if (!item || saveData.ownedAbilities[ability]) return;
    const starPrice = getItemStarPrice(item);
    if (!spendStars(starPrice)) return;
    saveData.ownedAbilities[ability] = true;
    if (ability === "pigCompanion" && player) {
      player.hasPistol = true;
      player.pistolMode = "pig";
      syncPigCompanion(true);
    }
    saveProgress();
    syncShop();
  });
});

equipAbilityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const ability = button.dataset.ability;
    if (!saveData.ownedAbilities[ability]) return;
    if (ability === "pigCompanion") {
      if (player) {
        player.hasPistol = true;
        player.pistolMode = "pig";
        syncPigCompanion(true);
        showDamagePopup(player.x + player.w / 2, player.y - 34, "Pig Partner", false);
      }
      return;
    }
    saveData.equippedAbility = saveData.equippedAbility === ability ? "none" : ability;
    if (player) {
      player.jumpSmashCharges = getJumpSmashEnabled() ? Math.max(player.jumpSmashCharges || 0, 1) : 0;
      if (getBareHandsEnabled()) {
        player.attackHitActive = false;
        player.attackTimer = 0;
        playerShots = [];
        syncPigCompanion(false);
      }
    }
    saveProgress();
    syncShop();
  });
});

function loop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000 || 0, 1 / 30);
  lastTime = timestamp;
  update(dt);
  render(timestamp);
  requestAnimationFrame(loop);
}

setupCanvasResolution();
createCinemaGrain();
resetGame();
requestAnimationFrame(loop);
