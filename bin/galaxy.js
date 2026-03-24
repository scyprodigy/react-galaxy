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

// ====== view 指令（可視化伺服器，讀取 docs/index.html）======
program
  .command('view')
  .description('Start local viewer server')
  .action(() => {
    const port = 3000;
    const galaxyJsonPath = path.join(process.cwd(), 'galaxy.json');
    const indexPath = path.join(projectRoot, 'docs', 'index.html');

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
        // 提供 docs/index.html
        fs.readFile(indexPath, 'utf8', (err, html) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - docs/index.html not found</h1><p>Please ensure the file exists in the docs folder.</p>');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
          }
        });
      }
    });

    server.listen(port, () => {
      console.log(`🚀 Galaxy Viewer 啟動：http://localhost:${port}`);
      console.log(`📄 讀取數據：${galaxyJsonPath}`);
      console.log(`🌐 頁面來源：${indexPath}`);
      if (!fs.existsSync(galaxyJsonPath)) {
        console.warn(`⚠️  找不到 galaxy.json，請先執行掃描。`);
      }
      if (!fs.existsSync(indexPath)) {
        console.warn(`⚠️  找不到 docs/index.html，請確認檔案存在。`);
      }
    });
  });

program.parse(process.argv);