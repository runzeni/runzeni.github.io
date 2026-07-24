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
- `assets/img/portfolio/` is `/fotos/`: every numbered image is included
  automatically in ascending numeric order.
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

The Lightroom JPG, JPEG, or PNG exports under numeric `assets/img/<year>/`
folders and `assets/img/portfolio/` are published directly. The build validates
names and roll metadata, records dimensions, and derives titles; it does not
recompress or duplicate the photographs.

### Add to Selected works

1. Put the JPG, JPEG, or PNG in `assets/img/portfolio/`. Name it
   `portfolio-NN.jpg`; the current set runs from `portfolio-01.jpg` through
   `portfolio-42.jpg`.
2. `portfolio-01.jpg` appears first. Add the next photograph as
   `portfolio-43.jpg` to append it; deleting a file removes it from Selected
   works.
3. Run `bash scripts/build-site.sh serve`, then review `/fotos/` and its
   lightbox. Commit only the source image.

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
   dimensions, and archive manifest automatically.
4. Review the archive card, roll page, frame order, responsive layout, and
   lightbox. Commit only the source folder and `_photobook` file.

For new exports, use an sRGB JPEG at 1920 px on the long edge and the lowest
Lightroom quality that still looks right to you. The export is the exact file
visitors receive, so export once from the original and do not recompress it.

Never commit `_data/photos.yml` or `_site/`.

### Cine stills plan

Keep Cine within Fotos but separate from film rolls. When the first finished
set is ready, store originals under `assets/img/cine/<project-slug>/`, describe
the ordered stills in `_data/cine.yml`, and render a project-level sequence at
`/fotos/#cine` with the same direct-image lightbox. Use one short
project note rather than captions under every frame. Add that structure only
when a real set exists; until then the current restrained placeholder remains.

## Deployment

Pushing `main` runs `.github/workflows/deploy.yml`, which builds Jekyll and deploys the artifact with the official GitHub Pages Actions flow. In the repository’s **Settings → Pages**, choose **GitHub Actions** as the publishing source once if it is not already selected.
