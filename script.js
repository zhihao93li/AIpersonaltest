const conversationData = {
  keyPoints: [
    '拆分需求：明确界面模块、数据结构与交互能力。',
    '构建静态对话数据，方便在前端快速复现 Demo。',
    '提供搜索、主题分组与 Markdown 导出功能便于复用。'
  ],
  messages: [
    {
      id: 'm1',
      role: 'system',
      name: '系统',
      topic: '项目启动',
      timestamp: '2025-11-10 09:28',
      contentHtml: `
        <p>你是一位产品顾问，帮助用户将 ChatGPT 对话整理为网页形式，强调可视化展示和交互体验。</p>
      `
    },
    {
      id: 'm2',
      role: 'user',
      name: '用户',
      topic: '项目启动',
      timestamp: '2025-11-10 09:30',
      contentHtml: `
        <p>我拿到了一段对话，希望能够做成网页 Demo，展示需求拆解的过程，也方便和团队沟通。</p>
      `
    },
    {
      id: 'm3',
      role: 'assistant',
      name: 'ChatGPT',
      topic: '需求分析',
      timestamp: '2025-11-10 09:31',
      contentHtml: `
        <p>可以先从结构入手：</p>
        <ol>
          <li>明确对话背景与要点。</li>
          <li>提炼关键步骤作为导航。</li>
          <li>准备示例数据，方便静态渲染。</li>
        </ol>
      `
    },
    {
      id: 'm4',
      role: 'user',
      name: '用户',
      topic: '需求分析',
      timestamp: '2025-11-10 09:33',
      contentHtml: `
        <p>能否再补充一些交互，比如搜索或导出？</p>
      `
    },
    {
      id: 'm5',
      role: 'assistant',
      name: 'ChatGPT',
      topic: '交互设计',
      timestamp: '2025-11-10 09:34',
      contentHtml: `
        <p>当然可以，建议实现以下功能：</p>
        <ul>
          <li><strong>关键词搜索</strong>：快速定位关注的节点。</li>
          <li><strong>主题分组</strong>：按照阶段展示，例如“项目启动”、“需求分析”。</li>
          <li><strong>Markdown 导出</strong>：方便分享给其他成员或存档。</li>
        </ul>
      `
    },
    {
      id: 'm6',
      role: 'assistant',
      name: 'ChatGPT',
      topic: '实现建议',
      timestamp: '2025-11-10 09:36',
      contentHtml: `
        <p>可以采用简单的前端栈来完成：</p>
        <pre><code class="language-bash">npm create vite@latest demo-chat -- --template vanilla
cd demo-chat
npm install
npm run dev</code></pre>
        <p>随后将对话数据写成 JSON，前端根据数据生成卡片。</p>
      `
    },
    {
      id: 'm7',
      role: 'user',
      name: '用户',
      topic: '实现建议',
      timestamp: '2025-11-10 09:38',
      contentHtml: `
        <p>如果不使用构建工具，直接静态页面能否完成？</p>
      `
    },
    {
      id: 'm8',
      role: 'assistant',
      name: 'ChatGPT',
      topic: '实现建议',
      timestamp: '2025-11-10 09:39',
      contentHtml: `
        <p>完全可以。准备一个 <code>index.html</code>，再配合 CSS 与 JS，就能快速搭建。</p>
        <p>核心是保证数据与视图解耦，后续替换真实对话内容即可。</p>
      `
    },
    {
      id: 'm9',
      role: 'assistant',
      name: 'ChatGPT',
      topic: '后续计划',
      timestamp: '2025-11-10 09:41',
      contentHtml: `
        <p>完成静态 Demo 后，可以继续添加：</p>
        <ul>
          <li>粘贴分享链接自动解析的能力。</li>
          <li>对接团队协作工具，直接推送最新方案。</li>
          <li>记录每轮迭代版本，形成知识库。</li>
        </ul>
      `
    }
  ]
};

const conversationContainer = document.getElementById('conversationContainer');
const keyPointsList = document.getElementById('keyPointsList');
const searchInput = document.getElementById('searchInput');
const groupToggle = document.getElementById('groupToggle');
const exportBtn = document.getElementById('exportBtn');
const messageTemplate = document.getElementById('messageTemplate');

function renderKeyPoints(points) {
  keyPointsList.innerHTML = '';
  points.forEach((point) => {
    const li = document.createElement('li');
    li.textContent = point;
    keyPointsList.appendChild(li);
  });
}

function filterMessages(keyword) {
  if (!keyword) return conversationData.messages;
  const lower = keyword.toLowerCase();
  return conversationData.messages.filter((message) =>
    message.contentHtml.replace(/<[^>]*>/g, '').toLowerCase().includes(lower)
  );
}

function renderMessages(messages, { grouped } = { grouped: false }) {
  conversationContainer.innerHTML = '';

  if (grouped) {
    const groups = messages.reduce((acc, message) => {
      acc[message.topic] ||= [];
      acc[message.topic].push(message);
      return acc;
    }, {});

    Object.entries(groups).forEach(([topic, groupMessages]) => {
      const section = document.createElement('section');
      section.className = 'topic-group';
      const heading = document.createElement('h3');
      heading.textContent = topic;
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'topic-messages';
      groupMessages.forEach((message) => {
        list.appendChild(createMessageElement(message));
      });

      section.appendChild(list);
      conversationContainer.appendChild(section);
    });
  } else {
    messages.forEach((message) => {
      conversationContainer.appendChild(createMessageElement(message));
    });
  }
}

function createMessageElement(message) {
  const node = messageTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.role = message.role;
  node.querySelector('.role').textContent = `${message.name} · ${message.role}`;
  node.querySelector('.timestamp').textContent = message.timestamp;
  node.querySelector('.content').innerHTML = message.contentHtml;
  const topicTag = node.querySelector('.topic-tag');
  topicTag.textContent = message.topic;

  const copyBtn = node.querySelector('.copy-btn');
  copyBtn.addEventListener('click', () => handleCopy(message));

  return node;
}

function handleCopy(message) {
  const text = `【${message.name}】${stripHtml(message.contentHtml)}`.trim();
  navigator.clipboard
    .writeText(text)
    .then(() => showToast('已复制到剪贴板'))
    .catch(() => showToast('复制失败，请手动选择文本'));
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function showToast(text) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = text;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    toast.addEventListener('transitionend', () => toast.remove(), {
      once: true
    });
  }, 2200);
}

function exportMarkdown(messages) {
  const content = messages
    .map((message) => {
      const roleLabel = `${message.name} (${message.role})`;
      const body = stripHtml(message.contentHtml).replace(/\n{2,}/g, '\n');
      return `### ${roleLabel}\n- 时间：${message.timestamp}\n- 主题：${message.topic}\n\n${body}\n`;
    })
    .join('\n---\n\n');

  const header = `# ChatGPT 对话纪要\n\n原始分享：${document.querySelector('.share-link').href}\n\n`;
  downloadFile('conversation.md', header + content);
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

renderKeyPoints(conversationData.keyPoints);
renderMessages(conversationData.messages, { grouped: false });

searchInput.addEventListener('input', () => {
  const filtered = filterMessages(searchInput.value);
  renderMessages(filtered, { grouped: groupToggle.checked });
});

groupToggle.addEventListener('change', () => {
  const filtered = filterMessages(searchInput.value);
  renderMessages(filtered, { grouped: groupToggle.checked });
});

exportBtn.addEventListener('click', () => {
  const filtered = filterMessages(searchInput.value);
  exportMarkdown(filtered);
});
