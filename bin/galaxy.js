#!/usr/bin/env node

import { Command } from 'commander';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const program = new Command();

program
  .name('galaxy')
  .description('React component dependency visualizer')
  .version('1.0.0');

// ====== scan 指令 ======
function scanProject(dir, outputFile = 'galaxy.json') {
  const scriptPath = path.join(projectRoot, 'analyze-components.mjs');
  const args = [scriptPath, dir, outputFile];

  console.log(`🔍 掃描目錄：${dir} → 輸出 ${outputFile}`);

  const child = spawn('node', args, { stdio: 'inherit' });

  child.on('error', (err) => {
    console.error(`❌ 無法執行掃描: ${err.message}`);
  });

  child.on('exit', (code) => {
    if (code === 0) {
      console.log(`✅ 掃描完成，結果已寫入 ${outputFile}`);
    } else {
      console.error(`❌ 掃描失敗，退出碼 ${code}`);
    }
  });
}

program
  .command('scan <directory>')
  .description('Scan a React project directory and generate galaxy.json')
  .option('-o, --output <file>', 'output file name', 'galaxy.json')
  .action((directory, options) => {
    scanProject(directory, options.output);
  });

// ====== view 指令（可視化伺服器） ======
program
  .command('view')
  .description('Start local viewer server')
  .action(() => {
    const port = 3000;
    const galaxyJsonPath = path.join(process.cwd(), 'galaxy.json');

    const server = http.createServer((req, res) => {
      if (req.url === '/galaxy.json') {
        // 提供 JSON 數據
        fs.readFile(galaxyJsonPath, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'galaxy.json not found. Run `galaxy scan` first.' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
          }
        });
      } else {
        // 提供 HTML 頁面
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>React Galaxy - Component Dependency</title>
            <meta charset="utf-8">
            <style>
              body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
              #network { width: 100vw; height: 100vh; background: #0a0a1a; }
              .info {
                position: absolute;
                bottom: 10px;
                left: 10px;
                background: rgba(0,0,0,0.7);
                color: #ccc;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                pointer-events: none;
                z-index: 10;
              }
            </style>
            <script type="text/javascript" src="https://unpkg.com/vis-network@9.1.2/dist/vis-network.min.js"></script>
          </head>
          <body>
            <div id="network"></div>
            <div class="info">
              🌌 React Galaxy | 節點大小代表元件行數 | 邊表示依賴關係
            </div>
            <script>
              fetch('/galaxy.json')
                .then(res => res.json())
                .then(data => {
                  // 構建節點和邊
                  const nodes = [];
                  const edges = [];
                  const nodeMap = new Map();

                  data.forEach(comp => {
                    const id = comp.name;
                    nodeMap.set(id, {
                      id: id,
                      label: comp.name,
                      title: \`路徑: \${comp.path}\\n行數: \${comp.lines}\\n依賴: \${comp.dependencies.join(', ') || '無'}\`,
                      value: comp.lines,  // 用行數決定節點大小
                    });
                  });

                  // 添加節點
                  for (let node of nodeMap.values()) {
                    nodes.push(node);
                  }

                  // 添加邊
                  data.forEach(comp => {
                    const from = comp.name;
                    comp.dependencies.forEach(to => {
                      if (nodeMap.has(to)) {
                        edges.push({ from, to, arrows: 'to', smooth: { type: 'curvedCW' } });
                      }
                    });
                  });

                  const container = document.getElementById('network');
                  const options = {
                    nodes: {
                      shape: 'dot',
                      scaling: {
                        min: 10,
                        max: 60,
                        label: { enabled: true, min: 12, max: 30 }
                      },
                      font: { color: '#ffffff', size: 14, face: 'monospace' },
                      borderWidth: 2,
                      shadow: true
                    },
                    edges: {
                      color: { color: '#88aaff', highlight: '#ffaa88' },
                      width: 2,
                      smooth: { type: 'continuous', roundness: 0.5 },
                      arrows: { to: { enabled: true, scaleFactor: 0.8 } }
                    },
                    physics: {
                      stabilization: { iterations: 200 },
                      barnesHut: { gravitationalConstant: -8000, centralGravity: 0.3, springLength: 150 }
                    },
                    interaction: {
                      hover: true,
                      tooltipDelay: 200,
                      zoomView: true,
                      dragView: true
                    }
                  };
                  const network = new vis.Network(container, { nodes, edges }, options);
                })
                .catch(err => {
                  console.error(err);
                  document.body.innerHTML = '<h2 style="color:red;padding:20px">❌ 無法載入 galaxy.json，請先執行 <code>galaxy scan ./src</code></h2>';
                });
            </script>
          </body>
          </html>
        `);
      }
    });

    server.listen(port, () => {
      console.log(`🚀 Galaxy Viewer 啟動：http://localhost:${port}`);
      console.log(`📄 讀取數據：${galaxyJsonPath}`);
      if (!fs.existsSync(galaxyJsonPath)) {
        console.warn(`⚠️  找不到 galaxy.json，請先執行掃描。`);
      }
    });
  });

program.parse(process.argv);