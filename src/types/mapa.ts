export type LinhaCodigo = 'L1' | 'L3' | 'GERAL' | string;

export type PdtStatus = 'ATIVO' | 'COM_PENDENCIA' | 'SEM_TOTEM' | 'CRITICO';

export type UserRole = 
  | 'OPERADOR'
  | 'TEAM_LEADER'
  | 'LIDER'
  | 'SHIFT'
  | 'SUPERVISAO'
  | 'GERENTE'
  | 'SEGURANCA'
  | 'ADMINISTRADOR'
  | 'CONTA_MASTER';

export interface PdtGembaItem {
  id: number;
  parametro: string;
  valor: number | string;
  lcl?: number;
  ucl?: number;
  status: 'VERDE' | 'AMARELO' | 'VERMELHO';
  data: string;
}

export interface PdtLapAction {
  id: number;
  titulo: string;
  responsavel: string;
  prazo: string;
  status: 'TODO' | 'DOING' | 'DONE';
  origem: string;
}

export interface PdtRotinaTurnoItem {
  id: number;
  horario: string;
  atividade: string;
  status: 'CONCLUIDO' | 'PENDENTE' | 'EM_ANDAMENTO';
  responsavel: string;
}

export interface PdtAmostralCheck {
  id: number;
  caracteristica: string;
  amostra: string;
  status: 'OK' | 'KO';
  data: string;
  vis: string;
}

export interface PdtPokaYokeTest {
  id: number;
  dispositivo: string;
  anomaliaProvocada: string;
  resultado: 'APROVADO' | 'REPROVADO';
  data: string;
  operador: string;
}

export interface PdtSwaItem {
  id: number;
  pergunta: string;
  conforme: boolean;
  observacao?: string;
}

export interface PdtPolivalenciaOp {
  matricula: string;
  nome: string;
  nivel: 0 | 1 | 2 | 3; // 0=Não apto, 1=Em treinamento, 2=Autônomo, 3=Instrutor
  turno: string;
}

export interface PdtFerramenta {
  id: number;
  codigoPatrimonio: string;
  nome: string;
  tipo: string;
  statusCalibracao: 'CALIBRADO' | 'A_VENCER' | 'VENCIDO';
  validade: string;
}

export interface PdtOperacaoDetalhe {
  id: number;
  codigo: string;
  nome: string;
  tempoCiclo: number; // segundos
  tempoVA: number;
  tempoNVA: number;
  sequencia: number;
}

export interface PdtOperadorAlocado {
  matricula: string;
  nome: string;
  turno: string;
  funcao: string;
  status: 'PRESENTE' | 'FALTA' | 'SUBSTITUTO';
}

export interface TotemPdtData {
  // 1. Gemba Walk
  gembaItens: PdtGembaItem[];
  gembaAuditor: string;
  gembaSemana: number;
  // 2. Folha A1
  kpisSeguranca: { valor: number; meta: number; status: string };
  kpisQualidade: { valor: number; meta: number; status: string };
  kpisOpe: { valor: string; meta: string; status: string };
  // 3. Briefing
  pautaBriefing: string[];
  pontosMudanca: string[];
  // 4. Ações LAP
  lapAcoes: PdtLapAction[];
  // 5. Rotinas de Turno
  rotinasTurno: PdtRotinaTurnoItem[];
  // 6. Controle Amostral (BP8/BP9)
  amostralChecks: PdtAmostralCheck[];
  // 7. Red Hat / Poka-Yoke
  pokaYokeTestes: PdtPokaYokeTest[];
  // 8. Auditorias SWA
  swaItens: PdtSwaItem[];
  // 9. Polivalência (331)
  polivalenciaOperadores: PdtPolivalenciaOp[];
  // 10. Ferramental / Patrimônio
  ferramentas: PdtFerramenta[];
  // 11. Postos e Operações
  operacoes: PdtOperacaoDetalhe[];
  // 12. Ciclos
  tctAlvo: number; // segundos
  tempoCicloReal: number;
  // 13. Operadores
  operadoresAlocados: PdtOperadorAlocado[];
}

export interface MapaPdtRecord {
  id: string; // Chave única, ex: "L3-087", "L1-001", "L3-PLAN-01"
  codigo: string; // Ex: "OP 87", "OP 01"
  numero: number;
  nome: string;
  linha: LinhaCodigo;
  uteId?: string;
  trechoId?: string;
  dominioId?: string;
  totemId?: string;
  isTrechoIndependente?: boolean;
  trechoTipo?: 'PLANCIA' | 'DOORS' | 'PRINCIPAL';
  x: number; // Coordenada X no SVG
  y: number; // Coordenada Y no SVG
  status: PdtStatus;
  teamLeaderMatricula: string;
  teamLeaderNome: string;
  lider: string;
  shift: string;
  area: string;
  tempoCicloReferencia: number;
  operadorAtual?: string;
  totemData: TotemPdtData;
  observacoes?: string;
}

// ============================================================================
// HIERARQUIA INDUSTRIAL STELLANTIS: LINHA -> UTE -> TRECHO -> DOMÍNIO -> TOTEM -> PDT
// ============================================================================

export interface UteRecord {
  id: string; // Ex: "UTE-L3-MONTAGEM-INICIAL"
  codigo: string; // Ex: "UTE 01"
  nome: string; // Ex: "UTE Montagem Inicial L3"
  linhaId: LinhaCodigo;
  responsavelNome: string;
  responsavelMatricula?: string;
  descricao?: string;
  corIdentificacao: string;
  ordem: number;
}

export interface TrechoRecord {
  id: string; // Ex: "TRECHO-L3-BIG-SWIVEL", "TRECHO-L3-PLANCIA"
  codigo: string; // Ex: "TR-01"
  nome: string; // Ex: "Big Swivel (1–12)", "Plância (Painel)", "Doors (Portas)"
  uteId: string;
  linhaId: LinhaCodigo;
  tipo: 'PLANCIA' | 'DOORS' | 'PRINCIPAL';
  isIndependente: boolean; // Plância (25 PDTs) e Doors (22 PDTs)
  ordem: number;
  pdtInicio: number;
  pdtFim: number;
  totalPdts: number;
  cor: string;
  descricao?: string;
}

export interface DominioRecord {
  id: string; // Ex: "DOM-L3-TRIM-01"
  codigo: string; // Ex: "DOM 03"
  nome: string; // Ex: "Domínio Trim 1"
  trechoId: string;
  uteId: string;
  linhaId: LinhaCodigo;
  teamLeaderNome: string;
  teamLeaderMatricula: string;
  liderNome: string;
  shift: string;
  totemId: string; // Estritamente 1 totem por domínio
  pdtsIds: string[]; // Lista de PDTs gerenciados diretamente pelo domínio
  descricao?: string;
}

export interface TotemRecord {
  id: string; // Ex: "TOTEM-L3-03"
  codigo: string; // Ex: "TT-03"
  nome: string; // Ex: "Totem Digital Trim L3"
  dominioId: string; // Vinculado a exatamente um domínio
  linhaId: LinhaCodigo;
  status: 'ONLINE' | 'OFFLINE' | 'MANUTENCAO';
  ipAddress?: string;
  versaoApp: string;
  ultimaSincronizacao: string;
  x?: number; // Posição opcional do Totem no mapa
  y?: number;
}

// Áreas de Acúmulo da Linha (Buffer Zones sem numeração de PDT)
export interface AcumuloLinhaRecord {
  id: string; // Ex: "ACUMULO-L3-SWIVEL-TRIM"
  codigo: string; // Ex: "AC-01"
  nome: string; // Ex: "Acúmulo Swivel / Trim"
  linhaId: LinhaCodigo;
  trechoOrigem: string;
  trechoDestino: string;
  capacidadeMaxCarros: number;
  ocupacaoAtualCarros: number;
  x: number;
  y: number;
  w: number;
  h: number;
  cor: string;
  status: 'NORMAL' | 'ALERTA_CHEIO' | 'CRITICO_PARADA';
  observacao?: string;
}

// ============================================================================
// CADASTRO E GESTÃO DE COLABORADORES POR DOMÍNIO (Regra do Rodapé Oficial)
// ============================================================================
export interface ColaboradorRecord {
  id: string;
  matricula: string;
  nome: string;
  dominioId: string; // O Domínio é responsável pelo cadastro e gestão dos colaboradores
  pdtId?: string; // PDT alocado atualmente
  pdtCodigo?: string;
  linhaId: LinhaCodigo;
  turno: '1º TURNO' | '2º TURNO' | '3º TURNO';
  funcao: string;
  status: 'PRESENTE' | 'FALTA' | 'TREINAMENTO' | 'SUBSTITUTO';
  nivelILUO: 0 | 1 | 2 | 3; // 0=Sem Treinamento, 1=Em Treinamento, 2=Autônomo, 3=Instrutor
  dataAdmissao?: string;
}

// ============================================================================
// QUALIDADE: INDICADORES PERSONALIZADOS & AUDITORIAS
// ============================================================================

export interface IndicadorQualidadeRecord {
  id: string;
  codigo: string; // Ex: "DPU", "RFT", "CQA", "PPM", "BP8_APROV"
  nome: string;
  linhaId: LinhaCodigo;
  trechoId?: string;
  unidade: string; // Ex: "%", "PPM", "Def/Veíc", "Pontos"
  meta: number;
  valorAtual: number;
  limiteInferior?: number;
  limiteSuperior?: number;
  frequencia: 'TURNO' | 'DIARIO' | 'SEMANAL' | 'MENSAL';
  status: 'VERDE' | 'AMARELO' | 'VERMELHO';
  historicoValores: Array<{ data: string; valor: number; turno?: string }>;
  responsavel: string;
  ativo: boolean;
}

// ============================================================================
// SEGURANÇA: FERRAMENTAS DA PLANTA (HEINRICH, SAFETY CROSS, QUASE-ACIDENTES, EPIS)
// ============================================================================

export interface PiramideHeinrichData {
  fatalidade: number; // Nível 1
  comAfastamento: number; // Nível 2
  semAfastamento: number; // Nível 3
  primeirosSocorros: number; // Nível 4
  quaseAcidentes: number; // Nível 5 (Near Miss)
  condicoesInseguras: number; // Nível 6
}

export interface QuaseAcidenteRecord {
  id: string;
  data: string;
  turno: string;
  linhaId: LinhaCodigo;
  postoOuArea: string;
  tipo: 'QUASE_ACIDENTE' | 'CONDICAO_INSEGURA' | 'PRIMEIROS_SOCORROS';
  descricao: string;
  acaoImediata: string;
  responsavelAcao: string;
  status: 'ABERTO' | 'EM_ANALISE' | 'CONCLUIDO';
  gravidade: 'BAIXA' | 'MEDIA' | 'ALTA';
}

export interface InspecaoEpiRecord {
  id: string;
  data: string;
  auditorNome: string;
  postoTrabalho: string;
  operadorNome: string;
  oculosSeguranca: boolean;
  luvasApropriadas: boolean;
  calcadoSegurancaBiqueira: boolean;
  protetorAuricular: boolean;
  vestimentaConforme: boolean;
  statusFinal: 'CONFORME' | 'NAO_CONFORME';
  observacao?: string;
}

// ============================================================================
// SIS (STELLANTIS INDUSTRIAL SYSTEM) & WO (WORKPLACE ORGANIZATION)
// ============================================================================

export interface PadraoProcedimentoSis {
  id: string;
  codigo: string; // Ex: "SOS-L3-087", "JES-MON-02", "OPL-SEG-15"
  tipo: 'SOS' | 'JES' | 'OPL' | 'PO_PADRAO_OPERACIONAL' | 'CRITERIO_QUALIDADE';
  titulo: string;
  linhaId: LinhaCodigo;
  trechoOuPosto: string;
  revisao: string;
  dataAprovacao: string;
  responsavelEngenharia: string;
  descricao: string;
  passosCriticos: string[];
  tempoPadraoSegundos?: number;
  itensQualidadeCriticos: string[];
  itensSegurancaObrigatorios: string[];
  arquivoPdfUrl?: string;
  ativo: boolean;
}

export interface WoPadraoFundamentalItem {
  id: string;
  pilar: '1S_DESCARTE' | '2S_ORDEM' | '3S_LIMPEZA' | '4S_PADRONIZACAO' | '5S_AUTODISCIPLINA';
  titulo: string;
  descricao: string;
  areaAplicacao: string;
  criterioAvaliacao: string;
  pontuacaoMaxima: number;
  pontuacaoAtual: number;
  frequenciaAuditoria: string;
  evidenciasFotosExemplo?: string[];
}

export interface WoPontoVermelhoRecord {
  id: string;
  tagNumero: string; // Etiqueta Vermelha Red Tag
  dataIdentificacao: string;
  identificadoPor: string;
  localizacao: string; // Ex: "L3 - Chassi PDT 72"
  itemDescricao: string;
  motivoDescarte: 'DESNECESSARIO' | 'OBSOLETO' | 'QUEBRADO' | 'EXCESSO';
  destinoProposto: 'SUCATA' | 'DEVOLUCAO_FORNECEDOR' | 'ALMOXARIFADO' | 'RECICLAGEM';
  prazoResolucao: string;
  status: 'PENDENTE' | 'DESCARTADO' | 'REMANEJADO';
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  allowedRoles?: UserRole[];
  children?: NavigationMenuItem[];
}
