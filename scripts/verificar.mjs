import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx={window:{},URL};vm.runInNewContext(read('dist/data/catalog.js'),ctx);vm.runInNewContext(read('dist/assets/core.js'),ctx);
const {HUB_CATALOG:d,HubCore:c}=ctx.window;
assert.equal(d.activities.length,191);assert.equal(d.categories.length,12);assert.equal(new Set(d.activities.map(a=>a.id)).size,191);
for(const a of d.activities){assert(d.categories.some(cat=>cat.id===a.category));for(const r of a.resources)assert(c.validUrl(r.url));if(a.image)assert(fs.existsSync(path.join(root,'dist',a.image)));}
assert.equal(c.validUrl('javascript:alert(1)'),false);assert.equal(c.validUrl('file:///C:/test'),false);
const backup=c.empty();backup.records['af-01-ib6']={notes:'A < B\nEstudo ç',next:'Retomar',updatedAt:new Date().toISOString()};backup.favorites=['af-01-ib6'];backup.custom['af-01-ib6']=[{id:'test',title:'Referência',url:'https://example.org',kind:'material'}];
assert.equal(c.validate(JSON.parse(JSON.stringify(backup))).records['af-01-ib6'].notes,'A < B\nEstudo ç');
assert.throws(()=>c.validate({version:2}));const invalid=JSON.parse(JSON.stringify(backup));invalid.custom['af-01-ib6'][0].url='javascript:alert(1)';assert.throws(()=>c.validate(invalid));
const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},setAttribute(){},addEventListener(){},focus(){},showModal(){},close(){}});return nodes.get(id);};
let persisted='';const browser={...ctx.window,scrollTo(){},addEventListener(){},innerWidth:400};const document={querySelector:()=>node('main'),getElementById:node,querySelectorAll:()=>[],body:node('body'),addEventListener(){},title:''};
const sandbox={window:browser,document,localStorage:{getItem:()=>persisted||null,setItem:(_,v)=>persisted=v},location:{hash:'#inicio'},URL,Date,console,setTimeout,clearTimeout,confirm:()=>true};
for(const route of ['#inicio','#favoritos','#dados','#atividade/af-01-ib6','#atividade/emt-01-es',...d.categories.map(c=>'#categoria/'+c.id),'#atividade/missing']){sandbox.location.hash=route;vm.runInNewContext(read('dist/assets/app.js'),sandbox);assert(node('main').innerHTML.length>50);}
sandbox.location.hash='#atividade/af-01-ib6';vm.runInNewContext(read('dist/assets/app.js'),sandbox);node('recordForm').oninput({target:{name:'notes',value:'Registro de teste'}});assert.equal(JSON.parse(persisted).records['af-01-ib6'].notes,'Registro de teste');vm.runInNewContext(read('dist/assets/app.js'),sandbox);assert(node('main').innerHTML.includes('Registro de teste'));
let registered;vm.runInNewContext(read('dist/assets/agent-tools.js'),{document:{modelContext:{registerTool:t=>{registered=t;}}},window:browser,AbortController});assert.equal(registered.name,'buscar_atividades');assert(registered.execute({consulta:'EMT-01-ES'}).some(a=>a.id==='emt-01-es'));assert.throws(()=>registered.execute({consulta:1}));
console.log('OK: 191 atividades, 12 categorias, recursos, backups válidos/inválidos, rotas, persistência de notas e contrato de busca para agentes. Teste lógico sem navegador.');
