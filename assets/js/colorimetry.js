(() => {
  'use strict';

  const svgNamespace = 'http://www.w3.org/2000/svg';
  const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);
  const svgElement = (name, attributes = {}) => {
    const element = document.createElementNS(svgNamespace, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  };

  const appendText = (parent, text, attributes = {}) => {
    const element = svgElement('text', attributes);
    element.textContent = text;
    parent.append(element);
    return element;
  };

  const chartFrame = (svg, { xMinimum = 0, xMaximum = 1, yMinimum = 0, yMaximum = 1, xLabel, yLabel }) => {
    const width = 640;
    const height = 360;
    const bounds = { left: 58, right: 28, top: 24, bottom: 48 };
    const plotWidth = width - bounds.left - bounds.right;
    const plotHeight = height - bounds.top - bounds.bottom;
    const x = (value) => bounds.left + ((value - xMinimum) / (xMaximum - xMinimum)) * plotWidth;
    const y = (value) => bounds.top + (1 - ((value - yMinimum) / (yMaximum - yMinimum))) * plotHeight;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const grid = svgElement('g', { 'aria-hidden': 'true' });
    const tickCount = 4;
    for (let index = 0; index <= tickCount; index += 1) {
      const ratio = index / tickCount;
      const xValue = xMinimum + ratio * (xMaximum - xMinimum);
      const yValue = yMinimum + ratio * (yMaximum - yMinimum);
      grid.append(
        svgElement('line', { x1: x(xValue), y1: bounds.top, x2: x(xValue), y2: height - bounds.bottom, class: 'chart-grid' }),
        svgElement('line', { x1: bounds.left, y1: y(yValue), x2: width - bounds.right, y2: y(yValue), class: 'chart-grid' })
      );
      appendText(grid, xValue.toFixed(2).replace(/0$/, ''), { x: x(xValue), y: height - bounds.bottom + 18, class: 'chart-label', 'text-anchor': 'middle' });
      appendText(grid, yValue.toFixed(2).replace(/0$/, ''), { x: bounds.left - 9, y: y(yValue) + 4, class: 'chart-label', 'text-anchor': 'end' });
    }
    grid.append(
      svgElement('line', { x1: bounds.left, y1: height - bounds.bottom, x2: width - bounds.right, y2: height - bounds.bottom, class: 'chart-axis' }),
      svgElement('line', { x1: bounds.left, y1: bounds.top, x2: bounds.left, y2: height - bounds.bottom, class: 'chart-axis' })
    );
    appendText(grid, xLabel, { x: width / 2, y: height - 8, class: 'chart-label', 'text-anchor': 'middle' });
    const vertical = appendText(grid, yLabel, { x: 14, y: height / 2, class: 'chart-label', 'text-anchor': 'middle', transform: `rotate(-90 14 ${height / 2})` });
    vertical.setAttribute('dominant-baseline', 'middle');
    svg.append(grid);

    return { width, height, bounds, x, y };
  };

  const pathFor = (curve, frame) => {
    const points = 160;
    return Array.from({ length: points + 1 }, (_, index) => {
      const input = index / points;
      const output = clamp(curve(input), 0, 1);
      const command = index === 0 ? 'M' : 'L';
      return `${command}${frame.x(input).toFixed(2)},${frame.y(output).toFixed(2)}`;
    }).join(' ');
  };

  const initializeTransferCurves = (widget) => {
    const svg = widget.querySelector('[data-transfer-svg]');
    const gammaInput = widget.querySelector('[data-transfer-gamma]');
    const gammaOutput = widget.querySelector('[data-transfer-gamma-output]');
    const readout = widget.querySelector('[data-transfer-readout]');
    if (!svg || !gammaInput || !gammaOutput || !readout) return;

    const srgb = (input) => input <= 0.0031308
      ? 12.92 * input
      : 1.055 * Math.pow(input, 1 / 2.4) - 0.055;

    const render = () => {
      const gamma = Number(gammaInput.value);
      svg.replaceChildren();
      const title = svgElement('title', { id: 'transfer-curves-svg-title' });
      title.textContent = 'Transfer curve comparison';
      const description = svgElement('desc', { id: 'transfer-curves-svg-description' });
      description.textContent = `A comparison of scene-linear, sRGB, and gamma ${gamma.toFixed(1)} encoding curves.`;
      svg.append(title, description);
      const frame = chartFrame(svg, {
        xLabel: 'Scene-linear input',
        yLabel: 'Encoded signal'
      });
      const curves = [
        { label: 'Scene-linear', color: '#858585', dash: '5 4', curve: (input) => input },
        { label: 'sRGB', color: '#2f6b85', curve: srgb },
        { label: `Gamma ${gamma.toFixed(1)}`, color: '#a2492a', curve: (input) => Math.pow(input, 1 / gamma) }
      ];
      curves.forEach(({ color, dash, curve }) => {
        const path = svgElement('path', {
          d: pathFor(curve, frame),
          fill: 'none',
          stroke: color,
          'stroke-width': 3,
          'vector-effect': 'non-scaling-stroke',
          'aria-hidden': 'true'
        });
        if (dash) path.setAttribute('stroke-dasharray', dash);
        svg.append(path);
      });

      const midpoint = 0.18;
      gammaOutput.textContent = `γ ${gamma.toFixed(1)}`;
      readout.textContent = `At scene-linear 0.18: sRGB encodes ${srgb(midpoint).toFixed(3)}; γ ${gamma.toFixed(1)} encodes ${Math.pow(midpoint, 1 / gamma).toFixed(3)}. These are encoding curves, not display-luminance predictions.`;
    };

    gammaInput.addEventListener('input', render);
    render();
  };

  const gamutDefinitions = [
    {
      id: 'rec709',
      label: 'Rec.709',
      color: '#b24b47',
      primaries: [[0.640, 0.330], [0.300, 0.600], [0.150, 0.060]],
      white: [0.3127, 0.3290]
    },
    {
      id: 'rec2020',
      label: 'Rec.2020',
      color: '#2f6b85',
      primaries: [[0.708, 0.292], [0.170, 0.797], [0.131, 0.046]],
      white: [0.3127, 0.3290]
    },
    {
      id: 'ap1',
      label: 'ACES AP1',
      color: '#588157',
      primaries: [[0.713, 0.293], [0.165, 0.830], [0.128, 0.044]],
      white: [0.32168, 0.33767]
    },
    {
      id: 'ap0',
      label: 'ACES AP0',
      color: '#845a99',
      primaries: [[0.7347, 0.2653], [0.0000, 1.0000], [0.0001, -0.0770]],
      white: [0.32168, 0.33767],
      dash: '5 3'
    }
  ];

  const initializeGamutCoordinates = (widget) => {
    const svg = widget.querySelector('[data-gamut-svg]');
    const readout = widget.querySelector('[data-gamut-readout]');
    const toggles = Array.from(widget.querySelectorAll('[data-gamut-toggle]'));
    const wavelengthInput = widget.querySelector('[data-locus-wavelength]');
    const wavelengthOutput = widget.querySelector('[data-locus-wavelength-output]');
    let spectralCoordinates = [];
    if (!svg || !readout || !toggles.length || !wavelengthInput || !wavelengthOutput) return;

    const render = () => {
      const enabled = gamutDefinitions.filter((gamut) => toggles.some((toggle) => toggle.value === gamut.id && toggle.checked));
      svg.replaceChildren();
      const title = svgElement('title', { id: 'gamut-coordinates-svg-title' });
      title.textContent = 'Gamut chromaticity-coordinate comparison';
      const description = svgElement('desc', { id: 'gamut-coordinates-svg-description' });
      description.textContent = `A CIE 1931 chromaticity diagram comparing ${enabled.map((gamut) => gamut.label).join(', ') || 'no'} gamut triangles with the spectral locus.`;
      svg.append(title, description);
      const frame = chartFrame(svg, {
        xMinimum: -0.05,
        xMaximum: 0.8,
        yMinimum: -0.1,
        yMaximum: 1.05,
        xLabel: 'x chromaticity coordinate',
        yLabel: 'y chromaticity coordinate'
      });

      if (spectralCoordinates.length) {
        const locusPoints = spectralCoordinates
          .map(([, x, y]) => `${frame.x(x).toFixed(2)},${frame.y(y).toFixed(2)}`)
          .join(' ');
        svg.append(svgElement('polyline', {
          points: locusPoints,
          fill: 'none',
          class: 'chart-locus',
          'vector-effect': 'non-scaling-stroke',
          'aria-hidden': 'true'
        }));
        const first = spectralCoordinates[0];
        const last = spectralCoordinates[spectralCoordinates.length - 1];
        svg.append(svgElement('line', {
          x1: frame.x(first[1]), y1: frame.y(first[2]),
          x2: frame.x(last[1]), y2: frame.y(last[2]),
          class: 'chart-locus chart-locus--purples',
          'vector-effect': 'non-scaling-stroke',
          'aria-hidden': 'true'
        }));
      }

      enabled.forEach((gamut) => {
        const points = gamut.primaries.map(([x, y]) => `${frame.x(x).toFixed(2)},${frame.y(y).toFixed(2)}`).join(' ');
        const polygon = svgElement('polygon', {
          points,
          fill: gamut.color,
          'fill-opacity': 0.08,
          stroke: gamut.color,
          'stroke-width': 2.5,
          'vector-effect': 'non-scaling-stroke',
          'aria-hidden': 'true'
        });
        if (gamut.dash) polygon.setAttribute('stroke-dasharray', gamut.dash);
        svg.append(polygon);
        gamut.primaries.forEach(([x, y]) => svg.append(svgElement('circle', {
          cx: frame.x(x), cy: frame.y(y), r: 3.25, fill: gamut.color, 'aria-hidden': 'true'
        })));
        svg.append(svgElement('circle', {
          cx: frame.x(gamut.white[0]), cy: frame.y(gamut.white[1]), r: 3.5, fill: 'var(--color-bg)', stroke: gamut.color, 'stroke-width': 1.75, 'aria-hidden': 'true'
        }));
      });

      const wavelength = Number(wavelengthInput.value);
      const selected = spectralCoordinates.find(([value]) => value === wavelength);
      if (selected) {
        svg.append(
          svgElement('circle', {
            cx: frame.x(selected[1]), cy: frame.y(selected[2]), r: 6,
            class: 'chart-locus-focus', 'aria-hidden': 'true'
          }),
          svgElement('circle', {
            cx: frame.x(selected[1]), cy: frame.y(selected[2]), r: 2.5,
            class: 'chart-locus-focus__center', 'aria-hidden': 'true'
          })
        );
        wavelengthOutput.textContent = `${wavelength} nm`;
      }
      const names = enabled.map((gamut) => gamut.label);
      const wavelengthText = selected
        ? `${wavelength} nm: x ${selected[1].toFixed(4)}, y ${selected[2].toFixed(4)}.`
        : 'Spectral-locus data unavailable.';
      readout.textContent = `${wavelengthText} ${names.length ? `Showing ${names.join(', ')}.` : 'Choose a gamut to compare.'} Triangle area in xy is not a perceptual gamut-volume measurement.`;
    };

    toggles.forEach((toggle) => toggle.addEventListener('change', render));
    wavelengthInput.addEventListener('input', render);
    render();

    const locusUrl = widget.dataset.locusUrl;
    if (locusUrl) {
      fetch(locusUrl)
        .then((response) => {
          if (!response.ok) throw new Error(`CIE data request failed: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          spectralCoordinates = Array.isArray(data.coordinates) ? data.coordinates : [];
          render();
        })
        .catch(() => {
          spectralCoordinates = [];
          render();
        });
    }
  };

  document.querySelectorAll('[data-colorimetry-widget="transfer-curves"]').forEach(initializeTransferCurves);
  document.querySelectorAll('[data-colorimetry-widget="gamut-coordinates"]').forEach(initializeGamutCoordinates);
})();
