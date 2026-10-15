import React, { useState } from 'react';
import { NavigationMenuItem, UserRole } from '../types/mapa';

export const NAVIGATION_MENU_CONFIG: NavigationMenuItem[] = [
  {
    id: 'GRUPO_OPERACAO',
    label: '1. Operação',
    icon: 'fa-diagram-project',
    children: [
      { id: 'MAPA_LINHA', label: 'Mapa da Linha de Produção', icon: 'fa-map-location-dot', badge: 'Betim L3+L1' },
      { id: 'GEMBA', label: 'Gemba Walk (FCI_SA_008)', icon: 'fa-shoe-prints' },
      { id: 'A1_BRIEFING', label: 'Folha A1 Briefing', icon: 'fa-map' },
      { id: 'LAP', label: 'Ações LAP (Kanban)', icon: 'fa-list-check' }
    ]
  },
  {
    id: 'GRUPO_QUALIDADE',
    label: '2. Qualidade & Processo',
    icon: 'fa-certificate',
    children: [
      { id: 'QUALIDADE', label: 'Gestão da Qualidade (KPIs)', icon: 'fa-award', badge: 'Custom' },
      { id: 'ROTINA', label: 'Rotinas de Turno', icon: 'fa-arrows-rotate' },
      { id: 'AMOSTRAL', label: 'Controle Amostral (BP8)', icon: 'fa-clipboard-check' },
      { id: 'MEDIDA', label: 'Medidas Conservatórias (BP9)', icon: 'fa-shield-halved' },
      { id: 'RED_RABBIT', label: 'Red Hat / Poka-Yoke', icon: 'fa-bug' },
      { id: 'SWA', label: 'Auditorias SWA', icon: 'fa-magnifying-glass' }
    ]
  },
  {
    id: 'GRUPO_SEGURANCA',
    label: '3. Segurança do Trabalho',
    icon: 'fa-shield-halved',
    children: [
      { id: 'SEGURANCA', label: 'Painel de Segurança (WHS)', icon: 'fa-person-falling-burst', badge: 'Heinrich' },
      { id: 'ESCALADA', label: 'Segurança & Andon (F12)', icon: 'fa-bell' },
      { id: 'WHS', label: 'Conversa WHS', icon: 'fa-comments' }
    ]
  },
  {
    id: 'GRUPO_PESSOAS',
    label: '4. Pessoas & Gestão',
    icon: 'fa-users',
    children: [
      { id: 'CADASTRO_TL', label: 'Team Leaders', icon: 'fa-user-tie' },
      { id: 'POLIVALENCIA', label: 'Polivalência (331)', icon: 'fa-graduation-cap' }
    ]
  },
  {
    id: 'GRUPO_SIS_MELHORIA',
    label: '5. SIS & Workplace Org.',
    icon: 'fa-industry',
    children: [
      { id: 'SIS_WO', label: 'SIS & WO (Workplace Org.)', icon: 'fa-file-lines', badge: 'SOS + 5S' },
      { id: 'FERRAMENTAL_PATRIMONIO', label: 'Ferramental / Patrimônio', icon: 'fa-wrench' },
      { id: 'KAIZEN', label: 'Banco Kaizen / 5-Why', icon: 'fa-lightbulb' }
    ]
  },
  {
    id: 'GRUPO_CADASTROS',
    label: '6. Cadastros Industriais',
    icon: 'fa-sliders',
    children: [
      { id: 'CADASTRO_LINHAS', label: 'Linhas de Produção', icon: 'fa-industry' },
      { id: 'CADASTRO_PDT', label: 'Postos de Trabalho (PDT)', icon: 'fa-network-wired' },
      { id: 'CADASTRO_OPERACOES', label: 'Operações & Ciclos', icon: 'fa-stopwatch-20' },
      { id: 'CADASTROS', label: 'Cadastros Mestres (Geral)', icon: 'fa-database' }
    ]
  },
  {
    id: 'GRUPO_ADMIN',
    label: '7. Conta Máster & Admin',
    icon: 'fa-gear',
    children: [
      { id: 'GESTAO_MASTER', label: 'Editor Conta Máster', icon: 'fa-sitemap', badge: 'Hierarquia' },
      { id: 'PERFIS_PERMISSOES', label: 'Perfis & Permissões', icon: 'fa-user-shield' },
      { id: 'MAPA_EDICAO', label: 'Modo Edição do Mapa', icon: 'fa-pen-to-square', badge: 'Admin' },
      { id: 'LOGS', label: 'Logs do Sistema', icon: 'fa-clock-rotate-left' },
      { id: 'RELATORIOS', label: 'Relatórios & Backup JSON', icon: 'fa-download' }
    ]
  }
];

interface SidebarNavigationProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  theme: 'light' | 'dark';
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onSetTheme?: (theme: 'light' | 'dark') => void;
}

export function SidebarNavigation({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapsed,
  theme,
  currentRole,
  onChangeRole,
  onSetTheme
}: SidebarNavigationProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    GRUPO_OPERACAO: true,
    GRUPO_QUALIDADE: false,
    GRUPO_SEGURANCA: false,
    GRUPO_PESSOAS: false,
    GRUPO_SIS_MELHORIA: false,
    GRUPO_CADASTROS: false,
    GRUPO_ADMIN: false
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const rolesList: { role: UserRole; label: string }[] = [
    { role: 'CONTA_MASTER', label: 'CONTA MÁSTER' },
    { role: 'ADMINISTRADOR', label: 'ADMINISTRADOR' },
    { role: 'SUPERVISAO', label: 'SUPERVISÃO' },
    { role: 'LIDER', label: 'LÍDER DE LINHA' },
    { role: 'TEAM_LEADER', label: 'TEAM LEADER' },
    { role: 'SEGURANCA', label: 'SEGURANÇA WHS' },
    { role: 'OPERADOR', label: 'OPERADOR' }
  ];

  return (
    <aside
      className={`transition-all duration-300 ease-in-out shrink-0 flex flex-col z-20 border-r select-none sis-bg-surface ${
        collapsed ? 'w-16' : 'w-72'
      }`}
      style={{ borderColor: 'var(--sis-border-main)' }}
    >
      {/* Cabeçalho */}
      <div
        className="p-3 border-b flex items-center justify-between sis-bg-surface-elevated"
        style={{ borderColor: 'var(--sis-border-main)' }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0 sis-shadow-sm"
              style={{ backgroundColor: 'var(--sis-blue-primary)' }}>
              <i className="fa-solid fa-industry"></i>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-black tracking-wider font-mono truncate" style={{ color: 'var(--sis-blue-text)' }}>
                STELLANTIS
              </span>
              <span className="text-[10px] font-bold truncate sis-text-muted">
                SIS Totem Betim
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapsed}
          className="p-1.5 rounded-lg transition cursor-pointer flex items-center justify-center hover:opacity-80"
          style={{ color: 'var(--sis-text-muted)' }}
          title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          <i className={`fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'} text-sm`}></i>
        </button>
      </div>

      {/* Seletor de Perfil */}
      {!collapsed && (
        <div
          className="p-2.5 border-b text-xs sis-bg-surface-subtle"
          style={{ borderColor: 'var(--sis-border-main)' }}
        >
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[10px] uppercase font-mono font-bold sis-text-muted">Perfil Ativo:</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--sis-blue-text)' }}>
              {currentRole}
            </span>
          </div>
          <select
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="w-full py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer font-mono sis-input-bg sis-input-border sis-input-text sis-shadow-sm"
          >
            {rolesList.map(r => (
              <option key={r.role} value={r.role}>{r.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Lista de Grupos */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1.5">
        {NAVIGATION_MENU_CONFIG.map(group => {
          const isExpanded = expandedGroups[group.id] ?? false;
          const hasActiveChild = group.children?.some(c => c.id === activeTab);

          return (
            <div key={group.id} className="rounded-xl overflow-hidden">
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  hasActiveChild ? '' : 'hover:opacity-80'
                }`}
                style={hasActiveChild
                  ? { backgroundColor: 'var(--sis-blue-bg)', color: 'var(--sis-blue-text)' }
                  : { color: 'var(--sis-text-secondary)' }
                }
                title={collapsed ? group.label : undefined}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <i className={`fa-solid ${group.icon} text-sm w-4 text-center ${
                    hasActiveChild ? '' : ''
                  }`} style={{ color: hasActiveChild ? 'var(--sis-blue-text)' : 'var(--sis-text-muted)' }}></i>
                  {!collapsed && <span className="truncate">{group.label}</span>}
                </div>
                {!collapsed && (
                  <i
                    className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    style={{ color: 'var(--sis-text-muted)' }}
                  ></i>
                )}
              </button>

              {isExpanded && group.children && (
                <div
                  className={`mt-1 space-y-0.5 ${!collapsed ? 'pl-4 border-l-2 ml-3' : ''}`}
                  style={{ borderColor: 'var(--sis-border-main)' }}
                >
                  {group.children.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectTab(item.id)}
                        className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer text-left ${
                          isActive ? 'shadow font-bold' : 'hover:opacity-80'
                        }`}
                        style={isActive
                          ? { backgroundColor: 'var(--sis-blue-primary)', color: '#FFFFFF' }
                          : { color: 'var(--sis-text-secondary)' }
                        }
                        title={collapsed ? item.label : undefined}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <i
                            className={`fa-solid ${item.icon} text-xs w-4 text-center`}
                            style={{ color: isActive ? '#FFFFFF' : 'var(--sis-blue-text)' }}
                          ></i>
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!collapsed && item.badge && (
                          <span
                            className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold"
                            style={isActive
                              ? { backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }
                              : { backgroundColor: 'var(--sis-bg-surface-elevated)', color: 'var(--sis-blue-text)', border: '1px solid var(--sis-border-main)' }
                            }
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rodapé: Seletor de Tema + Versão */}
      <div className="flex flex-col border-t" style={{ borderColor: 'var(--sis-border-main)' }}>
        {!collapsed && onSetTheme && (
          <div className="p-2 border-b sis-bg-surface-subtle" style={{ borderColor: 'var(--sis-border-subtle)' }}>
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider sis-text-muted">
                Tema Visual:
              </span>
              <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--sis-blue-text)' }}>
                {theme === 'light' ? 'Modo Claro' : 'Modo Escuro'}
              </span>
            </div>
            <div
              className="grid grid-cols-2 gap-1 p-1 rounded-lg border sis-bg-surface"
              style={{ borderColor: 'var(--sis-border-main)' }}
            >
              <button
                type="button"
                onClick={() => onSetTheme('light')}
                className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-bold transition cursor-pointer ${
                  theme === 'light' ? 'shadow-xs font-black' : 'hover:opacity-80'
                }`}
                style={theme === 'light'
                  ? { backgroundColor: '#FBBF24', color: '#0F172A' }
                  : { color: 'var(--sis-text-muted)' }
                }
              >
                <i className="fa-solid fa-sun text-xs"></i>
                <span className="text-[10px]">Claro</span>
              </button>
              <button
                type="button"
                onClick={() => onSetTheme('dark')}
                className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-bold transition cursor-pointer ${
                  theme === 'dark' ? 'shadow-xs font-black' : 'hover:opacity-80'
                }`}
                style={theme === 'dark'
                  ? { backgroundColor: 'var(--sis-blue-primary)', color: '#FFFFFF' }
                  : { color: 'var(--sis-text-muted)' }
                }
              >
                <i className="fa-solid fa-moon text-xs"></i>
                <span className="text-[10px]">Escuro</span>
              </button>
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="p-2 text-[10px] text-center font-mono sis-bg-surface-subtle sis-text-muted">
            SIS Totem Stellantis • Betim VHI v5.4
          </div>
        )}
      </div>
    </aside>
  );
}
