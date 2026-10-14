import React, { useState } from 'react';
import { 
  LinhaCodigo, 
  UteRecord, 
  TrechoRecord, 
  DominioRecord, 
  TotemRecord, 
  AcumuloLinhaRecord, 
  MapaPdtRecord 
} from '../types/mapa';

interface GestaoHierarquiaMasterViewProps {
  utes: UteRecord[];
  trechos: TrechoRecord[];
  dominios: DominioRecord[];
  totens: TotemRecord[];
  acumulos: AcumuloLinhaRecord[];
  pdts: MapaPdtRecord[];
  onSaveUte: (ute: UteRecord) => void;
  onDeleteUte: (id: string) => void;
  onSaveTrecho: (trecho: TrechoRecord) => void;
  onDeleteTrecho: (id: string) => void;
  onSaveDominio: (dominio: DominioRecord) => void;
  onDeleteDominio: (id: string) => void;
  onSaveTotem: (totem: TotemRecord) => void;
  onDeleteTotem: (id: string) => void;
  onSaveAcumulo: (acumulo: AcumuloLinhaRecord) => void;
  onDeleteAcumulo: (id: string) => void;
  onSavePdt: (pdt: MapaPdtRecord) => void;
  onDeletePdt: (id: string) => void;
}

export function GestaoHierarquiaMasterView({
  utes,
  trechos,
  dominios,
  totens,
  acumulos,
  pdts,
  onSaveUte,
  onDeleteUte,
  onSaveTrecho,
  onDeleteTrecho,
  onSaveDominio,
  onDeleteDominio,
  onSaveTotem,
  onDeleteTotem,
  onSaveAcumulo,
  onDeleteAcumulo,
  onSavePdt,
  onDeletePdt
}: GestaoHierarquiaMasterViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'VISAO_GERAL' | 'UTES' | 'TRECHOS' | 'DOMINIOS' | 'TOTENS' | 'PDTS'>('VISAO_GERAL');
  const [filtroLinha, setFiltroLinha] = useState<LinhaCodigo>('L3');
  const [busca, setBusca] = useState('');

  // Modais de Criação / Edição
  const [modalUteOpen, setModalUteOpen] = useState(false);
  const [editingUte, setEditingUte] = useState<UteRecord | null>(null);

  const [modalTrechoOpen, setModalTrechoOpen] = useState(false);
  const [editingTrecho, setEditingTrecho] = useState<TrechoRecord | null>(null);

  const [modalDominioOpen, setModalDominioOpen] = useState(false);
  const [editingDominio, setEditingDominio] = useState<DominioRecord | null>(null);

  const [modalTotemOpen, setModalTotemOpen] = useState(false);
  const [editingTotem, setEditingTotem] = useState<TotemRecord | null>(null);

  // Filtragem conforme linha selecionada
  const filteredUtes = utes.filter(u => filtroLinha === 'GERAL' || u.linhaId === filtroLinha);
  const filteredTrechos = trechos.filter(t => filtroLinha === 'GERAL' || t.linhaId === filtroLinha);
  const filteredDominios = dominios.filter(d => filtroLinha === 'GERAL' || d.linhaId === filtroLinha);
  const filteredTotens = totens.filter(t => filtroLinha === 'GERAL' || t.linhaId === filtroLinha);
  const filteredPdts = pdts.filter(p => (filtroLinha === 'GERAL' || p.linha === filtroLinha) && (!busca || p.codigo.toLowerCase().includes(busca.toLowerCase()) || p.nome.toLowerCase().includes(busca.toLowerCase())));

  // Funções de salvamento rápido
  const handleOpenNewUte = () => {
    setEditingUte({
      id: `UTE-${filtroLinha}-${Date.now()}`,
      codigo: `UTE 0${filteredUtes.length + 1}`,
      nome: '',
      linhaId: filtroLinha === 'GERAL' ? 'L3' : filtroLinha,
      responsavelNome: '',
      corIdentificacao: '#0284c7',
      ordem: filteredUtes.length + 1,
      descricao: ''
    });
    setModalUteOpen(true);
  };

  const handleOpenNewTrecho = () => {
    setEditingTrecho({
      id: `TRECHO-${filtroLinha}-${Date.now()}`,
      codigo: `TR-0${filteredTrechos.length + 1}`,
      nome: '',
      uteId: filteredUtes[0]?.id || '',
      linhaId: filtroLinha === 'GERAL' ? 'L3' : filtroLinha,
      tipo: 'PRINCIPAL',
      isIndependente: false,
      ordem: filteredTrechos.length + 1,
      pdtInicio: 1,
      pdtFim: 10,
      totalPdts: 10,
      cor: '#0ea5e9'
    });
    setModalTrechoOpen(true);
  };

  const handleOpenNewDominio = () => {
    setEditingDominio({
      id: `DOM-${filtroLinha}-${Date.now()}`,
      codigo: `DOM-0${filteredDominios.length + 1}`,
      nome: '',
      trechoId: filteredTrechos[0]?.id || '',
      uteId: filteredUtes[0]?.id || '',
      linhaId: filtroLinha === 'GERAL' ? 'L3' : filtroLinha,
      teamLeaderNome: '',
      teamLeaderMatricula: '',
      liderNome: '',
      shift: '1º TURNO',
      totemId: `TOTEM-${filtroLinha}-${Date.now()}`,
      pdtsIds: []
    });
    setModalDominioOpen(true);
  };

  const handleOpenNewTotem = () => {
    setEditingTotem({
      id: `TOTEM-${filtroLinha}-${Date.now()}`,
      codigo: `TT-0${filteredTotens.length + 1}`,
      nome: '',
      dominioId: filteredDominios[0]?.id || '',
      linhaId: filtroLinha === 'GERAL' ? 'L3' : filtroLinha,
      status: 'ONLINE',
      ipAddress: '10.22.40.50',
      versaoApp: 'v2.8.4',
      ultimaSincronizacao: '14/10/2026'
    });
    setModalTotemOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho do Painel da Conta Máster */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-mono font-bold">
              CONTA MÁSTER STELLANTIS
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold">
              PLANTA DE BETIM
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
            <i className="fa-solid fa-sitemap text-sky-400"></i> Painel de Gestão & Editor Estrutural Hierárquico
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadeia de subordinação estrita: <strong className="text-sky-300">Linha</strong> → <strong className="text-sky-300">UTE</strong> → <strong className="text-sky-300">Trecho</strong> → <strong className="text-sky-300">Domínio</strong> → <strong className="text-sky-300">Totem (1 por domínio)</strong> → <strong className="text-sky-300">PDTs</strong>.
          </p>
        </div>

        {/* Seletor de Linha para Gestão */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-bold px-2">Linha:</span>
          {(['L3', 'L1', 'GERAL'] as LinhaCodigo[]).map(l => (
            <button
              key={l}
              onClick={() => setFiltroLinha(l)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filtroLinha === l 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {l === 'GERAL' ? 'Todas as Linhas' : l === 'L3' ? 'Linha 3 (Betim)' : 'Linha 1'}
            </button>
          ))}
        </div>
      </div>

      {/* Navegação entre Níveis da Hierarquia */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2">
        {[
          { id: 'VISAO_GERAL', label: 'Árvore Hierárquica Completa', icon: 'fa-diagram-project' },
          { id: 'UTES', label: `UTEs (${filteredUtes.length})`, icon: 'fa-cubes' },
          { id: 'TRECHOS', label: `Trechos (${filteredTrechos.length})`, icon: 'fa-route' },
          { id: 'DOMINIOS', label: `Domínios (${filteredDominios.length})`, icon: 'fa-people-roof' },
          { id: 'TOTENS', label: `Totens Digitais (${filteredTotens.length})`, icon: 'fa-tablet-screen-button' },
          { id: 'PDTS', label: `Postos (PDTs) (${filteredPdts.length})`, icon: 'fa-network-wired' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              activeSubTab === tab.id
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* 1. VISÃO GERAL: ÁRVORE HIERÁRQUICA INTERATIVA */}
      {/* ==================================================================== */}
      {activeSubTab === 'VISAO_GERAL' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">UTEs Cadastradas</span>
              <strong className="text-xl text-sky-400 font-black">{filteredUtes.length}</strong>
              <span className="text-[10px] text-slate-500 block mt-1">Unidades Técnicas Elementares</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Trechos Operacionais</span>
              <strong className="text-xl text-emerald-400 font-black">{filteredTrechos.length}</strong>
              <span className="text-[10px] text-slate-500 block mt-1">Inclui Plância & Doors no início</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Domínios & Totens</span>
              <strong className="text-xl text-amber-400 font-black">{filteredDominios.length} / {filteredTotens.length}</strong>
              <span className="text-[10px] text-slate-500 block mt-1">Regra: 1 totem por domínio</span>
            </div>
          </div>

          {/* Renderização em Cascata das UTEs e Trechos */}
          <div className="space-y-3">
            {filteredUtes.map(ute => {
              const trechosDaUte = filteredTrechos.filter(t => t.uteId === ute.id);

              return (
                <div key={ute.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
                  {/* Cabeçalho da UTE */}
                  <div className="bg-slate-850 p-3 border-b border-slate-800 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: ute.corIdentificacao }}
                      ></span>
                      <span className="bg-sky-500/20 text-sky-300 font-mono text-xs px-2 py-0.5 rounded font-bold border border-sky-500/30">
                        {ute.codigo}
                      </span>
                      <h3 className="text-sm font-bold text-white">{ute.nome}</h3>
                      <span className="text-xs text-slate-400 font-mono">({ute.linhaId})</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">
                        Supervisor: <strong className="text-sky-300">{ute.responsavelNome}</strong>
                      </span>
                      <button
                        onClick={() => { setEditingUte(ute); setModalUteOpen(true); }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold cursor-pointer"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </div>
                  </div>

                  {/* Trechos dentro da UTE */}
                  <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {trechosDaUte.map(trecho => {
                      const dominiosDoTrecho = filteredDominios.filter(d => d.trechoId === trecho.id);
                      const isIndep = trecho.isIndependente;

                      return (
                        <div 
                          key={trecho.id} 
                          className={`p-3 rounded-lg border text-xs space-y-2 ${
                            isIndep 
                              ? 'bg-cyan-950/30 border-cyan-500/40' 
                              : 'bg-slate-950/70 border-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  isIndep ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {trecho.codigo}
                                </span>
                                {isIndep && (
                                  <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-bold">
                                    INDEPENDENTE NO INÍCIO
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-white mt-1 text-sm">{trecho.nome}</h4>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              {trecho.totalPdts} PDTs
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {trecho.descricao || 'Submontagem com fluxo dedicado.'}
                          </p>

                          {/* Domínios e Totem Vinculado */}
                          <div className="pt-2 border-t border-slate-800/80 space-y-1">
                            {dominiosDoTrecho.map(dom => {
                              const totemDoDom = totens.find(t => t.id === dom.totemId);

                              return (
                                <div key={dom.id} className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                                  <div>
                                    <span className="font-bold text-sky-400">{dom.nome}</span>
                                    <div className="text-[10px] text-slate-400">
                                      TL: {dom.teamLeaderNome} | Líder: {dom.liderNome}
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                                      <i className="fa-solid fa-tablet-screen-button"></i>
                                      {totemDoDom ? totemDoDom.codigo : 'SEM TOTEM'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. TABELA DE UTEs */}
      {/* ==================================================================== */}
      {activeSubTab === 'UTES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-cubes text-sky-400"></i> Gestão de UTEs (Unidades Técnicas Elementares)
            </h3>
            <button
              onClick={handleOpenNewUte}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <i className="fa-solid fa-plus"></i> Nova UTE
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300 font-bold">
                <tr>
                  <th className="p-2.5">Código</th>
                  <th className="p-2.5">Nome da UTE</th>
                  <th className="p-2.5">Linha</th>
                  <th className="p-2.5">Supervisor Responsável</th>
                  <th className="p-2.5">Matrícula</th>
                  <th className="p-2.5">Trechos Vinculados</th>
                  <th className="p-2.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUtes.map(u => {
                  const numTrechos = trechos.filter(t => t.uteId === u.id).length;
                  return (
                    <tr key={u.id} className="hover:bg-slate-850">
                      <td className="p-2.5 font-mono font-bold text-sky-400 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: u.corIdentificacao }}></span>
                        {u.codigo}
                      </td>
                      <td className="p-2.5 font-bold text-white">{u.nome}</td>
                      <td className="p-2.5 font-mono text-slate-300">{u.linhaId}</td>
                      <td className="p-2.5 text-slate-200">{u.responsavelNome}</td>
                      <td className="p-2.5 font-mono text-slate-400">{u.responsavelMatricula || '—'}</td>
                      <td className="p-2.5 text-slate-300">{numTrechos} trecho(s)</td>
                      <td className="p-2.5 text-center space-x-1.5">
                        <button
                          onClick={() => { setEditingUte(u); setModalUteOpen(true); }}
                          className="px-2 py-1 bg-slate-800 hover:bg-sky-600 text-slate-200 rounded font-bold cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDeleteUte(u.id)}
                          className="px-2 py-1 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white rounded font-bold cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. TABELA DE TRECHOS */}
      {/* ==================================================================== */}
      {activeSubTab === 'TRECHOS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-route text-sky-400"></i> Trechos de Produção
              </h3>
              <p className="text-[11px] text-slate-400">
                Trechos independentes: <strong>Plância (25 PDTs)</strong> e <strong>Doors (22 PDTs)</strong> configurados antes da sequência principal.
              </p>
            </div>
            <button
              onClick={handleOpenNewTrecho}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <i className="fa-solid fa-plus"></i> Novo Trecho
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300 font-bold">
                <tr>
                  <th className="p-2.5">Código</th>
                  <th className="p-2.5">Nome do Trecho</th>
                  <th className="p-2.5">Tipo</th>
                  <th className="p-2.5">Linha / UTE</th>
                  <th className="p-2.5">Faixa PDTs</th>
                  <th className="p-2.5">Total PDTs</th>
                  <th className="p-2.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTrechos.map(t => {
                  const utePai = utes.find(u => u.id === t.uteId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-850">
                      <td className="p-2.5 font-mono font-bold text-sky-400">{t.codigo}</td>
                      <td className="p-2.5 font-bold text-white">
                        {t.nome}
                        {t.isIndependente && (
                          <span className="ml-2 bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                            Independente
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-300 font-mono">{t.tipo}</td>
                      <td className="p-2.5 text-slate-300">{t.linhaId} / {utePai ? utePai.codigo : '—'}</td>
                      <td className="p-2.5 font-mono text-slate-400">
                        {t.isIndependente ? `1 a ${t.totalPdts} (Fixo)` : `${t.pdtInicio} a ${t.pdtFim}`}
                      </td>
                      <td className="p-2.5 font-bold text-amber-400 font-mono">{t.totalPdts}</td>
                      <td className="p-2.5 text-center space-x-1.5">
                        <button
                          onClick={() => { setEditingTrecho(t); setModalTrechoOpen(true); }}
                          className="px-2 py-1 bg-slate-800 hover:bg-sky-600 text-slate-200 rounded font-bold cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDeleteTrecho(t.id)}
                          className="px-2 py-1 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white rounded font-bold cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. TABELA DE DOMÍNIOS & TOTENS (Regra: 1 totem por domínio) */}
      {/* ==================================================================== */}
      {activeSubTab === 'DOMINIOS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-people-roof text-sky-400"></i> Domínios Operacionais
              </h3>
              <p className="text-[11px] text-slate-400">
                Regra obrigatória: cada domínio possui estritamente <strong>1 Totem Digital</strong> e gerencia seus PDTs vinculados.
              </p>
            </div>
            <button
              onClick={handleOpenNewDominio}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <i className="fa-solid fa-plus"></i> Novo Domínio
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300 font-bold">
                <tr>
                  <th className="p-2.5">Código</th>
                  <th className="p-2.5">Nome do Domínio</th>
                  <th className="p-2.5">Trecho Vinculado</th>
                  <th className="p-2.5">Totem Alocado</th>
                  <th className="p-2.5">Team Leader</th>
                  <th className="p-2.5">Líder</th>
                  <th className="p-2.5">Turno</th>
                  <th className="p-2.5">Qtd PDTs</th>
                  <th className="p-2.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDominios.map(d => {
                  const totem = totens.find(t => t.id === d.totemId);
                  const trecho = trechos.find(t => t.id === d.trechoId);

                  return (
                    <tr key={d.id} className="hover:bg-slate-850">
                      <td className="p-2.5 font-mono font-bold text-sky-400">{d.codigo}</td>
                      <td className="p-2.5 font-bold text-white">{d.nome}</td>
                      <td className="p-2.5 text-slate-300">{trecho ? trecho.nome : '—'}</td>
                      <td className="p-2.5">
                        <span className="bg-sky-500/20 text-sky-300 font-mono px-2 py-0.5 rounded font-bold border border-sky-500/30">
                          {totem ? `${totem.codigo} - ${totem.nome}` : 'SEM TOTEM'}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-200">{d.teamLeaderNome}</td>
                      <td className="p-2.5 text-slate-300">{d.liderNome}</td>
                      <td className="p-2.5 font-mono text-slate-400">{d.shift}</td>
                      <td className="p-2.5 font-bold text-amber-400 font-mono">{d.pdtsIds.length}</td>
                      <td className="p-2.5 text-center space-x-1.5">
                        <button
                          onClick={() => { setEditingDominio(d); setModalDominioOpen(true); }}
                          className="px-2 py-1 bg-slate-800 hover:bg-sky-600 text-slate-200 rounded font-bold cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDeleteDominio(d.id)}
                          className="px-2 py-1 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white rounded font-bold cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. TABELA DE TOTENS DIGITAIS */}
      {/* ==================================================================== */}
      {activeSubTab === 'TOTENS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-tablet-screen-button text-sky-400"></i> Totens Digitais Operacionais
            </h3>
            <button
              onClick={handleOpenNewTotem}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <i className="fa-solid fa-plus"></i> Novo Totem
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300 font-bold">
                <tr>
                  <th className="p-2.5">Código</th>
                  <th className="p-2.5">Nome do Totem</th>
                  <th className="p-2.5">Linha</th>
                  <th className="p-2.5">Domínio Associado</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">IP Address</th>
                  <th className="p-2.5">Versão SIS</th>
                  <th className="p-2.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTotens.map(t => {
                  const dom = dominios.find(d => d.id === t.dominioId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-850">
                      <td className="p-2.5 font-mono font-bold text-sky-400">{t.codigo}</td>
                      <td className="p-2.5 font-bold text-white">{t.nome}</td>
                      <td className="p-2.5 font-mono text-slate-300">{t.linhaId}</td>
                      <td className="p-2.5 text-slate-300">{dom ? dom.nome : '—'}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          t.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono text-slate-400">{t.ipAddress || 'DHCP'}</td>
                      <td className="p-2.5 font-mono text-slate-300">{t.versaoApp}</td>
                      <td className="p-2.5 text-center space-x-1.5">
                        <button
                          onClick={() => { setEditingTotem(t); setModalTotemOpen(true); }}
                          className="px-2 py-1 bg-slate-800 hover:bg-sky-600 text-slate-200 rounded font-bold cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDeleteTotem(t.id)}
                          className="px-2 py-1 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white rounded font-bold cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* ==================================================================== */}
      {/* 7. TABELA DE PDTs (Com busca e vinculação) */}
      {/* ==================================================================== */}
      {activeSubTab === 'PDTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-network-wired text-sky-400"></i> PDTs Cadastrados na Hierarquia
              </h3>
              <p className="text-[11px] text-slate-400">
                Visualização e vinculação direta dos postos de trabalho aos domínios e trechos.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Filtrar código ou nome..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full md:w-60"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300 font-bold sticky top-0 z-10">
                <tr>
                  <th className="p-2.5">ID Único</th>
                  <th className="p-2.5">Código</th>
                  <th className="p-2.5">Nome do Posto</th>
                  <th className="p-2.5">Linha</th>
                  <th className="p-2.5">Trecho</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Team Leader</th>
                  <th className="p-2.5">Ciclo Alvo</th>
                  <th className="p-2.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPdts.slice(0, 100).map(p => (
                  <tr key={p.id} className="hover:bg-slate-850">
                    <td className="p-2.5 font-mono text-slate-400">{p.id}</td>
                    <td className="p-2.5 font-mono font-bold text-sky-400">{p.codigo}</td>
                    <td className="p-2.5 font-bold text-white">
                      {p.nome}
                      {p.isTrechoIndependente && (
                        <span className="ml-1.5 text-[9px] bg-cyan-500/20 text-cyan-300 px-1 py-0.2 rounded font-mono font-bold">
                          {p.trechoTipo}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 font-mono text-slate-300">{p.linha}</td>
                    <td className="p-2.5 text-slate-300">{p.area}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        p.status === 'ATIVO' ? 'bg-emerald-500/20 text-emerald-400' :
                        p.status === 'COM_PENDENCIA' ? 'bg-amber-500/20 text-amber-300' :
                        p.status === 'CRITICO' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-200">{p.teamLeaderNome}</td>
                    <td className="p-2.5 font-mono text-slate-400">{p.tempoCicloReferencia}s</td>
                    <td className="p-2.5 text-center space-x-1.5">
                      <button
                        onClick={() => onDeletePdt(p.id)}
                        className="px-2 py-1 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white rounded font-bold cursor-pointer"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: EDITAR / CRIAR UTE */}
      {/* ==================================================================== */}
      {modalUteOpen && editingUte && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-cubes text-sky-400"></i>
                {editingUte.id.includes(String(Date.now()).slice(0, 5)) ? 'Cadastrar Nova UTE' : 'Editar UTE'}
              </h3>
              <button onClick={() => setModalUteOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Código da UTE:</label>
                <input
                  type="text"
                  value={editingUte.codigo}
                  onChange={e => setEditingUte({ ...editingUte, codigo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nome Completo da UTE:</label>
                <input
                  type="text"
                  value={editingUte.nome}
                  onChange={e => setEditingUte({ ...editingUte, nome: e.target.value })}
                  placeholder="Ex: UTE Montagem Inicial L3"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Linha:</label>
                  <select
                    value={editingUte.linhaId}
                    onChange={e => setEditingUte({ ...editingUte, linhaId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    <option value="L3">Linha 3 (Betim)</option>
                    <option value="L1">Linha 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cor Identificação:</label>
                  <input
                    type="color"
                    value={editingUte.corIdentificacao}
                    onChange={e => setEditingUte({ ...editingUte, corIdentificacao: e.target.value })}
                    className="w-full h-9 bg-slate-950 border border-slate-700 rounded p-1 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Supervisor Responsável:</label>
                <input
                  type="text"
                  value={editingUte.responsavelNome}
                  onChange={e => setEditingUte({ ...editingUte, responsavelNome: e.target.value })}
                  placeholder="Nome do Supervisor"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalUteOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onSaveUte(editingUte);
                  setModalUteOpen(false);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold shadow cursor-pointer"
              >
                Salvar UTE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: EDITAR / CRIAR TRECHO */}
      {/* ==================================================================== */}
      {modalTrechoOpen && editingTrecho && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-route text-sky-400"></i>
                {editingTrecho.id.includes(String(Date.now()).slice(0, 5)) ? 'Cadastrar Novo Trecho' : 'Editar Trecho'}
              </h3>
              <button onClick={() => setModalTrechoOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Código do Trecho:</label>
                  <input
                    type="text"
                    value={editingTrecho.codigo}
                    onChange={e => setEditingTrecho({ ...editingTrecho, codigo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tipo de Trecho:</label>
                  <select
                    value={editingTrecho.tipo}
                    onChange={e => {
                      const tipo = e.target.value as any;
                      setEditingTrecho({
                        ...editingTrecho,
                        tipo,
                        isIndependente: tipo === 'PLANCIA' || tipo === 'DOORS'
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    <option value="PRINCIPAL">Sequência Principal</option>
                    <option value="PLANCIA">Plância (Submontagem Independente)</option>
                    <option value="DOORS">Doors (Submontagem Independente)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nome do Trecho:</label>
                <input
                  type="text"
                  value={editingTrecho.nome}
                  onChange={e => setEditingTrecho({ ...editingTrecho, nome: e.target.value })}
                  placeholder="Ex: Big Swivel (1–12)"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">UTE Vinculada:</label>
                  <select
                    value={editingTrecho.uteId}
                    onChange={e => setEditingTrecho({ ...editingTrecho, uteId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    {filteredUtes.map(u => (
                      <option key={u.id} value={u.id}>{u.codigo} - {u.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Total de PDTs:</label>
                  <input
                    type="number"
                    value={editingTrecho.totalPdts}
                    onChange={e => setEditingTrecho({ ...editingTrecho, totalPdts: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalTrechoOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onSaveTrecho(editingTrecho);
                  setModalTrechoOpen(false);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold shadow cursor-pointer"
              >
                Salvar Trecho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: EDITAR / CRIAR DOMÍNIO */}
      {/* ==================================================================== */}
      {modalDominioOpen && editingDominio && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-people-roof text-sky-400"></i>
                {editingDominio.id.includes(String(Date.now()).slice(0, 5)) ? 'Cadastrar Novo Domínio' : 'Editar Domínio'}
              </h3>
              <button onClick={() => setModalDominioOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nome do Domínio:</label>
                <input
                  type="text"
                  value={editingDominio.nome}
                  onChange={e => setEditingDominio({ ...editingDominio, nome: e.target.value })}
                  placeholder="Ex: Domínio Trim L3"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Trecho Associado:</label>
                  <select
                    value={editingDominio.trechoId}
                    onChange={e => setEditingDominio({ ...editingDominio, trechoId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    {filteredTrechos.map(t => (
                      <option key={t.id} value={t.id}>{t.codigo} - {t.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Turno:</label>
                  <select
                    value={editingDominio.shift}
                    onChange={e => setEditingDominio({ ...editingDominio, shift: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    <option value="1º TURNO">1º TURNO</option>
                    <option value="2º TURNO">2º TURNO</option>
                    <option value="3º TURNO">3º TURNO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Team Leader Responsável:</label>
                  <input
                    type="text"
                    value={editingDominio.teamLeaderNome}
                    onChange={e => setEditingDominio({ ...editingDominio, teamLeaderNome: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Líder da Linha:</label>
                  <input
                    type="text"
                    value={editingDominio.liderNome}
                    onChange={e => setEditingDominio({ ...editingDominio, liderNome: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalDominioOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onSaveDominio(editingDominio);
                  setModalDominioOpen(false);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold shadow cursor-pointer"
              >
                Salvar Domínio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}

    </div>
  );
}
