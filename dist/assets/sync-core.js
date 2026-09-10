/* Mesclagem de alterações independentes; conflitos nunca são sobrescritos silenciosamente. */
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x)),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function flat(s){const out={};for(const k of ['favorites','pinned','recent','homeLimit'])out[k]=s[k];for(const k of ['custom','orders'])for(const [id,v] of Object.entries(s[k]||{}))out[k+'/'+id]=v;for(const [id,r] of Object.entries(s.records||{}))for(const [k,v] of Object.entries(r))if(k!=='updatedAt')out['records/'+id+'/'+k]=v;return out;}
function merge(base,local,remote){const b=flat(base),l=flat(local),r=flat(remote),conflicts=[];const result=clone(remote);for(const key of new Set([...Object.keys(b),...Object.keys(l)])){if(same(b[key],l[key]))continue;if(key==='recent'){result.recent=[...new Set([...(l[key]||[]),...(r[key]||[])])];continue;}if(!same(b[key],r[key])&&!same(l[key],r[key])){conflicts.push(key);continue;}const parts=key.split('/');let obj=result;for(const part of parts.slice(0,-1))obj=obj[part]??={};if(l[key]===undefined)delete obj[parts.at(-1)];else obj[parts.at(-1)]=clone(l[key]);if(parts[0]==='records')result.records[parts[1]].updatedAt=local.records[parts[1]]?.updatedAt||new Date().toISOString();}return {state:result,conflicts};}
root.HubSyncCore={merge,same};
})(typeof window==='undefined'?globalThis:window);
