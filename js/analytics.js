/* Microsoft Clarity: visit counts, heatmaps, and session replays.
   Loaded by every page. Skipped on local previews so your own passes
   through the site don't show up as traffic. */

(function () {
  const PROJECT_ID = "yo0p6mqb0o";

  const host = location.hostname;
  const isLocal =
    location.protocol === "file:" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]" ||
    host.endsWith(".local");
  if (isLocal) return;

  // Clarity's own snippet, verbatim apart from formatting and the id above
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", PROJECT_ID);
})();
