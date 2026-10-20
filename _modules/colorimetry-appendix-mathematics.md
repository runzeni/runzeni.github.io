---
title: "Mathematical Appendix"
series: colorimetry
slug: appendix-mathematics
permalink: /notes/colorimetry/appendix-mathematics/
description: "Equations, primary coordinates, and figure conventions."
math: true
updated: 2026-10-20
---

Equations and reference values used throughout the series. Values are floating-point signals unless a unit is given; quantization and legal-range video scaling are separate operations.

## A.1 Colorimetry
{: #colorimetry}

For a reflecting, nonfluorescent sample:


$$
X=k\int ER\bar x\,d\lambda,\quad Y=k\int ER\bar y\,d\lambda,\quad Z=k\int ER\bar z\,d\lambda.
$$


Choosing $k=1/\int E\bar y\,d\lambda$ gives a perfect diffuse reflector Y = 1. For absolute radiometric inputs, photometric scaling and units must instead be retained. Use the observer and sampling interval appropriate to the task. [CIE 1931 data](https://doi.org/10.25039/CIE.DS.xvudnb9b).


$$
x=X/(X+Y+Z),\quad y=Y/(X+Y+Z),\quad X=xY/y,\quad Z=(1-x-y)Y/y.
$$


The forward conversion is undefined at zero total tristimulus; the inverse needs y ≠ 0.

For CIELAB, define $\delta=6/29$ and


$$
f(t)=\begin{cases}t^{1/3}&t>\delta^3\\t/(3\delta^2)+4/29&\text{otherwise}.\end{cases}
$$



$$
L^*=116f(Y/Y_n)-16,
$$


$$
a^*=500[f(X/X_n)-f(Y/Y_n)],\qquad b^*=200[f(Y/Y_n)-f(Z/Z_n)].
$$


The figures use D65, $(X_n,Y_n,Z_n)=(0.95047,1,1.08883)$. Euclidean ΔE₇₆ is an approximate difference measure, not a universal visibility threshold. [CIE definition](https://cie.co.at/eilvterm/17-23-076).

### CIE RGB, XYZ, and the mixing line
{: #cie-rgb}

Figures 2.1 and 2.5 reconstruct a CIE RGB representation from the published 1931 XYZ functions. They do not reproduce individual Wright/Guild observations. We use this rounded, equal-energy-normalized transformation:

$$
\begin{bmatrix}X\\Y\\Z\end{bmatrix}
=\begin{bmatrix}
0.49000&0.31000&0.20000\\
0.17697&0.81240&0.01063\\
0&0.01000&0.99000
\end{bmatrix}
\begin{bmatrix}R\\G\\B\end{bmatrix}.
$$

Each row sums to one: RGB = (1, 1, 1) maps to equal-energy white XYZ = (1, 1, 1). The corresponding primary directions are those of CIE RGB (700, 546.1, and 435.8 nm), subject to tabulation/rounding. The matrix is the M1 transformation documented in [Colour's educational implementation](https://colour.readthedocs.io/en/v0.4.6/_modules/colour/colorimetry/transformations.html#RGB_2_degree_cmfs_to_XYZ_2_degree_cmfs), which cites Wyszecki and Stiles. The figure coefficients are computed by applying its inverse to each XYZ sample. Their common scale differs from historical RGB CMF tables using other primary-unit conventions; they are not radiant-power fractions. The original [CIE XYZ table](https://doi.org/10.25039/CIE.DS.xvudnb9b) remains unchanged.

For Figure 2.1, write T = R P_R + G P_G + B P_B. Move every negative term to the test side with its positive magnitude. Both sides then have equal XYZ. Tiny coefficients may reflect the rounding of the transformation and tabulated functions; this is a numerical reconstruction, not new psychophysical evidence.

For Figure 2.6, f is the 650 nm fraction of a fixed total radiant power:

$$
\mathbf{C}_{mix}=(1-f)\mathbf{C}_{450}+f\mathbf{C}_{650},
\qquad \mathbf{C}=(X,Y,Z)^T.
$$

Let S_i = X_i + Y_i + Z_i. The mixture's chromaticity is

$$
\mathbf{c}_{mix}
=\frac{(1-f)S_{450}\mathbf{c}_{450}+fS_{650}\mathbf{c}_{650}}
{(1-f)S_{450}+fS_{650}},\qquad \mathbf{c}=(x,y)^T.
$$

Thus the mixture stays on a straight segment, but f = 0.5 gives the geometric midpoint only when the two S values are equal. Both monochromatic XYZ triplets come directly from the CIE table. Absolute power and luminance units are not assigned in the demonstration.

Figure 2.7 scales linear sRGB (0.2, 0.4, 0.1) by 0.25, 0.5, or 1. The [ICC sRGB matrix](https://www.color.org/srgb.pdf) maps these values to relative XYZ; encoding the scaled RGB gives the displayed swatch. Y uses reference-white Y = 1, not measured cd/m². For every positive scale, x and y are invariant; the zero vector has no chromaticity.

## A.2 Transfer functions
{: #transfer}

For nonnegative linear values C in [0, 1], sRGB encoding is


$$
C'=\begin{cases}12.92C&C\leq0.0031308\\1.055C^{1/2.4}-0.055&C>0.0031308.\end{cases}
$$


Its inverse uses C′/12.92 up to C′ = 0.04045, and $((C'+0.055)/1.055)^{2.4}$ above. A simple gamma encoding instead uses $C'=C^{1/\gamma}$. [ICC sRGB specification](https://www.color.org/srgb.pdf).

For PQ, let L be display luminance in cd/m² and N the normalized signal:


$$
N=\left(\frac{c_1+c_2(L/10000)^{m_1}}{1+c_3(L/10000)^{m_1}}\right)^{m_2},
$$



$$
L=10000\left(\frac{\max(N^{1/m_2}-c_1,0)}{c_2-c_3N^{1/m_2}}\right)^{1/m_1}.
$$


Here $m_1=2610/16384$, $m_2=2523/32$, $c_1=3424/4096$, $c_2=2413/128$, and $c_3=2392/128$. The intended domain is L ∈ [0, 10000], N ∈ [0, 1].

HLG's OETF takes relative scene light E ∈ [0, 1]:


$$
E'=\begin{cases}\sqrt{3E}&0\leq E\leq1/12\\a\ln(12E-b)+c&1/12<E\leq1,\end{cases}
$$


with $a=0.17883277$, $b=1-4a$, and $c=0.5-a\ln(4a)$. The OETF alone does not predict display luminance. [ITU-R BT.2100-3](https://www.itu.int/rec/R-REC-BT.2100/en).

## A.3 ACES coordinates
{: #aces}

| Primaries | Red xy | Green xy | Blue xy | White xy |
|---|---|---|---|---|
| AP0 | .7347, .2653 | .0000, 1.0000 | .0001, −.0770 | .32168, .33767 |
| AP1 | .713, .293 | .165, .830 | .128, .044 | .32168, .33767 |

ACES2065-1 uses AP0 and linear values; ACEScg uses AP1 and linear values. ACEScc and ACEScct use AP1 with distinct log encodings. Neither primary triangle is a physical monitor specification. [ACES encodings](https://docs.acescentral.com/encodings/acescg/).

A primary conversion takes the form $RGB_B=M_{XYZ\rightarrow B}\,M_{A\rightarrow XYZ}\,RGB_A$ for linear values and a common white. Insert a specified chromatic-adaptation transform when required. An illustrative matrix without a named source and domain is not a camera input transform.

## A.4 Camera log curves
{: #camera}

For LogC3 EI800, the exposure-value encoding is


$$
f(x)=\begin{cases}c\log_{10}(ax+b)+d&x>cut\\ex+f_0&x\leq cut,\end{cases}
$$


where $(cut,a,b,c,d,e,f_0)=(.010591,5.555556,.052272,.247190,.385537,5.367655,.092809)$. These rounded parameters are specific to EI800. [ARRI LogC3, exposure-value table](https://www.arri.com/resource/blob/31918/66f56e6abb6e5b6553929edf9aa7483e/2017-03-alexa-logc-curve-in-vfx-data.pdf).

For the LogC4 software encoding, define


$$
a=(2^{18}-16)/117.45,\quad b=(1023-95)/1023,\quad c=95/1023,
$$


$$
s=\frac{7\ln2\;2^{7-14c/b}}{ab},\qquad t=\frac{2^{6-14c/b}-64}{a}.
$$



$$
f(x)=\begin{cases}\frac{\log_2(ax+64)-6}{14}b+c&x\geq t\\(x-t)/s&x<t.\end{cases}
$$


The inverse is $(2^{14(N-c)/b+6}-64)/a$ for N ≥ 0, and Ns + t otherwise. These definitions preserve negative values in the specified linear extension. [ARRI LogC4, §4.1](https://www.arri.com/resource/blob/278790/bea879ac0d041a925bed27a096ab3ec2/2022-05-arri-logc4-specification-data.pdf).

Log3G10 is discussed conceptually in Module 6; this revision does not implement a RED decoder. Production conversions should use the manufacturer's versioned specification or an established color-management implementation.

## A.5 Display and camera primaries
{: #gamuts}

| Space | Red xy | Green xy | Blue xy |
|---|---|---|---|
| Rec.709 / sRGB | .640, .330 | .300, .600 | .150, .060 |
| Rec.2020 | .708, .292 | .170, .797 | .131, .046 |
| ARRI Wide Gamut 3 | .6840, .3130 | .2210, .8480 | .0861, −.1020 |
| ARRI Wide Gamut 4 | .7347, .2653 | .1424, .8576 | .0991, −.0308 |

All four use D65, xy = (.3127, .3290). These coordinates alone do not define a transfer function or an image rendering. Sources: [BT.709](https://www.itu.int/rec/R-REC-BT.709/en), [BT.2020](https://www.itu.int/rec/R-REC-BT.2020/en), and the ARRI specifications above.

## A.6 Video signal coordinates and range
{: #video-signal}

For normalized nonlinear BT.709 R′G′B′ values, before quantization:

$$
Y'=0.2126R'+0.7152G'+0.0722B',
$$

$$
\begin{aligned}
C_B&=(B'-Y')/1.8556,\\
C_R&=(R'-Y')/1.5748.
\end{aligned}
$$

Y′ nominally spans [0, 1]; the color-difference components nominally span [−0.5, 0.5]. Neutral R′ = G′ = B′ gives C_B = C_R = 0. Nominal 10-bit narrow-range code values are round(64 + 876Y′) and round(512 + 896C), respectively. Thus luma black/white are 64/940, chroma neutral is 512, and chroma endpoints are 64/960. Full range is a different convention. These coefficients are not a matrix to apply directly to scene-linear RGB. [BT.709-6, §3](https://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.709-6-201506-I!!PDF-E.pdf)

## A.7 Reference values
{: #reference-values}

These are calculations from the cited definitions, not measurements of a camera or display. Values are rounded here; calculations retain greater precision.

| Definition | Input | Output |
|---|---|---|
| sRGB encoding | Linear 0.18 | 0.461356 |
| CIELAB lightness | Y/Y_n = 0.18 | L* = 49.4961 |
| LogC3, EI800 exposure-value formula | Linear 0.18 | 0.391007 |
| LogC4 software encoding | Linear 0.18 | 0.278396 |
| ACEScct, logarithmic branch | Linear AP1 0.18 | 0.413588 |
| Inverse PQ EOTF | 100 cd/m² | 0.508078 |
| Inverse PQ EOTF | 1000 cd/m² | 0.751827 |
| HLG OETF | Relative scene E = 1/12 | 0.5 |

The sRGB, Lab, ARRI, and PQ/HLG definitions appear above. ACEScct uses (log₂ x + 9.72)/17.52 above x = 0.0078125, and 10.5402377416545x + 0.0729055341958355 below or at that point. The toe continues below zero; do not substitute a logarithm there. [ACEScct encoding specification](https://docs.acescentral.com/encodings/acescct/)

For **achromatic** HLG, with zero display black and the reference gamma 1.2 at 1000 cd/m² peak, the OOTF reduces to:

$$
L=1000E^{1.2}.
$$

Hence signal 0.5 corresponds to E = 1/12 and L ≈ 50.697 cd/m². This scalar reduction is not the general color HLG EOTF: BT.2100 applies the system-gamma factor through scene luminance and includes black-level handling. [BT.2100-3, Table 5](https://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.2100-3-202502-I!!PDF-E.pdf)

## A.8 Fitting and validation
{: #validation-math}

With one sample per row in A and B, a weighted linear fit minimizes

$$
\min_M \sum_i w_i\|\mathbf a_iM-\mathbf b_i\|_2^2.
$$

Solve the weighted system with QR or SVD. Explicitly forming an inverse of AᵀA is unnecessary and can worsen numerical conditioning. This objective minimizes errors in the declared coordinates; it is not automatically a perceptual ΔE objective. Keep training and validation samples separate.

A useful test of exposure scaling, for positive k within the valid domain, is

$$
r_k(\mathbf x)=f(k\mathbf x)-kf(\mathbf x).
$$

It vanishes for a linear map. Root-polynomial terms such as √(RG), for nonnegative channels, also scale linearly with k. Ordinary RG scales with k². This property does not recover lost spectral information or make every nonlinear fit appropriate. [Finlayson et al.](https://doi.org/10.1109/TIP.2015.2405336)

For a forward transform f and candidate inverse g, measure

$$
e_i=\|g(f(\mathbf x_i))-\mathbf x_i\|_\infty.
$$

Report the maximum and distribution over a stated domain, including off-grid samples. A clipping map f(x) = min(x, 1) sends both x = 1 and x = 2 to 1, so an exact inverse cannot return both. For an illustrative invertible shoulder f(x) = x/(1+x), x ≥ 0, the inverse is g(y) = y/(1−y), y < 1. Its derivative 1/(1−y)² grows without bound near 1. This is an analytic example of inverse sensitivity, not an ACES or camera tone curve.

## Figure conventions

Spectral curves use wavelength in nm. Blackbody curves use Planck's law and independent peak normalization; the LED comparison is an explicitly synthetic sum of Gaussian bands. The metamer example constructs a null-space perturbation of sampled CIE XYZ functions, then changes its spectral weighting. The chart plots reflected spectral power, not the fixed reflectance functions. Its swatches convert relative XYZ to D65 sRGB without chromatic adaptation and clip out-of-range channels; they are illustrative display previews. Lab circles use L* = 60, radius 5, and D65. Film, tone, gamut-compression, and grid-deformation figures are pedagogical functions, not fitted products or measured camera data.

The shared [figure source]({{ '/assets/js/colorimetry-models.mjs' | relative_url }}) defines each calculation. Static figures and interactive updates use the same implementation.
