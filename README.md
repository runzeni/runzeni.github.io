# runzeni.github.io

Personal portfolio for Runze Ni: photographs, cocktail notes, color studies, and research-facing writing.

## Local development

Ruby 3.3 is pinned in `.ruby-version`.

```sh
bundle install
bash scripts/build-site.sh serve
```

Build the production artifact with:

```sh
bash scripts/build-site.sh build
```

## Content map

- `_data/profile.yml` is the single source for the home-page bio, links, publications, and presentations.
- `_data/portfolio.yml` is the curated edit for `/fotos/`.
- `_photobook/` holds minimal roll metadata. `_data/photos.yml` is generated locally and is never edited or committed.
- `_data/cocktails.json` is the single source for the server-rendered, searchable Protocols collection.
- `_notes/` holds Markdown-first articles; `_modules/` holds longer Notes series. The two Colorimetry widgets are intentionally small, source-defined studies rather than image simulations.

## Editing Protocols

Edit recipes only in `_data/cocktails.json`. Jekyll renders every ingredient and
quantity through `_includes/cocktail-card.html`; `assets/js/cocktails.js` filters
those existing cards in place. There is no second public JSON endpoint or
client-side card template to keep synchronized.

## Display preferences

Theme, B&W, and Blur/Solid share the tokens in `_sass/_variables.scss` and the
preference controller in `assets/js/main.js`. Gallery controls delegate to that
same controller. Keep new surfaces on the shared color and glass variables
instead of adding page-specific theme rules.

## Writing an article

Copy `_drafts/article-template.md` to `_notes/a-short-filename.md`, replace the
front matter, and write the body as ordinary Markdown. The shared `article`
layout supplies the title, date, breadcrumb, typography, responsive tables,
figure captions, code-copy controls, and optional MathJax support.

The only required field is `title`; `description`, `date`, `tags`, and
`math: true` are optional. Published articles appear automatically on `/notes/`.
Legacy Notes URLs under `/misc/` are generated from `_data/redirects.yml` so
existing bookmarks continue to work after a section move.

## Photos

Original scans stay in numeric `assets/img/<year>/` folders or
`assets/img/portfolio/`; one exclusion rule keeps every year out of the public
artifact. The build validates the authored metadata, derives dimensions and
titles, and produces ignored 640, 1200, and 1920 px WebPs. GitHub Actions
regenerates the same files before deployment. Conversion automatically uses up
to 18 workers; set `PHOTO_JOBS` only when a manual limit is useful.

### Add to Selected works

1. Prefer an existing original in `assets/img/<year>/<roll>/`; do not copy it
   into `portfolio` if it is already part of an archived roll. Put standalone
   selected-work originals in `assets/img/portfolio/`.
2. Add `src`, unique `sequence`, editorial `row`, `placement`, and literal
   `alt` text to `_data/portfolio.yml`. Dimensions are generated. Placements
   are `lead`, `full`, `feature`, `left`, `right`, `inset-left`,
   `inset-right`, and `ending`.
3. Run `bash scripts/build-site.sh serve`, then review `/fotos/` and its
   lightbox. Commit only the source and `_data/portfolio.yml`.

### Add a full roll to the archive

1. Choose one lowercase slug, for example `2026-kodak-gold-200-tampa`. Create
   `assets/img/2026/2026-kodak-gold-200-tampa/` and place JPG, JPEG, or PNG
   files inside. Alphabetical filename order is display order, so prefer
   `frame-001.jpg`, `frame-002.jpg`, and so on.
2. Create `_photobook/2026-kodak-gold-200-tampa.md` with:

```yaml
---
year: 2026
camera: Olympus XA
film: Kodak Gold 200
location: Tampa
---
```

The metadata filename and image folder normally share the slug, so no path or
URL field is needed. Omit `film` for digital work; the site displays `Digital`.
Legacy folders may use an optional `folder` override.

3. Run `bash scripts/build-site.sh serve`. The build creates the title, URL,
   dimensions, responsive sources, and archive manifest automatically.
4. Review the archive card, roll page, frame order, responsive layout, and
   lightbox. Commit only the source folder and `_photobook` file.

For new exports, use sRGB JPEGs at 1920 px on the long edge and approximately
quality 88–90. Do not upscale or repeatedly recompress an existing JPEG.

Never commit `_data/photos.yml`, `assets/img/derived/`, or `_site/`.

### Cine stills plan

Keep Cine within Fotos but separate from film rolls. When the first finished
set is ready, store originals under `assets/img/cine/<project-slug>/`, describe
the ordered stills in `_data/cine.yml`, and render a project-level sequence at
`/fotos/#cine` with the same lightbox and derivative pipeline. Use one short
project note rather than captions under every frame. Add that structure only
when a real set exists; until then the current restrained placeholder remains.

## Deployment

Pushing `main` runs `.github/workflows/deploy.yml`, which builds Jekyll and deploys the artifact with the official GitHub Pages Actions flow. In the repository’s **Settings → Pages**, choose **GitHub Actions** as the publishing source once if it is not already selected.
