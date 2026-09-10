(function(root){
 'use strict';
 const fields=['position','pdfPage','question','next','notes','updatedAt'];
 function validUrl(value){try{return ['https:','http:'].includes(new URL(value).protocol);}catch{return false;}}
 function empty(){return {version:1,records:{},favorites:[],custom:{}};}
 function validate(data){
  if(!data||data.version!==1||typeof data.records!=='object'||!data.records||Array.isArray(data.records)||!Array.isArray(data.favorites)||!data.custom||typeof data.custom!=='object'||Array.isArray(data.custom))throw Error('Formato de backup inválido.');
  const out=empty();
  const idOk=id=>/^[a-zA-Z0-9_.-]+$/.test(id)&&!['__proto__','constructor','prototype'].includes(id);
  for(const [id,record] of Object.entries(data.records)){if(!idOk(id)||!record||typeof record!=='object')throw Error('Registro inválido.');out.records[id]={};for(const field of fields)if(record[field]!==undefined){if(typeof record[field]!=='string')throw Error('Campo inválido.');out.records[id][field]=record[field];}}
  out.favorites=[...new Set(data.favorites.filter(id=>typeof id==='string'&&idOk(id)))];
  for(const [id,list] of Object.entries(data.custom)){if(!idOk(id)||!Array.isArray(list))throw Error('Recursos inválidos.');out.custom[id]=list.map(r=>{if(!r||typeof r.title!=='string'||!r.title.trim()||typeof r.url!=='string'||!validUrl(r.url)||typeof r.id!=='string'||!['material','ia','anotacao'].includes(r.kind))throw Error('Recurso inválido.');return {id:r.id,title:r.title,url:r.url,kind:r.kind};});}
  return out;
 }
 root.HubCore={validUrl,empty,validate};
})(typeof window==='undefined'?globalThis:window);
