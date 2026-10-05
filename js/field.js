/* Hero dot field: a soft, wobbling blob follows the cursor and lights up
   the dot grid (brand shape language) as it passes. On touch devices it drifts on its own.
   Where the grid runs behind copy, the dots fade down so the text stays readable. */
(function () {
  let canvas = document.querySelector("[data-field]");
  if (!canvas) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STOPS = [
    [0.0, [206, 204, 195]],
    [0.35, [191, 235, 213]], // mint
    [0.8, [15, 138, 95]],    // vibrant
    [1.0, [6, 78, 53]]       // forest
  ];
  const BUCKETS = 14;
  const rgb = Array.from({ length: BUCKETS + 1 }, (_, i) => {
    const f = i / BUCKETS;
    let k = 0;
    while (k < STOPS.length - 2 && f > STOPS[k + 1][0]) k++;
    const [f0, c0] = STOPS[k], [f1, c1] = STOPS[k + 1];
    const t = (f - f0) / (f1 - f0);
    return c0.map((v, j) => Math.round(v + (c1[j] - v) * t));
  });
  const colors = rgb.map((c) => `rgb(${c.join(",")})`);
  const sizes = rgb.map((_, i) => 1.1 + (i / BUCKETS) * 2.6); // dot radius per bucket, CSS px

  /* ---- Renderer -------------------------------------------------------
     The dots are drawn with WebGL: one draw call of point sprites, each
     shaded as an anti-aliased circle on the GPU. Filling ~2,000 circles as
     2D canvas paths kept the GPU busy for several ms every frame and
     dropped frames while scrolling the intro. The 2D path is the fallback
     when WebGL isn't available, and ?field=2d forces it, to compare. */
  const VERT = `
    attribute vec2 a_pos;
    attribute float a_r;
    attribute vec4 a_col;
    uniform vec2 u_size;
    varying vec4 v_col;
    varying float v_r;
    varying float v_box;
    void main() {
      v_col = a_col;
      v_r = a_r;
      v_box = ceil(a_r * 2.0) + 2.0;
      gl_Position = vec4(a_pos.x / u_size.x * 2.0 - 1.0, 1.0 - a_pos.y / u_size.y * 2.0, 0.0, 1.0);
      gl_PointSize = v_box;
    }`;
  const FRAG = `
    precision mediump float;
    varying vec4 v_col;
    varying float v_r;
    varying float v_box;
    void main() {
      float d = length((gl_PointCoord - 0.5) * v_box);
      float cover = clamp(v_r - d + 0.5, 0.0, 1.0) * v_col.a;
      gl_FragColor = vec4(v_col.rgb * cover, cover);
    }`;
  const STRIDE = 7; // x, y, radius (device px), r, g, b, alpha
  const unit = rgb.map((c) => c.map((v) => v / 255));
  let gl = null, glSize = null, glData = new Float32Array(0), glLost = false;

  function setupGL() {
    const shader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    [["a_pos", 2, 0], ["a_r", 1, 2], ["a_col", 4, 3]].forEach(([name, n, offset]) => {
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, n, gl.FLOAT, false, STRIDE * 4, offset * 4);
    });
    glSize = gl.getUniformLocation(prog, "u_size");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied, like the 2D canvas
    gl.clearColor(0, 0, 0, 0);
    return true;
  }

  if (new URLSearchParams(location.search).get("field") !== "2d") {
    gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    // the biggest dot at the capped dpr of 2, plus its anti-aliased edge
    const pointMax = Math.ceil(sizes[BUCKETS] * 2 * 2) + 2;
    if (gl && !(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1] >= pointMax && setupGL())) {
      // a canvas keeps the first context it hands out, so the 2D path needs a fresh one
      const fresh = canvas.cloneNode();
      canvas.replaceWith(fresh);
      canvas = fresh;
      gl = null;
    }
  }
  const ctx = gl ? null : canvas.getContext("2d");
  if (gl) {
    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); glLost = true; });
    canvas.addEventListener("webglcontextrestored", () => { glLost = !setupGL(); if (reduced) draw(0); });
  }

  /* ---- Text shields --------------------------------------------------
     The copy sitting on the field (hero lines, the About column) is
     measured, and dots inside those boxes are drawn at a lower opacity.
     The fade runs over SOFT px around each box, so a lit dot dims on its
     way in and comes back up on its way out instead of snapping. Unlit
     grid dots are barely touched (BASE) — it's the bright, moving ones
     that make the type hard to read, especially on a phone. */
  const stage = canvas.closest(".stage") || canvas.parentElement;
  const shieldSrc = [
    ...[...document.querySelectorAll("[data-hero] .eyebrow, [data-hero] .hero-title, [data-hero] .hero-sub")]
      .map((el) => ({ el, prop: "--hero-o" })),
    ...[...document.querySelectorAll("[data-about]")]
      .map((el) => ({ el, prop: "--about-o" })),
    // the wordmark is fixed over the top of the field until the header goes solid
    ...[...document.querySelectorAll(".site-header .wordmark")]
      .map((el) => ({ el, prop: null }))
  ];
  const SHADES = 6;   // quantized dim levels, so dots can still be batched by color
  const BASE = 0.3;   // share of the dimming an unlit dot gets
  const PAD = 6;      // grow each text box a little past its glyphs
  let dimMax = 0.8, soft = 40, shields = [], live = [], bounds = null, shieldKey = null;

  function stageVar(prop, fallback) {
    const v = parseFloat(stage && stage.style.getPropertyValue(prop));
    return Number.isFinite(v) ? v : fallback;
  }

  // Line boxes, not element boxes: the h1 block runs far wider than the two
  // lines of type inside it, and shielding all that empty space would punch a
  // hole in the grid where there's nothing to read.
  const range = document.createRange();
  function measureShields() {
    const r = canvas.getBoundingClientRect();
    shields = [];
    for (const s of shieldSrc) {
      range.selectNodeContents(s.el);
      const rects = range.getClientRects();
      for (let i = 0; i < rects.length; i++) {
        const b = rects[i];
        if (b.width < 1 || b.height < 1) continue;
        shields.push({
          x0: b.left - r.left - PAD, y0: b.top - r.top - PAD,
          x1: b.right - r.left + PAD, y1: b.bottom - r.top + PAD,
          prop: s.prop, a: 0
        });
      }
    }
  }

  // The stage is sticky, so these boxes only move when the intro's scroll
  // variables change. Re-measure on that, not every frame.
  function syncShields() {
    const key = ["--hero-o", "--hero-y", "--about-o", "--about-y"].map((p) => stage && stage.style.getPropertyValue(p)).join("|");
    if (key !== shieldKey) { shieldKey = key; measureShields(); }
    const a = {
      "--hero-o": Math.max(0, Math.min(1, stageVar("--hero-o", 1))),
      "--about-o": Math.max(0, Math.min(1, stageVar("--about-o", 0)))
    };
    // only the boxes that are actually showing, plus their union: one rect test
    // then rejects every dot that is nowhere near copy
    live = [];
    bounds = null;
    for (const s of shields) {
      s.a = s.prop ? a[s.prop] : 1;
      if (s.a <= 0.02) continue;
      live.push(s);
      bounds = bounds
        ? [Math.min(bounds[0], s.x0), Math.min(bounds[1], s.y0), Math.max(bounds[2], s.x1), Math.max(bounds[3], s.y1)]
        : [s.x0, s.y0, s.x1, s.y1];
    }
  }

  // 0 (clear) → 1 (fully behind copy), smoothed across the SOFT band
  function shieldAt(x, y) {
    if (x < bounds[0] - soft || x > bounds[2] + soft || y < bounds[1] - soft || y > bounds[3] + soft) return 0;
    let dim = 0;
    for (let i = 0; i < live.length; i++) {
      const s = live[i];
      const ox = x < s.x0 ? s.x0 - x : (x > s.x1 ? x - s.x1 : 0);
      const oy = y < s.y0 ? s.y0 - y : (y > s.y1 ? y - s.y1 : 0);
      if (ox >= soft || oy >= soft) continue;
      const d = ox || oy ? Math.hypot(ox, oy) : 0;
      if (d >= soft) continue;
      let f = 1 - d / soft;
      f = f * f * (3 - 2 * f); // smoothstep
      const v = f * s.a;
      if (v > dim) dim = v;
    }
    return dim;
  }

  let w = 0, h = 0, dpr = 1, gap = 26, dots = [];
  const blob = { x: 0, y: 0, tx: 0, ty: 0 };
  let lastPointer = -Infinity, running = false, visible = true, raf = 0;

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = w < 700 ? 22 : 26;
    // a phone gives the copy far less room around it, so fade harder there
    dimMax = w < 700 ? 0.88 : 0.74;
    soft = w < 700 ? 34 : 48;
    dots = [];
    const ox = ((w % gap) + gap) / 2, oy = ((h % gap) + gap) / 2;
    for (let y = oy; y < h; y += gap) for (let x = ox; x < w; x += gap) dots.push(x, y);
    if (gl) glData = new Float32Array((dots.length / 2) * STRIDE);
    if (!blob.x) { blob.x = blob.tx = w * 0.62; blob.y = blob.ty = h * 0.45; }
    shieldKey = null;
    if (reduced) { syncShields(); draw(0); }
  }

  function draw(t) {
    if (glLost) return;
    const R = Math.max(140, Math.min(w, h) * 0.3);
    let slots = null, n = 0;
    if (!gl) {
      ctx.clearRect(0, 0, w, h);
      slots = new Array((SHADES + 1) * (BUCKETS + 1));
    }

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
      const dim = bounds ? shieldAt(x, y) * (BASE + (1 - BASE) * f) : 0;
      const sh = Math.round(dim * SHADES);
      if (gl) {
        const o = n++ * STRIDE, c = unit[b];
        glData[o] = x * dpr;
        glData[o + 1] = y * dpr;
        glData[o + 2] = sizes[b] * dpr;
        glData[o + 3] = c[0];
        glData[o + 4] = c[1];
        glData[o + 5] = c[2];
        glData[o + 6] = 1 - (sh / SHADES) * dimMax;
        continue;
      }
      const slot = sh * (BUCKETS + 1) + b;
      let p = slots[slot];
      if (!p) p = slots[slot] = new Path2D();
      const s = sizes[b];
      p.moveTo(x + s, y);
      p.arc(x, y, s, 0, Math.PI * 2);
    }

    if (gl) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(glSize, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bufferData(gl.ARRAY_BUFFER, glData.subarray(0, n * STRIDE), gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.POINTS, 0, n);
      return;
    }

    for (let sh = 0; sh <= SHADES; sh++) {
      ctx.globalAlpha = 1 - (sh / SHADES) * dimMax;
      for (let b = 0; b <= BUCKETS; b++) {
        const p = slots[sh * (BUCKETS + 1) + b];
        if (!p) continue;
        ctx.fillStyle = colors[b];
        ctx.fill(p);
      }
    }
    ctx.globalAlpha = 1;
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
    syncShields();
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
