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
gpu/                《GPU 编程基础》系列（index.html + 章节 + series.js）
math/               《inferserver 的数学基础》系列（index.html + 章节 + series.js）
dsv4.1/             《DSv4.1 Flash 架构导读》系列（index.html + 章节 + series.js）
assets/
  css/site.css      站点首页 / 404 的样式
  css/math.css      各系列共享的排版样式
  css/gpu.css       GPU 系列在 math.css 之上的补充样式
  js/nav.js         系列页共享脚本：面包屑、上下章、KaTeX 渲染
  katex/            本地 KaTeX（katex.min.css/js、auto-render、fonts）
  img/              插图（SVG 优先；位图仅用于像素级效果，如 SVD 重建对比）
```

所有页面用相对路径引用 `assets/`；不要新增顶层资源目录（历史遗留的 `latex_ass/` 已并入
`assets/`）。系列页的公共结构（顶栏、`<head>`、脚本顺序）以 `math/` 或 `gpu/` 里的现有页面为准。

## 唯一适配目标（重要）

本站**只为用户本人手机排版**，桌面端居中显示就可以。

| 项 | 值 |
|---|---|
| 手机型号 | vivo X300 Pro（2025 年 10 月 13 日发布，10 月 17 日开售；联发科天玑 9500） |
| 屏幕 | 6.78 英寸 BOE Q10 plus 8T LTPO AMOLED 直屏，20:9，1–120 Hz 自适应刷新，局部峰值 4500 nit |
| 物理分辨率 | 2800 × 1260（竖屏 1260 × 2800） |
| 像素密度 | 452 PPI（官方值；√(2800² + 1260²) / 6.78 ≈ 452.9） |
| 竖屏物理宽度 | 1260 px（长边 2800 为高度） |
| 实测 DPR | **3.50**（Chrome 移动版，默认设置） |
| 实测 CSS 视口 | **360 × 704** px（Chrome 页面可用视口；浏览器窗口报告屏幕尺寸 360 × 800 px） |
| 设计基准 | **360 CSS px 宽，单列**；正文左右留白后可用宽度约 324 px |

以上物理参数已按 vivo 官方参数页（<https://www.vivo.com.cn/vivo/param/x300pro>）与
GSMArena 规格页核对；DPR 与 CSS 视口则是在用户的 vivo X300 Pro 上用 Chrome 移动版、
默认显示与字体设置实测得到。以后检查网页布局时，以 **360 × 704 CSS px、DPR 3.5**
为准，不以物理分辨率或 DPR 推算可用排版宽度。

排版约束：

- 触控目标不小于 44 × 44 CSS px，正文按 360 px CSS 视口单列排版，不写桌面宽度断点的复杂布局。
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

## 插图

### 工具链

系统 `python3`（Homebrew 3.14）带 `EXTERNALLY-MANAGED` 标记，`pip install` 会被 PEP 668 拒绝。
**matplotlib / Pillow 装在独立虚拟环境 `~/.venvs/plot`** 里（matplotlib 3.11.2、Pillow 13.0.0、
numpy 2.5.4）：

```sh
~/.venvs/plot/bin/python genfigs.py     # 出图脚本一律用这个解释器
```

两个反例，别走：

- `brew install python-matplotlib` —— 它依赖 `python@3.15`，装完会多一套 Python，而 `python3`
  （3.14）依旧 `import` 不到，等于白装。
- `pip install --break-system-packages` —— 会把 user site 的 numpy 盖在 brew 的 numpy 上，
  连累其他脚本。

回退路径仍然成立：系统 `python3` 自带 numpy，`math`/`zlib`/`struct` 是标准库，所以**没有 venv 也能出图**
（手写 SVG / 手写 PNG，见下）。现有 `assets/img/` 那四张图就是手写生成的，不依赖 matplotlib，
venv 删了也照样能重画。

生成脚本**不进仓库**（站点没有构建步骤），写在 `$TMPDIR/opencode/` 下，跑完把成品拷进
`assets/img/`。脚本里用 `OUT = os.environ.get("OUT", "assets/img")`，临时目录和仓库目录都不写死路径。

### 三条出图路线

| 图的内容 | 用什么 | 理由 |
|---|---|---|
| 曲线、谱图、折线、柱状、热力图、子图网格 | **matplotlib**（`Agg`） | 对数轴、双轴、色条、`tight_layout` 都是现成的；改数据一行的事 |
| 几何示意、向量、需要精确控制 marker / 线宽 / 层叠顺序 | **手写 SVG** | 所见即所得，不用跟 matplotlib 的布局引擎搏斗；文件小（10–35 KB） |
| 图像重建对比、残差图、任何「要看清像素」的图 | **PNG**（matplotlib 或手写） | 矢量画像素级效果体积会爆 |

要**在图内写中文**时，优先 matplotlib 导出 SVG：它的 `svg.fonttype` 默认是 `path`，文字会被转成
路径，不依赖阅读端字体——这比手写 SVG 安全（见下一条）。

### matplotlib 的四个开关

```python
import matplotlib
matplotlib.use("Agg")                 # 1. 必须第一行；默认 macosx 在 headless 下会卡住
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams["font.family"] = ["Heiti SC"]          # 2. 本机首选，无警告
plt.rcParams["axes.unicode_minus"] = False

x = np.linspace(0, 1, 100)
fig, ax = plt.subplots(figsize=(3.2, 2.2), dpi=200)  # 3. 实际像素 = figsize × dpi
ax.plot(x, np.sin(6 * x), lw=1.6)
ax.set_title("负号 −1.5 也要能显示")
fig.tight_layout()
fig.savefig("out.png", dpi=200)       # 4. 存盘时再给一次 dpi
fig.savefig("out.svg")
```

- **1. `Agg`**：不设的话 backend 是 `macosx`（实测 `matplotlib.rcParams["backend"]` 就是这个），
  无显示环境下会失败。
- **2. 中文字体**：默认 DejaVu 没有中文字形，显示成方框；`axes.unicode_minus = False` 同理，
  否则负号也是方框。**`Heiti SC` 放第一个没有警告**；写成 `["Hiragino Sans GB", ...]` 会刷
  `findfont: Failed to find font weight normal ... now using 300`（该字体没有 weight 400），
  不影响出图但很吵。全部可用字体用 `font_manager.fontManager.ttflist` 列。
- **3. 尺寸**：`figsize × dpi` 就是文件真实像素（实测 `3.2×2.2 @ 200dpi` → `640×440`）。
  要和 `<img>` 的 `width`/`height` 对上（见「改完自查」）。
- **4. `savefig` 的 dpi**：图对象上的 dpi 不保证传给存盘，显式再给一次。
- 导出 SVG 时 `svg.fonttype` 默认是 `path`（实测导出的文件里没有 `<text>`，全是 `<path>`），
  所以**中文可以安全地写进图内**——这是手写 SVG 做不到的。

### 手写 SVG 的两个坑

手写只用于几何示意这类「要精确控制每个点」的图。组合子见下方 `polyline`。

1. **y 轴方向相反**。数学坐标 y 向上，SVG y 向下。取点时统一用 `cy - s*y`，
   不要在 `viewBox` 上用 `transform="scale(1,-1)"`——那会把文字一起翻过来。
2. **中文字体依赖系统字体栈**。`font-family="-apple-system,Segoe UI,Roboto,sans-serif"` 在
   vivo 上、在微信内置浏览器里都可能落到别的字体。所以：**图内的字尽量只用 ASCII 和希腊字母**
   （σ₁、Vᵀ、log₁₀σₖ 这类），中文一律放 `<figcaption>`。真机上字体不一致时，只有图注不会崩。
   非要在图内写中文，就改走 matplotlib 的 SVG（文字转路径）。

最小组件（照抄即可）：

```python
def polyline(pts, cx, cy, s, color, w=1.8, dash=None):
    d = " ".join(f"{cx + s*x:.2f},{cy - s*y:.2f}" for x, y in pts)   # 注意 cy - s*y
    da = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<polyline points="{d}" fill="none" stroke="{color}" '
            f'stroke-width="{w}" stroke-linejoin="round"{da}/>')
```

### PNG：zlib + struct 手写（无依赖回退）

有 venv 时直接用 `Pillow`（`Image.fromarray(rgb).save("x.png")`）就够了。下面这段是**没有 venv 时**
的回退：不用任何第三方库，直接拼 IHDR / IDAT / IEND。每行前面必须有 1 字节 filter type，
`0`（None）最简单（用 filter `2`/Up 可以再压小一些，但要多写几行）：

```python
import zlib, struct

def write_png(path, rgb):                      # rgb: (h, w, 3) uint8
    h, w, _ = rgb.shape
    raw = b"".join(b"\x00" + rgb[i].tobytes() for i in range(h))
    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))
    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))  # 8bit truecolor
           + chunk(b"IDAT", zlib.compress(raw, 9))
           + chunk(b"IEND", b""))
    open(path, "wb").write(png)
```

要放大缩略图时用 `np.repeat` 做整数倍放大（nearest），**不要**插值——插值会让「像素级对比」失去意义。

### 自造点阵字体不要用来写字

手写 PNG 时如果想在图里加标签，不要自己拼点阵字体——试过 5×7 点阵 + 2 倍放大，
在 360 px 下依然认不出来。

两条正确做法：

- **用 matplotlib / Pillow 渲染文字**（有真实字体，位图里写字完全没问题）。
- **或者干脆不写字**，标签交给 `<figcaption>` 按位置描述（「左起第 2 格是 k=5」）。
  这样文字还能被搜索引擎和朗读器读到。

现有那两张 PNG 是手写的，所以走的是第二条，图内无字。

### 合成数据要「像真的」

第一版 SVD 实验用的是正弦 + 高斯斑的平滑图，结果 k=5 的重建肉眼几乎与原图相同，
「截断会丢信息」这个结论根本看不出来。改成**硬边色块 + 细条纹 + 轻噪声**后，
k=5 的振铃和残差边缘才显现出来。

一般原则：图是给人看结论的，**合成数据要覆盖结论成立与不成立的边界**，否则图只是装饰。
反过来，如果换数据后结论变了，说明结论本身依赖于数据假设，正文必须写明那个假设。

### 图上每个数字都从脚本里来

不要手写图注或表格里的数值。脚本 `print` 出来，再抄进 HTML。SVD 那一章的表格（能量、
相对误差、RMSE）和正文里的 `σ₁ ≈ 5.30×10⁴` 全部来自同一次运行的输出——换数据时一起换，
不会出现「图变了表没变」。

### 验证：headless 截图 + 溢出探针

**直接 `--screenshot --window-size=360,N` 打开 `file://` 不会真的按 360 重排**（实测 CSS 视口
仍是默认宽度，公式不换行）。正确做法是套一层 iframe：

```html
<!-- wrap.html，放在临时目录 -->
<style>html,body{margin:0}iframe{width:360px;height:17000px;border:0;display:block}</style>
<iframe src="file:///绝对路径/math/15-svd.html"></iframe>
```

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --virtual-time-budget=6000 --screenshot=shots/full.png \
  --window-size=360,17000 "file:///.../wrap.html"
```

然后用 `sips -c <高> <宽> --cropOffset <y> 0 full.png --out seg.png` 切段看图。

横向溢出要**自动探测**，别靠眼看。往页面的临时副本里注入（探针绝不能进仓库）：

```js
document.querySelectorAll('main *').forEach(el => {
  if (el.clientWidth < 50) return;
  if (el.closest('.katex-mathml')) return;   // KaTeX 的隐藏 MathML 层永远「溢出」，必须排除
  if (el.scrollWidth > el.clientWidth + 2)
    console.log(el.tagName, el.className, el.clientWidth, el.scrollWidth, el.textContent.slice(0,40));
});
```

用 `--dump-dom` + iframe 把结果读回来。SVD 那一章首轮（排除 `.katex-mathml` 后）报了 11 处：
7 处是行间公式与表格（最宽 566 vs 348 px，`Eckart–Young` 那条），4 处是代码块。

修法：

- 公式：并排的 `\qquad` 改成 `aligned` 分行，或拆成两个 `\[\]`；`underbrace` 三连改成两行。
- 表格：列少且都是短数字时加 `class="tablewrap tight"`；较宽表格必须明确允许局部横向滚动，
  或者干脆改成列表。
- 代码块：每行 ≤ 50 个显示字符（CJK 按 2 算），否则 `<pre>` 必然横向滚动。

## 改完自查

- 断链：`grep -rn 'href="\.\./assets' gpu math dsv4.1` 只应出现 `../assets/css|js|katex|img` 下的真实文件。
- KaTeX 字体：`assets/katex/fonts/` 必须完整，否则公式回退成系统字体。
- 页面能直接在 `file://` 下打开（不要引入绝对路径 `/assets/...`，`gpu/`、`math/`、`dsv4.1/` 内一律用相对路径）。
- 插图放 `assets/img/`，用一个 `.fig`（`<figure>` + `<img>` + `<figcaption>`）包起来；图宽按
  360 CSS px 视口设计，单栏最宽约 324 px，三格横排在手机上必然糊，优先竖排或两格。
  能画成 SVG 就别用位图（同样的线条在微信 / 高 DPI 下不会糊），像素级效果才用 PNG。
- `<img>` 的 `width` / `height` 必须等于文件**真实像素尺寸**（`sips -g pixelWidth -g pixelHeight`
  或读 PNG 头）。写成缩放后尺寸会让浏览器按错误比例预留位置，图会糊或抖。
- 溢出探针跑一遍，`main` 内应为 0 条（`.katex-mathml` 除外）。
- 图注、表格里的数字必须与生成脚本的输出一致；改了数据就重跑脚本，不要手改其中一半。
- **正文里没有 Markdown**：代码样式一律 `<code>…</code>`，不要写反引号——反引号在 HTML 里会
  原样显示成 `` `svd` ``。自查：
  ```sh
  python3 -c "import re,sys;s=open('math/15-svd.html').read();b=re.sub(r'<pre>.*?</pre>','',s,flags=re.S);print(re.findall(r'\`[^\`]+\`',b) or '无残留')"
  ```
  同一段落里 `<code>` 与 Markdown 混用最容易漏，因为两者在源码里看起来都「像代码」。
