---
title: "Regarding Colorimetry: comprehensive outline"
series: colorimetry
slug: comprehensive-outline
permalink: /notes/colorimetry/comprehensive-outline/
layout: article
kicker: Color science reference
description: Complete outline of the colorimetry series.
date: 2025-12-10
printable: true
updated: 2026-10-20
---

The series follows a signal from light to a displayed image, then tests whether the whole chain is reproducible. It is written for DITs, cinematographers, colorists, and readers interested in the physics and biology behind those tools.

## Reading order

1. [Light and vision]({{ '/notes/colorimetry/module-1/' | relative_url }}): what reaches the eye, and why does appearance change? Start with spectra, metamerism, the observer, and adaptation; then distinguish color matching from appearance modeling.
2. [Measuring color]({{ '/notes/colorimetry/module-2/' | relative_url }}): what do our coordinates measure? Follow CIE matching into XYZ/xyY and difference metrics, then distinguish film density from scan encoding.
3. [The image pipeline]({{ '/notes/colorimetry/module-3/' | relative_url }}): what do the pixels mean at each stage? Define reference domain, color model, encoding, rendering, tags, and operation order.
4. [ACES]({{ '/notes/colorimetry/module-4/' | relative_url }}): how do applications share an interpretation? Choose AP0/AP1 and cc/cct deliberately, distinguish gamut operations, and specify the handoff.
5. [Displays and viewing]({{ '/notes/colorimetry/module-5/' | relative_url }}): what light does the audience see? Connect PQ/HLG to metadata, calibration, surround, and playback-path diagnosis.
6. [Camera encoding]({{ '/notes/colorimetry/module-6/' | relative_url }}): which parts are measurement, encoding, and look? Apply the preceding concepts to LogC, RAW characterization, and rendering comparisons.
7. [Color transforms]({{ '/notes/colorimetry/module-7/' | relative_url }}): does a mapping work beyond one chart? Test exposure scaling, held-out data, LUT sampling, inversion, and a complete return trip.

The camera chapter is an application of the pipeline concepts, so it follows their explanation rather than introducing proprietary settings first. Readers configuring a production can use Chapters 4–6 together, then run the validation procedure in Chapter 7.

## Keep the questions separate

A colorimetric match, a pleasing rendering, and identical pixels across applications are three different achievements. Define which one a test measures. A primary triangle is not a sensor characterization; a log curve is not a look; a metadata tag is not a pixel conversion.

The [mathematical appendix]({{ '/notes/colorimetry/appendix-mathematics/' | relative_url }}) collects equations, domains, numerical reference values, and validation calculations. Sources sit beside the claims they support. Existing interactive figures illustrate the stated models; they are not calibrated measurements of the reader's display or implementations of proprietary rendering transforms.

Film chemistry is introduced only far enough to explain density and scanning. A full stock/process comparison belongs in a separate film study.
