# Kristie Campbell: Portfolio

Static site, with no build step. Open `index.html` in a browser to preview, or deploy the whole folder to Netlify, Vercel, GitHub Pages, etc.

## Where things live

| What | File |
| --- | --- |
| **All editable content** (projects, resume, recommendations, email, LinkedIn, password) | `js/content.js` |
| Homepage markup (hero headline, About copy) | `index.html` |
| Case study template | `project.html` + `js/project.js` |
| Styles / brand tokens | `css/styles.css` (colors at the top) |
| Photo | `assets/img/me.png` |
| Project images | `assets/work/` |

Contact lives in the `?` node at the end of the resume timeline (`contact` in `js/content.js`), not in the footer.

## Adding a project

Copy one of the objects in `projects` in `js/content.js` and give it a unique `slug`. It automatically:
- appears as a card in the Work carousel
- gets a detail page at `project.html?id=<slug>`
- joins the "Next project" loop

Useful fields: `cover` (card + page image, 16:10 works best), `hero` (optional different image for the detail page), `meta` (any key/value pairs), `sections` (heading, body, optional `image`/`alt`/`caption`), `outcomes` (big stats). Separate paragraphs in a `body` with a blank line (`\n\n`).

## Changing the password

Default password: `structuredplay`. To change it, open the site, open the browser console, run
`await sha256Hex("new password")`, and paste the result into `workPasswordHash`.

**Important:** this is a client-side gate. It keeps casual visitors out, but anyone who reads the source can get to the pages and images. For NDA work that needs real protection, use your host's password protection instead (Netlify / Vercel password protection, or Cloudflare Access) and keep this gate as the friendly UI.

## Recommended before launch
- Compress `me.png` (currently ~1.7 MB). Exporting to WebP at ~1200px will cut it to ~150 KB.
- Replace every `TODO` in `js/content.js` and the About copy in `index.html`.
