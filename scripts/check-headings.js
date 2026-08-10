#!/usr/bin/env node
/**
 * scripts/check-headings.js
 *
 * 哥飞 TDH 方法论 H 骨架校验脚本（SubTask 12.3 + 12.4）。
 *
 * 功能：
 * - 遍历 .next/server/app 下的 HTML 输出（需先 `npm run build`）
 * - 每页 H1 数量必须 = 1（SubTask 12.3）
 * - H2/H3 层级合理：H3 不应直接跟在 H1 后（应有 H2 包裹）（SubTask 12.4）
 * - 报告所有异常页面
 *
 * 用法：
 *   node scripts/check-headings.js
 *
 * 退出码：
 *   0 = 全部页面通过
 *   1 = 有异常页面
 *
 * 备注：纯 Node 实现（无外部依赖），与 scripts/ 下的 Python 脚本并存。
 */

const fs = require("fs");
const path = require("path");

const APP_DIR = path.resolve(__dirname, "..", ".next", "server", "app");

/**
 * 递归收集目录下所有 .html 文件。
 */
function collectHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(full, files);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

/**
 * 从 HTML 字符串中提取所有 <h1>/<h2>/<h3> 标签及其文本。
 * 仅服务端渲染的标签会被解析；客户端注入的标签也会出现在最终 HTML 中，
 * 但 build 产物已包含 SSR/SSG 完整 HTML，足够校验。
 */
function extractHeadings(html) {
  const headings = [];
  const re = /<h([123])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const level = parseInt(m[1], 10);
    // 去 HTML 标签 + 解码常见实体 + 压缩空白
    const text = m[2]
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    headings.push({ level, text });
  }
  return headings;
}

/**
 * 校验单页：
 * - H1 数量必须 = 1
 * - H3 不应直接跟在 H1 后（中间需有 H2 包裹）
 */
function validatePage(headings) {
  const errors = [];
  const h1Count = headings.filter((h) => h.level === 1).length;

  if (h1Count === 0) {
    errors.push("missing H1 (found 0)");
  } else if (h1Count > 1) {
    errors.push(
      `multiple H1 (found ${h1Count}): ` +
        headings
          .filter((h) => h.level === 1)
          .map((h) => `"${h.text.slice(0, 60)}"`)
          .join(", ")
    );
  }

  // H3 直接跟在 H1 后的层级异常
  for (let i = 0; i < headings.length; i++) {
    if (headings[i].level === 3) {
      // 向前找第一个非空层级
      let prev = null;
      for (let j = i - 1; j >= 0; j--) {
        prev = headings[j];
        break;
      }
      if (prev && prev.level === 1) {
        errors.push(
          `H3 directly after H1 (should be wrapped in H2): "${headings[i].text.slice(
            0,
            60
          )}"`
        );
      }
    }
  }

  return errors;
}

function main() {
  if (!fs.existsSync(APP_DIR)) {
    console.error(
      `[check-headings] .next/server/app 不存在。请先运行 \`npm run build\`。`
    );
    console.error(`  expected: ${APP_DIR}`);
    process.exit(2);
  }

  const files = collectHtmlFiles(APP_DIR);
  if (files.length === 0) {
    console.error(
      `[check-headings] ${APP_DIR} 下未找到 .html 文件。请先运行 \`npm run build\`。`
    );
    process.exit(2);
  }

  let totalErrors = 0;
  const pagesWithErrors = [];

  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const headings = extractHeadings(html);
    const errors = validatePage(headings);
    if (errors.length > 0) {
      totalErrors += errors.length;
      pagesWithErrors.push({ file, errors, h1Count: headings.filter((h) => h.level === 1).length });
    }
  }

  // 输出报告
  const rel = (p) => path.relative(APP_DIR, p).replace(/\\/g, "/");
  console.log(`[check-headings] scanned ${files.length} HTML files under .next/server/app`);
  console.log(`[check-headings] pages with errors: ${pagesWithErrors.length}`);

  if (pagesWithErrors.length === 0) {
    console.log("[check-headings] ✅ ALL PASS — every page has exactly one H1 and valid H2/H3 nesting.");
    process.exit(0);
  }

  for (const { file, errors, h1Count } of pagesWithErrors) {
    console.log("");
    console.log(`❌ ${rel(file)} (H1 count: ${h1Count})`);
    for (const e of errors) {
      console.log(`   - ${e}`);
    }
  }

  console.log("");
  console.log(`[check-headings] ❌ FAIL — ${totalErrors} error(s) across ${pagesWithErrors.length} page(s).`);
  process.exit(1);
}

main();
