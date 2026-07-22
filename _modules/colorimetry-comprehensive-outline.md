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
---

* * *

### Module 1: The Hardware of Sight

#### Physics & Psychophysics
- Spectral Power Distribution (SPD)
  - Continuous vs discontinuous spectra
  - Metamerism failure
- Color Rendering Index (CRI)
  - R1-R8 limitations
  - Critical values: R9, R13, R15

#### Photoreceptors
- Cones (Photopic vision)
  - L, M, S cone types
  - Opponent processing
- Rods (Scotopic vision)
  - Purkinje effect

#### Perception Anomalies
- Helmholtz-Kohlrausch effect
- Abney effect
- Bezold-Brücke shift
- Weber-Fechner Law

#### Integration Formula
- Color as spectral integration
- SPD × Reflectance × Observer sensitivity

* * *

### Module 2: Measuring Color

#### Historical Development
- Wright-Guild experiments
- Color-matching functions

#### CIE 1931 XYZ System
- XYZ tristimulus values
- Chromaticity coordinates (x, y)
- Chromaticity diagram ("horseshoe")

#### Perceptual Non-Uniformity
- MacAdam ellipses
- Just Noticeable Difference (JND)

#### Lab* Color Space
- L* (Lightness)
- a* (Red-Green axis)
- b* (Blue-Yellow axis)
- ΔE color difference metric

#### Analog Legacy
- Hurter-Driffield (H-D) curve
- Film response characteristics
- Digital log curves

* * *

### Module 3: The Digital Image Pipeline

#### Scene-Referred vs Display-Referred
- Scene-referred: Linear, unbounded
- Display-referred: Non-linear, bounded

#### Transfer Functions
- Gamma 2.2
- sRGB (piecewise)
- LogC3 (ARRI)
- ST.2084 PQ (HDR)

#### Color Models
- RGB (device-dependent, additive)
- YCbCr (luminance + chroma)
- HSL (perceptually broken)
- Lab* (perceptually uniform)
- ICtCp (HDR-optimized)

#### Tone Mapping & View Transforms
- Contrast compression
- Gamut mapping
- Output transforms

* * *

### Module 4: ACES & Modern Color Management

#### ACES Architecture
- IDT (Input Device Transform)
- AP0 (ACES 2065-1) - Archive space
- AP1 (ACEScg) - Working space
- ODT (Output Device Transform)

#### AP0 Primaries
- Imaginary primaries
- Future-proof gamut

#### AP1 Primaries
- Real primaries
- Grading/rendering space

#### Gamut Problems
- Blue light artifacts
- Negative RGB values
- Gamut compression solutions
- ACES 2.0 improvements

#### Practical Workflows
- Save in AP0, work in AP1
- Camera IDTs
- Display ODTs

* * *

### Module 5: The Display Ecosystem

#### HDR Standards
- PQ (ST.2084) - Absolute luminance
- HLG (ARIB STD-B67) - Relative luminance

#### Viewing Environment
- Bartleson-Breneman effect
- Theatrical, home, office standards
- Surround luminance impact

#### System Color Management
- NCLC tags
- QuickTime gamma shift
- Apple EDR
- Platform-specific handling

* * *

### Module 6: Camera Architectures & Case Studies

#### ARRI
- LogC3 (14 stops, Middle Grey = 39%)
- LogC4 (17 stops, Middle Grey = 32%)
- K1S1 Transform
- Wide Gamut 3

#### RED IPP2
- Log3G10 (13 stops)
- REDWideGamutRGB
- Philosophy: "Maximum data, colorist decides"

#### Sony Venice
- X-OCN format
- S-Gamut3.Cine
- Hybrid approach

#### RAW Mechanics
- Bayer pattern (RGGB)
- Demosaicing algorithms
- dcraw open-source decoder

* * *

### Module 7: Computational Color & Advanced DIT

#### Advanced Color Matching
- 3×3 matrix transforms
- Thin-Plate Splines (TPS)

#### LUT Mathematics
- 33×33×33 cube structure
- Trilinear vs tetrahedral interpolation
- Inverse LUT problems

#### Security & Algorithms
- Visual encryption
- RSA metadata
- DCTL shaders
- True security (AES-256 + DRM)

* * *

### Conclusion

Color science is the intersection of:
- **Biology** - LMS cones, opponent processing, logarithmic perception
- **Physics** - SPD, reflectance, integration
- **Mathematics** - Matrices, transforms, perceptual quantization
- **Engineering** - Sensors, codecs, display calibration
- **Craftsmanship** - Translating DoP's vision into audience experience

**The DIT's Role:** Translator between emotion and data, between sensor and screen.

* * *
