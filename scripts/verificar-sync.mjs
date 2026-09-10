import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const ctx={window:{}};for(const f of ['core','sync-core'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+f+'.js',import.meta.url),'utf8'),ctx);
const C=ctx.window.HubCore,M=ctx.window.HubSyncCore,clone=x=>JSON.parse(JSON.stringify(x));
let base=C.empty(),local=clone(base),remote=clone(base);local.orders.entretenimento=['ultraman-2-1'];remote.pinned=['reacher-1-6'];let m=M.merge(base,local,remote);assert.equal(m.conflicts.length,0);assert.equal(m.state.pinned[0],'reacher-1-6');assert.equal(m.state.orders.entretenimento[0],'ultraman-2-1');
base.records.book={notes:'original',question:'q'};local=clone(base);remote=clone(base);local.records.book.notes='local';remote.records.book.question='remote';m=M.merge(base,local,remote);assert.equal(m.conflicts.length,0);assert.equal(m.state.records.book.question,'remote');assert.equal(m.state.records.book.notes,'local');
remote.records.book.notes='other';m=M.merge(base,local,remote);assert(m.conflicts.includes('records/book/notes'));assert.equal(m.state.records.book.notes,'other');
base.custom.book=[{id:'x'}];local=clone(base);remote=clone(base);local.custom.book=[];assert.equal(M.merge(base,local,remote).state.custom.book.length,0);
base=C.empty();local=clone(base);remote=clone(base);local.recent=['a'];remote.recent=['b'];m=M.merge(base,local,remote);assert.equal(m.conflicts.length,0);assert.equal(m.state.recent.join(','),'a,b');
console.log('OK: mesclagem independente, conflitos de notas preservados, exclusão de recurso e recentes.');
