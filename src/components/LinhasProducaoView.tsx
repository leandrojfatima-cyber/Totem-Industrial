import React, { useState, useMemo } from 'react';
import { LinhaProducaoRecord, TeamLeaderRecord, PostoTrabalhoRecord, OperacaoCicloRecord } from '../types/cadastros';

interface LinhasProducaoViewProps {
  linhas: LinhaProducaoRecord[];
  teamLeaders: TeamLeaderRecord[];
  postos: PostoTrabalhoRecord[];
  operacoes: OperacaoCicloRecord[];
  onSaveLinha: (linha: LinhaProducaoRecord) => void;
  onToggleStatusLinha: (id: number) => void;
  onViewPostosDaLinha: (linhaCodigo: string) => void;
}

export function LinhasProducaoView({
  linhas,
  teamLeaders,
  postos,
  operacoes,
  onSaveLinha,
  onToggleStatusLinha,
  onViewPostosDaLinha
}: LinhasProducaoViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlanta, setFilterPlanta] = useState('TODAS');
  const [filterStatus, setFilterStatus] = useState('TODOS');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLinha, setEditingLinha] = useState<LinhaProducaoRecord | null>(null);

  // Form state
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [planta, setPlanta] = useState('BETIM VHI');
  const [area, setArea] = useState('MONTAGEM / TRIM 1');
  const [turnos, setTurnos] = useState<string[]>(['1º TURNO', '2º TURNO']);
  const [teamLeaderMatricula, setTeamLeaderMatricula] = useState('');
  const [descricao, setDescricao] = useState('');
  const [metaProducaoTurno, setMetaProducaoTurno] = useState<number>(250);
  const [tempoCicloReferencia, setTempoCicloReferencia] = useState<number>(50);
  const [status, setStatus] = useState<'ATIVA' | 'INATIVA'>('ATIVA');
  const [observacoes, setObservacoes] = useState('');
  const [formError, setFormError] = useState('');

  // Linhas filtradas
  const filteredLinhas = useMemo(() => {
    return linhas.filter(l => {
      const matchSearch =
        l.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.teamLeaderNome && l.teamLeaderNome.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchPlanta = filterPlanta === 'TODAS' || l.planta === filterPlanta;
      const matchStatus = filterStatus === 'TODOS' || l.status === filterStatus;

      return matchSearch && matchPlanta && matchStatus;
    });
  }, [linhas, searchTerm, filterPlanta, filterStatus]);

  const openNewModal = () => {
    setEditingLinha(null);
    const proximoNum = linhas.length + 1;
    setCodigo(`LINHA ${proximoNum < 10 ? '0' + proximoNum : proximoNum}`);
    setNome(`Montagem de Carrocerias e Acabamento L${proximoNum}`);
    setPlanta('BETIM VHI');
    setArea('MONTAGEM / TRIM 1');
    setTurnos(['1º TURNO', '2º TURNO']);
    setTeamLeaderMatricula(teamLeaders[0]?.matricula || '');
    setDescricao('Fluxo produtivo principal de montagem de veículos');
    setMetaProducaoTurno(250);
    setTempoCicloReferencia(50);
    setStatus('ATIVA');
    setObservacoes('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (linha: LinhaProducaoRecord) => {
    setEditingLinha(linha);
    setCodigo(linha.codigo);
    setNome(linha.nome);
    setPlanta(linha.planta);
    setArea(linha.area);
    setTurnos(linha.turnos || ['1º TURNO']);
    setTeamLeaderMatricula(linha.teamLeaderMatricula || '');
    setDescricao(linha.descricao || '');
    setMetaProducaoTurno(linha.metaProducaoTurno);
    setTempoCicloReferencia(linha.tempoCicloReferencia);
    setStatus(linha.status);
    setObservacoes(linha.observacoes || '');
    setFormError('');
    setModalOpen(true);
  };

  const toggleTurno = (t: string) => {
    setTurnos(prev => prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]);
  };

  const handleSave = () => {
    const trimmedCodigo = codigo.trim().toUpperCase();
    const trimmedNome = nome.trim();

    if (!trimmedCodigo || !trimmedNome) {
      setFormError('Código e Identificação da linha são obrigatórios.');
      return;
    }

    const isDuplicate = linhas.some(
      l => l.codigo.toUpperCase() === trimmedCodigo && l.id !== (editingLinha?.id || 0)
    );
    if (isDuplicate) {
      setFormError(`Já existe uma linha com o código ${trimmedCodigo}.`);
      return;
    }

    const selectedTl = teamLeaders.find(tl => tl.matricula === teamLeaderMatricula);

    const record: LinhaProducaoRecord = {
      id: editingLinha ? editingLinha.id : Date.now(),
      codigo: trimmedCodigo,
      nome: trimmedNome,
      planta,
      area,
      turnos,
      teamLeaderMatricula,
      teamLeaderNome: selectedTl ? selectedTl.nome : '',
      descricao,
      metaProducaoTurno: Number(metaProducaoTurno) || 0,
      tempoCicloReferencia: Number(tempoCicloReferencia) || 0,
      status,
      observacoes
    };

    onSaveLinha(record);
    setModalOpen(false);
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-xl">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-0.5 rounded border border-amber-500/40 font-mono font-bold">
              ESTRUTURA FABRIL
            </span>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <i className="fa-solid fa-industry text-amber-400"></i> GESTÃO DE LINHAS DE PRODUÇÃO
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Administração de linhas industriais, atribuição de Team Leaders responsáveis, metas de turno e relação com postos (PDT)
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs shadow flex items-center gap-2 transition cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i> + Nova Linha de Produção
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Pesquisar:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Código, Nome, TL..."
            className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-white text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Planta:</label>
          <select
            value={filterPlanta}
            onChange={e => setFilterPlanta(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs font-mono"
          >
            <option value="TODAS">Todas as Plantas</option>
            <option value="BETIM VHI">BETIM VHI</option>
            <option value="BETIM MOTORES">BETIM MOTORES</option>
            <option value="PORTO REAL - RJ">PORTO REAL - RJ</option>
            <option value="GOIANA - PE">GOIANA - PE</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Status:</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs font-mono"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="ATIVA">Apenas Ativas</option>
            <option value="INATIVA">Apenas Inativas</option>
          </select>
        </div>
      </div>

      {/* Grid de Linhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredLinhas.map(linha => {
          const postosDaLinha = postos.filter(p => p.linhaCodigo === linha.codigo);
          const codigosPdt = new Set(postosDaLinha.map(p => p.codigo));
          const opsDaLinha = operacoes.filter(op => codigosPdt.has(op.pdtCodigo));
          const capTeorica = linha.tempoCicloReferencia > 0 
            ? Math.floor(3600 / linha.tempoCicloReferencia) 
            : 0;

          return (
            <div
              key={linha.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2">
                  <div>
                    <span className="font-mono font-bold text-amber-300 text-sm bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                      {linha.codigo}
                    </span>
                    <strong className="text-white block mt-1.5 text-xs font-sans line-clamp-1">{linha.nome}</strong>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    linha.status === 'ATIVA'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {linha.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                  {linha.descricao || 'Sem descrição cadastrada'}
                </p>

                <div className="space-y-1 text-xs font-mono bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 text-[10px]">Team Leader:</span>
                    <strong className="text-sky-300 text-[11px] truncate max-w-[150px]">
                      {linha.teamLeaderNome || 'Não atribuído'}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 text-[10px]">Planta / Área:</span>
                    <span className="text-slate-200 text-[10px]">{linha.planta} • {linha.area}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 text-[10px]">Meta Turno:</span>
                    <strong className="text-white text-[11px]">{linha.metaProducaoTurno} vcl</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 text-[10px]">Ciclo Ref. / Cap. Teórica:</span>
                    <span className="text-amber-400 text-[11px]">
                      {linha.tempoCicloReferencia}s ({capTeorica > 0 ? `${capTeorica}/h` : '-'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Indicadores de PDTs e Operações e Ações */}
              <div className="space-y-2 border-t border-slate-800/80 pt-2 text-[10px] font-mono">
                <div className="flex justify-between items-center bg-slate-900 px-2 py-1.5 rounded border border-slate-800">
                  <span className="text-slate-400">
                    <i className="fa-solid fa-wrench text-sky-400 mr-1"></i> {postosDaLinha.length} Postos (PDT)
                  </span>
                  <span className="text-slate-400">
                    <i className="fa-solid fa-list-check text-emerald-400 mr-1"></i> {opsDaLinha.length} Operações
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1 font-mono">
                  <button
                    onClick={() => onViewPostosDaLinha(linha.codigo)}
                    className="sis-btn-edit p-1.5 rounded text-[10px] font-bold border text-center transition cursor-pointer"
                    title="Ver todos os postos de trabalho desta linha"
                  >
                    Ver Postos
                  </button>
                  <button
                    onClick={() => openEditModal(linha)}
                    className="sis-btn-move p-1.5 rounded text-[10px] font-bold border text-center transition cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onToggleStatusLinha(linha.id)}
                    className={`p-1.5 rounded text-[10px] font-black border text-center transition cursor-pointer ${
                      linha.status === 'ATIVA' ? 'sis-btn-inactivate' : 'sis-btn-activate'
                    }`}
                  >
                    {linha.status === 'ATIVA' ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Cadastro / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-2">
                <i className="fa-solid fa-industry"></i>
                {editingLinha ? 'Editar Linha de Produção' : 'Nova Linha de Produção'}
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
                  <label className="text-slate-300 block mb-1 font-bold">Código da Linha (Único): *</label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                    placeholder="Ex: LINHA 01"
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono uppercase focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Planta Fabril: *</label>
                  <select
                    value={planta}
                    onChange={e => setPlanta(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    <option value="BETIM VHI">BETIM VHI</option>
                    <option value="BETIM MOTORES">BETIM MOTORES</option>
                    <option value="PORTO REAL - RJ">PORTO REAL - RJ</option>
                    <option value="GOIANA - PE">GOIANA - PE</option>
                    <option value="CÓRDOBA - ARGENTINA">CÓRDOBA - ARGENTINA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Nome / Identificação da Linha: *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Linha Principal de Montagem Interior - Trim 1"
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Área / Setor:</label>
                  <input
                    type="text"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    placeholder="Ex: MONTAGEM / TRIM 1"
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Team Leader Responsável:</label>
                  <select
                    value={teamLeaderMatricula}
                    onChange={e => setTeamLeaderMatricula(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    <option value="">-- Selecione o TL --</option>
                    {teamLeaders.map(tl => (
                      <option key={tl.id} value={tl.matricula}>
                        {tl.nome} ({tl.matricula})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Turnos de Funcionamento */}
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Turnos de Funcionamento:</label>
                <div className="flex gap-2">
                  {['1º TURNO', '2º TURNO', '3º TURNO'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTurno(t)}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                        turnos.includes(t)
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {turnos.includes(t) ? '✓ ' : '+ '} {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Meta de Produção / Turno:</label>
                  <input
                    type="number"
                    value={metaProducaoTurno}
                    onChange={e => setMetaProducaoTurno(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tempo Ciclo de Referência (segundos):</label>
                  <input
                    type="number"
                    value={tempoCicloReferencia}
                    onChange={e => setTempoCicloReferencia(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono font-bold text-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Descrição / Finalidade:</label>
                <textarea
                  rows={2}
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  placeholder="Detalhamento operacional da linha de montagem..."
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                <div>
                  <label className="text-slate-400 block mb-1">Observações:</label>
                  <input
                    type="text"
                    value={observacoes}
                    onChange={e => setObservacoes(e.target.value)}
                    placeholder="Notas técnicas"
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                  />
                </div>
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
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold text-xs shadow cursor-pointer"
              >
                Salvar Linha de Produção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
