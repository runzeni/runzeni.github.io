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
- `_photobook/` holds roll metadata; `_data/photobooks.yml` is the generated, checked manifest for each roll's published frames.
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

Original scans stay in numeric `assets/img/<year>/` folders or `assets/img/portfolio/`; they are excluded from the published artifact. WebP renditions are generated locally into ignored `assets/img/derived` and are generated again by the deploy workflow before Jekyll builds the published artifact. `bash scripts/build-site.sh` prepares both the frame manifest and WebPs before Jekyll starts.

### Add to Selected works

1. Prefer an existing original in `assets/img/<year>/<roll>/`; do not copy it
   into `portfolio` if it is already part of an archived roll. Put standalone
   selected-work originals in `assets/img/portfolio/`.
2. Add one record to `_data/portfolio.yml`. Supply the source path, unique
   `sequence`, editorial `row` and `placement`, pixel `width` and `height`, and
   useful `alt` text. Placements are `lead`, `full`, `feature`, `left`, `right`,
   `inset-left`, `inset-right`, and `ending`.
3. Run `bash scripts/build-site.sh serve`. It renders only new or changed WebPs;
   the ignored `assets/img/derived/` files are never committed.

Use ImageMagick when dimensions are not known:

```sh
magick identify -format '%w %h\n' "assets/img/path/to/photo.jpg"
```

### Add a full roll to the archive

1. Create `assets/img/<year>/<roll-folder>/` and place the roll's JPG, JPEG, or
   PNG files there in the filename order in which they should appear.
2. Copy an existing `_photobook/*.md` file and update `title`, `film`, `year`,
   `date`, `image_dir`, and the unique URL `slug`. `camera` is optional. Archive
   covers are sampled at build time, so no fixed cover is required.
3. Build or serve the site. The manifest builder records every frame and its
   dimensions; the derivative builder automatically recognizes future numeric
   year folders.
4. Review and commit the originals, the new `_photobook` file, and the updated
   `_data/photobooks.yml`. Do not commit `_site/` or `assets/img/derived/`.

The explicit refresh commands are:

```sh
ruby scripts/build-photo-manifest.rb
bash scripts/build-site.sh build
```

### Cine stills plan

Keep Cine within Fotos but separate from film rolls. When the first finished
set is ready, store originals under `assets/img/cine/<project-slug>/`, describe
the ordered stills in `_data/cine.yml`, and render a project-level sequence at
`/fotos/#cine` with the same lightbox and derivative pipeline. Use one short
project note rather than captions under every frame. Add that structure only
when a real set exists; until then the current restrained placeholder remains.

## Deployment

Pushing `main` runs `.github/workflows/deploy.yml`, which builds Jekyll and deploys the artifact with the official GitHub Pages Actions flow. In the repository’s **Settings → Pages**, choose **GitHub Actions** as the publishing source once if it is not already selected.
