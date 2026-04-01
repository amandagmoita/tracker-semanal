import { useState, useEffect, useCallback } from "react";
import { storage } from "./storage.js";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex"];

const DEFAULT_SCHEDULE = {
  Seg: [
    { id: "seg-1", time: "8h\u20139h", task: "Rotina + Planejamento", icon: "\u2615", cat: "admin", desc: "Revisar prioridades da semana, checar m\u00e9tricas do fim de semana, definir top 3 do dia.", auto: "n8n: relat\u00f3rio autom\u00e1tico de m\u00e9tricas Instagram (seguidores, alcance, engajamento) enviado por email toda segunda 7h.", mins: 60 },
    { id: "seg-2", time: "9h\u201311h", task: "Cria\u00e7\u00e3o @amandag.ia", icon: "\u270d\ufe0f", cat: "ia", desc: "Roteirizar, criar design e finalizar post #1 da semana para @amandag.ia.", auto: "Claude Cowork: usar Roteirista Viral + Analista de Instagram pra gerar 3 op\u00e7\u00f5es de hook antes de criar.", mins: 120 },
    { id: "seg-3", time: "11h\u201312h", task: "Academia", icon: "\ud83c\udfcb\ufe0f", cat: "saude", desc: "Treino presencial \u2014 bloco protegido, sem trabalho.", mins: 60 },
    { id: "seg-4", time: "14h\u201315h30", task: "E-commerce", icon: "\ud83d\udce6", cat: "ecom", desc: "Processar pedidos, responder SAC, verificar estoque e status de envios.", auto: "n8n: Shopify \u2192 Google Sheets autom\u00e1tico com pedidos novos + alertas de estoque baixo no WhatsApp.", mins: 90 },
    { id: "seg-5", time: "15h30\u201316h30", task: "Engajamento redes", icon: "\ud83d\udcf1", cat: "social", desc: "Responder DMs, coment\u00e1rios e interagir com perfis estrat\u00e9gicos nas duas contas.", auto: "n8n: notifica\u00e7\u00e3o consolidada de coment\u00e1rios e DMs pendentes nas duas contas, enviada 15h.", mins: 60 },
    { id: "seg-6", time: "17h\u201318h", task: "Estudo / Curso IA", icon: "\ud83e\udde0", cat: "estudo", desc: "Estruturar m\u00f3dulos do curso, gravar aulas-piloto, organizar grade curricular para nov/26.", mins: 60 },
  ],
  Ter: [
    { id: "ter-1", time: "8h\u20139h", task: "Pesquisa IA", icon: "\ud83d\udd2c", cat: "pesquisa", desc: "Explorar ferramentas novas, testar updates, anotar insights para conte\u00fado e curso.", auto: "Apify: scraping semanal de Product Hunt, trending repos GitHub e newsletters IA \u2014 entregue como briefing no email.", mins: 60 },
    { id: "ter-2", time: "9h\u201311h", task: "Cria\u00e7\u00e3o @amandag.ia", icon: "\u270d\ufe0f", cat: "ia", desc: "Roteirizar, criar design e finalizar post #2 da semana para @amandag.ia.", auto: "Claude Cowork: Analista de Competidores roda an\u00e1lise dos posts da semana dos concorrentes antes de criar.", mins: 120 },
    { id: "ter-3", time: "11h\u201312h", task: "Cria\u00e7\u00e3o (cont.) / Revis\u00e3o", icon: "\u270d\ufe0f", cat: "ia", desc: "Finalizar post se necess\u00e1rio, revisar posts da equipe VA, ajustar calend\u00e1rio.", mins: 60 },
    { id: "ter-4", time: "14h\u201315h", task: "Agendar posts da semana", icon: "\ud83d\udcf1", cat: "social", desc: "Programar todos os posts prontos no agendador (IA + VA), verificar hor\u00e1rios e legendas.", auto: "n8n: post autom\u00e1tico nos melhores hor\u00e1rios via API do Instagram \u2014 s\u00f3 precisa aprovar o conte\u00fado.", mins: 60 },
    { id: "ter-5", time: "15h\u201316h", task: "Reuni\u00e3o Vida Autoral", icon: "\ud83e\udd1d", cat: "reuniao", desc: "Alinhamento semanal com equipe VA: status do funil Serena, m\u00e9tricas, pr\u00f3ximos passos.", auto: "n8n: dashboard autom\u00e1tico de vendas Serena + convers\u00f5es funil enviado 1h antes da reuni\u00e3o.", mins: 60 },
    { id: "ter-6", time: "17h\u201318h", task: "Estudo / Curso IA", icon: "\ud83e\udde0", cat: "estudo", desc: "Continuar estrutura\u00e7\u00e3o do curso, pesquisar refer\u00eancias de grade (NoeAI, HBS), testar ferramentas.", mins: 60 },
  ],
  Qua: [
    { id: "qua-1", time: "8h\u20139h", task: "Rotina + Planejamento", icon: "\u2615", cat: "admin", desc: "Revisar meio de semana, ajustar prioridades, checar entregas pendentes.", mins: 60 },
    { id: "qua-2", time: "9h\u201311h", task: "Cria\u00e7\u00e3o @vida.autoral", icon: "\u270d\ufe0f", cat: "va", desc: "Roteirizar, criar design e finalizar post #1 da semana para @vida.autoral.", auto: "Claude Cowork: usar skill Vida Autoral Brand para manter identidade visual consistente nos carross\u00e9is.", mins: 120 },
    { id: "qua-3", time: "11h\u201312h", task: "Academia", icon: "\ud83c\udfcb\ufe0f", cat: "saude", desc: "Treino presencial \u2014 bloco protegido, sem trabalho.", mins: 60 },
    { id: "qua-4", time: "14h\u201315h30", task: "E-commerce", icon: "\ud83d\udce6", cat: "ecom", desc: "Processar pedidos, responder SAC, atualizar cat\u00e1logo se necess\u00e1rio.", mins: 90 },
    { id: "qua-5", time: "15h30\u201316h30", task: "Engajamento redes", icon: "\ud83d\udcf1", cat: "social", desc: "Responder DMs, coment\u00e1rios e interagir com perfis estrat\u00e9gicos.", mins: 60 },
    { id: "qua-6", time: "17h\u201318h", task: "Admin", icon: "\ud83d\udce7", cat: "admin", desc: "Emails, tarefas pendentes, organiza\u00e7\u00e3o de arquivos e ferramentas.", auto: "n8n: resumo autom\u00e1tico de emails importantes n\u00e3o respondidos, enviado \u00e0s 16h45.", mins: 60 },
  ],
  Qui: [
    { id: "qui-1", time: "8h\u20139h", task: "Pesquisa IA", icon: "\ud83d\udd2c", cat: "pesquisa", desc: "Testar ferramentas identificadas na ter\u00e7a, documentar aprendizados para o curso.", auto: "Apify + Claude: minera\u00e7\u00e3o de ganchos virais de perfis de IA no Instagram/TikTok \u2014 briefing pronto pra usar.", mins: 60 },
    { id: "qui-2", time: "9h\u201311h", task: "Cria\u00e7\u00e3o @vida.autoral", icon: "\u270d\ufe0f", cat: "va", desc: "Roteirizar, criar design e finalizar post #2 da semana para @vida.autoral.", mins: 120 },
    { id: "qui-3", time: "11h\u201312h", task: "Cria\u00e7\u00e3o (cont.) / Revis\u00e3o", icon: "\u270d\ufe0f", cat: "va", desc: "Finalizar post VA, revisar materiais da equipe, ajustar se necess\u00e1rio.", mins: 60 },
    { id: "qui-4", time: "14h\u201315h30", task: "E-commerce", icon: "\ud83d\udce6", cat: "ecom", desc: "Processar pedidos, acompanhar devolu\u00e7\u00f5es, preparar relat\u00f3rio pra reuni\u00e3o.", auto: "n8n: relat\u00f3rio semanal de vendas Shopify gerado automaticamente antes da reuni\u00e3o de 16h.", mins: 90 },
    { id: "qui-5", time: "16h\u201317h", task: "Reuni\u00e3o E-commerce", icon: "\ud83e\udd1d", cat: "reuniao", desc: "Reuni\u00e3o fixa com equipe: m\u00e9tricas, problemas, decis\u00f5es operacionais.", mins: 60 },
    { id: "qui-6", time: "17h\u201318h", task: "Admin", icon: "\ud83d\udce7", cat: "admin", desc: "Emails, tarefas pendentes, preparar pautas de amanh\u00e3.", mins: 60 },
  ],
  Sex: [
    { id: "sex-1", time: "8h\u20139h", task: "Rotina + Planejamento", icon: "\u2615", cat: "admin", desc: "Revisar entregas da semana, identificar o que ficou pendente.", mins: 60 },
    { id: "sex-2", time: "9h\u201311h", task: "Batch: post #3 IA + VA", icon: "\u270d\ufe0f", cat: "ia", desc: "Finalizar o terceiro post de cada marca. Dia de fechar a produ\u00e7\u00e3o semanal de conte\u00fado.", auto: "Claude Cowork: rodar batch de 2 roteiros (1 IA + 1 VA) com hooks pr\u00e9-minerados da semana.", mins: 120 },
    { id: "sex-3", time: "11h\u201312h", task: "Academia", icon: "\ud83c\udfcb\ufe0f", cat: "saude", desc: "Treino presencial \u2014 bloco protegido, sem trabalho.", mins: 60 },
    { id: "sex-4", time: "14h\u201315h", task: "Revis\u00e3o semanal", icon: "\ud83d\udcca", cat: "revisao", desc: "Analisar m\u00e9tricas das duas contas, comparar com semana anterior, anotar aprendizados.", auto: "n8n: relat\u00f3rio comparativo semanal (IA + VA) com m\u00e9tricas Instagram + vendas Serena + e-commerce.", mins: 60 },
    { id: "sex-5", time: "15h\u201316h", task: "Planejamento pr\u00f3x. semana", icon: "\ud83d\udcca", cat: "revisao", desc: "Definir pautas da pr\u00f3xima semana, alocar temas nos dias, preparar briefings.", mins: 60 },
    { id: "sex-6", time: "16h\u201317h", task: "Estudo / Curso IA", icon: "\ud83e\udde0", cat: "estudo", desc: "Fechar a semana com foco no curso: revisar progresso, definir pr\u00f3ximos m\u00f3dulos.", mins: 60 },
  ],
};

const catLabels = { ia: "Cria\u00e7\u00e3o @amandag.ia", va: "Cria\u00e7\u00e3o @vida.autoral", pesquisa: "Pesquisa IA", estudo: "Estudo / Curso IA", ecom: "E-commerce", social: "Redes sociais", reuniao: "Reuni\u00f5es", admin: "Admin", saude: "Sa\u00fade", revisao: "Revis\u00e3o semanal" };
const catColors = { ia: "#8B5CF6", va: "#F59E0B", pesquisa: "#06B6D4", estudo: "#A855F7", ecom: "#EAB308", social: "#F97316", reuniao: "#10B981", admin: "#9CA3AF", saude: "#22C55E", revisao: "#3B82F6" };

function getWeekKey(date) { const d = new Date(date); const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1); const monday = new Date(d.setDate(diff)); return monday.getFullYear()+"-"+String(monday.getMonth()+1).padStart(2,"0")+"-"+String(monday.getDate()).padStart(2,"0"); }
function getWeekDates(wk) { const [y,m,d] = wk.split("-").map(Number); const mon = new Date(y,m-1,d); return DAYS.map((_,i) => { const dt = new Date(mon); dt.setDate(mon.getDate()+i); return String(dt.getDate()).padStart(2,"0")+"/"+String(dt.getMonth()+1).padStart(2,"0"); }); }
function shiftWeek(wk, delta) { const [y,m,d] = wk.split("-").map(Number); return getWeekKey(new Date(y,m-1,d+delta*7)); }
function formatWeekLabel(wk) { const [y,m,d] = wk.split("-").map(Number); const mon = new Date(y,m-1,d); const fri = new Date(y,m-1,d+4); const ms=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"]; return mon.getDate()+" "+ms[mon.getMonth()]+" \u2014 "+fri.getDate()+" "+ms[fri.getMonth()]+" "+fri.getFullYear(); }
function fmtMins(m) { const h=Math.floor(m/60); const mm=m%60; return h>0?(mm>0?h+"h"+mm:h+"h"):mm+"min"; }

const SK = "tracker-v3:";
const f = { font: "'Inter', system-ui, sans-serif", bg: "#FAFAFA", text: "#111", muted: "#999", line: "#E5E5E5", card: "#FFF" };

export default function App() {
  const [currentWeek, setCurrentWeek] = useState(getWeekKey(new Date()));
  const [data, setData] = useState({});
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("semana");
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [expandedTask, setExpandedTask] = useState(null);
  const [editingTime, setEditingTime] = useState(null);
  const [timeVal, setTimeVal] = useState("");
  const [activeDay, setActiveDay] = useState(null);
  const [movingTask, setMovingTask] = useState(null);
  const [dragItem, setDragItem] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const dataKey = SK+"data:"+currentWeek;
  const schedKey = SK+"sched:"+currentWeek;

  useEffect(() => {
    (async () => {
      setLoading(true);
      let d={}, s=null;
      try { const r = await storage.get(dataKey); if(r?.value) d=JSON.parse(r.value); } catch{}
      try { const r = await storage.get(schedKey); if(r?.value) s=JSON.parse(r.value); } catch{}
      setData(d);
      setSchedule(s || JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)));
      setLoading(false);
    })();
  }, [dataKey, schedKey]);

  const persistData = useCallback(async(nd)=>{ setData(nd); try{await storage.set(dataKey,JSON.stringify(nd));}catch{} },[dataKey]);
  const persistSched = useCallback(async(ns)=>{ setSchedule(ns); try{await storage.set(schedKey,JSON.stringify(ns));}catch{} },[schedKey]);

  const toggleDone=(id)=>{ const nd={...data}; if(!nd[id]) nd[id]={done:false,note:"",realMins:null}; nd[id]={...nd[id],done:!nd[id].done}; persistData(nd); };
  const saveNote=(id)=>{ const nd={...data}; if(!nd[id]) nd[id]={done:false,note:"",realMins:null}; nd[id]={...nd[id],note:noteText}; persistData(nd); setEditingNote(null); setNoteText(""); };
  const saveTime=(id)=>{ const v=parseInt(timeVal); if(isNaN(v)||v<0) return; const nd={...data}; if(!nd[id]) nd[id]={done:false,note:"",realMins:null}; nd[id]={...nd[id],realMins:v}; persistData(nd); setEditingTime(null); setTimeVal(""); };

  const handleDragStart=(day,idx)=>setDragItem({day,idx});
  const handleDragOver=(e,day,idx)=>{e.preventDefault();setDragOverDay(day);setDragOverIdx(idx);};
  const handleDrop=(targetDay,targetIdx)=>{
    if(!dragItem||!schedule) return;
    const ns=JSON.parse(JSON.stringify(schedule));
    const [item]=ns[dragItem.day].splice(dragItem.idx,1);
    const adjIdx=(dragItem.day===targetDay&&targetIdx>dragItem.idx)?targetIdx-1:targetIdx;
    ns[targetDay].splice(adjIdx,0,item);
    persistSched(ns);
    setDragItem(null);setDragOverDay(null);setDragOverIdx(null);
  };
  const handleDragEnd=()=>{setDragItem(null);setDragOverDay(null);setDragOverIdx(null);};

  const moveWithinDay=(day,idx,dir)=>{
    const ni=idx+dir;
    if(ni<0||ni>=schedule[day].length) return;
    const ns=JSON.parse(JSON.stringify(schedule));
    const [item]=ns[day].splice(idx,1);
    ns[day].splice(ni,0,item);
    persistSched(ns);
  };

  const moveToDay=(fromDay,idx,toDay)=>{
    if(fromDay===toDay){setMovingTask(null);return;}
    const ns=JSON.parse(JSON.stringify(schedule));
    const [item]=ns[fromDay].splice(idx,1);
    ns[toDay].push(item);
    persistSched(ns);
    setMovingTask(null);
  };

  if(loading||!schedule) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:f.font}}><p style={{color:f.muted,fontSize:14}}>carregando...</p></div>;

  const allTasks=Object.values(schedule).flat();
  const totalTasks=allTasks.length;
  const doneTasks=allTasks.filter(t=>data[t.id]?.done).length;
  const pct=totalTasks>0?Math.round(doneTasks/totalTasks*100):0;
  const getDayStats=(day)=>{const tasks=schedule[day];const done=tasks.filter(t=>data[t.id]?.done).length;return{done,total:tasks.length,pct:tasks.length?Math.round(done/tasks.length*100):0};};
  const getCatStats=()=>{const st={};allTasks.forEach(t=>{if(!st[t.cat])st[t.cat]={done:0,total:0,planned:0,real:0};st[t.cat].total++;st[t.cat].planned+=t.mins||0;if(data[t.id]?.done){st[t.cat].done++;st[t.cat].real+=data[t.id]?.realMins??t.mins??0;}});return st;};

  const weekDates=getWeekDates(currentWeek);
  const today=new Date();
  const todayStr=String(today.getDate()).padStart(2,"0")+"/"+String(today.getMonth()+1).padStart(2,"0");

  const MoveBtn=({onClick,children,disabled})=>(
    <button onClick={onClick} disabled={disabled} style={{
      background:disabled?"#F5F5F5":"#FFF",border:"1px solid "+(disabled?"#EEE":"#DDD"),
      borderRadius:5,width:28,height:28,cursor:disabled?"default":"pointer",
      display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:13,color:disabled?"#DDD":"#666",fontFamily:f.font
    }}>{children}</button>
  );

  const TaskCard=({task,compact,dayKey,idx,showMoveControls})=>{
    const entry=data[task.id]||{done:false,note:"",realMins:null};
    const isExp=expandedTask===task.id;
    const isEditNote=editingNote===task.id;
    const isEditTime=editingTime===task.id;
    const isMoving=movingTask?.day===dayKey&&movingTask?.idx===idx;
    const color=catColors[task.cat]||"#999";
    const dayTasks=schedule[dayKey];

    return (
      <div
        draggable={compact}
        onDragStart={compact?()=>handleDragStart(dayKey,idx):undefined}
        onDragOver={compact?(e)=>handleDragOver(e,dayKey,idx):undefined}
        onDrop={compact?()=>handleDrop(dayKey,idx):undefined}
        onDragEnd={compact?handleDragEnd:undefined}
        style={{
          background:f.card,borderRadius:10,padding:compact?"8px 10px":"12px 14px",
          border:"1px solid "+((dragOverDay===dayKey&&dragOverIdx===idx)||isMoving?"#111":f.line),
          opacity:entry.done?0.5:1,cursor:compact?"grab":"default",borderLeft:"3px solid "+color,
        }}
      >
        <div style={{display:"flex",alignItems:"flex-start",gap:compact?8:10}}>
          <div onClick={()=>toggleDone(task.id)} style={{
            width:18,height:18,borderRadius:4,border:entry.done?"none":"1.5px solid #CCC",
            background:entry.done?"#111":"transparent",display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer",flexShrink:0,marginTop:1
          }}>{entry.done&&<span style={{color:"#FFF",fontSize:10}}>&#10003;</span>}</div>

          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:compact?13:14}}>{task.icon}</span>
              <span style={{fontSize:compact?12:13,fontWeight:600,color:f.text,textDecoration:entry.done?"line-through":"none"}}>{task.task}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
              <span style={{fontSize:11,color:f.muted}}>{task.time}</span>
              <span style={{fontSize:10,color,background:color+"15",padding:"1px 5px",borderRadius:3,fontWeight:600}}>{fmtMins(task.mins)}</span>
              {entry.realMins!=null&&entry.realMins!==task.mins&&(
                <span style={{fontSize:10,color:entry.realMins>task.mins?"#EF4444":"#22C55E",fontWeight:600}}>{"\u2192 "+fmtMins(entry.realMins)}</span>
              )}
            </div>

            {!compact&&(
              <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                <button onClick={()=>setExpandedTask(isExp?null:task.id)} style={{background:"none",border:"none",padding:0,cursor:"pointer",fontSize:10,color:"#BBB",fontFamily:f.font}}>
                  {isExp?"\u2212 ocultar":"+ detalhes"}{task.auto&&!isExp?" \u00b7 \u26a1":""}
                </button>
                <button onClick={()=>{if(isEditNote){setEditingNote(null);}else{setEditingNote(task.id);setNoteText(entry.note||"");}}} style={{background:"none",border:"none",padding:0,cursor:"pointer",fontSize:10,color:entry.note?"#666":"#BBB",fontFamily:f.font}}>
                  {entry.note?"\ud83d\udcdd nota":"+ nota"}
                </button>
                <button onClick={()=>{if(isEditTime){setEditingTime(null);}else{setEditingTime(task.id);setTimeVal(String(entry.realMins??task.mins));}}} style={{background:"none",border:"none",padding:0,cursor:"pointer",fontSize:10,color:entry.realMins!=null?"#666":"#BBB",fontFamily:f.font}}>
                  \u23f1 tempo real
                </button>
              </div>
            )}

            {isExp&&!compact&&(
              <div style={{marginTop:8}}>
                <p style={{fontSize:11,color:"#666",lineHeight:1.5,margin:"0 0 6px"}}>{task.desc}</p>
                {task.auto&&(
                  <div style={{padding:"6px 8px",background:"#F8F8F8",borderRadius:6,borderLeft:"2px solid #DDD"}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#BBB",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:2}}>{"\u26a1 automa\u00e7\u00e3o"}</div>
                    <p style={{fontSize:11,color:"#666",lineHeight:1.5,margin:0}}>{task.auto}</p>
                  </div>
                )}
              </div>
            )}

            {entry.note&&!isEditNote&&!compact&&(
              <div style={{marginTop:6,padding:"4px 8px",background:"#FAFAFA",borderRadius:5,fontSize:11,color:"#777",borderLeft:"2px solid #E0E0E0"}}>{entry.note}</div>
            )}

            {isEditNote&&!compact&&(
              <div style={{marginTop:6,display:"flex",gap:4}}>
                <input type="text" value={noteText} onChange={e=>setNoteText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveNote(task.id)} placeholder="nota r\u00e1pida..." autoFocus
                  style={{flex:1,padding:"6px 8px",borderRadius:5,border:"1px solid #DDD",fontSize:11,fontFamily:f.font,outline:"none"}} />
                <button onClick={()=>saveNote(task.id)} style={{background:"#111",color:"#FFF",border:"none",borderRadius:5,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:f.font}}>ok</button>
              </div>
            )}

            {isEditTime&&!compact&&(
              <div style={{marginTop:6,display:"flex",gap:4,alignItems:"center"}}>
                <input type="number" value={timeVal} onChange={e=>setTimeVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveTime(task.id)} placeholder="min" autoFocus
                  style={{width:70,padding:"6px 8px",borderRadius:5,border:"1px solid #DDD",fontSize:11,fontFamily:f.font,outline:"none"}} />
                <span style={{fontSize:10,color:f.muted}}>min</span>
                <button onClick={()=>saveTime(task.id)} style={{background:"#111",color:"#FFF",border:"none",borderRadius:5,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:f.font}}>ok</button>
              </div>
            )}

            {isMoving&&!compact&&(
              <div style={{marginTop:8,padding:"8px 10px",background:"#F5F5F5",borderRadius:8}}>
                <div style={{fontSize:10,fontWeight:600,color:f.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>mover para:</div>
                <div style={{display:"flex",gap:4}}>
                  {DAYS.map(d=>(
                    <button key={d} onClick={()=>moveToDay(dayKey,idx,d)} style={{
                      flex:1,padding:"6px 0",borderRadius:6,cursor:"pointer",
                      border:d===dayKey?"1.5px solid #111":"1px solid #DDD",
                      background:d===dayKey?"#111":"#FFF",color:d===dayKey?"#FFF":f.text,
                      fontSize:11,fontWeight:600,fontFamily:f.font
                    }}>{d}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {showMoveControls&&!compact&&(
            <div style={{display:"flex",flexDirection:"column",gap:3,flexShrink:0}}>
              <MoveBtn onClick={()=>moveWithinDay(dayKey,idx,-1)} disabled={idx===0}>{"\u2191"}</MoveBtn>
              <MoveBtn onClick={()=>moveWithinDay(dayKey,idx,1)} disabled={idx===dayTasks.length-1}>{"\u2193"}</MoveBtn>
              <MoveBtn onClick={()=>setMovingTask(isMoving?null:{day:dayKey,idx})}>{isMoving?"\u2715":"\u21c4"}</MoveBtn>
            </div>
          )}
        </div>
      </div>
    );
  };

  const resetWeek=async()=>{if(confirm("Resetar dados e layout desta semana?")){setData({});setSchedule(JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)));try{await storage.delete(dataKey);}catch{}try{await storage.delete(schedKey);}catch{}}};

  return (
    <div style={{fontFamily:f.font,background:f.bg,minHeight:"100vh",padding:"24px 16px 40px",maxWidth:view==="semana"?1100:720,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:20,fontWeight:700,color:f.text,margin:0,letterSpacing:"-0.5px"}}>{"\ud83d\udccb tracker semanal"}</h1>
        <p style={{fontSize:11,color:f.muted,margin:"2px 0 0",letterSpacing:"0.3px"}}>{"\u00e9strat\u00e9gico \u00b7 amanda"}</p>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <button onClick={()=>setCurrentWeek(shiftWeek(currentWeek,-1))} style={{background:"none",border:"1px solid "+f.line,borderRadius:6,cursor:"pointer",fontSize:16,color:f.muted,padding:"4px 10px"}}>{"\u2039"}</button>
        <span style={{fontSize:13,fontWeight:600,color:f.text}}>{formatWeekLabel(currentWeek)}</span>
        <button onClick={()=>setCurrentWeek(shiftWeek(currentWeek,1))} style={{background:"none",border:"1px solid "+f.line,borderRadius:6,cursor:"pointer",fontSize:16,color:f.muted,padding:"4px 10px"}}>{"\u203a"}</button>
      </div>

      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{fontSize:10,color:f.muted,textTransform:"uppercase",letterSpacing:"0.5px"}}>{doneTasks+"/"+totalTasks+" atividades"}</span>
          <span style={{fontSize:11,fontWeight:700,color:f.text}}>{pct+"%"}</span>
        </div>
        <div style={{background:f.line,borderRadius:2,height:3}}>
          <div style={{width:pct+"%",height:"100%",background:"#111",borderRadius:2,transition:"width 0.4s"}} />
        </div>
      </div>

      <div style={{display:"flex",gap:0,marginBottom:24,borderBottom:"1px solid "+f.line,overflowX:"auto"}}>
        {[{key:"semana",label:"\ud83d\udcc5 semana"},{key:"dia",label:"\ud83d\udcdd dia"},{key:"resumo",label:"\ud83d\udcca resumo"},{key:"automacoes",label:"\u26a1 automa\u00e7\u00f5es"}].map(v=>(
          <button key={v.key} onClick={()=>setView(v.key)} style={{
            background:"none",border:"none",borderBottom:view===v.key?"2px solid #111":"2px solid transparent",
            padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:view===v.key?600:400,
            color:view===v.key?f.text:f.muted,fontFamily:f.font,whiteSpace:"nowrap"
          }}>{v.label}</button>
        ))}
      </div>

      {view==="semana"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(5, 1fr)",gap:8,overflowX:"auto"}}>
          {DAYS.map((day,di)=>{
            const stats=getDayStats(day);
            const isToday=weekDates[di]===todayStr;
            return (
              <div key={day} onDragOver={e=>{e.preventDefault();if(schedule[day].length===0){setDragOverDay(day);setDragOverIdx(0);}}} onDrop={()=>{if(schedule[day].length===0)handleDrop(day,0);}} style={{minWidth:160}}>
                <div style={{textAlign:"center",padding:"8px 0",marginBottom:8,borderBottom:isToday?"2px solid #111":"1px solid "+f.line}}>
                  <div style={{fontSize:12,fontWeight:700,color:f.text}}>{day}</div>
                  <div style={{fontSize:10,color:f.muted}}>{weekDates[di]}</div>
                  <div style={{fontSize:10,fontWeight:600,color:stats.pct===100?"#22C55E":f.muted,marginTop:2}}>{stats.pct+"%"}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,minHeight:100}}>
                  {schedule[day].map((task,idx)=><TaskCard key={task.id} task={task} compact dayKey={day} idx={idx} />)}
                  <div onDragOver={e=>handleDragOver(e,day,schedule[day].length)} onDrop={()=>handleDrop(day,schedule[day].length)}
                    style={{minHeight:30,borderRadius:6,border:dragOverDay===day&&dragOverIdx===schedule[day].length?"1px dashed #111":"1px dashed transparent"}} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view==="dia"&&(
        <>
          <div style={{display:"flex",gap:4,marginBottom:20}}>
            {DAYS.map((day,i)=>{
              const stats=getDayStats(day);
              const isToday=weekDates[i]===todayStr;
              const isActive=activeDay===day;
              return (
                <button key={day} onClick={()=>setActiveDay(isActive?null:day)} style={{
                  flex:1,padding:"8px 0",borderRadius:8,
                  border:isActive?"1.5px solid #111":isToday?"1.5px solid #BBB":"1px solid "+f.line,
                  background:isActive?"#111":"transparent",cursor:"pointer"
                }}>
                  <div style={{fontSize:12,fontWeight:600,color:isActive?"#FFF":f.text}}>{day}</div>
                  <div style={{fontSize:10,color:isActive?"rgba(255,255,255,0.5)":f.muted}}>{stats.pct+"%"}</div>
                </button>
              );
            })}
          </div>
          {(activeDay?[activeDay]:DAYS).map(day=>(
            <div key={day} style={{marginBottom:20}}>
              {!activeDay&&<div style={{fontSize:11,fontWeight:600,color:f.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:"1px"}}>{day+" \u00b7 "+weekDates[DAYS.indexOf(day)]}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {schedule[day].map((task,idx)=><TaskCard key={task.id} task={task} dayKey={day} idx={idx} showMoveControls />)}
              </div>
            </div>
          ))}
        </>
      )}

      {view==="resumo"&&(
        <div>
          <div style={{background:f.card,borderRadius:10,padding:18,border:"1px solid "+f.line,marginBottom:14}}>
            <h3 style={{fontSize:12,fontWeight:700,color:f.text,margin:"0 0 14px",textTransform:"uppercase",letterSpacing:"0.5px"}}>por categoria</h3>
            {Object.entries(getCatStats()).sort((a,b)=>b[1].total-a[1].total).map(([cat,st])=>{
              const p=Math.round(st.done/st.total*100);
              return (
                <div key={cat} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:500,color:f.text}}>{catLabels[cat]}</span>
                    <div style={{display:"flex",gap:8,fontSize:11,color:f.muted}}>
                      <span>{st.done+"/"+st.total}</span>
                      {st.real>0&&<span>{"\u23f1 "+fmtMins(st.real)+"/"+fmtMins(st.planned)}</span>}
                    </div>
                  </div>
                  <div style={{background:"#F0F0F0",borderRadius:2,height:3}}>
                    <div style={{width:p+"%",height:"100%",background:catColors[cat],borderRadius:2,transition:"width 0.3s"}} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{background:f.card,borderRadius:10,padding:18,border:"1px solid "+f.line,marginBottom:14}}>
            <h3 style={{fontSize:12,fontWeight:700,color:f.text,margin:"0 0 14px",textTransform:"uppercase",letterSpacing:"0.5px"}}>por dia</h3>
            <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
              {DAYS.map(day=>{const st=getDayStats(day);return(
                <div key={day} style={{flex:1,textAlign:"center"}}>
                  <div style={{height:70,display:"flex",flexDirection:"column",justifyContent:"flex-end",alignItems:"center",marginBottom:4}}>
                    <div style={{width:"60%",borderRadius:3,height:Math.max(st.pct,4)+"%",background:st.pct===100?"#22C55E":"#111",transition:"height 0.3s"}} />
                  </div>
                  <div style={{fontSize:11,fontWeight:600,color:f.text}}>{day}</div>
                  <div style={{fontSize:10,color:f.muted}}>{st.pct+"%"}</div>
                </div>
              );})}
            </div>
          </div>

          <div style={{background:f.card,borderRadius:10,padding:18,border:"1px solid "+f.line,marginBottom:14}}>
            <h3 style={{fontSize:12,fontWeight:700,color:f.text,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:"0.5px"}}>{"\u23f1 tempo: planejado vs. real"}</h3>
            {(()=>{
              const planned=allTasks.reduce((s,t)=>s+(t.mins||0),0);
              const real=allTasks.reduce((s,t)=>s+(data[t.id]?.realMins??(data[t.id]?.done?t.mins:0)??0),0);
              const diff=real-planned;
              return(
                <div style={{display:"flex",gap:16,fontSize:13}}>
                  <div><span style={{color:f.muted,fontSize:11}}>Planejado</span><div style={{fontWeight:700}}>{fmtMins(planned)}</div></div>
                  <div><span style={{color:f.muted,fontSize:11}}>Real</span><div style={{fontWeight:700}}>{fmtMins(real)}</div></div>
                  <div><span style={{color:f.muted,fontSize:11}}>Dif.</span><div style={{fontWeight:700,color:diff>0?"#EF4444":"#22C55E"}}>{(diff>0?"+":"")+fmtMins(Math.abs(diff))}</div></div>
                </div>
              );
            })()}
          </div>

          <div style={{background:f.card,borderRadius:10,padding:18,border:"1px solid "+f.line}}>
            <h3 style={{fontSize:12,fontWeight:700,color:f.text,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:"0.5px"}}>{"\ud83d\udcdd notas da semana"}</h3>
            {allTasks.filter(t=>data[t.id]?.note).length===0
              ?<p style={{fontSize:12,color:f.muted,margin:0}}>nenhuma nota esta semana</p>
              :allTasks.filter(t=>data[t.id]?.note).map(t=>(
                <div key={t.id} style={{padding:"6px 8px",background:"#FAFAFA",borderRadius:5,marginBottom:6,borderLeft:"2px solid "+catColors[t.cat]}}>
                  <div style={{fontSize:11,fontWeight:600,color:f.text}}>{t.icon+" "+t.task}</div>
                  <div style={{fontSize:11,color:"#777",marginTop:1}}>{data[t.id].note}</div>
                </div>
              ))
            }
          </div>
          <div style={{textAlign:"center",marginTop:20}}>
            <button onClick={resetWeek} style={{background:"none",border:"1px solid "+f.line,borderRadius:6,padding:"6px 16px",cursor:"pointer",fontSize:11,color:f.muted,fontFamily:f.font}}>resetar semana</button>
          </div>
        </div>
      )}

      {view==="automacoes"&&(
        <div>
          <p style={{fontSize:12,color:f.muted,marginBottom:18,lineHeight:1.6}}>
            {"\u26a1 Automa\u00e7\u00f5es sugeridas usando n8n, Apify e Claude Cowork."}
          </p>
          {DAYS.map(day=>{
            const autos=schedule[day].filter(t=>t.auto);
            if(!autos.length) return null;
            return(
              <div key={day} style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:600,color:f.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:"1px"}}>{day}</div>
                {autos.map(t=>(
                  <div key={t.id} style={{background:f.card,border:"1px solid "+f.line,borderRadius:10,padding:"12px 14px",marginBottom:6,borderLeft:"3px solid "+catColors[t.cat]}}>
                    <div style={{fontSize:13,fontWeight:600,color:f.text,marginBottom:4}}>{t.icon+" "+t.task+" "}<span style={{fontSize:10,color:f.muted,fontWeight:400}}>{t.time}</span></div>
                    <div style={{padding:"6px 8px",background:"#F8F8F8",borderRadius:5}}>
                      <p style={{fontSize:12,color:"#555",lineHeight:1.6,margin:0}}>{"\u26a1 "+t.auto}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
