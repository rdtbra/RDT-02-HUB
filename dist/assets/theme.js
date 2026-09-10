/* Preferência visual independente dos registros e backups. */
(()=>{
 const key='rdt02-theme',root=document.documentElement;
 let theme='dark';
 try{if(localStorage.getItem(key)==='light')theme='light';}catch{}
 function apply(){
  root.dataset.theme=theme;
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.content=theme==='dark'?'#101820':'#f3f6f8';
  const button=document.getElementById('themeToggle');
  if(button){button.textContent=theme==='dark'?'☀ Tema claro':'☾ Tema escuro';button.setAttribute('aria-label',theme==='dark'?'Ativar tema claro':'Ativar tema escuro');button.setAttribute('aria-pressed',String(theme==='light'));}
 }
 apply();
 document.addEventListener('DOMContentLoaded',()=>{apply();document.getElementById('themeToggle').addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';apply();try{localStorage.setItem(key,theme);}catch{}});});
})();
