import { 
  MapaPdtRecord, 
  TotemPdtData, 
  UteRecord, 
  TrechoRecord, 
  DominioRecord, 
  TotemRecord, 
  AcumuloLinhaRecord,
  ColaboradorRecord,
  IndicadorQualidadeRecord,
  PiramideHeinrichData,
  QuaseAcidenteRecord,
  InspecaoEpiRecord,
  PadraoProcedimentoSis,
  WoPadraoFundamentalItem,
  WoPontoVermelhoRecord
} from '../types/mapa';

export const INITIAL_COLABORADORES: ColaboradorRecord[] = [
  // Plância (Domínios DOM-L3-PLAN-01 e DOM-L3-PLAN-02)
  {
    id: 'COLAB-001',
    matricula: 'ST10842',
    nome: 'CARLOS ALBERTO DIAS',
    dominioId: 'DOM-L3-PLAN-01',
    pdtId: 'L3-PLAN-01',
    pdtCodigo: 'PL-01',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Montador Cockpit / Estrutura',
    status: 'PRESENTE',
    nivelILUO: 3,
    dataAdmissao: '12/03/2021'
  },
  {
    id: 'COLAB-002',
    matricula: 'ST10843',
    nome: 'FERNANDO GOMES SILVA',
    dominioId: 'DOM-L3-PLAN-01',
    pdtId: 'L3-PLAN-06',
    pdtCodigo: 'PL-06',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Instalador de Chicote Elétrico',
    status: 'PRESENTE',
    nivelILUO: 2,
    dataAdmissao: '05/08/2022'
  },
  {
    id: 'COLAB-003',
    matricula: 'ST10844',
    nome: 'GABRIEL RESENDE PAIVA',
    dominioId: 'DOM-L3-PLAN-02',
    pdtId: 'L3-PLAN-14',
    pdtCodigo: 'PL-14',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Fixação de Airbag e Difusores',
    status: 'PRESENTE',
    nivelILUO: 2,
    dataAdmissao: '14/11/2023'
  },
  // Doors (Domínios DOM-L3-DOR-01 e DOM-L3-DOR-02)
  {
    id: 'COLAB-004',
    matricula: 'ST45211',
    nome: 'RODRIGO ALVES FERREIRA',
    dominioId: 'DOM-L3-DOR-01',
    pdtId: 'L3-DOR-01',
    pdtCodigo: 'DR-01',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Montagem de Máquina de Vidro',
    status: 'PRESENTE',
    nivelILUO: 3,
    dataAdmissao: '20/01/2020'
  },
  {
    id: 'COLAB-005',
    matricula: 'ST45212',
    nome: 'LUCAS MOREIRA SANTOS',
    dominioId: 'DOM-L3-DOR-02',
    pdtId: 'L3-DOR-08',
    pdtCodigo: 'DR-08',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Guarnição e Vedação Acústica',
    status: 'PRESENTE',
    nivelILUO: 2,
    dataAdmissao: '18/06/2022'
  },
  // Big Swivel & Swivel
  {
    id: 'COLAB-006',
    matricula: 'ST33101',
    nome: 'TIAGO MENDES COSTA',
    dominioId: 'DOM-L3-SWIVEL',
    pdtId: 'L3-001',
    pdtCodigo: 'OP 01',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Entrada Carroçaria Big Swivel',
    status: 'PRESENTE',
    nivelILUO: 3,
    dataAdmissao: '10/02/2019'
  },
  {
    id: 'COLAB-007',
    matricula: 'ST33102',
    nome: 'RAFAEL AUGUSTO NUNES',
    dominioId: 'DOM-L3-SWIVEL',
    pdtId: 'L3-013',
    pdtCodigo: 'OP 13',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Fixação de Suportes Swivel',
    status: 'PRESENTE',
    nivelILUO: 2,
    dataAdmissao: '04/09/2023'
  },
  // Trim
  {
    id: 'COLAB-008',
    matricula: 'ST22101',
    nome: 'BRUNO CARVALHO LIMA',
    dominioId: 'DOM-L3-TRIM',
    pdtId: 'L3-027',
    pdtCodigo: 'OP 27',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Montador Tapeçaria & Revestimento',
    status: 'PRESENTE',
    nivelILUO: 2,
    dataAdmissao: '15/04/2021'
  },
  {
    id: 'COLAB-009',
    matricula: 'ST22102',
    nome: 'ALEXANDRE PEREIRA LIMA',
    dominioId: 'DOM-L3-TRIM',
    pdtId: 'L3-037',
    pdtCodigo: 'OP 37',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Passagem de Tubulação e Cabos',
    status: 'PRESENTE',
    nivelILUO: 3,
    dataAdmissao: '22/07/2018'
  },
  // Chassi
  {
    id: 'COLAB-010',
    matricula: 'ST77401',
    nome: 'MARCELO ANTÔNIO SOUZA',
    dominioId: 'DOM-L3-CHASSI',
    pdtId: 'L3-051',
    pdtCodigo: 'OP 51',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Casamento Mecânico Motor/Chassi',
    status: 'PRESENTE',
    nivelILUO: 3,
    dataAdmissao: '09/05/2017'
  },
  {
    id: 'COLAB-011',
    matricula: 'ST77402',
    nome: 'LEONARDO DUARTE PINTO',
    dominioId: 'DOM-L3-CHASSI',
    pdtId: 'L3-065',
    pdtCodigo: 'OP 65',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Torqueamento de Suspensão Traseira',
    status: 'PRESENTE',
    nivelILUO: 2,
    dataAdmissao: '11/11/2022'
  },
  // Big Chassi
  {
    id: 'COLAB-012',
    matricula: 'ST88201',
    nome: 'DANIEL ROCHA MARTINS',
    dominioId: 'DOM-L3-BIG-CHASSI',
    pdtId: 'L3-095',
    pdtCodigo: 'OP 95',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Fixação de Linha de Combustível/Freio',
    status: 'PRESENTE',
    nivelILUO: 2,
    dataAdmissao: '19/08/2021'
  },
  // Final
  {
    id: 'COLAB-013',
    matricula: 'ST44201',
    nome: 'ANDERSON BARROS NETO',
    dominioId: 'DOM-L3-FINAL',
    pdtId: 'L3-109',
    pdtCodigo: 'OP 109',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Encaixe de Portas & Alinhamento',
    status: 'PRESENTE',
    nivelILUO: 3,
    dataAdmissao: '03/03/2016'
  },
  {
    id: 'COLAB-014',
    matricula: 'ST44202',
    nome: 'VICTOR HUGO TEIXEIRA',
    dominioId: 'DOM-L3-FINAL',
    pdtId: 'L3-120',
    pdtCodigo: 'OP 120',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Abastecimento de Fluídos e Bateria',
    status: 'PRESENTE',
    nivelILUO: 2,
    dataAdmissao: '07/12/2022'
  },
  {
    id: 'COLAB-015',
    matricula: 'ST44203',
    nome: 'PAULO HENRIQUE CAMPOS',
    dominioId: 'DOM-L3-FINAL',
    pdtId: 'L3-140',
    pdtCodigo: 'OP 140',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Liberação Final de Qualidade A1',
    status: 'PRESENTE',
    nivelILUO: 3,
    dataAdmissao: '28/04/2018'
  }
];

export function createDefaultTotemData(codigoPdt: string, linha: string, numeroPdt: number): TotemPdtData {
  return {
    gembaItens: [
      { id: 1, parametro: 'Fixação de Chicotes & Presilhas', valor: 'CONFORME', lcl: 0, ucl: 0, status: 'VERDE', data: '14/10/2026' },
      { id: 2, parametro: 'Torque Parafuso Estrutural (Nm)', valor: 45.2, lcl: 42.0, ucl: 48.0, status: 'VERDE', data: '14/10/2026' },
      { id: 3, parametro: 'Alinhamento do Conector Principal', valor: 'CONFORME', lcl: 0, ucl: 0, status: 'VERDE', data: '14/10/2026' },
      { id: 4, parametro: 'Inspeção Visual de Cabos e Selos', valor: 'SEM DESVIO', lcl: 0, ucl: 0, status: 'VERDE', data: '14/10/2026' }
    ],
    gembaAuditor: 'AVELINO DA SILVA',
    gembaSemana: 42,
    kpisSeguranca: { valor: 0, meta: 0, status: 'OK' },
    kpisQualidade: { valor: 99.4, meta: 98.5, status: 'SUPERADO' },
    kpisOpe: { valor: '96.2%', meta: '95.0%', status: 'DENTRO DA META' },
    pautaBriefing: [
      'Atenção ao novo lote de conectores F1H / F2U',
      'Cumprimento rigoroso do passo a passo SOS / SWA',
      'Checklist de 5S no início e fim do turno'
    ],
    pontosMudanca: [
      `Alteração de torque de aperto na esteira ${linha}`,
      'Troca de lote de fixadores metálicos'
    ],
    lapAcoes: [
      { id: 1, titulo: 'Ajuste de guia de inserção do chicote', responsavel: 'AVELINO DA SILVA', prazo: '18/10/2026', status: 'DOING', origem: 'GEMBA' },
      { id: 2, titulo: 'Substituição da ponta da parafusadeira pneumática', responsavel: 'MANUTENÇÃO', prazo: '16/10/2026', status: 'DONE', origem: 'QUALIDADE' },
      { id: 3, titulo: 'Instalação de tapete antifadiga ergonômico', responsavel: 'WHS SEGURANÇA', prazo: '24/10/2026', status: 'TODO', origem: 'ERGONOMIA' }
    ],
    rotinasTurno: [
      { id: 1, horario: '06:00', atividade: 'Briefing A1 e Ginástica Laboral', status: 'CONCLUIDO', responsavel: 'Team Leader' },
      { id: 2, horario: '08:00', atividade: '1ª Amostragem BP8 (Torque e Conector)', status: 'CONCLUIDO', responsavel: 'Operador Titular' },
      { id: 3, horario: '10:30', atividade: 'Auditoria de Processo Gemba Walk', status: 'EM_ANDAMENTO', responsavel: 'Team Leader' },
      { id: 4, horario: '13:00', atividade: '2ª Amostragem BP8 e Teste Red Hat', status: 'PENDENTE', responsavel: 'Operador Titular' },
      { id: 5, horario: '14:30', atividade: 'Passagem de Turno e Fechamento 5S', status: 'PENDENTE', responsavel: 'Team Leader' }
    ],
    amostralChecks: [
      { id: 1, caracteristica: 'Torque de Aperto Porca M8', amostra: 'Chassi 9BD120951', status: 'OK', data: '14/10 08:15', vis: '9BD120951' },
      { id: 2, caracteristica: 'Engate Clique Duplo Conector', amostra: 'Chassi 9BD120952', status: 'OK', data: '14/10 10:15', vis: '9BD120952' },
      { id: 3, caracteristica: 'Presença de Selo de Vedação', amostra: 'Chassi 9BD120953', status: 'OK', data: '14/10 12:15', vis: '9BD120953' }
    ],
    pokaYokeTestes: [
      { id: 1, dispositivo: 'Sensor Óptico de Presença Presilha', anomaliaProvocada: 'Peça inserida sem presilha plástica', resultado: 'APROVADO', data: '14/10/2026', operador: 'CARLOS ALBERTO' },
      { id: 2, dispositivo: 'Bloqueio Eletrônico de Parafusadeira', anomaliaProvocada: 'Tentativa de liberação sem apertar o 2º parafuso', resultado: 'APROVADO', data: '13/10/2026', operador: 'MARCOS VINICIUS' }
    ],
    swaItens: [
      { id: 1, pergunta: 'EPIs obrigatórios sendo utilizados (óculos, luvas, calçado)?', conforme: true },
      { id: 2, pergunta: 'Dispositivo Poka-Yoke do posto testado e aprovado?', conforme: true },
      { id: 3, pergunta: 'Postura de trabalho respeita o limite ergonômico ISO?', conforme: true },
      { id: 4, pergunta: 'Área do posto limpa e desobstruída (5S)?', conforme: true }
    ],
    polivalenciaOperadores: [
      { matricula: 'ST12098', nome: 'CARLOS ALBERTO', nivel: 3, turno: '1º TURNO' },
      { matricula: 'ST45210', nome: 'MARCOS VINICIUS', nivel: 2, turno: '1º TURNO' },
      { matricula: 'ST78901', nome: 'LUCAS PEREIRA', nivel: 2, turno: '2º TURNO' },
      { matricula: 'ST99124', nome: 'RODRIGO SOUZA', nivel: 1, turno: '3º TURNO' }
    ],
    ferramentas: [
      { id: 1, codigoPatrimonio: 'PAT-44120', nome: 'Aparafusadora Angular Transduzida', tipo: 'Elétrica / Digital', statusCalibracao: 'CALIBRADO', validade: '20/12/2026' },
      { id: 2, codigoPatrimonio: 'PAT-88192', nome: 'Torquímetro de Estalo Certificado', tipo: 'Mecânico', statusCalibracao: 'CALIBRADO', validade: '15/11/2026' },
      { id: 3, codigoPatrimonio: 'PAT-12005', nome: 'Gabarito Poka-Yoke de Posicionamento', tipo: 'Mecânico', statusCalibracao: 'CALIBRADO', validade: '30/01/2027' }
    ],
    operacoes: [
      { id: 1, codigo: `${codigoPdt}-01`, nome: 'Posicionar chicote e conectar terminal primário', tempoCiclo: 24, tempoVA: 20, tempoNVA: 4, sequencia: 1 },
      { id: 2, codigo: `${codigoPdt}-02`, nome: 'Aplicar aperto com parafusadeira eletrônica', tempoCiclo: 18, tempoVA: 16, tempoNVA: 2, sequencia: 2 },
      { id: 3, codigo: `${codigoPdt}-03`, nome: 'Verificar clique visual e liberar transporte', tempoCiclo: 8, tempoVA: 6, tempoNVA: 2, sequencia: 3 }
    ],
    tctAlvo: 50,
    tempoCicloReal: 48,
    operadoresAlocados: [
      { matricula: 'ST12098', nome: 'CARLOS ALBERTO', turno: '1º TURNO', funcao: 'Operador de Montagem Titular', status: 'PRESENTE' },
      { matricula: 'ST78901', nome: 'LUCAS PEREIRA', turno: '2º TURNO', funcao: 'Operador de Montagem', status: 'PRESENTE' }
    ]
  };
}

// ============================================================================
// UTEs INICIAIS
// ============================================================================
export const INITIAL_UTES: UteRecord[] = [
  // Linha 3 (Betim)
  {
    id: 'UTE-L3-COMP',
    codigo: 'UTE 01',
    nome: 'UTE Componentes Auxiliares (Plância & Doors)',
    linhaId: 'L3',
    responsavelNome: 'SUPERVISOR ROGÉRIO MARTINS',
    responsavelMatricula: 'ST88102',
    corIdentificacao: '#0284c7',
    ordem: 1,
    descricao: 'Trechos independentes de submontagem de Cockpit/Painel e Portas'
  },
  {
    id: 'UTE-L3-INIT',
    codigo: 'UTE 02',
    nome: 'UTE Montagem Inicial & Swivel',
    linhaId: 'L3',
    responsavelNome: 'SUPERVISOR MARCELO DIAS',
    responsavelMatricula: 'ST77201',
    corIdentificacao: '#0ea5e9',
    ordem: 2,
    descricao: 'Big Swivel (1–12), Swivel (13–26) e Trim (27–50)'
  },
  {
    id: 'UTE-L3-CHASSI',
    codigo: 'UTE 03',
    nome: 'UTE Chassi & Casamento Powertrain',
    linhaId: 'L3',
    responsavelNome: 'SUPERVISOR ALEXANDRE COSTA',
    responsavelMatricula: 'ST55309',
    corIdentificacao: '#f59e0b',
    ordem: 3,
    descricao: 'Chassi (51–93), Baterias e Big Chassi (94–108)'
  },
  {
    id: 'UTE-L3-FINAL',
    codigo: 'UTE 04',
    nome: 'UTE Montagem Final & Acabamento',
    linhaId: 'L3',
    responsavelNome: 'SUPERVISOR CLAUDINEI SILVA',
    responsavelMatricula: 'ST33118',
    corIdentificacao: '#10b981',
    ordem: 4,
    descricao: 'Final (109–150), Prova Hídrica e Convergência'
  },
  // Linha 1
  {
    id: 'UTE-L1-COMP',
    codigo: 'UTE 01',
    nome: 'UTE Componentes Auxiliares L1 (Plância & Doors)',
    linhaId: 'L1',
    responsavelNome: 'SUPERVISORA RENATA LOPES',
    responsavelMatricula: 'ST11440',
    corIdentificacao: '#0284c7',
    ordem: 1,
    descricao: 'Submontagem independente de Cockpit e Portas L1'
  },
  {
    id: 'UTE-L1-MONTAGEM',
    codigo: 'UTE 02',
    nome: 'UTE Montagem & Chassi L1',
    linhaId: 'L1',
    responsavelNome: 'SUPERVISOR GERALDO NETO',
    responsavelMatricula: 'ST99321',
    corIdentificacao: '#38bdf8',
    ordem: 2,
    descricao: 'Linha Principal L1 (1 a 108)'
  }
];

// ============================================================================
// TRECHOS INICIAIS
// Plância (25 PDTs) e Doors (22 PDTs) no início antes da sequência principal
// ============================================================================
export const INITIAL_TRECHOS: TrechoRecord[] = [
  // Linha 3: Conforme Mapa Oficial de Produção (Betim)
  {
    id: 'TRECHO-L3-PLANCIA',
    codigo: 'TR-PLANCIA',
    nome: 'Plância (1–25)',
    uteId: 'UTE-L3-COMP',
    linhaId: 'L3',
    tipo: 'PLANCIA',
    isIndependente: true,
    ordem: 1,
    pdtInicio: 1,
    pdtFim: 25,
    totalPdts: 25,
    cor: '#facc15', // Amarelo oficial da imagem
    descricao: 'Submontagem do painel de instrumentos e chicote principal'
  },
  {
    id: 'TRECHO-L3-DOORS',
    codigo: 'TR-DOORS',
    nome: 'Doors (1–17)',
    uteId: 'UTE-L3-COMP',
    linhaId: 'L3',
    tipo: 'DOORS',
    isIndependente: true,
    ordem: 2,
    pdtInicio: 1,
    pdtFim: 17,
    totalPdts: 17,
    cor: '#15803d', // Verde escuro oficial da imagem
    descricao: 'Submontagem de portas dianteiras e traseiras'
  },
  {
    id: 'TRECHO-L3-BIG-DOORS',
    codigo: 'TR-BIG-DOORS',
    nome: 'Big Doors (18–22)',
    uteId: 'UTE-L3-COMP',
    linhaId: 'L3',
    tipo: 'DOORS',
    isIndependente: true,
    ordem: 3,
    pdtInicio: 18,
    pdtFim: 22,
    totalPdts: 5,
    cor: '#38bdf8', // Azul claro oficial da imagem
    descricao: 'Montagem de grandes portas e componentes de vedação'
  },
  // Linha 3: Sequência Principal
  {
    id: 'TRECHO-L3-BIG-SWIVEL',
    codigo: 'TR-01',
    nome: 'Big Swivel (1–12)',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 4,
    pdtInicio: 1,
    pdtFim: 12,
    totalPdts: 12,
    cor: '#22c55e', // Verde oficial da imagem
    descricao: 'Entrada das carrocerias pintadas e fixação de elementos primários'
  },
  {
    id: 'TRECHO-L3-SWIVEL',
    codigo: 'TR-02',
    nome: 'Swivel (13–26)',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 5,
    pdtInicio: 13,
    pdtFim: 26,
    totalPdts: 14,
    cor: '#f97316', // Laranja oficial da imagem
    descricao: 'Montagem de componentes de assoalho e passagens de tubulações'
  },
  {
    id: 'TRECHO-L3-TRIM',
    codigo: 'TR-03',
    nome: 'Trim (27–50)',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 6,
    pdtInicio: 27,
    pdtFim: 50,
    totalPdts: 24,
    cor: '#2563eb', // Azul royal oficial da imagem
    descricao: 'Instalação de chicotes internos, forração, pedais e coluna'
  },
  {
    id: 'TRECHO-L3-CHASSI',
    codigo: 'TR-04',
    nome: 'Chassi (51–93)',
    uteId: 'UTE-L3-CHASSI',
    linhaId: 'L3',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 7,
    pdtInicio: 51,
    pdtFim: 93,
    totalPdts: 43,
    cor: '#ef4444', // Vermelho oficial da imagem
    descricao: 'Casamento mecânico, suspensão dianteira/traseira, motor e tanque'
  },
  {
    id: 'TRECHO-L3-BIG-CHASSI',
    codigo: 'TR-05',
    nome: 'Big Chassi (94–108)',
    uteId: 'UTE-L3-CHASSI',
    linhaId: 'L3',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 8,
    pdtInicio: 94,
    pdtFim: 108,
    totalPdts: 15,
    cor: '#06b6d4', // Ciano oficial da imagem
    descricao: 'Aperto estrutural torqueado, alinhamento geométrico e baterias'
  },
  {
    id: 'TRECHO-L3-FINAL',
    codigo: 'TR-06',
    nome: 'Final (109–150)',
    uteId: 'UTE-L3-FINAL',
    linhaId: 'L3',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 9,
    pdtInicio: 109,
    pdtFim: 150,
    totalPdts: 42,
    cor: '#d946ef', // Magenta / Roxo oficial da imagem
    descricao: 'Encaixe de bancos, portas, painel, fluidos, rodas e testes de pista'
  },

  // Linha 1: Trechos Independentes e Sequência
  {
    id: 'TRECHO-L1-PLANCIA',
    codigo: 'TR-PLANCIA-L1',
    nome: 'Plância L1 (Painel/Cockpit)',
    uteId: 'UTE-L1-COMP',
    linhaId: 'L1',
    tipo: 'PLANCIA',
    isIndependente: true,
    ordem: 1,
    pdtInicio: 1,
    pdtFim: 25,
    totalPdts: 25,
    cor: '#06b6d4',
    descricao: 'Submontagem de painel e cockpit Linha 1'
  },
  {
    id: 'TRECHO-L1-DOORS',
    codigo: 'TR-DOORS-L1',
    nome: 'Doors L1 (Portas)',
    uteId: 'UTE-L1-COMP',
    linhaId: 'L1',
    tipo: 'DOORS',
    isIndependente: true,
    ordem: 2,
    pdtInicio: 1,
    pdtFim: 22,
    totalPdts: 22,
    cor: '#3b82f6',
    descricao: 'Montagem de portas Linha 1'
  },
  {
    id: 'TRECHO-L1-SEQ1',
    codigo: 'TR-L1-01',
    nome: 'Montagem Inicial L1 (1–26)',
    uteId: 'UTE-L1-MONTAGEM',
    linhaId: 'L1',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 3,
    pdtInicio: 1,
    pdtFim: 26,
    totalPdts: 26,
    cor: '#0284c7',
    descricao: 'Entrada de carrocerias e preparação mecânica L1'
  },
  {
    id: 'TRECHO-L1-SEQ2',
    codigo: 'TR-L1-02',
    nome: 'Trim 1 / Monotaparella (27–54)',
    uteId: 'UTE-L1-MONTAGEM',
    linhaId: 'L1',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 4,
    pdtInicio: 27,
    pdtFim: 54,
    totalPdts: 28,
    cor: '#0ea5e9',
    descricao: 'Acabamentos internos e tubulações L1'
  },
  {
    id: 'TRECHO-L1-SEQ3',
    codigo: 'TR-L1-03',
    nome: 'Chassi L1 (55–85)',
    uteId: 'UTE-L1-MONTAGEM',
    linhaId: 'L1',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 5,
    pdtInicio: 55,
    pdtFim: 85,
    totalPdts: 31,
    cor: '#f59e0b',
    descricao: 'Casamento de conjunto motopropulsor L1'
  },
  {
    id: 'TRECHO-L1-SEQ4',
    codigo: 'TR-L1-04',
    nome: 'Final L1 (86–108)',
    uteId: 'UTE-L1-MONTAGEM',
    linhaId: 'L1',
    tipo: 'PRINCIPAL',
    isIndependente: false,
    ordem: 6,
    pdtInicio: 86,
    pdtFim: 108,
    totalPdts: 23,
    cor: '#10b981',
    descricao: 'Finalização, abastecimento e prova hídrica L1'
  }
];

// ============================================================================
// DOMÍNIOS E TOTENS (Estritamente 1 Totem por Domínio)
// ============================================================================
// ============================================================================
// DOMÍNIOS E TOTENS (Estritamente 1 Totem por Domínio conforme Rodapé Oficial)
// ============================================================================
export const INITIAL_DOMINIOS: DominioRecord[] = [
  // UTE 01: Componentes (Plância e Doors)
  {
    id: 'DOM-L3-PLAN-01',
    codigo: 'DOM-PL-01',
    nome: 'Domínio Plância 01 (PDT 1–12)',
    trechoId: 'TRECHO-L3-PLANCIA',
    uteId: 'UTE-L3-COMP',
    linhaId: 'L3',
    teamLeaderNome: 'AVELINO DA SILVA',
    teamLeaderMatricula: 'ST12098',
    liderNome: 'LÍDER MARCELO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-PLAN-01',
    pdtsIds: Array.from({ length: 12 }, (_, i) => `L3-PLAN-${String(i + 1).padStart(2, '0')}`),
    descricao: 'Gestão dos PDTs 1 a 12 de Plância e alocação de operadores'
  },
  {
    id: 'DOM-L3-PLAN-02',
    codigo: 'DOM-PL-02',
    nome: 'Domínio Plância 02 (PDT 13–25)',
    trechoId: 'TRECHO-L3-PLANCIA',
    uteId: 'UTE-L3-COMP',
    linhaId: 'L3',
    teamLeaderNome: 'JOÃO BATISTA',
    teamLeaderMatricula: 'ST12099',
    liderNome: 'LÍDER MARCELO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-PLAN-12',
    pdtsIds: Array.from({ length: 13 }, (_, i) => `L3-PLAN-${String(i + 13).padStart(2, '0')}`),
    descricao: 'Gestão dos PDTs 13 a 25 de Plância e alocação de operadores'
  },
  {
    id: 'DOM-L3-DOR-01',
    codigo: 'DOM-DR-01',
    nome: 'Domínio Doors 01 (PDT 1–7)',
    trechoId: 'TRECHO-L3-DOORS',
    uteId: 'UTE-L3-COMP',
    linhaId: 'L3',
    teamLeaderNome: 'MARCOS VINICIUS',
    teamLeaderMatricula: 'ST45210',
    liderNome: 'LÍDER MARCELO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-DOR-01',
    pdtsIds: Array.from({ length: 7 }, (_, i) => `L3-DOOR-${String(i + 1).padStart(2, '0')}`),
    descricao: 'Gestão dos PDTs 1 a 7 de Doors e alocação de operadores'
  },
  {
    id: 'DOM-L3-DOR-02',
    codigo: 'DOM-DR-02',
    nome: 'Domínio Doors 02 (PDT 8–17)',
    trechoId: 'TRECHO-L3-DOORS',
    uteId: 'UTE-L3-COMP',
    linhaId: 'L3',
    teamLeaderNome: 'CARLOS HENRIQUE',
    teamLeaderMatricula: 'ST45211',
    liderNome: 'LÍDER MARCELO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-DOR-07',
    pdtsIds: Array.from({ length: 10 }, (_, i) => `L3-DOOR-${String(i + 8).padStart(2, '0')}`),
    descricao: 'Gestão dos PDTs 8 a 17 de Doors e alocação de operadores'
  },
  {
    id: 'DOM-L3-BDOR-01',
    codigo: 'DOM-BDR-01',
    nome: 'Domínio Big Doors (PDT 18–22)',
    trechoId: 'TRECHO-L3-BIG-DOORS',
    uteId: 'UTE-L3-COMP',
    linhaId: 'L3',
    teamLeaderNome: 'FERNANDO DIAS',
    teamLeaderMatricula: 'ST45212',
    liderNome: 'LÍDER MARCELO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-BDOR-18',
    pdtsIds: Array.from({ length: 5 }, (_, i) => `L3-DOOR-${String(i + 18).padStart(2, '0')}`),
    descricao: 'Gestão dos PDTs 18 a 22 de Big Doors e alocação de operadores'
  },

  // UTE 02: Inicial, Swivel e Trim
  {
    id: 'DOM-L3-BSW-01',
    codigo: 'DOM-BSW-01',
    nome: 'Domínio Big Swivel 01 (PDT 1–6)',
    trechoId: 'TRECHO-L3-BIG-SWIVEL',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    teamLeaderNome: 'RICARDO BARROS',
    teamLeaderMatricula: 'ST33209',
    liderNome: 'LÍDER ROBERTO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-BSW-01',
    pdtsIds: Array.from({ length: 6 }, (_, i) => `L3-${String(i + 1).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 1 a 6 de Big Swivel'
  },
  {
    id: 'DOM-L3-BSW-02',
    codigo: 'DOM-BSW-02',
    nome: 'Domínio Big Swivel 02 (PDT 7–12)',
    trechoId: 'TRECHO-L3-BIG-SWIVEL',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    teamLeaderNome: 'JULIO CESAR',
    teamLeaderMatricula: 'ST33210',
    liderNome: 'LÍDER ROBERTO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-BSW-06',
    pdtsIds: Array.from({ length: 6 }, (_, i) => `L3-${String(i + 7).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 7 a 12 de Big Swivel'
  },
  {
    id: 'DOM-L3-SWV-01',
    codigo: 'DOM-SWV-01',
    nome: 'Domínio Swivel 01 (PDT 13–19)',
    trechoId: 'TRECHO-L3-SWIVEL',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    teamLeaderNome: 'LEANDRO ALVES',
    teamLeaderMatricula: 'ST33211',
    liderNome: 'LÍDER ROBERTO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-SWV-13',
    pdtsIds: Array.from({ length: 7 }, (_, i) => `L3-${String(i + 13).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 13 a 19 de Swivel'
  },
  {
    id: 'DOM-L3-SWV-02',
    codigo: 'DOM-SWV-02',
    nome: 'Domínio Swivel 02 (PDT 20–26)',
    trechoId: 'TRECHO-L3-SWIVEL',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    teamLeaderNome: 'GUSTAVO LIMA',
    teamLeaderMatricula: 'ST33212',
    liderNome: 'LÍDER ROBERTO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-SWV-20',
    pdtsIds: Array.from({ length: 7 }, (_, i) => `L3-${String(i + 20).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 20 a 26 de Swivel'
  },
  {
    id: 'DOM-L3-TRM-01',
    codigo: 'DOM-TRM-01',
    nome: 'Domínio Trim 01 (PDT 27–31)',
    trechoId: 'TRECHO-L3-TRIM',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    teamLeaderNome: 'FERNANDO ALMEIDA',
    teamLeaderMatricula: 'ST66124',
    liderNome: 'LÍDER ROBERTO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-TRM-27',
    pdtsIds: Array.from({ length: 5 }, (_, i) => `L3-${String(i + 27).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 27 a 31 de Trim'
  },
  {
    id: 'DOM-L3-TRM-02',
    codigo: 'DOM-TRM-02',
    nome: 'Domínio Trim 02 (PDT 32–36)',
    trechoId: 'TRECHO-L3-TRIM',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    teamLeaderNome: 'MARCELO VIEIRA',
    teamLeaderMatricula: 'ST66125',
    liderNome: 'LÍDER ROBERTO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-TRM-32',
    pdtsIds: Array.from({ length: 5 }, (_, i) => `L3-${String(i + 32).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 32 a 36 de Trim'
  },
  {
    id: 'DOM-L3-TRM-03',
    codigo: 'DOM-TRM-03',
    nome: 'Domínio Trim 03 (PDT 37–41)',
    trechoId: 'TRECHO-L3-TRIM',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    teamLeaderNome: 'BRUNO COSTA',
    teamLeaderMatricula: 'ST66126',
    liderNome: 'LÍDER ROBERTO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-TRM-37',
    pdtsIds: Array.from({ length: 5 }, (_, i) => `L3-${String(i + 37).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 37 a 41 de Trim'
  },
  {
    id: 'DOM-L3-TRM-04',
    codigo: 'DOM-TRM-04',
    nome: 'Domínio Trim 04 (PDT 42–50)',
    trechoId: 'TRECHO-L3-TRIM',
    uteId: 'UTE-L3-INIT',
    linhaId: 'L3',
    teamLeaderNome: 'DIEGO SOUZA',
    teamLeaderMatricula: 'ST66127',
    liderNome: 'LÍDER ROBERTO',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-TRM-42',
    pdtsIds: Array.from({ length: 9 }, (_, i) => `L3-${String(i + 42).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 42 a 50 de Trim'
  },

  // UTE 03: Chassi e Big Chassi
  {
    id: 'DOM-L3-CHS-01',
    codigo: 'DOM-CHS-01',
    nome: 'Domínio Chassi 01 (PDT 51–64)',
    trechoId: 'TRECHO-L3-CHASSI',
    uteId: 'UTE-L3-CHASSI',
    linhaId: 'L3',
    teamLeaderNome: 'LUCAS PEREIRA',
    teamLeaderMatricula: 'ST78901',
    liderNome: 'LÍDER CLAUDINEI',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-CHS-51',
    pdtsIds: Array.from({ length: 14 }, (_, i) => `L3-${String(i + 51).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 51 a 64 de Chassi'
  },
  {
    id: 'DOM-L3-CHS-02',
    codigo: 'DOM-CHS-02',
    nome: 'Domínio Chassi 02 (PDT 65–93)',
    trechoId: 'TRECHO-L3-CHASSI',
    uteId: 'UTE-L3-CHASSI',
    linhaId: 'L3',
    teamLeaderNome: 'RODRIGO SOUZA',
    teamLeaderMatricula: 'ST99124',
    liderNome: 'LÍDER CLAUDINEI',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-CHS-65',
    pdtsIds: Array.from({ length: 29 }, (_, i) => `L3-${String(i + 65).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 65 a 93 de Chassi'
  },
  {
    id: 'DOM-L3-BCH-01',
    codigo: 'DOM-BCH-01',
    nome: 'Domínio Big Chassi 01 (PDT 94–101)',
    trechoId: 'TRECHO-L3-BIG-CHASSI',
    uteId: 'UTE-L3-CHASSI',
    linhaId: 'L3',
    teamLeaderNome: 'ALEXANDRE SILVA',
    teamLeaderMatricula: 'ST99125',
    liderNome: 'LÍDER CLAUDINEI',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-BCH-95',
    pdtsIds: Array.from({ length: 8 }, (_, i) => `L3-${String(i + 94).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 94 a 101 de Big Chassi'
  },
  {
    id: 'DOM-L3-BCH-02',
    codigo: 'DOM-BCH-02',
    nome: 'Domínio Big Chassi 02 (PDT 102–108)',
    trechoId: 'TRECHO-L3-BIG-CHASSI',
    uteId: 'UTE-L3-CHASSI',
    linhaId: 'L3',
    teamLeaderNome: 'GABRIEL NUNES',
    teamLeaderMatricula: 'ST99126',
    liderNome: 'LÍDER CLAUDINEI',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-BCH-102',
    pdtsIds: Array.from({ length: 7 }, (_, i) => `L3-${String(i + 102).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 102 a 108 de Big Chassi'
  },

  // UTE 04: Final
  {
    id: 'DOM-L3-FIN-01',
    codigo: 'DOM-FIN-01',
    nome: 'Domínio Final 01 (PDT 109–119)',
    trechoId: 'TRECHO-L3-FINAL',
    uteId: 'UTE-L3-FINAL',
    linhaId: 'L3',
    teamLeaderNome: 'PAULO SANTOS',
    teamLeaderMatricula: 'ST44201',
    liderNome: 'LÍDER CLAUDINEI',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-FIN-109',
    pdtsIds: Array.from({ length: 11 }, (_, i) => `L3-${String(i + 109).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 109 a 119 de Final'
  },
  {
    id: 'DOM-L3-FIN-02',
    codigo: 'DOM-FIN-02',
    nome: 'Domínio Final 02 (PDT 120–129)',
    trechoId: 'TRECHO-L3-FINAL',
    uteId: 'UTE-L3-FINAL',
    linhaId: 'L3',
    teamLeaderNome: 'TIAGO MARTINS',
    teamLeaderMatricula: 'ST44202',
    liderNome: 'LÍDER CLAUDINEI',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-FIN-120',
    pdtsIds: Array.from({ length: 10 }, (_, i) => `L3-${String(i + 120).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 120 a 129 de Final'
  },
  {
    id: 'DOM-L3-FIN-03',
    codigo: 'DOM-FIN-03',
    nome: 'Domínio Final 03 (PDT 130–139)',
    trechoId: 'TRECHO-L3-FINAL',
    uteId: 'UTE-L3-FINAL',
    linhaId: 'L3',
    teamLeaderNome: 'VINICIUS SOUZA',
    teamLeaderMatricula: 'ST44203',
    liderNome: 'LÍDER CLAUDINEI',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-FIN-130',
    pdtsIds: Array.from({ length: 10 }, (_, i) => `L3-${String(i + 130).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 130 a 139 de Final'
  },
  {
    id: 'DOM-L3-FIN-04',
    codigo: 'DOM-FIN-04',
    nome: 'Domínio Final 04 (PDT 140–150)',
    trechoId: 'TRECHO-L3-FINAL',
    uteId: 'UTE-L3-FINAL',
    linhaId: 'L3',
    teamLeaderNome: 'ROBERTO CARVALHO',
    teamLeaderMatricula: 'ST44204',
    liderNome: 'LÍDER CLAUDINEI',
    shift: '1º TURNO',
    totemId: 'TOTEM-L3-FIN-140',
    pdtsIds: Array.from({ length: 11 }, (_, i) => `L3-${String(i + 140).padStart(3, '0')}`),
    descricao: 'Gestão dos PDTs 140 a 150 de Final'
  }
];

export const INITIAL_TOTENS: TotemRecord[] = [
  // Plância (2 Totens: PDT 1 e PDT 12)
  {
    id: 'TOTEM-L3-PLAN-01',
    codigo: 'TT-PL-01',
    nome: 'Totem Plância 01 (PDT 01)',
    dominioId: 'DOM-L3-PLANCIA',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.11',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:45',
    x: 542,
    y: 258
  },
  {
    id: 'TOTEM-L3-PLAN-12',
    codigo: 'TT-PL-12',
    nome: 'Totem Plância 02 (PDT 12)',
    dominioId: 'DOM-L3-PLANCIA',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.12',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:45',
    x: 542,
    y: 76
  },
  // Big Swivel (2 Totens: PDT 1 e PDT 6)
  {
    id: 'TOTEM-L3-BSW-01',
    codigo: 'TT-BSW-01',
    nome: 'Totem Big Swivel 01 (PDT 01)',
    dominioId: 'DOM-L3-SWIVEL',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.13',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:42',
    x: 473,
    y: 385
  },
  {
    id: 'TOTEM-L3-BSW-06',
    codigo: 'TT-BSW-06',
    nome: 'Totem Big Swivel 02 (PDT 06)',
    dominioId: 'DOM-L3-SWIVEL',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.14',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:42',
    x: 473,
    y: 401.5
  },
  // Swivel (2 Totens: PDT 13 e PDT 20)
  {
    id: 'TOTEM-L3-SWV-13',
    codigo: 'TT-SWV-13',
    nome: 'Totem Swivel 01 (PDT 13)',
    dominioId: 'DOM-L3-SWIVEL',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.15',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:42',
    x: 377,
    y: 445
  },
  {
    id: 'TOTEM-L3-SWV-20',
    codigo: 'TT-SWV-20',
    nome: 'Totem Swivel 02 (PDT 20)',
    dominioId: 'DOM-L3-SWIVEL',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.16',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:42',
    x: 506,
    y: 461.5
  },
  // Trim (4 Totens: PDT 27, 32, 37, 42)
  {
    id: 'TOTEM-L3-TRM-27',
    codigo: 'TT-TRM-27',
    nome: 'Totem Trim 01 (PDT 27)',
    dominioId: 'DOM-L3-TRIM',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.17',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:46',
    x: 360,
    y: 461.5
  },
  {
    id: 'TOTEM-L3-TRM-32',
    codigo: 'TT-TRM-32',
    nome: 'Totem Trim 02 (PDT 32)',
    dominioId: 'DOM-L3-TRIM',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.18',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:46',
    x: 360,
    y: 379
  },
  {
    id: 'TOTEM-L3-TRM-37',
    codigo: 'TT-TRM-37',
    nome: 'Totem Trim 03 (PDT 37)',
    dominioId: 'DOM-L3-TRIM',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.19',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:46',
    x: 360,
    y: 296.5
  },
  {
    id: 'TOTEM-L3-TRM-42',
    codigo: 'TT-TRM-42',
    nome: 'Totem Trim 04 (PDT 42)',
    dominioId: 'DOM-L3-TRIM',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.20',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:46',
    x: 360,
    y: 214
  },
  // Chassi (2 Totens: PDT 51 e PDT 65)
  {
    id: 'TOTEM-L3-CHS-51',
    codigo: 'TT-CHS-51',
    nome: 'Totem Chassi 01 (PDT 51)',
    dominioId: 'DOM-L3-CHASSI',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.21',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:41',
    x: 294,
    y: 89
  },
  {
    id: 'TOTEM-L3-CHS-65',
    codigo: 'TT-CHS-65',
    nome: 'Totem Chassi 02 (PDT 65)',
    dominioId: 'DOM-L3-CHASSI',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.22',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:41',
    x: 294,
    y: 320
  },
  // Big Chassi (2 Totens: PDT 95 e PDT 102)
  {
    id: 'TOTEM-L3-BCH-95',
    codigo: 'TT-BCH-95',
    nome: 'Totem Big Chassi 01 (PDT 95)',
    dominioId: 'DOM-L3-BIG-CHASSI',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.23',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:43',
    x: 367,
    y: 511
  },
  {
    id: 'TOTEM-L3-BCH-102',
    codigo: 'TT-BCH-102',
    nome: 'Totem Big Chassi 02 (PDT 102)',
    dominioId: 'DOM-L3-BIG-CHASSI',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.24',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:43',
    x: 367,
    y: 626.5
  },
  // Final (4 Totens: PDT 109, 120, 130, 140)
  {
    id: 'TOTEM-L3-FIN-109',
    codigo: 'TT-FIN-109',
    nome: 'Totem Final 01 (PDT 109)',
    dominioId: 'DOM-L3-FINAL',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.25',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:45',
    x: 272,
    y: 733.5
  },
  {
    id: 'TOTEM-L3-FIN-120',
    codigo: 'TT-FIN-120',
    nome: 'Totem Final 02 (PDT 120)',
    dominioId: 'DOM-L3-FINAL',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.26',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:45',
    x: 272,
    y: 552
  },
  {
    id: 'TOTEM-L3-FIN-130',
    codigo: 'TT-FIN-130',
    nome: 'Totem Final 03 (PDT 130)',
    dominioId: 'DOM-L3-FINAL',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.27',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:45',
    x: 272,
    y: 387
  },
  {
    id: 'TOTEM-L3-FIN-140',
    codigo: 'TT-FIN-140',
    nome: 'Totem Final 04 (PDT 140)',
    dominioId: 'DOM-L3-FINAL',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.28',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:45',
    x: 272,
    y: 222
  },
  // Doors (2 Totens: PDT 1 e PDT 7)
  {
    id: 'TOTEM-L3-DOR-01',
    codigo: 'TT-DOR-01',
    nome: 'Totem Doors 01 (PDT 01)',
    dominioId: 'DOM-L3-DOORS',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.29',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:44',
    x: 397,
    y: 358
  },
  {
    id: 'TOTEM-L3-DOR-07',
    codigo: 'TT-DOR-07',
    nome: 'Totem Doors 02 (PDT 07)',
    dominioId: 'DOM-L3-DOORS',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.30',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:44',
    x: 397,
    y: 259
  },
  // Big Doors (1 Totem: PDT 18)
  {
    id: 'TOTEM-L3-BDOR-18',
    codigo: 'TT-BDOR-18',
    nome: 'Totem Big Doors 01 (PDT 18)',
    dominioId: 'DOM-L3-DOORS',
    linhaId: 'L3',
    status: 'ONLINE',
    ipAddress: '10.22.40.31',
    versaoApp: 'v2.8.4',
    ultimaSincronizacao: '14/10/2026 09:44',
    x: 474,
    y: 183
  }
];

// ============================================================================
// ÁREAS DE ACÚMULO DA LINHA (Espaços coloridos sem numeração de PDT)
export const INITIAL_ACUMULOS: AcumuloLinhaRecord[] = [
  // Linha 3: Espaços coloridos sem números (Acúmulos da Linha - Planta de Betim)
  {
    id: 'AC-L3-DOR-01',
    codigo: 'AC-DOR-01',
    nome: 'Acúmulo Topo Doors (Curva)',
    linhaId: 'L3',
    trechoOrigem: 'Doors (17)',
    trechoDestino: 'Doors Curva',
    capacidadeMaxCarros: 4,
    ocupacaoAtualCarros: 2,
    x: 405,
    y: 68.5,
    w: 36,
    h: 15.5,
    cor: '#15803d',
    status: 'NORMAL',
    observacao: 'Buffer pulmão no topo do trecho de portas antes da descida'
  },
  {
    id: 'AC-L3-DOR-02',
    codigo: 'AC-DOR-02',
    nome: 'Acúmulo Conexão Doors',
    linhaId: 'L3',
    trechoOrigem: 'Doors Curva',
    trechoDestino: 'Big Doors',
    capacidadeMaxCarros: 3,
    ocupacaoAtualCarros: 1,
    x: 425.5,
    y: 84,
    w: 15.5,
    h: 40,
    cor: '#15803d',
    status: 'NORMAL',
    observacao: 'Conexão vertical de acúmulo de subconjuntos de portas'
  },
  {
    id: 'AC-L3-BDOR-01',
    codigo: 'AC-BDOR-01',
    nome: 'Acúmulo Big Doors',
    linhaId: 'L3',
    trechoOrigem: 'Big Doors (18)',
    trechoDestino: 'Alimentação Linha Principal',
    capacidadeMaxCarros: 4,
    ocupacaoAtualCarros: 2,
    x: 452,
    y: 199.5,
    w: 15.5,
    h: 15.5,
    cor: '#38bdf8',
    status: 'NORMAL',
    observacao: 'Buffer de liberação de portas prontas para montagem final'
  },
  {
    id: 'AC-L3-BSW-01',
    codigo: 'AC-BSW-01',
    nome: 'Acúmulo Big Swivel / Swivel',
    linhaId: 'L3',
    trechoOrigem: 'Big Swivel (12)',
    trechoDestino: 'Swivel (13)',
    capacidadeMaxCarros: 3,
    ocupacaoAtualCarros: 1,
    x: 385,
    y: 418,
    w: 15.5,
    h: 15.5,
    cor: '#22c55e',
    status: 'NORMAL',
    observacao: 'Pulmão de transição entre o circuito Big Swivel e entrada do Swivel'
  },
  {
    id: 'AC-L3-SWV-01',
    codigo: 'AC-SWV-01',
    nome: 'Acúmulo Curva Swivel',
    linhaId: 'L3',
    trechoOrigem: 'Swivel (19)',
    trechoDestino: 'Swivel (20)',
    capacidadeMaxCarros: 4,
    ocupacaoAtualCarros: 3,
    x: 500.5,
    y: 445,
    w: 15.5,
    h: 32,
    cor: '#f97316',
    status: 'NORMAL',
    observacao: 'Buffer em curva de inversão de sentido do Swivel'
  },
  {
    id: 'AC-L3-TRM-CHS',
    codigo: 'AC-TRM-01',
    nome: 'Acúmulo Trim / Chassi',
    linhaId: 'L3',
    trechoOrigem: 'Trim (50)',
    trechoDestino: 'Chassi (51)',
    capacidadeMaxCarros: 8,
    ocupacaoAtualCarros: 5,
    x: 302.5,
    y: 65,
    w: 81.5,
    h: 16.5,
    cor: '#2563eb',
    status: 'NORMAL',
    observacao: 'Ponte superior de acúmulo de carrocerias entre Trim e Chassi'
  },
  {
    id: 'AC-L3-BCH-01',
    codigo: 'AC-BCH-01',
    nome: 'Acúmulo Saída Big Chassi',
    linhaId: 'L3',
    trechoOrigem: 'Big Chassi (108)',
    trechoDestino: 'Canal Inferior',
    capacidadeMaxCarros: 4,
    ocupacaoAtualCarros: 2,
    x: 345,
    y: 742,
    w: 15.5,
    h: 20,
    cor: '#06b6d4',
    status: 'NORMAL',
    observacao: 'Descida pós Big Chassi'
  },
  {
    id: 'AC-L3-BCH-02',
    codigo: 'AC-BCH-02',
    nome: 'Acúmulo Conexão Final',
    linhaId: 'L3',
    trechoOrigem: 'Big Chassi Saída',
    trechoDestino: 'Final (109)',
    capacidadeMaxCarros: 6,
    ocupacaoAtualCarros: 4,
    x: 280,
    y: 750,
    w: 80.5,
    h: 12,
    cor: '#06b6d4',
    status: 'NORMAL',
    observacao: 'Canal inferior de acúmulo antes da entrada na linha de Montagem Final'
  },
  // Linha 1 Acúmulos
  {
    id: 'AC-L1-01',
    codigo: 'AC-L1-01',
    nome: 'Acúmulo Trim / Chassi L1',
    linhaId: 'L1',
    trechoOrigem: 'Trim 1',
    trechoDestino: 'Chassi L1',
    capacidadeMaxCarros: 6,
    ocupacaoAtualCarros: 3,
    x: 200,
    y: 535,
    w: 55,
    h: 38,
    cor: '#0ea5e9',
    status: 'NORMAL',
    observacao: 'Buffer intermediário Linha 1'
  }
];

// ============================================================================
// POSICIONAMENTO OFICIAL DO BIG SWIVEL
// Três colunas verticais conforme o desenho de referência.
// ============================================================================
export const BIG_SWIVEL_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 459.5, y: 375 },
  2: { x: 443, y: 375 },
  3: { x: 426.5, y: 375 },
  4: { x: 443, y: 391.5 },
  5: { x: 459.5, y: 391.5 },
  6: { x: 476, y: 391.5 },
  7: { x: 476, y: 408 },
  8: { x: 459.5, y: 408 },
  9: { x: 443, y: 408 },
  10: { x: 426.5, y: 408 },
  11: { x: 410, y: 408 },
  12: { x: 393.5, y: 408 }
};

// ============================================================================
// GERADOR COMPLETO DOS PDTs
// Com Plância (25 PDTs) e Doors (22 PDTs) no início + 150 PDTs Sequência L3 + 108 L1
// ============================================================================
export function generateInitialPdts(): MapaPdtRecord[] {
  const pdts: MapaPdtRecord[] = [];

  // --------------------------------------------------------------------------
  // LINHA 3: TRECHOS INDEPENDENTES NO INÍCIO DO MAPA (Plância, Doors, Big Doors)
  // Conforme Mapa Oficial de Produção (Betim)
  // --------------------------------------------------------------------------
  
  // 1. Plância (25 PDTs): Inverted U-shape Amarelo no topo direito
  // Coluna direita sobe (1 a 12), conector topo (13), coluna esquerda desce (14 a 25)
  for (let num = 1; num <= 25; num++) {
    const pdtNumStr = num < 10 ? '0' + num : String(num);
    const id = `L3-PLAN-${pdtNumStr}`;
    const codigo = `PL-${pdtNumStr}`;
    let x = 0;
    let y = 0;

    if (num <= 12) {
      // Coluna direita subindo: PDT 1 no final inferior (y = 256) até PDT 12 no topo (y = 80)
      x = 520;
      y = 256 - (num - 1) * 16;
    } else if (num === 13) {
      // Curva no topo
      x = 504;
      y = 80;
    } else {
      // Coluna esquerda descendo: PDT 14 no topo (y = 80) até PDT 25 na base (y = 256)
      x = 488;
      y = 80 + (num - 14) * 16;
    }

    pdts.push({
      id,
      codigo,
      numero: num,
      nome: `Plância Submontagem Painel ${pdtNumStr} - L3`,
      linha: 'L3',
      uteId: 'UTE-L3-COMP',
      trechoId: 'TRECHO-L3-PLANCIA',
      dominioId: 'DOM-L3-PLANCIA',
      totemId: num <= 12 ? 'TOTEM-L3-PLAN-01' : 'TOTEM-L3-PLAN-12',
      isTrechoIndependente: true,
      trechoTipo: 'PLANCIA',
      x: Math.round(x),
      y: Math.round(y),
      status: num === 8 ? 'COM_PENDENCIA' : 'ATIVO',
      teamLeaderMatricula: 'ST12098',
      teamLeaderNome: 'AVELINO DA SILVA',
      lider: 'LÍDER MARCELO',
      shift: '1º TURNO',
      area: 'Plância (1–25)',
      tempoCicloReferencia: 45,
      operadorAtual: `OPERADOR PL-${pdtNumStr}`,
      totemData: createDefaultTotemData(codigo, 'L3', num)
    });
  }

  // 2. Doors (1–17): Verde escuro subindo em U
  for (let num = 1; num <= 17; num++) {
    const pdtNumStr = num < 10 ? '0' + num : String(num);
    const id = `L3-DOOR-${pdtNumStr}`;
    const codigo = `DR-${pdtNumStr}`;
    // Coluna esquerda subindo de 1 a 17
    const x = 410;
    const y = 360 - (num - 1) * 16;

    pdts.push({
      id,
      codigo,
      numero: num,
      nome: `Doors Submontagem Portas ${pdtNumStr} - L3`,
      linha: 'L3',
      uteId: 'UTE-L3-COMP',
      trechoId: 'TRECHO-L3-DOORS',
      dominioId: 'DOM-L3-DOORS',
      totemId: num <= 7 ? 'TOTEM-L3-DOR-01' : 'TOTEM-L3-DOR-07',
      isTrechoIndependente: true,
      trechoTipo: 'DOORS',
      x: Math.round(x),
      y: Math.round(y),
      status: num === 14 ? 'COM_PENDENCIA' : 'ATIVO',
      teamLeaderMatricula: 'ST45210',
      teamLeaderNome: 'MARCOS VINICIUS',
      lider: 'LÍDER MARCELO',
      shift: '1º TURNO',
      area: 'Doors (1–17)',
      tempoCicloReferencia: 46,
      operadorAtual: `OPERADOR DR-${pdtNumStr}`,
      totemData: createDefaultTotemData(codigo, 'L3', num)
    });
  }

  // 3. Big Doors (18–22): Azul claro descendo
  for (let num = 18; num <= 22; num++) {
    const pdtNumStr = String(num);
    const id = `L3-DOOR-${pdtNumStr}`;
    const codigo = `DR-${pdtNumStr}`;
    const x = 456;
    const y = 136 + (22 - num) * 16; // 22 no topo, descendo até 18

    pdts.push({
      id,
      codigo,
      numero: num,
      nome: `Big Doors Submontagem ${pdtNumStr} - L3`,
      linha: 'L3',
      uteId: 'UTE-L3-COMP',
      trechoId: 'TRECHO-L3-BIG-DOORS',
      dominioId: 'DOM-L3-DOORS',
      totemId: 'TOTEM-L3-BDOR-18',
      isTrechoIndependente: true,
      trechoTipo: 'DOORS',
      x: Math.round(x),
      y: Math.round(y),
      status: 'ATIVO',
      teamLeaderMatricula: 'ST45210',
      teamLeaderNome: 'MARCOS VINICIUS',
      lider: 'LÍDER MARCELO',
      shift: '1º TURNO',
      area: 'Big Doors (18–22)',
      tempoCicloReferencia: 46,
      operadorAtual: `OPERADOR DR-${pdtNumStr}`,
      totemData: createDefaultTotemData(codigo, 'L3', num)
    });
  }

  // --------------------------------------------------------------------------
  // LINHA 3: SEQUÊNCIA PRINCIPAL COMPLETA (150 PDTs)
  // Conforme Mapa Oficial de Produção (Betim)
  // --------------------------------------------------------------------------
  for (let num = 1; num <= 150; num++) {
    const id = `L3-${num < 10 ? '00' + num : num < 100 ? '0' + num : num}`;
    const codigo = `OP ${num}`;
    let x = 0;
    let y = 0;
    let area = 'L3 Montagem Geral';
    let trechoId = 'TRECHO-L3-BIG-SWIVEL';
    let uteId = 'UTE-L3-INIT';
    let dominioId = 'DOM-L3-SWIVEL';
    let totemId = 'TOTEM-L3-BSW-01';
    let status: MapaPdtRecord['status'] = 'ATIVO';

    if (num <= 12) {
      // 1. Big Swivel (1–12): Verde claro no loop em S
      trechoId = 'TRECHO-L3-BIG-SWIVEL';
      uteId = 'UTE-L3-INIT';
      dominioId = 'DOM-L3-SWIVEL';
      area = 'Big Swivel (1–12)';
      totemId = num <= 6 ? 'TOTEM-L3-BSW-01' : 'TOTEM-L3-BSW-06';

      const posicao = BIG_SWIVEL_POSITIONS[num];
      x = posicao.x;
      y = posicao.y;
    } else if (num <= 26) {
      // 2. Swivel (13–26): Laranja em pista horizontal dupla (ida e volta)
      trechoId = 'TRECHO-L3-SWIVEL';
      uteId = 'UTE-L3-INIT';
      dominioId = 'DOM-L3-SWIVEL';
      area = 'Swivel (13–26)';
      totemId = num <= 19 ? 'TOTEM-L3-SWV-13' : 'TOTEM-L3-SWV-20';

      if (num <= 19) {
        // Linha superior: 13 a 19 indo para a direita
        x = 390 + (num - 13) * 16;
        y = 452;
      } else {
        // Linha inferior: 20 a 26 voltando para a esquerda até conectar em 27
        // 26 fica no extremo esquerdo (x = 390), 20 no extremo direito (x = 486)
        x = 486 - (num - 20) * 16;
        y = 468;
      }
    } else if (num <= 50) {
      // 3. Trim (27–50): Azul royal em coluna vertical subindo
      trechoId = 'TRECHO-L3-TRIM';
      uteId = 'UTE-L3-INIT';
      dominioId = 'DOM-L3-TRIM';
      area = 'Trim (27–50)';
      if (num <= 31) totemId = 'TOTEM-L3-TRM-27';
      else if (num <= 36) totemId = 'TOTEM-L3-TRM-32';
      else if (num <= 41) totemId = 'TOTEM-L3-TRM-37';
      else totemId = 'TOTEM-L3-TRM-42';

      x = 370;
      y = 468 - (num - 27) * 16;
    } else if (num <= 93) {
      // 4. Chassi (51–93): Vermelho em coluna vertical descendo
      trechoId = 'TRECHO-L3-CHASSI';
      uteId = 'UTE-L3-CHASSI';
      dominioId = 'DOM-L3-CHASSI';
      area = 'Chassi (51–93)';
      totemId = num <= 65 ? 'TOTEM-L3-CHS-51' : 'TOTEM-L3-CHS-65';

      x = 310;
      y = 100 + (num - 51) * 16;
    } else if (num <= 108) {
      // 5. Big Chassi (94–108): Ciano em coluna adjacente ao Chassi inferior
      trechoId = 'TRECHO-L3-BIG-CHASSI';
      uteId = 'UTE-L3-CHASSI';
      dominioId = 'DOM-L3-BIG-CHASSI';
      area = 'Big Chassi (94–108)';
      totemId = num <= 101 ? 'TOTEM-L3-BCH-95' : 'TOTEM-L3-BCH-102';

      x = 350;
      y = 548 + (num - 94) * 16;
    } else {
      // 6. Final (109–150): Magenta / Roxo em coluna vertical subindo
      trechoId = 'TRECHO-L3-FINAL';
      uteId = 'UTE-L3-FINAL';
      dominioId = 'DOM-L3-FINAL';
      area = 'Final (109–150)';
      if (num <= 119) totemId = 'TOTEM-L3-FIN-109';
      else if (num <= 129) totemId = 'TOTEM-L3-FIN-120';
      else if (num <= 139) totemId = 'TOTEM-L3-FIN-130';
      else totemId = 'TOTEM-L3-FIN-140';

      x = 270;
      y = 790 - (num - 109) * 16;
    }

    // Status reais distribuídos
    if (num === 87 || num === 52 || num === 130) {
      status = 'COM_PENDENCIA';
    } else if (num === 90 || num === 148) {
      status = 'CRITICO';
    } else if (num > 140 && num % 4 === 0) {
      status = 'SEM_TOTEM';
    }

    pdts.push({
      id,
      codigo,
      numero: num,
      nome: `Posto de Operação ${num} - L3`,
      linha: 'L3',
      uteId,
      trechoId,
      dominioId,
      totemId,
      isTrechoIndependente: false,
      trechoTipo: 'PRINCIPAL',
      x: Math.round(x),
      y: Math.round(y),
      status,
      teamLeaderMatricula: num <= 50 ? 'ST12098' : num <= 108 ? 'ST45210' : 'ST78901',
      teamLeaderNome: num <= 50 ? 'AVELINO DA SILVA' : num <= 108 ? 'MARCOS LIMA' : 'LUCAS PEREIRA',
      lider: num <= 50 ? 'LÍDER MARCELO' : num <= 108 ? 'LÍDER ROBERTO' : 'LÍDER CLAUDINEI',
      shift: '1º TURNO',
      area,
      tempoCicloReferencia: 50,
      operadorAtual: `OPERADOR ${num}`,
      totemData: createDefaultTotemData(codigo, 'L3', num)
    });
  }

  // --------------------------------------------------------------------------
  // LINHA 1: TRECHOS INDEPENDENTES (Plância 25 e Doors 22) + SEQUÊNCIA 1–108
  // --------------------------------------------------------------------------
  for (let num = 1; num <= 25; num++) {
    const pdtNumStr = num < 10 ? '0' + num : String(num);
    const id = `L1-PLAN-${pdtNumStr}`;
    const codigo = `PL1-${pdtNumStr}`;
    const col = (num - 1) % 13;
    const row = Math.floor((num - 1) / 13);
    const x = 50 + col * 17;
    const y = 80 + row * 22;

    pdts.push({
      id,
      codigo,
      numero: num,
      nome: `Plância L1 Cockpit ${pdtNumStr}`,
      linha: 'L1',
      uteId: 'UTE-L1-COMP',
      trechoId: 'TRECHO-L1-PLANCIA',
      dominioId: 'DOM-L1-COMP',
      totemId: 'TOTEM-L1-COMP',
      isTrechoIndependente: true,
      trechoTipo: 'PLANCIA',
      x: Math.round(x),
      y: Math.round(y),
      status: 'ATIVO',
      teamLeaderMatricula: 'ST11440',
      teamLeaderNome: 'RENATA LOPES',
      lider: 'LÍDER CLAUDINEI',
      shift: '1º TURNO',
      area: 'Plância L1 (Montagem Painel)',
      tempoCicloReferencia: 48,
      operadorAtual: `OPERADOR PL1-${pdtNumStr}`,
      totemData: createDefaultTotemData(codigo, 'L1', num)
    });
  }

  for (let num = 1; num <= 22; num++) {
    const pdtNumStr = num < 10 ? '0' + num : String(num);
    const id = `L1-DOOR-${pdtNumStr}`;
    const codigo = `DR1-${pdtNumStr}`;
    const col = (num - 1) % 11;
    const row = Math.floor((num - 1) / 11);
    const x = 280 + col * 18;
    const y = 80 + row * 22;

    pdts.push({
      id,
      codigo,
      numero: num,
      nome: `Doors L1 Portas ${pdtNumStr}`,
      linha: 'L1',
      uteId: 'UTE-L1-COMP',
      trechoId: 'TRECHO-L1-DOORS',
      dominioId: 'DOM-L1-COMP',
      totemId: 'TOTEM-L1-COMP',
      isTrechoIndependente: true,
      trechoTipo: 'DOORS',
      x: Math.round(x),
      y: Math.round(y),
      status: 'ATIVO',
      teamLeaderMatricula: 'ST11440',
      teamLeaderNome: 'RENATA LOPES',
      lider: 'LÍDER CLAUDINEI',
      shift: '1º TURNO',
      area: 'Doors L1 (Montagem Portas)',
      tempoCicloReferencia: 47,
      operadorAtual: `OPERADOR DR1-${pdtNumStr}`,
      totemData: createDefaultTotemData(codigo, 'L1', num)
    });
  }

  // Sequência Principal L1 (1–108)
  for (let num = 1; num <= 108; num++) {
    const id = `L1-${num < 10 ? '00' + num : num < 100 ? '0' + num : num}`;
    const codigo = `OP ${num}`;
    let x = 0;
    let y = 0;
    let area = 'L1 Montagem Geral';
    let status: MapaPdtRecord['status'] = 'ATIVO';

    if (num <= 26) {
      x = 120 + ((num % 2) === 0 ? 0 : 20);
      y = 150 + (num - 1) * 14.5;
      area = 'L1 Montagem Inicial (1–26)';
    } else if (num <= 54) {
      x = 175 + ((num % 2) === 0 ? 0 : 20);
      y = 525 - (num - 27) * 13;
      area = 'Trim 1 / Monotaparella L1 (27–54)';
    } else if (num <= 85) {
      x = 230 + ((num % 2) === 0 ? 0 : 20);
      y = 180 + (num - 55) * 14;
      area = 'Chassi L1 (55–85)';
    } else {
      x = 220 + ((num % 2) === 0 ? 0 : 22);
      y = 610 + (num - 86) * 18;
      area = num >= 97 ? 'Final L1 (86–108)' : 'Chassi L1 (Baterias & Altimetria)';
    }

    if (num === 102 || num === 97) status = 'COM_PENDENCIA';
    else if (num === 108) status = 'CRITICO';
    else if (num === 5 || num === 42) status = 'SEM_TOTEM';

    pdts.push({
      id,
      codigo,
      numero: num,
      nome: `Posto de Operação ${num} - L1`,
      linha: 'L1',
      uteId: 'UTE-L1-MONTAGEM',
      trechoId: num <= 26 ? 'TRECHO-L1-SEQ1' : num <= 54 ? 'TRECHO-L1-SEQ2' : num <= 85 ? 'TRECHO-L1-SEQ3' : 'TRECHO-L1-SEQ4',
      dominioId: 'DOM-L1-SEQ',
      totemId: 'TOTEM-L1-SEQ',
      isTrechoIndependente: false,
      trechoTipo: 'PRINCIPAL',
      x: Math.round(x),
      y: Math.round(y),
      status,
      teamLeaderMatricula: 'ST12098',
      teamLeaderNome: 'AVELINO DA SILVA',
      lider: 'LÍDER CLAUDINEI',
      shift: '1º TURNO',
      area,
      tempoCicloReferencia: 48,
      operadorAtual: `OPERADOR ${num}`,
      totemData: createDefaultTotemData(codigo, 'L1', num)
    });
  }

  return pdts;
}

// ============================================================================
// LANDMARKS INDUSTRIAIS
// ============================================================================
export interface PlantaLandmark {
  id: string;
  nome: string;
  tipo: 'ARMAZEM' | 'ELEVADOR' | 'LOGISTICA' | 'CONTROLE' | 'CKP' | 'SHIPPING';
  x: number;
  y: number;
  w: number;
  h: number;
  cor: string;
  detalhe?: string;
}

export const PLANTA_LANDMARKS: PlantaLandmark[] = [
  {
    id: 'ARMAZEM_CENTRAL',
    nome: 'ARMAZÉM AUTOMÁTICO CARROCERIAS PINTADAS',
    tipo: 'ARMAZEM',
    x: 540,
    y: 650,
    w: 240,
    h: 80,
    cor: '#ea580c',
    detalhe: 'Armazenamento e alimentação automática de carrocerias para as linhas'
  },
  { id: 'ELEV_TQ01', nome: 'ELEV. TQ01', tipo: 'ELEVADOR', x: 440, y: 120, w: 32, h: 28, cor: '#0284c7' },
  { id: 'ELEV_TQ08', nome: 'ELEV. TQ08', tipo: 'ELEVADOR', x: 730, y: 180, w: 32, h: 28, cor: '#0284c7' },
  { id: 'ELEV_TQ09', nome: 'ELEV. TQ09', tipo: 'ELEVADOR', x: 740, y: 260, w: 32, h: 28, cor: '#0284c7' },
  { id: 'ELEV_TQ10', nome: 'ELEV. TQ10', tipo: 'ELEVADOR', x: 740, y: 320, w: 32, h: 28, cor: '#0284c7' },
  { id: 'ELEV_TQ12', nome: 'ELEV. TQ12', tipo: 'ELEVADOR', x: 440, y: 330, w: 32, h: 28, cor: '#0284c7' },
  { id: 'ELEV_TQ13', nome: 'ELEV. TQ13', tipo: 'ELEVADOR', x: 440, y: 480, w: 32, h: 28, cor: '#0284c7' },
  { id: 'ELEV_PORTAS_1', nome: 'ELEV. PORTAS L3', tipo: 'ELEVADOR', x: 440, y: 260, w: 36, h: 26, cor: '#0284c7' },
  { id: 'ELEV_PORTAS_2', nome: 'ELEV. PORTAS L1', tipo: 'ELEVADOR', x: 190, y: 460, w: 36, h: 26, cor: '#0284c7' },
  { id: 'ELEV_CARROCERIAS', nome: 'ELEV. CARROCERIAS', tipo: 'ELEVADOR', x: 500, y: 645, w: 36, h: 32, cor: '#0284c7' },
  { id: 'CKP_1', nome: 'CKP 1 (Qualidade)', tipo: 'CKP', x: 610, y: 200, w: 46, h: 34, cor: '#dc2626' },
  { id: 'CKP_3', nome: 'CKP 3 (Conformidade)', tipo: 'CKP', x: 620, y: 390, w: 46, h: 34, cor: '#dc2626' },
  { id: 'SHIP_1', nome: 'SHIPPING LINE 1', tipo: 'SHIPPING', x: 460, y: 45, w: 75, h: 24, cor: '#16a34a' },
  { id: 'SHIP_2', nome: 'SHIPPING LINE 2', tipo: 'SHIPPING', x: 545, y: 45, w: 75, h: 24, cor: '#16a34a' },
  { id: 'SHIP_3', nome: 'SHIPPING LINE 3', tipo: 'SHIPPING', x: 630, y: 45, w: 75, h: 24, cor: '#16a34a' },
  { id: 'LOG_NAO_JIS', nome: 'RECEBIMENTO NÃO - JIS', tipo: 'LOGISTICA', x: 740, y: 120, w: 170, h: 45, cor: '#64748b' },
  { id: 'LOG_MEZANINO', nome: 'MEZANINO / KITS', tipo: 'LOGISTICA', x: 740, y: 175, w: 90, h: 100, cor: '#475569' },
  { id: 'LOG_CHICOTES', nome: 'SHOPPING CHICOTES', tipo: 'LOGISTICA', x: 700, y: 510, w: 110, h: 50, cor: '#64748b' },
  { id: 'LOG_KIT_8514', nome: 'NOVA ILHA KIT CAR 8514', tipo: 'LOGISTICA', x: 550, y: 880, w: 160, h: 48, cor: '#475569' },
  { id: 'LOG_REVEST_8521', nome: 'ILHA REVESTIMENTO 8521', tipo: 'LOGISTICA', x: 800, y: 920, w: 130, h: 40, cor: '#475569' },
  { id: 'PROVA_HIDRICA', nome: 'PROVA HÍDRICA (CAB. 13)', tipo: 'CONTROLE', x: 40, y: 160, w: 60, h: 120, cor: '#0369a1' },
  { id: 'CONVERGENCIA', nome: 'CONVERGÊNCIA ELÉTRICA', tipo: 'CONTROLE', x: 40, y: 120, w: 130, h: 32, cor: '#d97706' },
  { id: 'SALA_GOS', nome: 'SALA GOS / MONTAGEM FINAL', tipo: 'CONTROLE', x: 260, y: 1140, w: 130, h: 40, cor: '#0284c7' }
];

// ============================================================================
// DADOS DE QUALIDADE: INDICADORES PERSONALIZADOS
// ============================================================================
export const INITIAL_QUALIDADE_INDICADORES: IndicadorQualidadeRecord[] = [
  {
    id: 'QUAL-01',
    codigo: 'DPU',
    nome: 'Defeitos por Unidade (DPU Linha 3)',
    linhaId: 'L3',
    unidade: 'Def/Veíc',
    meta: 0.15,
    valorAtual: 0.12,
    limiteSuperior: 0.20,
    frequencia: 'TURNO',
    status: 'VERDE',
    responsavel: 'ENGENHARIA DA QUALIDADE',
    ativo: true,
    historicoValores: [
      { data: '10/10', valor: 0.14 },
      { data: '11/10', valor: 0.13 },
      { data: '12/10', valor: 0.15 },
      { data: '13/10', valor: 0.11 },
      { data: '14/10', valor: 0.12 }
    ]
  },
  {
    id: 'QUAL-02',
    codigo: 'RFT',
    nome: 'Right First Time (Aprovado de 1ª)',
    linhaId: 'L3',
    unidade: '%',
    meta: 98.5,
    valorAtual: 98.9,
    limiteInferior: 97.0,
    frequencia: 'DIARIO',
    status: 'VERDE',
    responsavel: 'EQUIPE DA LINHA 3',
    ativo: true,
    historicoValores: [
      { data: '10/10', valor: 98.1 },
      { data: '11/10', valor: 98.4 },
      { data: '12/10', valor: 98.7 },
      { data: '13/10', valor: 99.0 },
      { data: '14/10', valor: 98.9 }
    ]
  },
  {
    id: 'QUAL-03',
    codigo: 'CQA',
    nome: 'Auditoria de Produto Final (CQA)',
    linhaId: 'L3',
    unidade: 'Pontos',
    meta: 18.0,
    valorAtual: 16.5,
    limiteSuperior: 22.0,
    frequencia: 'DIARIO',
    status: 'VERDE',
    responsavel: 'AUDITORIA CQA',
    ativo: true,
    historicoValores: [
      { data: '10/10', valor: 19.2 },
      { data: '11/10', valor: 17.8 },
      { data: '12/10', valor: 16.9 },
      { data: '13/10', valor: 16.0 },
      { data: '14/10', valor: 16.5 }
    ]
  },
  {
    id: 'QUAL-04',
    codigo: 'BP8_APROV',
    nome: 'Taxa de Conformidade BP8 (Amostral)',
    linhaId: 'L3',
    unidade: '%',
    meta: 100.0,
    valorAtual: 99.6,
    limiteInferior: 99.0,
    frequencia: 'TURNO',
    status: 'VERDE',
    responsavel: 'TEAM LEADERS',
    ativo: true,
    historicoValores: [
      { data: '10/10', valor: 99.2 },
      { data: '11/10', valor: 99.8 },
      { data: '12/10', valor: 99.5 },
      { data: '13/10', valor: 100.0 },
      { data: '14/10', valor: 99.6 }
    ]
  },
  {
    id: 'QUAL-05',
    codigo: 'TORQUE_CONFORME',
    nome: 'Índice de Torques em Especificação',
    linhaId: 'L3',
    unidade: '%',
    meta: 99.9,
    valorAtual: 99.85,
    limiteInferior: 99.5,
    frequencia: 'TURNO',
    status: 'AMARELO',
    responsavel: 'MANUTENÇÃO / CALIBRAÇÃO',
    ativo: true,
    historicoValores: [
      { data: '10/10', valor: 99.92 },
      { data: '11/10', valor: 99.88 },
      { data: '12/10', valor: 99.80 },
      { data: '13/10', valor: 99.82 },
      { data: '14/10', valor: 99.85 }
    ]
  }
];

// ============================================================================
// DADOS DE SEGURANÇA: FERRAMENTAS DA PLANTA
// ============================================================================
export const INITIAL_HEINRICH_DATA: PiramideHeinrichData = {
  fatalidade: 0,
  comAfastamento: 0,
  semAfastamento: 0,
  primeirosSocorros: 2,
  quaseAcidentes: 14,
  condicoesInseguras: 38
};

export const INITIAL_QUASE_ACIDENTES: QuaseAcidenteRecord[] = [
  {
    id: 'QA-01',
    data: '13/10/2026',
    turno: '1º TURNO',
    linhaId: 'L3',
    postoOuArea: 'Chassi L3 (PDT 74)',
    tipo: 'QUASE_ACIDENTE',
    descricao: 'Carro de kit com trava frouxa quase deslizou no plano inclinado',
    acaoImediata: 'Trava mecânica substituída imediatamente e delimitador instalado',
    responsavelAcao: 'WHS SEGURANÇA / MANUTENÇÃO',
    status: 'CONCLUIDO',
    gravidade: 'MEDIA'
  },
  {
    id: 'QA-02',
    data: '12/10/2026',
    turno: '2º TURNO',
    linhaId: 'L3',
    postoOuArea: 'Big Swivel (PDT 08)',
    tipo: 'CONDICAO_INSEGURA',
    descricao: 'Vazamento de óleo lubrificante de manipulador pneumático',
    acaoImediata: 'Aplicação de serragem absorvente e troca de retentor',
    responsavelAcao: 'EQUIPE 5S / MANUTENÇÃO',
    status: 'CONCLUIDO',
    gravidade: 'BAIXA'
  },
  {
    id: 'QA-03',
    data: '14/10/2026',
    turno: '1º TURNO',
    linhaId: 'L3',
    postoOuArea: 'Final L3 (PDT 122)',
    tipo: 'PRIMEIROS_SOCORROS',
    descricao: 'Pequeno arranhão superficial na luva ao manipular presilha afiada',
    acaoImediata: 'Atendimento ambulatorial simples e substituição do lote de luvas PU nível 5',
    responsavelAcao: 'ENFERMARIA / SUPERVISOR',
    status: 'CONCLUIDO',
    gravidade: 'BAIXA'
  }
];

export const INITIAL_INSPECOES_EPI: InspecaoEpiRecord[] = [
  {
    id: 'EPI-01',
    data: '14/10/2026',
    auditorNome: 'AVELINO DA SILVA',
    postoTrabalho: 'OP 87 - L3',
    operadorNome: 'CARLOS ALBERTO',
    oculosSeguranca: true,
    luvasApropriadas: true,
    calcadoSegurancaBiqueira: true,
    protetorAuricular: true,
    vestimentaConforme: true,
    statusFinal: 'CONFORME'
  },
  {
    id: 'EPI-02',
    data: '14/10/2026',
    auditorNome: 'MARCOS VINICIUS',
    postoTrabalho: 'OP 14 - L3',
    operadorNome: 'LUCAS PEREIRA',
    oculosSeguranca: true,
    luvasApropriadas: true,
    calcadoSegurancaBiqueira: true,
    protetorAuricular: true,
    vestimentaConforme: true,
    statusFinal: 'CONFORME'
  }
];

// ============================================================================
// DADOS DO SIS (STELLANTIS INDUSTRIAL SYSTEM) & WO (WORKPLACE ORGANIZATION)
// ============================================================================
export const INITIAL_SIS_PADROES: PadraoProcedimentoSis[] = [
  {
    id: 'SIS-01',
    codigo: 'SOS-L3-087',
    tipo: 'SOS',
    titulo: 'Montagem e Conexão do Terminal Primário no Chassi',
    linhaId: 'L3',
    trechoOuPosto: 'Chassi L3 - PDT 87',
    revisao: 'Rev. 04',
    dataAprovacao: '01/09/2026',
    responsavelEngenharia: 'ENG. FABIO CARDOSO',
    descricao: 'Procedimento operacional padronizado detalhando o passo a passo de inserção com duplo clique e fixação de chicotes de alta tensão.',
    passosCriticos: [
      '1. Retirar capa de proteção contra poeira e verificar integridade do selo',
      '2. Inserir conector macho no receptáculo fêmea até ouvir o duplo estalo',
      '3. Baixar a alavanca vermelha de trava de segurança (CPA)',
      '4. Aplicar parafuso de aterramento com parafusadeira eletrônica calibrada a 9.5 Nm'
    ],
    tempoPadraoSegundos: 48,
    itensQualidadeCriticos: ['Presença do selo de vedação', 'Confirmação do clique auditivo', 'Sem tensão no cabo'],
    itensSegurancaObrigatorios: ['Luvas de proteção dielétrica 1000V', 'Óculos de proteção com vedação lateral'],
    ativo: true
  },
  {
    id: 'SIS-02',
    codigo: 'JES-SWIVEL-02',
    tipo: 'JES',
    titulo: 'Instalação de Coxim Amortecedor Dianteiro',
    linhaId: 'L3',
    trechoOuPosto: 'Big Swivel - PDT 06',
    revisao: 'Rev. 02',
    dataAprovacao: '15/08/2026',
    responsavelEngenharia: 'ENG. CAMILA TEIXEIRA',
    descricao: 'Folha de instrução de elemento de trabalho para posicionamento do coxim com gabarito magnético.',
    passosCriticos: [
      '1. Posicionar gabarito magnético no rebaixo da longarina',
      '2. Encaixar o coxim com orientação da seta para a frente do veículo',
      '3. Iniciar rosca manual para evitar espanação',
      '4. Aplicar aperto final em estrela'
    ],
    tempoPadraoSegundos: 42,
    itensQualidadeCriticos: ['Orientação da seta gravada na borracha', 'Torque final registrado no sistema SCA'],
    itensSegurancaObrigatorios: ['Luvas antivibração', 'Calçado de biqueira de composite'],
    ativo: true
  },
  {
    id: 'SIS-03',
    codigo: 'OPL-QUAL-18',
    tipo: 'OPL',
    titulo: 'Lição Ponto a Ponto: Identificação Visual de Conector Falsamente Travado',
    linhaId: 'L3',
    trechoOuPosto: 'Trim e Chassi L3',
    revisao: 'Rev. 01',
    dataAprovacao: '10/10/2026',
    responsavelEngenharia: 'QUALIDADE PROCESSO',
    descricao: 'OPL rápida para treinamento de bancada mostrando a diferença entre trava CPA engatada e semi-engatada.',
    passosCriticos: [
      'Visualizar a faixa amarela: se a faixa estiver visível, a trava NÃO desceu completamente',
      'Puxar levemente o chicote para trás para garantir retenção mecânica'
    ],
    itensQualidadeCriticos: ['Faixa amarela completamente oculta'],
    itensSegurancaObrigatorios: ['Manuseio ergonômico com pinça suave'],
    ativo: true
  }
];

// Workplace Organization (WO) - 5 Pilares Fundamentais
export const INITIAL_WO_PADROES: WoPadraoFundamentalItem[] = [
  {
    id: 'WO-01',
    pilar: '1S_DESCARTE',
    titulo: '1S - Descarte & Triagem (Red Tag / Ponto Vermelho)',
    descricao: 'Separar o que é estritamente necessário do desnecessário no posto de trabalho. Aplicação sistemática de etiquetas vermelhas.',
    areaAplicacao: 'Todos os postos de trabalho L1 e L3',
    criterioAvaliacao: 'Nenhum item obsoleto, danificado ou sem uso presente no posto de trabalho por mais de 48h.',
    pontuacaoMaxima: 20,
    pontuacaoAtual: 19,
    frequenciaAuditoria: 'SEMANAL'
  },
  {
    id: 'WO-02',
    pilar: '2S_ORDEM',
    titulo: '2S - Ordem & Organização (Um lugar para cada coisa)',
    descricao: 'Disposição lógica das ferramentas, peças e cabos conforme o fluxo de trabalho (Golden Zone).',
    areaAplicacao: 'Bancadas de preparação, suportes de parafusadeiras e caixas JIS',
    criterioAvaliacao: 'Ferramentas com demarcação de sombra, identificação de código e raio de alcance ergonômico.',
    pontuacaoMaxima: 20,
    pontuacaoAtual: 18,
    frequenciaAuditoria: 'SEMANAL'
  },
  {
    id: 'WO-03',
    pilar: '3S_LIMPEZA',
    titulo: '3S - Limpeza & Inspeção',
    descricao: 'Limpar inspecionando. Descobrir e eliminar fontes de sujeira, vazamentos e aparas metálicas.',
    areaAplicacao: 'Piso fabril, esteiras de roletes e manipuladores pneumáticos',
    criterioAvaliacao: 'Matriz de limpeza cumprida no início e fim de cada turno sem resíduos ou graxa acumulada.',
    pontuacaoMaxima: 20,
    pontuacaoAtual: 20,
    frequenciaAuditoria: 'DIARIA'
  },
  {
    id: 'WO-04',
    pilar: '4S_PADRONIZACAO',
    titulo: '4S - Padronização & Gestão Visual',
    descricao: 'Estabelecer padrões visuais claros (cores Stellantis, faixas zebradas, cartões de identificação).',
    areaAplicacao: 'Demarcações de piso, painéis de ferramentas e armários de EPIs',
    criterioAvaliacao: 'Todos os pontos de estocagem possuem código de identificação padronizado e limites min/max.',
    pontuacaoMaxima: 20,
    pontuacaoAtual: 19,
    frequenciaAuditoria: 'MENSAL'
  },
  {
    id: 'WO-05',
    pilar: '5S_AUTODISCIPLINA',
    titulo: '5S - Autodisciplina & Melhoria Contínua',
    descricao: 'Comprometimento diário dos operadores e líderes com as rotinas e respeito irrestrito aos padrões estabelecidos.',
    areaAplicacao: 'Comportamento operacional em todas as linhas',
    criterioAvaliacao: 'Auditorias SWA e 5S realizadas no cronograma com participação ativa de toda a equipe.',
    pontuacaoMaxima: 20,
    pontuacaoAtual: 19,
    frequenciaAuditoria: 'MENSAL'
  }
];

export const INITIAL_WO_PONTOS_VERMELHOS: WoPontoVermelhoRecord[] = [
  {
    id: 'PV-01',
    tagNumero: 'TAG-RED-0042',
    dataIdentificacao: '13/10/2026',
    identificadoPor: 'AVELINO DA SILVA',
    localizacao: 'L3 - Trim PDT 34',
    itemDescricao: 'Suporte de fixador modelo anterior (projeto antigo descontinuado)',
    motivoDescarte: 'OBSOLETO',
    destinoProposto: 'ALMOXARIFADO',
    prazoResolucao: '16/10/2026',
    status: 'PENDENTE'
  },
  {
    id: 'PV-02',
    tagNumero: 'TAG-RED-0043',
    dataIdentificacao: '11/10/2026',
    identificadoPor: 'MARCOS LIMA',
    localizacao: 'L3 - Chassi PDT 78',
    itemDescricao: 'Cabo auxiliar com isolamento desgastado',
    motivoDescarte: 'QUEBRADO',
    destinoProposto: 'SUCATA',
    prazoResolucao: '12/10/2026',
    status: 'DESCARTADO'
  }
];
