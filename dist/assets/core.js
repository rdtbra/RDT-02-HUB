(function(root){
 'use strict';
 const fields=['position','pdfPage','question','next','notes','updatedAt'];
 function validUrl(value){try{return ['https:','http:'].includes(new URL(value).protocol);}catch{return false;}}
 function empty(){return {version:1,records:{},favorites:[],custom:{},pinned:[],recent:[],homeLimit:4,orders:{}};}
 function validate(data){
  if(!data||data.version!==1||typeof data.records!=='object'||!data.records||Array.isArray(data.records)||!Array.isArray(data.favorites)||!data.custom||typeof data.custom!=='object'||Array.isArray(data.custom))throw Error('Formato de backup inválido.');
  const out=empty();
  const idOk=id=>/^[\p{L}\p{N}_.-]+$/u.test(id)&&!['__proto__','constructor','prototype'].includes(id);
  for(const [id,record] of Object.entries(data.records)){if(!idOk(id)||!record||typeof record!=='object')throw Error('Registro inválido.');out.records[id]={};for(const field of fields)if(record[field]!==undefined){if(typeof record[field]!=='string')throw Error('Campo inválido.');out.records[id][field]=record[field];}}
  out.favorites=[...new Set(data.favorites.filter(id=>typeof id==='string'&&idOk(id)))];
  for(const [id,list] of Object.entries(data.custom)){if(!idOk(id)||!Array.isArray(list))throw Error('Recursos inválidos.');out.custom[id]=list.map(r=>{if(!r||typeof r.title!=='string'||!r.title.trim()||typeof r.url!=='string'||!validUrl(r.url)||typeof r.id!=='string'||!['material','ia','anotacao'].includes(r.kind))throw Error('Recurso inválido.');return {id:r.id,title:r.title,url:r.url,kind:r.kind};});}
  for(const key of ['pinned','recent']){if(data[key]!==undefined&&!Array.isArray(data[key]))throw Error('Preferências inválidas.');out[key]=[...new Set((data[key]||[]).filter(id=>typeof id==='string'&&idOk(id)))];}
  if(data.recent===undefined)out.recent=Object.keys(out.records).sort((a,b)=>(out.records[b].updatedAt||'').localeCompare(out.records[a].updatedAt||''));
  if(data.homeLimit!==undefined&&![4,6,8].includes(data.homeLimit))throw Error('Quantidade de cartões inválida.');
  out.homeLimit=data.homeLimit||4;
  if(data.orders!==undefined){if(!data.orders||typeof data.orders!=='object'||Array.isArray(data.orders))throw Error('Ordem inválida.');for(const [key,ids] of Object.entries(data.orders)){if(!idOk(key)||!Array.isArray(ids)||ids.some(id=>typeof id!=='string'||!idOk(id)))throw Error('Ordem inválida.');out.orders[key]=[...new Set(ids)];}}
  return out;
 }
 function homeActivities(state,activities){const byId=new Map(activities.map(a=>[a.id,a]));const pins=state.pinned.filter(id=>byId.has(id));const recent=state.recent.filter(id=>byId.has(id)&&!pins.includes(id));return [...pins,...recent.slice(0,Math.max(0,state.homeLimit-pins.length))].map(id=>byId.get(id));}
 function ordered(activities,ids=[]){const byId=new Map(activities.map(a=>[a.id,a]));return [...new Set([...ids,...activities.map(a=>a.id)])].filter(id=>byId.has(id)).map(id=>byId.get(id));}
 function move(ids,id,target){const out=ids.filter(x=>x!==id);if(!ids.includes(id)||!ids.includes(target)||id===target)return [...ids];out.splice(ids.indexOf(target),0,id);return out;}
 root.HubCore={validUrl,empty,validate,homeActivities,ordered,move};
})(typeof window==='undefined'?globalThis:window);
