# 小熊 3D 生存沙盒

主页现在是一个 Three.js 3D 立体生存沙盒游戏，并把旧版游戏里的核心内容恢复到了生存模式：

- 小熊主角模型：原皮小熊、机甲、祖国人风格、桃田贤斗风格皮肤。
- 武器：Starter、Auraspeed 100X Ultra、Arcsaber 7 Tour、Nanoflare 700 Game、Anta Dingyin 1000。
- 商店：皮肤、球拍武器、跑鞋、赤脚强化、Jump Smash、小猪伙伴、徒手冲刺、幸运转盘。
- 对手：僵尸怪、原皮球拍小熊怪、机关枪炮台。
- Boss：Rabbit Boss、Zombie Boss、Gundam Mech Boss。
- 生存沙盒：3D 方块地形、挖掘、放置、背包、保存和重开。
- 模式：`C` 或页面按钮切换生存/创造。创造模式无限方块、不会受伤，但不再飞天或穿墙。
- 改良：地图扩大，玩家和怪物加入方块碰撞，降低穿墙问题。
- 画面：本地 Three.js、高质量阴影、Q 版圆润角色、生物表情和更多粒子特效。

## 操作

- `WASD`：移动
- 鼠标：转视角
- 左键：当前工具攻击或挖掘
- 右键：放置当前方块
- 数字 `1-8`：切换工具栏
- `C`：切换生存/创造
- `Y`：切换第一视角/第三视角
- `Q`：切换球拍和手枪/小猪伙伴模式
- `E`：手枪或小猪伙伴射击
- `G`：切换羽毛球打法提示
- `I`：解锁跑鞋后穿戴/脱下
- `Shift`：冲刺

## 本地运行

```bash
npm start
```

然后打开：

```text
http://127.0.0.1:5173
```

也可以直接部署到 GitHub Pages。`index.html` 会加载 `sandbox.js`，Three.js 已放在本地 `vendor-three.mjs`，避免打开主页时依赖外部模块。

## 文件

- `index.html`：3D 生存沙盒主页结构
- `styles.css`：HUD、商店、背包和工具栏样式
- `sandbox.js`：Three.js 3D 生存沙盒、武器、商店、怪兽和 Boss 逻辑
- `vendor-three.mjs`：本地 Three.js 模块
- `game.js`：旧版 2D 游戏脚本，保留作参考
- `server.mjs`：本地静态预览服务
