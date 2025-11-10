# AIpersonaltest 对话 Demo

该项目将分享的 ChatGPT 对话还原成一个可交互的网页 Demo，方便直接在浏览器中查阅、搜索和分组信息。

## 目录结构

- `index.html`：页面骨架与静态内容。
- `styles.css`：页面样式与响应式布局。
- `script.js`：渲染对话、搜索、分组、复制与 Markdown 导出逻辑。

## 如何预览

1. **直接打开**：双击 `index.html` 或在浏览器中打开它即可离线浏览。
2. **启动本地服务器**：若需要避免浏览器的本地文件安全限制，可在项目根目录执行：

   ```bash
   python -m http.server 8000
   ```

   然后访问 `http://localhost:8000` 预览 Demo。

3. **使用 VS Code Live Server 等扩展**：右键 `index.html` 选择 “Open with Live Server” 也可即时预览。

## 修改后如何提交

```bash
git status
# 确认文件变更

git add .
git commit -m "Update demo instructions"
```

若需推送到远程仓库，执行 `git push`。
