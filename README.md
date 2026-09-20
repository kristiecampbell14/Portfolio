# Kristie Campbell: Portfolio

Static site, with no build step. Open `index.html` in a browser to preview, or deploy the whole folder to Netlify, Vercel, GitHub Pages, etc.

## Where things live

| What | File |
| --- | --- |
| **All editable content** (stories, resume, recommendations, email, LinkedIn, password) | `js/content.js` |
| Homepage markup (hero headline, About copy) | `index.html` |
| Product story template | `story.html` + `js/story.js` |
| Styles / brand tokens | `css/styles.css` (colors at the top) |
| Photo | `assets/img/me.png` |
| Story artifacts | `assets/stories/<slug>/` |
| Source artifacts (not served) | `product-stories/` |

Contact appears twice, both rendered from `contact` in `js/content.js`: the Contact section above the footer (where the nav's "Contact" link goes) and the `?` node at the end of the resume timeline.

## Product stories

A story is an entry in `stories` in `js/content.js`. It automatically:
- appears as a card in the Work carousel
- gets a page at `story.html?id=<slug>`
- links onward via its `next` (a story `slug` plus a one-line `bridge`)

Story-level fields: `slug`, `title`, `eyebrow`, `headline`, `intro`, `facts` (label + value, where value may be an array for multiple lines), `cover` and `role` / `year` / `tagline` for the carousel card.

### Blocks

The page itself is `blocks: []`, rendered in order by `js/story.js`. Each block picks its layout with `type`:

| `type` | What it renders | Main fields |
| --- | --- | --- |
| `figure` | One artifact + caption | `width: full \| wide \| narrow` |
| `split` | Copy beside an artifact | `ratio: 40-60 \| 50-50 \| 60-40`, `flip`, `heading`, `subhead` |
| `statement` | A large pull statement + supporting copy | `quote`, `body` |
| `timeline` | Horizontal evolution strip | `nodes: []` |
| `steps` | A progression (observed → tested → built → measured) | `items: [{label, body}]` |
| `metrics` | A strip of numbers | `items: [{value, label}]`, `note` |
| `annotated` | One artifact + short text callouts | `callouts: []`, `kicker`, `align: center`, `tall` |
| `gallery` | 2–3 small artifacts side by side | `cols: 2 \| 3`, `items: []` |
| `cards` | Text cards for decisions that weren't new screens | `items: [{title, body}]` |
| `impact` | Full-width forest band, huge numbers | `primary`, `secondary: []`, `body` |
| `closing` | Narrow reading column ending on one large line | `body`, `end` |
| `prose` | A short paragraph to set up what follows | `align: center` |

Notes:
- Separate paragraphs inside any `body` with a blank line (`\n\n`).
- Image blocks take `image`, `alt`, `caption`, and `w` / `h` in the image's real pixel size. The `w` caps display width so a screenshot never upscales past ~1.6× and reserves space while it loads.
- `tall: true` clips a very tall screenshot (a dashboard) to a readable height with a fade and an "Open full screenshot" link.
- If the first block is a full-width `figure`, it is treated as the hero image and loads eagerly.

## Changing the password

Default password: `structuredplay`. To change it, open the site, open the browser console, run
`await sha256Hex("new password")`, and paste the result into `workPasswordHash`.

**Important:** this is a client-side gate. It keeps casual visitors out, but anyone who reads the source can get to the pages and images. For NDA work that needs real protection, use your host's password protection instead (Netlify / Vercel password protection, or Cloudflare Access) and keep this gate as the friendly UI.

## Recommended before launch
- Compress `me.png` (currently ~1.7 MB). Exporting to WebP at ~1200px will cut it to ~150 KB.
- Add the Job Explorer FullStory dashboard screenshot as
  `assets/stories/job-explorer/fullstory-dashboard.jpg` and point the empty `image`
  in that story's continuous-discovery block at it (with its `w` / `h`).
- Exclude `product-stories/` from your deploy, or move it out of the repo. It holds the
  source `.docx` / `.pdf` / `.mp4` originals and is not needed by the site.
