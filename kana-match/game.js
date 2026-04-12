// ─── Data ─────────────────────────────────────────────────────────────────────

const KANA = [
  ["あ","ア"], ["い","イ"], ["う","ウ"], ["え","エ"], ["お","オ"],
  ["か","カ"], ["き","キ"], ["く","ク"], ["け","ケ"], ["こ","コ"],
  ["さ","サ"], ["し","シ"], ["す","ス"], ["せ","セ"], ["そ","ソ"],
  ["た","タ"], ["ち","チ"], ["つ","ツ"], ["て","テ"], ["と","ト"],
  ["な","ナ"], ["に","ニ"], ["ぬ","ヌ"], ["ね","ネ"], ["の","ノ"],
  ["は","ハ"], ["ひ","ヒ"], ["ふ","フ"], ["へ","ヘ"], ["ほ","ホ"],
  ["ま","マ"], ["み","ミ"], ["む","ム"], ["め","メ"], ["も","モ"],
  ["や","ヤ"], ["ゆ","ユ"], ["よ","ヨ"],
  ["ら","ラ"], ["り","リ"], ["る","ル"], ["れ","レ"], ["ろ","ロ"],
  ["わ","ワ"], ["を","ヲ"], ["ん","ン"],
];

const ROM = {
  "あ":"a",   "い":"i",   "う":"u",   "え":"e",   "お":"o",
  "か":"ka",  "き":"ki",  "く":"ku",  "け":"ke",  "こ":"ko",
  "さ":"sa",  "し":"shi", "す":"su",  "せ":"se",  "そ":"so",
  "た":"ta",  "ち":"chi", "つ":"tsu", "て":"te",  "と":"to",
  "な":"na",  "に":"ni",  "ぬ":"nu",  "ね":"ne",  "の":"no",
  "は":"ha",  "ひ":"hi",  "ふ":"fu",  "へ":"he",  "ほ":"ho",
  "ま":"ma",  "み":"mi",  "む":"mu",  "め":"me",  "も":"mo",
  "や":"ya",  "ゆ":"yu",  "よ":"yo",
  "ら":"ra",  "り":"ri",  "る":"ru",  "れ":"re",  "ろ":"ro",
  "わ":"wa",  "を":"wo",  "ん":"n",
};

const COLORS = ["#ff6b6b", "#ffa94d", "#74c0fc", "#8ce99a", "#da77f2"];

// ─── Config ───────────────────────────────────────────────────────────────────

const ROUND_SIZE = 5;

const TIMING = {
  FOCUS_DELAY:        30,   // ms before focusing a newly revealed input
  WRONG_CLEAR:       450,   // ms to hold the wrong-shake animation
  CELEBRATION_DELAY: 200,   // ms pause before the celebration overlay appears
  CELEBRATION_HOLD: 1800,   // ms the celebration overlay is shown
  GRID_OUT_DELAY:    500,   // ms after grid fade-out before starting a new round
  SURRENDER_HOLD:   1500,   // ms the surrender reveal overlay is shown
};

// ─── Persisted options ────────────────────────────────────────────────────────

const opts = { col1: 'hira', mode: 'full' };
try { const s = localStorage.getItem('kana-opts'); if (s) Object.assign(opts, JSON.parse(s)); } catch (_) {}
function saveOpts() { try { localStorage.setItem('kana-opts', JSON.stringify(opts)); } catch (_) {} }

// ─── State ────────────────────────────────────────────────────────────────────

const state = {
  round:        null,
  selectedH:    null,
  selectedK:    null,
  matched:      {},
  wrongH:       null,
  wrongK:       null,
  romajiVals:   {},
  romajiOk:     {},
  score:        0,
  streak:       0,
  roundNum:     0,
  surrendered:  false,
  settingsOpen: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Game logic ───────────────────────────────────────────────────────────────

function pickRound() {
  const pairs = shuffle(KANA).slice(0, ROUND_SIZE);
  return {
    left:  shuffle(pairs.map(p => p[0])),
    right: shuffle(pairs.map(p => p[1])),
    pairs: Object.fromEntries(pairs),
    rev:   Object.fromEntries(pairs.map(([h, k]) => [k, h])),
  };
}

function newRound() {
  state.round      = pickRound();
  state.selectedH  = null;
  state.selectedK  = null;
  state.matched    = {};
  state.wrongH     = null;
  state.wrongK     = null;
  state.romajiVals = {};
  state.romajiOk   = {};
  state.surrendered = false;
  state.roundNum++;
  render();
}

function recordMatch(hi, k) {
  state.matched[hi] = Object.keys(state.matched).length;
  state.score++;
  state.streak++;
  state.selectedH = null;
  state.selectedK = null;
  render();
  if (opts.mode === 'fast') {
    checkComplete();
  } else {
    const inp = $('r_' + k);
    if (inp) setTimeout(() => inp.focus(), TIMING.FOCUS_DELAY);
  }
}

function recordWrong(hi, k) {
  state.wrongH    = hi;
  state.wrongK    = k;
  state.streak    = 0;
  state.selectedH = null;
  state.selectedK = null;
  render();
  setTimeout(() => { state.wrongH = null; state.wrongK = null; render(); }, TIMING.WRONG_CLEAR);
}

function handleHiraTap(hi) {
  if (state.matched[hi] !== undefined) return;
  if (state.selectedK !== null) {
    const k = state.selectedK;
    if (state.round.pairs[hi] === k) recordMatch(hi, k);
    else recordWrong(hi, k);
  } else {
    state.selectedH = hi;
    state.selectedK = null;
    state.wrongH    = null;
    state.wrongK    = null;
    render();
  }
}

function handleKataTap(k) {
  const kHira = state.round.rev[k];
  if (state.matched[kHira] !== undefined) return;
  if (state.selectedH !== null) {
    if (state.round.pairs[state.selectedH] === k) recordMatch(state.selectedH, k);
    else recordWrong(state.selectedH, k);
  } else {
    state.selectedK = k;
    state.selectedH = null;
    state.wrongH    = null;
    state.wrongK    = null;
    render();
  }
}

function handleSurrender(k) {
  const hi     = state.round.rev[k];
  const romaji = ROM[hi];
  state.streak      = 0;
  state.surrendered = true;

  // Dismiss the mobile keyboard before the overlay appears
  const inp = $('r_' + k);
  if (inp) inp.blur();

  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="inner">
    <div class="surrender-pair">
      <span class="surrender-char">${hi}</span>
      <span class="surrender-char">${k}</span>
    </div>
    <div class="surrender-romaji">${romaji}</div>
  </div>`;
  $('app').appendChild(ov);

  setTimeout(() => {
    ov.remove();
    state.romajiOk[k]   = true;
    state.romajiVals[k] = romaji;
    render();
    checkComplete();
    const next = state.round.right.find(rk =>
      rk !== k &&
      state.matched[state.round.rev[rk]] !== undefined &&
      !state.romajiOk[rk]
    );
    if (next) {
      const ni = $('r_' + next);
      if (ni) setTimeout(() => ni.focus(), TIMING.FOCUS_DELAY);
    }
  }, TIMING.SURRENDER_HOLD);
}

function handleRomajiInput(inp) {
  const k = inp.dataset.k;

  if (inp.value.includes('?')) {
    inp.value = '';
    state.romajiVals[k] = '';
    handleSurrender(k);
    return;
  }

  const clean  = inp.value.toLowerCase().replace(/[^a-z]/g, '');
  inp.value    = clean;
  state.romajiVals[k] = clean;

  const correct = ROM[state.round.rev[k]];

  if (clean === correct) {
    state.romajiOk[k] = true;
    state.score++;
    render();
    checkComplete();
    const next = state.round.right.find(rk =>
      rk !== k &&
      state.matched[state.round.rev[rk]] !== undefined &&
      !state.romajiOk[rk]
    );
    if (next) {
      const ni = $('r_' + next);
      if (ni) setTimeout(() => ni.focus(), TIMING.FOCUS_DELAY);
    }
  } else if (clean.length >= correct.length) {
    state.streak = 0;
    inp.classList.add('wrong');
    setTimeout(() => { state.romajiVals[k] = ''; render(); }, TIMING.WRONG_CLEAR);
  }
}

function checkComplete() {
  const matchCount = Object.keys(state.matched).length;
  const romCount   = Object.keys(state.romajiOk).length;
  const done = opts.mode === 'fast'
    ? matchCount === ROUND_SIZE
    : matchCount === ROUND_SIZE && romCount === ROUND_SIZE;
  if (!done) return;

  setTimeout(() => {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    const perfect = !state.surrendered;
    ov.innerHTML = `<div class="inner">
      <div class="emoji">${perfect ? '✨' : '💪'}</div>
      <div class="title">${perfect ? '完璧!' : 'Good job!'}</div>
      <div class="desc">${perfect ? 'Perfect round!' : 'Keep at it!'}</div>
    </div>`;
    $('app').appendChild(ov);

    setTimeout(() => {
      const grid = $('grid');
      if (grid) grid.classList.add('out');
      setTimeout(newRound, TIMING.GRID_OUT_DELAY);
    }, TIMING.CELEBRATION_HOLD);
  }, TIMING.CELEBRATION_DELAY);
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function renderRomajiCell(k, hi, matchColor, matchColorHex) {
  const rDone = state.romajiOk[k];
  if (rDone) {
    return `<div class="romaji-done" style="background:${matchColorHex}">${ROM[hi]}</div>`;
  }
  return `<input class="romaji" id="r_${k}" data-k="${k}"
    style="border-color:${matchColor}55"
    placeholder="···"
    value="${state.romajiVals[k] || ''}"
    autocomplete="off" autocapitalize="off" spellcheck="false">`;
}

function renderRow(k, ri) {
  const { round, matched, selectedH, selectedK, wrongH, wrongK } = state;
  const hi    = round.left[ri];
  const kHira = round.rev[k];
  const hM    = matched[hi] !== undefined;
  const kM    = matched[kHira] !== undefined;
  const hCol  = hM ? COLORS[matched[hi]] : '';
  const kCol  = kM ? COLORS[matched[kHira]] : '';

  const hCls = ['tile', selectedH === hi && 'sel', hM && 'matched', wrongH === hi && 'wrong-h'].filter(Boolean).join(' ');
  const kCls = ['tile', selectedK === k  && 'sel', kM && 'matched', wrongK === k  && 'wrong-k'].filter(Boolean).join(' ');

  const hCell = `<div class="cell">
    <button class="${hCls}" style="${hM ? `background:${hCol};color:#fff` : ''}" data-h="${hi}">${hi}</button>
  </div>`;
  const kCell = `<div class="cell">
    <button class="${kCls}" style="${kM ? `background:${kCol};color:#fff` : ''}" data-k="${k}">${k}</button>
  </div>`;

  let romajiCell;
  if (opts.col1 === 'hira') {
    romajiCell = kM ? renderRomajiCell(k, kHira, kCol, kCol) : `<div class="blank"></div>`;
  } else {
    const hK = round.pairs[hi];
    romajiCell = hM ? renderRomajiCell(hK, hi, hCol, hCol) : `<div class="blank"></div>`;
  }

  const cols = opts.col1 === 'hira'
    ? `${hCell}<div class="divider"><i></i></div>${kCell}`
    : `${kCell}<div class="divider"><i></i></div>${hCell}`;

  const romajiPart = opts.mode === 'full'
    ? `<div class="divider"><i></i></div><div class="cell">${romajiCell}</div>`
    : '';

  return `<div class="row">${cols}${romajiPart}</div>`;
}

function render() {
  const { score, streak, roundNum, settingsOpen, round } = state;
  const fast = opts.mode === 'fast';
  const lbl1 = opts.col1 === 'hira' ? 'ひらがな' : 'カタカナ';
  const lbl2 = opts.col1 === 'hira' ? 'カタカナ' : 'ひらがな';

  const rows       = round.right.map((k, ri) => renderRow(k, ri)).join('');
  const streakHTML = streak >= 3 ? `<span class="str">🔥 ${streak}</span>` : '';

  const romajiLabel  = fast ? '' : `<div></div><div class="lbl">Romaji</div>`;
  // If the overlay is already in the DOM we're just updating options — skip re-animation
  const settingsAlreadyOpen = !!document.querySelector('#settings-overlay');
  const settingsHTML = settingsOpen ? `
    <div class="overlay${settingsAlreadyOpen ? ' no-anim' : ''}" id="settings-overlay">
      <div class="settings-panel inner${settingsAlreadyOpen ? ' no-anim' : ''}">
        <div class="settings-title">Settings</div>
        <div class="settings-label">Column 1</div>
        <div class="opt-row">
          <button class="opt-btn${opts.col1 === 'hira' ? ' opt-active' : ''}" data-opt-col1="hira">ひらがな</button>
          <button class="opt-btn${opts.col1 === 'kata' ? ' opt-active' : ''}" data-opt-col1="kata">カタカナ</button>
        </div>
        <div class="settings-label">Mode</div>
        <div class="opt-row">
          <button class="opt-btn${!fast ? ' opt-active' : ''}" data-opt-mode="full">Full</button>
          <button class="opt-btn${fast  ? ' opt-active' : ''}" data-opt-mode="fast">Fast</button>
        </div>
        <button class="settings-done" id="settings-done">Done</button>
      </div>
    </div>` : '';

  $('app').innerHTML = `
    <button class="gear-btn" id="gear-btn"><img src="gear.png" alt="Settings"></button>
    <div style="text-align:center;margin-bottom:24px;position:relative;z-index:1">
      <h1>仮名マッチ II</h1>
      <div class="sub">${fast ? 'Match the kana' : 'Match · then type the romaji'}</div>
      <div class="stats">
        <span>Round <b>${roundNum}</b></span>
        <span>Score <b class="sc">${score}</b></span>
        ${streakHTML}
      </div>
    </div>
    <div class="board${fast ? ' fast' : ''}">
      <div class="labels">
        <div class="lbl">${lbl1}</div><div></div>
        <div class="lbl">${lbl2}</div>${romajiLabel}
      </div>
      <div class="grid" id="grid">${rows}</div>
    </div>
    <div class="hint">${fast ? 'match the pair' : 'match the pair · type the romaji'}</div>
    ${settingsHTML}
  `;

  if (!fast) {
    const firstInput = $('app').querySelector('input.romaji');
    if (firstInput) setTimeout(() => firstInput.focus(), TIMING.FOCUS_DELAY);
  }
}

// ─── Event delegation (attached once at init) ─────────────────────────────────

function initEvents() {
  const app = $('app');

  app.addEventListener('click', e => {
    const t = e.target;

    const hBtn = t.closest('button[data-h]');
    if (hBtn) { handleHiraTap(hBtn.dataset.h); return; }

    // button[data-k] to exclude romaji inputs which also carry data-k
    const kBtn = t.closest('button[data-k]');
    if (kBtn) { handleKataTap(kBtn.dataset.k); return; }

    if (t.closest('#gear-btn'))      { state.settingsOpen = true;  render(); return; }
    if (t.closest('#settings-done')) { state.settingsOpen = false; render(); return; }
    if (t.id === 'settings-overlay') { state.settingsOpen = false; render(); return; }

    const optBtn = t.closest('[data-opt-col1]');
    if (optBtn) { opts.col1 = optBtn.dataset.optCol1; saveOpts(); render(); return; }

    const modeBtn = t.closest('[data-opt-mode]');
    if (modeBtn) { opts.mode = modeBtn.dataset.optMode; saveOpts(); render(); return; }
  });

  app.addEventListener('input', e => {
    const inp = e.target.closest('input.romaji');
    if (inp) handleRomajiInput(inp);
  });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

initEvents();
newRound();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
