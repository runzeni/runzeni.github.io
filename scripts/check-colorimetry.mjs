import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {figures,renderFigure,srgb,pq,pqInverse,hlg,logC3,logC4,logC4Inverse,logC4Threshold,metamer} from '../assets/js/colorimetry-models.mjs';
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
assert.equal(Object.keys(figures).length,26);
let renders=0;
for(const [id,f] of Object.entries(figures)) {
 const control=f.control, values=control?.options??(control?[control.min,control.value,control.max]:[undefined]);
 for(const value of values)for(const width of [280,360,672]) {
  const result=renderFigure(id,value,data,width);
  assert.ok(result.html.length>100,id);assert.ok(!/NaN|Infinity|undefined/.test(result.html+result.readout),id);renders++;
 }
 const module=fs.readFileSync(new URL(`../_modules/colorimetry-module-${id[0]}.md`,import.meta.url),'utf8');
 assert.ok(module.includes(`colorimetry/fig-${id}.html`),id);
}
console.log(`Colorimetry: standard reference values, round trips, joins, metamerism, data checksums, 26 figure references and ${renders} renders passed.`);
