---
title: Colorimetry interactive figures
description: Runtime and data-source decisions for the colorimetry teaching figures.
published: false
---

# Colorimetry interactive figures

Status: first evidence-grounded interactive revision implemented in Module 4.

## Decision

Keep the published figures as native SVG and plain JavaScript. Use authoritative datasets for geometry and a scientific colour package offline for calculation and verification.

- Runtime: the existing `assets/js/colorimetry.js`, with shared chart-frame and interaction helpers.
- Authoritative geometry: CIE open datasets stored as small, local, human-readable JSON subsets.
- Authoring and verification: Python `colour-science` when conversions, colour matching functions, chromatic adaptation, appearance models, or spectral integration become necessary.
- Escalation path: add only the required D3 modules if later figures need reusable scales, axes, brushing, zoom, or drag behavior.

Plotly.js is not the default because its scientific breadth and built-in toolbar are disproportionate to these compact teaching studies. Observable Plot and Vega-Lite are strong for conventional declarative charts, but the chromaticity diagram still needs specialist source data and custom explanatory behavior.

## Figure contract

Every interactive figure should have:

1. A named scientific question, not interaction for its own sake.
2. A visible source and explicit model boundary.
3. Keyboard-operable controls and a plain-language live readout.
4. A useful no-JavaScript fallback in the surrounding article.
5. Local assets only, so GitHub Pages remains deterministic and offline-friendly after load.

## Module 4 implementation

The primary-coordinate explorer now includes the CIE 1931 2° spectral locus from CIE dataset DOI `10.25039/CIE.DS.mifmy4x4`, sampled at 5 nm from 360–700 nm. A wavelength range input reveals the exact `x, y` coordinate while gamut toggles preserve the original comparison.

The readout explicitly warns that triangle area in `xy` is not perceptual gamut volume. This prevents the attractive but incorrect inference that a larger triangle is proportionally “more colour.”

## Next useful studies

- Module 3: link one scene-linear input across sRGB, power-law, PQ, and LogC encodings with a shared crosshair and numeric table.
- Module 4: show chromatic adaptation between D65 and D60 as a matrix operation, with values rather than simulated appearance.
- Gamut compression: plot a neutral-axis distance before and after compression; avoid a fake photographic simulation unless a real transform and test image are provided.
