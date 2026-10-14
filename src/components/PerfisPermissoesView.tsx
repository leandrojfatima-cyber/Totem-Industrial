import React from 'react';
import { UserRole } from '../types/mapa';

interface PerfisPermissoesViewProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export function PerfisPermissoesView({ currentRole, onChangeRole }: PerfisPermissoesViewProps) {
  const perfisConfig: {
    role: UserRole;
    titulo: string;
    descricao: string;
    nivel: string;
    permissoes: {
      verMapa: boolean;
      editarMapa: boolean;
      lancarTotem: boolean;
      aprovarAcoes: boolean;
      cadastrosMestres: boolean;
      administracao: boolean;
    };
  }[] = [
    {
      role: 'CONTA_MASTER',
      titulo: 'Conta Máster Stellantis',
      descricao: 'Gestão executiva irrestrita: criação e personalização de UTEs, Trechos, Domínios, Totens e PDTs em tempo de execução',
      nivel: 'N0 • Conta Máster Global',
      permissoes: { verMapa: true, editarMapa: true, lancarTotem: true, aprovarAcoes: true, cadastrosMestres: true, administracao: true }
    },
    {
      role: 'OPERADOR',
      titulo: 'Operador de Montagem',
      descricao: 'Operador de linha titular ou polivalente alocado no posto de trabalho',
      nivel: 'N1 • Operacional',
      permissoes: { verMapa: true, editarMapa: false, lancarTotem: true, aprovarAcoes: false, cadastrosMestres: false, administracao: false }
    },
    {
      role: 'TEAM_LEADER',
      titulo: 'Team Leader (T-Leader)',
      descricao: 'Líder direto de equipe responsável pelo briefing, Gemba, 331 e gestão do Totem',
      nivel: 'N2 • Liderança Direta',
      permissoes: { verMapa: true, editarMapa: false, lancarTotem: true, aprovarAcoes: true, cadastrosMestres: true, administracao: false }
    },
    {
      role: 'LIDER',
      titulo: 'Líder de Área / Setor',
      descricao: 'Responsável pelo trecho produtivo e validação de auditorias SWA e BP8',
      nivel: 'N3 • Supervisão de Trecho',
      permissoes: { verMapa: true, editarMapa: false, lancarTotem: true, aprovarAcoes: true, cadastrosMestres: true, administracao: false }
    },
    {
      role: 'SHIFT',
      titulo: 'Líder de Turno (Shift)',
      descricao: 'Gestor da operação fabril durante todo o turno produtivo',
      nivel: 'N4 • Gestão de Turno',
      permissoes: { verMapa: true, editarMapa: false, lancarTotem: true, aprovarAcoes: true, cadastrosMestres: true, administracao: false }
    },
    {
      role: 'SUPERVISAO',
      titulo: 'Supervisão de Produção',
      descricao: 'Supervisão executiva das linhas de montagem, OPE e paradas de linha',
      nivel: 'N5 • Supervisão Fabril',
      permissoes: { verMapa: true, editarMapa: true, lancarTotem: true, aprovarAcoes: true, cadastrosMestres: true, administracao: false }
    },
    {
      role: 'GERENTE',
      titulo: 'Gerente da Fábrica',
      descricao: 'Gestão geral da planta industrial, auditorias globais e compliance',
      nivel: 'N6 • Diretoria / Gerência',
      permissoes: { verMapa: true, editarMapa: true, lancarTotem: true, aprovarAcoes: true, cadastrosMestres: true, administracao: true }
    },
    {
      role: 'SEGURANCA',
      titulo: 'Segurança & WHS / CI',
      descricao: 'Auditorias de segurança, ergonomia SWA, pirâmide de Heinrich e acidentes',
      nivel: 'N7 • Auditoria & WHS',
      permissoes: { verMapa: true, editarMapa: false, lancarTotem: true, aprovarAcoes: true, cadastrosMestres: false, administracao: false }
    },
    {
      role: 'ADMINISTRADOR',
      titulo: 'Administrador do Sistema',
      descricao: 'Acesso irrestrito a configurações de layout do mapa SVG, cadastros e banco de dados',
      nivel: 'N8 • Administrador Total',
      permissoes: { verMapa: true, editarMapa: true, lancarTotem: true, aprovarAcoes: true, cadastrosMestres: true, administracao: true }
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-5 shadow-xl font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-400 text-xs px-2.5 py-0.5 rounded border border-sky-500/40 font-mono font-bold">
              ESTRUTURA HIERÁRQUICA & CONTROLE DE ACESSO
            </span>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <i className="fa-solid fa-user-shield text-sky-400"></i> PERFIS DE USUÁRIO & MATRIZ DE PERMISSÕES
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Definição de perfis, alçada de aprovação e hierarquia industrial da Stellantis
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-xs">
          <span className="text-slate-400">Perfil Ativo no Sistema:</span>
          <span className="text-amber-300 font-black">{currentRole}</span>
        </div>
      </div>

      {/* Cadeia de Hierarquia Visual */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
        <h3 className="text-xs font-bold text-sky-400 font-mono uppercase flex items-center gap-2">
          <i className="fa-solid fa-sitemap"></i> Hierarquia Organizacional do Sistema Totem
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
          <div className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold shadow">
            1. Fábrica (Betim VHI)
          </div>
          <span className="text-slate-500 font-bold">➔</span>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-sky-300 border border-slate-700 font-bold">
            2. Linha (L1 / L3)
          </div>
          <span className="text-slate-500 font-bold">➔</span>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 font-bold">
            3. Posto de Trabalho (PDT)
          </div>
          <span className="text-slate-500 font-bold">➔</span>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 font-bold">
            4. Totem do Posto
          </div>
          <span className="text-slate-500 font-bold">➔</span>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 font-bold">
            5. Team Leader
          </div>
          <span className="text-slate-500 font-bold">➔</span>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold">
            6. Operadores
          </div>
        </div>
      </div>

      {/* Tabela de Perfis e Permissões */}
      <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950 shadow-inner">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-900 text-slate-300 font-mono text-[10px] uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">Perfil / Cargo</th>
              <th className="p-3">Nível Hierárquico</th>
              <th className="p-3 text-center">Ver Mapa</th>
              <th className="p-3 text-center">Editar Mapa</th>
              <th className="p-3 text-center">Lançar no Totem</th>
              <th className="p-3 text-center">Aprovar Ações</th>
              <th className="p-3 text-center">Cadastros</th>
              <th className="p-3 text-center">Admin Geral</th>
              <th className="p-3 text-right">Simular Acesso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {perfisConfig.map(p => {
              const isCurrent = currentRole === p.role;
              return (
                <tr key={p.role} className={`transition ${isCurrent ? 'bg-sky-950/40' : 'hover:bg-slate-900/50'}`}>
                  <td className="p-3">
                    <strong className="text-white font-sans text-xs block">{p.titulo}</strong>
                    <span className="text-[10px] text-slate-400 font-sans block max-w-xs">{p.descricao}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sky-300 font-bold text-[10px]">{p.nivel}</span>
                  </td>
                  <td className="p-3 text-center">{p.permissoes.verMapa ? '✅' : '❌'}</td>
                  <td className="p-3 text-center">{p.permissoes.editarMapa ? '✅' : '❌'}</td>
                  <td className="p-3 text-center">{p.permissoes.lancarTotem ? '✅' : '❌'}</td>
                  <td className="p-3 text-center">{p.permissoes.aprovarAcoes ? '✅' : '❌'}</td>
                  <td className="p-3 text-center">{p.permissoes.cadastrosMestres ? '✅' : '❌'}</td>
                  <td className="p-3 text-center">{p.permissoes.administracao ? '✅' : '❌'}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onChangeRole(p.role)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {isCurrent ? '● Ativo' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
