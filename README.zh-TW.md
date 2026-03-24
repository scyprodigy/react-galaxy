# 🌌 React Galaxy

> A React component dependency visualizer that turns your codebase into an interactive galaxy.  
> 一個將 React 元件依賴關係轉化為「星系圖」的可視化工具。

[🚀 Live Demo](https://scyprodigy.github.io/react-galaxy/)

---

## 🖼️ Preview

> 實際展示：12 個元件的依賴關係，節點大小代表程式碼行數，連線表示依賴方向。

---

## ✨ Features

- 🧠 **Inspired by LLM Neuroanatomy**  
  將元件架構視覺化為神經網絡般的結構，一眼看出共用元件與依賴鏈。

- 📐 **Orthogonal Metrics（行數 vs 依賴數）**  
  節點大小 ＝ 程式碼行數；連線數 ＝ 依賴數量。同時掌握規模與複雜度。

- ⚡ **Real-time Interaction**  
  拖曳、縮放；滑鼠懸停查看元件資訊（路徑、行數、依賴列表）；點擊追蹤依賴關係。

---

## 🚀 Quick Start

### 使用 npx（無需安裝）

```bash
npx react-dep-galaxy scan ./src
npx react-dep-galaxy view
```

### 本地安裝後使用

```bash
npm install -g react-dep-galaxy
galaxy scan ./src
galaxy view
```

打開瀏覽器：`http://localhost:3000`

> 💡 第一次執行 `scan` 會產生 `galaxy.json`，`view` 會啟動伺服器讀取該檔案。

---

## 📦 How It Works

### 1️⃣ Scan Phase

- 解析 React 專案（支援 `.jsx`、`.tsx`、`.js`）
- 識別函式元件與類別元件
- 建立元件依賴圖（基於 import 與 JSX 標籤）
- 輸出 `galaxy.json`

### 2️⃣ View Phase

- 啟動本地 HTTP 伺服器
- 使用 `vis-network` 渲染力導向圖
- 節點大小、顏色對應行數與依賴數量

---

## 📁 Output Example

```json
[
  {
    "name": "App",
    "path": "src/App.jsx",
    "lines": 24,
    "dependencies": ["Header", "MainContent", "Footer"]
  }
]
```

---

## 🛠️ Development

```bash
git clone https://github.com/<你的用戶名>/react-galaxy.git
cd react-galaxy
npm install
npm link          # 將指令 `galaxy` 連結到全域
```

---

## 🚀 Deploy to GitHub Pages

靜態展示檔案已放在 `docs/` 目錄，只需在倉庫設定中開啟 Pages：

1. 進入倉庫 → **Settings → Pages**
2. Branch: `main`，Folder: `/docs`
3. 點擊 **Save**

稍候一分鐘，即可透過 `https://<你的GitHub用戶名>.github.io/<你的倉庫名>/` 訪問線上展示。

---

## 🤝 Contributing

歡迎任何形式的貢獻 🙌

1. Fork 本倉庫
2. 建立新分支：`git checkout -b feature/amazing-feature`
3. 提交修改：`git commit -m "feat: add amazing feature"`
4. 推送分支：`git push origin feature/amazing-feature`
5. 開啟 Pull Request

---

## 🧭 Roadmap

- [ ] AST 精準解析（支援 TypeScript、HOC）
- [ ] 插件系統（自訂指標、輸出格式）
- [ ] AI 輔助分析（LLM 自動識別複雜元件）
- [ ] 遠端專案分析（上傳程式碼或 GitHub 連結）

---

## 📄 License

MIT License © 2026 [scyprodigy]
