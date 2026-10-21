/* inferserver 数学基础 —— 系列元信息（由 assets/js/nav.js 读取） */
window.SERIES = {
  brand: 'inferserver 的数学基础',
  chapters: [
    { file: '00-preliminaries.html',   num: '0',  title: '记号与预备：内积、矩阵、求和、导数' },
    { file: '01-softmax.html',          num: '1',  title: 'softmax：为什么是指数，为什么先减最大值' },
    { file: '02-cross-entropy-kl.html', num: '2',  title: '交叉熵、KL 散度、困惑度' },
    { file: '03-rmsnorm.html',          num: '3',  title: 'RMSNorm：从 LayerNorm 推出来' },
    { file: '04-linear-layers.html',    num: '4',  title: '线性层、参数量与计算量' },
    { file: '05-silu-swiglu.html',      num: '5',  title: 'sigmoid、SiLU 与 SwiGLU' },
    { file: '06-residual-prenorm.html', num: '6',  title: '残差连接与 pre-norm' },
    { file: '07-attention.html',        num: '7',  title: '注意力：点积、缩放、因果掩码' },
    { file: '08-rope.html',             num: '8',  title: 'RoPE：旋转位置编码为什么是相对的' },
    { file: '09-gqa.html',              num: '9',  title: 'GQA：多个 Q 头共用一个 K/V 头' },
    { file: '10-kv-cache.html',         num: '10', title: 'KV cache：自回归分解与增量解码' },
    { file: '11-paged-attention.html',  num: '11', title: 'Paged attention 与 online softmax' },
    { file: '12-sampling.html',         num: '12', title: '采样：温度、top-k、top-p、逆变换' },
    { file: '13-batching.html',         num: '13', title: '批处理、padding、chunked prefill' },
    { file: '14-floating-point.html',   num: '14', title: '浮点数与误差：为什么容差是 1e-6' },
    { file: '15-svd.html',              num: '15', title: '奇异值分解：几何直觉、手算过程与低秩近似' },
    { file: 'a-cheatsheet.html',        num: 'A',  title: '附录 A. 公式速查表' },
    { file: 'b-code-index.html',        num: 'B',  title: '附录 B. 数学 ↔ 代码索引' }
  ]
};
