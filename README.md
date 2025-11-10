# AI Talent Guide – 动态引导树 Demo

该仓库实现了《AI Talent Guide – 动态引导树产品需求文档（PRD v1.0）》所述的一期 MVP 前端 Demo，提供引导式自我探索体验的关键交互、状态机、评分逻辑与报告导出能力，便于工程团队直接落地、联调中台编排器。

## 功能概览

- **状态机驱动的对话体验**：遵循 `ENTER → PROBE → REFLECT → VALIDATE → FOCUS → APPLY → REPORT → LOOP` 全链路，自动调度探针问题、复述校准、对立验证及回环补探。
- **启发式信号抽取与向量映射**：基于 PRD 中的关键词词表实现本地 scoring，引擎实时维护 8 个 Signals 与 8 个 Vector 维度，并按照阈值（Focus ≥ 0.68，Apply/Report ≥ 0.75）推进状态。
- **画像 1.0 生成**：自动生成 Markdown 报告，包含 Top 3 向量、证据引用、下一步建议，可一键导出并在 UI 中预览。
- **监控面板**：左侧侧栏实时展示 Session ID、当前状态、Loop 次数、信号权重与 Top2 假说 Chips，便于测试与调参。
- **测试用例回放**：内置“高理解”“高创造”两类典型用户脚本，用于验证评分与状态转移。

## 快速预览

1. 安装任意静态服务，例如使用 Python：

   ```bash
   python -m http.server 8000
   ```

2. 访问 `http://localhost:8000`，浏览器即呈现 Demo。
3. 页面加载后系统自动进入 `ENTER`，随后发出首个 PROBE（A 维度）探针，按提示互动即可体验完整链路。

## 关键实现说明

### 状态机与控制流

- `script.js` 定义 `State` 枚举与 `store`，管理当前状态、步数、循环次数与信号权重。
- `handleProbeResponse`、`handleReflectResponse` 等函数分别处理用户在各状态下的输入，并根据阈值决定下一状态。
- `pickProbeQuestion` 维护 A/B/C 三个探针队列，确保每轮单题、跨维度覆盖。

### 信号抽取与向量映射

- `analyzeSignals` 依据 PRD 词表统计命中次数，每次命中 +2，强情绪词额外 +2，负情绪词 -1。
- `applySignalUpdate` 在纠偏时支持减去最近一次加权，满足“强否定纠偏”测试场景。
- `vectorMapping` 实现八个向量分量，`norm` 进行归一化（上限 1.0），`rankVectors` 负责排序与 Chips 渲染。

### 报告输出

- `buildReport` 生成符合 PRD 的 Markdown，含 Top3、证据引用与行动建议。
- `exportMarkdown` 允许导出完整会话记录；UI 中 `reportPreview` 模块可即时预览。

### 测试用例

`scenarios` 数组封装 2 个 MVP 样例：

1. **高理解型用户**：多次触发 `abstract_think` 与 `system_opt`，确保 `understand` ≥ 0.7 后进入 APPLY、REPORT。
2. **高创造型用户**：聚焦 `tinker_bias`、`aesthetic_sense`，验证创造向量的晋级流程。

点击“载入测试用例”按钮，根据弹窗输入编号即可自动回放，快速验证状态机稳定性。

## 后续扩展

- 中台接入：按 `/session/start`、`/session/step`、`/session/report` 接口契约（PRD §8.2）替换本地启发式，保留 UI 与状态机。
- 埋点：在前端增加 `session_start`、`state_enter` 等事件上报，方便闭环跟踪。
- 多语言：依据 `locale` 扩展中英文 prompt/模板；当前 Demo 默认 `zh-CN`。

欢迎基于本 Demo 继续扩展 LLM 函数调用、PDF 导出与二次画像体验。
