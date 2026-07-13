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
- `cocktails.json` powers Protocol.
- `_modules/` holds Notes & playground series. The two Colorimetry widgets are intentionally small, source-defined studies rather than image simulations.

## Photos

Original scans stay in `assets/img/2022`, `2023`, `2024`, and `portfolio`; they are excluded from the published artifact. WebP renditions are generated locally into ignored `assets/img/derived` and are generated again by the deploy workflow before Jekyll builds the published artifact. `bash scripts/build-site.sh` prepares both the frame manifest and WebPs before Jekyll starts.

After adding or replacing original scans, refresh the manifest, review and commit `_data/photobooks.yml`, then build:

```sh
ruby scripts/build-photo-manifest.rb
bash scripts/build-site.sh build
```

## Deployment

Pushing `main` runs `.github/workflows/deploy.yml`, which builds Jekyll and deploys the artifact with the official GitHub Pages Actions flow. In the repository’s **Settings → Pages**, choose **GitHub Actions** as the publishing source once if it is not already selected.
