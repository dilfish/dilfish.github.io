/* GPU 编程基础 —— 系列元信息（由 assets/js/nav.js 读取） */
window.SERIES = {
  brand: 'GPU 编程基础',
  chapters: [
    { file: '00-model.html',     num: '0', title: '心智模型：吞吐机器与延迟机器' },
    { file: '01-execution.html', num: '1', title: '执行模型：warp、block、grid 与启动配置' },
    { file: '02-memory.html',    num: '2', title: '内存层级：合并访问、shared memory 与 bank' },
    { file: '03-sync.html',      num: '3', title: '同步、原子与内存模型' },
    { file: '04-patterns.html',  num: '4', title: '并行模式：归约、扫描与模板计算' },
    { file: '05-matmul.html',    num: '5', title: '矩阵乘：算术强度、分块与 Tensor Core' },
    { file: '06-host.html',      num: '6', title: '主机侧：拷贝、流、事件与多卡' },
    { file: '07-perf.html',      num: '7', title: '性能测量、数值与常见陷阱' },
    { file: 'a-cheatsheet.html', num: 'A', title: '附录 A. 速查表' }
  ]
};
