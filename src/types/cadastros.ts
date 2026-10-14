export interface TeamLeaderRecord {
  id: number;
  matricula: string; // Única
  nome: string;
  turno: string;
  linhas: string[]; // Linhas sob sua responsabilidade
  area: string; // Ex: TRIM 1, FINAL, etc.
  equipe: string; // Ex: Equipe Alfa, Grupo 02
  dataInicio: string; // Data de início da responsabilidade
  status: 'ATIVO' | 'INATIVO';
  observacoes?: string;
}

export interface LinhaProducaoRecord {
  id: number;
  codigo: string; // Único, ex: LINHA 01
  nome: string;
  planta: string; // Ex: BETIM VHI
  area: string; // Ex: TRIM 1 / MONTAGEM
  turnos: string[]; // Turnos de funcionamento
  teamLeaderMatricula?: string; // TL responsável
  teamLeaderNome?: string;
  descricao: string;
  metaProducaoTurno: number; // Ex: 250 veículos/turno
  tempoCicloReferencia: number; // Segundos (ex: 50s)
  status: 'ATIVA' | 'INATIVA';
  observacoes?: string;
}

export interface PostoTrabalhoRecord {
  id: number;
  codigo: string; // Único, ex: OP 10, OP 20
  nome: string; // Ex: Montagem do Suporte Inicial
  linhaCodigo: string; // Código da linha vinculada
  sequencia: number; // Posição/ordem na linha (1, 2, 3...)
  areaTrecho: string; // Ex: Trecho Inicial, TRIM 1
  operacaoPrincipal: string;
  teamLeaderMatricula?: string;
  teamLeaderNome?: string;
  tempoCicloReferencia: number; // Segundos
  metaProducao: number; // Meta por turno
  ergoCritico?: boolean;
  status: 'ATIVO' | 'INATIVO';
  observacoes?: string;
}

export interface CicloAlteracaoHistorico {
  id: number;
  data: string;
  responsavel: string;
  tempoAnterior: number;
  tempoNovo: number;
  motivo?: string;
}

export interface OperacaoCicloRecord {
  id: number;
  codigo: string; // Único, ex: OP-10-01
  nome: string;
  descricao: string;
  linhaCodigo: string;
  pdtCodigo: string;
  sequenciaNoPdt: number; // 1, 2, 3...
  tempoCicloSegundos: number; // Tempo de referência
  tempoPadraoSegundos?: number; // Tempo padrão
  metaProducaoCalculada?: number;
  unidadeMedida: string; // 'seg/vcl' | 'seg/peça' | 'ciclos'
  dataVigencia: string;
  status: 'ATIVA' | 'INATIVA';
  observacoesTecnicas?: string;
  historicoCiclos?: CicloAlteracaoHistorico[];
}
