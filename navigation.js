const allViews=['submit','track','admin','complaints','committee','reports','notif'];
const sbMap={submit:'sb-submit',track:'sb-track',admin:'sb-admin',complaints:'sb-complaints',committee:'sb-committee',reports:'sb-reports',notif:'sb-notif'};
let sev='med';

function switchView(v){
  allViews.forEach(x=>{
    const el=document.getElementById('view-'+x);
    if(el) el.classList.toggle('active',x===v);
    const sb=document.getElementById(sbMap[x]);
    if(sb) sb.classList.toggle('active',x===v);
  });
  const navBtns=document.querySelectorAll('.nav-btn');
  navBtns.forEach(b=>b.classList.remove('active'));
  const navMap={submit:0,track:1,admin:2,reports:3};
  if(navMap[v]!==undefined && navBtns[navMap[v]]) navBtns[navMap[v]].classList.add('active');
  const panel=document.getElementById('detailPanel');
  if(panel) panel.classList.remove('open');
  window.scrollTo(0,0);
}

function toggleAnon(){
  const cb=document.getElementById('anonCheck');
  cb.checked=!cb.checked;
  updateAnonStyle(cb.checked);
}

function toggleAnonDirect(cb){ updateAnonStyle(cb.checked); }

function updateAnonStyle(checked){
  const icon=document.querySelector('.anon-icon');
  if(icon) icon.style.color=checked?'var(--green)':'var(--muted)';
  const nameInput=document.getElementById('nameInput');
  if(nameInput) nameInput.placeholder=checked?'Leave blank to stay completely anonymous':'Enter your full name';
}

function setSev(s){
  sev=s;
  ['low','med','high'].forEach(x=>{
    const el=document.getElementById('sev-'+x);
    if(!el) return;
    el.className='sev-opt';
    if(x===s) el.classList.add('sel-'+x);
  });
}
