import React, { useState, useMemo } from 'react';
import { LinhaProducaoRecord, PostoTrabalhoRecord, OperacaoCicloRecord, TeamLeaderRecord } from '../types/cadastros';

interface MapaLinhaViewProps {
  linhas: LinhaProducaoRecord[];
  postos: PostoTrabalhoRecord[];
  operacoes: OperacaoCicloRecord[];
  teamLeaders: TeamLeaderRecord[];
  onNavigateToPostos: (linhaCodigo?: string) => void;
  onNavigateToOperacoes: (pdtCodigo?: string) => void;
}

export function MapaLinhaView({
  linhas,
  postos,
  operacoes,
  teamLeaders,
  onNavigateToPostos,
  onNavigateToOperacoes
}: MapaLinhaViewProps) {
  const [selectedLinhaCodigo, setSelectedLinhaCodigo] = useState<string>(() => {
    return linhas[0]?.codigo || 'LINHA 01';
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedPdtModal, setSelectedPdtModal] = useState<PostoTrabalhoRecord | null>(null);

  const currentLinha = useMemo(() => {
    return linhas.find(l => l.codigo === selectedLinhaCodigo) || linhas[0];
  }, [linhas, selectedLinhaCodigo]);

  // PDTs da linha ordenados rigorosamente pela sequência operacional cadastrada
  const postosDaLinha = useMemo(() => {
    if (!currentLinha) return [];
    return postos
      .filter(p => p.linhaCodigo === currentLinha.codigo)
      .sort((a, b) => a.sequencia - b.sequencia);
  }, [postos, currentLinha]);

  const tlResponsavel = useMemo(() => {
    if (!currentLinha) return null;
    return teamLeaders.find(tl => tl.matricula === currentLinha.teamLeaderMatricula) || null;
  }, [teamLeaders, currentLinha]);

  // Estatísticas da linha selecionada
  const lineStats = useMemo(() => {
    const totalPostos = postosDaLinha.length;
    const postosAtivos = postosDaLinha.filter(p => p.status === 'ATIVO').length;
    const postosInativos = postosDaLinha.filter(p => p.status === 'INATIVO').length;
    
    // Operações totais vinculadas aos postos desta linha
    const codigosPdt = new Set(postosDaLinha.map(p => p.codigo));
    const opsDaLinha = operacoes.filter(op => codigosPdt.has(op.pdtCodigo));
    
    // Média de tempo de ciclo dos postos com ciclo cadastrado
    const postosComCiclo = postosDaLinha.filter(p => p.tempoCicloReferencia > 0);
    const mediaCiclo = postosComCiclo.length > 0 
      ? Math.round(postosComCiclo.reduce((acc, p) => acc + p.tempoCicloReferencia, 0) / postosComCiclo.length)
      : currentLinha?.tempoCicloReferencia || 0;

    const capacidadeTeoricaHora = mediaCiclo > 0 ? Math.floor(3600 / mediaCiclo) : 0;

    return {
      totalPostos,
      postosAtivos,
      postosInativos,
      totalOps: opsDaLinha.length,
      mediaCiclo,
      capacidadeTeoricaHora
    };
  }, [postosDaLinha, operacoes, currentLinha]);

  const pdtOperacoes = useMemo(() => {
    if (!selectedPdtModal) return [];
    return operacoes
      .filter(op => op.pdtCodigo === selectedPdtModal.codigo)
      .sort((a, b) => a.sequenciaNoPdt - b.sequenciaNoPdt);
  }, [operacoes, selectedPdtModal]);

  return (
    <div className={`space-y-4 ${isExpanded ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Header com Controles da Linha */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-400 text-xs px-2.5 py-0.5 rounded border border-sky-500/40 font-mono font-bold">
              SIS — FLUXO INDUSTRIAL
            </span>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <i className="fa-solid fa-diagram-project text-sky-400"></i> MAPA VISUAL DA LINHA DE PRODUÇÃO
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sequência cronológica dos Postos de Trabalho (PDT), tempos de ciclo de referência e capacidade teórica da linha
          </p>
        </div>

        {/* Seleção de Linha e Controles */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1">
            <label className="text-[10px] text-slate-400 font-mono mr-2 uppercase">Linha:</label>
            <select
              value={selectedLinhaCodigo}
              onChange={e => setSelectedLinhaCodigo(e.target.value)}
              className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none cursor-pointer"
            >
              {linhas.map(l => (
                <option key={l.id} value={l.codigo} className="bg-slate-900 text-white">
                  {l.codigo} - {l.nome} ({l.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            title={isExpanded ? 'Restaurar tamanho' : 'Visualizar em tela ampliada'}
          >
            <i className={`fa-solid ${isExpanded ? 'fa-compress' : 'fa-expand'} text-sky-400`}></i>
            <span className="hidden sm:inline">{isExpanded ? 'Recolher' : 'Tela Ampliada'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition cursor-pointer"
            title="Imprimir mapa da linha"
          >
            <i className="fa-solid fa-print"></i>
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Cartão de Identificação da Linha e Métricas */}
      {currentLinha && (
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Linha de Produção:</span>
            <strong className="text-white text-sm block">{currentLinha.codigo}</strong>
            <span className="text-sky-300 text-[11px] block truncate">{currentLinha.nome}</span>
            <span className="text-[10px] text-slate-500 block">Planta: {currentLinha.planta} • {currentLinha.area}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Team Leader Responsável:</span>
            <strong className="text-amber-300 text-sm block">
              {tlResponsavel ? tlResponsavel.nome : currentLinha.teamLeaderNome || 'Não atribuído'}
            </strong>
            <span className="text-slate-400 text-[10px] block">
              Matrícula: {tlResponsavel ? tlResponsavel.matricula : currentLinha.teamLeaderMatricula || '-'}
            </span>
            <span className="text-[10px] text-emerald-400 block font-bold">
              Status Linha: {currentLinha.status}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Postos (PDT) & Operações:</span>
            <div className="flex items-center gap-2">
              <strong className="text-white text-sm">{lineStats.totalPostos} Postos</strong>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                {lineStats.postosAtivos} Ativos
              </span>
              {lineStats.postosInativos > 0 && (
                <span className="text-[10px] text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/30">
                  {lineStats.postosInativos} Inativos
                </span>
              )}
            </div>
            <span className="text-slate-400 text-[11px] block">
              Total de Operações Vinculadas: <strong className="text-sky-300">{lineStats.totalOps}</strong>
            </span>
            <span className="text-slate-500 text-[10px] block">
              Meta Turno: {currentLinha.metaProducaoTurno} vcl/turno
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Cadência & Capacidade Teórica:</span>
            <div className="flex items-center gap-2">
              <strong className="text-amber-400 text-sm">{lineStats.mediaCiclo}s</strong>
              <span className="text-[10px] text-slate-400">(Ciclo Ref.)</span>
            </div>
            <div className="text-emerald-400 font-bold text-[11px]">
              {lineStats.capacidadeTeoricaHora > 0 ? (
                <>Capacidade Teórica: <strong>{lineStats.capacidadeTeoricaHora} vcl/h</strong></>
              ) : (
                <span className="text-slate-500">Sem ciclo cadastrado</span>
              )}
            </div>
            <span className="text-[9px] text-slate-500 block">
              *Calculada por 3.600 ÷ tempo de ciclo (referência teórica)
            </span>
          </div>
        </div>
      )}

      {/* Área do Mapa Visual dos Postos de Trabalho */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-arrows-turn-right text-sky-400"></i>
            <span className="text-xs font-bold text-white uppercase font-mono">
              Fluxo Operacional Sequencial dos Postos (Ordem de Fabricação)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {postosDaLinha.length} postos posicionados • Clique no posto para detalhes e operações
          </span>
        </div>

        {postosDaLinha.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800/80 space-y-3 my-4">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 mx-auto flex items-center justify-center text-xl border border-sky-500/20">
              <i className="fa-solid fa-industry"></i>
            </div>
            <h3 className="text-sm font-bold text-white">Nenhum Posto de Trabalho (PDT) cadastrado para esta linha</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Para visualizar o mapa sequencial da linha <strong>{currentLinha?.codigo}</strong>, cadastre os Postos de Trabalho correspondentes informando código, nome e sequência operacional.
            </p>
            <button
              onClick={() => onNavigateToPostos(currentLinha?.codigo)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-2 mx-auto cursor-pointer"
            >
              <i className="fa-solid fa-plus"></i> Cadastrar Postos de Trabalho (PDT)
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 pt-2">
            <div className="flex items-stretch gap-3 min-w-max p-2">
              {postosDaLinha.map((posto, idx) => {
                const opsDoPosto = operacoes.filter(op => op.pdtCodigo === posto.codigo);
                const isAtivo = posto.status === 'ATIVO';
                const capTeoricaPosto = posto.tempoCicloReferencia > 0 
                  ? Math.floor(3600 / posto.tempoCicloReferencia) 
                  : 0;

                return (
                  <React.Fragment key={posto.id}>
                    {/* Card do Posto */}
                    <div
                      onClick={() => setSelectedPdtModal(posto)}
                      className={`w-64 rounded-xl border p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-sky-500/10 flex flex-col justify-between ${
                        isAtivo 
                          ? 'bg-slate-950 border-slate-800 hover:border-sky-500/70 hover:scale-[1.02]' 
                          : 'bg-slate-950/60 border-slate-800/60 opacity-60 hover:opacity-100 hover:border-red-500/50'
                      }`}
                    >
                      {/* Topo do Card: Sequência e Status */}
                      <div>
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-300 font-mono font-bold text-xs flex items-center justify-center border border-sky-500/40">
                              #{posto.sequencia}
                            </span>
                            <span className="text-white font-mono font-bold text-sm">
                              {posto.codigo}
                            </span>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                            isAtivo 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                              : 'bg-red-500/20 text-red-300 border-red-500/40'
                          }`}>
                            {posto.status}
                          </span>
                        </div>

                        {/* Nome e Área */}
                        <strong className="text-slate-100 text-xs block mb-1 font-sans line-clamp-1" title={posto.nome}>
                          {posto.nome}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-mono block mb-2">
                          Trecho: <span className="text-slate-200">{posto.areaTrecho || 'Geral'}</span>
                        </span>

                        {/* Operação Principal */}
                        <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80 mb-3">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block mb-0.5">Operação Principal:</span>
                          <p className="text-[11px] text-sky-200 line-clamp-2">
                            {posto.operacaoPrincipal || 'Operação padrão de montagem'}
                          </p>
                        </div>
                      </div>

                      {/* Métricas e Rodapé do Card */}
                      <div className="space-y-2 border-t border-slate-800/80 pt-2 text-[10px] font-mono">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Tempo de Ciclo:</span>
                          <strong className="text-amber-300 font-bold">
                            {posto.tempoCicloReferencia > 0 ? `${posto.tempoCicloReferencia}s` : 'N/A'}
                          </strong>
                        </div>

                        <div className="flex justify-between items-center text-slate-300">
                          <span>Capacidade Teórica:</span>
                          <strong className="text-emerald-400 font-bold">
                            {capTeoricaPosto > 0 ? `${capTeoricaPosto} vcl/h` : '-'}
                          </strong>
                        </div>

                        <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-900">
                          <span className="flex items-center gap-1">
                            <i className="fa-solid fa-list-check text-sky-400"></i> {opsDoPosto.length} {opsDoPosto.length === 1 ? 'operação' : 'operações'}
                          </span>
                          {posto.ergoCritico && (
                            <span className="text-red-400 font-bold text-[9px] flex items-center gap-0.5" title="Posto Ergonômico Crítico">
                              <i className="fa-solid fa-triangle-exclamation"></i> Ergo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Seta de Conexão Sequencial entre Postos */}
                    {idx < postosDaLinha.length - 1 && (
                      <div className="self-center flex flex-col items-center justify-center px-1 text-slate-600 shrink-0">
                        <i className="fa-solid fa-arrow-right text-sky-500 text-lg opacity-80 animate-pulse"></i>
                        <span className="text-[8px] font-mono text-slate-500 mt-0.5">Fluxo</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do PDT Selecionado no Mapa */}
      {selectedPdtModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-sky-600 rounded flex items-center justify-center text-white font-mono font-bold text-xs">
                  #{selectedPdtModal.sequencia}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {selectedPdtModal.codigo} — {selectedPdtModal.nome}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Linha: {selectedPdtModal.linhaCodigo} • Trecho: {selectedPdtModal.areaTrecho}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPdtModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            {/* Informações Resumidas do Posto */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Tempo de Ciclo:</span>
                <strong className="text-amber-300 text-sm">{selectedPdtModal.tempoCicloReferencia}s</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Capacidade Teórica:</span>
                <strong className="text-emerald-400 text-sm">
                  {selectedPdtModal.tempoCicloReferencia > 0 
                    ? `${Math.floor(3600 / selectedPdtModal.tempoCicloReferencia)} vcl/h` 
                    : '-'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Meta Turno:</span>
                <strong className="text-white text-sm">{selectedPdtModal.metaProducao || '-'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Status Posto:</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  selectedPdtModal.status === 'ATIVO' ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'
                }`}>
                  {selectedPdtModal.status}
                </span>
              </div>
            </div>

            {/* Operação Principal e Observações */}
            <div className="text-xs space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Operação Principal:</span>
                <p className="text-slate-200">{selectedPdtModal.operacaoPrincipal || 'Não especificada'}</p>
              </div>
              {selectedPdtModal.observacoes && (
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Observações Operacionais:</span>
                  <p className="text-slate-400">{selectedPdtModal.observacoes}</p>
                </div>
              )}
            </div>

            {/* Operações Vinculadas ao Posto */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-xs font-mono text-sky-400 uppercase flex items-center gap-1.5">
                  <i className="fa-solid fa-list-check"></i> Operações Vinculadas ({pdtOperacoes.length})
                </strong>
                <button
                  onClick={() => {
                    const pdtCod = selectedPdtModal.codigo;
                    setSelectedPdtModal(null);
                    onNavigateToOperacoes(pdtCod);
                  }}
                  className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                >
                  + Gerenciar Operações deste Posto
                </button>
              </div>

              {pdtOperacoes.length === 0 ? (
                <div className="text-center p-4 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400">
                  Nenhuma operação detalhada cadastrada para o posto {selectedPdtModal.codigo}.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-56 overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse font-mono">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                        <th className="p-2 w-10 text-center">Seq</th>
                        <th className="p-2">Código</th>
                        <th className="p-2">Nome / Descrição</th>
                        <th className="p-2 text-center">Ciclo</th>
                        <th className="p-2 text-center">Cap. Teórica</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-[11px]">
                      {pdtOperacoes.map(op => {
                        const cap = op.tempoCicloSegundos > 0 ? Math.floor(3600 / op.tempoCicloSegundos) : 0;
                        return (
                          <tr key={op.id} className="hover:bg-slate-800/40">
                            <td className="p-2 text-center font-bold text-amber-300">#{op.sequenciaNoPdt}</td>
                            <td className="p-2 text-sky-300 font-bold">{op.codigo}</td>
                            <td className="p-2 font-sans text-slate-200">{op.nome}</td>
                            <td className="p-2 text-center text-amber-400 font-bold">{op.tempoCicloSegundos}s</td>
                            <td className="p-2 text-center text-emerald-400">{cap > 0 ? `${cap}/h` : '-'}</td>
                            <td className="p-2 text-center">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                op.status === 'ATIVA' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                              }`}>
                                {op.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedPdtModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold text-xs cursor-pointer"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
