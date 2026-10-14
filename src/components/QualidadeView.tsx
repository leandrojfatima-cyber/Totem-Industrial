import React, { useState } from 'react';
import { IndicadorQualidadeRecord, LinhaCodigo } from '../types/mapa';

interface QualidadeViewProps {
  indicadores: IndicadorQualidadeRecord[];
  onSaveIndicador: (ind: IndicadorQualidadeRecord) => void;
  onDeleteIndicador: (id: string) => void;
}

export function QualidadeView({ indicadores, onSaveIndicador, onDeleteIndicador }: QualidadeViewProps) {
  const [filtroLinha, setFiltroLinha] = useState<LinhaCodigo>('L3');
  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [editingInd, setEditingInd] = useState<IndicadorQualidadeRecord | null>(null);
  const [modalMedicaoOpen, setModalMedicaoOpen] = useState(false);
  const [indParaMedicao, setIndParaMedicao] = useState<IndicadorQualidadeRecord | null>(null);
  const [novoValorMedicao, setNovoValorMedicao] = useState<number>(0);
  const [dataMedicao, setDataMedicao] = useState<string>('14/10');

  const filtered = indicadores.filter(i => filtroLinha === 'GERAL' || i.linhaId === filtroLinha);

  const handleOpenNovo = () => {
    setEditingInd({
      id: `QUAL-${Date.now()}`,
      codigo: '',
      nome: '',
      linhaId: filtroLinha === 'GERAL' ? 'L3' : filtroLinha,
      unidade: '%',
      meta: 98.0,
      valorAtual: 98.0,
      frequencia: 'TURNO',
      status: 'VERDE',
      responsavel: 'EQUIPE DA QUALIDADE',
      ativo: true,
      historicoValores: []
    });
    setModalNovoOpen(true);
  };

  const handleSalvarMedicao = () => {
    if (!indParaMedicao) return;
    const val = Number(novoValorMedicao);
    let novoStatus: IndicadorQualidadeRecord['status'] = 'VERDE';

    // Determina status comparando com meta ou limites
    if (indParaMedicao.limiteSuperior !== undefined) {
      if (val > indParaMedicao.limiteSuperior) novoStatus = 'VERMELHO';
      else if (val > indParaMedicao.meta) novoStatus = 'AMARELO';
    } else if (indParaMedicao.limiteInferior !== undefined) {
      if (val < indParaMedicao.limiteInferior) novoStatus = 'VERMELHO';
      else if (val < indParaMedicao.meta) novoStatus = 'AMARELO';
    }

    const updated: IndicadorQualidadeRecord = {
      ...indParaMedicao,
      valorAtual: val,
      status: novoStatus,
      historicoValores: [
        ...(indParaMedicao.historicoValores || []).slice(-9),
        { data: dataMedicao, valor: val }
      ]
    };

    onSaveIndicador(updated);
    setModalMedicaoOpen(false);
    setIndParaMedicao(null);
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
              QUALIDADE ASSEGURADA
            </span>
            <span className="text-xs text-slate-400 font-mono">FCI_QA_012</span>
          </div>
          <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
            <i className="fa-solid fa-certificate text-emerald-400"></i> Gestão de Indicadores da Qualidade Personalizados
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastre novos KPIs customizados por linha e trecho com metas, histórico e cálculo de conformidade.
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
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {l === 'GERAL' ? 'Todas' : l}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenNovo}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition"
          >
            <i className="fa-solid fa-plus"></i> Novo Indicador
          </button>
        </div>
      </div>

      {/* Cartões dos Indicadores com Gráfico de Linha / Barras Simplificado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map(ind => {
          const statusBg = ind.status === 'VERDE' 
            ? 'border-emerald-500/40 bg-slate-900' 
            : ind.status === 'AMARELO' 
            ? 'border-amber-500/40 bg-slate-900' 
            : 'border-red-500/40 bg-slate-900';

          const badgeColor = ind.status === 'VERDE'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            : ind.status === 'AMARELO'
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            : 'bg-red-500/20 text-red-400 border-red-500/40';

          return (
            <div key={ind.id} className={`border rounded-xl p-4 shadow-lg flex flex-col justify-between space-y-3 ${statusBg}`}>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {ind.codigo} ({ind.linhaId})
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1.5">{ind.nome}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${badgeColor}`}>
                    {ind.status}
                  </span>
                </div>

                {/* Métricas Principais */}
                <div className="grid grid-cols-2 gap-2 mt-3 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Valor Atual</span>
                    <strong className="text-xl font-black text-white font-mono">
                      {ind.valorAtual} <span className="text-xs text-slate-400 font-normal">{ind.unidade}</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Meta Alvo</span>
                    <strong className="text-lg font-bold text-sky-400 font-mono">
                      {ind.meta} <span className="text-xs text-slate-400 font-normal">{ind.unidade}</span>
                    </strong>
                  </div>
                </div>

                {/* Mini Gráfico de Histórico */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Tendência Recente</span>
                    <span>Freq: {ind.frequencia}</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12 bg-slate-950 p-1.5 rounded border border-slate-800">
                    {(ind.historicoValores || []).map((h, idx) => {
                      const maxVal = Math.max(...ind.historicoValores.map(v => v.valor), ind.meta * 1.1) || 100;
                      const pct = Math.min(Math.max((h.valor / maxVal) * 100, 15), 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                          <div 
                            className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t transition" 
                            style={{ height: `${pct}%` }}
                          ></div>
                          <span className="text-[8px] text-slate-500 font-mono mt-0.5 truncate">{h.data}</span>
                          {/* Tooltip */}
                          <div className="hidden group-hover:block absolute bottom-12 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                            {h.data}: {h.valor} {ind.unidade}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  Resp: {ind.responsavel}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIndParaMedicao(ind);
                      setNovoValorMedicao(ind.valorAtual);
                      setModalMedicaoOpen(true);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold cursor-pointer text-[11px]"
                    title="Registrar Nova Medição"
                  >
                    <i className="fa-solid fa-pen-nib mr-1"></i> Medir
                  </button>
                  <button
                    onClick={() => {
                      setEditingInd(ind);
                      setModalNovoOpen(true);
                    }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold cursor-pointer text-[11px]"
                  >
                    <i className="fa-solid fa-gear"></i>
                  </button>
                  <button
                    onClick={() => onDeleteIndicador(ind.id)}
                    className="px-2 py-1 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white rounded font-bold cursor-pointer text-[11px]"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para Cadastrar / Editar Indicador */}
      {modalNovoOpen && editingInd && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-certificate text-emerald-400"></i>
                {editingInd.id.includes(String(Date.now()).slice(0, 5)) ? 'Novo Indicador de Qualidade' : 'Editar Indicador'}
              </h3>
              <button onClick={() => setModalNovoOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Sigla / Código (ex: DPU, RFT):</label>
                  <input
                    type="text"
                    value={editingInd.codigo}
                    onChange={e => setEditingInd({ ...editingInd, codigo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                    placeholder="DPU"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Linha:</label>
                  <select
                    value={editingInd.linhaId}
                    onChange={e => setEditingInd({ ...editingInd, linhaId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    <option value="L3">Linha 3 (Betim)</option>
                    <option value="L1">Linha 1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nome Completo do Indicador:</label>
                <input
                  type="text"
                  value={editingInd.nome}
                  onChange={e => setEditingInd({ ...editingInd, nome: e.target.value })}
                  placeholder="Ex: Defeitos por Unidade - Linha 3"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Unidade:</label>
                  <input
                    type="text"
                    value={editingInd.unidade}
                    onChange={e => setEditingInd({ ...editingInd, unidade: e.target.value })}
                    placeholder="%, PPM, Def/Veíc"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Meta:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingInd.meta}
                    onChange={e => setEditingInd({ ...editingInd, meta: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Frequência:</label>
                  <select
                    value={editingInd.frequencia}
                    onChange={e => setEditingInd({ ...editingInd, frequencia: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    <option value="TURNO">Por Turno</option>
                    <option value="DIARIO">Diário</option>
                    <option value="SEMANAL">Semanal</option>
                    <option value="MENSAL">Mensal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Responsável pelo Indicador:</label>
                <input
                  type="text"
                  value={editingInd.responsavel}
                  onChange={e => setEditingInd({ ...editingInd, responsavel: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalNovoOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onSaveIndicador(editingInd);
                  setModalNovoOpen(false);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow cursor-pointer"
              >
                Salvar Indicador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Registrar Nova Medição */}
      {modalMedicaoOpen && indParaMedicao && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-pen-nib text-emerald-400"></i> Registrar Medição: {indParaMedicao.codigo}
              </h3>
              <button onClick={() => setModalMedicaoOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Indicador: <strong className="text-white">{indParaMedicao.nome}</strong> (Meta: {indParaMedicao.meta} {indParaMedicao.unidade})
              </p>

              <div>
                <label className="block text-slate-400 mb-1">Data / Turno:</label>
                <input
                  type="text"
                  value={dataMedicao}
                  onChange={e => setDataMedicao(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  placeholder="dd/mm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Novo Valor Apurado ({indParaMedicao.unidade}):</label>
                <input
                  type="number"
                  step="0.01"
                  value={novoValorMedicao}
                  onChange={e => setNovoValorMedicao(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-base font-bold"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalMedicaoOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarMedicao}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow cursor-pointer"
              >
                Salvar Medição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
