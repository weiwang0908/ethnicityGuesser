# Checklist

## 项目骨架
- [x] Next.js 14 项目已初始化（TypeScript + App Router + Tailwind）
- [x] `.env.example` 含 `PLAUSIBLE_DOMAIN` / `SITE_URL`
- [x] 核心依赖已安装（react-leaflet / leaflet）
- [x] `next.config.mjs` 配置图片域名白名单
- [x] Plausible 脚本在所有页面加载

## 数据管线
- [x] `scripts/scrape_phenotypes.py` 可运行
- [x] `data/phenotypes.json` 含约 240 条 phenotype，字段齐全
- [x] `data/countries.json` 含 48 国合成脸数据
- [x] 脚本可幂等重跑，失败时退出码非零

## 核心游戏
- [x] Classic Daily 在 `/play/classic-daily` 可玩，10 题/天
- [x] 同一日期跨设备看到相同题目
- [x] 地图点击拾取经纬度正常
- [x] 评分按距离 + 时间，5000 分制
- [x] 单题结果显示真实位置 + 距离 + 得分 + 描述
- [x] 最终结算页显示总分 + 分享 + 重玩
- [x] Challenge 模式 38 题无时限可玩
- [x] Countries 模式 48 题可玩

## AI 工具
- [x] ~~AI Ethnicity Guesser 工具~~ **已移除**（MVP 不做，延后到下一 spec）

## 内容页
- [x] `/phenotypes` 索引页按 region 分组
- [x] `/phenotype/{slug}` 详情页 SSG 渲染
- [x] 详情页含图 + 描述 + 地图 + 面部特征 + 文献 + 相关
- [x] 顶部 disclaimer 显示
- [x] 底部 3–5 相关 phenotype 链接
- [x] 无效 slug 返回 404
- [x] `/country/{slug}` 48 国页面 SSG 渲染

## 信任页
- [x] `/about` `/contact` 可访问
- [x] `/privacy-policy` `/terms` 可访问
- [x] `/disclaimer` YMYL 免责完整
- [x] `/editorial-policy` 说明数据来源 + 审核流程
- [x] `/faq` 含 10+ 问题
- [x] 所有信任页 footer 有链接

## 移动端响应式
- [x] 360px 宽度下无横向滚动
- [x] 414px 宽度下无横向滚动
- [x] 768px / 1024px / 1440px 渲染正确
- [x] 所有可点击元素 ≥44×44px
- [x] 地图在 360px 下可点击操作
- [x] CTA 按钮在 360px 下可见可达

## TDH 核心方法论（哥飞）
- [x] **全站不写 `<meta name="keywords">`**
- [x] 每页 `<title>` 60–70 字符，主词前置，自然可读
- [x] 每页 meta description 150–160 字符，一两个自然句子（非关键词堆砌）
- [x] 每页**有且仅有一个 H1**，含主词
- [x] H2/H3 层级清晰，按 `h1 → h2 → p → h3 → p` 骨架组织
- [x] 正文写在 `<p>` 标签里，不用 `<div>` 替代
- [x] 首页按"分门别类罗列"打法：H2 罗列主分类，H3 罗列子项 + 图片
- [x] **一页只优化一个主关键词**，Title/H1/首段死死锚定主词
- [x] 关键词密度自然 1–2%，工具显示 3%+ 警惕堆砌
- [x] 锚文本多样化，不全部精确匹配主词
- [x] Description 不堆砌关键词

## SEO 基建
- [x] `/sitemap.xml` 自动生成，含 phenotype / country / 静态页 + lastmod
- [x] `/robots.txt` 允许全站 + 指向 sitemap
- [x] 每页 canonical URL 唯一（www/裸域/http/https/参数 全部规范到一版）
- [x] 每页 Open Graph + Twitter Card meta
- [x] 首页 JSON-LD `WebApplication`
- [x] 游戏页 JSON-LD `Game`
- [x] Phenotype / Country 页 JSON-LD `Article`
- [x] 全站 JSON-LD `BreadcrumbList`
- [x] About 页 JSON-LD `Organization`
- [x] **后端渲染**：右键查看源代码能看到所有 TDH、H 结构、正文（不用 useEffect 渲染 SEO 内容）
- [x] Phenotype / Country / 索引 / 信任页 → SSG
- [x] 首页 / 游戏页 → SSR
- [x] JSON-LD 用 `<script type="application/ld+json">` 注入 HTML

## 图片 SEO
- [x] 所有 `<img>` 必填 alt 属性，含主词但不堆砌
- [x] 图片尺寸 ≥300×300（用大图）
- [x] `next/image` 全站启用 + WebP + lazy load + responsive sizes
- [x] OG 图自动生成（首页 / phenotype / country / 游戏结算）

## 内链建设
- [x] 首页 H2 章节下文本链接到所有二级页
- [x] 二级索引页 H3 + 链接到所有三级页
- [x] 每个三级页底部固定文本链接回上级（如 "← Back to human phenotypes"）
- [x] Phenotype 详情页底部 3–5 个相关 phenotype（按 region 分组）
- [x] 全站 footer 含所有主分类 + 信任页
- [x] 每页可视面包屑 + BreadcrumbList JSON-LD
- [x] 锚文本多样化（同义词 / 长尾变体）

## 关键词覆盖（一页一词）
- [x] 首页 title 含 "Ethnicity Guesser"
- [x] 首页 H1 含 "ethnicity guesser"
- [x] 首页 meta description 含 "ethnicity guesser" + "ethnoguessr"
- [x] Classic Daily 页 title 含 "ethnoguessr game"
- [x] Countries 页 title 含 "guess the nationality game"
- [x] Phenotype 索引页 title 含 "human phenotypes"
- [x] 每个 phenotype 详情页 title 主词唯一（{name} phenotype）
- [x] 每个 country 页 title 主词唯一（{country} average face）

## YMYL 风控
- [x] 全站 footer 显示 disclaimer
- [x] Phenotype / Country 页顶部显示 disclaimer
- [x] `/editorial-policy` 说明数据来源 + 审核流程
- [x] `/disclaimer` 页统一免责
- [x] Phenotype 详情页含 references 段
- [x] 全站文案为"教育型人类学"框架，无"种族鉴定"措辞

## 分享
- [x] Classic Daily 结算页有 Twitter 分享按钮
- [x] 分享文本含总分
- [x] 分享 OG 图含分数 + 品牌名
- [x] 复制链接按钮可用

## 部署
- [ ] Vercel 项目已创建并接入 Git
- [ ] 环境变量配置齐全
- [ ] 域名 ethnicity-guesser.com 已绑定
- [ ] 生产环境 sitemap / robots / OG 可访问
- [ ] 生产环境首屏 LCP <2.5s
- [ ] 生产环境 CLS <0.1
