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
      <div className="sis-bg-surface border sis-border-main p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded sis-badge-ok text-xs font-mono font-bold">
              QUALIDADE ASSEGURADA
            </span>
            <span className="text-xs sis-text-muted font-mono">FCI_QA_012</span>
          </div>
          <h2 className="text-lg font-black sis-text-primary mt-1 flex items-center gap-2">
            <i className="fa-solid fa-certificate text-emerald-500"></i> Gestão de Indicadores da Qualidade Personalizados
          </h2>
          <p className="text-xs sis-text-muted mt-0.5">
            Cadastre novos KPIs customizados por linha e trecho com metas, histórico e cálculo de conformidade.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Seletor de Linha */}
          <div className="flex items-center gap-1 sis-bg-surface-elevated p-1 rounded-xl border sis-border-main">
            {(['L3', 'L1', 'GERAL'] as LinhaCodigo[]).map(l => (
              <button
                key={l}
                onClick={() => setFiltroLinha(l)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filtroLinha === l 
                    ? 'sis-btn-primary shadow-xs' 
                    : 'sis-text-muted hover:sis-text-primary'
                }`}
              >
                {l === 'GERAL' ? 'Todas' : l}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenNovo}
            className="px-3.5 py-2 sis-btn-primary rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition"
          >
            <i className="fa-solid fa-plus"></i> Novo Indicador
          </button>
        </div>
      </div>

      {/* Cartões dos Indicadores com Gráfico de Linha / Barras Simplificado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map(ind => {
          const statusBorder = ind.status === 'VERDE' 
            ? 'border-emerald-500/50' 
            : ind.status === 'AMARELO' 
            ? 'border-amber-500/50' 
            : 'border-red-500/50';

          const badgeClass = ind.status === 'VERDE'
            ? 'sis-badge-ok'
            : ind.status === 'AMARELO'
            ? 'sis-badge-warn'
            : 'sis-badge-crit';

          return (
            <div key={ind.id} className={`border rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3 sis-bg-surface ${statusBorder}`}>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold sis-bg-surface-elevated sis-text-muted px-2 py-0.5 rounded border sis-border-subtle">
                      {ind.codigo} ({ind.linhaId})
                    </span>
                    <h3 className="text-sm font-bold sis-text-primary mt-1.5">{ind.nome}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${badgeClass}`}>
                    {ind.status}
                  </span>
                </div>

                {/* Métricas Principais — Fundo Elevado Claro com Contraste Impecável */}
                <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-lg border sis-bg-surface-elevated sis-border-subtle">
                  <div>
                    <span className="text-[10px] sis-text-muted block font-bold uppercase tracking-wider">Valor Atual</span>
                    <strong className="text-xl font-black sis-text-primary font-mono tabular-nums">
                      {ind.valorAtual} <span className="text-xs sis-text-muted font-normal">{ind.unidade}</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] sis-text-muted block font-bold uppercase tracking-wider">Meta Alvo</span>
                    <strong className="text-lg font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400">
                      {ind.meta} <span className="text-xs sis-text-muted font-normal">{ind.unidade}</span>
                    </strong>
                  </div>
                </div>

                {/* Mini Gráfico de Histórico */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] sis-text-muted mb-1 font-semibold">
                    <span>Tendência Recente</span>
                    <span>Freq: {ind.frequencia}</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12 p-1.5 rounded border sis-bg-surface-elevated sis-border-subtle">
                    {(ind.historicoValores || []).map((h, idx) => {
                      const maxVal = Math.max(...ind.historicoValores.map(v => v.valor), ind.meta * 1.1) || 100;
                      const pct = Math.min(Math.max((h.valor / maxVal) * 100, 15), 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                          <div 
                            className="w-full bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 rounded-t transition" 
                            style={{ height: `${pct}%` }}
                          ></div>
                          <span className="text-[9px] sis-text-muted font-mono mt-0.5 truncate font-semibold">{h.data}</span>
                          {/* Tooltip */}
                          <div className="hidden group-hover:block absolute bottom-12 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                            {h.data}: {h.valor} {ind.unidade}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-between items-center pt-2 border-t sis-border-subtle text-xs">
                <span className="text-[11px] sis-text-muted truncate max-w-[150px] font-medium">
                  Resp: {ind.responsavel}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIndParaMedicao(ind);
                      setNovoValorMedicao(ind.valorAtual);
                      setModalMedicaoOpen(true);
                    }}
                    className="px-2.5 py-1 sis-btn-primary rounded font-bold cursor-pointer text-[11px] shadow-xs"
                    title="Registrar Nova Medição"
                  >
                    <i className="fa-solid fa-pen-nib mr-1"></i> Medir
                  </button>
                  <button
                    onClick={() => {
                      setEditingInd(ind);
                      setModalNovoOpen(true);
                    }}
                    className="px-2 py-1 sis-btn-secondary rounded font-bold cursor-pointer text-[11px]"
                    title="Configurações do Indicador"
                  >
                    <i className="fa-solid fa-gear"></i>
                  </button>
                  <button
                    onClick={() => onDeleteIndicador(ind.id)}
                    className="px-2 py-1 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white rounded font-bold cursor-pointer text-[11px] border border-red-200 dark:border-red-900 transition"
                    title="Excluir Indicador"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="sis-bg-surface border sis-border-main rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl sis-text-primary">
            <div className="flex justify-between items-center border-b sis-border-main pb-3">
              <h3 className="text-sm font-bold sis-text-primary flex items-center gap-2">
                <i className="fa-solid fa-certificate text-emerald-500"></i>
                {editingInd.id.includes(String(Date.now()).slice(0, 5)) ? 'Novo Indicador de Qualidade' : 'Editar Indicador'}
              </h3>
              <button onClick={() => setModalNovoOpen(false)} className="sis-text-muted hover:sis-text-primary cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block sis-text-secondary font-medium mb-1">Sigla / Código (ex: DPU, RFT):</label>
                  <input
                    type="text"
                    value={editingInd.codigo}
                    onChange={e => setEditingInd({ ...editingInd, codigo: e.target.value })}
                    className="w-full sis-input-bg sis-input-border sis-input-text border rounded p-2 font-mono"
                    placeholder="DPU"
                  />
                </div>
                <div>
                  <label className="block sis-text-secondary font-medium mb-1">Linha:</label>
                  <select
                    value={editingInd.linhaId}
                    onChange={e => setEditingInd({ ...editingInd, linhaId: e.target.value })}
                    className="w-full sis-input-bg sis-input-border sis-input-text border rounded p-2 font-mono cursor-pointer"
                  >
                    <option value="L3">Linha 3 (Betim)</option>
                    <option value="L1">Linha 1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block sis-text-secondary font-medium mb-1">Nome Completo do Indicador:</label>
                <input
                  type="text"
                  value={editingInd.nome}
                  onChange={e => setEditingInd({ ...editingInd, nome: e.target.value })}
                  placeholder="Ex: Defeitos por Unidade - Linha 3"
                  className="w-full sis-input-bg sis-input-border sis-input-text border rounded p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block sis-text-secondary font-medium mb-1">Unidade:</label>
                  <input
                    type="text"
                    value={editingInd.unidade}
                    onChange={e => setEditingInd({ ...editingInd, unidade: e.target.value })}
                    placeholder="%, PPM, Def/Veíc"
                    className="w-full sis-input-bg sis-input-border sis-input-text border rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block sis-text-secondary font-medium mb-1">Meta:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingInd.meta}
                    onChange={e => setEditingInd({ ...editingInd, meta: Number(e.target.value) })}
                    className="w-full sis-input-bg sis-input-border sis-input-text border rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block sis-text-secondary font-medium mb-1">Frequência:</label>
                  <select
                    value={editingInd.frequencia}
                    onChange={e => setEditingInd({ ...editingInd, frequencia: e.target.value as any })}
                    className="w-full sis-input-bg sis-input-border sis-input-text border rounded p-2 font-mono cursor-pointer"
                  >
                    <option value="TURNO">Por Turno</option>
                    <option value="DIARIO">Diário</option>
                    <option value="SEMANAL">Semanal</option>
                    <option value="MENSAL">Mensal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block sis-text-secondary font-medium mb-1">Responsável pelo Indicador:</label>
                <input
                  type="text"
                  value={editingInd.responsavel}
                  onChange={e => setEditingInd({ ...editingInd, responsavel: e.target.value })}
                  className="w-full sis-input-bg sis-input-border sis-input-text border rounded p-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t sis-border-main">
              <button
                onClick={() => setModalNovoOpen(false)}
                className="px-3 py-1.5 sis-btn-secondary rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onSaveIndicador(editingInd);
                  setModalNovoOpen(false);
                }}
                className="px-4 py-1.5 sis-btn-primary rounded text-xs font-bold shadow-xs cursor-pointer"
              >
                Salvar Indicador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Registrar Nova Medição */}
      {modalMedicaoOpen && indParaMedicao && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="sis-bg-surface border sis-border-main rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl sis-text-primary">
            <div className="flex justify-between items-center border-b sis-border-main pb-3">
              <h3 className="text-sm font-bold sis-text-primary flex items-center gap-2">
                <i className="fa-solid fa-pen-nib text-emerald-500"></i> Registrar Medição: {indParaMedicao.codigo}
              </h3>
              <button onClick={() => setModalMedicaoOpen(false)} className="sis-text-muted hover:sis-text-primary cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="sis-text-secondary">
                Indicador: <strong className="sis-text-primary">{indParaMedicao.nome}</strong> (Meta: {indParaMedicao.meta} {indParaMedicao.unidade})
              </p>

              <div>
                <label className="block sis-text-secondary font-medium mb-1">Data / Turno:</label>
                <input
                  type="text"
                  value={dataMedicao}
                  onChange={e => setDataMedicao(e.target.value)}
                  className="w-full sis-input-bg sis-input-border sis-input-text border rounded p-2 font-mono"
                  placeholder="dd/mm"
                />
              </div>

              <div>
                <label className="block sis-text-secondary font-medium mb-1">Novo Valor Apurado ({indParaMedicao.unidade}):</label>
                <input
                  type="number"
                  step="0.01"
                  value={novoValorMedicao}
                  onChange={e => setNovoValorMedicao(Number(e.target.value))}
                  className="w-full sis-input-bg sis-input-border sis-input-text border rounded p-2 font-mono text-base font-bold"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t sis-border-main">
              <button
                onClick={() => setModalMedicaoOpen(false)}
                className="px-3 py-1.5 sis-btn-secondary rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarMedicao}
                className="px-4 py-1.5 sis-btn-primary rounded text-xs font-bold shadow-xs cursor-pointer"
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
