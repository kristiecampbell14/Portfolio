(function () {
  const S = window.SITE;
  const e = window.escapeHTML;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===================================================================
     INTRO: hero fades out, about fades in, photo rises and stays in focus
     =================================================================== */
  const intro = document.querySelector("[data-intro]");
  const stage = intro.querySelector(".stage");
  const hero = intro.querySelector("[data-hero]");
  const about = intro.querySelector("[data-about]");
  const shapes = [...intro.querySelectorAll(".shape")];
  let scrollP = 0, mx = 0, my = 0, ticking = false;

  function introProgress() {
    const total = intro.offsetHeight - stage.offsetHeight;
    return total > 0 ? clamp(-intro.getBoundingClientRect().top / total) : 0;
  }

  function renderIntro() {
    ticking = false;
    const p = (scrollP = introProgress());
    const heroO = 1 - easeOut(clamp(p / 0.4));
    const aboutO = easeOut(clamp((p - 0.38) / 0.34));
    stage.style.setProperty("--hero-o", heroO.toFixed(3));
    stage.style.setProperty("--hero-y", (reduced ? 0 : -easeOut(clamp(p / 0.5)) * 90).toFixed(1) + "px");
    stage.style.setProperty("--photo-t", easeInOut(clamp(p / 0.75)).toFixed(3));
    stage.style.setProperty("--about-o", aboutO.toFixed(3));
    stage.style.setProperty("--about-y", (reduced ? 0 : (1 - aboutO) * 40).toFixed(1) + "px");
    stage.style.setProperty("--line-o", easeOut(clamp((p - 0.72) / 0.28)).toFixed(3));

    // keep hidden layers out of the tab order
    hero.inert = heroO < 0.05;
    about.inert = aboutO < 0.05;
    about.toggleAttribute("data-hidden", aboutO < 0.01);

    shapes.forEach((s) => {
      const d = parseFloat(s.dataset.depth);
      const ty = reduced ? 0 : -p * d * 140;
      s.style.transform = `translate(${(mx * d * 14).toFixed(1)}px, ${(my * d * 14 + ty).toFixed(1)}px)`;
    });
  }
  const requestIntro = () => { if (!ticking) { ticking = true; requestAnimationFrame(renderIntro); } };
  // shared across the page: lets other code (e.g. the quotes carousel) tell a real
  // hover apart from a browser-synthesized one fired while content scrolls under a static cursor
  window.__lastScrollAt = 0;
  window.addEventListener("scroll", () => { window.__lastScrollAt = performance.now(); requestIntro(); }, { passive: true });
  window.addEventListener("resize", requestIntro);
  if (!reduced) {
    window.addEventListener("pointermove", (ev) => {
      if (ev.pointerType === "touch" || scrollP > 0.5) return;
      mx = ev.clientX / window.innerWidth - 0.5;
      my = ev.clientY / window.innerHeight - 0.5;
      requestIntro();
    }, { passive: true });
  }
  renderIntro();

  // "About" lives inside the pinned stage, so jump to the scroll position where it's fully shown
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest('a[href="#about"]');
    if (!a) return;
    ev.preventDefault();
    const total = intro.offsetHeight - stage.offsetHeight;
    window.scrollTo({ top: intro.offsetTop + total * 0.85, behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", "#about");
  });

  /* ===================================================================
     WORK: password gate + carousel
     =================================================================== */
  const gate = document.querySelector("[data-gate]");
  const gateForm = document.querySelector("[data-gate-form]");
  const gateError = document.querySelector("[data-gate-error]");
  const badge = document.querySelector("[data-lock-badge]");
  const carousel = document.querySelector("[data-carousel]");
  const track = carousel.querySelector("[data-track]");
  const dotsEl = carousel.querySelector("[data-dots]");
  const prevBtn = carousel.querySelector("[data-prev]");
  const nextBtn = carousel.querySelector("[data-next]");

  function showWork(focus) {
    gate.hidden = true;
    carousel.hidden = false;
    badge.classList.add("is-open");
    badge.querySelector("span").textContent = "Unlocked";
    buildCarousel();
    if (focus) track.querySelector(".card")?.focus({ preventScroll: true });
  }

  gateForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const input = gateForm.querySelector("input");
    if (await window.Gate.tryUnlock(input.value)) {
      gateError.textContent = "";
      showWork(true);
    } else {
      gateError.textContent = "That password didn't work. Try again?";
      gateForm.classList.remove("shake");
      void gateForm.offsetWidth;
      gateForm.classList.add("shake");
      input.select();
    }
  });

  let cards = [];
  function buildCarousel() {
    track.innerHTML = S.stories.map((p) => `
      <a class="card" href="story.html?id=${encodeURIComponent(p.slug)}">
        ${window.browserMock(p, p.cover)}
        <div class="card__meta">
          <div><h3>${e(p.title)}</h3><p>${e(p.role)} · ${e(p.year)}</p></div>
          <span class="card__arrow" aria-hidden="true">→</span>
        </div>
      </a>`).join("");
    cards = [...track.querySelectorAll(".card")];
    dotsEl.innerHTML = cards.map((_, i) => `<button aria-label="Go to story ${i + 1}"></button>`).join("");
    [...dotsEl.children].forEach((b, i) => b.addEventListener("click", () => goTo(i)));
    updateCarousel();
  }

  const startPad = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
  function currentIndex() {
    const x = track.scrollLeft + startPad();
    let best = 0, bestD = Infinity;
    cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft - x); if (d < bestD) { bestD = d; best = i; } });
    return best;
  }
  function goTo(i) {
    i = clamp(i, 0, cards.length - 1);
    track.scrollTo({ left: cards[i].offsetLeft - startPad(), behavior: reduced ? "auto" : "smooth" });
  }
  function updateCarousel() {
    if (!cards.length) return;
    const i = currentIndex();
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    [...dotsEl.children].forEach((b, j) => b.setAttribute("aria-current", String(j === i)));
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = atEnd;
  }
  prevBtn.addEventListener("click", () => goTo(currentIndex() - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex() + 1));
  track.addEventListener("scroll", () => requestAnimationFrame(updateCarousel), { passive: true });
  track.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowRight") { ev.preventDefault(); goTo(currentIndex() + 1); }
    if (ev.key === "ArrowLeft") { ev.preventDefault(); goTo(currentIndex() - 1); }
  });

  // mouse drag to scroll
  let drag = null;
  track.addEventListener("pointerdown", (ev) => {
    if (ev.pointerType !== "mouse" || ev.button !== 0) return;
    drag = { x: ev.clientX, left: track.scrollLeft, moved: false };
  });
  window.addEventListener("pointermove", (ev) => {
    if (!drag) return;
    const dx = ev.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; track.classList.add("is-dragging"); }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  });
  window.addEventListener("pointerup", () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (moved) {
      track.classList.remove("is-dragging");
      goTo(currentIndex());
      // swallow the click that follows a drag
      track.addEventListener("click", (ev) => ev.preventDefault(), { capture: true, once: true });
    }
  });
  track.addEventListener("dragstart", (ev) => ev.preventDefault());

  if (window.Gate.isUnlocked()) showWork(false);

  /* ===================================================================
     RESUME TIMELINE
     =================================================================== */
  const tl = S.timeline;
  const CONTACT = tl.length;            // the "?" node sits after the last role
  const NODES = tl.length + 1;
  const tlPath = document.querySelector("[data-tl-path]");
  const tlClip = document.querySelector("[data-tl-clip]");
  const tlPoints = document.querySelector("[data-tl-points]");
  const tlPanel = document.querySelector("[data-tl-panel]");
  const tlCount = document.querySelector("[data-tl-count]");
  const tlPrev = document.querySelector("[data-tl-prev]");
  const tlNext = document.querySelector("[data-tl-next]");
  let active = tl.length - 1;

  // sample the curve so we can place points at even x positions
  const L = tlPath.getTotalLength();
  const samples = Array.from({ length: 400 }, (_, i) => tlPath.getPointAtLength((L * i) / 399));
  const yAt = (x) => samples.reduce((best, pt) => (Math.abs(pt.x - x) < Math.abs(best.x - x) ? pt : best)).y;
  const xs = Array.from({ length: NODES }, (_, i) => (NODES === 1 ? 500 : 60 + (i * 880) / (NODES - 1)));

  // basic geometric shapes from the brand's shape language, cycled along the line
  const SHAPES = [
    '<polygon points="12,1.5 21,6.75 21,17.25 12,22.5 3,17.25 3,6.75" />',   // hexagon
    '<circle cx="12" cy="12" r="10" />',                                      // circle
    '<polygon points="12,2 22,21 2,21" />',                                   // triangle
    '<rect x="2.5" y="2.5" width="19" height="19" rx="3" />',                 // square
    '<polygon points="12,1.5 22.5,12 12,22.5 1.5,12" />'                      // diamond
  ];
  const shapeSVG = (i) => `<svg class="tl-point__shape" viewBox="0 0 24 24" aria-hidden="true">${SHAPES[i % SHAPES.length]}</svg>`;

  tlPoints.innerHTML = tl.map((item, i) => {
    const x = xs[i], y = yAt(x);
    return `<button class="tl-point ${y > 64 ? "label-above" : ""}" role="tab" id="tl-tab-${i}"
      aria-controls="tl-panel" aria-label="${e(item.title)}, ${e(item.company)}, ${e(item.dates)}"
      style="left:${x / 10}%; top:${(y / 120) * 100}%">
      ${shapeSVG(i)}
      <span class="tl-point__year" aria-hidden="true">${e(item.year)}</span>
    </button>`;
  }).join("") + (() => {
    const x = xs[CONTACT], y = yAt(x);
    return `<button class="tl-point tl-point--contact ${y > 64 ? "label-above" : ""}" role="tab" id="tl-tab-${CONTACT}"
      aria-controls="tl-panel" aria-label="What's next: get in touch"
      style="left:${x / 10}%; top:${(y / 120) * 100}%">
      <svg class="tl-point__shape" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,1.5 21,6.75 21,17.25 12,22.5 3,17.25 3,6.75" /></svg>
      <span class="tl-point__mark" aria-hidden="true">?</span>
      <span class="tl-point__year" aria-hidden="true">Next</span>
    </button>`;
  })();
  tlPanel.id = "tl-panel";
  const tlBtns = [...tlPoints.children];
  tlBtns.forEach((b, i) => b.addEventListener("click", () => setActive(i)));
  tlPoints.addEventListener("keydown", (ev) => {
    const dir = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity }[ev.key];
    if (dir === undefined) return;
    ev.preventDefault();
    setActive(clamp(active + (Math.abs(dir) === Infinity ? dir * NODES : dir), 0, NODES - 1), true);
  });
  tlPrev.addEventListener("click", () => setActive(active - 1));
  tlNext.addEventListener("click", () => setActive(active + 1));

  function setActive(i, focus) {
    active = clamp(i, 0, NODES - 1);
    const isContact = active === CONTACT;
    tlBtns.forEach((b, j) => {
      const on = j === active;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      b.classList.toggle("is-past", j < active);
    });
    if (focus) tlBtns[active].focus();
    tlClip.setAttribute("width", xs[active]);
    tlPanel.setAttribute("aria-labelledby", `tl-tab-${active}`);
    tlPanel.classList.toggle("is-contact", isContact);

    if (isContact) {
      const c = S.contact || {};
      tlPanel.innerHTML = `
        <div class="tl-contact">
          ${c.status ? `<p class="tl-contact__status"><i aria-hidden="true"></i>${e(c.status)}</p>` : ""}
          <h3>${e(c.heading || "What's next?")}</h3>
          <p class="tl-contact__body">${e(c.body || "")}</p>
          <div class="tl-contact__actions">
            <a class="btn btn--primary" href="mailto:${e(S.email)}">${e(c.emailLabel || "Say hello")}</a>
            <a class="btn btn--light" href="${e(S.linkedin)}" target="_blank" rel="noopener">${e(c.linkedinLabel || "LinkedIn")} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="tl-contact__shapes" aria-hidden="true">
          <svg viewBox="0 0 100 100" class="tc-shape tc-shape--1"><polygon points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5" /></svg>
          <svg viewBox="0 0 100 100" class="tc-shape tc-shape--2"><polygon points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5" /></svg>
          <svg viewBox="0 0 100 100" class="tc-shape tc-shape--3"><polygon points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5" /></svg>
          <svg viewBox="0 0 100 100" class="tc-shape tc-shape--4"><circle cx="50" cy="50" r="47" /></svg>
        </div>`;
      tlCount.textContent = "Let's talk";
    } else {
      const item = tl[active];
      tlPanel.innerHTML = `
        <div class="tl-role">
          <h3>${e(item.title)}</h3>
          <p class="company">${e(item.company)}</p>
          <p class="dates">${e(item.dates)}</p>
        </div>
        <ul class="tl-points">${item.points.map((pt) => `<li>${e(pt)}</li>`).join("")}</ul>`;
      tlCount.textContent = `${String(active + 1).padStart(2, "0")} / ${String(tl.length).padStart(2, "0")}`;
    }
    tlPrev.disabled = active === 0;
    tlNext.disabled = active === NODES - 1;
  }
  setActive(tl.length - 1);

  // arriving from another page at index.html#contact
  if (location.hash === "#contact") setActive(CONTACT);

  // "Contact" links jump to the resume timeline and open the "?" node
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest('a[href="#contact"]');
    if (!a) return;
    ev.preventDefault();
    setActive(CONTACT);
    document.querySelector("#resume").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#contact");
  });

  /* ===================================================================
     KIND WORDS: rotating LinkedIn recommendations
     =================================================================== */
  const quotesEl = document.querySelector("[data-quotes]");
  const qDots = document.querySelector("[data-quote-dots]");
  const recs = S.recommendations;
  const QUOTE_MS = 9000;
  let qi = 0, qTimer = 0, paused = false;

  const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  quotesEl.innerHTML = recs.map((r) => `
    <figure class="quote">
      <blockquote>${e(r.quote)}</blockquote>
      <figcaption>
        <span class="avatar" aria-hidden="true">${e(initials(r.name))}</span>
        <span><cite>${e(r.name)}</cite><span class="who">${e(r.title)}${r.relation ? " · " + e(r.relation) : ""}</span></span>
      </figcaption>
    </figure>`).join("");
  qDots.innerHTML = recs.map((_, i) => `<button aria-label="Show recommendation ${i + 1}"></button>`).join("");
  quotesEl.style.setProperty("--quote-ms", QUOTE_MS + "ms");
  qDots.style.setProperty("--quote-ms", QUOTE_MS + "ms");
  const quoteEls = [...quotesEl.children];
  const qBtns = [...qDots.children];
  qBtns.forEach((b, i) => b.addEventListener("click", () => showQuote(i)));

  function showQuote(i) {
    qi = (i + recs.length) % recs.length;
    quoteEls.forEach((q, j) => { q.classList.toggle("is-active", j === qi); q.setAttribute("aria-hidden", String(j !== qi)); });
    qBtns.forEach((b, j) => {
      b.removeAttribute("aria-current");
      if (j === qi) { void b.offsetWidth; b.setAttribute("aria-current", "true"); }
    });
    schedule();
  }
  function schedule() {
    clearTimeout(qTimer);
    if (!reduced && !paused && recs.length > 1) qTimer = setTimeout(() => showQuote(qi + 1), QUOTE_MS);
  }
  // bind to the inner container, not the whole padded <section> — keeps the section's
  // large top/bottom padding out of the hoverable area (see setPaused notes below)
  const pauseZone = quotesEl.closest(".container");
  let pauseBackstop = 0;
  const setPaused = (v) => {
    paused = v;
    quotesEl.classList.toggle("is-paused", v);
    clearTimeout(pauseBackstop);
    if (v) {
      clearTimeout(qTimer);
      // self-healing backstop: if some edge case never clears the pause (a missed
      // event, an unusual browser), don't let the carousel stay dead for the rest of the visit
      pauseBackstop = setTimeout(() => setPaused(false), 20000);
    } else {
      showQuote(qi);
    }
  };
  // Mouse/pen only — scrolling a page can move content under a stationary cursor, which
  // Chromium-based browsers report as a synthetic pointerenter. Ignore anything that fires
  // right after a scroll, since a genuine hover won't coincide with one.
  pauseZone.addEventListener("pointerenter", (ev) => {
    if (ev.pointerType === "touch") return;
    if (performance.now() - (window.__lastScrollAt || 0) < 250) return;
    setPaused(true);
  });
  pauseZone.addEventListener("pointerleave", (ev) => {
    if (ev.pointerType === "touch") return;
    setPaused(false);
  });
  // Touch has no real "hover" — mobile browsers emulate pointerenter/pointerleave around the
  // touch lifecycle, but a scroll starting on this section reliably fires pointercancel instead
  // of a clean pointerup/pointerleave pair, which permanently wedges the pause. Handle touch
  // directly instead: touchend and touchcancel together are guaranteed to follow every touchstart.
  pauseZone.addEventListener("touchstart", () => setPaused(true), { passive: true });
  pauseZone.addEventListener("touchend", () => setPaused(false), { passive: true });
  pauseZone.addEventListener("touchcancel", () => setPaused(false), { passive: true });
  pauseZone.addEventListener("focusin", () => setPaused(true));
  pauseZone.addEventListener("focusout", (ev) => { if (!pauseZone.contains(ev.relatedTarget)) setPaused(false); });
  if (recs.length) showQuote(0);
})();
