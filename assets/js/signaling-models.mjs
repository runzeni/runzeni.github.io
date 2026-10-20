// Qualitative teaching states; no measured concentrations or response kinetics.
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export const pathway = (steps, parallel = false) => `<${parallel ? 'ul' : 'ol'} class="study-path${parallel ? ' study-path--parallel' : ''}">${steps.map(([title, detail]) => `<li><strong>${escape(title)}</strong><span>${escape(detail)}</span></li>`).join('')}</${parallel ? 'ul' : 'ol'}>`;

export const photoreceptorStates = {
  Dark: {
    channel: 'Open', messenger: 'cGMP maintained', ions: 6,
    steps: [['Rhodopsin is inactive', '11-cis retinal remains bound; basal cGMP synthesis balances breakdown.'], ['cGMP binds CNG channels', 'Na+ and Ca2+ enter the outer segment. This is the dark current.'], ['The rod stays relatively depolarized', 'About −40 mV in the lecture example; glutamate release is tonic.']],
    readout: 'Dark: direct cGMP binding keeps CNG channels open; glutamate release is tonic.'
  },
  Light: {
    channel: 'Closed', messenger: 'cGMP falls', ions: 1,
    steps: [['Light activates rhodopsin', '11-cis → all-trans retinal; activated receptor promotes GDP/GTP exchange on transducin.'], ['Gαt–GTP activates PDE6', 'PDE6 hydrolyzes cGMP to 5′-GMP. Less cGMP means less CNG-channel opening.'], ['Inward current falls', 'The rod hyperpolarizes; synaptic Ca2+ entry and glutamate release decrease.']],
    readout: 'Light: cGMP falls, channels close, and the rod hyperpolarizes. Glutamate release decreases.'
  },
  Recovery: {
    channel: 'Reopening', messenger: 'cGMP restored', ions: 3,
    steps: [['Stop receptor and G-protein activity', 'GRK1 and arrestin quench activated rod rhodopsin. RGS9 speeds GTP hydrolysis on transducin, ending its activation of PDE6.'], ['Low Ca2+ promotes cGMP synthesis', 'Ca2+ entry fell while extrusion continued. GCAP feedback stimulates retinal guanylate cyclase.'], ['Restore the dark current', 'After a brief flash, cGMP can rise and CNG channels reopen. This schematic is not a timed dark-adaptation curve.']],
    readout: 'Recovery: signal shutoff and cGMP replenishment overlap, helping CNG channels reopen after a brief flash.'
  }
};
export function renderPhotoreceptor(state, width) {
  const model = photoreceptorStates[state], membrane = width * .6, open = state !== 'Light';
  const label = (x, y, value, anchor = 'start') => `<text x="${x}" y="${y}" text-anchor="${anchor}">${escape(value)}</text>`;
  const dots = Array.from({length: model.ions}, (_, i) => `<circle cx="${22 + i % 3 * 26}" cy="${75 + Math.floor(i / 3) * 30}" r="5" fill="currentColor"/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="fig-1-9-title" viewBox="0 0 ${width} 230"><title id="fig-1-9-title">Rod outer segment in ${state.toLowerCase()}: CNG channels ${model.channel.toLowerCase()}. cGMP dots are schematic.</title>
    ${label(6, 22, 'Outer segment')}${label(width - 4, 22, 'Outside', 'end')}
    <path d="M${membrane - 5},40v44 m0,52v70 M${membrane + 5},40v44 m0,52v70" stroke="var(--color-border)" stroke-width="3" fill="none"/>
    <path d="M${membrane - 14},84v52 m28,-52v52" stroke="currentColor" stroke-width="3"/>
    ${open ? `<path d="M${width - 16},110H${membrane - 33}m9,-7 -9,7 9,7" stroke="currentColor" stroke-width="2" fill="none"/>` : `<path d="M${membrane - 13},102l26,16 m-26,0 26,-16" stroke="currentColor" stroke-width="3"/>`}
    ${dots}${label(8, 148, 'cGMP')}${label(width - 4, 76, 'Na+, Ca2+', 'end')}
    <path d="M${membrane - 30},180H${width - 16}m-9,-7 9,7 -9,7" stroke="currentColor" stroke-width="1.5" fill="none"/>
    ${label(width - 4, 216, 'Ca2+ extrusion', 'end')}
    </svg>`;
  return {html: `<div class="photoreceptor"><div class="photoreceptor__state"><strong>${escape(model.messenger)}</strong><span>CNG: ${escape(model.channel.toLowerCase())}</span></div>${svg}${pathway(model.steps)}</div>`, readout: model.readout};
}

export const gProteinRoutes = {
  Gs: {steps: [['Ligand → GPCR', 'The activated receptor promotes GDP release and GTP binding on Gαs.'], ['Gαs–GTP stimulates adenylyl cyclase', 'AC converts ATP to cAMP; PDE converts cAMP to 5′-AMP.'], ['cAMP activates PKA', 'cAMP binds regulatory subunits of R2C2, releasing active catalytic subunits in the lecture model.'], ['Target proteins change function', 'PKA phosphorylates Ser/Thr residues. The response depends on the cell and substrate.']], reset: 'Reset: Gα hydrolyzes GTP; PDE removes cAMP; protein phosphatases reverse target phosphorylation.'},
  Gi: {steps: [['Ligand → GPCR', 'The receptor promotes GDP/GTP exchange on Gαi. Gβγ can also signal.'], ['Gαi–GTP inhibits susceptible AC isoforms', 'cAMP production falls relative to the same cell without Gi input.'], ['Less cAMP can mean less PKA activity', 'The outcome depends on competing inputs, AC isoform, and local messenger turnover.']], reset: 'Reset: GTP hydrolysis removes the Gαi signal. Pertussis toxin prevents receptor coupling, so this inhibition can be lost.'},
  Gq: {steps: [['Ligand → GPCR → Gαq–GTP', 'The active G protein stimulates phospholipase C-β.'], ['PLC-β cleaves PIP2', 'IP3 diffuses through the cytosol; DAG remains in the membrane.'], ['IP3 releases ER Ca2+', 'Ca2+ binds calmodulin. DAG and Ca2+ together support conventional PKC activation.'], ['Kinases change target activity', 'Conventional PKC and CaM-dependent kinases act on different substrates. Novel PKCs need DAG but not Ca2+.']], reset: 'Reset: GTP hydrolysis, messenger metabolism, and Ca2+ clearance reduce the signal; phosphatases reverse target phosphorylation.'},
  Gt: {steps: photoreceptorStates.Light.steps, reset: 'Reset: GRK1/arrestin quench rod rhodopsin; GTP hydrolysis ends transducin activation of PDE6; guanylate cyclase replenishes cGMP.'}
};
export const receptorRoutes = {
  'Ras / MAPK': {receptor:'RTK',steps: [['Growth factor → RTK', 'Ligand-dependent receptor association or rearrangement activates intrinsic tyrosine kinase domains.'], ['Phosphotyrosines recruit adaptors', 'Grb2 SH2 recognizes a phosphotyrosine-containing site; its SH3 domains recruit proline-rich SOS. Recruitment can involve an intervening adaptor.'], ['SOS activates Ras by nucleotide exchange', 'Ras–GDP → Ras–GTP. Ras is a small GTPase, not a protein kinase.'], ['Raf → MEK → ERK', 'MAPKKK → MAPKK → MAPK: successive protein-phosphorylation steps.'], ['Cytosolic and nuclear targets respond', 'Scaffolds, phosphatases, and other inputs shape the response.']], reset: 'Reset: Ras GAPs accelerate GTP hydrolysis; protein phosphatases remove phosphates. SOS is a GEF, not a kinase.'},
  'PI3K / Akt': {receptor:'RTK',steps: [['Activated RTK recruits PI3K', 'Receptor/adaptor docking brings the lipid kinase to membrane substrates.'], ['PI3K phosphorylates PIP2 → PIP3', 'A phosphate is added at the inositol 3-position. PIP2 is not cleaved.'], ['PH-domain recruitment assembles signaling', 'PIP3 helps recruit Akt and PDK1 at the membrane. Not every PH domain binds PIP3.'], ['Akt activation supports survival signaling', 'PDK1 phosphorylates Thr308; mTORC2 supplies Ser473 phosphorylation for canonical full activation.']], reset: 'Contrast: PLC cleaves PIP2 into IP3 + DAG; PI3K phosphorylates PIP2 into PIP3. PIP3 and IP3 are different messengers.'},
  'JAK / STAT': {receptor:'JAK',steps: [['Cytokine → cytokine receptor', 'The receptor lacks intrinsic tyrosine kinase activity and associates with JAK.'], ['Associated JAKs phosphorylate proteins', 'Activated JAKs phosphorylate receptor tyrosines, creating docking sites.'], ['STAT docks and is phosphorylated', 'STAT SH2 domains recognize appropriate phosphotyrosine sites.'], ['Activated STATs form dimers', 'Reciprocal SH2–phosphotyrosine interactions support dimerization.'], ['STAT enters the nucleus', 'Activated STAT complexes regulate gene expression; this route does not require the Ras/MAPK sequence above.']], reset: 'Distinction: the kinase belongs to the receptor in an RTK; it is receptor-associated in the cytokine/JAK model. Specific STAT complexes vary with the ligand.'},
  'TGF-β / SMAD': {receptor:'SMAD',steps: [['TGF-β assembles a receptor complex', 'Type II and type I receptors have Ser/Thr kinase activity.'], ['Type II receptor activates type I', 'Type I receptor then phosphorylates receptor-regulated SMAD2/3.'], ['SMAD2/3 associates with SMAD4', 'The complex accumulates in the nucleus and works with other transcriptional regulators.'], ['Gene expression changes', 'This is the TGF-β example; BMP signaling commonly uses SMAD1/5/9 instead.']], reset: 'Distinction: this receptor is a Ser/Thr kinase, rather than an RTK or a cytokine receptor relying on JAK.'},
  'Nuclear I': {receptor:'Nuclear',steps: [['Steroid ligand reaches an intracellular receptor', 'Glucocorticoid receptor is the example here.'], ['Ligand changes receptor/chaperone interactions', 'Receptor activation and nuclear accumulation follow in the classical GR model.'], ['Receptor dimer binds a response element', 'Its DNA-binding domain contains two C4 zinc fingers.'], ['Coregulators alter transcription', 'The receptor itself participates in transcriptional control.']], reset: 'Scope: a classical glucocorticoid-receptor route. “Type I” does not make every unliganded steroid receptor exclusively cytosolic.'},
  'Nuclear II': {receptor:'Nuclear',steps: [['Intracellular ligand reaches a nuclear receptor', 'Thyroid-hormone and retinoic-acid receptors are the teaching examples.'], ['A DNA-associated receptor complex changes state', 'In the classical model, an unliganded receptor/RXR complex can recruit corepressors.'], ['Ligand shifts coregulator recruitment', 'Corepressor release and coactivator recruitment alter transcription.'], ['Target genes change expression', 'Response-element sequence, cofactors, and cell context determine the outcome.']], reset: 'Distinction: transcription changes through a ligand-regulated receptor complex, rather than a required membrane-to-kinase cascade.'}
};
function receptorSchematic(kind, width) {
  const label = (x, y, value, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}">${escape(value)}</text>`;
  let body, title;
  if (kind === 'Nuclear') {
    title = 'Activated nuclear receptor with DNA-binding and ligand-binding domains, shown at DNA.';
    const center = width / 2, dx = (width - 24) / 12;
    const dna = y => `M12,${y}q${dx/2},${y===145?-12:12} ${dx},0` + `t${dx},0`.repeat(11);
    body = label(4, 22, 'Nucleus', 'start') + label(width - 4, 22, 'Ligand', 'end') +
      `<circle cx="${center + 49}" cy="51" r="9" fill="none" stroke="currentColor"/>
       <path d="M${center + 49},60v16 ${dna(145)} ${dna(155)}" stroke="currentColor" fill="none"/>
       <rect x="${center - 64}" y="76" width="64" height="40" rx="4" fill="var(--color-bg)" stroke="currentColor"/>
       <rect x="${center}" y="76" width="82" height="40" rx="4" fill="var(--color-bg)" stroke="currentColor"/>
       <path d="M${center - 32},116v29" stroke="currentColor"/>` +
       label(center - 32, 102, 'DBD') + label(center + 41, 102, 'LBD') + label(center, 194, 'DNA-bound active state');
  } else {
    const name = {RTK:'Intrinsic Tyr kinase',JAK:'Associated JAK kinase',SMAD:'Intrinsic Ser/Thr kinase'}[kind];
    title = name + '; extracellular ligand and membrane-spanning receptor are schematic.';
    body = label(4, 22, 'Outside', 'start') + label(4, 162, 'Cytosol', 'start') +
      `<path d="M0,70H${width}M0,80H${width}" stroke="var(--color-border)" stroke-width="3"/>`;
    for (const x of [width * .37, width * .63]) {
      const kinase = kind === 'JAK' ? x + 23 : x;
      body += `<circle cx="${x}" cy="43" r="10" fill="var(--color-bg)" stroke="currentColor"/>
        <path d="M${x},53v78" stroke="currentColor" stroke-width="4"/>
        ${kind === 'JAK' ? `<path d="M${x},121h23" stroke="currentColor" stroke-dasharray="3 3"/>` : ''}
        <circle cx="${kinase}" cy="121" r="18" fill="var(--color-bg)" stroke="currentColor"/>` +
        label(kinase, 127, kind === 'JAK' ? 'J' : 'K');
    }
    body += `<path d="M${width*.37+10},43H${width*.63-10}" stroke="currentColor"/>` + label(width / 2, 194, name);
  }
  return `<svg class="signaling-schematic" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="fig-signal-2-receptor-title" viewBox="0 0 ${width} 216"><title id="fig-signal-2-receptor-title">${escape(title)}</title>${body}</svg>`;
}
export function renderRoute(routes, value, width) {
  const route = routes[value];
  return {html: (route.receptor ? receptorSchematic(route.receptor, width) : '') + pathway(route.steps), readout: route.reset};
}
