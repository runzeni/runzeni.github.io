---
title: "Module 4: ACES"
short_title: "ACES"
series: colorimetry
module_number: 4
slug: module-4
permalink: /notes/colorimetry/module-4/
date: 2025-12-10
description: "Encodings, rendering, and reproducible workflows."
math: false
colorimetry_interactive: true
updated: 2026-10-20
---

ACES provides defined encodings and transforms for moving images across capture, post-production, and output. Its value depends on using the right transforms and recording their versions.

## Choose the coordinates
{: #section-4-1}

| Encoding | Primaries | Transfer | Typical role |
|---|---|---|---|
| ACES2065-1 | AP0 | Linear | Interchange and archival |
| ACEScg | AP1 | Linear | Rendering and compositing |
| ACEScc | AP1 | Logarithmic, with specified low-end handling | Grading |
| ACEScct | AP1 | Linear toe plus logarithmic segment | Grading |

AP0 is a broad coordinate system, not a display gamut. AP1 is smaller and useful for computation, but its primaries are not all physically realizable either. Enlarging a container cannot recover information absent from the capture. [ACEScg specification](https://docs.acescentral.com/encodings/acescg/).

{% include colorimetry/fig-4-1.html %}

ACEScc and ACEScct are not interchangeable labels for the same values. Above linear AP1 = 0.0078125 their encodings coincide; below that point ACEScct uses a linear toe. A lift adjustment or look developed in one can therefore behave differently in the other's shadows. Both place linear 0.18 near 0.413588, but that shared middle-gray value does not make the encodings identical. [ACEScct specification](https://docs.acescentral.com/encodings/acescct/)

An input transform interprets a particular camera encoding. Decoding a log curve and changing RGB coordinates are separate steps. A change of white point may also require chromatic adaptation. Do not apply a primary-conversion matrix directly to log-encoded values.

## Render and preserve the intent
{: #section-4-2}

A negative RGB component can represent a valid color outside the positive-primary triangle of the working space. Clamping it to zero discards information and may shift hue. The appropriate handling depends on the stage of the pipeline. Distinguish a valid tristimulus outside AP1 from a camera estimate that lies outside the physical-color region. Noise, spectral mismatch, and subsequent operations can produce the latter. A broad AP0 container cannot make every arbitrary camera RGB triplet physically meaningful. The [ACEScg specification](https://docs.acescentral.com/encodings/acescg/) explicitly permits negative values; their presence alone is not proof of corrupted data.

{% include colorimetry/fig-4-2.html %}

ACES 1.3 Reference Gamut Compression addresses problematic scene-referred values. It is distinct from fitting the rendered image into an output display gamut. ACES 2 output rendering uses a JMh appearance representation derived from a simplified Hellwig 2022 model, with coordinated tone, chroma, and gamut stages. This differs materially from the ACES 1 rendering architecture. [ACES output transforms](https://docs.acescentral.com/system-components/output-transforms/).

Reference Gamut Compression is normally applied after the input transform, before grading, and tracked as part of the scene-referred pipeline. The ACES guide recommends retaining it in VFX plates rather than routinely undoing it: newly composited elements may not have passed through the forward compression. It is neither a display calibration nor a promise to repair sensor clipping. Keep the ACES 1.3 RGC decision separate from the chosen ACES 2 output rendering. [RGC user guide](https://docs.acescentral.com/rgc/guides/rgc-user/)

The simple compression plot above teaches the difference between clipping and a smooth mapping. It is not an implementation of either ACES transform.

<span id="section-4-3"></span>

{% include colorimetry/fig-4-3.html %}

Record the input interpretation, working encoding, look, output transform, and configuration version. In Blender or another OCIO application, select a compatible configuration and assign each asset's input space deliberately. A scene-linear EXR is not automatically ACEScg; an EXR exported through a display view is a different deliverable.

An ACES Metadata File can carry transform identifiers and workflow information. It does not guarantee identical output if an application lacks those transforms or interprets the file differently. [AMF specification](https://docs.acescentral.com/amf/specification/).

A LUT can contain a technical conversion, a creative look, or both. Its input and output domains must be documented. Reusing a scene-referred grade can help with SDR and HDR versions, but each output still needs review and may need trims.

## A reproducible Blender-to-grade handoff
{: #practical-handoff}

Blender 5.0 includes an ACEScg working space, an ACES 2.0 view, and ACEScg/ACES2065-1 OpenEXR output. An external OCIO configuration is optional when the built-in support covers the project; use a shared external configuration when additional transforms or exact facility agreement require it. This is version-specific guidance, not a description of every Blender release. [Blender 5.0 release documentation](https://www.blender.org/download/releases/5-0/)

1. **Agree on the interpretation first.** Record application and OCIO configuration versions, camera input transform, working space, look domain, output transform, peak luminance, and display calibration target.
2. **Choose the working space before building the scene.** Use ACEScg for this example. Identify color textures by their actual source encoding; mark normals, roughness, masks, and similar numerical maps as non-color data. An HDR environment image also needs known primaries and exposure interpretation.
3. **Separate the view from the render.** Preview through the agreed ACES output transform. Export a scene-linear EXR in the explicitly agreed encoding without baking that display view. An ACEScg EXR and an ACES2065-1 EXR are different deliveries; the filename extension proves neither.
4. **Interpret the result once in the receiving application.** Assign ACEScg to this example's ACEScg render. Do not apply a camera-log input transform to it. Reproduce the same look and output conditions before comparing images.
5. **Test a return trip.** Send a small plate and chart through the actual handoff. Compare unchanged regions numerically in a common scene-linear space, then compare the rendered views. Test highlights and negative values as well as midtones.

Blender's [5.0 color-space documentation](https://docs.blender.org/manual/en/5.0/render/color_management/color_spaces.html) describes the working-space choice and non-color inputs; its [OCIO documentation](https://docs.blender.org/manual/en/5.0/render/color_management/opencolorio.html) describes shared configurations. The numbered handoff is a proposed verification procedure, not a tested session in Blender or Resolve.

For formal ACES interchange, follow the delivery contract's ACES2065-1 container requirements. For a documented internal ACEScg handoff, retain that explicit label and conversion. Do not set an ACES2065-1 compliance flag on ACEScg pixels. Preserve the grade and transform references alongside the source; AMF can communicate a recipe but cannot supply a missing custom transform or prove that two implementations agree. [OpenEXR ACES container guidance](https://openexr.com/en/latest/bin/exr2aces.html), [AMF](https://docs.acescentral.com/amf/specification/)

Finally, produce and review SDR and HDR renders separately. Changing an output transform is a useful starting point for another version, not a guarantee that every creative decision survives unchanged.
