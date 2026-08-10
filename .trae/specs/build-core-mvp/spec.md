# Ethnicity Guesser 核心 MVP Spec

## Why
把 ethnicity-guesser.com 的核心玩法（看脸猜地理）和 AI 工具（上传照片猜种族）做成可玩、移动端可用、SEO 就绪的 MVP，验证产品价值并启动 `ethnoguessr`（2.7万 MSV）和 `ethnicity guesser`（4.4K MSV）双关键词流量。变现（AdSense / 联盟）显式延后到下一阶段。

## What Changes
- 新增 phenotype 数据抓取管线（Python 抓 humanphenotypes.net → `data/phenotypes.json`）
- 新增 Classic Daily 游戏模式（10 题/天，5000 分制，世界地图点击）
- 新增 Challenge 模式（38 题无时限）
- 新增 Countries 模式（48 国合成脸）
- 新增 Phenotype 详情页 `/phenotype/{slug}`（SEO 内容底座）
- 新增 Country 页 `/country/{slug}`
- 新增首页（双 CTA + 精选 + 玩法说明）
- 新增每日分享卡片（Twitter/OG 图自动生成）
- 全站移动优先响应式
- SEO 基建：SSR、sitemap、robots、meta、JSON-LD Schema
- Plausible 分析接入
- Vercel 部署

显式**不做**（延后到下一 spec）：
- **AI Ethnicity Guesser 工具（上传照片 → Gemini Vision）**——MVP 先不做，下一阶段加
- AdSense / Mediavine 广告位
- AncestryDNA / 23andMe 联盟
- Pro 订阅
- Capacitor 移动 App
- 多语言（中文/西语版）
- Genomes UGC 模式
- 全局排行榜 / 好友对战
- 240 篇 phenotype 长文（本 spec 仅建数据结构 + 详情页模板，先上线 10–20 篇样例）

## Impact
- Affected specs: 无（绿地项目）
- Affected code: 全新 Next.js 14 App Router 项目

## ADDED Requirements

### Requirement: Phenotype 数据管线
系统 SHALL 提供 Python 抓取脚本，从 humanphenotypes.net 抓取全部 phenotype（约 240 条），归一化为 `data/phenotypes.json`，每条包含 `id` / `slug` / `name` / `region` / `lat` / `lng` / `image_url` / `description` / `references`。

#### Scenario: 抓取成功
- **WHEN** 运行 `python scripts/scrape_phenotypes.py`
- **THEN** 生成 `data/phenotypes.json`，含约 240 条 phenotype，每条字段齐全
- **AND** 脚本可重复运行，幂等覆盖

#### Scenario: 抓取失败
- **WHEN** humanphenotypes.net 不可达
- **THEN** 脚本退出码非零并打印错误日志

### Requirement: Classic Daily 游戏模式
系统 SHALL 提供每日 10 题游戏，用户在世界地图上点击猜测 phenotype 起源，按距离 + 时间打分（5000 分制），每日题目按日期确定。

#### Scenario: 完整一局
- **WHEN** 用户访问 `/play/classic-daily`
- **THEN** 展示当日第 1 题（合成脸图 + 世界地图）
- **WHEN** 用户在地图上点击
- **THEN** 显示真实位置 + 距离 + 本题得分 + 简短描述
- **WHEN** 用户答完 10 题
- **THEN** 显示总分 + 分享按钮 + 重玩入口

#### Scenario: 跨设备同步当日题目
- **WHEN** 同一日期任意设备访问
- **THEN** 看到相同的 10 道题（按日期 seed 确定）

### Requirement: Challenge 模式
系统 SHALL 提供 38 题无时限模式。

#### Scenario: 挑战模式
- **WHEN** 用户访问 `/play/challenge`
- **THEN** 顺序展示 38 题，无时间限制，可中途退出

### Requirement: Countries 模式
系统 SHALL 提供 48 国合成脸猜题模式。

#### Scenario: 国家模式
- **WHEN** 用户访问 `/play/countries`
- **THEN** 顺序展示 48 题，每题为某国合成脸

### Requirement: Phenotype 详情页
系统 SHALL 为每个 phenotype 生成 `/phenotype/{slug}` 页面，含合成脸图、地理分布、面部特征、文献引用、相关表型、顶部 disclaimer。

#### Scenario: 详情页渲染
- **WHEN** 访问 `/phenotype/{valid-slug}`
- **THEN** 渲染该 phenotype 的完整内容
- **AND** 顶部显示 YMYL disclaimer
- **AND** 底部显示 3–5 个相关 phenotype 链接

#### Scenario: 无效 slug
- **WHEN** 访问 `/phenotype/{invalid-slug}`
- **THEN** 返回 404 页面

### Requirement: 移动优先响应式
所有页面 SHALL 在 360px / 414px / 768px / 1024px / 1440px 断点下正确渲染，无横向滚动，触摸目标 ≥44px。

#### Scenario: 移动端可用
- **WHEN** 在 360px 宽度设备上访问任意页面
- **THEN** 无横向滚动条
- **AND** 所有可点击元素最小尺寸 44×44px
- **AND** 地图、上传按钮、CTA 在小屏下可用

### Requirement: SEO 基建
系统 SHALL 为每个页面生成唯一 title（50–60 字符）、meta description（150–160 字符）、H1、canonical、Open Graph、Twitter Card、JSON-LD 结构化数据。

#### Scenario: 首页 SEO
- **WHEN** 访问 `/`
- **THEN** `<title>` 含 "Ethnicity Guesser" 主词
- **AND** meta description 含 "ethnicity guesser" + "ethnoguessr"
- **AND** JSON-LD 包含 `WebApplication` schema

#### Scenario: Phenotype 页 SEO
- **WHEN** 访问 `/phenotype/{slug}`
- **THEN** title 为 `{phenotype name} - Face Features & Origin | Ethnicity Guesser`
- **AND** JSON-LD 包含 `Article` schema
- **AND** 含 BreadcrumbList schema

#### Scenario: Sitemap
- **WHEN** 访问 `/sitemap.xml`
- **THEN** 返回所有 phenotype / country / blog / 静态页 URL
- **AND** 每个 URL 含 `lastmod`

### Requirement: 分享卡片
系统 SHALL 为游戏结算页和 phenotype 详情页生成 OG 图，支持 Twitter 一键分享战报。

#### Scenario: 游戏结算分享
- **WHEN** 用户答完 Classic Daily
- **THEN** 显示分享按钮，点击弹出 Twitter 分享
- **AND** 分享文本含总分（如 "I scored 4230/5000 on Ethnicity Guesser!"）
- **AND** OG 图含分数 + 品牌名

### Requirement: YMYL 风控
所有 phenotype / country / 工具页 SHALL 在顶部显示 disclaimer，并在 `/editorial-policy` 说明数据来源与审核流程。

#### Scenario: Disclaimer 显示
- **WHEN** 访问任意 phenotype / country / 工具页
- **THEN** 顶部显示 "Based on historical distributions from ~1500 years ago. Estimates appearance, not DNA ancestry or personal identity."

### Requirement: 分析接入
系统 SHALL 在所有页面接入 Plausible Analytics。

#### Scenario: 分析脚本
- **WHEN** 任意页面加载
- **THEN** Plausible 脚本加载并发送 pageview

## SEO 策略（基于哥飞 TDH 方法论）

### 0. 核心原则：TDH 取代 TDK
- **不写 `<meta name="keywords">`**——谷歌 10 年前已淘汰，乱写反而蹭排名风险
- **TDH = Title + Description + Headings（H1-H6）**，做好三角 + 后端渲染 + 内链 + URL 唯一 = 合格页面
- **一个页面只优化一个主关键词**，围绕主词建次级词页面；流量 = 页面数 × 每页吃到的词
- **意图单一**：Title、H1、首段必须死死锚定主词，相关词可以提但不能喧宾夺主（避免谷歌误判主旨）
- **出词 = onpage 合格线**：GSC 一旦出词说明 onpage 已合格，剩下靠外链；没出词先改页面，别买外链

### 1. 信息架构（内链金字塔）
- 域名：`ethnicity-guesser.com`（EMD 精确匹配主词）
- **三级目录结构**：
  - 主词 → 首页 `/`
  - 二级词 → 子目录 `/play/` `/phenotypes/` `/country/`
  - 三级词 → 子目录的子目录 `/phenotype/{slug}` `/country/{slug}` `/play/classic-daily`
- **上下互链**：首页链到所有二级；每个二级链到其下所有三级；每个三级页面必须链回上级（如 `/phenotype/nordid` 底部放 "human phenotypes" 文本链接指向 `/phenotypes`）
- URL 全部小写 + kebab-case，canonical 唯一化（www/裸域名、http/https、参数变体均 canonical 到规范 URL）

### 2. Title 写作规范（每页唯一）
- 长度 60–70 字符（哥飞原话：新站要把用户关心的有搜索流量的点拼进标题）
- **关键词前置**：主词尽量靠前
- 自然可读，不是关键词堆砌
- 模板示例：
  - 首页：`Ethnicity Guesser - Daily Ethnicity Quiz & Phenotypes Game`
  - Classic Daily：`Ethnoguessr Game - Daily Ethnicity Quiz 10 Questions`
  - Countries：`Guess the Nationality Game - 48 Country Face Quiz`
  - Phenotype：`{Name} Phenotype - Face Features & Origin | Ethnicity Guesser`
  - Country：`{Country} Average Face - Phenotype & People | Ethnicity Guesser`
  - FAQ：`Is AI Ethnicity Guesser Accurate? FAQ & Accuracy Explained`

### 3. Description 写作规范（每页唯一）
- 长度 150–160 字符
- **一两个自然句子**描述网页主要内容，关键词自然嵌入，不堆砌
- 模板示例（首页）：`Play Ethnicity Guesser, a free daily ethnicity quiz game. Guess ethnicity by face on the world map, browse 240 human phenotypes with face features and origins.`

### 4. Headings 骨架规范（哥飞核心方法）
- **每页有且仅有一个 H1**，含主词，与 Title 互补（Title 给搜索引擎，H1 给用户）
- H2/H3 不可忽视，是页面骨架，**搜索引擎给不给排名很多时候由 H1 和 Title 决定**
- 典型结构（必须照此层级）：
  ```
  h1 → h2 → p → h3 → p → h3 → p → h2 → p → h3 → p
  ```
- H2 用于主章节（含主词或主词相关词），H3 用于子章节（含次级词）
- **正文必须写在 `<p>` 标签里**，不用 div 替代
- **首页六字真言：分门别类罗列**——把二级/三级关键词按 H2/H3 结构 + 图片铺开（首页 H2: "Ethnicity Quiz Game" / "Human Phenotypes" / "Country Average Faces"，每个 H2 下 H3 列出具体玩法/分类）

### 5. 图片 SEO
- 所有 `<img>` **必须写 alt 属性**（如 `alt="Nordid phenotype average face composite"`）
- 图片尺寸 ≥300×300，用大图不用缩略图
- 用 `next/image` 自动 WebP + lazy load + responsive sizes
- alt 文案描述图片内容，含主词但不堆砌

### 6. 后端渲染（铁律）
- 所有 TDH、H 结构、正文都要能**右键查看源代码直接看到**
- **新站没有客户端渲染的算力优先级**——必须 SSR 或 SSG
- 实施：
  - Phenotype / Country / 信任页 / 索引页 → **SSG**（`generateStaticParams` + `generateMetadata`）
  - 首页 → **SSR**（动态内容）
  - 游戏页 → SSR（动态题目）
  - 严禁用 `useEffect` 渲染 SEO 内容；JSON-LD 用 `<script type="application/ld+json">` 注入到 HTML

### 7. URL 唯一性
- 每页 `<link rel="canonical">` 指向规范 URL
- `next.config.mjs` 配置 `trailingSlash: false`（或统一 true，二选一）
- www ↔ 裸域名 301 重定向到规范
- http → https 强制
- 分页 / 筛选参数加 `rel="canonical"` 指向规范版

### 8. 内链建设
- **首页 → 二级**：H2 章节下用文本链接（如 "Play ethnoguessr daily game" 指向 `/play/classic-daily`）
- **二级 → 三级**：`/phenotypes` 索引页 H3 + 链接到每个 `/phenotype/{slug}`
- **三级 → 上级**：每个 phenotype 详情页底部固定文本链接 "← Back to human phenotypes list" 指向 `/phenotypes`
- **同级互链**：phenotype 详情页底部 3–5 个相关 phenotype（按 region 分组）
- **全站 footer**：所有主分类 + 信任页链接
- **面包屑**：每页 BreadcrumbList JSON-LD + 可视面包屑
- 锚文本多样化（同义词 / 长尾变体），不全部精确匹配主词

### 9. 关键词密度（不当 KPI）
- 不数次数、不查百分比写文章
- 围绕主词自然展开 → Title、H1、首段、H2/H3、alt 用到 → 密度自然到 1–2%
- 工具显示 3%+ 警惕是否在硬塞
- Description 不堆砌关键词，是一两个自然句子
- 锚文本多样化，不全部精确匹配

### 10. 关键词映射（一页一词）
| 页面 | 主词（唯一） | 次级词（H2/H3 含） |
|---|---|---|
| `/` | ethnicity guesser | ethnoguessr, ethnicity game, guess ethnicity |
| `/play/classic-daily` | ethnoguessr game | daily ethnicity quiz, guess the race game |
| `/play/challenge` | ethnicity challenge quiz | 38 phenotypes quiz |
| `/play/countries` | guess the nationality game | country face quiz |
| `/phenotypes` | human phenotypes | human phenotype list, ethnicity types |
| `/phenotype/{slug}` | {name} phenotype | {name} face features, {name} origin |
| `/country/{slug}` | {country} average face | {country} phenotype, {country} people |
| `/faq` | is AI ethnicity guesser accurate | how does AI guess ethnicity, AI vs DNA |

### 11. 技术 SEO
- **sitemap.xml**：`app/sitemap.ts` 自动生成，含 phenotype + country + 静态页 + lastmod
- **robots.txt**：允许全站 + 指向 sitemap
- **Open Graph + Twitter Card**：每页 og:title / og:description / og:image / twitter:card
- **OG 图自动生成**：用 `next/og` 为首页 / phenotype / country / 游戏结算生成 1200×630 图
- **Core Web Vitals**：LCP <2.5s，CLS <0.1，INP <200ms（移动端首屏 LCP 优先）
- **移动优先**：Google mobile-first indexing，移动端体验优先于桌面端
- **JSON-LD 结构化数据**：
  - 首页 → `WebApplication`
  - 游戏页 → `Game`
  - Phenotype / Country / Blog → `Article`
  - FAQ 页 → `FAQPage`
  - 全站 → `BreadcrumbList`
  - About 页 → `Organization`

### 12. 内容 SEO（本 spec 仅建模板 + 10–20 篇样例）
- 首页：1500+ 字，按 H2/H3 分门别类罗列玩法 / 工具 / phenotype 分类
- Phenotype 详情页：1500–2000 字模板（H1 主词 / H2 定义 / H2 地理分布 / H2 面部特征 / H3 子特征 / H2 历史背景 / H2 文献 / H2 相关表型 / disclaimer）
- Country 页：1500 字模板（H1 主词 / H2 合成脸说明 / H2 人群构成 / H3 历史 / H2 disclaimer）
- Blog 模板：用于后续长尾词内容轰炸

### 13. YMYL 风控 SEO
- 全站 footer 显示 disclaimer
- phenotype / country / 工具页顶部 disclaimer（H1 之前用 `<div>` 不用 H 标签）
- `/editorial-policy` 页说明：数据来源（humanphenotypes / 复旦论文）、审核流程、免责
- `/disclaimer` 页统一免责声明
- 所有 phenotype 页含 references 段（H2 + 学术文献列表）
- 框架统一为"教育型人类学"，避免"种族鉴定"措辞

### 14. 外链与社交（本 spec 仅做基础设施）
- 游戏结算页分享按钮（Twitter / 复制链接）
- 每日 OG 图带分数 → 用户自发传播
- phenotype 详情页底部"分享到 Reddit"按钮（占位，后续启动）
