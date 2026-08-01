# 小熊 3D 生存沙盒

主页现在是一个 Three.js 3D 立体生存沙盒游戏，并把旧版游戏里的核心内容恢复到了生存模式：

- 小熊主角模型：原皮小熊、机甲、祖国人风格、桃田贤斗风格皮肤。
- 武器：Starter、Auraspeed 100X Ultra、Arcsaber 7 Tour、Nanoflare 700 Game、Anta Dingyin 1000。
- 商店：皮肤、球拍武器、跑鞋、赤脚强化、Jump Smash、小猪伙伴、徒手冲刺、幸运转盘。
- 对手：僵尸怪、原皮球拍小熊怪、机关枪炮台。
- Boss：Rabbit Boss、Zombie Boss、Gundam Mech Boss。
- 生存沙盒：3D 方块地形、挖掘、放置、背包、保存和重开。

## 操作

- `WASD`：移动
- 鼠标：转视角
- 左键：当前工具攻击或挖掘
- 右键：放置当前方块
- 数字 `1-8`：切换工具栏
- `Q`：解锁小猪伙伴后切换手枪/伙伴模式
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

也可以直接部署到 GitHub Pages。`index.html` 会加载 `sandbox.js`，其中使用 Three.js CDN。

## 文件

- `index.html`：3D 生存沙盒主页结构
- `styles.css`：HUD、商店、背包和工具栏样式
- `sandbox.js`：Three.js 3D 生存沙盒、武器、商店、怪兽和 Boss 逻辑
- `game.js`：旧版 2D 游戏脚本，保留作参考
- `server.mjs`：本地静态预览服务
