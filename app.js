"use strict";
(function(){
const $=id=>document.getElementById(id);
const code=document.body.dataset.competition;
const config=PenilaianConfig.getCompetition(code);
const criteria=PenilaianConfig.getActiveCriteria(code);
const fmt=n=>Number(n||0).toLocaleString("id-ID",{maximumFractionDigits:2});
let checkedDocs=new Set(), checkedFindings=new Set(), scores={};
function status(message,type){$("status").textContent=message;$("status").className="status show "+type}
function clearStatus(){$("status").textContent="";$("status").className="status"}
function renderChecklist(items){
 const root=$("docs");root.innerHTML="";
 (items||[]).forEach((item,i)=>{
  const label=document.createElement("label");label.className="item";
  const input=document.createElement("input");input.type="checkbox";
  const text=document.createElement("span");text.textContent=(i+1)+". "+item;
  input.addEventListener("change",()=>{input.checked?checkedDocs.add(i):checkedDocs.delete(i);calculate()});
  label.append(input,text);root.append(label);
 });
}
function renderFindings(items){
 const root=$("findings");root.innerHTML="";
 (items||[]).forEach(item=>{
  const label=document.createElement("label");label.className="item";
  const input=document.createElement("input");input.type="checkbox";
  const text=document.createElement("span");text.textContent=item.label;
  const deduction=document.createElement("span");deduction.className="deduct";deduction.textContent="−"+item.deduction;
  input.addEventListener("change",()=>{input.checked?checkedFindings.add(item.id):checkedFindings.delete(item.id);calculate()});
  label.append(input,text,deduction);root.append(label);
 });
}
function scoreControl(item){
 const card=document.createElement("section");card.className="card";
 const title=document.createElement("div");title.className="title";
 const name=document.createElement("span");name.textContent=item.label;
 const score=document.createElement("span");score.className="score";score.innerHTML='<b id="score-'+item.key+'">0</b>/'+fmt(item.maxScore);
 title.append(name,score);card.append(title);
 const hint=document.createElement("p");hint.className="hint";hint.textContent="Nilai maksimal "+fmt(item.maxScore)+" poin.";card.append(hint);
 const wrap=document.createElement("div");wrap.className="scoreInput";
 const range=document.createElement("input");range.type="range";range.min="0";range.max=String(item.maxScore);range.step="0.5";range.value="0";range.setAttribute("aria-label",item.label+" slider");
 const number=document.createElement("input");number.type="number";number.min="0";number.max=String(item.maxScore);number.step="0.5";number.value="0";number.setAttribute("aria-label",item.label+" nilai");
 const update=v=>{let n=Number(v);if(!Number.isFinite(n))n=0;n=Math.max(0,Math.min(item.maxScore,n));scores[item.key]=n;number.value=String(n);range.value=String(n);$("score-"+item.key).textContent=fmt(n);calculate()};
 range.addEventListener("input",()=>update(range.value));number.addEventListener("input",()=>update(number.value));
 wrap.append(range,number);card.append(wrap);return card;
}
function calculate(){
 const maxKetepatan=Number(config.criteria.ketepatan||0);
 const maxKelengkapan=Number(config.criteria.kelengkapan||0);
 const deductions=(config.deductionItems||[]).filter(x=>checkedFindings.has(x.id)).reduce((sum,x)=>sum+x.deduction,0);
 const ketepatan=Math.max(0,maxKetepatan-deductions);
 const kelengkapan=(config.checklist||[]).length ? checkedDocs.size/config.checklist.length*maxKelengkapan : 0;
 $("accuracyScore").textContent=fmt(ketepatan);$("completenessScore").textContent=fmt(kelengkapan);
 $("count").textContent=checkedDocs.size;
 $("findsum").textContent=checkedFindings.size ? checkedFindings.size+" temuan · total pengurangan "+fmt(deductions)+" poin." : "Belum ada temuan.";
 let total=0;
 criteria.forEach(item=>{
  if(item.key==="ketepatan")total+=ketepatan;
  else if(item.key==="kelengkapan")total+=kelengkapan;
  else total+=Math.min(item.maxScore,Math.max(0,Number(scores[item.key]||0)));
 });
 $("total").textContent=fmt(total);$("totalMax").textContent="/"+fmt(PenilaianConfig.getTotalMax(code));
 $("totalDescription").textContent=criteria.length+" kriteria aktif · bobot dari penilaian.js.";
}
function reset(){
 clearStatus();checkedDocs=new Set();checkedFindings=new Set();scores={};$("regu").value="";
 initControls();calculate();window.scrollTo({top:0,behavior:"smooth"});
 status("Isian dibersihkan. Mata lomba tetap "+code+".","ok");
}
function initControls(){
 $("pageTitle").textContent="Penilaian "+code+" — "+config.title;
 $("pageSub").textContent="LT II Regol 2026 · "+config.description;
 $("codeBadge").textContent=code;
 $("accuracyMax").textContent=fmt(config.criteria.ketepatan||0);
 $("completenessMax").textContent=fmt(config.criteria.kelengkapan||0);
 $("accuracyHint").textContent=config.scoring?.ketepatan||"Centang temuan yang ditemukan.";
 $("completenessHint").textContent=config.scoring?.kelengkapan||"Centang butir yang tersedia.";
 $("accuracyCard").hidden=!(config.criteria.ketepatan>0);
 $("completenessCard").hidden=!(config.criteria.kelengkapan>0);
 renderFindings(config.deductionItems||[]);renderChecklist(config.checklist||[]);
 $("otherCriteria").innerHTML="";
 criteria.filter(x=>!["ketepatan","kelengkapan"].includes(x.key)).forEach(item=>$("otherCriteria").append(scoreControl(item)));
}
function submit(){
 clearStatus();const team=$("regu").value.trim();
 if(!team){status("Isi nama regu terlebih dahulu.","err");$("regu").focus();return}
 const deductions=(config.deductionItems||[]).filter(x=>checkedFindings.has(x.id)).reduce((sum,x)=>sum+x.deduction,0);
 const values={...scores};
 values.ketepatan=Math.max(0,Number(config.criteria.ketepatan||0)-deductions);
 values.kelengkapan=(config.checklist||[]).length ? checkedDocs.size/config.checklist.length*Number(config.criteria.kelengkapan||0) : 0;
 const payload=PenilaianConfig.buildFormPayload(code,team,values);
 const form=$("googleSubmitForm");form.innerHTML="";form.action=PenilaianConfig.FORM_RESPONSE_URL;
 Object.entries(payload).forEach(([name,value])=>{const input=document.createElement("input");input.type="hidden";input.name=name;input.value=String(value);form.append(input)});
 const btn=$("submitBtn");btn.disabled=true;btn.textContent="Mengirim…";
 const iframe=$("googleFormTarget");let finished=false;
 const finish=()=>{if(finished)return;finished=true;btn.disabled=false;btn.textContent="Kirim penilaian ke Google Forms";status("Permintaan pengiriman telah dilakukan. Periksa tab Respons Google Forms untuk memastikan data benar-benar masuk.","ok");iframe.onload=null};
 iframe.onload=()=>setTimeout(finish,700);setTimeout(finish,2500);
 form.submit();
}
$("submitBtn").addEventListener("click",submit);
$("clearBtn").addEventListener("click",reset);
initControls();calculate();
})();
