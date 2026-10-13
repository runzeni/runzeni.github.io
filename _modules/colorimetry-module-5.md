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
updated: 2026-10-13
---

A correct file is only one part of a viewing chain. The player, operating system, display mode, and room all affect the result.

## 5.1 PQ and HLG
{: #section-5-1}

PQ associates signal values with absolute display luminance. Its 10,000 cd/m² upper bound is an encoding limit, not a promise that a particular monitor can reach it. HLG's OETF describes relative scene light; display peak and system gamma enter the scene-to-display relationship.

{% include colorimetry/fig-5-1.html %}

The two plot modes deliberately use different input units. These are SDR-rendered graphs of HDR equations, not HDR test patterns. The current recommendation is [ITU-R BT.2100-3 (2025)](https://www.itu.int/rec/R-REC-BT.2100/en).

## 5.2 Surround and adaptation
{: #section-5-2}

The same patch can look different against a different surround. This local contrast demonstration is not a calibrated measurement of the Bartleson–Breneman effect, nor does it establish a correction gamma for your room.

{% include colorimetry/fig-5-2.html %}

For critical comparison, keep the viewing conditions stable and use the target standard's reference conditions. A blanket “bright room = gamma 2.2, dark room = gamma 2.4” rule is too coarse. BT.1886's reference EOTF also accounts for display black and white levels. [ITU-R BT.1886](https://www.itu.int/rec/R-REC-BT.1886/en).

## 5.3 Metadata and the operating system
{: #section-5-3}

Color tags describe how encoded values should be interpreted. In a primaries–transfer–matrix triplet, **1–1–1** identifies BT.709 values in all three positions. **1–2–1 leaves the transfer characteristic unspecified**; it does not explicitly mean gamma 2.4. Range information is separate. [ITU-T H.273, table 3](https://www.itu.int/rec/dologin_pub.asp?id=T-REC-H.273-202107-S%21%21PDF-E&lang=e&type=items).

{% include colorimetry/fig-5-3.html %}

Changing tags without changing pixels can change their interpretation. It is not a universal fix for a QuickTime mismatch. Compare the exported file in the intended playback path, inspect tags and range, and verify that rendering and display conversion have not been applied twice.

Apple EDR headroom is the ratio between the currently available maximum luminance and SDR white, and can change with display conditions. Supported Reference Modes provide another controlled path. A normal browser window should not be assumed to be a calibrated grading monitor. [Apple EDR headroom](https://developer.apple.com/documentation/uikit/uiscreen/currentedrheadroom), [Reference Mode](https://developer.apple.com/videos/play/wwdc2022/10113/).
