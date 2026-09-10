import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import {getFirestore,doc,getDocFromServer,onSnapshot,runTransaction} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),C=window.HubCore,M=window.HubSyncCore,H=window.HubApp;
const $=id=>document.getElementById(id),copy=x=>JSON.parse(JSON.stringify(x));
let user=null,ref=null,base=null,remote=null,ready=false,busy=false,timer=null,unsubscribe=null,conflict=false,generation=0,deferredSnapshot=null;
const key=()=> 'rdt02-sync-'+user.uid;
function status(text){$('syncStatus').textContent=text;}
function stash(){if(!user||!base)return;localStorage.setItem(key(),JSON.stringify({base,local:H.get()}));}
function safety(){localStorage.setItem('rdt02-before-cloud-'+Date.now(),JSON.stringify(H.get()));}
function apply(value){H.apply(C.validate(value));}
function schedule(){if(!ready||conflict)return;clearTimeout(timer);stash();status(navigator.onLine?'Alterações aguardando envio…':'Sem conexão · salvo neste aparelho');timer=setTimeout(flush,1800);}
window.HubSync={changed:schedule};
function choices(show){$('syncChoices').hidden=!show;}
async function begin(){const turn=++generation;ready=false;conflict=false;choices(false);status('Conectando à sua conta…');try{
 const snap=await getDocFromServer(ref);if(turn!==generation)return;remote=snap.exists()?C.validate(snap.data().state):C.empty();
 const saved=localStorage.getItem(key());
 if(saved){const meta=JSON.parse(saved);base=C.validate(meta.base);C.validate(meta.local);
 if(!M.same(meta.local,meta.base)&&!M.same(H.get(),meta.local)){status('Há registros diferentes neste aparelho. Escolha abaixo.');choices(true);return;}
 if(!M.same(meta.local,meta.base)){const merged=M.merge(base,meta.local,remote);if(merged.conflicts.length){conflict=true;status('Conflito entre aparelhos. Exporte um backup e escolha a versão abaixo.');choices(true);return;}apply(merged.state);base=copy(remote);}
 else if(M.same(H.get(),meta.local)){base=copy(remote);apply(remote);}
 else {status('Há alterações locais. Escolha como sincronizar.');choices(true);return;}
 }else if(!snap.exists()){base=C.empty();safety();}
 else if(M.same(H.get(),C.empty())||M.same(H.get(),remote)){base=copy(remote);safety();apply(remote);}
 else{base=copy(remote);status('Escolha os dados iniciais. Uma cópia local será preservada.');choices(true);return;}
 activate();
 }catch(e){status(e.code==='permission-denied'?'Acesso não autorizado. Use a conta Google proprietária do hub.':'Não foi possível conectar. Dados continuam locais. Use Tentar novamente.');console.warn('Firebase:',e.code||e.message);}}
function activate(){ready=true;conflict=false;choices(false);stash();unsubscribe?.();unsubscribe=onSnapshot(ref,snap=>{if(!ready||!snap.exists()||snap.metadata.fromCache)return;if(busy){deferredSnapshot=snap;return;}receive(snap);},e=>status('Falha de sincronização. Dados locais preservados. Use Tentar novamente.'));if(!M.same(base,H.get()))schedule();else status('Sincronizado com sua conta');}
function receive(snap){const next=C.validate(snap.data().state);if(M.same(next,base))return;const merged=M.merge(base,H.get(),next);if(merged.conflicts.length){conflict=true;status('Alterações simultâneas no mesmo campo. Escolha a versão abaixo.');remote=next;choices(true);return;}base=copy(next);apply(merged.state);stash();if(!M.same(base,H.get()))schedule();else status('Sincronizado com sua conta');}
async function flush(){if(!ready||busy||conflict||!navigator.onLine)return;const local=copy(H.get()),previous=copy(base),target=ref,turn=generation;let succeeded=false;if(M.same(local,previous)){status('Sincronizado com sua conta');return;}busy=true;status('Salvando na nuvem…');try{
 const result=await runTransaction(db,async tx=>{const snap=await tx.get(target);const latest=snap.exists()?C.validate(snap.data().state):C.empty();const merged=M.merge(previous,local,latest);if(merged.conflicts.length)throw Error('CONFLICT');if(new TextEncoder().encode(JSON.stringify(merged.state)).length>750000)throw Error('SIZE');tx.set(target,{state:merged.state,updatedAt:new Date().toISOString()});return merged.state;});
 if(turn!==generation)return;succeeded=true;const newer=M.merge(local,H.get(),result);base=copy(result);apply(newer.state);stash();status('Sincronizado com sua conta');
 }catch(e){if(e.message==='CONFLICT'){conflict=true;status('Conflito entre aparelhos. Escolha a versão abaixo.');choices(true);}else status(e.code==='permission-denied'?'Acesso não autorizado. Entre com a conta Google proprietária do hub.':e.message==='SIZE'?'Limite do registro atingido. Exporte seu backup.':'Não foi possível enviar. Dados locais preservados; tente novamente.');}
 finally{busy=false;if(deferredSnapshot&&turn===generation){deferredSnapshot=null;if(!conflict)getDocFromServer(target).then(snapshot=>{if(turn===generation&&!busy&&!conflict&&snapshot.exists())receive(snapshot);}).catch(()=>{});}if(succeeded&&turn===generation&&!conflict&&!M.same(base,H.get()))schedule();}}
$('cloudLocal').onclick=async()=>{if(!confirm('Usar os dados deste aparelho como referência na nuvem? Os dados atuais serão preservados em uma cópia local.'))return;safety();const snap=await getDocFromServer(ref);base=snap.exists()?C.validate(snap.data().state):C.empty();activate();};
$('cloudRemote').onclick=async()=>{if(!confirm('Carregar a versão da nuvem? Uma cópia dos dados deste aparelho será preservada localmente.'))return;safety();const snap=await getDocFromServer(ref);base=snap.exists()?C.validate(snap.data().state):C.empty();apply(base);activate();};
$('syncRetry').onclick=()=>{if(!user){status('Entre com Google para sincronizar.');return;}if(ready&&!conflict)flush();else begin();};
$('authButton').onclick=async()=>{try{if(user){if(busy||!M.same(base,H.get())){if(!confirm('Há dados locais que podem não ter sido enviados. Sair da conta mantendo a cópia neste aparelho?'))return;}await signOut(auth);}else {status('Abrindo login Google…');await signInWithPopup(auth,new GoogleAuthProvider());}}catch(e){console.warn('Login Firebase:',e.code||e.message);status('Login não concluído ('+(e.code||'erro')+'). Tente abrir o hub no Chrome ou Edge e permita a janela de login.');}};
onAuthStateChanged(auth,u=>{generation++;clearTimeout(timer);unsubscribe?.();unsubscribe=null;ready=false;user=u;choices(false);$('authButton').textContent=u?'Sair da conta':'Entrar com Google';$('syncAccount').textContent=u?.email||'';if(u){ref=doc(db,'users',u.uid,'hub','state');begin();}else{base=null;status('Sem login · dados neste aparelho');}});
window.addEventListener('online',()=>{if(user){if(ready)flush();else begin();}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush();});
