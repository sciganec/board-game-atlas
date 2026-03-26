import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   DESIGN SYSTEM
═══════════════════════════════════════════════════════════ */
const DS = {
  bg0:"#030408",bg1:"#070910",bg2:"#0b0e16",bg3:"#0f121c",
  sur:"#141824",sur2:"#1c2130",sur3:"#242938",
  brd:"rgba(255,255,255,.07)",brd2:"rgba(255,255,255,.12)",brd3:"rgba(255,255,255,.18)",
  gold:"#d4a84c",gold2:"#eecf6a",gold3:"#f8e8b0",goldD:"#8a6a24",
  goldBg:"rgba(212,168,76,.08)",goldBg2:"rgba(212,168,76,.16)",
  t1:"#f2eee4",t2:"#c0baa8",t3:"#8c8478",t4:"#646060",
  citrinitas:"#d4a83a",rubedo:"#c84848",nigredo:"#7878c8",albedo:"#8ab4c8",
  teal:"#2a9d8f",amber:"#e76f51",indigo:"#6264a0",sage:"#3a7a5a",
  fSerif:"'Playfair Display','Cormorant Garamond',serif",
  fSans:"'DM Sans',system-ui,sans-serif",
  fMono:"'JetBrains Mono','Fira Code',monospace",
  fDisp:"'Cinzel',serif",
};

/* ═══════════════════════════════════════════════════════════
   SUBIT ENGINE
═══════════════════════════════════════════════════════════ */
const WHO_BITS   = { ME:"10", WE:"11", YOU:"01", THEY:"00" };
const WHERE_BITS = { EAST:"10", SOUTH:"11", WEST:"01", NORTH:"00" };
const WHEN_BITS  = { SPRING:"10", SUMMER:"11", AUTUMN:"01", WINTER:"00" };
const PHASE      = { "10":"CITRINITAS","11":"RUBEDO","01":"NIGREDO","00":"ALBEDO" };

const PHASE_META = {
  CITRINITAS:{ color:DS.citrinitas, bg:"rgba(212,168,58,.08)", label:"ME · EAST · SPRING" },
  RUBEDO:    { color:DS.rubedo,     bg:"rgba(200,64,64,.08)",  label:"WE · SOUTH · SUMMER" },
  NIGREDO:   { color:DS.nigredo,    bg:"rgba(100,100,200,.09)",label:"YOU · WEST · AUTUMN" },
  ALBEDO:    { color:DS.albedo,     bg:"rgba(138,180,200,.07)",label:"THEY · NORTH · WINTER" },
};
const WHERE_META = {
  EAST: {color:"#3ab4d4"}, SOUTH:{color:"#d48c3a"},
  WEST: {color:"#8878c8"}, NORTH:{color:"#4aaa78"},
};
const WHEN_META = {
  SPRING:{color:"#6ab84a"}, SUMMER:{color:"#d4a83a"},
  AUTUMN:{color:"#c87840"}, WINTER:{color:"#6890c8"},
};

function subitCode(who,where,when){ return WHO_BITS[who]+WHERE_BITS[where]+WHEN_BITS[when]; }
function phaseOf(who){ return PHASE[WHO_BITS[who]]; }
function phaseColor(who){ return PHASE_META[phaseOf(who)].color; }

/* ═══════════════════════════════════════════════════════════
   GAMES DATABASE  — 44 games
═══════════════════════════════════════════════════════════ */
const GAMES = [
  {id:"petteia",name:"Πεττεία",native:"Petteia · Pessoi · Poleis",who:"ME",where:"EAST",when:"SPRING",era:"~VIII ст. до н.е.",origin:"Стародавня Греція",players:"2",duration:"15–40 хв",emoji:"🏺",tags:["Стратегія","Захоплення","Без кубиків","Стародавня"],
   excerpt:"Найдавніша грецька стратегічна гра без елементів випадку. Фішки-«пси» захоплюються сандвічем.",
   facts:["Ахілл і Аякс зображені за петтеєю на амфорі Ексекія (~540 до н.е., Ватикан).","Платон у «Федрі»: гра прийшла з Єгипту від бога Тевта.","Арістотель: «Громадянин без держави — ізольована фішка в петтеї».","Юлій Поллукс (II ст.) — єдиний прямий опис правил в «Ономастиконі».","Євстафій Солунський вживає термін ἀνταναίρεσις — «почергове усунення».","Можлива предтеча шахів через перського посередника (Авербах, 1991)."],
   history:"Πεττεία (~VIII ст. до н.е.) — стратегічна гра без випадку. Перші згадки у Гомера в «Одіссеї». Платон у «Федрі» пов'язує з єгипетським богом Тевтом. Полібій хвалив Сципіона: «відрізав ворогів як майстерний гравець у петтею». Фішки — «пси» (κύνες).",
   rules:"**Дошка:** 8×8. **Рух:** як тура. **Захоплення:** сандвіч між двома ворогами. **Ключове:** фішка що *входить* між ворогами — не захоплюється. Краї не рахуються.",
   playable:true,gameType:"petteia"},

  {id:"go",name:"囲碁",native:"Go · Wei-Qi · Baduk · 바둑",who:"WE",where:"EAST",when:"SUMMER",era:"~2000 до н.е.",origin:"Стародавній Китай",players:"2",duration:"30–180 хв",emoji:"⚫",tags:["Стратегія","Територія","Класична"],
   excerpt:"Найглибша стратегічна гра людства. Простіші правила ніж у шахах — незмірно більша складність.",
   facts:["Кількість партій Ґо > атомів у Всесвіті (10¹⁷⁰ vs 10⁸⁰).","AlphaGo переміг Лі Седоля 4:1 у 2016 — шок для всього світу.","Японський сьоґунат фінансував 4 офіційні школи Ґо з XVI ст.","«Атарі» (загроза захоплення) дало назву компанії Atari.","Найстаріший запис партії — «Тривала гра» (1349 н.е.).","В Кореї Ґо входить до шкільної програми з 1990-х рр."],
   history:"Ґо (囲碁) грається 4000+ років. Легенда приписує його імператору Яо (~2300 до н.е.). З Китаю — до Кореї (~400 н.е.) та Японії (~600 н.е.). Хонімбо Санша заснував першу школу у 1612 р. AlphaGo у 2016 назавжди змінив уявлення про ШІ.",
   rules:"**Дошка:** 9×9 або 19×19. **Хід:** камінь на вільний перетин. **Дихання:** група жива завдяки вільним сусіднім перетинам. **Захоплення:** оточіть групу. **Ко:** не можна відновлювати попередню позицію. **Komi:** білі +6.5 очок.",
   playable:true,gameType:"go9"},

  {id:"senet",name:"Senet",native:"Snt · سنت · Сенет",who:"THEY",where:"SOUTH",when:"WINTER",era:"~3100 до н.е.",origin:"Стародавній Єгипет",players:"2",duration:"15–30 хв",emoji:"𓂀",tags:["Гонка","Ритуал","Найдавніша"],
   excerpt:"Найдавніша відома настільна гра. Знайдена в гробниці Тутанхамона. Шлях душі через Дуат.",
   facts:["Набір знайдено в гробниці Тутанхамона (1323 до н.е.).","Зображення відомі з ~3100 до н.е. (гробниця Херефа).","«Книга мертвих» описує Senet як посмертну гру душі.","Слово «senet» = «проходження» на давньоєгипетській.","Нефертарі зображена у гробниці за грою без суперника."],
   history:"Senet (~3100 до н.е.) — найдавніша відома настільна гра. За тисячоліття став ритуальним предметом. Переможець символічно досягав «поля очерету» Ялу — єгипетського раю.",
   rules:"**Дошка:** 30 клітин (3×10), S-траєкторія. **4 палички-кубики (0–4 очки). **Клітина 27** (вода) = повернення на початок. **Мета:** першим вивести всі фішки.",
   playable:true,gameType:"senet"},

  {id:"mancala",name:"Mancala",native:"Oware · Bao · Awari · Kalah",who:"WE",where:"SOUTH",when:"SUMMER",era:"~700 н.е.",origin:"Африка · Близький Схід",players:"2",duration:"10–30 хв",emoji:"🟤",tags:["Підрахунок","Посів","Найпоширеніша"],
   excerpt:"300+ варіантів по всій Африці, Азії та Карибах. Найпоширеніше сімейство ігор світу.",
   facts:["Понад 300 задокументованих варіантів.","Bao (Танзанія) — найскладніша версія з 4 рядами.","Kalah вирішено: перший гравець завжди виграє.","«Mancala» від арабського نقل (naqala) — «переміщати»."],
   history:"Mancala поширилась від Африки до Персії, Індії та Філіппін. Простота матеріалів зробила гру доступною будь-де. Bao з Занзібару та Oware з Гани — шедеври народної математики.",
   rules:"**2×6 ямок + 2 комори.** Початок: 4 камінці. Хід: розкидайте вміст ямки по одному проти годинника. Захоплення: останній у порожній своїй ямці — берете напроти. **Мета:** більше каменів у коморі.",
   playable:true,gameType:"mancala"},

  {id:"xiangqi",name:"象棋",native:"Xiangqi · Chinese Chess",who:"YOU",where:"EAST",when:"AUTUMN",era:"~VII ст. н.е.",origin:"Китай (Tang)",players:"2",duration:"20–90 хв",emoji:"🀄",tags:["Стратегія","Шахи","Класична"],
   excerpt:"Китайські шахи. Річка ділить дошку. Гармата б'є лише через іншу фігуру. 1.5 млрд гравців.",
   facts:["1.5+ мільярда людей вміють грати — рекорд.","«Річка» (楚河漢界) — алюзія на битву 206 до н.е.","Гармата (炮) б'є тільки через «верхстат» — унікальна механіка.","Генерал не може «бачити» ворожого Генерала по вертикалі."],
   history:"Сянці виникли за Tang (~VII ст.). Форма з «річкою» та гарматою склалась за Сун (~X ст.). Унікальна фігура — гармата. Гра домінує в Азії.",
   rules:"9×10 дошка, розділена «річкою». Гармата ходить як тура але б'є тільки через іншу фігуру. Генерал і Радники — лише у «палаці» 3×3. Слони — лише на своїй половині.",
   playable:false,preview:"xiangqi"},

  {id:"shogi",name:"将棋",native:"Shogi · Japanese Chess",who:"YOU",where:"EAST",when:"WINTER",era:"~X ст. н.е.",origin:"Японія",players:"2",duration:"30–120 хв",emoji:"⛩️",tags:["Стратегія","Трансформація","Унікальна механіка"],
   excerpt:"Японські шахи. Захоплені фігури виставляються назад — унікальна революційна механіка.",
   facts:["Виставлення захоплених фігур (打ち歩) — унікально серед шахових.","Від 5×5 (Mini-Shogi) до 36×36 (Taikyoku) з 402 фігурами.","Bonanza вперше переміг чемпіона Японії у 2010.","~10 мільйонів активних гравців у Японії."],
   history:"Шоґі прийшов з Чатуранги через Shatranj. Унікальна риса — захоплені фігури виставляються як свої — з'явилась ~X–XI ст. Самурай грали як тренування стратегії.",
   rules:"9×9 дошка. Захоплена фігура стає вашою і виставляється на будь-яку вільну клітину. В зоні суперника фігури перетворюються. Мета: мат Королю.",
   playable:false,preview:"shogi"},

  {id:"shatranj",name:"Chaturanga",native:"\u091a\u0924\u0941\u0930\u0919\u094d\u0917 \u00b7 \u0406\u043d\u0434\u0456\u0439\u0441\u044c\u043a\u0456 \u0448\u0430\u0445\u0438",who:"ME",where:"EAST",when:"SPRING",era:"~550 \u043d.\u0435.",origin:"\u0406\u043d\u0434\u0456\u044f (Gupta Empire)",players:"2",duration:"30\u201360 \u0445\u0432",emoji:"\ud83d\udc18",tags:["\u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0456\u044f","\u0420\u043e\u0434\u043e\u043d\u0430\u0447\u0430\u043b\u044c\u043d\u0438\u043a","\u041a\u043b\u0430\u0441\u0438\u0447\u043d\u0430"],
   excerpt:"\u0406\u043d\u0434\u0456\u0439\u0441\u044c\u043a\u0438\u0439 \u043f\u0440\u0430\u0440\u043e\u0434\u0438\u0447 \u0443\u0441\u0456\u0445 \u0448\u0430\u0445\u043e\u0432\u0438\u0445 \u0456\u0433\u043e\u0440. \u0421\u043b\u043e\u043d \u0441\u0442\u0440\u0438\u0431\u0430\u0454 \u0441\u0442\u0440\u0438\u0431\u043a\u043e\u043c \u0447\u0435\u0440\u0435\u0437 \u043a\u043b\u0456\u0442\u0438\u043d\u0443, \u0420\u0430\u0442\u0445\u0430 (\u0442\u0443\u0440\u0430) \u043f\u0430\u043d\u0443\u0454. \u0427\u0438\u0441\u0442\u0430 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0456\u044f \u0431\u0435\u0437 \u043a\u0443\u0431\u0438\u043a\u0430.",
   facts:["\u041d\u0430\u0437\u0432\u0430 '\u0447\u0430\u0442\u0443\u0440\u0430\u043d\u0433\u0430' \u043e\u0437\u043d\u0430\u0447\u0430\u0454 '\u0447\u043e\u0442\u0438\u0440\u0438 \u0440\u043e\u0434\u0438': \u0441\u043b\u043e\u043d\u0438, \u043a\u043e\u043d\u0456, \u043a\u043e\u043b\u0456\u0441\u043d\u0438\u0446\u0456, \u043f\u0456\u0445\u043e\u0442\u0430.","\u041f\u0435\u0440\u0448\u0430 \u043f\u0438\u0441\u044c\u043c\u043e\u0432\u0430 \u0437\u0433\u0430\u0434\u043a\u0430 \u0434\u0432\u043e\u043f\u0430\u0440\u0442\u0456\u0439\u043d\u043e\u0457 \u0432\u0435\u0440\u0441\u0456\u0457 \u2014 \u0425\u0430\u0440\u0448\u0430\u0447\u0430\u0440\u0456\u0442\u0430 (~625 \u043d.\u0435.).","\u0421\u043b\u043e\u043d (Hast\u012b) \u0441\u0442\u0440\u0438\u0431\u0430\u0432 \u0447\u0435\u0440\u0435\u0437 1 \u043a\u043b\u0456\u0442\u0438\u043d\u0443 \u043f\u043e \u0434\u0456\u0430\u0433\u043e\u043d\u0430\u043b\u0456 \u2014 \u043f\u0440\u0435\u0434\u043e\u043a \u0454\u043f\u0438\u0441\u043a\u043e\u043f\u0430.","\u0420\u0430\u0442\u0445\u0430 (\u043a\u043e\u043b\u0456\u0441\u043d\u0438\u0446\u044f) \u0445\u043e\u0434\u0438\u043b\u0430 \u044f\u043a \u0441\u0443\u0447\u0430\u0441\u043d\u0430 \u0442\u0443\u0440\u0430 \u2014 \u043d\u0430\u0439\u0441\u0438\u043b\u044c\u043d\u0456\u0448\u0430.","\u041c\u0430\u043d\u0434\u0430\u043b\u0430 (\u043f\u0440\u0435\u0434\u043e\u043a \u0444\u0435\u0440\u0437\u044f) \u2014 \u043b\u0438\u0448\u0435 1 \u043a\u043b\u0456\u0442\u0438\u043d\u0430 \u043f\u043e \u0434\u0456\u0430\u0433\u043e\u043d\u0430\u043b\u0456.","\u0427\u0435\u0440\u0435\u0437 \u041f\u0435\u0440\u0441\u0456\u044e (Shatranj) \u0456 \u0430\u0440\u0430\u0431\u0441\u044c\u043a\u0438\u0439 \u0441\u0432\u0456\u0442 \u0433\u0440\u0430 \u0434\u0456\u0439\u0448\u043b\u0430 \u0434\u043e \u0404\u0432\u0440\u043e\u043f\u0438."],
   history:"\u0427\u0430\u0442\u0443\u0440\u0430\u043d\u0433\u0430 (~550 \u043d.\u0435.) \u043d\u0430\u0440\u043e\u0434\u0438\u043b\u0430\u0441\u044c \u0432 \u0406\u043d\u0434\u0456\u0457. \u0414\u0432\u043e\u043f\u0430\u0440\u0442\u0456\u0439\u043d\u0430 \u2014 \u0447\u0438\u0441\u0442\u0430 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0456\u044f \u0431\u0435\u0437 \u043a\u0443\u0431\u0438\u043a\u0456\u0432. \u0427\u0435\u0440\u0435\u0437 \u041f\u0435\u0440\u0441\u0456\u044e \u0442\u0430 \u0430\u0440\u0430\u0431\u0441\u044c\u043a\u0438\u0439 \u0441\u0432\u0456\u0442 \u0441\u0442\u0430\u043b\u0430 \u043f\u0440\u0435\u0434\u043a\u043e\u043c Chess, Xiangqi, Shogi.",
   rules:"\u0414\u043e\u0448\u043a\u0430 8\u00d78. \u0420\u0430\u0442\u0445\u0430 (R): \u044f\u043a \u0442\u0443\u0440\u0430. \u0410\u0448\u0432\u0430 (N): \u0413-\u043f\u043e\u0434\u0456\u0431\u043d\u043e. \u0425\u0430\u0441\u0442\u0456 (B): \u0441\u0442\u0440\u0438\u0431\u043e\u043a \u0447\u0435\u0440\u0435\u0437 1 \u043f\u043e \u0434\u0456\u0430\u0433. \u041c\u0430\u043d\u0434\u0430\u043b\u0430 (Q): 1 \u043a\u043b\u0456\u0442\u0438\u043d\u0430 \u043f\u043e \u0434\u0456\u0430\u0433\u043e\u043d\u0430\u043b\u0456. \u0420\u0430\u0434\u0436\u0430 (K): 1 \u0432 \u0431\u0443\u0434\u044c-\u044f\u043a\u0438\u0439 \u0431\u0456\u043a. \u041c\u0435\u0442\u0430: \u043c\u0430\u0442 \u0430\u0431\u043e stalemate (\u043f\u0430\u0442 = \u043f\u0435\u0440\u0435\u043c\u043e\u0433\u0430 \u0432 \u043e\u0440\u0438\u0433\u0456\u043d\u0430\u043b\u044c\u043d\u0456\u0439 \u0447\u0430\u0442\u0443\u0440\u0430\u043d\u0437\u0456).",
   playable:true,gameType:"chaturanga"},

  

  {id:"luduslatrunculorum",name:"Latrunculi",native:"Ludus Latrunculorum · Гра Солдатиків",who:"YOU",where:"SOUTH",when:"AUTUMN",era:"~II ст. до н.е.",origin:"Стародавній Рим",players:"2",duration:"20–50 хв",emoji:"⚔️",tags:["Стратегія","Рим","Нащадок Петтеї"],
   excerpt:"Гра Римської армії. Овідій і Марціал хвалили її. Знайдена від Шотландії до Єгипту.",
   facts:["Овідій: «один камінець гине між двома ворогами».","Дошки від Шотландії до Сирії — солдати поширювали по легіонах.","«Stanway Game» (Essex, 1996) — набір у кельтській гробниці I ст."],
   history:"Ludus Latrunculorum — провідна стратегічна гра Римської імперії (~II ст. до н.е.). Вийшла з грецької петтеї. Відома з Овідія, Марціала, Ісидора Севільського.",
   rules:"Схожа до Петтеї. Рух ортогонально (1 клітина або як тура). Захоплення: сандвіч. Dux — особлива фігура.",
   playable:false,preview:"latrunculi"},

  {id:"tabula",name:"Tabula",native:"Tabula · Τάβλη · Tables",who:"WE",where:"SOUTH",when:"SUMMER",era:"~III ст. н.е.",origin:"Візантія",players:"2",duration:"15–30 хв",emoji:"🎲",tags:["Гонка","Нарди","Кубики"],
   excerpt:"Прямий предок нардів. Збереглась позиція легендарного програшу імператора Зенона.",
   facts:["Позиція партії Зенона (~480 н.е.) — найдавніший ігровий «запис».","Три кубики замість двох.","Через арабський Nard (~600 н.е.) → сучасні нарди."],
   history:"Tabula — візантійська гра (III–VI ст.). Зенон Ісаврійський: трагічна позиція де 2,5,6 і жоден хід не врятував партію.",
   rules:"12+12 пунктів. Всі фішки в одному напрямку. Три кубики. Мета: першим вивести всі фішки.",
   playable:false,preview:"tabula"},

  {id:"chess",name:"Chess",native:"Шахи · Échecs · Schach · Ajedrez",who:"YOU",where:"WEST",when:"AUTUMN",era:"~1475 н.е.",origin:"Іспанія / Італія",players:"2",duration:"10–180+ хв",emoji:"♔",tags:["Стратегія","Класична","Всесвітня"],
   excerpt:"Революція XV ст.: ферзь став найсильнішою фігурою. Від слабкого Ферзана до богині бою.",
   facts:["Перший чемпіон світу — Стейніц (1886). Матч тривав 5 місяців.","Каспаров програв Deep Blue у 1997 — перша поразка від машини.","Найдовша офіційна партія — 269 ходів (Ніколіч vs Арсовіч, 1989).","2000+ задокументованих дебютів і варіантів."],
   history:"Сучасні шахи народились ~1475–1500 у Іспанії та Італії. Три революції: ферзь і слон отримали сучасні ходи, з'явились рокіровка і взяття на проході. Лопес де Сеґура — перший підручник (1561).",
   rules:"Ферзь: необмежено по горизонталі, вертикалі, діагоналі. Кінь: Г-подібно, єдиний хто стрибає. Мета: мат. Спец: рокіровка, взяття на проході, перетворення пішака.",
   playable:true,gameType:"chess"},

  {id:"draughts",name:"Шашки",native:"Draughts · Checkers · Дамки",who:"WE",where:"WEST",when:"SPRING",era:"~XII ст. н.е.",origin:"Франція",players:"2",duration:"10–30 хв",emoji:"⬛",tags:["Стратегія","Захоплення","Класична"],
   excerpt:"Вирішені у 2007 р. — при ідеальній грі завжди нічия. Шлях: 5×10²⁰ позицій.",
   facts:["Вирішені у 2007 (команда Шеффера): ідеальна гра = нічия.","18 років обчислень (1989–2007).","Маріон Тінслі програв лише 9 партій за 45 років кар'єри."],
   history:"Шашки (~XI–XII ст.) — гібрид алькерку та шахової дошки. Перша книга — Торквемада (1547). Стали популярними при французькому дворі.",
   rules:"8×8 (темні клітини). Рух діагонально вперед. Захоплення: стрибок (обов'язковий). Дамка: необмежений діагональний хід. Мета: захопити або заблокувати всі фішки.",
   playable:true,gameType:"draughts"},

  {id:"hnefatafl",name:"Hnefatafl",native:"Hnefatafl · Tafl · King's Table",who:"YOU",where:"NORTH",when:"WINTER",era:"~400 н.е.",origin:"Скандинавія",players:"2",duration:"20–60 хв",emoji:"🪓",tags:["Асиметрія","Стратегія","Вікінги"],
   excerpt:"Вікінзька асиметрична битва. Корабель Ґоктад (~900 н.е.) мав повний ігровий набір.",
   facts:["Набір у поховальному кораблі Ґоктад (~900 н.е., Норвегія).","Ісландські саги — 8 згадок.","Витіснений шахами у XII ст.","Варіанти: 7×7 до 13×13."],
   history:"Hnefatafl панував у Скандинавії і Британії з IV по XII ст. Знайдений у кораблях, монастирях, замках. Відроджений у XX ст.",
   rules:"7×7 дошка. Атака: 16 воїнів. Захист: 8 + Король. Рух як тура. Захоплення: сандвіч. Перемога захисту: Король досягає кута.",
   playable:true,gameType:"hnefatafl"},

  {id:"merels",name:"Nine Men's Morris",native:"Мельниця · Mühle · Merelles",who:"WE",where:"WEST",when:"AUTUMN",era:"~1400 до н.е.",origin:"Рим / Єгипет",players:"2",duration:"10–30 хв",emoji:"⭕",tags:["Блокування","Класична","Середньовіччя"],
   excerpt:"«Мельниця» — одна з найпоширеніших ігор Середньовіччя. Знайдена у храмах Єгипту.",
   facts:["Вирізана у храмі Сеті I (~1300 до н.е.).","«Libro de los juegos» Альфонсо X (~1283).","Вирішена у 1993: ідеальна гра = нічия.","Morabaraba — офіційний вид спорту в Лесото та ПАР."],
   history:"Мельниця відома з давніх часів — борозни у єгипетських храмах, Римі, Трої. Розквітла у Середньовічній Европі.",
   rules:"3 фази: (1) розстановка по 9 фішок; (2) рух на 1 клітину; (3) «рій» — 3 фішки летять. Мельниця (3 в ряд) → знімаєте фішку суперника.",
   playable:true,gameType:"morris"},

  {id:"backgammon",name:"Backgammon",native:"Нарди · Tavla · Tric-trac",who:"WE",where:"WEST",when:"SUMMER",era:"~3000 до н.е.",origin:"Перція / Месопотамія",players:"2",duration:"15–45 хв",emoji:"🎲",tags:["Гонка","Кубики","Блокування"],
   excerpt:"Найстаріша гра де кубики використовуються стратегічно. 5000 років — і досі в кожному кафе Туреччини.",
   facts:["Набір у Шахрі-Сохта, Іран (~3000 до н.е.) — старший за Senet.","Doubling cube — винахід США 1920-х. Революціонізував стратегію.","«Backgammon» вперше у 1645 р."],
   history:"Нарди (~3000 до н.е.). Через Рим (Tabula) і арабський Nard — завоювали всю Євразію. TD-Gammon (1992) революціонізував теорію.",
   rules:"24 пункти. Рух за двома кубиками. Блот: одинока фішка — вразлива. Бар → виходити з нього першим. Мета: першим вивести всі фішки.",
   playable:false,preview:"backgammon"},

  {id:"alquerque",name:"Alquerque",native:"Alquerque · El-Quirkat",who:"YOU",where:"WEST",when:"SPRING",era:"~1400 до н.е.",origin:"Єгипет / Арабський Схід",players:"2",duration:"10–20 хв",emoji:"✦",tags:["Захоплення","Предок шашок","Класична"],
   excerpt:"Предок шашок. Описаний Альфонсо X у 1283 р. Знайдений у храмі Курна (~1400 до н.е.).",
   facts:["Вирізаний у храмі Курна (~1400 до н.е.).","Предок шашок через злиття з шаховою дошкою (~XI ст.).","«Libro de los juegos» Альфонсо X — детальний опис."],
   history:"Alquerque (від el-quirkat) — одна з найдавніших захоплювальних ігор. Злиття з шаховою дошкою (~XI ст.) → сучасні шашки.",
   rules:"5×5 ліній (ортогональних і діагональних). 12 фішок кожному. Захоплення: стрибок (обов'язковий). Мета: захопити всі фішки суперника.",
   playable:true,gameType:"alquerque"},

  {id:"fox_geese",name:"Fox and Geese",native:"Fox and Geese · Räv och Gäss",who:"YOU",where:"NORTH",when:"AUTUMN",era:"~XIV ст. н.е.",origin:"Скандинавія / Англія",players:"2",duration:"10–20 хв",emoji:"🦊",tags:["Асиметрія","Полювання","Середньовіччя"],
   excerpt:"Лисиця проти Гусей. Ісландські аннали 1300 р. Едуард IV мав золотий набір.",
   facts:["Перша згадка — ісландські аннали 1300 р.","Едуард IV мав золотий і срібний набір (1470-і).","Математично: гуси виграють при правильній грі."],
   history:"Fox and Geese — середньовічна асиметрична гра (XIV–XVIII ст.). Льюїс Керрол і Беббідж аналізували її математично.",
   rules:"Лисиця: захоплює стрибком. Гуси: вперед і в сторони, не назад. Перемога лисиці: гуси заблоковані. Перемога гусей: лисиця заблокована.",
   playable:true,gameType:"fox_geese"},

  {id:"reversi",name:"Reversi",native:"Reversi · Othello",who:"WE",where:"WEST",when:"SPRING",era:"1880 н.е.",origin:"Англія",players:"2",duration:"10–30 хв",emoji:"⬡",tags:["Перевертання","Сучасна","Класична"],
   excerpt:"«A minute to learn, a lifetime to master». Фішки перевертаються — лідерство змінюється миттєво.",
   facts:["Reversi ~1880-х (два претенденти: Молтон і Уотсон).","«Othello» (1971, Мацусіта) — незначна модифікація.","Logistello (1997) переміг чемпіона 6:0 — першим серед ігрових ШІ."],
   history:"Reversi (1888). Othello (1971). Logistello у 1997 розгромив чемпіона 6:0 — задовго до AlphaGo.",
   rules:"8×8. Старт: 4 фішки хрестом. Хід: поставити так, щоб між вашими ворожих — всі перевертаються. Мета: більше своїх фішок.",
   playable:true,gameType:"reversi"},

  {id:"go_moku",name:"Gomoku",native:"Gomoku · П'ять у ряд · 五目並べ",who:"ME",where:"EAST",when:"SUMMER",era:"~XVII ст.",origin:"Японія",players:"2",duration:"5–20 хв",emoji:"5️⃣",tags:["5 у ряд","Швидка","Класична"],
   excerpt:"П'ять у ряд. Вирішено у 1994: при правильній грі чорні завжди виграють.",
   facts:["Вирішено Альлісом (1994): чорні завжди виграють.","Renju — турнірна версія з обмеженнями для чорних.","Чемпіонат світу з Renju з 1989 р."],
   history:"Gomoku — традиційна японська гра (Едо, XVII–XIX ст.). Renju вирішує проблему першого ходу через обмеження.",
   rules:"15×15 дошка. Мета: п'ять каменів у ряд. У Renju чорним заборонено «подвійна трійка», «подвійна четвірка», «шістка».",
   playable:true,gameType:"gomoku",preview:"gomoku_board"},

  {id:"domino",name:"Доміно",native:"Domino · Dominoes",who:"WE",where:"WEST",when:"SUMMER",era:"~XVIII ст. н.е.",origin:"Китай / Франція",players:"2–4",duration:"20–40 хв",emoji:"🁣",tags:["Класична","Плитки","Підрахунок"],
   excerpt:"Класична гра з плитками від 0 до 6. Китайські доміно відомі з XII ст., європейські — з XVIII ст. Простота правил, глибина стратегії.",
   facts:["Перша письмова згадка в Европі — Франція, 1771 р.","Китайські доміно відомі з XII ст.","Класична гра Блокування — першим хто позбувся плиток перемагає.","Назва від латинського dominus або від монастирського капюшона domino.","У Ямайці та Карибах доміно — національна гра, грають публічно скрізь."],
   history:"Доміно виникло в Китаї (~XII ст.) і прийшло до Европи через торгові шляхи (~XVIII ст.). Класичний подвійний набір 6 (28 плиток) став стандартом.",
   rules:"Набір: 28 плиток (0:0 до 6:6). Хід: поклади плитку що збігається кінцем з відкритим кінцем ланцюга. Не можеш — бери з банку. Перемога: перший хто позбувся всіх плиток.",
   playable:true,gameType:"domino"},
];

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{
  background:${DS.bg0};
  color:${DS.t1};
  font-family:${DS.fSans};
  font-size:16px;
  line-height:1.6;
  min-height:100vh;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:${DS.bg1};}
::-webkit-scrollbar-thumb{background:${DS.goldD};border-radius:4px;}
::-webkit-scrollbar-thumb:hover{background:${DS.gold};}
::selection{background:${DS.goldBg2};color:${DS.gold2};}
:focus-visible{outline:2px solid ${DS.gold};outline-offset:2px;border-radius:3px;}
button{font-family:inherit;cursor:pointer;transition:all .18s;}
input{font-family:inherit;transition:border-color .18s,background .18s;}
a{color:${DS.gold};text-decoration:none;}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95);}to{opacity:1;transform:scale(1);}}
@keyframes dotPulse{0%,80%,100%{transform:scaleY(.3);opacity:.2;}40%{transform:scaleY(1);opacity:1;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
@keyframes shimmer{0%,100%{opacity:.4;}50%{opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes slideDown{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}

/* Smooth board cell hovers */
.gc:hover{filter:brightness(1.12);}
`;


/* ═══════════════════════════════════════════════════════════
   GAME ENGINES
═══════════════════════════════════════════════════════════ */
function usePetteia() {
  const [board, setBoard] = useState(() => {
    const b = Array.from({length:8},()=>Array(8).fill(null));
    for(let c=0;c<8;c++){b[7][c]='w';b[0][c]='b';}
    return b;
  });
  const [sel, setSel] = useState(null);
  const [hints, setHints] = useState([]);
  const [turn, setTurn] = useState('w');
  const [caps, setCaps] = useState({w:0,b:0});
  const [status, setStatus] = useState('Ваш хід. Оберіть білу фішку.');
  const [over, setOver] = useState(null);
  const [diff, setDiff] = useState(2);
  const [thinking, setThinking] = useState(false);
  const [prev, setPrev] = useState([null,null]);

  const getMoves = useCallback((r,c,b) => {
    const ms=[];
    for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){
      let nr=r+dr,nc=c+dc;
      while(nr>=0&&nr<8&&nc>=0&&nc<8){if(b[nr][nc])break;ms.push([nr,nc]);nr+=dr;nc+=dc;}
    }
    return ms;
  },[]);

  const applyMove = useCallback((b,from,to,mover) => {
    const nb=b.map(r=>[...r]);
    const opp=mover==='w'?'b':'w';
    nb[to[0]][to[1]]=mover;nb[from[0]][from[1]]=null;
    const captured=[];
    for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){
      const r1=to[0]+dr,c1=to[1]+dc,r2=to[0]+2*dr,c2=to[1]+2*dc;
      if(r1<0||r1>=8||c1<0||c1>=8||r2<0||r2>=8||c2<0||c2>=8)continue;
      if(nb[r1][c1]===opp&&nb[r2][c2]===mover){nb[r1][c1]=null;captured.push([r1,c1]);}
    }
    return{board:nb,captured};
  },[]);

  const evalBoard = useCallback((b) => {
    let s=0;
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      if(b[r][c]==='b'){s+=100;s+=(3.5-Math.abs(r-3.5))*2;s+=(3.5-Math.abs(c-3.5))*2;
        let n=0;for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]])if(r+dr>=0&&r+dr<8&&c+dc>=0&&c+dc<8&&b[r+dr][c+dc]==='b')n++;
        s+=n*4;if(!n)s-=18;}
      else if(b[r][c]==='w'){s-=100;s-=(3.5-Math.abs(r-3.5))*2;s-=(3.5-Math.abs(c-3.5))*2;
        let n=0;for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]])if(r+dr>=0&&r+dr<8&&c+dc>=0&&c+dc<8&&b[r+dr][c+dc]==='w')n++;
        s-=n*4;if(!n)s+=18;}
    }
    return s;
  },[]);

  const getAllMoves = useCallback((color,b) => {
    const ms=[];
    for(let r=0;r<8;r++)for(let c=0;c<8;c++)
      if(b[r][c]===color)for(const to of getMoves(r,c,b))ms.push({from:[r,c],to});
    return ms;
  },[getMoves]);

  const minimax = useCallback((b,depth,alpha,beta,maxP) => {
    const ms=getAllMoves(maxP?'b':'w',b);
    if(!depth||!ms.length)return evalBoard(b);
    if(maxP){let best=-Infinity;for(const m of ms){const{board:nb}=applyMove(b,m.from,m.to,'b');best=Math.max(best,minimax(nb,depth-1,alpha,beta,false));alpha=Math.max(alpha,best);if(beta<=alpha)break;}return best;}
    else{let best=Infinity;for(const m of ms){const{board:nb}=applyMove(b,m.from,m.to,'w');best=Math.min(best,minimax(nb,depth-1,alpha,beta,true));beta=Math.min(beta,best);if(beta<=alpha)break;}return best;}
  },[getAllMoves,applyMove,evalBoard]);

  const doMove = useCallback((from,to,mover,currentBoard,currentCaps) => {
    const {board:nb,captured}=applyMove(currentBoard,from,to,mover);
    const newCaps={...currentCaps,[mover]:currentCaps[mover]+captured.length};
    setCaps(newCaps);
    setBoard(nb);
    setPrev([from,to]);
    let wc=0,bc=0;
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(nb[r][c]==='w')wc++;if(nb[r][c]==='b')bc++;}
    if(!bc){setOver('w');setStatus('🏆 Ви перемогли! Всіх псів Ксеноса захоплено.');return{nb,newCaps,ended:true};}
    if(!wc){setOver('b');setStatus('💀 Ксенос переміг.');return{nb,newCaps,ended:true};}
    return{nb,newCaps,ended:false};
  },[applyMove]);

  const handleClick = useCallback((r,c) => {
    if(over||turn!=='w')return;
    if(sel){
      if(hints.some(([hr,hc])=>hr===r&&hc===c)){
        setSel(null);setHints([]);
        const{nb,ended}=doMove(sel,[r,c],'w',board,caps);
        if(ended)return;
        setTurn('b');setThinking(true);setStatus('Ксенос міркує...');
        const depth=diff===1?1:diff===2?2:4;
        setTimeout(()=>{
          const ms=[...getAllMoves('b',nb)].sort(()=>Math.random()-.5);
          if(!ms.length){setOver('w');setStatus('🏆 ШІ заблоковано!');setThinking(false);return;}
          let bv=-Infinity,bm=null;
          if(diff===1){
            const capMs=ms.filter(m=>applyMove(nb,m.from,m.to,'b').captured.length);
            bm=capMs.length&&Math.random()>.4?capMs[0]:ms[0];
          } else {
            for(const m of ms){const{board:nnb}=applyMove(nb,m.from,m.to,'b');const v=minimax(nnb,depth-1,-Infinity,Infinity,false);if(v>bv){bv=v;bm=m;}}
          }
          const{ended:e2}=doMove(bm.from,bm.to,'b',nb,caps);
          setThinking(false);setTurn('w');
          if(!e2)setStatus('Ваш хід.');
        },[400,800,1400][diff-1]);
        return;
      }
    }
    if(board[r][c]==='w'){
      setSel([r,c]);const ms=getMoves(r,c,board);setHints(ms);
      setStatus(ms.length?`Фішка на ${String.fromCharCode(65+c)}${8-r}. Оберіть хід.`:'Заблокована. Оберіть іншу.');
    } else {setSel(null);setHints([]);}
  },[over,turn,sel,hints,board,caps,diff,doMove,getAllMoves,applyMove,getMoves,minimax]);

  const reset = useCallback(() => {
    const b=Array.from({length:8},()=>Array(8).fill(null));
    for(let c=0;c<8;c++){b[7][c]='w';b[0][c]='b';}
    setBoard(b);setSel(null);setHints([]);setTurn('w');setCaps({w:0,b:0});
    setStatus('Ваш хід. Оберіть білу фішку.');setOver(null);setThinking(false);setPrev([null,null]);
  },[]);

  return{board,sel,hints,turn,caps,status,over,diff,setDiff,thinking,prev,handleClick,reset};
}

// ─── MANCALA ───
function useMancala() {
  const initState = () => ({
    pits:[[4,4,4,4,4,4],[4,4,4,4,4,4]],
    stores:[0,0], turn:0, over:null,
    status:'Хід гравця 1. Оберіть ямку (нижній ряд).',
    lastPit:null, extra:false
  });
  const [gs, setGs] = useState(initState);

  const pick = useCallback((player,pit) => {
    setGs(prev => {
      if(prev.over||prev.turn!==player)return prev;
      if(prev.pits[player][pit]===0)return prev;
      const pits=prev.pits.map(r=>[...r]);
      const stores=[...prev.stores];
      let seeds=pits[player][pit];
      pits[player][pit]=0;
      let p=player,i=pit,extraTurn=false,lastP=-1,lastI=-1;
      while(seeds>0){
        // advance
        if(p===0){
          if(i<5){i++;}
          else{stores[0]++;seeds--;lastP=-1;lastI=-1;if(!seeds){extraTurn=true;break;}p=1;i=0;continue;}
        } else {
          if(i<5){i++;}
          else{
            if(player===1){stores[1]++;seeds--;lastP=-1;lastI=-1;if(!seeds){extraTurn=true;break;}p=0;i=0;continue;}
            else{p=0;i=0;continue;}
          }
        }
        lastP=p;lastI=i;
        // capture
        if(seeds===1&&p===player&&pits[p][i]===0){
          const oi=5-i;
          if(pits[1-p][oi]>0){stores[player]+=pits[1-p][oi]+1;pits[1-p][oi]=0;pits[p][i]=0;seeds--;break;}
        }
        pits[p][i]++;seeds--;
      }
      const p0e=pits[0].every(x=>x===0),p1e=pits[1].every(x=>x===0);
      if(p0e||p1e){
        stores[0]+=pits[0].reduce((a,b)=>a+b,0);stores[1]+=pits[1].reduce((a,b)=>a+b,0);
        pits[0]=Array(6).fill(0);pits[1]=Array(6).fill(0);
        const w=stores[0]>stores[1]?0:stores[1]>stores[0]?1:'draw';
        return{...prev,pits,stores,over:w,status:`Гра завершена! ${w==='draw'?'Нічия':w===0?'Гравець 1 переміг':'ШІ переміг'}. P1:${stores[0]} vs P2:${stores[1]}`};
      }
      const nextTurn=extraTurn?player:1-player;
      return{...prev,pits,stores,turn:nextTurn,extra:extraTurn,
        status:extraTurn?`Ще один хід Гравця ${player+1}!`:`Хід Гравця ${nextTurn+1}.`};
    });
  },[]);

  useEffect(()=>{
    if(gs.turn===1&&!gs.over){
      const t=setTimeout(()=>{
        const pits=gs.pits[1];
        let best=-1,bestV=-1;
        pits.forEach((v,i)=>{if(v>0){const sc=v+(5-i===v?10:0);if(sc>bestV){bestV=sc;best=i;}}});
        if(best>=0)pick(1,best);
      },700);
      return()=>clearTimeout(t);
    }
  },[gs,pick]);

  const reset=useCallback(()=>setGs(initState()),[]);
  return{...gs,pick,reset};
}

// ─── HNEFATAFL ───
function useHnefatafl() {
  const HN=7;
  const THRONE=[3,3];
  const CORNERS=[[0,0],[0,6],[6,0],[6,6]];

  const initBoard=()=>{
    const b=Array.from({length:HN},()=>Array(HN).fill(null));
    [[0,2],[0,3],[0,4],[1,3],[2,0],[3,0],[4,0],[2,6],[3,6],[4,6],[6,2],[6,3],[6,4],[5,3]].forEach(([r,c])=>b[r][c]='atk');
    [[2,3],[3,2],[3,4],[4,3]].forEach(([r,c])=>b[r][c]='def');
    b[3][3]='king';
    return b;
  };

  const [board,setBoard]=useState(initBoard);
  const [sel,setSel]=useState(null);
  const [hints,setHints]=useState([]);
  const [turn,setTurn]=useState('def');
  const [caps,setCaps]=useState({atk:0,def:0});
  const [status,setStatus]=useState('Ваш хід (захист). Оберіть фігуру або Короля.');
  const [over,setOver]=useState(null);
  const [thinking,setThinking]=useState(false);

  const getMoves=useCallback((r,c,b)=>{
    const ms=[];const piece=b[r][c];
    for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){
      let nr=r+dr,nc=c+dc;
      while(nr>=0&&nr<HN&&nc>=0&&nc<HN){
        if(b[nr][nc])break;
        if((nr===THRONE[0]&&nc===THRONE[1]||CORNERS.some(([cr,cc])=>cr===nr&&cc===nc))&&piece!=='king')break;
        ms.push([nr,nc]);nr+=dr;nc+=dc;
      }
    }
    return ms;
  },[]);

  const applyHn=useCallback((b,from,to)=>{
    const nb=b.map(r=>[...r]);
    const piece=nb[from[0]][from[1]];
    nb[to[0]][to[1]]=piece;nb[from[0]][from[1]]=null;
    const caps=[];
    for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){
      const r1=to[0]+dr,c1=to[1]+dc,r2=to[0]+2*dr,c2=to[1]+2*dc;
      if(r1<0||r1>=HN||c1<0||c1>=HN)continue;
      const t=nb[r1][c1];
      if(!t||t==='king')continue;
      const isEnemy=(piece==='atk'&&(t==='def'))|| ((piece==='def'||piece==='king')&&t==='atk');
      if(!isEnemy)continue;
      const far=r2>=0&&r2<HN&&c2>=0&&c2<HN?nb[r2][c2]:null;
      const isAlly=(piece==='atk'&&far==='atk')||((piece==='def'||piece==='king')&&(far==='def'||far==='king'));
      const throneEmpty=r2===THRONE[0]&&c2===THRONE[1]&&!nb[r2][c2];
      const corner=r2>=0&&r2<HN&&c2>=0&&c2<HN&&CORNERS.some(([cr,cc])=>cr===r2&&cc===c2);
      if(isAlly||throneEmpty||corner){nb[r1][c1]=null;caps.push([r1,c1]);}
    }
    return{board:nb,caps};
  },[]);

  const handleClick=useCallback((r,c)=>{
    if(over||turn!=='def')return;
    const p=board[r][c];
    if(sel){
      if(hints.some(([hr,hc])=>hr===r&&hc===c)){
        setSel(null);setHints([]);
        const{board:nb,caps:cc}=applyHn(board,sel,[r,c]);
        setBoard(nb);setCaps(prev=>({...prev,def:prev.def+cc.length}));
        // check king escape
        if(CORNERS.some(([cr,ccl])=>nb[cr][ccl]==='king')){setOver('def');setStatus('🏆 Король втік! Захист переміг!');return;}
        let kingAlive=false;for(let rr=0;rr<HN;rr++)for(let cc2=0;cc2<HN;cc2++)if(nb[rr][cc2]==='king')kingAlive=true;
        if(!kingAlive){setOver('atk');setStatus('💀 Король захоплений. Атака перемогла!');return;}
        setTurn('atk');setThinking(true);setStatus('Атака планує хід...');
        setTimeout(()=>{
          const allMs=[];for(let rr=0;rr<HN;rr++)for(let cc2=0;cc2<HN;cc2++)if(nb[rr][cc2]==='atk')for(const to of getMoves(rr,cc2,nb))allMs.push({from:[rr,cc2],to});
          const shuffled=[...allMs].sort(()=>Math.random()-.5);
          let best=null,bestV=-1;
          let kr=-1,kc2=-1;for(let rr=0;rr<HN;rr++)for(let cc3=0;cc3<HN;cc3++)if(nb[rr][cc3]==='king'){kr=rr;kc2=cc3;}
          for(const m of shuffled){
            const{caps:mc}=applyHn(nb,m.from,m.to);
            let v=mc.length*10;
            if(kr>=0)v+=Math.max(0,6-(Math.abs(m.to[0]-kr)+Math.abs(m.to[1]-kc2)));
            if(v>bestV){bestV=v;best=m;}
          }
          if(best){const{board:nb2,caps:ac}=applyHn(nb,best.from,best.to);setBoard(nb2);setCaps(p=>({...p,atk:p.atk+ac.length}));
            if(CORNERS.some(([cr,ccl])=>nb2[cr][ccl]==='king')){setOver('def');setStatus('🏆 Захист переміг!');setThinking(false);return;}
            let ka=false;for(let rr=0;rr<HN;rr++)for(let cc4=0;cc4<HN;cc4++)if(nb2[rr][cc4]==='king')ka=true;
            if(!ka){setOver('atk');setStatus('💀 Атака перемогла!');setThinking(false);return;}
          }
          setThinking(false);setTurn('def');setStatus('Ваш хід.');
        },800);
        return;
      }
    }
    if(p==='def'||p==='king'){setSel([r,c]);const ms=getMoves(r,c,board);setHints(ms);setStatus(`Обрано ${p==='king'?'Короля':'захисника'}. ${ms.length} ходів.`);}
    else{setSel(null);setHints([]);}
  },[over,turn,sel,hints,board,applyHn,getMoves]);

  const reset=useCallback(()=>{setBoard(initBoard());setSel(null);setHints([]);setTurn('def');setCaps({atk:0,def:0});setStatus('Ваш хід (захист).');setOver(null);setThinking(false);},[]);
  return{board,sel,hints,turn,caps,status,over,thinking,handleClick,reset,HN,THRONE,CORNERS};
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════ */

// ── Spinner / Splash ──


function useDraughts(mode='pvc') {
  const init = () => {
    const b = Array.from({length:8}, ()=>Array(8).fill(null));
    for(let r=0;r<3;r++) for(let c=0;c<8;c++) if((r+c)%2===1) b[r][c]={color:'b',king:false};
    for(let r=5;r<8;r++) for(let c=0;c<8;c++) if((r+c)%2===1) b[r][c]={color:'w',king:false};
    return b;
  };
  const [board,setBoard]=useState(init);
  const [sel,setSel]=useState(null);
  const [moves,setMoves]=useState([]);
  const [turn,setTurn]=useState('w');
  const [caps,setCaps]=useState({w:0,b:0});
  const [over,setOver]=useState(null);
  const [status,setStatus]=useState('Ваш хід. Оберіть білу шашку.');
  const [thinking,setThinking]=useState(false);
  const [pvp]=useState(mode==='pvp');

  // get jumps or simple moves for a piece
  const getPieceMoves=useCallback((b,r,c,mustJump)=>{
    const p=b[r][c]; if(!p) return [];
    const dirs=p.king?[[-1,-1],[-1,1],[1,-1],[1,1]]:p.color==='w'?[[-1,-1],[-1,1]]:[[1,-1],[1,1]];
    const jumps=[], simples=[];
    dirs.forEach(([dr,dc])=>{
      const mr=r+dr,mc=c+dc,lr=r+2*dr,lc=c+2*dc;
      if(lr>=0&&lr<8&&lc>=0&&lc<8&&b[mr]?.[mc]?.color&&b[mr][mc].color!==p.color&&!b[lr][lc])
        jumps.push({from:[r,c],to:[lr,lc],cap:[mr,mc]});
      else if(!mustJump&&mr>=0&&mr<8&&mc>=0&&mc<8&&!b[mr][mc])
        simples.push({from:[r,c],to:[mr,mc],cap:null});
    });
    return jumps.length?jumps:mustJump?[]:simples;
  },[]);

  const getAllMoves=useCallback((b,color)=>{
    const all=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(b[r][c]?.color===color){
      const jumps=[];
      const dirs=b[r][c].king?[[-1,-1],[-1,1],[1,-1],[1,1]]:color==='w'?[[-1,-1],[-1,1]]:[[1,-1],[1,1]];
      dirs.forEach(([dr,dc])=>{
        const mr=r+dr,mc=c+dc,lr=r+2*dr,lc=c+2*dc;
        if(lr>=0&&lr<8&&lc>=0&&lc<8&&b[mr]?.[mc]?.color&&b[mr][mc].color!==color&&!b[lr][lc])
          jumps.push({from:[r,c],to:[lr,lc],cap:[mr,mc]});
      });
      if(jumps.length){all.push(...jumps);continue;}
      const dirs2=b[r][c].king?[[-1,-1],[-1,1],[1,-1],[1,1]]:color==='w'?[[-1,-1],[-1,1]]:[[1,-1],[1,1]];
      dirs2.forEach(([dr,dc])=>{
        const mr=r+dr,mc=c+dc;
        if(mr>=0&&mr<8&&mc>=0&&mc<8&&!b[mr][mc]) all.push({from:[r,c],to:[mr,mc],cap:null});
      });
    }
    // mandatory jump
    const hasJump=all.some(m=>m.cap);
    return hasJump?all.filter(m=>m.cap):all;
  },[]);

  const applyMove=useCallback((b,m)=>{
    const nb=b.map(r=>r.map(c=>c?{...c}:null));
    const p={...nb[m.from[0]][m.from[1]]};
    nb[m.to[0]][m.to[1]]=p;
    nb[m.from[0]][m.from[1]]=null;
    if(m.cap) nb[m.cap[0]][m.cap[1]]=null;
    if((p.color==='w'&&m.to[0]===0)||(p.color==='b'&&m.to[0]===7)) nb[m.to[0]][m.to[1]].king=true;
    return nb;
  },[]);

  const evalDr=useCallback((b)=>{
    let s=0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const p=b[r][c]; if(!p) continue;
      const v=p.king?3:1;
      if(p.color==='b') s+=v+(p.king?0:(r*0.1));
      else s-=v+(p.king?0:((7-r)*0.1));
    }
    return s;
  },[]);

  const minimaxDr=useCallback((b,depth,alpha,beta,maxP)=>{
    const ms=getAllMoves(b,maxP?'b':'w');
    if(!depth||!ms.length) return evalDr(b);
    if(maxP){
      let best=-Infinity;
      for(const m of ms){const nb=applyMove(b,m);const v=minimaxDr(nb,depth-1,alpha,beta,false);best=Math.max(best,v);alpha=Math.max(alpha,v);if(beta<=alpha)break;}
      return best;
    } else {
      let best=Infinity;
      for(const m of ms){const nb=applyMove(b,m);const v=minimaxDr(nb,depth-1,alpha,beta,true);best=Math.min(best,v);beta=Math.min(beta,v);if(beta<=alpha)break;}
      return best;
    }
  },[getAllMoves,applyMove,evalDr]);

  const doMove=useCallback((m,b,currentTurn,currentCaps)=>{
    const nb=applyMove(b,m);
    const newCaps={...currentCaps};
    if(m.cap) newCaps[currentTurn]++;
    setBoard(nb); setCaps(newCaps); setSel(null); setMoves([]);
    let wc=0,bc=0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){if(nb[r][c]?.color==='w')wc++;if(nb[r][c]?.color==='b')bc++;}
    if(!wc){setOver('b');setStatus('⚫ Чорні перемогли!');return {nb,ended:true};}
    if(!bc){setOver('w');setStatus('⚪ Білі перемогли!');return {nb,ended:true};}
    const next=currentTurn==='w'?'b':'w';
    if(!getAllMoves(nb,next).length){setOver(currentTurn);setStatus(`${currentTurn==='w'?'⚪ Білі':'⚫ Чорні'} перемогли (суперник заблокований)!`);return {nb,ended:true};}
    setTurn(next);
    return {nb,ended:false,next};
  },[applyMove,getAllMoves]);

  const handleClick=useCallback((r,c)=>{
    if(over||thinking) return;
    if(!pvp&&turn==='b') return;
    const p=board[r][c];
    if(sel){
      const mv=moves.find(m=>m.to[0]===r&&m.to[1]===c);
      if(mv){
        const {nb,ended,next}=doMove(mv,board,turn,caps);
        if(ended) return;
        if(!pvp&&next==='b'){
          setThinking(true); setStatus('ШІ думає...');
          setTimeout(()=>{
            const ms=[...getAllMoves(nb,'b')].sort(()=>Math.random()-.5);
            let best=null,bv=-Infinity;
            for(const m of ms){const nnb=applyMove(nb,m);const v=minimaxDr(nnb,3,-Infinity,Infinity,false);if(v>bv){bv=v;best=m;}}
            if(best){const {ended:e2}=doMove(best,nb,'b',{...caps,b:caps.b+(best.cap?1:0)});if(!e2)setStatus('Ваш хід.');}
            setThinking(false);
          },600);
        } else setStatus(`Хід ${next==='w'?'білих':'чорних'}.`);
        return;
      }
    }
    if(p?.color===turn){
      const allMs=getAllMoves(board,turn);
      const hasJump=allMs.some(m=>m.cap);
      const pMoves=allMs.filter(m=>m.from[0]===r&&m.from[1]===c&&(!hasJump||m.cap));
      setSel([r,c]); setMoves(pMoves);
      setStatus(pMoves.length?`Шашка на ${String.fromCharCode(65+c)}${8-r}. Оберіть хід.`:'Ця шашка не може ходити.');
    } else { setSel(null); setMoves([]); }
  },[over,thinking,pvp,turn,board,sel,moves,caps,doMove,getAllMoves,applyMove,minimaxDr]);

  const reset=useCallback(()=>{setBoard(init());setSel(null);setMoves([]);setTurn('w');setCaps({w:0,b:0});setOver(null);setStatus('Ваш хід. Оберіть білу шашку.');setThinking(false);},[]);
  return {board,sel,moves,turn,caps,over,status,thinking,pvp,handleClick,reset};
}

// ════════════════════════════════════════════════════════════════
// REVERSI / OTHELLO  — PvC + PvP
// ════════════════════════════════════════════════════════════════
function useReversi(mode='pvc') {
  const DIRS=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const init=()=>{
    const b=Array.from({length:8},()=>Array(8).fill(null));
    b[3][3]='w';b[3][4]='b';b[4][3]='b';b[4][4]='w';
    return b;
  };
  const [board,setBoard]=useState(init);
  const [turn,setTurn]=useState('b');
  const [caps,setCaps]=useState({b:2,w:2});
  const [valid,setValid]=useState([]);
  const [over,setOver]=useState(null);
  const [status,setStatus]=useState('Хід чорних. Оберіть клітину.');
  const [thinking,setThinking]=useState(false);
  const pvp=mode==='pvp';

  const getFlips=useCallback((b,r,c,color)=>{
    const opp=color==='b'?'w':'b'; const all=[];
    for(const [dr,dc] of DIRS){
      const line=[]; let nr=r+dr,nc=c+dc;
      while(nr>=0&&nr<8&&nc>=0&&nc<8&&b[nr][nc]===opp){line.push([nr,nc]);nr+=dr;nc+=dc;}
      if(line.length&&nr>=0&&nr<8&&nc>=0&&nc<8&&b[nr][nc]===color) all.push(...line);
    }
    return all;
  },[]);

  const getValid=useCallback((b,color)=>{
    const vs=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++)
      if(!b[r][c]&&getFlips(b,r,c,color).length) vs.push([r,c]);
    return vs;
  },[getFlips]);

  useEffect(()=>{setValid(getValid(board,turn));},[board,turn,getValid]);

  const place=useCallback((r,c,color,b)=>{
    const flips=getFlips(b,r,c,color); if(!flips.length) return null;
    const nb=b.map(row=>[...row]);
    nb[r][c]=color; flips.forEach(([fr,fc])=>nb[fr][fc]=color);
    let bc=0,wc=0;
    for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){if(nb[rr][cc]==='b')bc++;if(nb[rr][cc]==='w')wc++;}
    return {nb,bc,wc};
  },[getFlips]);

  const evalRv=useCallback((b)=>{
    const corners=[[0,0],[0,7],[7,0],[7,7]];
    let s=0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      if(!b[r][c]) continue;
      const v=corners.some(([cr,cc])=>cr===r&&cc===c)?25:1;
      if(b[r][c]==='b') s+=v; else s-=v;
    }
    s+=getValid(b,'b').length*2-getValid(b,'w').length*2;
    return s;
  },[getValid]);

  const mmRv=useCallback((b,depth,alpha,beta,maxP)=>{
    const color=maxP?'b':'w';
    const vs=getValid(b,color);
    if(!depth||(!vs.length&&!getValid(b,maxP?'w':'b').length)) return evalRv(b);
    if(!vs.length) return mmRv(b,depth-1,alpha,beta,!maxP);
    if(maxP){
      let best=-Infinity;
      for(const [r,c] of vs){const res=place(r,c,'b',b);if(!res)continue;const v=mmRv(res.nb,depth-1,alpha,beta,false);best=Math.max(best,v);alpha=Math.max(alpha,v);if(beta<=alpha)break;}
      return best;
    } else {
      let best=Infinity;
      for(const [r,c] of vs){const res=place(r,c,'w',b);if(!res)continue;const v=mmRv(res.nb,depth-1,alpha,beta,true);best=Math.min(best,v);beta=Math.min(beta,v);if(beta<=alpha)break;}
      return best;
    }
  },[getValid,place,evalRv]);

  const doTurn=useCallback((r,c,color,b)=>{
    const res=place(r,c,color,b); if(!res) return;
    const {nb,bc,wc}=res;
    setBoard(nb); setCaps({b:bc,w:wc});
    const next=color==='b'?'w':'b';
    const nextV=getValid(nb,next);
    if(!nextV.length){
      const curV=getValid(nb,color);
      if(!curV.length){
        setOver(bc>wc?'b':wc>bc?'w':'draw');
        setStatus(`Гра завершена! ⚫${bc}:${wc}⚪`);
        return;
      }
      setTurn(color); setStatus(`${next==='b'?'Чорні':'Білі'} пропускають. Хід ${color==='b'?'чорних':'білих'}.`);
      return;
    }
    setTurn(next);
    return {nb,next};
  },[place,getValid]);

  const handleClick=useCallback((r,c)=>{
    if(over||thinking) return;
    if(!pvp&&turn==='w') return;
    if(!valid.some(([vr,vc])=>vr===r&&vc===c)){setStatus('Недопустимий хід.');return;}
    const res=doTurn(r,c,turn,board);
    if(!res) return;
    const {nb,next}=res;
    if(!pvp&&next==='w'){
      setThinking(true); setStatus('ШІ думає...');
      setTimeout(()=>{
        const vs=getValid(nb,'w');
        if(!vs.length){setThinking(false);return;}
        const corners=vs.filter(([r,c])=>[[0,0],[0,7],[7,0],[7,7]].some(([cr,cc])=>cr===r&&cc===c));
        let best=null,bv=Infinity;
        if(corners.length){best=corners[0];}
        else{
          const samp=[...vs].sort(()=>Math.random()-.5).slice(0,Math.min(8,vs.length));
          for(const [r,c] of samp){const res2=place(r,c,'w',nb);if(!res2)continue;const v=mmRv(res2.nb,3,-Infinity,Infinity,true);if(v<bv){bv=v;best=[r,c];}}
        }
        if(best) doTurn(best[0],best[1],'w',nb);
        setThinking(false); setStatus('Ваш хід.');
      },700);
    } else setStatus(`Хід ${next==='b'?'чорних':'білих'}.`);
  },[over,thinking,pvp,turn,valid,board,doTurn,getValid,place,mmRv]);

  const reset=useCallback(()=>{const b=init();setBoard(b);setTurn('b');setCaps({b:2,w:2});setValid(getValid(b,'b'));setOver(null);setStatus('Хід чорних.');setThinking(false);},[getValid]);
  return {board,turn,caps,valid,over,status,thinking,pvp,handleClick,reset};
}

// ════════════════════════════════════════════════════════════════
// GOMOKU (5 у ряд)  — PvC + PvP
// ════════════════════════════════════════════════════════════════
function useGomoku(mode='pvc') {
  const N=15;
  const [board,setBoard]=useState(()=>Array.from({length:N},()=>Array(N).fill(null)));
  const [turn,setTurn]=useState('b');
  const [over,setOver]=useState(null);
  const [status,setStatus]=useState('Хід чорних. Натисніть на перетин.');
  const [thinking,setThinking]=useState(false);
  const [lastMove,setLastMove]=useState(null);
  const pvp=mode==='pvp';

  const checkWin=useCallback((b,r,c,color)=>{
    const dirs=[[0,1],[1,0],[1,1],[1,-1]];
    for(const [dr,dc] of dirs){
      let cnt=1;
      for(let d=1;d<5;d++){const nr=r+dr*d,nc=c+dc*d;if(nr>=0&&nr<N&&nc>=0&&nc<N&&b[nr][nc]===color)cnt++;else break;}
      for(let d=1;d<5;d++){const nr=r-dr*d,nc=c-dc*d;if(nr>=0&&nr<N&&nc>=0&&nc<N&&b[nr][nc]===color)cnt++;else break;}
      if(cnt>=5) return true;
    }
    return false;
  },[]);

  const evalGm=useCallback((b,color)=>{
    const opp=color==='b'?'w':'b';
    const score=(c,len,open)=>{
      if(c===color){if(len>=5)return 1e7;if(len===4)return open?1e5:1e4;if(len===3)return open?1e3:100;if(len===2)return open?10:2;}
      else{if(len>=5)return -1e7;if(len===4)return open?-5e4:-1e4;if(len===3)return open?-500:-50;}
      return 0;
    };
    let s=0;
    const dirs=[[0,1],[1,0],[1,1],[1,-1]];
    for(let r=0;r<N;r++) for(let c=0;c<N;c++) for(const [dr,dc] of dirs){
      const cell=b[r][c];if(!cell)continue;
      let len=1;
      for(let d=1;d<5;d++){const nr=r+dr*d,nc=c+dc*d;if(nr>=0&&nr<N&&nc>=0&&nc<N&&b[nr][nc]===cell)len++;else break;}
      const before=r-dr,bc2=c-dc;const bOpen=before>=0&&before<N&&bc2>=0&&bc2<N&&!b[before][bc2];
      const after=r+dr*len,ac=c+dc*len;const aOpen=after>=0&&after<N&&ac>=0&&ac<N&&!b[after][ac];
      s+=score(cell,len,bOpen&&aOpen);
    }
    return s;
  },[]);

  const getBestGmMove=useCallback((b,color)=>{
    // Collect candidate cells (near existing stones)
    const cands=new Set();
    for(let r=0;r<N;r++) for(let c=0;c<N;c++) if(b[r][c])
      for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++){
        const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<N&&nc>=0&&nc<N&&!b[nr][nc]) cands.add(`${nr},${nc}`);
      }
    if(!cands.size){const mid=Math.floor(N/2);return [mid,mid];}
    const opp=color==='b'?'w':'b';
    let best=null,bv=-Infinity;
    for(const key of cands){
      const [r,c]=key.split(',').map(Number);
      const nb=b.map(row=>[...row]); nb[r][c]=color;
      if(checkWin(nb,r,c,color)) return [r,c];// immediate win
      const nb2=b.map(row=>[...row]); nb2[r][c]=opp;
      if(checkWin(nb2,r,c,opp)){best=[r,c];bv=1e8;continue;}// block
      const v=evalGm(nb,color)+(Math.random()-.5)*5;
      if(v>bv){bv=v;best=[r,c];}
    }
    return best;
  },[checkWin,evalGm]);

  const handleClick=useCallback((r,c)=>{
    if(over||thinking||board[r][c]) return;
    if(!pvp&&turn==='w') return;
    const nb=board.map(row=>[...row]); nb[r][c]=turn;
    setBoard(nb); setLastMove([r,c]);
    if(checkWin(nb,r,c,turn)){setOver(turn);setStatus(`${turn==='b'?'⚫ Чорні':'⚪ Білі'} перемогли!`);return;}
    let empty=false; for(let rr=0;rr<N&&!empty;rr++) for(let cc=0;cc<N&&!empty;cc++) if(!nb[rr][cc])empty=true;
    if(!empty){setOver('draw');setStatus('Нічия!');return;}
    const next=turn==='b'?'w':'b'; setTurn(next);
    if(!pvp&&next==='w'){
      setThinking(true); setStatus('ШІ думає...');
      setTimeout(()=>{
        const [ar,ac]=getBestGmMove(nb,'w');
        const nb2=nb.map(row=>[...row]); nb2[ar][ac]='w';
        setBoard(nb2); setLastMove([ar,ac]);
        if(checkWin(nb2,ar,ac,'w')){setOver('w');setStatus('⚪ Білі (ШІ) перемогли!');setThinking(false);return;}
        setTurn('b'); setThinking(false); setStatus('Хід чорних.');
      },400);
    } else setStatus(`Хід ${next==='b'?'чорних':'білих'}.`);
  },[over,thinking,pvp,turn,board,checkWin,getBestGmMove]);

  const reset=useCallback(()=>{setBoard(Array.from({length:N},()=>Array(N).fill(null)));setTurn('b');setOver(null);setStatus('Хід чорних.');setThinking(false);setLastMove(null);},[]);
  return {board,turn,over,status,thinking,lastMove,pvp,handleClick,reset,N};
}

// ════════════════════════════════════════════════════════════════
// NINE MEN'S MORRIS (Мельниця)  — PvC + PvP
// ════════════════════════════════════════════════════════════════
const MORRIS_POSITIONS=[
  [0,0],[3,0],[6,0],[1,1],[3,1],[5,1],[2,2],[3,2],[4,2],
  [0,3],[1,3],[2,3],[4,3],[5,3],[6,3],
  [2,4],[3,4],[4,4],[1,5],[3,5],[5,5],[0,6],[3,6],[6,6]
];
const MORRIS_ADJ={
  0:[1,9],1:[0,2,4],2:[1,14],3:[4,10],4:[1,3,5,7],5:[4,13],
  6:[7,11],7:[4,6,8],8:[7,12],9:[0,10,21],10:[3,9,11,18],11:[6,10,15],
  12:[8,13,17],13:[5,12,14,20],14:[2,13,23],15:[11,16],16:[15,17,19],
  17:[12,16],18:[10,19],19:[16,18,20,22],20:[13,19],21:[9,22],22:[19,21,23],23:[14,22]
};
const MORRIS_MILLS=[
  [0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],
  [0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],[5,13,20],[2,14,23]
];

function useMorris(mode='pvc') {
  const [board,setBoard]=useState(Array(24).fill(null));
  const [phase,setPhase]=useState('place');// place|move|fly
  const [turn,setTurn]=useState('w');
  const [sel,setSel]=useState(null);
  const [placed,setPlaced]=useState({w:0,b:0});
  const [caps,setCaps]=useState({w:0,b:0});
  const [removing,setRemoving]=useState(false);
  const [over,setOver]=useState(null);
  const [status,setStatus]=useState('Фаза 1: розстановка. Ставте фішку на вільну позицію.');
  const [thinking,setThinking]=useState(false);
  const pvp=mode==='pvp';

  const checkMill=useCallback((b,pos,color)=>MORRIS_MILLS.some(m=>m.includes(pos)&&m.every(p=>b[p]===color)),[]);

  const countPieces=useCallback((b,color)=>b.filter(c=>c===color).length,[]);

  const getPhase=useCallback((b,color,placedCount)=>{
    if(placedCount<9) return 'place';
    const cnt=countPieces(b,color);
    return cnt<=3?'fly':'move';
  },[countPieces]);

  const doAI=useCallback((b,pl,cp,ph)=>{
    const color='b', opp='w';
    // Phase: place
    if(ph==='place'){
      const empty=b.map((c,i)=>c===null?i:-1).filter(i=>i>=0);
      // try to form mill or block
      for(const pos of empty){
        const nb=[...b];nb[pos]=color;
        if(checkMill(nb,pos,color)) return {type:'place',pos};
      }
      for(const pos of empty){
        const nb=[...b];nb[pos]=opp;
        if(checkMill(nb,pos,opp)){const nb2=[...b];nb2[pos]=color;return {type:'place',pos};}
      }
      const shuffled=empty.sort(()=>Math.random()-.5);
      return {type:'place',pos:shuffled[0]};
    }
    // Phase: move or fly
    const myPieces=b.map((c,i)=>c===color?i:-1).filter(i=>i>=0);
    const moves=[];
    for(const from of myPieces){
      const tos=ph==='fly'?b.map((c,i)=>c===null?i:-1).filter(i=>i>=0):MORRIS_ADJ[from].filter(i=>b[i]===null);
      for(const to of tos) moves.push({from,to});
    }
    if(!moves.length) return null;
    // Try win move first
    for(const m of moves){
      const nb=[...b];nb[m.to]=color;nb[m.from]=null;
      if(checkMill(nb,m.to,color)) return {type:'move',...m};
    }
    return {type:'move',...moves[Math.floor(Math.random()*moves.length)]};
  },[checkMill]);

  const handleClick=useCallback((pos)=>{
    if(over||thinking) return;
    const opp=turn==='w'?'b':'w';

    // Removing phase
    if(removing){
      if(!pvp&&turn==='b') return;
      if(board[pos]!==opp) return;
      const inMill=checkMill(board,pos,opp);
      const nonMillExists=board.some((c,i)=>c===opp&&!checkMill(board,i,opp));
      if(inMill&&nonMillExists) return;// can't remove from mill if others exist
      const nb=[...board]; nb[pos]=null;
      setBoard(nb); setRemoving(false);
      const newCaps={...caps,[turn]:caps[turn]+1};
      setCaps(newCaps);
      // check win
      const oppLeft=countPieces(nb,opp);
      const oppMoves=getPhase(nb,opp,placed[opp])!=='place'&&oppLeft>3?MORRIS_ADJ[nb.map((c,i)=>c===opp?i:-1).filter(i=>i>=0)[0]]?.filter(i=>nb[i]===null).length===0:false;
      if(oppLeft<=2&&placed[opp]>=9){setOver(turn);setStatus(`${turn==='w'?'⚪ Білі':'⚫ Чорні'} перемогли!`);return;}
      const next=opp;
      setTurn(next);
      const nextPh=getPhase(nb,next,placed[next]);
      setPhase(nextPh);
      setStatus(`Хід ${next==='w'?'білих':'чорних'}. ${nextPh==='place'?'Ставте фішку.':nextPh==='fly'?'Літаєте!':'Пересувайте фішку.'}`);
      if(!pvp&&next==='b') triggerAI(nb,placed,newCaps,nextPh);
      return;
    }

    // Placement phase
    if(phase==='place'){
      if(!pvp&&turn==='b') return;
      if(board[pos]!==null) return;
      const nb=[...board]; nb[pos]=turn;
      const newPlaced={...placed,[turn]:placed[turn]+1};
      setPlaced(newPlaced); setBoard(nb);
      if(checkMill(nb,pos,turn)){
        setRemoving(true);
        setStatus(`Мельниця! Оберіть фішку ${opp==='w'?'білих':'чорних'} для зняття.`);
        return;
      }
      const next=opp;
      const nextPh=getPhase(nb,next,newPlaced[next]);
      setTurn(next); setPhase(nextPh);
      setStatus(`Хід ${next==='w'?'білих':'чорних'}. ${newPlaced[next]<9?'Ставте фішку.':nextPh==='fly'?'Літаєте!':'Пересувайте.'}`);
      if(!pvp&&next==='b') triggerAI(nb,newPlaced,caps,nextPh);
      return;
    }

    // Move/fly phase
    if(!pvp&&turn==='b') return;
    if(sel===null){
      if(board[pos]!==turn) return;
      setSel(pos);
      setStatus('Оберіть позицію для переміщення.');
    } else {
      if(pos===sel){setSel(null);setStatus('Скасовано. Оберіть знову.');return;}
      if(board[pos]!==null){if(board[pos]===turn){setSel(pos);}return;}
      const canMove=phase==='fly'||MORRIS_ADJ[sel].includes(pos);
      if(!canMove){setStatus('Не можна рухатись туди.');return;}
      const nb=[...board];nb[pos]=turn;nb[sel]=null;
      setSel(null); setBoard(nb);
      if(checkMill(nb,pos,turn)){
        setRemoving(true);
        setStatus(`Мельниця! Зніміть фішку ${opp==='w'?'білих':'чорних'}.`);
        return;
      }
      const next=opp;
      const nextPh=getPhase(nb,next,placed[next]);
      setTurn(next); setPhase(nextPh);
      setStatus(`Хід ${next==='w'?'білих':'чорних'}.`);
      if(!pvp&&next==='b') triggerAI(nb,placed,caps,nextPh);
    }
  },[over,thinking,pvp,turn,removing,board,phase,sel,placed,caps,checkMill,countPieces,getPhase]);

  const triggerAI=useCallback((b,pl,cp,ph)=>{
    setThinking(true);
    setTimeout(()=>{
      const m=doAI(b,pl,cp,ph);
      if(!m){setThinking(false);return;}
      const opp='w';
      if(m.type==='place'){
        const nb=[...b];nb[m.pos]='b';
        const newPl={...pl,b:pl.b+1};
        setPlaced(newPl); setBoard(nb);
        if(checkMill(nb,m.pos,'b')){
          // AI removes
          const targets=nb.map((c,i)=>c===opp&&!checkMill(nb,i,opp)?i:-1).filter(i=>i>=0);
          const allOpp=nb.map((c,i)=>c===opp?i:-1).filter(i=>i>=0);
          const rem=targets.length?targets[Math.floor(Math.random()*targets.length)]:allOpp[Math.floor(Math.random()*allOpp.length)];
          if(rem>=0){nb[rem]=null;const newCp={...cp,b:cp.b+1};setCaps(newCp);setBoard([...nb]);}
        }
        const nextPh=getPhase(nb,'w',newPl.w);
        setTurn('w'); setPhase(nextPh);
        setStatus(`Ваш хід. ${newPl.w<9?'Ставте фішку.':nextPh==='fly'?'Ви літаєте!':'Пересувайте.'}`);
      } else {
        const nb=[...b];nb[m.to]='b';nb[m.from]=null;
        setBoard(nb);
        if(checkMill(nb,m.to,'b')){
          const targets=nb.map((c,i)=>c===opp&&!checkMill(nb,i,opp)?i:-1).filter(i=>i>=0);
          const allOpp=nb.map((c,i)=>c===opp?i:-1).filter(i=>i>=0);
          const rem=targets.length?targets[0]:allOpp[0];
          if(rem>=0){nb[rem]=null;const newCp={...cp,b:cp.b+1};setCaps(newCp);setBoard([...nb]);}
          if(countPieces(nb,'w')<=2&&pl.w>=9){setOver('b');setStatus('⚫ Чорні (ШІ) перемогли!');setThinking(false);return;}
        }
        const nextPh=getPhase(nb,'w',pl.w);
        setTurn('w'); setPhase(nextPh);
        setStatus('Ваш хід.');
      }
      setThinking(false);
    },600);
  },[doAI,checkMill,countPieces,getPhase]);

  const reset=useCallback(()=>{setBoard(Array(24).fill(null));setPhase('place');setTurn('w');setSel(null);setPlaced({w:0,b:0});setCaps({w:0,b:0});setRemoving(false);setOver(null);setStatus('Фаза 1: розстановка.');setThinking(false);},[]);
  return {board,phase,turn,sel,placed,caps,removing,over,status,thinking,pvp,handleClick,reset};
}

// ════════════════════════════════════════════════════════════════
// ALQUERQUE  — PvC + PvP
// ════════════════════════════════════════════════════════════════
const AQ_ADJ={
  0:[1,5,6],1:[0,2,6],2:[1,3,6,7,8],3:[2,4,8],4:[3,8,9],
  5:[0,6,10],6:[0,1,2,5,7,10,11,12],7:[2,6,8,12],8:[2,3,4,7,9,12,13,14],9:[4,8,14],
  10:[5,6,11,15],11:[6,10,12,15,16],12:[6,7,8,11,13,16],13:[8,12,14,16,17],14:[8,9,13,17],// wrong - redo
  15:[10,11,16,20],16:[11,12,13,15,17,20,21,22],17:[12,13,14,16,22],
  18:[15,16,19],19:[16,18,20],20:[15,16,19,21],21:[16,20,22],22:[16,17,21],// wrong
  23:[18,24],24:[23]// padding
};
// Proper 5x5 Alquerque board connections
const AQ5=[
  [0,1],[1,2],[2,3],[3,4],// row0
  [5,6],[6,7],[7,8],[8,9],// row1
  [10,11],[11,12],[12,13],[13,14],// row2
  [15,16],[16,17],[17,18],[18,19],// row3
  [20,21],[21,22],[22,23],[23,24],// row4
  [0,5],[5,10],[10,15],[15,20],// col0
  [1,6],[6,11],[11,16],[16,21],
  [2,7],[7,12],[12,17],[17,22],
  [3,8],[8,13],[13,18],[18,23],
  [4,9],[9,14],[14,19],[19,24],
  [0,6],[6,12],[12,18],[18,24],// diag
  [4,8],[8,12],[12,16],[16,20],
  [2,6],[6,10],[2,8],[8,14],
  [10,16],[16,22],[14,18],[18,22],
  [10,16],[16,22],[14,18],[18,22],
];
function buildAqAdj(){
  const adj={}; for(let i=0;i<25;i++) adj[i]=[];
  AQ5.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);});
  return adj;
}
const AQ_ADJ2=buildAqAdj();

function useAlquerque(mode='pvc'){
  const init=()=>{
    const b=Array(25).fill(null);
    for(let i=0;i<12;i++) b[i]='b';
    b[12]=null;
    for(let i=13;i<25;i++) b[i]='w';
    return b;
  };
  const [board,setBoard]=useState(init);
  const [sel,setSel]=useState(null);
  const [turn,setTurn]=useState('w');
  const [caps,setCaps]=useState({w:0,b:0});
  const [over,setOver]=useState(null);
  const [status,setStatus]=useState('Ваш хід. Оберіть білу фішку.');
  const [thinking,setThinking]=useState(false);
  const pvp=mode==='pvp';

  const getJumps=useCallback((b,pos,color)=>{
    const opp=color==='b'?'w':'b';
    const js=[];
    AQ_ADJ2[pos]?.forEach(mid=>{
      if(b[mid]!==opp) return;
      // find landing
      const dr=(Math.floor(mid/5)-Math.floor(pos/5)),dc=(mid%5-pos%5);
      const lr=Math.floor(pos/5)+2*dr,lc=(pos%5)+2*dc;
      if(lr<0||lr>4||lc<0||lc>4) return;
      const land=lr*5+lc;
      if(AQ_ADJ2[pos]?.includes(mid)&&AQ_ADJ2[mid]?.includes(land)&&b[land]===null)
        js.push({from:pos,cap:mid,to:land});
    });
    return js;
  },[]);

  const getMoves=useCallback((b,color)=>{
    const all=[];
    const jumps=[];
    b.forEach((c,i)=>{
      if(c!==color) return;
      const js=getJumps(b,i,color);
      jumps.push(...js);
      if(!js.length) AQ_ADJ2[i]?.forEach(j=>{if(b[j]===null) all.push({from:i,to:j,cap:null});});
    });
    return jumps.length?jumps:all;
  },[getJumps]);

  const applyAq=useCallback((b,m)=>{
    const nb=[...b]; nb[m.to]=nb[m.from]; nb[m.from]=null;
    if(m.cap!==null&&m.cap!==undefined) nb[m.cap]=null;
    return nb;
  },[]);

  const doMove=useCallback((m,b,color,currentCaps)=>{
    const nb=applyAq(b,m);
    const newCaps={...currentCaps};
    if(m.cap!=null) newCaps[color]++;
    setBoard(nb); setCaps(newCaps); setSel(null);
    const opp=color==='b'?'w':'b';
    const wc=nb.filter(c=>c==='w').length,bc=nb.filter(c=>c==='b').length;
    if(!wc){setOver('b');setStatus('⚫ Чорні перемогли!');return{nb,ended:true};}
    if(!bc){setOver('w');setStatus('⚪ Білі перемогли!');return{nb,ended:true};}
    const next=opp;
    if(!getMoves(nb,next).length){setOver(color);setStatus(`${color==='w'?'⚪ Білі':'⚫ Чорні'} перемогли!`);return{nb,ended:true};}
    setTurn(next);
    return{nb,ended:false,next};
  },[applyAq,getMoves]);

  const handleClick=useCallback((pos)=>{
    if(over||thinking) return;
    if(!pvp&&turn==='b') return;
    if(sel!==null){
      const ms=getMoves(board,turn).filter(m=>m.from===sel&&m.to===pos);
      if(ms.length){
        const{nb,ended,next}=doMove(ms[0],board,turn,caps);
        if(ended) return;
        if(!pvp&&next==='b'){
          setThinking(true); setStatus('ШІ ходить...');
          setTimeout(()=>{
            const ams=[...getMoves(nb,'b')].sort(()=>Math.random()-.5);
            const capMs=ams.filter(m=>m.cap!=null);
            const m=capMs.length?capMs[0]:ams[0];
            if(m){const{ended:e2}=doMove(m,nb,'b',{...caps,b:caps.b+(m.cap!=null?1:0)});if(!e2)setStatus('Ваш хід.');}
            setThinking(false);
          },500);
        } else setStatus(`Хід ${next==='w'?'білих':'чорних'}.`);
        return;
      }
    }
    if(board[pos]===turn){setSel(pos);setStatus(`Обрано позицію ${pos}. Оберіть куди ходити.`);}
    else{setSel(null);}
  },[over,thinking,pvp,turn,sel,board,caps,getMoves,doMove]);

  const reset=useCallback(()=>{setBoard(init());setSel(null);setTurn('w');setCaps({w:0,b:0});setOver(null);setStatus('Ваш хід.');setThinking(false);},[]);
  return{board,sel,turn,caps,over,status,thinking,pvp,handleClick,reset};
}

// ════════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ════════════════════════════════════════════════════════════════

/* ═══════════════════════════════════════════════════════════
   SHARED GAME UI
═══════════════════════════════════════════════════════════ */
function ModeToggle({mode,onChange}){
  return(
    <div role="group" aria-label="Режим гри"
      style={{display:'flex',gap:'.2rem',background:DS.bg2,borderRadius:'7px',
        padding:'3px',border:`1px solid ${DS.brd}`}}>
      {[['pvc','vs ШІ'],['pvp','2 гравці']].map(([v,l])=>(
        <button key={v} onClick={()=>onChange(v)}
          aria-pressed={mode===v}
          style={{fontFamily:DS.fSans,fontSize:'.72rem',fontWeight:mode===v?600:400,
            padding:'.32rem .88rem',borderRadius:'5px',border:'none',
            background:mode===v?DS.sur3:'transparent',
            color:mode===v?DS.gold:DS.t2,cursor:'pointer',
            transition:'all .18s',letterSpacing:'.02em',
            boxShadow:mode===v?`inset 0 1px 3px rgba(0,0,0,.3)`:'none'}}>
          {l}
        </button>
      ))}
    </div>
  );
}

function GameScoreBar({items}){
  return(
    <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center',
      padding:'.45rem .9rem',background:DS.bg2,borderRadius:'8px',
      border:`1px solid ${DS.brd}`}}>
      {items.map((item,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:'.4rem',
          fontFamily:DS.fSans,fontSize:'.72rem',
          color:item.active?DS.t1:DS.t3,
          fontWeight:item.active?600:400,
          transition:'all .22s',
          padding:'.1rem .3rem',borderRadius:'4px',
          background:item.active?DS.goldBg:'transparent'}}>
          <div style={{width:'6px',height:'6px',borderRadius:'50%',flexShrink:0,
            background:item.active?DS.gold:DS.t4,
            boxShadow:item.active?`0 0 8px ${DS.gold}`:'none',
            transition:'all .22s'}}/>
          <span>{item.label}</span>
          {item.val!==undefined&&(
            <span style={{fontFamily:DS.fMono,fontSize:'.68rem',
              color:item.active?DS.gold2:DS.t4,fontWeight:700,marginLeft:'.15rem'}}>{item.val}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function GameStatus({status,thinking}){
  return(
    <div style={{minHeight:'1.8rem',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:DS.fSans,fontSize:'.78rem',color:thinking?DS.gold:DS.t2,
        background:DS.sur2,border:`1px solid ${thinking?DS.goldD+'66':DS.brd}`,
        borderRadius:'8px',padding:'.4rem 1rem',textAlign:'center',
        maxWidth:'400px',lineHeight:1.45,
        display:'flex',alignItems:'center',gap:'.55rem',
        transition:'border-color .3s,color .3s'}}>
        {thinking&&(
          <div style={{display:'flex',gap:'2px',alignItems:'center',flexShrink:0}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{width:'4px',height:'16px',borderRadius:'3px',
                background:DS.gold,
                animation:`dotPulse 1.0s ${i*.16}s ease-in-out infinite`}}/>
            ))}
          </div>
        )}
        <span>{status}</span>
      </div>
    </div>
  );
}

function GameOver2({over,map,onReset}){
  if(!over)return null;
  const msg=map[over]||'Гра завершена!';
  const isWin=msg.includes('Ви') || msg.includes('перемогли') || msg.includes('🏆');
  const isDraw=msg.includes('Нічия') || msg.includes('draw');
  const bg=isDraw?'rgba(180,160,80,.08)':isWin?'rgba(80,180,100,.08)':'rgba(200,70,70,.08)';
  const bc=isDraw?'rgba(200,180,80,.25)':isWin?'rgba(80,200,100,.25)':'rgba(200,70,70,.25)';
  const col=isDraw?'#c8b84a':isWin?'#5ac870':'#c86060';
  return(
    <div style={{textAlign:'center',padding:'.7rem 1.4rem',
      background:bg, border:`1px solid ${bc}`,
      borderRadius:'8px',fontFamily:DS.fSans,fontSize:'.88rem',
      color:col,fontWeight:600,letterSpacing:'.02em'}}>
      {msg}
    </div>
  );
}

function GameBtn({label,onClick,variant='primary'}){
  const styles={
    primary:{background:DS.goldBg2,border:`1px solid ${DS.goldD}`,color:DS.gold2},
    ghost:{background:'transparent',border:`1px solid ${DS.brd2}`,color:DS.t2},
  };
  return(
    <button onClick={onClick}
      style={{...styles[variant],fontFamily:DS.fSans,fontSize:'.75rem',fontWeight:500,
        padding:'.38rem .95rem',borderRadius:'6px',cursor:'pointer',transition:'all .18s',
        letterSpacing:'.02em'}}
      onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.15)';e.currentTarget.style.transform='translateY(-1px)';}}
      onMouseLeave={e=>{e.currentTarget.style.filter='brightness(1)';e.currentTarget.style.transform='none';}}
      >{label}</button>
  );
}

function GameShell({title,controls,over,overMap,onReset,children}){
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'.85rem',
      padding:'1.1rem',background:DS.sur,
      border:`1px solid ${over?DS.brd2:DS.brd}`,
      borderRadius:'14px',boxShadow:'0 4px 32px rgba(0,0,0,.35)',
      maxWidth:'100%'}}>
      {/* Title bar */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        width:'100%',flexWrap:'wrap',gap:'.5rem',
        paddingBottom:'.7rem',borderBottom:`1px solid ${DS.brd}`}}>
        <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
          <div style={{width:'3px',height:'16px',borderRadius:'2px',background:DS.gold}}/>
          <span style={{fontFamily:DS.fDisp,fontSize:'.75rem',letterSpacing:'.15em',
            color:DS.gold,fontWeight:600}}>{title}</span>
        </div>
        <div style={{display:'flex',gap:'.4rem',alignItems:'center',flexWrap:'wrap'}}>
          {controls}
        </div>
      </div>
      {children}
      {over&&overMap&&<GameOver2 over={over} map={overMap} onReset={onReset}/>}
      <button onClick={onReset}
        style={{fontFamily:DS.fSans,fontSize:'.72rem',fontWeight:500,
          padding:'.38rem 1rem',borderRadius:'7px',cursor:'pointer',
          background:'transparent',border:`1px solid ${DS.brd2}`,
          color:DS.t3,transition:'all .18s',letterSpacing:'.04em'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=DS.goldD;e.currentTarget.style.color=DS.gold;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=DS.brd2;e.currentTarget.style.color=DS.t3;}}>
        ↺ Нова гра
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TIC-TAC-TOE
═══════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════
   CONNECT FOUR
═══════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════
   NIM
═══════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════
   PETTEIA GAME UI (updated style)
═══════════════════════════════════════════════════════════ */
function PetteiaGame() {
  const {board,sel,hints,turn,caps,status,over,diff,setDiff,thinking,prev,handleClick,reset}=usePetteia();
  const coords='ABCDEFGH';
  return (
    <GameShell title="ΠΕΤΤΕΊΑ · ДОШКА 8×8"
      controls={<>
        <ModeToggle mode="pvc" onChange={()=>{}}/>
        <div style={{display:'flex',gap:'.25rem'}}>
          {[1,2,3].map(d=>(
            <button key={d} onClick={()=>setDiff(d)}
              style={{fontFamily:DS.fMono,fontSize:'.62rem',padding:'.22rem .55rem',
                border:`1px solid ${diff===d?DS.goldD:DS.brd}`,borderRadius:'4px',
                background:diff===d?DS.goldBg:'transparent',
                color:diff===d?DS.gold:DS.t4,cursor:'pointer'}}>
              {['I','II','III'][d-1]}
            </button>
          ))}
        </div>
      </>}
      over={over} overMap={{w:'🏆 Ви перемогли!',b:'💀 Ксенос переміг.'}} onReset={reset}>
      <GameScoreBar items={[
        {label:'⚪ Ви',val:caps.w,active:turn==='w'&&!over},
        {label:'⚫ Ксенос (ШІ)',val:caps.b,active:turn==='b'&&!over},
      ]}/>
      <div style={{padding:'10px',background:'linear-gradient(145deg,#1e1508,#0a0805)',
        border:'1px solid rgba(180,120,30,.25)',borderRadius:'8px',
        boxShadow:'0 8px 30px rgba(0,0,0,.7)'}}>
        <div style={{display:'flex',marginBottom:'3px',paddingLeft:'18px'}}>
          {coords.split('').map(c=>(
            <div key={c} style={{width:'calc(min(360px,calc(100vw - 100px)) / 8)',
              textAlign:'center',fontFamily:DS.fMono,fontSize:'.5rem',color:'rgba(180,120,30,.4)'}}>{c}</div>
          ))}
        </div>
        <div style={{display:'flex'}}>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around',
            marginRight:'2px',width:'16px',gap:'0'}}>
            {Array.from({length:8},(_,i)=>(
              <div key={i} style={{fontFamily:DS.fMono,fontSize:'.48rem',color:'rgba(180,120,30,.4)',
                textAlign:'right',height:'calc(min(360px,calc(100vw - 100px)) / 8)',
                display:'flex',alignItems:'center',justifyContent:'flex-end'}}>{8-i}</div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:'1px',
            width:'min(360px,calc(100vw - 100px))'}}>
            {board.map((row,r)=>row.map((cell,c)=>{
              const light=(r+c)%2===0;
              const isSel=sel&&sel[0]===r&&sel[1]===c;
              const isHint=hints.some(([hr,hc])=>hr===r&&hc===c);
              const isPT=prev[1]&&prev[1][0]===r&&prev[1][1]===c;
              return (
                <div key={`${r}-${c}`} onClick={()=>handleClick(r,c)}
                  style={{aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',
                    cursor:'pointer',position:'relative',
                    background:isSel?'#805020':isHint&&!cell?'#406030':
                      light?'linear-gradient(145deg,#b88840,#986028)':'linear-gradient(145deg,#784810,#381800)',
                    border:`1px solid ${isPT?'rgba(200,168,48,.5)':'rgba(0,0,0,.2)'}`,
                    transition:'background .1s'}}>
                  {isHint&&!cell&&<div style={{width:'30%',height:'30%',borderRadius:'50%',
                    background:'rgba(80,160,40,.6)',border:'1.5px solid rgba(100,200,50,.8)'}}/>}
                  {cell&&<div style={{width:'72%',height:'72%',borderRadius:'50%',
                    background:cell==='w'?'radial-gradient(circle at 33% 28%,#fffbe0,#e0c070 40%,#a07828)':
                      'radial-gradient(circle at 33% 28%,#404030,#181408)',
                    boxShadow:cell==='w'?'0 2px 6px rgba(0,0,0,.6),inset 0 1px 3px rgba(255,255,200,.8)':
                      '0 2px 6px rgba(0,0,0,.9)',
                    border:cell==='w'?'1px solid rgba(200,160,40,.5)':'1px solid rgba(200,160,40,.2)',
                    transform:isSel?'scale(1.18) translateY(-2px)':'scale(1)',
                    transition:'transform .15s'}}/>}
                </div>
              );
            }))}
          </div>
        </div>
      </div>
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   GO GAME UI
═══════════════════════════════════════════════════════════ */
function GoGame() {
  const N=9;
  const [board,setBoard]=useState(()=>Array.from({length:N},()=>Array(N).fill(null)));
  const [turn,setTurn]=useState('b');
  const [caps,setCaps]=useState({b:0,w:0});
  const [prevBoard,setPrevBoard]=useState(null);
  const [passCount,setPassCount]=useState(0);
  const [status,setStatus]=useState('Хід чорних. Натисніть на перетин.');
  const [over,setOver]=useState(null);
  const boardEl=useRef(null);

  const getGroup=useCallback((b,r,c)=>{
    const color=b[r][c];if(!color)return null;
    const vis=new Set(),libs=new Set(),q=[[r,c]];
    while(q.length){const[cr,cc]=q.pop();const k=`${cr},${cc}`;if(vis.has(k))continue;vis.add(k);
      for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){const nr=cr+dr,nc=cc+dc;
        if(nr<0||nr>=N||nc<0||nc>=N)continue;
        if(b[nr][nc]===null)libs.add(`${nr},${nc}`);
        else if(b[nr][nc]===color&&!vis.has(`${nr},${nc}`))q.push([nr,nc]);}}
    return{vis,libs};
  },[]);

  const applyGo=useCallback((b,r,c,color)=>{
    const nb=b.map(row=>[...row]);nb[r][c]=color;
    const opp=color==='b'?'w':'b';let captured=0;
    for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){const nr=r+dr,nc=c+dc;
      if(nr<0||nr>=N||nc<0||nc>=N||nb[nr][nc]!==opp)continue;
      const g=getGroup(nb,nr,nc);if(g&&g.libs.size===0){g.vis.forEach(k=>{const[gr,gc]=k.split(',').map(Number);nb[gr][gc]=null;captured++;});}
    }
    return{nb,captured};
  },[getGroup]);

  const placeStone=useCallback((r,c,color,currentBoard,currentPrev,ai=false)=>{
    if(currentBoard[r][c])return false;
    const{nb,captured}=applyGo(currentBoard,r,c,color);
    const g=getGroup(nb,r,c);
    if(g&&g.libs.size===0&&captured===0)return false;
    const bs=JSON.stringify(nb);
    if(currentPrev&&bs===currentPrev)return false;
    setPrevBoard(JSON.stringify(currentBoard));
    setBoard(nb);setCaps(p=>({...p,[color]:p[color]+captured}));
    setPassCount(0);
    const next=color==='b'?'w':'b';setTurn(next);setStatus(`Хід ${next==='b'?'чорних':'білих'}.`);
    if(!ai){
      setTimeout(()=>{
        const moves=[];
        for(let rr=0;rr<N;rr++)for(let cc=0;cc<N;cc++){
          if(nb[rr][cc])continue;
          const{nb:nnb,captured:cap}=applyGo(nb,rr,cc,'w');
          const gg=getGroup(nnb,rr,cc);if(gg&&gg.libs.size===0&&cap===0)continue;
          moves.push({r:rr,c:cc,cap});
        }
        if(!moves.length){goPass(true);return;}
        moves.sort((a,b)=>b.cap-a.cap+(Math.random()-.5)*.5);
        placeStone(moves[0].r,moves[0].c,'w',nb,bs,true);
      },500);
    }
    return true;
  },[applyGo,getGroup]);

  const handleGoClick=useCallback((e)=>{
    if(over||turn==='w')return;
    const el=boardEl.current;if(!el)return;
    const rect=el.getBoundingClientRect();
    const x=e.clientX-rect.left,y=e.clientY-rect.top;
    const c=Math.round(x/rect.width*(N-1));
    const r=Math.round(y/rect.height*(N-1));
    if(r<0||r>=N||c<0||c>=N)return;
    placeStone(r,c,'b',board,prevBoard);
  },[over,turn,board,prevBoard,placeStone]);

  const goPass=useCallback((ai=false)=>{
    const newPass=passCount+1;
    if(newPass>=2){
      let bc=0,wc=0;
      for(let r=0;r<N;r++)for(let c=0;c<N;c++){if(board[r][c]==='b')bc++;if(board[r][c]==='w')wc++;}
      bc+=caps.b;wc+=caps.w+6.5;
      setOver(bc>wc?'b':'w');
      setStatus(`Гра завершена! ${bc>wc?'Чорні':'Білі'} перемогли. ⚫${bc} — ⚪${wc.toFixed(1)}`);
      return;
    }
    setPassCount(newPass);
    const next=turn==='b'?'w':'b';setTurn(next);
    setStatus(`${turn==='b'?'Чорні':'Білі'} спасували.`);
    if(!ai)setTimeout(()=>goPass(true),400);
  },[passCount,turn,board,caps]);

  const reset=()=>{setBoard(Array.from({length:N},()=>Array(N).fill(null)));setTurn('b');setCaps({b:0,w:0});setPrevBoard(null);setPassCount(0);setStatus('Хід чорних.');setOver(null);};

  const sz=Math.min(340,typeof window!=='undefined'?window.innerWidth-90:340);
  const step=sz/(N-1);

  return (
    <GameShell title="GO 9×9" controls={null}
      over={over} overMap={{b:'⚫ Чорні (Ви) перемогли!',w:'⚪ Білі (ШІ) перемогли!'}} onReset={reset}>
      <GameScoreBar items={[
        {label:'⚫ Чорні (Ви)',val:`бранців: ${caps.b}`,active:turn==='b'&&!over},
        {label:'⚪ Білі (ШІ)',val:`${caps.w}+6.5`,active:turn==='w'&&!over},
      ]}/>
      <div style={{padding:'12px',background:'linear-gradient(145deg,#c09030,#a07020)',
        border:'1px solid #7a5010',borderRadius:'8px',boxShadow:'0 8px 30px rgba(0,0,0,.7)'}}>
        <div ref={boardEl} onClick={handleGoClick}
          style={{width:`${sz}px`,height:`${sz}px`,position:'relative',cursor:'crosshair',userSelect:'none'}}>
          {Array.from({length:N},(_,i)=>(
            <React.Fragment key={i}>
              <div style={{position:'absolute',left:`${i*step}px`,top:0,width:'1px',height:'100%',background:'rgba(0,0,0,.45)'}}/>
              <div style={{position:'absolute',top:`${i*step}px`,left:0,height:'1px',width:'100%',background:'rgba(0,0,0,.45)'}}/>
            </React.Fragment>
          ))}
          {[[2,2],[2,6],[6,2],[6,6],[4,4]].map(([r,c])=>(
            <div key={`h${r}${c}`} style={{position:'absolute',width:'6px',height:'6px',borderRadius:'50%',
              background:'rgba(0,0,0,.5)',left:`${c*step-3}px`,top:`${r*step-3}px`,pointerEvents:'none'}}/>
          ))}
          {board.map((row,r)=>row.map((cell,c)=>cell&&(
            <div key={`${r}${c}`} style={{position:'absolute',borderRadius:'50%',
              width:`${step*.88}px`,height:`${step*.88}px`,
              left:`${c*step}px`,top:`${r*step}px`,
              transform:'translate(-50%,-50%)',pointerEvents:'none',
              background:cell==='b'?'radial-gradient(circle at 33% 28%,#555,#111)':'radial-gradient(circle at 33% 28%,#fff,#e0e0e0)',
              boxShadow:cell==='b'?'1px 2px 6px rgba(0,0,0,.8)':'1px 2px 6px rgba(0,0,0,.4)',
              border:cell==='w'?'1px solid #bbb':'none'}}/>
          )))}
        </div>
      </div>
      <GameStatus status={status} thinking={turn==='w'&&!over}/>
      <GameBtn label="Спасувати" onClick={()=>goPass(false)} variant="ghost"/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   MANCALA GAME UI
═══════════════════════════════════════════════════════════ */
function MancalaGame() {
  const {pits,stores,turn,over,status,extra,pick,reset}=useMancala();
  return (
    <GameShell title="MANCALA · KALAH"
      controls={null}
      over={over} overMap={{0:'🏆 Ви перемогли!',1:'💀 ШІ переміг!',draw:'Нічия!'}} onReset={reset}>
      <GameScoreBar items={[
        {label:'P1 (Ви)',val:stores[0],active:turn===0&&!over},
        {label:'P2 (ШІ)',val:stores[1],active:turn===1&&!over},
        ...(extra?[{label:'⚡ ЩЕ ХІД!',active:true}]:[]),
      ]}/>
      <div style={{background:'linear-gradient(145deg,#1a1008,#100804)',
        border:'1px solid rgba(150,80,20,.3)',borderRadius:'14px',
        padding:'.8rem',width:'min(580px,calc(100vw - 40px))',
        boxShadow:'0 8px 30px rgba(0,0,0,.6)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
          <div style={{width:'52px',minHeight:'90px',background:'rgba(0,0,0,.3)',
            border:'2px solid rgba(150,80,20,.4)',borderRadius:'26px',
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'.2rem'}}>
            <span style={{fontFamily:DS.fMono,fontSize:'1.3rem',color:DS.gold,fontWeight:600}}>{stores[1]}</span>
            <span style={{fontFamily:DS.fMono,fontSize:'.6rem',color:DS.t3,letterSpacing:'.1em'}}>P2</span>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:'.35rem'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.3rem'}}>
              {[...pits[1]].reverse().map((v,i)=>{
                const ri=5-i;
                return(
                  <div key={ri} onClick={()=>turn===1&&pick(1,ri)}
                    style={{aspectRatio:'1',background:'rgba(0,0,0,.25)',
                      border:`1px solid ${turn===1&&v>0?'rgba(200,168,48,.4)':'rgba(100,60,20,.3)'}`,
                      borderRadius:'50%',display:'flex',flexDirection:'column',
                      alignItems:'center',justifyContent:'center',
                      cursor:turn===1&&v>0?'pointer':'default',
                      transition:'all .18s',
                      boxShadow:turn===1&&v>0?`0 0 10px rgba(200,168,48,.2)`:'none'}}>
                    <span style={{fontFamily:DS.fMono,fontSize:'.9rem',color:DS.gold}}>{v}</span>
                  </div>
                );
              })}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.3rem'}}>
              {pits[0].map((v,i)=>(
                <div key={i} onClick={()=>turn===0&&pick(0,i)}
                  style={{aspectRatio:'1',background:'rgba(0,0,0,.25)',
                    border:`1px solid ${turn===0&&v>0?DS.goldD:'rgba(100,60,20,.3)'}`,
                    borderRadius:'50%',display:'flex',flexDirection:'column',
                    alignItems:'center',justifyContent:'center',
                    cursor:turn===0&&v>0?'pointer':'default',
                    transition:'all .18s',
                    transform:turn===0&&v>0?'scale(1.05)':'scale(1)',
                    boxShadow:turn===0&&v>0?`0 0 12px rgba(200,168,48,.25)`:'none'}}>
                  <span style={{fontFamily:DS.fMono,fontSize:'.9rem',color:DS.gold}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{width:'52px',minHeight:'90px',background:'rgba(0,0,0,.3)',
            border:'2px solid rgba(150,80,20,.4)',borderRadius:'26px',
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'.2rem'}}>
            <span style={{fontFamily:DS.fMono,fontSize:'1.3rem',color:DS.gold,fontWeight:600}}>{stores[0]}</span>
            <span style={{fontFamily:DS.fMono,fontSize:'.6rem',color:DS.t3,letterSpacing:'.1em'}}>P1</span>
          </div>
        </div>
      </div>
      <GameStatus status={status} thinking={turn===1&&!over}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   HNEFATAFL GAME UI
═══════════════════════════════════════════════════════════ */
function HnefataflGame() {
  const {board,sel,hints,turn,caps,status,over,thinking,handleClick,reset,HN,THRONE,CORNERS}=useHnefatafl();
  return (
    <GameShell title="HNEFATAFL 7×7" controls={null}
      over={over} overMap={{def:'🏆 Захист переміг! Король втік.',atk:'💀 Атака перемогла!'}} onReset={reset}>
      <GameScoreBar items={[
        {label:'🛡 Захист (Ви)',val:caps.def,active:turn==='def'&&!over},
        {label:'⚔ Атака (ШІ)',val:caps.atk,active:turn==='atk'&&!over},
      ]}/>
      <div style={{padding:'10px',background:'linear-gradient(145deg,#080e18,#030810)',
        border:'1px solid rgba(40,80,160,.25)',borderRadius:'8px',
        boxShadow:'0 8px 30px rgba(0,0,0,.8)'}}>
        <div style={{display:'grid',gridTemplateColumns:`repeat(${HN},1fr)`,gap:'2px',
          width:'min(340px,calc(100vw - 80px))'}}>
          {board.map((row,r)=>row.map((cell,c)=>{
            const light=(r+c)%2===0;
            const isSel=sel&&sel[0]===r&&sel[1]===c;
            const isHint=hints.some(([hr,hc])=>hr===r&&hc===c);
            const isThrone=r===THRONE[0]&&c===THRONE[1];
            const isCorner=CORNERS.some(([cr,cc])=>cr===r&&cc===c);
            return(
              <div key={`${r}${c}`} onClick={()=>handleClick(r,c)}
                style={{aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',
                  cursor:'pointer',position:'relative',borderRadius:'2px',
                  background:isCorner?'rgba(60,0,0,.6)':isThrone?'rgba(40,28,8,.8)':
                    isSel?'rgba(30,50,80,.9)':light?'rgba(14,22,40,.9)':'rgba(7,12,24,.95)',
                  border:`1px solid ${isCorner?'rgba(120,20,20,.5)':isThrone?'rgba(120,80,20,.4)':
                    isSel?'rgba(60,120,200,.5)':isHint?'rgba(60,120,200,.3)':'rgba(20,40,80,.3)'}`,
                  boxShadow:isSel?'inset 0 0 8px rgba(60,120,200,.3)':'none'}}>
                {isHint&&!cell&&<div style={{width:'32%',height:'32%',borderRadius:'50%',
                  background:'rgba(60,140,220,.3)',border:'1.5px solid rgba(80,160,240,.5)'}}/>}
                {cell&&<div style={{width:cell==='king'?'80%':'68%',height:cell==='king'?'80%':'68%',
                  borderRadius:'50%',
                  background:cell==='atk'?'radial-gradient(circle at 33% 28%,#d03030,#700808)':
                    cell==='king'?'radial-gradient(circle at 33% 28%,#ffe060,#c08010)':
                    'radial-gradient(circle at 33% 28%,#6090d0,#2050a0)',
                  boxShadow:cell==='king'?'0 2px 8px rgba(0,0,0,.8),0 0 12px rgba(255,200,50,.3)':'0 2px 5px rgba(0,0,0,.8)',
                  border:cell==='atk'?'1px solid #e04040':cell==='king'?'2px solid #ffd040':'1px solid #80b0e0',
                  transform:isSel?'scale(1.18) translateY(-2px)':'scale(1)',transition:'transform .15s'}}/>}
              </div>
            );
          }))}
        </div>
      </div>
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   DRAUGHTS GAME UI (redesigned)
═══════════════════════════════════════════════════════════ */
function DraughtsGame({mode:initMode='pvc'}){
  const [mode,setMode]=useState(initMode);
  const {board,sel,moves,turn,caps,over,status,thinking,pvp,handleClick,reset}=useDraughts(mode);
  return(
    <GameShell title="ШАШКИ 8×8"
      controls={<ModeToggle mode={mode} onChange={m=>{setMode(m);reset();}}/>}
      over={over} overMap={{w:pvp?'⚪ Білі перемогли!':'🏆 Ви перемогли!',b:pvp?'⚫ Чорні перемогли!':'💀 ШІ переміг!'}} onReset={reset}>
      <GameScoreBar items={[
        {label:'⚪ Білі'+(pvp?'':' (Ви)'),val:caps.w,active:turn==='w'&&!over},
        {label:'⚫ Чорні'+(pvp?'':' (ШІ)'),val:caps.b,active:turn==='b'&&!over},
      ]}/>
      <div style={{padding:'8px',background:'linear-gradient(145deg,#1a1208,#080604)',
        border:'1px solid rgba(120,80,20,.25)',borderRadius:'8px',boxShadow:'0 8px 30px rgba(0,0,0,.7)'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:'1px',
          width:'min(340px,calc(100vw - 80px))'}}>
          {board.map((row,r)=>row.map((cell,c)=>{
            const dark=(r+c)%2===1;
            const isSel=sel&&sel[0]===r&&sel[1]===c;
            const isHint=moves.some(m=>m.to[0]===r&&m.to[1]===c);
            return(
              <div key={`${r}${c}`} onClick={()=>handleClick(r,c)}
                style={{aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
                  background:isSel?'#705018':isHint&&dark?'#354025':dark?'#2a1a0c':'#c8a870',
                  transition:'background .1s',borderRadius:'1px'}}>
                {isHint&&dark&&!cell&&<div style={{width:'32%',height:'32%',borderRadius:'50%',
                  background:'rgba(80,180,40,.6)',border:'1.5px solid rgba(100,220,50,.8)'}}/>}
                {cell&&<div style={{width:'74%',height:'74%',borderRadius:'50%',position:'relative',
                  background:cell.color==='w'?'radial-gradient(circle at 33% 28%,#fff8e0,#d8c070 40%,#908020)':
                    'radial-gradient(circle at 33% 28%,#484030,#181008)',
                  boxShadow:cell.color==='w'?'0 2px 6px rgba(0,0,0,.5),inset 0 1px 3px rgba(255,255,200,.9)':'0 2px 6px rgba(0,0,0,.9)',
                  border:cell.color==='w'?'1px solid rgba(200,160,40,.4)':'1px solid rgba(200,160,40,.2)',
                  transform:isSel?'scale(1.16) translateY(-2px)':'scale(1)',transition:'transform .15s'}}>
                  {cell.king&&<span style={{position:'absolute',top:'50%',left:'50%',
                    transform:'translate(-50%,-50%)',fontSize:'.52rem',
                    color:cell.color==='w'?'#806010':'#c8a830'}}>♛</span>}
                </div>}
              </div>
            );
          }))}
        </div>
      </div>
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVERSI GAME UI
═══════════════════════════════════════════════════════════ */
function ReversiGame({mode:initMode='pvc'}){
  const [mode,setMode]=useState(initMode);
  const {board,turn,caps,valid,over,status,thinking,pvp,handleClick,reset}=useReversi(mode);
  return(
    <GameShell title="REVERSI · OTHELLO"
      controls={<ModeToggle mode={mode} onChange={m=>{setMode(m);reset();}}/>}
      over={over} overMap={{b:pvp?'⚫ Чорні перемогли!':'🏆 Ви перемогли!',w:pvp?'⚪ Білі перемогли!':'💀 ШІ переміг!',draw:'Нічия!'}} onReset={reset}>
      <GameScoreBar items={[
        {label:'⚫ Чорні'+(pvp?'':' (Ви)'),val:caps.b,active:turn==='b'&&!over},
        {label:'⚪ Білі'+(pvp?'':' (ШІ)'),val:caps.w,active:turn==='w'&&!over},
      ]}/>
      <div style={{padding:'8px',background:'#0a1a0a',border:'1px solid rgba(20,80,20,.4)',
        borderRadius:'8px',boxShadow:'0 8px 30px rgba(0,0,0,.7)'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:'1px',
          width:'min(340px,calc(100vw - 80px))'}}>
          {board.map((row,r)=>row.map((cell,c)=>{
            const isValid=valid.some(([vr,vc])=>vr===r&&vc===c);
            const isCorner=[[0,0],[0,7],[7,0],[7,7]].some(([cr,cc])=>cr===r&&cc===c);
            return(
              <div key={`${r}${c}`} onClick={()=>handleClick(r,c)}
                style={{aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',
                  background:isCorner?'#0a2a0a':'#142814',
                  border:'1px solid rgba(0,60,0,.5)',cursor:isValid?'pointer':'default',
                  transition:'all .12s',borderRadius:'1px'}}>
                {isValid&&!cell&&<div style={{width:'30%',height:'30%',borderRadius:'50%',
                  background:'rgba(80,200,80,.3)',border:'1.5px solid rgba(80,220,80,.5)'}}/>}
                {cell&&<div style={{width:'76%',height:'76%',borderRadius:'50%',
                  background:cell==='b'?'radial-gradient(circle at 33% 28%,#444,#0a0a0a)':'radial-gradient(circle at 33% 28%,#fff,#d8d8d8)',
                  boxShadow:cell==='b'?'0 2px 6px rgba(0,0,0,.8)':'0 2px 6px rgba(0,0,0,.4)',
                  border:cell==='w'?'1px solid #bbb':'none',
                  transition:'all .2s'}}/>}
              </div>
            );
          }))}
        </div>
      </div>
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   GOMOKU GAME UI
═══════════════════════════════════════════════════════════ */
function GomokuGame({mode:initMode='pvc'}){
  const [mode,setMode]=useState(initMode);
  const {board,turn,over,status,thinking,lastMove,pvp,handleClick,reset,N}=useGomoku(mode);
  const sz=Math.min(380,typeof window!=='undefined'?window.innerWidth-80:380);
  const step=sz/(N-1);
  return(
    <GameShell title="GOMOKU · 15×15"
      controls={<ModeToggle mode={mode} onChange={m=>{setMode(m);reset();}}/>}
      over={over} overMap={{b:pvp?'⚫ Чорні перемогли!':'🏆 Ви перемогли!',w:pvp?'⚪ Білі перемогли!':'💀 ШІ переміг!',draw:'Нічия!'}} onReset={reset}>
      <GameScoreBar items={[
        {label:'⚫ Чорні'+(pvp?'':' (Ви)'),active:turn==='b'&&!over},
        {label:'⚪ Білі'+(pvp?'':' (ШІ)'),active:turn==='w'&&!over},
      ]}/>
      <div style={{padding:'12px',background:'linear-gradient(145deg,#c09030,#a07020)',
        border:'1px solid rgba(140,80,10,.4)',borderRadius:'8px',
        boxShadow:'0 8px 30px rgba(0,0,0,.6)'}}>
        <div style={{position:'relative',width:`${sz}px`,height:`${sz}px`,cursor:'crosshair'}}
          onClick={e=>{
            const rect=e.currentTarget.getBoundingClientRect();
            const x=e.clientX-rect.left,y=e.clientY-rect.top;
            const c=Math.round(x/step),r=Math.round(y/step);
            if(r>=0&&r<N&&c>=0&&c<N) handleClick(r,c);
          }}>
          {Array.from({length:N},(_,i)=>(
            <React.Fragment key={i}>
              <div style={{position:'absolute',left:`${i*step}px`,top:0,width:'1px',height:'100%',background:'rgba(0,0,0,.4)'}}/>
              <div style={{position:'absolute',top:`${i*step}px`,left:0,height:'1px',width:'100%',background:'rgba(0,0,0,.4)'}}/>
            </React.Fragment>
          ))}
          {[[3,3],[3,11],[11,3],[11,11],[7,7],[3,7],[7,3],[11,7],[7,11]].filter(([r,c])=>r<N&&c<N).map(([r,c])=>(
            <div key={`h${r}${c}`} style={{position:'absolute',width:'6px',height:'6px',borderRadius:'50%',
              background:'rgba(0,0,0,.45)',left:`${c*step-3}px`,top:`${r*step-3}px`,pointerEvents:'none'}}/>
          ))}
          {board.map((row,r)=>row.map((cell,c)=>cell&&(
            <div key={`${r}${c}`} style={{position:'absolute',
              width:`${step*.85}px`,height:`${step*.85}px`,borderRadius:'50%',
              left:`${c*step-step*.425}px`,top:`${r*step-step*.425}px`,
              background:cell==='b'?'radial-gradient(circle at 33% 28%,#555,#0a0a0a)':'radial-gradient(circle at 33% 28%,#fff,#ddd)',
              boxShadow:cell==='b'?'1px 2px 5px rgba(0,0,0,.8)':'1px 2px 5px rgba(0,0,0,.5)',
              border:lastMove&&lastMove[0]===r&&lastMove[1]===c?`2px solid ${cell==='b'?DS.gold:DS.rubedo}`:'none',
              pointerEvents:'none',transition:'all .12s'}}/>
          )))}
        </div>
      </div>
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   MORRIS GAME UI
═══════════════════════════════════════════════════════════ */
function MorrisGame({mode:initMode='pvc'}){
  const [mode,setMode]=useState(initMode);
  const {board,phase,turn,sel,placed,caps,removing,over,status,thinking,pvp,handleClick,reset}=useMorris(mode);
  const size=Math.min(300,typeof window!=='undefined'?window.innerWidth-80:300);
  const px=col=>(col/6)*size, py=row=>(row/6)*size;
  return(
    <GameShell title="МЕЛЬНИЦЯ · NINE MEN'S MORRIS"
      controls={<ModeToggle mode={mode} onChange={m=>{setMode(m);reset();}}/>}
      over={over} overMap={{w:pvp?'⚪ Білі перемогли!':'🏆 Ви перемогли!',b:pvp?'⚫ Чорні перемогли!':'💀 ШІ переміг!'}} onReset={reset}>
      <GameScoreBar items={[
        {label:'⚪ Білі'+(pvp?'':' (Ви)'),val:`${placed.w}/9`,active:turn==='w'&&!over},
        {label:'⚫ Чорні'+(pvp?'':' (ШІ)'),val:`${placed.b}/9`,active:turn==='b'&&!over},
        {label:`Фаза: ${phase==='place'?'Розстановка':phase==='fly'?'Літання':'Хід'}`,active:false},
      ]}/>
      <div style={{padding:'14px',background:'linear-gradient(145deg,#1e1608,#0e0c04)',
        border:'1px solid rgba(180,130,30,.25)',borderRadius:'8px',boxShadow:'0 8px 30px rgba(0,0,0,.7)'}}>
        <svg width={size} height={size} style={{display:'block',cursor:'pointer'}}>
          {[[0,1,2],[3,4,5],[6,7,8],[0,9,21],[1,4,7],[2,14,23],[3,10,18],[5,13,20],[6,11,15],[8,12,17],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],[16,19,22]].map((line,li)=>(
            <line key={li}
              x1={px(MORRIS_POSITIONS[line[0]][0])} y1={py(MORRIS_POSITIONS[line[0]][1])}
              x2={px(MORRIS_POSITIONS[line[line.length-1]][0])} y2={py(MORRIS_POSITIONS[line[line.length-1]][1])}
              stroke="rgba(180,130,30,.3)" strokeWidth="1.5"/>
          ))}
          {MORRIS_POSITIONS.map(([col,row],i)=>{
            const x=px(col),y=py(row);
            const isSel=sel===i;
            const isAdj=sel!==null&&MORRIS_ADJ[sel]?.includes(i)&&board[i]===null;
            const isRemove=removing&&board[i]===(turn==='w'?'b':'w');
            return(
              <g key={i} onClick={()=>handleClick(i)} style={{cursor:'pointer'}}>
                <circle cx={x} cy={y} r={12}
                  fill={isSel?'rgba(200,148,48,.25)':isAdj?'rgba(80,140,40,.2)':isRemove?'rgba(200,50,50,.15)':'rgba(0,0,0,.1)'}
                  stroke={isSel?DS.gold:isAdj?'#60a030':isRemove?DS.rubedo:'rgba(180,130,30,.25)'}
                  strokeWidth={isSel?1.5:1}/>
                {board[i]&&<circle cx={x} cy={y} r={9}
                  fill={board[i]==='w'?'radial-gradient(circle at 33% 28%,#fff8e0,#c8a030)':'radial-gradient(circle at 33% 28%,#404030,#100800)'}
                  stroke={board[i]==='w'?'rgba(200,148,48,.6)':'rgba(200,148,48,.2)'}
                  strokeWidth="1.5"
                  style={{filter:isSel?`drop-shadow(0 0 5px ${DS.gold})`:'none',transition:'filter .15s'}}/>}
                {(isAdj||isRemove)&&!board[i]&&<circle cx={x} cy={y} r={4} fill={isRemove?'rgba(200,80,40,.5)':'rgba(60,160,40,.5)'}/>}
              </g>
            );
          })}
        </svg>
      </div>
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   ALQUERQUE GAME UI
═══════════════════════════════════════════════════════════ */
function AlquerqueGame({mode:initMode='pvc'}){
  const [mode,setMode]=useState(initMode);
  const {board,sel,turn,caps,over,status,thinking,pvp,handleClick,reset}=useAlquerque(mode);
  const size=Math.min(280,typeof window!=='undefined'?window.innerWidth-80:280);
  const gap=size/4;
  return(
    <GameShell title="ALQUERQUE · 5×5"
      controls={<ModeToggle mode={mode} onChange={m=>{setMode(m);reset();}}/>}
      over={over} overMap={{w:pvp?'⚪ Білі перемогли!':'🏆 Ви перемогли!',b:pvp?'⚫ Чорні перемогли!':'💀 ШІ переміг!'}} onReset={reset}>
      <GameScoreBar items={[
        {label:'⚪ Білі'+(pvp?'':' (Ви)'),val:caps.w,active:turn==='w'&&!over},
        {label:'⚫ Чорні'+(pvp?'':' (ШІ)'),val:caps.b,active:turn==='b'&&!over},
      ]}/>
      <div style={{padding:'14px',background:'linear-gradient(145deg,#c09840,#a07820)',
        border:'1px solid rgba(140,90,20,.4)',borderRadius:'8px',boxShadow:'0 8px 30px rgba(0,0,0,.6)'}}>
        <svg width={size} height={size} style={{display:'block',cursor:'pointer'}}
          onClick={e=>{
            const rect=e.currentTarget.getBoundingClientRect();
            const x=e.clientX-rect.left,y=e.clientY-rect.top;
            const c=Math.round(x/gap),r=Math.round(y/gap);
            if(c>=0&&c<5&&r>=0&&r<5) handleClick(r*5+c);
          }}>
          {AQ5.map(([a,b],i)=>(
            <line key={i}
              x1={(a%5)*gap} y1={Math.floor(a/5)*gap}
              x2={(b%5)*gap} y2={Math.floor(b/5)*gap}
              stroke="rgba(0,0,0,.4)" strokeWidth="1.5"/>
          ))}
          {board.map((cell,i)=>{
            const x=(i%5)*gap,y=Math.floor(i/5)*gap;
            const isSel=sel===i;
            const isAdj=sel!==null&&AQ_ADJ2[sel]?.includes(i)&&!board[i];
            return(
              <g key={i}>
                <circle cx={x} cy={y} r={13}
                  fill={isSel?'rgba(200,148,48,.3)':isAdj?'rgba(60,140,40,.2)':'rgba(0,0,0,.12)'}
                  stroke={isSel?DS.gold:isAdj?'#60a030':'rgba(0,0,0,.3)'}
                  strokeWidth={isSel?1.5:1}/>
                {cell&&<circle cx={x} cy={y} r={10}
                  fill={cell==='w'?'radial-gradient(circle at 33% 28%,#fff8e0,#d0a030)':'radial-gradient(circle at 33% 28%,#404030,#100800)'}
                  stroke={cell==='w'?'rgba(200,148,48,.5)':'rgba(200,148,48,.15)'}
                  strokeWidth="1.5"
                  style={{filter:isSel?`drop-shadow(0 0 6px ${DS.gold})`:'none'}}/>}
                {isAdj&&!cell&&<circle cx={x} cy={y} r={4} fill="rgba(60,160,40,.6)"/>}
              </g>
            );
          })}
        </svg>
      </div>
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   GAME DISPATCH
═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   CHATURANGA ENGINE (Indian 2-player, ~550 CE)
   Rules: Ratha=Rook, Ashva=Knight, Hasti=BishopLeap(2diag),
          Mantri=1diag, Raja=King, Padatina=Pawn(no enpassant)
          Stalemate = LOSS for stalemated player (original rule)
═══════════════════════════════════════════════════════════ */
const PIECE_UNICODE_C = {
  K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',
  k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟',
};
const CHATURANGA_NAMES = {
  K:'Raja',Q:'Mantri',R:'Ratha',B:'Hasti',N:'Ashva',P:'Padatina',
  k:'Raja',q:'Mantri',r:'Ratha',b:'Hasti',n:'Ashva',p:'Padatina',
};

function useChaturanga(mode) {
  const INIT = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R'],
  ];
  const [board, setBoard] = useState(() => INIT.map(r => [...r]));
  const [turn, setTurn] = useState('w');
  const [sel, setSel] = useState(null);
  const [hints, setHints] = useState([]);
  const [over, setOver] = useState(null);
  const [status, setStatus] = useState('\u0425\u0456\u0434 \u0431\u0456\u043b\u0438\u0445 (\u0412\u0438)');
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const pvp = mode === 'pvp';

  const isW = p => p && p === p.toUpperCase();
  const isB = p => p && p !== p.toUpperCase();
  const owned = (p, c) => c === 'w' ? isW(p) : isB(p);

  // Chaturanga moves: Hasti leaps 2 diagonally (no slide), Mantri moves 1 diagonal
  const getRawMoves = useCallback((b, r, c, col) => {
    const p = b[r][c]; if (!p) return [];
    const mv = [];
    const pt = p.toLowerCase();
    const inB = (r,c) => r>=0&&r<8&&c>=0&&c<8;
    const push = (tr,tc) => { if(inB(tr,tc) && !owned(b[tr][tc],col)) mv.push([tr,tc]); };
    const slide = (dr,dc) => {
      let nr=r+dr,nc=c+dc;
      while(inB(nr,nc)){
        if(owned(b[nr][nc],col)) break;
        mv.push([nr,nc]);
        if(b[nr][nc]) break;
        nr+=dr; nc+=dc;
      }
    };
    const up = col==='w'?-1:1;
    const sr = col==='w'?6:1;
    if(pt==='p'){
      if(inB(r+up,c)&&!b[r+up][c]){
        mv.push([r+up,c]);
        if(r===sr&&!b[r+2*up][c]) mv.push([r+2*up,c]);
      }
      for(const dc of[-1,1]) if(inB(r+up,c+dc)&&b[r+up][c+dc]&&!owned(b[r+up][c+dc],col)) mv.push([r+up,c+dc]);
    }
    else if(pt==='n') for(const[dr,dc] of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) push(r+dr,c+dc);
    else if(pt==='b') for(const[dr,dc] of[[-2,-2],[-2,2],[2,-2],[2,2]]) push(r+dr,c+dc); // Hasti: leap 2 diag
    else if(pt==='r') { slide(-1,0);slide(1,0);slide(0,-1);slide(0,1); }
    else if(pt==='q') for(const[dr,dc] of[[-1,-1],[-1,1],[1,-1],[1,1]]) push(r+dr,c+dc); // Mantri: 1 diag
    else if(pt==='k') for(const[dr,dc] of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) push(r+dr,c+dc);
    return mv;
  }, [owned]);

  const isInCheck = useCallback((b, col) => {
    const kp = col==='w'?'K':'k';
    let kr=-1,kc=-1;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(b[r][c]===kp){kr=r;kc=c;}
    if(kr<0) return true;
    const opp = col==='w'?'b':'w';
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      if(!owned(b[r][c],opp)) continue;
      if(getRawMoves(b,r,c,opp).some(([mr,mc])=>mr===kr&&mc===kc)) return true;
    }
    return false;
  }, [getRawMoves, owned]);

  const getLegal = useCallback((b, r, c, col) => {
    return getRawMoves(b,r,c,col).filter(([tr,tc])=>{
      const nb=b.map(row=>[...row]); nb[tr][tc]=nb[r][c]; nb[r][c]=null;
      return !isInCheck(nb,col);
    });
  }, [getRawMoves, isInCheck]);

  const evalBoard = useCallback((b) => {
    const v={p:1,n:3,b:2,r:5,q:1.5,k:0}; // Hasti weaker, Mantri weak
    let s=0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const p=b[r][c]; if(!p) continue;
      const val=v[p.toLowerCase()]||0;
      s+=isW(p)?val:-val;
    }
    return s;
  },[isW]);

  const minimax = useCallback((b,depth,alpha,beta,maxP)=>{
    if(depth===0) return evalBoard(b);
    const col=maxP?'w':'b';
    const moves=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      if(!owned(b[r][c],col)) continue;
      for(const[tr,tc] of getLegal(b,r,c,col)) moves.push([r,c,tr,tc]);
    }
    if(!moves.length) return isInCheck(b,col)?(maxP?-999:999):999; // stalemate = loss
    if(maxP){
      let best=-Infinity;
      for(const[r,c,tr,tc] of moves){
        const nb=b.map(row=>[...row]); nb[tr][tc]=nb[r][c]; nb[r][c]=null;
        best=Math.max(best,minimax(nb,depth-1,alpha,beta,false));
        alpha=Math.max(alpha,best); if(beta<=alpha) break;
      }
      return best;
    } else {
      let best=Infinity;
      for(const[r,c,tr,tc] of moves){
        const nb=b.map(row=>[...row]); nb[tr][tc]=nb[r][c]; nb[r][c]=null;
        best=Math.min(best,minimax(nb,depth-1,alpha,beta,true));
        beta=Math.min(beta,best); if(beta<=alpha) break;
      }
      return best;
    }
  },[owned,getLegal,evalBoard,isInCheck]);

  const handleClick = useCallback((r,c)=>{
    if(over||thinking) return;
    if(!pvp&&turn==='b') return;
    const p=board[r][c];
    if(sel){
      const mv=hints.find(([hr,hc])=>hr===r&&hc===c);
      if(mv){
        const nb=board.map(row=>[...row]);
        // Promotion: Padatina reaches back rank -> Ratha (strongest in Chaturanga)
        if((board[sel[0]][sel[1]].toLowerCase()==='p')&&(r===0||r===7)) nb[r][c]=turn==='w'?'R':'r';
        else nb[r][c]=nb[sel[0]][sel[1]];
        nb[sel[0]][sel[1]]=null;
        setBoard(nb); setSel(null); setHints([]); setLastMove([[sel[0],sel[1]],[r,c]]);
        const next=turn==='w'?'b':'w';
        const allMoves=[];
        for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
          if(!owned(nb[rr][cc],next)) continue;
          allMoves.push(...getLegal(nb,rr,cc,next));
        }
        if(!allMoves.length){
          // Stalemate OR checkmate - both = loss in Chaturanga
          setOver(turn);
          const isChk=isInCheck(nb,next);
          setStatus(isChk?'\u041c\u0430\u0442! \u041f\u0435\u0440\u0435\u043c\u043e\u0433\u0430.':'Pata! \u041f\u0430\u0442 \u2014 \u043f\u0435\u0440\u0435\u043c\u043e\u0433\u0430 \u0432 Chaturanga.');
          return;
        }
        setTurn(next);
        if(!pvp&&next==='b'){
          setThinking(true); setStatus('\u0428\u0406 \u043e\u0431\u0434\u0443\u043c\u0443\u0454...');
          setTimeout(()=>{
            const bmoves=[];
            for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
              if(!owned(nb[rr][cc],'b')) continue;
              for(const[tr2,tc2] of getLegal(nb,rr,cc,'b')) bmoves.push([rr,cc,tr2,tc2]);
            }
            if(!bmoves.length){setThinking(false);return;}
            let best=Infinity,bestMove=bmoves[0];
            for(const[r0,c0,tr2,tc2] of bmoves){
              const nb2=nb.map(row=>[...row]); nb2[tr2][tc2]=nb2[r0][c0]; nb2[r0][c0]=null;
              const v=minimax(nb2,2,-Infinity,Infinity,true);
              if(v<best){best=v;bestMove=[r0,c0,tr2,tc2];}
            }
            const[r0,c0,tr2,tc2]=bestMove;
            const nb2=nb.map(row=>[...row]); nb2[tr2][tc2]=nb2[r0][c0]; nb2[r0][c0]=null;
            setBoard(nb2); setLastMove([[r0,c0],[tr2,tc2]]);
            const wMoves=[];
            for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
              if(!owned(nb2[rr][cc],'w')) continue;
              wMoves.push(...getLegal(nb2,rr,cc,'w'));
            }
            if(!wMoves.length){
              setOver('b');
              setStatus(isInCheck(nb2,'w')?'\u0428\u0406 \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0432 \u0432\u0430\u043c \u043c\u0430\u0442!':'Pata \u2014 \u0441\u0442\u0430\u043b\u0435м\u0435\u0439\u0442! (\u043f\u0430\u0442 = \u043f\u043e\u0440\u0430\u0437\u043a\u0430)');
            } else setStatus('\u0425\u0456\u0434 \u0431\u0456\u043b\u0438\u0445.');
            setTurn('w'); setThinking(false);
          },400);
        } else setStatus(next==='w'?'\u0425\u0456\u0434 \u0431\u0456\u043b\u0438\u0445.':'\u0425\u0456\u0434 \u0447\u043e\u0440\u043d\u0438\u0445.');
        return;
      }
      setSel(null); setHints([]);
    }
    if(owned(p,turn)){
      const mv=getLegal(board,r,c,turn);
      if(mv.length){setSel([r,c]);setHints(mv);}
    }
  },[over,thinking,pvp,turn,board,sel,hints,getLegal,isInCheck,owned,minimax]);

  const reset=useCallback(()=>{
    setBoard(INIT.map(r=>[...r]));setTurn('w');setSel(null);setHints([]);
    setOver(null);setStatus('\u0425\u0456\u0434 \u0431\u0456\u043b\u0438\u0445 (\u0412\u0438)');setThinking(false);setLastMove(null);
  },[]);

  return{board,turn,sel,hints,over,status,thinking,pvp,lastMove,handleClick,reset};
}

function ChaturangaGame(){
  const[mode,setMode]=useState('pvc');
  const{board,turn,sel,hints,over,status,thinking,pvp,lastMove,handleClick,reset}=useChaturanga(mode);
  const sz=Math.min(360,typeof window!=='undefined'?window.innerWidth-60:360);
  const cell=sz/8;
  const files='abcdefgh';
  return(
    <GameShell title="CHATURANGA \u00b7 \u0406\u041d\u0414\u0406\u0419\u0421\u042c\u041a\u0406 \u0428\u0410\u0425\u0418"
      controls={<ModeToggle mode={mode} onChange={m=>{setMode(m);reset();}}/>}
      over={over} overMap={{w:pvp?'\u0411\u0456\u043b\u0456 \u043f\u0435\u0440\u0435\u043c\u043e\u0433\u043b\u0438!':'\u0412\u0438 \u043f\u0435\u0440\u0435\u043c\u043e\u0433\u043b\u0438!',b:pvp?'\u0427\u043e\u0440\u043d\u0456 \u043f\u0435\u0440\u0435\u043c\u043e\u0433\u043b\u0438!':'\u0428\u0406 \u043f\u0435\u0440\u0435\u043c\u0456\u0433!'}}
      onReset={reset}>
      <div style={{fontFamily:DS.fMono,fontSize:'.55rem',color:DS.t4,textAlign:'center',letterSpacing:'.08em'}}>
        Hasti=\u0441\u0442\u0440\u0438\u0431\u043e\u043a 2 по діаг · Mantri=1 по діаг · Pata=\u043f\u043e\u0440\u0430\u0437\u043a\u0430
      </div>
      <GameScoreBar items={[
        {label:'\u2654 \u0411\u0456\u043b\u0456'+(pvp?'':' (\u0412\u0438)'),active:turn==='w'&&!over},
        {label:'\u265a \u0427\u043e\u0440\u043d\u0456'+(pvp?'':' (\u0428\u0406)'),active:turn==='b'&&!over},
      ]}/>
      <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
        <div style={{display:'flex',flexDirection:'column',height:sz+'px',justifyContent:'space-around'}}>
          {Array.from({length:8},(_,i)=>(
            <div key={i} style={{fontFamily:DS.fMono,fontSize:'.52rem',color:DS.t3,textAlign:'right',lineHeight:cell+'px'}}>{8-i}</div>
          ))}
        </div>
        <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(8,'+cell+'px)',gridTemplateRows:'repeat(8,'+cell+'px)',
            border:'2px solid rgba(120,80,20,.4)',borderRadius:'4px',overflow:'hidden',
            boxShadow:'0 8px 32px rgba(0,0,0,.7)'}}>
            {board.map((row,r)=>row.map((piece,c)=>{
              const light=(r+c)%2===0;
              const isSel=sel&&sel[0]===r&&sel[1]===c;
              const isHint=hints.some(([hr,hc])=>hr===r&&hc===c);
              const isLast=lastMove&&((lastMove[0][0]===r&&lastMove[0][1]===c)||(lastMove[1][0]===r&&lastMove[1][1]===c));
              const bg=isSel?'#a8740a':isLast?(light?'#e8d060':'#b8a030'):light?'#f0d9a0':'#b58840';
              return(
                <div key={r+','+c} onClick={()=>handleClick(r,c)}
                  style={{width:cell+'px',height:cell+'px',background:bg,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    cursor:'pointer',position:'relative',transition:'background .1s'}}>
                  {isHint&&<div style={{position:'absolute',borderRadius:'50%',
                    width:piece?'90%':'32%',height:piece?'90%':'32%',
                    background:piece?'rgba(0,0,0,0)':'rgba(0,0,0,.18)',
                    border:piece?'3px solid rgba(0,0,0,.35)':'none',
                    pointerEvents:'none',zIndex:1}}/>}
                  {piece&&<span style={{fontSize:cell*.7+'px',lineHeight:1,
                    color:piece===piece.toUpperCase()?'#fff':'#1a1008',
                    textShadow:piece===piece.toUpperCase()?'0 1px 3px rgba(0,0,0,.8)':'0 1px 2px rgba(255,255,255,.3)',
                    userSelect:'none',zIndex:2,position:'relative',
                    filter:isSel?'drop-shadow(0 0 6px rgba(255,200,50,.9))':'none',
                    transition:'filter .15s',title:CHATURANGA_NAMES[piece]}}>
                    {PIECE_UNICODE_C[piece]}
                  </span>}
                </div>
              );
            }))}
          </div>
          <div style={{display:'flex',width:sz+'px',marginTop:'3px'}}>
            {files.split('').map(f=>(
              <div key={f} style={{width:cell+'px',textAlign:'center',fontFamily:DS.fMono,fontSize:'.52rem',color:DS.t3}}>{f}</div>
            ))}
          </div>
        </div>
      </div>
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}


/* ═══════════════════════════════════════════════════════════
   FOX AND GEESE ENGINE
═══════════════════════════════════════════════════════════ */
const FOX_CELLS = [];
for(let _r=0;_r<5;_r++) for(let _c=0;_c<7;_c++){
  if((_r===0||_r===1||_r===3||_r===4)&&(_c<2||_c>4)) continue;
  FOX_CELLS.push(_r*7+_c);
}
const FOX_SET = new Set(FOX_CELLS);

function useFoxGeese(mode) {
  const pvp = mode === 'pvp';
  // Cross-shaped board: 33 points
  // Encode as flat array. Valid points:
  // Board encoded as 7-wide rows (5 rows)
  // 7x5 cross grid layout (col 0-6, row 0-4)
  // Row 0: cols 2,3,4
  // Row 1: cols 2,3,4
  // Row 2: cols 0,1,2,3,4,5,6
  // Row 3: cols 2,3,4
  // Row 4: cols 2,3,4
  // Index: r*7+c but only valid cells
  const VALID_CELLS=FOX_CELLS, VALID_SET=FOX_SET;

  const getAdj = useCallback((idx) => {
    const r = Math.floor(idx/7), c = idx%7;
    const adj = [];
    for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr=r+dr, nc=c+dc;
      if(nr>=0&&nr<5&&nc>=0&&nc<7&&VALID_SET.has(nr*7+nc)) adj.push(nr*7+nc);
    }
    return adj;
  }, [VALID_SET]);

  const initState = () => {
    const b = {};
    VALID_CELLS.forEach(i => b[i] = null);
    // Geese: bottom rows + middle bottom half
    [10,11,12, 17,18,19, 21,22,23,24,25,26,27, 28,29,30].forEach(i => { if(VALID_SET.has(i)) b[i]='goose'; });
    // Fox starts at top center
    b[3] = 'fox';
    return b;
  };

  const [board, setBoard] = useState(initState);
  const [sel, setSel] = useState(null);
  const [turn, setTurn] = useState('fox'); // fox always vs AI geese
  const [over, setOver] = useState(null);
  const [status, setStatus] = useState('Ваш хід (Лисиця). Оберіть лисицю.');
  const [thinking, setThinking] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  const getFoxMoves = useCallback((b, foxPos) => {
    const moves = [];
    const adj = getAdj(foxPos);
    for(const nb of adj) {
      if(!b[nb]) { moves.push({from:foxPos,to:nb,cap:null}); continue; }
      if(b[nb]==='goose') {
        // Jump over
        const fr = Math.floor(foxPos/7), fc = foxPos%7;
        const mr = Math.floor(nb/7), mc = nb%7;
        const tr = 2*mr-fr, tc = 2*mc-fc;
        if(tr>=0&&tr<5&&tc>=0&&tc<7) {
          const landing = tr*7+tc;
          if(VALID_SET.has(landing)&&!b[landing]) moves.push({from:foxPos,to:landing,cap:nb});
        }
      }
    }
    return moves;
  }, [getAdj, VALID_SET]);

  const getGooseMoves = useCallback((b) => {
    const moves = [];
    VALID_CELLS.forEach(i => {
      if(b[i]!=='goose') return;
      const r = Math.floor(i/7);
      getAdj(i).forEach(j => {
        const jr = Math.floor(j/7);
        if(!b[j] && jr <= r) moves.push({from:i,to:j}); // geese move up/sideways only
      });
    });
    return moves;
  }, [getAdj, VALID_CELLS]);

  const foxPos = useMemo(() => Object.keys(board).find(k => board[k]==='fox'), [board]);
  const geeseCount = useMemo(() => Object.values(board).filter(v=>v==='goose').length, [board]);

  const applyMove = useCallback((b, mv) => {
    const nb = {...b};
    nb[mv.to] = nb[mv.from];
    nb[mv.from] = null;
    if(mv.cap !== null && mv.cap !== undefined) nb[mv.cap] = null;
    return nb;
  }, []);

  const handleClick = useCallback((idx) => {
    if(over || thinking) return;
    if(turn !== 'fox') return;
    if(sel !== null) {
      const moves = getFoxMoves(board, sel);
      const mv = moves.find(m => m.to === idx);
      if(mv) {
        const nb = applyMove(board, mv);
        const newCount = moveCount + 1;
        setBoard(nb); setSel(null); setMoveCount(newCount);
        // Check win: fox captured enough geese or geese blocked
        const newGeese = Object.values(nb).filter(v=>v==='goose').length;
        const newFoxPos = idx;
        if(newGeese <= 5) { setOver('fox'); setStatus('🦊 Лисиця перемогла!'); return; }
        if(newCount > 60) { setOver('geese'); setStatus('🪿 Гуси перемогли (час вийшов)!'); return; }
        setTurn('geese'); setStatus('Гуси думають...');
        setThinking(true);
        setTimeout(() => {
          const gmoves = getGooseMoves(nb);
          if(!gmoves.length) { setOver('fox'); setStatus('🦊 Лисиця перемогла — гуси заблоковані!'); setThinking(false); return; }
          // AI: move goose closest to fox
          const fp = parseInt(Object.keys(nb).find(k => nb[k]==='fox'));
          const fr = Math.floor(fp/7), fc = fp%7;
          let best = gmoves[0];
          let bestScore = -Infinity;
          for(const m of gmoves) {
            const mr = Math.floor(m.to/7), mc = m.to%7;
            const score = -(Math.abs(mr-fr)+Math.abs(mc-fc)) + mr*2; // prefer moving up and surrounding fox
            if(score > bestScore) { bestScore=score; best=m; }
          }
          const nb2 = applyMove(nb, best);
          // Check if fox is blocked
          const fp2 = parseInt(Object.keys(nb2).find(k => nb2[k]==='fox'));
          if(!getFoxMoves(nb2, fp2).length) { setBoard(nb2); setOver('geese'); setStatus('🪿 Гуси перемогли — лисиця заблокована!'); setThinking(false); return; }
          setBoard(nb2); setTurn('fox'); setStatus('Ваш хід (Лисиця).'); setThinking(false);
        }, 500);
        return;
      }
      setSel(null);
    }
    if(board[idx]==='fox' && turn==='fox') {
      if(getFoxMoves(board, idx).length) setSel(idx);
    }
  }, [over, thinking, turn, board, sel, moveCount, getFoxMoves, getGooseMoves, applyMove]);

  const hints = useMemo(() => sel !== null ? getFoxMoves(board, sel).map(m=>m.to) : [], [sel, board, getFoxMoves]);

  const reset = useCallback(() => {
    setBoard(initState()); setSel(null); setTurn('fox');
    setOver(null); setStatus('Ваш хід (Лисиця).'); setThinking(false); setMoveCount(0);
  }, []);

  return { board, sel, hints, turn, over, status, thinking, geeseCount, handleClick, reset, VALID_CELLS, VALID_SET };
}

function FoxGeeseGame() {
  const [mode, setMode] = useState('pvc');
  const { board, sel, hints, turn, over, status, thinking, geeseCount, handleClick, reset, VALID_CELLS, VALID_SET } = useFoxGeese(mode);
  const sz = Math.min(300, typeof window!=='undefined' ? window.innerWidth-80 : 300);
  const cell = sz / 6;

  return (
    <GameShell title="FOX AND GEESE" controls={null}
      over={over} overMap={{fox:'🦊 Лисиця перемогла!', geese:'🪿 Гуси перемогли!'}}
      onReset={reset}>
      <GameScoreBar items={[
        {label:'🦊 Лисиця (Ви)', active:turn==='fox'&&!over},
        {label:'🪿 Гуси (ШІ)', val:geeseCount, active:turn==='geese'&&!over},
      ]}/>
      <div style={{padding:'10px',background:'linear-gradient(145deg,#1a1408,#0c0804)',
        border:'1px solid rgba(180,130,30,.25)',borderRadius:'8px',
        boxShadow:'0 8px 30px rgba(0,0,0,.6)'}}>
        <svg width={sz} height={sz*5/6} style={{display:'block',overflow:'visible'}}>
          {/* Draw connections */}
          {VALID_CELLS.map(idx => {
            const r=Math.floor(idx/7), c=idx%7;
            const x=c*cell+cell/2, y=r*cell+cell/2;
            return [[0,1],[1,0]].map(([dr,dc]) => {
              const ni=(r+dr)*7+(c+dc);
              if(!VALID_SET.has(ni)) return null;
              const nr=Math.floor(ni/7), nc=ni%7;
              return <line key={`${idx}-${ni}`} x1={x} y1={y} x2={nc*cell+cell/2} y2={nr*cell+cell/2}
                stroke="rgba(180,130,30,.3)" strokeWidth="1.5"/>;
            });
          })}
          {/* Draw cells */}
          {VALID_CELLS.map(idx => {
            const r=Math.floor(idx/7), c=idx%7;
            const x=c*cell+cell/2, y=r*cell+cell/2;
            const isSel = sel===idx;
            const isHint = hints.includes(idx);
            const piece = board[idx];
            return (
              <g key={idx} onClick={() => handleClick(idx)} style={{cursor:'pointer'}}>
                <circle cx={x} cy={y} r={cell*.38}
                  fill={isSel?'rgba(212,168,76,.3)':isHint?'rgba(80,180,40,.2)':'rgba(0,0,0,.15)'}
                  stroke={isSel?DS.gold:isHint?'#60b030':'rgba(180,130,30,.3)'}
                  strokeWidth={isSel?1.5:1}/>
                {piece==='fox' && <text x={x} y={y+7} textAnchor="middle" fontSize={cell*.55}
                  style={{filter:isSel?'drop-shadow(0 0 6px #d4a84c)':'none'}}>🦊</text>}
                {piece==='goose' && <circle cx={x} cy={y} r={cell*.28}
                  fill="radial-gradient(circle at 35% 30%,#fff,#d0d0e0)"
                  style={{fill:'white',stroke:'#a0a0b8',strokeWidth:1.5}}/>}
                {isHint && !piece && <circle cx={x} cy={y} r={cell*.15} fill="rgba(80,180,40,.6)"/>}
              </g>
            );
          })}
        </svg>
      </div>
      <GameStatus status={status} thinking={thinking}/>
      <div style={{fontFamily:DS.fMono,fontSize:'.6rem',color:DS.t4,textAlign:'center'}}>
        Гусей залишилось: <span style={{color:DS.t2,fontWeight:600}}>{geeseCount}</span> · Лисиця виграє при ≤5
      </div>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   SENET ENGINE (simplified playable version)
═══════════════════════════════════════════════════════════ */
function useSenet(mode) {
  const pvp = mode==='pvp';
  const SQUARES = 30;
  const PIECES_EACH = 5;

  // Special squares: 15=House of Rebirth(safe), 26=House of Happiness(must stop), 27=water(goto15), 28=3cobra, 29=2cobra, 30=exit
  const SPECIAL = {15:'rebirth', 26:'happiness', 27:'water', 28:'cobra3', 29:'cobra2'};

  const rollSticks = () => {
    let n = 0;
    for(let i=0;i<4;i++) if(Math.random()<.5) n++;
    return n===0?4:n; // 0 = 4 by Egyptian rule (sacred throw)
  };

  const initBoard = () => {
    // Alternating pieces: 0=p1(white), 1=p2(black) at positions 0-9
    const b = Array(SQUARES+1).fill(null);
    for(let i=0;i<PIECES_EACH;i++) { b[i*2]=0; b[i*2+1]=1; }
    return b;
  };

  const [board, setBoard] = useState(initBoard);
  const [turn, setTurn] = useState(0);
  const [roll, setRoll] = useState(null);
  const [rolled, setRolled] = useState(false);
  const [over, setOver] = useState(null);
  const [status, setStatus] = useState('Ваш хід! Киньте палички.');
  const [thinking, setThinking] = useState(false);
  const [escaped, setEscaped] = useState([0,0]);

  const canMove = useCallback((b, from, dist, player) => {
    if(b[from]!==player) return false;
    const to = from + dist;
    if(to >= SQUARES) return true; // exit
    if(b[to]===player) return false; // own piece
    // Can't land on 2+ opponent pieces in sequence
    if(b[to]!==null && to>0 && b[to-1]===b[to] && b[to]!==player) return false;
    return true;
  }, []);

  const getValidMoves = useCallback((b, player, dist) => {
    const moves = [];
    for(let i=0;i<SQUARES;i++) {
      if(b[i]===player && canMove(b,i,dist,player)) moves.push(i);
    }
    return moves;
  }, [canMove]);

  const applyMove = useCallback((b, from, dist, player) => {
    const nb = [...b];
    const to = from + dist;
    nb[from] = null;
    if(to >= SQUARES) return {nb, exited:true, sq:to}; // piece exits
    const sq = SPECIAL[to];
    if(sq==='water') { nb[15]=player; return {nb, exited:false, sq:'water'}; } // go to house of rebirth
    if(nb[to]!==null && nb[to]!==player) {
      // capture: swap
      nb[from] = nb[to]; nb[to] = player;
    } else {
      nb[to] = player;
    }
    return {nb, exited:false, sq};
  }, [SPECIAL]);

  const doAIMove = useCallback((b, dist) => {
    const moves = getValidMoves(b, 1, dist);
    if(!moves.length) return null;
    // prefer moves that exit, then moves that capture, then furthest advance
    let best = moves[0];
    for(const from of moves) {
      const to = from+dist;
      if(to>=SQUARES) { best=from; break; }
      if(b[to]===0) { best=from; break; }
      if(from>best) best=from;
    }
    return best;
  }, [getValidMoves]);

  const handleRoll = useCallback(() => {
    if(rolled || over || thinking) return;
    if(!pvp && turn===1) return;
    const r = rollSticks();
    setRoll(r);
    const moves = getValidMoves(board, turn, r);
    if(!moves.length) {
      setStatus(`Кинуто ${r}. Немає ходів — хід переходить.`);
      setTimeout(() => {
        setTurn(t=>1-t); setRolled(false); setRoll(null);
        setStatus(turn===0?'Хід суперника. Киньте палички.':'Ваш хід! Киньте палички.');
        if(!pvp&&turn===0) {} // pvp: other player rolls
      }, 1200);
    } else {
      setRolled(true);
      setStatus(`Кинуто ${r}. Оберіть фішку для ходу.`);
    }
  }, [rolled, over, thinking, pvp, turn, board, getValidMoves]);

  const handlePieceClick = useCallback((from) => {
    if(!rolled || over || thinking) return;
    if(!pvp && turn===1) return;
    if(!canMove(board, from, roll, turn)) return;
    const {nb, exited} = applyMove(board, from, roll, turn);
    const newEscaped = [...escaped];
    if(exited) newEscaped[turn]++;
    setBoard(nb); setEscaped(newEscaped);
    if(newEscaped[turn]>=PIECES_EACH) {
      setOver(turn);
      setStatus(turn===0?'🏆 Ви перемогли! Ваші фішки пройшли через Дуат!':'💀 Суперник переміг!');
      setRolled(false); setRoll(null); return;
    }
    const next = 1-turn;
    setTurn(next); setRolled(false); setRoll(null);
    if(!pvp&&next===1) {
      setThinking(true); setStatus('Суперник кидає...');
      setTimeout(()=>{
        const r2=rollSticks(); setRoll(r2);
        const aiFrom = doAIMove(nb, r2);
        setTimeout(()=>{
          if(aiFrom!==null) {
            const {nb:nb2,exited:e2}=applyMove(nb,aiFrom,r2,1);
            const ne2=[...newEscaped]; if(e2) ne2[1]++;
            setBoard(nb2); setEscaped(ne2);
            if(ne2[1]>=PIECES_EACH){setOver(1);setStatus('💀 Суперник переміг!');setThinking(false);return;}
          }
          setTurn(0); setStatus(`Суперник кинув ${r2}. Ваш хід! Киньте палички.`); setThinking(false); setRoll(null);
        }, 600);
      }, 600);
    } else setStatus('Наступний хід. Киньте палички.');
  }, [rolled, over, thinking, pvp, turn, board, roll, escaped, canMove, applyMove, doAIMove]);

  const reset = useCallback(()=>{
    setBoard(initBoard()); setTurn(0); setRoll(null); setRolled(false);
    setOver(null); setStatus('Ваш хід! Киньте палички.'); setThinking(false); setEscaped([0,0]);
  },[]);

  return {board,turn,roll,rolled,over,status,thinking,pvp,escaped,handleRoll,handlePieceClick,reset,SPECIAL};
}

function SenetGame() {
  const [mode,setMode] = useState('pvc');
  const {board,turn,roll,rolled,over,status,thinking,pvp,escaped,handleRoll,handlePieceClick,reset,SPECIAL}=useSenet(mode);
  const COLS=10, ROWS=3;
  const cellW = Math.min(44, (typeof window!=='undefined'?window.innerWidth-60:440)/COLS);

  const getPos = (idx) => {
    // S-shape: row0 left-to-right (0-9), row1 right-to-left (10-19), row2 left-to-right (20-29)
    if(idx<10) return {row:0,col:idx};
    if(idx<20) return {row:1,col:19-idx};
    return {row:2,col:idx-20};
  };

  const specialBg = {rebirth:'rgba(80,180,80,.15)',happiness:'rgba(80,200,255,.15)',
    water:'rgba(40,80,200,.2)',cobra3:'rgba(200,60,60,.15)',cobra2:'rgba(200,100,40,.12)'};
  const specialIcon = {rebirth:'𓇋',happiness:'𓂀',water:'𓈗',cobra3:'𓆓𓆓𓆓',cobra2:'𓆓𓆓'};

  return (
    <GameShell title="SENET · 𓏏𓄿𓀀"
      controls={<ModeToggle mode={mode} onChange={m=>{setMode(m);reset();}}/>}
      over={over} overMap={{0:pvp?'⚪ P1 переміг!':'🏆 Ваші фішки пройшли Дуат!',1:pvp?'⚫ P2 переміг!':'💀 Суперник переміг!'}}
      onReset={reset}>
      <GameScoreBar items={[
        {label:'⚪ P1'+(pvp?'':' (Ви)'),val:`вийшло: ${escaped[0]}/${5}`,active:turn===0&&!over},
        {label:'⚫ P2'+(pvp?'':' (ШІ)'),val:`вийшло: ${escaped[1]}/${5}`,active:turn===1&&!over},
        roll?{label:'Кубик',val:`🎲 ${roll}`,active:true}:{label:'',active:false},
      ].filter(x=>x.label||x.val)}/>

      {/* Board */}
      <div style={{background:'linear-gradient(145deg,#c8a030,#8a6810)',
        border:'2px solid rgba(150,100,20,.5)',borderRadius:'8px',padding:'6px',
        boxShadow:'0 8px 24px rgba(0,0,0,.6)'}}>
        {[0,1,2].map(row=>(
          <div key={row} style={{display:'flex',gap:'2px',marginBottom:row<2?'2px':'0'}}>
            {Array.from({length:COLS},(_,col)=>{
              const rawIdx = row===0?col:row===1?19-col:20+col;
              const piece = board[rawIdx];
              const sp = SPECIAL[rawIdx];
              const canClick = rolled && turn===0 && piece===0;
              return (
                <div key={col} onClick={()=>handlePieceClick(rawIdx)}
                  style={{width:cellW,height:cellW,
                    background:sp?specialBg[sp]:'rgba(0,0,0,.1)',
                    border:`1px solid ${canClick?DS.gold:'rgba(0,0,0,.2)'}`,
                    borderRadius:'3px',display:'flex',flexDirection:'column',
                    alignItems:'center',justifyContent:'center',
                    cursor:canClick?'pointer':'default',
                    position:'relative',transition:'border .15s',
                    boxShadow:canClick?`0 0 8px ${DS.gold}44`:'none'}}>
                  {sp&&<div style={{position:'absolute',top:1,fontSize:'.4rem',
                    color:'rgba(0,0,0,.5)',lineHeight:1}}>{specialIcon[sp]}</div>}
                  <div style={{fontFamily:DS.fMono,fontSize:'.4rem',color:'rgba(0,0,0,.4)',
                    position:'absolute',bottom:1}}>{rawIdx+1}</div>
                  {piece!==null&&(
                    <div style={{width:cellW*.65,height:cellW*.65,borderRadius:'50%',
                      background:piece===0?'radial-gradient(circle at 35% 30%,#fff8e0,#d0c060)':
                        'radial-gradient(circle at 35% 30%,#555,#0a0a0a)',
                      boxShadow:piece===0?'0 2px 5px rgba(0,0,0,.5)':'0 2px 5px rgba(0,0,0,.8)',
                      border:canClick?`2px solid ${DS.gold}`:'1.5px solid rgba(200,160,40,.3)'}}/>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Dice */}
      {!over && (
        <div style={{display:'flex',gap:'.8rem',alignItems:'center',justifyContent:'center',flexWrap:'wrap'}}>
          {(!pvp?turn===0:true)&&!rolled&&!thinking&&(
            <button onClick={handleRoll}
              style={{fontFamily:DS.fDisp,fontSize:'.75rem',fontWeight:600,
                padding:'.5rem 1.4rem',borderRadius:'8px',cursor:'pointer',
                background:DS.goldBg2,border:`1px solid ${DS.goldD}`,color:DS.gold2,
                transition:'all .2s',letterSpacing:'.08em'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(212,168,76,.25)';}}
              onMouseLeave={e=>{e.currentTarget.style.background=DS.goldBg2;}}>
              🎲 Кинути палички
            </button>
          )}
          {roll&&<div style={{display:'flex',gap:'4px'}}>
            {Array.from({length:4},(_,i)=>(
              <div key={i} style={{width:20,height:20,borderRadius:'3px',
                background:i<(roll===4?0:roll)?DS.gold:'rgba(255,255,255,.15)',
                border:`1px solid ${DS.goldD}`,transition:'background .2s'}}/>
            ))}
          </div>}
        </div>
      )}
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}


function useChess(mode) {
  const pvp = mode === 'pvp';
  const INIT = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
  ];

  const [board, setBoard] = useState(INIT.map(r=>[...r]));
  const [turn, setTurn] = useState('w');
  const [sel, setSel] = useState(null);
  const [hints, setHints] = useState([]);
  const [over, setOver] = useState(null);
  const [status, setStatus] = useState('\u0425\u0456\u0434 \u0431\u0456\u043b\u0438\u0445 (\u0412\u0438).');
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  const isW = p => p && p === p.toUpperCase();
  const isB = p => p && p !== p.toUpperCase();
  const owned = useCallback((p, c) => c === 'w' ? isW(p) : isB(p), []);

  const getRawMoves = useCallback((b, r, c, col) => {
    const p = b[r][c]; if (!p) return [];
    const mv = [];
    const pt = p.toLowerCase();
    const inB = (r,c) => r>=0&&r<8&&c>=0&&c<8;
    const push = (tr,tc) => { if(inB(tr,tc) && !owned(b[tr][tc],col)) mv.push([tr,tc]); };
    const slide = (dr,dc) => {
      let nr=r+dr,nc=c+dc;
      while(inB(nr,nc)){
        if(owned(b[nr][nc],col)) break;
        mv.push([nr,nc]);
        if(b[nr][nc]) break;
        nr+=dr; nc+=dc;
      }
    };
    const up = col==='w'?-1:1;
    const sr = col==='w'?6:1;
    if(pt==='p'){
      if(inB(r+up,c)&&!b[r+up][c]){
        mv.push([r+up,c]);
        if(r===sr&&!b[r+2*up][c]) mv.push([r+2*up,c]);
      }
      for(const dc of[-1,1]) if(inB(r+up,c+dc)&&b[r+up][c+dc]&&!owned(b[r+up][c+dc],col)) mv.push([r+up,c+dc]);
    }
    else if(pt==='n') for(const[dr,dc] of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) push(r+dr,c+dc);
    else if(pt==='b') { slide(-1,-1);slide(-1,1);slide(1,-1);slide(1,1); }
    else if(pt==='r') { slide(-1,0);slide(1,0);slide(0,-1);slide(0,1); }
    else if(pt==='q') { slide(-1,-1);slide(-1,1);slide(1,-1);slide(1,1);slide(-1,0);slide(1,0);slide(0,-1);slide(0,1); }
    else if(pt==='k') for(const[dr,dc] of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) push(r+dr,c+dc);
    return mv;
  }, [owned]);

  const isInCheck = useCallback((b, col) => {
    const kp = col==='w'?'K':'k';
    let kr=-1,kc=-1;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(b[r][c]===kp){kr=r;kc=c;}
    if(kr<0) return true;
    const opp = col==='w'?'b':'w';
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      if(!owned(b[r][c],opp)) continue;
      if(getRawMoves(b,r,c,opp).some(([mr,mc])=>mr===kr&&mc===kc)) return true;
    }
    return false;
  }, [getRawMoves, owned]);

  const getLegal = useCallback((b, r, c, col) => {
    return getRawMoves(b,r,c,col).filter(([tr,tc])=>{
      const nb=b.map(row=>[...row]); nb[tr][tc]=nb[r][c]; nb[r][c]=null;
      return !isInCheck(nb,col);
    });
  }, [getRawMoves, isInCheck]);

  const evalBoard = useCallback((b) => {
    const v={p:1,n:3,b:3,r:5,q:9,k:0};
    let s=0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const p=b[r][c]; if(!p) continue;
      const val=v[p.toLowerCase()]||0;
      const cb = (p.toLowerCase()==='p'||p.toLowerCase()==='n') ? (0.05*(3.5-Math.abs(r-3.5))*(3.5-Math.abs(c-3.5))) : 0;
      s+=isW(p)?(val+cb):-(val+cb);
    }
    return s;
  },[isW]);

  const minimax = useCallback((b,depth,alpha,beta,maxP)=>{
    if(depth===0) return evalBoard(b);
    const col=maxP?'w':'b';
    const moves=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      if(!owned(b[r][c],col)) continue;
      for(const[tr,tc] of getLegal(b,r,c,col)) moves.push([r,c,tr,tc]);
    }
    if(!moves.length) return isInCheck(b,col)?(maxP?-999:999):0;
    if(maxP){
      let best=-Infinity;
      for(const[r,c,tr,tc] of moves){
        const nb=b.map(row=>[...row]); nb[tr][tc]=nb[r][c]; nb[r][c]=null;
        if((nb[tr][tc]==='P')&&(tr===0)) nb[tr][tc]='Q';
        best=Math.max(best,minimax(nb,depth-1,alpha,beta,false));
        alpha=Math.max(alpha,best); if(beta<=alpha) break;
      }
      return best;
    } else {
      let best=Infinity;
      for(const[r,c,tr,tc] of moves){
        const nb=b.map(row=>[...row]); nb[tr][tc]=nb[r][c]; nb[r][c]=null;
        if((nb[tr][tc]==='p')&&(tr===7)) nb[tr][tc]='q';
        best=Math.min(best,minimax(nb,depth-1,alpha,beta,true));
        beta=Math.min(beta,best); if(beta<=alpha) break;
      }
      return best;
    }
  },[owned,getLegal,evalBoard,isInCheck]);

  const handleClick = useCallback((r,c)=>{
    if(over||thinking) return;
    if(!pvp&&turn==='b') return;
    const p=board[r][c];
    if(sel){
      const mv=hints.find(([hr,hc])=>hr===r&&hc===c);
      if(mv){
        const nb=board.map(row=>[...row]);
        if((board[sel[0]][sel[1]].toLowerCase()==='p')&&(r===0||r===7)) nb[r][c]=turn==='w'?'Q':'q';
        else nb[r][c]=nb[sel[0]][sel[1]];
        nb[sel[0]][sel[1]]=null;
        setBoard(nb); setSel(null); setHints([]); setLastMove([[sel[0],sel[1]],[r,c]]);
        const next=turn==='w'?'b':'w';
        const allMoves=[];
        for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
          if(!owned(nb[rr][cc],next)) continue;
          allMoves.push(...getLegal(nb,rr,cc,next));
        }
        if(!allMoves.length){
          if(isInCheck(nb,next)){ setOver(turn); setStatus('\u041c\u0430\u0442! \u041f\u0435\u0440\u0435\u043c\u043e\u0433\u0430.'); }
          else { setOver('draw'); setStatus('\u041f\u0430\u0442! \u041d\u0456\u0447\u0438\u044f.'); }
          return;
        }
        setTurn(next);
        if(!pvp&&next==='b'){
          setThinking(true); setStatus('\u0428\u0406 \u043e\u0431\u0434\u0443\u043c\u0443\u0454...');
          setTimeout(()=>{
            const bmoves=[];
            for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
              if(!owned(nb[rr][cc],'b')) continue;
              for(const[tr2,tc2] of getLegal(nb,rr,cc,'b')) bmoves.push([rr,cc,tr2,tc2]);
            }
            if(!bmoves.length){setThinking(false);return;}
            let best=Infinity,bestMove=bmoves[Math.floor(Math.random()*bmoves.length)];
            for(const[r0,c0,tr2,tc2] of bmoves){
              const nb2=nb.map(row=>[...row]); nb2[tr2][tc2]=nb2[r0][c0]; nb2[r0][c0]=null;
              if((nb2[tr2][tc2]==='p')&&(tr2===7)) nb2[tr2][tc2]='q';
              const v=minimax(nb2,2,-Infinity,Infinity,true);
              const noisyV = v + (Math.random()*0.1 - 0.05);
              if(noisyV<best){best=noisyV;bestMove=[r0,c0,tr2,tc2];}
            }
            const[r0,c0,tr2,tc2]=bestMove;
            const nb2=nb.map(row=>[...row]); nb2[tr2][tc2]=nb2[r0][c0]; nb2[r0][c0]=null;
            if((nb2[tr2][tc2]==='p')&&(tr2===7)) nb2[tr2][tc2]='q';
            setBoard(nb2); setLastMove([[r0,c0],[tr2,tc2]]);
            const wMoves=[];
            for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
              if(!owned(nb2[rr][cc],'w')) continue;
              wMoves.push(...getLegal(nb2,rr,cc,'w'));
            }
            if(!wMoves.length){
              if(isInCheck(nb2,'w')) { setOver('b'); setStatus('\u0428\u0406 \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0432 \u0432\u0430\u043c \u043c\u0430\u0442!'); }
              else { setOver('draw'); setStatus('\u041f\u0430\u0442! \u041d\u0456\u0447\u0438\u044f!'); }
            } else setStatus('\u0425\u0456\u0434 \u0431\u0456\u043b\u0438\u0445.');
            setTurn('w'); setThinking(false);
          }, 100);
        } else setStatus(next==='w'?'\u0425\u0456\u0434 \u0431\u0456\u043b\u0438\u0445.':'\u0425\u0456\u0434 \u0447\u043e\u0440\u043d\u0438\u0445.');
        return;
      }
      setSel(null); setHints([]);
    }
    if(owned(p,turn)){
      const mv=getLegal(board,r,c,turn);
      if(mv.length){setSel([r,c]);setHints(mv);}
    }
  },[over,thinking,pvp,turn,board,sel,hints,getLegal,isInCheck,owned,minimax]);

  const reset=useCallback(()=>{
    const INIT_R = [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ];
    setBoard(INIT_R);setTurn('w');setSel(null);setHints([]);
    setOver(null);setStatus('\u0425\u0456\u0434 \u0431\u0456\u043b\u0438\u0445 (\u0412\u0438).');setThinking(false);setLastMove(null);
  },[]);

  return{board,turn,sel,hints,over,status,thinking,pvp,lastMove,handleClick,reset};
}

const PIECE_UNICODE = {
  K:'♔', Q:'♕', R:'♖', B:'♗', N:'♘', P:'♙',
  k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟',
};

function ChessGame() {
  const [mode, setMode] = useState('pvc');
  const { board, turn, sel, hints, over, status, thinking, pvp, lastMove, handleClick, reset } = useChess(mode);
  const sz = Math.min(360, typeof window !== 'undefined' ? window.innerWidth - 60 : 360);
  const cell = sz / 8;
  const files = 'abcdefgh';

  return (
    <GameShell title="ШАХИ"
      controls={<ModeToggle mode={mode} onChange={m => { setMode(m); reset(); }}/>}
      over={over} overMap={{ w: pvp ? '♔ Білі перемогли!' : '♔ Ви поставили мат!', b: pvp ? '♚ Чорні перемогли!' : '♚ ШІ поставив мат!', draw: 'Нічия (пат)!' }}
      onReset={reset}>
      <GameScoreBar items={[
        { label: '♔ Білі' + (pvp ? '' : ' (Ви)'), active: turn === 'w' && !over },
        { label: '♚ Чорні' + (pvp ? '' : ' (ШІ)'), active: turn === 'b' && !over },
      ]}/>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {/* Rank labels */}
        <div style={{ display: 'flex', flexDirection: 'column', height: `${sz}px`, justifyContent: 'space-around' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ fontFamily: DS.fMono, fontSize: '.52rem', color: DS.t3, textAlign: 'right', lineHeight: `${cell}px` }}>{8 - i}</div>
          ))}
        </div>
        <div>
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(8, ${cell}px)`,
            gridTemplateRows: `repeat(8, ${cell}px)`,
            border: `2px solid rgba(120,80,20,.4)`,
            borderRadius: '4px', overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,.7)',
          }}>
            {board.map((row, r) => row.map((piece, c) => {
              const light = (r + c) % 2 === 0;
              const isSel = sel && sel[0] === r && sel[1] === c;
              const isHint = hints.some(([hr, hc]) => hr === r && hc === c);
              const isLast = lastMove && (
                (lastMove[0][0] === r && lastMove[0][1] === c) ||
                (lastMove[1][0] === r && lastMove[1][1] === c)
              );
              const bg = isSel ? '#a8740a' : isLast ? (light ? '#e8d060' : '#b8a030') : light ? '#f0d9a0' : '#b58840';
              return (
                <div key={`${r}${c}`} onClick={() => handleClick(r, c)}
                  style={{
                    width: `${cell}px`, height: `${cell}px`,
                    background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', position: 'relative',
                    transition: 'background .1s',
                  }}>
                  {isHint && (
                    <div style={{
                      position: 'absolute', borderRadius: '50%',
                      width: piece ? '90%' : '32%', height: piece ? '90%' : '32%',
                      background: piece ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,.18)',
                      border: piece ? '3px solid rgba(0,0,0,.35)' : 'none',
                      pointerEvents: 'none', zIndex: 1,
                    }}/>
                  )}
                  {piece && (
                    <span style={{
                      fontSize: `${cell * 0.72}px`, lineHeight: 1,
                      color: piece === piece.toUpperCase() ? '#fff' : '#1a1008',
                      textShadow: piece === piece.toUpperCase()
                        ? '0 1px 3px rgba(0,0,0,.8), 0 0 8px rgba(0,0,0,.4)'
                        : '0 1px 2px rgba(255,255,255,.3)',
                      userSelect: 'none', zIndex: 2, position: 'relative',
                      filter: isSel ? 'drop-shadow(0 0 6px rgba(255,200,50,.9))' : 'none',
                      transition: 'filter .15s',
                    }}>
                      {PIECE_UNICODE[piece]}
                    </span>
                  )}
                </div>
              );
            }))}
          </div>
          {/* File labels */}
          <div style={{ display: 'flex', width: `${sz}px`, marginTop: '3px' }}>
            {files.split('').map(f => (
              <div key={f} style={{ width: `${cell}px`, textAlign: 'center', fontFamily: DS.fMono, fontSize: '.52rem', color: DS.t3 }}>{f}</div>
            ))}
          </div>
        </div>
      </div>
      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   DOMINO ENGINE
═══════════════════════════════════════════════════════════ */
function useDomino(mode) {
  const pvp = mode === 'pvp';
  const makeTiles = () => {
    const t = [];
    for (let a = 0; a <= 6; a++) for (let b = a; b <= 6; b++) t.push([a, b]);
    return t;
  };

  const init = () => {
    const deck = makeTiles().sort(() => Math.random() - .5);
    const h0 = deck.splice(0, 7);
    const h1 = deck.splice(0, 7);
    return { hands: [h0, h1], boneyard: deck, chain: [], chainEnds: [null, null], turn: 0, passed: [false, false] };
  };

  const [state, setState] = useState(init);
  const [sel, setSel] = useState(null);
  const [over, setOver] = useState(null);
  const [status, setStatus] = useState('Ваш хід. Оберіть плитку.');
  const [thinking, setThinking] = useState(false);
  const { hands, boneyard, chain, chainEnds, turn, passed } = state;

  const canPlay = (tile, ends) => {
    if (ends[0] === null) return true;
    return tile[0] === ends[0] || tile[1] === ends[0] || tile[0] === ends[1] || tile[1] === ends[1];
  };

  const playTile = useCallback((st, player, tileIdx, side) => {
    const ns = JSON.parse(JSON.stringify(st));
    const tile = ns.hands[player][tileIdx];
    ns.hands[player].splice(tileIdx, 1);
    if (ns.chain.length === 0) {
      ns.chain = [[tile, 'center']];
      ns.chainEnds = [tile[0], tile[1]];
    } else {
      let t = [...tile];
      if (side === 'left') {
        if (t[1] === ns.chainEnds[0]) { ns.chain.unshift([t, 'left']); ns.chainEnds[0] = t[0]; }
        else { ns.chain.unshift([[t[1], t[0]], 'left']); ns.chainEnds[0] = t[1]; }
      } else {
        if (t[0] === ns.chainEnds[1]) { ns.chain.push([t, 'right']); ns.chainEnds[1] = t[1]; }
        else { ns.chain.push([[t[1], t[0]], 'right']); ns.chainEnds[1] = t[0]; }
      }
    }
    ns.passed = [false, false];
    return ns;
  }, []);

  const aiTurn = useCallback((st) => {
    const hand = st.hands[1];
    if (!hand.length) return null;
    // Find best tile
    for (let i = 0; i < hand.length; i++) {
      if (!canPlay(hand[i], st.chainEnds)) continue;
      const t = hand[i];
      const side = st.chainEnds[0] === null ? 'right' :
        (t[0] === st.chainEnds[1] || t[1] === st.chainEnds[1]) ? 'right' : 'left';
      return { idx: i, side };
    }
    return null;
  }, [canPlay]);

  const checkOver = useCallback((st) => {
    if (!st.hands[0].length) return 'p0';
    if (!st.hands[1].length) return 'p1';
    const p0can = st.hands[0].some(t => canPlay(t, st.chainEnds));
    const p1can = st.hands[1].some(t => canPlay(t, st.chainEnds));
    if (!p0can && !p1can && !st.boneyard.length) {
      const s0 = st.hands[0].reduce((a, t) => a + t[0] + t[1], 0);
      const s1 = st.hands[1].reduce((a, t) => a + t[0] + t[1], 0);
      return s0 < s1 ? 'p0' : s1 < s0 ? 'p1' : 'draw';
    }
    return null;
  }, [canPlay]);

  const handlePlay = useCallback((tileIdx, side = 'right') => {
    if (over || thinking || turn !== 0) return;
    const tile = hands[0][tileIdx];
    if (!canPlay(tile, chainEnds)) { setStatus('Ця плитка не підходить!'); return; }
    let ns = playTile(state, 0, tileIdx, side);
    setSel(null);
    const res = checkOver(ns);
    if (res) { setState(ns); setOver(res); setStatus(res === 'p0' ? '🏆 Ви перемогли!' : '💀 Суперник переміг!'); return; }
    ns.turn = 1; setState(ns); setStatus('ШІ думає...');
    setThinking(true);
    setTimeout(() => {
      let ns2 = JSON.parse(JSON.stringify(ns));
      // Draw from boneyard if needed
      while (ns2.boneyard.length && !ns2.hands[1].some(t => canPlay(t, ns2.chainEnds))) {
        ns2.hands[1].push(ns2.boneyard.shift());
      }
      const move = aiTurn(ns2);
      if (move) {
        ns2 = playTile(ns2, 1, move.idx, move.side);
      } else {
        ns2.passed[1] = true;
      }
      const res2 = checkOver(ns2);
      if (res2) { ns2.turn = 0; setState(ns2); setOver(res2); setStatus(res2 === 'p0' ? '🏆 Ви перемогли!' : res2 === 'p1' ? '💀 ШІ переміг!' : 'Нічия!'); setThinking(false); return; }
      // Draw for player if needed
      while (ns2.boneyard.length && !ns2.hands[0].some(t => canPlay(t, ns2.chainEnds))) {
        ns2.hands[0].push(ns2.boneyard.shift());
      }
      ns2.turn = 0; setState(ns2);
      setStatus(`Ваш хід. В руці: ${ns2.hands[0].length} плиток.`);
      setThinking(false);
    }, 700);
  }, [over, thinking, turn, hands, chainEnds, state, playTile, canPlay, aiTurn, checkOver]);

  const handleDraw = useCallback(() => {
    if (over || thinking || turn !== 0 || !boneyard.length) return;
    const ns = JSON.parse(JSON.stringify(state));
    ns.hands[0].push(ns.boneyard.shift());
    setState(ns); setStatus(`Взяли плитку. В руці: ${ns.hands[0].length}.`);
  }, [over, thinking, turn, boneyard, state]);

  const reset = useCallback(() => { setState(init()); setSel(null); setOver(null); setStatus('Ваш хід.'); setThinking(false); }, []);

  return { hands, boneyard, chain, chainEnds, turn, sel, setSel, over, status, thinking, pvp, handlePlay, handleDraw, reset };
}

function DominoTile({ tile, small = false, highlight = false, onClick, style = {} }) {
  const sz = small ? 28 : 38;
  const dot = (n) => {
    const pos = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [75, 25], [25, 75], [75, 75]],
      5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
      6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
      0: [],
    };
    return (pos[n] || []).map(([x, y], i) => (
      <circle key={i} cx={`${x}%`} cy={`${y}%`} r={small ? '9%' : '8%'} fill={highlight ? DS.gold : DS.t1}/>
    ));
  };
  return (
    <div onClick={onClick}
      style={{
        display: 'inline-flex', flexDirection: 'column',
        border: `1.5px solid ${highlight ? DS.gold : DS.brd2}`,
        borderRadius: '4px', overflow: 'hidden',
        background: highlight ? DS.goldBg2 : DS.sur2,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: highlight ? `0 0 10px ${DS.gold}44` : '0 2px 6px rgba(0,0,0,.4)',
        transition: 'all .18s', ...style,
      }}>
      {[tile[0], tile[1]].map((n, i) => (
        <React.Fragment key={i}>
          <svg width={sz} height={sz} viewBox="0 0 100 100"
            style={{ display: 'block', background: 'transparent' }}>
            {dot(n)}
          </svg>
          {i === 0 && <div style={{ height: '1.5px', background: highlight ? DS.gold : DS.brd2 }}/>}
        </React.Fragment>
      ))}
    </div>
  );
}

function DominoGame() {
  const [mode, setMode] = useState('pvc');
  const { hands, boneyard, chain, chainEnds, turn, sel, setSel, over, status, thinking, pvp, handlePlay, handleDraw, reset } = useDomino(mode);
  const [playMode, setPlayMode] = useState(null); // null | 'left' | 'right'

  const myHand = hands[0];
  const chainDisplay = chain.slice(-8); // show last 8 tiles

  return (
    <GameShell title="ДОМІНО · DOUBLE-6"
      controls={<ModeToggle mode={mode} onChange={m => { setMode(m); reset(); }}/>}
      over={over} overMap={{ p0: pvp ? 'Гравець 1 переміг!' : '🏆 Ви перемогли!', p1: pvp ? 'Гравець 2 переміг!' : '💀 ШІ переміг!', draw: 'Нічия!' }}
      onReset={reset}>
      <GameScoreBar items={[
        { label: '👤 Ви', val: `${myHand.length} пл.`, active: turn === 0 && !over },
        { label: '🤖 ШІ', val: `${hands[1]?.length} пл.`, active: turn === 1 && !over },
        { label: '🎴 Банк', val: boneyard.length },
      ]}/>

      {/* Chain */}
      <div style={{
        width: '100%', minHeight: '80px',
        background: DS.bg2, border: `1px solid ${DS.brd}`,
        borderRadius: '10px', padding: '.6rem',
        display: 'flex', alignItems: 'center', gap: '4px',
        overflowX: 'auto', flexWrap: 'nowrap',
      }}>
        {chain.length === 0 ? (
          <div style={{ fontFamily: DS.fSans, fontSize: '.72rem', color: DS.t4, margin: 'auto' }}>
            Поле порожнє — покладіть першу плитку
          </div>
        ) : (
          <>
            {chainDisplay.length < chain.length && (
              <div style={{ fontFamily: DS.fMono, fontSize: '.6rem', color: DS.t4, flexShrink: 0 }}>···</div>
            )}
            {chainDisplay.map(([tile], i) => (
              <DominoTile key={i} tile={tile} small style={{ flexShrink: 0 }}/>
            ))}
          </>
        )}
      </div>

      {/* Ends indicator */}
      {chain.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {[['← Лівий кінець', chainEnds[0]], ['Правий кінець →', chainEnds[1]]].map(([label, val]) => (
            <div key={label} style={{
              fontFamily: DS.fMono, fontSize: '.62rem', color: DS.t2,
              background: DS.sur2, border: `1px solid ${DS.brd}`,
              borderRadius: '6px', padding: '.25rem .6rem',
              display: 'flex', gap: '.4rem', alignItems: 'center',
            }}>
              <span style={{ color: DS.t3 }}>{label}:</span>
              <span style={{ color: DS.gold, fontWeight: 700, fontSize: '.8rem' }}>{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Player hand */}
      <div style={{ width: '100%' }}>
        <div style={{ fontFamily: DS.fMono, fontSize: '.6rem', color: DS.t3, marginBottom: '.4rem', letterSpacing: '.1em' }}>
          ВАШІ ПЛИТКИ ({myHand.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {myHand.map((tile, i) => {
            const canP = chain.length === 0 || tile[0] === chainEnds[0] || tile[1] === chainEnds[0] || tile[0] === chainEnds[1] || tile[1] === chainEnds[1];
            return (
              <DominoTile key={i} tile={tile}
                highlight={sel === i}
                onClick={() => {
                  if (!canP || over || thinking || turn !== 0) return;
                  if (chain.length === 0) { handlePlay(i, 'right'); return; }
                  if (sel === i) { setSel(null); return; }
                  // If only one end matches, auto-play
                  const matchLeft = tile[0] === chainEnds[0] || tile[1] === chainEnds[0];
                  const matchRight = tile[0] === chainEnds[1] || tile[1] === chainEnds[1];
                  if (matchLeft && !matchRight) { handlePlay(i, 'left'); return; }
                  if (matchRight && !matchLeft) { handlePlay(i, 'right'); return; }
                  setSel(i);
                }}
                style={{ opacity: (!canP && turn === 0) ? .4 : 1 }}/>
            );
          })}
        </div>
        {sel !== null && chain.length > 0 && (
          <div style={{ display: 'flex', gap: '.5rem', marginTop: '.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: DS.fSans, fontSize: '.72rem', color: DS.t2, alignSelf: 'center' }}>Покласти:</span>
            {[['Ліворуч ←', 'left'], ['Праворуч →', 'right']].map(([label, side]) => {
              const t = myHand[sel];
              const ok = side === 'left'
                ? (t[0] === chainEnds[0] || t[1] === chainEnds[0])
                : (t[0] === chainEnds[1] || t[1] === chainEnds[1]);
              return ok ? (
                <GameBtn key={side} label={label} onClick={() => handlePlay(sel, side)}/>
              ) : null;
            })}
            <GameBtn label="Скасувати" onClick={() => setSel(null)} variant="ghost"/>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {boneyard.length > 0 && turn === 0 && !over && (
          <GameBtn label={`Взяти з банку (${boneyard.length})`} onClick={() => {}} variant="ghost"/>
        )}
      </div>

      <GameStatus status={status} thinking={thinking}/>
    </GameShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOARD PREVIEWS (for non-playable games)
═══════════════════════════════════════════════════════════ */
function ChessPreview() {
  const INIT = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R'],
  ];
  const sz = Math.min(300, typeof window !== 'undefined' ? window.innerWidth - 60 : 300);
  const cell = sz / 8;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem' }}>
      <div style={{ fontFamily: DS.fMono, fontSize: '.6rem', letterSpacing: '.15em', color: DS.t3 }}>ПОЧАТКОВА ПОЗИЦІЯ</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(8,${cell}px)`, gridTemplateRows: `repeat(8,${cell}px)`, border: `2px solid rgba(120,80,20,.4)`, borderRadius: '3px', overflow: 'hidden' }}>
        {INIT.map((row, r) => row.map((p, c) => (
          <div key={`${r}${c}`} style={{ width: cell, height: cell, background: (r + c) % 2 === 0 ? '#f0d9a0' : '#b58840', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {p && <span style={{ fontSize: cell * 0.7, lineHeight: 1, color: p === p.toUpperCase() ? '#fff' : '#1a1008', textShadow: p === p.toUpperCase() ? '0 1px 3px rgba(0,0,0,.9)' : '0 1px 2px rgba(255,255,255,.3)', userSelect: 'none' }}>{PIECE_UNICODE[p]}</span>}
          </div>
        )))}
      </div>
    </div>
  );
}

function XiangqiPreview() {
  // Chinese chess starting position
  const pieces = [
    {r:0,c:0,p:'車',col:'#c03030'},{r:0,c:1,p:'馬',col:'#c03030'},{r:0,c:2,p:'象',col:'#c03030'},
    {r:0,c:3,p:'士',col:'#c03030'},{r:0,c:4,p:'將',col:'#c03030'},{r:0,c:5,p:'士',col:'#c03030'},
    {r:0,c:6,p:'象',col:'#c03030'},{r:0,c:7,p:'馬',col:'#c03030'},{r:0,c:8,p:'車',col:'#c03030'},
    {r:2,c:1,p:'炮',col:'#c03030'},{r:2,c:7,p:'炮',col:'#c03030'},
    {r:3,c:0,p:'卒',col:'#c03030'},{r:3,c:2,p:'卒',col:'#c03030'},{r:3,c:4,p:'卒',col:'#c03030'},{r:3,c:6,p:'卒',col:'#c03030'},{r:3,c:8,p:'卒',col:'#c03030'},
    {r:9,c:0,p:'車',col:'#1a5a1a'},{r:9,c:1,p:'馬',col:'#1a5a1a'},{r:9,c:2,p:'相',col:'#1a5a1a'},
    {r:9,c:3,p:'仕',col:'#1a5a1a'},{r:9,c:4,p:'帥',col:'#1a5a1a'},{r:9,c:5,p:'仕',col:'#1a5a1a'},
    {r:9,c:6,p:'相',col:'#1a5a1a'},{r:9,c:7,p:'馬',col:'#1a5a1a'},{r:9,c:8,p:'車',col:'#1a5a1a'},
    {r:7,c:1,p:'炮',col:'#1a5a1a'},{r:7,c:7,p:'炮',col:'#1a5a1a'},
    {r:6,c:0,p:'兵',col:'#1a5a1a'},{r:6,c:2,p:'兵',col:'#1a5a1a'},{r:6,c:4,p:'兵',col:'#1a5a1a'},{r:6,c:6,p:'兵',col:'#1a5a1a'},{r:6,c:8,p:'兵',col:'#1a5a1a'},
  ];
  const W = Math.min(280, typeof window !== 'undefined' ? window.innerWidth - 80 : 280);
  const cw = W / 8, ch = W * 10 / 9 / 9;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem' }}>
      <div style={{ fontFamily: DS.fMono, fontSize: '.6rem', letterSpacing: '.15em', color: DS.t3 }}>象棋 · ПОЧАТКОВА ПОЗИЦІЯ</div>
      <div style={{ position: 'relative', width: W, height: W * 10 / 9, background: 'linear-gradient(145deg,#c8a030,#a07820)', border: '2px solid rgba(120,80,20,.5)', borderRadius: '4px', overflow: 'hidden' }}>
        {/* Grid */}
        {Array.from({ length: 9 }, (_, c) => (
          <div key={c} style={{ position: 'absolute', left: c * cw, top: 0, width: 1, height: '100%', background: 'rgba(0,0,0,.4)' }}/>
        ))}
        {Array.from({ length: 10 }, (_, r) => (
          <div key={r} style={{ position: 'absolute', top: r * ch, left: 0, height: 1, width: '100%', background: 'rgba(0,0,0,.4)' }}/>
        ))}
        {/* River */}
        <div style={{ position: 'absolute', top: 4.5 * ch - 8, left: '5%', width: '90%', textAlign: 'center', fontFamily: 'serif', fontSize: '.6rem', color: 'rgba(0,0,0,.5)' }}>楚河　漢界</div>
        {pieces.map((pc, i) => (
          <div key={i} style={{ position: 'absolute', left: pc.c * cw - 10, top: pc.r * ch - 10, width: 20, height: 20, borderRadius: '50%', background: '#f5e8a0', border: `1.5px solid ${pc.col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.55rem', color: pc.col, fontWeight: 700 }}>{pc.p}</div>
        ))}
      </div>
    </div>
  );
}

function ShogiPreview() {
  const INIT = [
    ['l','n','s','g','k','g','s','n','l'],
    [null,'r',null,null,null,null,null,'b',null],
    ['p','p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P','P'],
    [null,'B',null,null,null,null,null,'R',null],
    ['L','N','S','G','K','G','S','N','L'],
  ];
  const names = { k:'王',K:'玉',r:'飛',R:'飛',b:'角',B:'角',g:'金',G:'金',s:'銀',S:'銀',n:'桂',N:'桂',l:'香',L:'香',p:'歩',P:'歩' };
  const sz = Math.min(270, typeof window !== 'undefined' ? window.innerWidth - 80 : 270);
  const cell = sz / 9;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem' }}>
      <div style={{ fontFamily: DS.fMono, fontSize: '.6rem', letterSpacing: '.15em', color: DS.t3 }}>将棋 · ПОЧАТКОВА ПОЗИЦІЯ</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(9,${cell}px)`, gridTemplateRows: `repeat(9,${cell}px)`, border: '2px solid rgba(120,80,20,.5)', background: 'linear-gradient(145deg,#d4a830,#b08020)', overflow: 'hidden' }}>
        {INIT.map((row, r) => row.map((p, c) => (
          <div key={`${r}${c}`} style={{ width: cell, height: cell, border: '1px solid rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: r < 3 ? 'rotate(180deg)' : 'none' }}>
            {p && <span style={{ fontSize: cell * .55, color: '#1a1008', fontWeight: 700, fontFamily: 'serif' }}>{names[p]}</span>}
          </div>
        )))}
      </div>
    </div>
  );
}

function BackgammonPreview() {
  // Starting position: 2@24, 5@13, 3@8, 5@6 (white); 2@1, 5@12, 3@17, 5@19 (black)
  const wPos = {23:2, 12:5, 7:3, 5:5};
  const bPos = {0:2, 11:5, 16:3, 18:5};
  const W = Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 60 : 320);
  const pw = W / 13, ph = W * .55;
  const points = Array.from({length:24}, (_,i) => i);
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'.5rem' }}>
      <div style={{ fontFamily:DS.fMono,fontSize:'.6rem',letterSpacing:'.15em',color:DS.t3 }}>НАРДИ · ПОЧАТКОВА ПОЗИЦІЯ</div>
      <div style={{ width:W,height:ph+4,background:'#2a1808',border:'2px solid rgba(120,60,20,.5)',borderRadius:'6px',position:'relative',overflow:'hidden' }}>
        {/* Top points 12-23 */}
        {[...Array(12)].map((_,i)=>{
          const pt=12+i; const x=i<6?i*pw:(i+1)*pw; const dark=i%2===0;
          return <div key={pt} style={{position:'absolute',left:x,top:0,width:pw-2,height:ph*.4,background:dark?'#8a2020':'#c8a020',clipPath:'polygon(0 0,100% 0,50% 100%)',opacity:.8}}/>;
        })}
        {/* Bottom points 0-11 */}
        {[...Array(12)].map((_,i)=>{
          const pt=11-i; const x=i<6?i*pw:(i+1)*pw; const dark=i%2===0;
          return <div key={pt} style={{position:'absolute',left:x,bottom:0,width:pw-2,height:ph*.4,background:dark?'#8a2020':'#c8a020',clipPath:'polygon(0 100%,100% 100%,50% 0)',opacity:.8}}/>;
        })}
        {/* Bar */}
        <div style={{position:'absolute',left:6*pw,top:0,width:pw,height:ph,background:'rgba(0,0,0,.5)'}}/>
        {/* Pieces */}
        {Object.entries(wPos).map(([pt,cnt])=>{
          const p=parseInt(pt); const top=p>=12; const xi=p>=12?p-12:11-p; const x=(xi<6?xi:(xi+1))*pw+pw*.1;
          return [...Array(cnt)].map((_,i)=>(
            <div key={`w${pt}${i}`} style={{position:'absolute',left:x,top:top?2+i*14:ph-14-i*14,width:pw*.8,height:12,borderRadius:'50%',background:'radial-gradient(circle at 40% 30%,#fff,#d0c080)',border:'1px solid #a08040'}}/>
          ));
        })}
        {Object.entries(bPos).map(([pt,cnt])=>{
          const p=parseInt(pt); const top=p>=12; const xi=p>=12?p-12:11-p; const x=(xi<6?xi:(xi+1))*pw+pw*.1;
          return [...Array(cnt)].map((_,i)=>(
            <div key={`b${pt}${i}`} style={{position:'absolute',left:x,top:top?2+i*14:ph-14-i*14,width:pw*.8,height:12,borderRadius:'50%',background:'radial-gradient(circle at 40% 30%,#666,#1a1008)',border:'1px solid #604020'}}/>
          ));
        })}
      </div>
    </div>
  );
}

function SenetPreview() {
  const W = Math.min(300, typeof window !== 'undefined' ? window.innerWidth - 80 : 300);
  const cw = W / 10, ch = cw * 1.3;
  const special = {4:'𓇋',9:'𓂀',14:'𓏤',19:'𓆑',24:'𓃭',26:'𓄿',28:'𓅓',29:'𓇯'};
  const wPieces = [0,2,4,6,8], bPieces = [1,3,5,7,9];
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'.5rem' }}>
      <div style={{ fontFamily:DS.fMono,fontSize:'.6rem',letterSpacing:'.15em',color:DS.t3 }}>𓂀 SENET · ПОЧАТКОВА ПОЗИЦІЯ</div>
      <div style={{ background:'linear-gradient(145deg,#c8a030,#9a7820)',border:'2px solid rgba(150,100,20,.5)',borderRadius:'6px',padding:'4px',display:'grid',gridTemplateColumns:`repeat(10,${cw}px)`,gridTemplateRows:`repeat(3,${ch}px)`,gap:'1px' }}>
        {Array.from({length:30},(_,i)=>{
          const row=Math.floor(i/10); const col=row%2===0?i%10:9-i%10;
          const cell=row*10+(row%2===0?col:9-col);
          const hasW=wPieces.includes(cell), hasB=bPieces.includes(cell);
          const sym=special[cell];
          return (
            <div key={i} style={{width:cw-1,height:ch-1,background:'rgba(200,160,60,.3)',border:'1px solid rgba(150,100,20,.4)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative'}}>
              {sym&&<span style={{fontSize:'.6rem',color:'rgba(80,40,0,.6)',position:'absolute',bottom:1}}>{sym}</span>}
              {hasW&&<div style={{width:cw*.6,height:cw*.6,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#fff,#d4c040)'}}/>}
              {hasB&&<div style={{width:cw*.6,height:cw*.6,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#555,#1a1008)'}}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}


function ChaturangaPreview() {
  // 4-player setup
  const INIT = [
    ['r','n','b','k',null,null,null,null],
    ['p','p','p','p',null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,'P','P','P','P'],
    [null,null,null,null,'R','N','B','K'],
  ];
  const sz = Math.min(260, typeof window !== 'undefined' ? window.innerWidth - 80 : 260);
  const cell = sz / 8;
  const colors4 = ['#c04040','#4060c0','#40a040','#c0a020'];
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'.5rem' }}>
      <div style={{ fontFamily:DS.fMono,fontSize:'.6rem',letterSpacing:'.15em',color:DS.t3 }}>चतुरङ्ग · 4 ГРАВЦІ</div>
      <div style={{ display:'grid',gridTemplateColumns:`repeat(8,${cell}px)`,gridTemplateRows:`repeat(8,${cell}px)`,border:'2px solid rgba(120,80,20,.4)',overflow:'hidden',background:'#c8a030' }}>
        {INIT.map((row,r)=>row.map((p,c)=>{
          const ci=r<2?0:r>5?2:c<2?3:c>5?1:null;
          return (
            <div key={`${r}${c}`} style={{width:cell,height:cell,border:'1px solid rgba(0,0,0,.2)',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.05)'}}>
              {p&&<span style={{fontSize:cell*.65,lineHeight:1,color:ci!==null?colors4[ci]:'#888',textShadow:'0 1px 3px rgba(0,0,0,.5)'}}>{PIECE_UNICODE[p]||p}</span>}
            </div>
          );
        }))}
      </div>
    </div>
  );
}

function FoxGeesePreview() {
  const SIZE = 5;
  const fox = [[0, 2]];
  const geese = [[2,0],[2,1],[2,2],[2,3],[2,4],[3,0],[3,1],[3,2],[3,3],[3,4],[4,0],[4,1],[4,2],[4,3],[4,4]];
  const W = Math.min(220, typeof window !== 'undefined' ? window.innerWidth - 80 : 220);
  const cell = W / (SIZE - 1);
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'.5rem' }}>
      <div style={{ fontFamily:DS.fMono,fontSize:'.6rem',letterSpacing:'.15em',color:DS.t3 }}>🦊 FOX AND GEESE</div>
      <div style={{ position:'relative',width:W,height:W,background:'linear-gradient(145deg,#c09030,#a07020)',borderRadius:'6px',padding:'0' }}>
        {[[0,0,W,W],[0,W/2,W,W/2],[W/2,0,W/2,W],
          [0,0,W,W/2],[0,W/2,W,0],[W/2,0,0,W],[W/2,0,W,W/2],[0,W/2,W/2,W],[W/2,W/2,W,W],[0,W/2,W/2,0],[W/2,W/2,W,0]].map(([x1,y1,x2,y2],i)=>(
          <svg key={i} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,.4)" strokeWidth="1.5"/>
          </svg>
        ))}
        {fox.map(([r,c],i)=>(
          <div key={`f${i}`} style={{position:'absolute',left:c*cell-9,top:r*cell-9,width:18,height:18,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#e06020,#8a3010)',border:'2px solid #c04010',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem'}}>🦊</div>
        ))}
        {geese.map(([r,c],i)=>(
          <div key={`g${i}`} style={{position:'absolute',left:c*cell-7,top:r*cell-7,width:14,height:14,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#fff,#d0d0e0)',border:'1.5px solid #a0a0c0'}}/>
        ))}
      </div>
    </div>
  );
}

function LatruncPreview() {
  // 8x8 starting position similar to Petteia
  const W = Math.min(260, typeof window !== 'undefined' ? window.innerWidth - 80 : 260);
  const cell = W / 8;
  const whites = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,0],[1,7]];
  const blacks = [[6,0],[6,7],[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7]];
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'.5rem' }}>
      <div style={{ fontFamily:DS.fMono,fontSize:'.6rem',letterSpacing:'.15em',color:DS.t3 }}>LATRUNCULI · ПОЧАТКОВА</div>
      <div style={{ display:'grid',gridTemplateColumns:`repeat(8,${cell}px)`,gridTemplateRows:`repeat(8,${cell}px)`,border:'2px solid rgba(120,60,20,.4)',overflow:'hidden' }}>
        {Array.from({length:8},(_,r)=>Array.from({length:8},(_,c)=>{
          const isW=whites.some(([wr,wc])=>wr===r&&wc===c);
          const isB=blacks.some(([br,bc])=>br===r&&bc===c);
          const light=(r+c)%2===0;
          return (
            <div key={`${r}${c}`} style={{width:cell,height:cell,background:light?'linear-gradient(145deg,#b88840,#986028)':'linear-gradient(145deg,#784810,#381800)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {(isW||isB)&&<div style={{width:cell*.7,height:cell*.7,borderRadius:'50%',background:isW?'radial-gradient(circle at 35% 30%,#fff8e0,#d0b060)':'radial-gradient(circle at 35% 30%,#444,#1a1008)',boxShadow:'0 2px 4px rgba(0,0,0,.6)'}}/>}
            </div>
          );
        }))}
      </div>
    </div>
  );
}

function TabulaPreview() {
  return <BackgammonPreview/>;
}

function GomokuBoardPreview() {
  const N = 15;
  const init = [[7,7,'b'],[7,8,'w']];
  const sz = Math.min(280, typeof window !== 'undefined' ? window.innerWidth - 80 : 280);
  const step = sz / (N - 1);
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'.5rem' }}>
      <div style={{ fontFamily:DS.fMono,fontSize:'.6rem',letterSpacing:'.15em',color:DS.t3 }}>GOMOKU 15×15</div>
      <div style={{ padding:'12px',background:'linear-gradient(145deg,#c09030,#a07020)',borderRadius:'6px' }}>
        <div style={{ position:'relative',width:sz,height:sz }}>
          {Array.from({length:N},(_,i)=>(
            <React.Fragment key={i}>
              <div style={{position:'absolute',left:i*step,top:0,width:1,height:'100%',background:'rgba(0,0,0,.4)'}}/>
              <div style={{position:'absolute',top:i*step,left:0,height:1,width:'100%',background:'rgba(0,0,0,.4)'}}/>
            </React.Fragment>
          ))}
          {[[3,3],[3,11],[11,3],[11,11],[7,7]].map(([r,c])=>(
            <div key={`h${r}${c}`} style={{position:'absolute',width:6,height:6,borderRadius:'50%',background:'rgba(0,0,0,.5)',left:c*step-3,top:r*step-3,pointerEvents:'none'}}/>
          ))}
          {init.map(([r,c,col])=>(
            <div key={`${r}${c}`} style={{position:'absolute',width:step*.85,height:step*.85,borderRadius:'50%',left:c*step-step*.425,top:r*step-step*.425,background:col==='b'?'radial-gradient(circle at 33% 28%,#555,#0a0a0a)':'radial-gradient(circle at 33% 28%,#fff,#ddd)',boxShadow:'1px 2px 5px rgba(0,0,0,.6)'}}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOARD PREVIEW DISPATCH
═══════════════════════════════════════════════════════════ */
function BoardPreview({ previewKey }) {
  const map = {
    chess: <ChessPreview/>,
    xiangqi: <XiangqiPreview/>,
    shogi: <ShogiPreview/>,
    backgammon: <BackgammonPreview/>,
    senet: <SenetPreview/>,
    chaturanga: <ChaturangaPreview/>,
    fox_geese: <FoxGeesePreview/>,
    latrunculi: <LatruncPreview/>,
    tabula: <TabulaPreview/>,
    gomoku_board: <GomokuBoardPreview/>,
  };
  const preview = map[previewKey];
  if (!preview) return null;
  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: DS.sur2, border: `1px solid ${DS.brd}`, borderRadius: '10px' }}>
      <div style={{ fontFamily: DS.fMono, fontSize: '.58rem', letterSpacing: '.18em', color: DS.t4, marginBottom: '.7rem' }}>
        ВІЗУАЛІЗАЦІЯ ДОШКИ
      </div>
      {preview}
    </div>
  );
}

function GameBoard({gameType}){
  const map = {
    petteia:   <PetteiaGame/>,
    go9:       <GoGame/>,
    mancala:   <MancalaGame/>,
    hnefatafl: <HnefataflGame/>,
    draughts:  <DraughtsGame/>,
    reversi:   <ReversiGame/>,
    gomoku:    <GomokuGame/>,
    morris:    <MorrisGame/>,
    alquerque: <AlquerqueGame/>,
    chess:     <ChessGame/>,
    domino:    <DominoGame/>,
    chaturanga:<ChaturangaGame/>,
    fox_geese: <FoxGeeseGame/>,
    senet:     <SenetGame/>,
  };
  return map[gameType]||null;
}

/* ═══════════════════════════════════════════════════════════
   SPLASH
═══════════════════════════════════════════════════════════ */
function Splash({onEnter}){
  const playableCount = GAMES.filter(g=>g.playable).length;
  return(
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',padding:'2rem',
      position:'relative',overflow:'hidden',background:DS.bg0}}>

      {/* Ambient gradient bg */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',
        background:`radial-gradient(ellipse 80% 60% at 50% 30%,rgba(212,168,76,.04) 0%,transparent 70%),
          radial-gradient(ellipse 40% 40% at 20% 60%,rgba(200,72,72,.04) 0%,transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 70%,rgba(120,120,200,.04) 0%,transparent 60%)`}}/>

      {/* Grid lines */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:.4,
        backgroundImage:`linear-gradient(rgba(212,168,76,.03) 1px,transparent 1px),
          linear-gradient(90deg,rgba(212,168,76,.03) 1px,transparent 1px)`,
        backgroundSize:'48px 48px'}}/>

      {/* Content */}
      <div style={{position:'relative',textAlign:'center',maxWidth:'520px',
        animation:'scaleIn .8s cubic-bezier(.16,1,.3,1) both'}}>

        {/* Icon */}
        <div style={{fontSize:'3rem',marginBottom:'1.5rem',
          animation:'float 4s ease-in-out infinite',
          filter:`drop-shadow(0 0 24px ${DS.gold}33)`}}>
          ♔
        </div>

        {/* Title */}
        <h1 style={{fontFamily:DS.fDisp,fontWeight:700,
          fontSize:'clamp(2rem,6vw,3.8rem)',letterSpacing:'.22em',
          lineHeight:1,marginBottom:'.2rem',
          background:`linear-gradient(135deg,${DS.gold3} 0%,${DS.gold} 50%,${DS.goldD} 100%)`,
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
          АТЛАС
        </h1>
        <div style={{fontFamily:DS.fDisp,fontSize:'clamp(.7rem,2vw,1rem)',
          letterSpacing:'.5em',color:DS.t3,marginBottom:'2rem'}}>
          НАСТІЛЬНИХ ІГОР
        </div>

        {/* Divider */}
        <div style={{display:'flex',alignItems:'center',gap:'.8rem',
          justifyContent:'center',marginBottom:'2rem'}}>
          <div style={{height:'1px',flex:1,maxWidth:'80px',
            background:`linear-gradient(90deg,transparent,${DS.goldD})`}}/>
          <div style={{fontFamily:DS.fMono,fontSize:'.55rem',letterSpacing:'.3em',
            color:DS.gold,border:`1px solid ${DS.goldD}55`,
            padding:'.2rem .7rem',borderRadius:'20px',background:DS.goldBg}}>
            SUBIT · WHO × WHERE × WHEN
          </div>
          <div style={{height:'1px',flex:1,maxWidth:'80px',
            background:`linear-gradient(90deg,${DS.goldD},transparent)`}}/>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
          gap:'1rem',marginBottom:'2.5rem'}}>
          {[
            {n:GAMES.length,l:'КЛАСИЧНИХ\nІГОР',c:DS.gold},
            {n:playableCount,l:'З ІГРОВИМ\nСТОЛОМ',c:DS.green},
            {n:'64',l:'SUBIT\nАРХЕТИПИ',c:DS.nigredo},
          ].map(({n,l,c})=>(
            <div key={l} style={{background:DS.sur,border:`1px solid ${DS.brd}`,
              borderRadius:'10px',padding:'1rem .8rem',
              borderTop:`2px solid ${c}44`}}>
              <div style={{fontFamily:DS.fDisp,fontSize:'1.8rem',fontWeight:700,
                color:c,lineHeight:1,marginBottom:'.3rem'}}>{n}</div>
              <div style={{fontFamily:DS.fMono,fontSize:'.48rem',letterSpacing:'.15em',
                color:DS.t4,lineHeight:1.4,whiteSpace:'pre-line'}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Phase pills */}
        <div style={{display:'flex',gap:'.4rem',justifyContent:'center',
          flexWrap:'wrap',marginBottom:'2.5rem'}}>
          {['CITRINITAS','RUBEDO','NIGREDO','ALBEDO'].map(ph=>(
            <div key={ph} style={{fontFamily:DS.fMono,fontSize:'.5rem',
              letterSpacing:'.12em',padding:'.22rem .65rem',borderRadius:'20px',
              background:PHASE_META[ph].bg,border:`1px solid ${PHASE_META[ph].color}44`,
              color:PHASE_META[ph].color}}>
              {ph}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={onEnter}
          style={{fontFamily:DS.fDisp,fontSize:'.85rem',fontWeight:700,
            letterSpacing:'.2em',padding:'1rem 3rem',
            background:`linear-gradient(135deg,${DS.goldBg2},${DS.goldBg})`,
            border:`1px solid ${DS.gold}66`,color:DS.gold2,
            borderRadius:'8px',cursor:'pointer',transition:'all .25s',
            boxShadow:`0 0 40px ${DS.goldBg}`}}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 8px 40px ${DS.goldBg2}`;e.currentTarget.style.borderColor=DS.gold;}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 0 40px ${DS.goldBg}`;e.currentTarget.style.borderColor=DS.gold+'66';}}>
          ВІДКРИТИ АТЛАС
        </button>
      </div>

      {/* Bottom */}
      <div style={{position:'absolute',bottom:'1.5rem',display:'flex',gap:'1.5rem',
        alignItems:'center',fontFamily:DS.fMono,fontSize:'.5rem',
        letterSpacing:'.15em',color:DS.t4}}>
        <span>|SUBIT| = 64</span>
        <span style={{width:'1px',height:'10px',background:DS.brd}}/>
        <span>~3100 до н.е. — XVIII ст.</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════════════ */
function Header({page,setPage,search,setSearch}){
  const playableCount = GAMES.filter(g=>g.playable).length;
  return(
    <header style={{position:'sticky',top:0,zIndex:200,
      background:`${DS.bg1}f0`,backdropFilter:'blur(20px)',
      WebkitBackdropFilter:'blur(20px)',
      borderBottom:`1px solid ${DS.brd}`,
      height:'56px',display:'flex',alignItems:'center',
      padding:'0 1rem',gap:'.8rem'}}>

      {/* Logo */}
      <button onClick={()=>setPage('atlas')}
        style={{display:'flex',alignItems:'center',gap:'.5rem',
          background:'none',border:'none',padding:'.2rem',
          flexShrink:0,cursor:'pointer',borderRadius:'6px',transition:'all .18s'}}
        onMouseEnter={e=>e.currentTarget.style.background=DS.goldBg}
        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
        <span style={{fontSize:'1.2rem',
          filter:`drop-shadow(0 0 8px ${DS.gold}55)`,lineHeight:1}}>♔</span>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
          <span style={{fontFamily:DS.fDisp,fontSize:'.72rem',fontWeight:700,
            letterSpacing:'.2em',color:DS.gold,lineHeight:1}}>АТЛАС</span>
          <span style={{fontFamily:DS.fMono,fontSize:'.38rem',letterSpacing:'.18em',
            color:DS.t4,lineHeight:1.2}}>НАСТІЛЬНИХ ІГОР</span>
        </div>
      </button>

      {/* Search */}
      <div style={{flex:1,maxWidth:'360px',position:'relative',
        display:'flex',alignItems:'center'}}>
        <svg style={{position:'absolute',left:'.65rem',color:DS.t4,
          width:'14px',height:'14px',flexShrink:0,pointerEvents:'none'}}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Пошук ігор, культур, тегів..."
          style={{width:'100%',background:DS.sur,
            border:`1px solid ${DS.brd2}`,borderRadius:'8px',
            padding:'.38rem .8rem .38rem 2.1rem',
            color:DS.t1,fontSize:'.78rem',outline:'none',transition:'all .18s'}}
          onFocus={e=>{e.target.style.borderColor=DS.goldD;e.target.style.background=DS.sur2;}}
          onBlur={e=>{e.target.style.borderColor=DS.brd2;e.target.style.background=DS.sur;}}/>
        {search&&(
          <button onClick={()=>setSearch('')}
            style={{position:'absolute',right:'.5rem',background:'none',border:'none',
              color:DS.t4,padding:'.2rem',lineHeight:1,borderRadius:'4px',
              transition:'color .15s'}}
            onMouseEnter={e=>e.currentTarget.style.color=DS.t2}
            onMouseLeave={e=>e.currentTarget.style.color=DS.t4}>✕</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{display:'flex',gap:'.2rem',marginLeft:'auto',flexShrink:0}}>
        {[['atlas','Атлас'],['subit','SUBIT']].map(([id,label])=>(
          <button key={id} onClick={()=>setPage(id)}
            style={{fontFamily:DS.fSans,fontSize:'.75rem',fontWeight:page===id?600:400,
              padding:'.38rem .9rem',borderRadius:'6px',border:'none',cursor:'pointer',
              background:page===id?DS.sur3:'transparent',
              color:page===id?DS.gold:DS.t2,transition:'all .18s',
              letterSpacing:'.02em'}}>
            {label}
          </button>
        ))}
      </nav>

      {/* Playable badge */}
      <div style={{flexShrink:0,display:'flex',alignItems:'center',gap:'.3rem',
        padding:'.25rem .6rem',background:'rgba(76,175,130,.08)',
        border:'1px solid rgba(76,175,130,.2)',borderRadius:'20px'}}>
        <div style={{width:'6px',height:'6px',borderRadius:'50%',
          background:DS.green,animation:'shimmer 1.8s ease-in-out infinite'}}/>
        <span style={{fontFamily:DS.fMono,fontSize:'.55rem',color:DS.green,
          letterSpacing:'.08em'}}>{playableCount} ігор</span>
      </div>
    </header>
  );
}



/* ═══════════════════════════════════════════════════════════
   GAME CARD
═══════════════════════════════════════════════════════════ */
function GameCard({game,onClick,onPlay}){
  const phase = phaseOf(game.who);
  const pm = PHASE_META[phase];
  const [hov,setHov] = useState(false);
  const code = subitCode(game.who,game.where,game.when);

  return(
    <article
      onClick={()=>onClick(game.id)}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        position:'relative',overflow:'hidden',
        display:'flex',flexDirection:'column',
        background:hov?DS.sur2:DS.sur,
        border:`1px solid ${hov?pm.color+'55':DS.brd}`,
        borderRadius:'12px',cursor:'pointer',
        transition:'all .22s cubic-bezier(.16,1,.3,1)',
        transform:hov?'translateY(-3px)':'none',
        boxShadow:hov?`0 12px 32px rgba(0,0,0,.5),0 0 0 1px ${pm.color}22`:'0 2px 8px rgba(0,0,0,.25)',
      }}>

      {/* Phase bar */}
      <div style={{height:'2px',flexShrink:0,
        background:`linear-gradient(90deg,${pm.color},${pm.color}33)`}}/>

      <div style={{padding:'1rem',flex:1,display:'flex',flexDirection:'column',gap:'.6rem'}}>

        {/* Header row */}
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'.6rem',minWidth:0}}>
            <span style={{fontSize:'1.5rem',flexShrink:0,lineHeight:1,
              filter:hov?`drop-shadow(0 0 10px ${pm.color}88)`:'none',
              transition:'filter .22s'}}>
              {game.emoji}
            </span>
            <div style={{minWidth:0}}>
              <div style={{fontFamily:DS.fSerif,fontSize:'1rem',fontWeight:600,
                color:DS.t1,lineHeight:1.2,
                whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                {game.name}
              </div>
              <div style={{fontFamily:DS.fMono,fontSize:'.52rem',color:DS.t4,
                marginTop:'.15rem',letterSpacing:'.04em'}}>
                {game.era}
              </div>
            </div>
          </div>

          {/* SUBIT badge */}
          <div style={{flexShrink:0,display:'flex',flexDirection:'column',
            alignItems:'flex-end',gap:'.2rem'}}>
            <div style={{fontFamily:DS.fMono,fontSize:'.5rem',letterSpacing:'.12em',
              color:pm.color,padding:'.15rem .45rem',
              background:pm.bg,border:`1px solid ${pm.color}33`,
              borderRadius:'4px'}}>
              {phase.slice(0,4)}
            </div>
            <div style={{fontFamily:DS.fMono,fontSize:'.45rem',color:DS.t4,
              letterSpacing:'.08em'}}>{code}</div>
          </div>
        </div>

        {/* Origin line */}
        <div style={{fontFamily:DS.fSans,fontSize:'.65rem',color:DS.t3,
          display:'flex',gap:'.4rem',flexWrap:'wrap'}}>
          <span>{game.origin}</span>
          <span style={{color:DS.t4}}>·</span>
          <span>{game.players} гравці</span>
          <span style={{color:DS.t4}}>·</span>
          <span>{game.duration}</span>
        </div>

        {/* Excerpt */}
        <p style={{fontFamily:DS.fSans,fontSize:'.75rem',color:DS.t2,
          lineHeight:1.55,flex:1,
          display:'-webkit-box',WebkitLineClamp:2,
          WebkitBoxOrient:'vertical',overflow:'hidden'}}>
          {game.excerpt}
        </p>

        {/* Footer */}
        <div style={{display:'flex',alignItems:'center',gap:'.4rem',
          flexWrap:'wrap',paddingTop:'.4rem',
          borderTop:`1px solid ${DS.brd}`}}>
          {game.tags.slice(0,3).map(t=>(
            <span key={t} style={{fontFamily:DS.fMono,fontSize:'.52rem',
              color:DS.t3,padding:'.18rem .5rem',
              border:`1px solid ${DS.brd2}`,borderRadius:'4px',
              background:DS.bg2}}>
              {t}
            </span>
          ))}
          <div style={{marginLeft:'auto',display:'flex',gap:'.3rem',alignItems:'center'}}>
            {game.playable?(
              <button
                onClick={e=>{e.stopPropagation();onPlay(game.id);}}
                style={{fontFamily:DS.fSans,fontSize:'.65rem',fontWeight:600,
                  padding:'.3rem .75rem',borderRadius:'6px',border:'none',
                  cursor:'pointer',letterSpacing:'.04em',flexShrink:0,
                  background:`${pm.color}22`,color:pm.color,
                  transition:'all .18s',display:'flex',alignItems:'center',gap:'.3rem'}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${pm.color}44`;e.currentTarget.style.transform='scale(1.05)';}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${pm.color}22`;e.currentTarget.style.transform='none';}}>
                <span style={{fontSize:'.6rem'}}>▶</span> Грати
              </button>
            ):game.preview?(
              <span style={{fontFamily:DS.fMono,fontSize:'.52rem',
                color:DS.t4,padding:'.18rem .55rem',
                border:`1px solid ${DS.brd}`,borderRadius:'4px',
                flexShrink:0,letterSpacing:'.04em',
                display:'flex',alignItems:'center',gap:'.25rem'}}>
                <span>⊞</span> Поле
              </span>
            ):null}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════
   FILTER BAR
═══════════════════════════════════════════════════════════ */
function FilterBar({filters,setFilters}){
  const OPTS = {
    who:[
      {v:'ME',label:'ME',sub:'CITRINITAS',c:DS.citrinitas},
      {v:'WE',label:'WE',sub:'RUBEDO',c:DS.rubedo},
      {v:'YOU',label:'YOU',sub:'NIGREDO',c:DS.nigredo},
      {v:'THEY',label:'THEY',sub:'ALBEDO',c:DS.albedo},
    ],
    where:[
      {v:'EAST',label:'EAST',c:DS.teal},
      {v:'SOUTH',label:'SOUTH',c:'#d48c3a'},
      {v:'WEST',label:'WEST',c:DS.nigredo},
      {v:'NORTH',label:'NORTH',c:'#4aaa78'},
    ],
    when:[
      {v:'SPRING',label:'🌱',sub:'SPRING',c:'#6ab84a'},
      {v:'SUMMER',label:'☀',sub:'SUMMER',c:DS.gold},
      {v:'AUTUMN',label:'🍂',sub:'AUTUMN',c:'#c87840'},
      {v:'WINTER',label:'❄',sub:'WINTER',c:'#6890c8'},
    ],
  };
  const toggle=(axis,v)=>setFilters(f=>{
    const cur=f[axis];
    return{...f,[axis]:cur.includes(v)?cur.filter(x=>x!==v):[...cur,v]};
  });
  const any = Object.values(filters).some(a=>a.length>0);
  return(
    <div style={{background:DS.sur,border:`1px solid ${DS.brd}`,
      borderRadius:'10px',padding:'.9rem 1rem',
      display:'flex',flexDirection:'column',gap:'.7rem'}}>
      {[['who','WHO'],['where','WHERE'],['when','WHEN']].map(([axis,label])=>(
        <div key={axis} style={{display:'flex',alignItems:'center',gap:'.6rem',flexWrap:'wrap'}}>
          <span style={{fontFamily:DS.fMono,fontSize:'.55rem',letterSpacing:'.15em',
            color:DS.t4,width:'46px',flexShrink:0,fontWeight:600}}>{label}</span>
          <div style={{display:'flex',gap:'.3rem',flexWrap:'wrap'}}>
            {OPTS[axis].map(({v,label:l,sub,c})=>{
              const on=filters[axis].includes(v);
              return(
                <button key={v} onClick={()=>toggle(axis,v)}
                  style={{fontFamily:DS.fMono,fontSize:'.55rem',letterSpacing:'.08em',
                    padding:'.22rem .65rem',borderRadius:'20px',
                    border:`1px solid ${on?c:DS.brd}`,cursor:'pointer',
                    background:on?`${c}18`:'transparent',
                    color:on?c:DS.t3,transition:'all .15s',
                    display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <span>{l}</span>
                  {sub&&<span style={{fontSize:'.44rem',opacity:.75,letterSpacing:'.05em',marginTop:'.05rem'}}>{sub}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {any&&(
        <button onClick={()=>setFilters({who:[],where:[],when:[]})}
          style={{alignSelf:'flex-start',fontFamily:DS.fSans,fontSize:'.65rem',
            color:DS.t3,background:'none',border:'none',cursor:'pointer',
            padding:'.2rem .3rem',transition:'color .15s'}}
          onMouseEnter={e=>e.currentTarget.style.color=DS.t1}
          onMouseLeave={e=>e.currentTarget.style.color=DS.t3}>
          ✕ Скинути фільтри
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ATLAS PAGE
═══════════════════════════════════════════════════════════ */
function AtlasPage({onOpen,onPlay,search}){
  const [filters,setFilters] = useState({who:[],where:[],when:[]});
  const [sort,setSort] = useState('era');
  const [showFilters,setShowFilters] = useState(false);
  const [onlyPlayable,setOnlyPlayable] = useState(false);
  const [view,setView] = useState('grid'); // 'grid' | 'list'

  const ERA_SCORE = s => {
    const m=s.match(/~?(-?\d+)/);if(!m)return 9999;
    const n=parseInt(m[1]);return s.includes('до н.е')?-n:n;
  };

  const filtered = useMemo(()=>{
    return GAMES.filter(g=>{
      if(onlyPlayable&&!g.playable) return false;
      if(filters.who.length&&!filters.who.includes(g.who)) return false;
      if(filters.where.length&&!filters.where.includes(g.where)) return false;
      if(filters.when.length&&!filters.when.includes(g.when)) return false;
      if(search){
        const q=search.toLowerCase();
        if(!g.name.toLowerCase().includes(q)
          &&!(g.native||'').toLowerCase().includes(q)
          &&!g.origin.toLowerCase().includes(q)
          &&!g.tags.some(t=>t.toLowerCase().includes(q))
          &&!(g.excerpt||'').toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a,b)=>{
      if(sort==='era') return ERA_SCORE(a.era)-ERA_SCORE(b.era);
      if(sort==='name') return a.name.localeCompare(b.name,'uk');
      if(sort==='subit') return subitCode(a.who,a.where,a.when).localeCompare(subitCode(b.who,b.where,b.when));
      return 0;
    });
  },[search,filters,sort,onlyPlayable]);

  const totalPlayable = GAMES.filter(g=>g.playable).length;
  const filteredPlayable = filtered.filter(g=>g.playable).length;
  const activeFilters = Object.values(filters).flat().length;

  return(
    <main style={{maxWidth:'1280px',margin:'0 auto',padding:'1.5rem 1rem 4rem'}}>

      {/* Page header */}
      <div style={{marginBottom:'1.5rem',animation:'fadeUp .4s both'}}>
        <div style={{display:'flex',alignItems:'baseline',gap:'.8rem',marginBottom:'.4rem',flexWrap:'wrap'}}>
          <h1 style={{fontFamily:DS.fDisp,fontWeight:700,
            fontSize:'clamp(1.3rem,3vw,1.9rem)',letterSpacing:'.12em',
            background:`linear-gradient(135deg,${DS.gold2},${DS.gold})`,
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
            АТЛАС ІГОР
          </h1>
          <span style={{fontFamily:DS.fMono,fontSize:'.62rem',color:DS.t4,letterSpacing:'.1em'}}>
            {filtered.length} з {GAMES.length}
          </span>
        </div>
        {/* Quick stats bar */}
        <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
          {[
            {v:filtered.length,l:'знайдено',c:DS.t2},
            {v:filteredPlayable,l:'грабельних',c:DS.green},
            {v:filtered.filter(g=>g.preview&&!g.playable).length,l:'з полем',c:DS.teal},
          ].map(({v,l,c})=>(
            <div key={l} style={{display:'flex',alignItems:'center',gap:'.35rem'}}>
              <span style={{fontFamily:DS.fDisp,fontSize:'.9rem',color:c,fontWeight:600}}>{v}</span>
              <span style={{fontFamily:DS.fSans,fontSize:'.68rem',color:DS.t4}}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:'.5rem',
        marginBottom:'1rem',flexWrap:'wrap',animation:'fadeIn .4s .1s both'}}>

        {/* Playable toggle */}
        <button onClick={()=>setOnlyPlayable(v=>!v)}
          style={{display:'flex',alignItems:'center',gap:'.35rem',
            fontFamily:DS.fSans,fontSize:'.73rem',fontWeight:onlyPlayable?600:400,
            padding:'.4rem .9rem',borderRadius:'8px',border:'none',cursor:'pointer',
            background:onlyPlayable?'rgba(76,175,130,.15)':'transparent',
            color:onlyPlayable?DS.green:DS.t2,
            outline:onlyPlayable?`1px solid rgba(76,175,130,.3)`:'1px solid transparent',
            transition:'all .18s'}}>
          <span style={{width:'7px',height:'7px',borderRadius:'50%',flexShrink:0,
            background:onlyPlayable?DS.green:DS.t4,transition:'background .18s'}}/>
          ▶ Грабельні
        </button>

        {/* Filter toggle */}
        <button onClick={()=>setShowFilters(v=>!v)}
          style={{display:'flex',alignItems:'center',gap:'.35rem',
            fontFamily:DS.fSans,fontSize:'.73rem',fontWeight:400,
            padding:'.4rem .9rem',borderRadius:'8px',border:'none',cursor:'pointer',
            background:showFilters?DS.goldBg:activeFilters?DS.goldBg:'transparent',
            color:showFilters||activeFilters?DS.gold:DS.t2,
            outline:showFilters?`1px solid ${DS.goldD}`:`1px solid ${activeFilters?DS.goldD+'55':'transparent'}`,
            transition:'all .18s'}}>
          ⊞ Фільтри{activeFilters?` (${activeFilters})`:''}
        </button>

        {/* Sort */}
        <div style={{display:'flex',gap:'.2rem',marginLeft:'auto',
          background:DS.sur,border:`1px solid ${DS.brd}`,
          borderRadius:'8px',padding:'3px'}}>
          {[['era','Рік'],['name','Назва'],['subit','SUBIT']].map(([v,l])=>(
            <button key={v} onClick={()=>setSort(v)}
              style={{fontFamily:DS.fSans,fontSize:'.68rem',
                padding:'.3rem .7rem',borderRadius:'6px',border:'none',
                background:sort===v?DS.sur3:'transparent',
                color:sort===v?DS.gold:DS.t3,cursor:'pointer',transition:'all .15s',
                fontWeight:sort===v?500:400}}>
              {l}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{display:'flex',gap:'.15rem',background:DS.sur,
          border:`1px solid ${DS.brd}`,borderRadius:'8px',padding:'3px'}}>
          {[['grid','⊞'],['list','☰']].map(([v,icon])=>(
            <button key={v} onClick={()=>setView(v)}
              style={{width:'30px',height:'28px',border:'none',borderRadius:'5px',
                background:view===v?DS.sur3:'transparent',
                color:view===v?DS.gold:DS.t4,cursor:'pointer',
                fontSize:'.75rem',transition:'all .15s'}}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters&&(
        <div style={{marginBottom:'1rem',animation:'fadeUp .2s both'}}>
          <FilterBar filters={filters} setFilters={setFilters}/>
        </div>
      )}

      {/* Results */}
      {filtered.length===0?(
        <div style={{textAlign:'center',padding:'5rem 2rem',
          display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem'}}>
          <div style={{fontSize:'2.5rem',opacity:.15,fontFamily:DS.fDisp}}>⌕</div>
          <div style={{fontFamily:DS.fSerif,fontSize:'1.1rem',
            fontStyle:'italic',color:DS.t2}}>Нічого не знайдено</div>
          <div style={{fontFamily:DS.fSans,fontSize:'.75rem',color:DS.t4}}>
            Спробуйте інший запит або скиньте фільтри
          </div>
          {(search||activeFilters||onlyPlayable)&&(
            <button onClick={()=>{setFilters({who:[],where:[],when:[]});setOnlyPlayable(false);}}
              style={{fontFamily:DS.fSans,fontSize:'.72rem',color:DS.gold,
                background:DS.goldBg,border:`1px solid ${DS.goldD}`,
                borderRadius:'6px',padding:'.35rem .9rem',cursor:'pointer',
                marginTop:'.5rem'}}>
              Скинути всі фільтри
            </button>
          )}
        </div>
      ):view==='grid'?(
        <div style={{display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(min(300px,100%),1fr))',
          gap:'.9rem',animation:'fadeIn .35s both'}}>
          {filtered.map((g,i)=>(
            <div key={g.id} style={{animation:`fadeUp .3s ${Math.min(i*.04,.5)}s both`}}>
              <GameCard game={g} onClick={onOpen} onPlay={onPlay}/>
            </div>
          ))}
        </div>
      ):(
        /* List view */
        <div style={{display:'flex',flexDirection:'column',gap:'.4rem',
          animation:'fadeIn .35s both'}}>
          {filtered.map((g,i)=>{
            const phase=phaseOf(g.who);
            const pm=PHASE_META[phase];
            return(
              <div key={g.id}
                onClick={()=>onOpen(g.id)}
                style={{display:'flex',alignItems:'center',gap:'1rem',
                  padding:'.7rem 1rem',background:DS.sur,
                  border:`1px solid ${DS.brd}`,borderRadius:'8px',
                  cursor:'pointer',transition:'all .18s',
                  animation:`fadeUp .3s ${Math.min(i*.02,.25)}s both`}}
                onMouseEnter={e=>{e.currentTarget.style.background=DS.sur2;e.currentTarget.style.borderColor=pm.color+'44';}}
                onMouseLeave={e=>{e.currentTarget.style.background=DS.sur;e.currentTarget.style.borderColor=DS.brd;}}>
                <span style={{fontSize:'1.3rem',flexShrink:0}}>{g.emoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:DS.fSerif,fontSize:'.9rem',
                    fontWeight:600,color:DS.t1,
                    whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                    {g.name}
                    {g.native&&<span style={{fontFamily:DS.fSans,fontSize:'.65rem',
                      color:DS.t4,fontWeight:400,marginLeft:'.5rem'}}>{g.native.split(' · ')[0]}</span>}
                  </div>
                  <div style={{fontFamily:DS.fMono,fontSize:'.55rem',color:DS.t4}}>
                    {g.origin} · {g.era}
                  </div>
                </div>
                <div style={{flexShrink:0,display:'flex',gap:'.5rem',alignItems:'center'}}>
                  <span style={{fontFamily:DS.fMono,fontSize:'.5rem',color:pm.color,
                    padding:'.15rem .4rem',background:pm.bg,
                    border:`1px solid ${pm.color}33`,borderRadius:'3px'}}>
                    {phase.slice(0,4)}
                  </span>
                  {g.playable&&(
                    <button onClick={e=>{e.stopPropagation();onPlay(g.id);}}
                      style={{fontFamily:DS.fSans,fontSize:'.62rem',
                        fontWeight:600,padding:'.25rem .6rem',borderRadius:'5px',
                        border:'none',cursor:'pointer',
                        background:`${pm.color}22`,color:pm.color,
                        transition:'all .15s'}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${pm.color}44`}
                      onMouseLeave={e=>e.currentTarget.style.background=`${pm.color}22`}>
                      ▶
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   GAME DETAIL
═══════════════════════════════════════════════════════════ */
function GameDetail({gameId,onBack}){
  const [tab,setTab] = useState('history');
  const [showGame,setShowGame] = useState(false);
  useEffect(()=>setShowGame(false),[gameId]);
  const g = GAMES.find(x=>x.id===gameId);
  if(!g) return <div style={{padding:'2rem',color:DS.t3,fontFamily:DS.fSans}}>Гру не знайдено.</div>;

  const phase = phaseOf(g.who);
  const pm = PHASE_META[phase];
  const code = subitCode(g.who,g.where,g.when);

  return(
    <main style={{maxWidth:'1040px',margin:'0 auto',padding:'1.5rem 1rem 4rem',
      animation:'fadeIn .3s both'}}>

      {/* Back */}
      <button onClick={onBack}
        style={{display:'inline-flex',alignItems:'center',gap:'.4rem',
          fontFamily:DS.fSans,fontSize:'.75rem',color:DS.t2,
          background:'none',border:`1px solid ${DS.brd}`,
          borderRadius:'7px',padding:'.35rem .8rem',cursor:'pointer',
          marginBottom:'1.5rem',transition:'all .18s'}}
        onMouseEnter={e=>{e.currentTarget.style.color=DS.gold;e.currentTarget.style.borderColor=DS.goldD;}}
        onMouseLeave={e=>{e.currentTarget.style.color=DS.t2;e.currentTarget.style.borderColor=DS.brd;}}>
        ← Атлас
      </button>

      <div style={{display:'grid',gridTemplateColumns:'1fr',
        gap:'1.5rem'}}>

        {/* Hero section */}
        <div style={{background:DS.sur,border:`1px solid ${DS.brd}`,
          borderRadius:'14px',overflow:'hidden',
          borderTop:`3px solid ${pm.color}`}}>
          <div style={{padding:'1.5rem',display:'flex',gap:'1.2rem',
            alignItems:'flex-start',flexWrap:'wrap'}}>
            <span style={{fontSize:'3rem',lineHeight:1,flexShrink:0,
              filter:`drop-shadow(0 0 16px ${pm.color}44)`}}>
              {g.emoji}
            </span>
            <div style={{flex:1,minWidth:'200px'}}>
              <div style={{display:'flex',alignItems:'flex-start',
                justifyContent:'space-between',gap:'.8rem',flexWrap:'wrap',marginBottom:'.5rem'}}>
                <div>
                  <h1 style={{fontFamily:DS.fSerif,fontWeight:700,
                    fontSize:'clamp(1.4rem,3vw,2rem)',color:DS.t1,lineHeight:1.15,marginBottom:'.2rem'}}>
                    {g.name}
                  </h1>
                  {g.native&&<div style={{fontFamily:DS.fMono,fontSize:'.6rem',color:DS.t4,
                    letterSpacing:'.04em'}}>{g.native}</div>}
                </div>
                {/* SUBIT card */}
                <div style={{background:pm.bg,border:`1px solid ${pm.color}44`,
                  borderRadius:'8px',padding:'.5rem .8rem',flexShrink:0}}>
                  <div style={{fontFamily:DS.fMono,fontSize:'.45rem',letterSpacing:'.2em',
                    color:DS.t4,marginBottom:'.2rem'}}>SUBIT</div>
                  <div style={{fontFamily:DS.fDisp,fontSize:'.8rem',color:pm.color,
                    letterSpacing:'.1em',fontWeight:600}}>{phase}</div>
                  <div style={{fontFamily:DS.fMono,fontSize:'.55rem',color:DS.t4,marginTop:'.1rem'}}>
                    {code}
                  </div>
                </div>
              </div>

              <p style={{fontFamily:DS.fSans,fontSize:'.85rem',color:DS.t1,
                lineHeight:1.7,marginBottom:'1rem'}}>
                {g.excerpt}
              </p>

              {/* Meta chips */}
              <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap'}}>
                {[
                  {icon:'📅',v:g.era},
                  {icon:'📍',v:g.origin},
                  {icon:'👥',v:g.players+' гравці'},
                  {icon:'⏱',v:g.duration},
                ].map(({icon,v})=>(
                  <div key={v} style={{display:'flex',alignItems:'center',gap:'.3rem',
                    fontFamily:DS.fSans,fontSize:'.68rem',color:DS.t2,
                    padding:'.25rem .6rem',background:DS.sur2,
                    border:`1px solid ${DS.brd}`,borderRadius:'6px'}}>
                    <span style={{fontSize:'.7rem'}}>{icon}</span>
                    <span>{v}</span>
                  </div>
                ))}
                {g.tags.map(t=>(
                  <div key={t} style={{fontFamily:DS.fMono,fontSize:'.55rem',color:DS.t3,
                    padding:'.18rem .55rem',background:DS.bg2,
                    border:`1px solid ${DS.brd}`,borderRadius:'4px'}}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUBIT axis details + actions */}
        <div style={{display:'flex',gap:'1rem',alignItems:'flex-start',flexWrap:'wrap'}}>
          <div style={{background:DS.sur,border:`1px solid ${DS.brd}`,
            borderRadius:'12px',padding:'1rem',display:'flex',flexDirection:'column',gap:'.5rem'}}>
            <div style={{fontFamily:DS.fMono,fontSize:'.55rem',letterSpacing:'.2em',
              color:DS.t4,marginBottom:'.2rem'}}>КЛАСИФІКАЦІЯ SUBIT</div>
            {[
              {axis:'WHO',val:g.who,bits:WHO_BITS[g.who],color:pm.color},
              {axis:'WHERE',val:g.where,bits:WHERE_BITS[g.where],color:DS.teal},
              {axis:'WHEN',val:g.when,bits:WHEN_BITS[g.when],color:DS.citrinitas},
            ].map(({axis,val,bits,color})=>(
              <div key={axis} style={{display:'flex',alignItems:'center',gap:'.6rem',
                padding:'.35rem .6rem',background:DS.sur2,borderRadius:'6px'}}>
                <span style={{fontFamily:DS.fMono,fontSize:'.58rem',color:DS.t4,
                  width:'46px'}}>{axis}</span>
                <span style={{fontFamily:DS.fMono,fontSize:'.7rem',
                  color,fontWeight:600,flex:1}}>{val}</span>
                <span style={{fontFamily:DS.fMono,fontSize:'.6rem',
                  color:DS.t4,letterSpacing:'.1em'}}>{bits}</span>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'space-between',
              padding:'.35rem .6rem',background:DS.bg2,borderRadius:'6px',
              fontFamily:DS.fMono,fontSize:'.58rem',marginTop:'.1rem'}}>
              <span style={{color:DS.t4,letterSpacing:'.1em'}}>КОД SUBIT</span>
              <span style={{color:DS.gold,fontWeight:700,letterSpacing:'.15em'}}>{code}</span>
            </div>
          </div>

          {/* Play button */}
          {g.playable&&(
            <button onClick={()=>setShowGame(v=>!v)}
              style={{fontFamily:DS.fDisp,fontSize:'.75rem',fontWeight:700,
                letterSpacing:'.15em',padding:'.9rem 1.4rem',
                borderRadius:'10px',cursor:'pointer',border:'none',
                background:showGame?pm.color+'33':`${pm.color}22`,
                color:pm.color,transition:'all .22s',
                outline:`1px solid ${pm.color}${showGame?'88':'44'}`,
                display:'flex',flexDirection:'column',alignItems:'center',gap:'.3rem',
                boxShadow:showGame?`0 0 24px ${pm.color}22`:'none'}}
              onMouseEnter={e=>{e.currentTarget.style.background=`${pm.color}44`;e.currentTarget.style.outline=`1px solid ${pm.color}88`;}}
              onMouseLeave={e=>{e.currentTarget.style.background=showGame?pm.color+'33':`${pm.color}22`;e.currentTarget.style.outline=`1px solid ${pm.color}${showGame?'88':'44'}`;;}}>
              <span style={{fontSize:'1.4rem'}}>{showGame?'▼':'▶'}</span>
              <span>{showGame?'СХОВАТИ':'ГРАТИ'}</span>
            </button>
          )}
        </div>

        {/* Game board / Preview */}
        {(showGame||(!g.playable&&g.preview))&&(
          <div style={{animation:'scaleIn .25s both'}}>
            {g.playable&&showGame&&<GameBoard gameType={g.gameType}/>}
            {!g.playable&&g.preview&&(
              <div style={{background:DS.sur,border:`1px solid ${DS.brd}`,
                borderRadius:'12px',padding:'1.2rem'}}>
                <div style={{fontFamily:DS.fMono,fontSize:'.58rem',letterSpacing:'.18em',
                  color:DS.t4,marginBottom:'.8rem',textAlign:'center'}}>
                  ВІЗУАЛІЗАЦІЯ ПОЛЯ · ПОЧАТКОВА ПОЗИЦІЯ
                </div>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <BoardPreview previewKey={g.preview}/>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div style={{background:DS.sur,border:`1px solid ${DS.brd}`,
          borderRadius:'12px',overflow:'hidden'}}>
          <div style={{display:'flex',borderBottom:`1px solid ${DS.brd}`}}>
            {[['history','Історія'],['rules','Правила'],['facts','Факти']].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)}
                style={{fontFamily:DS.fSans,fontSize:'.75rem',fontWeight:tab===id?600:400,
                  padding:'.65rem 1.2rem',border:'none',cursor:'pointer',flex:1,
                  background:'transparent',
                  color:tab===id?DS.gold:DS.t3,
                  borderBottom:`2px solid ${tab===id?DS.gold:'transparent'}`,
                  transition:'all .18s',marginBottom:'-1px'}}>
                {label}
              </button>
            ))}
          </div>

          <div style={{padding:'1.2rem',animation:'fadeIn .2s both'}}>
            {tab==='history'&&(
              <div style={{fontFamily:DS.fSans,fontSize:'.82rem',
                color:DS.t1,lineHeight:1.8}}>
                {g.history||'Інформація відсутня.'}
              </div>
            )}
            {tab==='rules'&&(
              <div style={{fontFamily:DS.fSans,fontSize:'.82rem',
                color:DS.t1,lineHeight:1.8}}>
                {(g.rules||'').split('\n').map((p,i)=>(
                  <p key={i} style={{marginBottom:'.7rem'}}
                    dangerouslySetInnerHTML={{__html:p.replace(/\*\*(.*?)\*\*/g,
                      `<strong style="color:${DS.t1};font-weight:600">$1</strong>`)}}/>
                ))}
              </div>
            )}
            {tab==='facts'&&(
              <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
                {(g.facts||[]).map((fact,i)=>(
                  <div key={i} style={{display:'flex',gap:'.7rem',
                    padding:'.7rem .9rem',background:DS.sur2,
                    border:`1px solid ${DS.brd}`,borderRadius:'8px',
                    transition:'border .18s'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=pm.color+'33'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=DS.brd}>
                    <span style={{fontFamily:DS.fDisp,fontSize:'.62rem',
                      color:pm.color,minWidth:'24px',fontWeight:700,flexShrink:0}}>
                      {String(i+1).padStart(2,'0')}
                    </span>
                    <p style={{fontFamily:DS.fSans,fontSize:'.8rem',
                      color:DS.t1,lineHeight:1.65}}>{fact}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUBIT PAGE
═══════════════════════════════════════════════════════════ */
function SubitPage(){
  const grouped = useMemo(()=>{
    const g={};
    GAMES.forEach(game=>{
      const ph=phaseOf(game.who);
      if(!g[ph]) g[ph]=[];
      g[ph].push(game);
    });
    return g;
  },[]);

  const axes=[
    {k:'WHO',desc:'Субʼєктивна позиція гравця',
     vals:[['ME','10',DS.citrinitas,'CITRINITAS'],['WE','11',DS.rubedo,'RUBEDO'],
           ['YOU','01',DS.nigredo,'NIGREDO'],['THEY','00',DS.albedo,'ALBEDO']]},
    {k:'WHERE',desc:'Просторовий культурний вектор',
     vals:[['EAST','10',DS.teal,'Схід'],['SOUTH','11','#d48c3a','Південь'],
           ['WEST','01',DS.nigredo,'Захід'],['NORTH','00','#4aaa78','Північ']]},
    {k:'WHEN',desc:'Темпоральна якість',
     vals:[['SPRING','10','#6ab84a','Весна'],['SUMMER','11',DS.gold,'Літо'],
           ['AUTUMN','01','#c87840','Осінь'],['WINTER','00','#6890c8','Зима']]},
  ];

  return(
    <main style={{maxWidth:'960px',margin:'0 auto',padding:'1.5rem 1rem 4rem',
      animation:'fadeIn .4s both'}}>

      {/* Header */}
      <div style={{marginBottom:'2rem'}}>
        <h1 style={{fontFamily:DS.fDisp,fontWeight:700,
          fontSize:'clamp(1.3rem,3vw,2rem)',letterSpacing:'.15em',
          background:`linear-gradient(135deg,${DS.gold2},${DS.gold})`,
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
          backgroundClip:'text',marginBottom:'.5rem'}}>
          СИСТЕМА SUBIT
        </h1>
        <div style={{fontFamily:DS.fMono,fontSize:'.78rem',color:DS.t2,
          letterSpacing:'.08em',marginBottom:'1rem'}}>
          SUBIT = WHO × WHERE × WHEN · |SUBIT| = 2⁶ = 64 архетипи
        </div>
        <p style={{fontFamily:DS.fSans,fontSize:'.85rem',color:DS.t1,
          lineHeight:1.75,maxWidth:'640px'}}>
          Шестибітна матриця де кожна гра — унікальний координат у просторі людської взаємодії.
          WHO визначає субʼєкт, WHERE — культурний вектор, WHEN — темпоральну якість.
        </p>
      </div>

      {/* Three axes */}
      <div style={{display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',
        gap:'.8rem',marginBottom:'2rem'}}>
        {axes.map(({k,desc,vals})=>(
          <div key={k} style={{background:DS.sur,border:`1px solid ${DS.brd}`,
            borderRadius:'10px',padding:'.9rem',
            borderTop:`2px solid ${vals[0][2]}44`}}>
            <div style={{fontFamily:DS.fDisp,fontSize:'.7rem',letterSpacing:'.2em',
              color:DS.gold,marginBottom:'.25rem'}}>{k}</div>
            <div style={{fontFamily:DS.fSans,fontSize:'.65rem',color:DS.t3,
              marginBottom:'.7rem',lineHeight:1.4}}>{desc}</div>
            {vals.map(([v,bits,c,label])=>(
              <div key={v} style={{display:'flex',alignItems:'center',
                gap:'.5rem',marginBottom:'.35rem'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',
                  background:c,flexShrink:0}}/>
                <span style={{fontFamily:DS.fMono,fontSize:'.62rem',
                  color:c,flex:1,fontWeight:500}}>{v}</span>
                <span style={{fontFamily:DS.fMono,fontSize:'.58rem',color:DS.t4}}>{bits}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Formula card */}
        <div style={{background:DS.sur,border:`1px solid ${DS.goldD}55`,
          borderRadius:'10px',padding:'.9rem',
          borderTop:`2px solid ${DS.goldD}`,
          display:'flex',flexDirection:'column',justifyContent:'center',gap:'.5rem'}}>
          <div style={{fontFamily:DS.fDisp,fontSize:'.7rem',letterSpacing:'.2em',color:DS.gold}}>
            ФОРМУЛА
          </div>
          <div style={{fontFamily:DS.fMono,fontSize:'.9rem',color:DS.gold2,letterSpacing:'.08em'}}>
            b₁b₂ · b₃b₄ · b₅b₆
          </div>
          <div style={{fontFamily:DS.fMono,fontSize:'.62rem',color:DS.t3}}>
            WHO × WHERE × WHEN
          </div>
          <div style={{height:'1px',background:DS.brd,margin:'.2rem 0'}}/>
          <div style={{fontFamily:DS.fDisp,fontSize:'1.2rem',color:DS.gold,fontWeight:700}}>
            |SUBIT| = 64
          </div>
          <div style={{fontFamily:DS.fMono,fontSize:'.55rem',color:DS.t4}}>
            2² × 2² × 2² = 64 архетипи
          </div>
        </div>
      </div>

      {/* 4 phases */}
      <h2 style={{fontFamily:DS.fDisp,fontSize:'.85rem',letterSpacing:'.2em',
        color:DS.t2,marginBottom:'1rem'}}>
        ЧОТИРИ АЛХІМІЧНІ ФАЗИ
      </h2>
      <div style={{display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',
        gap:'.8rem',marginBottom:'2.5rem'}}>
        {[
          {k:'CITRINITAS',desc:'Індивідуальна сила, схід сонця, пробудження. Ігри де стратег самотній.'},
          {k:'RUBEDO',    desc:'Колективна енергія, зеніт. Ігри де "Ми" формують альянси.'},
          {k:'NIGREDO',   desc:'Діалог Я-Ти, захід, трансформація. Дуельні ігри, поєдинок.'},
          {k:'ALBEDO',    desc:'Деперсоналізований потік, зима. Гравці як вузли механізму.'},
        ].map(({k,desc})=>{
          const pm=PHASE_META[k];
          const cnt=(grouped[k]||[]).length;
          return(
            <div key={k} style={{background:pm.bg,
              border:`1px solid ${pm.color}44`,borderRadius:'10px',
              padding:'1rem',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',right:'.8rem',top:'.8rem',
                fontFamily:DS.fMono,fontSize:'.52rem',
                color:pm.color+'88'}}>{cnt} ігор</div>
              <div style={{fontFamily:DS.fDisp,fontSize:'.85rem',letterSpacing:'.12em',
                color:pm.color,marginBottom:'.2rem'}}>{k}</div>
              <div style={{fontFamily:DS.fMono,fontSize:'.48rem',color:pm.color+'88',
                marginBottom:'.6rem',letterSpacing:'.1em'}}>
                {pm.label}
              </div>
              <p style={{fontFamily:DS.fSans,fontSize:'.72rem',
                color:DS.t1,lineHeight:1.6}}>{desc}</p>
            </div>
          );
        })}
      </div>

      {/* Games by phase */}
      <h2 style={{fontFamily:DS.fDisp,fontSize:'.85rem',letterSpacing:'.2em',
        color:DS.t2,marginBottom:'1rem'}}>
        ІГРИ ЗА ФАЗАМИ
      </h2>
      <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
        {['CITRINITAS','RUBEDO','NIGREDO','ALBEDO'].map(ph=>{
          const pm=PHASE_META[ph];
          const games=grouped[ph]||[];
          return(
            <div key={ph} style={{background:DS.sur,border:`1px solid ${pm.color}33`,
              borderRadius:'10px',overflow:'hidden'}}>
              <div style={{background:pm.bg,padding:'.55rem 1rem',
                borderBottom:`1px solid ${pm.color}33`,
                display:'flex',alignItems:'center',gap:'.6rem'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:pm.color}}/>
                <span style={{fontFamily:DS.fDisp,fontSize:'.72rem',
                  letterSpacing:'.15em',color:pm.color}}>{ph}</span>
                <span style={{fontFamily:DS.fMono,fontSize:'.55rem',
                  color:pm.color+'88',marginLeft:'auto'}}>{games.length} ігор</span>
              </div>
              <div style={{padding:'.6rem',display:'flex',flexWrap:'wrap',gap:'.4rem'}}>
                {games.map(g=>(
                  <div key={g.id} style={{display:'flex',alignItems:'center',gap:'.4rem',
                    padding:'.3rem .6rem',background:DS.sur2,
                    border:`1px solid ${DS.brd}`,borderRadius:'6px'}}>
                    <span style={{fontSize:'.85rem'}}>{g.emoji}</span>
                    <span style={{fontFamily:DS.fSerif,fontSize:'.72rem',color:DS.t1,fontWeight:500}}>
                      {g.name}
                    </span>
                    {g.playable&&<span style={{fontFamily:DS.fMono,fontSize:'.48rem',
                      color:DS.green,padding:'.08rem .3rem',
                      background:'rgba(76,175,130,.1)',borderRadius:'3px'}}>
                      ▶
                    </span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default function App(){
  const [splash,setSplash] = useState(true);
  const [page,setPage] = useState('atlas');
  const [openGame,setOpenGame] = useState(null);
  const [search,setSearch] = useState('');

  useEffect(()=>{
    const s=document.createElement('style');
    s.textContent=GLOBAL_CSS;
    document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);

  const handleOpen = useCallback(id=>{setOpenGame(id);setPage('detail');},[]);
  const handleBack = useCallback(()=>{setOpenGame(null);setPage('atlas');},[]);
  const navTo = useCallback(p=>{setPage(p);if(p!=='detail')setOpenGame(null);},[]);

  if(splash) return <Splash onEnter={()=>setSplash(false)}/>;

  return(
    <div style={{minHeight:'100vh',background:DS.bg0}}>
      <Header
        page={page==='detail'?'atlas':page}
        setPage={navTo}
        search={search}
        setSearch={setSearch}
      />
      {page==='atlas'&&<AtlasPage onOpen={handleOpen} onPlay={handleOpen} search={search}/>}
      {page==='detail'&&openGame&&<GameDetail gameId={openGame} onBack={handleBack}/>}
      {page==='subit'&&<SubitPage/>}
    </div>
  );
}
