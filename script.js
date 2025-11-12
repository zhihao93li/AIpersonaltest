const State = {
  ENTER: "ENTER",
  PROBE: "PROBE",
  REFLECT: "REFLECT",
  VALIDATE: "VALIDATE",
  FOCUS: "FOCUS",
  APPLY: "APPLY",
  REPORT: "REPORT",
  LOOP: "LOOP",
};

const signalKeywords = {
  flow_score: ["忘记时间", "上头", "停不下来", "心流", "着迷", "投入", "很兴奋"],
  abstract_think: ["框架", "底层", "原理", "系统", "结构", "模型", "拆解"],
  tinker_bias: ["原型", "试", "迭代", "实验", "demo", "试错", "先做"],
  system_opt: ["优化", "流程", "规范", "效率", "指标", "复盘", "拆分"],
  social_drive: ["沟通", "协调", "连接", "访谈", "团队", "共创", "对齐", "影响"],
  aesthetic_sense: ["审美", "优雅", "质感", "品味", "体验", "好看", "细节"],
  grit: ["坚持", "失败", "再试", "复盘", "熬", "不放弃", "卡住"],
  value_impact: ["价值", "意义", "用户", "影响力", "结果", "产出", "效果"],
};

const strongEmotionWords = ["热爱", "兴奋", "迷上", "超级喜欢", "着迷"];
const negativeFlowWords = ["枯燥", "厌烦", "无聊", "疲惫", "耗尽"];

const probePool = {
  A: [
    "回想一次你完全‘忘记时间’的经历。你在做什么？分成了哪些关键步骤？",
    "最近做得很开心的一件事，最让你上头的环节是哪一步？",
  ],
  B: [
    "遇到复杂问题，你会先搭框架还是先动手试？举最近一次。",
    "没有标准答案时，你通常兴奋还是焦虑？你如何推进？",
  ],
  C: [
    "一次受挫后仍选择再试的经历，是什么支撑你继续？",
    "别人最常来请你帮的事是什么？你愿意吗？",
  ],
};

const validatePool = {
  understand:
    "当系统长期混乱且无法立刻建立秩序时，你更可能：A 亲自下场去整理；B 等到边界更清晰再行动？为什么？",
  create:
    "如果只能二选一：A 先做大胆原型；B 先把问题拆清楚再动手？你的直觉是什么？",
  execute:
    "临近 DDL，你更在意：A 可上线的完成度；B 达到你心中的质量线？说说原因。",
  connect:
    "当需要拉齐多方时，你是主动出面协调，还是更愿意有人先定调再跟进？",
  aesthetic:
    "面对风格分歧，你倾向坚持自己的美感判断，还是尊重既定规范？举例说明。",
  lead:
    "遇到团队节奏松散，你更倾向亲自定目标，还是激励成员自驱？为什么？",
  craft:
    "如果交付时间充足，你会投入更多在流程规范还是最终质检？",
  risk:
    "面对一个高不确定性的机会，你会立刻试小实验还是先搜集更多案例？",
};

const applyTemplates = {
  understand: {
    scenario: "产品系统设计 / 机制平衡 / 指标体系",
    practice: "用“目标-约束-变量-反馈”重构一个流程",
  },
  create: {
    scenario: "0→1 原型 / 活动策划 / 内容创作",
    practice: "48 小时做一个小原型并向 3 人取回反馈",
  },
  connect: {
    scenario: "BD / 访谈 / 社群运营",
    practice: "完成一次关键人对齐并沉淀纪要",
  },
  execute: {
    scenario: "项目推进 / 交付保障",
    practice: "定义 T+7 交付里程碑",
  },
  aesthetic: {
    scenario: "品牌 / 体验 / 品控",
    practice: "对一个页面做“减法”重构",
  },
  lead: {
    scenario: "小组带队 / 节奏把控",
    practice: "写一页纸北极星目标 + 本周 KR",
  },
  craft: {
    scenario: "质量打磨 / 质检规范",
    practice: "制定一次性的 DoD 并执行",
  },
  risk: {
    scenario: "增长试验 / 渠道探索 / 技术 Spike",
    practice: "设计一个可回滚的小实验",
  },
};

const vectorKeys = [
  "understand",
  "create",
  "connect",
  "execute",
  "aesthetic",
  "lead",
  "craft",
  "risk",
];

const vectorMapping = {
  understand: (signals) => signals.abstract_think + 0.8 * signals.system_opt,
  create: (signals) => signals.aesthetic_sense + 0.8 * signals.tinker_bias,
  connect: (signals) => signals.social_drive + 0.5 * signals.value_impact,
  execute: (signals) => signals.grit + 0.5 * signals.system_opt,
  aesthetic: (signals) => signals.aesthetic_sense,
  lead: (signals) => signals.social_drive + signals.value_impact,
  craft: (signals) => signals.system_opt + 0.8 * signals.grit,
  risk: (signals) => signals.tinker_bias,
};

const scenarios = [
  {
    id: "case-1",
    name: "高理解型用户",
    steps: [
      "最容易让我忘记时间的是拆解复杂问题，比如我最近帮团队重新梳理客服流程，先搭了一个框架再逐层拆解。",
      "整体挺贴近的，我确实喜欢抓底层逻辑，有时候也会提醒自己不要太慢。",
      "我会亲自下场整理，把每一个环节画出来，这样团队才知道怎么跑。",
      "是的，我还想看看有没有别的角度能补充。",
      "这些建议有帮助，我可以试试目标-约束-变量-反馈的练习。",
      "先生成报告吧。",
      "暂时不用继续了。",
    ],
  },
  {
    id: "case-2",
    name: "高创造型用户",
    steps: [
      "上周做内容黑客松，48 小时内拉了几个伙伴做了个原型，基本忘记吃饭。",
      "贴近，我就是那种先动手试试的人。",
      "当然是先做大胆原型，边做边看反馈。",
      "我觉得可以继续往下。",
      "练习也不错，我会去找三个人测一下。",
      "输出画像吧。",
      "我们改天再深挖。",
    ],
  },
];

const maxSteps = 12;
const baseSignals = () => ({
  flow_score: 0,
  abstract_think: 0,
  tinker_bias: 0,
  system_opt: 0,
  social_drive: 0,
  aesthetic_sense: 0,
  grit: 0,
  value_impact: 0,
});

const store = {
  sessionId: "",
  state: State.ENTER,
  loopCount: 0,
  stepIndex: 0,
  signals: baseSignals(),
  vector: vectorKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
  lastSignalUpdate: null,
  dimensionQueue: ["A", "B", "C"],
  probeHistory: [],
  evidence: [],
  conversationLog: [],
  report: null,
};

const dom = {
  sessionId: document.getElementById("sessionId"),
  currentState: document.getElementById("currentState"),
  loopCount: document.getElementById("loopCount"),
  progressValue: document.getElementById("progressValue"),
  progressLabel: document.getElementById("progressLabel"),
  conversationContainer: document.getElementById("conversationContainer"),
  composer: document.getElementById("composer"),
  userInput: document.getElementById("userInput"),
  sendBtn: document.getElementById("sendBtn"),
  messageTemplate: document.getElementById("messageTemplate"),
  hypothesisChips: document.getElementById("hypothesisChips"),
  signalList: document.getElementById("signalList"),
  exportMarkdownBtn: document.getElementById("exportMarkdownBtn"),
  toast: document.getElementById("toast"),
  resetBtn: document.getElementById("resetBtn"),
  statePill: document.getElementById("statePill"),
  reportPreview: document.getElementById("reportPreview"),
  reportContent: document.getElementById("reportContent"),
  toggleReportBtn: document.getElementById("toggleReportBtn"),
  loadScenarioBtn: document.getElementById("loadScenarioBtn"),
};

function generateSessionId() {
  return `sess_${Math.random().toString(36).slice(2, 10)}`;
}

function resetStore() {
  store.sessionId = generateSessionId();
  store.state = State.ENTER;
  store.loopCount = 0;
  store.stepIndex = 0;
  store.signals = baseSignals();
  store.vector = vectorKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  store.lastSignalUpdate = null;
  store.dimensionQueue = ["A", "B", "C"];
  store.probeHistory = [];
  store.evidence = [];
  store.conversationLog = [];
  store.report = null;
}

function updateProgress() {
  store.stepIndex += 1;
  const ratio = Math.min(1, store.stepIndex / maxSteps);
  dom.progressValue.style.width = `${Math.round(ratio * 100)}%`;
  dom.progressLabel.textContent = `${Math.min(store.stepIndex, maxSteps)} / ${maxSteps}`;
}

function setState(nextState) {
  store.state = nextState;
  dom.currentState.textContent = nextState;
  dom.statePill.textContent = nextState;
}

function norm(value) {
  return Math.min(1, +(value / 10).toFixed(2));
}

function updateVectors() {
  for (const key of vectorKeys) {
    const raw = vectorMapping[key](store.signals);
    store.vector[key] = norm(raw);
  }
}

function rankVectors() {
  updateVectors();
  return [...vectorKeys]
    .map((key) => ({ name: key, score: store.vector[key] }))
    .sort((a, b) => b.score - a.score);
}

function highlightPhrases(text) {
  const segments = text
    .replace(/[。！？!?.]/g, "|")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  return segments.slice(0, 2);
}

function analyzeSignals(text) {
  const updates = {};
  const hits = [];
  for (const [signal, keywords] of Object.entries(signalKeywords)) {
    let delta = 0;
    const matched = keywords.filter((keyword) => text.includes(keyword));
    if (matched.length > 0) {
      delta += matched.length * 2;
      hits.push({ signal, keywords: matched });
    }
    if (signal === "flow_score") {
      if (strongEmotionWords.some((word) => text.includes(word))) {
        delta += 2;
      }
      if (negativeFlowWords.some((word) => text.includes(word))) {
        delta -= 1;
      }
    }
    if (delta !== 0) {
      updates[signal] = delta;
    }
  }

  const emotion = strongEmotionWords.some((word) => text.includes(word)) ? "positive" : null;
  const negative = /不太像|不认同|不准|不对|不是|不太对/.test(text);
  const silent = text.trim().length === 0;
  return { updates, hits, emotion, negative, silent };
}

function applySignalUpdate(updates = {}, direction = 1) {
  const entries = Object.entries(updates);
  if (entries.length > 0) {
    store.lastSignalUpdate = updates;
    for (const [signal, delta] of entries) {
      const next = Math.max(0, store.signals[signal] + direction * delta);
      store.signals[signal] = next;
    }
  }
  renderSignals();
  renderHypotheses();
}

function renderSignals() {
  dom.signalList.innerHTML = "";
  for (const [signal, value] of Object.entries(store.signals)) {
    const li = document.createElement("li");
    li.className = "signal-item";
    li.innerHTML = `<span>${signal}</span><strong>${value}</strong>`;
    dom.signalList.appendChild(li);
  }
}

function mapName(key) {
  const mapping = {
    understand: "结构理解",
    create: "创造试验",
    connect: "连接协调",
    execute: "执行保障",
    aesthetic: "审美品控",
    lead: "带队引领",
    craft: "流程打磨",
    risk: "风险试验",
  };
  return mapping[key] ?? key;
}

function renderHypotheses() {
  const ranked = rankVectors();
  dom.hypothesisChips.innerHTML = "";
  ranked
    .slice(0, 2)
    .filter((item) => item.score > 0)
    .forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = `${mapName(item.name)} <span class="score">${Math.round(
        item.score * 100
      )}%</span>`;
      dom.hypothesisChips.appendChild(chip);
    });
}

function htmlToPlain(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

function appendMessage({ role, content, state }) {
  const template = dom.messageTemplate.content.firstElementChild.cloneNode(true);
  template.classList.add(role === "user" ? "user" : "assistant");
  template.querySelector(".role").textContent = role === "user" ? "你" : "AI 引导师";
  template.querySelector(".timestamp").textContent = new Date().toLocaleTimeString();
  template.querySelector(".state-tag").textContent = state;
  template.querySelector(".content").innerHTML = content
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

  const plainContent = htmlToPlain(content);

  template.querySelector(".copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(plainContent).then(() => showToast("已复制到剪贴板"));
  });

  dom.conversationContainer.appendChild(template);
  dom.conversationContainer.scrollTop = dom.conversationContainer.scrollHeight;
  store.conversationLog.push({
    role,
    state,
    content,
    plain: plainContent,
    timestamp: new Date().toISOString(),
  });
  updateProgress();
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.hidden = false;
  setTimeout(() => {
    dom.toast.hidden = true;
  }, 2000);
}

function pickProbeQuestion() {
  if (store.dimensionQueue.length === 0) {
    store.dimensionQueue = ["A", "B", "C"];
  }
  const dimension = store.dimensionQueue.shift();
  const pool = probePool[dimension];
  const index = store.probeHistory.filter((p) => p.dimension === dimension).length % pool.length;
  const question = pool[index];
  store.probeHistory.push({ dimension, question });
  return { dimension, question };
}

function handleEnter() {
  appendMessage({
    role: "assistant",
    state: State.ENTER,
    content:
      "欢迎来到 AI Talent Guide。我们将通过 5–8 分钟的对话，帮你看见高能模式与可迁移场景。准备好了吗？",
  });
  setTimeout(() => {
    const { question } = pickProbeQuestion();
    setState(State.PROBE);
    appendMessage({
      role: "assistant",
      state: State.PROBE,
      content: question,
    });
  }, 400);
}

function formatReflectContent(userText, ranked) {
  const highlights = highlightPhrases(userText);
  const guesses = ranked
    .slice(0, 2)
    .map((item) => `${mapName(item.name)}（${Math.round(item.score * 100)}%）`)
    .join("；");
  return `我听到了：${highlights.join("；")}。<br/>我的感觉是：${guesses}。这描述贴近你吗？如果不准，帮我纠正一下。`;
}

function handleProbeResponse(text) {
  if (/跳过|换一个/.test(text)) {
    const { question } = pickProbeQuestion();
    setState(State.PROBE);
    appendMessage({
      role: "assistant",
      state: State.PROBE,
      content: question,
    });
    return;
  }
  const analysis = analyzeSignals(text);
  if (analysis.silent) {
    appendMessage({
      role: "assistant",
      state: State.PROBE,
      content: "如果一时间想不到，可以描述最近一次让你投入的事件，或者输入“跳过”换一个探针。",
    });
    return;
  }
  applySignalUpdate(analysis.updates);
  if (analysis.hits.length) {
    store.evidence.push(
      ...analysis.hits.map((hit) => ({ signal: hit.signal, keywords: hit.keywords, text }))
    );
  }
  const ranked = rankVectors();
  setState(State.REFLECT);
  appendMessage({
    role: "assistant",
    state: State.REFLECT,
    content: formatReflectContent(text, ranked),
  });
}

function handleReflectResponse(text) {
  const analysis = analyzeSignals(text);
  const previousUpdate = store.lastSignalUpdate;
  applySignalUpdate(analysis.updates);
  if (analysis.hits.length) {
    store.evidence.push(
      ...analysis.hits.map((hit) => ({ signal: hit.signal, keywords: hit.keywords, text }))
    );
  }
  let nextState = State.VALIDATE;
  if (analysis.negative && previousUpdate && Object.keys(previousUpdate).length > 0) {
    applySignalUpdate(previousUpdate, -1);
    showToast("已根据纠偏调整信号");
  }
  if (/跳过|换一个/.test(text)) {
    nextState = State.PROBE;
  }

  const ranked = rankVectors();
  if (nextState === State.PROBE) {
    const { question } = pickProbeQuestion();
    setState(State.PROBE);
    appendMessage({
      role: "assistant",
      state: State.PROBE,
      content: question,
    });
    return;
  }

  const top = ranked[0];
  const validateQuestion = validatePool[top.name] ?? validatePool.understand;
  setState(State.VALIDATE);
  appendMessage({
    role: "assistant",
    state: State.VALIDATE,
    content: validateQuestion,
  });
}

function handleValidateResponse(text) {
  const analysis = analyzeSignals(text);
  applySignalUpdate(analysis.updates);
  if (analysis.hits.length) {
    store.evidence.push(
      ...analysis.hits.map((hit) => ({ signal: hit.signal, keywords: hit.keywords, text }))
    );
  }
  const ranked = rankVectors();
  const top = ranked[0];
  if (top.score >= 0.68) {
    setState(State.FOCUS);
    appendMessage({
      role: "assistant",
      state: State.FOCUS,
      content: `你在【${mapName(top.name)}】上表现出明显优势：我们多次捕捉到 ${
        top.name
      } 相关信号。依据：${collectEvidence(top.name).join("、") || "对话线索"}。`,
    });
  } else {
    const { question } = pickProbeQuestion();
    setState(State.PROBE);
    appendMessage({
      role: "assistant",
      state: State.PROBE,
      content: question,
    });
  }
}

function collectEvidence(vectorKey) {
  return store.evidence
    .filter((item) => mapSignalToVector(item.signal).includes(vectorKey))
    .slice(-3)
    .map((item) => item.keywords.join("/") + "…" + truncate(item.text, 18));
}

function mapSignalToVector(signal) {
  switch (signal) {
    case "abstract_think":
      return ["understand", "craft"];
    case "system_opt":
      return ["understand", "execute", "craft"];
    case "tinker_bias":
      return ["create", "risk"];
    case "aesthetic_sense":
      return ["create", "aesthetic"];
    case "social_drive":
      return ["connect", "lead"];
    case "grit":
      return ["execute", "craft"];
    case "value_impact":
      return ["connect", "lead"];
    case "flow_score":
    default:
      return vectorKeys;
  }
}

function truncate(text, length) {
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

function handleFocusResponse(text) {
  const analysis = analyzeSignals(text);
  applySignalUpdate(analysis.updates);
  if (analysis.hits.length) {
    store.evidence.push(
      ...analysis.hits.map((hit) => ({ signal: hit.signal, keywords: hit.keywords, text }))
    );
  }
  const ranked = rankVectors();
  const top = ranked[0];
  if (top.score >= 0.75) {
    const template = applyTemplates[top.name] ?? applyTemplates.understand;
    setState(State.APPLY);
    appendMessage({
      role: "assistant",
      state: State.APPLY,
      content: `可迁移场景建议：${template.scenario}。<br/>本周微练习：${template.practice}。完成后记得复盘感受。`,
    });
  } else {
    const { question } = pickProbeQuestion();
    setState(State.PROBE);
    appendMessage({
      role: "assistant",
      state: State.PROBE,
      content: question,
    });
  }
}

function buildReport() {
  const ranked = rankVectors();
  const top3 = ranked.slice(0, 3);
  const lines = ["# 你的天赋画像 1.0", ""];
  lines.push("## Top 3 向量");
  top3.forEach((item, index) => {
    lines.push(`${index + 1}. ${mapName(item.name)}（${Math.round(item.score * 100)}%）`);
  });
  lines.push("\n## 证据引用");
  if (store.evidence.length === 0) {
    lines.push("- 暂无结构化证据，建议继续补充对话");
  } else {
    store.evidence.slice(-6).forEach((item) => {
      lines.push(`- ${item.signal}: ${item.keywords.join("/")} —— ${truncate(item.text, 36)}`);
    });
  }
  lines.push("\n## 建议");
  lines.push("建议：保留两周对话记录，每周做一次小练习+复盘，逐步把“假说”升级为“结论”。");
  return lines.join("\n");
}

function handleApplyResponse(text) {
  const analysis = analyzeSignals(text);
  applySignalUpdate(analysis.updates);
  if (analysis.hits.length) {
    store.evidence.push(
      ...analysis.hits.map((hit) => ({ signal: hit.signal, keywords: hit.keywords, text }))
    );
  }
  setState(State.REPORT);
  store.report = buildReport();
  dom.reportContent.textContent = store.report;
  dom.reportPreview.hidden = false;
  appendMessage({
    role: "assistant",
    state: State.REPORT,
    content:
      "你的天赋画像 1.0 已生成，向量与权重已同步在侧边栏。需要继续细化吗？输入“继续”进入下一轮，或输入“结束”保存退出。",
  });
}

function handleReportResponse(text) {
  if (/继续|再来|ok/.test(text)) {
    store.loopCount += 1;
    dom.loopCount.textContent = String(store.loopCount);
    setState(State.LOOP);
    appendMessage({
      role: "assistant",
      state: State.LOOP,
      content: "我们将继续下一轮探针，优先补齐缺口信号。",
    });
    const { question } = pickProbeQuestion();
    setState(State.PROBE);
    appendMessage({
      role: "assistant",
      state: State.PROBE,
      content: question,
    });
  } else {
    appendMessage({
      role: "assistant",
      state: State.REPORT,
      content: "感谢体验，欢迎 7 日内再访以升级画像 2.0。",
    });
    dom.composer.classList.add("disabled");
    dom.userInput.disabled = true;
    dom.sendBtn.disabled = true;
  }
}

function handleUserInput(event) {
  event.preventDefault();
  const text = dom.userInput.value.trim();
  if (!text) return;
  const currentState = store.state;
  appendMessage({ role: "user", state: currentState, content: text });
  dom.userInput.value = "";

  switch (currentState) {
    case State.PROBE:
      handleProbeResponse(text);
      break;
    case State.REFLECT:
      handleReflectResponse(text);
      break;
    case State.VALIDATE:
      handleValidateResponse(text);
      break;
    case State.FOCUS:
      handleFocusResponse(text);
      break;
    case State.APPLY:
      handleApplyResponse(text);
      break;
    case State.REPORT:
      handleReportResponse(text);
      break;
    case State.ENTER:
      handleEnter();
      break;
    default:
      handleProbeResponse(text);
      break;
  }
}

function exportMarkdown() {
  if (!store.report) {
    store.report = buildReport();
  }
  const lines = [
    `# AI Talent Guide 会话 (${store.sessionId})`,
    "",
    store.report,
    "",
    "## 对话记录",
  ];
  store.conversationLog.forEach((entry) => {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    lines.push(
      `- [${timestamp}] ${entry.role === "user" ? "User" : "Coach"} (${entry.state}): ${entry.plain}`
    );
  });
  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${store.sessionId}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("Markdown 已导出");
}

function toggleReportVisibility() {
  dom.reportPreview.hidden = !dom.reportPreview.hidden;
  dom.toggleReportBtn.textContent = dom.reportPreview.hidden ? "展开" : "收起";
}

function replayScenario() {
  const choice = prompt(
    `选择测试用例:\n${scenarios
      .map((s, idx) => `${idx + 1}. ${s.name}`)
      .join("\n")}\n输入数字继续。`
  );
  const index = Number(choice) - 1;
  if (Number.isNaN(index) || !scenarios[index]) return;
  runScenario(scenarios[index]);
}

async function runScenario(scenario) {
  resetSession();
  showToast(`载入：${scenario.name}`);
  for (const step of scenario.steps) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    appendMessage({ role: "user", state: store.state, content: step });
    switch (store.state) {
      case State.PROBE:
        handleProbeResponse(step);
        break;
      case State.REFLECT:
        handleReflectResponse(step);
        break;
      case State.VALIDATE:
        handleValidateResponse(step);
        break;
      case State.FOCUS:
        handleFocusResponse(step);
        break;
      case State.APPLY:
        handleApplyResponse(step);
        break;
      case State.REPORT:
        handleReportResponse(step);
        break;
      default:
        handleProbeResponse(step);
        break;
    }
  }
}

function resetSession() {
  resetStore();
  dom.sessionId.textContent = store.sessionId;
  dom.loopCount.textContent = "0";
  dom.progressValue.style.width = "0%";
  dom.progressLabel.textContent = `0 / ${maxSteps}`;
  dom.conversationContainer.innerHTML = "";
  dom.hypothesisChips.innerHTML = "";
  dom.signalList.innerHTML = "";
  dom.reportPreview.hidden = true;
  dom.toggleReportBtn.textContent = "收起";
  dom.composer.classList.remove("disabled");
  dom.userInput.disabled = false;
  dom.sendBtn.disabled = false;
  setState(State.ENTER);
  renderSignals();
  renderHypotheses();
  handleEnter();
}

function init() {
  dom.composer.addEventListener("submit", handleUserInput);
  dom.exportMarkdownBtn.addEventListener("click", exportMarkdown);
  dom.resetBtn.addEventListener("click", resetSession);
  dom.toggleReportBtn.addEventListener("click", toggleReportVisibility);
  dom.loadScenarioBtn.addEventListener("click", replayScenario);
  resetSession();
}

init();
