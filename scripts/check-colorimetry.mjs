import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {figures,renderFigure,srgb,pq,pqInverse,hlg,logC3,logC4,logC4Inverse,logC4Threshold,metamer,xyzToCIERGB,cieRGBToXYZ,chromaticity,spectralMixture,intensitySample} from '../assets/js/colorimetry-models.mjs';
const asset=name=>new URL(`../assets/data/${name}`,import.meta.url);
const data=JSON.parse(fs.readFileSync(asset('colorimetry-observers.json')));
const near=(a,b,t=1e-6)=>assert.ok(Math.abs(a-b)<t,`${a} ≠ ${b}`);
near(srgb(.18),.4613561295);near(pq(100),.5080784215);near(pq(1000),.7518270962);near(pq(10000),1);
for(const L of [0,.001,.1,1,100,1000,10000])near(pqInverse(pq(L)),L,1e-6);
near(hlg(0),0);near(hlg(1/12),.5);near(hlg(1),1);near(hlg(1/12+1e-10),.5,1e-7);
near(logC3(.18),.3910068);near(logC4(.18),.2783958365);
near(logC3(.010591-1e-10),logC3(.010591+1e-10),1e-6);
near(logC4(logC4Threshold-1e-10),logC4(logC4Threshold+1e-10),1e-7);
for(const x of [-.1,-.018,0,.18,1,16,100])near(logC4Inverse(logC4(x)),x,1e-9);
const match=metamer(data,0);match.A.forEach((x,i)=>near(x,match.B[i],1e-12));
assert.ok(match.v.every(v=>.5+v>=0&&.5+v<=1));
const mismatch=metamer(data,1);assert.ok(Math.hypot(...mismatch.A.map((x,i)=>x-mismatch.B[i]))>.01);
for(const [name,hash] of [['CIE_xyz_1931_2deg.csv','17cca777db64b17170f06f67ce9d3ab7'],['CIE_lms_cf_2deg.csv','dba2e9d1f5e6667575aa069832159510']])assert.equal(createHash('md5').update(fs.readFileSync(asset(name))).digest('hex'),hash);
for(const [key,name] of [['xyz','CIE_xyz_1931_2deg.csv'],['lms','CIE_lms_cf_2deg.csv']]) {
 const derived=fs.readFileSync(asset(name),'utf8').trim().split(/\r?\n/).map(line=>line.split(',').map(Number)).filter(row=>row[0]%5===0).map(row=>row.map(x=>Number.isFinite(x)?x:null));
 assert.deepEqual(data[key],derived,`Derived ${key} must match the official CSV`);
}
assert.equal(Object.keys(figures).length,34);
let renders=0;
for(const [id,f] of Object.entries(figures)) {
 const control=f.control, values=control?.options??(control?[control.min,control.value,control.max]:[undefined]);
 for(const value of values)for(const width of [280,360,672]) {
  const result=renderFigure(id,value,data,width);
  assert.ok(result.html.length>100,id);assert.ok(!/NaN|Infinity|undefined/.test(result.html+result.readout),id);renders++;
 }
 const module=fs.readFileSync(new URL(`../${f.article??`_modules/colorimetry-module-${id[0]}.md`}`,import.meta.url),'utf8');
 assert.ok(module.includes(`colorimetry/fig-${id}.html`),id);
}
console.log(`Colorimetry: standard reference values, round trips, joins, metamerism, data checksums, 34 figure references and ${renders} renders passed.`);

// A working control must change the visual, not only its numeric readout.
for (const [id,{control:c}] of Object.entries(figures).filter(([,f])=>f.control)) {
 assert.notEqual(renderFigure(id,c.options?.[0]??c.min,data).html,renderFigure(id,c.options?.at(-1)??c.max,data).html,`${id} visual must respond`);
}
for (const id of ['1-3','2-1']) assert.match(renderFigure(id,undefined,data).html,/<svg/);
// Linear matching must balance with every negative primary moved to the test side.
for(const row of data.xyz) {
 const xyz=row.slice(1),rgb=xyzToCIERGB(xyz);
 cieRGBToXYZ(rgb).forEach((v,i)=>near(v,xyz[i],1e-12));
 const added=cieRGBToXYZ(rgb.map(v=>Math.max(-v,0)));
 const mixture=cieRGBToXYZ(rgb.map(v=>Math.max(v,0)));
 mixture.forEach((v,i)=>near(v,xyz[i]+added[i],1e-12));
}
cieRGBToXYZ([1,1,1]).forEach(v=>near(v,1,1e-12));
assert.ok(xyzToCIERGB(data.xyz.find(r=>r[0]===530).slice(1))[0]<-.4);
assert.ok(xyzToCIERGB(data.xyz.find(r=>r[0]===600).slice(1))[2]<0);
const half=spectralMixture(data,.5),a=chromaticity(half.blue),b=chromaticity(half.red);
assert.deepEqual(spectralMixture(data,0).xyz,half.blue);
assert.deepEqual(spectralMixture(data,1).xyz,half.red);
assert.ok(Math.abs(half.xy[0]-(a[0]+b[0])/2)>.1,'Equal power must not be confused with midpoint xy');
for(const f of [0,.1,.25,.5,.8,1]) {
 const {xy}=spectralMixture(data,f);
 near((xy[0]-a[0])*(b[1]-a[1])-(xy[1]-a[1])*(b[0]-a[0]),0,1e-12);
 xy.forEach((v,i)=>assert.ok(v>=Math.min(a[i],b[i])-1e-12&&v<=Math.max(a[i],b[i])+1e-12));
}
const full=intensitySample('Full');
[.24357,.33582,.14659].forEach((v,i)=>near(full.xyz[i],v,1e-12));
for(const level of ['Quarter','Half']) {
 const sample=intensitySample(level);
 sample.xy.forEach((v,i)=>near(v,full.xy[i],1e-12));
 sample.xyz.forEach((v,i)=>near(v,full.xyz[i]*sample.scale,1e-12));
}
assert.equal(chromaticity([0,0,0]),null);
console.log('CIE matching balance, transform round trips, mixture geometry, and intensity invariance passed.');

// A single-channel selection must retain the plotted channel's legend key.
for(const [channel,color] of [['M','#367d92'],['S','#598453']]) {
 const {html}=renderFigure('1-4',channel,data);
 assert.ok(html.includes(`stroke="${color}"`)&&html.includes(`--curve-color:${color}`));
}
// Zero bend still draws both mappings, with distinct line identities.
const straight=renderFigure('7-1',0,data).html;
assert.ok(straight.includes('stroke="#367d92"')&&straight.includes('--curve-style:dashed'));
console.log('All interactive controls change their visuals; single-channel legends and zero-bend line identities passed.');
