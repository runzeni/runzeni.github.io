import {pathway, renderPhotoreceptor, renderRoute, gProteinRoutes, receptorRoutes} from './signaling-models.mjs';

// Shared by the static figure generator and browser. No DOM or dependencies.
export const clamp = (x, a=0, b=1) => Math.max(a, Math.min(b, x));
export const srgb = x => x <= .0031308 ? 12.92*x : 1.055*x**(1/2.4)-.055;
export const pq = L => { const y=(L/10000)**(2610/16384); return ((3424/4096+2413/128*y)/(1+2392/128*y))**(2523/32); };
export const pqInverse = N => { const n=N**(32/2523); return 10000*(Math.max(n-3424/4096,0)/(2413/128-2392/128*n))**(16384/2610); };
export const hlg = E => { const a=.17883277,b=1-4*a,c=.5-a*Math.log(4*a); return E<=1/12 ? Math.sqrt(3*E) : a*Math.log(12*E-b)+c; };
export const logC3 = x => x>.010591 ? .247190*Math.log10(5.555556*x+.052272)+.385537 : 5.367655*x+.092809;
const a=(2**18-16)/117.45,b=(1023-95)/1023,c=95/1023;
export const logC4Threshold=(2**(6-14*c/b)-64)/a;
const s=7*Math.LN2*2**(7-14*c/b)/(a*b);
export const logC4 = x => x>=logC4Threshold ? (Math.log2(a*x+64)-6)/14*b+c : (x-logC4Threshold)/s;
export const logC4Inverse = x => x>=0 ? (2**(14*(x-c)/b+6)-64)/a : x*s+logC4Threshold;
export const blackbody = (nm,T) => 1/(nm**5*Math.expm1(1.438776877e7/(nm*T)));
const gauss = (x,m,s) => Math.exp(-.5*((x-m)/s)**2);
export const led = nm => .8*gauss(nm,450,12)+gauss(nm,575,55);
const seq = (n,a=0,b=1) => Array.from({length:n},(_,i)=>a+(b-a)*i/(n-1));
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const palette=['#b14f3b','#367d92','#598453','#8b65a4'];
const key=(name,i,dash='solid')=>({name,color:palette[i],dash});
export const gamuts={
 'Rec.709':[[.640,.330],[.300,.600],[.150,.060]],
 'Rec.2020':[[.708,.292],[.170,.797],[.131,.046]],
 'AP1':[[.713,.293],[.165,.830],[.128,.044]],
 'AP0':[[.7347,.2653],[0,1],[.0001,-.077]],
 'AWG3':[[.684,.313],[.221,.848],[.0861,-.102]],
 'AWG4':[[.7347,.2653],[.1424,.8576],[.0991,-.0308]]
};
const CIE='https://doi.org/10.25039/CIE.DS.xvudnb9b';
const ARRI='https://www.arri.com/en/learn/camera-systems/image-science/log-c';
const APPENDIX='/notes/colorimetry/appendix-mathematics/';
const range=(label,min,max,step,value)=>({label,min,max,step,value});
const choice=(label,options,value=options[0])=>({label,options,value});
export const figures={
 '1-1':{title:'Spectral shape',note:'Planck blackbody, peak-normalized; synthetic LED example, not a measured fixture.',source:APPENDIX,control:range('Temperature · K',2500,7500,100,3200)},
 '1-2':{title:'A match depends on the light',note:'Synthetic reflectances constructed to match under equal-energy illumination, using sampled CIE XYZ. Numerical example, not measured materials; swatches are approximate sRGB previews.',source:CIE,control:range('Light · equal-energy → synthetic LED',0,1,.05,0)},
 '1-3':{title:'Retinal organization',note:'Qualitative receptor arrangement, not anatomical scale or measured density. The optic disc is separate from the fovea.',source:'https://pubmed.ncbi.nlm.nih.gov/2324310/'},
 '1-4':{title:'Cone fundamentals',note:'CIE 2006 2° energy-based LMS functions. Missing S-cone values beyond the published range are omitted, not invented.',source:'https://doi.org/10.25039/CIE.DS.tijidesg',control:choice('Channel',['All','L','M','S'])},
 '1-6':{title:'Same signal, different surround',note:'Both central patches are sRGB #808080. An appearance demonstration, not calibrated luminance.',source:APPENDIX,control:range('Right surround · sRGB code',0,255,1,230)},
 '1-5':{parallel:true,title:'Two observers of one spectrum',note:'Schematic. A camera matrix approximates a change of observer; it cannot reconstruct an arbitrary spectrum.',source:CIE,steps:[['Light × surface','Spectrum arriving at the observer'],['Human observer','Integrate with standard color-matching functions → XYZ'],['Camera','Integrate with sensor sensitivities → camera RGB']]},
 '1-7':{title:'Find the blind spot',note:'Close your left eye and fix your right eye on the cross. Adjust separation or viewing distance until the dot disappears. Keep looking at the cross; the dot remains on screen.',source:'https://www.exploratorium.edu/snacks/blind-spot',control:range('Target separation · % of figure width',20,65,1,50)},
 '1-8':{title:'A color that is no longer there',note:'Look at the cross for about 15 seconds, then choose Neutral without shifting your gaze. A brief afterimage may appear. Appearance and strength vary; this is not a calibration test.',source:'https://www.exploratorium.edu/snacks/bird-in-cage',control:choice('Field',['Color','Neutral'])},
 '1-9':{title:'Light closes the channel',note:'Qualitative rod schematic. Dots indicate relative cGMP, not measured concentrations or timing. Recovery follows a brief flash.',source:'https://pubmed.ncbi.nlm.nih.gov/3386743/',control:choice('Photoreceptor',['Dark','Light','Recovery'])},
 '2-0':{parallel:true,title:'Munsell coordinates',note:'Coordinate schematic, not a rendered Munsell solid or reference color chips.',source:APPENDIX,steps:[['Hue','Around the neutral axis'],['Value','From dark to light'],['Chroma','Outward from neutral; available extent varies']]},
 '2-1':{title:'Put the negative primary on the test side',note:'Computed from CIE XYZ data; RGB units are defined in the appendix. The neutral split field is schematic, not a calibrated spectral match.',source:APPENDIX+'#cie-rgb',control:choice('Test wavelength',['450 nm','530 nm','600 nm'],'530 nm')},
 '2-2':{title:'Chromaticity and wavelength',note:'CIE 1931 2° locus, sampled every 5 nm from 360–830 nm. D65 and equal-energy E are distinct white points.',source:CIE,control:range('Wavelength · nm',380,700,5,550)},
 '2-3':{title:'Equal Lab steps in xy',note:'Calculated circles: L*=60, ΔE76 radius=5, D65. Not measured MacAdam ellipses or visibility thresholds.',source:'https://cie.co.at/eilvterm/17-23-076'},
 '2-4':{title:'Density against log exposure',note:'Illustrative logistic curve D=0.2+2.8/(1+exp(−2 logE)); not a film-stock measurement.',source:APPENDIX},
 '2-5':{title:'The same matches, different coordinates',note:'CIE RGB curves are reconstructed by an inverse linear transform of the published XYZ functions. Both views use the same vertical scale; these are matching coefficients, not cone sensitivities.',source:APPENDIX+'#cie-rgb',control:choice('Coordinate system',['CIE RGB','CIE XYZ'])},
 '2-6':{title:'Two lights make a straight mixing line',note:'Ideal monochromatic lights at 450 and 650 nm, with fixed total radiant power. Add XYZ before calculating xy. The line shows mixtures; the outlined marker is the geometric midpoint, not necessarily the equal-power mixture.',source:CIE,control:range('650 nm share of radiant power · %',0,100,1,50)},
 '2-7':{title:'Chromaticity leaves out intensity',note:'One synthetic in-gamut stimulus, scaled in linear sRGB. XYZ and relative luminance Y scale together; xy stays fixed. The swatch is an SDR preview, not a calibrated luminance source.',source:'https://www.color.org/srgb.pdf',control:choice('Light level',['Quarter','Half','Full'],'Full')},
 '3-1':{title:'Reference and encoding',note:'Schematic. Either reference domain can use linear or nonlinear encoding.',source:APPENDIX,steps:[['Scene light','Capture or rendering'],['Working values','Decode → process → render for output'],['Display light','Output encoding → display response']]},
 '3-2':{parallel:true,title:'Coordinates have different jobs',note:'Schematic. Coordinates need a defined space and viewing assumptions.',source:APPENDIX,steps:[['RGB / HSL / HSV','RGB components or rearrangements of them'],['Y′CbCr','Encoded luma and chroma differences'],['CIELAB','Approximate lightness and opponent coordinates']]},
 '3-3':{title:'Linear, sRGB, and a power law',note:'Encoding curves over [0,1]; no display-luminance prediction.',source:'https://www.color.org/srgb.pdf',control:range('Gamma',1,3,.1,2.2)},
 '3-4':{title:'Compression keeps highlight distinctions',note:'Illustrative x/(1+x) versus clipping. Neither curve represents AgX, Filmic, or ACES.',source:APPENDIX,control:range('Exposure · stops',-2,2,.25,0)},
 '4-1':{title:'Primary coordinates',note:'CIE 1931 xy. Triangles are coordinate boundaries, not perceptual gamut volumes. AP0 and AP1 include nonphysical primaries.',source:'https://docs.acescentral.com/encodings/acescg/',control:choice('Compare with Rec.709',['Rec.2020','AP1','AP0','All'],'All')},
 '4-2':{title:'Clipping versus a smooth limit',note:'Toy chroma model: identity to the knee, then an exponential shoulder. Not ACES Reference Gamut Compression.',source:APPENDIX,control:range('Compression knee',.2,.8,.1,.5)},
 '4-3':{title:'An ACES viewing path',note:'Schematic; record transform and configuration versions. Archive the source and its interpretation.',source:'https://docs.acescentral.com/system-components/output-transforms/',steps:[['Input transform','Known camera encoding → ACES'],['Working image + look','Scene-referred processing'],['Output transform','Target-specific rendering and encoding'],['Display','Verified mode and viewing conditions']]},
 '5-1':{title:'Two HDR encodings',note:'PQ takes absolute display luminance; HLG OETF takes relative scene light. This SDR graph does not emit HDR test luminances.',source:'https://www.itu.int/rec/R-REC-BT.2100/en',control:choice('Function',['PQ','HLG'])},
 '5-2':{title:'Change the surround',note:'Central patches remain sRGB #808080. This local demonstration does not measure a room-surround correction.',source:APPENDIX,control:range('Right surround · sRGB code',0,255,1,40)},
 '5-3':{parallel:true,title:'Tags describe the signal',note:'Schematic. 1–2–1 means unspecified transfer, not gamma 2.4. Range is a separate field.',source:'https://www.itu.int/rec/T-REC-H.273/en',steps:[['1 · Primaries','BT.709'],['1 or 2 · Transfer','BT.709 or unspecified'],['1 · Matrix','BT.709 luma/chroma coefficients']]},
 '6-1':{title:'LogC at a selected exposure',note:'LogC3 EI800 and LogC4 software encoding, floating point. Curves do not measure sensor dynamic range.',source:ARRI,control:range('Exposure above 18% · stops',-8,6,.25,0)},
 '6-2':{title:'ARRI working-space coordinates',note:'AWG3 and AWG4 primaries, both D65. Not measured sensor gamuts or spectral sensitivities.',source:ARRI,control:choice('Camera space',['AWG3','AWG4','Both'],'Both')},
 '6-3':{title:'A Bayer mosaic',note:'One filtered sample per site. Labels identify the channel; color is schematic. Demosaicing estimates the other channels.',source:'https://www.libraw.org/docs/API-datastruct-eng.html',control:choice('Orientation',['RGGB','BGGR','GRBG','GBRG'])},
 '7-1':{title:'Linear and nonlinear geometry',note:'Toy 2D slice: (u,v)=(x+0.2y,y) versus (x+0.2y,y+k sin(πx)). Not a fitted camera transform.',source:APPENDIX,control:range('Bend k',0,.3,.05,.15)},
 'signal-1':{number:'S1',article:'_notes/signal-transduction.md',title:'One G-protein switch, different effectors',note:'Choose a Gα family. The path and its reset change together; competing inputs and Gβγ signaling are not drawn in full.',source:'/notes/signal-transduction/#sources',control:choice('Gα family',Object.keys(gProteinRoutes))},
 'signal-2':{number:'S2',article:'_notes/signal-transduction.md',title:'Different routes to a cellular response',note:'Compare the location of the kinase, messenger, and transcriptional regulator. Each path is a teaching example within a connected network.',source:'/notes/signal-transduction/#sources',control:choice('Signaling route',Object.keys(receptorRoutes))},
 '7-2':{title:'Why clipping has no inverse',note:'y=min(x,limit): every input above the limit shares one output. No interpolation method can recover the lost distinction.',source:APPENDIX,control:range('Clip limit',.3,.9,.1,.7)}
};
const text=(x,y,t,anchor='start')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${esc(t)}</text>`;
function chart(width,{xmin=0,xmax=1,ymin=0,ymax=1,xlabel='Input',ylabel='Output',square=false}={}) {
 const h=square?width+15:Math.round(width*.55+95), left=58,right=18,top=36,bottom=48;
 // Equal unit scaling for xy, so triangles and distances are not distorted.
 const pw=width-left-right, ph=h-top-bottom, scale=Math.min(pw/(xmax-xmin),ph/(ymax-ymin));
 const x=v=>left+(square?(pw-scale*(xmax-xmin))/2:0)+(v-xmin)*(square?scale:pw/(xmax-xmin));
 const y=v=>h-bottom-(square?(ph-scale*(ymax-ymin))/2:0)-(v-ymin)*(square?scale:ph/(ymax-ymin));
 let body=text(left,18,ylabel)+text(width/2,h-5,xlabel,'middle');
 for (let i=0;i<5;i++) { const xx=xmin+(xmax-xmin)*i/4, yy=ymin+(ymax-ymin)*i/4;
  const fmt=v=>Math.abs(v)>=100?String(Math.round(v)):String(Number(v.toFixed(2)));
  body+=`<path class="chart-grid" d="M${x(xx)},${y(ymin)}V${y(ymax)}M${x(xmin)},${y(yy)}H${x(xmax)}"/>`;
  body+=text(x(xx),h-bottom+22,fmt(xx),'middle')+text(left-8,y(yy)+5,fmt(yy),'end');
 }
 const line=(pts,color=palette[0],dash='')=>`<path d="${pts.filter(p=>p.every(Number.isFinite)).map((p,i)=>`${i?'L':'M'}${x(p[0]).toFixed(2)},${y(p[1]).toFixed(2)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
 return {width,h,x,y,body,line};
}
const labXY=(L,A,B)=>{const fy=(L+16)/116, inv=t=>t>6/29?t**3:3*(6/29)**2*(t-4/29);const X=.95047*inv(fy+A/500),Y=inv(fy),Z=1.08883*inv(fy-B/200);return [X/(X+Y+Z),Y/(X+Y+Z)];};
// Orthogonal projection removes all XYZ response from an arbitrary spectrum.
// A fixed equal-energy source then makes .5 and .5+perturbation metamers.
export function metamer(data,change=0) {
 const rows=data.xyz.filter(r=>r[0]>=380&&r[0]<=780);
 const basis=[];
 for(let j=1;j<=3;j++) {let q=rows.map(r=>r[j]);for(const u of basis){const d=q.reduce((s,v,i)=>s+v*u[i],0);q=q.map((v,i)=>v-d*u[i]);}const n=Math.hypot(...q);basis.push(q.map(v=>v/n));}
 let v=rows.map(r=>Math.sin((r[0]-380)/25));
 for(const u of basis){const d=v.reduce((s,x,i)=>s+x*u[i],0);v=v.map((x,i)=>x-d*u[i]);}
 const peak=Math.max(...v.map(Math.abs));v=v.map(x=>.4*x/peak);
 const lamp=rows.map(r=>(1-change)+change*led(r[0]));
 const norm=rows.reduce((s,r,i)=>s+lamp[i]*r[2],0);
 const xyz=offset=>[1,2,3].map(j=>rows.reduce((s,r,i)=>s+lamp[i]*(.5+offset*v[i])*r[j],0)/norm);
 return {rows,v,lamp,A:xyz(0),B:xyz(1)};
}
// Equal-energy-normalized CIE RGB basis: M maps RGB=(1,1,1) to XYZ=(1,1,1).
// Rounded historical transformation; provenance and units are in the appendix.
export const cieRGBToXYZMatrix=[[.49,.31,.20],[.17697,.81240,.01063],[0,.01,.99]];
const inverse3 = m => {
 const [[a,b,c],[d,e,f],[g,h,i]]=m, det=a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g);
 return [[e*i-f*h,c*h-b*i,b*f-c*e],[f*g-d*i,a*i-c*g,c*d-a*f],[d*h-e*g,b*g-a*h,a*e-b*d]].map(row=>row.map(v=>v/det));
};
const multiply=(m,v)=>m.map(row=>row.reduce((sum,x,i)=>sum+x*v[i],0));
const xyzToCIERGBMatrix=inverse3(cieRGBToXYZMatrix);
export const xyzToCIERGB=xyz=>multiply(xyzToCIERGBMatrix,xyz);
export const cieRGBToXYZ=rgb=>multiply(cieRGBToXYZMatrix,rgb);
export const chromaticity=xyz=>{const sum=xyz.reduce((a,b)=>a+b,0);return sum>0?[xyz[0]/sum,xyz[1]/sum]:null;};
export const spectralMixture=(data,fraction)=>{
 const blue=data.xyz.find(r=>r[0]===450).slice(1),red=data.xyz.find(r=>r[0]===650).slice(1);
 const xyz=blue.map((v,i)=>(1-fraction)*v+fraction*red[i]);
 return {blue,red,xyz,xy:chromaticity(xyz)};
};
export const intensitySample=level=>{
 const scale={Quarter:.25,Half:.5,Full:1}[level],rgb=[.2,.4,.1].map(v=>v*scale);
 const xyz=multiply([[.4124,.3576,.1805],[.2126,.7152,.0722],[.0193,.1192,.9505]],rgb);
 return {scale,rgb,xyz,xy:chromaticity(xyz)};
};
export const xyzToDisplay = ([X,Y,Z]) => [3.2406*X-1.5372*Y-.4986*Z, -.9689*X+1.8758*Y+.0415*Z, .0557*X-.2040*Y+1.0570*Z].map(v=>Math.round(255*srgb(clamp(v))));
const displayRGB = rgb => `rgb(${rgb.map(v=>Math.round(255*srgb(clamp(v)))).join(',')})`;
const diagram = (id,width,height,body) => `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="fig-${id}-title" viewBox="0 0 ${width} ${height}"><title id="fig-${id}-title">${esc(figures[id].title)}</title>${body}</svg>`;
export function renderFigure(id,value,data,width=360) {
 const f=figures[id];value=value??f.control?.value;const n=Number(value);
 if(id==='1-9') return renderPhotoreceptor(value,width);
 if(id==='signal-1') return renderRoute(gProteinRoutes,value,width);
 if(id==='signal-2') return renderRoute(receptorRoutes,value,width);
 if(f.steps) {
  const steps=typeof f.steps==='function'?f.steps(value):f.steps;
  const html=id==='1-5'?pathway(steps.slice(0,1))+pathway(steps.slice(1),true):pathway(steps,f.parallel);
  return {html,readout:''};
 }
 let p,body='',legend=[],readout='',extra='';
 if(id==='1-3') {
  const cone=(x,y)=>`<path d="M${x-4},${y+28} L${x},${y} L${x+4},${y+28} Z" fill="${palette[0]}"/>`;
  const rod=(x,y)=>`<rect x="${x-2}" y="${y}" width="4" height="28" rx="2" fill="${palette[1]}"/>`;
  body+=text(width/2,20,'A strip across the retina','middle');
  const bands=[['Mixed',.03,.28],['Foveal center',.31,.62],['Mixed',.65,.79],['Disc',.83,.98]];
  for(const [label,l,r] of bands) {
   body+=`<rect x="${l*width}" y="42" width="${(r-l)*width}" height="110" rx="5" fill="none" stroke="var(--color-border)"/>`+text((l+r)/2*width,174,label==='Foveal center'?'Foveal':label,'middle')+(label==='Foveal center'?text((l+r)/2*width,196,'center','middle'):'');
   if(label==='Disc')continue;
   const count=label==='Foveal center'?7:5;
   for(let i=0;i<count;i++) {const x=(l+(r-l)*(i+1)/(count+1))*width;body+=(label==='Foveal center'||i%3===0?cone:rod)(x,78);}
  }
  body+=text(10,232,'Cones: triangles · Rods: bars')+text(10,258,'Disc: no rods or cones');
  return {html:diagram(id,width,280,body),readout:'The foveal center has densely packed cones and no rods. The optic disc has neither; it produces the blind spot.'};
 }
 if(id==='1-7') {
  const x=.15*width,y=95,dx=x+n/100*width;
  body=`<rect width="${width}" height="190" fill="#f5f5f5"/><path d="M${x-8},${y}h16 M${x},${y-8}v16" stroke="#161616" stroke-width="2"/><circle cx="${dx}" cy="${y}" r="7" fill="#161616"/>`;
  return {html:diagram(id,width,190,body),readout:`The target stays drawn ${n}% of the figure width to the right of fixation. Its disappearance is perceptual, not an animation.`};
 }
 if(id==='1-8') {
  const y=110,x=width/2;
  body=`<rect width="${width}" height="220" fill="#d0d0d0"/>`;
  if(value==='Color') body+=`<rect x="${x-width*.28}" y="35" width="${width*.28}" height="150" fill="#d23b35"/><rect x="${x}" y="35" width="${width*.28}" height="150" fill="#328b96"/>`;
  body+=`<path d="M${x-7},${y}h14 M${x},${y-7}v14" stroke="#111" stroke-width="2"/>`;
  return {html:diagram(id,width,220,body),readout:value==='Color'?'Fix on the cross, then choose Neutral.':'The field is now uniform gray. Any lingering color is an afterimage.'};
 }
 if(id==='2-1') {
  const nm=parseInt(value),rgb=xyzToCIERGB(data.xyz.find(r=>r[0]===nm).slice(1));
  const cx=width/2,cy=80,rad=48,left=width*.25,right=width*.75;
  body=text(cx,18,'A small split field','middle')+`<circle cx="${cx}" cy="${cy}" r="${rad}" fill="var(--color-border)" stroke="currentColor"/><path d="M${cx},${cy-rad}v${2*rad}" stroke="currentColor"/>`;
  body+=text(left,155,'Test side','middle')+text(right,155,'Mixture side','middle');
  body+=text(left,182,`${nm} nm light`,'middle')+text(right,182,'Positive primaries','middle');
  rgb.forEach((v,i)=>{
   const name=['R','G','B'][i],y=218+i*34;
   body+=text(left,y,v<0?`+ ${(-v).toFixed(4)} ${name}`:'—','middle')+text(right,y,v>0?`${v.toFixed(4)} ${name}`:'—','middle');
  });
  body+=`<path d="M${cx},166v130" stroke="var(--color-border)"/>`;
  const negatives=rgb.map((v,i)=>v<0?['red','green','blue'][i]:null).filter(Boolean);
  return {html:diagram(id,width,305,body),readout:`${nm} nm: R=${rgb[0].toFixed(4)}, G=${rgb[1].toFixed(4)}, B=${rgb[2].toFixed(4)}. Add ${negatives.join(' and ')} to the test side to balance the match.`};
 }
 if(id==='2-7') {
  const sample=intensitySample(value),{rgb,xyz,xy}=sample;
  body=`<rect x="0" y="0" width="${width}" height="110" fill="${displayRGB(rgb)}"/>`;
  body+=text(0,142,`Relative Y = ${xyz[1].toFixed(4)}`);
  body+=`<rect x="0" y="157" width="${width}" height="12" fill="var(--color-border)"/><rect x="0" y="157" width="${width*sample.scale}" height="12" fill="var(--color-text)"/>`;
  body+=text(0,201,`x = ${xy[0].toFixed(4)} · y = ${xy[1].toFixed(4)}`);
  return {html:diagram(id,width,216,body),readout:`${value} light: XYZ=(${xyz.map(x=>x.toFixed(4)).join(', ')}). Chromaticity is unchanged. At zero light there is no chromaticity.`};
 }
 if(id==='2-5') {
  p=chart(width,{xmin:380,xmax:780,ymin:-.75,ymax:2.25,xlabel:'Wavelength · nm',ylabel:'Matching coefficient'});
  const rgbMode=value==='CIE RGB',rows=data.xyz.filter(r=>r[0]>=380&&r[0]<=780);
  const values=rows.map(row=>[row[0],...(rgbMode?xyzToCIERGB(row.slice(1)):row.slice(1))]);
  for(let i=0;i<3;i++)body+=p.line(values.map(row=>[row[0],row[i+1]]),palette[i],['','5 3','2 3'][i]);
  body+=p.line([[380,0],[780,0]],'var(--color-text)','3 3');
  legend=(rgbMode?['r̄','ḡ','b̄']:['x̄','ȳ','z̄']).map((name,i)=>key(name,i,['solid','dashed','dotted'][i]));
  readout=rgbMode?'Below zero means the primary belongs on the test side. The chosen RGB units make equal-energy white R=G=B.':'XYZ removes negative matching coefficients for physical spectra. The ȳ function is the standard photopic luminous-efficiency function; x̄ and z̄ are not cone curves.';
 }

 if(['1-6','5-2'].includes(id)) {
  return {html:`<div class="contrast-pair"><div style="background:rgb(25,25,25)"><span></span></div><div style="background:rgb(${n},${n},${n})"><span></span></div></div>`,readout:`Center: 128 / 255 on both sides. Right surround: ${n} / 255.`};
 }
 if(id==='6-3') {
  return {html:`<div class="bayer-grid">${Array.from({length:36},(_,i)=>{const letter=value[(Math.floor(i/6)%2)*2+i%2];return `<span class="bayer-${letter}">${letter}</span>`;}).join('')}</div>`,readout:`${value}: 18 green, 9 red, 9 blue sites in this 6 × 6 sample.`};
 }
 if(['1-1','1-2','1-4'].includes(id)) {
  p=chart(width,{xmin:380,xmax:780,xlabel:'Wavelength · nm',ylabel:id==='1-2'?'Reflected spectral power':'Relative response'});
  if(id==='1-1') {const xs=seq(161,380,780),bb=xs.map(x=>blackbody(x,n)),ll=xs.map(led),bp=Math.max(...bb),lp=Math.max(...ll);body+=p.line(xs.map((x,i)=>[x,bb[i]/bp]))+p.line(xs.map((x,i)=>[x,ll[i]/lp]),palette[1],'5 3');legend=[key('Blackbody',0),key('Synthetic LED',1,'dashed')];readout=`Blackbody ${n} K; curves independently normalized to peak 1.`;}
  if(id==='1-2') {
   const m=metamer(data,n);
   body+=p.line(m.rows.map((r,i)=>[r[0],m.lamp[i]*.5]))+p.line(m.rows.map((r,i)=>[r[0],m.lamp[i]*(.5+m.v[i])]),palette[1],'5 3');
   legend=[key('Sample A under this light',0),key('Sample B under this light',1,'dashed')];
   const diff=Math.hypot(...m.A.map((x,i)=>x-m.B[i]));
   extra=`<div class="metamer-swatches" aria-label="Approximate sRGB previews">${[m.A,m.B].map((xyz,i)=>`<div><span style="background:rgb(${xyzToDisplay(xyz).join(',')})"></span><small>Sample ${i?'B':'A'}</small></div>`).join('')}</div>`;
   readout=`${n===0?'A match under equal-energy light.':'The illuminant changes; the material reflectances do not.'} XYZ distance: ${diff.toFixed(5)} (not ΔE).`;
  }
  if(id==='1-4') {['L','M','S'].forEach((name,i)=>{if(value==='All'||value===name){body+=p.line(data.lms.filter(r=>r[0]>=380&&r[0]<=780&&r[i+1]!==null).map(r=>[r[0],r[i+1]]),palette[i],i===1?'5 3':i===2?'2 3':'');legend.push(key(name,i,['solid','dashed','dotted'][i]));}});readout=`Showing ${value==='All'?'L, M, and S':value}. Published standard-observer functions.`;}
 }
 if(['2-2','2-3','2-6','4-1','6-2'].includes(id)) {
  p=chart(width,{xmin:0,xmax:.8,ymin:-.15,ymax:1,xlabel:'x',ylabel:'y',square:true});
  const locus=data.xyz.filter(r=>r[0]>=360&&r[0]<=830).map(r=>[r[1]/(r[1]+r[2]+r[3]),r[2]/(r[1]+r[2]+r[3])]);
  body+=p.line(locus,'var(--color-text-light)')+p.line([locus[0],locus.at(-1)],'var(--color-text-light)','3 3');
  if(id==='2-6') {
   const mix=spectralMixture(data,n/100),blue=chromaticity(mix.blue),red=chromaticity(mix.red),mid=blue.map((v,i)=>(v+red[i])/2);
   body+=p.line([blue,red],palette[1]);
   for(const [label,point] of [['450 nm',blue],['650 nm',red]])body+=`<circle cx="${p.x(point[0])}" cy="${p.y(point[1])}" r="4" fill="currentColor"/>`+text(p.x(point[0]),p.y(point[1])-12,label,'middle');
   body+=`<circle cx="${p.x(mid[0])}" cy="${p.y(mid[1])}" r="6" fill="none" stroke="currentColor" stroke-dasharray="2 2"/>`;
   const x=p.x(mix.xy[0]),y=p.y(mix.xy[1]);
   body+=`<path d="M${x},${y-7}l7,7 -7,7 -7,-7Z" fill="var(--color-highlight, #F3CF6D)" stroke="currentColor"/>`;
   readout=`${n}% red power + ${100-n}% blue power: x=${mix.xy[0].toFixed(4)}, y=${mix.xy[1].toFixed(4)}. Diamond: mixture; outlined circle: geometric midpoint. Equal radiant powers need not land halfway along xy.`;
  } else if(id==='2-2') {const row=data.xyz.find(r=>r[0]===n),sum=row[1]+row[2]+row[3],xx=row[1]/sum,yy=row[2]/sum;
   body+=`<circle cx="${p.x(xx)}" cy="${p.y(yy)}" r="5" fill="${palette[0]}"/>`;
   for(const [name,x,y,dy] of [['D65',.3127,.329,20],['E',1/3,1/3,-10]])body+=`<circle cx="${p.x(x)}" cy="${p.y(y)}" r="3" fill="currentColor"/>`+text(p.x(x)+8,p.y(y)+dy,name);
   readout=`${n} nm: x=${xx.toFixed(4)}, y=${yy.toFixed(4)}.`;
  } else if(id==='2-3') {for(const [A,B] of [[-40,20],[0,0],[40,20],[0,-40],[0,50]])body+=p.line(seq(81,0,Math.PI*2).map(t=>labXY(60,A+5*Math.cos(t),B+5*Math.sin(t))),palette[1]);readout='Five circles of equal radius in the a*b* plane become unequal shapes in xy.';
  } else {const names=id==='6-2'?(value==='Both'?['AWG3','AWG4']:[value]):['Rec.709',...(value==='All'?['Rec.2020','AP1','AP0']:[value])];names.forEach((name,i)=>{body+=p.line([...gamuts[name],gamuts[name][0]],palette[i],i%2?'5 3':'');});legend=names.map((name,i)=>key(name,i,i%2?'dashed':'solid'));readout=`Showing ${names.join(', ')}. xy area does not measure perceptual gamut volume.`;}
 }
 if(id==='2-4'){p=chart(width,{xmin:-3,xmax:3,ymax:3.2,xlabel:'Relative log₁₀ exposure',ylabel:'Optical density D'});body+=p.line(seq(161,-3,3).map(x=>[x,.2+2.8/(1+Math.exp(-2*x))]));readout='Toe → near-linear region → shoulder; illustrative curve.';}
 if(id==='3-3'){p=chart(width,{xlabel:'Linear input',ylabel:'Encoded signal'});[x=>x,srgb,x=>x**(1/n)].forEach((fn,i)=>body+=p.line(seq(181).map(x=>[x,fn(x)]),palette[i],i===0?'5 3':''));legend=[key('Linear',0,'dashed'),key('sRGB',1),key(`Gamma ${n.toFixed(1)}`,2)];readout=`At 0.18: sRGB ${srgb(.18).toFixed(3)}; gamma ${n.toFixed(1)} ${(.18**(1/n)).toFixed(3)}.`;}
 if(id==='3-4'){p=chart(width,{xmax:8,xlabel:'Scene-linear input',ylabel:'Mapped output'});const e=2**n;body+=p.line(seq(161,0,8).map(x=>[x,Math.min(e*x,1)]))+p.line(seq(161,0,8).map(x=>[x,e*x/(1+e*x)]),palette[1],'5 3');legend=[key('Clip',0),key('x / (1 + x)',1,'dashed')];readout=`Exposure multiplier ${e.toFixed(2)}×. At input 4, compressed output ${(4*e/(1+4*e)).toFixed(3)}.`;}
 if(id==='4-2'){p=chart(width,{xmax:2,xlabel:'Input chroma · arbitrary units',ylabel:'Output chroma'});const soft=x=>x<=n?x:n+(1-n)*(1-Math.exp(-(x-n)/(1-n)));body+=p.line(seq(161,0,2).map(x=>[x,Math.min(x,1)]))+p.line(seq(161,0,2).map(x=>[x,soft(x)]),palette[1],'5 3');legend=[key('Clip at 1',0),key('Smooth shoulder',1,'dashed')];readout=`Knee ${n.toFixed(1)}; mapping stays continuous with continuous slope.`;}
 if(id==='5-1'){const pqMode=value==='PQ';p=chart(width,{xmax:pqMode?4:1,xlabel:pqMode?'log₁₀ luminance · cd/m²':'Relative scene light E',ylabel:'Encoded signal'});body+=p.line(seq(241,0,pqMode?4:1).map(x=>[x,pqMode?pq(10**x):hlg(x)]),palette[1]);readout=pqMode?`PQ: 100 cd/m² → ${pq(100).toFixed(4)}; 1000 → ${pq(1000).toFixed(4)}. Log axis starts at 1 cd/m².`:`HLG OETF: E=1/12 → ${hlg(1/12).toFixed(3)}; E=1 → ${hlg(1).toFixed(3)}.`;}
 if(id==='6-1'){p=chart(width,{xmin:-8,xmax:6,xlabel:'Stops relative to 18%',ylabel:'Encoded signal'});[logC3,logC4].forEach((fn,i)=>{body+=p.line(seq(181,-8,6).map(x=>[x,fn(.18*2**x)]),palette[i],i?'5 3':'');body+=`<circle cx="${p.x(n)}" cy="${p.y(fn(.18*2**n))}" r="4" fill="${palette[i]}"/>`;});legend=[key('LogC3 EI800',0),key('LogC4',1,'dashed')];readout=`${n.toFixed(2)} stops: linear ${(.18*2**n).toFixed(5)}; LogC3 ${logC3(.18*2**n).toFixed(5)}; LogC4 ${logC4(.18*2**n).toFixed(5)}.`;}
 if(id==='7-1'){p=chart(width,{xmax:1.3,ymax:1.4,xlabel:'u',ylabel:'v'});for(const [i,k] of [[1,n],[0,0]])for(const t of seq(6))for(const vertical of [true,false])body+=p.line(seq(41).map(z=>{const x=vertical?t:z,y=vertical?z:t;return [x+.2*y,y+k*Math.sin(Math.PI*x)];}),palette[i],i===0?'4 4':'');legend=[key('Linear shear',0,'dashed'),key('Nonlinear bend',1)];readout=`Bend k=${n.toFixed(2)}. ${n===0?'At zero bend the two grids coincide. ':''}This selected toy map stays invertible; arbitrary fits need not.`;}
 if(id==='7-2'){p=chart(width,{xlabel:'Input x',ylabel:'Output y'});body+=p.line(seq(161).map(x=>[x,Math.min(x,n)]));body+=p.line([[n,n],[1,n]],palette[1],'4 3');readout=`All inputs from ${n.toFixed(1)} to 1 map to ${n.toFixed(1)}. The inverse is not unique.`;}
 const html=`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="fig-${id}-title" viewBox="0 0 ${width} ${p.h}"><title id="fig-${id}-title">${esc(f.title)}</title>${p.body}${body}</svg>`+(legend.length?`<ul class="color-legend">${legend.map((entry,i)=>{const {name,color,dash}=typeof entry==='string'?key(entry,i):entry;return `<li><span style="--curve-color:${color};--curve-style:${dash}" aria-hidden="true"></span>${esc(name)}</li>`;}).join('')}</ul>`:'');
 return {html:html+extra,readout};
}
