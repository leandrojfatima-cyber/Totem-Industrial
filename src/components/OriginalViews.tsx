import React, { useState, useMemo, ChangeEvent } from 'react';
import { SisData } from '../App';

export const DEFAULT_OK_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'><rect width='100%' height='100%' fill='%23ecfdf5'/><rect x='10' y='10' width='380' height='200' rx='8' fill='none' stroke='%2310b981' stroke-width='3'/><path d='M160 110 L185 135 L245 80' fill='none' stroke='%2310b981' stroke-width='12' stroke-linecap='round' stroke-linejoin='round'/><text x='200' y='180' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='14' fill='%23047857'>CONDIÇÃO OK - CONECTOR MONTADO COM CLIQUE DUPLO</text></svg>";

export const DEFAULT_KO_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'><rect width='100%' height='100%' fill='%23fef2f2'/><rect x='10' y='10' width='380' height='200' rx='8' fill='none' stroke='%23ef4444' stroke-width='3'/><path d='M160 75 L240 145 M240 75 L160 145' fill='none' stroke='%23ef4444' stroke-width='12' stroke-linecap='round'/><text x='200' y='180' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='14' fill='%23b91c1c'>ANOMALIA KO - SEM FELTRO / TRAVA FOLGADA</text></svg>";

export interface ViewProps {
  data: SisData;
  updateData: React.Dispatch<React.SetStateAction<SisData>>;
  openFormModal: (type: string, targetId?: number | null) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export function GembaWalkView({ data, updateData, openFormModal }: ViewProps) {
  const daysList = [
    { key: 'Mon', label: "Segunda" },
    { key: 'Tue', label: "Terça" },
    { key: 'Wed', label: "Quarta" },
    { key: 'Thu', label: "Quinta" },
    { key: 'Fri', label: "Sexta" }
  ];

  const getItemDayZone = (item: SisData['gembaWalk']['items'][0], dayKey: string) => {
    const dayObj = (item.days && item.days[dayKey]) || {};
    const val = Number(dayObj.val);
    if (dayObj.val === undefined || dayObj.val === null || dayObj.val === "") return "NONE";

    if (item.ucl !== undefined && item.utl !== undefined && item.ucl <= item.utl && item.ltl === 0) {
      if (val <= item.ucl) return "GREEN";
      if (val <= item.utl) return "ORANGE";
      return "RED";
    }
    if (item.ltl !== undefined && item.lcl !== undefined && item.ltl <= item.lcl) {
      if (val >= item.lcl) return "GREEN";
      if (val >= item.ltl) return "ORANGE";
      return "RED";
    }
    return "GREEN";
  };

  const summary = useMemo(() => {
    let redCount = 0;
    let orangeCount = 0;
    let totalChecks = 0;

    (data.gembaWalk?.items || []).forEach(item => {
      daysList.forEach(d => {
        const zone = getItemDayZone(item, d.key);
        if (zone === 'RED') redCount++;
        if (zone === 'ORANGE') orangeCount++;
        if (zone !== 'NONE') totalChecks++;
      });
    });

    let overallStatus = "VERDE";
    if (redCount > 2) overallStatus = "VERMELHO";
    else if (orangeCount > 3 || redCount > 0) overallStatus = "LARANJA";

    return { redCount, orangeCount, totalChecks, overallStatus };
  }, [data.gembaWalk]);

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta Voz do Processo do Gemba Walk?")) {
      updateData(prev => ({
        ...prev,
        gembaWalk: {
          ...prev.gembaWalk,
          items: (prev.gembaWalk?.items || []).filter(item => item.id !== itemId)
        }
      }));
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-400 text-xs px-2.5 py-0.5 rounded border border-sky-500/40 font-mono font-bold">
              FCI_SA_008 - GEMBA WALK
            </span>
            <h2 className="text-base font-black text-sky-400 flex items-center gap-2">
              <i className="fa-solid fa-shoe-prints"></i> GEMBA WALK DIÁRIO & SEMANAL DO TEAM LEADER
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Área/Trecho: <strong className="text-white">{data.gembaWalk?.area || data.header.area}</strong> | Semana: <strong className="text-amber-300 font-mono">S{data.gembaWalk?.weekNum || data.header.weekNum}</strong> | Auditor: <strong className="text-sky-300">{data.gembaWalk?.auditor || data.header.teamLeader}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black border shadow ${
            summary.overallStatus === 'VERDE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
            summary.overallStatus === 'LARANJA' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
            'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
          }`}>
            STATUS GEMBA: {summary.overallStatus}
          </span>
          <button onClick={() => openFormModal('gembaDaily')} className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1.5 cursor-pointer">
            <i className="fa-solid fa-pen-to-square"></i> + Lançar Auditoria do Dia
          </button>
          <button onClick={() => openFormModal('gembaItem')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer">
            <i className="fa-solid fa-plus text-sky-400"></i> + Nova Voz / Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs">
        <div className="bg-red-950/40 border border-red-500/40 p-2.5 rounded-lg flex justify-between items-center">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-circle-xmark text-red-400"></i> Pontos em Zona Vermelha:
          </span>
          <strong className="text-red-400 text-base">{summary.redCount}</strong>
        </div>
        <div className="bg-amber-950/40 border border-amber-500/40 p-2.5 rounded-lg flex justify-between items-center">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-triangle-exclamation text-amber-300"></i> Pontos em Zona Laranja:
          </span>
          <strong className="text-amber-300 text-base">{summary.orangeCount}</strong>
        </div>
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-lg flex justify-between items-center">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-circle-check text-emerald-400"></i> Regra Processo/Resultado:
          </span>
          <strong className="text-emerald-400 text-xs">70% KAI / 30% KPI</strong>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-800 rounded-lg shadow-inner bg-slate-950">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-mono border-b border-slate-800 text-[11px] uppercase">
              <th className="p-2.5 w-10 text-center border-r border-slate-800">#</th>
              <th className="p-2.5 w-24 border-r border-slate-800">Área / Posto</th>
              <th className="p-2.5 border-r border-slate-800">Ponto a Verificar / Voz Observável</th>
              <th className="p-2.5 text-center w-36 border-r border-slate-800">Limites [LTL|LCL|UCL|UTL]</th>
              {daysList.map(d => (
                <th key={d.key} className="p-2.5 text-center w-28 border-r border-slate-800 bg-slate-900/80">{d.label}</th>
              ))}
              <th className="p-2.5 text-center w-20">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {(data.gembaWalk?.items || []).map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition">
                <td className="p-2 text-center font-bold text-amber-300 border-r border-slate-800/60 bg-slate-900/20">{idx + 1}</td>
                <td className="p-2 font-bold text-slate-300 border-r border-slate-800/60">{item.area}</td>
                <td className="p-2 font-sans font-bold text-white border-r border-slate-800/60">{item.point}</td>
                <td className="p-2 text-center text-[10px] text-slate-400 border-r border-slate-800/60 font-mono">
                  [{item.ltl} | {item.lcl} | {item.ucl} | {item.utl}]
                </td>
                {daysList.map(d => {
                  const dayObj = (item.days && item.days[d.key]) || {};
                  const zone = getItemDayZone(item, d.key);

                  return (
                    <td key={d.key} className="p-1 text-center border-r border-slate-800/60">
                      {dayObj.val !== undefined && dayObj.val !== null && dayObj.val !== "" ? (
                        <div className={`p-1 rounded font-bold transition flex flex-col items-center justify-center ${
                          zone === 'GREEN' ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40' :
                          zone === 'ORANGE' ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40' :
                          'bg-red-950/80 text-red-400 border border-red-500/60 animate-pulse'
                        }`}>
                          <span>{dayObj.val}</span>
                          {dayObj.corr && <span className="text-[8px] text-slate-300 font-normal truncate max-w-[90px]" title={`Correção: ${dayObj.corr}`}>✏️ {dayObj.corr}</span>}
                        </div>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="p-2 text-center space-x-1">
                  <button 
                    onClick={() => openFormModal('gembaItemEdit', item.id)} 
                    className="p-1 bg-sky-900/80 hover:bg-sky-600 text-sky-300 hover:text-white rounded text-[10px] border border-sky-500/40 cursor-pointer"
                    title="Editar Voz Gemba"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)} 
                    className="p-1 bg-red-900/80 hover:bg-red-600 text-red-300 hover:text-white rounded text-[10px] border border-red-500/40 cursor-pointer"
                    title="Excluir Voz"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-800 pt-3 space-y-2">
        <strong className="text-xs font-mono text-amber-300 uppercase flex items-center gap-1.5">
          <i className="fa-solid fa-clipboard-list text-sky-400"></i> Observações Diárias do Gemba Walk:
        </strong>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {daysList.map(d => (
            <div key={d.key} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono font-bold text-sky-400 block">{d.label}:</span>
              <p className="text-[11px] text-slate-300">{data.gembaWalk?.notes?.[d.key] || "Sem anotações registradas."}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BriefingA1View({ data, updateData, openFormModal }: ViewProps) {
  const toggleSafetyDay = (day: number) => {
    const colors = ["GREEN", "YELLOW", "ORANGE", "RED"];
    const current = data.safetyCross[day] || "GREEN";
    const nextIdx = (colors.indexOf(current) + 1) % colors.length;
    const nextColor = colors[nextIdx];
    
    updateData(prev => ({
      ...prev,
      safetyCross: {
        ...prev.safetyCross,
        [day]: nextColor
      }
    }));
  };

  const getColorBg = (color: string) => {
    switch(color) {
      case "GREEN": return "bg-emerald-500 text-slate-950 font-bold";
      case "YELLOW": return "bg-yellow-400 text-slate-950 font-bold";
      case "ORANGE": return "bg-orange-500 text-white font-bold";
      case "RED": return "bg-red-600 text-white font-bold";
      default: return "bg-slate-800 text-slate-300";
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-sky-500/20 text-sky-400 text-xs px-2.5 py-0.5 rounded border border-sky-500/30 font-mono font-bold">
              FOLHA A1 BRIEFING - SIS
            </span>
            <h2 className="text-lg font-black text-white">{data.header.plant} - {data.header.shop}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Linha: <strong className="text-slate-200">{data.header.line}</strong> | Área: <strong className="text-slate-200">{data.header.area}</strong> | Turno: <strong className="text-amber-300 font-mono">{data.header.shift}</strong> | TL: <strong className="text-sky-300">{data.header.teamLeader}</strong>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => openFormModal('pauta')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer">
            <i className="fa-solid fa-plus text-sky-400"></i> Pauta do Dia
          </button>
          <button onClick={() => openFormModal('mudanca')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer">
            <i className="fa-solid fa-triangle-exclamation text-amber-400"></i> Ponto Mudança
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-2">
              <i className="fa-solid fa-cross"></i> CRUZ DE SEGURANÇA (31 DIAS)
            </h3>
            <span className="text-[10px] text-slate-400">Clique no dia</span>
          </div>
          
          <div className="flex justify-center items-center my-2">
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] w-full max-w-[280px] p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 shadow-inner">
              <div className="col-span-2"></div>
              {[1, 2, 3].map(d => (
                <div key={d} onClick={() => toggleSafetyDay(d)} className={`p-1.5 rounded cursor-pointer transition-all hover:scale-105 shadow font-bold ${getColorBg(data.safetyCross[d])}`}>{d}</div>
              ))}
              <div className="col-span-2"></div>

              <div className="col-span-2"></div>
              {[4, 5, 6].map(d => (
                <div key={d} onClick={() => toggleSafetyDay(d)} className={`p-1.5 rounded cursor-pointer transition-all hover:scale-105 shadow font-bold ${getColorBg(data.safetyCross[d])}`}>{d}</div>
              ))}
              <div className="col-span-2"></div>

              {[7, 8, 9, 10, 11, 12, 13].map(d => (
                <div key={d} onClick={() => toggleSafetyDay(d)} className={`p-1.5 rounded cursor-pointer transition-all hover:scale-105 shadow font-bold ${getColorBg(data.safetyCross[d])}`}>{d}</div>
              ))}

              {[14, 15, 16, 17, 18, 19, 20].map(d => (
                <div key={d} onClick={() => toggleSafetyDay(d)} className={`p-1.5 rounded cursor-pointer transition-all hover:scale-105 shadow font-bold ${getColorBg(data.safetyCross[d])}`}>{d}</div>
              ))}

              <div className="col-span-2"></div>
              {[21, 22, 23].map(d => (
                <div key={d} onClick={() => toggleSafetyDay(d)} className={`p-1.5 rounded cursor-pointer transition-all hover:scale-105 shadow font-bold ${getColorBg(data.safetyCross[d])}`}>{d}</div>
              ))}
              <div className="col-span-2"></div>

              <div className="col-span-2"></div>
              {[24, 25, 26].map(d => (
                <div key={d} onClick={() => toggleSafetyDay(d)} className={`p-1.5 rounded cursor-pointer transition-all hover:scale-105 shadow font-bold ${getColorBg(data.safetyCross[d])}`}>{d}</div>
              ))}
              <div className="col-span-2"></div>

              <div className="col-span-2"></div>
              {[27, 28, 29].map(d => (
                <div key={d} onClick={() => toggleSafetyDay(d)} className={`p-1.5 rounded cursor-pointer transition-all hover:scale-105 shadow font-bold ${getColorBg(data.safetyCross[d])}`}>{d}</div>
              ))}
              <div className="col-span-2"></div>

              <div className="col-span-2"></div>
              {[30, 31].map(d => (
                <div key={d} onClick={() => toggleSafetyDay(d)} className={`p-1.5 rounded cursor-pointer transition-all hover:scale-105 shadow font-bold ${getColorBg(data.safetyCross[d])}`}>{d}</div>
              ))}
              <div className="col-span-3"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[9px] font-mono border-t border-slate-800 pt-2 text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500"></span> Sem Acidente</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-400"></span> First Aid</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500"></span> pSIF</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-600"></span> Recordable</span>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-sky-400 uppercase border-b border-slate-800 pb-2 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i> PIRÂMIDE DE HEINRICH
          </h3>
          
          <div className="flex flex-col items-center justify-center space-y-1.5 my-auto">
            <div className="w-24 bg-red-600/80 text-white font-mono font-bold text-[10px] py-1 text-center rounded border border-red-400/50 shadow">
              {data.heinrich.recordable} Recordable
            </div>
            <div className="w-36 bg-orange-500/80 text-white font-mono font-bold text-[10px] py-1 text-center rounded border border-orange-400/50 shadow">
              {data.heinrich.pSIF} pSIF / Quase Acidente
            </div>
            <div className="w-48 bg-yellow-400/80 text-slate-950 font-mono font-bold text-[10px] py-1 text-center rounded border border-yellow-300 shadow">
              {data.heinrich.firstAid} First Aid / 1ºs Socorros
            </div>
            <div className="w-60 bg-emerald-500/80 text-slate-950 font-mono font-bold text-[10px] py-1 text-center rounded border border-emerald-300 shadow">
              {data.heinrich.semAcidente} Dias Sem Acidente
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center border-t border-slate-800 pt-2 font-mono">
            Total Monitorado: <strong className="text-white">31 Dias</strong>
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
              <span><i className="fa-solid fa-bullhorn text-sky-400"></i> PAUTA DE BOM DIA</span>
              <button onClick={() => openFormModal('pauta')} className="text-[10px] text-sky-400 hover:underline cursor-pointer">+ Add</button>
            </h3>
            <ul className="space-y-1 text-xs text-slate-300">
              {(data.pautaBomDia || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-sky-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
              <span><i className="fa-solid fa-code-compare"></i> PONTOS DE MUDANÇA</span>
              <button onClick={() => openFormModal('mudanca')} className="text-[10px] text-amber-400 hover:underline cursor-pointer">+ Add</button>
            </h3>
            <div className="space-y-1 text-[11px]">
              {(data.shiftChanges || []).map((chg) => (
                <div key={chg.id} className="bg-slate-950 p-1.5 rounded border border-slate-800 text-slate-300 space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-300 font-mono">[{chg.type}]</span>
                    <span className="text-[9px] text-slate-500">Vigente</span>
                  </div>
                  <p>{chg.detail}</p>
                  <p className="text-[10px] text-sky-300"><strong>Medida:</strong> {chg.conservatorio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
            <i className="fa-solid fa-users-gear text-sky-400"></i> TOMADA DE POSTO DO TURNO ({data.header.shift})
          </h3>
          <button onClick={() => openFormModal('efetivo')} className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold shadow cursor-pointer">
            + Alocar Operador
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {(data.tomadaPosto || []).map((tp) => (
            <div key={tp.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-amber-300 text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {tp.pdt}
                </span>
                <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                  tp.status === 'PRESENTE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                }`}>
                  {tp.status}
                </span>
              </div>
              <strong className="text-white text-xs block font-bold mt-1 truncate">{tp.opName}</strong>
              <span className="text-[10px] text-slate-400 font-mono block">Matrícula: {tp.opMatricula}</span>
              
              {tp.status === 'FALTA' && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] bg-sky-950/40 p-1.5 rounded border border-sky-500/30 space-y-1">
                  <span className="text-sky-300 font-bold block flex items-center gap-1">
                    <i className="fa-solid fa-wand-magic-sparkles text-amber-300"></i> Sugestão 331:
                  </span>
                  {(() => {
                    const candidate = (data.efetivo || []).find(e => (e.skills && e.skills[tp.pdt]) >= 2 && e.matricula !== tp.opMatricula);
                    return candidate ? (
                      <div className="text-slate-200">
                        <span>Substituto: <strong>{candidate.name}</strong></span>
                        <span className="text-emerald-400 font-mono block">Nível Polivalência: {candidate.skills[tp.pdt]}</span>
                      </div>
                    ) : <span className="text-slate-500">Nenhum operador Nível 2/3 livre.</span>;
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-2">
              <i className="fa-solid fa-broom"></i> DESEMPENHO 5S (DESVIOS / DIA)
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Tarja / Meta: ≤ {data.charts.safety5s.targetLine}
              </span>
              <button 
                onClick={() => openFormModal('chart_5s')}
                className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-[10px] shadow cursor-pointer"
              >
                ✏️ Lançar / Tarja
              </button>
            </div>
          </div>
          <div className="h-28 flex items-end justify-between gap-1 pt-4 px-1 bg-slate-950 rounded border border-slate-800">
            {(data.charts.safety5s.days || []).map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                <div 
                  style={{ height: `${Math.min(val * 25, 100)}%` }} 
                  className={`w-full rounded-t transition-all ${val <= data.charts.safety5s.targetLine ? 'bg-emerald-500' : 'bg-red-500'}`}
                ></div>
                <span className="text-[8px] font-mono text-slate-500 mt-1">{idx+1}</span>
                <div className="absolute -top-6 hidden group-hover:block bg-slate-800 text-white text-[9px] px-1 rounded shadow z-10 font-mono">
                  Dia {idx+1}: {val}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-sky-400 uppercase flex items-center gap-2">
              <i className="fa-solid fa-note-sticky text-sky-400"></i> QUALIDADE (POST-IT RECEBIDOS)
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Tarja / Meta: ≤ {data.charts.quality.targetLine}
              </span>
              <button 
                onClick={() => openFormModal('chart_quality')}
                className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-[10px] shadow cursor-pointer"
              >
                ✏️ Lançar / Tarja
              </button>
            </div>
          </div>
          <div className="h-28 flex items-end justify-between gap-1 pt-4 px-1 bg-slate-950 rounded border border-slate-800">
            {(data.charts.quality.days || []).map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                <div 
                  style={{ height: `${Math.min(val * 20, 100)}%` }} 
                  className={`w-full rounded-t transition-all ${val <= data.charts.quality.targetLine ? 'bg-sky-500' : 'bg-red-500'}`}
                ></div>
                <span className="text-[8px] font-mono text-slate-500 mt-1">{idx+1}</span>
                <div className="absolute -top-6 hidden group-hover:block bg-slate-800 text-white text-[9px] px-1 rounded shadow z-10 font-mono">
                  Dia {idx+1}: {val}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-2">
              <i className="fa-solid fa-clock font-bold"></i> OPE (MINUTOS DE PARADA / DIA)
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Tarja / Meta: ≤ {data.charts.ope.targetLine}m
              </span>
              <button 
                onClick={() => openFormModal('chart_ope')}
                className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-[10px] shadow cursor-pointer"
              >
                ✏️ Lançar / Tarja
              </button>
            </div>
          </div>
          <div className="h-28 flex items-end justify-between gap-1 pt-4 px-1 bg-slate-950 rounded border border-slate-800">
            {(data.charts.ope.days || []).map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                <div 
                  style={{ height: `${Math.min(val * 5, 100)}%` }} 
                  className={`w-full rounded-t transition-all ${val <= data.charts.ope.targetLine ? 'bg-amber-500' : 'bg-red-500'}`}
                ></div>
                <span className="text-[8px] font-mono text-slate-500 mt-1">{idx+1}</span>
                <div className="absolute -top-6 hidden group-hover:block bg-slate-800 text-white text-[9px] px-1 rounded shadow z-10 font-mono">
                  Dia {idx+1}: {val}m
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-sky-400 uppercase flex items-center gap-2">
              <i className="fa-solid fa-chart-simple"></i> YAMAZUMI SWK (TEMPO DE CICLO VA vs NVA)
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Target TcT: {data.charts.yamazumi.tctTarget}s
              </span>
              <button 
                onClick={() => openFormModal('chart_yamazumi')}
                className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-[10px] shadow cursor-pointer"
              >
                ✏️ Lançar / Tarja
              </button>
            </div>
          </div>

          <div className="h-28 flex items-end justify-around gap-2 pt-4 px-2 bg-slate-950 rounded border border-slate-800">
            {(data.charts.yamazumi.pdts || []).map((p, idx) => {
              const total = p.va + p.nva;
              const vaPct = Math.min((p.va / data.charts.yamazumi.tctTarget) * 60, 80);
              const nvaPct = Math.min((p.nva / data.charts.yamazumi.tctTarget) * 60, 40);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative max-w-[48px]">
                  <div className="w-full flex flex-col items-center rounded-t overflow-hidden">
                    <div style={{ height: `${nvaPct}px` }} className="w-full bg-red-500" title={`NVA: ${p.nva}s`}></div>
                    <div style={{ height: `${vaPct}px` }} className="w-full bg-emerald-500" title={`VA: ${p.va}s`}></div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1 font-bold">{p.name}</span>
                  <div className="absolute -top-8 hidden group-hover:block bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded shadow z-10 font-mono">
                    {p.name}: VA {p.va}s + NVA {p.nva}s = {total}s
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ControleAmostralView({ data, updateData, openFormModal }: ViewProps) {
  const toggleCheckStatus = (itemId: number, checkIndex: number) => {
    updateData(prev => ({
      ...prev,
      controlAmostral: prev.controlAmostral.map(item => {
        if (item.id !== itemId) return item;
        const newChecks = [...(item.checks || [])];
        if (newChecks[checkIndex]) {
          newChecks[checkIndex].status = newChecks[checkIndex].status === 'OK' ? 'KO' : 'OK';
        }
        return { ...item, checks: newChecks };
      })
    }));
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded border border-emerald-500/40 font-mono font-bold">BP8 - SPW / SIS</span>
            <h2 className="text-base font-black text-emerald-400 flex items-center gap-2">
              <i className="fa-solid fa-clipboard-check"></i> CONTROLE AMOSTRAL DO TEAM LEADER (CICLO DE 15 DIAS)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            UTE/UEP: <strong className="text-white">{data.header.ute}</strong> | Domínio TL: <strong className="text-white">{data.header.domain}</strong> | Semana: <strong className="text-amber-300 font-mono">S{data.header.weekNum}</strong>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => openFormModal('amostral')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1.5 cursor-pointer">
            <i className="fa-solid fa-plus"></i> Novo Item BP8 (15 Dias)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono">
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1">
          <strong className="text-amber-300 uppercase block font-bold border-b border-slate-800 pb-1">
            📌 Regra de Inclusão & Exclusão BP8 (Duração de 15 Dias)
          </strong>
          <p><span className="text-emerald-400 font-bold">INCLUIR:</span> Itens graves ou repetitivos na Clientela, SCA, DRR, DVX ou NR.</p>
          <p><span className="text-red-400 font-bold">EXCLUIR:</span> 1 semana inteira (7 a 15 dias) sem reincidência do defeito no posto.</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1">
          <strong className="text-red-400 uppercase block font-bold border-b border-slate-800 pb-1">
            ⚠ Regra de Reação Controle Amostral
          </strong>
          <p><strong className="text-amber-300">1º NOK:</strong> Abertura de Post-it, retrabalho ou lançamento no Qualif + Registro de Data, Hora, VIS e observação.</p>
          <p><strong className="text-red-400">2º NOK:</strong> Retrabalho/Qualif + Vincular 2º VIS ao Post-it + Acionar Supervisor e Regra Qualidade GA.</p>
        </div>
      </div>

      <div className="space-y-4">
        {(data.controlAmostral || []).map((c, idx) => (
          <div key={c.id} className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-2 gap-2">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 font-mono text-amber-300 text-xs font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">{c.item}</strong>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                      c.source === 'FORNECEDOR' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    }`}>
                      {c.source || "PROCESSO"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Posto: <strong className="text-amber-300 font-mono">{c.station}</strong> | Modelo: <strong className="text-slate-200">{c.model}</strong> | Data de Inserção: <strong className="text-slate-300 font-mono">{c.insertDate}</strong> | Frequência: <strong className="text-emerald-400 font-mono">A cada 2h (Ciclo 15 Dias)</strong>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => openFormModal('amostralCheck', c.id)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-clock"></i> + Lançar Amostragem (Data / Hora / VIS)
              </button>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                Histórico de Coletas Registradas por Data, Turno e Horário (Clique para alternar OK/KO):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {(c.checks || []).map((chk, chkIdx) => (
                  <div 
                    key={chkIdx} 
                    onClick={() => toggleCheckStatus(c.id, chkIdx)}
                    className={`p-2 rounded-lg border cursor-pointer transition flex flex-col justify-between text-center select-none ${
                      chk.status === 'OK' 
                      ? 'bg-emerald-950/40 border-emerald-500/50 hover:bg-emerald-900/40' 
                      : 'bg-red-950/40 border-red-500/50 hover:bg-red-900/40'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono border-b border-slate-800 pb-1 mb-1">
                      <span className="text-amber-300 font-bold">{chk.date || data.header.date}</span>
                      <span>{chk.shift ? chk.shift.slice(0, 2) : "1T"}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-300 font-bold">
                      Hora: {chk.hora}h
                    </div>
                    <strong className="text-xs font-mono text-white my-1 truncate">{chk.vis}</strong>
                    <span className={`text-[10px] font-black font-mono rounded py-0.5 ${
                      chk.status === 'OK' ? 'text-emerald-400' : 'text-red-400 animate-pulse'
                    }`}>
                      {chk.status === 'OK' ? '✓ OK' : '⚠ KO (NOK)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {(c.koLogs || []).length > 0 && (
              <div className="border-t border-slate-800 pt-2 space-y-1.5">
                <strong className="text-[10px] text-red-400 uppercase font-mono block">
                  🚨 Tabela de Reação & Contenção para Produtos NOK Registrados:
                </strong>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] font-mono text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th className="p-1.5">Data/Hora/VIS</th>
                        <th className="p-1.5">Ação de Contenção / Post-it</th>
                        <th className="p-1.5">Data/Resp. Contenção</th>
                        <th className="p-1.5">Ação Resolutiva Definitiva</th>
                        <th className="p-1.5">Data/Resp. Resolução</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {c.koLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="p-1.5 font-bold text-red-400">{log.date || data.header.date} {log.hora} - {log.vis}</td>
                          <td className="p-1.5 text-slate-200">{log.containment}</td>
                          <td className="p-1.5 text-slate-400">{log.containmentDate} ({log.containmentResp})</td>
                          <td className="p-1.5 text-sky-300">{log.resolution}</td>
                          <td className="p-1.5 text-slate-400">{log.resolutionDate} ({log.resolutionResp})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MedidaConservatoriaView({ data, updateData, openFormModal }: ViewProps) {
  const extendBp9 = (mcId: number) => {
    updateData(prev => ({
      ...prev,
      medidasConservatorias: prev.medidasConservatorias.map(mc => {
        if (mc.id !== mcId) return mc;
        return {
          ...mc,
          endDatePlanned: "Prorrogado (+30 Dias)",
          status: "PRORROGADA (+30 DIAS)"
        };
      })
    }));
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-0.5 rounded border border-amber-500/40 font-mono font-bold">
              FQ_SA_001 - BP9 (30 DIAS)
            </span>
            <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved"></i> MEDIDAS CONSERVATÓRIAS (GESTÃO DE CRISE DIÁRIA)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Contingências operacionais com acompanhamento diário por turno e ciclo de 30 dias</p>
        </div>
        <button onClick={() => openFormModal('medida')} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1.5 cursor-pointer">
          <i className="fa-solid fa-plus"></i> Nova Medida BP9 (FQ_SA_001)
        </button>
      </div>

      <div className="space-y-4">
        {(data.medidasConservatorias || []).map(mc => (
          <div key={mc.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-2 gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 text-xs">
                  {mc.code || "MC-2026-004"}
                </span>
                <strong className="text-white text-sm">{mc.plantShop || "BETIM VHI"} - Estação {mc.station}</strong>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[10px]">
                <span className="text-slate-400">Início: <strong className="text-white">{mc.startDate}</strong> ➔ Prazo: <strong className="text-amber-300">{mc.endDatePlanned}</strong></span>
                <span className={`px-2 py-0.5 rounded border font-bold ${
                  mc.status.includes('PRORROGADA') ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>{mc.status}</span>
                <button 
                  onClick={() => extendBp9(mc.id)}
                  className="px-2 py-1 bg-amber-600/80 hover:bg-amber-500 text-white font-bold rounded text-[9px] shadow cursor-pointer"
                  title="Prorrogar por mais 30 dias de acordo com a regra da Qualidade"
                >
                  🔄 Prorrogar +30 Dias
                </button>
                <button 
                  onClick={() => openFormModal('bp9Daily', mc.id)}
                  className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded text-[9px] shadow cursor-pointer"
                >
                  ✏️ Lançar Contagem do Dia
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Motivação / Causa Raiz (Por Quê?):</span>
                <strong className="text-amber-200 block text-xs">{mc.reason}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Descrição da Medida (O Quê?):</span>
                <p className="text-slate-200 text-xs">{mc.what}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Modo de Execução (Como?):</span>
                <p className="text-sky-300 text-xs">{mc.how}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-3 rounded-lg space-y-2">
                <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase flex items-center gap-1">
                  <i className="fa-solid fa-circle-check"></i> CONDIÇÃO CORRETA "OK"
                </span>
                <p className="text-slate-200 text-xs">{mc.okCondition || "Conector montado com clique duplo positivo e feltro acústico."}</p>
                <div className="relative rounded overflow-hidden border border-emerald-500/50 bg-slate-900">
                  <img src={mc.okPhoto || DEFAULT_OK_SVG} alt="Condição OK" className="w-full h-40 object-contain p-1" />
                  <span className="absolute bottom-1 right-1 bg-emerald-950/90 text-emerald-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/40 font-bold">
                    📷 Padrão OK
                  </span>
                </div>
              </div>
              <div className="bg-red-950/30 border border-red-500/40 p-3 rounded-lg space-y-2">
                <span className="text-[10px] font-bold font-mono text-red-400 uppercase flex items-center gap-1">
                  <i className="fa-solid fa-circle-xmark"></i> CONDIÇÃO INCORRETA "KO" (ANOMALIA)
                </span>
                <p className="text-slate-200 text-xs">{mc.koCondition || "Conector sem feltro, trava solta ou folga no suporte."}</p>
                <div className="relative rounded overflow-hidden border border-red-500/50 bg-slate-900">
                  <img src={mc.koPhoto || DEFAULT_KO_SVG} alt="Condição KO" className="w-full h-40 object-contain p-1" />
                  <span className="absolute bottom-1 right-1 bg-red-950/90 text-red-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-red-500/40 font-bold">
                    📷 Anomalia KO
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-slate-800 pt-3">
              <div className="flex justify-between items-center">
                <strong className="text-[11px] font-mono text-amber-300 uppercase flex items-center gap-1.5">
                  <i className="fa-solid fa-calendar-days text-sky-400"></i> Matriz Diária de Intercepção de Anomalias (Ciclo de 30 Dias)
                </strong>
                <span className="text-[9px] font-mono text-slate-400">Verde = 0 Anomalias | Vermelho = Anomalias Interceptadas</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[9px] font-mono text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <th className="p-1 text-left w-16">Turno</th>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                        <th key={d} className="p-1 border-r border-slate-800/60">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(['1º TURNO', '2º TURNO', '3º TURNO'] as const).map((turnLabel, tIdx) => {
                      const tKey = (tIdx === 0 ? 't1' : tIdx === 1 ? 't2' : 't3') as 't1' | 't2' | 't3';
                      return (
                        <tr key={turnLabel} className="border-b border-slate-800/40 hover:bg-slate-900/40">
                          <td className="p-1 font-bold text-slate-300 text-left bg-slate-900">{turnLabel.slice(0, 2)}</td>
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(d => {
                            const dayLog = (mc.dailyTracking || []).find(dt => dt.day === d);
                            const count = dayLog ? dayLog[tKey] : 0;
                            return (
                              <td 
                                key={d} 
                                className={`p-1 font-bold border-r border-slate-800/60 transition-all ${
                                  count > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-950/40 text-emerald-400'
                                }`}
                              >
                                {count}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Produtos Impactados: <strong className="text-white">{mc.products || "Todos"}</strong></span>
              <span>Rastreio Chassi (VIS): <strong className="text-sky-300">{mc.vinStart}</strong> ➔ <strong className="text-amber-300">{mc.vinEnd || "Em aberto"}</strong></span>
              <span>Desvio Vinculado: <strong className="text-amber-400">{mc.desvioLinked || "NÃO"}</strong></span>
              <span>Supervisor Responsável: <strong className="text-slate-200">{mc.respSupervisor || "Marcos Silva"}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LapView({ data, updateData, openFormModal }: ViewProps) {
  const moveAction = (id: number, newCol: string) => {
    updateData(prev => ({
      ...prev,
      lapActions: prev.lapActions.map(a => a.id === id ? { ...a, col: newCol } : a)
    }));
  };

  const cols = [
    { id: "NOVO", title: "Novas Ações", color: "border-sky-500/50 bg-sky-950/20" },
    { id: "EM CURSO", title: "Em Curso", color: "border-amber-500/50 bg-amber-950/20" },
    { id: "ATRASADO", title: "Atrasadas", color: "border-red-500/50 bg-red-950/20" },
    { id: "FECHADO", title: "Concluídas", color: "border-emerald-500/50 bg-emerald-950/20" }
  ];

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
            <i className="fa-solid fa-list-check"></i> LAP - LISTA DE AÇÕES DE PROGRESSO
          </h2>
          <p className="text-xs text-slate-400">Gestão de pendências e melhorias do trecho por turno</p>
        </div>
        <button onClick={() => openFormModal('lap')} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs shadow cursor-pointer">
          + Nova Ação LAP
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cols.map(c => (
          <div key={c.id} className={`p-3 rounded-xl border ${c.color} min-h-[320px] flex flex-col justify-between`}>
            <div>
              <h3 className="text-xs font-bold text-white uppercase border-b border-slate-800 pb-2 mb-3 flex justify-between">
                <span>{c.title}</span>
                <span className="font-mono text-amber-300">
                  {(data.lapActions || []).filter(a => a.col === c.id).length}
                </span>
              </h3>
              <div className="space-y-2">
                {(data.lapActions || []).filter(a => a.col === c.id).map(act => (
                  <div key={act.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5 shadow">
                    <strong className="text-xs text-white block font-bold">{act.title}</strong>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Resp: <strong className="text-sky-300">{act.owner}</strong></span>
                      <span>Prazo: <strong className="text-amber-300">{act.deadline}</strong></span>
                    </div>
                    <div className="pt-2 border-t border-slate-900 flex justify-end space-x-1">
                      {c.id !== "NOVO" && <button onClick={() => moveAction(act.id, "NOVO")} className="text-[9px] px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer">◀</button>}
                      {c.id !== "EM CURSO" && <button onClick={() => moveAction(act.id, "EM CURSO")} className="text-[9px] px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded cursor-pointer">EM CURSO</button>}
                      {c.id !== "FECHADO" && <button onClick={() => moveAction(act.id, "FECHADO")} className="text-[9px] px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded cursor-pointer">✔ FECHAR</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PolivalenciaView({ data, updateData, openFormModal }: ViewProps) {
  const toggleSkill = (efetivoId: number, pdtCode: string) => {
    updateData(prev => ({
      ...prev,
      efetivo: prev.efetivo.map(ef => {
        if (ef.id !== efetivoId) return ef;
        const current = (ef.skills && ef.skills[pdtCode]) || 0;
        const next = (current + 1) % 4;
        return {
          ...ef,
          skills: { ...ef.skills, [pdtCode]: next }
        };
      })
    }));
  };

  const getSkillBadge = (level: number) => {
    switch(level) {
      case 3: return <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]" title="Nível 3 - Multiplicador (Sabe ensinar)">3 - L</span>;
      case 2: return <span className="bg-sky-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]" title="Nível 2 - Autônomo (Opera sozinho)">2 - U</span>;
      case 1: return <span className="bg-yellow-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]" title="Nível 1 - Em Treinamento">1 - I</span>;
      default: return <span className="bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-[10px]">0 - O</span>;
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-sky-400 flex items-center gap-2">
            <i className="fa-solid fa-graduation-cap"></i> MATRIZ DE HABILITAÇÃO & POLIVALÊNCIA (CONCEITO 331)
          </h2>
          <p className="text-xs text-slate-400">Mapeamento de competências ILUO dos operadores por Posto de Trabalho (PDT)</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => openFormModal('efetivo')} className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs shadow cursor-pointer">
            + Novo Operador
          </button>
          <button onClick={() => openFormModal('pdt')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs border border-slate-700 cursor-pointer">
            + Novo PDT
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <th className="p-2.5">Operador / Matrícula</th>
              <th className="p-2.5">PDT Titular</th>
              {(data.pdts || []).map(pdt => (
                <th key={pdt.id} className="p-2.5 text-center">
                  <div className="font-bold text-white">{pdt.code}</div>
                  {pdt.ergoCritical && <span className="text-[9px] text-red-400 block font-normal">⚠ Ergo Crítico</span>}
                </th>
              ))}
              <th className="p-2.5 text-center">Polivalência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {(data.efetivo || []).map(ef => {
              const totalPdts = (data.pdts || []).length;
              const skilledCount = (data.pdts || []).filter(p => (ef.skills && ef.skills[p.code]) >= 2).length;
              const pct = totalPdts > 0 ? Math.round((skilledCount / totalPdts) * 100) : 0;

              return (
                <tr key={ef.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-2.5">
                    <strong className="text-white block">{ef.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{ef.matricula} ({ef.shift})</span>
                  </td>
                  <td className="p-2.5 font-mono text-amber-300 font-bold">{ef.pdtTitular}</td>
                  {(data.pdts || []).map(pdt => (
                    <td 
                      key={pdt.id} 
                      onClick={() => toggleSkill(ef.id, pdt.code)}
                      className="p-2.5 text-center cursor-pointer select-none hover:bg-slate-800 transition"
                    >
                      {getSkillBadge((ef.skills && ef.skills[pdt.code]) || 0)}
                    </td>
                  ))}
                  <td className="p-2.5 text-center font-mono font-bold text-sky-400">
                    {pct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RedRabbitView({ data, openFormModal }: { data: SisData; openFormModal: (type: string) => void }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-red-400 flex items-center gap-2">
            <i className="fa-solid fa-bug"></i> RED RABBIT (TESTE PROVOCADO POKA-YOKE)
          </h2>
          <p className="text-xs text-slate-400">Validação diária de dispositivos falha-zero no posto de trabalho</p>
        </div>
        <button onClick={() => openFormModal('redrabbit')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs shadow cursor-pointer">
          + Novo Teste Red Rabbit
        </button>
      </div>

      <div className="space-y-2">
        {(data.redRabbit || []).map(rr => (
          <div key={rr.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-white font-mono">{rr.pdt}</strong>
                <span className="text-slate-400">•</span>
                <strong className="text-sky-300">{rr.device}</strong>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">Anomalia Provocada: <span className="text-amber-200">{rr.anomalyProvoked}</span></p>
              <span className="text-[10px] text-slate-500 font-mono">Operador Testado: {rr.opTested} | Data: {rr.date}</span>
            </div>
            <span className={`px-2.5 py-1 rounded font-bold font-mono text-xs ${
              rr.status === 'APROVADO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {rr.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhsConversationView({ data }: { data: SisData }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-emerald-400 flex items-center gap-2">
            <i className="fa-solid fa-comments font-bold"></i> CRONOGRAMA CONVERSA WHS
          </h2>
          <p className="text-xs text-slate-400">Diálogos de segurança e ergonomia com os colaboradores</p>
        </div>
      </div>
      <div className="space-y-2">
        {(data.whsConversations || []).map(w => (
          <div key={w.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <strong className="text-white font-mono">Semana {w.week} - {w.pdt}</strong>
              <p className="text-slate-300 mt-0.5">{w.note}</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded font-bold font-mono text-[10px] border border-emerald-500/30">
              {w.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SwaView({ data }: { data: SisData }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-sky-400 flex items-center gap-2">
            <i className="fa-solid fa-magnifying-glass font-bold"></i> SWA CLASSIC & FLASH (AUDITORIA DE POSTO)
          </h2>
          <p className="text-xs text-slate-400">Verificação do cumprimento do trabalho padronizado no Gemba</p>
        </div>
      </div>
      <div className="space-y-2">
        {(data.swaLogs || []).map(s => (
          <div key={s.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-white font-mono">{s.pdt}</strong>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">Operador: {s.operator}</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">Ciclos Cronometrados: {s.cycleTime1} / {s.cycleTime2}</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded font-bold font-mono text-[10px] border border-emerald-500/30">
              {s.result}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RotinaTurnoView({ data }: { data: SisData }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
            <i className="fa-solid fa-arrows-rotate"></i> ROTINA DIÁRIA & PASSAGEM DE TURNO
          </h2>
          <p className="text-xs text-slate-400">Checklist e passagem de bastão operacional entre os Team Leaders</p>
        </div>
      </div>
      <div className="space-y-3">
        {(data.shiftRoutines || []).map(r => (
          <div key={r.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <strong className="text-amber-300 font-mono block text-sm">{r.shift}</strong>
            <p className="text-slate-200"><strong>Anotações de Passagem:</strong> {r.handOverNotes}</p>
            <span className="text-slate-400 text-[10px] font-mono block pt-1 border-t border-slate-900">
              Assinatura TL: <strong className="text-sky-300">{r.tlSign}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EscalationMatrixView({ data, openFormModal }: { data: SisData; openFormModal: (type: string) => void }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-red-400 flex items-center gap-2">
            <i className="fa-solid fa-bell font-bold"></i> REGISTRO ANDON & MATRIZ DE ESCALADA F12
          </h2>
          <p className="text-xs text-slate-400">Escala hierárquica de contenção de problemas e paradas de linha</p>
        </div>
        <button onClick={() => openFormModal('escalada')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs shadow cursor-pointer">
          + Registrar Ocorrência Andon
        </button>
      </div>

      <div className="space-y-2">
        {(data.escaladaLogs || []).map(e => (
          <div key={e.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span className="text-red-400 font-bold font-mono text-[10px]">{e.level}</span>
              <strong className="text-white block mt-0.5">{e.pdt} - {e.issue}</strong>
              <p className="text-sky-300 text-[11px]">Contenção: {e.containment}</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold text-[10px]">
              {e.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KaizenBankView({ data, openFormModal }: { data: SisData; openFormModal: (type: string) => void }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-emerald-400 flex items-center gap-2">
            <i className="fa-solid fa-lightbulb"></i> BANCO DE PROJETOS KAIZEN / A3 / 5-WHY (SOLUÇÃO DE PROBLEMAS)
          </h2>
          <p className="text-xs text-slate-400">Projetos de melhoria contínua e análise de causa raiz com método dos 5 Porquês</p>
        </div>
        <button onClick={() => openFormModal('kaizen')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow cursor-pointer">
          + Novo Projeto Kaizen / 5-Why
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(data.kaizenBank || []).map(k => (
          <div key={k.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs shadow-xl">
            <div className="flex justify-between items-center">
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-emerald-500/30">
                {k.tool}
              </span>
              <span className="text-amber-300 font-mono text-[10px] font-bold">{k.status}</span>
            </div>
            <strong className="text-white block text-sm">{k.title}</strong>
            <p className="text-slate-400 text-[11px]">Autor: <span className="text-slate-200">{k.author}</span> | Área: <span className="text-sky-300">{k.area}</span></p>
            <p className="text-emerald-400 font-mono text-[11px]"><strong>Ganhos / Benefício:</strong> {k.savings}</p>
            
            {k.why1 && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1 font-mono text-[10px] bg-slate-900/60 p-2 rounded">
                <strong className="text-amber-300 block uppercase">Análise de Causa Raiz (5 Porquês):</strong>
                <div className="text-slate-300">1. {k.why1}</div>
                {k.why2 && <div className="text-slate-300">2. {k.why2}</div>}
                {k.why3 && <div className="text-slate-300">3. {k.why3}</div>}
                {k.why4 && <div className="text-slate-300">4. {k.why4}</div>}
                {k.why5 && <div className="text-emerald-400 font-bold">5. Causa Raiz: {k.why5}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RelatoriosView({ data }: { data: SisData }) {
  const [reportCategory, setReportCategory] = useState("AMOSTRAL");

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-full flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 no-print">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <i className="fa-solid fa-print text-sky-400"></i> CENTRAL DE RELATÓRIOS OFICIAIS & IMPRESSÃO SIS
            </h2>
            <p className="text-xs text-slate-400">Emissão de relatórios e planilhas oficiais no padrão da fábrica para auditorias</p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-print"></i> 🖨️ Imprimir Folha / Gerar PDF
          </button>
        </div>

        <div className="flex space-x-2 border-b border-slate-800 pb-3 mb-5 overflow-x-auto no-print">
          {[
            { id: "AMOSTRAL", label: "Controle Amostral (BP8 SPWCX_BP_08)", icon: "fa-clipboard-check" },
            { id: "MEDIDAS", label: "Medidas Conservatórias (BP9 FQ_SA_001)", icon: "fa-shield-halved" },
            { id: "GEMBA", label: "Gemba Walk Semanal (FCI_SA_008)", icon: "fa-shoe-prints" },
            { id: "A1_SHEET", label: "Folha A1 Briefing", icon: "fa-map" },
            { id: "POLIVALENCIA", label: "Polivalência & Efetivo", icon: "fa-users-gear" }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setReportCategory(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition shrink-0 cursor-pointer ${
                reportCategory === r.id 
                ? "bg-sky-600 text-white shadow-md" 
                : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              <i className={`fa-solid ${r.icon}`}></i>
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white text-slate-950 p-5 rounded-xl shadow-2xl space-y-4 print-page print-text-dark print-bg-white border border-slate-300">
          {reportCategory === "AMOSTRAL" && (
            <div className="space-y-3 text-[8.5px] font-sans">
              <div className="border-2 border-black p-2 flex justify-between items-center bg-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="font-black text-sm tracking-tight">STELLANTIS</div>
                  <div className="text-[10px] font-bold border-l-2 border-black pl-3">
                    SPW / SIS - CONTROLE AMOSTRAL DO TEAM LEADER (BP8 - CICLO DE 15 DIAS)
                  </div>
                </div>
                <div className="text-right font-mono text-[9px]">
                  <div><strong>UTE/UEP:</strong> {data.header.ute}</div>
                  <div><strong>DOMÍNIO TL:</strong> {data.header.domain}</div>
                  <div><strong>SEMANA:</strong> S{data.header.weekNum} | <strong>DATA EMISSÃO:</strong> {data.header.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[8px] border border-black p-2 bg-slate-50">
                <div className="space-y-0.5">
                  <strong className="block border-b border-black font-bold uppercase">REGRA PARA INCLUIR OU EXCLUIR ITEM DO CONTROLE AMOSTRAL DO TL (15 DIAS):</strong>
                  <p><strong>INCLUIR:</strong> ITENS GRAVES / REPETITIVOS NA CLIENTELA, SCA, DRR, DVX OU NR.</p>
                  <p><strong>EXCLUIR:</strong> 1 SEMANA INTEIRA (7 A 15 DIAS) SEM REINCIDÊNCIA DO DEFEITO NO POSTO.</p>
                </div>
                <div className="space-y-0.5">
                  <strong className="block border-b border-black font-bold uppercase">REGRA DE REAÇÃO CONTROLE AMOSTRAL DO TL:</strong>
                  <p><strong>1º PRODUTO NOK:</strong> Abertura de Post-it, retrabalhar produto ou lançar no Qualif. Registrar Data, Hora, VIS e observação.</p>
                  <p><strong>2º PRODUTO NOK:</strong> Retrabalhar/Qualif + vincular nº do 2º VIS ao Post-it anterior. Acionar Supervisor e Regra Qualidade GA.</p>
                </div>
              </div>

              <table className="print-table w-full text-[7.5px]">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="w-6">ID</th>
                    <th className="w-16">MODELO</th>
                    <th>O QUE CONTROLAR (KPI / DATA INSERÇÃO)</th>
                    <th>HISTÓRICO DE AMOSTRAGENS (DATA / TURNO / HORA / VIS / STATUS)</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.controlAmostral || []).map((item, idx) => (
                    <tr key={item.id}>
                      <td className="font-mono font-bold">{idx + 1}</td>
                      <td>{item.model}</td>
                      <td className="text-left">
                        <strong>{item.item}</strong> ({item.source})
                        <div className="text-[7px] text-slate-600 font-mono">Posto: {item.station} | KPI: {item.kpiSource} | Ins: {item.insertDate}</div>
                      </td>
                      <td className="p-1 text-left">
                        <div className="flex flex-wrap gap-1 font-mono text-[7px]">
                          {(item.checks || []).map((chk, cIdx) => (
                            <span key={cIdx} className={`px-1 py-0.5 border ${chk.status === 'OK' ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-100 font-bold text-red-800'}`}>
                              [{chk.date || data.header.date}] {chk.shift ? chk.shift.slice(0, 2) : "1T"} - {chk.hora}h ({chk.vis}): <strong>{chk.status}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border border-black p-2 space-y-1">
                <strong className="block text-[8px] font-mono uppercase">REGISTRO DE CONTENÇÃO E RESOLUÇÃO (OCORRÊNCIAS NOK COM DATA/HORA/VIS):</strong>
                <table className="print-table w-full text-[7px]">
                  <thead>
                    <tr className="bg-slate-200">
                      <th>Data / Hora / VIS</th>
                      <th>Turno</th>
                      <th>Ação de Contenção Aplicada / Post-it</th>
                      <th>Data / Resp. Contenção</th>
                      <th>Ação Resolutiva Definitiva</th>
                      <th>Data / Resp. Resolução</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.controlAmostral || []).flatMap(c => c.koLogs || []).map((log, lIdx) => (
                      <tr key={lIdx}>
                        <td className="font-mono font-bold text-red-700">{log.date || data.header.date} {log.hora} - {log.vis}</td>
                        <td>{log.turn}</td>
                        <td className="text-left">{log.containment}</td>
                        <td>{log.containmentDate} ({log.containmentResp})</td>
                        <td className="text-left">{log.resolution}</td>
                        <td>{log.resolutionDate} ({log.resolutionResp})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportCategory === "GEMBA" && (
            <div className="space-y-3 text-[8.5px] font-sans">
              <div className="border-2 border-black p-2 flex justify-between items-center bg-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="font-black text-sm tracking-tight">STELLANTIS</div>
                  <div className="text-[10px] font-bold border-l-2 border-black pl-3">
                    SPW / SIS - FORMULÁRIO GEMBA WALK DO TEAM LEADER (FCI_SA_008)
                  </div>
                </div>
                <div className="text-right font-mono text-[9px]">
                  <div><strong>ÁREA / TRECHO:</strong> {data.gembaWalk?.area || data.header.area}</div>
                  <div><strong>AUDITOR TL:</strong> {data.gembaWalk?.auditor || data.header.teamLeader}</div>
                  <div><strong>SEMANA:</strong> S{data.gembaWalk?.weekNum || data.header.weekNum}</div>
                </div>
              </div>

              <table className="print-table w-full text-[7.5px]">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="w-6">#</th>
                    <th className="w-16">ÁREA</th>
                    <th>PONTO A EXAMINAR / VOZ DO PROCESSO</th>
                    <th className="w-20">LIMITES [LTL|LCL|UCL|UTL]</th>
                    <th className="w-12">SEG</th>
                    <th className="w-12">TER</th>
                    <th className="w-12">QUA</th>
                    <th className="w-12">QUI</th>
                    <th className="w-12">SEX</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.gembaWalk?.items || []).map((item, idx) => (
                    <tr key={item.id}>
                      <td className="font-mono font-bold">{idx + 1}</td>
                      <td>{item.area}</td>
                      <td className="text-left font-bold">{item.point}</td>
                      <td className="font-mono text-[7px]">[{item.ltl}|{item.lcl}|{item.ucl}|{item.utl}]</td>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(dKey => {
                        const dVal = item.days?.[dKey]?.val;
                        return (
                          <td key={dKey} className="font-mono font-bold">
                            {dVal !== undefined && dVal !== null && dVal !== "" ? dVal : "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border border-black p-2 bg-slate-50 space-y-1">
                <strong className="block text-[8px] uppercase border-b border-black pb-0.5">
                  DIÁRIO DE OBSERVAÇÕES & INTERVENÇÕES NO GEMBA WALK (SEGUNDA A SEXTA):
                </strong>
                <div className="grid grid-cols-5 gap-1 text-[7.5px] font-mono">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((dKey, dIdx) => (
                    <div key={dKey} className="border border-slate-300 p-1 bg-white">
                      <strong>{['Seg', 'Ter', 'Qua', 'Qui', 'Sex'][dIdx]}:</strong>
                      <p className="text-[7px] text-slate-800">{data.gembaWalk?.notes?.[dKey] || "N/A"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {reportCategory === "A1_SHEET" && (
            <div className="space-y-4 text-xs">
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">STELLANTIS INDUSTRIAL SYSTEM (SIS)</h1>
                  <h2 className="text-sm font-bold text-slate-800 uppercase">
                    TOTEM DO TEAM LEADER - FOLHA A1 BRIEFING DIÁRIO ({data.header.plant})
                  </h2>
                  <p className="text-xs text-slate-600 font-mono">
                    {data.header.shop} | {data.header.line} | {data.header.area} | {data.header.shift}
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-slate-700">
                  <div><strong>Data:</strong> {data.header.date}</div>
                  <div><strong>Semana:</strong> S{data.header.weekNum}</div>
                  <div><strong>Team Leader:</strong> {data.header.teamLeader}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 border border-slate-800 p-2 rounded">
                <div><strong>Segurança Ontem:</strong> {data.kpisYesterday.safety.val} (Target: {data.kpisYesterday.safety.target})</div>
                <div><strong>Qualidade Ontem:</strong> {data.kpisYesterday.quality.val} (Target: {data.kpisYesterday.quality.target})</div>
                <div><strong>OPE Ontem:</strong> {data.kpisYesterday.ope.val} (Target: {data.kpisYesterday.ope.target})</div>
              </div>

              <div>
                <h3 className="font-bold border-b border-slate-800 pb-1 mb-1">Pauta do Dia & Ponto de Mudança</h3>
                <ul className="list-disc pl-5">
                  {(data.dailyInfo || []).map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {reportCategory === "MEDIDAS" && (
            <div className="space-y-4 text-xs font-sans">
              {(data.medidasConservatorias || []).map((mc) => (
                <div key={mc.id} className="border-2 border-black p-3 space-y-3">
                  <div className="grid grid-cols-4 border-b-2 border-black pb-2 text-center font-mono text-[9px] gap-1 bg-slate-100 p-1">
                    <div className="font-bold text-left">
                      <div>STELLANTIS</div>
                      <div>FORMULÁRIO FQ_SA_001</div>
                    </div>
                    <div className="col-span-2 font-black text-xs text-center uppercase self-center">
                      FORMULÁRIO DE MEDIDA CONSERVATÓRIA (BP9 - 30 DIAS)
                    </div>
                    <div className="text-right">
                      <div><strong>Código:</strong> {mc.code}</div>
                      <div><strong>Status:</strong> {mc.status}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[9px] border-b border-black pb-2">
                    <div><strong>Planta / Shop:</strong> {mc.plantShop || "BETIM VHI - MONTAGEM"}</div>
                    <div><strong>UTE/UEP:</strong> {mc.ute || "UTE 01"}</div>
                    <div><strong>Domínio TL:</strong> {mc.domain || "DOMÍNIO 02"}</div>
                    <div><strong>Estação / PDT:</strong> {mc.station || "OP 20"}</div>
                    <div><strong>Data Início:</strong> {mc.startDate}</div>
                    <div><strong>Término Previsto:</strong> {mc.endDatePlanned}</div>
                    <div><strong>VIS / Chassi Início:</strong> {mc.vinStart}</div>
                    <div><strong>VIS / Chassi Fim:</strong> {mc.vinEnd || "Em aberto"}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[9px] border-b border-black pb-2">
                    <div><strong>O Quê (Ação):</strong> {mc.what}</div>
                    <div><strong>Como (Execução):</strong> {mc.how}</div>
                    <div><strong>Por Quê (Motivação):</strong> {mc.reason}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div className="border border-green-700 bg-green-50 p-2 flex flex-col justify-between">
                      <div>
                        <strong className="text-green-800 block mb-1">CONDIÇÃO CORRETA "OK":</strong>
                        <p className="mb-1">{mc.okCondition}</p>
                      </div>
                      <div className="mt-2 text-center border-t border-green-300 pt-1">
                        <img 
                          src={mc.okPhoto || DEFAULT_OK_SVG} 
                          alt="Padrão OK" 
                          className="w-full h-32 object-contain border border-green-600 rounded bg-white p-1" 
                        />
                      </div>
                    </div>
                    <div className="border border-red-700 bg-red-50 p-2 flex flex-col justify-between">
                      <div>
                        <strong className="text-red-800 block mb-1">CONDIÇÃO INCORRETA "KO" (ANOMALIA):</strong>
                        <p className="mb-1">{mc.koCondition}</p>
                      </div>
                      <div className="mt-2 text-center border-t border-red-300 pt-1">
                        <img 
                          src={mc.koPhoto || DEFAULT_KO_SVG} 
                          alt="Anomalia KO" 
                          className="w-full h-32 object-contain border border-red-600 rounded bg-white p-1" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {reportCategory === "POLIVALENCIA" && (
            <div className="space-y-4 text-xs font-sans">
              <div className="border-2 border-black p-2 flex justify-between items-center bg-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="font-black text-sm tracking-tight">STELLANTIS</div>
                  <div className="text-[10px] font-bold border-l-2 border-black pl-3">
                    MATRIZ DE HABILITAÇÃO & POLIVALÊNCIA 331 (ILUO)
                  </div>
                </div>
                <div className="text-right font-mono text-[9px]">
                  <div><strong>Linha:</strong> {data.header.line} | <strong>Área:</strong> {data.header.area}</div>
                  <div><strong>Team Leader:</strong> {data.header.teamLeader}</div>
                </div>
              </div>

              <table className="print-table w-full text-[8px]">
                <thead>
                  <tr className="bg-slate-200">
                    <th>Operador</th>
                    <th>Matrícula</th>
                    <th>Posto Titular</th>
                    {(data.pdts || []).map(pdt => (
                      <th key={pdt.id}>{pdt.code}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.efetivo || []).map(ef => (
                    <tr key={ef.id}>
                      <td className="font-bold text-left">{ef.name}</td>
                      <td className="font-mono">{ef.matricula}</td>
                      <td className="font-mono">{ef.pdtTitular}</td>
                      {(data.pdts || []).map(pdt => {
                        const level = (ef.skills && ef.skills[pdt.code]) || 0;
                        return (
                          <td key={pdt.id} className="font-bold font-mono">
                            {level === 3 ? "3 (L)" : level === 2 ? "2 (U)" : level === 1 ? "1 (I)" : "0 (O)"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="border-b border-slate-900 mb-1 pb-4"></div>
              <strong>Team Leader Responsável</strong>
              <p className="text-[10px] text-slate-500">{data.header.teamLeader}</p>
            </div>
            <div>
              <div className="border-b border-slate-900 mb-1 pb-4"></div>
              <strong>Supervisor de Produção UTE</strong>
              <p className="text-[10px] text-slate-500">Validação Operacional</p>
            </div>
            <div>
              <div className="border-b border-slate-900 mb-1 pb-4"></div>
              <strong>Gerente do Shop / Planta</strong>
              <p className="text-[10px] text-slate-500">Aprovação Executiva</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CadastrosMasterView({
  data,
  openFormModal,
  onNavigateToTab
}: {
  data: SisData;
  openFormModal: (type: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <i className="fa-solid fa-sliders text-sky-400"></i> CADASTROS MESTRES DA PRODUÇÃO
          </h2>
          <p className="text-xs text-slate-400">Gerenciamento central de Efetivo, Postos (PDTs), Linhas, Turnos, Plantas e Shops</p>
        </div>
      </div>

      {/* Acesso Rápido aos Novos Módulos de Gestão */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('CADASTRO_TL')}
          className="bg-slate-950 p-3 rounded-xl border border-sky-500/30 hover:border-sky-500 cursor-pointer transition space-y-1 shadow"
        >
          <div className="flex justify-between items-center">
            <span className="text-sky-400 font-bold text-xs uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-user-tie"></i> Team Leaders
            </span>
            <span className="text-white font-mono font-bold text-sm bg-slate-900 px-2 py-0.5 rounded">
              {(data.teamLeadersList || []).length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Gerenciar líderes cadastrados, turnos e linhas vinculadas</p>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('CADASTRO_LINHAS')}
          className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 hover:border-amber-500 cursor-pointer transition space-y-1 shadow"
        >
          <div className="flex justify-between items-center">
            <span className="text-amber-400 font-bold text-xs uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-industry"></i> Linhas de Produção
            </span>
            <span className="text-white font-mono font-bold text-sm bg-slate-900 px-2 py-0.5 rounded">
              {(data.linhasList || []).length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Administrar linhas fabris, metas e postos correspondentes</p>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('CADASTRO_PDT')}
          className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 hover:border-emerald-500 cursor-pointer transition space-y-1 shadow"
        >
          <div className="flex justify-between items-center">
            <span className="text-emerald-400 font-bold text-xs uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-wrench"></i> Postos (PDT)
            </span>
            <span className="text-white font-mono font-bold text-sm bg-slate-900 px-2 py-0.5 rounded">
              {(data.postosList || []).length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Sequência operacional, ergonomia e ciclos de referência</p>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('CADASTRO_OPERACOES')}
          className="bg-slate-950 p-3 rounded-xl border border-sky-500/30 hover:border-sky-500 cursor-pointer transition space-y-1 shadow"
        >
          <div className="flex justify-between items-center">
            <span className="text-sky-300 font-bold text-xs uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-stopwatch-20"></i> Operações & Ciclos
            </span>
            <span className="text-white font-mono font-bold text-sm bg-slate-900 px-2 py-0.5 rounded">
              {(data.operacoesList || []).length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Tempos cronometrados, capacidade horária e histórico</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <strong className="text-xs text-sky-400 uppercase">Efetivo de Operadores ({(data.efetivo || []).length})</strong>
            <button onClick={() => openFormModal('efetivo')} className="text-[10px] text-sky-400 hover:underline cursor-pointer">+ Add</button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
            {(data.efetivo || []).map(ef => (
              <div key={ef.id} className="p-1.5 bg-slate-900 rounded border border-slate-800 flex justify-between">
                <span className="text-white font-bold">{ef.name}</span>
                <span className="font-mono text-slate-400">{ef.matricula}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <strong className="text-xs text-amber-400 uppercase">PDTs do Totem ({(data.pdts || []).length})</strong>
            <button onClick={() => openFormModal('pdt')} className="text-[10px] text-amber-400 hover:underline cursor-pointer">+ Add</button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
            {(data.pdts || []).map(pdt => (
              <div key={pdt.id} className="p-1.5 bg-slate-900 rounded border border-slate-800 flex justify-between font-mono">
                <span className="text-amber-300 font-bold">{pdt.code}</span>
                <span className="text-slate-300">{pdt.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <strong className="text-xs text-emerald-400 uppercase">Linhas de Produção</strong>
            <button onClick={() => openFormModal('linha')} className="text-[10px] text-emerald-400 hover:underline cursor-pointer">+ Add</button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
            {(data.linhas || []).map((l, i) => (
              <div key={i} className="p-1.5 bg-slate-900 rounded border border-slate-800 text-slate-200 font-mono">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GenericFormModal({
  type,
  data,
  updateData,
  onClose,
  targetId
}: {
  type: string;
  data: SisData;
  updateData: React.Dispatch<React.SetStateAction<SisData>>;
  onClose: () => void;
  targetId: number | null;
}) {
  const existingItem = type === 'gembaItemEdit' ? (data.gembaWalk?.items || []).find(it => it.id === targetId) : null;

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (existingItem) {
      return {
        area: existingItem.area,
        point: existingItem.point,
        ltl: existingItem.ltl,
        lcl: existingItem.lcl,
        ucl: existingItem.ucl,
        utl: existingItem.utl
      };
    }
    return {};
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (type === 'gembaItem') {
      const newItem = {
        id: Date.now(),
        area: formData.area || "OP 10",
        point: formData.point || "Voz do Processo / Defeito",
        ltl: Number(formData.ltl || 0),
        lcl: Number(formData.lcl || 0),
        ucl: Number(formData.ucl || 2),
        utl: Number(formData.utl || 4),
        days: {
          Mon: { val: "", corr: "" },
          Tue: { val: "", corr: "" },
          Wed: { val: "", corr: "" },
          Thu: { val: "", corr: "" },
          Fri: { val: "", corr: "" }
        }
      };
      updateData(prev => ({
        ...prev,
        gembaWalk: {
          ...prev.gembaWalk,
          items: [...(prev.gembaWalk?.items || []), newItem]
        }
      }));
    } else if (type === 'gembaItemEdit') {
      updateData(prev => {
        const newItems = (prev.gembaWalk?.items || []).map(item => {
          if (item.id !== targetId) return item;
          return {
            ...item,
            area: formData.area !== undefined ? formData.area : item.area,
            point: formData.point !== undefined ? formData.point : item.point,
            ltl: formData.ltl !== undefined ? Number(formData.ltl) : item.ltl,
            lcl: formData.lcl !== undefined ? Number(formData.lcl) : item.lcl,
            ucl: formData.ucl !== undefined ? Number(formData.ucl) : item.ucl,
            utl: formData.utl !== undefined ? Number(formData.utl) : item.utl
          };
        });
        return {
          ...prev,
          gembaWalk: {
            ...prev.gembaWalk,
            items: newItems
          }
        };
      });
    } else if (type === 'gembaDaily') {
      const dayKey = formData.dayKey || "Mon";
      const itemId = Number(formData.itemId || (data.gembaWalk?.items?.[0]?.id));
      const val = formData.val !== undefined ? formData.val : 0;
      const corr = formData.corr || "";

      updateData(prev => {
        const newItems = (prev.gembaWalk?.items || []).map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            days: {
              ...item.days,
              [dayKey]: { val: Number(val), corr }
            }
          };
        });
        const newNotes = {
          ...(prev.gembaWalk?.notes || {}),
          [dayKey]: formData.dayNote || prev.gembaWalk?.notes?.[dayKey] || ""
        };
        return {
          ...prev,
          gembaWalk: {
            ...prev.gembaWalk,
            items: newItems,
            notes: newNotes
          }
        };
      });
    } else if (type === 'medida') {
      const newMc = {
        id: Date.now(),
        code: formData.code || `MC-2026-${Math.floor(100 + Math.random()*900)}`,
        plantShop: `${data.header.plant} - ${data.header.shop}`,
        ute: data.header.ute,
        domain: data.header.domain,
        station: formData.station || "OP 20",
        respSupervisor: formData.respSupervisor || "Marcos Silva",
        startDate: new Date().toLocaleDateString(),
        endDatePlanned: formData.endDatePlanned || "30 Dias",
        endDateReal: "",
        vinStart: formData.vinStart || "9BD120500",
        vinEnd: formData.vinEnd || "",
        products: formData.products || "Todos",
        desvioLinked: formData.desvioLinked || "NÃO",
        reason: formData.reason || "Reincidência de não conformidade",
        what: formData.what || "Contingência temporária aplicada",
        how: formData.how || "Inspeção visual e tátil em 100% dos veículos",
        okCondition: formData.okCondition || "Montagem conforme padrão",
        koCondition: formData.koCondition || "Desvio de encaixe ou ruído",
        okPhoto: formData.okPhoto || "",
        koPhoto: formData.koPhoto || "",
        whyReason: formData.whyReason || "Anomalia repetitiva na qualidade",
        dailyTracking: [],
        signatures: [],
        status: "ATIVA (BP9 - 30 DIAS)"
      };
      updateData(prev => ({ ...prev, medidasConservatorias: [newMc, ...(prev.medidasConservatorias || [])] }));
    } else if (type === 'chart_5s') {
      const target = formData.targetLine !== undefined ? Number(formData.targetLine) : data.charts.safety5s.targetLine;
      const dayNum = Number(formData.dayNum || 1);
      const dayVal = Number(formData.dayVal || 0);

      updateData(prev => {
        const newDays = [...prev.charts.safety5s.days];
        if (dayNum >= 1 && dayNum <= 31) {
          newDays[dayNum - 1] = dayVal;
        }
        return {
          ...prev,
          charts: {
            ...prev.charts,
            safety5s: {
              ...prev.charts.safety5s,
              targetLine: target,
              days: newDays
            }
          }
        };
      });
    } else if (type === 'chart_quality') {
      const target = formData.targetLine !== undefined ? Number(formData.targetLine) : data.charts.quality.targetLine;
      const dayNum = Number(formData.dayNum || 1);
      const dayVal = Number(formData.dayVal || 0);

      updateData(prev => {
        const newDays = [...prev.charts.quality.days];
        if (dayNum >= 1 && dayNum <= 31) {
          newDays[dayNum - 1] = dayVal;
        }
        return {
          ...prev,
          charts: {
            ...prev.charts,
            quality: {
              ...prev.charts.quality,
              targetLine: target,
              days: newDays
            }
          }
        };
      });
    } else if (type === 'chart_ope') {
      const target = formData.targetLine !== undefined ? Number(formData.targetLine) : data.charts.ope.targetLine;
      const dayNum = Number(formData.dayNum || 1);
      const dayVal = Number(formData.dayVal || 0);

      updateData(prev => {
        const newDays = [...prev.charts.ope.days];
        if (dayNum >= 1 && dayNum <= 31) {
          newDays[dayNum - 1] = dayVal;
        }
        return {
          ...prev,
          charts: {
            ...prev.charts,
            ope: {
              ...prev.charts.ope,
              targetLine: target,
              days: newDays
            }
          }
        };
      });
    } else if (type === 'chart_yamazumi') {
      const target = formData.tctTarget !== undefined ? Number(formData.tctTarget) : data.charts.yamazumi.tctTarget;
      const pdtName = formData.pdtName || "OP 10";
      const vaVal = Number(formData.vaVal || 35);
      const nvaVal = Number(formData.nvaVal || 10);

      updateData(prev => {
        const existingPdts = [...prev.charts.yamazumi.pdts];
        const idx = existingPdts.findIndex(p => p.name === pdtName);
        if (idx >= 0) {
          existingPdts[idx] = { name: pdtName, va: vaVal, nva: nvaVal };
        } else {
          existingPdts.push({ name: pdtName, va: vaVal, nva: nvaVal });
        }
        return {
          ...prev,
          charts: {
            ...prev.charts,
            yamazumi: {
              tctTarget: target,
              pdts: existingPdts
            }
          }
        };
      });
    } else if (type === 'amostral') {
      const newItem = {
        id: Date.now(),
        item: formData.item || "Verificação de Torque / Conector",
        source: (formData.source || "PROCESSO").toUpperCase(),
        model: formData.model || "Todos",
        station: formData.station || "OP 20",
        kpiSource: formData.kpiSource || "Qualif / SCA",
        insertDate: new Date().toLocaleDateString(),
        durationDays: 15,
        frequency: "A cada 2 horas",
        status: "OK",
        checks: [],
        koLogs: []
      };
      updateData(prev => ({ ...prev, controlAmostral: [newItem, ...(prev.controlAmostral || [])] }));
    } else if (type === 'amostralCheck') {
      const newCheck = {
        id: Date.now(),
        date: formData.date || new Date().toLocaleDateString(),
        shift: formData.shift || data.header.shift,
        hora: formData.hora || new Date().toLocaleTimeString().slice(0, 5),
        vis: formData.vis || "9BD120950",
        status: formData.status || "OK"
      };

      const isKo = formData.status === 'KO';
      const newKoLog = isKo ? {
        id: Date.now(),
        date: formData.date || new Date().toLocaleDateString(),
        hora: formData.hora || new Date().toLocaleTimeString().slice(0, 5),
        vis: formData.vis || "9BD120950",
        turn: formData.shift || data.header.shift,
        containment: formData.containment || "Abertura de Post-it & Retrabalho imediato no produto",
        containmentDate: formData.date || new Date().toLocaleDateString(),
        containmentResp: data.header.teamLeader,
        resolution: formData.resolution || "Análise e ajuste de calibração no posto",
        resolutionDate: "Em andamento",
        resolutionResp: "Equipe de Qualidade / Manutenção"
      } : null;

      updateData(prev => ({
        ...prev,
        controlAmostral: (prev.controlAmostral || []).map(item => {
          if (item.id !== targetId) return item;
          const updatedLogs = isKo && newKoLog ? [...(item.koLogs || []), newKoLog] : (item.koLogs || []);
          return { 
            ...item, 
            checks: [...(item.checks || []), newCheck],
            koLogs: updatedLogs
          };
        })
      }));
    } else if (type === 'bp9Daily') {
      const dayNum = Number(formData.dayNum || 1);
      const t1Val = Number(formData.t1Val || 0);
      const t2Val = Number(formData.t2Val || 0);
      const t3Val = Number(formData.t3Val || 0);

      updateData(prev => ({
        ...prev,
        medidasConservatorias: (prev.medidasConservatorias || []).map(mc => {
          if (mc.id !== targetId) return mc;
          const tracking = [...(mc.dailyTracking || [])];
          const idx = tracking.findIndex(dt => dt.day === dayNum);
          if (idx >= 0) {
            tracking[idx] = { day: dayNum, t1: t1Val, t2: t2Val, t3: t3Val };
          } else {
            tracking.push({ day: dayNum, t1: t1Val, t2: t2Val, t3: t3Val });
          }
          return { ...mc, dailyTracking: tracking };
        })
      }));
    } else if (type === 'kaizen') {
      const newK = {
        id: Date.now(),
        title: formData.title || "Melhoria Ergonômica",
        author: formData.author || data.header.teamLeader,
        tool: formData.tool || "Quick Kaizen",
        area: data.header.area,
        status: "EM ANDAMENTO",
        savings: formData.savings || "Ganho de Produtividade",
        why1: formData.why1 || "",
        why2: formData.why2 || "",
        why3: formData.why3 || "",
        why4: formData.why4 || "",
        why5: formData.why5 || ""
      };
      updateData(prev => ({ ...prev, kaizenBank: [newK, ...(prev.kaizenBank || [])] }));
    } else if (type === 'escalada') {
      const newEsc = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        pdt: formData.pdt || "OP 20",
        level: formData.level || "L1 - Team Leader",
        issue: formData.issue || "Parada de linha",
        responseTime: "2 min",
        status: "EM ATENDIMENTO",
        containment: formData.containment || "Ação de contenção imediata"
      };
      updateData(prev => ({ ...prev, escaladaLogs: [newEsc, ...(prev.escaladaLogs || [])] }));
    } else if (type === 'lap') {
      const newAct = {
        id: Date.now(),
        title: formData.title || "Ação de Correção",
        shift: data.header.shift,
        col: "NOVO",
        owner: formData.owner || data.header.teamLeader,
        deadline: formData.deadline || "Em 3 dias"
      };
      updateData(prev => ({ ...prev, lapActions: [newAct, ...(prev.lapActions || [])] }));
    } else if (type === 'efetivo') {
      const newEf = {
        id: Date.now(),
        matricula: formData.matricula || `ST${Math.floor(10000 + Math.random() * 90000)}`,
        name: formData.name || "NOVO OPERADOR",
        plant: data.header.plant,
        line: data.header.line,
        area: data.header.area,
        shift: data.header.shift,
        domain: data.header.domain,
        pdtTitular: formData.pdtTitular || "OP 10",
        skills: {}
      };
      updateData(prev => ({ ...prev, efetivo: [...(prev.efetivo || []), newEf] }));
    } else if (type === 'pdt') {
      const newPdt = {
        id: Date.now(),
        code: formData.code || `OP ${Math.floor(Math.random()*90 + 10)}`,
        name: formData.name || "Nova Operação",
        line: data.header.line,
        area: data.header.area,
        ergoCritical: formData.ergoCritical === "SIM",
        ergoPair: formData.ergoPair || "OP 10"
      };
      updateData(prev => ({ ...prev, pdts: [...(prev.pdts || []), newPdt] }));
    } else if (type === 'linha') {
      const nomeLinha = (formData.linhaNome || "").trim();
      if (nomeLinha) {
        updateData(prev => ({ ...prev, linhas: [...(prev.linhas || []), nomeLinha.toUpperCase()] }));
      }
    } else if (type === 'redrabbit') {
      const novoRR = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        shift: data.header.shift,
        pdt: formData.pdt || "OP 20",
        device: formData.device || "Poka-Yoke Presença Conector",
        anomalyProvoked: formData.anomalyProvoked || "Anomalia provocada para teste",
        opTested: formData.opTested || "Operador do posto",
        detected: (formData.status || "APROVADO") === "APROVADO",
        status: formData.status || "APROVADO",
        tlSign: data.header.teamLeader
      };
      updateData(prev => ({ ...prev, redRabbit: [novoRR, ...(prev.redRabbit || [])] }));
    } else if (type === 'pauta') {
      if (formData.pauta) {
        updateData(prev => ({ ...prev, pautaBomDia: [...(prev.pautaBomDia || []), formData.pauta] }));
      }
    } else if (type === 'mudanca') {
      const newM = {
        id: Date.now(),
        type: formData.type || "Processo",
        detail: formData.detail || "Mudança cadastrada",
        conservatorio: formData.conservatorio || "Acompanhamento pelo TL"
      };
      updateData(prev => ({ ...prev, shiftChanges: [...(prev.shiftChanges || []), newM] }));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-2">
            <i className="fa-solid fa-pen-to-square"></i> Registro SIS: {type.replace('chart_', 'Gráfico ').replace('gembaItemEdit', 'Editar Voz Gemba').replace('gembaItem', 'Nova Voz Gemba')}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <div className="space-y-3 text-xs">
          {(type === 'gembaItem' || type === 'gembaItemEdit') && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-slate-400 block mb-1">Área / Posto:</label><input type="text" defaultValue={formData.area || "OP 10"} placeholder="OP 10" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, area: e.target.value})} /></div>
                <div><label className="text-slate-400 block mb-1">Ponto a Examinar (Voz):</label><input type="text" defaultValue={formData.point || ""} placeholder="Veículos em Reparo Elétrico" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, point: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div><label className="text-slate-400 block mb-1">LTL:</label><input type="number" defaultValue={formData.ltl !== undefined ? formData.ltl : 0} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, ltl: e.target.value})} /></div>
                <div><label className="text-slate-400 block mb-1">LCL:</label><input type="number" defaultValue={formData.lcl !== undefined ? formData.lcl : 0} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, lcl: e.target.value})} /></div>
                <div><label className="text-amber-400 block mb-1">UCL:</label><input type="number" defaultValue={formData.ucl !== undefined ? formData.ucl : 2} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, ucl: e.target.value})} /></div>
                <div><label className="text-red-400 block mb-1">UTL:</label><input type="number" defaultValue={formData.utl !== undefined ? formData.utl : 4} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, utl: e.target.value})} /></div>
              </div>
            </>
          )}

          {type === 'gembaDaily' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Dia da Semana:</label>
                  <select className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, dayKey: e.target.value})}>
                    <option value="Mon">Segunda-Feira</option>
                    <option value="Tue">Terça-Feira</option>
                    <option value="Wed">Quarta-Feira</option>
                    <option value="Thu">Quinta-Feira</option>
                    <option value="Fri">Sexta-Feira</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ponto / Voz Gemba:</label>
                  <select className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, itemId: e.target.value})}>
                    {(data.gembaWalk?.items || []).map(it => (
                      <option key={it.id} value={it.id}>{it.area} - {it.point}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Valor / Qtd Apurada:</label>
                  <input type="number" defaultValue="0" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, val: e.target.value})} />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Correção Imediata (Se NOK):</label>
                  <input type="text" placeholder="Ex: Ajuste no posto" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, corr: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Anotação Diária do Gemba Walk:</label>
                <input type="text" placeholder="Observação geral para a gerência..." className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, dayNote: e.target.value})} />
              </div>
            </>
          )}

          {type === 'medida' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-slate-400 block mb-1">Código Medida:</label><input type="text" placeholder="MC-2026-004" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, code: e.target.value})} /></div>
                <div><label className="text-slate-400 block mb-1">Posto / Estação:</label><input type="text" placeholder="OP 20" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, station: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-slate-400 block mb-1">Chassi Inicial (VIS):</label><input type="text" placeholder="9BD120500" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, vinStart: e.target.value})} /></div>
                <div><label className="text-slate-400 block mb-1">Prazo Planejado:</label><input type="text" placeholder="30 Dias" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, endDatePlanned: e.target.value})} /></div>
              </div>
              <div><label className="text-slate-400 block mb-1">Descrição do Problema (Por quê?):</label><textarea placeholder="Ex: Reincidência de ruído e encaixe no conector..." className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, reason: e.target.value})}></textarea></div>
              <div><label className="text-slate-400 block mb-1">Ação da Medida (O quê?):</label><input type="text" placeholder="Ex: Inspeção 100% e aplicação de feltro antiruído" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, what: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Modo de Execução (Como?):</label><input type="text" placeholder="Ex: Pressionar conector até ouvir o clique duplo" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, how: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-emerald-400 block mb-1">Condição Correta "OK":</label><input type="text" placeholder="Feltro montado e trava positiva" className="w-full bg-slate-950 border border-emerald-500/50 p-2 rounded text-white" onChange={e => setFormData({...formData, okCondition: e.target.value})} /></div>
                <div><label className="text-red-400 block mb-1">Condição Incorreta "KO":</label><input type="text" placeholder="Feltro ausente ou trava folgada" className="w-full bg-slate-950 border border-red-500/50 p-2 rounded text-white" onChange={e => setFormData({...formData, koCondition: e.target.value})} /></div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-3 mt-1">
                <div className="bg-slate-950 p-2 rounded border border-emerald-500/30">
                  <label className="text-emerald-400 block mb-1 font-bold flex items-center gap-1">
                    <i className="fa-solid fa-camera"></i> Foto Padrão "OK":
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full text-slate-300 text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer" 
                    onChange={e => handleImageUpload(e, 'okPhoto')} 
                  />
                  {formData.okPhoto && (
                    <img src={formData.okPhoto} alt="Preview OK" className="h-20 w-full object-cover rounded mt-2 border border-emerald-500" />
                  )}
                </div>
                <div className="bg-slate-950 p-2 rounded border border-red-500/30">
                  <label className="text-red-400 block mb-1 font-bold flex items-center gap-1">
                    <i className="fa-solid fa-camera"></i> Foto Anomalia "KO":
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full text-slate-300 text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer" 
                    onChange={e => handleImageUpload(e, 'koPhoto')} 
                  />
                  {formData.koPhoto && (
                    <img src={formData.koPhoto} alt="Preview KO" className="h-20 w-full object-cover rounded mt-2 border border-red-500" />
                  )}
                </div>
              </div>
            </>
          )}

          {type === 'chart_5s' && (
            <>
              <div>
                <label className="text-slate-400 block mb-1">Tarja / Meta de 5S (Máx Desvios):</label>
                <input type="number" defaultValue={data.charts.safety5s.targetLine} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, targetLine: e.target.value})} />
              </div>
              <div className="border-t border-slate-800 pt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Dia do Mês (1 a 31):</label>
                  <input type="number" min="1" max="31" defaultValue="1" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, dayNum: e.target.value})} />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Valor / Qtd Desvios:</label>
                  <input type="number" defaultValue="0" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, dayVal: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {type === 'chart_quality' && (
            <>
              <div>
                <label className="text-slate-400 block mb-1">Tarja / Meta de Qualidade (Máx Post-its):</label>
                <input type="number" defaultValue={data.charts.quality.targetLine} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, targetLine: e.target.value})} />
              </div>
              <div className="border-t border-slate-800 pt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Dia do Mês (1 a 31):</label>
                  <input type="number" min="1" max="31" defaultValue="1" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, dayNum: e.target.value})} />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Qtd Post-its no Dia:</label>
                  <input type="number" defaultValue="0" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, dayVal: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {type === 'chart_ope' && (
            <>
              <div>
                <label className="text-slate-400 block mb-1">Tarja / Meta de OPE (Máx Minutos Parada):</label>
                <input type="number" defaultValue={data.charts.ope.targetLine} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, targetLine: e.target.value})} />
              </div>
              <div className="border-t border-slate-800 pt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Dia do Mês (1 a 31):</label>
                  <input type="number" min="1" max="31" defaultValue="1" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, dayNum: e.target.value})} />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Minutos Parados no Dia:</label>
                  <input type="number" defaultValue="0" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, dayVal: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {type === 'chart_yamazumi' && (
            <>
              <div>
                <label className="text-slate-400 block mb-1">Target TcT (em segundos):</label>
                <input type="number" defaultValue={data.charts.yamazumi.tctTarget} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold" onChange={e => setFormData({...formData, tctTarget: e.target.value})} />
              </div>
              <div className="border-t border-slate-800 pt-2 grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Posto (PDT):</label>
                  <input type="text" placeholder="OP 10" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, pdtName: e.target.value})} />
                </div>
                <div>
                  <label className="text-emerald-400 block mb-1">Tempo VA (s):</label>
                  <input type="number" defaultValue="35" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, vaVal: e.target.value})} />
                </div>
                <div>
                  <label className="text-red-400 block mb-1">Tempo NVA (s):</label>
                  <input type="number" defaultValue="10" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, nvaVal: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {type === 'kaizen' && (
            <>
              <div><label className="text-slate-400 block mb-1">Título do Projeto Kaizen / A3:</label><input type="text" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, title: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Ferramenta CI Utilizada:</label>
                  <select className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, tool: e.target.value})}>
                    <option>Quick Kaizen</option>
                    <option>A3 / HERA</option>
                    <option>5-Why (5 Porquês)</option>
                    <option>Ishikawa</option>
                    <option>SPS Standard Problem Solving</option>
                  </select>
                </div>
                <div><label className="text-slate-400 block mb-1">Autor / Responsável:</label><input type="text" defaultValue={data.header.teamLeader} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, author: e.target.value})} /></div>
              </div>
              <div><label className="text-emerald-400 block mb-1">Ganhos de Produtividade / Ergo / Custo:</label><input type="text" placeholder="Ex: Redução de 12s NVA por veículo" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, savings: e.target.value})} /></div>
              
              <div className="border-t border-slate-800 pt-2 space-y-1.5 bg-slate-950 p-2 rounded border border-slate-800">
                <strong className="text-amber-300 font-mono block uppercase">Análise de Causa Raiz (5 Porquês):</strong>
                <input type="text" placeholder="1. Por quê? (Primeiro nível do problema)" className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-[11px]" onChange={e => setFormData({...formData, why1: e.target.value})} />
                <input type="text" placeholder="2. Por quê?" className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-[11px]" onChange={e => setFormData({...formData, why2: e.target.value})} />
                <input type="text" placeholder="3. Por quê?" className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-[11px]" onChange={e => setFormData({...formData, why3: e.target.value})} />
                <input type="text" placeholder="4. Por quê?" className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-[11px]" onChange={e => setFormData({...formData, why4: e.target.value})} />
                <input type="text" placeholder="5. Causa Raiz Definitiva" className="w-full bg-slate-900 border border-emerald-500/50 p-1.5 rounded text-white text-[11px] font-bold" onChange={e => setFormData({...formData, why5: e.target.value})} />
              </div>
            </>
          )}

          {type === 'efetivo' && (
            <>
              <div><label className="text-slate-400 block mb-1">Nome Completo do Colaborador:</label><input type="text" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Matrícula Stellantis:</label><input type="text" placeholder="ST12345" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, matricula: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">PDT Titular:</label><input type="text" placeholder="OP 10" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, pdtTitular: e.target.value})} /></div>
            </>
          )}

          {type === 'pdt' && (
            <>
              <div><label className="text-slate-400 block mb-1">Código do Posto (PDT):</label><input type="text" placeholder="OP 20" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" onChange={e => setFormData({...formData, code: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Nome / Descrição da Operação:</label><input type="text" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            </>
          )}

          {type === 'amostral' && (
            <>
              <div><label className="text-slate-400 block mb-1">Item / Característica a verificar:</label><input type="text" placeholder="Ex: Torque do conector" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, item: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Origem (PROCESSO / QUALIDADE / CLIENTE):</label><input type="text" placeholder="PROCESSO" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, source: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Modelo:</label><input type="text" placeholder="Todos" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, model: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Posto:</label><input type="text" placeholder="OP 20" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, station: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Fonte do KPI:</label><input type="text" placeholder="Qualif / SCA" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, kpiSource: e.target.value})} /></div>
            </>
          )}

          {type === 'amostralCheck' && (
            <>
              <div><label className="text-slate-400 block mb-1">Data:</label><input type="text" placeholder="dd/mm/aaaa" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, date: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Turno:</label><select className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, shift: e.target.value})}><option>1º TURNO</option><option>2º TURNO</option><option>3º TURNO</option></select></div>
              <div><label className="text-slate-400 block mb-1">Hora:</label><input type="text" placeholder="08:00" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, hora: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">VIS / Chassi:</label><input type="text" placeholder="9BD120950" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, vis: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Resultado:</label><select className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, status: e.target.value})}><option>OK</option><option>KO</option></select></div>
              <div><label className="text-slate-400 block mb-1">Contenção (se KO):</label><input type="text" placeholder="Ação de contenção imediata" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, containment: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Resolução (se KO):</label><input type="text" placeholder="Ação definitiva" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, resolution: e.target.value})} /></div>
            </>
          )}

          {type === 'bp9Daily' && (
            <>
              <div><label className="text-slate-400 block mb-1">Dia do mês (1-31):</label><input type="number" placeholder="1" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, dayNum: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Valor T1:</label><input type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, t1Val: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Valor T2:</label><input type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, t2Val: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Valor T3:</label><input type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, t3Val: e.target.value})} /></div>
            </>
          )}

          {type === 'escalada' && (
            <>
              <div><label className="text-slate-400 block mb-1">Posto (PDT):</label><input type="text" placeholder="OP 20" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, pdt: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Nível de escalada:</label><select className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, level: e.target.value})}><option>L1 - Team Leader</option><option>L2 - Supervisor</option><option>L3 - Gerente</option><option>L4 - Diretor</option></select></div>
              <div><label className="text-slate-400 block mb-1">Problema / Ocorrência:</label><input type="text" placeholder="Parada de linha" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, issue: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Contenção imediata:</label><input type="text" placeholder="Ação de contenção imediata" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, containment: e.target.value})} /></div>
            </>
          )}

          {type === 'lap' && (
            <>
              <div><label className="text-slate-400 block mb-1">Título da ação:</label><input type="text" placeholder="Ação de Correção" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, title: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Responsável:</label><input type="text" placeholder="" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, owner: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Prazo:</label><input type="text" placeholder="Em 3 dias" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, deadline: e.target.value})} /></div>
            </>
          )}

          {type === 'linha' && (
            <>
              <div><label className="text-slate-400 block mb-1">Nome da nova linha:</label><input type="text" placeholder="LINHA 05" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, linhaNome: e.target.value})} /></div>
            </>
          )}

          {type === 'redrabbit' && (
            <>
              <div><label className="text-slate-400 block mb-1">Posto (PDT):</label><input type="text" placeholder="OP 20" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, pdt: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Dispositivo Poka-Yoke:</label><input type="text" placeholder="Poka-Yoke Presença Conector" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, device: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Anomalia provocada:</label><input type="text" placeholder="Pino invertido de propósito" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, anomalyProvoked: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Operador testado:</label><input type="text" placeholder="" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, opTested: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Resultado:</label><select className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, status: e.target.value})}><option>APROVADO</option><option>REPROVADO</option></select></div>
            </>
          )}

          {type === 'pauta' && (
            <div><label className="text-slate-400 block mb-1">Novo Item para Pauta de Bom Dia:</label><input type="text" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, pauta: e.target.value})} /></div>
          )}

          {type === 'mudanca' && (
            <>
              <div><label className="text-slate-400 block mb-1">Tipo de Ponto de Mudança:</label><select className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, type: e.target.value})}><option>Fornecedor</option><option>Operador</option><option>Processo</option><option>Ferramental</option></select></div>
              <div><label className="text-slate-400 block mb-1">Detalhes da Alteração:</label><input type="text" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, detail: e.target.value})} /></div>
              <div><label className="text-slate-400 block mb-1">Medida Conservatória Aplicada:</label><input type="text" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" onChange={e => setFormData({...formData, conservatorio: e.target.value})} /></div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded font-bold text-xs cursor-pointer">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-xs shadow cursor-pointer">Salvar Registro</button>
        </div>
      </div>
    </div>
  );
}
