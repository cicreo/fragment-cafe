# 图片素材清单

生成好图片后，按以下文件名放入对应文件夹。引擎会自动加载。

## 场景背景 (assets/bg/)

放入 `assets/bg/` 文件夹，建议尺寸 **960×640** 或 **16:9 比例**：

| 文件名 | 场景说明 |
|--------|---------|
| `intro.png` | 雨夜书桌，开场画面 |
| `cafe_day.png` | 咖啡馆白天内景 |
| `cafe_evening.png` | 咖啡馆傍晚内景 |
| `alley_rain.png` | 雨夜巷子外景 |

## 角色立绘 (assets/char/)

每个角色一个文件夹，放入对应的表情差分。
建议尺寸 **400×600** 或 **2:3 比例**，透明背景 PNG。

### 陆离 (assets/char/luli/)

| 文件名 | 表情 | 用途 |
|--------|------|------|
| `luli_neutral.png` | 平静 | 默认表情，冷淡地看着前方 |
| `luli_annoyed.png` | 不悦 | 皱眉、侧目，被惹到的时候 |
| `luli_smile.png` | 微笑 | 难得的温柔笑容 |
| `luli_away.png` | 目移 | 移开视线，愧疚或犹豫 |
| `luli_surprised.png` | 惊讶 | 被戳中软肋，难得慌张 |

### 明朗 (assets/char/minglang/)

| 文件名 | 表情 | 用途 |
|--------|------|------|
| `minglang_neutral.png` | 平静 | 温和微笑，日常表情 |
| `minglang_happy.png` | 喜悦 | 灿烂大笑，眼睛弯成月牙 |
| `minglang_worried.png` | 不悦 | 担忧皱眉，但努力保持积极 |
| `minglang_away.png` | 目移 | 害羞脸红，挠头 |
| `minglang_surprised.png` | 惊讶 | 睁大眼睛，被吓一跳 |

### 萧默 (assets/char/xiaomo/)

| 文件名 | 表情 | 用途 |
|--------|------|------|
| `xiaomo_neutral.png` | 平静 | 冷淡面无表情，双手抱臂 |
| `xiaomo_annoyed.png` | 不悦 | 挑眉、嫌弃、冷笑 |
| `xiaomo_smile.png` | 微笑 | 极淡的傲娇笑，耳尖微红 |
| `xiaomo_away.png` | 目移 | 移开视线，努力维持冷静但脸红 |
| `xiaomo_surprised.png` | 惊讶 | 被说中要害，慌张脸红 |

---

## 启用图片模式

1. 把生成的图片按上述文件名放入对应文件夹
2. 打开 `game.js`，把第 9 行的 `USE_IMAGES` 改为 `true`
3. 刷新页面即可看到图片

图片加载失败时会自动回退到 CSS 像素占位符，不影响游戏运行。
