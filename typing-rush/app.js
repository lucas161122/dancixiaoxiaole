const LEVELS = [
  {
    id: "fj-home-row",
    title: "fj指法",
    description: "先熟悉左右食指在主键位的发力节奏，只练 f 和 j。",
    lines: ["f j f j", "fj fj fj", "ffff jjjj", "f j j f", "fjfj fjfj"],
  },
  {
    id: "fj-drill",
    title: "fj练习",
    description: "继续用食指做短组合，建立稳定交替输入感。",
    lines: ["fj jf fj jf", "ff jj ff jj", "fjjf jffj", "fjfj jjff", "jfjf ffjj"],
  },
  {
    id: "space-drill",
    title: "空格指法",
    description: "加入空格，练习拇指回位和分词节奏。",
    lines: ["f j fj jf", "fj fj fj fj", "j f jf fj", "f j f j f j", "fj jf fj jf"],
  },
  {
    id: "dk-home-row",
    title: "dk指法",
    description: "过渡到中指区域，熟悉 d 和 k 的对应手感。",
    lines: ["d k d k", "dk dk dk", "dddd kkkk", "d k k d", "dkdk dkdk"],
  },
  {
    id: "dk-space",
    title: "dk空格练习",
    description: "把 d、k 和空格组合起来，练习节奏切换。",
    lines: ["d k dk kd", "dk dk dk dk", "k d kd dk", "d k d k d k", "dk kd dk kd"],
  },
  {
    id: "sl-home-row",
    title: "sl指法",
    description: "继续向外扩展，练习 ring finger 的 s 和 l。",
    lines: ["s l s l", "sl sl sl", "ssss llll", "s l l s", "slsl slsl"],
  },
  {
    id: "sl-drill",
    title: "sl练习",
    description: "把 s、l 和前面的键位做混合，提高手指独立性。",
    lines: ["sl dk sl dk", "s l d k s l", "sl sl dk dk", "sdkl lsdk", "slkd dkls"],
  },
  {
    id: "al-home-row",
    title: "al指法",
    description: "加入小指控制的 a 和分列外侧的 l，注意回位。",
    lines: ["a l a l", "al al al", "aaaa llll", "a l l a", "alal alal"],
  },
  {
    id: "al-drill",
    title: "al练习",
    description: "综合 a、l 和前面学过的主键位，完成最后一组基础练习。",
    lines: ["al sl dk fj", "a l s d f j k l", "asdf jkl al", "alfa asdf lkj", "asdf jkl fj dk sl al"],
  },
  {
    id: "home-row-base",
    title: "基准键练习",
    description: "把已经学过的主键位串起来，练习主键区连续移动。",
    lines: ["asdf jkl", "a s d f j k l", "asdf asdf", "jkl jkl jkl", "asdf jkl asdf jkl"],
  },
  {
    id: "tyu-home-row",
    title: "tyu指法",
    description: "加入上排中间区域，练习 t、y、u 的落点。",
    lines: ["t y u", "ty yu ut", "tt yy uu", "tyu tyu", "u y t y u"],
  },
  {
    id: "tyu-drill",
    title: "tyu练习",
    description: "把 t、y、u 和主键位做组合，练上排到主键的切换。",
    lines: ["tyu fj tyu", "t y u f j", "ty as yu dk", "uty tyu fj", "tyu asdf jkl"],
  },
  {
    id: "ri-home-row",
    title: "ri指法",
    description: "继续扩展上排，练习 r 和 i 的对应位置。",
    lines: ["r i r i", "ri ir ri", "rr ii rr", "r i ri ir", "riri irir"],
  },
  {
    id: "ri-drill",
    title: "ri练习",
    description: "把 r、i 加入已有键位，练习更多上排跨手组合。",
    lines: ["ri tyu ri", "r i t y u", "ri fj dk", "ir ri as", "ri tyu asdf"],
  },
  {
    id: "eo-home-row",
    title: "eo指法",
    description: "继续向两侧扩展，熟悉 e 和 o。",
    lines: ["e o e o", "eo oe eo", "ee oo ee", "e o oe eo", "eoeo oeoe"],
  },
  {
    id: "eo-drill",
    title: "eo练习",
    description: "把 e、o 和前面学过的上排中段连起来。",
    lines: ["eo ri tyu", "e o r i", "eo as df", "oe eo jkl", "tyu rioe asdf"],
  },
  {
    id: "qwp-home-row",
    title: "qwp指法",
    description: "补齐上排外侧区域，练习 q、w、p。",
    lines: ["q w p", "qw wp pq", "qq ww pp", "qwp qwp", "p w q w p"],
  },
  {
    id: "qwp-drill",
    title: "qwp练习",
    description: "将 q、w、p 和整条上排及主键位连接起来。",
    lines: ["qwp eo ri", "q w e r t y u i o p", "qwp asdf", "poi wer qwp", "qwerty uiop asdf jkl"],
  },
  {
    id: "top-row-drill",
    title: "上行字母练习",
    description: "综合整个上排字母，建立更完整的移动路线。",
    lines: ["qwerty uiop", "q w e r t y u i o p", "type row up", "qwe rty uio p", "qwerty uiop asdf"],
  },
  {
    id: "vb-home-row",
    title: "vb指法",
    description: "开始下排练习，先加入 v 和 b。",
    lines: ["v b v b", "vb bv vb", "vv bb vv", "v b vb bv", "vbvb bvbv"],
  },
  {
    id: "vb-drill",
    title: "vb练习",
    description: "练习下排到主键区的上下切换。",
    lines: ["vb as df", "v b f j", "vb tyu", "bv vb asdf", "vb asdf jkl"],
  },
  {
    id: "cn-home-row",
    title: "cn指法",
    description: "继续下排中段，加入 c 和 n。",
    lines: ["c n c n", "cn nc cn", "cc nn cc", "c n cn nc", "cncn ncnc"],
  },
  {
    id: "cn-drill",
    title: "cn练习",
    description: "把 c、n 和前面的下排键位连起来。",
    lines: ["cn vb cn", "c n v b", "cn dk fj", "nc cn as", "cn vb asdf"],
  },
  {
    id: "xm-home-row",
    title: "xm指法",
    description: "加入下排偏外侧的 x 和 m。",
    lines: ["x m x m", "xm mx xm", "xx mm xx", "x m xm mx", "xmxm mxmx"],
  },
  {
    id: "xm-drill",
    title: "xm练习",
    description: "让 x、m 与下排中段和平键位一起移动。",
    lines: ["xm cn vb", "x m c n", "xm sl dk", "mx xm fj", "xm cn vb asdf"],
  },
  {
    id: "z-comma-period-home-row",
    title: "z,.指法",
    description: "补上下排最外侧和标点位置，练习 z、,、。",
    lines: ["z , .", "z, ,. .z", "zz ,, ..", "z , . z , .", "z,. z,. z,."],
  },
  {
    id: "z-comma-period-drill",
    title: "z,.练习",
    description: "将 z、逗号、句点与已学键位组合，完善整条下排。",
    lines: ["z,. xm cn", "z , . x m", "z,. asdf", "z x c v b n m , .", "z,. fj dk sl al"],
  },
  {
    id: "three-row-drill",
    title: "三行字母",
    description: "综合三排键位做完整串联，作为阶段总练习。",
    lines: [
      "qwerty uiop",
      "asdf jkl",
      "zxcvbnm ,.",
      "qwerty uiop asdf jkl",
      "asdf jkl zxcvbnm ,.",
    ],
  },
];

const PASS_ACCURACY = 91;

const state = {
  currentScreen: "home",
  currentLevelIndex: 0,
  unlockedLevelIndex: 0,
  currentLineIndex: 0,
  currentQuote: "",
  levelStartedAt: 0,
  levelStarted: false,
  levelCompleted: false,
  totalTyped: 0,
  totalCorrect: 0,
  completedLines: 0,
  completedChars: 0,
  freeTimerId: null,
  freeElapsedSeconds: 0,
  freeStarted: false,
};

const els = {
  homeScreen: document.querySelector("#home-screen"),
  levelScreen: document.querySelector("#level-screen"),
  freeScreen: document.querySelector("#free-screen"),
  goLevelBtn: document.querySelector("#go-level-btn"),
  goFreeBtn: document.querySelector("#go-free-btn"),
  backFromLevelBtn: document.querySelector("#back-from-level-btn"),
  backFromFreeBtn: document.querySelector("#back-from-free-btn"),
  levelList: document.querySelector("#level-list"),
  levelTitle: document.querySelector("#level-title"),
  levelDesc: document.querySelector("#level-desc"),
  restartBtn: document.querySelector("#restart-btn"),
  nextLevelBtn: document.querySelector("#next-level-btn"),
  currentLevelValue: document.querySelector("#current-level-value"),
  wpmValue: document.querySelector("#wpm-value"),
  accuracyValue: document.querySelector("#accuracy-value"),
  linesValue: document.querySelector("#lines-value"),
  statusText: document.querySelector("#status-text"),
  quoteDisplay: document.querySelector("#quote-display"),
  typingInput: document.querySelector("#typing-input"),
  resultModal: document.querySelector("#result-modal"),
  resultSummary: document.querySelector("#result-summary"),
  playAgainBtn: document.querySelector("#play-again-btn"),
  modalNextLevelBtn: document.querySelector("#modal-next-level-btn"),
  freeTypingInput: document.querySelector("#free-typing-input"),
  freeStatusText: document.querySelector("#free-status-text"),
  freeCharsValue: document.querySelector("#free-chars-value"),
  freeTimeValue: document.querySelector("#free-time-value"),
  freeWpmValue: document.querySelector("#free-wpm-value"),
  clearFreeBtn: document.querySelector("#clear-free-btn"),
};

init();

function init() {
  renderLevelList();
  bindEvents();
  resetLevelGame();
  resetFreeMode();
  showScreen("home");
}

function bindEvents() {
  els.goLevelBtn.addEventListener("click", () => {
    showScreen("level");
    resetLevelGame();
    els.typingInput.focus();
  });

  els.goFreeBtn.addEventListener("click", () => {
    showScreen("free");
    resetFreeMode();
    els.freeTypingInput.focus();
  });

  els.backFromLevelBtn.addEventListener("click", () => showScreen("home"));
  els.backFromFreeBtn.addEventListener("click", () => {
    stopFreeTimer();
    showScreen("home");
  });

  els.restartBtn.addEventListener("click", resetLevelGame);
  els.nextLevelBtn.addEventListener("click", goToNextLevel);
  els.playAgainBtn.addEventListener("click", () => {
    hideResult();
    resetLevelGame();
    els.typingInput.focus();
  });
  els.modalNextLevelBtn.addEventListener("click", () => {
    hideResult();
    goToNextLevel();
  });

  els.typingInput.addEventListener("keydown", handleLevelStart);
  els.typingInput.addEventListener("input", handleLevelTyping);

  els.freeTypingInput.addEventListener("keydown", handleFreeStart);
  els.freeTypingInput.addEventListener("input", handleFreeTyping);
  els.clearFreeBtn.addEventListener("click", clearFreeContent);
}

function showScreen(name) {
  state.currentScreen = name;
  els.homeScreen.classList.toggle("hidden", name !== "home");
  els.levelScreen.classList.toggle("hidden", name !== "level");
  els.freeScreen.classList.toggle("hidden", name !== "free");
}

function renderLevelList() {
  els.levelList.innerHTML = "";

  LEVELS.forEach((level, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "level-item";
    button.dataset.index = String(index);

    const unlocked = index <= state.unlockedLevelIndex;
    button.disabled = !unlocked;
    button.innerHTML = `
      <span class="level-item-index">${index + 1}</span>
      <span class="level-item-text">
        <strong>${level.title}</strong>
        <small>${level.description}</small>
      </span>
    `;

    if (index === state.currentLevelIndex) {
      button.classList.add("is-active");
    }

    if (index < state.unlockedLevelIndex) {
      button.classList.add("is-cleared");
    }

    button.addEventListener("click", () => {
      if (!unlocked) {
        return;
      }
      state.currentLevelIndex = index;
      resetLevelGame();
      els.typingInput.focus();
    });

    els.levelList.appendChild(button);
  });
}

function resetLevelGame() {
  hideResult();
  state.currentLineIndex = 0;
  state.levelStartedAt = 0;
  state.levelStarted = false;
  state.levelCompleted = false;
  state.totalTyped = 0;
  state.totalCorrect = 0;
  state.completedLines = 0;
  state.completedChars = 0;
  els.typingInput.value = "";
  els.typingInput.disabled = false;
  syncCurrentLevel();
  setCurrentLine();
  renderQuote("");
  updateLevelStats();
  updateNextLevelButton();
  els.statusText.textContent = "点击输入框后开始练习，完成当前行会自动切换。";
}

function syncCurrentLevel() {
  const level = getCurrentLevel();
  els.levelTitle.textContent = level.title;
  els.levelDesc.textContent = level.description;
  els.currentLevelValue.textContent = `${state.currentLevelIndex + 1} / ${LEVELS.length}`;
  renderLevelList();
}

function setCurrentLine() {
  const level = getCurrentLevel();
  state.currentQuote = level.lines[state.currentLineIndex] || "";
}

function handleLevelStart(event) {
  if (state.levelCompleted || state.levelStarted) {
    return;
  }

  if (event.key.length !== 1 && event.key !== "Backspace" && event.key !== "Space") {
    return;
  }

  state.levelStarted = true;
  state.levelStartedAt = Date.now();
  els.statusText.textContent = "保持手型稳定，先准再快。";
}

function handleLevelTyping() {
  if (state.levelCompleted) {
    return;
  }

  const typed = els.typingInput.value;
  renderQuote(typed);
  recalculateLevelTotals(typed);
  updateLevelStats();

  if (typed === state.currentQuote) {
    completeCurrentLine();
  }
}

function completeCurrentLine() {
  state.completedLines += 1;
  state.completedChars += state.currentQuote.length;
  state.currentLineIndex += 1;
  els.typingInput.value = "";

  const level = getCurrentLevel();
  if (state.currentLineIndex >= level.lines.length) {
    finishLevel();
    return;
  }

  setCurrentLine();
  renderQuote("");
  recalculateLevelTotals("");
  updateLevelStats();
  els.statusText.textContent = "这一行完成了，继续下一行。";
}

function finishLevel() {
  state.levelCompleted = true;
  els.typingInput.disabled = true;
  const passed = hasPassedCurrentLevel();
  const isLastLevel = state.currentLevelIndex === LEVELS.length - 1;

  if (passed) {
    state.unlockedLevelIndex = Math.max(
      state.unlockedLevelIndex,
      Math.min(state.currentLevelIndex + 1, LEVELS.length - 1),
    );
  }

  renderLevelList();
  updateNextLevelButton();

  if (passed && !isLastLevel) {
    els.statusText.textContent = `本关通过，正确率高于 ${PASS_ACCURACY}%，正在进入下一关。`;
    window.setTimeout(() => {
      goToNextLevel();
    }, 220);
    return;
  }

  if (passed && isLastLevel) {
    els.statusText.textContent = `全部完成，最终正确率高于 ${PASS_ACCURACY}%。`;
    els.resultSummary.textContent =
      `你完成了全部关卡中的最后一关 ${getCurrentLevel().title}，正确率 ${calculateLevelAccuracy()}%，WPM ${calculateLevelWpm()}。`;
  } else {
    els.statusText.textContent = `本关未通过，正确率需要高于 ${PASS_ACCURACY}%，请重练本关。`;
    els.resultSummary.textContent =
      `你完成了 ${getCurrentLevel().title}，正确率 ${calculateLevelAccuracy()}%，WPM ${calculateLevelWpm()}。未达到继续条件，需要高于 ${PASS_ACCURACY}% 才能前进。`;
  }

  els.resultModal.classList.remove("hidden");
  els.resultModal.setAttribute("aria-hidden", "false");
}

function goToNextLevel() {
  if (state.currentLevelIndex >= LEVELS.length - 1) {
    resetLevelGame();
    return;
  }

  if (state.currentLevelIndex >= state.unlockedLevelIndex) {
    return;
  }

  state.currentLevelIndex += 1;
  resetLevelGame();
  showScreen("level");
  els.typingInput.focus();
}

function updateNextLevelButton() {
  const isLastLevel = state.currentLevelIndex === LEVELS.length - 1;
  const nextUnlocked = state.currentLevelIndex < state.unlockedLevelIndex;

  els.nextLevelBtn.disabled = isLastLevel || !nextUnlocked;
  els.modalNextLevelBtn.disabled = isLastLevel || !nextUnlocked;

  if (isLastLevel) {
    els.nextLevelBtn.textContent = "已经是最后一关";
    els.modalNextLevelBtn.textContent = "全部完成";
  } else {
    els.nextLevelBtn.textContent = nextUnlocked ? "下一关" : `正确率需高于 ${PASS_ACCURACY}%`;
    els.modalNextLevelBtn.textContent = nextUnlocked ? "进入下一关" : "本关未达标";
  }
}

function recalculateLevelTotals(typed) {
  let correct = 0;
  const checkLength = Math.min(typed.length, state.currentQuote.length);

  for (let index = 0; index < checkLength; index += 1) {
    if (typed[index] === state.currentQuote[index]) {
      correct += 1;
    }
  }

  state.totalTyped = typed.length + state.completedChars;
  state.totalCorrect = correct + state.completedChars;
}

function renderQuote(typed) {
  const fragment = document.createDocumentFragment();
  const maxLength = Math.max(state.currentQuote.length, typed.length);

  for (let index = 0; index < maxLength; index += 1) {
    const span = document.createElement("span");
    span.className = "char";
    const expected = state.currentQuote[index] ?? "";
    const actual = typed[index] ?? "";

    if (expected) {
      span.textContent = expected === " " ? "\u00A0" : expected;
      if (actual === "") {
        if (index === typed.length) {
          span.classList.add("current");
        }
      } else if (actual === expected) {
        span.classList.add("correct");
      } else {
        span.classList.add("wrong");
      }
    } else {
      span.textContent = actual === " " ? "\u00A0" : actual;
      span.classList.add("extra");
    }

    fragment.appendChild(span);
  }

  els.quoteDisplay.innerHTML = "";
  els.quoteDisplay.appendChild(fragment);
}

function updateLevelStats() {
  els.linesValue.textContent = String(state.completedLines);
  els.accuracyValue.textContent = `${calculateLevelAccuracy()}%`;
  els.wpmValue.textContent = String(calculateLevelWpm());
}

function calculateLevelAccuracy() {
  if (state.totalTyped <= 0) {
    return 100;
  }

  return Math.max(0, Math.round((state.totalCorrect / state.totalTyped) * 100));
}

function calculateLevelWpm() {
  if (!state.levelStartedAt) {
    return 0;
  }

  const elapsedSeconds = Math.max(1, Math.round((Date.now() - state.levelStartedAt) / 1000));
  const words = state.totalCorrect / 5;
  const minutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(words / minutes));
}

function hasPassedCurrentLevel() {
  return calculateLevelAccuracy() > PASS_ACCURACY;
}

function getCurrentLevel() {
  return LEVELS[state.currentLevelIndex];
}

function hideResult() {
  els.resultModal.classList.add("hidden");
  els.resultModal.setAttribute("aria-hidden", "true");
}

function resetFreeMode() {
  stopFreeTimer();
  state.freeElapsedSeconds = 0;
  state.freeStarted = false;
  els.freeTypingInput.value = "";
  els.freeStatusText.textContent = "点击输入框后就可以随意打字，不会被打断。";
  updateFreeStats();
}

function handleFreeStart(event) {
  if (state.freeStarted) {
    return;
  }

  if (event.key.length !== 1 && event.key !== "Backspace" && event.key !== "Enter") {
    return;
  }

  startFreeMode();
}

function startFreeMode() {
  state.freeStarted = true;
  els.freeStatusText.textContent = "自由输入中，你想写什么都可以。";
  state.freeTimerId = window.setInterval(() => {
    state.freeElapsedSeconds += 1;
    updateFreeStats();
  }, 1000);
}

function stopFreeTimer() {
  if (state.freeTimerId) {
    window.clearInterval(state.freeTimerId);
    state.freeTimerId = null;
  }
}

function handleFreeTyping() {
  updateFreeStats();
}

function clearFreeContent() {
  resetFreeMode();
  els.freeTypingInput.focus();
}

function updateFreeStats() {
  const chars = els.freeTypingInput.value.length;
  els.freeCharsValue.textContent = String(chars);
  els.freeTimeValue.textContent = `${state.freeElapsedSeconds}s`;
  els.freeWpmValue.textContent = String(calculateFreeWpm(chars));
}

function calculateFreeWpm(chars) {
  if (!state.freeElapsedSeconds) {
    return 0;
  }

  const words = chars / 5;
  const minutes = state.freeElapsedSeconds / 60;
  return Math.max(0, Math.round(words / minutes));
}
