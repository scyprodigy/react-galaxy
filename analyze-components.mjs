/**
 * analyze-components.mjs
 *
 * 使用 Babel 解析 React 專案中的 .jsx / .tsx 檔案，
 * 輸出每個元件的名稱、路徑、行數與依賴列表。
 *
 * 用法：
 *   node analyze-components.mjs [srcDir] [outputFile]
 *
 * 範例：
 *   node analyze-components.mjs ./src galaxy.json
 *
 * 安裝依賴：
 *   npm install @babel/parser @babel/traverse glob
 */

import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { glob } from "glob";

// @babel/traverse 只有 CJS export，用 createRequire 載入
const require = createRequire(import.meta.url);
const parser = require("@babel/parser");
const traverseModule = require("@babel/traverse");
const traverse = traverseModule.default ?? traverseModule;

// ─── 常數 ────────────────────────────────────────────────────────────────────

const BABEL_PLUGINS = [
  "jsx",
  "typescript",
  "classProperties",
  "decorators-legacy",
  "dynamicImport",
  "optionalChaining",
  "nullishCoalescingOperator",
  "exportDefaultFrom",
  "importAssertions",
];

// 只追蹤大寫開頭的標籤（React 元件慣例）
const isComponentName = (name) => /^[A-Z]/.test(name);

// ─── 解析單一檔案 ─────────────────────────────────────────────────────────────

/**
 * @param {string} filePath  絕對路徑
 * @param {string} rootDir   專案根目錄（用於計算相對路徑）
 * @returns {Array<{name, path, lines, dependencies}>}
 */
function analyzeFile(filePath, rootDir) {
  const source = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");
  const totalLines = source.split("\n").length;

  let ast;
  try {
    ast = parser.parse(source, {
      sourceType: "module",
      plugins: BABEL_PLUGINS,
      errorRecovery: true,
    });
  } catch (err) {
    console.warn(`⚠️  無法解析 ${relativePath}：${err.message}`);
    return [];
  }

  // ── 1. 收集所有 import 資訊 ──────────────────────────────────────────────
  // importedNames: Set<string>  — 此檔案 import 的所有識別符
  // importMap: Map<localName, source>
  const importedNames = new Set();
  const importMap = new Map(); // localName → import source

  traverse(ast, {
    ImportDeclaration({ node }) {
      for (const specifier of node.specifiers) {
        const local = specifier.local.name;
        importedNames.add(local);
        importMap.set(local, node.source.value);
      }
    },
  });

  // ── 2. 識別元件定義 ───────────────────────────────────────────────────────
  // 收集每個元件：{ name, startLine, endLine, jsxTags: Set<string> }
  const componentMap = new Map(); // name → component info

  const registerComponent = (name, startLine, endLine) => {
    if (!name || !isComponentName(name)) return;
    if (!componentMap.has(name)) {
      componentMap.set(name, {
        name,
        startLine,
        endLine,
        jsxTags: new Set(),
      });
    } else {
      // 同名多次定義時，取最後一個（override / HOC pattern）
      const existing = componentMap.get(name);
      existing.startLine = startLine;
      existing.endLine = endLine;
    }
  };

  traverse(ast, {
    // function Component() {} / export default function Component() {}
    FunctionDeclaration({ node }) {
      if (node.id) {
        registerComponent(
          node.id.name,
          node.loc?.start.line,
          node.loc?.end.line
        );
      }
    },

    // const Component = () => {} / const Component = function() {}
    VariableDeclarator({ node }) {
      if (
        node.id?.type === "Identifier" &&
        isComponentName(node.id.name) &&
        (node.init?.type === "ArrowFunctionExpression" ||
          node.init?.type === "FunctionExpression")
      ) {
        registerComponent(
          node.id.name,
          node.loc?.start.line,
          node.loc?.end.line
        );
      }
    },

    // class Component extends React.Component / Component
    ClassDeclaration({ node }) {
      if (node.id) {
        registerComponent(
          node.id.name,
          node.loc?.start.line,
          node.loc?.end.line
        );
      }
    },

    // export default class / export default function
    ExportDefaultDeclaration({ node }) {
      const decl = node.declaration;
      if (
        (decl.type === "FunctionDeclaration" ||
          decl.type === "ClassDeclaration") &&
        decl.id
      ) {
        registerComponent(
          decl.id.name,
          decl.loc?.start.line,
          decl.loc?.end.line
        );
      }
    },
  });

  // ── 3. 收集 JSX 中使用的元件標籤 ─────────────────────────────────────────
  // 策略：找出每個 JSXOpeningElement，判斷它屬於哪個元件定義的範圍
  traverse(ast, {
    JSXOpeningElement({ node }) {
      let tagName = null;
      if (node.name.type === "JSXIdentifier") {
        tagName = node.name.name;
      } else if (node.name.type === "JSXMemberExpression") {
        // e.g. <UI.Button> → 取最外層物件名
        let obj = node.name;
        while (obj.type === "JSXMemberExpression") obj = obj.object;
        tagName = obj.name;
      }

      if (!tagName || !isComponentName(tagName)) return;

      const line = node.loc?.start.line ?? 0;

      // 找最近包圍此 JSX 的元件
      let bestComp = null;
      for (const comp of componentMap.values()) {
        if (
          comp.startLine <= line &&
          line <= comp.endLine &&
          (!bestComp ||
            comp.endLine - comp.startLine <
              bestComp.endLine - bestComp.startLine)
        ) {
          bestComp = comp;
        }
      }

      if (bestComp && tagName !== bestComp.name) {
        bestComp.jsxTags.add(tagName);
      }
    },
  });

  // ── 4. 組合輸出 ───────────────────────────────────────────────────────────
  const results = [];

  for (const comp of componentMap.values()) {
    // 依賴 = JSX 中使用且在 importedNames 裡的元件名稱
    // （過濾掉同檔案內的輔助元件）
    const dependencies = [...comp.jsxTags].filter((tag) =>
      importedNames.has(tag)
    );

    results.push({
      name: comp.name,
      path: relativePath,
      lines: (comp.endLine ?? totalLines) - (comp.startLine ?? 1) + 1,
      dependencies: [...new Set(dependencies)].sort(),
    });
  }

  return results;
}

// ─── 掃描目錄 ─────────────────────────────────────────────────────────────────

async function analyzeProject(srcDir, outputFile) {
  const absoluteSrc = path.resolve(srcDir);

  console.log(`🔍  掃描目錄：${absoluteSrc}`);

  const files = await glob("**/*.{js,jsx,ts,tsx}", {
    cwd: absoluteSrc,
    absolute: true,
    ignore: ["**/node_modules/**", "**/__tests__/**", "**/*.test.*", "**/*.spec.*"],
  });

  console.log(`📄  找到 ${files.length} 個檔案`);

  const allComponents = [];

  for (const file of files) {
    const components = analyzeFile(file, path.resolve("."));
    allComponents.push(...components);
  }

  // 按元件名稱排序，方便閱讀
  allComponents.sort((a, b) => a.name.localeCompare(b.name));

  const json = JSON.stringify(allComponents, null, 2);

  if (outputFile) {
    fs.writeFileSync(outputFile, json, "utf-8");
    console.log(`✅  輸出至 ${outputFile}（共 ${allComponents.length} 個元件）`);
  } else {
    console.log(json);
  }

  return allComponents;
}

// ─── CLI 入口 ─────────────────────────────────────────────────────────────────

const [, , srcArg = "./src", outArg = "galaxy.json"] = process.argv;
await analyzeProject(srcArg, outArg);
