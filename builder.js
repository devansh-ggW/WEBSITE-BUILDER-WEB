(()=>{"use strict";
const KEY="dewify:website-builder:v1";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const uid=p=>p+"-"+Math.random().toString(36).slice(2,9);
const palettes=[
{name:"Lavender",accent:"#7046ff",bg:"#ffffff",soft:"#f0ebff",text:"#16151b"},
{name:"Mono",accent:"#34343b",bg:"#ffffff",soft:"#f0f0f2",text:"#17171b"},
{name:"Blue",accent:"#326cff",bg:"#ffffff",soft:"#eaf0ff",text:"#172033"},
{name:"Emerald",accent:"#1f9d73",bg:"#ffffff",soft:"#e7f7f1",text:"#10201a"},
{name:"Rose",accent:"#e05c8c",bg:"#ffffff",soft:"#fff0f5",text:"#24151b"}
];
function page(id,name){return{id,name,sections:[
{id:uid("header"),type:"header"},{id:uid("hero"),type:"hero"},{id:uid("features"),type:"features"},{id:uid("products"),type:"products"},{id:uid("footer"),type:"footer"}]}}
const initial={projectName:"My Store",pages:[page("home","Home")],activePage:"home",accent:"#7046ff",palette:"Lavender",device:"desktop",zoom:1,history:[],future:[],selected:null};
let state=load(),renameTarget=null,tab="style";
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));return s?{...initial,...s,history:[],future:[],selected:null}:structuredClone(initial)}catch{return structuredClone(initial)}}
function snap(){return JSON.parse(JSON.stringify({...state,history:[],future:[],selected:null}))}
function commit(){state.history.push(snap());if(state.history.length>35)state.history.shift();state.future=[]}
function touch(){localStorage.setItem(KEY,JSON.stringify({...state,history:[],future:[]}));$("#saveStatus").textContent="Saved just now"}
let saveTimer;function dirty(){clearTimeout(saveTimer);$("#saveStatus").textContent="Unsaved changes";saveTimer=setTimeout(touch,400)}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(x._t);x._t=setTimeout(()=>x.classList.remove("show"),1500)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
const active=()=>state.pages.find(p=>p.id===state.activePage)||state.pages[0];
const findSec=id=>active().sections.find(s=>s.id===id);
const selected=()=>state.selected?.sectionId?findSec(state.selected.sectionId):null;
function render(){
renderPages();renderCanvas();renderInspector();
$("#projectNameBtn").innerHTML=esc(state.projectName)+' <span>⌄</span>';
$("#breadcrumbProject").textContent=state.projectName;$("#breadcrumbPage").textContent=active().name;
$("#siteFrame").className="site-frame "+state.device;$("#siteFrame").style.transform="scale("+state.zoom+")";
$("#zoomLabel").textContent=Math.round(state.zoom*100)+"%";
$$(".device-btn").forEach(b=>b.classList.toggle("active",b.dataset.device===state.device));
}
function renderPages(){
const box=$("#pagesList");box.innerHTML="";
state.pages.forEach((p,i)=>{
const row=document.createElement("div");row.className="page-item"+(p.id===state.activePage?" active":"");
const ico=document.createElement("span");ico.className="page-icon";ico.textContent=i?"□":"⌂";
const n=document.createElement("button");n.className="page-name";n.type="button";n.textContent=p.name;
n.onclick=()=>{state.activePage=p.id;state.selected=null;render();dirty()};
n.ondblclick=()=>openRename(p);
const menu=document.createElement("button");menu.className="page-menu";menu.type="button";menu.textContent="⋯";menu.onclick=e=>{e.stopPropagation();openRename(p)};
row.append(ico,n,menu);box.appendChild(row);
})}
function bindSec(el,id){
if(!id)return;
el.dataset.section=id;
el.addEventListener("click",e=>{if(e.target.closest("button,input,textarea,summary"))return;state.selected={sectionId:id};renderInspector();$$(".site-section").forEach(x=>x.classList.remove("selected"));el.classList.add("selected")})
}
function bindText(el,id){
el.querySelectorAll(".canvas-edit-text").forEach(n=>{
n.addEventListener("click",e=>{e.stopPropagation();state.selected={sectionId:id,elementKey:n.dataset.key||"text"};renderInspector()});
n.addEventListener("dblclick",e=>{e.stopPropagation();commit();n.contentEditable="true";n.focus();document.execCommand("selectAll",false,null);const done=()=>{n.contentEditable="false";dirty()};n.addEventListener("blur",done,{once:true});n.addEventListener("keydown",ev=>{if(ev.key==="Enter"&&!ev.shiftKey){ev.preventDefault();n.blur()}},{once:true})})
})}
function renderCanvas(){
const c=$("#sitePage");c.innerHTML="";const p=active();
p.sections.forEach((s,i)=>{let el=document.createElement("section");el.className="site-section"+(state.selected?.sectionId===s.id?" selected":"");
const h=document.createElement("span");h.className="section-handle";h.textContent=(s.type+" section").toUpperCase();el.appendChild(h);
if(s.type==="header")el.innerHTML+=`<strong class="site-brand-edit canvas-edit-text" data-key="brand">YOUR BRAND</strong><nav class="site-nav-edit"></nav>`;
if(s.type==="hero")el.innerHTML+=`<div><span class="site-kicker canvas-edit-text" data-key="kicker">PREMIUM DIGITAL PRODUCTS</span><h2 class="canvas-edit-text" data-key="headline">Build Your <span>Dreams</span> Digitally</h2><p class="canvas-edit-text" data-key="body">Create a beautiful storefront, portfolio or landing page without touching code.</p><div class="hero-actions-edit"><button class="hero-button-edit" data-link="true">Explore products →</button><button class="hero-button-edit secondary" data-link="true">Learn more</button></div></div><div class="hero-visual"><div class="hero-visual-copy"><small>LIVE PREVIEW</small><strong>Make it yours.</strong></div></div>`;
if(s.type==="features")el.innerHTML+=`<span class="site-kicker">WHY IT WORKS</span><h3 class="feature-title canvas-edit-text" data-key="title">Everything you need to launch.</h3><p class="feature-subtitle canvas-edit-text" data-key="subtitle">A clean system for people who care about the final result.</p><div class="feature-grid-edit">${["Fast setup","Beautiful by default","Fully editable","Mobile ready"].map((x,k)=>'<article class="feature-card-edit"><div class="feature-icon-edit">'+["↯","✦","◇","⌁"][k]+'</div><strong class="canvas-edit-text">'+x+'</strong><p class="canvas-edit-text">Simple controls. No code required.</p></article>').join("")}</div>`;
if(s.type==="products")el.innerHTML+=`<div class="section-heading-row"><div><span class="site-kicker">FEATURED</span><h3 class="canvas-edit-text">Popular picks</h3><p class="canvas-edit-text">Swap these cards for your own products later.</p></div><button class="product-link">View all →</button></div><div class="product-grid-edit">${["Creator Vault","AI Money Arc","Crate 100"].map((x,k)=>'<article class="product-card-edit"><div class="product-art-edit'+(k===1?" two":k===2?" three":"")+'"></div><div class="product-copy-edit"><small>0'+(k+1)+' / DIGITAL</small><strong class="canvas-edit-text">'+x+'</strong><span class="canvas-edit-text">₹'+[399,299,199][k]+'</span></div></article>').join("")}</div>`;
if(s.type==="cta")el.innerHTML+=`<div style="padding:48px;border-radius:14px;background:#18171d;color:#fff"><span class="site-kicker" style="color:#aaa5b9">READY WHEN YOU ARE</span><h2 class="canvas-edit-text" style="font-size:48px">Turn the idea into a website.</h2><p class="canvas-edit-text" style="color:#aaa5b9">One page or ten. Your site stays yours.</p><button class="hero-button-edit" style="background:#8059ff;border-color:#8059ff" data-link="true">Get started →</button></div>`;
if(s.type==="about")el.innerHTML+=`<div class="feature-section-edit"><span class="site-kicker">ABOUT</span><h3 class="feature-title canvas-edit-text">A little about the brand.</h3><p class="feature-subtitle canvas-edit-text" style="max-width:620px">Tell visitors who you are, what you make and why they should care.</p></div>`;
if(s.type==="contact")el.innerHTML+=`<div class="feature-section-edit"><span class="site-kicker">CONTACT</span><h3 class="feature-title">Let's talk.</h3><div style="display:grid;gap:8px;max-width:520px;margin-top:22px"><input class="text-control" placeholder="Name"><input class="text-control" placeholder="Email"><textarea class="text-control" style="height:85px;padding-top:9px" placeholder="Message"></textarea><button class="hero-button-edit" style="width:max-content">Send message</button></div></div>`;
if(s.type==="faq")el.innerHTML+=`<div class="feature-section-edit"><span class="site-kicker">FAQ</span><h3 class="feature-title">Questions, answered.</h3><div style="margin-top:20px;display:grid;gap:8px">${["How does it work?","Can I add more pages?","Is mobile supported?"].map(q=>'<details style="border-bottom:1px solid #e6e5eb;padding:11px 0"><summary>'+q+'</summary><p style="color:#777681;font-size:9px">Edit this answer on your site.</p></details>').join("")}</div></div>`;
if(s.type==="footer")el.innerHTML+=`<span class="canvas-edit-text" data-key="left">© 2026 YOUR BRAND</span><span class="canvas-edit-text" data-key="right">Built with DEWIFY</span>`;
el.classList.add(s.type==="header"?"site-header-section":s.type==="hero"?"site-hero":s.type==="features"||s.type==="about"||s.type==="contact"||s.type==="faq"?"feature-section-edit":s.type==="products"?"product-section-edit":s.type==="footer"?"site-footer-section":"feature-section-edit");
if(s.type==="header"){const nav=el.querySelector(".site-nav-edit");state.pages.forEach(q=>{const b=document.createElement("button");b.type="button";b.textContent=q.name;b.onclick=e=>{e.stopPropagation();state.activePage=q.id;state.selected=null;render();dirty()};nav.appendChild(b)})}
bindSec(el,s.id);bindText(el,s.id);
el.querySelectorAll('[data-link="true"]').forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();state.selected={sectionId:s.id,elementKey:"link"};renderInspector()}));
c.appendChild(el)
});
}
function renderInspector(){
const root=$("#inspectorContent"), body=document.createElement("div");body.className="inspector-body";root.innerHTML="";root.appendChild(body);
if(tab==="style"){body.innerHTML=`<div class="inspector-block"><div class="inspector-title"><strong>Global styles</strong><span>Site</span></div><div class="field-stack"><div><label class="field-label">Color palette</label><div class="swatch-row" id="palettes"></div></div><div><label class="field-label">Heading font</label><select class="select-control"><option>Inter</option><option>DM Sans</option><option>Manrope</option><option>Playfair Display</option><option>Space Grotesk</option></select></div><div><label class="field-label">Body font</label><select class="select-control"><option>Inter</option><option>DM Sans</option><option>Manrope</option><option>Source Sans 3</option></select></div></div></div><div class="inspector-block"><div class="inspector-title"><strong>Canvas background</strong><span>Theme</span></div><div class="swatch-row"><button class="swatch-btn" style="background:#fff"></button><button class="swatch-btn" style="background:#f6f7fb"></button><button class="swatch-btn" style="background:#18171d"></button><button class="swatch-btn" style="background:#f3edff"></button></div></div><div class="inspector-block"><div class="inspector-title"><strong>Section spacing</strong><span>48 px</span></div><input class="range-control" type="range" min="8" max="120" value="48"></div>`;
const pr=$("#palettes");palettes.forEach(p=>{const b=document.createElement("button");b.className="swatch-btn"+(state.palette===p.name?" active":"");b.title=p.name;b.style.background="linear-gradient(135deg,"+p.accent+" 0 25%,"+p.soft+" 25% 50%,"+p.bg+" 50% 75%,"+p.text+" 75%)";b.onclick=()=>{commit();state.palette=p.name;state.accent=p.accent;dirty();render();toast(p.name+" palette applied")};pr.appendChild(b)});
}else{
const s=selected();if(!s){body.innerHTML='<div class="property-empty"><strong>Select something</strong>Click a text, button or section on the canvas.</div>';return}
body.innerHTML=`<div class="inspector-block"><div class="inspector-title"><strong>Position & size</strong><span>Layout</span></div><div class="field-stack"><div><label class="field-label">Width</label><select class="select-control"><option>Auto</option><option>Full width</option><option>Fit content</option></select></div><div><label class="field-label">Alignment</label><div class="segmented"><button class="active">Left</button><button>Center</button><button>Right</button></div></div></div></div><div class="inspector-block"><div class="inspector-title"><strong>Typography</strong><span>Text</span></div><div class="field-stack"><div><label class="field-label">Size</label><input class="number-control" value="18"></div><div><label class="field-label">Weight</label><select class="select-control"><option>400</option><option selected>600</option><option>700</option><option>800</option><option>900</option></select></div><div><label class="field-label">Color</label><input class="color-input" value="#16151b" type="color"></div></div></div><div class="inspector-block"><div class="inspector-title"><strong>Link / action</strong><span>Optional</span></div><div class="link-row"><select class="select-control" id="linkSelect"><option value="">No link</option>${state.pages.map(p=>'<option value="'+p.id+'">'+esc(p.name)+'</option>').join("")}</select><button class="add-square" id="newPageFromLink" type="button">+</button></div><p style="margin:7px 0;color:#9a9aa5;font-size:8px;line-height:1.5">Use any page as a destination for text or buttons.</p></div><div class="inspector-block"><div class="inspector-title"><strong>Arrange</strong><span>Sections</span></div><div class="action-row"><button class="mini-action" id="dupSection">Duplicate</button><button class="mini-action" id="delSection">Delete</button></div></div>`;
$("#newPageFromLink").onclick=openPageModal;$("#dupSection").onclick=()=>{commit();const a=active().sections,i=a.findIndex(x=>x.id===s.id),copy={...s,id:uid(s.type)};a.splice(i+1,0,copy);state.selected={sectionId:copy.id};dirty();render();toast("Duplicated")};$("#delSection").onclick=()=>{if(["header","footer"].includes(s.type)){toast("Header and footer are always present");return}commit();active().sections=active().sections.filter(x=>x.id!==s.id);state.selected=null;dirty();render();toast("Deleted")};
}}
function openPageModal(){const m=$("#pageModal");m.classList.remove("hidden");$("#pageNameInput").value="";setTimeout(()=>$("#pageNameInput").focus(),30)}
function closeModals(){$$(".modal-backdrop").forEach(m=>m.classList.add("hidden"))}
function createPage(){const n=$("#pageNameInput").value.trim();if(!n)return toast("Name the page first");if(state.pages.some(p=>p.name.toLowerCase()===n.toLowerCase()))return toast("That name already exists");commit();const p=page(uid("page"),n);state.pages.push(p);state.activePage=p.id;state.selected=null;closeModals();dirty();render();toast(n+" page created")}
function openRename(p){renameTarget=p;$("#renamePageInput").value=p.name;$("#renameModal").classList.remove("hidden");setTimeout(()=>$("#renamePageInput").select(),20)}
function rename(){const n=$("#renamePageInput").value.trim();if(!renameTarget||!n)return;if(state.pages.some(p=>p.id!==renameTarget.id&&p.name.toLowerCase()===n.toLowerCase()))return toast("That name already exists");commit();renameTarget.name=n;renameTarget=null;closeModals();dirty();render();toast("Page renamed")}
function undo(){const p=state.history.pop();if(!p)return;state.future.push(snap());state={...p,history:state.history,future:state.future,selected:null};touch();render();toast("Undone")}
function redo(){const p=state.future.pop();if(!p)return;state.history.push(snap());state={...p,history:state.history,future:state.future,selected:null};touch();render();toast("Redone")}
function preview(){const out=$("#previewSite");out.innerHTML="";const wrap=document.createElement("div");wrap.className="preview-inner";const clone=$("#sitePage").cloneNode(true);clone.querySelectorAll(".section-handle").forEach(x=>x.remove());clone.querySelectorAll(".selected").forEach(x=>x.classList.remove("selected"));wrap.appendChild(clone);out.appendChild(wrap);$("#previewOverlay").classList.remove("hidden")}
$$(".inspector-tab").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;$$(".inspector-tab").forEach(x=>x.classList.toggle("active",x===b));renderInspector()});
$("#addPageBtn").onclick=openPageModal;$("#createPageConfirm").onclick=createPage;$("#renamePageConfirm").onclick=rename;$$("[data-close-modal]").forEach(b=>b.onclick=closeModals);$$(".modal-backdrop").forEach(m=>m.onclick=e=>{if(e.target===m)closeModals()});
$("#undoBtn").onclick=undo;$("#redoBtn").onclick=redo;$("#previewBtn").onclick=preview;$("#closePreviewBtn").onclick=()=>$("#previewOverlay").classList.add("hidden");
$("#publishBtn").onclick=()=>{touch();toast("Saved locally — publishing will be connected later")};
$("#projectNameBtn").onclick=()=>{const n=prompt("Website name",state.projectName);if(n?.trim()){commit();state.projectName=n.trim();dirty();render()}};
$("#zoomIn").onclick=()=>{state.zoom=Math.min(1.3,+(state.zoom+.1).toFixed(2));render()};
$("#zoomOut").onclick=()=>{state.zoom=Math.max(.6,+(state.zoom-.1).toFixed(2));render()};$("#zoomReset").onclick=()=>{state.zoom=1;render()};
$$(".device-btn").forEach(b=>b.onclick=()=>{state.device=b.dataset.device;render()});
$$(".element-tile").forEach(b=>b.onclick=()=>{const t=b.dataset.element, map={text:"about",button:"cta",image:"about",video:"about",divider:"features",spacer:"features",icon:"features",social:"features",products:"products",faq:"faq",contact:"contact",html:"about"};commit();active().sections.splice(active().sections.length-1,0,{id:uid(t),type:map[t]||"about"});dirty();render();toast(t.charAt(0).toUpperCase()+t.slice(1)+" added")});
$$(".template-card").forEach(b=>b.onclick=()=>{commit();active().sections.splice(active().sections.length-1,0,{id:uid(b.dataset.template),type:b.dataset.template});dirty();render();toast("Template added")});
$("#elementSearch").oninput=e=>{const q=e.target.value.toLowerCase();$$(".element-tile").forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q)?"":"none")};
$("#clearElementSearch").onclick=()=>{$("#elementSearch").value="";$$(".element-tile").forEach(b=>b.style.display="")};
$("#viewAllTemplates").onclick=()=>toast("More templates coming to the library");
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModals();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?redo():undo()}});
render();
})();