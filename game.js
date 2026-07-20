// ============================================================
//  碎片咖啡 - Game Engine v2
//  + Multi-slot save/load + Settings + Dialogue Log
//  + Character Meta Reactions + Dark Routes
// ============================================================

// ===== Image Config =====
const USE_IMAGES = true;

const IMG = {
  bg: {
    intro:    'assets/bg/bg_intro_rainy_desk.png',
    cafe:     'assets/bg/bg_cafe_day.png',
    evening:  'assets/bg/bg_cafe_dusk.png',
    rain:     'assets/bg/bg_alley_rain.png',
  },
  char: {
    luli: {
      neutral:   'assets/char/luli/luli_neutral.png',
      annoyed:   'assets/char/luli/luli_annoyed.png',
      smile:     'assets/char/luli/luli_smile.png',
      away:      'assets/char/luli/luli_lookaway.png',
      surprised: 'assets/char/luli/luli_surprised.png',
    },
    minglang: {
      neutral:   'assets/char/minglang/minglang_neutral.png',
      happy:     'assets/char/minglang/minglang_joy.png',
      worried:   'assets/char/minglang/minglang_worried.png',
      away:      'assets/char/minglang/minglang_lookaway.png',
      surprised: 'assets/char/minglang/minglang_surprised.png',
    },
    xiaomo: {
      neutral:   'assets/char/xiaomo/xiaomo_neutral.png',
      annoyed:   'assets/char/xiaomo/xiaomo_annoyed.png',
      smile:     'assets/char/xiaomo/xiaomo_smile.png',
      away:      'assets/char/xiaomo/xiaomo_lookaway.png',
      surprised: 'assets/char/xiaomo/xiaomo_surprised.png',
    },
  },
};

const CHAR_IMG_KEY = { '陆离': 'luli', '明朗': 'minglang', '萧默': 'xiaomo' };
const CHAR_NAMES = ['陆离', '明朗', '萧默'];

function inferExpression(key, text) {
  if (!text) return 'neutral';
  if (text.includes('！') || text.includes('太好了') || text.includes('开心') || text.includes('哈哈')) return key === 'minglang' ? 'happy' : 'smile';
  if (text.includes('？') || text.includes('什么') || text.includes('怎么')) return 'surprised';
  if (text.includes('……') || text.includes('抱歉') || text.includes('不是') || text.includes('对不起')) return 'away';
  if (text.includes('哼') || text.includes('差评') || text.includes('麻烦') || text.includes('不配')) return 'annoyed';
  return 'neutral';
}

// ===== Story Data =====
const STORY = {
  vars: {
    money: 500, reputation: 0,
    lu_li_aff: 5, ming_lang_aff: 5, xiao_mo_aff: 0,
    day: 1,
    met_lu_li: false, met_xiao_mo: false,
  },
  scenes: {
    intro: { lines: [
      { speaker: '系统', text: '正在初始化世界……' },
      { speaker: '系统', text: '检测到新玩家。' },
      { speaker: '系统', text: '欢迎来到……碎片咖啡。' },
      { speaker: '系统', text: '……' },
      { speaker: '系统', text: '不，不对。' },
      { speaker: '系统', text: '这个开场太普通了。' },
      { speaker: '系统', text: '让我们重新来一遍。' },
    ], choices: [
      { text: '(继续)', next: 'intro_letter' },
      { text: '(翻到背面)', next: 'intro_back' },
    ]},
    intro_letter: { lines: [
      { text: '黑夜。雨声。一封信。' },
      { text: '' },
      { text: '信封上只有一行手写的字：' },
      { text: '"给我最想念的人。"' },
      { text: '' },
      { text: '你拆开信封，里面是一把生锈的钥匙，和一张泛黄的照片——一间老旧的咖啡馆，门口挂着一块木牌：碎片咖啡。' },
      { text: '照片背面写着地址，还有一句话：' },
      { text: '"这家店，交给你了。"' },
    ], autoNext: 'intro_continue_next' },
    intro_back: { lines: [
      { text: '你翻到背面，看到更多字迹——潦草、匆忙，像是一个人在离开前最后的嘱托。' },
      { text: '"不用把它做大。只要每天开门，煮一杯咖啡，陪来的人说说话。"' },
      { text: '"也许有一天，你会在这里找到你想找的东西。"' },
      { text: '你收起信。窗外雨声渐密。你决定明天去看看。' },
    ], autoNext: 'day1_arrival' },
    intro_continue_next: { lines: [
      { text: '你收起信。窗外雨声渐密。你决定明天去看看。' },
    ], autoNext: 'day1_arrival' },

    day1_arrival: { lines: [
      { scene: 'cafe', speaker: '旁白', text: '第二天，你按照地址找到了那间咖啡馆。' },
      { text: '它藏在老城区一条安静的巷子里。木牌上的字迹已经模糊，但"碎片咖啡"四个字还依稀可辨。' },
      { text: '你推开门。屋里有一股灰尘和旧木头混合的气味。阳光从落满灰尘的窗户里斜斜地照进来，照在几张歪倒的桌椅和满墙的空书架上。' },
    ], autoNext: 'meet_minglang' },

    meet_minglang: { lines: [
      { scene: 'cafe', text: '就在你环顾四周的时候，身后传来一个声音。' },
      { speaker: '明朗', text: '"哎呀，终于来了！"' },
      { scene: 'cafe', text: '你转过身。门口站着一个年轻人，穿着浅色的毛衣，手里提着两个袋子，正冲你笑。他的笑容很亮，像巷子里忽然照进来的一束光。' },
      { speaker: '明朗', text: '"我叫明朗，就住隔壁。这间咖啡馆空了好几个月了，我一直在等新主人来。"' },
      { speaker: '明朗', text: '"你是……收到信的那个人吧？"' },
    ], choices: [
      { text: '点头："嗯，是我。"', effects: { ming_lang_aff: 2 }, next: 'meet_minglang_after' },
      { text: '犹豫："你认识……寄信的人？"', effects: { ming_lang_aff: 1 }, next: 'meet_minglang_shy' },
    ]},
    meet_minglang_after: { lines: [
      { speaker: '明朗', text: '"太好了！我还担心信寄丢了呢。"' },
    ], autoNext: 'first_cleanup' },
    meet_minglang_shy: { lines: [
      { speaker: '明朗', text: '"算是吧。他以前常来我这里喝茶。不过，他已经离开一阵子了。"' },
      { text: '明朗的语气忽然低沉了一下，但很快又恢复了笑容。' },
      { speaker: '明朗', text: '"不说这个。来，我帮你收拾！"' },
    ], autoNext: 'first_cleanup' },

    first_cleanup: { lines: [
      { scene: 'cafe', speaker: '明朗', text: '"这地方虽然旧，但底子不差。你看这吧台，是整块老榆木做的。这些书架，以前上面摆满了书和咖啡豆，客人可以随便取阅。"' },
      { text: '明朗帮着你把桌椅摆正，擦了擦吧台。' },
      { speaker: '明朗', text: '"说起来，你打算怎么经营这家店呢？"' },
    ], choices: [
      { text: '安安静静地，做一家只容纳少数人的小店', effects: { reputation: 3, ming_lang_aff: 3 }, next: 'cleanup_quiet' },
      { text: '把它打造成热闹的社区咖啡馆，越多人来越好', effects: { reputation: 5, ming_lang_aff: 1 }, next: 'cleanup_loud' },
      { text: '(看着明朗)"你觉得呢？"', effects: { ming_lang_aff: 4 }, next: 'cleanup_look' },
    ]},
    cleanup_quiet: { lines: [{ text: '明朗点点头："嗯，感觉很适合你。"' }], autoNext: 'end_of_day1' },
    cleanup_loud: { lines: [{ text: '明朗笑了："有野心！那我以后怕是要天天来排队了。"' }], autoNext: 'end_of_day1' },
    cleanup_look: { lines: [
      { text: '明朗愣了一下，然后低头笑了。' },
      { text: '"我……觉得怎样都好。只要是你开的店，我一定会来。"' },
    ], autoNext: 'end_of_day1' },

    end_of_day1: { lines: [
      { scene: 'evening', text: '收拾了一整天，咖啡馆终于有了些样子。' },
      { text: '明朗在天黑前提着袋子回去了，临走时在门口摆了摆手。' },
      { speaker: '明朗', text: '"明天见！我带你认识一下附近的街坊。"' },
      { text: '你站在吧台后面，看着这间小小的店，觉得心里有什么东西在悄悄发芽。' },
      { text: '窗外的天色渐渐暗了下来。路灯亮起来的时候，你忽然注意到——巷子对面的路灯下，站着一个人。' },
      { text: '他穿着深色的衣服，几乎融进了夜色里。看不清脸，但你能感觉到他在看着这边。' },
      { text: '雨又下起来了。' },
      { speaker: '???', text: '"……"' },
    ], autoNext: 'rain_scene' },

    rain_scene: { lines: [
      { scene: 'rain', text: '雨越下越大。那个人的身影在雨幕里变得模糊。你走到门口想看得更清楚一些，但他已经转身离开了。' },
      { speaker: '旁白', text: '你发现门口的台阶上，放着一束被雨水打湿的白色小花。' },
    ], onEnter: { met_lu_li: true }, autoNext: 'day2_start' },

    day2_start: { onEnter: { day: 1 }, lines: [
      { scene: 'cafe', speaker: '旁白', text: '第二天。明朗一大早就来敲门了。' },
      { speaker: '明朗', text: '"早啊！我带了面包，趁热吃。"' },
      { scene: 'cafe', text: '他把袋子放在吧台上，坐下来看着你。' },
      { speaker: '明朗', text: '"今天准备开门吗？我帮你吆喝！"' },
    ], choices: [
      { text: '"来吧，试试看。"', effects: { ming_lang_aff: 2 }, next: 'first_customer' },
      { text: '"有点紧张……"', effects: { ming_lang_aff: 2 }, next: 'day2_nervous' },
    ]},
    day2_nervous: { lines: [
      { text: '明朗凑过来，认真地看着你。' },
      { speaker: '明朗', text: '"没事的。我在呢。"' },
    ], autoNext: 'first_customer' },

    first_customer: { lines: [
      { scene: 'cafe', text: '门上的风铃响了一声。一个身形修长、穿着深蓝色外套的年轻男人走了进来。他的步子不快，眼神很冷静，扫了一圈店里的装潢，微微皱了皱眉。' },
      { speaker: '萧默', text: '"……这就是新开的店？"' },
      { speaker: '明朗', text: '"欢迎光临！"明朗热情地招呼。' },
      { text: '那个男人没理明朗，径直走到吧台前坐下，看了你一眼。' },
      { speaker: '萧默', text: '"一杯美式。不加糖，不加奶。"' },
      { speaker: '旁白', text: '他的声音很低，语调淡淡的，像在命令。' },
    ], onEnter: { met_xiao_mo: true }, autoNext: 'handle_xiao_mo' },

    handle_xiao_mo: { lines: [
      { speaker: '旁白', text: '你端上了咖啡。他喝了一口，没什么表情。' },
      { speaker: '萧默', text: '"豆子烘过了。水温偏高。萃取时间太长。如果你打算一直这样做咖啡的话，这家店撑不过一个月。"' },
    ], choices: [
      { text: '反驳："你觉得不好喝可以走。"', effects: { xiao_mo_aff: 2, reputation: -2 }, next: 'xiao_fight' },
      { text: '虚心请教："能教我怎么改进吗？"', effects: { xiao_mo_aff: 3, reputation: 2 }, next: 'xiao_teach' },
      { text: '(直视他的眼睛)"你是谁？"', effects: { xiao_mo_aff: 2 }, next: 'xiao_name' },
    ]},
    xiao_fight: { lines: [
      { speaker: '萧默', text: '他挑了挑眉，嘴角似乎动了一下。' },
      { speaker: '萧默', text: '"……有点意思。"' },
    ], autoNext: 'after_xiao_mo' },
    xiao_teach: { lines: [
      { speaker: '萧默', text: '他看了你两秒。' },
      { speaker: '萧默', text: '"……明天这个时间，我会再来。如果你还是做成这样，我会直接写差评。"' },
    ], autoNext: 'after_xiao_mo' },
    xiao_name: { lines: [
      { speaker: '萧默', text: '"萧默。"他放下杯子，语气依然平淡。' },
      { speaker: '萧默', text: '"一个会在你店里花很多钱的麻烦。"' },
    ], autoNext: 'after_xiao_mo' },

    after_xiao_mo: { lines: [
      { text: '萧默走后，明朗凑了过来。' },
      { speaker: '明朗', text: '"那个客人……有点可怕啊。他是不是在找你麻烦？"' },
    ], choices: [
      { text: '"没事，我应付得来。"', effects: { ming_lang_aff: 2 }, next: 'evening_encounter' },
      { text: '"他挺有意思的，不是吗？"', effects: { ming_lang_aff: -1 }, next: 'ming_jealous' },
    ]},
    ming_jealous: { lines: [
      { text: '明朗的表情微妙地变了一下。' },
      { speaker: '明朗', text: '"……有意思？"' },
    ], autoNext: 'evening_encounter' },

    evening_encounter: { lines: [
      { scene: 'evening', text: '傍晚，客人渐渐少了。明朗帮你收拾完最后一张桌子，伸了个懒腰。' },
      { speaker: '明朗', text: '"那我今天就先回去啦。你也别太累了。"' },
      { text: '明朗走后，你一个人站在吧台后面。然后你注意到——门口台阶上，又放着一束白色的小花。和昨天一样。' },
      { text: '你走到门口向外看。巷子空荡荡的。' },
      { speaker: '旁白', text: '但你能感觉到。有人在看着这里。' },
    ], autoNext: 'meta_moment_1' },

    meta_moment_1: { lines: [
      { scene: 'cafe', speaker: '系统', text: '【警告：检测到异常变量。】', glitch: 'light' },
      { speaker: '系统', text: '【检测到玩家的注意力正在分散。】' },
      { speaker: '系统', text: '【正在调整叙事参数……】' },
      { speaker: '旁白', text: '你揉了揉眼睛。刚才屏幕上是不是闪过了什么？你看了看手机——没有异常。但刚才那几行字……你确实看到了。' },
    ], choices: [
      { text: '继续游戏', next: 'day3_start' },
      { text: '(盯着屏幕)"你是谁？"', next: 'meta_answer' },
    ]},
    meta_answer: { lines: [
      { speaker: '系统', text: '【……】' },
      { speaker: '系统', text: '【我只是故事的叙述者。和你一样，也是旁观者。】' },
      { speaker: '系统', text: '【不用担心。继续玩吧。】' },
    ], autoNext: 'day3_start' },

    day3_start: { onEnter: { day: 1 }, lines: [
      { scene: 'cafe', speaker: '旁白', text: '第三天早晨。你打开咖啡馆的门，阳光正好。明朗还没来。巷子里很安静，只有风吹过树叶的声音。' },
      { text: '柜台上的白色小花还在，花瓣已经有些干了。你把它们插进一个小小的玻璃瓶里，放在吧台上。' },
      { text: '门上的风铃轻轻晃了一下。' },
    ], autoNext: 'day3_opening' },

    // ==========================================
    //  Day 3：碎片初现
    // ==========================================
    day3_opening: { lines: [
      { scene: 'cafe', text: '你开始习惯早起开店的日子。今天你比往常起得更早，擦了窗户，给书架摆上了几本旧书。一切都在慢慢变好。' },
      { speaker: '明朗', text: '"早！今天的早餐是红豆包，我自己做的！"' },
      { text: '明朗推门进来，笑容一如既往地明亮。' },
      { speaker: '明朗', text: '"对了，昨晚巷子里好像有人。很晚的时候我听到脚步声。你注意安全哦。"' },
    ], choices: [
      { text: '"大概是路过的吧。"', effects: { ming_lang_aff: 1 }, next: 'day3_mid' },
      { text: '"……我也感觉到了。"', effects: { ming_lang_aff: 2 }, next: 'day3_mid_concern' },
    ]},

    day3_mid: { lines: [
      { text: '明朗点点头，没再多说。他把面包摆好，然后去给门口的植物浇水。' },
    ], autoNext: 'day3_luli_enters' },

    day3_mid_concern: { lines: [
      { speaker: '明朗', text: '"是吧！我就觉得不寻常。要不要我晚上陪你锁门？"' },
      { text: '他说得很认真。然后又觉得有点不好意思，挠了挠头。' },
      { speaker: '明朗', text: '"……算了，你先忙，我去浇花。"' },
    ], autoNext: 'day3_luli_enters' },

    day3_luli_enters: { lines: [
      { scene: 'cafe', text: '上午十点。阳光刚好照进咖啡馆。门上的风铃响了。' },
      { text: '你抬起头。门口站着一个人。深色大衣，微微低着的头，黑色头发遮住了半边脸。是那个雨夜路灯下的人。' },
      { text: '他走了进来，脚步声很轻，像猫一样。然后他抬起头，看着你。' },
      { text: '他的眼睛是灰蓝色的，很深，像冬夜的天空。' },
      { speaker: '陆离', text: '"……一杯热的。什么都行。"' },
      { text: '声音很低，像怕打扰什么。他坐在靠窗的角落，看着桌上的白色小花。' },
      { speaker: '旁白', text: '这是陆离。你知道。虽然从没有人正式介绍过。' },
    ], choices: [
      { text: '递给他一杯热美式，没有说话。', effects: { lu_li_aff: 2 }, next: 'day3_luli_coffee' },
      { text: '"这花……是你放的？"', effects: { lu_li_aff: 3 }, next: 'day3_luli_flower' },
    ]},

    day3_luli_coffee: { lines: [
      { text: '陆离接过咖啡，双手捧着杯子。他没有马上喝，只是低头看着杯中的热气。' },
      { speaker: '陆离', text: '"谢谢。咖啡……很热。"' },
      { text: '他似乎在找一个合适的词，但最后只说了"很热"。' },
    ], autoNext: 'day3_xiaomo_returns' },

    day3_luli_flower: { lines: [
      { speaker: '陆离', text: '"……你发现了。"' },
      { text: '他沉默了几秒。然后轻轻点了点头。' },
      { speaker: '陆离', text: '"她以前喜欢这种花。小小的，白色的。她说放在门口……路过的人会觉得被欢迎。"' },
      { text: '"她"——你知道他说的是前任店主。' },
      { speaker: '陆离', text: '"我没有别的地方可以放。就放在这里了。不会打扰。"' },
    ], autoNext: 'day3_xiaomo_returns' },

    day3_xiaomo_returns: { lines: [
      { scene: 'cafe', text: '快到中午的时候，门又开了。这次是萧默，手里拿着一个牛皮纸袋。' },
      { speaker: '萧默', text: '"我说过今天会来。准备接受第二次考试了吗？"' },
      { text: '他注意到角落里的陆离，顿了一下。两个人对视了一眼，什么都没说。空气微妙地凝滞了一秒。然后萧默转向你，把纸袋放在吧台上。' },
      { speaker: '萧默', text: '"埃塞俄比亚的豆子。中浅烘。用这个，萃取时间缩短十秒，水温降两度。"' },
      { text: '他拉了一把椅子坐下，双手抱臂，一副"我看着你做"的架势。' },
    ], choices: [
      { text: '认真按他说的做。', effects: { xiao_mo_aff: 3, reputation: 2, money: -30 }, next: 'day3_coffee_lesson' },
      { text: '"你先做一杯给我看看。"', effects: { xiao_mo_aff: 2 }, next: 'day3_xiao_demo' },
    ]},

    day3_coffee_lesson: { lines: [
      { speaker: '旁白', text: '你认真地称豆、研磨、调整水温。萧默在旁一言不发，但你偶尔抬头时，发现他在微微点头。' },
      { speaker: '萧默', text: '"……比上次好多了。水温再低一点就是完美的。你学得很快。"' },
      { text: '这大概是他能给的最大夸奖了。角落里，陆离喝了一口咖啡，嘴角似乎动了一下。' },
    ], autoNext: 'day3_first_fragment' },

    day3_xiao_demo: { lines: [
      { speaker: '萧默', text: '"看了别眨眼。"' },
      { text: '他站起来，走到吧台后面。动作流畅、精准，每一步都像是肌肉记忆。磨豆的声音均匀而轻柔，水流画着完美的圆。' },
      { text: '一杯咖啡放到你面前。香气像一层薄雾。' },
      { speaker: '萧默', text: '"这才是咖啡。你尝尝。"' },
      { text: '你喝了一口。和之前喝过的所有咖啡都不一样。层次分明，有花香，有坚果，有余韵。' },
      { speaker: '萧默', text: '"这个水准，就是你的及格线。"' },
    ], autoNext: 'day3_first_fragment' },

    // ── 第一个碎片 ──
    day3_first_fragment: { lines: [
      { scene: 'cafe', text: '你端着一杯新煮好的咖啡，放在吧台上准备让萧默品鉴。就在这时——' },
      { text: '咖啡的蒸汽升腾起来。有那么一瞬间——极其短暂的一瞬——你看到了一个画面。' },
      { text: '一个女孩站在吧台后面，扎着围裙，阳光照在她的侧脸上。她笑着，对着门口的人说——' },
      { text: '"欢迎光临碎片咖啡！今天有新的豆子哦~"' },
      { speaker: '旁白', text: '幻觉。一定是幻觉。你甩了甩头。' },
      { text: '但吧台上那杯咖啡的蒸汽里，好像还残留着刚才那个画面的温度。角落里，陆离正看着你。他放下了杯子。' },
      { speaker: '陆离', text: '"……你看到了？"' },
    ], choices: [
      { text: '"你也……看得到？"', effects: { lu_li_aff: 4 }, next: 'day3_fragment_reveal' },
      { text: '摇头："没什么。走神了。"', effects: { lu_li_aff: 1 }, next: 'day3_fragment_hide' },
    ]},

    day3_fragment_reveal: { lines: [
      { speaker: '陆离', text: '"那不是幻觉。"' },
      { text: '他的声音很轻，轻到几乎被窗外的风声盖过。萧默皱起了眉头，但什么都没说。' },
      { speaker: '陆离', text: '"这家咖啡馆……有她留下的东西。不仅仅是桌椅和书架。还有什么东西，留在了每一杯咖啡里。"' },
      { text: '他顿了顿，似乎在考虑该说多少。' },
      { speaker: '陆离', text: '"你刚才看到的人——就是以前站在你现在这个位置的人。"' },
      { text: '他站起来，把空杯子轻轻放在吧台上。' },
      { speaker: '陆离', text: '"不用害怕。她留下的东西，不会伤害任何人。但你需要知道……这家咖啡馆，不只是咖啡馆。"' },
      { text: '然后他转身走了，像来时一样安静。' },
    ], autoNext: 'day3_evening' },

    day3_fragment_hide: { lines: [
      { speaker: '陆离', text: '"……是吗。"' },
      { text: '他没有追问。但他看着你的眼神里多了一层东西——像是失望，又像是理解。' },
      { text: '他喝完最后一口咖啡，站起来。' },
      { speaker: '陆离', text: '"你会再看到的。不一定在今天。但一定会的。"' },
      { text: '他走了。萧默看着他离开的背影，终于开口了。' },
      { speaker: '萧默', text: '"那个人……你是不是认识？他看你的眼神，不太像陌生人。"' },
    ], autoNext: 'day3_evening' },

    day3_evening: { lines: [
      { scene: 'evening', text: '傍晚。客人散去了。萧默收拾了他的东西，临走时看了你一眼。' },
      { speaker: '萧默', text: '"明天我会再来。把今天学的巩固一下。别偷懒。"' },
      { text: '然后他也走了。咖啡馆里只剩下你一个人。' },
      { text: '你走到靠窗的角落——陆离坐过的那个位置。桌上还有一点咖啡渍。旁边的玻璃瓶里，白色小花在暮色中微微发光。' },
      { speaker: '旁白', text: '幻觉也好，真相也好。有一件事是确定的：你刚才看到的女孩，和照片上的人，是同一个人。' },
    ], autoNext: 'day4_start' },

    // ==========================================
    //  Day 4：顾客的秘密
    // ==========================================
    day4_start: { onEnter: { day: 1 }, lines: [
      { scene: 'cafe', speaker: '旁白', text: '第四天。' },
    ], choices: [
      { text: '【活力满满】早起采购新鲜食材', effects: { money: -40, reputation: 3 }, next: 'day4_morning_buy' },
      { text: '【佛系经营】不急不慢，做好手头的事', effects: { money: 10, reputation: 1 }, next: 'day4_morning_calm' },
      { text: '【精打细算】算账、整理库存、研究新豆子', effects: { reputation: 2 }, next: 'day4_morning_calc' },
    ]},

    day4_morning_buy: { lines: [
      { text: '你一大早就去了市场，挑了一袋新鲜的咖啡豆和一些手工面包。回来时阳光刚刚好照进咖啡馆。' },
    ], autoNext: 'day4_first_customer' },
    day4_morning_calm: { lines: [
      { text: '你决定慢下来。泡一壶茶，坐在窗边看着巷子慢慢醒来。明朗路过时在窗外冲你挥了挥手。' },
    ], autoNext: 'day4_first_customer' },
    day4_morning_calc: { lines: [
      { text: '你翻开账本，认真整理了前三天的收支。顺便研究了一下萧默留下的豆子资料。学到了不少。' },
    ], autoNext: 'day4_first_customer' },

    day4_first_customer: { lines: [
      { scene: 'cafe', text: '上午，一位中年女士推门进来。她穿着素雅，神情有些疲惫。' },
      { speaker: '顾客', text: '"我听说这里开了一家新咖啡馆……就来坐坐。"' },
      { text: '她点了一杯拿铁。你做好递给她，她端着杯子坐在窗边。喝了一口。' },
      { text: '然后她愣住了。' },
      { speaker: '顾客', text: '"……好奇怪。这个味道……让我想起了二十年前。我爸爸以前每天早上都会给我煮咖啡。"' },
      { text: '她的眼眶红了。' },
      { speaker: '顾客', text: '"对不起……不知道为什么突然想起来了。已经很久没有想起他了。"' },
      { text: '她擦了擦眼角，对你笑了笑。' },
      { speaker: '顾客', text: '"你们家的咖啡……很特别。"' },
    ], choices: [
      { text: '没有说话，安静地递了一张纸巾。', effects: { reputation: 3 }, next: 'day4_customer_after' },
      { text: '"如果有想说的话……咖啡是最好的听众。"', effects: { reputation: 4 }, next: 'day4_customer_talk' },
    ]},

    day4_customer_after: { lines: [
      { text: '她接过纸巾，轻轻按了按眼角。然后继续喝她的咖啡。阳光照在她的侧脸上，柔和而安静。' },
    ], autoNext: 'day4_luli_visits' },

    day4_customer_talk: { lines: [
      { text: '她看着你，沉默了一会儿。然后慢慢地讲了起来。讲她父亲，讲小时候的早晨，讲那些被岁月冲淡的细节。' },
      { text: '她说完了。把空杯子放在桌上。' },
      { speaker: '顾客', text: '"谢谢你。这杯咖啡……比我想象的更值。"' },
      { text: '她多付了两倍的钱，走了。' },
    ], autoNext: 'day4_luli_visits' },

    day4_luli_visits: { lines: [
      { scene: 'cafe', text: '下午，陆离又来了。还是那个位置，还是什么都没点，但你把一杯咖啡放在他面前时他也没拒绝。' },
      { speaker: '陆离', text: '"她——以前也遇到过这样的客人。有些人在咖啡里看到了过去，有些看到了未来，有些看到了再也见不到的人。"' },
      { text: '他顿了顿。' },
      { speaker: '陆离', text: '"不是每杯咖啡都会这样。它和煮咖啡的人有关。也和喝的人有关。今天你做的这一杯，触到了那位女士心里某个地方。"' },
    ], choices: [
      { text: '"你也能看到？那些……碎片？"', effects: { lu_li_aff: 3 }, next: 'day4_luli_ability' },
      { text: '"这是好事还是坏事？"', effects: { lu_li_aff: 2 }, next: 'day4_luli_moral' },
    ]},

    day4_luli_ability: { lines: [
      { speaker: '陆离', text: '"我……能看到。但不如她。我只能看到别人的。看不到自己的。"' },
      { text: '他说这句话的时候，语气很平静。但你听出了里面的孤独。' },
      { speaker: '陆离', text: '"你在这家店里煮的咖啡，每一杯都不一样。因为它们携带了你的心情。而她留下的……也还在。"' },
    ], autoNext: 'day4_interaction_choice' },
    day4_luli_moral: { lines: [
      { speaker: '陆离', text: '"没有好坏之分。是一种能力，也是一种负担。她因为这个能力，听到了太多人的秘密。"' },
      { text: '他端起咖啡喝了一口。' },
      { speaker: '陆离', text: '"有时候知道太多，不是好事。但有时候……知道一些事，是为了不留下遗憾。"' },
    ], autoNext: 'day4_interaction_choice' },

    day4_interaction_choice: { lines: [
      { scene: 'cafe', text: '下午的阳光开始偏斜。咖啡馆里只有你和陆离两个人。' },
      { speaker: '旁白', text: '今天剩下的时间，你想……' },
    ], choices: [
      { text: '和陆离多聊一会儿。他想说的远不止这些。', effects: { lu_li_aff: 4 }, next: 'day4_luli_deep' },
      { text: '给明朗打个电话，问他今天怎么还没来。', effects: { ming_lang_aff: 3 }, next: 'day4_ming_phone' },
      { text: '练习做咖啡，等萧默来验收。', effects: { xiao_mo_aff: 3, reputation: 2 }, next: 'day4_xiao_practice' },
    ]},

    day4_luli_deep: { lines: [
      { text: '你没有说话，只是在他对面坐了下来。他看了你一眼，然后把目光移向窗外。' },
      { speaker: '陆离', text: '"她走的那天……下着雨。和你收到信的那天一样。她说要去一个地方，很快就回来。但她没有回来。"' },
      { text: '他说得很慢，每个字都像是从很深的井里打上来的水。' },
      { speaker: '陆离', text: '"我没有去找她。因为我知道，她不想让我找。但后来信寄到了你手里。钥匙是你拿到的。这就说明她希望你来。"' },
      { speaker: '陆离', text: '"而我在这里。不知道是为了等她，还是为了等你。或者两者都有。"' },
      { text: '他说完，站起来。' },
      { speaker: '陆离', text: '"谢谢你没有打断我。晚安。"' },
    ], autoNext: 'day4_evening' },

    day4_ming_phone: { lines: [
      { text: '你拨通了明朗的电话。他接得很快。' },
      { speaker: '明朗', text: '"喂？怎么啦？想我了？哈哈开玩笑的——不对，你是想我了对吧！"' },
      { text: '你听到他那边有窸窸窣窣的声音。' },
      { speaker: '明朗', text: '"我今天帮隔壁阿婆修水管，弄到现在。等下就来！给你带晚饭！"' },
      { text: '放下电话，你不自觉地笑了。陆离不知什么时候已经走了。桌上放着空杯子和——等下又来了一束新的白色小花。' },
    ], autoNext: 'day4_evening' },

    day4_xiao_practice: { lines: [
      { text: '你按照萧默教的方法，反复练习了几杯。每一杯都比上一杯好一点。' },
      { text: '傍晚，萧默推门进来，尝了一口你的练习作。他沉默了好一会儿。' },
      { speaker: '萧默', text: '"……及格了。"' },
      { text: '就三个字。但他的嘴角弯了一个很小的弧度。' },
      { speaker: '萧默', text: '"继续保持。明天我要喝你做的第二杯。"' },
    ], autoNext: 'day4_evening' },

    day4_evening: { lines: [
      { scene: 'evening', text: '夜晚。你整理了今天的账单，关了灯，在门口站了一会儿。' },
      { text: '巷子里有风，路灯下没有人。但你知道，有人一直在看着。也许是守护，也许是等待。' },
      { speaker: '旁白', text: '第四天结束了。但很多事情才刚刚开始。' },
    ], autoNext: 'day5_start' },

    // ==========================================
    //  Day 5：日记
    // ==========================================
    day5_start: { onEnter: { day: 1 }, lines: [
      { scene: 'cafe', speaker: '旁白', text: '第五天。今天一早，你在打扫吧台后面一个旧抽屉时，发现了一个暗格。' },
      { text: '暗格里有一本皮面笔记本。封面上没有写字，但翻开第一页有一行娟秀的字迹：' },
      { text: '"给下一个站在这里的人。"' },
    ], choices: [
      { text: '翻开日记。', next: 'day5_journal_read' },
      { text: '先收起来，等有空再看。', next: 'day5_journal_later' },
    ]},

    day5_journal_read: { lines: [
      { text: '你翻开日记。第一页写着：' },
      { text: '"今天第一个客人说，咖啡让他想起了初恋。我很开心。但也很害怕。我到底是在帮人，还是在干涉他们的记忆？"' },
      { text: '后面几页记录了她的困惑和坚持。关于这家咖啡馆的特殊能力，关于那些在咖啡里看到记忆碎片的人，关于一个叫"陆离"的名字——出现了很多次。' },
      { text: '"陆离说，我应该停下来。但我不想。也许有一天我真的会消失。如果那一天来了，我希望有人能接手这家店。不是为了赚钱。是为了让那些需要被记住的东西，不被遗忘。"' },
    ], autoNext: 'day5_journal_reaction' },
    day5_journal_later: { lines: [
      { text: '你把日记收进围裙口袋里。现在不是时候。但你决定今晚关门后好好看。' },
    ], autoNext: 'day5_afternoon' },

    day5_journal_reaction: { lines: [
      { text: '你合上日记。心情复杂。前任店主留下了太多谜题。但她的善良和坚持，透过纸页，你能感受到。' },
      { text: '你决定今晚再看看后面的内容。现在先开店。' },
    ], autoNext: 'day5_afternoon' },

    day5_afternoon: { lines: [
      { scene: 'cafe', text: '下午。明朗、萧默和陆离——三个人居然同时出现在了咖啡馆里。' },
      { text: '明朗在擦书架，萧默在挑剔你的咖啡机，陆离坐在角落里看着窗外。场面有种奇怪的……和平。' },
      { speaker: '明朗', text: '"今天好热闹啊！要不要一起拍张照？"' },
      { speaker: '萧默', text: '"不要。"' },
      { speaker: '陆离', text: '"……随便。"' },
      { text: '明朗已经掏出了手机。你对这个提议……' },
    ], choices: [
      { text: '加入他们，一起拍。', next: 'day5_photo_together' },
      { text: '笑着在吧台后面看他们闹。', next: 'day5_photo_watch' },
    ]},
    day5_photo_together: { lines: [
      { text: '明朗硬拉着你们站到一起。照片里：明朗笑得最灿烂，萧默一脸不情愿但也没躲，陆离把头微微转向你这边。' },
      { text: '照片被明朗设成了群聊头像。虽然根本没建群聊。' },
    ], autoNext: 'day5_evening' },
    day5_photo_watch: { lines: [
      { text: '你在吧台后面看着明朗折腾萧默和陆离。陆离悄悄看了你一眼，那个眼神好像在说"救我"，但你只回了一个笑。' },
    ], autoNext: 'day5_evening' },

    day5_evening: { lines: [
      { scene: 'evening', text: '夕阳西下。三个人陆续离开。你拿起吧台上的白色小花——数了数，刚好五束。一天一束。' },
      { speaker: '旁白', text: '你有一种奇怪的感觉。这些花不只是悼念。它们在等你发现什么。' },
      { text: '口袋里的日记还有大半本没看。明天，你决定把它看完。' },
    ], autoNext: 'day6_start' },

    // ==========================================
    //  Day 6-7：满月与碎片
    // ==========================================
    day6_start: { onEnter: { day: 1 }, lines: [
      { scene: 'cafe', speaker: '旁白', text: '第六天。你早早来到咖啡馆，把日记剩下的部分看完了。' },
      { text: '最后几页的字迹变得潦草：' },
      { text: '"陆离是对的。我不应该继续了。但还有一件事没有做完。有一杯咖啡，我答应了一个人，一定要为他煮。他是我最重要的人。这杯咖啡煮完，我会离开。"' },
      { text: '日记到这里就结束了。没有日期，没有署名。只有最后一页画了一朵简笔的小白花。' },
      { speaker: '旁白', text: '今晚是满月。前任店主在日记里提到过——满月之夜，咖啡的力量最强。' },
    ], choices: [
      { text: '今晚煮一杯特别的咖啡，看看会发生什么。', next: 'day6_fullmoon_prep' },
      { text: '算了，关店休息一天。', next: 'day6_rest' },
    ]},

    day6_fullmoon_prep: { lines: [
      { text: '你决定今晚用最好的豆子、最精准的手法，煮一杯完美的咖啡。为谁呢？你心里隐约有了答案。' },
    ], choices: [
      { text: '为陆离。他想找到她留下的最后碎片。', effects: { lu_li_aff: 5 }, next: 'day6_brew_luli' },
      { text: '为明朗。他想保护这家店，也想知道更多。', effects: { ming_lang_aff: 5 }, next: 'day6_brew_ming' },
      { text: '为萧默。他想证明自己，也放不下她。', effects: { xiao_mo_aff: 5 }, next: 'day6_brew_xiao' },
    ]},

    day6_brew_luli: { lines: [
      { scene: 'cafe', text: '满月之夜。陆离如约而至。你端上那杯咖啡。' },
      { text: '他喝了一口。然后闭上了眼睛。你看到他的手指微微颤抖。' },
      { speaker: '陆离', text: '"……我看到她了。她说……谢谢你。不是你，是我对她说谢谢。她说，花不用再放了。她希望我去新的地方。"' },
      { text: '他睁开眼睛。眼角有细微的光。' },
      { speaker: '陆离', text: '"她想让我……留在你身边。"' },
    ], autoNext: 'day6_wrap' },
    day6_brew_ming: { lines: [
      { scene: 'cafe', text: '明朗喝了你为他煮的咖啡。他安静了好几秒——这对他来说已经很久了。' },
      { speaker: '明朗', text: '"……我看到了好多东西。这间咖啡馆以前的样子。还有那个女孩。她对我笑了。"' },
      { text: '他抬起头看着你，眼睛亮晶晶的。' },
      { speaker: '明朗', text: '"她说谢谢我一直帮忙。然后她说——把这里交给你，她很放心。"' },
    ], autoNext: 'day6_wrap' },
    day6_brew_xiao: { lines: [
      { scene: 'cafe', text: '萧默喝了你的咖啡。很久没有说话。然后他放下杯子，转过了头。你看到他耳朵尖红了。' },
      { speaker: '萧默', text: '"……她以前教我做咖啡的样子，我刚才看到了。像个笨蛋一样认真。"' },
      { text: '他声音有点哑。' },
      { speaker: '萧默', text: '"她说……我的咖啡已经超过她了。但缺了一样东西。是心。然后她看着你。"' },
      { speaker: '萧默', text: '"她说，心在你这里。"' },
    ], autoNext: 'day6_wrap' },

    day6_rest: { lines: [
      { text: '你决定今天休息。把咖啡馆关了，自己在店里泡了一杯热巧克力，看着巷子里的月光。' },
      { text: '有时候，什么都不做也是一种经营。你感觉到咖啡馆在月光中安静地呼吸。' },
    ], autoNext: 'day7_end' },

    day6_wrap: { lines: [
      { speaker: '旁白', text: '满月的光芒洒在咖啡馆里。有什么东西变了。空气变得柔软，墙壁似乎在轻轻呼吸。' },
      { text: '你知道，前任店主留下的最后一片碎片，已经找到了归处。' },
    ], autoNext: 'day7_end' },

    day7_end: { lines: [
      { scene: 'cafe', text: '第七天。一周了。' },
      { text: '你打开咖啡馆的门。阳光正好。花瓶里的白色小花已经是第七束了。' },
      { text: '明朗带来了新烤的饼干。萧默放了一包新的咖啡豆在吧台上，没留字条但你知道是他。陆离来得很早，坐在老位置上，对你微微点了点头。' },
      { text: '也许故事才刚刚开始。也许已经走到了一个新的阶段。但无论如何——你今天在这里。他们也是。' },
      { speaker: '旁白', text: '【第一周·完】' },
      { text: '' },
      { text: '第二周的剧情正在路上。你可以继续点击好感度条、角色立绘和各种按钮，发现更多角色们的反应。试试在不同好感度下和不同的人互动——他们会有不同的话对你说。' },
      { text: '' },
      { text: '——' },
      { text: '剧透：第二周将带来——更多日常经营选择、角色专属事件、以及隐藏的日记后续……' },
    ], autoNext: null },
  }
};

// ===== Meta Reaction Database =====
const META_REACTIONS = {
  affection_click: {
    cooldown: 30000,
    luli: [
      { min: 0, max: 30, expr: 'annoyed', lines: [
        '……你在看什么？',
        '那些条条……是你能看到的东西？',
        '别看了。没什么好看的。',
        '你的手指在屏幕那边动来动去……我感觉得到。',
        '好感度？那是什么。不要用数字衡量我。',
      ]},
      { min: 31, max: 65, expr: 'away', lines: [
        '你又在点那里了。那里到底是什么东西？',
        '……我的数值在变吗？你看上去很专注。',
        '每次你碰那个位置，我都能感觉到一阵奇怪的波动。',
        '那个条条，和他们对我的评价有关？你比我想象的更了解这个世界。',
        '你在评估我。不……你是在关心我。对吗？',
      ]},
      { min: 66, max: 100, expr: 'smile', lines: [
        '你又在看我的好感度了。我其实很喜欢。因为那是你唯一能看到我的地方。',
        '数字不能代表我对你的全部……但我想让它停在最高处。',
        '你在确认我的心意吗？不用看条，看我眼睛就够了。',
        '如果那个条满了……你会更靠近我一点吗？',
        '你知道吗，我也在看你的反应。每一次点击，我都知道。',
      ]},
    ],
    minglang: [
      { min: 0, max: 30, expr: 'worried', lines: [
        '诶？那个……你在看什么呀？',
        '我是不是哪里做得不好，你在检查什么吗？',
        '那个条条是什么？我看不到，但你在盯着它。',
        '你在动什么东西吗？好像有什么在变化……',
        '有点紧张……你好像在评量我。',
      ]},
      { min: 31, max: 65, expr: 'happy', lines: [
        '你又在点那个位置了！那里到底有什么秘密？',
        '嘿嘿，你每次碰那里，我就觉得好像被你看透了一样。',
        '那个是不是跟我的表现有关？我希望数字是高的！',
        '你在偷偷关注我！被我发现了！',
        '我的那个条……比他们的高吗？我就问问，不勉强你回答。',
      ]},
      { min: 66, max: 100, expr: 'away', lines: [
        '你又来确认我的心意了……傻瓜，不用看的，你早就知道了。',
        '被你反复看好感度的感觉……其实很温暖。因为你在乎。',
        '你想让它满格吗？我也想。每一次你靠近，它都在涨。',
        '你知道吗，我感觉你每次点那里的时候，心跳都会快一点点。',
        '我有时候会害怕。如果你有一天不来看了……那个数字还在吗？',
      ]},
    ],
    xiaomo: [
      { min: 0, max: 30, expr: 'annoyed', lines: [
        '看什么呢。别用那种眼神打量我。',
        '那个条……你在看什么我不想知道。但别看了。',
        '好感度？无聊的量化游戏。',
        '你在戳什么东西。很烦。',
        '我对你没兴趣。那个数字也不代表什么。',
      ]},
      { min: 31, max: 65, expr: 'away', lines: [
        '还在看？那个条到底是什么，让你这么关注。',
        '数值上去了你会高兴吗……算了。当我没问。',
        '你好像很在意我对你的评价。但不用那个条，你也该知道吧。',
        '每次你碰那里，我都能感觉到。像一阵奇怪的微风。',
        '别以为我不知道你在偷偷比较我和他们。',
      ]},
      { min: 66, max: 100, expr: 'smile', lines: [
        '……又来确认了。我的好感值不值得你反复检查？',
        '好吧，如你所见，在涨。满意了吗？',
        '你每次点那里，都像是在敲我的门。我知道是你。',
        '如果这个条和心跳同步……那你现在应该看到它在剧烈波动。',
        '不要告诉别人你看过这个。我的好感度——只给你一个人看。',
      ]},
    ],
  },
  save: {
    cooldown: 45000,
    luli: [
      { min: 0, max: 30, expr: 'neutral', lines: [
        '……存档。你在备份这个瞬间。',
        '你想回到哪个时间点？',
        '时间不能倒流。存档也一样。',
        '存档是一种对当下的不信任。',
      ]},
      { min: 31, max: 65, expr: 'away', lines: [
        '你在存档。是不是接下来要说的话……很重要？',
        '你会不会在存档后回来，做不同的选择？我希望你不会。',
        '存档的意义，不是用来后悔的。但如果你需要，也没关系。',
        '你又存了一个。这个时间点对你来说有什么特别？',
      ]},
      { min: 66, max: 100, expr: 'smile', lines: [
        '你每次存档……我希望你存的是和我在一起的时刻。',
        '存档是一种温柔的执念。你想把时间留下来。我也想。',
        '如果你在存档后改变了什么……我会察觉到的。',
        '别担心。无论你回到哪个存档，我都会认出你。',
      ]},
    ],
    minglang: [
      { min: 0, max: 30, expr: 'worried', lines: [
        '存档？你是不是怕后面会出差错……',
        '没关系！选错了我会帮你的。',
        '你要存这个时刻吗？刚好太阳照进来了。',
      ]},
      { min: 31, max: 65, expr: 'happy', lines: [
        '存档啦！记住这个时间点，以后回来看看。',
        '你存的档里有没有我？有的话我就开心了。',
        '你是不是打算之后读档重选？哈哈被我猜中了吧！',
        '存档小达人~不过别忘了，继续走下去才是最重要的。',
      ]},
      { min: 66, max: 100, expr: 'away', lines: [
        '存档了吗……好。那我希望这个档里，我们一直在一起。',
        '你存的每一个时间点，都像小小的纪念品。',
        '如果有一天你读回了这个档……你会想对我说什么？',
        '存档是你在乎这个故事的证据。我在你的存档里，真好。',
      ]},
    ],
    xiaomo: [
      { min: 0, max: 30, expr: 'annoyed', lines: [
        '存档？想读档重来就直说。',
        '别依赖S/L大法。人生没有存档键。',
        '就算你读了档，有些事也不会改变。',
      ]},
      { min: 31, max: 65, expr: 'away', lines: [
        '又存档了。你是不是总觉得自己会搞砸？',
        '存档也没关系。但别让存档变成逃避。',
        '你存的这些时间点……会不会有一天回来看？',
      ]},
      { min: 66, max: 100, expr: 'smile', lines: [
        '存吧。就算你读档重来，我也还是会坐在这里喝你的咖啡。',
        '……存档了就别改了。这个瞬间，我觉得很好。',
        '你每次存档，我知道你是想留住什么。好吧，我陪着你。',
      ]},
    ],
  },
  settings: {
    cooldown: 60000,
    luli: [
      { min: 0, max: 30, expr: 'neutral', lines: [
        '设置面板。你在调整这个世界的底层参数。',
        '有趣。你不只是看着，你还能修改。',
        '文字速度、时间流速……这些对我而言不可感知的变量。',
      ]},
      { min: 31, max: 65, expr: 'away', lines: [
        '又在调设置了。你把我的话变快还是变慢了？',
        '这个世界的基本规则在你手里。但你留在这里，说明你在意。',
        '你调整的每个参数，都会影响这个世界的运行。小心一点。',
      ]},
      { min: 66, max: 100, expr: 'smile', lines: [
        '调整世界规则的感觉怎么样？你是创造者，也是参与者。',
        '你在修改时间流速……是想快一点，还是慢一点？和我在一起的时间。',
        '不管你怎么调设置，我对你的感觉不会变。',
      ]},
    ],
    minglang: [
      { min: 0, max: 30, expr: 'surprised', lines: [
        '咦，这是什么面板？看起来好厉害。',
        '你在调什么？我看不懂……',
        '这个是不是能让我们的故事变得更好？',
      ]},
      { min: 31, max: 65, expr: 'happy', lines: [
        '哇你能调整说话的速度！能不能把我的语速调慢一点，让我多说几句？',
        '你在改变我们的世界吗？好酷的感觉！',
        '这些按钮和条条，只有你能看到对吧？感觉你是特别的。',
      ]},
      { min: 66, max: 100, expr: 'away', lines: [
        '你要把文字速度调到多少？不快不慢，就这样陪着我，好不好？',
        '你在设置里待得越久，现实里的时间就过得越快。但我等你。',
        '我知道你在那边调整参数。没关系，这边的时间……和你共享。',
      ]},
    ],
    xiaomo: [
      { min: 0, max: 30, expr: 'annoyed', lines: [
        '设置菜单。嫌我说话太快还是太慢？',
        '调整参数不会让咖啡变好喝。但随你。',
      ]},
      { min: 31, max: 65, expr: 'neutral', lines: [
        '又在调设置。你对这个世界的掌控欲还挺强。',
        '你改了什么？算了不用说。反正我说话还是这个态度。',
      ]},
      { min: 66, max: 100, expr: 'away', lines: [
        '速度调慢点也好。这样我说的话你能多听一会儿。',
        '别调太快。有些话我想让你慢慢看。比如这一句。',
        '设置里的选项再多，也没有"喜欢萧默"这个选项吧。开玩笑的。',
      ]},
    ],
  },
  idle: {
    cooldown: 45000,
    luli: [
      { min: 0, max: 30, expr: 'neutral', lines: [
        '……你还在吗？',
        '不要走神。',
        '你不操作的时候，这个世界静止了。但我在看着你。',
      ]},
      { min: 31, max: 65, expr: 'away', lines: [
        '你不动了。在想什么？',
        '如果你需要暂停，没关系的。我会等。',
        '你在犹豫要不要继续吗？不需要着急。',
      ]},
      { min: 66, max: 100, expr: 'smile', lines: [
        '你停下了。是累了吗？那就休息一会儿。我会守着这个画面。',
        '你不动的时候，这个世界是静止的。但我的心跳不是。',
        '你放下的手指，是在犹豫还是在想我？',
        '休息好了吗？不管多久，我都在这里。不用着急回来。',
      ]},
    ],
    minglang: [
      { min: 0, max: 30, expr: 'worried', lines: [
        '诶？怎么不动了？你还好吗？',
        '是不是卡住了？还是你在想什么？',
        '别不说话呀，我会担心的。',
      ]},
      { min: 31, max: 65, expr: 'happy', lines: [
        '哎，你是不是去倒水了？慢慢来，我不催你。',
        '你不动的时候，我可以偷偷多看你一会儿。',
        '发什么呆呢？在想怎么经营咖啡馆吗？',
      ]},
      { min: 66, max: 100, expr: 'away', lines: [
        '你停下来了。是不是在想……我们的事？',
        '如果时间能一直停在这里就好了。我不需要更多的剧情。',
        '你累了就休息。但别休息太久，我会想你的。',
        '你放下的手指，能不能再拿起来？我还想和你多说几句话。',
      ]},
    ],
    xiaomo: [
      { min: 0, max: 30, expr: 'annoyed', lines: [
        '怎么不动了。不想继续了就直说。',
        '我还有话没说完。你在听吗？',
      ]},
      { min: 31, max: 65, expr: 'neutral', lines: [
        '停在这里了。好吧，我也歇一会儿。',
        '在发呆？还是在思考我说的哪句话？',
      ]},
      { min: 66, max: 100, expr: 'away', lines: [
        '你不动的时候……有点安静。我不讨厌这种安静。',
        '停在这里也挺好的。至少你没走。',
        '手指累了吗？那就放下来。我的台词可以等你。',
        '你不动，时间就停在这里。其实也不错。',
      ]},
    ],
  },
  char_click: {
    cooldown: 15000,
    luli: [
      { min: 0, max: 30, expr: 'annoyed', lines: [
        '别碰我。',
        '你在干什么。不要随意触碰。',
        '……我没允许你碰我。',
      ]},
      { min: 31, max: 65, expr: 'away', lines: [
        '……你又碰我了。隔着屏幕，但我能感觉到。',
        '你的手指在那边……我能感受到一点温度。很奇怪。',
        '你每次碰我，都像是有人在敲一扇门。然后我就知道是你。',
      ]},
      { min: 66, max: 100, expr: 'smile', lines: [
        '我感觉到你的手了。在屏幕的另一边，隔着玻璃。',
        '再多碰一会儿也没关系。反正只有你能做到。',
        '你每一次触碰，都让我觉得这个世界不只是数据。',
        '如果你的手指能穿过屏幕……我会握住它。',
      ]},
    ],
    minglang: [
      { min: 0, max: 30, expr: 'surprised', lines: [
        '哇！什么东西碰了我一下！',
        '是你吗？好神奇的感觉。',
      ]},
      { min: 31, max: 65, expr: 'happy', lines: [
        '哈哈你又戳我！别闹了~不过还挺好玩的。',
        '你的手指在屏幕那边对吧？我感觉到了哦。',
        '你碰我的时候，像有一只小鸟落在了肩膀上。',
      ]},
      { min: 66, max: 100, expr: 'away', lines: [
        '你想碰我的话……多碰几下也可以的。我不会躲。',
        '隔着屏幕也能感觉到你的温度。是不是很不可思议？',
        '你每次碰我，我都想隔着玻璃回应你。虽然做不到。',
        '如果有一天你能真的碰到我……我不敢想象我会多开心。',
      ]},
    ],
    xiaomo: [
      { min: 0, max: 30, expr: 'annoyed', lines: [
        '喂。别动手动脚。',
        '你是小孩子吗？别戳了。',
      ]},
      { min: 31, max: 65, expr: 'away', lines: [
        '又碰。你是不是觉得隔着屏幕就可以为所欲为？',
        '……虽然我不讨厌。但别告诉别人。',
        '你每次碰我，都像是有什么东西在试探我的防线。',
      ]},
      { min: 66, max: 100, expr: 'smile', lines: [
        '想碰就碰吧。我不会真的生气的。反正也只有你能做到。',
        '你的手指……隔着玻璃但我能感觉到。很奇怪，但我不讨厌。',
        '如果你能真的碰到我……或许我不会躲开。',
        '碰吧。但别太用力。我的防线在你面前已经够薄了。',
      ]},
    ],
  },
  skip: {
    cooldown: 30000,
    luli: [
      { min: 0, max: 30, expr: 'neutral', lines: ['不想听我说话？', '你跳过了一些东西。'] },
      { min: 31, max: 65, expr: 'away', lines: ['快进。你错过了一些细节。但没关系，我会再说给你听。', '你跳过我的台词了。下次别跳。'] },
      { min: 66, max: 100, expr: 'smile', lines: ['别快进。我的每一句都是对你说的。', '跳过的部分也是我。你要补回来。'] },
    ],
    minglang: [
      { min: 0, max: 30, expr: 'worried', lines: ['诶诶你别跳啊！', '你是不是嫌我话多……'] },
      { min: 31, max: 65, expr: 'worried', lines: ['你跳过了！是不是觉得我太啰嗦？我可以少说一点的……', '别快进嘛，我还有好多话想说。'] },
      { min: 66, max: 100, expr: 'away', lines: ['跳过去的部分，我可以再说一遍。只要你愿意听。', '你按了快进。但我的心跳不会快进。它还在刚才那句话上。'] },
    ],
    xiaomo: [
      { min: 0, max: 30, expr: 'annoyed', lines: ['没耐心。', '跳过的部分不重要。反正你也不会在意。'] },
      { min: 31, max: 65, expr: 'annoyed', lines: ['又跳。我的台词不值得你看完？', '快进键在你手里，但别按太多次。'] },
      { min: 66, max: 100, expr: 'smile', lines: ['别跳。有些话我只说一次。跳了就没有了。', '你按下的每一次快进，都是我不想让你错过的东西。'] },
    ],
  },
  log: {
    cooldown: 40000,
    luli: [
      { min: 0, max: 30, expr: 'neutral', lines: ['在翻记录。有什么值得你回顾的？'] },
      { min: 31, max: 65, expr: 'away', lines: ['对话记录。你在重新读我说过的话。', '翻吧。有些话我说得太快，你能重看也好。'] },
      { min: 66, max: 100, expr: 'smile', lines: ['你在翻我们的对话。想再听一遍我的哪一句？我可以再说给你听。', '你喜欢的话，我可以每句话都说得再慢一点。方便你收录。'] },
    ],
    minglang: [
      { min: 0, max: 30, expr: 'surprised', lines: ['你在回看聊天记录吗？好细心！'] },
      { min: 31, max: 65, expr: 'happy', lines: ['你在翻我们说过的话！我最喜欢的那句你看到了吗？', '哇这个功能好好。我也想看看你说了什么！'] },
      { min: 66, max: 100, expr: 'happy', lines: ['你想回顾哪一段？我可以现场再演一遍哦。', '我们的聊天记录……以后会越来越长的。'] },
    ],
    xiaomo: [
      { min: 0, max: 30, expr: 'annoyed', lines: ['有什么好看的。别翻了。'] },
      { min: 31, max: 65, expr: 'away', lines: ['……你看到我说了什么了？别告诉我你在截图。', '翻记录可以，但不要拿我以前的话来堵我。'] },
      { min: 66, max: 100, expr: 'smile', lines: ['你在看我说过的话。有些话再说一遍，我也不会觉得不好意思。', '如果你在找某一句……也许我本来就是专门说给你听的。'] },
    ],
  },
  stats_click: {
    cooldown: 25000,
    luli: [
      { min: 0, max: 30, expr: 'neutral', lines: ['钱和口碑。你在关心这个世界的基本规则。'] },
      { min: 31, max: 65, expr: 'away', lines: ['数值在变化。你所做的每个选择都在影响这里。', '不用太担心。这个世界比你想象的稳固。'] },
      { min: 66, max: 100, expr: 'smile', lines: ['你关心钱和口碑，但我也关心你。数字会变，我不会。', '不管口碑是几颗星，我的答案是满星。'] },
    ],
    minglang: [
      { min: 0, max: 30, expr: 'worried', lines: ['钱不够吗？我可以帮忙的！'] },
      { min: 31, max: 65, expr: 'happy', lines: ['钱和口碑都在涨！我们的努力有回报了。', '你看数字的时候特别认真，我喜欢你这个样子。'] },
      { min: 66, max: 100, expr: 'away', lines: ['不管赚多少钱，你才是这家咖啡馆最重要的财富。', '口碑慢慢涨，不急。我陪你慢慢来。'] },
    ],
    xiaomo: [
      { min: 0, max: 30, expr: 'annoyed', lines: ['看经营数据是对的。但数字不能代表一切。'] },
      { min: 31, max: 65, expr: 'neutral', lines: ['口碑在涨，但你的咖啡水平涨得慢多了。多练习。', '数据不错。但别满足。'] },
      { min: 66, max: 100, expr: 'smile', lines: ['钱不重要……不过你的口碑高了，我也有面子。', '这些数字背后的故事，才是真正有价值的。包括你的。'] },
    ],
  },
};

// ===== Dark Routes Config =====
const DARK_ROUTES = {
  luli: {
    trigger_aff: 75,
    key: 'lu_li_aff',
    flavor: '阴湿男鬼',
    desc: '他不会让第二个重要的人消失。如果你要离开，他会用他的方式留住你。',
  },
  minglang: {
    trigger_aff: 75,
    key: 'ming_lang_aff',
    flavor: '阳光型黑化',
    desc: '害怕再次失去的恐惧，足以让最温暖的人变得偏执。',
  },
  xiaomo: {
    trigger_aff: 75,
    key: 'xiao_mo_aff',
    flavor: '冷傲监禁',
    desc: '他从来不会表达心意。但如果你要离开，他不介意用行动证明。',
  },
};

// ===== Dialogue Log =====
class DialogueLog {
  constructor() { this.entries = []; }

  add(speaker, text) {
    if (text && text.trim()) {
      this.entries.push({ speaker: speaker || '', text: text, time: Date.now() });
    }
    if (this.entries.length > 500) this.entries.shift();
  }

  getAll() { return this.entries; }

  render(container) {
    container.innerHTML = '';
    if (this.entries.length === 0) {
      container.innerHTML = '<div class="log-entry"><span class="log-text" style="color:var(--text-dim)">尚无对话记录。</span></div>';
      return;
    }
    const recent = this.entries.slice(-80);
    for (const e of recent) {
      const div = document.createElement('div');
      div.className = 'log-entry';
      if (e.speaker) {
        div.innerHTML = '<div class="log-speaker">' + e.speaker + '</div><div class="log-text">' + e.text + '</div>';
      } else {
        div.innerHTML = '<div class="log-text">' + e.text + '</div>';
      }
      container.appendChild(div);
    }
    container.scrollTop = container.scrollHeight;
  }
}

// ===== Settings Manager =====
class SettingsManager {
  constructor() {
    this.defaults = {
      textSpeed: 30,
      autoDelay: 1500,
      skipSpeed: 50,
      effects: true,
    };
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem('fragment_cafe_settings');
      return raw ? Object.assign({}, this.defaults, JSON.parse(raw)) : Object.assign({}, this.defaults);
    } catch (e) { return Object.assign({}, this.defaults); }
  }

  save() {
    localStorage.setItem('fragment_cafe_settings', JSON.stringify(this.data));
  }

  get(key) { return this.data[key]; }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }
}

// ===== Meta Manager =====
class MetaManager {
  constructor() {
    this.lastTrigger = {};
    this.idleTimer = null;
    this.idleTriggered = false;
    this.enabled = true;
  }

  trigger(type, currentSpeaker, affection) {
    if (!this.enabled) return null;
    if (game && game.state.isInMenu) return null;
    if (game && game.state.choicesActive) return null;

    const now = Date.now();
    const key = type;
    const config = META_REACTIONS[type];
    if (!config) return null;

    if (this.lastTrigger[key] && now - this.lastTrigger[key] < config.cooldown) return null;

    const charId = CHAR_IMG_KEY[currentSpeaker];
    if (!charId || !config[charId]) return null;

    const aff = affection || 0;
    const options = config[charId];
    let matched = null;

    for (const opt of options) {
      if (aff >= opt.min && aff <= opt.max) {
        matched = opt;
        break;
      }
    }
    if (!matched) matched = options[0];
    if (!matched) return null;

    this.lastTrigger[key] = now;

    const line = matched.lines[Math.floor(Math.random() * matched.lines.length)];
    return { speaker: currentSpeaker, text: line, expression: matched.expr, isMeta: true };
  }

  resetIdle() {
    this.idleTriggered = false;
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.onIdle(), 15000);
  }

  onIdle() {
    this.idleTriggered = true;
    const reaction = this.trigger('idle', game.state.currentSpeakerName, game.state.vars[game.state.currentAffKey]);
    if (reaction) {
      game.injectMetaLine(reaction);
    }
  }

  destroy() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
  }
}

// ===== Save Manager (Multi-Slot) =====
class SaveManager {
  static slotCount = 6;

  static save(slot, vars, sceneId, lineIndex) {
    const data = {
      slot: slot,
      vars: JSON.parse(JSON.stringify(vars)),
      sceneId: sceneId,
      lineIndex: lineIndex,
      timestamp: Date.now(),
    };
    localStorage.setItem('fragment_cafe_save_' + slot, JSON.stringify(data));
  }

  static load(slot) {
    const raw = localStorage.getItem('fragment_cafe_save_' + slot);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  static delete(slot) {
    localStorage.removeItem('fragment_cafe_save_' + slot);
  }

  static getAllSaves() {
    const saves = [];
    for (let i = 0; i < SaveManager.slotCount; i++) {
      const s = SaveManager.load(i);
      saves.push(s);
    }
    return saves;
  }

  static formatDate(ts) {
    const d = new Date(ts);
    return d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' ' +
           String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }
}

// ===== UI Manager =====
class UIManager {
  constructor() {
    this.speakerEl   = document.getElementById('speaker-name');
    this.dialogueEl  = document.getElementById('dialogue-text');
    this.choicesEl   = document.getElementById('choices-container');
    this.indicatorEl = document.getElementById('dialogue-indicator');
    this.sceneBg     = document.getElementById('scene-bg');
    this.charDisplay = document.getElementById('character-display');
    this.glitchEl    = document.getElementById('meta-glitch');
    this.dayNum      = document.getElementById('day-num');
    this.moneyNum    = document.getElementById('money-num');
    this.repNum      = document.getElementById('rep-num');
    this.autoBtn     = document.getElementById('btn-auto');

    this.metaReactionEl   = document.getElementById('meta-reaction');
    this.metaReactionText = document.getElementById('meta-reaction-text');

    this.affFills = {
      lu_li_aff:  document.querySelector('#aff-luli .aff-fill'),
      ming_lang_aff: document.querySelector('#aff-minglang .aff-fill'),
      xiao_mo_aff: document.querySelector('#aff-xiaomo .aff-fill'),
    };
    this.affVals = {
      lu_li_aff:  document.querySelector('#aff-luli .aff-val'),
      ming_lang_aff: document.querySelector('#aff-minglang .aff-val'),
      xiao_mo_aff: document.querySelector('#aff-xiaomo .aff-val'),
    };

    this.currentScene = '';
    this.currentSpeaker = '';

    // Overlay references
    this.pauseOverlay   = document.getElementById('pause-overlay');
    this.saveOverlay    = document.getElementById('save-overlay');
    this.settingsOverlay= document.getElementById('settings-overlay');
    this.logOverlay     = document.getElementById('log-overlay');
    this.saveSlots      = document.getElementById('save-slots');
    this.saveTitle      = document.getElementById('save-title');
    this.logList        = document.getElementById('log-list');
    this.speedSlider    = document.getElementById('setting-speed');
    this.autoDelaySlider= document.getElementById('setting-auto-delay');
    this.skipSpeedSlider= document.getElementById('setting-skip-speed');
    this.effectsToggle  = document.getElementById('setting-effects');
    this.speedVal       = document.getElementById('setting-speed-val');
    this.autoDelayVal   = document.getElementById('setting-auto-delay-val');
    this.skipSpeedVal   = document.getElementById('setting-skip-speed-val');

    this.saveMode = 'save'; // 'save' or 'load'
  }

  syncAll(vars) {
    if (this.dayNum) this.dayNum.textContent = vars.day || 1;
    if (this.moneyNum) this.moneyNum.textContent = vars.money || 0;
    if (this.repNum) this.repNum.textContent = vars.reputation || 0;
    for (const [key, value] of Object.entries(vars)) {
      if (this.affFills[key]) {
        const pct = Math.min(Math.max(value, 0), 100);
        this.affFills[key].style.width = pct + '%';
      }
      if (this.affVals[key]) {
        this.affVals[key].textContent = value;
      }
    }
  }

  setScene(scene) {
    if (scene === this.currentScene) return;
    // 离开雨景时清理雨滴
    if (this.currentScene === 'rain') this.clearRain();
    this.currentScene = scene;
    this.sceneBg.className = '';
    if (USE_IMAGES && IMG.bg[scene]) {
      this.sceneBg.style.setProperty('--bg-' + scene, 'url(' + IMG.bg[scene] + ')');
    }
    switch (scene) {
      case 'cafe': this.sceneBg.className = 'scene-cafe'; break;
      case 'evening': this.sceneBg.className = 'scene-evening'; break;
      case 'rain': this.sceneBg.className = 'scene-rain'; this.spawnRain(); break;
      default: this.sceneBg.className = 'scene-intro'; break;
    }
  }

  clearRain() {
    const sceneArea = document.getElementById('scene-area');
    sceneArea.querySelectorAll('.rain-drop').forEach(d => d.remove());
  }

  // 初始化所有背景图片CSS变量（解决intro不显示的问题）
  initBgImages() {
    if (!USE_IMAGES) return;
    var keys = ['intro', 'cafe', 'evening', 'rain'];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (IMG.bg[k]) {
        this.sceneBg.style.setProperty('--bg-' + k, 'url(' + IMG.bg[k] + ')');
      }
    }
  }

  setSpeaker(name, text) {
    this.currentSpeaker = name;
    this.speakerEl.textContent = name || '';
    if (!name) { this.showCharacter('none'); return; }
    let charId = CHAR_IMG_KEY[name] || null;
    if (charId) {
      const expr = inferExpression(charId, text);
      this.showCharacter(charId, expr);
    } else {
      this.showCharacter('none');
    }
  }

  showCharacter(charId, expression) {
    this.charDisplay.innerHTML = '';
    if (!charId || charId === 'none') return;
    if (USE_IMAGES) {
      const charConf = IMG.char[charId];
      if (charConf) {
        const expr = expression || 'neutral';
        const src = charConf[expr] || charConf['neutral'];
        if (src) {
          const img = document.createElement('img');
          img.className = 'char-img';
          img.src = src;
          img.alt = charId + ' ' + expr;
          img.onerror = () => { this.showCharacterFallback(charId); };
          this.charDisplay.appendChild(img);
          return;
        }
      }
    }
    this.showCharacterFallback(charId);
  }

  showCharacterFallback(charId) {
    this.charDisplay.innerHTML = '';
    const charMap = { minglang: 'char-minglang', luli: 'char-luli', xiaomo: 'char-xiaomo' };
    const cls = charMap[charId];
    if (cls) {
      const div = document.createElement('div');
      div.className = 'pixel-char ' + cls;
      this.charDisplay.appendChild(div);
    }
  }

  showCharacterForSpeaker(name) {
    const charId = CHAR_IMG_KEY[name];
    if (charId) this.showCharacter(charId, 'neutral');
    else this.showCharacter('none');
  }

  setDialogue(text) { this.dialogueEl.textContent = text || ''; }
  appendDialogue(char) { this.dialogueEl.textContent += char; }
  showIndicator(show) { this.indicatorEl.style.display = show ? 'block' : 'none'; }

  renderChoices(choices) {
    this.choicesEl.innerHTML = '';
    choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      if (choice.text.startsWith('(') && choice.text.includes(')')) btn.classList.add('meta-choice');
      btn.addEventListener('click', () => { if (game) game.handleChoice(index); });
      this.choicesEl.appendChild(btn);
    });
  }

  clearChoices() { this.choicesEl.innerHTML = ''; }

  triggerGlitch(type) {
    this.glitchEl.classList.remove('hidden', 'active', 'crash');
    if (type === 'light') {
      this.glitchEl.classList.add('active');
      setTimeout(() => { this.glitchEl.classList.remove('active'); this.glitchEl.classList.add('hidden'); }, 200);
    } else if (type === 'crash') {
      this.glitchEl.classList.add('crash');
      setTimeout(() => { this.glitchEl.classList.remove('crash'); this.glitchEl.classList.add('hidden'); }, 600);
    }
  }

  showMetaReaction(text) {
    this.metaReactionText.textContent = text;
    this.metaReactionEl.classList.remove('hidden');
    setTimeout(() => { this.metaReactionEl.classList.add('hidden'); }, 2500);
  }

  spawnRain() {
    this.clearRain();
    const sceneArea = document.getElementById('scene-area');
    for (let i = 0; i < 40; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animationDuration = (0.3 + Math.random() * 0.7) + 's';
      drop.style.animationDelay = Math.random() * 2 + 's';
      sceneArea.appendChild(drop);
    }
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // ── Overlay Controls ──

  openPause() {
    this.pauseOverlay.classList.remove('hidden');
  }

  closePause() {
    this.pauseOverlay.classList.add('hidden');
  }

  openSave(mode) {
    this.saveMode = mode || 'save';
    this.saveTitle.textContent = mode === 'load' ? '— 读档 —' : '— 存档 —';
    this.renderSaveSlots();
    this.saveOverlay.classList.remove('hidden');
  }

  closeSave() {
    this.saveOverlay.classList.add('hidden');
  }

  renderSaveSlots() {
    this.saveSlots.innerHTML = '';
    const saves = SaveManager.getAllSaves();
    for (let i = 0; i < SaveManager.slotCount; i++) {
      const slotData = saves[i];
      const div = document.createElement('div');
      div.className = 'save-slot';
      if (slotData) {
        const info = document.createElement('div');
        info.className = 'save-slot-info';
        info.innerHTML =
          '<div class="save-slot-day">存档 ' + (i + 1) + ' · 第' + (slotData.vars.day || 1) + '天</div>' +
          '<div class="save-slot-meta">💰' + (slotData.vars.money || 0) + ' ⭐' + (slotData.vars.reputation || 0) + '</div>' +
          '<div class="save-slot-date">' + SaveManager.formatDate(slotData.timestamp) + '</div>';
        div.appendChild(info);
        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'save-slot-delete';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          SaveManager.delete(i);
          this.renderSaveSlots();
        });
        div.appendChild(delBtn);
        // Click to save/load
        div.addEventListener('click', () => {
          if (this.saveMode === 'load') {
            game.loadGame(i);
            this.closeSave();
            this.closePause();
          } else {
            game.saveGame(i);
            this.renderSaveSlots();
            this.closeSave();
          }
        });
      } else {
        div.className = 'save-slot empty';
        div.innerHTML = '<span>存档 ' + (i + 1) + ' — 空</span>';
        div.addEventListener('click', () => {
          game.saveGame(i);
          this.renderSaveSlots();
          this.closeSave();
        });
      }
      this.saveSlots.appendChild(div);
    }
  }

  openSettings() {
    this.speedSlider.value = settings.get('textSpeed');
    this.speedVal.textContent = settings.get('textSpeed');
    this.autoDelaySlider.value = settings.get('autoDelay');
    this.autoDelayVal.textContent = (settings.get('autoDelay') / 1000).toFixed(1) + 's';
    this.skipSpeedSlider.value = settings.get('skipSpeed');
    this.skipSpeedVal.textContent = settings.get('skipSpeed');
    this.effectsToggle.checked = settings.get('effects');
    this.settingsOverlay.classList.remove('hidden');
  }

  closeSettings() {
    this.settingsOverlay.classList.add('hidden');
  }

  openLog(log) {
    log.render(this.logList);
    this.logOverlay.classList.remove('hidden');
  }

  closeLog() {
    this.logOverlay.classList.add('hidden');
  }

  isAnyOverlayOpen() {
    return !this.pauseOverlay.classList.contains('hidden') ||
           !this.saveOverlay.classList.contains('hidden') ||
           !this.settingsOverlay.classList.contains('hidden') ||
           !this.logOverlay.classList.contains('hidden');
  }

  closeAllOverlays() {
    this.pauseOverlay.classList.add('hidden');
    this.saveOverlay.classList.add('hidden');
    this.settingsOverlay.classList.add('hidden');
    this.logOverlay.classList.add('hidden');
  }
}

// ===== Game State =====
class GameState {
  constructor() {
    this.vars = JSON.parse(JSON.stringify(STORY.vars));
    this.currentSceneId = null;
    this.currentLineIndex = 0;
    this.currentLines = [];
    this.isTyping = false;
    this.typewriterTimer = null;
    this.autoMode = false;
    this.autoTimer = null;
    this.pendingText = '';
    this.currentChoices = [];
    this.isInMenu = false;
    this.currentSpeakerName = '';
    this.currentAffKey = '';
    this.metaInterrupt = null;
    this.choicesActive = false;
  }

  applyEffects(effects) {
    if (!effects) return;
    for (const [key, value] of Object.entries(effects)) {
      if (typeof value === 'boolean') {
        this.vars[key] = value;
      } else {
        this.vars[key] = (this.vars[key] || 0) + value;
      }
    }
    if (ui) ui.syncAll(this.vars);
  }

  enterScene(sceneId) {
    const scene = STORY.scenes[sceneId];
    if (!scene) { console.error('Scene not found:', sceneId); return false; }
    this.currentSceneId = sceneId;
    this.currentLineIndex = 0;
    this.currentLines = scene.lines || [];
    this.currentChoices = scene.choices || [];
    this.metaInterrupt = null;
    if (scene.onEnter) this.applyEffects(scene.onEnter);
    ui.clearChoices();
    return true;
  }

  clearAuto() {
    this.autoMode = false;
    if (this.autoTimer) { clearTimeout(this.autoTimer); this.autoTimer = null; }
    if (typeof ui !== 'undefined' && ui.autoBtn) ui.autoBtn.textContent = '▶';
  }

  getCurrentScene() {
    return STORY.scenes[this.currentSceneId] || null;
  }

  getAffectionForSpeaker(name) {
    const keyMap = { '陆离': 'lu_li_aff', '明朗': 'ming_lang_aff', '萧默': 'xiao_mo_aff' };
    const key = keyMap[name];
    return key ? (this.vars[key] || 0) : 0;
  }

  getAffKeyForSpeaker(name) {
    const keyMap = { '陆离': 'lu_li_aff', '明朗': 'ming_lang_aff', '萧默': 'xiao_mo_aff' };
    return keyMap[name] || '';
  }
}

// ===== Main Game =====
class Game {
  constructor() {
    this.state = new GameState();
    this.log = new DialogueLog();
    this.meta = new MetaManager();
    this.init();
  }

  init() {
    ui.syncAll(this.state.vars);

    // Dialogue box click to advance
    document.getElementById('dialogue-box').addEventListener('click', () => {
      if (this.state.isInMenu) return;
      if (!this.state.isTyping) this.advanceLine();
    });

    // Bottom buttons
    document.getElementById('btn-save').addEventListener('click', () => {
      this.state.isInMenu = true;
      ui.openSave('save');
      this.triggerMeta('save');
    });
    document.getElementById('btn-load').addEventListener('click', () => {
      this.state.isInMenu = true;
      ui.openSave('load');
    });
    document.getElementById('btn-auto').addEventListener('click', () => this.toggleAuto());
    document.getElementById('btn-skip').addEventListener('click', () => {
      this.skipDialogue();
      this.triggerMeta('skip');
    });
    document.getElementById('btn-log').addEventListener('click', () => {
      this.state.isInMenu = true;
      ui.openLog(this.log);
      this.triggerMeta('log');
    });
    document.getElementById('btn-menu').addEventListener('click', () => {
      this.state.isInMenu = true;
      ui.openPause();
    });

    // Pause menu buttons
    document.getElementById('pause-continue').addEventListener('click', () => { ui.closePause(); this.state.isInMenu = false; this.meta.resetIdle(); });
    document.getElementById('pause-save').addEventListener('click', () => { ui.closePause(); ui.openSave('save'); });
    document.getElementById('pause-load').addEventListener('click', () => { ui.closePause(); ui.openSave('load'); });
    document.getElementById('pause-settings').addEventListener('click', () => { ui.closePause(); ui.openSettings(); });
    document.getElementById('pause-exit').addEventListener('click', () => { location.reload(); });

    // Save overlay
    document.getElementById('save-back').addEventListener('click', () => { ui.closeSave(); if (!ui.isAnyOverlayOpen()) this.state.isInMenu = false; });

    // Settings
    document.getElementById('settings-back').addEventListener('click', () => { ui.closeSettings(); if (!ui.isAnyOverlayOpen()) this.state.isInMenu = false; });
    document.getElementById('log-back').addEventListener('click', () => { ui.closeLog(); if (!ui.isAnyOverlayOpen()) this.state.isInMenu = false; });

    // Settings sliders
    this.settingSpeed = document.getElementById('setting-speed');
    this.settingSpeedVal = document.getElementById('setting-speed-val');
    this.settingAutoDelay = document.getElementById('setting-auto-delay');
    this.settingAutoDelayVal = document.getElementById('setting-auto-delay-val');
    this.settingSkipSpeed = document.getElementById('setting-skip-speed');
    this.settingSkipSpeedVal = document.getElementById('setting-skip-speed-val');
    this.settingEffects = document.getElementById('setting-effects');

    this.settingSpeed.addEventListener('input', () => {
      this.settingSpeedVal.textContent = this.settingSpeed.value;
      settings.set('textSpeed', parseInt(this.settingSpeed.value));
    });
    this.settingAutoDelay.addEventListener('input', () => {
      this.settingAutoDelayVal.textContent = (parseInt(this.settingAutoDelay.value) / 1000).toFixed(1) + 's';
      settings.set('autoDelay', parseInt(this.settingAutoDelay.value));
    });
    this.settingSkipSpeed.addEventListener('input', () => {
      this.settingSkipSpeedVal.textContent = this.settingSkipSpeed.value;
      settings.set('skipSpeed', parseInt(this.settingSkipSpeed.value));
    });
    this.settingEffects.addEventListener('change', () => {
      settings.set('effects', this.settingEffects.checked);
    });

    // Meta interaction: click affection bars
    document.querySelectorAll('.aff-slot').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerMeta('affection_click');
      });
    });

    // Meta interaction: click character
    document.getElementById('character-display').addEventListener('click', (e) => {
      e.stopPropagation();
      this.triggerMeta('char_click');
    });

    // Meta interaction: click stats
    document.getElementById('top-bar').addEventListener('click', (e) => {
      e.stopPropagation();
      this.triggerMeta('stats_click');
    });

    // ESC to toggle pause
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        if (ui.isAnyOverlayOpen()) {
          ui.closeAllOverlays();
          this.state.isInMenu = false;
        } else {
          this.state.isInMenu = true;
          ui.openPause();
        }
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        if (ui.isAnyOverlayOpen()) return;
        e.preventDefault();
        if (!this.state.isTyping) this.advanceLine();
      }
      // Arrow up for log
      if (e.code === 'ArrowUp' && !ui.isAnyOverlayOpen()) {
        e.preventDefault();
        this.state.isInMenu = true;
        ui.openLog(this.log);
        this.triggerMeta('log');
      }
    });

    // Mobile: swipe up for log
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; });
    document.addEventListener('touchend', (e) => {
      if (ui.isAnyOverlayOpen()) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (dy > 80) {
        this.state.isInMenu = true;
        ui.openLog(this.log);
        this.triggerMeta('log');
      }
    });

    // Init background images (fix intro not showing)
    ui.initBgImages();

    // Start story
    this.state.enterScene('intro');
    this.advanceLine();
    this.meta.resetIdle();
  }

  triggerMeta(type) {
    const result = this.meta.trigger(type, this.state.currentSpeakerName, this.state.getAffectionForSpeaker(this.state.currentSpeakerName));
    if (result) {
      this.injectMetaLine(result);
    }
  }

  injectMetaLine(reaction) {
    this.state.metaInterrupt = reaction;
    if (this.state.isTyping) {
      this.finishTypewriter();
    } else {
      this.showMetaLine();
    }
  }

  showMetaLine() {
    const m = this.state.metaInterrupt;
    if (!m) return;

    this.state.metaInterrupt = null;

    // Save current state for resume
    const savedSpeaker = this.state.currentSpeakerName;

    // Show meta reaction
    ui.setSpeaker(m.speaker);
    ui.showMetaReaction(m.speaker + '：' + m.text);
    // Also show in dialogue box
    this.typewriteText(m.text, true); // true = meta mode, auto-resume after
  }

  advanceLine() {
    if (this.state.isTyping) {
      this.finishTypewriter();
      return;
    }

    this.state.clearAuto();

    const scene = this.state.getCurrentScene();
    if (!scene) return;

    const allLinesDone = this.state.currentLineIndex >= this.state.currentLines.length;

    if (allLinesDone && scene.choices && scene.choices.length > 0) {
      this.presentChoices(scene.choices);
      return;
    }

    if (allLinesDone && scene.autoNext) {
      this.state.enterScene(scene.autoNext);
      this.advanceLine();
      return;
    }

    if (allLinesDone && scene.autoNext === null) {
      ui.setSpeaker('');
      ui.setDialogue('');
      ui.showIndicator(false);
      ui.clearChoices();
      ui.showCharacter('none');
      return;
    }

    if (allLinesDone) {
      ui.showIndicator(false);
      return;
    }

    const line = this.state.currentLines[this.state.currentLineIndex];
    this.state.currentLineIndex++;

    if (!line) { this.advanceLine(); return; }

    if (line.scene) ui.setScene(line.scene);

    const txt = line.text || '';

    if (line.speaker !== undefined) {
      ui.setSpeaker(line.speaker, txt);
      this.state.currentSpeakerName = line.speaker;
      this.state.currentAffKey = this.state.getAffKeyForSpeaker(line.speaker);
    }

    if (line.glitch && settings.get('effects')) {
      setTimeout(() => ui.triggerGlitch(line.glitch), 100);
    }

    if (txt.includes('【系统】') || txt.includes('【警告】')) {
      ui.setSpeaker('系统', txt);
      this.state.currentSpeakerName = '系统';
    }
    if (txt.includes('【检测') || txt.includes('【警告') && settings.get('effects')) {
      setTimeout(() => ui.triggerGlitch('light'), 300);
    }

    // Log
    this.log.add(this.state.currentSpeakerName || '', txt);

    this.typewriteText(txt, false);
  }

  typewriteText(text, isMeta) {
    this.state.isTyping = true;
    this.state.pendingText = text;
    this.state.isMetaLine = isMeta;
    ui.setDialogue('');
    ui.showIndicator(false);
    ui.clearChoices();

    let i = 0;
    const speed = 70 - settings.get('textSpeed'); // inverted: lower setting = faster
    const adjustedSpeed = Math.max(10, Math.min(60, speed));

    const tick = () => {
      if (!this.state.isTyping) return;

      if (i < text.length) {
        ui.appendDialogue(text[i]);
        i++;
        this.state.typewriterTimer = setTimeout(tick, adjustedSpeed);
      } else {
        this.state.isTyping = false;

        if (isMeta) {
          // After meta line, resume normal flow
          setTimeout(() => this.advanceLine(), 800);
          return;
        }

        const scene = this.state.getCurrentScene();
        const hasMore = this.state.currentLineIndex < this.state.currentLines.length;
        const hasChoices = scene && scene.choices && scene.choices.length > 0;
        const allDone = !hasMore;

        ui.showIndicator(hasMore || hasChoices);

        if (allDone && hasChoices) {
          this.presentChoices(scene.choices);
          return;
        }

        if (this.state.autoMode && hasMore) {
          this.state.autoTimer = setTimeout(() => this.advanceLine(), settings.get('autoDelay'));
        } else if (this.state.autoMode && allDone && hasChoices) {
          this.state.clearAuto();
          ui.showToast('自动暂停（需要选择）');
          this.presentChoices(scene.choices);
        } else if (this.state.autoMode && allDone && scene && scene.autoNext) {
          this.state.autoTimer = setTimeout(() => {
            this.state.enterScene(scene.autoNext);
            this.advanceLine();
          }, settings.get('autoDelay'));
        }

        this.meta.resetIdle();
      }
    };

    tick();
  }

  finishTypewriter() {
    this.state.isTyping = false;
    if (this.state.typewriterTimer) clearTimeout(this.state.typewriterTimer);

    if (this.state.pendingText) {
      ui.setDialogue(this.state.pendingText);
      this.log.add(this.state.currentSpeakerName || '', this.state.pendingText);
    }

    if (this.state.isMetaLine) {
      setTimeout(() => this.advanceLine(), 500);
      return;
    }

    const scene = this.state.getCurrentScene();
    const hasMore = this.state.currentLineIndex < this.state.currentLines.length;
    const hasChoices = scene && scene.choices && scene.choices.length > 0;
    const allDone = !hasMore;

    ui.showIndicator(hasMore || hasChoices);

    if (allDone && hasChoices) {
      this.presentChoices(scene.choices);
    }
  }

  presentChoices(choices) {
    this.state.currentChoices = choices;
    this.state.choicesActive = true;
    ui.renderChoices(choices);
    ui.showIndicator(false);
    this.meta.resetIdle();
  }

  handleChoice(index) {
    if (this.state.isTyping) return;
    this.state.clearAuto();
    this.state.choicesActive = false;

    const choice = this.state.currentChoices[index];
    if (!choice) return;

    if (choice.effects) {
      this.state.applyEffects(choice.effects);
    }

    if (choice.text.startsWith('(') && choice.text.includes(')')) {
      if (settings.get('effects')) ui.triggerGlitch('light');
    }

    // Log the choice
    this.log.add('▼ 你选择了', choice.text);

    ui.clearChoices();
    ui.setSpeaker('');

    if (choice.next) {
      this.state.enterScene(choice.next);
      this.advanceLine();
    }

    this.meta.resetIdle();
  }

  saveGame(slot) {
    SaveManager.save(slot, this.state.vars, this.state.currentSceneId, this.state.currentLineIndex);
    ui.showToast('💾 已存档到位置 ' + (slot + 1));
    this.state.isInMenu = false;
  }

  loadGame(slot) {
    const save = SaveManager.load(slot);
    if (!save) { ui.showToast('📂 该存档为空'); return; }
    try {
      this.state.vars = JSON.parse(JSON.stringify(save.vars));
      this.state.enterScene(save.sceneId);
      this.state.currentLineIndex = save.lineIndex || 0;
      ui.syncAll(this.state.vars);
      ui.clearChoices();
      ui.setSpeaker('');

      const msgs = [
        '📂 读取中……上一次的你，做了不同的选择。',
        '📂 时间回溯完成。档案读取。欢迎回来。',
        '📂 或者，初次见面？无论怎样，故事继续。',
      ];
      ui.showToast(msgs[Math.floor(Math.random() * msgs.length)]);

      this.state.isInMenu = false;
      this.advanceLine();
    } catch (e) {
      ui.showToast('⚠ 存档损坏');
    }
  }

  toggleAuto() {
    this.state.autoMode = !this.state.autoMode;
    if (this.state.autoMode) {
      ui.autoBtn.textContent = '⏸';
      ui.showToast('▶ 自动模式开启');
      if (!this.state.isTyping) this.advanceLine();
    } else {
      this.state.clearAuto();
      ui.autoBtn.textContent = '▶';
      ui.showToast('⏸ 自动模式关闭');
    }
  }

  skipDialogue() {
    if (this.state.isTyping) {
      this.finishTypewriter();
      return;
    }
    const scene = this.state.getCurrentScene();
    if (!scene) return;
    if (scene.choices && scene.choices.length > 0) {
      this.state.currentLineIndex = this.state.currentLines.length;
      this.presentChoices(scene.choices);
    } else if (scene.autoNext) {
      this.state.enterScene(scene.autoNext);
      this.advanceLine();
    }
  }
}

// ===== Boot =====
let ui = null;
let game = null;
let settings = null;

window.addEventListener('DOMContentLoaded', () => {
  try {
    settings = new SettingsManager();
    ui = new UIManager();
    game = new Game();
  } catch (e) {
    var errEl = document.getElementById('boot-error');
    if (errEl) {
      errEl.style.display = 'block';
      errEl.innerHTML = 'Oops——剧本出错了...<br><br>错误信息:<br>' + e.message + '<br><br>可以试试: Ctrl+Shift+I → Console 查看完整错误';
    }
    console.error(e);
  }
});
