/* Renders a product story from SITE.stories using ?id=<slug>.
   Each block in story.blocks maps to one layout below. See js/content.js. */
(function () {
  const S = window.SITE;
  const e = window.escapeHTML;
  const root = document.querySelector("[data-story]");
  const id = new URLSearchParams(location.search).get("id");
  const stories = S.stories || [];
  const index = stories.findIndex((s) => s.slug === id);
  const story = stories[index];

  /* blank-line-separated text becomes paragraphs */
  const paras = (text, cls) =>
    String(text || "")
      .split(/\n\s*\n/)
      .filter((t) => t.trim())
      .map((t) => `<p${cls ? ` class="${cls}"` : ""}>${e(t.trim())}</p>`)
      .join("");

  /* cap a screenshot's display width so it never blows past its own resolution */
  const cap = (w) => (w ? ` style="--imgw:${Math.round(w * 1.6)}px"` : "");

  function img(b, eager) {
    if (!b.image) return "";
    const dims = b.w && b.h ? ` width="${b.w}" height="${b.h}"` : "";
    return `<img src="${e(b.image)}" alt="${e(b.alt || "")}"${dims} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />`;
  }

  /* basic geometric shapes from the brand's shape language, cycled along a line */
  const SHAPES = [
    '<polygon points="12,1.5 21,6.75 21,17.25 12,22.5 3,17.25 3,6.75" />',   // hexagon
    '<circle cx="12" cy="12" r="10" />',                                      // circle
    '<polygon points="12,3.2 21.6,20.4 2.4,20.4" />',                         // triangle
    '<rect x="2.5" y="2.5" width="19" height="19" rx="3" />',                 // square
    '<polygon points="12,1.5 22.5,12 12,22.5 1.5,12" />'                      // diamond
  ];
  const shapeSVG = (i, cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${SHAPES[i % SHAPES.length]}</svg>`;

  /* a screen recording: plays itself once on first view, then replays on click */
  function film(b) {
    const dims = b.w && b.h ? ` width="${b.w}" height="${b.h}"` : "";
    const ratio = b.w && b.h ? ` style="--ratio:${b.w} / ${b.h}"` : "";
    return `<div class="plate plate--film" data-film${ratio}>
      <video class="plate__film" src="${e(b.video)}"${dims} muted playsinline preload="metadata"
        aria-label="${e(b.alt || "")}"></video>
      <button type="button" class="film__replay" data-film-replay>
        <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="8.5,5 19,12 8.5,19" /></svg>
        <span class="film__replay-text">Play</span>
      </button>
    </div>`;
  }

  /* a screenshot, optionally clipped when it is very tall (dashboards) */
  function plate(b, eager) {
    if (b.video) return film(b);
    if (!b.image) return "";
    const inner = `<div class="plate__shot">${img(b, eager)}</div>`;
    if (!b.tall) return `<div class="plate">${inner}</div>`;
    return `<div class="plate plate--tall">
      ${inner}
      <a class="plate__open" href="${e(b.image)}" target="_blank" rel="noopener">
        Open full screenshot <span aria-hidden="true">↗</span>
      </a>
    </div>`;
  }

  const caption = (b) => (b.caption ? `<figcaption class="story-caption">${e(b.caption)}</figcaption>` : "");

  const calloutList = (items) =>
    !items || !items.length
      ? ""
      : `<ul class="callouts">${items.map((c) => `<li>${e(c)}</li>`).join("")}</ul>`;

  /* ------------------------------------------------------------------
     BLOCKS
     ------------------------------------------------------------------ */
  const BLOCKS = {
    figure: (b) => `
      <figure class="story-block story-figure story-figure--${e(b.width || "wide")} reveal"${cap(b.w)}>
        ${plate(b)}
        ${caption(b)}
      </figure>`,

    split: (b) => `
      <section class="story-block story-split story-split--${e(b.ratio || "40-60")}${b.flip ? " is-flipped" : ""} reveal">
        <div class="story-split__copy">
          ${b.heading ? `<h2 class="story-h2">${e(b.heading)}</h2>` : ""}
          ${b.subhead ? `<p class="story-subhead">${e(b.subhead)}</p>` : ""}
          ${paras(b.body)}
        </div>
        <figure class="story-split__art"${cap(b.w)}>
          ${plate(b)}
          ${caption(b)}
        </figure>
      </section>`,

    statement: (b) => `
      <section class="story-block story-statement reveal">
        ${b.heading ? `<h2 class="story-h2">${e(b.heading)}</h2>` : ""}
        ${b.quote ? `<p class="story-pull">${e(b.quote)}</p>` : ""}
        <div class="story-statement__body">${paras(b.body)}</div>
      </section>`,

    timeline: (b) => `
      <section class="story-block story-evolution reveal">
        ${b.heading ? `<h2 class="story-eyebrow-h">${e(b.heading)}</h2>` : ""}
        <ol class="evo">
          ${(b.nodes || [])
            .map(
              (n, i) => `<li class="evo__node">
                ${shapeSVG(i, "evo__dot")}
                <span class="evo__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
                <span class="evo__label">${e(n)}</span>
              </li>`
            )
            .join("")}
        </ol>
      </section>`,

    steps: (b) => `
      <section class="story-block story-steps reveal">
        ${b.heading ? `<h2 class="story-eyebrow-h">${e(b.heading)}</h2>` : ""}
        <ol class="steps">
          ${(b.items || [])
            .map(
              (s) => `<li class="step">
                <p class="step__label">${e(s.label)}</p>
                <p class="step__body">${e(s.body)}</p>
              </li>`
            )
            .join("")}
        </ol>
      </section>`,

    metrics: (b) => `
      <section class="story-block story-metrics reveal">
        <div class="metric-strip${b.rule === false ? " metric-strip--flush" : ""}">
          ${(b.items || [])
            .map(
              (m) => `<div class="metric">
                <strong>${e(m.value)}</strong>
                <span>${e(m.label)}</span>
              </div>`
            )
            .join("")}
        </div>
        ${b.note ? `<p class="story-note">${e(b.note)}</p>` : ""}
      </section>`,

    annotated: (b) => `
      <section class="story-block story-annotated${b.align === "center" ? " is-centered" : ""} reveal">
        ${b.heading ? `<h2 class="story-h2">${e(b.heading)}</h2>` : ""}
        ${b.body ? `<div class="story-annotated__lede">${paras(b.body)}</div>` : ""}
        ${
          b.image || b.video
            ? `<figure class="story-annotated__art"${cap(b.w)}>
                 ${plate(b)}
                 ${caption(b)}
               </figure>`
            : ""
        }
        ${calloutList(b.callouts)}
        ${b.kicker ? `<p class="story-kicker">${e(b.kicker)}</p>` : ""}
      </section>`,

    gallery: (b) => `
      <section class="story-block story-gallery reveal">
        ${b.heading ? `<h2 class="story-h2">${e(b.heading)}</h2>` : ""}
        ${b.body ? `<div class="story-gallery__lede">${paras(b.body)}</div>` : ""}
        <div class="gallery gallery--${b.cols || 2}">
          ${(b.items || [])
            .map(
              (it) => `<figure class="gallery__item">
                ${plate(it)}
                ${caption(it)}
              </figure>`
            )
            .join("")}
        </div>
      </section>`,

    cards: (b) => `
      <section class="story-block story-cards reveal">
        ${b.heading ? `<h2 class="story-h2">${e(b.heading)}</h2>` : ""}
        <div class="decisions">
          ${(b.items || [])
            .map(
              (c, i) => `<article class="decision">
                <span class="decision__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
                <h3>${e(c.title)}</h3>
                <p>${e(c.body)}</p>
              </article>`
            )
            .join("")}
        </div>
      </section>`,

    impact: (b) => `
      <section class="story-impact">
        <div class="container">
          <p class="eyebrow">Impact</p>
          ${b.heading ? `<h2 class="story-impact__h reveal">${e(b.heading)}</h2>` : ""}
          <div class="impact-primary reveal">
            <strong>${e(b.primary.value)}</strong>
            <span>${e(b.primary.label)}</span>
          </div>
          ${
            (b.secondary || []).length
              ? `<div class="impact-secondary">
                   ${b.secondary
                     .map(
                       (m) => `<div class="impact-sec reveal">
                         <strong>${e(m.value)}</strong>
                         <span>${e(m.label)}</span>
                       </div>`
                     )
                     .join("")}
                 </div>`
              : ""
          }
          ${b.body ? `<div class="impact-body reveal">${paras(b.body)}</div>` : ""}
        </div>
      </section>`,

    closing: (b) => `
      <section class="story-block story-closing reveal">
        ${b.heading ? `<h2 class="story-h2">${e(b.heading)}</h2>` : ""}
        ${paras(b.body)}
        ${b.end ? `<p class="story-end">${e(b.end)}</p>` : ""}
      </section>`,

    prose: (b) => `
      <section class="story-block story-prose${b.align === "center" ? " is-centered" : ""} reveal">
        ${b.heading ? `<h2 class="story-h2">${e(b.heading)}</h2>` : ""}
        ${paras(b.body)}
      </section>`
  };

  /* ------------------------------------------------------------------
     GATE / NOT FOUND
     ------------------------------------------------------------------ */
  function renderGate() {
    root.innerHTML = `
      <section class="project-gate">
        <form class="gate__card" data-gate-form>
          <svg class="gate__icon" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5" /><rect x="36" y="48" width="28" height="22" rx="3" /><path d="M42 48v-7a8 8 0 0 1 16 0v7" /></svg>
          <h1 style="font-size:24px;margin-bottom:10px">This product story is password protected</h1>
          <p>Enter the password to continue.</p>
          <div class="gate__row">
            <label class="sr-only" for="pw">Password</label>
            <div class="gate__pw-wrap">
              <input id="pw" type="password" autocomplete="current-password" placeholder="Password" required autofocus />
              <button type="button" class="gate__pw-toggle" data-pw-toggle aria-label="Show password" aria-pressed="false">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path class="eye-shape" d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                  <circle class="eye-shape" cx="12" cy="12" r="3" />
                  <line class="eye-slash" x1="3" y1="3" x2="21" y2="21" />
                </svg>
              </button>
            </div>
            <button class="btn btn--primary" type="submit">Unlock</button>
          </div>
          <p class="gate__error" role="alert"></p>
        </form>
      </section>`;
    const form = root.querySelector("form");
    window.wirePasswordToggle(form);
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const input = form.querySelector("input");
      if (await window.Gate.tryUnlock(input.value)) {
        render();
      } else {
        form.querySelector(".gate__error").textContent = "That password didn't work. Try again?";
        form.classList.remove("shake");
        void form.offsetWidth;
        form.classList.add("shake");
        input.select();
      }
    });
  }

  function renderNotFound() {
    root.innerHTML = `
      <section class="project-gate"><div class="not-found">
        <h1>Story not found</h1>
        <p>That product story doesn't exist, or its link has changed.</p>
        <a class="btn btn--primary" href="index.html#work">Back to work</a>
      </div></section>`;
  }

  /* ------------------------------------------------------------------
     STORY
     ------------------------------------------------------------------ */
  function factValue(v) {
    return Array.isArray(v)
      ? v.map((line) => `<span>${e(line)}</span>`).join("")
      : `<span>${e(v)}</span>`;
  }

  /* `impact` is a full-bleed colour band, so it can't sit inside the padded
     body column. Blocks are emitted in runs: contained groups around it. */
  const FULL_BLEED = new Set(["impact"]);

  function renderBody(blocks) {
    const out = [];
    let run = [];
    const flush = () => {
      if (!run.length) return;
      out.push(`<div class="story-body container">${run.join("")}</div>`);
      run = [];
    };
    blocks.forEach((b) => {
      const html = BLOCKS[b.type] ? BLOCKS[b.type](b) : "";
      if (!html) return;
      if (FULL_BLEED.has(b.type)) {
        flush();
        out.push(html);
      } else {
        run.push(html);
      }
    });
    flush();
    return out.join("");
  }

  /* Screen recordings play themselves once when they first scroll into view,
     then sit on their last frame until the viewer asks for another pass. */
  function wireFilms(scope) {
    scope.querySelectorAll("[data-film]").forEach((wrap) => {
      const video = wrap.querySelector("video");
      const replay = wrap.querySelector("[data-film-replay]");
      const label = wrap.querySelector(".film__replay-text");
      if (!video) return;

      /* if the browser refuses to autoplay, fall back to offering the button */
      const stall = () => {
        wrap.classList.remove("is-playing");
        wrap.classList.add("is-done");
      };

      const play = () => {
        wrap.classList.add("is-playing");
        wrap.classList.remove("is-done");
        if (video.readyState > 0) video.currentTime = 0;
        const p = video.play();
        if (p && p.catch) p.catch(stall);
      };

      video.addEventListener("ended", () => {
        wrap.classList.remove("is-playing");
        wrap.classList.add("is-done");
        if (label) label.textContent = "Replay";
        if (replay) replay.setAttribute("aria-label", "Replay the dashboard walkthrough");
      });

      if (replay) replay.addEventListener("click", play);
      video.addEventListener("click", () => {
        if (!wrap.classList.contains("is-playing")) play();
      });

      /* autoplay is only honoured muted, and only once the clip is on screen */
      if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        wrap.classList.add("is-done");
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            play();
          });
        },
        { threshold: 0.45 }
      );
      io.observe(wrap);
    });
  }

  function render() {
    const p = story;
    document.title = `${p.title} · Kristie Campbell`;

    const fallback = stories[(index + 1) % stories.length];
    const nextRef = p.next || {};
    const next = stories.find((s) => s.slug === nextRef.slug) || fallback;
    const facts = p.facts || [];
    const blocks = p.blocks || [];

    /* the hero image is the first block when it's a full-width figure, so it
       can render eagerly and sit tight under the intro */
    const heroFigure = blocks[0] && blocks[0].type === "figure" ? blocks[0] : null;
    const rest = heroFigure ? blocks.slice(1) : blocks;

    root.innerHTML = `
      <article class="story">
        <header class="story-hero container">
          <div class="story-hero__intro">
            ${p.eyebrow ? `<p class="eyebrow">${e(p.eyebrow)}</p>` : ""}
            <h1 class="story-title">${e(p.title)}</h1>
            ${p.headline ? `<p class="story-headline">${e(p.headline)}</p>` : ""}
            ${p.intro ? `<div class="story-lede">${paras(p.intro)}</div>` : ""}
          </div>
          ${
            facts.length
              ? `<dl class="story-facts">
                   ${facts
                     .map(
                       (f) => `<div><dt>${e(f.label)}</dt><dd>${factValue(f.value)}</dd></div>`
                     )
                     .join("")}
                 </dl>`
              : ""
          }
        </header>

        ${
          heroFigure
            ? `<figure class="story-hero__art container"${cap(heroFigure.w)}>
                 ${plate(heroFigure, true)}
                 ${caption(heroFigure)}
               </figure>`
            : ""
        }

        ${renderBody(rest)}

        ${
          next && next.slug !== p.slug
            ? `<a class="next-story container" href="story.html?id=${encodeURIComponent(next.slug)}">
                 <p class="eyebrow">Next story</p>
                 ${nextRef.bridge ? `<p class="next-story__bridge">${e(nextRef.bridge)}</p>` : ""}
                 <h2>${e(next.title)} <span aria-hidden="true">→</span></h2>
               </a>`
            : ""
        }
      </article>`;

    window.observeReveals(root);
    wireFilms(root);
    window.scrollTo(0, 0);
  }

  if (!story) renderNotFound();
  else if (!window.Gate.isUnlocked()) renderGate();
  else render();
})();
