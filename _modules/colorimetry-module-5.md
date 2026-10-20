---
title: "Module 5: Displays and viewing"
short_title: "Displays and viewing"
series: colorimetry
module_number: 5
slug: module-5
permalink: /notes/colorimetry/module-5/
date: 2025-12-10
description: "HDR signals, viewing conditions, and metadata."
colorimetry_interactive: true
updated: 2026-10-20
---

A correct file is only one part of a viewing chain. The player, operating system, display mode, and room all affect the result.

## The signal and its interpretation
{: #section-5-1}

PQ associates signal values with absolute display luminance. Its 10,000 cd/m² upper bound is an encoding limit, not a promise that a particular monitor can reach it. HLG's OETF describes relative scene light; display peak and system gamma enter the scene-to-display relationship.

{% include colorimetry/fig-5-1.html %}

The two plot modes deliberately use different input units. These are SDR-rendered graphs of HDR equations, not HDR test patterns. The current recommendation is [ITU-R BT.2100-3 (2025)](https://www.itu.int/rec/R-REC-BT.2100/en).

For a numerical check, PQ 100 cd/m² is approximately 0.50808 and 1000 cd/m² is 0.75183. HLG signal 0.5 decodes to relative scene light 1/12, **not** half the display's peak luminance. For an achromatic signal on an ideal zero-black, 1000 cd/m² HLG reference display with system gamma 1.2, it corresponds to about 50.7 cd/m². These numbers follow BT.2100's equations; a real device may apply additional mapping. The derivation is in the [appendix]({{ '/notes/colorimetry/appendix-mathematics/' | relative_url }}#reference-values).

HDR10, HDR10+, and Dolby Vision are delivery ecosystems, not alternative RGB primaries. HDR10 uses PQ with static metadata; HDR10+ adds dynamic metadata. Dolby Vision supplies a versioned content-mapping and metadata workflow. Metadata can guide adaptation to a display, but cannot make an incapable display emit the mastering luminance. [HDR10+ system white paper](https://hdr10plus.org/wp-content/uploads/2023/11/HDR10_WhitePaper.pdf), [Dolby metadata levels](https://professionalsupport.dolby.com/s/article/Dolby-Vision-Metadata-Levels?language=en_US)

An HDRI used for lighting a 3D scene is a different object from an HDR delivery signal. “HDR” alone says neither how to decode its pixels nor whether a viewing transform has already been baked in.

## The viewing conditions
{: #section-5-2}

The same patch can look different against a different surround. This local contrast demonstration is not a calibrated measurement of the Bartleson–Breneman effect, nor does it establish a correction gamma for your room.

{% include colorimetry/fig-5-2.html %}

For critical comparison, keep the viewing conditions stable and use the target standard's reference conditions. A blanket “bright room = gamma 2.2, dark room = gamma 2.4” rule is too coarse. BT.1886's reference EOTF also accounts for display black and white levels. [ITU-R BT.1886](https://www.itu.int/rec/R-REC-BT.1886/en).

<span id="section-5-3"></span>

Color tags describe how encoded values should be interpreted. In a primaries–transfer–matrix triplet, **1–1–1** identifies BT.709 values in all three positions. **1–2–1 leaves the transfer characteristic unspecified**; it does not explicitly mean gamma 2.4. Range information is separate. [ITU-T H.273 (2024)](https://www.itu.int/rec/T-REC-H.273-202407-I/en).

{% include colorimetry/fig-5-3.html %}

Changing tags without changing pixels can change their interpretation. It is not a universal fix for a QuickTime mismatch. Compare the exported file in the intended playback path, inspect tags and range, and verify that rendering and display conversion have not been applied twice.

Apple EDR headroom is the ratio between the currently available maximum luminance and SDR white, and can change with display conditions. Supported Reference Modes provide another controlled path. A normal browser window should not be assumed to be a calibrated grading monitor. [Apple EDR headroom](https://developer.apple.com/documentation/uikit/uiscreen/currentedrheadroom), [Reference Mode](https://developer.apple.com/videos/play/wwdc2022/10113/).

## Check the viewing chain
{: #viewing-check}

Calibration adjusts a display toward a target state. Profiling characterizes its response so color-managed software can account for it. A profile is not proof that the target was reached, and an application must actually use the appropriate conversion. [ICC display calibration](https://www.color.org/displaycalibration/)

When two viewers disagree, use a controlled comparison:

1. Keep one exported file, display, and viewing condition fixed. Disable unintended automatic display changes for the comparison.
2. Inspect primaries, transfer, matrix, and range separately. Compare decoded pixel values before blaming the monitor.
3. Identify each application's viewing transform and display conversion. Check for a missing or duplicated conversion, rather than changing the grade to counter an unexplained mismatch.
4. Use neutral ramps and saturated patches to separate tonal, range, and chromatic errors. Confirm the intended output with measurements where critical accuracy is required.
5. Review the target playback path. A reference viewer, desktop player, and distribution encode can legitimately take different paths; record which one the deliverable is meant to satisfy.

This sequence is a diagnostic method, not a universal “QuickTime gamma fix.” Apple's EDR is an operating-system rendering capability, while XDR is display branding; neither alone specifies the mastering target. Apple documents headroom relative to SDR white and tone mapping when image and display headroom differ. [Apple's HDR explanation](https://developer.apple.com/videos/play/wwdc2024/10177/)

For SDR from an HDR grade, select an explicit rendering or trim path, inspect highlight detail and color, and export matching SDR tags. Merely retagging PQ pixels as BT.709 leaves the pixel conversion undone.
