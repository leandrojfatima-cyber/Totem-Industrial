import React, { useState, useMemo } from 'react';
import { OperacaoCicloRecord, PostoTrabalhoRecord, LinhaProducaoRecord } from '../types/cadastros';

interface OperacoesCiclosViewProps {
  operacoes: OperacaoCicloRecord[];
  postos: PostoTrabalhoRecord[];
  linhas: LinhaProducaoRecord[];
  initialPdtCodigo?: string;
  currentUserName: string;
  onSaveOperacao: (operacao: OperacaoCicloRecord) => void;
  onToggleStatusOperacao: (id: number) => void;
}

export function OperacoesCiclosView({
  operacoes,
  postos,
  linhas,
  initialPdtCodigo,
  currentUserName,
  onSaveOperacao,
  onToggleStatusOperacao
}: OperacoesCiclosViewProps) {
  const [selectedPdtFilter, setSelectedPdtFilter] = useState<string>(initialPdtCodigo || 'TODOS');
  const [selectedLinhaFilter, setSelectedLinhaFilter] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODAS');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<OperacaoCicloRecord | null>(null);
  const [historyModalOp, setHistoryModalOp] = useState<OperacaoCicloRecord | null>(null);

  // Form state
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [linhaCodigo, setLinhaCodigo] = useState(linhas[0]?.codigo || 'LINHA 01');
  const [pdtCodigo, setPdtCodigo] = useState(postos[0]?.codigo || 'OP 10');
  const [sequenciaNoPdt, setSequenciaNoPdt] = useState<number>(1);
  const [tempoCicloSegundos, setTempoCicloSegundos] = useState<number>(45);
  const [tempoPadraoSegundos, setTempoPadraoSegundos] = useState<number>(45);
  const [metaProducaoCalculada, setMetaProducaoCalculada] = useState<number>(250);
  const [unidadeMedida, setUnidadeMedida] = useState('seg/vcl');
  const [dataVigencia, setDataVigencia] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'ATIVA' | 'INATIVA'>('ATIVA');
  const [observacoesTecnicas, setObservacoesTecnicas] = useState('');
  const [motivoAlteracaoCiclo, setMotivoAlteracaoCiclo] = useState('');
  const [formError, setFormError] = useState('');

  // Postos da linha selecionada no formulário
  const postosDisponiveisForm = useMemo(() => {
    return postos.filter(p => p.linhaCodigo === linhaCodigo);
  }, [postos, linhaCodigo]);

  // Lista filtrada
  const filteredOperacoes = useMemo(() => {
    return operacoes.filter(op => {
      const matchPdt = selectedPdtFilter === 'TODOS' || op.pdtCodigo === selectedPdtFilter;
      const matchLinha = selectedLinhaFilter === 'TODAS' || op.linhaCodigo === selectedLinhaFilter;
      const matchStatus = statusFilter === 'TODAS' || op.status === statusFilter;
      const matchSearch =
        op.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.pdtCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (op.descricao && op.descricao.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchPdt && matchLinha && matchStatus && matchSearch;
    }).sort((a, b) => {
      if (a.pdtCodigo !== b.pdtCodigo) return a.pdtCodigo.localeCompare(b.pdtCodigo);
      return a.sequenciaNoPdt - b.sequenciaNoPdt;
    });
  }, [operacoes, selectedPdtFilter, selectedLinhaFilter, statusFilter, searchTerm]);

  // Formatação em minutos e segundos (mm:ss)
  const formatTimeMinutes = (seconds: number) => {
    if (!seconds || seconds <= 0) return '00s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const openNewModal = () => {
    setEditingOp(null);
    const defaultPdt = selectedPdtFilter !== 'TODOS' ? selectedPdtFilter : (postos[0]?.codigo || 'OP 10');
    const pdtObj = postos.find(p => p.codigo === defaultPdt);
    const targetLinha = pdtObj?.linhaCodigo || (linhas[0]?.codigo || 'LINHA 01');

    const opsDoPdt = operacoes.filter(o => o.pdtCodigo === defaultPdt);
    const proximaSeq = opsDoPdt.length + 1;

    setCodigo(`${defaultPdt}-0${proximaSeq}`);
    setNome(`Atividade Operacional ${proximaSeq}`);
    setDescricao('Procedimento operacional padrão executado no posto');
    setLinhaCodigo(targetLinha);
    setPdtCodigo(defaultPdt);
    setSequenciaNoPdt(proximaSeq);
    setTempoCicloSegundos(pdtObj?.tempoCicloReferencia || 45);
    setTempoPadraoSegundos(pdtObj?.tempoCicloReferencia || 45);
    setMetaProducaoCalculada(250);
    setUnidadeMedida('seg/vcl');
    setDataVigencia(new Date().toISOString().split('T')[0]);
    setStatus('ATIVA');
    setObservacoesTecnicas('');
    setMotivoAlteracaoCiclo('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (op: OperacaoCicloRecord) => {
    setEditingOp(op);
    setCodigo(op.codigo);
    setNome(op.nome);
    setDescricao(op.descricao || '');
    setLinhaCodigo(op.linhaCodigo);
    setPdtCodigo(op.pdtCodigo);
    setSequenciaNoPdt(op.sequenciaNoPdt);
    setTempoCicloSegundos(op.tempoCicloSegundos);
    setTempoPadraoSegundos(op.tempoPadraoSegundos || op.tempoCicloSegundos);
    setMetaProducaoCalculada(op.metaProducaoCalculada || 250);
    setUnidadeMedida(op.unidadeMedida || 'seg/vcl');
    setDataVigencia(op.dataVigencia || new Date().toISOString().split('T')[0]);
    setStatus(op.status);
    setObservacoesTecnicas(op.observacoesTecnicas || '');
    setMotivoAlteracaoCiclo('');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = () => {
    const trimmedCodigo = codigo.trim().toUpperCase();
    const trimmedNome = nome.trim();

    if (!trimmedCodigo || !trimmedNome) {
      setFormError('Código e Nome da Operação são obrigatórios.');
      return;
    }

    const isDuplicate = operacoes.some(
      o => o.codigo.toUpperCase() === trimmedCodigo && o.id !== (editingOp?.id || 0)
    );
    if (isDuplicate) {
      setFormError(`Já existe uma operação com o código ${trimmedCodigo}.`);
      return;
    }

    const novoTempo = Number(tempoCicloSegundos) || 0;
    let historicoAtualizado = [...(editingOp?.historicoCiclos || [])];

    // Se houve alteração no tempo de ciclo, registrar no histórico de alterações
    if (editingOp && editingOp.tempoCicloSegundos !== novoTempo) {
      historicoAtualizado.push({
        id: Date.now(),
        data: new Date().toLocaleString(),
        responsavel: currentUserName || 'Team Leader',
        tempoAnterior: editingOp.tempoCicloSegundos,
        tempoNovo: novoTempo,
        motivo: motivoAlteracaoCiclo.trim() || 'Ajuste operacional de rotina'
      });
    }

    const record: OperacaoCicloRecord = {
      id: editingOp ? editingOp.id : Date.now(),
      codigo: trimmedCodigo,
      nome: trimmedNome,
      descricao,
      linhaCodigo,
      pdtCodigo,
      sequenciaNoPdt: Number(sequenciaNoPdt) || 1,
      tempoCicloSegundos: novoTempo,
      tempoPadraoSegundos: Number(tempoPadraoSegundos) || novoTempo,
      metaProducaoCalculada: Number(metaProducaoCalculada) || 0,
      unidadeMedida,
      dataVigencia,
      status,
      observacoesTecnicas,
      historicoCiclos: historicoAtualizado
    };

    onSaveOperacao(record);
    setModalOpen(false);
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-xl">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded border border-emerald-500/40 font-mono font-bold">
              CICLOS OPERACIONAIS
            </span>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <i className="fa-solid fa-stopwatch-20 text-emerald-400"></i> OPERAÇÕES E CICLOS DE TRABALHO
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cadastro de operações por Posto (PDT), tempos de ciclo cronometrados em segundos, capacidade teórica horária e rastreio de alterações
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow flex items-center gap-2 transition cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i> + Nova Operação
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Filtrar por PDT:</label>
          <select
            value={selectedPdtFilter}
            onChange={e => setSelectedPdtFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs font-mono"
          >
            <option value="TODOS">Todos os Postos (PDTs)</option>
            {postos.map(p => (
              <option key={p.id} value={p.codigo}>{p.codigo} - {p.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Filtrar por Linha:</label>
          <select
            value={selectedLinhaFilter}
            onChange={e => setSelectedLinhaFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs font-mono"
          >
            <option value="TODAS">Todas as Linhas</option>
            {linhas.map(l => (
              <option key={l.id} value={l.codigo}>{l.codigo}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Pesquisar:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Código, Nome, Descrição..."
            className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs font-mono"
          >
            <option value="TODAS">Todos os Status</option>
            <option value="ATIVA">Apenas Ativas</option>
            <option value="INATIVA">Apenas Inativas</option>
          </select>
        </div>
      </div>

      {/* Tabela de Operações */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg shadow-inner bg-slate-950">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-mono border-b border-slate-800 text-[11px] uppercase">
              <th className="p-2.5 w-16 text-center">Posto / Seq</th>
              <th className="p-2.5 w-28">Código Op.</th>
              <th className="p-2.5">Nome da Atividade / Descrição</th>
              <th className="p-2.5 text-center">Tempo Ciclo (s)</th>
              <th className="p-2.5 text-center">Tempo (mm:ss)</th>
              <th className="p-2.5 text-center">Capacidade Teórica</th>
              <th className="p-2.5 text-center">Histórico</th>
              <th className="p-2.5 text-center">Status</th>
              <th className="p-2.5 text-center w-28">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {filteredOperacoes.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-slate-500 font-sans">
                  Nenhuma operação cadastrada para os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredOperacoes.map(op => {
                const capTeorica = op.tempoCicloSegundos > 0 
                  ? Math.floor(3600 / op.tempoCicloSegundos) 
                  : 0;
                const totalAlteracoes = (op.historicoCiclos || []).length;

                return (
                  <tr key={op.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5 text-center">
                      <span className="font-bold text-sky-400 block">{op.pdtCodigo}</span>
                      <span className="text-[10px] text-amber-300">Seq #{op.sequenciaNoPdt}</span>
                    </td>
                    <td className="p-2.5 font-bold text-white">
                      {op.codigo}
                    </td>
                    <td className="p-2.5 font-sans">
                      <strong className="text-white block">{op.nome}</strong>
                      <span className="text-[10px] text-slate-400 block line-clamp-1">{op.descricao}</span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-amber-300 text-xs">
                      {op.tempoCicloSegundos}s
                    </td>
                    <td className="p-2.5 text-center text-slate-300 text-xs">
                      {formatTimeMinutes(op.tempoCicloSegundos)}
                    </td>
                    <td className="p-2.5 text-center font-bold text-emerald-400 text-xs">
                      {capTeorica > 0 ? (
                        <span>{capTeorica} <span className="text-[9px] text-slate-500">vcl/h</span></span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {totalAlteracoes > 0 ? (
                        <button
                          onClick={() => setHistoryModalOp(op)}
                          className="bg-slate-800 hover:bg-slate-700 text-sky-300 px-2 py-0.5 rounded text-[10px] border border-slate-700 cursor-pointer"
                          title="Visualizar histórico de alterações do tempo de ciclo"
                        >
                          {totalAlteracoes} {totalAlteracoes === 1 ? 'edição' : 'edições'}
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[10px]">Original</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        op.status === 'ATIVA' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(op)}
                        className="sis-btn-edit p-1 px-2 rounded text-[10px] font-bold border cursor-pointer transition shadow-xs"
                        title="Editar operação e tempo de ciclo"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => onToggleStatusOperacao(op.id)}
                        className={`p-1 px-2 rounded text-[10px] font-black border cursor-pointer transition shadow-xs ${
                          op.status === 'ATIVA' ? 'sis-btn-inactivate' : 'sis-btn-activate'
                        }`}
                        title={op.status === 'ATIVA' ? 'Inativar operação' : 'Ativar operação'}
                      >
                        {op.status === 'ATIVA' ? 'Inativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Histórico de Alterações de Ciclo */}
      {historyModalOp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left"></i>
                Histórico de Alterações de Ciclo: {historyModalOp.codigo}
              </h3>
              <button onClick={() => setHistoryModalOp(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs font-mono max-h-72 overflow-y-auto">
              {(historyModalOp.historicoCiclos || []).map((hist, i) => (
                <div key={i} className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span className="text-amber-300 font-bold">{hist.data}</span>
                    <span>Resp: <strong className="text-white">{hist.responsavel}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-red-400 line-through">De: {hist.tempoAnterior}s</span>
                    <i className="fa-solid fa-arrow-right text-slate-500 text-[10px]"></i>
                    <strong className="text-emerald-400">Para: {hist.tempoNovo}s</strong>
                  </div>
                  {hist.motivo && (
                    <p className="text-[11px] text-slate-300 font-sans italic">Motivo: {hist.motivo}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setHistoryModalOp(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro / Edição da Operação */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-2">
                <i className="fa-solid fa-stopwatch-20"></i>
                {editingOp ? 'Editar Operação e Ciclo' : 'Nova Operação e Ciclo Operacional'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            {formError && (
              <div className="bg-red-950/70 border border-red-500/50 p-2.5 rounded text-red-300 text-xs font-mono">
                ⚠ {formError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Código da Operação (Único): *</label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                    placeholder="Ex: OP-10-01"
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono uppercase focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Linha de Produção: *</label>
                  <select
                    value={linhaCodigo}
                    onChange={e => setLinhaCodigo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    {linhas.map(l => (
                      <option key={l.id} value={l.codigo}>{l.codigo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Posto de Trabalho (PDT): *</label>
                  <select
                    value={pdtCodigo}
                    onChange={e => setPdtCodigo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    {postosDisponiveisForm.map(p => (
                      <option key={p.id} value={p.codigo}>{p.codigo} - {p.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Sequência dentro do Posto: *</label>
                  <input
                    type="number"
                    min={1}
                    value={sequenciaNoPdt}
                    onChange={e => setSequenciaNoPdt(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono text-amber-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Nome da Operação: *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Encaixe do conector C02 e travamento positivo"
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Descrição Detalhada do Método:</label>
                <textarea
                  rows={2}
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  placeholder="Passo a passo, EPIs, pegada das mãos, sentido de montagem..."
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                ></textarea>
              </div>

              {/* Bloco de Tempos de Ciclo e Capacidade Teórica */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <span className="text-amber-400 font-mono font-bold block uppercase text-[10px]">
                  ⚙ Parâmetros de Tempo & Capacidade Teórica:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Tempo de Ciclo (segundos): *</label>
                    <input
                      type="number"
                      value={tempoCicloSegundos}
                      onChange={e => setTempoCicloSegundos(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-amber-300 font-mono font-bold text-sm"
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      Equivalente: {formatTimeMinutes(tempoCicloSegundos)}
                    </span>
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Tempo Padrão (segundos):</label>
                    <input
                      type="number"
                      value={tempoPadraoSegundos}
                      onChange={e => setTempoPadraoSegundos(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white font-mono"
                    />
                  </div>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/30 p-2 rounded text-emerald-300 font-mono text-xs flex justify-between items-center">
                  <span>Capacidade Teórica por Hora:</span>
                  <strong className="text-sm">
                    {tempoCicloSegundos > 0 ? `${Math.floor(3600 / tempoCicloSegundos)} vcl/h` : 'N/A'}
                  </strong>
                </div>
                <span className="text-[9px] text-slate-500 block">
                  *Cálculo teórico: 3.600s ÷ tempo de ciclo (não reflete paradas ou OPE)
                </span>
              </div>

              {/* Campo para justificativa caso esteja alterando o ciclo */}
              {editingOp && editingOp.tempoCicloSegundos !== Number(tempoCicloSegundos) && (
                <div className="bg-amber-950/50 border border-amber-500/40 p-2.5 rounded space-y-1">
                  <label className="text-amber-300 block font-bold text-[11px]">
                    Motivo da alteração de tempo (será gravado no histórico):
                  </label>
                  <input
                    type="text"
                    value={motivoAlteracaoCiclo}
                    onChange={e => setMotivoAlteracaoCiclo(e.target.value)}
                    placeholder="Ex: Kaizen de balanceamento, novo ferramental..."
                    className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Unidade:</label>
                  <select
                    value={unidadeMedida}
                    onChange={e => setUnidadeMedida(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    <option value="seg/vcl">seg/vcl</option>
                    <option value="seg/peça">seg/peça</option>
                    <option value="ciclos">ciclos</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Data Vigência:</label>
                  <input
                    type="date"
                    value={dataVigencia}
                    onChange={e => setDataVigencia(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Status:</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as 'ATIVA' | 'INATIVA')}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    <option value="ATIVA">ATIVA</option>
                    <option value="INATIVA">INATIVA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Observações Técnicas:</label>
                <input
                  type="text"
                  value={observacoesTecnicas}
                  onChange={e => setObservacoesTecnicas(e.target.value)}
                  placeholder="Torques exigidos, tolerâncias, especificações..."
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs shadow cursor-pointer"
              >
                Salvar Operação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
