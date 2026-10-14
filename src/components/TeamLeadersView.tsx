import React, { useState, useMemo } from 'react';
import { TeamLeaderRecord, LinhaProducaoRecord } from '../types/cadastros';

interface TeamLeadersViewProps {
  teamLeaders: TeamLeaderRecord[];
  linhas: LinhaProducaoRecord[];
  onSaveTeamLeader: (tl: TeamLeaderRecord) => void;
  onToggleStatusTeamLeader: (id: number) => void;
}

export function TeamLeadersView({
  teamLeaders,
  linhas,
  onSaveTeamLeader,
  onToggleStatusTeamLeader
}: TeamLeadersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTurno, setFilterTurno] = useState('TODOS');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [filterLinha, setFilterLinha] = useState('TODAS');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTl, setEditingTl] = useState<TeamLeaderRecord | null>(null);

  // Form state
  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [turno, setTurno] = useState('1º TURNO');
  const [selectedLinhas, setSelectedLinhas] = useState<string[]>([]);
  const [area, setArea] = useState('TRIM 1');
  const [equipe, setEquipe] = useState('Equipe Alfa');
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'ATIVO' | 'INATIVO'>('ATIVO');
  const [observacoes, setObservacoes] = useState('');
  const [formError, setFormError] = useState('');

  const filteredTeamLeaders = useMemo(() => {
    return teamLeaders.filter(tl => {
      const matchSearch = 
        tl.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tl.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tl.area && tl.area.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tl.equipe && tl.equipe.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTurno = filterTurno === 'TODOS' || tl.turno === filterTurno;
      const matchStatus = filterStatus === 'TODOS' || tl.status === filterStatus;
      const matchLinha = filterLinha === 'TODAS' || (tl.linhas && tl.linhas.includes(filterLinha));

      return matchSearch && matchTurno && matchStatus && matchLinha;
    });
  }, [teamLeaders, searchTerm, filterTurno, filterStatus, filterLinha]);

  const openNewModal = () => {
    setEditingTl(null);
    setMatricula('');
    setNome('');
    setTurno('1º TURNO');
    setSelectedLinhas(linhas.length > 0 ? [linhas[0].codigo] : ['LINHA 01']);
    setArea('TRIM 1');
    setEquipe('Equipe Operacional');
    setDataInicio(new Date().toISOString().split('T')[0]);
    setStatus('ATIVO');
    setObservacoes('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (tl: TeamLeaderRecord) => {
    setEditingTl(tl);
    setMatricula(tl.matricula);
    setNome(tl.nome);
    setTurno(tl.turno);
    setSelectedLinhas(tl.linhas || []);
    setArea(tl.area);
    setEquipe(tl.equipe);
    setDataInicio(tl.dataInicio || new Date().toISOString().split('T')[0]);
    setStatus(tl.status);
    setObservacoes(tl.observacoes || '');
    setFormError('');
    setModalOpen(true);
  };

  const toggleLinhaSelection = (linhaCod: string) => {
    setSelectedLinhas(prev => {
      if (prev.includes(linhaCod)) {
        return prev.filter(c => c !== linhaCod);
      } else {
        return [...prev, linhaCod];
      }
    });
  };

  const handleSave = () => {
    const trimmedMatricula = matricula.trim().toUpperCase();
    const trimmedNome = nome.trim().toUpperCase();

    if (!trimmedMatricula || !trimmedNome) {
      setFormError('Matrícula e Nome Completo são obrigatórios.');
      return;
    }

    // Validação de unicidade de matrícula
    const isDuplicate = teamLeaders.some(
      tl => tl.matricula.toUpperCase() === trimmedMatricula && tl.id !== (editingTl?.id || 0)
    );
    if (isDuplicate) {
      setFormError(`Já existe um Team Leader cadastrado com a matrícula ${trimmedMatricula}.`);
      return;
    }

    const record: TeamLeaderRecord = {
      id: editingTl ? editingTl.id : Date.now(),
      matricula: trimmedMatricula,
      nome: trimmedNome,
      turno,
      linhas: selectedLinhas,
      area,
      equipe,
      dataInicio,
      status,
      observacoes
    };

    onSaveTeamLeader(record);
    setModalOpen(false);
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-xl">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-400 text-xs px-2.5 py-0.5 rounded border border-sky-500/40 font-mono font-bold">
              CADASTROS MESTRES
            </span>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <i className="fa-solid fa-user-tie text-sky-400"></i> GESTÃO DE TEAM LEADERS
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cadastro oficial de líderes de equipe, atribuição de turnos, responsabilidade por linhas de produção e histórico de atuação
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs shadow flex items-center gap-2 transition cursor-pointer"
        >
          <i className="fa-solid fa-user-plus"></i> + Novo Team Leader
        </button>
      </div>

      {/* Barra de Filtros e Pesquisa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Pesquisar:</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Nome, Matrícula, Área..."
              className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Turno:</label>
          <select
            value={filterTurno}
            onChange={e => setFilterTurno(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs font-mono"
          >
            <option value="TODOS">Todos os Turnos</option>
            <option value="1º TURNO">1º Turno</option>
            <option value="2º TURNO">2º Turno</option>
            <option value="3º TURNO">3º Turno</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Linha Responsável:</label>
          <select
            value={filterLinha}
            onChange={e => setFilterLinha(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white text-xs font-mono"
          >
            <option value="TODAS">Todas as Linhas</option>
            {linhas.map(l => (
              <option key={l.id} value={l.codigo}>{l.codigo}</option>
            ))}
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
            <option value="ATIVO">Apenas Ativos</option>
            <option value="INATIVO">Apenas Inativos</option>
          </select>
        </div>
      </div>

      {/* Tabela de Team Leaders */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg shadow-inner bg-slate-950">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-mono border-b border-slate-800 text-[11px] uppercase">
              <th className="p-2.5 w-24">Matrícula</th>
              <th className="p-2.5">Nome Completo</th>
              <th className="p-2.5">Turno</th>
              <th className="p-2.5">Área / Equipe</th>
              <th className="p-2.5">Linhas Sob Responsabilidade</th>
              <th className="p-2.5">Início</th>
              <th className="p-2.5 text-center w-20">Status</th>
              <th className="p-2.5 text-center w-28">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {filteredTeamLeaders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500 font-sans">
                  Nenhum Team Leader encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredTeamLeaders.map(tl => (
                <tr key={tl.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-2.5 font-bold text-amber-300">{tl.matricula}</td>
                  <td className="p-2.5 font-sans font-bold text-white">
                    <div>{tl.nome}</div>
                    {tl.observacoes && (
                      <span className="text-[10px] text-slate-400 font-normal truncate block max-w-xs">
                        {tl.observacoes}
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 text-slate-300">{tl.turno}</td>
                  <td className="p-2.5 text-slate-400 font-sans">
                    <span className="text-slate-200">{tl.area}</span>
                    {tl.equipe && <span className="block text-[10px] text-slate-500">{tl.equipe}</span>}
                  </td>
                  <td className="p-2.5">
                    <div className="flex flex-wrap gap-1">
                      {(tl.linhas || []).length > 0 ? (
                        tl.linhas.map((lin, idx) => (
                          <span
                            key={idx}
                            className="bg-sky-950/70 text-sky-300 px-1.5 py-0.5 rounded text-[10px] border border-sky-500/30 font-bold"
                          >
                            {lin}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-600">Nenhuma</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2.5 text-slate-400 text-[10px]">{tl.dataInicio || '-'}</td>
                  <td className="p-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tl.status === 'ATIVO' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      {tl.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-center space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(tl)}
                      className="sis-btn-edit p-1 px-2 rounded text-[10px] font-bold border cursor-pointer transition shadow-xs"
                      title="Editar cadastro do Team Leader"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => onToggleStatusTeamLeader(tl.id)}
                      className={`p-1 px-2 rounded text-[10px] font-black border cursor-pointer transition shadow-xs ${
                        tl.status === 'ATIVO' ? 'sis-btn-inactivate' : 'sis-btn-activate'
                      }`}
                      title={tl.status === 'ATIVO' ? 'Inativar registro sem perda de histórico' : 'Reativar Team Leader'}
                    >
                      {tl.status === 'ATIVO' ? 'Inativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))
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
                <i className="fa-solid fa-user-tie"></i>
                {editingTl ? 'Editar Team Leader' : 'Novo Cadastro de Team Leader'}
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
                  <label className="text-slate-300 block mb-1 font-bold">Matrícula (Única): *</label>
                  <input
                    type="text"
                    value={matricula}
                    onChange={e => setMatricula(e.target.value)}
                    placeholder="Ex: ST99881"
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono uppercase focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Turno de Trabalho: *</label>
                  <select
                    value={turno}
                    onChange={e => setTurno(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    <option value="1º TURNO">1º TURNO</option>
                    <option value="2º TURNO">2º TURNO</option>
                    <option value="3º TURNO">3º TURNO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Nome Completo: *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Nome do Team Leader"
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white uppercase focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Área / Setor:</label>
                  <input
                    type="text"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    placeholder="Ex: TRIM 1, FINAL"
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Equipe Vinculada:</label>
                  <input
                    type="text"
                    value={equipe}
                    onChange={e => setEquipe(e.target.value)}
                    placeholder="Ex: Equipe Alfa"
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                  />
                </div>
              </div>

              {/* Seleção de Linhas de Responsabilidade */}
              <div>
                <label className="text-slate-300 block mb-1 font-bold">
                  Linhas sob sua Responsabilidade: (selecione uma ou mais)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 rounded border border-slate-700">
                  {linhas.map(l => {
                    const selected = selectedLinhas.includes(l.codigo);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => toggleLinhaSelection(l.codigo)}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                          selected
                            ? 'bg-sky-600 text-white shadow'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '} {l.codigo}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Data Início da Responsabilidade:</label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={e => setDataInicio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  />
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

              <div>
                <label className="text-slate-400 block mb-1">Observações Operacionais:</label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  placeholder="Informações adicionais, histórico, certificações..."
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                ></textarea>
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
                Salvar Team Leader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
