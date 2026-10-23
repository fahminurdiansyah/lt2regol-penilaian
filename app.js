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
 const hint=document.createElement("p");hint.className="hint";hint.textContent="Pilih 1–5 bintang. Skala ketat: 1★ = 0%, 2★ = 25%, 3★ = 50%, 4★ = 75%, 5★ = 100% dari bobot.";card.append(hint);
 const wrap=document.createElement("div");wrap.className="starInput";wrap.setAttribute("role","group");wrap.setAttribute("aria-label","Penilaian "+item.label);
 const buttons=[];
 const labels={1:"Tidak memenuhi",2:"Kurang memenuhi",3:"Cukup memenuhi",4:"Memenuhi dengan baik",5:"Sangat baik"};
 const update=stars=>{
  const n=Math.max(0,Math.min(5,Number(stars)||0));
  const value=n===0?0:((n-1)/4)*item.maxScore;
  scores[item.key]=value;
  buttons.forEach((button,index)=>{
   const active=index<n;button.textContent=active?"★":"☆";
   button.classList.toggle("selected",active);button.setAttribute("aria-pressed",active?"true":"false");
   button.setAttribute("aria-label",(index+1)+" bintang");
  });
  const chosen=wrap.querySelector(".starDescription");
  chosen.textContent=n===0?"Belum dinilai":n+"/5 bintang — "+labels[n];
  $("score-"+item.key).textContent=fmt(value);calculate();
 };
 for(let i=1;i<=5;i++){
  const button=document.createElement("button");button.type="button";button.className="starButton";button.textContent="☆";button.setAttribute("aria-pressed","false");button.setAttribute("aria-label",i+" bintang");button.title=i+" bintang — "+labels[i];
  button.addEventListener("click",()=>update(i));buttons.push(button);wrap.append(button);
 }
 const description=document.createElement("span");description.className="starDescription";description.textContent="Belum dinilai";wrap.append(description);
 card.append(wrap);return card;
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
function setSubmitStage(stage){
 const steps=[...document.querySelectorAll("#submitSteps li")];
 steps.forEach((item,index)=>{item.classList.toggle("done",index<stage);item.classList.toggle("active",index===stage);const icon=item.querySelector(".step-icon");icon.textContent=index<stage?"✓":String(index+1)});
 $("submitProgress").style.width=([0,35,72,100][stage]||100)+"%";
}
function closeSubmitModal(){
 $("submitOverlay").hidden=true;
 $("submitBtn").disabled=false;$("clearBtn").disabled=false;
 $("submitBtn").textContent="Kirim penilaian ke Google Forms";
}
function submit(){
 if($("submitBtn").disabled)return;
 clearStatus();const team=$("regu").value.trim();
 if(!team){status("Isi nama regu terlebih dahulu.","err");$("regu").focus();return}
 const deductions=(config.deductionItems||[]).filter(x=>checkedFindings.has(x.id)).reduce((sum,x)=>sum+x.deduction,0);
 const values={...scores};
 values.ketepatan=Math.max(0,Number(config.criteria.ketepatan||0)-deductions);
 values.kelengkapan=(config.checklist||[]).length ? checkedDocs.size/config.checklist.length*Number(config.criteria.kelengkapan||0) : 0;
 const payload=PenilaianConfig.buildFormPayload(code,team,values);
 const form=$("googleSubmitForm");form.innerHTML="";form.action=PenilaianConfig.FORM_RESPONSE_URL;
 Object.entries(payload).forEach(([name,value])=>{const input=document.createElement("input");input.type="hidden";input.name=name;input.value=String(value);form.append(input)});
 const btn=$("submitBtn");btn.disabled=true;btn.textContent="Mengirim…";$("clearBtn").disabled=true;
 const overlay=$("submitOverlay");overlay.hidden=false;
 $("submitModalTitle").textContent="Mengirim penilaian ke Google Forms";
 $("submitModalDescription").textContent="Mohon tunggu sekitar 7 detik. Jangan tutup halaman ini.";
 $("submitFinalNote").hidden=true;$("submitCaveat").hidden=true;$("continueBtn").hidden=true;
 setSubmitStage(0);
 let stageTimer=setTimeout(()=>setSubmitStage(1),2200);
 let stageTimer2=setTimeout(()=>setSubmitStage(2),5000);
 let finished=false;
 const finish=()=>{
  if(finished)return;finished=true;clearTimeout(stageTimer);clearTimeout(stageTimer2);
  setSubmitStage(3);
  $("submitModalTitle").textContent="Pengiriman selesai";
  $("submitModalDescription").textContent="Proses pengiriman telah dijalankan.";
  $("submitFinalNote").hidden=false;$("submitCaveat").hidden=false;$("continueBtn").hidden=false;
  btn.textContent="Kirim penilaian ke Google Forms";
 };
 form.submit();
 setTimeout(finish,7000);
}

$("submitBtn").addEventListener("click",submit);
$("clearBtn").addEventListener("click",()=>{if($("submitBtn").disabled)return;reset()});
$("continueBtn").addEventListener("click",closeSubmitModal);
initControls();calculate();
})();
