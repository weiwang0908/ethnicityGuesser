# 数据与素材来源

本文档列出 Ethnicity Guesser 网站使用的外部数据来源和素材。

## 1. 表型（Phenotype）数据与图片

- **来源网站**：https://humanphenotypes.net
- **获取方式**：Python 抓取脚本 `scripts/scrape_phenotypes.py`
- **本地存储**：
  - 数据：`data/phenotypes.json`
  - 图片：`public/phenotypes/`
- **抓取字段**：`id`、`slug`、`name`、`region`、`lat`、`lng`、`image_url`、`description`、`references`、`source_url`
- **说明**：
  - 每条表型数据都包含 `source_url`，指回 Human Phenotypes 的原始页面。
  - 参考文献以数组形式保留在 `references` 字段中。
  - 图片最初通过外部 URL 加载，后因 403 错误和外部服务器不稳定，改为全部下载到本地 `public/phenotypes/` 目录托管。

## 2. 国家模式（Countries）图片

- **来源网站**：https://flagcdn.com
- **获取方式**：Python 脚本 `scripts/scrape_countries.py` 下载 48 国国旗
- **本地存储**：`public/countries/`
- **说明**：
  - 国家模式原本计划使用真实的“平均脸”合成图，但相关素材不可得，因此退而求其次使用各国国旗。
  - 所有国旗图片均下载到本地，避免依赖外部服务器。

## 3. 地图底图

- **提供商**：CARTO（Voyager 风格）
- **瓦片地址**：`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`
- **版权归属**：OpenStreetMap 贡献者 + CARTO
- **选择原因**：在低缩放级别下标签可读性更好，比默认 OpenStreetMap 更清晰。

## 4. 学术与编辑参考来源

编辑政策（`editorial-policy`）中声明的交叉验证来源包括：

- **Human Phenotypes** —— 表型描述与合成脸图片的主要来源。
- **Wikipedia 及相关公共档案** —— 国家平均脸合成图项目。
- **复旦大学金力团队** —— 东亚人群遗传学与人口史同行评议研究。
- **中国国家民族事务委员会** —— 中国各民族民族志资料汇编。

## 5. 图片处理原则

- 所有表型图片和国家图片均存储在 `public/` 目录下。
- 使用 `next/image` 渲染，自动转 WebP、懒加载、响应式尺寸。
- 每张图片必须填写描述性的 `alt` 属性。
- 生产环境避免使用外部图片 URL，以防 403 错误和资源失效。
