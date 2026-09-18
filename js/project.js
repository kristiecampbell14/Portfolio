/* Renders a case study from SITE.projects using ?id=<slug>. */
(function () {
  const S = window.SITE;
  const e = window.escapeHTML;
  const root = document.querySelector("[data-project]");
  const id = new URLSearchParams(location.search).get("id");
  const index = S.projects.findIndex((p) => p.slug === id);
  const project = S.projects[index];

  // body copy supports blank-line-separated paragraphs
  const paras = (text) => String(text || "").split(/\n\s*\n/).map((t) => `<p>${e(t.trim())}</p>`).join("");

  function renderGate() {
    root.innerHTML = `
      <section class="project-gate">
        <form class="gate__card" data-gate-form>
          <svg class="gate__icon" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5" /><rect x="36" y="48" width="28" height="22" rx="3" /><path d="M42 48v-7a8 8 0 0 1 16 0v7" /></svg>
          <h1 style="font-size:24px;margin-bottom:10px">This case study is password protected</h1>
          <p>Enter the password to continue.</p>
          <div class="gate__row">
            <label class="sr-only" for="pw">Password</label>
            <input id="pw" type="password" autocomplete="current-password" placeholder="Password" required autofocus />
            <button class="btn btn--primary" type="submit">Unlock</button>
          </div>
          <p class="gate__error" role="alert"></p>
        </form>
      </section>`;
    const form = root.querySelector("form");
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const input = form.querySelector("input");
      if (await window.Gate.tryUnlock(input.value)) {
        render();
      } else {
        form.querySelector(".gate__error").textContent = "That password didn't work. Try again?";
        form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
        input.select();
      }
    });
  }

  function renderNotFound() {
    root.innerHTML = `
      <section class="project-gate"><div class="not-found">
        <h1>Project not found</h1>
        <p>That case study doesn't exist, or its link has changed.</p>
        <a class="btn btn--primary" href="index.html#work">Back to work</a>
      </div></section>`;
  }

  function render() {
    const p = project;
    document.title = `${p.title} · Kristie Campbell`;
    const next = S.projects[(index + 1) % S.projects.length];
    const meta = Object.entries(p.meta || {});
    const sections = p.sections || [];
    const outcomes = p.outcomes || [];

    root.innerHTML = `
      <section class="project-hero container">
        <p class="eyebrow">${e(p.role)} <span>×</span> ${e(p.year)}</p>
        <h1 class="project-title">${e(p.title)}</h1>
        ${p.tagline ? `<p class="project-tagline">${e(p.tagline)}</p>` : ""}
        <div class="project-cover reveal">${window.browserMock(p, p.hero || p.cover, true)}</div>
        ${meta.length ? `<dl class="project-meta">${meta.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join("")}</dl>` : ""}
      </section>

      ${p.overview ? `
      <section class="container project-overview">
        <h2 class="section-label">Overview</h2>
        <div class="reveal">${paras(p.overview)}</div>
      </section>` : ""}

      <div class="container">
        ${sections.map((s, i) => `
          <section class="project-section">
            <h2><span class="num">${String(i + 1).padStart(2, "0")}</span>${e(s.heading)}</h2>
            <div class="body reveal">
              ${paras(s.body)}
              ${s.image ? `<figure><img src="${e(s.image)}" alt="${e(s.alt || s.heading)}" loading="lazy" />${s.caption ? `<figcaption>${e(s.caption)}</figcaption>` : ""}</figure>` : ""}
            </div>
          </section>`).join("")}
      </div>

      ${outcomes.length ? `
      <section class="project-outcomes">
        <div class="container">
          <h2 class="section-label">Outcomes</h2>
          <div class="outcomes">
            ${outcomes.map((o) => `<div class="outcome reveal"><strong>${e(o.value)}</strong><span>${e(o.label)}</span></div>`).join("")}
          </div>
        </div>
      </section>` : ""}

      ${S.projects.length > 1 ? `
      <a class="next-project container" href="project.html?id=${encodeURIComponent(next.slug)}">
        <p class="eyebrow">Next project</p>
        <h2>${e(next.title)} <span aria-hidden="true">→</span></h2>
      </a>` : ""}
    `;
    window.observeReveals(root);
    window.scrollTo(0, 0);
  }

  if (!project) renderNotFound();
  else if (!window.Gate.isUnlocked()) renderGate();
  else render();
})();
