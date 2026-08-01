(() => {
  "use strict";

  const canvas = document.getElementById("worldCanvas");
  const ctx = canvas.getContext("2d");
  const dayCountLabel = document.getElementById("dayCount");
  const timeNameLabel = document.getElementById("timeName");
  const energyValueLabel = document.getElementById("energyValue");
  const positionValueLabel = document.getElementById("positionValue");
  const inventoryGrid = document.getElementById("inventoryGrid");
  const toolbelt = document.getElementById("toolbelt");
  const messageFeed = document.getElementById("messageFeed");
  const introPanel = document.getElementById("introPanel");
  const playButton = document.getElementById("playButton");
  const saveButton = document.getElementById("saveButton");
  const resetButton = document.getElementById("resetButton");
  const modeButton = document.getElementById("modeButton");
  const craftButtons = Array.from(document.querySelectorAll(".craft-button"));
  const touchButtons = Array.from(document.querySelectorAll(".touch-button"));

  const VIEW_WIDTH = 1280;
  const VIEW_HEIGHT = 720;
  const TILE = 32;
  const WORLD_COLS = 260;
  const WORLD_ROWS = 60;
  const WORLD_WIDTH = WORLD_COLS * TILE;
  const WORLD_HEIGHT = WORLD_ROWS * TILE;
  const SAVE_KEY = "starPlainSandboxSaveV1";
  const AUTOSAVE_INTERVAL = 8;
  const REACH = 188;

  const IDS = {
    air: 0,
    grass: 1,
    dirt: 2,
    stone: 3,
    wood: 4,
    leaves: 5,
    sand: 6,
    ore: 7,
    plank: 8,
    lamp: 9,
    sapling: 10,
    bedrock: 11,
  };

  const TILE_INFO = {
    [IDS.air]: { name: "空气", solid: false, item: null, color: "transparent" },
    [IDS.grass]: { name: "草方块", solid: true, item: "dirt", color: "#6ea064" },
    [IDS.dirt]: { name: "泥土", solid: true, item: "dirt", color: "#8a6740" },
    [IDS.stone]: { name: "石头", solid: true, item: "stone", color: "#7e8790" },
    [IDS.wood]: { name: "原木", solid: true, item: "wood", color: "#8d5e33" },
    [IDS.leaves]: { name: "树叶", solid: true, item: "seed", color: "#4f8d4a" },
    [IDS.sand]: { name: "沙子", solid: true, item: "sand", color: "#d7ba6a" },
    [IDS.ore]: { name: "晶矿", solid: true, item: "crystal", color: "#6a707a" },
    [IDS.plank]: { name: "木板", solid: true, item: "plank", color: "#b88043" },
    [IDS.lamp]: { name: "灯", solid: true, item: "lamp", color: "#e5bb49" },
    [IDS.sapling]: { name: "树苗", solid: false, item: "seed", color: "#5f9b48" },
    [IDS.bedrock]: { name: "基岩", solid: true, item: null, color: "#26303a" },
  };

  const ITEMS = {
    dirt: { name: "泥土", color: "#8a6740" },
    stone: { name: "石头", color: "#7e8790" },
    wood: { name: "原木", color: "#8d5e33" },
    plank: { name: "木板", color: "#b88043" },
    lamp: { name: "灯", color: "#e5bb49" },
    crystal: { name: "晶矿", color: "#4fb7bf" },
    seed: { name: "树苗", color: "#5f9b48" },
    sand: { name: "沙子", color: "#d7ba6a" },
  };

  const TOOL_SLOTS = [
    { id: "pickaxe", label: "镐", tooltip: "挖掘", tile: null, item: null },
    { id: "dirt", label: "土", tooltip: "放置泥土", tile: IDS.dirt, item: "dirt" },
    { id: "stone", label: "石", tooltip: "放置石头", tile: IDS.stone, item: "stone" },
    { id: "wood", label: "木", tooltip: "放置原木", tile: IDS.wood, item: "wood" },
    { id: "plank", label: "板", tooltip: "放置木板", tile: IDS.plank, item: "plank" },
    { id: "lamp", label: "灯", tooltip: "放置灯", tile: IDS.lamp, item: "lamp" },
    { id: "seed", label: "苗", tooltip: "栽树苗", tile: IDS.sapling, item: "seed" },
    { id: "sand", label: "沙", tooltip: "放置沙子", tile: IDS.sand, item: "sand" },
  ];

  const RECIPES = {
    plank: {
      cost: { wood: 1 },
      gain: { plank: 4 },
      message: "木板 +4",
    },
    lamp: {
      cost: { wood: 1, crystal: 1 },
      gain: { lamp: 2 },
      message: "灯 +2",
    },
  };

  const state = {
    world: new Uint8Array(WORLD_COLS * WORLD_ROWS),
    seed: 0,
    surfaces: new Int16Array(WORLD_COLS),
    player: createPlayer(),
    input: {
      left: false,
      right: false,
      jump: false,
      jumpPressed: false,
    },
    camera: { x: 0, y: 0 },
    pointer: {
      active: false,
      x: VIEW_WIDTH / 2,
      y: VIEW_HEIGHT / 2,
      worldX: 0,
      worldY: 0,
      tx: 0,
      ty: 0,
      mode: "mine",
      cooldown: 0,
    },
    inventory: createDefaultInventory(),
    selectedSlot: 0,
    creative: false,
    day: 1,
    time: 0.22,
    started: false,
    particles: [],
    lastMessageTimer: 0,
    autosaveTimer: 0,
    uiTimer: 0,
  };

  function createPlayer() {
    return {
      x: 360,
      y: 320,
      w: 24,
      h: 44,
      vx: 0,
      vy: 0,
      dir: 1,
      onGround: false,
      energy: 100,
    };
  }

  function createDefaultInventory() {
    return {
      dirt: 24,
      stone: 0,
      wood: 0,
      plank: 0,
      lamp: 2,
      crystal: 0,
      seed: 2,
      sand: 0,
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function idx(tx, ty) {
    return ty * WORLD_COLS + tx;
  }

  function getTile(tx, ty) {
    if (ty < 0) return IDS.air;
    if (tx < 0 || tx >= WORLD_COLS || ty >= WORLD_ROWS) return IDS.bedrock;
    return state.world[idx(tx, ty)];
  }

  function setTile(tx, ty, id) {
    if (tx < 0 || tx >= WORLD_COLS || ty < 0 || ty >= WORLD_ROWS) return;
    state.world[idx(tx, ty)] = id;
  }

  function isSolidTile(id) {
    return Boolean(TILE_INFO[id] && TILE_INFO[id].solid);
  }

  function mulberry32(seed) {
    return function random() {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash01(x, y) {
    let n = Math.imul(x + 1013, 374761393) ^ Math.imul(y + 6689, 668265263);
    n = (n ^ (n >>> 13)) >>> 0;
    return ((Math.imul(n, 1274126177) ^ n) >>> 0) / 4294967295;
  }

  function generateWorld(seed = Date.now() >>> 0) {
    state.seed = seed;
    const random = mulberry32(seed);
    state.world.fill(IDS.air);

    for (let tx = 0; tx < WORLD_COLS; tx += 1) {
      const ridge =
        Math.sin(tx * 0.057 + seed * 0.0001) * 3.8 +
        Math.sin(tx * 0.019 + 1.8) * 5.5 +
        Math.sin(tx * 0.13) * 1.2;
      const surface = clamp(Math.floor(18 + ridge), 10, 30);
      state.surfaces[tx] = surface;

      for (let ty = 0; ty < WORLD_ROWS; ty += 1) {
        if (ty === WORLD_ROWS - 1) {
          setTile(tx, ty, IDS.bedrock);
        } else if (ty < surface) {
          setTile(tx, ty, IDS.air);
        } else if (ty === surface) {
          setTile(tx, ty, IDS.grass);
        } else if (ty < surface + 4) {
          setTile(tx, ty, IDS.dirt);
        } else {
          setTile(tx, ty, IDS.stone);
        }
      }

      if ((tx > 38 && tx < 50) || (tx > 164 && tx < 176)) {
        for (let ty = surface; ty < surface + 4; ty += 1) {
          setTile(tx, ty, IDS.sand);
        }
      }
    }

    carveCaves(random);
    placeOre(random);

    for (let tx = 8; tx < WORLD_COLS - 8; tx += 1) {
      if (random() < 0.055 && getTile(tx, state.surfaces[tx]) === IDS.grass) {
        growTree(tx, state.surfaces[tx] - 1, random);
        tx += 4;
      }
    }

    state.inventory = createDefaultInventory();
    state.player = createPlayer();
    placePlayerAtSurface(12);
    state.day = 1;
    state.time = 0.22;
    state.creative = false;
    state.selectedSlot = 0;
    state.particles = [];
    updateCamera(1);
  }

  function carveCaves(random) {
    for (let i = 0; i < 42; i += 1) {
      const cx = Math.floor(random() * WORLD_COLS);
      const cy = Math.floor(26 + random() * 26);
      const rx = Math.floor(4 + random() * 9);
      const ry = Math.floor(2 + random() * 5);

      for (let tx = cx - rx; tx <= cx + rx; tx += 1) {
        for (let ty = cy - ry; ty <= cy + ry; ty += 1) {
          const dx = (tx - cx) / rx;
          const dy = (ty - cy) / ry;
          const surface = state.surfaces[clamp(tx, 0, WORLD_COLS - 1)];
          if (dx * dx + dy * dy < 1 && ty > surface + 5 && getTile(tx, ty) !== IDS.bedrock) {
            setTile(tx, ty, IDS.air);
          }
        }
      }
    }
  }

  function placeOre(random) {
    for (let i = 0; i < 85; i += 1) {
      const cx = Math.floor(8 + random() * (WORLD_COLS - 16));
      const cy = Math.floor(27 + random() * 26);
      const radius = 1 + Math.floor(random() * 2);

      for (let tx = cx - radius; tx <= cx + radius; tx += 1) {
        for (let ty = cy - radius; ty <= cy + radius; ty += 1) {
          const distance = Math.abs(tx - cx) + Math.abs(ty - cy);
          if (distance <= radius + 1 && getTile(tx, ty) === IDS.stone && random() < 0.76) {
            setTile(tx, ty, IDS.ore);
          }
        }
      }
    }
  }

  function growTree(tx, baseY, random = Math.random) {
    if (baseY < 5 || baseY >= WORLD_ROWS - 2) return false;
    const below = getTile(tx, baseY + 1);
    if (below !== IDS.grass && below !== IDS.dirt && below !== IDS.sand) return false;

    for (let ty = baseY - 5; ty <= baseY; ty += 1) {
      for (let ox = -2; ox <= 2; ox += 1) {
        const current = getTile(tx + ox, ty);
        if (current !== IDS.air && current !== IDS.leaves && current !== IDS.sapling) return false;
      }
    }

    const height = 4 + Math.floor(random() * 2);
    for (let i = 0; i < height; i += 1) {
      setTile(tx, baseY - i, IDS.wood);
    }

    const leafY = baseY - height + 1;
    for (let ox = -2; ox <= 2; ox += 1) {
      for (let oy = -2; oy <= 2; oy += 1) {
        const distance = Math.abs(ox) + Math.abs(oy);
        if (distance <= 3 && getTile(tx + ox, leafY + oy) === IDS.air) {
          setTile(tx + ox, leafY + oy, IDS.leaves);
        }
      }
    }

    return true;
  }

  function placePlayerAtSurface(tx) {
    const surface = findSurface(tx);
    state.player.x = tx * TILE + 4;
    state.player.y = surface * TILE - state.player.h - 2;
    state.player.vx = 0;
    state.player.vy = 0;
  }

  function findSurface(tx) {
    for (let ty = 0; ty < WORLD_ROWS; ty += 1) {
      if (isSolidTile(getTile(tx, ty))) return ty;
    }
    return WORLD_ROWS - 2;
  }

  function serializeWorld() {
    let output = "";
    for (let i = 0; i < state.world.length; i += 1) {
      output += state.world[i].toString(36);
    }
    return output;
  }

  function deserializeWorld(serialized) {
    if (!serialized || serialized.length !== WORLD_COLS * WORLD_ROWS) return false;
    for (let i = 0; i < serialized.length; i += 1) {
      const value = parseInt(serialized[i], 36);
      if (!Number.isFinite(value)) return false;
      state.world[i] = value;
    }
    rebuildSurfaceMap();
    return true;
  }

  function rebuildSurfaceMap() {
    for (let tx = 0; tx < WORLD_COLS; tx += 1) {
      state.surfaces[tx] = findSurface(tx);
    }
  }

  function loadGame() {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) return false;

      const save = JSON.parse(raw);
      if (!save || save.version !== 1 || !deserializeWorld(save.world)) return false;

      state.seed = Number(save.seed) || Date.now();
      state.inventory = { ...createDefaultInventory(), ...(save.inventory || {}) };
      state.player = { ...createPlayer(), ...(save.player || {}) };
      state.player.energy = clamp(Number(state.player.energy) || 100, 0, 100);
      state.selectedSlot = clamp(Number(save.selectedSlot) || 0, 0, TOOL_SLOTS.length - 1);
      state.creative = Boolean(save.creative);
      state.day = Math.max(1, Number(save.day) || 1);
      state.time = clamp(Number(save.time) || 0.22, 0, 1);
      updateCamera(1);
      announce("已读取上次世界");
      return true;
    } catch {
      return false;
    }
  }

  function saveGame(showMessage = true) {
    try {
      const save = {
        version: 1,
        seed: state.seed,
        world: serializeWorld(),
        inventory: state.inventory,
        player: {
          x: state.player.x,
          y: state.player.y,
          vx: 0,
          vy: 0,
          dir: state.player.dir,
          energy: state.player.energy,
        },
        selectedSlot: state.selectedSlot,
        creative: state.creative,
        day: state.day,
        time: state.time,
      };
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      if (showMessage) announce("世界已保存");
      return true;
    } catch {
      if (showMessage) announce("当前浏览器无法保存");
      return false;
    }
  }

  function addItem(item, amount) {
    if (!item || !amount) return;
    state.inventory[item] = Math.max(0, (state.inventory[item] || 0) + amount);
  }

  function hasItems(cost) {
    if (state.creative) return true;
    return Object.entries(cost).every(([item, amount]) => (state.inventory[item] || 0) >= amount);
  }

  function spendItems(cost) {
    if (state.creative) return true;
    if (!hasItems(cost)) return false;
    for (const [item, amount] of Object.entries(cost)) {
      state.inventory[item] -= amount;
    }
    return true;
  }

  function craft(recipeId) {
    const recipe = RECIPES[recipeId];
    if (!recipe) return;
    if (!spendItems(recipe.cost)) {
      announce("材料不够");
      return;
    }
    for (const [item, amount] of Object.entries(recipe.gain)) {
      addItem(item, amount);
    }
    announce(recipe.message);
    updateUI();
  }

  function selectedTool() {
    return TOOL_SLOTS[state.selectedSlot] || TOOL_SLOTS[0];
  }

  function getPointerTile(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = VIEW_WIDTH / rect.width;
    const scaleY = VIEW_HEIGHT / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    state.pointer.x = x;
    state.pointer.y = y;
    state.pointer.worldX = x + state.camera.x;
    state.pointer.worldY = y + state.camera.y;
    state.pointer.tx = Math.floor(state.pointer.worldX / TILE);
    state.pointer.ty = Math.floor(state.pointer.worldY / TILE);
  }

  function isTargetInReach(tx, ty) {
    const px = state.player.x + state.player.w / 2;
    const py = state.player.y + state.player.h / 2;
    const txCenter = tx * TILE + TILE / 2;
    const tyCenter = ty * TILE + TILE / 2;
    return Math.hypot(px - txCenter, py - tyCenter) <= REACH;
  }

  function tryMine(tx, ty) {
    const id = getTile(tx, ty);
    if (id === IDS.air || id === IDS.bedrock) return false;
    if (!isTargetInReach(tx, ty)) {
      announce("距离太远");
      return false;
    }
    if (!state.creative && state.player.energy < 6) {
      announce("能量不足");
      return false;
    }

    const info = TILE_INFO[id];
    setTile(tx, ty, IDS.air);

    if (!state.creative) {
      state.player.energy = Math.max(0, state.player.energy - 6);
      if (id === IDS.ore) {
        addItem("stone", 1);
        addItem("crystal", 1);
        announce("晶矿 +1");
      } else if (id === IDS.leaves) {
        addItem("seed", hash01(tx, ty) > 0.45 ? 1 : 0);
        announce("树苗 +1");
      } else if (info.item) {
        addItem(info.item, 1);
        announce(`${ITEMS[info.item].name} +1`);
      }
    } else {
      announce("已移除");
    }

    spawnBreakParticles(tx, ty, info.color);
    updateUI();
    return true;
  }

  function tryPlace(tx, ty) {
    const tool = selectedTool();
    if (!tool.tile) return tryMine(tx, ty);
    if (!isTargetInReach(tx, ty)) {
      announce("距离太远");
      return false;
    }
    if (getTile(tx, ty) !== IDS.air) return false;
    if (!hasAdjacentSolid(tx, ty) && !state.creative) {
      announce("需要贴着方块");
      return false;
    }
    if (rectOverlapsTile(state.player, tx, ty)) {
      announce("这里站着人");
      return false;
    }
    if (!state.creative && (state.inventory[tool.item] || 0) <= 0) {
      announce("背包没有这个方块");
      return false;
    }
    if (!state.creative && state.player.energy < 2) {
      announce("能量不足");
      return false;
    }

    setTile(tx, ty, tool.tile);
    if (!state.creative) {
      state.inventory[tool.item] -= 1;
      state.player.energy = Math.max(0, state.player.energy - 2);
    }
    spawnBreakParticles(tx, ty, TILE_INFO[tool.tile].color);
    announce(`${TILE_INFO[tool.tile].name}已放置`);
    updateUI();
    return true;
  }

  function hasAdjacentSolid(tx, ty) {
    return (
      isSolidTile(getTile(tx + 1, ty)) ||
      isSolidTile(getTile(tx - 1, ty)) ||
      isSolidTile(getTile(tx, ty + 1)) ||
      isSolidTile(getTile(tx, ty - 1))
    );
  }

  function rectOverlapsTile(rect, tx, ty) {
    const tileRect = { x: tx * TILE, y: ty * TILE, w: TILE, h: TILE };
    return (
      rect.x < tileRect.x + tileRect.w &&
      rect.x + rect.w > tileRect.x &&
      rect.y < tileRect.y + tileRect.h &&
      rect.y + rect.h > tileRect.y
    );
  }

  function spawnBreakParticles(tx, ty, color) {
    for (let i = 0; i < 10; i += 1) {
      state.particles.push({
        x: tx * TILE + 8 + Math.random() * 16,
        y: ty * TILE + 8 + Math.random() * 16,
        vx: -80 + Math.random() * 160,
        vy: -160 + Math.random() * 90,
        life: 0.42 + Math.random() * 0.22,
        maxLife: 0.64,
        color,
        size: 3 + Math.random() * 4,
      });
    }
    state.particles = state.particles.slice(-180);
  }

  function update(dt) {
    if (state.started) {
      updatePlayer(dt);
      updatePointerAction(dt);
    }

    state.time += dt / 190;
    if (state.time >= 1) {
      state.time -= 1;
      state.day += 1;
    }

    updateSaplings(dt);
    updateParticles(dt);
    updateCamera(dt);

    state.autosaveTimer += dt;
    if (state.autosaveTimer >= AUTOSAVE_INTERVAL) {
      state.autosaveTimer = 0;
      saveGame(false);
    }

    state.uiTimer += dt;
    if (state.uiTimer >= 0.14) {
      state.uiTimer = 0;
      updateUI();
    }

    if (state.lastMessageTimer > 0) {
      state.lastMessageTimer -= dt;
      if (state.lastMessageTimer <= 0) messageFeed.classList.remove("is-visible");
    }
  }

  function updatePlayer(dt) {
    const player = state.player;
    const move = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);
    const maxSpeed = state.creative ? 320 : 248;
    const accel = player.onGround ? 2100 : 1450;
    const friction = player.onGround ? 2500 : 900;

    if (move !== 0) {
      player.vx = approach(player.vx, move * maxSpeed, accel * dt);
      player.dir = move;
    } else {
      player.vx = approach(player.vx, 0, friction * dt);
    }

    if (state.input.jumpPressed && player.onGround) {
      player.vy = -690;
      player.onGround = false;
    }
    state.input.jumpPressed = false;

    player.vy += 1750 * dt;
    player.vy = clamp(player.vy, -900, 980);

    player.x += player.vx * dt;
    resolveHorizontal();

    player.y += player.vy * dt;
    resolveVertical();

    player.x = clamp(player.x, 1, WORLD_WIDTH - player.w - 1);
    if (player.y > WORLD_HEIGHT + 120) {
      placePlayerAtSurface(Math.floor(player.x / TILE));
      announce("回到地面");
    }

    const regen = player.onGround ? 13 : 8;
    player.energy = clamp(player.energy + regen * dt, 0, 100);
  }

  function approach(value, target, amount) {
    if (value < target) return Math.min(target, value + amount);
    if (value > target) return Math.max(target, value - amount);
    return target;
  }

  function resolveHorizontal() {
    const player = state.player;
    const top = Math.floor((player.y + 3) / TILE);
    const bottom = Math.floor((player.y + player.h - 3) / TILE);

    if (player.vx > 0) {
      const right = Math.floor((player.x + player.w) / TILE);
      for (let ty = top; ty <= bottom; ty += 1) {
        if (isSolidTile(getTile(right, ty))) {
          player.x = right * TILE - player.w - 0.01;
          player.vx = 0;
          return;
        }
      }
    } else if (player.vx < 0) {
      const left = Math.floor(player.x / TILE);
      for (let ty = top; ty <= bottom; ty += 1) {
        if (isSolidTile(getTile(left, ty))) {
          player.x = (left + 1) * TILE + 0.01;
          player.vx = 0;
          return;
        }
      }
    }
  }

  function resolveVertical() {
    const player = state.player;
    const left = Math.floor((player.x + 3) / TILE);
    const right = Math.floor((player.x + player.w - 3) / TILE);
    player.onGround = false;

    if (player.vy > 0) {
      const bottom = Math.floor((player.y + player.h) / TILE);
      for (let tx = left; tx <= right; tx += 1) {
        if (isSolidTile(getTile(tx, bottom))) {
          player.y = bottom * TILE - player.h - 0.01;
          player.vy = 0;
          player.onGround = true;
          return;
        }
      }
    } else if (player.vy < 0) {
      const top = Math.floor(player.y / TILE);
      for (let tx = left; tx <= right; tx += 1) {
        if (isSolidTile(getTile(tx, top))) {
          player.y = (top + 1) * TILE + 0.01;
          player.vy = 0;
          return;
        }
      }
    }
  }

  function updatePointerAction(dt) {
    if (!state.pointer.active) return;
    state.pointer.cooldown -= dt;
    if (state.pointer.cooldown > 0) return;
    const worked =
      state.pointer.mode === "place"
        ? tryPlace(state.pointer.tx, state.pointer.ty)
        : tryMine(state.pointer.tx, state.pointer.ty);
    state.pointer.cooldown = worked ? 0.12 : 0.18;
  }

  function updateSaplings(dt) {
    const chance = dt * 0.018;
    const minX = Math.max(1, Math.floor(state.camera.x / TILE) - 4);
    const maxX = Math.min(WORLD_COLS - 2, Math.ceil((state.camera.x + VIEW_WIDTH) / TILE) + 4);
    const minY = Math.max(4, Math.floor(state.camera.y / TILE) - 4);
    const maxY = Math.min(WORLD_ROWS - 2, Math.ceil((state.camera.y + VIEW_HEIGHT) / TILE) + 4);

    for (let tx = minX; tx <= maxX; tx += 1) {
      for (let ty = minY; ty <= maxY; ty += 1) {
        if (getTile(tx, ty) === IDS.sapling && Math.random() < chance) {
          setTile(tx, ty, IDS.air);
          if (growTree(tx, ty, Math.random)) {
            announce("树苗长成了");
            spawnBreakParticles(tx, ty, TILE_INFO[IDS.leaves].color);
          } else {
            setTile(tx, ty, IDS.sapling);
          }
        }
      }
    }
  }

  function updateParticles(dt) {
    for (const particle of state.particles) {
      particle.life -= dt;
      particle.vy += 460 * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
    }
    state.particles = state.particles.filter((particle) => particle.life > 0);
  }

  function updateCamera(dt) {
    const player = state.player;
    const targetX = clamp(player.x + player.w / 2 - VIEW_WIDTH * 0.47, 0, WORLD_WIDTH - VIEW_WIDTH);
    const targetY = clamp(player.y + player.h / 2 - VIEW_HEIGHT * 0.58, 0, WORLD_HEIGHT - VIEW_HEIGHT);
    const pull = clamp(dt * 7, 0, 1);
    state.camera.x += (targetX - state.camera.x) * pull;
    state.camera.y += (targetY - state.camera.y) * pull;
  }

  function render(now) {
    drawSky(now);
    drawLandscape(now);

    ctx.save();
    ctx.translate(-Math.floor(state.camera.x), -Math.floor(state.camera.y));
    drawWorld(now);
    drawParticles();
    drawPlayer(now);
    ctx.restore();

    drawCursor();
    drawNightOverlay();
    drawMiniMap();
  }

  function drawSky(now) {
    const night = nightAmount();
    const sky = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
    sky.addColorStop(0, mixColor("#7cc5de", "#0e1d2d", night));
    sky.addColorStop(0.56, mixColor("#dfe9c9", "#243b43", night));
    sky.addColorStop(1, mixColor("#88a66c", "#2c3a2d", night));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    const sunX = ((state.time + 0.05) % 1) * VIEW_WIDTH;
    const sunY = 110 + Math.sin(state.time * Math.PI * 2) * 86;
    ctx.save();
    ctx.globalAlpha = 0.78 - night * 0.48;
    ctx.fillStyle = "#e5bb49";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = night * 0.72;
    ctx.fillStyle = "#f7efd0";
    for (let i = 0; i < 48; i += 1) {
      const x = (hash01(i, 4) * VIEW_WIDTH + now * 0.004) % VIEW_WIDTH;
      const y = 34 + hash01(i, 9) * 250;
      const r = 1 + hash01(i, 12) * 1.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawLandscape(now) {
    const night = nightAmount();
    const baseY = 440 - state.camera.y * 0.08;
    ctx.save();
    ctx.translate(-(state.camera.x * 0.08) % 320, 0);

    for (let layer = 0; layer < 3; layer += 1) {
      ctx.beginPath();
      ctx.moveTo(-360, VIEW_HEIGHT);
      for (let x = -360; x <= VIEW_WIDTH + 360; x += 80) {
        const y =
          baseY +
          layer * 42 +
          Math.sin((x + layer * 90 + now * 0.01) * 0.012) * 18 +
          Math.cos((x + layer * 30) * 0.021) * 14;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(VIEW_WIDTH + 360, VIEW_HEIGHT);
      ctx.closePath();
      ctx.fillStyle = mixColor(["#87a95e", "#6f8f5d", "#526f59"][layer], "#1d2f2d", night);
      ctx.globalAlpha = 0.32 + layer * 0.16;
      ctx.fill();
    }
    ctx.restore();
  }

  function drawWorld(now) {
    const minX = Math.max(0, Math.floor(state.camera.x / TILE) - 1);
    const maxX = Math.min(WORLD_COLS - 1, Math.ceil((state.camera.x + VIEW_WIDTH) / TILE) + 1);
    const minY = Math.max(0, Math.floor(state.camera.y / TILE) - 1);
    const maxY = Math.min(WORLD_ROWS - 1, Math.ceil((state.camera.y + VIEW_HEIGHT) / TILE) + 1);

    drawLampGlows(minX, maxX, minY, maxY);

    for (let ty = minY; ty <= maxY; ty += 1) {
      for (let tx = minX; tx <= maxX; tx += 1) {
        const id = getTile(tx, ty);
        if (id !== IDS.air) drawTile(tx, ty, id, now);
      }
    }
  }

  function drawLampGlows(minX, maxX, minY, maxY) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let ty = minY; ty <= maxY; ty += 1) {
      for (let tx = minX; tx <= maxX; tx += 1) {
        if (getTile(tx, ty) !== IDS.lamp) continue;
        const x = tx * TILE + TILE / 2;
        const y = ty * TILE + TILE / 2;
        const glow = ctx.createRadialGradient(x, y, 8, x, y, 190);
        glow.addColorStop(0, "rgba(229, 187, 73, 0.42)");
        glow.addColorStop(1, "rgba(229, 187, 73, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(x - 190, y - 190, 380, 380);
      }
    }
    ctx.restore();
  }

  function drawTile(tx, ty, id, now) {
    const x = tx * TILE;
    const y = ty * TILE;
    const wobble = hash01(tx, ty);

    switch (id) {
      case IDS.grass:
        ctx.fillStyle = "#7b5a34";
        ctx.fillRect(x, y + 8, TILE, TILE - 8);
        ctx.fillStyle = "#6ea064";
        ctx.fillRect(x, y, TILE, 12);
        ctx.fillStyle = "#8bc06d";
        ctx.fillRect(x + 3, y + 2, 9, 4);
        ctx.fillRect(x + 18, y + 4, 10, 4);
        break;
      case IDS.dirt:
        ctx.fillStyle = "#8a6740";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = "rgba(67, 45, 28, 0.28)";
        ctx.fillRect(x + 6, y + 9 + wobble * 8, 5, 4);
        ctx.fillRect(x + 20, y + 20 - wobble * 5, 4, 4);
        break;
      case IDS.stone:
        ctx.fillStyle = "#7e8790";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.strokeStyle = "rgba(38, 48, 58, 0.26)";
        ctx.beginPath();
        ctx.moveTo(x + 6, y + 10);
        ctx.lineTo(x + 19, y + 8 + wobble * 6);
        ctx.lineTo(x + 27, y + 18);
        ctx.moveTo(x + 8, y + 25);
        ctx.lineTo(x + 22, y + 23);
        ctx.stroke();
        break;
      case IDS.wood:
        ctx.fillStyle = "#8d5e33";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = "rgba(55, 32, 18, 0.24)";
        ctx.fillRect(x + 8, y, 4, TILE);
        ctx.fillRect(x + 21, y, 3, TILE);
        break;
      case IDS.leaves:
        ctx.fillStyle = "#4f8d4a";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = "rgba(207, 229, 166, 0.28)";
        ctx.beginPath();
        ctx.arc(x + 10, y + 11, 4, 0, Math.PI * 2);
        ctx.arc(x + 23, y + 20, 5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case IDS.sand:
        ctx.fillStyle = "#d7ba6a";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = "rgba(118, 92, 38, 0.18)";
        ctx.fillRect(x + 5, y + 10, 7, 3);
        ctx.fillRect(x + 18, y + 23, 9, 3);
        break;
      case IDS.ore:
        ctx.fillStyle = "#6a707a";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = "#4fb7bf";
        ctx.fillRect(x + 7, y + 9, 6, 6);
        ctx.fillRect(x + 18, y + 20, 7, 5);
        ctx.fillStyle = "#f7efd0";
        ctx.fillRect(x + 10, y + 10, 2, 2);
        break;
      case IDS.plank:
        ctx.fillStyle = "#b88043";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.strokeStyle = "rgba(77, 45, 21, 0.32)";
        ctx.beginPath();
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x + TILE, y + 10);
        ctx.moveTo(x, y + 21);
        ctx.lineTo(x + TILE, y + 21);
        ctx.stroke();
        break;
      case IDS.lamp:
        ctx.fillStyle = "#7b5a34";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = "#e5bb49";
        ctx.fillRect(x + 7, y + 7, 18, 18);
        ctx.fillStyle = `rgba(255, 248, 223, ${0.48 + Math.sin(now / 160) * 0.12})`;
        ctx.fillRect(x + 11, y + 10, 10, 10);
        break;
      case IDS.sapling:
        ctx.strokeStyle = "#3f6b35";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 16, y + 27);
        ctx.lineTo(x + 16, y + 11);
        ctx.stroke();
        ctx.fillStyle = "#5f9b48";
        ctx.beginPath();
        ctx.ellipse(x + 11, y + 14, 8, 5, -0.5, 0, Math.PI * 2);
        ctx.ellipse(x + 21, y + 11, 8, 5, 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case IDS.bedrock:
        ctx.fillStyle = "#26303a";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(x + 6, y + 8, 8, 5);
        ctx.fillRect(x + 19, y + 20, 7, 4);
        break;
      default:
        break;
    }

    if (id !== IDS.sapling) {
      ctx.strokeStyle = "rgba(23, 39, 36, 0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
    }
  }

  function drawParticles() {
    for (const particle of state.particles) {
      const alpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawPlayer(now) {
    const player = state.player;
    const x = player.x;
    const y = player.y;
    const walk = Math.sin(now / 100) * clamp(Math.abs(player.vx) / 220, 0, 1);

    ctx.save();
    ctx.translate(x + player.w / 2, y + player.h / 2);
    ctx.scale(player.dir, 1);

    ctx.fillStyle = "rgba(23, 39, 36, 0.22)";
    ctx.beginPath();
    ctx.ellipse(0, player.h / 2 + 5, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#315b78";
    ctx.fillRect(-10, -4, 20, 24);

    ctx.fillStyle = "#f0c692";
    ctx.fillRect(-8, -24, 16, 16);

    ctx.fillStyle = "#e5bb49";
    ctx.fillRect(-11, -29, 22, 8);
    ctx.fillStyle = "#b88043";
    ctx.fillRect(6, -3, 8, 20);

    ctx.strokeStyle = "#172724";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-8, 18);
    ctx.lineTo(-12 + walk * 3, 30);
    ctx.moveTo(8, 18);
    ctx.lineTo(12 - walk * 3, 30);
    ctx.stroke();

    ctx.strokeStyle = "#6a4c2d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 1);
    ctx.lineTo(25, -13);
    ctx.stroke();
    ctx.fillStyle = "#7e8790";
    ctx.fillRect(23, -19, 10, 9);

    ctx.restore();
  }

  function drawCursor() {
    const tx = state.pointer.tx;
    const ty = state.pointer.ty;
    const x = tx * TILE - state.camera.x;
    const y = ty * TILE - state.camera.y;
    if (x < -TILE || y < -TILE || x > VIEW_WIDTH || y > VIEW_HEIGHT) return;

    const inReach = isTargetInReach(tx, ty);
    const tool = selectedTool();
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = inReach ? (tool.tile ? "#e5bb49" : "#f7efd0") : "#d35c4a";
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
    ctx.restore();
  }

  function drawNightOverlay() {
    const night = nightAmount();
    if (night <= 0.02) return;

    ctx.save();
    ctx.fillStyle = `rgba(5, 12, 24, ${night * 0.58})`;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    ctx.globalCompositeOperation = "lighter";
    drawScreenGlow(
      state.player.x + state.player.w / 2 - state.camera.x,
      state.player.y + state.player.h / 2 - state.camera.y,
      120,
      `rgba(229, 187, 73, ${night * 0.13})`,
    );

    const minX = Math.max(0, Math.floor(state.camera.x / TILE) - 1);
    const maxX = Math.min(WORLD_COLS - 1, Math.ceil((state.camera.x + VIEW_WIDTH) / TILE) + 1);
    const minY = Math.max(0, Math.floor(state.camera.y / TILE) - 1);
    const maxY = Math.min(WORLD_ROWS - 1, Math.ceil((state.camera.y + VIEW_HEIGHT) / TILE) + 1);
    for (let ty = minY; ty <= maxY; ty += 1) {
      for (let tx = minX; tx <= maxX; tx += 1) {
        if (getTile(tx, ty) === IDS.lamp) {
          drawScreenGlow(
            tx * TILE + TILE / 2 - state.camera.x,
            ty * TILE + TILE / 2 - state.camera.y,
            180,
            `rgba(229, 187, 73, ${night * 0.24})`,
          );
        }
      }
    }
    ctx.restore();
  }

  function drawScreenGlow(x, y, radius, color) {
    const glow = ctx.createRadialGradient(x, y, 4, x, y, radius);
    glow.addColorStop(0, color);
    glow.addColorStop(1, "rgba(229, 187, 73, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function nightAmount() {
    const wave = Math.cos((state.time - 0.5) * Math.PI * 2);
    return clamp((wave - 0.12) / 0.88, 0, 1);
  }

  function drawMiniMap() {
    const w = 176;
    const h = 56;
    const x = VIEW_WIDTH - w - 14;
    const y = 14;

    ctx.save();
    ctx.fillStyle = "rgba(244, 247, 229, 0.82)";
    roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(23, 39, 36, 0.18)";
    ctx.stroke();

    const mapLeft = x + 10;
    const mapTop = y + 10;
    const mapW = w - 20;
    const mapH = h - 20;
    ctx.fillStyle = "rgba(49, 91, 120, 0.14)";
    ctx.fillRect(mapLeft, mapTop, mapW, mapH);

    for (let sx = 0; sx < mapW; sx += 1) {
      const tx = Math.floor((sx / mapW) * WORLD_COLS);
      const surface = findSurface(tx);
      const sy = mapTop + (surface / WORLD_ROWS) * mapH;
      ctx.fillStyle = "#6ea064";
      ctx.fillRect(mapLeft + sx, sy, 1, mapTop + mapH - sy);
    }

    const playerX = mapLeft + (state.player.x / WORLD_WIDTH) * mapW;
    const playerY = mapTop + (state.player.y / WORLD_HEIGHT) * mapH;
    ctx.fillStyle = "#d35c4a";
    ctx.beginPath();
    ctx.arc(playerX, playerY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function roundRect(x, y, w, h, radius) {
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
  }

  function mixColor(dayColor, nightColor, amount) {
    const a = hexToRgb(dayColor);
    const b = hexToRgb(nightColor);
    const r = Math.round(a.r + (b.r - a.r) * amount);
    const g = Math.round(a.g + (b.g - a.g) * amount);
    const bl = Math.round(a.b + (b.b - a.b) * amount);
    return `rgb(${r}, ${g}, ${bl})`;
  }

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }

  function createUI() {
    inventoryGrid.innerHTML = "";
    for (const [item, data] of Object.entries(ITEMS)) {
      const row = document.createElement("div");
      row.className = "inventory-row";
      row.dataset.item = item;

      const chip = document.createElement("span");
      chip.className = "inventory-chip";
      chip.style.background = data.color;

      const name = document.createElement("span");
      name.textContent = data.name;

      const count = document.createElement("span");
      count.className = "inventory-count";
      count.dataset.count = item;
      count.textContent = "0";

      row.append(chip, name, count);
      inventoryGrid.append(row);
    }

    toolbelt.innerHTML = "";
    TOOL_SLOTS.forEach((slot, index) => {
      const button = document.createElement("button");
      button.className = "tool-slot";
      button.type = "button";
      button.dataset.slot = String(index);
      button.dataset.tooltip = `${index + 1} ${slot.tooltip}`;

      const icon = document.createElement("span");
      icon.className = "tool-icon";
      icon.textContent = slot.label;

      const count = document.createElement("span");
      count.className = "tool-count";
      count.dataset.slotCount = String(index);
      count.textContent = "";

      button.append(icon, count);
      button.addEventListener("click", () => {
        state.selectedSlot = index;
        announce(slot.tooltip);
        updateUI();
      });

      toolbelt.append(button);
    });
  }

  function updateUI() {
    dayCountLabel.textContent = String(state.day);
    timeNameLabel.textContent = getTimeName();
    energyValueLabel.textContent = state.creative ? "∞" : String(Math.round(state.player.energy));
    positionValueLabel.textContent = `${Math.floor(state.player.x / TILE)},${Math.floor(state.player.y / TILE)}`;
    modeButton.textContent = state.creative ? "创造" : "生存";

    for (const item of Object.keys(ITEMS)) {
      const count = document.querySelector(`[data-count="${item}"]`);
      if (count) count.textContent = state.creative ? "∞" : String(state.inventory[item] || 0);
    }

    const toolButtons = Array.from(document.querySelectorAll(".tool-slot"));
    toolButtons.forEach((button, index) => {
      const slot = TOOL_SLOTS[index];
      button.classList.toggle("is-selected", index === state.selectedSlot);
      const count = button.querySelector(".tool-count");
      if (!count) return;
      if (!slot.item) {
        count.textContent = "";
      } else {
        count.textContent = state.creative ? "∞" : String(state.inventory[slot.item] || 0);
      }
    });

    craftButtons.forEach((button) => {
      const recipe = RECIPES[button.dataset.craft];
      button.disabled = !recipe || (!state.creative && !hasItems(recipe.cost));
    });
  }

  function getTimeName() {
    if (state.time < 0.22) return "深夜";
    if (state.time < 0.34) return "清晨";
    if (state.time < 0.62) return "白天";
    if (state.time < 0.76) return "黄昏";
    return "夜晚";
  }

  function announce(message) {
    messageFeed.textContent = message;
    messageFeed.classList.add("is-visible");
    state.lastMessageTimer = 1.8;
  }

  function handleKey(event, isDown) {
    const code = event.code;
    let handled = true;

    if (code === "KeyA" || code === "ArrowLeft") {
      state.input.left = isDown;
    } else if (code === "KeyD" || code === "ArrowRight") {
      state.input.right = isDown;
    } else if (code === "KeyW" || code === "Space" || code === "ArrowUp") {
      if (isDown && !state.input.jump) state.input.jumpPressed = true;
      state.input.jump = isDown;
    } else if (isDown && code.startsWith("Digit")) {
      const digit = Number(code.replace("Digit", ""));
      if (digit >= 1 && digit <= TOOL_SLOTS.length) {
        state.selectedSlot = digit - 1;
        announce(selectedTool().tooltip);
        updateUI();
      }
    } else if (isDown && code === "KeyE") {
      state.selectedSlot = (state.selectedSlot + 1) % TOOL_SLOTS.length;
      announce(selectedTool().tooltip);
      updateUI();
    } else if (isDown && code === "KeyF") {
      const tool = selectedTool();
      if (tool.tile) tryPlace(state.pointer.tx, state.pointer.ty);
      else tryMine(state.pointer.tx, state.pointer.ty);
    } else if (isDown && code === "Enter" && !state.started) {
      startPlaying();
    } else {
      handled = false;
    }

    if (handled) event.preventDefault();
  }

  function resetWorld() {
    const confirmed = window.confirm("重置当前沙盒世界？");
    if (!confirmed) return;
    generateWorld(Date.now() >>> 0);
    saveGame(false);
    announce("新世界已生成");
    updateUI();
  }

  function startPlaying() {
    state.started = true;
    introPanel.classList.add("is-hidden");
    announce("世界已就绪");
  }

  function bindEvents() {
    window.addEventListener("keydown", (event) => {
      if (!state.started && event.code !== "Enter") return;
      if (event.repeat && event.code !== "KeyF") return;
      handleKey(event, true);
    });

    window.addEventListener("keyup", (event) => handleKey(event, false));

    canvas.addEventListener("pointermove", (event) => {
      getPointerTile(event);
    });

    canvas.addEventListener("pointerdown", (event) => {
      if (!state.started) return;
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      getPointerTile(event);
      const tool = selectedTool();
      state.pointer.active = true;
      state.pointer.cooldown = 0;
      state.pointer.mode = event.button === 2 || event.shiftKey || !tool.tile ? "mine" : "place";
      updatePointerAction(1);
    });

    canvas.addEventListener("pointerup", () => {
      state.pointer.active = false;
    });

    canvas.addEventListener("pointercancel", () => {
      state.pointer.active = false;
    });

    canvas.addEventListener("contextmenu", (event) => event.preventDefault());

    playButton.addEventListener("click", startPlaying);
    saveButton.addEventListener("click", () => saveGame(true));
    resetButton.addEventListener("click", resetWorld);
    modeButton.addEventListener("click", () => {
      state.creative = !state.creative;
      announce(state.creative ? "创造模式" : "生存模式");
      updateUI();
    });

    craftButtons.forEach((button) => {
      button.addEventListener("click", () => craft(button.dataset.craft));
    });

    touchButtons.forEach((button) => {
      const input = button.dataset.input;
      const setValue = (value) => {
        if (input === "jump") {
          if (value && !state.input.jump) state.input.jumpPressed = true;
          state.input.jump = value;
        } else if (input === "left" || input === "right") {
          state.input[input] = value;
        }
      };

      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        setValue(true);
      });
      button.addEventListener("pointerup", () => setValue(false));
      button.addEventListener("pointercancel", () => setValue(false));
      button.addEventListener("pointerleave", () => setValue(false));
    });

    window.addEventListener("pagehide", () => saveGame(false));
  }

  let lastTime = performance.now();
  function loop(now) {
    const dt = clamp((now - lastTime) / 1000, 0, 0.033);
    lastTime = now;
    update(dt);
    render(now);
    requestAnimationFrame(loop);
  }

  createUI();
  if (!loadGame()) {
    generateWorld();
    announce("新世界已生成");
  }
  bindEvents();
  updateUI();
  requestAnimationFrame(loop);
})();
