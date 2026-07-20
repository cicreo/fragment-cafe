# 碎片咖啡 · BGM 背景音乐清单（6 首）

所有音乐文件放入 `assets/audio/bgm/` 即可自动播放。
建议格式：**MP3**，96-128kbps，循环无缝（loop）。

---

## 曲目列表

### 1. 序章 `bgm_intro.mp3`
- **场景：** 开场、intro
- **氛围：** 悬疑、安静、一点点温暖
- **乐器参考：** 钢琴 solo，缓慢的单音旋律，偶尔有轻微的弦乐或风铃声
- **风格：** 像深夜一个人看信的感觉
- **长度：** 1-2 分钟 loop

> Prompt (Suno/Udio):
> solo piano, slow, melancholic but warm, gentle, minimal, like reading a letter by lamplight late at night, lo-fi aesthetic, sparse notes, subtle reverb

---

### 2. 咖啡馆·昼 `bgm_cafe_day.mp3`
- **场景：** 白天咖啡馆经营
- **氛围：** 温暖、轻松、治愈，像阳光照进窗户
- **乐器参考：** Lo-fi 节奏 + 木吉他/钢琴旋律 + 轻鼓点
- **风格：** 星露谷 / 咖啡心语 风

> Prompt:
> lofi chillhop, warm acoustic guitar with soft piano melody, gentle lo-fi beats, cozy cafe atmosphere, morning sunlight, relaxing and heartwarming, loopable, instrumental, 70-80 bpm

---

### 3. 咖啡馆·夕 `bgm_evening.mp3`
- **场景：** 傍晚、日常结算
- **氛围：** 安静、反思、温柔的倦意
- **乐器参考：** 钢琴或爵士吉他，更慢，温暖但带一点沉静
- **风格：** 傍晚咖啡馆打烊前

> Prompt:
> soft jazz piano, slow tempo, warm and reflective, closing time at a small cafe, gentle brush drums, muted trumpet or guitar, intimate, 60-70 bpm, instrumental

---

### 4. 雨夜 `bgm_rain.mp3`
- **场景：** 下雨场景、陆离出场
- **氛围：** 迷雾、孤独、但不悲伤——是那种有人陪着淋雨的温度
- **乐器参考：** 钢琴 + 环境雨声 + 大提琴或低音弦乐
- **风格：** 克制但情感充沛

> Prompt:
> ambient piano with soft rain sounds, melancholic cello, slow, contemplative, lonely but not sad, like standing under a street lamp in gentle rain, cinematic, sparse, instrumental

---

### 5. 结局 `bgm_ending.mp3`
- **场景：** 真爱结局
- **氛围：** 温柔、释然、一点点想哭。像终于找到了答案。
- **乐器参考：** 钢琴 + 弦乐渐进，中后段加入轻鼓点
- **风格：** 视觉小说 ending theme

> Prompt:
> emotional piano with gradual string section, bittersweet but hopeful, ending theme of a visual novel, gentle build-up, warm resolution, cinematic, instrumental, 70-80 bpm

---

### 6. 暗涌 `bgm_tense.mp3`
- **场景：** 黑化结局、紧张对峙
- **氛围：** 不安、但仍是美的——就像被一个人爱到无法呼吸
- **乐器参考：** 低音钢琴 + 失真弦乐 + 心跳般的低频
- **风格：** 不是恐怖，是紧张的浪漫

> Prompt:
> dark ambient piano, slow low strings, subtle heartbeat-like percussion, tense and intimate, obsessive love theme, beautiful but unsettling, cinematic thriller romance, instrumental, 50-60 bpm

---

## 提示

- 用 **Suno AI** 或 **Udio** 生成很方便，把上面的 Prompt 贴进去
- 每首都可以勾选 "instrumental" 模式
- 生成后下载 MP3，改名为对应文件名放入 `assets/audio/bgm/`
- 游戏会自动在场景切换时播放对应 BGM，淡入淡出切换
- 底部栏 🎵 按钮可开关音乐，设置面板可调音量
