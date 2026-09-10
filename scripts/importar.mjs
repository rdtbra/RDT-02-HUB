import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const definitions=[['analise-fontes','Análise de fontes','AFgroups.js','01'],['projetos','Projetos','Projetosgroups.js','02'],['estudos','Estudo de material técnico','Estudosgroups.js','03'],['desenvolvimentos','Desenvolvimentos','DVgroups.js','04'],['engenharia-reversa','Engenharia reversa',null,'05'],['logica','Lógica de produtos',null,'06'],['beyond','Beyond','Beyond.js','07'],['smart-decision','SDC','SDCgroups.js','08'],['entretenimento','Entretenimento',null,'09'],['pessoal','Pessoal','Pessoalgroups.js','10'],['universidades','Universidades','UNIgroups.js','11'],['cursos','Cursos','CURgroups.js','12']];
const categories=definitions.map(([id,name,,number])=>({id,name,number}));
const activities=[];
for(const [category,,file] of definitions){
 if(!file)continue;
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'referencias/rdt-00',file),'utf8'),context);
 for(const group of context.window.GROUPS){
  const resources=[];
  if(/^https?:\/\//i.test(group.iconHref||''))resources.push({id:`${group.id}-material`,title:category==='analise-fontes'?'Repositório e fontes':'Material de referência',url:group.iconHref,kind:'material'});
  activities.push({id:group.id,category,title:group.name.replace(/^[A-Z]+-\d+-[A-Z0-9]+\s*-\s*/,''),code:group.id.toUpperCase(),resources,description:group.description||'',source:`RDT-00 / ${file}`,pilot:['af-01-ib6','emt-01-es'].includes(group.id)});
 }
}
const ib=activities.find(a=>a.id==='af-01-ib6');
Object.assign(ib,{image:'assets/interbase.png',description:'Estudo do código-fonte do InterBase 6. Reúna perguntas, referências e descobertas antes de voltar ao ambiente de análise.',environment:{name:'VM2082-LX64-AF-01-IB6',host:'RDT-011 · VMware Workstation',access:'MobaXterm · SSH',note:'Os atalhos originais foram preservados em referencias/automation/interbase. A ligação entre o hub e o Windows ainda não está instalada.'}});
const book=activities.find(a=>a.id==='emt-01-es');
Object.assign(book,{image:'assets/probability.png',title:'Probability for Dummies',subtitle:'Deborah J. Rumsey · 2ª edição',description:'Estudo de probabilidade com acesso ao livro e um registro próprio de leitura, dúvidas e exercícios.',historical:'O Automation registrava a página 25 do PDF. É uma referência antiga, não uma posição atual confirmada.',localFile:'H:\\Meu Drive\\Documentação\\ZLeitura\\Rumsey - Probability for Dummies 2ed.pdf'});
book.resources[0].title='Ler na O’Reilly';
for(const name of fs.readdirSync(path.join(root,'atividades/entretenimento'))){activities.push(JSON.parse(fs.readFileSync(path.join(root,'atividades/entretenimento',name,'cadastro.json'),'utf8')));}
const output={version:1,categories,activities};
for(const [activity,folder] of [[ib,'analise-fontes/af-01-ib6'],[book,'estudos/emt-01-es']]){
 const dest=path.join(root,'atividades',folder);fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'cadastro.json'),JSON.stringify(activity,null,2)+'\n');
}
fs.writeFileSync(path.join(root,'dist/data/catalog.js'),'window.HUB_CATALOG = '+JSON.stringify(output,null,2)+';\n');
console.log(`${categories.length} categorias; ${activities.length} atividades; 2 pilotos.`);
