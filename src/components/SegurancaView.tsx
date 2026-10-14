import React, { useState } from 'react';
import { 
  PiramideHeinrichData, 
  QuaseAcidenteRecord, 
  InspecaoEpiRecord, 
  LinhaCodigo 
} from '../types/mapa';

interface SegurancaViewProps {
  heinrichData: PiramideHeinrichData;
  onUpdateHeinrich: (data: PiramideHeinrichData) => void;
  quaseAcidentes: QuaseAcidenteRecord[];
  onSaveQuaseAcidente: (qa: QuaseAcidenteRecord) => void;
  inspecoesEpi: InspecaoEpiRecord[];
  onSaveInspecaoEpi: (epi: InspecaoEpiRecord) => void;
  safetyCross: Record<number, string>;
  onUpdateSafetyCross: (day: number, status: string) => void;
}

export function SegurancaView({
  heinrichData,
  onUpdateHeinrich,
  quaseAcidentes,
  onSaveQuaseAcidente,
  inspecoesEpi,
  onSaveInspecaoEpi,
  safetyCross,
  onUpdateSafetyCross
}: SegurancaViewProps) {
  const [activeTab, setActiveTab] = useState<'HEINRICH' | 'SAFETY_CROSS' | 'QUASE_ACIDENTES' | 'EPIS'>('HEINRICH');
  const [filtroLinha, setFiltroLinha] = useState<LinhaCodigo>('L3');

  // Modal para Novo Quase-Acidente
  const [modalQaOpen, setModalQaOpen] = useState(false);
  const [novoQa, setNovoQa] = useState<QuaseAcidenteRecord>({
    id: `QA-${Date.now()}`,
    data: '14/10/2026',
    turno: '1º TURNO',
    linhaId: 'L3',
    postoOuArea: 'Chassi L3 (PDT 87)',
    tipo: 'QUASE_ACIDENTE',
    descricao: '',
    acaoImediata: '',
    responsavelAcao: 'WHS SEGURANÇA',
    status: 'ABERTO',
    gravidade: 'MEDIA'
  });

  // Modal para Nova Inspeção de EPI
  const [modalEpiOpen, setModalEpiOpen] = useState(false);
  const [novoEpi, setNovoEpi] = useState<InspecaoEpiRecord>({
    id: `EPI-${Date.now()}`,
    data: '14/10/2026',
    auditorNome: 'AVELINO DA SILVA',
    postoTrabalho: 'OP 87 - L3',
    operadorNome: '',
    oculosSeguranca: true,
    luvasApropriadas: true,
    calcadoSegurancaBiqueira: true,
    protetorAuricular: true,
    vestimentaConforme: true,
    statusFinal: 'CONFORME'
  });

  const handleSalvarQa = () => {
    onSaveQuaseAcidente(novoQa);
    // Incrementa contagem de quase acidentes ou condições inseguras no Heinrich
    if (novoQa.tipo === 'QUASE_ACIDENTE') {
      onUpdateHeinrich({ ...heinrichData, quaseAcidentes: heinrichData.quaseAcidentes + 1 });
    } else if (novoQa.tipo === 'CONDICAO_INSEGURA') {
      onUpdateHeinrich({ ...heinrichData, condicoesInseguras: heinrichData.condicoesInseguras + 1 });
    }
    setModalQaOpen(false);
  };

  const handleSalvarEpi = () => {
    const conforms = novoEpi.oculosSeguranca && novoEpi.luvasApropriadas && novoEpi.calcadoSegurancaBiqueira && novoEpi.protetorAuricular && novoEpi.vestimentaConforme;
    onSaveInspecaoEpi({ ...novoEpi, statusFinal: conforms ? 'CONFORME' : 'NAO_CONFORME' });
    setModalEpiOpen(false);
  };

  // Cores do Safety Cross
  const getCrossColor = (status: string) => {
    if (status === 'RED') return 'bg-red-600 text-white';
    if (status === 'ORANGE' || status === 'AMBER') return 'bg-amber-500 text-slate-950';
    return 'bg-emerald-600 text-white';
  };

  const cycleDayStatus = (day: number) => {
    const current = safetyCross[day] || 'GREEN';
    const next = current === 'GREEN' ? 'AMBER' : current === 'AMBER' ? 'RED' : 'GREEN';
    onUpdateSafetyCross(day, next);
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
              SEGURANÇA DO TRABALHO & WHS
            </span>
            <span className="text-xs text-slate-400 font-mono">STELLANTIS ZERO ACCIDENT</span>
          </div>
          <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-amber-400"></i> Ferramentas de Segurança Operacional da Planta
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pirâmide de Heinrich, Safety Cross interativo, Gestão de Quase-Acidentes e Auditorias de EPIs nos postos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalQaOpen(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition"
          >
            <i className="fa-solid fa-triangle-exclamation"></i> Relatar Quase-Acidente
          </button>
        </div>
      </div>

      {/* Tabs Internas */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2">
        {[
          { id: 'HEINRICH', label: 'Pirâmide de Heinrich', icon: 'fa-cubes-stacked' },
          { id: 'SAFETY_CROSS', label: 'Cruz de Segurança (Safety Cross)', icon: 'fa-cross' },
          { id: 'QUASE_ACIDENTES', label: `Quase-Acidentes & Desvios (${quaseAcidentes.length})`, icon: 'fa-triangle-exclamation' },
          { id: 'EPIS', label: `Auditoria de EPIs (${inspecoesEpi.length})`, icon: 'fa-vest' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. PIRÂMIDE DE HEINRICH */}
      {activeTab === 'HEINRICH' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-cubes-stacked text-amber-400"></i> Pirâmide de Prevenção de Heinrich (Linha 3 & Geral)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Prevenção na Base</span>
            </div>

            {/* Representação Gráfica da Pirâmide */}
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              {/* Nível 1: Fatalidade */}
              <div className="w-36 bg-red-700 text-white text-center py-2 rounded-t-lg shadow-lg border border-red-500">
                <span className="text-[10px] font-bold block uppercase">1. Fatalidade</span>
                <strong className="text-base font-black font-mono">{heinrichData.fatalidade}</strong>
              </div>

              {/* Nível 2: Com Afastamento */}
              <div className="w-48 bg-red-600 text-white text-center py-2 shadow-lg border border-red-400">
                <span className="text-[10px] font-bold block uppercase">2. Com Afastamento (LTI)</span>
                <strong className="text-base font-black font-mono">{heinrichData.comAfastamento}</strong>
              </div>

              {/* Nível 3: Sem Afastamento */}
              <div className="w-64 bg-orange-600 text-white text-center py-2 shadow-lg border border-orange-400">
                <span className="text-[10px] font-bold block uppercase">3. Sem Afastamento</span>
                <strong className="text-base font-black font-mono">{heinrichData.semAfastamento}</strong>
              </div>

              {/* Nível 4: Primeiros Socorros */}
              <div className="w-80 bg-amber-500 text-slate-950 text-center py-2 shadow-lg border border-amber-300">
                <span className="text-[10px] font-bold block uppercase">4. Primeiros Socorros</span>
                <strong className="text-base font-black font-mono">{heinrichData.primeirosSocorros}</strong>
              </div>

              {/* Nível 5: Quase-Acidentes (Near Miss) */}
              <div className="w-96 max-w-full bg-emerald-600 text-white text-center py-2.5 shadow-lg border border-emerald-400">
                <span className="text-[10px] font-bold block uppercase">5. Quase-Acidentes (Near Miss)</span>
                <strong className="text-base font-black font-mono">{heinrichData.quaseAcidentes} relatos</strong>
              </div>

              {/* Nível 6: Condições Inseguras / Desvios na Base */}
              <div className="w-full max-w-lg bg-sky-700 text-white text-center py-3 rounded-b-lg shadow-lg border border-sky-400">
                <span className="text-[10px] font-bold block uppercase">6. Condições Inseguras & Desvios Eliminados</span>
                <strong className="text-lg font-black font-mono">{heinrichData.condicoesInseguras} tratados</strong>
              </div>
            </div>
          </div>

          {/* Painel Lateral com Diretrizes Stellantis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase flex items-center gap-2">
              <i className="fa-solid fa-circle-info"></i> Diretriz Stellantis WHS
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quanto maior o número de <strong>Condições Inseguras</strong> e <strong>Quase-Acidentes</strong> relatados e eliminados na base, menor a probabilidade de acidentes com ou sem afastamento no topo.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Dias Sem Acidentes LTI:</span>
                <strong className="text-emerald-400 font-mono text-sm">342 Dias</strong>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Taxa de Frequência (TF):</span>
                <strong className="text-sky-400 font-mono text-sm">0.00</strong>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Taxa de Gravidade (TG):</span>
                <strong className="text-sky-400 font-mono text-sm">0.00</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalQaOpen(true)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow"
              >
                + Registrar Desvio / Quase Acidente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CRUZ DE SEGURANÇA (SAFETY CROSS) */}
      {activeTab === 'SAFETY_CROSS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-cross text-amber-400"></i> Cruz de Segurança Mensal (Outubro / 2026)
              </h3>
              <p className="text-xs text-slate-400">
                Clique em qualquer dia para alternar o status: <strong className="text-emerald-400">Verde</strong> (Sem ocorrência) → <strong className="text-amber-300">Amarelo</strong> (Quase acidente/1º socorros) → <strong className="text-red-400">Vermelho</strong> (Acidente).
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Conforme (OK)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> Alerta / 1º Socorros
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600"></span> Acidente
              </span>
            </div>
          </div>

          {/* Renderização em formato de Cruz */}
          <div className="flex justify-center py-6">
            <div className="grid grid-cols-7 gap-2 max-w-md w-full">
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const status = safetyCross[day] || 'GREEN';
                return (
                  <button
                    key={day}
                    onClick={() => cycleDayStatus(day)}
                    className={`h-11 rounded-lg font-bold font-mono text-sm flex flex-col items-center justify-center transition shadow cursor-pointer border border-black/20 ${getCrossColor(status)}`}
                  >
                    <span>{day}</span>
                    <span className="text-[8px] font-normal opacity-80">
                      {status === 'GREEN' ? 'OK' : status === 'AMBER' ? 'ALERTA' : 'KO'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. LISTA DE QUASE-ACIDENTES & DESVIOS */}
      {activeTab === 'QUASE_ACIDENTES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-400"></i> Relatos de Quase-Acidentes e Condições Inseguras
            </h3>
            <button
              onClick={() => setModalQaOpen(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <i className="fa-solid fa-plus"></i> Novo Relato
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300 font-bold">
                <tr>
                  <th className="p-2.5">Data / Turno</th>
                  <th className="p-2.5">Local / Posto</th>
                  <th className="p-2.5">Tipo</th>
                  <th className="p-2.5">Descrição do Desvio</th>
                  <th className="p-2.5">Ação Imediata de Bloqueio</th>
                  <th className="p-2.5">Responsável</th>
                  <th className="p-2.5">Gravidade</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {quaseAcidentes.map(qa => (
                  <tr key={qa.id} className="hover:bg-slate-850">
                    <td className="p-2.5 font-mono text-slate-300">{qa.data} ({qa.turno})</td>
                    <td className="p-2.5 font-bold text-white">{qa.postoOuArea}</td>
                    <td className="p-2.5 font-mono text-amber-400">{qa.tipo}</td>
                    <td className="p-2.5 text-slate-200">{qa.descricao}</td>
                    <td className="p-2.5 text-emerald-400">{qa.acaoImediata}</td>
                    <td className="p-2.5 text-slate-300">{qa.responsavelAcao}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        qa.gravidade === 'ALTA' ? 'bg-red-500/20 text-red-400' :
                        qa.gravidade === 'MEDIA' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                      }`}>
                        {qa.gravidade}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        qa.status === 'CONCLUIDO' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {qa.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. AUDITORIA DE EPIs */}
      {activeTab === 'EPIS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-vest text-amber-400"></i> Auditorias de EPIs nos Postos de Trabalho
            </h3>
            <button
              onClick={() => setModalEpiOpen(true)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <i className="fa-solid fa-plus"></i> Nova Inspeção
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300 font-bold">
                <tr>
                  <th className="p-2.5">Data</th>
                  <th className="p-2.5">Posto (PDT)</th>
                  <th className="p-2.5">Operador</th>
                  <th className="p-2.5 text-center">Óculos</th>
                  <th className="p-2.5 text-center">Luvas</th>
                  <th className="p-2.5 text-center">Calçado</th>
                  <th className="p-2.5 text-center">Auricular</th>
                  <th className="p-2.5 text-center">Vestimenta</th>
                  <th className="p-2.5 text-center">Status Final</th>
                  <th className="p-2.5">Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {inspecoesEpi.map(epi => (
                  <tr key={epi.id} className="hover:bg-slate-850">
                    <td className="p-2.5 font-mono text-slate-300">{epi.data}</td>
                    <td className="p-2.5 font-bold text-white font-mono">{epi.postoTrabalho}</td>
                    <td className="p-2.5 text-slate-200">{epi.operadorNome}</td>
                    <td className="p-2.5 text-center">{epi.oculosSeguranca ? '✅' : '❌'}</td>
                    <td className="p-2.5 text-center">{epi.luvasApropriadas ? '✅' : '❌'}</td>
                    <td className="p-2.5 text-center">{epi.calcadoSegurancaBiqueira ? '✅' : '❌'}</td>
                    <td className="p-2.5 text-center">{epi.protetorAuricular ? '✅' : '❌'}</td>
                    <td className="p-2.5 text-center">{epi.vestimentaConforme ? '✅' : '❌'}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        epi.statusFinal === 'CONFORME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {epi.statusFinal}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-400">{epi.auditorNome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Novo Quase-Acidente */}
      {modalQaOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation text-amber-400"></i> Relatar Desvio / Quase-Acidente
              </h3>
              <button onClick={() => setModalQaOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tipo de Evento:</label>
                  <select
                    value={novoQa.tipo}
                    onChange={e => setNovoQa({ ...novoQa, tipo: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    <option value="QUASE_ACIDENTE">Quase-Acidente (Near Miss)</option>
                    <option value="CONDICAO_INSEGURA">Condição Insegura</option>
                    <option value="PRIMEIROS_SOCORROS">Primeiros Socorros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Gravidade Potencial:</label>
                  <select
                    value={novoQa.gravidade}
                    onChange={e => setNovoQa({ ...novoQa, gravidade: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Local / Posto de Trabalho:</label>
                <input
                  type="text"
                  value={novoQa.postoOuArea}
                  onChange={e => setNovoQa({ ...novoQa, postoOuArea: e.target.value })}
                  placeholder="Ex: Chassi L3 - PDT 87"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descrição do Ocorrido / Desvio:</label>
                <textarea
                  rows={2}
                  value={novoQa.descricao}
                  onChange={e => setNovoQa({ ...novoQa, descricao: e.target.value })}
                  placeholder="Descreva o que ocorreu ou a situação de risco identificada..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ação Imediata de Contenção:</label>
                <input
                  type="text"
                  value={novoQa.acaoImediata}
                  onChange={e => setNovoQa({ ...novoQa, acaoImediata: e.target.value })}
                  placeholder="Ex: Área isolada com fita zebrada e supervisor notificado"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalQaOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarQa}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold shadow cursor-pointer"
              >
                Registrar Ocorrência
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Nova Inspeção de EPI */}
      {modalEpiOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-vest text-amber-400"></i> Nova Inspeção de EPI no Posto
              </h3>
              <button onClick={() => setModalEpiOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Posto de Trabalho (PDT):</label>
                <input
                  type="text"
                  value={novoEpi.postoTrabalho}
                  onChange={e => setNovoEpi({ ...novoEpi, postoTrabalho: e.target.value })}
                  placeholder="OP 87"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nome do Operador Inspecionado:</label>
                <input
                  type="text"
                  value={novoEpi.operadorNome}
                  onChange={e => setNovoEpi({ ...novoEpi, operadorNome: e.target.value })}
                  placeholder="Nome do Operador"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Checklist de EPIs Obrigatórios:</span>
                {[
                  { key: 'oculosSeguranca', label: 'Óculos de Segurança com Proteção Lateral' },
                  { key: 'luvasApropriadas', label: 'Luvas Adequadas à Operação (PU / Antivibração)' },
                  { key: 'calcadoSegurancaBiqueira', label: 'Calçado com Biqueira de Composite / Aço' },
                  { key: 'protetorAuricular', label: 'Protetor Auricular Tipo Plug ou Concha' },
                  { key: 'vestimentaConforme', label: 'Uniforme Padrão Stellantis Ajustado' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(novoEpi as any)[item.key]}
                      onChange={e => setNovoEpi({ ...novoEpi, [item.key]: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalEpiOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarEpi}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold shadow cursor-pointer"
              >
                Concluir Auditoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
