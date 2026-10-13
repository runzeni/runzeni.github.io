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
 '1-2':{title:'A match depends on the light',note:'Synthetic reflectances constructed to match under equal-energy illumination, using sampled CIE XYZ. This is a numerical example, not measured materials.',source:CIE,control:range('Illuminant change',0,1,.05,0)},
 '1-3':{title:'Retinal organization',note:'Schematic, not to scale or a density measurement.',source:'https://pubmed.ncbi.nlm.nih.gov/2324310/',steps:[['Foveal center','Dense cones; central rod-free zone'],['Surrounding retina','Rods and cones; changing density'],['Peripheral retina','Cones remain; spatial sampling differs']]},
 '1-4':{title:'Cone fundamentals',note:'CIE 2006 2° energy-based LMS functions. Missing S-cone values beyond the published range are omitted, not invented.',source:'https://doi.org/10.25039/CIE.DS.tijidesg',control:choice('Channel',['All','L','M','S'])},
 '1-5':{title:'Same signal, different surround',note:'Both central patches are sRGB #808080. An appearance demonstration, not calibrated luminance.',source:APPENDIX,control:range('Right surround · sRGB code',0,255,1,230)},
 '1-6':{title:'Two observers of one spectrum',note:'Schematic. A camera matrix approximates a change of observer; it cannot reconstruct an arbitrary spectrum.',source:CIE,steps:[['Light × surface','Spectrum arriving at the observer'],['Human observer','Integrate with standard color-matching functions → XYZ'],['Camera','Integrate with sensor sensitivities → camera RGB']]},
 '2-0':{title:'Munsell coordinates',note:'Coordinate schematic, not a rendered Munsell solid or reference color chips.',source:APPENDIX,steps:[['Hue','Around the neutral axis'],['Value','From dark to light'],['Chroma','Outward from neutral; available extent varies']]},
 '2-1':{title:'A matching experiment',note:'Schematic. A primary added to the test field is represented by a negative coefficient on the mixture side.',source:CIE,steps:[['Test field','A selected spectrum'],['Comparison field','Adjustable mixture of three primaries'],['Match','Equal appearance for the chosen observer and conditions']]},
 '2-2':{title:'Chromaticity and wavelength',note:'CIE 1931 2° locus, sampled every 5 nm from 360–830 nm. D65 and equal-energy E are distinct white points.',source:CIE,control:range('Wavelength · nm',380,700,5,550)},
 '2-3':{title:'Equal Lab steps in xy',note:'Calculated circles: L*=60, ΔE76 radius=5, D65. Not measured MacAdam ellipses or visibility thresholds.',source:'https://cie.co.at/eilvterm/17-23-076'},
 '2-4':{title:'Density against log exposure',note:'Illustrative logistic curve D=0.2+2.8/(1+exp(−2 logE)); not a film-stock measurement.',source:APPENDIX},
 '3-1':{title:'Reference and encoding',note:'Schematic. Either reference domain can use linear or nonlinear encoding.',source:APPENDIX,steps:[['Scene light','Capture or rendering'],['Working values','Decode → process → render for output'],['Display light','Output encoding → display response']]},
 '3-2':{title:'Coordinates have different jobs',note:'Schematic. Coordinates need a defined space and viewing assumptions.',source:APPENDIX,steps:[['RGB / HSL / HSV','RGB components or rearrangements of them'],['Y′CbCr','Encoded luma and chroma differences'],['CIELAB','Approximate lightness and opponent coordinates']]},
 '3-3':{title:'Linear, sRGB, and a power law',note:'Encoding curves over [0,1]; no display-luminance prediction.',source:'https://www.color.org/srgb.pdf',control:range('Gamma',1,3,.1,2.2)},
 '3-4':{title:'Compression keeps highlight distinctions',note:'Illustrative x/(1+x) versus clipping. Neither curve represents AgX, Filmic, or ACES.',source:APPENDIX,control:range('Exposure · stops',-2,2,.25,0)},
 '4-1':{title:'Primary coordinates',note:'CIE 1931 xy. Triangles are coordinate boundaries, not perceptual gamut volumes. AP0 and AP1 include nonphysical primaries.',source:'https://docs.acescentral.com/encodings/acescg/',control:choice('Compare with Rec.709',['Rec.2020','AP1','AP0','All'],'All')},
 '4-2':{title:'Clipping versus a smooth limit',note:'Toy chroma model: identity to the knee, then an exponential shoulder. Not ACES Reference Gamut Compression.',source:APPENDIX,control:range('Compression knee',.2,.8,.1,.5)},
 '4-3':{title:'An ACES viewing path',note:'Schematic; record transform and configuration versions. Archive the source and its interpretation.',source:'https://docs.acescentral.com/system-components/output-transforms/',steps:[['Input transform','Known camera encoding → ACES'],['Working image + look','Scene-referred processing'],['Output transform','Target-specific rendering and encoding'],['Display','Verified mode and viewing conditions']]},
 '5-1':{title:'Two HDR encodings',note:'PQ takes absolute display luminance; HLG OETF takes relative scene light. This SDR graph does not emit HDR test luminances.',source:'https://www.itu.int/rec/R-REC-BT.2100/en',control:choice('Function',['PQ','HLG'])},
 '5-2':{title:'Change the surround',note:'Central patches remain sRGB #808080. This local demonstration does not measure a room-surround correction.',source:APPENDIX,control:range('Right surround · sRGB code',0,255,1,40)},
 '5-3':{title:'Tags describe the signal',note:'Schematic. 1–2–1 means unspecified transfer, not gamma 2.4. Range is a separate field.',source:'https://www.itu.int/rec/T-REC-H.273/en',steps:[['1 · Primaries','BT.709'],['1 or 2 · Transfer','BT.709 or unspecified'],['1 · Matrix','BT.709 luma/chroma coefficients']]},
 '6-1':{title:'LogC at a selected exposure',note:'LogC3 EI800 and LogC4 software encoding, floating point. Curves do not measure sensor dynamic range.',source:ARRI,control:range('Exposure above 18% · stops',-8,6,.25,0)},
 '6-2':{title:'ARRI working-space coordinates',note:'AWG3 and AWG4 primaries, both D65. Not measured sensor gamuts or spectral sensitivities.',source:ARRI,control:choice('Camera space',['AWG3','AWG4','Both'],'Both')},
 '6-3':{title:'A Bayer mosaic',note:'One filtered sample per site. Labels identify the channel; color is schematic. Demosaicing estimates the other channels.',source:'https://www.libraw.org/docs/API-datastruct-eng.html',control:choice('Orientation',['RGGB','BGGR','GRBG','GBRG'])},
 '7-1':{title:'Linear and nonlinear geometry',note:'Toy 2D slice: (u,v)=(x+0.2y,y) versus (x+0.2y,y+k sin(πx)). Not a fitted camera transform.',source:APPENDIX,control:range('Bend k',0,.3,.05,.15)},
 '7-2':{title:'Why clipping has no inverse',note:'y=min(x,limit): every input above the limit shares one output. No interpolation method can recover the lost distinction.',source:APPENDIX,control:range('Clip limit',.3,.9,.1,.7)}
};
const text=(x,y,t,anchor='start')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${esc(t)}</text>`;
function chart(width,{xmin=0,xmax=1,ymin=0,ymax=1,xlabel='Input',ylabel='Output',square=false}={}) {
 const h=square?width+15:Math.round(width*.55+95), left=50,right=18,top=36,bottom=48;
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
 return {rows,v,A:xyz(0),B:xyz(1)};
}
export function renderFigure(id,value,data,width=360) {
 const f=figures[id];value=value??f.control?.value;const n=Number(value);
 if(f.steps) return {html:`<ol class="color-flow">${f.steps.map(([a,b])=>`<li><strong>${esc(a)}</strong><span>${esc(b)}</span></li>`).join('')}</ol>`,readout:''};
 let p,body='',legend=[],readout='';
 if(['1-5','5-2'].includes(id)) {
  return {html:`<div class="contrast-pair"><div style="background:rgb(25,25,25)"><span></span></div><div style="background:rgb(${n},${n},${n})"><span></span></div></div>`,readout:`Center: 128 / 255 on both sides. Right surround: ${n} / 255.`};
 }
 if(id==='6-3') {
  return {html:`<div class="bayer-grid">${Array.from({length:36},(_,i)=>{const letter=value[(Math.floor(i/6)%2)*2+i%2];return `<span class="bayer-${letter}">${letter}</span>`;}).join('')}</div>`,readout:`${value}: 18 green, 9 red, 9 blue sites in this 6 × 6 sample.`};
 }
 if(['1-1','1-2','1-4'].includes(id)) {
  p=chart(width,{xmin:380,xmax:780,xlabel:'Wavelength · nm',ylabel:id==='1-2'?'Reflectance':'Relative response'});
  if(id==='1-1') {const xs=seq(161,380,780),bb=xs.map(x=>blackbody(x,n)),ll=xs.map(led),bp=Math.max(...bb),lp=Math.max(...ll);body+=p.line(xs.map((x,i)=>[x,bb[i]/bp]))+p.line(xs.map((x,i)=>[x,ll[i]/lp]),palette[1],'5 3');legend=['Blackbody','Synthetic LED'];readout=`Blackbody ${n} K; curves independently normalized to peak 1.`;}
  if(id==='1-2') {const m=metamer(data,n);body+=p.line(m.rows.map(r=>[r[0],.5]))+p.line(m.rows.map((r,i)=>[r[0],.5+m.v[i]]),palette[1],'5 3');legend=['Reflectance A','Reflectance B'];const diff=Math.hypot(...m.A.map((x,i)=>x-m.B[i]));readout=`XYZ A: ${m.A.map(x=>x.toFixed(4)).join(', ')}. B: ${m.B.map(x=>x.toFixed(4)).join(', ')}. XYZ distance: ${diff.toFixed(5)} (not ΔE).`;}
  if(id==='1-4') {['L','M','S'].forEach((name,i)=>{if(value==='All'||value===name){body+=p.line(data.lms.filter(r=>r[0]>=380&&r[0]<=780&&r[i+1]!==null).map(r=>[r[0],r[i+1]]),palette[i],i===1?'5 3':i===2?'2 3':'');legend.push(name);}});readout=`Showing ${value==='All'?'L, M, and S':value}. Published standard-observer functions.`;}
 }
 if(['2-2','2-3','4-1','6-2'].includes(id)) {
  p=chart(width,{xmin:0,xmax:.8,ymin:-.15,ymax:1,xlabel:'x',ylabel:'y',square:true});
  const locus=data.xyz.filter(r=>r[0]>=360&&r[0]<=830).map(r=>[r[1]/(r[1]+r[2]+r[3]),r[2]/(r[1]+r[2]+r[3])]);
  body+=p.line(locus,'var(--color-text-light)')+p.line([locus[0],locus.at(-1)],'var(--color-text-light)','3 3');
  if(id==='2-2') {const row=data.xyz.find(r=>r[0]===n),sum=row[1]+row[2]+row[3],xx=row[1]/sum,yy=row[2]/sum;
   body+=`<circle cx="${p.x(xx)}" cy="${p.y(yy)}" r="5" fill="${palette[0]}"/>`;
   for(const [name,x,y,dy] of [['D65',.3127,.329,20],['E',1/3,1/3,-10]])body+=`<circle cx="${p.x(x)}" cy="${p.y(y)}" r="3" fill="currentColor"/>`+text(p.x(x)+8,p.y(y)+dy,name);
   readout=`${n} nm: x=${xx.toFixed(4)}, y=${yy.toFixed(4)}.`;
  } else if(id==='2-3') {for(const [A,B] of [[-40,20],[0,0],[40,20],[0,-40],[0,50]])body+=p.line(seq(81,0,Math.PI*2).map(t=>labXY(60,A+5*Math.cos(t),B+5*Math.sin(t))),palette[1]);readout='Five circles of equal radius in the a*b* plane become unequal shapes in xy.';
  } else {const names=id==='6-2'?(value==='Both'?['AWG3','AWG4']:[value]):['Rec.709',...(value==='All'?['Rec.2020','AP1','AP0']:[value])];names.forEach((name,i)=>{body+=p.line([...gamuts[name],gamuts[name][0]],palette[i],i%2?'5 3':'');});legend=names;readout=`Showing ${names.join(', ')}. xy area does not measure perceptual gamut volume.`;}
 }
 if(id==='2-4'){p=chart(width,{xmin:-3,xmax:3,ymax:3.2,xlabel:'Relative log₁₀ exposure',ylabel:'Optical density D'});body+=p.line(seq(161,-3,3).map(x=>[x,.2+2.8/(1+Math.exp(-2*x))]));readout='Toe → near-linear region → shoulder; illustrative curve.';}
 if(id==='3-3'){p=chart(width,{xlabel:'Linear input',ylabel:'Encoded signal'});[x=>x,srgb,x=>x**(1/n)].forEach((fn,i)=>body+=p.line(seq(181).map(x=>[x,fn(x)]),palette[i],i===0?'5 3':''));legend=['Linear','sRGB',`Gamma ${n.toFixed(1)}`];readout=`At 0.18: sRGB ${srgb(.18).toFixed(3)}; gamma ${n.toFixed(1)} ${(.18**(1/n)).toFixed(3)}.`;}
 if(id==='3-4'){p=chart(width,{xmax:8,xlabel:'Scene-linear input',ylabel:'Mapped output'});const e=2**n;body+=p.line(seq(161,0,8).map(x=>[x,Math.min(e*x,1)]))+p.line(seq(161,0,8).map(x=>[x,e*x/(1+e*x)]),palette[1],'5 3');legend=['Clip','x / (1 + x)'];readout=`Exposure multiplier ${e.toFixed(2)}×. At input 4, compressed output ${(4*e/(1+4*e)).toFixed(3)}.`;}
 if(id==='4-2'){p=chart(width,{xmax:2,xlabel:'Input chroma · arbitrary units',ylabel:'Output chroma'});const soft=x=>x<=n?x:n+(1-n)*(1-Math.exp(-(x-n)/(1-n)));body+=p.line(seq(161,0,2).map(x=>[x,Math.min(x,1)]))+p.line(seq(161,0,2).map(x=>[x,soft(x)]),palette[1],'5 3');legend=['Clip at 1','Smooth shoulder'];readout=`Knee ${n.toFixed(1)}; mapping stays continuous with continuous slope.`;}
 if(id==='5-1'){const pqMode=value==='PQ';p=chart(width,{xmax:pqMode?4:1,xlabel:pqMode?'log₁₀ luminance · cd/m²':'Relative scene light E',ylabel:'Encoded signal'});body+=p.line(seq(241,0,pqMode?4:1).map(x=>[x,pqMode?pq(10**x):hlg(x)]),palette[1]);readout=pqMode?`PQ: 100 cd/m² → ${pq(100).toFixed(4)}; 1000 → ${pq(1000).toFixed(4)}. Log axis starts at 1 cd/m².`:`HLG OETF: E=1/12 → ${hlg(1/12).toFixed(3)}; E=1 → ${hlg(1).toFixed(3)}.`;}
 if(id==='6-1'){p=chart(width,{xmin:-8,xmax:6,xlabel:'Stops relative to 18%',ylabel:'Encoded signal'});[logC3,logC4].forEach((fn,i)=>{body+=p.line(seq(181,-8,6).map(x=>[x,fn(.18*2**x)]),palette[i],i?'5 3':'');body+=`<circle cx="${p.x(n)}" cy="${p.y(fn(.18*2**n))}" r="4" fill="${palette[i]}"/>`;});legend=['LogC3 EI800','LogC4'];readout=`${n.toFixed(2)} stops: linear ${(.18*2**n).toFixed(5)}; LogC3 ${logC3(.18*2**n).toFixed(5)}; LogC4 ${logC4(.18*2**n).toFixed(5)}.`;}
 if(id==='7-1'){p=chart(width,{xmax:1.3,ymax:1.4,xlabel:'u',ylabel:'v'});for(const k of [0,n])for(const t of seq(6))for(const vertical of [true,false])body+=p.line(seq(41).map(z=>{const x=vertical?t:z,y=vertical?z:t;return [x+.2*y,y+k*Math.sin(Math.PI*x)];}),k===0?palette[0]:palette[1],k===0?'4 4':'');legend=['Linear shear','Nonlinear bend'];readout=`Bend k=${n.toFixed(2)}. This selected toy map stays invertible; arbitrary fits need not.`;}
 if(id==='7-2'){p=chart(width,{xlabel:'Input x',ylabel:'Output y'});body+=p.line(seq(161).map(x=>[x,Math.min(x,n)]));body+=p.line([[n,n],[1,n]],palette[1],'4 3');readout=`All inputs from ${n.toFixed(1)} to 1 map to ${n.toFixed(1)}. The inverse is not unique.`;}
 const html=`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="fig-${id}-title" viewBox="0 0 ${width} ${p.h}"><title id="fig-${id}-title">${esc(f.title)}</title>${p.body}${body}</svg>`+(legend.length?`<ul class="color-legend">${legend.map((name,i)=>`<li><span style="--curve-color:${palette[i]}"></span>${esc(name)}</li>`).join('')}</ul>`:'');
 return {html,readout};
}
