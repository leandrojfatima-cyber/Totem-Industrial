import React, { useState, useEffect, useMemo } from 'react';
import {
  TeamLeaderRecord,
  LinhaProducaoRecord,
  PostoTrabalhoRecord,
  OperacaoCicloRecord
} from './types/cadastros';
import {
  INITIAL_TEAM_LEADERS,
  INITIAL_LINHAS,
  INITIAL_POSTOS,
  INITIAL_OPERACOES
} from './data/cadastrosInitialData';
import { MapaLinhaView } from './components/MapaLinhaView';
import { MapaLinhaSvgView } from './components/MapaLinhaSvgView';
import { SidebarNavigation } from './components/SidebarNavigation';
import { FerramentalPatrimonioView } from './components/FerramentalPatrimonioView';
import { PerfisPermissoesView } from './components/PerfisPermissoesView';
import { LogsView } from './components/LogsView';
import { GestaoHierarquiaMasterView } from './components/GestaoHierarquiaMasterView';
import { QualidadeView } from './components/QualidadeView';
import { SegurancaView } from './components/SegurancaView';
import { SisWoView } from './components/SisWoView';
import { 
  UserRole,
  UteRecord,
  TrechoRecord,
  DominioRecord,
  TotemRecord,
  AcumuloLinhaRecord,
  IndicadorQualidadeRecord,
  PiramideHeinrichData,
  QuaseAcidenteRecord,
  InspecaoEpiRecord,
  PadraoProcedimentoSis,
  WoPadraoFundamentalItem,
  WoPontoVermelhoRecord,
  MapaPdtRecord
} from './types/mapa';
import {
  INITIAL_UTES,
  INITIAL_TRECHOS,
  INITIAL_DOMINIOS,
  INITIAL_TOTENS,
  INITIAL_ACUMULOS,
  INITIAL_QUALIDADE_INDICADORES,
  INITIAL_HEINRICH_DATA,
  INITIAL_QUASE_ACIDENTES,
  INITIAL_INSPECOES_EPI,
  INITIAL_SIS_PADROES,
  INITIAL_WO_PADROES,
  INITIAL_WO_PONTOS_VERMELHOS,
  generateInitialPdts
} from './data/mapaInitialData';
import { TeamLeadersView } from './components/TeamLeadersView';
import { LinhasProducaoView } from './components/LinhasProducaoView';
import { PostosTrabalhoView } from './components/PostosTrabalhoView';
import { OperacoesCiclosView } from './components/OperacoesCiclosView';
import {
  BriefingA1View,
  GembaWalkView,
  LapView,
  PolivalenciaView,
  ControleAmostralView,
  RedRabbitView,
  MedidaConservatoriaView,
  WhsConversationView,
  SwaView,
  RotinaTurnoView,
  EscalationMatrixView,
  KaizenBankView,
  RelatoriosView,
  CadastrosMasterView,
  GenericFormModal,
  DEFAULT_OK_SVG,
  DEFAULT_KO_SVG
} from './components/OriginalViews';

export interface SisData {
  header: {
    plant: string;
    shop: string;
    line: string;
    area: string;
    shift: string;
    teamLeader: string;
    totemId: string;
    date: string;
    tlAway: boolean;
    tlAwayJustification: string;
    ute: string;
    domain: string;
    weekNum: number;
    timeHorizon: string;
  };
  kpisYesterday: {
    safety: { val: number; target: number; status: string };
    quality: { val: number; target: number; status: string };
    ope: { val: string; target: string; status: string };
  };
  dailyInfo: string[];
  pautaBomDia: string[];
  shiftChanges: Array<{
    id: number;
    type: string;
    detail: string;
    conservatorio: string;
  }>;
  tomadaPosto: Array<{
    id: number;
    pdt: string;
    opName: string;
    opMatricula: string;
    shift: string;
    status: string;
  }>;
  heinrich: {
    semAcidente: number;
    firstAid: number;
    pSIF: number;
    recordable: number;
  };
  safetyCross: Record<number, string>;
  charts: {
    safety5s: {
      targetLine: number;
      monthlyAvg: number;
      days: number[];
    };
    quality: {
      targetLine: number;
      monthlyAvg: number;
      days: number[];
    };
    ope: {
      targetLine: number;
      monthlyAvg: number;
      days: number[];
    };
    yamazumi: {
      tctTarget: number;
      pdts: Array<{
        name: string;
        va: number;
        nva: number;
      }>;
    };
  };
  gembaWalk: {
    weekNum: number;
    auditor: string;
    area: string;
    items: Array<{
      id: number;
      area: string;
      point: string;
      ltl: number;
      lcl: number;
      ucl: number;
      utl: number;
      days: Record<string, { val: number | string; corr: string }>;
    }>;
    notes: Record<string, string>;
  };
  controlAmostral: Array<{
    id: number;
    item: string;
    source: string;
    model: string;
    station: string;
    kpiSource: string;
    insertDate: string;
    durationDays: number;
    frequency: string;
    status: string;
    checks: Array<{
      id: number;
      date: string;
      shift: string;
      hora: string;
      vis: string;
      status: string;
    }>;
    koLogs: Array<{
      id: number;
      date: string;
      hora: string;
      vis: string;
      turn: string;
      containment: string;
      containmentDate: string;
      containmentResp: string;
      resolution: string;
      resolutionDate: string;
      resolutionResp: string;
    }>;
  }>;
  medidasConservatorias: Array<{
    id: number;
    code: string;
    plantShop: string;
    ute: string;
    domain: string;
    station: string;
    respSupervisor: string;
    startDate: string;
    endDatePlanned: string;
    endDateReal: string;
    vinStart: string;
    vinEnd: string;
    products: string;
    desvioLinked: string;
    reason: string;
    what: string;
    how: string;
    okCondition: string;
    koCondition: string;
    okPhoto: string;
    koPhoto: string;
    whyReason: string;
    dailyTracking: Array<{ day: number; t1: number; t2: number; t3: number }>;
    status: string;
  }>;
  redRabbit: Array<{
    id: number;
    date: string;
    shift: string;
    pdt: string;
    device: string;
    anomalyProvoked: string;
    opTested: string;
    detected: boolean;
    status: string;
    tlSign: string;
  }>;
  lapActions: Array<{
    id: number;
    title: string;
    shift: string;
    col: string;
    owner: string;
    deadline: string;
  }>;
  whsConversations: Array<{
    id: number;
    week: number;
    tlName: string;
    pdt: string;
    status: string;
    note: string;
  }>;
  swaLogs: Array<{
    id: number;
    date: string;
    shift: string;
    pdt: string;
    operator: string;
    auditor: string;
    result: string;
    cycleTime1: string;
    cycleTime2: string;
    deviations: string;
  }>;
  shiftRoutines: Array<{
    id: number;
    shift: string;
    check5S: boolean;
    checkSafety: boolean;
    handOverNotes: string;
    tlSign: string;
  }>;
  efetivo: Array<{
    id: number;
    matricula: string;
    name: string;
    plant: string;
    line: string;
    area: string;
    shift: string;
    domain: string;
    pdtTitular: string;
    skills: Record<string, number>;
  }>;
  pdts: Array<{
    id: number;
    code: string;
    name: string;
    line: string;
    area: string;
    ergoCritical: boolean;
    ergoPair: string;
  }>;
  linhas: string[];
  areas: string[];
  turnos: string[];
  plantas: string[];
  shops: string[];
  kaizenBank: Array<{
    id: number;
    title: string;
    author: string;
    tool: string;
    area: string;
    status: string;
    savings: string;
    why1: string;
    why2: string;
    why3: string;
    why4: string;
    why5: string;
  }>;
  escaladaLogs: Array<{
    id: number;
    date: string;
    pdt: string;
    level: string;
    issue: string;
    responseTime: string;
    status: string;
    containment: string;
  }>;
  // Novos módulos estruturais
  teamLeadersList: TeamLeaderRecord[];
  linhasList: LinhaProducaoRecord[];
  postosList: PostoTrabalhoRecord[];
  operacoesList: OperacaoCicloRecord[];
}

const INITIAL_DATA: SisData = {
  header: {
    plant: "BETIM VHI",
    shop: "MONTAGEM",
    line: "LINHA 01",
    area: "TRIM 1",
    shift: "1º TURNO",
    teamLeader: "AVELINO DA SILVA",
    totemId: "TOT-L01-TRIM1",
    date: new Date().toISOString().split('T')[0],
    tlAway: false,
    tlAwayJustification: "",
    ute: "UTE 01 - TRIM",
    domain: "DOMÍNIO 02 - MONTAGEM INTERIOR",
    weekNum: 34,
    timeHorizon: "DIARIO"
  },
  kpisYesterday: {
    safety: { val: 0, target: 0, status: "OK" },
    quality: { val: 2, target: 3, status: "OK" },
    ope: { val: "94%", target: "90%", status: "OK" }
  },
  dailyInfo: [
    "Reunião de Bom Dia às 07:05h com a equipe de engenharia.",
    "Treinamento obrigatório T2W na sala de capacitação às 14h.",
    "Auditoria de 5S agendada para o posto OP 22 no 2º turno."
  ],
  pautaBomDia: [
    "Atenção ao aperto do conector de borracha na OP 20.",
    "Uso obrigatório do protetor auricular na zona de prensa.",
    "Foco na meta de 0 Post-it passante no turno."
  ],
  shiftChanges: [
    { id: 1, type: "Fornecedor", detail: "Novo lote de Chicote Elétrico (Lote 882B)", conservatorio: "Inspeção visual 100% no conector B" },
    { id: 2, type: "Operador", detail: "Operador Lucas cobrindo férias na OP 24", conservatorio: "Acompanhamento pelo TL nos primeiros 20 vcls" }
  ],
  tomadaPosto: [
    { id: 1, pdt: "OP 10", opName: "CARLOS SOUZA", opMatricula: "ST78921", shift: "1º TURNO", status: "PRESENTE" },
    { id: 2, pdt: "OP 20", opName: "MARCOS LIMA", opMatricula: "ST45210", shift: "1º TURNO", status: "PRESENTE" },
    { id: 3, pdt: "OP 22", opName: "AVELINO SILVA", opMatricula: "ST12098", shift: "1º TURNO", status: "PRESENTE" },
    { id: 4, pdt: "OP 24", opName: "LUCAS ROCHA", opMatricula: "ST99012", shift: "1º TURNO", status: "FALTA" }
  ],
  heinrich: { semAcidente: 28, firstAid: 2, pSIF: 1, recordable: 0 },
  safetyCross: {
    1: "GREEN", 2: "GREEN", 3: "GREEN", 4: "YELLOW", 5: "GREEN", 6: "GREEN", 7: "GREEN",
    8: "GREEN", 9: "GREEN", 10: "ORANGE", 11: "GREEN", 12: "GREEN", 13: "GREEN", 14: "GREEN",
    15: "GREEN", 16: "GREEN", 17: "GREEN", 18: "GREEN", 19: "GREEN", 20: "GREEN", 21: "GREEN",
    22: "GREEN", 23: "GREEN", 24: "GREEN", 25: "GREEN", 26: "GREEN", 27: "GREEN", 28: "GREEN",
    29: "GREEN", 30: "GREEN", 31: "GREEN"
  },
  charts: {
    safety5s: {
      targetLine: 2,
      monthlyAvg: 1.2,
      days: [1, 2, 0, 1, 3, 0, 0, 1, 2, 1, 0, 0, 1, 1, 2, 0, 0, 1, 0, 0, 2, 1, 0, 0, 1, 2, 0, 0, 1, 0, 1]
    },
    quality: {
      targetLine: 3,
      monthlyAvg: 1.8,
      days: [2, 4, 1, 2, 2, 0, 1, 3, 2, 1, 0, 2, 3, 1, 1, 0, 2, 1, 2, 0, 1, 3, 2, 1, 0, 2, 1, 0, 1, 2, 0]
    },
    ope: {
      targetLine: 10,
      monthlyAvg: 6.5,
      days: [5, 12, 4, 8, 15, 0, 2, 6, 8, 4, 2, 5, 14, 3, 2, 0, 4, 6, 2, 0, 5, 8, 4, 2, 1, 6, 3, 0, 2, 4, 1]
    },
    yamazumi: {
      tctTarget: 50,
      pdts: [
        { name: "OP 10", va: 38, nva: 8 },
        { name: "OP 20", va: 42, nva: 12 },
        { name: "OP 22", va: 35, nva: 10 },
        { name: "OP 24", va: 40, nva: 14 },
        { name: "OP 25", va: 32, nva: 15 }
      ]
    }
  },
  gembaWalk: {
    weekNum: 34,
    auditor: "AVELINO DA SILVA",
    area: "TRIM 1",
    items: [
      { id: 1, area: "OP 10", point: "Veículos em Reparo Elétrico", ltl: 0, lcl: 0, ucl: 2, utl: 4, days: { Mon: { val: 0, corr: "" }, Tue: { val: 2, corr: "" }, Wed: { val: 3, corr: "Ajuste chicote" }, Thu: { val: 5, corr: "Post-it #402" }, Fri: { val: 1, corr: "" } } },
      { id: 2, area: "OP 20", point: "Veículos FTC / Qualidade Direta", ltl: 95, lcl: 98, ucl: 100, utl: 100, days: { Mon: { val: 96, corr: "" }, Tue: { val: 95, corr: "Ajuste rosca" }, Wed: { val: 97, corr: "" }, Thu: { val: 98, corr: "" }, Fri: { val: 99, corr: "" } } },
      { id: 3, area: "OP 22", point: "Violas de EPI e Segurança", ltl: 0, lcl: 0, ucl: 1, utl: 3, days: { Mon: { val: 1, corr: "" }, Tue: { val: 0, corr: "" }, Wed: { val: 2, corr: "Orientação Óculos" }, Thu: { val: 0, corr: "" }, Fri: { val: 0, corr: "" } } },
      { id: 4, area: "OP 24", point: "Quantidade de IPs em Mãos", ltl: 2, lcl: 6, ucl: 20, utl: 30, days: { Mon: { val: 12, corr: "" }, Tue: { val: 16, corr: "" }, Wed: { val: 25, corr: "Limpeza de buffer" }, Thu: { val: 38, corr: "Ação Andon" }, Fri: { val: 4, corr: "" } } },
      { id: 5, area: "OP 25", point: "Performance Operacional da Linha (%)", ltl: 90, lcl: 95, ucl: 100, utl: 100, days: { Mon: { val: 98, corr: "" }, Tue: { val: 99.3, corr: "" }, Wed: { val: 99, corr: "" }, Thu: { val: 99.5, corr: "" }, Fri: { val: 95, corr: "Ação de linha" } } }
    ],
    notes: {
      Mon: "Início de semana com fluxo nominal e postos operacionais.",
      Tue: "Acompanhamento ergonômico na OP 20 pelo Supervisor.",
      Wed: "Contenção preventiva aplicada no chicote da OP 10.",
      Thu: "Auditoria de 5S positiva com destaque para a OP 24.",
      Fri: "Fechamento de semana sem ocorrências graves de segurança."
    }
  },
  controlAmostral: [
    { 
      id: 1, 
      item: "Check Torque Porca de Fixação Steering", 
      source: "PROCESSO", 
      model: "Fiat Pulse / Fastback", 
      station: "OP 22", 
      kpiSource: "DRR / Cliente",
      insertDate: "18/08/2026",
      durationDays: 15,
      frequency: "A cada 2 horas", 
      status: "OK", 
      checks: [
        { id: 101, date: "18/08/2026", shift: "1º TURNO", hora: "07:00", vis: "9BD120938", status: "OK" },
        { id: 102, date: "18/08/2026", shift: "1º TURNO", hora: "09:00", vis: "9BD120942", status: "OK" },
        { id: 103, date: "18/08/2026", shift: "1º TURNO", hora: "11:00", vis: "9BD120946", status: "OK" },
        { id: 104, date: "18/08/2026", shift: "1º TURNO", hora: "13:00", vis: "9BD120948", status: "OK" },
        { id: 105, date: "19/08/2026", shift: "2º TURNO", hora: "16:00", vis: "9BD120950", status: "OK" },
        { id: 106, date: "19/08/2026", shift: "2º TURNO", hora: "18:00", vis: "9BD120958", status: "KO" },
        { id: 107, date: "20/08/2026", shift: "2º TURNO", hora: "20:00", vis: "9BD120962", status: "OK" }
      ],
      koLogs: [
        { id: 201, date: "19/08/2026", hora: "18:00", vis: "9BD120958", turn: "2º TURNO", containment: "Abertura de Post-it #4021 & Re-torque manual com Torquímetro de estalo", containmentDate: "19/08/2026", containmentResp: "Avelino / Marcos", resolution: "Ajuste na calibração do cabeçote da OP 22 pela Manutenção", resolutionDate: "20/08/2026", resolutionResp: "Equipe Manutenção" }
      ]
    }
  ],
  medidasConservatorias: [
    { 
      id: 1, 
      code: "MC-2026-004", 
      plantShop: "BETIM VHI - MONTAGEM",
      ute: "UTE 01 - TRIM",
      domain: "DOMÍNIO 02 - MONTAGEM INTERIOR",
      station: "OP 20",
      respSupervisor: "MARCOS SILVA",
      startDate: "15/08/2026", 
      endDatePlanned: "15/09/2026", 
      endDateReal: "",
      vinStart: "9BD120500", 
      vinEnd: "9BD121800", 
      products: "Fiat Pulse / Fastback",
      desvioLinked: "SIM (#4021)",
      reason: "Reincidência de ruído e mau encaixe no conector C02 do painel de instrumentos", 
      what: "Adição de inspeção manual 100% e aplicação de feltro antiruído acústico protetivo na trava do conector C02",
      how: "Verificase o conector C02 possui o feltro protetivo aplicado antes da montagem na OP 20 e pressionar até ouvir o clique duplo de travamento.",
      okCondition: "Conector com feltro montado, sem folga, travamento positivo com clique duplo.",
      koCondition: "Conector sem feltro, trava folgada ou ruído ao chacoalhar o suporte.",
      okPhoto: DEFAULT_OK_SVG,
      koPhoto: DEFAULT_KO_SVG,
      whyReason: "Eliminar reclamações de cliente final (IQS) e passantes na auditoria de qualidade GA.",
      dailyTracking: [
        { day: 1, t1: 0, t2: 1, t3: 0 },
        { day: 2, t1: 0, t2: 0, t3: 0 },
        { day: 3, t1: 1, t2: 0, t3: 0 },
        { day: 4, t1: 0, t2: 0, t3: 0 },
        { day: 5, t1: 0, t2: 0, t3: 0 }
      ],
      status: "ATIVA (BP9 - 30 DIAS)" 
    }
  ],
  redRabbit: [
    { id: 1, date: "22/08/2026", shift: "1º TURNO", pdt: "OP 20", device: "Poka-Yoke Presença Conector", anomalyProvoked: "Pino invertido de propósito", opTested: "Marcos Lima", detected: true, status: "APROVADO", tlSign: "Avelino da Silva" }
  ],
  lapActions: [
    { id: 1, title: "Ajustar suporte de apoio na OP 22", shift: "1º TURNO", col: "EM CURSO", owner: "Avelino", deadline: "28/08/2026" },
    { id: 2, title: "Troca de ponteira da torquadeira OP 20", shift: "1º TURNO", col: "NOVO", owner: "Manutenção", deadline: "25/08/2026" }
  ],
  whsConversations: [
    { id: 1, week: 32, tlName: "Avelino da Silva", pdt: "OP 22", status: "REALIZADA", note: "Diálogo sobre postura ergonômica ao parafusar" }
  ],
  swaLogs: [
    { id: 1, date: "21/08/2026", shift: "1º TURNO", pdt: "OP 20", operator: "Marcos Lima", auditor: "Avelino", result: "VERDE", cycleTime1: "48s", cycleTime2: "49s", deviations: "Nenhum desvio detectado" }
  ],
  shiftRoutines: [
    { id: 1, shift: "1º TURNO", check5S: true, checkSafety: true, handOverNotes: "Linha limpa e postos operacionais. Atenção à OP 22 por causa do torque.", tlSign: "Avelino da Silva" }
  ],
  efetivo: [
    { id: 1, matricula: "ST78921", name: "CARLOS SOUZA", plant: "BETIM VHI", line: "LINHA 01", area: "TRIM 1", shift: "1º TURNO", domain: "DOMÍNIO 02", pdtTitular: "OP 10", skills: { "OP 10": 3, "OP 20": 3, "OP 22": 1, "OP 24": 0 } },
    { id: 2, matricula: "ST45210", name: "MARCOS LIMA", plant: "BETIM VHI", line: "LINHA 01", area: "TRIM 1", shift: "1º TURNO", domain: "DOMÍNIO 02", pdtTitular: "OP 20", skills: { "OP 10": 1, "OP 20": 3, "OP 22": 3, "OP 24": 1 } },
    { id: 3, matricula: "ST12098", name: "AVELINO SILVA", plant: "BETIM VHI", line: "LINHA 01", area: "TRIM 1", shift: "1º TURNO", domain: "DOMÍNIO 02", pdtTitular: "OP 22", skills: { "OP 10": 3, "OP 20": 3, "OP 22": 3, "OP 24": 3 } },
    { id: 4, matricula: "ST99012", name: "LUCAS ROCHA", plant: "BETIM VHI", line: "LINHA 01", area: "TRIM 1", shift: "1º TURNO", domain: "DOMÍNIO 02", pdtTitular: "OP 24", skills: { "OP 10": 0, "OP 20": 1, "OP 22": 1, "OP 24": 3 } }
  ],
  pdts: [
    { id: 1, code: "OP 10", name: "Montagem do Suporte Inicial", line: "LINHA 01", area: "TRIM 1", ergoCritical: false, ergoPair: "OP 20" },
    { id: 2, code: "OP 20", name: "Conexão de Chicotes Elétricos", line: "LINHA 01", area: "TRIM 1", ergoCritical: true, ergoPair: "OP 10" },
    { id: 3, code: "OP 22", name: "Aperto de Torque Steering", line: "LINHA 01", area: "TRIM 1", ergoCritical: false, ergoPair: "OP 24" },
    { id: 4, code: "OP 24", name: "Fixação do Painel Principal", line: "LINHA 01", area: "TRIM 1", ergoCritical: true, ergoPair: "OP 22" }
  ],
  linhas: ["LINHA 01", "LINHA 02", "LINHA 03", "LINHA 04"],
  areas: ["TRIM 1", "TRIM 2", "CHASSIS", "FINAL", "MECÂNICA"],
  turnos: ["1º TURNO", "2º TURNO", "3º TURNO"],
  plantas: ["BETIM VHI", "BETIM MOTORES", "PORTO REAL - RJ", "GOIANA - PE", "CÓRDOBA - ARGENTINA"],
  shops: ["MONTAGEM", "FUNILARIA", "PINTURA", "PRENSAS", "POWERTRAIN"],
  kaizenBank: [
    { id: 1, title: "Redução de Caminhada na Busca do Parafuso M8", author: "Avelino da Silva", tool: "Quick Kaizen", area: "TRIM 1", status: "CONCLUÍDO", savings: "12s NVA por veículo", why1: "Caminhada longa", why2: "Caixa distante", why3: "Layout antigo", why4: "Falta de suporte no posto", why5: "Ausência de estudo de ergonomia" },
    { id: 2, title: "Eliminação de Risco Ergonômico de Coluna na OP 24", author: "Lucas Rocha", tool: "A3 / HERA", area: "TRIM 1", status: "EM ANDAMENTO", savings: "Redução Ergo Nível Vermelho", why1: "Esforço lombar", why2: "Peça pesada sem suporte", why3: "Ausência de manipulador", why4: "Aguardando orçamento", why5: "Falta de especificação técnica" }
  ],
  escaladaLogs: [
    { id: 1, date: "22/08/2026 08:30", pdt: "OP 22", level: "L1 - Team Leader", issue: "Falha intermitente na torquadeira de estalo", responseTime: "4 min", status: "RESOLVIDO", containment: "Substituição por torquadeira reserva calibrada" }
  ],
  teamLeadersList: INITIAL_TEAM_LEADERS,
  linhasList: INITIAL_LINHAS,
  postosList: INITIAL_POSTOS,
  operacoesList: INITIAL_OPERACOES
};

export default function App() {
  const [data, setData] = useState<SisData>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_data_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_DATA,
          ...parsed,
          teamLeadersList: (parsed.teamLeadersList && parsed.teamLeadersList.length > 0)
            ? parsed.teamLeadersList
            : INITIAL_TEAM_LEADERS,
          linhasList: (parsed.linhasList && parsed.linhasList.length > 0)
            ? parsed.linhasList
            : INITIAL_LINHAS,
          postosList: (parsed.postosList && parsed.postosList.length > 0)
            ? parsed.postosList
            : INITIAL_POSTOS,
          operacoesList: (parsed.operacoesList && parsed.operacoesList.length > 0)
            ? parsed.operacoesList
            : INITIAL_OPERACOES
        };
      }
    } catch(e) {
      console.error("Erro ao carregar dados do LocalStorage:", e);
    }
    return INITIAL_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>("MAPA_LINHA");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTargetId, setModalTargetId] = useState<number | null>(null);

  // Gestão de Perfil do Usuário
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_user_role') as UserRole;
      if (saved) return saved;
    } catch (e) {}
    return 'ADMINISTRADOR';
  });

  useEffect(() => {
    try {
      localStorage.setItem('sis_totem_user_role', currentRole);
    } catch (e) {}
  }, [currentRole]);

  // Gestão de Tema Claro e Tema Escuro
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('sis_totem_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (e) {
      console.error("Erro ao carregar tema do LocalStorage:", e);
    }
    return 'dark'; // Padrão escuro original
  });

  useEffect(() => {
    try {
      localStorage.setItem('sis_totem_theme', theme);
    } catch (e) {
      console.error("Erro ao salvar tema no LocalStorage:", e);
    }

    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Estados da Hierarquia Industrial Stellantis (Conta Máster)
  const [utes, setUtes] = useState<UteRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_utes_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_UTES;
  });

  const [trechos, setTrechos] = useState<TrechoRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_trechos_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TRECHOS;
  });

  const [dominios, setDominios] = useState<DominioRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_dominios_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DOMINIOS;
  });

  const [totens, setTotens] = useState<TotemRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_totens_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TOTENS;
  });

  const [acumulos, setAcumulos] = useState<AcumuloLinhaRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_acumulos_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ACUMULOS;
  });

  const [mapaPdts, setMapaPdts] = useState<MapaPdtRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_mapa_pdts_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return generateInitialPdts();
  });

  // Estados de Qualidade, Segurança e SIS/WO
  const [indicadoresQualidade, setIndicadoresQualidade] = useState<IndicadorQualidadeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_qualidade_kpis_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_QUALIDADE_INDICADORES;
  });

  const [heinrichData, setHeinrichData] = useState<PiramideHeinrichData>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_heinrich_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_HEINRICH_DATA;
  });

  const [quaseAcidentes, setQuaseAcidentes] = useState<QuaseAcidenteRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_quase_acidentes_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_QUASE_ACIDENTES;
  });

  const [inspecoesEpi, setInspecoesEpi] = useState<InspecaoEpiRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_inspecoes_epi_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_INSPECOES_EPI;
  });

  const [padroesSis, setPadroesSis] = useState<PadraoProcedimentoSis[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_padroes_sis_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SIS_PADROES;
  });

  const [woPadroes, setWoPadroes] = useState<WoPadraoFundamentalItem[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_wo_padroes_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WO_PADROES;
  });

  const [pontosVermelhos, setPontosVermelhos] = useState<WoPontoVermelhoRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sis_totem_pontos_vermelhos_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WO_PONTOS_VERMELHOS;
  });

  // Salvar no localStorage sempre que houver modificações
  useEffect(() => {
    localStorage.setItem('sis_totem_utes_v1', JSON.stringify(utes));
  }, [utes]);

  useEffect(() => {
    localStorage.setItem('sis_totem_trechos_v1', JSON.stringify(trechos));
  }, [trechos]);

  useEffect(() => {
    localStorage.setItem('sis_totem_dominios_v1', JSON.stringify(dominios));
  }, [dominios]);

  useEffect(() => {
    localStorage.setItem('sis_totem_totens_v1', JSON.stringify(totens));
  }, [totens]);

  useEffect(() => {
    localStorage.setItem('sis_totem_acumulos_v1', JSON.stringify(acumulos));
  }, [acumulos]);

  useEffect(() => {
    localStorage.setItem('sis_totem_mapa_pdts_v2', JSON.stringify(mapaPdts));
  }, [mapaPdts]);

  useEffect(() => {
    localStorage.setItem('sis_totem_qualidade_kpis_v1', JSON.stringify(indicadoresQualidade));
  }, [indicadoresQualidade]);

  useEffect(() => {
    localStorage.setItem('sis_totem_heinrich_v1', JSON.stringify(heinrichData));
  }, [heinrichData]);

  useEffect(() => {
    localStorage.setItem('sis_totem_quase_acidentes_v1', JSON.stringify(quaseAcidentes));
  }, [quaseAcidentes]);

  useEffect(() => {
    localStorage.setItem('sis_totem_inspecoes_epi_v1', JSON.stringify(inspecoesEpi));
  }, [inspecoesEpi]);

  useEffect(() => {
    localStorage.setItem('sis_totem_padroes_sis_v1', JSON.stringify(padroesSis));
  }, [padroesSis]);

  useEffect(() => {
    localStorage.setItem('sis_totem_wo_padroes_v1', JSON.stringify(woPadroes));
  }, [woPadroes]);

  useEffect(() => {
    localStorage.setItem('sis_totem_pontos_vermelhos_v1', JSON.stringify(pontosVermelhos));
  }, [pontosVermelhos]);

  // Handlers para Hierarquia Industrial (Conta Máster)
  const handleSaveUte = (ute: UteRecord) => {
    setUtes(prev => {
      const idx = prev.findIndex(u => u.id === ute.id);
      return idx >= 0 ? prev.map(u => u.id === ute.id ? ute : u) : [...prev, ute];
    });
  };

  const handleDeleteUte = (id: string) => {
    if (window.confirm('Excluir esta UTE?')) {
      setUtes(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSaveTrecho = (trecho: TrechoRecord) => {
    setTrechos(prev => {
      const idx = prev.findIndex(t => t.id === trecho.id);
      return idx >= 0 ? prev.map(t => t.id === trecho.id ? trecho : t) : [...prev, trecho];
    });
  };

  const handleDeleteTrecho = (id: string) => {
    if (window.confirm('Excluir este Trecho?')) {
      setTrechos(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveDominio = (dominio: DominioRecord) => {
    setDominios(prev => {
      const idx = prev.findIndex(d => d.id === dominio.id);
      return idx >= 0 ? prev.map(d => d.id === dominio.id ? dominio : d) : [...prev, dominio];
    });
  };

  const handleDeleteDominio = (id: string) => {
    if (window.confirm('Excluir este Domínio?')) {
      setDominios(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleSaveTotem = (totem: TotemRecord) => {
    setTotens(prev => {
      const idx = prev.findIndex(t => t.id === totem.id);
      return idx >= 0 ? prev.map(t => t.id === totem.id ? totem : t) : [...prev, totem];
    });
  };

  const handleDeleteTotem = (id: string) => {
    if (window.confirm('Excluir este Totem?')) {
      setTotens(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveAcumulo = (acumulo: AcumuloLinhaRecord) => {
    setAcumulos(prev => {
      const idx = prev.findIndex(a => a.id === acumulo.id);
      return idx >= 0 ? prev.map(a => a.id === acumulo.id ? acumulo : a) : [...prev, acumulo];
    });
  };

  const handleDeleteAcumulo = (id: string) => {
    if (window.confirm('Excluir este Acúmulo de Linha?')) {
      setAcumulos(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSavePdtMaster = (pdt: MapaPdtRecord) => {
    setMapaPdts(prev => {
      const idx = prev.findIndex(p => p.id === pdt.id);
      return idx >= 0 ? prev.map(p => p.id === pdt.id ? pdt : p) : [...prev, pdt];
    });
  };

  const handleDeletePdtMaster = (id: string) => {
    if (window.confirm('Excluir este PDT?')) {
      setMapaPdts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Handlers para Qualidade
  const handleSaveIndicador = (ind: IndicadorQualidadeRecord) => {
    setIndicadoresQualidade(prev => {
      const idx = prev.findIndex(i => i.id === ind.id);
      return idx >= 0 ? prev.map(i => i.id === ind.id ? ind : i) : [...prev, ind];
    });
  };

  const handleDeleteIndicador = (id: string) => {
    if (window.confirm('Excluir este Indicador de Qualidade?')) {
      setIndicadoresQualidade(prev => prev.filter(i => i.id !== id));
    }
  };

  // Handlers para Segurança
  const handleSaveQuaseAcidente = (qa: QuaseAcidenteRecord) => {
    setQuaseAcidentes(prev => [qa, ...prev]);
  };

  const handleSaveInspecaoEpi = (epi: InspecaoEpiRecord) => {
    setInspecoesEpi(prev => [epi, ...prev]);
  };

  const handleUpdateSafetyCross = (day: number, status: string) => {
    setData(prev => ({
      ...prev,
      safetyCross: {
        ...(prev.safetyCross || {}),
        [day]: status
      }
    }));
  };

  // Handlers para SIS e WO
  const handleSavePadrao = (padrao: PadraoProcedimentoSis) => {
    setPadroesSis(prev => {
      const idx = prev.findIndex(p => p.id === padrao.id);
      return idx >= 0 ? prev.map(p => p.id === padrao.id ? padrao : p) : [...prev, padrao];
    });
  };

  const handleDeletePadrao = (id: string) => {
    if (window.confirm('Excluir este Padrão SIS?')) {
      setPadroesSis(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveWoPadrao = (item: WoPadraoFundamentalItem) => {
    setWoPadroes(prev => prev.map(w => w.id === item.id ? item : w));
  };

  const handleSavePontoVermelho = (tag: WoPontoVermelhoRecord) => {
    setPontosVermelhos(prev => {
      const idx = prev.findIndex(t => t.id === tag.id);
      return idx >= 0 ? prev.map(t => t.id === tag.id ? tag : t) : [tag, ...prev];
    });
  };

  const handleDeletePontoVermelho = (id: string) => {
    if (window.confirm('Excluir esta Etiqueta Vermelha?')) {
      setPontosVermelhos(prev => prev.filter(t => t.id !== id));
    }
  };

  // Filtros contextuais ao navegar de um módulo para outro
  const [contextLinhaPostos, setContextLinhaPostos] = useState<string | undefined>(undefined);
  const [contextPdtOperacoes, setContextPdtOperacoes] = useState<string | undefined>(undefined);
  const [headerGlobalSearch, setHeaderGlobalSearch] = useState('');

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerGlobalSearch.trim()) {
      setActiveTab('MAPA_LINHA');
    }
  };

  // Backup em arquivo JSON (Exportação e Importação rápida no navegador)
  const handleExportBackupCompleto = () => {
    try {
      const backup = {
        sistema: 'SIS Totem Team Leader System — Stellantis',
        versao: '5.2',
        dataHora: new Date().toISOString(),
        sisData: data,
        mapaPdts: JSON.parse(localStorage.getItem('sis_totem_mapa_pdts_v1') || '[]'),
        tema: theme,
        perfilAtivo: currentRole
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sis_totem_backup_stellantis_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Erro ao gerar backup JSON: ' + (e as Error).message);
    }
  };

  const handleImportBackupCompleto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.sisData) {
          setData(parsed.sisData);
          localStorage.setItem('sis_totem_data_v2', JSON.stringify(parsed.sisData));
        }
        if (parsed.mapaPdts && Array.isArray(parsed.mapaPdts)) {
          localStorage.setItem('sis_totem_mapa_pdts_v1', JSON.stringify(parsed.mapaPdts));
        }
        if (parsed.tema) setTheme(parsed.tema);
        if (parsed.perfilAtivo) setCurrentRole(parsed.perfilAtivo);
        alert('Backup completo importado com sucesso!');
      } catch (err) {
        alert('Erro ao importar backup: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    try {
      localStorage.setItem('sis_totem_data_v2', JSON.stringify(data));
    } catch(e) {
      console.error("Erro ao salvar dados no LocalStorage:", e);
    }
  }, [data]);

  const auditScore = useMemo(() => {
    let points = 0;
    const maxPoints = 5;

    if (data.header?.teamLeader) points += 1;
    if ((data.gembaWalk?.items || []).length > 0) points += 1;
    if ((data.controlAmostral || []).length > 0) points += 1;
    if ((data.medidasConservatorias || []).length > 0) points += 1;
    if ((data.kaizenBank || []).length > 0) points += 1;

    return Math.round((points / maxPoints) * 100);
  }, [data]);

  const openFormModal = (type: string, targetId: number | null = null) => {
    setActiveModal(type);
    setModalTargetId(targetId);
  };

  const closeFormModal = () => {
    setActiveModal(null);
    setModalTargetId(null);
  };

  // Handlers para Team Leaders
  const handleSaveTeamLeader = (tl: TeamLeaderRecord) => {
    setData(prev => {
      const exists = prev.teamLeadersList.some(item => item.id === tl.id);
      const updatedList = exists
        ? prev.teamLeadersList.map(item => item.id === tl.id ? tl : item)
        : [...prev.teamLeadersList, tl];
      return { ...prev, teamLeadersList: updatedList };
    });
  };

  const handleToggleStatusTeamLeader = (id: number) => {
    setData(prev => {
      const targetTl = prev.teamLeadersList.find(tl => tl.id === id);
      if (!targetTl) return prev;

      // Se for inativar, verificar se há linhas ativas com ele como responsável
      if (targetTl.status === 'ATIVO') {
        const linhasVinculadas = prev.linhasList.filter(
          l => l.status === 'ATIVA' && l.teamLeaderMatricula === targetTl.matricula
        );
        if (linhasVinculadas.length > 0) {
          const codigos = linhasVinculadas.map(l => l.codigo).join(', ');
          const proceed = window.confirm(
            `Atenção: O Team Leader ${targetTl.nome} (${targetTl.matricula}) é o responsável atual pelas seguintes linhas ativas: ${codigos}.\n\nAo inativar, o histórico será preservado, mas recomendamos atribuir outro responsável para essas linhas.\n\nDeseja continuar com a inativação?`
          );
          if (!proceed) return prev;
        }
      }

      const updatedList = prev.teamLeadersList.map(item => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: item.status === 'ATIVO' ? ('INATIVO' as const) : ('ATIVO' as const)
        };
      });

      return { ...prev, teamLeadersList: updatedList };
    });
  };

  // Handlers para Linhas de Produção
  const handleSaveLinha = (linha: LinhaProducaoRecord) => {
    setData(prev => {
      const exists = prev.linhasList.some(l => l.id === linha.id);
      const updatedList = exists
        ? prev.linhasList.map(l => l.id === linha.id ? linha : l)
        : [...prev.linhasList, linha];

      // Sincronizar também a lista de nomes de linha do sistema original se for nova
      let novasLinhasNomes = [...prev.linhas];
      if (!novasLinhasNomes.includes(linha.codigo)) {
        novasLinhasNomes.push(linha.codigo);
      }

      return { ...prev, linhasList: updatedList, linhas: novasLinhasNomes };
    });
  };

  const handleToggleStatusLinha = (id: number) => {
    setData(prev => {
      const targetLinha = prev.linhasList.find(l => l.id === id);
      if (!targetLinha) return prev;

      // Se for inativar, verificar se tem postos ativos
      if (targetLinha.status === 'ATIVA') {
        const postosAtivos = prev.postosList.filter(
          p => p.linhaCodigo === targetLinha.codigo && p.status === 'ATIVO'
        );
        if (postosAtivos.length > 0) {
          const proceed = window.confirm(
            `Atenção: A linha ${targetLinha.codigo} possui ${postosAtivos.length} postos de trabalho (PDT) ativos vinculados.\n\nDeseja realmente inativar esta linha de produção? O histórico continuará preservado.`
          );
          if (!proceed) return prev;
        }
      }

      const updatedList = prev.linhasList.map(item => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: item.status === 'ATIVA' ? ('INATIVA' as const) : ('ATIVA' as const)
        };
      });

      return { ...prev, linhasList: updatedList };
    });
  };

  // Handlers para Postos de Trabalho (PDT)
  const handleSavePosto = (posto: PostoTrabalhoRecord) => {
    setData(prev => {
      const exists = prev.postosList.some(p => p.id === posto.id);
      const updatedList = exists
        ? prev.postosList.map(p => p.id === posto.id ? posto : p)
        : [...prev.postosList, posto];

      // Sincronizar também a lista de pdts simplificados do sistema original se aplicável
      let novosPdts = [...prev.pdts];
      const pdtIndex = novosPdts.findIndex(p => p.code === posto.codigo);
      if (pdtIndex >= 0) {
        novosPdts[pdtIndex] = {
          ...novosPdts[pdtIndex],
          name: posto.nome,
          line: posto.linhaCodigo,
          area: posto.areaTrecho,
          ergoCritical: !!posto.ergoCritico
        };
      } else {
        novosPdts.push({
          id: posto.id,
          code: posto.codigo,
          name: posto.nome,
          line: posto.linhaCodigo,
          area: posto.areaTrecho,
          ergoCritical: !!posto.ergoCritico,
          ergoPair: 'OP 10'
        });
      }

      return { ...prev, postosList: updatedList, pdts: novosPdts };
    });
  };

  const handleToggleStatusPosto = (id: number) => {
    setData(prev => {
      const targetPdt = prev.postosList.find(p => p.id === id);
      if (!targetPdt) return prev;

      if (targetPdt.status === 'ATIVO') {
        const opsAtivas = prev.operacoesList.filter(
          op => op.pdtCodigo === targetPdt.codigo && op.status === 'ATIVA'
        );
        if (opsAtivas.length > 0) {
          const proceed = window.confirm(
            `Atenção: O posto ${targetPdt.codigo} possui ${opsAtivas.length} operações ativas vinculadas.\n\nDeseja prosseguir com a inativação do posto?`
          );
          if (!proceed) return prev;
        }
      }

      const updatedList = prev.postosList.map(item => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: item.status === 'ATIVO' ? ('INATIVO' as const) : ('ATIVO' as const)
        };
      });

      return { ...prev, postosList: updatedList };
    });
  };

  const handleReorderPostos = (linhaCodigo: string, novosPostosMesmaLinha: PostoTrabalhoRecord[]) => {
    setData(prev => {
      const outrosPostos = prev.postosList.filter(p => p.linhaCodigo !== linhaCodigo);
      return {
        ...prev,
        postosList: [...outrosPostos, ...novosPostosMesmaLinha]
      };
    });
  };

  // Handlers para Operações e Ciclos
  const handleSaveOperacao = (operacao: OperacaoCicloRecord) => {
    setData(prev => {
      const exists = prev.operacoesList.some(o => o.id === operacao.id);
      const updatedList = exists
        ? prev.operacoesList.map(o => o.id === operacao.id ? operacao : o)
        : [...prev.operacoesList, operacao];

      return { ...prev, operacoesList: updatedList };
    });
  };

  const handleToggleStatusOperacao = (id: number) => {
    setData(prev => {
      const updatedList = prev.operacoesList.map(item => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: item.status === 'ATIVA' ? ('INATIVA' as const) : ('ATIVA' as const)
        };
      });
      return { ...prev, operacoesList: updatedList };
    });
  };

  // Navegações contextuais entre telas
  const handleNavigateToPostos = (linhaCodigo?: string) => {
    setContextLinhaPostos(linhaCodigo || 'TODAS');
    setActiveTab('CADASTRO_PDT');
  };

  const handleNavigateToOperacoes = (pdtCodigo?: string) => {
    setContextPdtOperacoes(pdtCodigo || 'TODOS');
    setActiveTab('CADASTRO_OPERACOES');
  };

  const rolesList: { role: UserRole; label: string }[] = [
    { role: 'OPERADOR', label: 'Operador de Montagem' },
    { role: 'TEAM_LEADER', label: 'Team Leader (T-Leader)' },
    { role: 'LIDER', label: 'Líder de Área / Setor' },
    { role: 'SHIFT', label: 'Líder de Turno (Shift)' },
    { role: 'SUPERVISAO', label: 'Supervisão de Produção' },
    { role: 'GERENTE', label: 'Gerente da Fábrica' },
    { role: 'SEGURANCA', label: 'Segurança & WHS' },
    { role: 'ADMINISTRADOR', label: 'Administrador' }
  ];

  return (
    <div className={`flex h-screen overflow-hidden font-sans antialiased transition-colors ${
      theme === 'light' ? 'bg-slate-50 text-slate-900 theme-light' : 'bg-slate-950 text-slate-100 theme-dark'
    }`}>
      {/* Sidebar Retrátil com os 6 Agrupamentos Lógicos da Fase 2 */}
      <SidebarNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        theme={theme}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        onSetTheme={setTheme}
      />

      {/* Área Principal de Conteúdo */}
      <main className={`flex-1 flex flex-col h-screen overflow-hidden ${
        theme === 'light' ? 'bg-slate-50' : 'bg-slate-950'
      }`}>
        <header className={`border-b px-4 py-2.5 flex flex-wrap justify-between items-center no-print shrink-0 gap-2 ${
          theme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center space-x-3">
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
              theme === 'light' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-800 text-amber-300 border-slate-700'
            }`}>
              {data.header.plant}
            </span>
            <span className={`text-xs font-mono hidden md:inline ${theme === 'light' ? 'text-slate-600 font-semibold' : 'text-slate-300'}`}>
              {data.header.line} • {data.header.area}
            </span>

            {/* Filtro de Busca Global (PDT, Linha ou T-Leader) */}
            <form onSubmit={handleHeaderSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Busca global (PDT, Linha, Líder)..."
                value={headerGlobalSearch}
                onChange={e => setHeaderGlobalSearch(e.target.value)}
                className={`text-xs font-mono pl-7 pr-3 py-1 rounded-lg border w-44 sm:w-56 focus:outline-none focus:border-sky-500 transition ${
                  theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
              <i className="fa-solid fa-magnifying-glass text-slate-400 text-[11px] absolute left-2.5 pointer-events-none"></i>
            </form>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Seletor Rápido de Perfil de Usuário */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400 hidden lg:inline font-bold">Perfil:</span>
              <select
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value as UserRole)}
                className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none focus:border-sky-500 ${
                  theme === 'light'
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-700 text-sky-400'
                }`}
                title="Troca rápida de perfil de usuário para testar a visão de cada usuário"
              >
                {rolesList.map(r => (
                  <option key={r.role} value={r.role}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Backup JSON (Exportar e Importar Rápido no Navegador) */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleExportBackupCompleto}
                className={`p-1.5 px-2 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer shadow-xs ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
                }`}
                title="Exportar backup completo em JSON (dados, mapa e cadastros)"
              >
                <i className="fa-solid fa-download text-xs"></i>
                <span className="hidden xl:inline text-[10px]">Backup JSON</span>
              </button>

              <label
                className={`p-1.5 px-2 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer shadow-xs ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
                }`}
                title="Restaurar backup completo a partir de arquivo JSON"
              >
                <i className="fa-solid fa-upload text-xs"></i>
                <span className="hidden xl:inline text-[10px]">Importar</span>
                <input type="file" accept=".json" onChange={handleImportBackupCompleto} className="hidden" />
              </label>
            </div>

            {/* Indicador de Auditoria */}
            <div className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs ${
              theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <span className={theme === 'light' ? 'text-slate-500' : 'text-slate-400'}>Score:</span>
              <span className={`font-black ${auditScore >= 80 ? (theme === 'light' ? 'text-emerald-700' : 'text-emerald-400') : (theme === 'light' ? 'text-amber-700' : 'text-amber-400')}`}>
                {auditScore}%
              </span>
            </div>

            {/* Seletor de Tema no Cabeçalho */}
            <div 
              className={`flex items-center p-0.5 rounded-lg border shadow-xs transition-colors ${
                theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
              }`}
              role="group"
              aria-label="Alternador de Tema Visual"
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-500/50'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Ativar Tema Claro (Uso Diurno)"
                aria-pressed={theme === 'light'}
              >
                <i className="fa-solid fa-sun text-xs text-amber-950"></i>
                <span className="hidden sm:inline text-[11px] font-mono">Claro</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-sky-600 text-white font-black shadow-xs ring-1 ring-sky-400/50'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Ativar Tema Escuro (Uso Noturno)"
                aria-pressed={theme === 'dark'}
              >
                <i className="fa-solid fa-moon text-xs"></i>
                <span className="hidden sm:inline text-[11px] font-mono">Escuro</span>
              </button>
            </div>

            <div className="text-right font-mono text-xs hidden lg:block">
              <div className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{data.header.teamLeader}</div>
              <div className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{data.header.shift} • {data.header.date}</div>
            </div>

            <button 
              onClick={() => openFormModal('efetivo')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition ${
                theme === 'light'
                  ? 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
              }`}
            >
              <i className="fa-solid fa-user-plus"></i>
              <span className="hidden sm:inline">Operador</span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 overflow-y-auto">
          {/* 1. Módulos de Operação */}
          {activeTab === 'MAPA_LINHA' && (
            <MapaLinhaSvgView
              currentRole={currentRole}
              initialModoEdicao={false}
              onToggleCardsView={() => setActiveTab('MAPA_CARDS')}
              onNavigateToMasterEditor={() => setActiveTab('GESTAO_MASTER')}
              globalSearchQuery={headerGlobalSearch}
            />
          )}
          {activeTab === 'MAPA_EDICAO' && (
            <MapaLinhaSvgView
              currentRole={currentRole}
              initialModoEdicao={true}
              onToggleCardsView={() => setActiveTab('MAPA_CARDS')}
              onNavigateToMasterEditor={() => setActiveTab('GESTAO_MASTER')}
              globalSearchQuery={headerGlobalSearch}
            />
          )}
          {activeTab === 'MAPA_CARDS' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-sky-400">Visão em Cartões de Postos</span>
                <button
                  onClick={() => setActiveTab('MAPA_LINHA')}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <i className="fa-solid fa-map-location-dot"></i> Voltar ao Mapa SVG
                </button>
              </div>
              <MapaLinhaView
                linhas={data.linhasList}
                postos={data.postosList}
                operacoes={data.operacoesList}
                teamLeaders={data.teamLeadersList}
                onNavigateToPostos={handleNavigateToPostos}
                onNavigateToOperacoes={handleNavigateToOperacoes}
              />
            </div>
          )}
          {activeTab === 'GEMBA' && <GembaWalkView data={data} updateData={setData} openFormModal={openFormModal} />}
          {activeTab === 'A1_BRIEFING' && <BriefingA1View data={data} updateData={setData} openFormModal={openFormModal} />}
          {activeTab === 'LAP' && <LapView data={data} updateData={setData} openFormModal={openFormModal} />}

          {/* 2. Módulos de Qualidade & Processo */}
          {activeTab === 'QUALIDADE' && (
            <QualidadeView
              indicadores={indicadoresQualidade}
              onSaveIndicador={handleSaveIndicador}
              onDeleteIndicador={handleDeleteIndicador}
            />
          )}
          {activeTab === 'ROTINA' && <RotinaTurnoView data={data} />}
          {activeTab === 'AMOSTRAL' && <ControleAmostralView data={data} updateData={setData} openFormModal={openFormModal} />}
          {activeTab === 'MEDIDA' && <MedidaConservatoriaView data={data} updateData={setData} openFormModal={openFormModal} />}
          {activeTab === 'RED_RABBIT' && <RedRabbitView data={data} openFormModal={openFormModal} />}
          {activeTab === 'SWA' && <SwaView data={data} />}

          {/* 3. Módulos de Segurança do Trabalho */}
          {activeTab === 'SEGURANCA' && (
            <SegurancaView
              heinrichData={heinrichData}
              onUpdateHeinrich={setHeinrichData}
              quaseAcidentes={quaseAcidentes}
              onSaveQuaseAcidente={handleSaveQuaseAcidente}
              inspecoesEpi={inspecoesEpi}
              onSaveInspecaoEpi={handleSaveInspecaoEpi}
              safetyCross={data.safetyCross}
              onUpdateSafetyCross={handleUpdateSafetyCross}
            />
          )}

          {/* 4. Módulos de Pessoas & Gestão */}
          {activeTab === 'CADASTRO_TL' && (
            <TeamLeadersView
              teamLeaders={data.teamLeadersList}
              linhas={data.linhasList}
              onSaveTeamLeader={handleSaveTeamLeader}
              onToggleStatusTeamLeader={handleToggleStatusTeamLeader}
            />
          )}
          {activeTab === 'POLIVALENCIA' && <PolivalenciaView data={data} updateData={setData} openFormModal={openFormModal} />}
          {activeTab === 'ESCALADA' && <EscalationMatrixView data={data} openFormModal={openFormModal} />}
          {activeTab === 'WHS' && <WhsConversationView data={data} />}

          {/* 5. Módulos SIS & Workplace Organization (WO) */}
          {activeTab === 'SIS_WO' && (
            <SisWoView
              padroesSis={padroesSis}
              onSavePadrao={handleSavePadrao}
              onDeletePadrao={handleDeletePadrao}
              woPadroes={woPadroes}
              onSaveWoPadrao={handleSaveWoPadrao}
              pontosVermelhos={pontosVermelhos}
              onSavePontoVermelho={handleSavePontoVermelho}
              onDeletePontoVermelho={handleDeletePontoVermelho}
            />
          )}
          {activeTab === 'FERRAMENTAL_PATRIMONIO' && <FerramentalPatrimonioView />}
          {activeTab === 'KAIZEN' && <KaizenBankView data={data} openFormModal={openFormModal} />}

          {/* 6. Módulos de Cadastros Industriais */}
          {activeTab === 'CADASTRO_LINHAS' && (
            <LinhasProducaoView
              linhas={data.linhasList}
              teamLeaders={data.teamLeadersList}
              postos={data.postosList}
              operacoes={data.operacoesList}
              onSaveLinha={handleSaveLinha}
              onToggleStatusLinha={handleToggleStatusLinha}
              onViewPostosDaLinha={handleNavigateToPostos}
            />
          )}
          {activeTab === 'CADASTRO_PDT' && (
            <PostosTrabalhoView
              postos={data.postosList}
              linhas={data.linhasList}
              operacoes={data.operacoesList}
              teamLeaders={data.teamLeadersList}
              initialLinhaCodigo={contextLinhaPostos}
              onSavePosto={handleSavePosto}
              onToggleStatusPosto={handleToggleStatusPosto}
              onReorderPostos={handleReorderPostos}
              onNavigateToOperacoes={handleNavigateToOperacoes}
            />
          )}
          {activeTab === 'CADASTRO_OPERACOES' && (
            <OperacoesCiclosView
              operacoes={data.operacoesList}
              postos={data.postosList}
              linhas={data.linhasList}
              initialPdtCodigo={contextPdtOperacoes}
              currentUserName={data.header.teamLeader}
              onSaveOperacao={handleSaveOperacao}
              onToggleStatusOperacao={handleToggleStatusOperacao}
            />
          )}
          {activeTab === 'CADASTROS' && (
            <CadastrosMasterView
              data={data}
              openFormModal={openFormModal}
              onNavigateToTab={setActiveTab}
            />
          )}

          {/* 7. Módulos de Conta Máster & Administração */}
          {activeTab === 'GESTAO_MASTER' && (
            <GestaoHierarquiaMasterView
              utes={utes}
              trechos={trechos}
              dominios={dominios}
              totens={totens}
              acumulos={acumulos}
              pdts={mapaPdts}
              onSaveUte={handleSaveUte}
              onDeleteUte={handleDeleteUte}
              onSaveTrecho={handleSaveTrecho}
              onDeleteTrecho={handleDeleteTrecho}
              onSaveDominio={handleSaveDominio}
              onDeleteDominio={handleDeleteDominio}
              onSaveTotem={handleSaveTotem}
              onDeleteTotem={handleDeleteTotem}
              onSaveAcumulo={handleSaveAcumulo}
              onDeleteAcumulo={handleDeleteAcumulo}
              onSavePdt={handleSavePdtMaster}
              onDeletePdt={handleDeletePdtMaster}
            />
          )}
          {activeTab === 'PERFIS_PERMISSOES' && (
            <PerfisPermissoesView currentRole={currentRole} onChangeRole={setCurrentRole} />
          )}
          {activeTab === 'LOGS' && <LogsView />}
          {activeTab === 'RELATORIOS' && <RelatoriosView data={data} />}
        </div>
      </main>

      {/* Modal Genérico Reutilizável Original */}
      {activeModal && (
        <GenericFormModal 
          type={activeModal} 
          data={data} 
          updateData={setData} 
          onClose={closeFormModal} 
          targetId={modalTargetId}
        />
      )}
    </div>
  );
}
