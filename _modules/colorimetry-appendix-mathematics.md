---
title: "Mathematical Appendix"
series: colorimetry
slug: appendix-mathematics
permalink: /notes/colorimetry/appendix-mathematics/
description: "Equations, primary coordinates, and figure conventions."
math: true
updated: 2026-10-13
---

Equations used in the figures. Values are floating-point signals unless a unit is given; quantization and legal-range video scaling are separate operations.

## A.1 Colorimetry
{: #colorimetry}

For a reflecting, nonfluorescent sample:

$$X=k\int ER\bar x\,d\lambda,\quad Y=k\int ER\bar y\,d\lambda,\quad Z=k\int ER\bar z\,d\lambda.$$

Choosing $k=1/\int E\bar y\,d\lambda$ gives a perfect diffuse reflector Y = 1. For absolute radiometric inputs, photometric scaling and units must instead be retained. Use the observer and sampling interval appropriate to the task. [CIE 1931 data](https://doi.org/10.25039/CIE.DS.xvudnb9b).

$$x=X/(X+Y+Z),\quad y=Y/(X+Y+Z),\quad X=xY/y,\quad Z=(1-x-y)Y/y.$$

The forward conversion is undefined at zero total tristimulus; the inverse needs y ≠ 0.

For CIELAB, define $\delta=6/29$ and

$$f(t)=\begin{cases}t^{1/3}&t>\delta^3\\t/(3\delta^2)+4/29&\text{otherwise}.\end{cases}$$

$$L^*=116f(Y/Y_n)-16,$$
$$a^*=500[f(X/X_n)-f(Y/Y_n)],\qquad b^*=200[f(Y/Y_n)-f(Z/Z_n)].$$

The figures use D65, $(X_n,Y_n,Z_n)=(0.95047,1,1.08883)$. Euclidean ΔE₇₆ is an approximate difference measure, not a universal visibility threshold. [CIE definition](https://cie.co.at/eilvterm/17-23-076).

## A.2 Transfer functions
{: #transfer}

For nonnegative linear values C in [0, 1], sRGB encoding is

$$C'=\begin{cases}12.92C&C\leq0.0031308\\1.055C^{1/2.4}-0.055&C>0.0031308.\end{cases}$$

Its inverse uses C′/12.92 up to C′ = 0.04045, and $((C'+0.055)/1.055)^{2.4}$ above. A simple gamma encoding instead uses $C'=C^{1/\gamma}$. [ICC sRGB specification](https://www.color.org/srgb.pdf).

For PQ, let L be display luminance in cd/m² and N the normalized signal:

$$N=\left(\frac{c_1+c_2(L/10000)^{m_1}}{1+c_3(L/10000)^{m_1}}\right)^{m_2},$$

$$L=10000\left(\frac{\max(N^{1/m_2}-c_1,0)}{c_2-c_3N^{1/m_2}}\right)^{1/m_1}.$$

Here $m_1=2610/16384$, $m_2=2523/32$, $c_1=3424/4096$, $c_2=2413/128$, and $c_3=2392/128$. The intended domain is L ∈ [0, 10000], N ∈ [0, 1].

HLG's OETF takes relative scene light E ∈ [0, 1]:

$$E'=\begin{cases}\sqrt{3E}&0\leq E\leq1/12\\a\ln(12E-b)+c&1/12<E\leq1,\end{cases}$$

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

$$f(x)=\begin{cases}c\log_{10}(ax+b)+d&x>cut\\ex+f_0&x\leq cut,\end{cases}$$

where $(cut,a,b,c,d,e,f_0)=(.010591,5.555556,.052272,.247190,.385537,5.367655,.092809)$. These rounded parameters are specific to EI800. [ARRI LogC3, exposure-value table](https://www.arri.com/resource/blob/31918/66f56e6abb6e5b6553929edf9aa7483e/2017-03-alexa-logc-curve-in-vfx-data.pdf).

For the LogC4 software encoding, define

$$a=(2^{18}-16)/117.45,\quad b=(1023-95)/1023,\quad c=95/1023,$$
$$s=\frac{7\ln2\;2^{7-14c/b}}{ab},\qquad t=\frac{2^{6-14c/b}-64}{a}.$$

$$f(x)=\begin{cases}\frac{\log_2(ax+64)-6}{14}b+c&x\geq t\\(x-t)/s&x<t.\end{cases}$$

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

## Figure conventions

Spectral curves use wavelength in nm. Blackbody curves use Planck's law and independent peak normalization; the LED comparison is an explicitly synthetic sum of Gaussian bands. The metamer example constructs a null-space perturbation of sampled CIE XYZ functions, then changes its spectral weighting. Lab circles use L* = 60, radius 5, and D65. Film, tone, gamut-compression, and grid-deformation figures are pedagogical functions, not fitted products or measured camera data.

The shared [figure source]({{ '/assets/js/colorimetry-models.mjs' | relative_url }}) defines each calculation. Static figures and interactive updates use the same implementation.
