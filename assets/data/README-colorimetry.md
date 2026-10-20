# Colorimetry figure data

Retrieved 2026-10-13 from the links on the official CIE dataset pages:

- CIE 2019, Colour-matching functions of CIE 1931 standard colorimetric observer. DOI https://doi.org/10.25039/CIE.DS.xvudnb9b. Original 1 nm CSV retained unchanged. MD5 `17cca777db64b17170f06f67ce9d3ab7`.
- CIE 2006, LMS cone fundamentals for 2° field size in terms of energy. DOI https://doi.org/10.25039/CIE.DS.tijidesg. Original 5 nm CSV retained unchanged. MD5 `dba2e9d1f5e6667575aa069832159510`.

The accompanying official metadata JSON files retain source, validation and rights information. `colorimetry-observers.json` selects wavelengths divisible by 5 from each CSV, preserving numerical values; unavailable LMS entries become JSON null and are omitted from curves. XYZ is 360–830 nm, LMS 390–830 nm. Browser figures require no external data service.

The older `cie-1931-2deg-5nm.json` is retained for provenance but no longer drives the figures. It sampled only to 700 nm. The revised locus is computed directly from the XYZ functions.

Generate the static figure includes with `node scripts/build-colorimetry.mjs`; verify formulas and datasets with `node scripts/check-colorimetry.mjs`. Generated includes are checked in. Normal Jekyll builds do not need Node. Figure definitions and standard formulas live in `assets/js/colorimetry-models.mjs`.

Synthetic examples are identified individually: no camera sensitivity, LED fixture, film stock, measured MacAdam ellipse, or production tone mapper is being represented by invented data.

## Rights

The CIE source datasets, the 5 nm JSON adaptation, and figures derived from those data are provided under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Credit: International Commission on Illumination (CIE), with dataset titles and DOIs above. Changes: sampling, null-value serialization, numerical integration/coordinate conversion, and plotting as documented. Other site content is not relicensed by this notice.

## CIE experiment reconstructions — October 14

Figures 2.1 and 2.5 apply the inverse of the equal-energy-normalized CIE RGB-to-XYZ matrix to the existing CIE XYZ samples. The rounded matrix and primary-unit convention are documented under `#cie-rgb` in the mathematical appendix and in [Colour 0.4.6 source](https://colour.readthedocs.io/en/v0.4.6/_modules/colour/colorimetry/transformations.html#RGB_2_degree_cmfs_to_XYZ_2_degree_cmfs). These are reconstructed coordinates, not raw historical observer data. Figure 2.6 mixes the 450 and 650 nm XYZ samples at fixed total radiant power before normalizing to xy. The existing CIE CC BY-SA notice applies to these derived figures. Figure 2.7 uses an in-gamut synthetic sRGB stimulus and the ICC matrix; it does not use a spectral-to-display approximation.

## Signaling diagrams — October 20

`assets/js/signaling-models.mjs` holds qualitative photoreceptor and signaling-pathway states. The existing static generator and browser controller render them through the same figure component. Connected pathways use semantic HTML, so descriptions wrap and resize instead of shrinking inside an SVG. Figure 1.9 retains its number; S1/S2 belong to the companion Signal transduction article. It records lecture slide ranges and links to primary experiments. The supplied lecture PDFs remain private source material; no slide images are shipped with the site. cGMP dots and channel states are schematic, not concentration measurements or a kinetic simulation.

Plot legend keys now preserve each curve's color and dash pattern, including isolated M/S cone selections and zero-bend geometry. Coordinate and metadata comparisons do not imply sequential conversion steps.
