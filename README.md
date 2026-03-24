# 🌌 React Galaxy

> A React component dependency visualizer that turns your codebase into an interactive galaxy.

[🚀 Live Demo](https://scyprodigy.github.io/react-galaxy/)

---

## 🖼️ Preview

> Live demo: 12 components, node size represents line count, edges represent dependency direction.

---

## ✨ Features

- 🧠 **Inspired by LLM Neuroanatomy**  
  Visualize your component architecture as a neural network — spot shared components and dependency chains at a glance.

- 📐 **Orthogonal Metrics (lines vs. dependencies)**  
  Node size = line count; edge count = number of dependencies. Understand both scale and complexity in one view.

- ⚡ **Real-time Interaction**  
  Drag, zoom, hover to inspect component details (path, line count, dependency list), and click to trace dependency chains.

---

## 🚀 Quick Start

### Using npx (no install required)

```bash
npx react-dep-galaxy scan ./src
npx react-dep-galaxy view
```

### Global install

```bash
npm install -g react-dep-galaxy
galaxy scan ./src
galaxy view
```

Open your browser at `http://localhost:3000`

> 💡 Running `scan` generates a `galaxy.json` file. `view` starts a local server that reads it.

---

## 📦 How It Works

### 1️⃣ Scan Phase

- Parses your React project (supports `.jsx`, `.tsx`, `.js`)
- Detects function components and class components
- Builds a component dependency graph from imports and JSX tag usage
- Outputs `galaxy.json`

### 2️⃣ View Phase

- Starts a local HTTP server
- Renders a force-directed graph using `vis-network`
- Node size and color reflect line count and dependency depth

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
git clone https://github.com/<your-username>/react-galaxy.git
cd react-galaxy
npm install
npm link          # Links the `galaxy` command globally
```

---

## 🚀 Deploy to GitHub Pages

Static demo files are located in the `docs/` directory. To publish:

1. Go to your repo → **Settings → Pages**
2. Set Branch: `main`, Folder: `/docs`
3. Click **Save**

Your demo will be live at `https://<your gitHub username>.github.io/<your repository name>/` within a minute.

---

## 🤝 Contributing

All contributions are welcome 🙌

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🧭 Roadmap

- [ ] Precise AST parsing (TypeScript, HOC support)
- [ ] Plugin system (custom metrics and output formats)
- [ ] AI-assisted analysis (LLM-powered component complexity detection)
- [ ] Remote project analysis (upload code or link a GitHub repo)

---

## 📄 License

MIT License © 2026 [scyprodigy]
