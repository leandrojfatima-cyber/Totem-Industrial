import React, { useState } from 'react';
import { UserRole } from '../types/mapa';

export interface LogItem {
  id: string;
  timestamp: string;
  usuario: string;
  perfil: UserRole;
  categoria: 'MAPA' | 'TOTEM' | 'QUALIDADE' | 'CADASTRO' | 'SEGURANCA' | 'SISTEMA';
  acao: string;
  detalhes: string;
  status: 'SUCESSO' | 'ALERTA' | 'INFO';
}

const INITIAL_LOGS: LogItem[] = [
  {
    id: 'LOG-1094',
    timestamp: '13/10/2026 07:15:22',
    usuario: 'AVELINO DA SILVA',
    perfil: 'TEAM_LEADER',
    categoria: 'MAPA',
    acao: 'Abertura do Totem PDT L3-087',
    detalhes: 'Lançamento de parâmetros do Gemba Walk e verificação de torque',
    status: 'SUCESSO'
  },
  {
    id: 'LOG-1093',
    timestamp: '13/10/2026 06:45:10',
    usuario: 'SISTEMA STELLANTIS',
    perfil: 'ADMINISTRADOR',
    categoria: 'SISTEMA',
    acao: 'Sincronização de Dados da Planta',
    detalhes: 'Carregamento de 150 PDTs na Linha L3 e 108 PDTs na Linha L1',
    status: 'INFO'
  },
  {
    id: 'LOG-1092',
    timestamp: '13/10/2026 06:12:04',
    usuario: 'CARLOS ALBERTO',
    perfil: 'OPERADOR',
    categoria: 'QUALIDADE',
    acao: 'Amostragem BP8 Concluída',
    detalhes: 'Amostra de chassi 9BD120951 validada com torque 45.2 Nm',
    status: 'SUCESSO'
  },
  {
    id: 'LOG-1091',
    timestamp: '12/10/2026 15:30:19',
    usuario: 'MARCELO SILVA',
    perfil: 'ADMINISTRADOR',
    categoria: 'CADASTRO',
    acao: 'Edição de Sequência PDT',
    detalhes: 'Reordenação operacional dos postos OP 85, OP 86 e OP 87',
    status: 'SUCESSO'
  },
  {
    id: 'LOG-1090',
    timestamp: '12/10/2026 14:10:00',
    usuario: 'LUCAS PEREIRA',
    perfil: 'TEAM_LEADER',
    categoria: 'SEGURANCA',
    acao: 'Andon Acionado',
    detalhes: 'Parada preventiva de 4 min para alinhamento de guia na baia L1',
    status: 'ALERTA'
  },
  {
    id: 'LOG-1089',
    timestamp: '12/10/2026 10:00:15',
    usuario: 'AVELINO DA SILVA',
    perfil: 'TEAM_LEADER',
    categoria: 'QUALIDADE',
    acao: 'Teste Red Hat / Poka-Yoke',
    detalhes: 'Dispositivo sensor ótico aprovado no primeiro ciclo',
    status: 'SUCESSO'
  }
];

export function LogsView() {
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODAS');

  const filteredLogs = logs.filter(l => {
    const matchBusca = !busca ||
      l.id.toLowerCase().includes(busca.toLowerCase()) ||
      l.usuario.toLowerCase().includes(busca.toLowerCase()) ||
      l.acao.toLowerCase().includes(busca.toLowerCase()) ||
      l.detalhes.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoriaFiltro === 'TODAS' || l.categoria === categoriaFiltro;
    return matchBusca && matchCat;
  });

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sis_totem_logs_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (window.confirm('Deseja limpar os logs exibidos em tela? (Um log de limpeza será registrado)')) {
      const novoLog: LogItem = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString('pt-BR'),
        usuario: 'ADMINISTRADOR',
        perfil: 'ADMINISTRADOR',
        categoria: 'SISTEMA',
        acao: 'Logs do Sistema Limpos',
        detalhes: 'Histórico local reiniciado com sucesso',
        status: 'INFO'
      };
      setLogs([novoLog]);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4 shadow-xl font-sans">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-400 text-xs px-2.5 py-0.5 rounded border border-sky-500/40 font-mono font-bold">
              GRUPO 6 • ADMINISTRAÇÃO
            </span>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-sky-400"></i> LOGS & TRILHA DE AUDITORIA DO SISTEMA
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rastreabilidade de todas as ações de operadores, Team Leaders e administradores nas linhas L1 e L3
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <i className="fa-solid fa-download"></i> Exportar Logs (JSON)
          </button>
          <button
            onClick={handleClearLogs}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <i className="fa-solid fa-trash-can"></i> Limpar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Pesquisar Ação, Usuário ou Código:</label>
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Ex.: L3-087, Avelino, Gemba, Amostragem..."
            className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Filtrar por Categoria:</label>
          <select
            value={categoriaFiltro}
            onChange={e => setCategoriaFiltro(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded-lg text-white text-xs font-mono"
          >
            <option value="TODAS">Todas as Categorias</option>
            <option value="MAPA">Mapa da Linha</option>
            <option value="TOTEM">Gestão do Totem</option>
            <option value="QUALIDADE">Qualidade & Processo</option>
            <option value="CADASTRO">Cadastros Industriais</option>
            <option value="SEGURANCA">Segurança & Andon</option>
            <option value="SISTEMA">Sistema & Backups</option>
          </select>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 shadow-inner">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-mono border-b border-slate-800 text-[11px] uppercase">
              <th className="p-2.5 w-24">ID Log</th>
              <th className="p-2.5 w-36">Data / Hora</th>
              <th className="p-2.5 w-36">Usuário</th>
              <th className="p-2.5 w-28">Perfil</th>
              <th className="p-2.5 w-28">Categoria</th>
              <th className="p-2.5">Ação Realizada</th>
              <th className="p-2.5">Detalhes</th>
              <th className="p-2.5 text-center w-24">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500 font-sans">
                  Nenhum registro de log encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredLogs.map(l => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-2.5 font-bold text-amber-300">{l.id}</td>
                  <td className="p-2.5 text-slate-400 text-[10px]">{l.timestamp}</td>
                  <td className="p-2.5 text-white font-bold font-sans">{l.usuario}</td>
                  <td className="p-2.5">
                    <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-sky-400 border border-slate-800 font-bold">
                      {l.perfil}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span className="bg-slate-900/60 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-800">
                      {l.categoria}
                    </span>
                  </td>
                  <td className="p-2.5 font-sans font-bold text-slate-100">{l.acao}</td>
                  <td className="p-2.5 font-sans text-slate-400 text-[10px]">{l.detalhes}</td>
                  <td className="p-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                      l.status === 'SUCESSO'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : l.status === 'ALERTA'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
