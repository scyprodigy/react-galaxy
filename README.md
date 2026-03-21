# 🌌 React Galaxy

> A React component dependency visualizer that turns your codebase into an interactive galaxy.  
> 一個將 React 元件依賴關係轉化為「星系圖」的可視化工具。

[🚀 Live Demo](https://scyprodigy.github.io/react-galaxy/)

---

## 🖼️ Preview | 預覽

> 實際展示：12 個元件的依賴關係，節點大小代表程式碼行數，連線表示依賴方向。

---

## ✨ Features | 功能亮點

* 🧠 **Inspired by LLM Neuroanatomy｜受 LLM 神經解剖學啟發**  
  將元件架構視覺化為神經網絡般的結構，一眼看出共用元件與依賴鏈。

* 📐 **Orthogonal Metrics｜正交指標（行數 vs 依賴數）**  
  - 節點大小 ＝ 程式碼行數  
  - 連線數 ＝ 依賴數量  
  同時掌握規模與複雜度。

* ⚡ **Real-time Interaction｜即時互動探索**  
  - 拖曳、縮放  
  - 滑鼠懸停查看元件資訊（路徑、行數、依賴列表）  
  - 點擊追蹤依賴關係

---

## 🚀 Quick Start | 快速開始

### 1. 使用 npx（無需安裝）
```bash
npx react-galaxy scan ./src
npx react-galaxy view
2. 或本地安裝後使用
bash
npm install -g react-galaxy
galaxy scan ./src
galaxy view
打開瀏覽器：http://localhost:3000

💡 提示：第一次執行 scan 會產生 galaxy.json，view 會啟動伺服器讀取該檔案。

📦 How It Works | 原理說明
1️⃣ Scan Phase｜掃描階段
解析 React 專案（支援 .jsx、.tsx、.js）

識別函式元件與類別元件

建立元件依賴圖（基於 import 與 JSX 標籤）

輸出 galaxy.json

2️⃣ View Phase｜視覺化階段
啟動本地 HTTP 伺服器

使用 vis-network 渲染力導向圖

節點大小、顏色對應行數與依賴數量

📁 Output Example | 輸出範例
json
[
  {
    "name": "App",
    "path": "src/App.jsx",
    "lines": 24,
    "dependencies": ["Header", "MainContent", "Footer"]
  }
]

🛠️ Development | 開發方式
bash
git clone https://github.com/<你的用戶名>/react-galaxy.git
cd react-galaxy
npm install
npm link          # 將指令 `galaxy` 連結到全域


🚀 Deploy to GitHub Pages | 部署到 GitHub Pages
我們已將靜態展示檔案放在 docs/ 目錄下，只需在 GitHub 倉庫設定中開啟 Pages：

進入倉庫 → Settings → Pages

Branch: main，Folder: /docs

點擊 Save

稍候一分鐘，即可透過 https://[yourName].github.io/react-galaxy/ 訪問線上展示。

🤝 Contributing | 貢獻指南
歡迎任何形式的貢獻 🙌

Fork 本倉庫

建立新分支：git checkout -b feature/amazing-feature

提交修改：git commit -m "feat: add amazing feature"

推送分支：git push origin feature/amazing-feature

開啟 Pull Request

🧭 Roadmap | 發展路線
AST 精準解析（支援 TypeScript、HOC）

插件系統（自訂指標、輸出格式）

AI 輔助分析（LLM 自動識別複雜元件）

遠端專案分析（上傳程式碼或 GitHub 連結）

📄 License
MIT License

Copyright (c) 2026 [scyprodigy]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
