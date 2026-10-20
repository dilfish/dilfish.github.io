# dilfish.github.io

个人文档站：纯静态 HTML/CSS，无构建步骤、无第三方运行时依赖，GitHub Pages 直接发布根目录。

- 站点：https://dilfish.github.io/
- 面向设备：vivo X300 Pro（2800 × 1260，452 PPI，约 420 × 933 CSS px），单列移动排版
- 只有浅色模式

## 内容

| 路径 | 内容 |
|---|---|
| `gpu/` | 《GPU 编程基础》—— 从 CPU 思维迁移到 GPU，9 篇 |
| `math/` | 《inferserver 的数学基础》—— 推理服务用到的公式逐条推导，17 篇 |
| `assets/` | 样式（`css/`）、脚本（`js/`）、本地 KaTeX（`katex/`） |

`gpu/` 与 `math/` 下的页面共用 `assets/js/nav.js`（面包屑、上一章 / 下一章、KaTeX 渲染），
各自用 `series.js` 声明章节列表。

## 本地预览

```sh
python3 -m http.server 8000
# http://127.0.0.1:8000/
```

## 发布

推送到 `main` 即可，GitHub Pages 自动重建：

```sh
git add -A && git commit -m "docs: ..." && git push origin main
```

详细约束见 [AGENTS.md](AGENTS.md)。
