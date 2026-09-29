(function(root){
 'use strict';
 const scores=Object.freeze({SI:1,PARCIAL:0.5,NO:0});
 function summarize(items){
  const valid=items.filter(i=>Object.hasOwn(scores,i.state));
  return {count:items.length,valued:valid.length,provisional:items.some(i=>i.provisional),value:items.length&&valid.length===items.length?valid.reduce((s,i)=>s+(Number.isFinite(i.score)?i.score:scores[i.state]),0)/items.length:null,counts:{SI:items.filter(i=>i.state==='SI').length,PARCIAL:items.filter(i=>i.state==='PARCIAL').length,NO:items.filter(i=>i.state==='NO').length}};
 }
 function calculate(data){
  const variables=data.variables.map(v=>({...v,...summarize(data.indicators.filter(i=>i.variable===v.id))}));
  const dimensions=data.dimensions.map(d=>{const vs=variables.filter(v=>v.dimension===d.id);return {...d,count:vs.reduce((s,v)=>s+v.count,0),variableCount:vs.length,value:vs.length===d.expectedVariables&&vs.every(v=>v.value!==null)?vs.reduce((s,v)=>s+v.value,0)/vs.length:null,provisional:vs.some(v=>v.provisional)}});
  return {variables,dimensions,global:dimensions.length===2&&dimensions.every(d=>d.value!==null)?dimensions.reduce((s,d)=>s+d.value,0)/2:null,provisional:dimensions.some(d=>d.provisional)};
 }
 root.QualityModel={calculate,summarize,scores};
 if(typeof module!=='undefined')module.exports=root.QualityModel;
})(typeof globalThis!=='undefined'?globalThis:this);
