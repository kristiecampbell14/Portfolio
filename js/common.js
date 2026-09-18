/* Shared behavior for every page: menu, header, contact links, reveal-on-scroll. */
(function () {
  const S = window.SITE;

  // Menu
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (toggle && menu) {
    menu.hidden = false;
    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".sr-only").textContent = open ? "Close menu" : "Menu";
      if (open) setTimeout(() => menu.querySelector("a")?.focus({ preventScroll: true }), 300);
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
  }

  // Header gets a solid background once you've scrolled past the intro
  const header = document.querySelector("[data-header]");
  const intro = document.querySelector("[data-intro]");
  if (header) {
    const onScroll = () => {
      const threshold = intro ? intro.offsetHeight - window.innerHeight * 0.9 : 10;
      header.classList.toggle("is-solid", window.scrollY > threshold);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Contact links + year
  document.querySelectorAll("[data-email]").forEach((a) => (a.href = "mailto:" + S.email));
  document.querySelectorAll("[data-linkedin]").forEach((a) => (a.href = S.linkedin));
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // Reveal on scroll
  let pending = [], revealQueued = false;
  function checkReveals() {
    revealQueued = false;
    const limit = window.innerHeight * 0.9;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top < limit) { el.classList.add("in"); return false; }
      return true;
    });
  }
  const queueReveals = () => { if (!revealQueued) { revealQueued = true; requestAnimationFrame(checkReveals); } };
  window.addEventListener("scroll", queueReveals, { passive: true });
  window.addEventListener("resize", queueReveals);
  window.observeReveals = function (root) {
    pending.push(...(root || document).querySelectorAll(".reveal:not(.in)"));
    checkReveals();
  };
  window.observeReveals();

  window.escapeHTML = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Browser-mockup markup, shared by the carousel and project pages
  window.browserMock = function (p, imgSrc, eager) {
    const e = window.escapeHTML;
    const view = imgSrc
      ? `<img src="${e(imgSrc)}" alt="${e(p.title)} screenshot" ${eager ? "" : 'loading="lazy"'} />`
      : `<div class="placeholder" data-accent="${e(p.accent || "forest")}">
           <svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5" /></svg>
           <span>Cover coming soon</span>
         </div>`;
    return `<div class="browser">
      <div class="browser__bar"><span class="browser__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="browser__url">${e(p.url || "")}</span></div>
      <div class="browser__view">${view}</div>
    </div>`;
  };
})();
