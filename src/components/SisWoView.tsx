import React, { useState } from 'react';
import { 
  PadraoProcedimentoSis, 
  WoPadraoFundamentalItem, 
  WoPontoVermelhoRecord, 
  LinhaCodigo 
} from '../types/mapa';

interface SisWoViewProps {
  padroesSis: PadraoProcedimentoSis[];
  onSavePadrao: (padrao: PadraoProcedimentoSis) => void;
  onDeletePadrao: (id: string) => void;
  woPadroes: WoPadraoFundamentalItem[];
  onSaveWoPadrao: (item: WoPadraoFundamentalItem) => void;
  pontosVermelhos: WoPontoVermelhoRecord[];
  onSavePontoVermelho: (tag: WoPontoVermelhoRecord) => void;
  onDeletePontoVermelho: (id: string) => void;
}

export function SisWoView({
  padroesSis,
  onSavePadrao,
  onDeletePadrao,
  woPadroes,
  onSaveWoPadrao,
  pontosVermelhos,
  onSavePontoVermelho,
  onDeletePontoVermelho
}: SisWoViewProps) {
  const [activeTab, setActiveTab] = useState<'SIS_PADROES' | 'WO_FUNDAMENTAL' | 'PONTOS_VERMELHOS'>('SIS_PADROES');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroLinha, setFiltroLinha] = useState<LinhaCodigo>('L3');
  const [busca, setBusca] = useState('');

  // Modal para Novo Padrão SIS
  const [modalSisOpen, setModalSisOpen] = useState(false);
  const [editingSis, setEditingSis] = useState<PadraoProcedimentoSis | null>(null);

  // Modal para Novo Ponto Vermelho (Red Tag)
  const [modalTagOpen, setModalTagOpen] = useState(false);
  const [novaTag, setNovaTag] = useState<WoPontoVermelhoRecord>({
    id: `PV-${Date.now()}`,
    tagNumero: `TAG-RED-00${pontosVermelhos.length + 1}`,
    dataIdentificacao: '14/10/2026',
    identificadoPor: 'AVELINO DA SILVA',
    localizacao: 'L3 - Chassi PDT 87',
    itemDescricao: '',
    motivoDescarte: 'DESNECESSARIO',
    destinoProposto: 'ALMOXARIFADO',
    prazoResolucao: '18/10/2026',
    status: 'PENDENTE'
  });

  const filteredPadroes = padroesSis.filter(p => {
    const matchLinha = filtroLinha === 'GERAL' || p.linhaId === filtroLinha;
    const matchTipo = filtroTipo === 'TODOS' || p.tipo === filtroTipo;
    const matchBusca = !busca || p.titulo.toLowerCase().includes(busca.toLowerCase()) || p.codigo.toLowerCase().includes(busca.toLowerCase());
    return matchLinha && matchTipo && matchBusca;
  });

  const handleOpenNovoSis = () => {
    setEditingSis({
      id: `SIS-${Date.now()}`,
      codigo: 'SOS-L3-090',
      tipo: 'SOS',
      titulo: '',
      linhaId: filtroLinha === 'GERAL' ? 'L3' : filtroLinha,
      trechoOuPosto: 'L3 - Geral',
      revisao: 'Rev. 01',
      dataAprovacao: '14/10/2026',
      responsavelEngenharia: 'ENGENHARIA DE PROCESSO',
      descricao: '',
      passosCriticos: ['1. Posicionar componente com gabarito', '2. Aplicar torque com aperto eletrônico'],
      tempoPadraoSegundos: 45,
      itensQualidadeCriticos: ['Verificação de clique duplo'],
      itensSegurancaObrigatorios: ['Luvas PU', 'Óculos de proteção'],
      ativo: true
    });
    setModalSisOpen(true);
  };

  const handleSalvarTag = () => {
    onSavePontoVermelho(novaTag);
    setModalTagOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-mono font-bold">
              SIS — STELLANTIS INDUSTRIAL SYSTEM
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold">
              PADRÕES DE TRABALHO & WO
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
            <i className="fa-solid fa-industry text-sky-400"></i> Sistema Industrial Stellantis & Workplace Organization (WO)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organização dos padrões operacionais (SOS, JES, OPL) e padrões fundamentais do <strong>Workplace Organization (WO)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Seletor de Linha */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {(['L3', 'L1', 'GERAL'] as LinhaCodigo[]).map(l => (
              <button
                key={l}
                onClick={() => setFiltroLinha(l)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filtroLinha === l 
                    ? 'bg-sky-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {l === 'GERAL' ? 'Todas' : l}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenNovoSis}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition"
          >
            <i className="fa-solid fa-plus"></i> Novo Padrão SIS
          </button>
        </div>
      </div>

      {/* Tabs Internas: SIS Padrões, Seção Preparada WO, e Etiquetas Vermelhas */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('SIS_PADROES')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
            activeTab === 'SIS_PADROES'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <i className="fa-solid fa-file-contract"></i>
          Padrões & Procedimentos SIS ({filteredPadroes.length})
        </button>

        <button
          onClick={() => setActiveTab('WO_FUNDAMENTAL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
            activeTab === 'WO_FUNDAMENTAL'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <i className="fa-solid fa-clipboard-check"></i>
          Seção WO (Workplace Organization - 5 Pilares)
        </button>

        <button
          onClick={() => setActiveTab('PONTOS_VERMELHOS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
            activeTab === 'PONTOS_VERMELHOS'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <i className="fa-solid fa-tag"></i>
          Etiquetas Vermelhas (Red Tag) ({pontosVermelhos.length})
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 1. PADRÕES E PROCEDIMENTOS SIS (SOS, JES, OPL) */}
      {/* ==================================================================== */}
      {activeTab === 'SIS_PADROES' && (
        <div className="space-y-3">
          {/* Barra de Filtros */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-bold mr-1">Tipo:</span>
              {['TODOS', 'SOS', 'JES', 'OPL', 'PO_PADRAO_OPERACIONAL'].map(tipo => (
                <button
                  key={tipo}
                  onClick={() => setFiltroTipo(tipo)}
                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition ${
                    filtroTipo === tipo
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tipo === 'TODOS' ? 'Todos' : tipo}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Buscar por código ou título..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-xs text-white placeholder-slate-500 w-full md:w-64"
            />
          </div>

          {/* Cards dos Padrões */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPadroes.map(padrao => (
              <div key={padrao.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="bg-sky-500/20 text-sky-400 text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-sky-500/30">
                      {padrao.codigo} | {padrao.revisao}
                    </span>
                    <span className="bg-slate-800 text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {padrao.tipo}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2 leading-snug">{padrao.titulo}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{padrao.descricao}</p>

                  <div className="mt-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Posto / Local:</span>
                      <strong className="text-white">{padrao.trechoOuPosto}</strong>
                    </div>
                    {padrao.tempoPadraoSegundos && (
                      <div className="flex justify-between text-slate-400">
                        <span>Tempo Padrão:</span>
                        <strong className="text-amber-400 font-mono">{padrao.tempoPadraoSegundos}s</strong>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>Eng. Responsável:</span>
                      <span className="text-sky-300">{padrao.responsavelEngenharia}</span>
                    </div>
                  </div>

                  {/* Passos Críticos */}
                  <div className="mt-3">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Passos Críticos do Processo:</span>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      {padrao.passosCriticos.map((passo, pIdx) => (
                        <li key={pIdx} className="truncate">{passo}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Aprov: {padrao.dataAprovacao}
                  </span>
                  <div className="space-x-1.5">
                    <button
                      onClick={() => { setEditingSis(padrao); setModalSisOpen(true); }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDeletePadrao(padrao.id)}
                      className="px-2 py-1 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white rounded font-bold cursor-pointer"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. SEÇÃO PREPARADA: WORKPLACE ORGANIZATION (WO) - 5 PILARES */}
      {/* ==================================================================== */}
      {activeTab === 'WO_FUNDAMENTAL' && (
        <div className="space-y-4">
          <div className="bg-indigo-950/30 border border-indigo-500/40 p-4 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <i className="fa-solid fa-circle-check text-indigo-400"></i>
              Seção Integrada: Padrões Fundamentais do Workplace Organization (WO)
            </div>
            <p className="text-slate-300">
              Estrutura preparada para cadastrar e auditar os pilares fundamentais do WO na planta da Stellantis, garantindo excelência operacional, disciplina no posto e padrão visual impecável.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {woPadroes.map(pilar => {
              const pct = Math.round((pilar.pontuacaoAtual / pilar.pontuacaoMaxima) * 100);

              return (
                <div key={pilar.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                        {pilar.pilar}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {pilar.pontuacaoAtual} / {pilar.pontuacaoMaxima} pts ({pct}%)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-2">{pilar.titulo}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{pilar.descricao}</p>

                    <div className="mt-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                      <div className="text-slate-400">
                        <strong className="text-slate-300">Critério de Avaliação:</strong> {pilar.criterioAvaliacao}
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        <span>Área: {pilar.areaAplicacao}</span>
                        <span>Auditoria: {pilar.frequenciaAuditoria}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-400">Padrão Stellantis WO</span>
                    <button
                      onClick={() => {
                        const novaNota = window.prompt(`Atualizar pontuação de ${pilar.titulo} (Máx: ${pilar.pontuacaoMaxima}):`, String(pilar.pontuacaoAtual));
                        if (novaNota !== null) {
                          onSaveWoPadrao({ ...pilar, pontuacaoAtual: Number(novaNota) });
                        }
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold cursor-pointer"
                    >
                      Avaliar Pilar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. ETIQUETAS VERMELHAS (RED TAG / PONTO VERMELHO) */}
      {/* ==================================================================== */}
      {activeTab === 'PONTOS_VERMELHOS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-tag text-red-500"></i> Gestão de Etiquetas Vermelhas (Red Tag / Ponto Vermelho)
              </h3>
              <p className="text-[11px] text-slate-400">
                Itens desnecessários, quebrados ou obsoletos identificados nos postos para triagem e descarte conforme 1S do WO.
              </p>
            </div>
            <button
              onClick={() => setModalTagOpen(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <i className="fa-solid fa-plus"></i> Nova Etiqueta Vermelha
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300 font-bold">
                <tr>
                  <th className="p-2.5">Etiqueta</th>
                  <th className="p-2.5">Data Identificação</th>
                  <th className="p-2.5">Localização / Posto</th>
                  <th className="p-2.5">Descrição do Item</th>
                  <th className="p-2.5">Motivo do Descarte</th>
                  <th className="p-2.5">Destino Proposto</th>
                  <th className="p-2.5">Prazo Resolução</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pontosVermelhos.map(tag => (
                  <tr key={tag.id} className="hover:bg-slate-850">
                    <td className="p-2.5 font-mono font-bold text-red-400">{tag.tagNumero}</td>
                    <td className="p-2.5 font-mono text-slate-300">{tag.dataIdentificacao}</td>
                    <td className="p-2.5 font-bold text-white">{tag.localizacao}</td>
                    <td className="p-2.5 text-slate-200">{tag.itemDescricao}</td>
                    <td className="p-2.5 font-mono text-amber-300">{tag.motivoDescarte}</td>
                    <td className="p-2.5 text-sky-400">{tag.destinoProposto}</td>
                    <td className="p-2.5 font-mono text-slate-400">{tag.prazoResolucao}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        tag.status === 'DESCARTADO' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {tag.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center space-x-1.5">
                      <button
                        onClick={() => {
                          const novoStatus = tag.status === 'PENDENTE' ? 'DESCARTADO' : 'PENDENTE';
                          onSavePontoVermelho({ ...tag, status: novoStatus });
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold cursor-pointer"
                      >
                        {tag.status === 'PENDENTE' ? 'Concluir' : 'Reabrir'}
                      </button>
                      <button
                        onClick={() => onDeletePontoVermelho(tag.id)}
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

      {/* Modal para Novo Padrão SIS */}
      {modalSisOpen && editingSis && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-file-contract text-sky-400"></i> Cadastrar Padrão Operacional SIS
              </h3>
              <button onClick={() => setModalSisOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Código do Padrão:</label>
                  <input
                    type="text"
                    value={editingSis.codigo}
                    onChange={e => setEditingSis({ ...editingSis, codigo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                    placeholder="SOS-L3-090"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tipo de Documento:</label>
                  <select
                    value={editingSis.tipo}
                    onChange={e => setEditingSis({ ...editingSis, tipo: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    <option value="SOS">SOS (Standard Operation Sheet)</option>
                    <option value="JES">JES (Job Element Sheet)</option>
                    <option value="OPL">OPL (One Point Lesson)</option>
                    <option value="PO_PADRAO_OPERACIONAL">Padrão Operacional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Título do Procedimento:</label>
                <input
                  type="text"
                  value={editingSis.titulo}
                  onChange={e => setEditingSis({ ...editingSis, titulo: e.target.value })}
                  placeholder="Ex: Montagem do Coxim Dianteiro e Fixação de Chicote"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Posto / Local:</label>
                  <input
                    type="text"
                    value={editingSis.trechoOuPosto}
                    onChange={e => setEditingSis({ ...editingSis, trechoOuPosto: e.target.value })}
                    placeholder="Chassi L3 - PDT 87"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tempo Padrão (segundos):</label>
                  <input
                    type="number"
                    value={editingSis.tempoPadraoSegundos || 45}
                    onChange={e => setEditingSis({ ...editingSis, tempoPadraoSegundos: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descrição do Padrão:</label>
                <textarea
                  rows={2}
                  value={editingSis.descricao}
                  onChange={e => setEditingSis({ ...editingSis, descricao: e.target.value })}
                  placeholder="Resumo do objetivo do padrão operacional..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalSisOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onSavePadrao(editingSis);
                  setModalSisOpen(false);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold shadow cursor-pointer"
              >
                Salvar Padrão SIS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Nova Etiqueta Vermelha */}
      {modalTagOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-tag text-red-500"></i> Nova Etiqueta Vermelha (Red Tag WO)
              </h3>
              <button onClick={() => setModalTagOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nº da Etiqueta:</label>
                  <input
                    type="text"
                    value={novaTag.tagNumero}
                    onChange={e => setNovaTag({ ...novaTag, tagNumero: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Motivo do Descarte:</label>
                  <select
                    value={novaTag.motivoDescarte}
                    onChange={e => setNovaTag({ ...novaTag, motivoDescarte: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    <option value="DESNECESSARIO">Desnecessário</option>
                    <option value="OBSOLETO">Obsoleto</option>
                    <option value="QUEBRADO">Quebrado</option>
                    <option value="EXCESSO">Excesso de Estoque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Localização no Posto:</label>
                <input
                  type="text"
                  value={novaTag.localizacao}
                  onChange={e => setNovaTag({ ...novaTag, localizacao: e.target.value })}
                  placeholder="Ex: L3 - Chassi PDT 87"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descrição do Item Encontrado:</label>
                <input
                  type="text"
                  value={novaTag.itemDescricao}
                  onChange={e => setNovaTag({ ...novaTag, itemDescricao: e.target.value })}
                  placeholder="Ex: Suporte metálico oxidado sem uso"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Destino Proposto:</label>
                <select
                  value={novaTag.destinoProposto}
                  onChange={e => setNovaTag({ ...novaTag, destinoProposto: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                >
                  <option value="ALMOXARIFADO">Devolução ao Almoxarifado</option>
                  <option value="SUCATA">Descarte para Sucata</option>
                  <option value="DEVOLUCAO_FORNECEDOR">Devolução ao Fornecedor</option>
                  <option value="RECICLAGEM">Reciclagem</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalTagOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarTag}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold shadow cursor-pointer"
              >
                Fixar Etiqueta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
