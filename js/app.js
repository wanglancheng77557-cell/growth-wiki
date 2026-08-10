"use strict";
if (window.marked) { marked.setOptions({ gfm: true, breaks: true }); }
const $ = id => document.getElementById(id);
let NAV = null;
const CAT_EMOJI = { "关于我":"🐱", "成长记录":"🌱", "学习笔记":"📚", "我的项目":"🚀", "工具":"🛠️" };

function findArticle(file) {
  if (!NAV) return null;
  for (const cat of NAV.categories) {
    const art = cat.articles.find(a => a.file === file);
    if (art) return { cat: cat.name, art: art };
  }
  return null;
}

function buildNav() {
  const tree = $("navTree");
  tree.innerHTML = "";
  if (!NAV || !NAV.categories.length) {
    tree.innerHTML = '<div class="nav-empty">暂无内容</div>';
    return;
  }
  NAV.categories.forEach(cat => {
    const sec = document.createElement("div");
    sec.className = "nav-cat";
    const head = document.createElement("div");
    head.className = "nav-cat-head";
    head.textContent = (CAT_EMOJI[cat.name] || "🐾") + " " + cat.name;
    sec.appendChild(head);
    cat.articles.forEach(art => {
      const a = document.createElement("a");
      a.href = "#/" + encodeURI(art.file);
      a.className = "nav-link";
      a.textContent = art.title;
      a.dataset.file = art.file;
      sec.appendChild(a);
    });
    tree.appendChild(sec);
  });
}

async function loadArticle(target) {
  if (!target) {
    $("article").style.display = "none";
    $("empty").style.display = "block";
    return;
  }
  $("empty").style.display = "none";
  $("article").style.display = "block";
  $("crumb").textContent = target.cat + " / " + target.art.title;
  document.title = target.art.title + " · 我的成长Wiki";
  $("articleTitle").textContent = target.art.title;
  const body = $("articleBody");
  body.innerHTML = '<div class="loading">加载中…</div>';
  try {
    const r = await fetch(target.art.file, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const md = await r.text();
    body.innerHTML = window.marked ? marked.parse(md) : "<p>" + md.replace(/</g, "&lt;") + "</p>";
  } catch (e) {
    body.innerHTML = '<div class="error">文章加载失败（' + e.message + '），请确认文件存在。</div>';
  }
  document.querySelectorAll(".nav-link").forEach(a => {
    a.classList.toggle("active", a.dataset.file === target.art.file);
  });
  closeSidebar();
  window.scrollTo(0, 0);
}

function openHash() {
  const raw = location.hash.replace(/^#\//, "");
  if (!raw) return;
  let file;
  try { file = decodeURI(raw); } catch (e) { file = raw; }
  loadArticle(findArticle(file));
}

function onSearch() {
  const q = $("searchInput").value.trim().toLowerCase();
  document.querySelectorAll(".nav-link").forEach(a => {
    const hit = !q || a.textContent.toLowerCase().includes(q);
    a.style.display = hit ? "" : "none";
  });
  document.querySelectorAll(".nav-cat").forEach(sec => {
    const any = [...sec.querySelectorAll(".nav-link")].some(a => a.style.display !== "none");
    sec.style.display = any ? "" : "none";
  });
}

function toggleTheme() {
  const html = document.documentElement;
  const dark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", dark ? "light" : "dark");
  $("themeBtn").textContent = dark ? "🌙" : "☀️";
  try { localStorage.setItem("wikiTheme", dark ? "light" : "dark"); } catch (e) {}
}

function openSidebar() {
  $("sidebar").classList.add("open");
  $("mask").classList.add("show");
}
function closeSidebar() {
  $("sidebar").classList.remove("open");
  $("mask").classList.remove("show");
}

function showLocalNotice() {
  $("article").style.display = "block";
  $("empty").style.display = "none";
  $("crumb").textContent = "提示";
  document.title = "提示 · 我的成长Wiki";
  $("articleTitle").textContent = "本地直接打开看不到内容";
  $("articleBody").innerHTML = '<div class="notice">浏览器不允许本地文件之间互相读取，所以直接双击打开是空白的。<br><br>请 <b>双击「本地预览.bat」</b>（和 index.html 在同一个文件夹里），它会自动打开一个能正常显示的本地预览。<br>或者访问已经发布到网上的网址。</div>';
}

async function init() {
  if (location.protocol === "file:") { showLocalNotice(); return; }
  try {
    const r = await fetch("nav.json", { cache: "no-store" });
    NAV = await r.json();
  } catch (e) { NAV = null; }
  if (NAV && NAV.title) document.title = NAV.title;
  buildNav();
  try {
    const t = localStorage.getItem("wikiTheme");
    if (t === "dark") { document.documentElement.setAttribute("data-theme", "dark"); $("themeBtn").textContent = "☀️"; }
  } catch (e) {}
  if (location.hash) { openHash(); } else {
    const first = NAV && NAV.categories[0] && NAV.categories[0].articles[0];
    loadArticle(first ? { cat: NAV.categories[0].name, art: first } : null);
  }
  window.addEventListener("hashchange", openHash);
  $("themeBtn").addEventListener("click", toggleTheme);
  $("hamburger").addEventListener("click", openSidebar);
  $("mask").addEventListener("click", closeSidebar);
  $("searchInput").addEventListener("input", onSearch);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSidebar();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); $("searchInput").focus();
    }
  });
}
document.addEventListener("DOMContentLoaded", init);