import React, { useState } from 'react';

export function FerramentalPatrimonioView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');

  const [ferramentas, setFerramentas] = useState([
    { id: 1, codigo: 'PAT-44120', nome: 'Aparafusadora Angular Transduzida', posto: 'OP 87', linha: 'L3', tipo: 'Elétrica / Digital', status: 'CALIBRADO', validade: '20/12/2026', responsavel: 'AVELINO DA SILVA' },
    { id: 2, codigo: 'PAT-88192', nome: 'Torquímetro de Estalo Certificado 5-50Nm', posto: 'OP 20', linha: 'L1', tipo: 'Mecânico', status: 'CALIBRADO', validade: '15/11/2026', responsavel: 'AVELINO DA SILVA' },
    { id: 3, codigo: 'PAT-12005', nome: 'Gabarito Poka-Yoke de Posicionamento F1H', posto: 'OP 52', linha: 'L3', tipo: 'Dispositivo Especial', status: 'A_VENCER', validade: '25/10/2026', responsavel: 'MARCOS LIMA' },
    { id: 4, codigo: 'PAT-90311', nome: 'Calibrador Tampão Passa/Não-Passa', posto: 'OP 102', linha: 'L1', tipo: 'Dimensional', status: 'CALIBRADO', validade: '10/01/2027', responsavel: 'AVELINO DA SILVA' },
    { id: 5, codigo: 'PAT-33019', nome: 'Aparafusadora de Pistola de Bateria', posto: 'OP 148', linha: 'L3', tipo: 'Bateria / Transduzida', status: 'VENCIDO', validade: '01/10/2026', responsavel: 'MARCOS LIMA' }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [novoCodigo, setNovoCodigo] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novoPosto, setNovoPosto] = useState('OP 87');
  const [novaLinha, setNovaLinha] = useState('L3');
  const [novoTipo, setNovoTipo] = useState('Elétrica / Digital');
  const [novaValidade, setNovaValidade] = useState('31/12/2026');

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome) return;
    const item = {
      id: Date.now(),
      codigo: novoCodigo || `PAT-${Math.floor(10000 + Math.random() * 90000)}`,
      nome: novoNome,
      posto: novoPosto,
      linha: novaLinha,
      tipo: novoTipo,
      status: 'CALIBRADO',
      validade: novaValidade,
      responsavel: 'Team Leader'
    };
    setFerramentas(prev => [item, ...prev]);
    setModalOpen(false);
    setNovoCodigo('');
    setNovoNome('');
  };

  const filtered = ferramentas.filter(f => {
    const matchSearch = f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.posto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'TODOS' || f.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4 shadow-xl font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-0.5 rounded border border-amber-500/40 font-mono font-bold">
              GRUPO 6 • FERRAMENTAL & PATRIMÔNIO
            </span>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <i className="fa-solid fa-toolbox text-amber-400"></i> INVENTÁRIO DE FERRAMENTAL CRÍTICO & CALIBRAÇÃO
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Controle patrimonial de parafusadeiras, torquímetros, dispositivos poka-yoke e calibração por posto de trabalho
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow flex items-center gap-1.5 cursor-pointer transition"
        >
          <i className="fa-solid fa-plus"></i> Cadastrar Ferramenta
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Pesquisar:</label>
          <input
            type="text"
            placeholder="Nome, Patrimônio, Posto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Status de Calibração:</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-white"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="CALIBRADO">Calibrado (Conforme)</option>
            <option value="A_VENCER">A Vencer (Atenção)</option>
            <option value="VENCIDO">Vencido (Bloqueado)</option>
          </select>
        </div>
        <div className="flex items-end">
          <span className="text-xs text-slate-400">
            Total Encontrado: <strong className="text-white">{filtered.length}</strong> itens
          </span>
        </div>
      </div>

      {/* Tabela */}
      <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950 shadow-inner">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-900 text-slate-300 font-mono text-[10px] uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">Código Patrimônio</th>
              <th className="p-3">Equipamento / Ferramenta</th>
              <th className="p-3">Posto Alocado</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Status Calibração</th>
              <th className="p-3">Validade</th>
              <th className="p-3">Responsável</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {filtered.map(f => (
              <tr key={f.id} className="hover:bg-slate-900/50 transition">
                <td className="p-3 font-bold text-amber-300">{f.codigo}</td>
                <td className="p-3 text-white font-sans font-bold">{f.nome}</td>
                <td className="p-3">
                  <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/40 font-bold">
                    {f.posto} ({f.linha})
                  </span>
                </td>
                <td className="p-3 text-slate-300">{f.tipo}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    f.status === 'CALIBRADO' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                    f.status === 'A_VENCER' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-red-500/20 text-red-400 border-red-500/40'
                  }`}>
                    {f.status}
                  </span>
                </td>
                <td className="p-3 text-slate-300">{f.validade}</td>
                <td className="p-3 text-slate-400">{f.responsavel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Cadastro */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <form onSubmit={handleSalvar} className="bg-slate-900 border border-slate-700 p-5 rounded-2xl shadow-2xl w-full max-w-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-plus text-amber-400"></i> Cadastrar Nova Ferramenta / Equipamento
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Código Patrimonial:</label>
                  <input
                    type="text"
                    placeholder="Ex: PAT-55102"
                    value={novoCodigo}
                    onChange={e => setNovoCodigo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tipo:</label>
                  <input
                    type="text"
                    value={novoTipo}
                    onChange={e => setNovoTipo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Nome / Descrição:</label>
                <input
                  type="text"
                  placeholder="Nome do dispositivo ou parafusadeira..."
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Posto de Trabalho (PDT):</label>
                  <input
                    type="text"
                    value={novoPosto}
                    onChange={e => setNovoPosto(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Linha:</label>
                  <select
                    value={novaLinha}
                    onChange={e => setNovaLinha(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono"
                  >
                    <option value="L3">Linha L3</option>
                    <option value="L1">Linha L1</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold shadow cursor-pointer"
              >
                Salvar Ferramenta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
