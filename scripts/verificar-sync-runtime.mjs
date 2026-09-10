import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const read=f=>fs.readFileSync(new URL('../dist/assets/'+f,import.meta.url),'utf8');
const clone=x=>JSON.parse(JSON.stringify(x)),tick=()=>new Promise(r=>setImmediate(r));
const w={addEventListener(){}};const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',hidden:false});return nodes.get(id);};const mem=new Map();let onAuth,listen,remote,local,writes=0,timer;
const snap=()=>({exists:()=>!!remote,data:()=>clone(remote),metadata:{fromCache:false}});
const sandbox={window:w,document:{getElementById:node,addEventListener(){}},navigator:{onLine:true},localStorage:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)},console,TextEncoder,Date,confirm:()=>true,setTimeout:fn=>{timer=fn;return 1;},clearTimeout(){},initializeApp:()=>({}),getAuth:()=>({}),getFirestore:()=>({}),GoogleAuthProvider:class{},signInWithPopup:async()=>{},signOut:async()=>onAuth(null),onAuthStateChanged:(_,fn)=>{onAuth=fn;},doc:(_, ...p)=>p.join('/'),getDocFromServer:async()=>snap(),onSnapshot:(_,fn)=>{listen=fn;return ()=>{};},runTransaction:async(_,fn)=>fn({get:async()=>snap(),set:(_,v)=>{remote=clone(v);writes++;}}),firebaseConfig:{}};
vm.createContext(sandbox);for(const file of ['core.js','sync-core.js'])vm.runInContext(read(file),sandbox);local=w.HubCore.empty();w.HubApp={get:()=>clone(local),apply:v=>{local=clone(v);}};
vm.runInContext(read('sync.js').replace(/^import .*;\r?\n/gm,''),sandbox);
onAuth({uid:'owner',email:'test@example.org'});await tick();assert.equal(writes,0);
local.orders.entretenimento=['ultraman-2-1'];w.HubSync.changed();await timer();assert.equal(writes,1);assert.equal(remote.state.orders.entretenimento[0],'ultraman-2-1');assert(node('syncStatus').textContent.includes('Sincronizado'));
sandbox.navigator.onLine=false;local.pinned=['reacher-1-6'];w.HubSync.changed();await timer();assert.equal(writes,1);assert(mem.get('rdt02-sync-owner').includes('reacher-1-6'));
sandbox.navigator.onLine=true;await node('syncRetry').onclick();await tick();assert.equal(writes,2);assert.equal(remote.state.pinned[0],'reacher-1-6');
remote.state.favorites=['af-01-ib6'];listen(snap());assert.equal(local.favorites[0],'af-01-ib6');
local.orders.entretenimento=['reacher-1-6'];w.HubSync.changed();remote.state.orders.entretenimento=['dito-e-feito'];await timer();assert.equal(writes,2);assert.equal(local.orders.entretenimento[0],'reacher-1-6');assert.equal(node('syncChoices').hidden,false);
console.log('OK: envio confirmado, fila offline, retomada, recebimento remoto e conflito sem sobrescrita. Firebase simulado.');

