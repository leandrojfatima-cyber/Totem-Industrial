import React, { useState } from 'react';
import { MapaPdtRecord, PdtStatus } from '../types/mapa';

interface PainelTotemPdtModalProps {
  pdt: MapaPdtRecord;
  isOpen: boolean;
  onClose: () => void;
  onSavePdt: (pdt: MapaPdtRecord) => void;
  onDeletePdt?: (id: string) => void;
}

export function PainelTotemPdtModal({
  pdt,
  isOpen,
  onClose,
  onSavePdt,
  onDeletePdt
}: PainelTotemPdtModalProps) {
  const [activeTab, setActiveTab] = useState<string>('GEMBA');
  const [pdtData, setPdtData] = useState<MapaPdtRecord>(pdt);
  const [editPdtInfo, setEditPdtInfo] = useState<boolean>(false);

  // Estados de formulários temporários para adicionar itens nas abas
  const [novoGembaParam, setNovoGembaParam] = useState('');
  const [novoGembaValor, setNovoGembaValor] = useState('');
  
  const [novaLapAcao, setNovaLapAcao] = useState('');
  const [novaLapResp, setNovaLapResp] = useState('');
  const [novaLapPrazo, setNovaLapPrazo] = useState('');
  
  const [novaRotinaHora, setNovaRotinaHora] = useState('');
  const [novaRotinaAtiv, setNovaRotinaAtiv] = useState('');

  const [novoAmostralCaract, setNovoAmostralCaract] = useState('');
  const [novoAmostralVis, setNovoAmostralVis] = useState('');

  const [novoPokaDispositivo, setNovoPokaDispositivo] = useState('');
  const [novoPokaAnomalia, setNovoPokaAnomalia] = useState('');

  const [novaFerramentaPatr, setNovaFerramentaPatr] = useState('');
  const [novaFerramentaNome, setNovaFerramentaNome] = useState('');
  const [novaFerramentaTipo, setNovaFerramentaTipo] = useState('');

  const [novaOpCodigo, setNovaOpCodigo] = useState('');
  const [novaOpNome, setNovaOpNome] = useState('');
  const [novaOpCiclo, setNovaOpCiclo] = useState<number>(20);

  const [novoOpMatricula, setNovoOpMatricula] = useState('');
  const [novoOpNome, setNovoOpNome] = useState('');
  const [novoOpTurno, setNovoOpTurno] = useState('1º TURNO');

  const [novoPontoBriefing, setNovoPontoBriefing] = useState('');

  if (!isOpen) return null;

  const handleUpdate = (updated: MapaPdtRecord) => {
    setPdtData(updated);
    onSavePdt(updated);
  };

  const handleStatusChange = (newStatus: PdtStatus) => {
    const updated: MapaPdtRecord = { ...pdtData, status: newStatus };
    handleUpdate(updated);
  };

  // 1. Gemba handlers
  const handleAddGemba = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoGembaParam) return;
    const item = {
      id: Date.now(),
      parametro: novoGembaParam,
      valor: novoGembaValor || 'CONFORME',
      status: 'VERDE' as const,
      data: new Date().toLocaleDateString('pt-BR')
    };
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        gembaItens: [...pdtData.totemData.gembaItens, item]
      }
    };
    handleUpdate(updated);
    setNovoGembaParam('');
    setNovoGembaValor('');
  };

  const handleDeleteGemba = (id: number) => {
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        gembaItens: pdtData.totemData.gembaItens.filter(g => g.id !== id)
      }
    };
    handleUpdate(updated);
  };

  // 2. LAP handlers
  const handleAddLap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaLapAcao) return;
    const acao = {
      id: Date.now(),
      titulo: novaLapAcao,
      responsavel: novaLapResp || pdtData.teamLeaderNome,
      prazo: novaLapPrazo || 'Em 3 dias',
      status: 'TODO' as const,
      origem: 'TOTEM POSTO'
    };
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        lapAcoes: [...pdtData.totemData.lapAcoes, acao]
      }
    };
    handleUpdate(updated);
    setNovaLapAcao('');
    setNovaLapResp('');
    setNovaLapPrazo('');
  };

  const handleMoveLap = (id: number, status: 'TODO' | 'DOING' | 'DONE') => {
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        lapAcoes: pdtData.totemData.lapAcoes.map(a => a.id === id ? { ...a, status } : a)
      }
    };
    handleUpdate(updated);
  };

  const handleDeleteLap = (id: number) => {
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        lapAcoes: pdtData.totemData.lapAcoes.filter(a => a.id !== id)
      }
    };
    handleUpdate(updated);
  };

  // 3. Rotina handlers
  const handleAddRotina = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaRotinaAtiv) return;
    const rotina = {
      id: Date.now(),
      horario: novaRotinaHora || '08:00',
      atividade: novaRotinaAtiv,
      status: 'PENDENTE' as const,
      responsavel: 'Operador / TL'
    };
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        rotinasTurno: [...pdtData.totemData.rotinasTurno, rotina]
      }
    };
    handleUpdate(updated);
    setNovaRotinaHora('');
    setNovaRotinaAtiv('');
  };

  const handleDeleteRotina = (id: number) => {
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        rotinasTurno: pdtData.totemData.rotinasTurno.filter(r => r.id !== id)
      }
    };
    handleUpdate(updated);
  };

  // 4. Amostral handlers
  const handleAddAmostral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAmostralCaract) return;
    const check = {
      id: Date.now(),
      caracteristica: novoAmostralCaract,
      amostra: novoAmostralVis || 'Chassi Amostral',
      status: 'OK' as const,
      data: new Date().toLocaleDateString('pt-BR'),
      vis: novoAmostralVis || 'VIS-9BD'
    };
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        amostralChecks: [...pdtData.totemData.amostralChecks, check]
      }
    };
    handleUpdate(updated);
    setNovoAmostralCaract('');
    setNovoAmostralVis('');
  };

  const handleDeleteAmostral = (id: number) => {
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        amostralChecks: pdtData.totemData.amostralChecks.filter(c => c.id !== id)
      }
    };
    handleUpdate(updated);
  };

  // 5. Red Hat / Poka Yoke handlers
  const handleAddPoka = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPokaDispositivo) return;
    const teste = {
      id: Date.now(),
      dispositivo: novoPokaDispositivo,
      anomaliaProvocada: novoPokaAnomalia || 'Simulação de anomalia',
      resultado: 'APROVADO' as const,
      data: new Date().toLocaleDateString('pt-BR'),
      operador: pdtData.operadorAtual || 'Operador Titular'
    };
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        pokaYokeTestes: [...pdtData.totemData.pokaYokeTestes, teste]
      }
    };
    handleUpdate(updated);
    setNovoPokaDispositivo('');
    setNovoPokaAnomalia('');
  };

  // 6. Ferramenta handlers
  const handleAddFerramenta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaFerramentaNome) return;
    const ferr = {
      id: Date.now(),
      codigoPatrimonio: novaFerramentaPatr || `PAT-${Math.floor(10000 + Math.random() * 90000)}`,
      nome: novaFerramentaNome,
      tipo: novaFerramentaTipo || 'Mecânica / Elétrica',
      statusCalibracao: 'CALIBRADO' as const,
      validade: '31/12/2026'
    };
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        ferramentas: [...pdtData.totemData.ferramentas, ferr]
      }
    };
    handleUpdate(updated);
    setNovaFerramentaNome('');
    setNovaFerramentaPatr('');
    setNovaFerramentaTipo('');
  };

  const handleDeleteFerramenta = (id: number) => {
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        ferramentas: pdtData.totemData.ferramentas.filter(f => f.id !== id)
      }
    };
    handleUpdate(updated);
  };

  // 7. Operações handlers
  const handleAddOperacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaOpNome) return;
    const op = {
      id: Date.now(),
      codigo: novaOpCodigo || `${pdtData.codigo}-0${pdtData.totemData.operacoes.length + 1}`,
      nome: novaOpNome,
      tempoCiclo: Number(novaOpCiclo) || 20,
      tempoVA: Math.round(Number(novaOpCiclo) * 0.8),
      tempoNVA: Math.round(Number(novaOpCiclo) * 0.2),
      sequencia: pdtData.totemData.operacoes.length + 1
    };
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        operacoes: [...pdtData.totemData.operacoes, op]
      }
    };
    handleUpdate(updated);
    setNovaOpNome('');
    setNovaOpCodigo('');
    setNovaOpCiclo(20);
  };

  const handleDeleteOperacao = (id: number) => {
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        operacoes: pdtData.totemData.operacoes.filter(o => o.id !== id)
      }
    };
    handleUpdate(updated);
  };

  // 8. Operadores handlers
  const handleAddOperador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoOpNome) return;
    const op = {
      matricula: novoOpMatricula || `ST${Math.floor(10000 + Math.random() * 90000)}`,
      nome: novoOpNome,
      turno: novoOpTurno,
      funcao: 'Operador de Montagem',
      status: 'PRESENTE' as const
    };
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        operadoresAlocados: [...pdtData.totemData.operadoresAlocados, op]
      }
    };
    handleUpdate(updated);
    setNovoOpNome('');
    setNovoOpMatricula('');
  };

  const handleDeleteOperador = (matricula: string) => {
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        operadoresAlocados: pdtData.totemData.operadoresAlocados.filter(o => o.matricula !== matricula)
      }
    };
    handleUpdate(updated);
  };

  // 9. Briefing handlers
  const handleAddBriefing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPontoBriefing) return;
    const updated = {
      ...pdtData,
      totemData: {
        ...pdtData.totemData,
        pautaBriefing: [...pdtData.totemData.pautaBriefing, novoPontoBriefing]
      }
    };
    handleUpdate(updated);
    setNovoPontoBriefing('');
  };

  const tabsConfig = [
    { id: 'GEMBA', label: 'Gemba Walk', icon: 'fa-shoe-prints' },
    { id: 'A1', label: 'Folha A1', icon: 'fa-map' },
    { id: 'BRIEFING', label: 'Briefing', icon: 'fa-bullhorn' },
    { id: 'LAP', label: 'Ações LAP', icon: 'fa-list-check' },
    { id: 'ROTINA', label: 'Rotinas de Turno', icon: 'fa-arrows-rotate' },
    { id: 'AMOSTRAL', label: 'Controle BP8/BP9', icon: 'fa-clipboard-check' },
    { id: 'RED_HAT', label: 'Red Hat / Poka-Yoke', icon: 'fa-bug' },
    { id: 'SWA', label: 'Auditorias SWA', icon: 'fa-magnifying-glass' },
    { id: 'POLIVALENCIA', label: 'Polivalência (331)', icon: 'fa-graduation-cap' },
    { id: 'FERRAMENTAL', label: 'Ferramental / Patrimônio', icon: 'fa-toolbox' },
    { id: 'OPERACOES', label: 'Postos & Operações', icon: 'fa-gears' },
    { id: 'CICLOS', label: 'Ciclos Operacionais', icon: 'fa-stopwatch-20' },
    { id: 'OPERADORES', label: 'Operadores', icon: 'fa-users' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabeçalho do Totem do PDT */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-lg shadow-lg border ${
              pdtData.status === 'ATIVO' ? 'bg-emerald-600 text-white border-emerald-400' :
              pdtData.status === 'COM_PENDENCIA' ? 'bg-amber-500 text-slate-950 border-amber-300' :
              pdtData.status === 'CRITICO' ? 'bg-red-600 text-white border-red-400' :
              'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {pdtData.numero}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded border border-sky-500/40">
                  {pdtData.id} • LINHA {pdtData.linha}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Área: <strong className="text-slate-200">{pdtData.area}</strong>
                </span>
              </div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>{pdtData.codigo}: {pdtData.nome}</span>
              </h2>
            </div>
          </div>

          {/* Ações e Status Rápido */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs font-mono">
              <span className="text-[10px] text-slate-400 mr-2 uppercase pl-1">Status:</span>
              <select
                value={pdtData.status}
                onChange={e => handleStatusChange(e.target.value as PdtStatus)}
                className="bg-slate-950 text-white font-bold rounded px-2 py-1 border border-slate-700 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ATIVO">🟢 ATIVO</option>
                <option value="COM_PENDENCIA">🟡 COM PENDÊNCIA</option>
                <option value="CRITICO">🔴 CRÍTICO / PARADA</option>
                <option value="SEM_TOTEM">⚪ SEM TOTEM</option>
              </select>
            </div>

            <button
              onClick={() => setEditPdtInfo(!editPdtInfo)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer transition"
              title="Editar configurações do PDT no mapa"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              <span>{editPdtInfo ? 'Fechar Edição' : 'Editar PDT'}</span>
            </button>

            {onDeletePdt && (
              <button
                onClick={() => {
                  if (window.confirm(`Tem certeza que deseja excluir o PDT ${pdtData.id} do mapa?`)) {
                    onDeletePdt(pdtData.id);
                    onClose();
                  }
                }}
                className="px-2.5 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-xs font-bold border border-red-500/40 cursor-pointer transition"
                title="Excluir este PDT do mapa"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm border border-slate-700 cursor-pointer transition"
              title="Fechar painel do Totem"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Formulário Colapsável de Edição Geral do PDT */}
        {editPdtInfo && (
          <div className="bg-slate-950/90 p-4 border-b border-slate-800 text-xs space-y-3 animate-in slide-in-from-top-2 duration-150">
            <h4 className="font-bold text-sky-400 font-mono uppercase flex items-center gap-2">
              <i className="fa-solid fa-sliders"></i> Dados Gerais do Posto de Trabalho (PDT)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">Nome do Posto:</label>
                <input
                  type="text"
                  value={pdtData.nome}
                  onChange={e => handleUpdate({ ...pdtData, nome: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">Team Leader Responsável:</label>
                <input
                  type="text"
                  value={pdtData.teamLeaderNome}
                  onChange={e => handleUpdate({ ...pdtData, teamLeaderNome: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">Líder do Setor:</label>
                <input
                  type="text"
                  value={pdtData.lider}
                  onChange={e => handleUpdate({ ...pdtData, lider: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">Área / Trecho:</label>
                <input
                  type="text"
                  value={pdtData.area}
                  onChange={e => handleUpdate({ ...pdtData, area: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">Tempo Ciclo Ref. (segundos):</label>
                <input
                  type="number"
                  value={pdtData.tempoCicloReferencia}
                  onChange={e => handleUpdate({ ...pdtData, tempoCicloReferencia: Number(e.target.value) || 50 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">Turno:</label>
                <select
                  value={pdtData.shift}
                  onChange={e => handleUpdate({ ...pdtData, shift: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                >
                  <option value="1º TURNO">1º TURNO</option>
                  <option value="2º TURNO">2º TURNO</option>
                  <option value="3º TURNO">3º TURNO</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">Posição no Mapa X:</label>
                <input
                  type="number"
                  value={pdtData.x}
                  onChange={e => handleUpdate({ ...pdtData, x: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">Posição no Mapa Y:</label>
                <input
                  type="number"
                  value={pdtData.y}
                  onChange={e => handleUpdate({ ...pdtData, y: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Abas de Navegação do Totem */}
        <div className="bg-slate-950 border-b border-slate-800 px-3 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
          {tabsConfig.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer ${
                  isActive
                    ? 'border-sky-500 text-sky-400 bg-sky-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <i className={`fa-solid ${tab.icon} ${isActive ? 'text-sky-400' : 'text-slate-500'}`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo Dinâmico das 13 Abas */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          
          {/* 1. ABA: GEMBA WALK */}
          {activeTab === 'GEMBA' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-shoe-prints text-sky-400"></i> Auditoria de Posto Gemba Walk (FCI_SA_008)
                  </h3>
                  <p className="text-xs text-slate-400">Verificações de conformidade técnica e voz do processo no posto</p>
                </div>
              </div>

              {/* Form Adicionar */}
              <form onSubmit={handleAddGemba} className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Novo parâmetro ou verificação técnica..."
                  value={novoGembaParam}
                  onChange={e => setNovoGembaParam(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs col-span-2"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Valor esperado..."
                    value={novoGembaValor}
                    onChange={e => setNovoGembaValor(e.target.value)}
                    className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs flex-1"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold cursor-pointer whitespace-nowrap">
                    + Adicionar
                  </button>
                </div>
              </form>

              {/* Lista */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-300 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Item / Parâmetro de Processo</th>
                      <th className="p-2.5">Medição / Valor</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Data</th>
                      <th className="p-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                    {pdtData.totemData.gembaItens.map(g => (
                      <tr key={g.id} className="hover:bg-slate-900/50">
                        <td className="p-2.5 font-bold text-white">{g.parametro}</td>
                        <td className="p-2.5 text-slate-300">{g.valor}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            {g.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">{g.data}</td>
                        <td className="p-2.5 text-right">
                          <button onClick={() => handleDeleteGemba(g.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. ABA: FOLHA A1 */}
          {activeTab === 'A1' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-map text-sky-400"></i> Indicadores da Folha A1 do Posto {pdtData.codigo}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Segurança (Desvios):</span>
                  <div className="text-2xl font-black text-emerald-400">{pdtData.totemData.kpisSeguranca.valor}</div>
                  <span className="text-xs text-slate-400">Meta: {pdtData.totemData.kpisSeguranca.meta} Acidentes</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Qualidade (Conformidade):</span>
                  <div className="text-2xl font-black text-sky-400">{pdtData.totemData.kpisQualidade.valor}%</div>
                  <span className="text-xs text-slate-400">Meta: {pdtData.totemData.kpisQualidade.meta}%</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">OPE Operacional:</span>
                  <div className="text-2xl font-black text-amber-300">{pdtData.totemData.kpisOpe.valor}</div>
                  <span className="text-xs text-slate-400">Meta: {pdtData.totemData.kpisOpe.meta}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. ABA: BRIEFING */}
          {activeTab === 'BRIEFING' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-bullhorn text-amber-400"></i> Pauta de Briefing do Turno
              </h3>
              <form onSubmit={handleAddBriefing} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicionar novo ponto de pauta ou comunicado..."
                  value={novoPontoBriefing}
                  onChange={e => setNovoPontoBriefing(e.target.value)}
                  className="bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white text-xs flex-1"
                />
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold cursor-pointer">
                  + Adicionar Pauta
                </button>
              </form>
              <div className="space-y-2">
                {pdtData.totemData.pautaBriefing.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-sky-400 text-[10px]"></i>
                      {item}
                    </span>
                    <button
                      onClick={() => {
                        const updated = {
                          ...pdtData,
                          totemData: {
                            ...pdtData.totemData,
                            pautaBriefing: pdtData.totemData.pautaBriefing.filter((_, i) => i !== idx)
                          }
                        };
                        handleUpdate(updated);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ABA: AÇÕES LAP */}
          {activeTab === 'LAP' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-list-check text-sky-400"></i> Quadro Kanban de Ações LAP do Posto
              </h3>
              <form onSubmit={handleAddLap} className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Descrição da ação de melhoria..."
                  value={novaLapAcao}
                  onChange={e => setNovaLapAcao(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white col-span-2"
                />
                <input
                  type="text"
                  placeholder="Responsável..."
                  value={novaLapResp}
                  onChange={e => setNovaLapResp(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white"
                />
                <button type="submit" className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold cursor-pointer">
                  + Criar Ação LAP
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['TODO', 'DOING', 'DONE'] as const).map(colStatus => (
                  <div key={colStatus} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-xs font-mono uppercase text-slate-300 pb-1 border-b border-slate-800">
                      {colStatus === 'TODO' ? '📋 A Fazer' : colStatus === 'DOING' ? '⏳ Em Andamento' : '✅ Concluído'}
                    </h4>
                    <div className="space-y-2">
                      {pdtData.totemData.lapAcoes.filter(a => a.status === colStatus).map(acao => (
                        <div key={acao.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-700/80 text-xs space-y-1">
                          <strong className="text-white block">{acao.titulo}</strong>
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Resp: {acao.responsavel}</span>
                            <span>Prazo: {acao.prazo}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[10px]">
                            <div className="flex gap-1">
                              {colStatus !== 'TODO' && (
                                <button onClick={() => handleMoveLap(acao.id, 'TODO')} className="text-slate-400 hover:text-white cursor-pointer">◀</button>
                              )}
                              {colStatus !== 'DOING' && (
                                <button onClick={() => handleMoveLap(acao.id, 'DOING')} className="text-amber-300 hover:text-white cursor-pointer">▶</button>
                              )}
                              {colStatus !== 'DONE' && (
                                <button onClick={() => handleMoveLap(acao.id, 'DONE')} className="text-emerald-400 hover:text-white cursor-pointer">✔</button>
                              )}
                            </div>
                            <button onClick={() => handleDeleteLap(acao.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ABA: ROTINAS DE TURNO */}
          {activeTab === 'ROTINA' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-arrows-rotate text-sky-400"></i> Rotina Operacional do Posto
              </h3>
              <form onSubmit={handleAddRotina} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Horário (ex: 09:30)"
                  value={novaRotinaHora}
                  onChange={e => setNovaRotinaHora(e.target.value)}
                  className="bg-slate-950 border border-slate-700 px-3 py-1.5 rounded text-white text-xs w-32 font-mono"
                />
                <input
                  type="text"
                  placeholder="Atividade ou checklist de rotina..."
                  value={novaRotinaAtiv}
                  onChange={e => setNovaRotinaAtiv(e.target.value)}
                  className="bg-slate-950 border border-slate-700 px-3 py-1.5 rounded text-white text-xs flex-1"
                />
                <button type="submit" className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold cursor-pointer">
                  + Adicionar
                </button>
              </form>
              <div className="space-y-2">
                {pdtData.totemData.rotinasTurno.map(rot => (
                  <div key={rot.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {rot.horario}
                      </span>
                      <strong className="text-white">{rot.atividade}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {rot.status}
                      </span>
                      <button onClick={() => handleDeleteRotina(rot.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. ABA: CONTROLE AMOSTRAL BP8/BP9 */}
          {activeTab === 'AMOSTRAL' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-clipboard-check text-sky-400"></i> Controle Amostral (BP8) & Medidas Conservatórias (BP9)
              </h3>
              <form onSubmit={handleAddAmostral} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Característica inspecionada (ex: Torque Parafuso M10)..."
                  value={novoAmostralCaract}
                  onChange={e => setNovoAmostralCaract(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs flex-1"
                />
                <input
                  type="text"
                  placeholder="Chassi / Amostra..."
                  value={novoAmostralVis}
                  onChange={e => setNovoAmostralVis(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs w-44 font-mono"
                />
                <button type="submit" className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold cursor-pointer">
                  + Registrar Inspeção
                </button>
              </form>
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-300 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Característica / Item</th>
                      <th className="p-2.5">Chassi / VIS</th>
                      <th className="p-2.5">Resultado</th>
                      <th className="p-2.5">Data / Hora</th>
                      <th className="p-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                    {pdtData.totemData.amostralChecks.map(c => (
                      <tr key={c.id} className="hover:bg-slate-900/50">
                        <td className="p-2.5 font-bold text-white">{c.caracteristica}</td>
                        <td className="p-2.5 text-slate-300">{c.amostra}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            {c.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">{c.data}</td>
                        <td className="p-2.5 text-right">
                          <button onClick={() => handleDeleteAmostral(c.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. ABA: RED HAT / POKA-YOKE */}
          {activeTab === 'RED_HAT' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-bug text-red-400"></i> Testes de Poka-Yoke & Dispositivos à Prova de Erro
              </h3>
              <form onSubmit={handleAddPoka} className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nome do dispositivo Poka-Yoke..."
                  value={novoPokaDispositivo}
                  onChange={e => setNovoPokaDispositivo(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs col-span-2"
                />
                <button type="submit" className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold cursor-pointer">
                  + Registrar Teste
                </button>
              </form>
              <div className="space-y-2">
                {pdtData.totemData.pokaYokeTestes.map(t => (
                  <div key={t.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <strong className="text-white block">{t.dispositivo}</strong>
                      <span className="text-slate-400 text-[10px]">Anomalia testada: {t.anomaliaProvocada}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                        {t.resultado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. ABA: SWA AUDITORIAS */}
          {activeTab === 'SWA' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-magnifying-glass text-sky-400"></i> Auditoria de Segurança & Ergonomia SWA
              </h3>
              <div className="space-y-2">
                {pdtData.totemData.swaItens.map(s => (
                  <div key={s.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-white">{s.pergunta}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                      CONFORME
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. ABA: POLIVALÊNCIA 331 */}
          {activeTab === 'POLIVALENCIA' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-sky-400"></i> Matriz de Polivalência 331 no Posto {pdtData.codigo}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {pdtData.totemData.polivalenciaOperadores.map(op => (
                  <div key={op.matricula} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400">{op.matricula}</span>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        op.nivel === 3 ? 'bg-emerald-500 text-white' :
                        op.nivel === 2 ? 'bg-sky-500 text-white' :
                        op.nivel === 1 ? 'bg-amber-500 text-slate-950' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {op.nivel}
                      </span>
                    </div>
                    <strong className="text-xs text-white block truncate">{op.nome}</strong>
                    <span className="text-[10px] text-slate-500 font-mono block">{op.turno}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. ABA: FERRAMENTAL E PATRIMÔNIO */}
          {activeTab === 'FERRAMENTAL' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-toolbox text-amber-400"></i> Ferramental Crítico & Gestão de Patrimônio
              </h3>
              <form onSubmit={handleAddFerramenta} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Nome do dispositivo / ferramenta..."
                  value={novaFerramentaNome}
                  onChange={e => setNovaFerramentaNome(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs flex-1"
                />
                <input
                  type="text"
                  placeholder="Patrimônio (ex: PAT-12005)..."
                  value={novaFerramentaPatr}
                  onChange={e => setNovaFerramentaPatr(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs w-48 font-mono"
                />
                <button type="submit" className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold cursor-pointer">
                  + Cadastrar
                </button>
              </form>
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-300 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Código Patrimônio</th>
                      <th className="p-2.5">Equipamento / Ferramenta</th>
                      <th className="p-2.5">Tipo</th>
                      <th className="p-2.5">Status Calibração</th>
                      <th className="p-2.5">Validade</th>
                      <th className="p-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                    {pdtData.totemData.ferramentas.map(f => (
                      <tr key={f.id} className="hover:bg-slate-900/50">
                        <td className="p-2.5 font-bold text-amber-300">{f.codigoPatrimonio}</td>
                        <td className="p-2.5 text-white font-bold">{f.nome}</td>
                        <td className="p-2.5 text-slate-400">{f.tipo}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            {f.statusCalibracao}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">{f.validade}</td>
                        <td className="p-2.5 text-right">
                          <button onClick={() => handleDeleteFerramenta(f.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 11. ABA: POSTOS E OPERAÇÕES */}
          {activeTab === 'OPERACOES' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-gears text-sky-400"></i> Operações Industriais Vinculadas ao Posto
              </h3>
              <form onSubmit={handleAddOperacao} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Nome da operação..."
                  value={novaOpNome}
                  onChange={e => setNovaOpNome(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs flex-1"
                />
                <input
                  type="number"
                  placeholder="Ciclo (s)"
                  value={novaOpCiclo}
                  onChange={e => setNovaOpCiclo(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs w-28 font-mono"
                />
                <button type="submit" className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold cursor-pointer">
                  + Adicionar Operação
                </button>
              </form>
              <div className="space-y-2">
                {pdtData.totemData.operacoes.map(op => (
                  <div key={op.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                          {op.codigo}
                        </span>
                        <strong className="text-white">{op.nome}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        Ciclo: {op.tempoCiclo}s (VA: {op.tempoVA}s | NVA: {op.tempoNVA}s)
                      </div>
                    </div>
                    <button onClick={() => handleDeleteOperacao(op.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. ABA: CICLOS */}
          {activeTab === 'CICLOS' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-stopwatch-20 text-sky-400"></i> Análise de Tempos de Ciclo (Yamazumi SWK)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Tempo de Ciclo Real:</span>
                  <div className="text-2xl font-black text-emerald-400">{pdtData.totemData.tempoCicloReal}s</div>
                  <span className="text-xs text-slate-400">Meta TcT: ≤ {pdtData.totemData.tctAlvo}s</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Capacidade Teórica:</span>
                  <div className="text-2xl font-black text-sky-400">
                    {Math.floor(3600 / (pdtData.totemData.tempoCicloReal || 50))} vcl/h
                  </div>
                  <span className="text-xs text-slate-400">Base: 3600s ÷ Tempo de Ciclo</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Eficiência do Posto:</span>
                  <div className="text-2xl font-black text-amber-300">96.0%</div>
                  <span className="text-xs text-slate-400">Valor Agregado (VA) prevalente</span>
                </div>
              </div>
            </div>
          )}

          {/* 13. ABA: OPERADORES */}
          {activeTab === 'OPERADORES' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-users text-sky-400"></i> Operadores Alocados ao Posto {pdtData.codigo}
              </h3>
              <form onSubmit={handleAddOperador} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Nome do colaborador..."
                  value={novoOpNome}
                  onChange={e => setNovoOpNome(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs flex-1"
                />
                <input
                  type="text"
                  placeholder="Matrícula (ex: ST12345)..."
                  value={novoOpMatricula}
                  onChange={e => setNovoOpMatricula(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white text-xs w-44 font-mono"
                />
                <button type="submit" className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold cursor-pointer">
                  + Alocar Operador
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pdtData.totemData.operadoresAlocados.map(op => (
                  <div key={op.matricula} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-white block">{op.nome}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">Matrícula: {op.matricula} • {op.turno}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                        {op.status}
                      </span>
                      <button onClick={() => handleDeleteOperador(op.matricula)} className="text-red-400 hover:text-red-300 cursor-pointer">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Rodapé do Modal */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex justify-between items-center shrink-0 text-xs font-mono">
          <span className="text-slate-400">
            Posto: <strong className="text-white">{pdtData.codigo}</strong> • Totem Ativo: <strong className="text-sky-400">{pdtData.id}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shadow cursor-pointer transition"
          >
            Concluir & Voltar ao Mapa
          </button>
        </div>

      </div>
    </div>
  );
}
