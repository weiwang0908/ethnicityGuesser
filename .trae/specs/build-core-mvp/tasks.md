# Tasks

- [x] Task 1: 初始化 Next.js 14 项目骨架
  - [x] SubTask 1.1: `create-next-app` 初始化（TypeScript + App Router + Tailwind）
  - [x] SubTask 1.2: 配置 `.env.example`（`GEMINI_API_KEY` / `PLAUSIBLE_DOMAIN` / `SITE_URL`）
  - [x] SubTask 1.3: 安装核心依赖（`react-leaflet` `leaflet` `@google/generative-ai` `next-sitemap`）
  - [x] SubTask 1.4: 配置 `next.config.mjs`（图片域名白名单 + strictNext）
  - [x] SubTask 1.5: Plausible 脚本注入 `app/layout.tsx`

- [x] Task 2: Phenotype 数据抓取管线
  - [x] SubTask 2.1: 写 `scripts/scrape_phenotypes.py`，抓 humanphenotypes.net 全部 phenotype
  - [x] SubTask 2.2: 归一化为 `data/phenotypes.json`（id / slug / name / region / lat / lng / image_url / description / references）
  - [x] SubTask 2.3: 写 `scripts/scrape_countries.py`，抓 48 国合成脸 → `data/countries.json`
  - [x] SubTask 2.4: 脚本幂等可重跑 + 失败时非零退出码

- [x] Task 3: 核心布局与导航（移动优先）
  - [x] SubTask 3.1: `app/layout.tsx` 根布局 + 移动端汉堡菜单 + 桌面 nav
  - [x] SubTask 3.2: 全站 footer（disclaimer + 主分类链接 + 信任页链接）
  - [x] SubTask 3.3: Breadcrumbs 组件 + JSON-LD `BreadcrumbList`
  - [x] SubTask 3.4: SEO meta 组件（title / description / canonical / OG / Twitter / JSON-LD 注入）
  - [x] SubTask 3.5: Disclaimer 顶部条组件（phenotype / country / 工具页复用）

- [x] Task 4: 首页 `/`（按哥飞"分门别类罗列"打法）
  - [x] SubTask 4.1: Hero（CTA：Play Daily Game）移动端竖排
  - [x] SubTask 4.2: H1 含 "Ethnicity Guesser" 主词，仅此一个 H1
  - [x] SubTask 4.3: H2 章节分门别类罗列："Ethnicity Quiz Game" / "Human Phenotypes" / "Country Average Faces"
  - [x] SubTask 4.4: 每个 H2 下用 H3 列出具体子项 + 文本链接到对应二级/三级页（首页 → 二级/三级 内链）
  - [x] SubTask 4.5: "How it works" 三步说明 + 1500 字介绍文（写在 `<p>` 里）
  - [x] SubTask 4.6: 精选 phenotype 卡片网格（6 张，每张 ≥300×300 + alt）
  - [x] SubTask 4.7: FAQ 锚点 + JSON-LD `WebApplication`
  - [x] SubTask 4.8: 严格按 `h1 → h2 → p → h3 → p` 层级组织，正文不用 div 替代 p

- [x] Task 5: Classic Daily 游戏模式 `/play/classic-daily`
  - [x] SubTask 5.1: 按日期 seed 选 10 题的工具函数 `lib/dailyQuestions.ts`
  - [x] SubTask 5.2: 题目组件（合成脸图 + 题号 + 进度）
  - [x] SubTask 5.3: `react-leaflet` 世界地图组件（点击拾取经纬度）
  - [x] SubTask 5.4: 评分函数（距离衰减 + 时间加成，5000 分制）
  - [x] SubTask 5.5: 单题结果面板（真实位置 + 距离 + 得分 + 简短描述）
  - [x] SubTask 5.6: 最终结算页（总分 + 分享按钮 + 重玩）
  - [x] SubTask 5.7: JSON-LD `Game` schema

- [x] Task 6: Challenge 模式 `/play/challenge`
  - [x] SubTask 6.1: 复用 Task 5 组件，38 题无时限
  - [x] SubTask 6.2: 中途退出确认 + 进度持久化（localStorage）

- [x] Task 7: Countries 模式 `/play/countries`
  - [x] SubTask 7.1: 复用 Task 5 组件，48 题
  - [x] SubTask 7.2: 题目数据源 `data/countries.json`

- [ ] Task 8: ~~AI Ethnicity Guesser 工具~~ **已移除**（MVP 不做，延后到下一 spec）

- [x] Task 9: Phenotype 索引 + 详情页
  - [x] SubTask 9.1: `/phenotypes` 索引页（按 region 分组）
  - [x] SubTask 9.2: `/phenotype/[slug]` SSG 动态路由 + `generateStaticParams`
  - [x] SubTask 9.3: 详情页模板（图 + 描述 + 地图 + 面部特征 + 文献 + 相关）
  - [x] SubTask 9.4: 顶部 disclaimer + 底部相关 phenotype（3–5）
  - [x] SubTask 9.5: JSON-LD `Article` + `BreadcrumbList`
  - [x] SubTask 9.6: 404 处理无效 slug

- [x] Task 10: Country 页 `/country/[slug]`
  - [x] SubTask 10.1: SSG 动态路由 + `generateStaticParams`
  - [x] SubTask 10.2: 模板（合成脸 + 1500 字该国人群构成 + disclaimer）
  - [x] SubTask 10.3: JSON-LD `Article`

- [x] Task 11: 信任页
  - [x] SubTask 11.1: `/about` `/contact`（含联系表单或邮箱）
  - [x] SubTask 11.2: `/privacy-policy` `/terms`
  - [x] SubTask 11.3: `/disclaimer`（统一 YMYL 免责）
  - [x] SubTask 11.4: `/editorial-policy`（数据来源 + 审核流程）
  - [x] SubTask 11.5: `/faq`（10+ 问题 + `FAQPage` schema）

- [x] Task 12: SEO 基建（基于哥飞 TDH 方法论）
  - [x] SubTask 12.1: **全站移除 `<meta name="keywords">`**，确认无任何 keywords 标签
  - [x] SubTask 12.2: SEO meta 组件实现：每页 title（60–70 字符，主词前置）+ description（150–160 字符，自然句子）+ canonical + OG + Twitter Card
  - [x] SubTask 12.3: **每页强制单一 H1** 校验（lint 规则或组件约束）
  - [x] SubTask 12.4: H1/H2/H3 骨架校验：确保按 `h1 → h2 → p → h3 → p` 层级，正文写在 `<p>` 里
  - [x] SubTask 12.5: `app/sitemap.ts` 自动生成（phenotype + country + 静态页 + lastmod）
  - [x] SubTask 12.6: `app/robots.ts` 允许全站 + 指向 sitemap
  - [x] SubTask 12.7: canonical URL 唯一化（www/裸域/http/https/参数变体）
  - [x] SubTask 12.8: `next/og` 为首页 / phenotype / country / 游戏结算生成 1200×630 OG 图
  - [x] SubTask 12.9: `next/image` 全站图片优化 + WebP + lazy load + **alt 属性必填**
  - [x] SubTask 12.10: **后端渲染验证**：所有 TDH / H 结构 / 正文在右键查看源代码可见，无 useEffect 渲染 SEO 内容
  - [x] SubTask 12.11: Phenotype / Country / 索引 / 信任页 → SSG（`generateStaticParams` + `generateMetadata`）
  - [x] SubTask 12.12: 首页 / 工具页 / 游戏页 → SSR
  - [x] SubTask 12.13: JSON-LD `<script type="application/ld+json">` 注入 HTML（WebApplication / Game / Article / FAQPage / BreadcrumbList / Organization）
  - [x] SubTask 12.14: **内链上下互链**：三级页底部固定文本链接回上级（如 "← Back to human phenotypes"）
  - [x] SubTask 12.15: 锚文本多样化校验（不全部精确匹配主词）

- [x] Task 13: 分享卡片
  - [x] SubTask 13.1: 游戏结算 OG 图（含分数 + 品牌）
  - [x] SubTask 13.2: Twitter 分享按钮（intent URL + 文本模板）
  - [x] SubTask 13.3: 复制链接按钮

- [x] Task 14: 移动端响应式验收
  - [x] SubTask 14.1: 360 / 414 / 768 / 1024 / 1440 断点逐一检查
  - [x] SubTask 14.2: 无横向滚动 + 触摸目标 ≥44px
  - [x] SubTask 14.3: 地图 / CTA 在 360px 下可用

- [ ] Task 15: 部署到 Vercel
  - [ ] SubTask 15.1: 接入 Git 仓库
  - [ ] SubTask 15.2: 配置环境变量（`PLAUSIBLE_DOMAIN` / `SITE_URL`）
  - [ ] SubTask 15.3: 绑定域名 ethnicity-guesser.com
  - [ ] SubTask 15.4: 验证 sitemap / robots / OG 在生产环境可访问

# Task Dependencies
- Task 5 / 6 / 7 依赖 Task 2（数据）+ Task 3（布局）
- Task 9 / 10 依赖 Task 2（数据）+ Task 3（布局）
- Task 12 依赖 Task 4 / 5 / 9 / 10 / 11（页面就绪）
- Task 13 依赖 Task 5（结算页）
- Task 14 依赖 Task 4–7 / 9–11（所有页面就绪）
- Task 15 依赖 Task 12 / 13 / 14
- Task 8（AI 工具）已移除，不参与依赖
