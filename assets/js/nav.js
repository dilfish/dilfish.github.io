/* 共享导航 / 公式渲染（仅浅色模式）。
 *
 * 每个系列目录（math/、gpu/）放一个 series.js 声明 window.SERIES：
 *   { brand: '系列名', chapters: [{file, num, title}, ...] }
 * 系列内所有页面共用本脚本；index.html 不写进 chapters，用 data-page="index" 表示。
 */
(function () {
  'use strict';

  var S = window.SERIES || {};
  var CHAPTERS = S.chapters || [];
  var BRAND = S.brand || document.title;

  document.addEventListener('DOMContentLoaded', function () {
    // 顶栏 ☰ 回站点首页（../index.html），品牌名回系列目录（./index.html）
    var brandLink = document.querySelector('.topbar .brand');
    if (brandLink && !brandLink.getAttribute('title')) {
      brandLink.setAttribute('title', BRAND + '（回到系列目录）');
    }

    var page = document.body.getAttribute('data-page');
    var idx = -1;
    for (var i = 0; i < CHAPTERS.length; i++) {
      if (CHAPTERS[i].file === page) { idx = i; break; }
    }

    var article = document.querySelector('main article');

    // 面包屑：全部文档 / 第 N 节 · 共 X 篇
    if (idx >= 0 && article && !article.querySelector('.crumb')) {
      var c = CHAPTERS[idx];
      var label = c.num === 'A' || c.num === 'B' ? '附录 ' + c.num : '第 ' + c.num + ' 节';
      var crumb = document.createElement('p');
      crumb.className = 'crumb';
      crumb.innerHTML = '<a href="../index.html">全部文档</a>' +
        '<span class="sep">/</span><a href="index.html">' + BRAND + '</a>' +
        '<span class="sep">/</span><span>' + label + '</span>' +
        '<span class="sep">·</span><span>共 ' + CHAPTERS.length + ' 篇，这是第 ' + (idx + 1) + ' 篇</span>';
      article.insertBefore(crumb, article.firstChild);
    }

    // 底部：上一章 / 系列目录 / 下一章
    if (idx >= 0 && article && !document.querySelector('.chapnav')) {
      var nav = document.createElement('nav');
      nav.className = 'chapnav';
      nav.setAttribute('aria-label', '章节导航');
      var html = '';
      if (idx > 0) {
        var p = CHAPTERS[idx - 1];
        html += '<a href="' + p.file + '"><span class="dir">上一章</span>' + p.title + '</a>';
      }
      html += '<a href="index.html"><span class="dir">目录</span>' + BRAND + '</a>';
      if (idx + 1 < CHAPTERS.length) {
        var n = CHAPTERS[idx + 1];
        html += '<a class="next" href="' + n.file + '"><span class="dir">下一章</span>' + n.title + '</a>';
      }
      nav.innerHTML = html;
      article.appendChild(nav);
    }

    // 动态插入内容后，重新对齐 URL 里的锚点
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }

    // KaTeX：等 deferred 脚本加载完再渲染
    function render() {
      if (!window.renderMathInElement) { return false; }
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
      return true;
    }
    if (!render()) {
      window.addEventListener('load', render);
    }
  });
})();
