const STORAGE_KEYS = {
  title: "typing-match-title",
  pairs: "typing-match-pairs",
  mistakes: "typing-match-mistakes",
  speech: "typing-match-speech-settings",
};

const COLORS = [
  "var(--pink)",
  "var(--green)",
  "var(--purple)",
  "var(--orange)",
  "var(--brown)",
  "var(--blue)",
];

const state = {
  allPairs: [],
  activeRoundPairs: [],
  boardCards: [],
  pairCount: 10,
  roundOffset: 0,
  gameStarted: false,
  matchedCount: 0,
  firstSelection: null,
  timer: 0,
  timerId: null,
  mistakes: {},
  speechMode: "click",
  speechRate: 1,
};

const PAIR_LIMITS = {
  min: 5,
  max: 25,
};

const els = {
  title: document.querySelector("#game-title"),
  pairRange: document.querySelector("#pair-range"),
  pairCount: document.querySelector("#pair-count"),
  importBtn: document.querySelector("#import-btn"),
  fileInput: document.querySelector("#file-input"),
  startBtn: document.querySelector("#start-btn"),
  speechMode: document.querySelector("#speech-mode"),
  speechRate: document.querySelector("#speech-rate"),
  mistakesBtn: document.querySelector("#mistakes-btn"),
  timerText: document.querySelector("#timer-text"),
  wordbookText: document.querySelector("#wordbook-text"),
  board: document.querySelector("#board"),
  resultModal: document.querySelector("#result-modal"),
  resultText: document.querySelector("#result-text"),
  continueBtn: document.querySelector("#continue-btn"),
  finishBtn: document.querySelector("#finish-btn"),
  mistakesModal: document.querySelector("#mistakes-modal"),
  mistakesList: document.querySelector("#mistakes-list"),
  closeMistakesBtn: document.querySelector("#close-mistakes-btn"),
  cardTemplate: document.querySelector("#card-template"),
};

initialize();

function initialize() {
  els.pairRange.min = String(PAIR_LIMITS.min);
  els.pairRange.max = String(PAIR_LIMITS.max);
  state.pairCount = clampPairCount(Number(els.pairRange.value));
  els.pairRange.value = String(state.pairCount);
  restoreTitle();
  restorePairs();
  restoreMistakes();
  restoreSpeechSettings();
  bindEvents();
  updatePairLabel();
  updateWordbookStatus();
  renderBoard();
}

function bindEvents() {
  els.title.addEventListener("click", startEditingTitle);
  els.title.addEventListener("blur", finishEditingTitle);
  els.title.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      els.title.blur();
    }
  });

  els.pairRange.addEventListener("input", () => {
    state.pairCount = clampPairCount(Number(els.pairRange.value));
    els.pairRange.value = String(state.pairCount);
    updatePairLabel();

    if (state.allPairs.length) {
      prepareRoundFromCurrentOffset();
      if (state.gameStarted) {
        restartTimer();
      }
      renderBoard();
    }
  });

  els.importBtn.addEventListener("click", openFilePicker);
  els.fileInput.addEventListener("change", handleFileImport);
  els.startBtn.addEventListener("click", startOrResetGame);
  els.continueBtn.addEventListener("click", continueChallenge);
  els.finishBtn.addEventListener("click", finishChallenge);
  els.mistakesBtn.addEventListener("click", openMistakesModal);
  els.closeMistakesBtn.addEventListener("click", closeMistakesModal);
  els.resultModal.addEventListener("click", (event) => {
    if (event.target === els.resultModal) {
      hideModal(els.resultModal);
    }
  });
  els.mistakesModal.addEventListener("click", (event) => {
    if (event.target === els.mistakesModal) {
      closeMistakesModal();
    }
  });

  els.speechMode.addEventListener("change", () => {
    state.speechMode = els.speechMode.value;
    persistSpeechSettings();
  });
  els.speechRate.addEventListener("change", () => {
    state.speechRate = Number(els.speechRate.value);
    persistSpeechSettings();
  });
}

function startEditingTitle() {
  els.title.contentEditable = "true";
  els.title.focus();

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(els.title);
  selection.removeAllRanges();
  selection.addRange(range);
}

function finishEditingTitle() {
  els.title.contentEditable = "false";
  const text = sanitizeText(els.title.textContent) || "单词消消乐";
  els.title.textContent = text;
  document.title = text;
  localStorage.setItem(STORAGE_KEYS.title, text);
}

function updatePairLabel() {
  els.pairCount.textContent = `${state.pairCount} 对`;
}

function clampPairCount(value) {
  return Math.min(PAIR_LIMITS.max, Math.max(PAIR_LIMITS.min, value || PAIR_LIMITS.min));
}

function restoreTitle() {
  const savedTitle = localStorage.getItem(STORAGE_KEYS.title);
  if (savedTitle) {
    els.title.textContent = savedTitle;
    document.title = savedTitle;
  }
}

function restorePairs() {
  try {
    const savedPairs = JSON.parse(localStorage.getItem(STORAGE_KEYS.pairs) || "[]");
    if (Array.isArray(savedPairs)) {
      state.allPairs = normalizePairs(savedPairs);
      shuffleArray(state.allPairs);
      prepareRoundFromCurrentOffset();
    }
  } catch (error) {
    console.error("恢复词表失败", error);
  }
}

function restoreMistakes() {
  try {
    state.mistakes = JSON.parse(localStorage.getItem(STORAGE_KEYS.mistakes) || "{}");
  } catch (error) {
    state.mistakes = {};
  }
}

function restoreSpeechSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.speech) || "{}");
    state.speechMode = saved.mode || "click";
    state.speechRate = Number(saved.rate || 1);
  } catch (error) {
    state.speechMode = "click";
    state.speechRate = 1;
  }

  els.speechMode.value = state.speechMode;
  els.speechRate.value = String(state.speechRate);
}

function persistSpeechSettings() {
  localStorage.setItem(
    STORAGE_KEYS.speech,
    JSON.stringify({
      mode: state.speechMode,
      rate: state.speechRate,
    }),
  );
}

function updateWordbookStatus() {
  if (!state.allPairs.length) {
    els.wordbookText.textContent = "尚未导入词表";
    return;
  }
  els.wordbookText.textContent = `已加载 ${state.allPairs.length} 对词汇`;
}

function openFilePicker() {
  if (typeof els.fileInput.showPicker === "function") {
    els.fileInput.showPicker();
    return;
  }
  els.fileInput.click();
}

async function handleFileImport(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const pairs = await parseWordFile(file);
    const normalized = normalizePairs(pairs);
    if (!normalized.length) {
      alert("词表中未找到有效的前两列数据。");
      return;
    }

    state.allPairs = shuffleArray(normalized.slice());
    state.roundOffset = 0;
    state.gameStarted = false;
    state.matchedCount = 0;
    state.firstSelection = null;
    stopTimer();
    state.timer = 0;
    resetTimerText();
    prepareRoundFromCurrentOffset();
    renderBoard();
    updateWordbookStatus();
    persistPairs();
    els.startBtn.textContent = "开始游戏";
    alert(`导入成功，共载入 ${state.allPairs.length} 对词汇。`);
  } catch (error) {
    console.error(error);
    alert(error.message || "导入失败，请检查文件格式。");
  } finally {
    event.target.value = "";
  }
}

function persistPairs() {
  localStorage.setItem(STORAGE_KEYS.pairs, JSON.stringify(state.allPairs));
}

function normalizePairs(rawPairs) {
  return rawPairs
    .map((item) => {
      if (!Array.isArray(item) || item.length < 2) {
        return null;
      }
      const word = sanitizeText(item[0]);
      const answer = sanitizeText(item[1]);
      if (!word || !answer) {
        return null;
      }
      return {
        word,
        answer,
        normalizedKey: normalizeMistakeKey(word),
      };
    })
    .filter(Boolean);
}

function sanitizeText(value) {
  return String(value ?? "").replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
}

function startOrResetGame() {
  if (!state.allPairs.length) {
    alert("请先上传单词表！");
    return;
  }

  shuffleArray(state.allPairs);
  state.roundOffset = 0;
  state.gameStarted = true;
  state.firstSelection = null;
  state.matchedCount = 0;
  prepareRoundFromCurrentOffset();
  renderBoard();
  restartTimer();
  els.startBtn.textContent = "重新开始（重置词汇）";
}

function continueChallenge() {
  hideModal(els.resultModal);
  if (!state.allPairs.length) {
    return;
  }

  const nextOffset = state.roundOffset + state.activeRoundPairs.length;
  state.roundOffset = nextOffset >= state.allPairs.length ? 0 : nextOffset;
  state.gameStarted = true;
  state.firstSelection = null;
  state.matchedCount = 0;
  prepareRoundFromCurrentOffset();
  renderBoard();
  restartTimer();
}

function finishChallenge() {
  hideModal(els.resultModal);
  state.gameStarted = false;
  state.firstSelection = null;
  els.board.classList.add("is-locked");
  Array.from(els.board.querySelectorAll(".word-card")).forEach((node) => {
    if (!node.classList.contains("is-matched")) {
      node.disabled = true;
    }
  });
}

function prepareRoundFromCurrentOffset() {
  if (!state.allPairs.length) {
    state.activeRoundPairs = [];
    state.boardCards = [];
    return;
  }

  const remaining = state.allPairs.length - state.roundOffset;
  const takeCount = Math.min(state.pairCount, remaining > 0 ? remaining : state.pairCount);
  const roundPairs =
    remaining > 0
      ? state.allPairs.slice(state.roundOffset, state.roundOffset + takeCount)
      : state.allPairs.slice(0, state.pairCount);

  state.activeRoundPairs = roundPairs.map((pair, index) => ({
    ...pair,
    pairId: `${state.roundOffset}-${index}-${pair.normalizedKey}-${pair.answer}`,
  }));

  const cards = [];
  state.activeRoundPairs.forEach((pair) => {
    cards.push(
      {
        id: crypto.randomUUID(),
        pairId: pair.pairId,
        text: pair.word,
        role: "word",
        color: pickColor(),
      },
      {
        id: crypto.randomUUID(),
        pairId: pair.pairId,
        text: pair.answer,
        role: "answer",
        color: pickColor(),
      },
    );
  });

  state.boardCards = shuffleArray(cards);
}

function renderBoard() {
  els.board.innerHTML = "";
  els.board.classList.toggle("is-locked", !state.gameStarted);

  if (!state.boardCards.length) {
    const empty = document.createElement("div");
    empty.className = "empty-board";
    empty.textContent = "导入词表后，这里会出现可爱的单词方块。";
    els.board.appendChild(empty);
    return;
  }

  state.boardCards.forEach((card) => {
    const node = els.cardTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.id = card.id;
    node.dataset.pairId = card.pairId;
    node.dataset.text = card.text;
    node.disabled = !state.gameStarted;
    node.style.background = card.color;
    node.querySelector(".word-text").textContent = card.text;
    node.addEventListener("click", () => handleCardClick(node, card));
    els.board.appendChild(node);
  });
}

function handleCardClick(node, card) {
  if (!state.gameStarted || node.classList.contains("is-matched") || node.disabled) {
    return;
  }

  if (state.speechMode === "click") {
    speakTextIfEnglish(card.text);
  }

  if (state.firstSelection && state.firstSelection.id === card.id) {
    return;
  }

  node.classList.add("is-selected");

  if (!state.firstSelection) {
    state.firstSelection = { id: card.id, pairId: card.pairId, node, card };
    return;
  }

  const previous = state.firstSelection;
  state.firstSelection = null;

  if (previous.pairId === card.pairId) {
    const matchedPair = state.activeRoundPairs.find((item) => item.pairId === card.pairId);
    previous.node.classList.remove("is-selected");
    node.classList.remove("is-selected");
    previous.node.classList.add("is-matched");
    node.classList.add("is-matched");
    previous.node.disabled = true;
    node.disabled = true;
    state.matchedCount += 1;

    if (state.speechMode === "match" && matchedPair) {
      speakTextIfEnglish(pickSpeakText(matchedPair));
    }

    setTimeout(() => {
      previous.node.style.visibility = "hidden";
      node.style.visibility = "hidden";
      checkRoundComplete();
    }, 560);
    return;
  }

  previous.node.classList.remove("is-selected");
  node.classList.remove("is-selected");
  previous.node.classList.add("is-wrong");
  node.classList.add("is-wrong");
  recordMistake(previous.card.pairId);
  recordMistake(card.pairId);

  setTimeout(() => {
    previous.node.classList.remove("is-wrong");
    node.classList.remove("is-wrong");
  }, 360);
}

function checkRoundComplete() {
  if (state.matchedCount !== state.activeRoundPairs.length) {
    return;
  }

  stopTimer();
  els.resultText.textContent = `本轮耗时：${state.timer} 秒`;
  showModal(els.resultModal);
}

function restartTimer() {
  stopTimer();
  state.timer = 0;
  resetTimerText();
  state.timerId = window.setInterval(() => {
    state.timer += 1;
    resetTimerText();
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function resetTimerText() {
  els.timerText.textContent = `耗时：${state.timer} 秒`;
}

function showModal(modal) {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function hideModal(modal) {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function closeMistakesModal() {
  hideModal(els.mistakesModal);
}

function openMistakesModal() {
  renderMistakes();
  showModal(els.mistakesModal);
}

function renderMistakes() {
  els.mistakesList.innerHTML = "";
  const rows = Object.values(state.mistakes)
    .sort((a, b) => b.count - a.count)
    .slice(0, 100);

  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "mistake-empty";
    empty.textContent = "暂时还没有记录到配对错误的词汇。";
    els.mistakesList.appendChild(empty);
    return;
  }

  rows.forEach((item) => {
    const row = document.createElement("div");
    row.className = "mistake-row";

    const speak = document.createElement("button");
    speak.type = "button";
    speak.className = "speak-btn";
    speak.textContent = "🔊";
    speak.addEventListener("click", () => speakTextIfEnglish(item.word, true));

    const word = document.createElement("div");
    word.textContent = item.word;

    const meaning = document.createElement("div");
    meaning.className = "meaning";
    meaning.textContent = item.answer;

    const count = document.createElement("div");
    count.className = "count";
    count.textContent = String(item.count);

    row.append(speak, word, meaning, count);
    els.mistakesList.appendChild(row);
  });
}

function recordMistake(pairId) {
  const pair = state.activeRoundPairs.find((item) => item.pairId === pairId);
  if (!pair) {
    return;
  }
  const key = normalizeMistakeKey(pair.word);
  if (!key) {
    return;
  }

  const current = state.mistakes[key] || {
    key,
    word: pair.word,
    answer: pair.answer,
    count: 0,
  };
  current.word = current.word || pair.word;
  current.answer = current.answer || pair.answer;
  current.count += 1;
  state.mistakes[key] = current;
  localStorage.setItem(STORAGE_KEYS.mistakes, JSON.stringify(state.mistakes));
}

function normalizeMistakeKey(text) {
  return sanitizeText(text)
    .replace(/^[\s\p{P}\p{S}]+|[\s\p{P}\p{S}]+$/gu, "")
    .toLowerCase();
}

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function shuffleArray(array) {
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
}

function isEnglishText(text) {
  return /^[a-zA-Z0-9\s'",.!?;:()\-_/&]+$/.test(sanitizeText(text));
}

function pickSpeakText(pair) {
  if (isEnglishText(pair.word)) {
    return pair.word;
  }
  if (isEnglishText(pair.answer)) {
    return pair.answer;
  }
  return "";
}

function speakTextIfEnglish(text, force = false) {
  if (!force && state.speechMode === "off") {
    return;
  }
  const content = sanitizeText(text);
  if (!content || !isEnglishText(content)) {
    return;
  }
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = "en-US";
  utterance.rate = state.speechRate;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

async function parseWordFile(file) {
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".csv") || lowerName.endsWith(".tsv") || lowerName.endsWith(".txt")) {
    const text = await file.text();
    return parseDelimitedText(text, lowerName.endsWith(".tsv") ? "\t" : detectDelimiter(text));
  }

  if (lowerName.endsWith(".xlsx")) {
    const buffer = await file.arrayBuffer();
    return parseXlsx(buffer);
  }

  if (lowerName.endsWith(".xls")) {
    throw new Error("当前离线版支持 .xlsx / .csv / .tsv，旧版 .xls 暂不支持，请另存为 .xlsx 后导入。");
  }

  throw new Error("不支持的文件格式，请上传 .xlsx / .csv / .tsv 文件。");
}

function detectDelimiter(text) {
  const sample = text.split(/\r?\n/).slice(0, 5).join("\n");
  const candidates = [",", "\t", ";"];
  let best = ",";
  let bestCount = -1;

  candidates.forEach((delimiter) => {
    const count = sample.split(delimiter).length;
    if (count > bestCount) {
      best = delimiter;
      bestCount = count;
    }
  });

  return best;
}

function parseDelimitedText(text, delimiter) {
  const rows = [];
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  for (const line of lines) {
    rows.push(splitCsvLine(line, delimiter).slice(0, 2));
  }
  return rows;
}

function splitCsvLine(line, delimiter) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

async function parseXlsx(buffer) {
  const zipEntries = await unzipXlsx(buffer);
  const workbookXml = zipEntries["xl/workbook.xml"];
  const relsXml = zipEntries["xl/_rels/workbook.xml.rels"];

  if (!workbookXml) {
    throw new Error("未在 Excel 中找到工作簿内容。");
  }

  const workbookDoc = parseXml(workbookXml);
  const relsDoc = relsXml ? parseXml(relsXml) : null;
  const sheetPath = resolveFirstSheetPath(workbookDoc, relsDoc);
  const sheetXml = zipEntries[sheetPath];
  if (!sheetXml) {
    throw new Error("未找到第一个工作表。");
  }

  const sharedStrings = zipEntries["xl/sharedStrings.xml"]
    ? extractSharedStrings(parseXml(zipEntries["xl/sharedStrings.xml"]))
    : [];

  return extractSheetPairs(parseXml(sheetXml), sharedStrings);
}

async function unzipXlsx(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const eocdOffset = findEndOfCentralDirectory(bytes);
  if (eocdOffset < 0) {
    throw new Error("无法解析该 Excel 文件。");
  }

  const totalEntries = view.getUint16(eocdOffset + 10, true);
  const centralDirOffset = view.getUint32(eocdOffset + 16, true);
  let pointer = centralDirOffset;
  const output = {};

  for (let index = 0; index < totalEntries; index += 1) {
    if (view.getUint32(pointer, true) !== 0x02014b50) {
      throw new Error("Excel 压缩结构异常。");
    }

    const compression = view.getUint16(pointer + 10, true);
    const compressedSize = view.getUint32(pointer + 20, true);
    const fileNameLength = view.getUint16(pointer + 28, true);
    const extraLength = view.getUint16(pointer + 30, true);
    const commentLength = view.getUint16(pointer + 32, true);
    const localHeaderOffset = view.getUint32(pointer + 42, true);
    const name = decodeText(bytes.slice(pointer + 46, pointer + 46 + fileNameLength));

    pointer += 46 + fileNameLength + extraLength + commentLength;

    if (name.endsWith("/")) {
      continue;
    }

    const localNameLength = view.getUint16(localHeaderOffset + 26, true);
    const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const data = bytes.slice(dataStart, dataStart + compressedSize);
    const extracted = await decompressZipEntry(data, compression);
    output[name] = decodeText(extracted);
  }

  return output;
}

function findEndOfCentralDirectory(bytes) {
  for (let index = bytes.length - 22; index >= 0; index -= 1) {
    if (
      bytes[index] === 0x50 &&
      bytes[index + 1] === 0x4b &&
      bytes[index + 2] === 0x05 &&
      bytes[index + 3] === 0x06
    ) {
      return index;
    }
  }
  return -1;
}

async function decompressZipEntry(data, compression) {
  if (compression === 0) {
    return data;
  }
  if (compression !== 8) {
    throw new Error(`不支持的压缩方式: ${compression}`);
  }

  if (!("DecompressionStream" in window)) {
    throw new Error("当前浏览器不支持离线解析 .xlsx，请改用 Chromium 新版浏览器或导入 .csv。");
  }

  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const response = new Response(stream);
  return new Uint8Array(await response.arrayBuffer());
}

function decodeText(uint8array) {
  return new TextDecoder("utf-8").decode(uint8array);
}

function parseXml(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Excel XML 解析失败。");
  }
  return doc;
}

function resolveFirstSheetPath(workbookDoc, relsDoc) {
  const sheet = workbookDoc.querySelector("sheets > sheet");
  if (!sheet) {
    return "xl/worksheets/sheet1.xml";
  }

  const relationId = sheet.getAttribute("r:id");
  if (!relationId || !relsDoc) {
    return "xl/worksheets/sheet1.xml";
  }

  const relation = Array.from(relsDoc.querySelectorAll("Relationship")).find(
    (item) => item.getAttribute("Id") === relationId,
  );

  if (!relation) {
    return "xl/worksheets/sheet1.xml";
  }

  const target = relation.getAttribute("Target") || "worksheets/sheet1.xml";
  return target.startsWith("xl/") ? target : `xl/${target.replace(/^\.\//, "")}`;
}

function extractSharedStrings(doc) {
  return Array.from(doc.querySelectorAll("si")).map((node) =>
    Array.from(node.querySelectorAll("t"))
      .map((item) => item.textContent || "")
      .join(""),
  );
}

function extractSheetPairs(sheetDoc, sharedStrings) {
  const rows = Array.from(sheetDoc.querySelectorAll("sheetData row"));
  const pairs = [];

  rows.forEach((row) => {
    const first = readCellValue(row, "A", sharedStrings);
    const second = readCellValue(row, "B", sharedStrings);
    if (sanitizeText(first) || sanitizeText(second)) {
      pairs.push([first, second]);
    }
  });

  return pairs;
}

function readCellValue(row, columnLetter, sharedStrings) {
  const cell = Array.from(row.querySelectorAll("c")).find((node) => {
    const ref = node.getAttribute("r") || "";
    const letters = ref.match(/[A-Z]+/)?.[0] || "";
    return letters === columnLetter;
  });

  if (!cell) {
    return "";
  }

  const type = cell.getAttribute("t");
  if (type === "inlineStr") {
    return cell.querySelector("is t")?.textContent || "";
  }

  const value = cell.querySelector("v")?.textContent || "";
  if (type === "s") {
    return sharedStrings[Number(value)] || "";
  }
  return value;
}
