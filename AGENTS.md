# AGENTS.md

本文件描述这个仓库的用途、唯一适配目标，以及改动时必须遵守的约束。所有在本仓库工作的 agent 都应先读它。

## 项目

`dilfish.github.io` —— 个人文档站，纯静态 HTML/CSS，无构建步骤、无 JS 依赖、无第三方包。

- 发布：GitHub Pages（`main` 分支根目录，legacy/Jekyll 构建）
- 地址：https://dilfish.github.io/
- 仓库根目录已有 `.nojekyll`，静态文件按原样发布

## 目录结构

```text
index.html          站点首页（系列入口）
404.html            404 页
pages/              零散文档
gpu/                《GPU 编程基础》系列（index.html + 章节 + series.js）
math/               《inferserver 的数学基础》系列（index.html + 章节 + series.js）
assets/
  css/site.css      站点首页 / 404 / pages 的样式
  css/math.css      两个系列的共享样式
  css/gpu.css       GPU 系列在 math.css 之上的补充样式
  js/nav.js         系列页共享脚本：面包屑、上下章、KaTeX 渲染
  katex/            本地 KaTeX（katex.min.css/js、auto-render、fonts）
```

所有页面用相对路径引用 `assets/`；不要新增顶层资源目录（历史遗留的 `latex_ass/` 已并入
`assets/`）。系列页的公共结构（顶栏、`<head>`、脚本顺序）以 `math/` 或 `gpu/` 里的现有页面为准。

## 唯一适配目标（重要）

本站**只为用户本人手机排版**，桌面端居中显示就可以。

| 项 | 值 |
|---|---|
| 手机型号 | vivo X300 Pro（2025 年 10 月发布，天玑 9500） |
| 屏幕 | 6.78 英寸 LTPO AMOLED，20:9，1–120 Hz 自适应刷新 |
| 物理分辨率 | 2800 × 1260（竖屏 1260 × 2800） |
| 像素密度 | 452 PPI（√(2800² + 1260²) / 6.78 ≈ 452.9） |
| 竖屏物理宽度 | 1260 px（长边 2800 为高度） |
| 推断 DPR | 3.0（Android 480 dpi 密度桶） |
| 推断 CSS 视口 | 约 **420 × 933** px |
| 设计基准 | 420 CSS px 宽，单列 |

排版约束：

- 触控目标不小于 44 × 44 CSS px，正文跟随 420 px 视口，不写桌面宽度断点的复杂布局。
- **只有浅色模式**。全站 `color-scheme: light`，不写 `prefers-color-scheme: dark`
  媒体查询，也不提供主题切换按钮；新增样式请只定义一套配色。

## 部署

```sh
git add -A
git commit -m "docs: ..."
git push origin main
```

推送后 GitHub Pages 自动重建（通常 30 秒内），无需任何 CI 配置，也不需要 Cloudflare
Workers。自定义域名（CNAME）尚未配置，不要自行添加 `CNAME` 文件。

## 本地预览

```sh
cd dilfish.github.io
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000/
```

## 改完自查

- 断链：`grep -rn 'href="\.\./assets' gpu math` 只应出现 `../assets/css|js|katex` 下的真实文件。
- KaTeX 字体：`assets/katex/fonts/` 必须完整，否则公式回退成系统字体。
- 页面能直接在 `file://` 下打开（不要引入绝对路径 `/assets/...`，`gpu/`、`math/` 内一律用相对路径）。
