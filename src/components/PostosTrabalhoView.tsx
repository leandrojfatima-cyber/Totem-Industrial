import React, { useState, useMemo } from 'react';
import { PostoTrabalhoRecord, LinhaProducaoRecord, OperacaoCicloRecord, TeamLeaderRecord } from '../types/cadastros';

interface PostosTrabalhoViewProps {
  postos: PostoTrabalhoRecord[];
  linhas: LinhaProducaoRecord[];
  operacoes: OperacaoCicloRecord[];
  teamLeaders: TeamLeaderRecord[];
  initialLinhaCodigo?: string;
  onSavePosto: (posto: PostoTrabalhoRecord) => void;
  onToggleStatusPosto: (id: number) => void;
  onReorderPostos: (linhaCodigo: string, novosPostos: PostoTrabalhoRecord[]) => void;
  onNavigateToOperacoes: (pdtCodigo: string) => void;
}

export function PostosTrabalhoView({
  postos,
  linhas,
  operacoes,
  teamLeaders,
  initialLinhaCodigo,
  onSavePosto,
  onToggleStatusPosto,
  onReorderPostos,
  onNavigateToOperacoes
}: PostosTrabalhoViewProps) {
  const [selectedLinhaFilter, setSelectedLinhaFilter] = useState<string>(initialLinhaCodigo || 'TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPosto, setEditingPosto] = useState<PostoTrabalhoRecord | null>(null);

  // Form state
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [linhaCodigo, setLinhaCodigo] = useState(linhas[0]?.codigo || 'LINHA 01');
  const [sequencia, setSequencia] = useState<number>(1);
  const [areaTrecho, setAreaTrecho] = useState('TRIM 1');
  const [operacaoPrincipal, setOperacaoPrincipal] = useState('');
  const [teamLeaderMatricula, setTeamLeaderMatricula] = useState('');
  const [tempoCicloReferencia, setTempoCicloReferencia] = useState<number>(50);
  const [metaProducao, setMetaProducao] = useState<number>(250);
  const [ergoCritico, setErgoCritico] = useState<boolean>(false);
  const [status, setStatus] = useState<'ATIVO' | 'INATIVO'>('ATIVO');
  const [observacoes, setObservacoes] = useState('');
  const [formError, setFormError] = useState('');

  // Postos filtrados e ordenados
  const filteredPostos = useMemo(() => {
    return postos
      .filter(p => {
        const matchLinha = selectedLinhaFilter === 'TODAS' || p.linhaCodigo === selectedLinhaFilter;
        const matchStatus = statusFilter === 'TODOS' || p.status === statusFilter;
        const matchSearch =
          p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.operacaoPrincipal && p.operacaoPrincipal.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.areaTrecho && p.areaTrecho.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchLinha && matchStatus && matchSearch;
      })
      .sort((a, b) => {
        if (a.linhaCodigo !== b.linhaCodigo) return a.linhaCodigo.localeCompare(b.linhaCodigo);
        return a.sequencia - b.sequencia;
      });
  }, [postos, selectedLinhaFilter, statusFilter, searchTerm]);

  const openNewModal = () => {
    setEditingPosto(null);
    const targetLinha = selectedLinhaFilter !== 'TODAS' ? selectedLinhaFilter : (linhas[0]?.codigo || 'LINHA 01');
    const postosNaLinha = postos.filter(p => p.linhaCodigo === targetLinha);
    const proximaSeq = postosNaLinha.length + 1;

    setCodigo(`OP ${proximaSeq * 10}`);
    setNome(`Montagem e Fixação Posto ${proximaSeq}`);
    setLinhaCodigo(targetLinha);
    setSequencia(proximaSeq);
    setAreaTrecho('TRIM 1');
    setOperacaoPrincipal('');
    setTeamLeaderMatricula('');
    setTempoCicloReferencia(50);
    setMetaProducao(250);
    setErgoCritico(false);
    setStatus('ATIVO');
    setObservacoes('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (p: PostoTrabalhoRecord) => {
    setEditingPosto(p);
    setCodigo(p.codigo);
    setNome(p.nome);
    setLinhaCodigo(p.linhaCodigo);
    setSequencia(p.sequencia);
    setAreaTrecho(p.areaTrecho || 'TRIM 1');
    setOperacaoPrincipal(p.operacaoPrincipal || '');
    setTeamLeaderMatricula(p.teamLeaderMatricula || '');
    setTempoCicloReferencia(p.tempoCicloReferencia);
    setMetaProducao(p.metaProducao);
    setErgoCritico(!!p.ergoCritico);
    setStatus(p.status);
    setObservacoes(p.observacoes || '');
    setFormError('');
    setModalOpen(true);
  };

  // Movimentação de sequência operacional (subir ou descer)
  const movePostoSeq = (posto: PostoTrabalhoRecord, direction: 'UP' | 'DOWN') => {
    const postosMesmaLinha = postos
      .filter(p => p.linhaCodigo === posto.linhaCodigo)
      .sort((a, b) => a.sequencia - b.sequencia);

    const idx = postosMesmaLinha.findIndex(p => p.id === posto.id);
    if (idx === -1) return;

    if (direction === 'UP' && idx > 0) {
      const prev = postosMesmaLinha[idx - 1];
      const newPostos = postosMesmaLinha.map(p => {
        if (p.id === posto.id) return { ...p, sequencia: prev.sequencia };
        if (p.id === prev.id) return { ...p, sequencia: posto.sequencia };
        return p;
      });
      onReorderPostos(posto.linhaCodigo, newPostos);
    } else if (direction === 'DOWN' && idx < postosMesmaLinha.length - 1) {
      const next = postosMesmaLinha[idx + 1];
      const newPostos = postosMesmaLinha.map(p => {
        if (p.id === posto.id) return { ...p, sequencia: next.sequencia };
        if (p.id === next.id) return { ...p, sequencia: posto.sequencia };
        return p;
      });
      onReorderPostos(posto.linhaCodigo, newPostos);
    }
  };

  const handleSave = () => {
    const trimmedCodigo = codigo.trim().toUpperCase();
    const trimmedNome = nome.trim();

    if (!trimmedCodigo || !trimmedNome) {
      setFormError('Código e Nome do Posto de Trabalho são obrigatórios.');
      return;
    }

    // Validação de duplicidade de código
    const isDuplicate = postos.some(
      p => p.codigo.toUpperCase() === trimmedCodigo && p.id !== (editingPosto?.id || 0)
    );
    if (isDuplicate) {
      setFormError(`Já existe um Posto de Trabalho (PDT) cadastrado com o código ${trimmedCodigo}.`);
      return;
    }

    const selectedTl = teamLeaders.find(tl => tl.matricula === teamLeaderMatricula);

    const record: PostoTrabalhoRecord = {
      id: editingPosto ? editingPosto.id : Date.now(),
      codigo: trimmedCodigo,
      nome: trimmedNome,
      linhaCodigo,
      sequencia: Number(sequencia) || 1,
      areaTrecho,
      operacaoPrincipal,
      teamLeaderMatricula,
      teamLeaderNome: selectedTl ? selectedTl.nome : undefined,
      tempoCicloReferencia: Number(tempoCicloReferencia) || 0,
      metaProducao: Number(metaProducao) || 0,
      ergoCritico,
      status,
      observacoes
    };

    onSavePosto(record);
    setModalOpen(false);
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-xl">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-400 text-xs px-2.5 py-0.5 rounded border border-sky-500/40 font-mono font-bold">
              ESTRUTURA DE PROCESSOS
            </span>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <i className="fa-solid fa-wrench text-sky-400"></i> POSTOS DE TRABALHO (PDT)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cadastro detalhado dos postos industriais por linha, ordenação sequencial do fluxo, ergonomia e operações associadas
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs shadow flex items-center gap-2 transition cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i> + Novo Posto (PDT)
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Filtrar por Linha:</label>
          <select
            value={selectedLinhaFilter}
            onChange={e => setSelectedLinhaFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs font-mono"
          >
            <option value="TODAS">Todas as Linhas</option>
            {linhas.map(l => (
              <option key={l.id} value={l.codigo}>{l.codigo} - {l.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Pesquisar:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Código (ex: OP 10), Nome, Trecho..."
            className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-white text-xs focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs font-mono"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="ATIVO">Apenas Ativos</option>
            <option value="INATIVO">Apenas Inativos</option>
          </select>
        </div>
      </div>

      {/* Tabela de Postos de Trabalho */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg shadow-inner bg-slate-950">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-mono border-b border-slate-800 text-[11px] uppercase">
              <th className="p-2.5 w-16 text-center">Seq / Posição</th>
              <th className="p-2.5 w-24">Código PDT</th>
              <th className="p-2.5">Nome / Operação Principal</th>
              <th className="p-2.5">Linha / Trecho</th>
              <th className="p-2.5 text-center">Tempo Ciclo</th>
              <th className="p-2.5 text-center">Cap. Teórica</th>
              <th className="p-2.5 text-center">Operações</th>
              <th className="p-2.5 text-center">Status</th>
              <th className="p-2.5 text-center w-36">Ações & Ordem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {filteredPostos.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-slate-500 font-sans">
                  Nenhum Posto de Trabalho encontrado para os critérios selecionados.
                </td>
              </tr>
            ) : (
              filteredPostos.map(p => {
                const opsDoPosto = operacoes.filter(op => op.pdtCodigo === p.codigo);
                const capTeorica = p.tempoCicloReferencia > 0 
                  ? Math.floor(3600 / p.tempoCicloReferencia) 
                  : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5 text-center font-bold text-amber-300 bg-slate-900/30">
                      #{p.sequencia}
                    </td>
                    <td className="p-2.5 font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{p.codigo}</span>
                        {p.ergoCritico && (
                          <span className="text-[9px] text-red-400 bg-red-950/80 px-1 rounded border border-red-500/40" title="Ergonomicamente Crítico">
                            ⚠ Ergo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2.5 font-sans">
                      <strong className="text-white block">{p.nome}</strong>
                      <span className="text-[10px] text-slate-400 block line-clamp-1">
                        {p.operacaoPrincipal || 'Não detalhada'}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-300 font-sans">
                      <span className="font-mono font-bold text-sky-400">{p.linhaCodigo}</span>
                      <span className="text-[10px] text-slate-500 block">{p.areaTrecho || 'Linha Geral'}</span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-amber-400">
                      {p.tempoCicloReferencia > 0 ? `${p.tempoCicloReferencia}s` : '-'}
                    </td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold">
                      {capTeorica > 0 ? `${capTeorica}/h` : '-'}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => onNavigateToOperacoes(p.codigo)}
                        className="text-sky-300 hover:text-white underline cursor-pointer text-[10px]"
                        title="Ver operações cadastradas para este posto"
                      >
                        {opsDoPosto.length} {opsDoPosto.length === 1 ? 'op' : 'ops'}
                      </button>
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'ATIVO' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center space-x-1 whitespace-nowrap">
                      {/* Botões de Reordenação Sequencial */}
                      <button
                        onClick={() => movePostoSeq(p, 'UP')}
                        className="sis-btn-move p-1 px-1.5 rounded text-[10px] font-bold border cursor-pointer transition shadow-xs"
                        title="Mover posto para cima na sequência operacional"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => movePostoSeq(p, 'DOWN')}
                        className="sis-btn-move p-1 px-1.5 rounded text-[10px] font-bold border cursor-pointer transition shadow-xs"
                        title="Mover posto para baixo na sequência operacional"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => openEditModal(p)}
                        className="sis-btn-edit p-1 px-2 rounded text-[10px] font-bold border cursor-pointer transition shadow-xs"
                        title="Editar posto de trabalho"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => onToggleStatusPosto(p.id)}
                        className={`p-1 px-2 rounded text-[10px] font-black border cursor-pointer transition shadow-xs ${
                          p.status === 'ATIVO' ? 'sis-btn-inactivate' : 'sis-btn-activate'
                        }`}
                        title={p.status === 'ATIVO' ? 'Inativar posto de trabalho' : 'Ativar posto de trabalho'}
                      >
                        {p.status === 'ATIVO' ? 'Inativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-2">
                <i className="fa-solid fa-wrench"></i>
                {editingPosto ? 'Editar Posto de Trabalho' : 'Novo Posto de Trabalho (PDT)'}
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
                  <label className="text-slate-300 block mb-1 font-bold">Código do Posto (Único): *</label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                    placeholder="Ex: OP 10, OP 20"
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono uppercase focus:border-sky-500"
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
                      <option key={l.id} value={l.codigo}>{l.codigo} - {l.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Nome / Descrição do Posto: *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Conexão de Chicotes Elétricos e Módulos"
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Posição / Sequência na Linha: *</label>
                  <input
                    type="number"
                    min={1}
                    value={sequencia}
                    onChange={e => setSequencia(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold text-amber-300"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Área / Trecho:</label>
                  <input
                    type="text"
                    value={areaTrecho}
                    onChange={e => setAreaTrecho(e.target.value)}
                    placeholder="Ex: TRIM 1, Trecho B"
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Operação Principal Executada:</label>
                <textarea
                  rows={2}
                  value={operacaoPrincipal}
                  onChange={e => setOperacaoPrincipal(e.target.value)}
                  placeholder="Resumo das atividades executadas pelo operador no posto..."
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Tempo Ciclo Ref. (segundos):</label>
                  <input
                    type="number"
                    value={tempoCicloReferencia}
                    onChange={e => setTempoCicloReferencia(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono text-amber-400 font-bold"
                  />
                  {tempoCicloReferencia > 0 && (
                    <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">
                      Cap. teórica: {Math.floor(3600 / tempoCicloReferencia)} vcl/h
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Meta de Produção (Turno):</label>
                  <input
                    type="number"
                    value={metaProducao}
                    onChange={e => setMetaProducao(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Team Leader Responsável:</label>
                  <select
                    value={teamLeaderMatricula}
                    onChange={e => setTeamLeaderMatricula(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    <option value="">-- Padrão da Linha --</option>
                    {teamLeaders.map(tl => (
                      <option key={tl.id} value={tl.matricula}>{tl.nome} ({tl.matricula})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Status:</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as 'ATIVO' | 'INATIVO')}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    <option value="ATIVO">ATIVO</option>
                    <option value="INATIVO">INATIVO</option>
                  </select>
                </div>
              </div>

              {/* Risco Ergonômico Crítico */}
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">Posto Ergonomicamente Crítico?</span>
                  <span className="text-[10px] text-slate-400">Requer rodízio obrigatório e acompanhamento WHS</span>
                </div>
                <input
                  type="checkbox"
                  checked={ergoCritico}
                  onChange={e => setErgoCritico(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Observações Operacionais:</label>
                <input
                  type="text"
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  placeholder="Ex: Poka-Yoke ativo, ferramental especial..."
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
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-xs shadow cursor-pointer"
              >
                Salvar Posto (PDT)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
