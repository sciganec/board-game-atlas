# 🎲 Атлас Настільних Ігор · SUBIT

> Всесвітній атлас настільних ігор, структурований за системою SUBIT — від Сенету (~3100 до н.е.) до Azul (2017).

**[▶ Грати онлайн](https://sciganec.github.io/board-game-atlas/)**

---

## Що це?

Інтерактивний атлас 36 настільних ігор з усього світу та різних епох. Кожна гра класифікована за системою **SUBIT** — шестибітною матрицею з 64 архетипами.

### Ігрові столи (9 ігор проти ШІ)

| Гра | Епоха | ШІ |
|-----|-------|----|
| 🏺 Πεττεία | ~VIII ст. до н.е. | Мінімакс α-β, глибина 4 |
| ⚫ Go 9×9 | ~2000 до н.е. | Захоплення груп, правило Ко |
| 🟤 Mancala | ~700 н.е. | Евристика підрахунку |
| 🪓 Hnefatafl 7×7 | ~400 н.е. | Позиційний бот |
| ⬛ Шашки 8×8 | ~XII ст. | Мінімакс α-β, глибина 4 |
| ⬡ Reversi/Othello | 1880 | Мінімакс + кутова евристика |
| 5️⃣ Gomoku | ~XVII ст. | Блокування/загрози, оцінка ліній |
| ⭕ Nine Men's Morris | ~1400 до н.е. | Три фази: розстановка→хід→польоти |
| ✦ Alquerque | ~1400 до н.е. | Обов'язкові стрибки |

### Каталог (36 ігор)

Від Стародавнього Єгипту до сучасності:
- **Стародавній Схід:** Πεττεία, Go, Liubo, Xiangqi, Shogi, Shatranj, Chaturanga
- **Африка/Середземномор'я:** Senet, Mancala, Ayò, Ludus Latrunculorum, Tabula
- **Захід:** Chess, Draughts, Backgammon, Nine Men's Morris, Alquerque, Reversi, Gomoku, Hex та інші
- **Північ:** Hnefatafl, Tablut, Fox and Geese, Brandubh
- **Сучасні:** Hive, Santorini, Quoridor, Azul, Carcassonne, Ticket to Ride та інші

---

## Система SUBIT

```
SUBIT = WHO × WHERE × WHEN
|SUBIT| = |{0,1}⁶| = 64 архетипи
```

| Вісь | Значення | Біти |
|------|----------|------|
| **WHO** | ME / WE / YOU / THEY | b1b2 |
| **WHERE** | EAST / SOUTH / WEST / NORTH | b3b4 |
| **WHEN** | SPRING / SUMMER / AUTUMN / WINTER | b5b6 |

Чотири алхімічні фази:
- 🟡 **CITRINITAS** = ME · EAST · SPRING = `10`
- 🔴 **RUBEDO** = WE · SOUTH · SUMMER = `11`
- 🔵 **NIGREDO** = YOU · WEST · AUTUMN = `01`
- ⚪ **ALBEDO** = THEY · NORTH · WINTER = `00`

---

## Локальний запуск

```bash
# Клонувати репозиторій
git clone https://github.com/sciganec/board-game-atlas.git
cd board-game-atlas

# Встановити залежності
npm install

# Зібрати проект
npm run build

# Відкрити у браузері
open dist/index.html
# або
npx serve dist
```

### Залежності
- **React 18** — UI
- **esbuild** — збірка (< 1 секунда)
- Немає інших залежностей. Один HTML-файл.

---

## Деплой на GitHub Pages

1. Fork або клонуй репозиторій
2. Увімкни **GitHub Pages** у Settings → Pages → Source: **GitHub Actions**
3. Push у гілку `main` — деплой запускається автоматично
4. Сайт буде доступний за адресою `https://sciganec.github.io/board-game-atlas/`

---

## Структура проекту

```
board-game-atlas/
├── src/
│   ├── App.jsx          # Головний компонент (36 ігор, 9 рушіїв)
│   └── index.jsx        # React entry point
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions → Pages
├── build.js             # esbuild скрипт
├── package.json
└── README.md
```

---

## Технічні деталі

- **Збірка:** esbuild `--jsx=automatic`, bundled + minified, ~434 KB
- **Без CDN:** React і ReactDOM вбудовані у бандл
- **Один файл:** `dist/index.html` — можна відкрити подвійним кліком
- **React 18** з хуками (`useState`, `useCallback`, `useMemo`, `useRef`)
- **ШІ:** Мінімакс з α-β відсіченням для Петтеї, Шашок, Reversi

---

