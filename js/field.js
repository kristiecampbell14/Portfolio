/* Hero dot field: a soft, wobbling blob follows the cursor and lights up
   the dot grid (brand shape language) as it passes. On touch devices it drifts on its own. */
(function () {
  const canvas = document.querySelector("[data-field]");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STOPS = [
    [0.0, [206, 204, 195]],
    [0.35, [191, 235, 213]], // mint
    [0.8, [15, 138, 95]],    // vibrant
    [1.0, [6, 78, 53]]       // forest
  ];
  const BUCKETS = 14;
  const colors = Array.from({ length: BUCKETS + 1 }, (_, i) => {
    const f = i / BUCKETS;
    let k = 0;
    while (k < STOPS.length - 2 && f > STOPS[k + 1][0]) k++;
    const [f0, c0] = STOPS[k], [f1, c1] = STOPS[k + 1];
    const t = (f - f0) / (f1 - f0);
    return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * t)).join(",")})`;
  });

  let w = 0, h = 0, dpr = 1, gap = 26, dots = [];
  const blob = { x: 0, y: 0, tx: 0, ty: 0 };
  let lastPointer = -Infinity, running = false, visible = true, raf = 0;

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = w < 700 ? 22 : 26;
    dots = [];
    const ox = ((w % gap) + gap) / 2, oy = ((h % gap) + gap) / 2;
    for (let y = oy; y < h; y += gap) for (let x = ox; x < w; x += gap) dots.push(x, y);
    if (!blob.x) { blob.x = blob.tx = w * 0.62; blob.y = blob.ty = h * 0.45; }
    if (reduced) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const R = Math.max(140, Math.min(w, h) * 0.3);
    const paths = Array.from({ length: BUCKETS + 1 }, () => new Path2D());
    const sizes = new Float32Array(BUCKETS + 1);
    for (let i = 0; i <= BUCKETS; i++) sizes[i] = 1.1 + (i / BUCKETS) * 2.6;

    for (let i = 0; i < dots.length; i += 2) {
      let x = dots[i], y = dots[i + 1];
      const dx = x - blob.x, dy = y - blob.y;
      const d = Math.hypot(dx, dy);
      let f = 0;
      if (d < R * 1.3) {
        const a = Math.atan2(dy, dx);
        const r = R * (1 + 0.14 * Math.sin(3 * a + t * 0.0011) + 0.09 * Math.sin(5 * a - t * 0.0016) + 0.05 * Math.sin(2 * a + t * 0.0007));
        f = Math.max(0, 1 - d / r);
        f = f * f * (3 - 2 * f); // smoothstep
        if (f > 0 && d > 0) {
          const push = Math.sin(f * Math.PI) * 7;
          x += (dx / d) * push; y += (dy / d) * push;
        }
      }
      const b = Math.round(f * BUCKETS);
      const s = sizes[b];
      paths[b].moveTo(x + s, y);
      paths[b].arc(x, y, s, 0, Math.PI * 2);
    }
    for (let i = 0; i <= BUCKETS; i++) { ctx.fillStyle = colors[i]; ctx.fill(paths[i]); }
  }

  function frame(t) {
    raf = 0;
    if (!running) return;
    if (t - lastPointer > 2500) {
      // idle drift
      blob.tx = w * (0.55 + 0.25 * Math.sin(t * 0.00023)) ;
      blob.ty = h * (0.42 + 0.22 * Math.sin(t * 0.00031 + 1.2));
    }
    blob.x += (blob.tx - blob.x) * 0.07;
    blob.y += (blob.ty - blob.y) * 0.07;
    draw(t);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (reduced || running || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const r = canvas.getBoundingClientRect();
    blob.tx = e.clientX - r.left;
    blob.ty = e.clientY - r.top;
    lastPointer = performance.now();
  }, { passive: true });

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  resize();
  start();
})();
