/* ===== 祝小秋 · 零食自由 — 交互脚本 ===== */
(function () {
  "use strict";

  /* ---------- 1. 撒花（Canvas 彩带） ---------- */
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  let W, H, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  const COLORS = ["#ff6b9d", "#ffb26b", "#b06ab3", "#ffd93d", "#6bcB77", "#4d96ff", "#ff8fb5"];
  let pieces = [];
  let rafId = null;

  function burst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      pieces.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 6 + Math.random() * 8,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        life: 1,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.vy += 0.28;            // 重力
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.006;

      if (p.life <= 0 || p.y > H + 40) { pieces.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (pieces.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, W, H);
      rafId = null;
    }
  }

  function rainBurst() {
    const y = H * 0.28;
    burst(W * 0.5, y, 90);
    setTimeout(() => burst(W * 0.2, y, 50), 180);
    setTimeout(() => burst(W * 0.8, y, 50), 320);
  }

  /* ---------- 2. 主按钮 & 点击撒花 ---------- */
  document.getElementById("celebrate").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 80);
    rainBurst();
  });

  // 页面任意轻点也撒一点花（手机友好）
  let lastTap = 0;
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".snack-card") || e.target.closest("button")) return;
    const now = Date.now();
    if (now - lastTap > 250) burst(e.clientX, e.clientY, 16);
    lastTap = now;
  });

  // 入场撒花
  window.addEventListener("load", () => {
    setTimeout(rainBurst, 400);
  });

  /* ---------- 3. 零食图鉴 ---------- */
  const SNACKS = [
    { e: "🍭", n: "棒棒糖" }, { e: "🍫", n: "巧克力" }, { e: "🍬", n: "水果糖" },
    { e: "🍩", n: "甜甜圈" }, { e: "🧁", n: "纸杯蛋糕" }, { e: "🍪", n: "曲奇饼干" },
    { e: "🍿", n: "爆米花" }, { e: "🍦", n: "冰淇淋" }, { e: "🍰", n: "小蛋糕" },
    { e: "🥨", n: "椒盐卷饼" }, { e: "🍡", n: "糯米团子" }, { e: "🧋", n: "珍珠奶茶" },
    { e: "🍮", n: "布丁" }, { e: "🍯", n: "蜂蜜" }, { e: "🥮", n: "月饼" },
    { e: "🍓", n: "草莓" }, { e: "🍉", n: "西瓜" }, { e: "🍇", n: "葡萄" },
  ];
  const grid = document.getElementById("snackGrid");
  SNACKS.forEach((s) => {
    const card = document.createElement("div");
    card.className = "snack-card";
    card.innerHTML = '<span class="snack-emoji">' + s.e + '</span><span class="snack-name">' + s.n + "</span>";
    card.addEventListener("click", (e) => {
      card.classList.add("picked");
      setTimeout(() => card.classList.remove("picked"), 600);
      burst(e.clientX, e.clientY, 24);
    });
    grid.appendChild(card);
  });

  /* ---------- 4. 随机快乐 ---------- */
  const CHEERS = [
    "薯片自由，快乐加倍！🥔",
    "奶茶续命，甜度拉满！🧋",
    "巧克力管够，烦恼清零！🍫",
    "爆米花在手，电影我有！🍿",
    "冰淇淋自由，夏天万岁！🍦",
    "蛋糕随便切，幸福不打折！🍰",
    "果冻弹弹，好运连连！🍮",
    "饼干一口，元气满格！🍪",
    "棒棒糖转呀转，甜甜一整天！🍭",
    "软糖软软，日子甜甜！🍬",
    "月饼圆又圆，心愿都实现！🥮",
    "草莓红透透，小秋乐悠悠！🍓",
  ];
  let rollTimer = null;
  document.getElementById("rollBtn").addEventListener("click", () => {
    const emojiEl = document.getElementById("randomEmoji");
    const textEl = document.getElementById("randomText");
    emojiEl.classList.remove("spin");
    void emojiEl.offsetWidth;
    emojiEl.classList.add("spin");

    // 快速抖动效果
    clearInterval(rollTimer);
    let ticks = 0;
    rollTimer = setInterval(() => {
      const pick = SNACKS[(Math.random() * SNACKS.length) | 0];
      emojiEl.textContent = pick.e;
      ticks++;
      if (ticks > 8) {
        clearInterval(rollTimer);
        const idx = (Math.random() * CHEERS.length) | 0;
        const snack = SNACKS[(Math.random() * SNACKS.length) | 0];
        emojiEl.textContent = snack.e;
        textEl.textContent = CHEERS[idx];
        const r = emojiEl.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 40);
      }
    }, 80);
  });

  /* ---------- 5. 零食计数器 ---------- */
  const numEl = document.getElementById("counterNum");
  const pickBtn = document.getElementById("pickBtn");
  let count = 0;
  const KEY = "xiaoqiu_snack_count";
  try { count = parseInt(localStorage.getItem(KEY) || "0", 10) || 0; } catch (e) {}
  numEl.textContent = count;

  pickBtn.addEventListener("click", (e) => {
    count++;
    numEl.textContent = count;
    try { localStorage.setItem(KEY, String(count)); } catch (e) {}
    numEl.classList.add("bump");
    setTimeout(() => numEl.classList.remove("bump"), 180);
    burst(e.clientX, e.clientY, 22);
    if (count % 10 === 0) rainBurst();
  });

  /* ---------- 6. 日期 ---------- */
  const d = new Date();
  document.getElementById("certDate").textContent =
    d.getFullYear() + " 年 " + (d.getMonth() + 1) + " 月 " + d.getDate() + " 日";

  /* ---------- 7. 滚动浮现 ---------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          observer.unobserve(en.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
