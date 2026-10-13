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
