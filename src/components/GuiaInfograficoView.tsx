import React, { useState, useMemo } from 'react';
import { UserRole } from '../types/mapa';

interface GuiaInfograficoViewProps {
  currentRole: UserRole;
  onNavigateToTab: (tabId: string) => void;
  theme?: 'light' | 'dark';
}

interface ModuloInfo {
  id: string;
  tabTarget: string;
  pilarId: 'OPERACAO' | 'QUALIDADE' | 'SEGURANCA' | 'PESSOAS' | 'SIS_WO' | 'CADASTROS' | 'ADMIN';
  pilarNome: string;
  pilarCor: string;
  titulo: string;
  siglaPadrao: string;
  icone: string;
  descricaoCurta: string;
  objetivoEstrategico: string;
  fluxoPassoAPasso: string[];
  kpisChave: string[];
  normaPadrao: string;
  permissoesRecomendadas: UserRole[];
  destaqueBadge?: string;
}

export function GuiaInfograficoView({ currentRole, onNavigateToTab, theme = 'dark' }: GuiaInfograficoViewProps) {
  // Controle de Abas Internas do Guia
  const [activeGuiaSection, setActiveGuiaSection] = useState<
    'ECOSISTEMA' | 'CATALOGO_MODULOS' | 'JORNADA_TURNO' | 'HEINRICH_SEGURANCA' | 'MATRIZ_331' | 'MATRIZ_RACI' | 'PADROES_QUALIDADE'
  >('ECOSISTEMA');

  // Filtros do Catálogo de Módulos
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPilarFilter, setSelectedPilarFilter] = useState<string>('TODOS');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Pilares do Sistema
  const PILARES = [
    { id: 'OPERACAO', nome: '1. Operação & Linha', cor: '#0284C7', icone: 'fa-diagram-project', total: 4 },
    { id: 'QUALIDADE', nome: '2. Qualidade & Processo', cor: '#16A34A', icone: 'fa-certificate', total: 6 },
    { id: 'SEGURANCA', nome: '3. Segurança WHS', cor: '#DC2626', icone: 'fa-shield-halved', total: 3 },
    { id: 'PESSOAS', nome: '4. Pessoas & Gestão', cor: '#8B5CF6', icone: 'fa-users', total: 2 },
    { id: 'SIS_WO', nome: '5. SIS & Workplace Org.', cor: '#EA580C', icone: 'fa-industry', total: 3 },
    { id: 'CADASTROS', nome: '6. Cadastros Industriais', cor: '#0D9488', icone: 'fa-database', total: 4 },
    { id: 'ADMIN', nome: '7. Conta Máster & Admin', cor: '#475569', icone: 'fa-gear', total: 5 },
  ];

  // Catálogo Completo dos Módulos do Sistema
  const MODULOS: ModuloInfo[] = [
    // 1. Operação
    {
      id: 'MOD_MAPA_LINHA',
      tabTarget: 'MAPA_LINHA',
      pilarId: 'OPERACAO',
      pilarNome: '1. Operação',
      pilarCor: '#0284C7',
      titulo: 'Mapa Interativo da Linha de Produção (SVG)',
      siglaPadrao: 'Betim L3 + L1',
      icone: 'fa-map-location-dot',
      descricaoCurta: 'Visualização vetorial dinâmica e em tempo real da esteira de montagem automotiva, postos (PDT), totens de alerta e acúmulos.',
      objetivoEstrategico: 'Dar visibilidade instantânea do fluxo de valor industrial, gargalos de produção, status dos postos e distribuição dos postos de trabalho ao longo dos 9 trechos.',
      fluxoPassoAPasso: [
        'Acessar o mapa na tela principal e selecionar a visualização da Linha 3 (L3) ou Linha 1 (L1).',
        'Navegar com zoom/pan ou buscar por PDT específico no campo de pesquisa.',
        'Clicar em qualquer PDT ou Totem para abrir o painel detalhado de operações, ciclo e operador.',
        'Supervisores e admins podem alternar para o Modo Edição para reorganizar posições e parâmetros.'
      ],
      kpisChave: ['Takt Time real', 'Postos Ativos / Críticos', 'Nível de Buffer nos Acúmulos', 'Efetivo Alocado'],
      normaPadrao: 'WCM - Cost Deployment / Focused Improvement',
      permissoesRecomendadas: ['OPERADOR', 'TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER'],
      destaqueBadge: 'Core Central'
    },
    {
      id: 'MOD_GEMBA',
      tabTarget: 'GEMBA',
      pilarId: 'OPERACAO',
      pilarNome: '1. Operação',
      pilarCor: '#0284C7',
      titulo: 'Gemba Walk (FCI_SA_008)',
      siglaPadrao: 'FCI_SA_008',
      icone: 'fa-shoe-prints',
      descricaoCurta: 'Caminhada diária de verificação in loco no chão de fábrica, inspecionando Segurança, Qualidade, Entrega e Custos.',
      objetivoEstrategico: 'Identificar desvios diretamente no ponto de criação de valor, validando limites de controle LCL/UCL e gerando ações imediatas.',
      fluxoPassoAPasso: [
        'O Team Leader ou Supervisor inicia a ronda nos horários pré-estabelecidos do turno.',
        'Avalia cada ponto do checklist oficial (organização de bancada, torque, peças refugadas).',
        'Registra o valor medido e compara com os limites superior (UCL) e inferior (LCL).',
        'Desvios em Vermelho geram automaticamente um chamado para o plano de ação (LAP).'
      ],
      kpisChave: ['Índice de Aderência ao Gemba (%)', 'Parâmetros Conformes (Verde)', 'Desvios Críticos em Aberto'],
      normaPadrao: 'Stellantis Quality Standard FCI_SA_008',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_A1_BRIEFING',
      tabTarget: 'A1_BRIEFING',
      pilarId: 'OPERACAO',
      pilarNome: '1. Operação',
      pilarCor: '#0284C7',
      titulo: 'Folha A1 Briefing',
      siglaPadrao: 'Briefing A1',
      icone: 'fa-map',
      descricaoCurta: 'Reunião operacional de 5 minutos no início de cada turno com a equipe de operadores e líderes.',
      objetivoEstrategico: 'Alinhar metas de produção do dia, revisar lições aprendidas de segurança/qualidade, alertar sobre novos modelos/opcionais e alocar operadores.',
      fluxoPassoAPasso: [
        'Reunir a equipe 10 minutos antes da partida da linha no quadro de gestão visual.',
        'Revisar presença, atestados e substituições conforme matriz de polivalência.',
        'Informar a meta de volume do turno (ex: 280 veículos) e pontos de atenção com fornecedores.',
        'Registrar a realização e coletar assinaturas/confirmações da equipe.'
      ],
      kpisChave: ['Aderência ao Briefing 100%', 'Volume Planejado vs Capacidade', 'Absenteísmo do Turno'],
      normaPadrao: 'WCM - People Development & Workplace Culture',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_LAP',
      tabTarget: 'LAP',
      pilarId: 'OPERACAO',
      pilarNome: '1. Operação',
      pilarCor: '#0284C7',
      titulo: 'Ações LAP (Kanban Industrial)',
      siglaPadrao: 'LAP - Line Action Plan',
      icone: 'fa-list-check',
      descricaoCurta: 'Quadro ágil tipo Kanban para gestão e resolução de desvios operacionais da linha com rastreabilidade de prazos.',
      objetivoEstrategico: 'Garantir que nenhum problema identificado no Gemba, Briefing ou Andon fique sem dono, contenção e data de entrega definida.',
      fluxoPassoAPasso: [
        'Cadastrar nova ação especificando origem (Gemba, WHS, Qualidade), responsável e prazo.',
        'Acompanhar a evolução nas raias "Pendente", "Em Andamento" e "Concluído".',
        'Ao concluir, anexar evidência ou descrever a ação de bloqueio definitivo adotada.',
        'Ações com prazo vencido são destacadas em alerta vermelho para cobrança na escalada.'
      ],
      kpisChave: ['Taxa de Resolução de Ações (%)', 'Tempo Médio de Atendimento (MTTR)', 'Ações Vencidas'],
      normaPadrao: 'PDCA / Kaizen Problem Solving',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },

    // 2. Qualidade
    {
      id: 'MOD_QUALIDADE_KPIS',
      tabTarget: 'QUALIDADE',
      pilarId: 'QUALIDADE',
      pilarNome: '2. Qualidade & Processo',
      pilarCor: '#16A34A',
      titulo: 'Gestão da Qualidade & Painel de KPIs',
      siglaPadrao: 'KPIs Qualidade',
      icone: 'fa-award',
      descricaoCurta: 'Painel analítico consolidado com indicadores de DPU, RFT, defeitos severos A/B/C e metas industriais.',
      objetivoEstrategico: 'Controlar em tempo real a variabilidade de defeitos por veículo e assegurar conformidade com os portões de liberação do cliente final.',
      fluxoPassoAPasso: [
        'Monitorar as tendências diárias de DPU (Defeitos por Unidade) comparadas ao alvo estipulado.',
        'Analisar a distribuição de gravidade: Falhas A (Segurança/Imobilizante), B (Funcional) e C (Cosmético).',
        'Cadastrar e registrar apontamentos na lista oficial de ocorrências.',
        'Disparar reuniões de contenção caso o RFT fique abaixo do limite estipulado (ex: < 96%).'
      ],
      kpisChave: ['DPU (Defects Per Unit)', 'RFT (Right First Time %)', 'Defeitos Classe A (Zero Tolerância)'],
      normaPadrao: 'IATF 16949 / ISO 9001:2015',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER'],
      destaqueBadge: 'KPI Crítico'
    },
    {
      id: 'MOD_ROTINA_TURNO',
      tabTarget: 'ROTINA',
      pilarId: 'QUALIDADE',
      pilarNome: '2. Qualidade & Processo',
      pilarCor: '#16A34A',
      titulo: 'Rotinas de Turno (Checklist Horário)',
      siglaPadrao: 'Rotina Horária',
      icone: 'fa-arrows-rotate',
      descricaoCurta: 'Verificações programadas de hora em hora ao longo das 8 horas de trabalho para assegurar estabilidade de processo.',
      objetivoEstrategico: 'Prevenir desvios acumulados através de inspeções frequentes em parâmetros críticos (temperatura, cola, torque, ajuste).',
      fluxoPassoAPasso: [
        'A cada hora de turno (H1 até H8), o Team Leader acessa a lista de itens programados.',
        'Verifica se as estações e dispositivos estão operando dentro da janela de conformidade.',
        'Marca o status da atividade como Concluído ou registra ocorrência de desvio.',
        'Gera histórico auditável para a auditoria de processo WCM.'
      ],
      kpisChave: ['Cumprimento de Rotina Horária (%)', 'Desvios Precoces Detectados'],
      normaPadrao: 'Standard Work Routine (SWR)',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_AMOSTRAL',
      tabTarget: 'AMOSTRAL',
      pilarId: 'QUALIDADE',
      pilarNome: '2. Qualidade & Processo',
      pilarCor: '#16A34A',
      titulo: 'Controle Amostral (BP8)',
      siglaPadrao: 'BP8',
      icone: 'fa-clipboard-check',
      descricaoCurta: 'Rotina de amostragem estatística e medição periódica de características críticas de produto.',
      objetivoEstrategico: 'Validar a repetibilidade do processo em intervalos de veículos amostrados (ex: 1 a cada 20 unidades montadas).',
      fluxoPassoAPasso: [
        'Identificar a característica a inspecionar (ex: GAP e Flush da tampa traseira).',
        'Coletar a amostra no veículo correspondente e efetuar a medição com instrumento calibrado.',
        'Lançar o resultado como OK ou KO informando número de VIS ou número de série.',
        'Se KO, aplicar imediatamente Medida Conservatória (BP9) para retenção de lote.'
      ],
      kpisChave: ['Taxa de Amostras Conformes (%)', 'Rastreabilidade de VIS Inspecionados'],
      normaPadrao: 'Best Practice 8 - Stellantis Quality Standard',
      permissoesRecomendadas: ['OPERADOR', 'TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_MEDIDA',
      tabTarget: 'MEDIDA',
      pilarId: 'QUALIDADE',
      pilarNome: '2. Qualidade & Processo',
      pilarCor: '#16A34A',
      titulo: 'Medidas Conservatórias (BP9)',
      siglaPadrao: 'BP9',
      icone: 'fa-shield-halved',
      descricaoCurta: 'Protocolo de contenção emergencial para isolar e colocar em quarentena veículos suspeitos de não-conformidade.',
      objetivoEstrategico: 'Blindar os postos seguintes e impedir que peças com defeito avancem na esteira até o pátio ou concessionárias.',
      fluxoPassoAPasso: [
        'Ao detectar desvio grave ou repetitivo, abrir ficha de Medida Conservatória.',
        'Definir a faixa de contenção (ex: do veículo VIN ...1240 ao VIN ...1285).',
        'Bloquear os veículos no sistema e emitir etiqueta física de quarentena.',
        'Executar re-trabalho ou inspeção 100% antes de autorizar a liberação do lote.'
      ],
      kpisChave: ['Tempo de Resposta à Contenção (< 5 min)', 'Veículos em Quarentena', 'Zero Escapamento'],
      normaPadrao: 'Best Practice 9 - Containment & Quarantine',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_RED_RABBIT',
      tabTarget: 'RED_RABBIT',
      pilarId: 'QUALIDADE',
      pilarNome: '2. Qualidade & Processo',
      pilarCor: '#16A34A',
      titulo: 'Red Rabbit / Testes Poka-Yoke',
      siglaPadrao: 'Red Rabbit',
      icone: 'fa-bug',
      descricaoCurta: 'Teste de desafio realizado no início do turno com peças-padrão de falha controlada para verificar se os sensores e travas automáticas funcionam.',
      objetivoEstrategico: 'Garantir que os dispositivos à prova de erros (Poka-Yokes eletrônicos e mecânicos) rejeitem 100% das peças com defeito antes de iniciar a produção.',
      fluxoPassoAPasso: [
        'Pegar a peça de teste "Red Rabbit" (marcada em vermelho/amarelo com defeito controlado).',
        'Inserir a peça no dispositivo ou dispositivo de aperto.',
        'O sensor DEVE rejeitar a peça e acionar o sinal sonoro/intertravamento da máquina.',
        'Se aprovado, o sistema libera a operação; se falhar, a linha é imediatamente paralisada para manutenção.'
      ],
      kpisChave: ['100% Poka-Yokes Testados no Turno', 'Eficácia de Detecção de Falha'],
      normaPadrao: 'Poka-Yoke Challenge Standard IATF 16949 §8.5.1.1',
      permissoesRecomendadas: ['OPERADOR', 'TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_SWA',
      tabTarget: 'SWA',
      pilarId: 'QUALIDADE',
      pilarNome: '2. Qualidade & Processo',
      pilarCor: '#16A34A',
      titulo: 'Auditorias SWA (Standard Work Audit)',
      siglaPadrao: 'SWA',
      icone: 'fa-magnifying-glass',
      descricaoCurta: 'Auditoria periódica de conformidade do trabalho padrão executado pelo operador contra a ficha técnica SOS.',
      objetivoEstrategico: 'Verificar se a sequência, tempo, ergonomia e pontos de segurança descritos na folha padrão estão sendo rigorosamente respeitados.',
      fluxoPassoAPasso: [
        'O auditor ou Team Leader se posiciona ao lado do posto de trabalho com a folha SOS.',
        'Observa 3 ciclos consecutivos de montagem do operador.',
        'Avalia postura ergonômica, sequência dos movimentos e torque aplicado.',
        'Dá feedback imediato ao operador e anota oportunidades de melhoria ou reciclagem.'
      ],
      kpisChave: ['Índice de Aderência ao Trabalho Padrão (%)', 'Ciclos Observados'],
      normaPadrao: 'WCM - Standardized Work Audit',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },

    // 3. Segurança WHS
    {
      id: 'MOD_SEGURANCA_PAINEL',
      tabTarget: 'SEGURANCA',
      pilarId: 'SEGURANCA',
      pilarNome: '3. Segurança WHS',
      pilarCor: '#DC2626',
      titulo: 'Painel Geral de Segurança & Pirâmide de Heinrich',
      siglaPadrao: 'WHS & Heinrich',
      icone: 'fa-person-falling-burst',
      descricaoCurta: 'Centro de comando de saúde e segurança com a Pirâmide de Heinrich interativa, Cruz de Segurança mensal e inspeção de EPIs.',
      objetivoEstrategico: 'Cultura de Acidente Zero: tratar a base da pirâmide (condições inseguras e quase-acidentes) para eliminar qualquer risco de fatalidade ou lesão.',
      fluxoPassoAPasso: [
        'Consultar o status diário na Cruz de Segurança (Verde = Dia Seguro, Amarelo = Quase-Acidente, Vermelho = Acidente).',
        'Registrar novos quase-acidentes descrevendo local, risco e plano de ação imediato.',
        'Cadastrar auditorias de EPIs por posto e turno verificando protetor auricular, óculos e luvas.',
        'Acompanhar a evolução dos índices de severidade e frequência.'
      ],
      kpisChave: ['Dias Sem Acidentes com Afastamento', 'Quase-Acidentes Tratados', 'Conformidade de EPIs (%)'],
      normaPadrao: 'ISO 45001 / OHSAS 18001 / NR-12 / NR-6',
      permissoesRecomendadas: ['OPERADOR', 'TEAM_LEADER', 'LIDER', 'SEGURANCA', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER'],
      destaqueBadge: 'Prioridade Absoluta'
    },
    {
      id: 'MOD_ESCALADA',
      tabTarget: 'ESCALADA',
      pilarId: 'SEGURANCA',
      pilarNome: '3. Segurança WHS',
      pilarCor: '#DC2626',
      titulo: 'Matriz de Escalada & Andon de Emergência (F12)',
      siglaPadrao: 'F12 - Andon Call',
      icone: 'fa-bell',
      descricaoCurta: 'Regras de escalonamento de paradas e emergências industriais conforme tempo decorrido.',
      objetivoEstrategico: 'Evitar paradas prolongadas de linha através de acionamento automático de níveis superiores de liderança quando o problema não for resolvido.',
      fluxoPassoAPasso: [
        '0 a 3 minutos: Operador aciona o botão Andon e Team Leader comparece ao posto.',
        '3 a 10 minutos: Se persistir, o Líder de Linha e a Manutenção são acionados.',
        '10 a 30 minutos: Supervisão de Produção e Engenharia assumem o controle.',
        'Mais de 30 minutos: Gerente da Planta e Diretor Industrial recebem alerta de parada crítica.'
      ],
      kpisChave: ['MTTR (Mean Time to Respond)', 'Aderência aos Níveis de Escalação'],
      normaPadrao: 'WCM - Quick Response Quality Control (QRQC)',
      permissoesRecomendadas: ['OPERADOR', 'TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_WHS_CONVERSA',
      tabTarget: 'WHS',
      pilarId: 'SEGURANCA',
      pilarNome: '3. Segurança WHS',
      pilarCor: '#DC2626',
      titulo: 'Conversa WHS (Diálogo Comportamental)',
      siglaPadrao: 'WHS Dialog',
      icone: 'fa-comments',
      descricaoCurta: 'Registro de diálogos de segurança de 1-a-1 entre lideranças e operadores focando em atitudes preventivas.',
      objetivoEstrategico: 'Construir relacionamento de confiança, reforçar bons hábitos de ergonomia e entender dificuldades práticas sentidas pelos operadores.',
      fluxoPassoAPasso: [
        'Líder seleciona um operador para uma conversa de 5 a 10 minutos sobre seu posto.',
        'Aborda temas como posturas, uso correto de EPIs e riscos de prensamento ou corte.',
        'Ouve as sugestões do operador para melhorar o ambiente de trabalho.',
        'Registra o feedback e eventuais ações no sistema.'
      ],
      kpisChave: ['Conversas WHS Realizadas / Meta Mensal', 'Sugestões de Operadores Implementadas'],
      normaPadrao: 'Safety Observation & Coaching Standard',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SEGURANCA', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },

    // 4. Pessoas
    {
      id: 'MOD_TEAM_LEADERS',
      tabTarget: 'CADASTRO_TL',
      pilarId: 'PESSOAS',
      pilarNome: '4. Pessoas & Gestão',
      pilarCor: '#8B5CF6',
      titulo: 'Gestão de Team Leaders (TLs)',
      siglaPadrao: 'Team Leaders',
      icone: 'fa-user-tie',
      descricaoCurta: 'Cadastro, alocação por turno e gestão dos líderes de equipe responsáveis por células de produção.',
      objetivoEstrategico: 'Garantir liderança ativa na proporção ideal de 1 Team Leader para cada 5 a 7 postos de trabalho.',
      fluxoPassoAPasso: [
        'Cadastrar novo Team Leader com matrícula, telefone de rádio, turno e linha.',
        'Definir os trechos de responsabilidade (ex: Trecho Portas ou Chassi).',
        'Alternar status entre Ativo, Férias ou Afastamento com definição de substituto.',
        'Vincular o TL aos formulários de Gemba e Briefing.'
      ],
      kpisChave: ['Razão TL / Operadores', 'Cobertura de Liderança por Turno'],
      normaPadrao: 'WCM - People Development Pillar',
      permissoesRecomendadas: ['SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_POLIVALENCIA',
      tabTarget: 'POLIVALENCIA',
      pilarId: 'PESSOAS',
      pilarNome: '4. Pessoas & Gestão',
      pilarCor: '#8B5CF6',
      titulo: 'Matriz de Polivalência (331)',
      siglaPadrao: '331 Matrix',
      icone: 'fa-graduation-cap',
      descricaoCurta: 'Matriz visual de qualificação dos operadores por posto segundo a regra industrial 331 (3 operadores por posto, 1 operador em 3 postos).',
      objetivoEstrategico: 'Flexibilidade operacional total para absorver ausências sem comprometer o Takt Time e sem gerar perdas de qualidade.',
      fluxoPassoAPasso: [
        'Nível 1 (25%): Operador em treinamento teórico (conhece ficha SOS).',
        'Nível 2 (50%): Operador executa a operação sob tutoria contínua.',
        'Nível 3 (75%): Operador autônomo pleno (cumpre ciclo padrão com qualidade).',
        'Nível 4 (100%): Operador é multiplicador e capacitador de novos colegas.',
        'Atualizar a matriz após cada auditoria SWA ou treinamento concluído.'
      ],
      kpisChave: ['Índice de Polivalência Geral (%)', 'Postos Críticos com < 3 Aptos'],
      normaPadrao: 'WCM 331 Competency Standard',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER'],
      destaqueBadge: 'Metodologia 331'
    },

    // 5. SIS & WO
    {
      id: 'MOD_SIS_WO',
      tabTarget: 'SIS_WO',
      pilarId: 'SIS_WO',
      pilarNome: '5. SIS & Workplace Org.',
      pilarCor: '#EA580C',
      titulo: 'SIS & Workplace Organization (WO / 5S)',
      siglaPadrao: 'SOS + 5S',
      icone: 'fa-file-lines',
      descricaoCurta: 'Módulo integrado de Padronização SIS (Fichas SOS e JES), Auditorias 5S por pilar e controle de Ponto Vermelho (Red Tag).',
      objetivoEstrategico: 'Eliminar desperdícios nos postos através de padronização visual, organização física do espaço e descarte metódico de desnecessários.',
      fluxoPassoAPasso: [
        'Cadastrar e revisar fichas de procedimentos SOS com pontos críticos de qualidade.',
        'Realizar auditorias dos 5 Sensos (Descarte, Ordem, Limpeza, Padronização e Autodisciplina).',
        'Ao encontrar ferramenta ou item quebrado/sem uso, aplicar Etiqueta Vermelha (Red Tag).',
        'Acompanhar a destinação final da etiqueta (descarte, sucata ou remanejamento).'
      ],
      kpisChave: ['Score Geral de 5S (%)', 'Pontos Vermelhos Resolvidos em < 48h', 'Aderência SOS'],
      normaPadrao: 'WCM - Workplace Organization (WO) Pillar',
      permissoesRecomendadas: ['OPERADOR', 'TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_FERRAMENTAL',
      tabTarget: 'FERRAMENTAL_PATRIMONIO',
      pilarId: 'SIS_WO',
      pilarNome: '5. SIS & Workplace Org.',
      pilarCor: '#EA580C',
      titulo: 'Gestão de Ferramental & Patrimônio',
      siglaPadrao: 'Ferramental',
      icone: 'fa-wrench',
      descricaoCurta: 'Inventário e rastreamento de apertadeiras eletrônicas, torquímetros, calibradores e dispositivos de montagem.',
      objetivoEstrategico: 'Assegurar que todas as ferramentas com impacto em torque e segurança estejam devidamente calibradas e dentro do prazo de validade.',
      fluxoPassoAPasso: [
        'Cadastrar a ferramenta com código de patrimônio, marca, modelo e posto alocado.',
        'Informar faixa de torque nominal (ex: 25 a 35 Nm) e data do último laudo de calibração.',
        'O sistema avisa automaticamente com 15 dias de antecedência quando a calibração vencer.',
        'Registrar manutenções preventivas e troca de soquetes/baterias.'
      ],
      kpisChave: ['Ferramentas 100% Calibradas', 'Tempo Médio Entre Falhas (MTBF)'],
      normaPadrao: 'ISO 6789 (Assembly Tools for Screws and Nuts)',
      permissoesRecomendadas: ['TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_KAIZEN',
      tabTarget: 'KAIZEN',
      pilarId: 'SIS_WO',
      pilarNome: '5. SIS & Workplace Org.',
      pilarCor: '#EA580C',
      titulo: 'Banco Kaizen & Análise 5-Why',
      siglaPadrao: 'Kaizen 5-Why',
      icone: 'fa-lightbulb',
      descricaoCurta: 'Repositório de propostas de melhoria contínua e investigação de causa raiz utilizando o método dos 5 Porquês.',
      objetivoEstrategico: 'Incentivar a inovação vinda do operador e eliminar definitivamente a causa raiz de problemas recorrentes.',
      fluxoPassoAPasso: [
        'Operador ou líder submete uma ideia de melhoria detalhando a situação Antes vs Depois.',
        'Aplica o método dos 5 Porquês para atingir a causa fundamental do desvio.',
        'Calcula o ganho estimado (segurança, ergonomia, qualidade ou economia em R$).',
        'Supervisão aprova e a equipe implementa e compartilha a melhor prática com outras linhas.'
      ],
      kpisChave: ['Kaizens Implementados / Homem / Ano', 'Economia Gerada (R$)', 'Melhorias de Ergonomia'],
      normaPadrao: 'WCM - Focused Improvement / Kaizen Teian',
      permissoesRecomendadas: ['OPERADOR', 'TEAM_LEADER', 'LIDER', 'SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },

    // 6. Cadastros Industriais
    {
      id: 'MOD_CADASTRO_LINHAS',
      tabTarget: 'CADASTRO_LINHAS',
      pilarId: 'CADASTROS',
      pilarNome: '6. Cadastros Industriais',
      pilarCor: '#0D9488',
      titulo: 'Linhas de Produção',
      siglaPadrao: 'Linhas L3 & L1',
      icone: 'fa-industry',
      descricaoCurta: 'Configuração mestra das linhas de montagem automotiva do Polo Betim (capacidade, Takt Time alvo, modelos fabricados).',
      objetivoEstrategico: 'Definir a infraestrutura produtiva base onde os postos e operações estão agrupados.',
      fluxoPassoAPasso: [
        'Cadastrar ou editar a linha (ex: Linha 3 - Hatch & SUV).',
        'Configurar o Takt Time nominal em segundos (ex: 58s).',
        'Associar os trechos de esteira e supervisor responsável.',
        'Ativar ou pausar status da linha conforme programação de fábrica.'
      ],
      kpisChave: ['Takt Time Alvo', 'Capacidade Diária (JPH - Jobs Per Hour)'],
      normaPadrao: 'Industrial Engineering Master Configuration',
      permissoesRecomendadas: ['ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_CADASTRO_PDT',
      tabTarget: 'CADASTRO_PDT',
      pilarId: 'CADASTROS',
      pilarNome: '6. Cadastros Industriais',
      pilarCor: '#0D9488',
      titulo: 'Postos de Trabalho (PDT)',
      siglaPadrao: 'PDT Master',
      icone: 'fa-network-wired',
      descricaoCurta: 'Cadastro detalhado de cada estação individual de montagem (PDT 01 a 75) ao longo dos trechos da linha.',
      objetivoEstrategico: 'Mapear a alocação física de cada operação, ferramentas, requisitos de ergonomia e status do totem.',
      fluxoPassoAPasso: [
        'Criar novo posto definindo código oficial (ex: PDT-L3-32).',
        'Vincular ao Trecho e Linha correspondente (ex: Trecho Chassi).',
        'Adicionar operações vinculadas e definir tempo de ciclo previsto.',
        'Configurar coordenadas no mapa SVG para renderização interativa.'
      ],
      kpisChave: ['Total de Postos Balanceados', 'Postos Ativos / Desativados'],
      normaPadrao: 'Line Balancing & Workplace Engineering',
      permissoesRecomendadas: ['SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_CADASTRO_OPERACOES',
      tabTarget: 'CADASTRO_OPERACOES',
      pilarId: 'CADASTROS',
      pilarNome: '6. Cadastros Industriais',
      pilarCor: '#0D9488',
      titulo: 'Operações & Cronoanálise de Ciclos',
      siglaPadrao: 'Cronoanálise',
      icone: 'fa-stopwatch-20',
      descricaoCurta: 'Estudo de tempos e métodos industriais, decompondo cada tarefa em Valor Agregado (VA) e Não-Agregado (NVA).',
      objetivoEstrategico: 'Eliminar movimentos desnecessários e balancear a linha para que nenhum posto ultrapasse o Takt Time limite.',
      fluxoPassoAPasso: [
        'Cadastrar as etapas da operação com tempos cronometrados em segundos.',
        'Classificar cada elemento: Valor Agregado (VA), Não Agregado Necessário (NVAN) ou Desperdício puro (NVA).',
        'Analisar a barra de saturação contra o Takt Time.',
        'Ajustar o método para reduzir tempos ociosos e sobrecargas.'
      ],
      kpisChave: ['Tempo de Ciclo (s)', 'Índice de Balanceamento da Linha (%)', 'Taxa VA/NVA'],
      normaPadrao: 'MTM (Methods-Time Measurement) / MOST',
      permissoesRecomendadas: ['SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_CADASTROS_GERAL',
      tabTarget: 'CADASTROS',
      pilarId: 'CADASTROS',
      pilarNome: '6. Cadastros Industriais',
      pilarCor: '#0D9488',
      titulo: 'Cadastros Mestres Globais',
      siglaPadrao: 'Master Data',
      icone: 'fa-database',
      descricaoCurta: 'Ponto único de consulta e exportação de todas as tabelas de referência do sistema.',
      objetivoEstrategico: 'Manter a consistência de dados entre turnos, áreas de apoio e relatórios gerenciais.',
      fluxoPassoAPasso: [
        'Consultar tabela geral de operadores, modelos e equipamentos.',
        'Filtrar por linha, trecho ou status.',
        'Exportar dados para análise em planilhas ou sistemas legados.'
      ],
      kpisChave: ['Integridade de Dados Mestres (100%)'],
      normaPadrao: 'Master Data Governance',
      permissoesRecomendadas: ['ADMINISTRADOR', 'CONTA_MASTER']
    },

    // 7. Conta Master & Governança
    {
      id: 'MOD_GESTAO_MASTER',
      tabTarget: 'GESTAO_MASTER',
      pilarId: 'ADMIN',
      pilarNome: '7. Conta Máster & Admin',
      pilarCor: '#475569',
      titulo: 'Gestão da Hierarquia Máster WCM',
      siglaPadrao: 'Hierarquia WCM',
      icone: 'fa-sitemap',
      descricaoCurta: 'Editor estrutural em árvore da governança fabril: UTE -> Trecho -> Domínio -> Totens -> Acúmulos -> Postos.',
      objetivoEstrategico: 'Permitir a modelagem completa de novas linhas e células sem necessidade de alteração de código ou banco de dados externo.',
      fluxoPassoAPasso: [
        'Visualizar os nós da árvore hierárquica industrial.',
        'Adicionar ou renomear Trechos, Totens de Alerta ou Acúmulos de Buffer.',
        'Reordenar elementos arrastando ou usando as opções de ajuste de sequência.',
        'Salvar alterações que sincronizam imediatamente com o Mapa SVG.'
      ],
      kpisChave: ['Consistência Estrutural', 'Rastreabilidade de Vínculos'],
      normaPadrao: 'WCM Organizational Architecture',
      permissoesRecomendadas: ['CONTA_MASTER'],
      destaqueBadge: 'Acesso Exclusivo'
    },
    {
      id: 'MOD_PERFIS',
      tabTarget: 'PERFIS_PERMISSOES',
      pilarId: 'ADMIN',
      pilarNome: '7. Conta Máster & Admin',
      pilarCor: '#475569',
      titulo: 'Perfis de Acesso & Permissões (RBAC)',
      siglaPadrao: 'RBAC Security',
      icone: 'fa-user-shield',
      descricaoCurta: 'Controle rigoroso de segurança baseado em funções (Role-Based Access Control) com 7 níveis de autorização.',
      objetivoEstrategico: 'Proteger dados críticos de engenharia e auditoria, garantindo que cada usuário acerte somente as funções pertinentes ao seu cargo.',
      fluxoPassoAPasso: [
        'Visualizar os 7 níveis: Conta Máster, Administrador, Supervisão, Líder, Team Leader, Segurança WHS e Operador.',
        'Consultar matriz de permissões (Leitura, Edição, Exclusão, Aprovação).',
        'Alternar o perfil no topo para simulação ou operação supervisionada.'
      ],
      kpisChave: ['Conformidade LGPD / ISO 27001', 'Auditoria de Acessos'],
      normaPadrao: 'ISO/IEC 27001 Information Security',
      permissoesRecomendadas: ['ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_MAPA_EDICAO',
      tabTarget: 'MAPA_EDICAO',
      pilarId: 'ADMIN',
      pilarNome: '7. Conta Máster & Admin',
      pilarCor: '#475569',
      titulo: 'Modo Edição do Mapa SVG',
      siglaPadrao: 'SVG Layout Editor',
      icone: 'fa-pen-to-square',
      descricaoCurta: 'Ambiente de desenho e posicionamento visual dos elementos da linha direto na tela vetorial.',
      objetivoEstrategico: 'Adequar o layout da tela após mudanças físicas no galpão industrial (re-layout WCM de esteira).',
      fluxoPassoAPasso: [
        'Ativar o Modo Edição no topo do mapa SVG.',
        'Arrastar e soltar postos PDT, totens ou caixas de texto nas novas posições.',
        'Ajustar coordenadas X e Y e salvar as alterações no estado persistente.'
      ],
      kpisChave: ['Precisão Geométrica do Layout', 'Sincronização Visual'],
      normaPadrao: 'Industrial Layout Standards',
      permissoesRecomendadas: ['ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_LOGS',
      tabTarget: 'LOGS',
      pilarId: 'ADMIN',
      pilarNome: '7. Conta Máster & Admin',
      pilarCor: '#475569',
      titulo: 'Trilha de Auditoria & Logs do Sistema',
      siglaPadrao: 'Audit Trail',
      icone: 'fa-clock-rotate-left',
      descricaoCurta: 'Registro cronológico inviolável de todas as ações executadas no sistema (criações, edições, exclusões e login).',
      objetivoEstrategico: 'Garantir rastreabilidade absoluta para auditorias internas, clientes externos e investigações de qualidade.',
      fluxoPassoAPasso: [
        'Acessar os registros com filtro por data, usuário, módulo ou tipo de operação.',
        'Verificar o estado anterior e posterior de qualquer parâmetro alterado.',
        'Exportar relatório de auditoria para fins de compliance.'
      ],
      kpisChave: ['100% de Ações Auditadas', 'Integridade Temporal'],
      normaPadrao: 'CFR Part 11 / ISO 9001 Audit Trail',
      permissoesRecomendadas: ['ADMINISTRADOR', 'CONTA_MASTER']
    },
    {
      id: 'MOD_RELATORIOS',
      tabTarget: 'RELATORIOS',
      pilarId: 'ADMIN',
      pilarNome: '7. Conta Máster & Admin',
      pilarCor: '#475569',
      titulo: 'Relatórios Industriais & Backup JSON',
      siglaPadrao: 'Backup & Export',
      icone: 'fa-download',
      descricaoCurta: 'Central de relatórios gerenciais consolidados e rotina de backup/restauração completa em arquivo JSON.',
      objetivoEstrategico: 'Prevenção de perda de dados e facilidade para arquivamento histórico de produção e auditorias periódicas.',
      fluxoPassoAPasso: [
        'Selecionar o período ou módulo para emissão de relatório PDF/impressão.',
        'Clicar em "Exportar Backup JSON Completo" para salvar o estado atual do banco de dados no computador.',
        'Usar a restauração em caso de troca de máquina ou recuperação de dados.'
      ],
      kpisChave: ['Disponibilidade de Backup', 'Tempo de Recuperação (RTO)'],
      normaPadrao: 'Disaster Recovery & Business Continuity',
      permissoesRecomendadas: ['SUPERVISAO', 'ADMINISTRADOR', 'CONTA_MASTER']
    }
  ];

  // Filtragem dos módulos
  const modulosFiltrados = useMemo(() => {
    return MODULOS.filter(m => {
      const matchPilar = selectedPilarFilter === 'TODOS' || m.pilarId === selectedPilarFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        m.titulo.toLowerCase().includes(q) ||
        m.siglaPadrao.toLowerCase().includes(q) ||
        m.descricaoCurta.toLowerCase().includes(q) ||
        m.objetivoEstrategico.toLowerCase().includes(q) ||
        m.normaPadrao.toLowerCase().includes(q) ||
        m.pilarNome.toLowerCase().includes(q);
      return matchPilar && matchQuery;
    });
  }, [selectedPilarFilter, searchQuery]);

  return (
    <div className="space-y-4 pb-8 max-w-7xl mx-auto">
      {/* =========================================================================
          HERO & CABEÇALHO DO GUIA INFOGRÁFICO
          ========================================================================= */}
      <div 
        className="rounded-2xl p-4 sm:p-6 border sis-shadow-md relative overflow-hidden transition-all"
        style={{ 
          backgroundColor: 'var(--sis-bg-surface)', 
          borderColor: 'var(--sis-border-main)' 
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5"
                style={{ 
                  backgroundColor: 'var(--sis-blue-bg)', 
                  color: 'var(--sis-blue-text)', 
                  border: '1px solid var(--sis-blue-border)' 
                }}
              >
                <i className="fa-solid fa-book-bookmark"></i>
                Guia Oficial do Sistema
              </span>
              <span className="text-[11px] font-mono sis-text-muted">
                Stellantis Betim • Linhas L3 & L1 • WCM FCI_SA_008
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight sis-text-primary flex items-center gap-2">
              <i className="fa-solid fa-chalkboard-user text-sky-500"></i>
              Manual Interativo de Recursos & Infográficos
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed sis-text-secondary">
              Apresentação detalhada em modo infográfico de todas as funcionalidades, fluxos de trabalho, 
              matrizes de segurança e qualidade do sistema de controle de chão de fábrica.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition sis-btn-secondary"
              title="Imprimir ou Salvar em PDF para Treinamento"
            >
              <i className="fa-solid fa-print"></i>
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={() => onNavigateToTab('MAPA_LINHA')}
              className="px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition sis-btn-primary"
            >
              <i className="fa-solid fa-map-location-dot"></i>
              <span>Abrir Mapa da Linha</span>
            </button>
          </div>
        </div>

        {/* Faixa de Estatísticas Infográficas em Destaque */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4 mt-4 border-t" style={{ borderColor: 'var(--sis-border-subtle)' }}>
          <div className="p-2.5 rounded-xl border sis-bg-surface-elevated text-center" style={{ borderColor: 'var(--sis-border-subtle)' }}>
            <div className="text-lg sm:text-xl font-black font-mono text-sky-500">7</div>
            <div className="text-[10px] font-bold sis-text-muted uppercase">Pilares WCM</div>
          </div>
          <div className="p-2.5 rounded-xl border sis-bg-surface-elevated text-center" style={{ borderColor: 'var(--sis-border-subtle)' }}>
            <div className="text-lg sm:text-xl font-black font-mono text-emerald-500">24</div>
            <div className="text-[10px] font-bold sis-text-muted uppercase">Módulos Ativos</div>
          </div>
          <div className="p-2.5 rounded-xl border sis-bg-surface-elevated text-center" style={{ borderColor: 'var(--sis-border-subtle)' }}>
            <div className="text-lg sm:text-xl font-black font-mono text-amber-500">9</div>
            <div className="text-[10px] font-bold sis-text-muted uppercase">Trechos Críticos</div>
          </div>
          <div className="p-2.5 rounded-xl border sis-bg-surface-elevated text-center" style={{ borderColor: 'var(--sis-border-subtle)' }}>
            <div className="text-lg sm:text-xl font-black font-mono text-purple-500">75+</div>
            <div className="text-[10px] font-bold sis-text-muted uppercase">Postos (PDTs)</div>
          </div>
          <div className="p-2.5 rounded-xl border sis-bg-surface-elevated text-center" style={{ borderColor: 'var(--sis-border-subtle)' }}>
            <div className="text-lg sm:text-xl font-black font-mono text-rose-500">7 Níveis</div>
            <div className="text-[10px] font-bold sis-text-muted uppercase">Perfis RBAC</div>
          </div>
          <div className="p-2.5 rounded-xl border sis-bg-surface-elevated text-center" style={{ borderColor: 'var(--sis-border-subtle)' }}>
            <div className="text-lg sm:text-xl font-black font-mono text-teal-500">AAA</div>
            <div className="text-[10px] font-bold sis-text-muted uppercase">WCAG & ISO 3864</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SELETOR DE ABAS DO GUIA (NAVEGAÇÃO POR MODOS INFOGRÁFICOS)
          ========================================================================= */}
      <div 
        className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b"
        style={{ borderColor: 'var(--sis-border-main)' }}
        role="tablist"
      >
        {[
          { id: 'ECOSISTEMA', label: '1. Diagrama do Ecossistema', icon: 'fa-network-wired' },
          { id: 'CATALOGO_MODULOS', label: '2. Catálogo dos 24 Módulos', icon: 'fa-boxes-stacked' },
          { id: 'JORNADA_TURNO', label: '3. Jornada do Turno (8h)', icon: 'fa-timeline' },
          { id: 'HEINRICH_SEGURANCA', label: '4. Pirâmide Heinrich & WHS', icon: 'fa-shield-heart' },
          { id: 'MATRIZ_331', label: '5. Matriz de Polivalência 331', icon: 'fa-graduation-cap' },
          { id: 'MATRIZ_RACI', label: '6. Matriz de Perfis (RBAC)', icon: 'fa-user-lock' },
          { id: 'PADROES_QUALIDADE', label: '7. Padrões & Acessibilidade', icon: 'fa-universal-access' },
        ].map(tab => {
          const isActive = activeGuiaSection === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveGuiaSection(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 cursor-pointer transition shrink-0 ${
                isActive 
                  ? 'sis-btn-primary sis-shadow-sm font-black' 
                  : 'sis-text-secondary hover:sis-bg-surface-elevated'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          ABA 1: DIAGRAMA DO ECOSSISTEMA INDUSTRIAL (INFOGRÁFICO DE ARQUITETURA)
          ========================================================================= */}
      {activeGuiaSection === 'ECOSISTEMA' && (
        <div className="space-y-4">
          <div 
            className="rounded-2xl p-5 border sis-bg-surface sis-shadow-sm space-y-4"
            style={{ borderColor: 'var(--sis-border-main)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black sis-text-primary flex items-center gap-2">
                  <i className="fa-solid fa-sitemap text-sky-500"></i>
                  Arquitetura de Dados & Fluxo de Chão de Fábrica Integrado
                </h2>
                <p className="text-xs sis-text-muted">
                  Como os 24 módulos conversam entre si desde o botão do Andon no posto até a auditoria da Conta Máster.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 border border-sky-500/30">
                WCM Level 5 Architecture
              </span>
            </div>

            {/* Infográfico Visual com Conexões e Camadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Camada 1: Campo / Chão de Fábrica */}
              <div 
                className="p-4 rounded-xl border flex flex-col justify-between space-y-3 relative overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--sis-bg-surface-elevated)', 
                  borderColor: 'var(--sis-blue-border)' 
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">NÍVEL 01 • CAMPO FÍSICO</span>
                    <i className="fa-solid fa-industry text-sky-400"></i>
                  </div>
                  <h3 className="text-sm font-black sis-text-primary">Operação & Linha de Montagem</h3>
                  <p className="text-[11px] sis-text-muted leading-relaxed">
                    Geração contínua de peças montadas, leitura de Takt Time e eventos de parada imediata.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                  <div className="p-2 rounded-lg border bg-sky-500/10 border-sky-500/20 text-xs space-y-1">
                    <div className="font-bold text-sky-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-map-location-dot"></i> Mapa SVG + Totens PDT
                    </div>
                    <div className="text-[10px] sis-text-muted">
                      Monitora os 9 trechos da L3/L1, tempo de ciclo e alocação de operadores.
                    </div>
                  </div>
                  <div className="p-2 rounded-lg border bg-sky-500/10 border-sky-500/20 text-xs space-y-1">
                    <div className="font-bold text-sky-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-shoe-prints"></i> Gemba Walk (FCI_SA_008)
                    </div>
                    <div className="text-[10px] sis-text-muted">
                      Ronda in loco diária checando Segurança, Qualidade, Entrega e Custo.
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-center font-mono py-1 rounded bg-sky-950/40 text-sky-300 border border-sky-800/40">
                  Evento: Chamado Andon / Desvio de Posto
                </div>
              </div>

              {/* Camada 2: Contenção, Qualidade & Segurança */}
              <div 
                className="p-4 rounded-xl border flex flex-col justify-between space-y-3 relative overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--sis-bg-surface-elevated)', 
                  borderColor: 'var(--sis-green-border)' 
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">NÍVEL 02 • CONTENÇÃO & PREVENÇÃO</span>
                    <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                  </div>
                  <h3 className="text-sm font-black sis-text-primary">Qualidade & Segurança WHS</h3>
                  <p className="text-[11px] sis-text-muted leading-relaxed">
                    Bloqueio imediato de desvios, inspeções de barreira e proteção à integridade dos operadores.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                  <div className="p-2 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-xs space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-shield-halved"></i> Medidas BP9 + Amostral BP8
                    </div>
                    <div className="text-[10px] sis-text-muted">
                      Quarentena instantânea de lotes suspeitos para blindar os postos seguintes.
                    </div>
                  </div>
                  <div className="p-2 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-xs space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-bug"></i> Red Rabbit + Pirâmide Heinrich
                    </div>
                    <div className="text-[10px] sis-text-muted">
                      Desafio diário de sensores Poka-Yoke e tratamento preventivo de quase-acidentes.
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-center font-mono py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                  Ação: Abertura de Item no LAP
                </div>
              </div>

              {/* Camada 3: Governança, WCM & Gestão Máster */}
              <div 
                className="p-4 rounded-xl border flex flex-col justify-between space-y-3 relative overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--sis-bg-surface-elevated)', 
                  borderColor: 'var(--sis-border-strong)' 
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">NÍVEL 03 • GOVERNANÇA & MELHORIA</span>
                    <i className="fa-solid fa-graduation-cap text-purple-400"></i>
                  </div>
                  <h3 className="text-sm font-black sis-text-primary">Pessoas, 5S & Conta Máster</h3>
                  <p className="text-[11px] sis-text-muted leading-relaxed">
                    Evolução contínua das pessoas, manutenção de padrões SOS/5S e governança da hierarquia industrial.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                  <div className="p-2 rounded-lg border bg-purple-500/10 border-purple-500/20 text-xs space-y-1">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-users"></i> Matriz 331 + Fichas SOS (SIS)
                    </div>
                    <div className="text-[10px] sis-text-muted">
                      Capacitação em 4 níveis e garantia de 3 operadores qualificados por posto.
                    </div>
                  </div>
                  <div className="p-2 rounded-lg border bg-purple-500/10 border-purple-500/20 text-xs space-y-1">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-sitemap"></i> Hierarquia Máster + RBAC + Logs
                    </div>
                    <div className="text-[10px] sis-text-muted">
                      Configuração dinâmica da estrutura da planta com auditoria e controle de acesso.
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-center font-mono py-1 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40">
                  Resultado: Estabilidade WCM & Zero Acidente
                </div>
              </div>
            </div>

            {/* Diagrama de Resolução de Problemas no Chão de Fábrica (Fluxo 5 Etapas) */}
            <div className="p-4 rounded-xl border sis-bg-surface-elevated space-y-3" style={{ borderColor: 'var(--sis-border-subtle)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider sis-text-primary flex items-center gap-1.5">
                  <i className="fa-solid fa-arrow-progress text-amber-500"></i>
                  Fluxograma de Resposta Rápida a Desvios (QRQC Stellantis)
                </span>
                <span className="text-[10px] font-mono sis-text-muted">Padrão 24 Horas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {[
                  { step: '1', title: 'Detecção', sub: 'Andon / Gemba / BP8', icon: 'fa-bell', cor: 'text-amber-400' },
                  { step: '2', title: 'Contenção', sub: 'Quarentena BP9 em <5min', icon: 'fa-shield-halved', cor: 'text-rose-400' },
                  { step: '3', title: 'Ação Rápida', sub: 'Registro no Quadro LAP', icon: 'fa-list-check', cor: 'text-sky-400' },
                  { step: '4', title: 'Causa Raiz', sub: '5-Why no Banco Kaizen', icon: 'fa-lightbulb', cor: 'text-yellow-400' },
                  { step: '5', title: 'Bloqueio', sub: 'Atualização Ficha SOS / SWA', icon: 'fa-certificate', cor: 'text-emerald-400' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-lg border flex flex-col items-center text-center space-y-1 relative"
                    style={{ borderColor: 'var(--sis-border-main)', backgroundColor: 'var(--sis-bg-surface)' }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-xs bg-slate-800 text-white">
                      {item.step}
                    </div>
                    <i className={`fa-solid ${item.icon} ${item.cor} text-base`}></i>
                    <div className="text-xs font-bold sis-text-primary">{item.title}</div>
                    <div className="text-[10px] sis-text-muted">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 2: CATÁLOGO DOS 24 MÓDULOS (CARDS INFOGRÁFICOS DETALHADOS)
          ========================================================================= */}
      {activeGuiaSection === 'CATALOGO_MODULOS' && (
        <div className="space-y-4">
          {/* Barra de Filtros e Busca Rápida */}
          <div 
            className="p-4 rounded-2xl border sis-bg-surface sis-shadow-sm space-y-3"
            style={{ borderColor: 'var(--sis-border-main)' }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar módulo, sigla (ex: FCI_SA_008, BP8, 331, Andon, Poka-Yoke)..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs border font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 sis-input"
                  style={{
                    backgroundColor: 'var(--sis-input-bg)',
                    borderColor: 'var(--sis-input-border)',
                    color: 'var(--sis-input-text)'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              <div className="text-xs font-mono sis-text-muted shrink-0">
                Mostrando <strong className="sis-text-primary">{modulosFiltrados.length}</strong> de <strong>{MODULOS.length}</strong> ferramentas
              </div>
            </div>

            {/* Filtros em Pills por Pilar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedPilarFilter('TODOS')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedPilarFilter === 'TODOS'
                    ? 'sis-btn-primary font-black'
                    : 'sis-text-secondary hover:sis-bg-surface-elevated'
                }`}
              >
                Todos ({MODULOS.length})
              </button>
              {PILARES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPilarFilter(p.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedPilarFilter === p.id
                      ? 'sis-btn-primary font-black'
                      : 'sis-text-secondary hover:sis-bg-surface-elevated'
                  }`}
                >
                  <i className={`fa-solid ${p.icone}`}></i>
                  <span>{p.nome}</span>
                  <span className="text-[10px] opacity-75 font-mono">({p.total})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Cards Infográficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modulosFiltrados.map((mod) => {
              const isExpanded = expandedModuleId === mod.id;
              return (
                <div
                  key={mod.id}
                  className="rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all sis-bg-surface sis-shadow-sm hover:sis-shadow-md"
                  style={{ borderColor: 'var(--sis-border-main)' }}
                >
                  <div className="space-y-3">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-black text-base shadow-xs"
                          style={{ backgroundColor: mod.pilarCor }}
                        >
                          <i className={`fa-solid ${mod.icone}`}></i>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span 
                              className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ 
                                backgroundColor: 'var(--sis-bg-surface-elevated)', 
                                color: mod.pilarCor, 
                                border: '1px solid var(--sis-border-subtle)' 
                              }}
                            >
                              {mod.siglaPadrao}
                            </span>
                            {mod.destaqueBadge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                                {mod.destaqueBadge}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-black tracking-tight sis-text-primary mt-0.5">
                            {mod.titulo}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                        className="p-1.5 rounded-lg border text-xs cursor-pointer sis-text-muted hover:sis-text-primary"
                        style={{ borderColor: 'var(--sis-border-subtle)' }}
                        title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes completos'}
                      >
                        <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                      </button>
                    </div>

                    {/* Descrição Curta */}
                    <p className="text-xs leading-relaxed sis-text-secondary">
                      {mod.descricaoCurta}
                    </p>

                    {/* Objetivo Estratégico */}
                    <div className="p-2.5 rounded-xl border sis-bg-surface-elevated text-xs space-y-1" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
                        <i className="fa-solid fa-bullseye mr-1"></i> Objetivo no Chão de Fábrica
                      </span>
                      <p className="text-xs sis-text-secondary leading-snug">
                        {mod.objetivoEstrategico}
                      </p>
                    </div>

                    {/* Detalhes Expandidos (Passo a Passo e KPIs) */}
                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t mt-3" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                        {/* Fluxo Passo a Passo */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider sis-text-muted block">
                            <i className="fa-solid fa-list-ol mr-1"></i> Fluxo de Execução Passo a Passo:
                          </span>
                          <ol className="list-decimal list-inside space-y-1 text-xs sis-text-secondary">
                            {mod.fluxoPassoAPasso.map((step, idx) => (
                              <li key={idx} className="leading-tight pl-1">{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* KPIs & Norma */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          <div className="p-2 rounded-lg border bg-slate-900/30 text-[11px] space-y-1" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                            <span className="font-bold text-emerald-400 block">
                              <i className="fa-solid fa-chart-line mr-1"></i> Indicadores / KPIs:
                            </span>
                            <ul className="space-y-0.5 sis-text-secondary text-[10px]">
                              {mod.kpisChave.map((kpi, kIdx) => (
                                <li key={kIdx}>• {kpi}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-2 rounded-lg border bg-slate-900/30 text-[11px] space-y-1" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                            <span className="font-bold text-amber-400 block">
                              <i className="fa-solid fa-stamp mr-1"></i> Norma / Padrão:
                            </span>
                            <div className="text-[10px] sis-text-secondary font-mono">
                              {mod.normaPadrao}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer do Card com Botão de Ação Direta para a Tela */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                    <div className="flex items-center gap-1 text-[10px] sis-text-muted font-mono">
                      <i className="fa-solid fa-lock text-[9px]"></i>
                      <span className="hidden sm:inline">Perfis:</span>
                      <span className="font-bold sis-text-primary">{mod.permissoesRecomendadas[0]}...</span>
                    </div>

                    <button
                      onClick={() => onNavigateToTab(mod.tabTarget)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition sis-btn-primary"
                    >
                      <span>Abrir Módulo</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 3: JORNADA DO TURNO INDUSTRIAL (TIMELINE INFOGRÁFICA DE 8 HORAS)
          ========================================================================= */}
      {activeGuiaSection === 'JORNADA_TURNO' && (
        <div 
          className="rounded-2xl p-5 border sis-bg-surface sis-shadow-sm space-y-6"
          style={{ borderColor: 'var(--sis-border-main)' }}
        >
          <div>
            <h2 className="text-base font-black sis-text-primary flex items-center gap-2">
              <i className="fa-solid fa-timeline text-sky-500"></i>
              Jornada Padrão de 8 Horas do Turno Industrial
            </h2>
            <p className="text-xs sis-text-muted">
              Linha do tempo oficial de execução para Team Leaders, Operadores e Liderança de Linha na Stellantis Betim.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 space-y-6" style={{ borderColor: 'var(--sis-blue-primary)' }}>
            {[
              {
                horario: 'T - 15 min (Ex: 05h45)',
                titulo: 'Reunião Inicial: Folha A1 Briefing',
                modulo: 'A1_BRIEFING',
                descricao: 'Alinhamento com operadores, checagem de presença, substituições na Matriz 331, metas de volume e alertas de novos opcionais.',
                badge: 'Crítico de Abertura',
                icone: 'fa-map'
              },
              {
                horario: 'T + 00 min (Ex: 06h00)',
                titulo: 'Partida da Linha & Verificação de Segurança WHS',
                modulo: 'SEGURANCA',
                descricao: 'Inspeção de EPIs de todos os operadores e abertura do dia na Cruz de Segurança (Safety Cross).',
                badge: 'Segurança Zero Acidente',
                icone: 'fa-shield-halved'
              },
              {
                horario: 'T + 15 min (Ex: 06h15)',
                titulo: 'Desafio Red Rabbit nos Sensores Poka-Yoke',
                modulo: 'RED_RABBIT',
                descricao: 'Teste obrigatório com peças padrão de defeito para garantir que as travas automáticas e sensores rejeitem inconformidades.',
                badge: 'IATF 16949',
                icone: 'fa-bug'
              },
              {
                horario: 'T + 60 min a T + 180 min (Manhã)',
                titulo: 'Monitoramento Contínuo no Mapa SVG & Rotinas Horárias',
                modulo: 'MAPA_LINHA',
                descricao: 'Acompanhamento do Takt Time em cada PDT, conferência de chamados Andon, liberação de buffers de acúmulo e rotina H1-H3.',
                badge: 'Operação Ativa',
                icone: 'fa-map-location-dot'
              },
              {
                horario: 'T + 210 min (Meio do Turno)',
                titulo: 'Caminhada Gemba Walk (FCI_SA_008) & Amostral BP8',
                modulo: 'GEMBA',
                descricao: 'Ronda de verificação in loco dos 4 pilares (S, Q, D, C) com medição de parâmetros e coleta de amostras dimensionais BP8.',
                badge: 'FCI_SA_008',
                icone: 'fa-shoe-prints'
              },
              {
                horario: 'T + 360 min (Tarde)',
                titulo: 'Auditoria 5S WO & Aplicação de Red Tags',
                modulo: 'SIS_WO',
                descricao: 'Inspeção dos 5 Sensos nas bancadas, identificação de materiais desnecessários e registro de Ponto Vermelho para descarte.',
                badge: 'Workplace Org.',
                icone: 'fa-file-lines'
              },
              {
                horario: 'T + 465 min (T - 15 min Fechamento)',
                titulo: 'Fechamento do Turno & Repasse de Bastão no LAP',
                modulo: 'LAP',
                descricao: 'Atualização do quadro Kanban de ações pendentes, registro de Kaizens do dia e passagem detalhada de ocorrências para o próximo turno.',
                badge: 'Passagem de Turno',
                icone: 'fa-list-check'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative space-y-1.5">
                {/* Marcador na Linha do Tempo */}
                <div 
                  className="absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-xs"
                  style={{ backgroundColor: 'var(--sis-blue-primary)' }}
                >
                  <i className={`fa-solid ${item.icone} text-[8px]`}></i>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[11px] font-mono font-bold text-sky-400">
                    {item.horario}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 w-fit">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-sm font-black sis-text-primary">
                  {item.titulo}
                </h3>

                <p className="text-xs sis-text-secondary leading-relaxed">
                  {item.descricao}
                </p>

                <div>
                  <button
                    onClick={() => onNavigateToTab(item.modulo)}
                    className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer pt-0.5"
                  >
                    <span>Ir para a ferramenta</span>
                    <i className="fa-solid fa-arrow-right text-[9px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 4: PIRÂMIDE DE HEINRICH & SEGURANÇA WHS (INFOGRÁFICO INTERATIVO)
          ========================================================================= */}
      {activeGuiaSection === 'HEINRICH_SEGURANCA' && (
        <div className="space-y-4">
          <div 
            className="rounded-2xl p-5 border sis-bg-surface sis-shadow-sm space-y-5"
            style={{ borderColor: 'var(--sis-border-main)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black sis-text-primary flex items-center gap-2">
                  <i className="fa-solid fa-shield-heart text-rose-500"></i>
                  Metodologia da Pirâmide de Heinrich Aplicada à Stellantis Betim
                </h2>
                <p className="text-xs sis-text-muted">
                  Teoria matemática da prevenção de acidentes industriais: tratando a base, eliminamos o topo.
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab('SEGURANCA')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer sis-btn-primary shrink-0"
              >
                <i className="fa-solid fa-person-falling-burst"></i>
                <span>Abrir Painel de Segurança</span>
              </button>
            </div>

            {/* Ilustração Visual da Pirâmide com Dados Reais */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-2 py-4">
                {/* Topo: 1 Fatalidade */}
                <div 
                  className="w-48 sm:w-56 p-2 rounded-t-xl text-center text-white font-mono font-black text-xs shadow-md border"
                  style={{ backgroundColor: '#991B1B', borderColor: '#DC2626' }}
                >
                  <div className="text-[10px] tracking-widest uppercase opacity-80">NÍVEL 1 (TOPO)</div>
                  <div className="text-base font-black">1 FATALIDADE</div>
                  <div className="text-[9px] font-sans opacity-90">Acidente Grave / Perda Maior</div>
                </div>

                {/* Nível 2: 29 Acidentes Graves */}
                <div 
                  className="w-64 sm:w-72 p-2.5 text-center text-white font-mono font-black text-xs shadow-md border"
                  style={{ backgroundColor: '#DC2626', borderColor: '#EF4444' }}
                >
                  <div className="text-[10px] tracking-widest uppercase opacity-80">NÍVEL 2</div>
                  <div className="text-base font-black">29 ACIDENTES</div>
                  <div className="text-[9px] font-sans opacity-90">Com Afastamento ou Lesão Grave</div>
                </div>

                {/* Nível 3: 300 Quase-Acidentes */}
                <div 
                  className="w-80 sm:w-96 p-3 text-center text-white font-mono font-black text-xs shadow-md border"
                  style={{ backgroundColor: '#EA580C', borderColor: '#F97316' }}
                >
                  <div className="text-[10px] tracking-widest uppercase opacity-80">NÍVEL 3 (ALVO DE CONTENÇÃO)</div>
                  <div className="text-base font-black">300 QUASE-ACIDENTES (NEAR MISS)</div>
                  <div className="text-[9px] font-sans opacity-90">Incidentes sem lesão / Primeiros socorros</div>
                </div>

                {/* Base: 3.000 Condições Inseguras */}
                <div 
                  className="w-full sm:max-w-md p-3.5 rounded-b-xl text-center text-white font-mono font-black text-xs shadow-md border"
                  style={{ backgroundColor: '#EAB308', color: '#0F172A', borderColor: '#FACC15' }}
                >
                  <div className="text-[10px] tracking-widest uppercase opacity-90">NÍVEL 4 (BASE DE ATUAÇÃO PROATIVA)</div>
                  <div className="text-lg font-black">3.000 COMPORTAMENTOS & CONDIÇÕES INSEGURAS</div>
                  <div className="text-[10px] font-sans font-bold">Relatos diários dos operadores, 5S e conversas WHS</div>
                </div>
              </div>

              {/* Explicação Didática da Metodologia */}
              <div className="lg:col-span-5 space-y-3">
                <div className="p-3.5 rounded-xl border sis-bg-surface-elevated space-y-2" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                  <h4 className="text-xs font-black uppercase text-sky-400">
                    O Princípio de Herbert Heinrich:
                  </h4>
                  <p className="text-xs sis-text-secondary leading-relaxed">
                    Em um grupo de 330 acidentes do mesmo tipo, 300 resultam em nenhuma lesão (quase-acidentes), 
                    29 resultam em lesões menores e 1 resulta em lesão grave ou morte.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border sis-bg-surface-elevated space-y-2" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                  <h4 className="text-xs font-black uppercase text-emerald-400">
                    Aplicação Prática no App SIS:
                  </h4>
                  <p className="text-xs sis-text-secondary leading-relaxed">
                    O sistema incentiva o relato sem punição de <strong>Quase-Acidentes</strong> e 
                    <strong>Condições Inseguras</strong> na aba Segurança. Ao tratar 3.000 desvios na base, 
                    a probabilidade estatística de fatalidade é reduzida a zero.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border sis-bg-surface-elevated space-y-2" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                  <h4 className="text-xs font-black uppercase text-amber-400">
                    Cruz de Segurança (Safety Cross):
                  </h4>
                  <p className="text-xs sis-text-secondary leading-relaxed">
                    Calendário mensal em formato de cruz com 31 células. Cada dia é colorido:
                    <span className="block mt-1 font-mono text-[11px]">
                      • <strong className="text-emerald-400">Verde</strong>: Zero ocorrências.<br/>
                      • <strong className="text-amber-400">Amarelo</strong>: Quase-acidente relatado e contido.<br/>
                      • <strong className="text-rose-400">Vermelho</strong>: Acidente com perda de tempo.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 5: MATRIZ DE POLIVALÊNCIA 331 (INFOGRÁFICO DE DESENVOLVIMENTO)
          ========================================================================= */}
      {activeGuiaSection === 'MATRIZ_331' && (
        <div 
          className="rounded-2xl p-5 border sis-bg-surface sis-shadow-sm space-y-5"
          style={{ borderColor: 'var(--sis-border-main)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black sis-text-primary flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-purple-500"></i>
                Metodologia 331 de Polivalência Industrial
              </h2>
              <p className="text-xs sis-text-muted">
                3 operadores qualificados por posto de trabalho e 1 operador dominando 3 postos diferentes.
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('POLIVALENCIA')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer sis-btn-primary shrink-0"
            >
              <i className="fa-solid fa-table-cells"></i>
              <span>Abrir Matriz 331</span>
            </button>
          </div>

          {/* Os 4 Quadrantes de Proficiência do Operador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                nivel: 'Nível 1 (25%)',
                titulo: 'Treinamento Teórico',
                descricao: 'Operador recém-admitido ou transferido. Conhece a folha de processo SOS, regras de EPIs e riscos do posto, mas ainda não opera a esteira.',
                cor: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
                icone: 'fa-circle-notch',
                circulo: '1/4 preenchido'
              },
              {
                nivel: 'Nível 2 (50%)',
                titulo: 'Operação Assistida',
                descricao: 'Executa a montagem no posto com acompanhamento presencial do Team Leader ou operador tutor. Não pode operar sozinho na linha.',
                cor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
                icone: 'fa-circle-half-stroke',
                circulo: '2/4 preenchido'
              },
              {
                nivel: 'Nível 3 (75%)',
                titulo: 'Autônomo Pleno',
                descricao: 'Opera com total autonomia no Takt Time nominal (ex: 58 segundos) garantindo 100% de qualidade e conformidade ergonômica.',
                cor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
                icone: 'fa-circle-check',
                circulo: '3/4 preenchido'
              },
              {
                nivel: 'Nível 4 (100%)',
                titulo: 'Instrutor / Multiplicador',
                descricao: 'Domina o posto, capacita novos operadores, realiza auditorias SWA e propõe melhorias contínuas no Banco Kaizen.',
                cor: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
                icone: 'fa-award',
                circulo: 'Círculo Completo'
              }
            ].map((quad, qIdx) => (
              <div 
                key={qIdx}
                className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
                style={{ backgroundColor: 'var(--sis-bg-surface-elevated)', borderColor: 'var(--sis-border-subtle)' }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black uppercase text-slate-400">{quad.nivel}</span>
                    <i className={`fa-solid ${quad.icone} text-base`}></i>
                  </div>
                  <h3 className="text-sm font-black sis-text-primary">{quad.titulo}</h3>
                  <p className="text-xs sis-text-secondary leading-relaxed">
                    {quad.descricao}
                  </p>
                </div>

                <div className="pt-2 border-t text-[10px] font-mono text-center sis-text-muted" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                  Símbolo Visual: <strong className="sis-text-primary">{quad.circulo}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 6: MATRIZ DE RESPONSABILIDADES & PERFIS RBAC
          ========================================================================= */}
      {activeGuiaSection === 'MATRIZ_RACI' && (
        <div 
          className="rounded-2xl p-5 border sis-bg-surface sis-shadow-sm space-y-5"
          style={{ borderColor: 'var(--sis-border-main)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black sis-text-primary flex items-center gap-2">
                <i className="fa-solid fa-user-lock text-sky-500"></i>
                Matriz de Perfis & Permissões (RBAC / RACI)
              </h2>
              <p className="text-xs sis-text-muted">
                Governança de acesso em 7 níveis: o que cada cargo pode visualizar, editar ou aprovar no sistema.
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('PERFIS_PERMISSOES')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer sis-btn-primary shrink-0"
            >
              <i className="fa-solid fa-user-shield"></i>
              <span>Gerenciar Perfis</span>
            </button>
          </div>

          {/* Tabela Comparativa de Permissões */}
          <div className="overflow-x-auto border rounded-xl" style={{ borderColor: 'var(--sis-border-main)' }}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b sis-bg-surface-elevated font-mono text-[10px] uppercase sis-text-muted" style={{ borderColor: 'var(--sis-border-main)' }}>
                  <th className="p-3">Módulo / Ferramenta</th>
                  <th className="p-3 text-center">Operador</th>
                  <th className="p-3 text-center">Team Leader</th>
                  <th className="p-3 text-center">Líder Linha</th>
                  <th className="p-3 text-center">Segurança</th>
                  <th className="p-3 text-center">Supervisão</th>
                  <th className="p-3 text-center">Admin</th>
                  <th className="p-3 text-center">Conta Máster</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--sis-border-subtle)' }}>
                {[
                  { modulo: 'Visualizar Mapa SVG & Postos', op: 'Sim', tl: 'Sim', ld: 'Sim', seg: 'Sim', sup: 'Sim', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Acionar Chamada Andon (F12)', op: 'Sim', tl: 'Sim', ld: 'Sim', seg: 'Sim', sup: 'Sim', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Briefing A1 & Alocação', op: 'Leitura', tl: 'Sim', ld: 'Sim', seg: 'Leitura', sup: 'Sim', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Executar Gemba Walk (FCI)', op: 'Não', tl: 'Sim', ld: 'Sim', seg: 'Sim', sup: 'Sim', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Quadro LAP (Criar Ações)', op: 'Não', tl: 'Sim', ld: 'Sim', seg: 'Sim', sup: 'Sim', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Red Rabbit & BP8 Amostral', op: 'Sim', tl: 'Sim', ld: 'Sim', seg: 'Leitura', sup: 'Sim', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Medida Conservatória BP9', op: 'Não', tl: 'Sim', ld: 'Sim', seg: 'Leitura', sup: 'Sim', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Cruz de Segurança & Heinrich', op: 'Relato', tl: 'Sim', ld: 'Sim', seg: 'Total', sup: 'Sim', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Matriz 331 (Editar Notas)', op: 'Não', tl: 'Sim', ld: 'Sim', seg: 'Não', sup: 'Sim', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Cadastros de Linhas & PDTs', op: 'Não', tl: 'Não', ld: 'Não', seg: 'Não', sup: 'Leitura', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Modo Edição do Layout SVG', op: 'Não', tl: 'Não', ld: 'Não', seg: 'Não', sup: 'Não', adm: 'Sim', mst: 'Sim' },
                  { modulo: 'Hierarquia WCM (Conta Máster)', op: 'Não', tl: 'Não', ld: 'Não', seg: 'Não', sup: 'Não', adm: 'Não', mst: 'Exclusivo' },
                ].map((row, rIdx) => (
                  <tr key={rIdx} className="hover:sis-bg-surface-elevated transition">
                    <td className="p-3 font-bold sis-text-primary">{row.modulo}</td>
                    <td className="p-3 text-center">{renderBadgePerm(row.op)}</td>
                    <td className="p-3 text-center">{renderBadgePerm(row.tl)}</td>
                    <td className="p-3 text-center">{renderBadgePerm(row.ld)}</td>
                    <td className="p-3 text-center">{renderBadgePerm(row.seg)}</td>
                    <td className="p-3 text-center">{renderBadgePerm(row.sup)}</td>
                    <td className="p-3 text-center">{renderBadgePerm(row.adm)}</td>
                    <td className="p-3 text-center">{renderBadgePerm(row.mst)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 7: PADRÕES DE QUALIDADE, ACESSIBILIDADE & ERGONOMIA INDUSTRIAL
          ========================================================================= */}
      {activeGuiaSection === 'PADROES_QUALIDADE' && (
        <div 
          className="rounded-2xl p-5 border sis-bg-surface sis-shadow-sm space-y-5"
          style={{ borderColor: 'var(--sis-border-main)' }}
        >
          <div>
            <h2 className="text-base font-black sis-text-primary flex items-center gap-2">
              <i className="fa-solid fa-universal-access text-teal-500"></i>
              Padrões Internacionais de Usabilidade & Qualidade de Software
            </h2>
            <p className="text-xs sis-text-muted">
              Diretrizes mundiais aplicadas na interface do SIS Stellantis Betim (WCAG AAA, ISO 9241, ISO 3864).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border sis-bg-surface-elevated space-y-2" style={{ borderColor: 'var(--sis-border-subtle)' }}>
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase">
                <i className="fa-solid fa-eye"></i> Contraste WCAG AAA (7:1)
              </div>
              <p className="text-xs sis-text-secondary leading-relaxed">
                Tanto o Tema Escuro quanto o Tema Claro foram calibrados para garantir relação de contraste 
                superior a 7:1 entre texto e fundo, eliminando fadiga visual em monitores industriais de 24 horas.
              </p>
            </div>

            <div className="p-4 rounded-xl border sis-bg-surface-elevated space-y-2" style={{ borderColor: 'var(--sis-border-subtle)' }}>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <i className="fa-solid fa-mobile-screen"></i> Ergonomia Touch Mobile
              </div>
              <p className="text-xs sis-text-secondary leading-relaxed">
                Áreas de toque com dimensão mínima de 44x44 pixels (padrão Apple e Google Material Design), 
                com barra de navegação rápida inferior para uso com luvas industriais em tablets e coletores.
              </p>
            </div>

            <div className="p-4 rounded-xl border sis-bg-surface-elevated space-y-2" style={{ borderColor: 'var(--sis-border-subtle)' }}>
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase">
                <i className="fa-solid fa-font"></i> Tipografia Mundial Enterprise
              </div>
              <p className="text-xs sis-text-secondary leading-relaxed">
                Uso de <strong>Plus Jakarta Sans</strong> para clareza em títulos e botões, combinada com 
                <strong>JetBrains Mono</strong> com números tabulares e zero cortado para telemetria e cronoanálise.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper para renderizar badges na matriz de permissões
function renderBadgePerm(valor: string) {
  if (valor === 'Sim' || valor === 'Total' || valor === 'Exclusivo') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        {valor}
      </span>
    );
  }
  if (valor === 'Leitura' || valor === 'Relato') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
        {valor}
      </span>
    );
  }
  return (
    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500">
      —
    </span>
  );
}
