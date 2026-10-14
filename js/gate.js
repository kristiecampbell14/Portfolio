/* Password gate for the Work section and project pages.
   NOTE: this is a client-side gate. It keeps casual visitors out, but anyone
   determined can read the page source. See README for stronger options. */

(function () {
  const KEY = "kc-work-unlocked";

  // Pure-JS SHA-256 fallback (crypto.subtle is unavailable on some file:// setups)
  function sha256Fallback(str) {
    const K = [], H = [];
    let n = 2, found = 0;
    const frac = (x) => ((x - Math.floor(x)) * 4294967296) | 0;
    while (found < 64) {
      let prime = true;
      for (let f = 2; f * f <= n; f++) if (n % f === 0) { prime = false; break; }
      if (prime) {
        if (found < 8) H[found] = frac(Math.pow(n, 1 / 2));
        K[found++] = frac(Math.pow(n, 1 / 3));
      }
      n++;
    }
    const bytes = Array.from(new TextEncoder().encode(str));
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 7; i >= 0; i--) bytes.push(i > 3 ? 0 : (bitLen >>> (i * 8)) & 0xff);
    const rotr = (v, s) => (v >>> s) | (v << (32 - s));
    for (let o = 0; o < bytes.length; o += 64) {
      const w = new Array(64);
      for (let i = 0; i < 16; i++)
        w[i] = (bytes[o + i * 4] << 24) | (bytes[o + i * 4 + 1] << 16) | (bytes[o + i * 4 + 2] << 8) | bytes[o + i * 4 + 3];
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map((v) => (v >>> 0).toString(16).padStart(8, "0")).join("");
  }

  window.sha256Hex = async function (str) {
    try {
      if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (e) { /* fall through */ }
    return sha256Fallback(str);
  };

  function store(fn) {
    try { return fn(); } catch (e) { return null; }
  }

  // Wires up any "show password" eyeball button(s) within root. Safe to call
  // more than once on the same DOM (e.g. after re-rendering the story gate).
  window.wirePasswordToggle = function (root) {
    (root || document).querySelectorAll("[data-pw-toggle]").forEach((btn) => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = "1";
      const input = btn.previousElementSibling;
      btn.addEventListener("click", () => {
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.setAttribute("aria-pressed", String(show));
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
        input.focus({ preventScroll: true });
      });
    });
  };

  window.Gate = {
    isUnlocked() {
      // Stored value is the hash that unlocked it, not a bare flag, so rotating
      // workPasswordHash invalidates every previously-unlocked visitor automatically
      // (their stored hash no longer matches the current one) with no manual step.
      const stored = store(() => localStorage.getItem(KEY));
      return (!!stored && stored === window.SITE.workPasswordHash) || window.__kcUnlocked === true;
    },
    async tryUnlock(password) {
      // case-folded before hashing, so the password works however it is typed
      const hash = await window.sha256Hex(password.trim().toLowerCase());
      if (hash === window.SITE.workPasswordHash) {
        window.__kcUnlocked = true;
        store(() => localStorage.setItem(KEY, hash));
        return true;
      }
      return false;
    },
    lock() {
      window.__kcUnlocked = false;
      store(() => localStorage.removeItem(KEY));
    }
  };

  /* A link can carry the password: ?k=<password> unlocks on arrival, so a
     portfolio link pasted into an application form never shows the gate. */

  function stripKey(params) {
    params.delete("k");
    const qs = params.toString();
    try {
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    } catch (e) { /* history API unavailable or blocked */ }
  }

  /* Storage is unavailable, so the URL has to carry the unlock instead: stamp
     the key onto same-origin links, including the cards main.js and story.js
     render after this runs. Attribute changes do not re-trigger a childList
     observer, so rewriting hrefs here cannot loop. */
  function carryKeyOnLinks(key) {
    const stamp = () => {
      document.querySelectorAll("a[href]").forEach((a) => {
        let url;
        try { url = new URL(a.getAttribute("href"), location.href); } catch (e) { return; }
        if (url.origin !== location.origin || url.searchParams.has("k")) return;
        url.searchParams.set("k", key);
        a.setAttribute("href", url.pathname + url.search + url.hash);
      });
    };
    let queued = false;
    const schedule = () => {
      if (queued) return;
      queued = true;
      Promise.resolve().then(() => { queued = false; stamp(); });
    };
    stamp();
    document.addEventListener("DOMContentLoaded", stamp);
    try {
      new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
    } catch (e) { /* no MutationObserver */ }
  }

  (function consumeUrlKey() {
    let params;
    try { params = new URLSearchParams(location.search); } catch (e) { return; }
    const key = params.get("k");
    if (!key) return;

    if (sha256Fallback(key.trim().toLowerCase()) !== window.SITE.workPasswordHash) {
      stripKey(params);
      return;
    }

    window.__kcUnlocked = true;

    /* Did the unlock actually persist? Managed browsers and strict privacy
       settings can block site storage, in which case localStorage keeps
       nothing and the next page would gate the visitor all over again. */
    const persisted = store(() => {
      localStorage.setItem(KEY, window.SITE.workPasswordHash);
      return localStorage.getItem(KEY) === window.SITE.workPasswordHash;
    });

    if (persisted) {
      /* Storage carries it from here, so take the password out of the address
         bar, out of anything copied onward, and out of session replay. */
      stripKey(params);
    } else {
      carryKeyOnLinks(key);
    }
  })();

  window.wirePasswordToggle(document);
})();
