import React, { useState, useRef, useEffect, useMemo, MouseEvent, WheelEvent, ChangeEvent } from 'react';
import { 
  MapaPdtRecord, 
  PdtStatus, 
  LinhaCodigo, 
  AcumuloLinhaRecord, 
  TotemRecord, 
  DominioRecord, 
  TrechoRecord, 
  UteRecord,
  ColaboradorRecord
} from '../types/mapa';
import { 
  generateInitialPdts, 
  INITIAL_UTES, 
  INITIAL_TRECHOS, 
  INITIAL_DOMINIOS, 
  INITIAL_TOTENS, 
  INITIAL_ACUMULOS, 
  INITIAL_COLABORADORES,
  BIG_SWIVEL_POSITIONS,
  createDefaultTotemData 
} from '../data/mapaInitialData';

interface MapaLinhaSvgViewProps {
  currentRole?: string;
  initialModoEdicao?: boolean;
  onToggleCardsView?: () => void;
  onNavigateToMasterEditor?: () => void;
  globalSearchQuery?: string;
}

// Definição dos 9 trechos oficiais conforme tabela da imagem
interface TrechoOficialInfo {
  id: string;
  nome: string;
  pdtFaixa: string;
  totalTotens: number;
  posicaoTotens: string;
  corHex: string;
  corTexto: string;
  borderHex: string;
}

const TRECHOS_OFICIAIS: TrechoOficialInfo[] = [
  { id: 'TRECHO-L3-PLANCIA', nome: 'PLÂNCIA', pdtFaixa: '1 AO 25', totalTotens: 2, posicaoTotens: '1 ; 12', corHex: '#facc15', corTexto: '#000000', borderHex: '#ca8a04' },
  { id: 'TRECHO-L3-BIG-SWIVEL', nome: 'BIG SWIVEL', pdtFaixa: '1 AO 12', totalTotens: 2, posicaoTotens: '1 ; 6', corHex: '#22c55e', corTexto: '#ffffff', borderHex: '#16a34a' },
  { id: 'TRECHO-L3-SWIVEL', nome: 'SWIVEL', pdtFaixa: '13 AO 26', totalTotens: 2, posicaoTotens: '13 ; 20', corHex: '#f97316', corTexto: '#ffffff', borderHex: '#ea580c' },
  { id: 'TRECHO-L3-TRIM', nome: 'TRIM', pdtFaixa: '27 AO 50', totalTotens: 4, posicaoTotens: '27 ; 32 ; 37 ; 42', corHex: '#2563eb', corTexto: '#ffffff', borderHex: '#1d4ed8' },
  { id: 'TRECHO-L3-CHASSI', nome: 'CHASSI', pdtFaixa: '51 AO 93', totalTotens: 2, posicaoTotens: '51 ; 65', corHex: '#ef4444', corTexto: '#ffffff', borderHex: '#dc2626' },
  { id: 'TRECHO-L3-BIG-CHASSI', nome: 'BIG CHASSI', pdtFaixa: '94 AO 108', totalTotens: 2, posicaoTotens: '95 ; 102', corHex: '#06b6d4', corTexto: '#ffffff', borderHex: '#0891b2' },
  { id: 'TRECHO-L3-FINAL', nome: 'FINAL', pdtFaixa: '109 AO 150', totalTotens: 4, posicaoTotens: '109 ; 120 ; 130 ; 140', corHex: '#d946ef', corTexto: '#ffffff', borderHex: '#a21caf' },
  { id: 'TRECHO-L3-DOORS', nome: 'DOORS', pdtFaixa: '1 AO 17', totalTotens: 2, posicaoTotens: '1 ; 7', corHex: '#15803d', corTexto: '#ffffff', borderHex: '#166534' },
  { id: 'TRECHO-L3-BIG-DOORS', nome: 'BIG DOORS', pdtFaixa: '18 AO 22', totalTotens: 1, posicaoTotens: '18', corHex: '#38bdf8', corTexto: '#ffffff', borderHex: '#0284c7' },
];

export function MapaLinhaSvgView({
  currentRole = 'TEAM_LEADER',
  initialModoEdicao = false,
  onToggleCardsView,
  onNavigateToMasterEditor,
  globalSearchQuery = ''
}: MapaLinhaSvgViewProps) {
  // Versão do schema de dados para garantir o alinhamento com a imagem de Betim
  const STORAGE_VERSION = 'v_betim_oficial_2026_2';

  const [pdts, setPdts] = useState<MapaPdtRecord[]>(() => {
    try {
      const v = localStorage.getItem('stellantis_mapa_versao');
      if (v === STORAGE_VERSION) {
        const saved = localStorage.getItem('stellantis_mapa_pdts_oficial');
        if (saved) return JSON.parse(saved);
      } else {
        localStorage.setItem('stellantis_mapa_versao', STORAGE_VERSION);
      }
    } catch {
      // fallback
    }
    return generateInitialPdts();
  });

  const [utes, setUtes] = useState<UteRecord[]>(() => {
    try {
      const saved = localStorage.getItem('stellantis_utes_master');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_UTES;
  });

  const [trechos, setTrechos] = useState<TrechoRecord[]>(() => {
    try {
      const saved = localStorage.getItem('stellantis_trechos_master');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TRECHOS;
  });

  const [dominios, setDominios] = useState<DominioRecord[]>(() => {
    try {
      const saved = localStorage.getItem('stellantis_dominios_master');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DOMINIOS;
  });

  const [totens, setTotens] = useState<TotemRecord[]>(() => {
    try {
      const saved = localStorage.getItem('stellantis_totens_master');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TOTENS;
  });

  const [acumulos, setAcumulos] = useState<AcumuloLinhaRecord[]>(() => {
    try {
      const saved = localStorage.getItem('stellantis_acumulos_master');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ACUMULOS;
  });

  const [colaboradores, setColaboradores] = useState<ColaboradorRecord[]>(() => {
    try {
      const saved = localStorage.getItem('stellantis_colaboradores_master');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COLABORADORES;
  });

  // Filtros de visualização e Modos de Operação
  const [selectedLinha, setSelectedLinha] = useState<LinhaCodigo>('L3');
  const [buscaTerm, setBuscaTerm] = useState(globalSearchQuery);
  const [modoEdicao, setModoEdicao] = useState(initialModoEdicao);
  const [mostrarTotens, setMostrarTotens] = useState(true);
  const [trechosVisiveis, setTrechosVisiveis] = useState<string[]>(() => TRECHOS_OFICIAIS.map(trecho => trecho.id));

  // Orientação da Visualização (Anti-horário ativado por padrão para layout paisagem)
  const [isRotatedAntiHorario, setIsRotatedAntiHorario] = useState(true);
  const [modalLegendaOpen, setModalLegendaOpen] = useState(false);

  // Elementos sendo arrastados no Modo Edição
  const [draggingPdtId, setDraggingPdtId] = useState<string | null>(null);
  const [draggingTotemId, setDraggingTotemId] = useState<string | null>(null);
  const [draggingAcumuloId, setDraggingAcumuloId] = useState<string | null>(null);

  // Modais de Inspeção e Edição
  const [selectedPdt, setSelectedPdt] = useState<MapaPdtRecord | null>(null);
  const [editingPdt, setEditingPdt] = useState<MapaPdtRecord | null>(null);
  const [selectedTotem, setSelectedTotem] = useState<TotemRecord | null>(null);
  const [editingTotem, setEditingTotem] = useState<TotemRecord | null>(null);
  const [selectedAcumulo, setSelectedAcumulo] = useState<AcumuloLinhaRecord | null>(null);
  const [editingAcumulo, setEditingAcumulo] = useState<AcumuloLinhaRecord | null>(null);
  const [hoveredPdt, setHoveredPdt] = useState<MapaPdtRecord | null>(null);

  // Modais de Criação e Gestão
  const [modalNovoPdtOpen, setModalNovoPdtOpen] = useState(false);
  const [modalNovoAcumuloOpen, setModalNovoAcumuloOpen] = useState(false);
  const [modalNovoTotemOpen, setModalNovoTotemOpen] = useState(false);
  const [modalTrechosOpen, setModalTrechosOpen] = useState(false);
  const [editingTrecho, setEditingTrecho] = useState<TrechoRecord | null>(null);
  const [modalGestaoColaboradoresOpen, setModalGestaoColaboradoresOpen] = useState(false);
  const [modalNovoColaboradorOpen, setModalNovoColaboradorOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<ColaboradorRecord | null>(null);
  const [filtroDominioColab, setFiltroDominioColab] = useState<string>('TODOS');

  // Formulário de Novo PDT
  const [formNovoPdt, setFormNovoPdt] = useState<{
    linha: LinhaCodigo;
    uteId: string;
    trechoId: string;
    dominioId: string;
    numero: number;
    codigo: string;
    nome: string;
    status: PdtStatus;
    tempoCicloReferencia: number;
    operadorAtual: string;
    operadorMatricula: string;
    turno: string;
    teamLeaderNome: string;
    teamLeaderMatricula: string;
    x: number;
    y: number;
  }>({
    linha: 'L3',
    uteId: 'UTE-L3-COMP',
    trechoId: 'TRECHO-L3-PLANCIA',
    dominioId: 'DOM-L3-PLAN-01',
    numero: 1,
    codigo: 'OP 151',
    nome: 'Novo Posto de Montagem',
    status: 'ATIVO',
    tempoCicloReferencia: 48,
    operadorAtual: '',
    operadorMatricula: '',
    turno: '1º TURNO',
    teamLeaderNome: 'AVELINO DA SILVA',
    teamLeaderMatricula: 'ST12098',
    x: 480,
    y: 350
  });

  // Formulário de Novo Acúmulo
  const [formNovoAcumulo, setFormNovoAcumulo] = useState<Omit<AcumuloLinhaRecord, 'id'>>({
    codigo: 'AC-NOVO',
    nome: 'Novo Acúmulo Pulmão da Linha',
    linhaId: 'L3',
    trechoOrigem: 'Linha',
    trechoDestino: 'Buffer',
    capacidadeMaxCarros: 5,
    ocupacaoAtualCarros: 2,
    x: 350,
    y: 300,
    w: 40,
    h: 20,
    cor: '#2563eb',
    status: 'NORMAL',
    observacao: 'Espaço colorido de acúmulo da linha (sem numeração)'
  });

  // Formulário de Novo Totem & Domínio (1 Totem por Domínio)
  const [formNovoTotem, setFormNovoTotem] = useState<{
    codigo: string;
    nome: string;
    linhaId: LinhaCodigo;
    trechoId: string;
    uteId: string;
    teamLeaderNome: string;
    teamLeaderMatricula: string;
    ipAddress: string;
    x: number;
    y: number;
  }>({
    codigo: 'TT-NOVO',
    nome: 'Novo Totem Digital',
    linhaId: 'L3',
    trechoId: 'TRECHO-L3-TRIM',
    uteId: 'UTE-L3-CHASSI',
    teamLeaderNome: 'NOVO TEAM LEADER',
    teamLeaderMatricula: 'ST99099',
    ipAddress: '10.22.40.50',
    x: 350,
    y: 250
  });

  // Formulário de Novo Colaborador
  const [formNovoColab, setFormNovoColab] = useState<Omit<ColaboradorRecord, 'id'>>({
    matricula: 'ST' + Math.floor(10000 + Math.random() * 90000),
    nome: '',
    dominioId: 'DOM-L3-PLAN-01',
    pdtId: '',
    pdtCodigo: '',
    linhaId: 'L3',
    turno: '1º TURNO',
    funcao: 'Operador de Montagem',
    status: 'PRESENTE',
    nivelILUO: 2,
    dataAdmissao: new Date().toLocaleDateString('pt-BR')
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Sincroniza busca externa
  useEffect(() => {
    if (globalSearchQuery !== undefined) {
      setBuscaTerm(globalSearchQuery);
    }
  }, [globalSearchQuery]);

  // Salvar no LocalStorage com persistência total
  useEffect(() => {
    try {
      localStorage.setItem('stellantis_mapa_pdts_oficial', JSON.stringify(pdts));
      localStorage.setItem('stellantis_acumulos_master', JSON.stringify(acumulos));
      localStorage.setItem('stellantis_dominios_master', JSON.stringify(dominios));
      localStorage.setItem('stellantis_totens_master', JSON.stringify(totens));
      localStorage.setItem('stellantis_trechos_master', JSON.stringify(trechos));
      localStorage.setItem('stellantis_colaboradores_master', JSON.stringify(colaboradores));
    } catch (e) {
      console.warn('Erro ao salvar dados no LocalStorage:', e);
    }
  }, [pdts, acumulos, dominios, totens, trechos, colaboradores]);

  // Dimensões do viewBox conforme a orientação
  const SVG_VB_WIDTH = isRotatedAntiHorario ? 780 : 680;
  const SVG_VB_HEIGHT = isRotatedAntiHorario ? 300 : 820;

  // Função para converter coordenadas de tela para viewBox SVG
  const getSvgCoordinates = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(((clientX - rect.left) / rect.width) * SVG_VB_WIDTH);
    const y = Math.round(((clientY - rect.top) / rect.height) * SVG_VB_HEIGHT);
    return { x: Math.max(0, Math.min(SVG_VB_WIDTH, x)), y: Math.max(0, Math.min(SVG_VB_HEIGHT, y)) };
  };

  // Transforma coordenadas conforme a rotação (anti-horário por padrão para layout paisagem)
  const getTransformedCoords = (origX: number, origY: number, w: number = 15.5, h: number = 15.5) => {
    if (!isRotatedAntiHorario) {
      return { x: origX, y: origY, w, h };
    }
    // Rotação anti-horária de 90°:
    // x_novo = origY - 35
    // y_novo = 545 - origX - w
    return {
      x: origY - 35,
      y: 545 - origX - w,
      w: h,
      h: w
    };
  };

  const getTransformedTotemCoords = (origX: number, origY: number) => {
    if (!isRotatedAntiHorario) {
      return { x: origX, y: origY };
    }
    return {
      x: origY - 35,
      y: 545 - origX
    };
  };

  // Handlers de Drag & Drop de Elementos no Modo Edição
  const handleMouseMove = (e: MouseEvent) => {
    if (modoEdicao && svgRef.current) {
      const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
      if (draggingPdtId) {
        if (isRotatedAntiHorario) {
          const rawY = x + 35;
          const rawX = 545 - y - 15.5;
          setPdts(prev => prev.map(p => p.id === draggingPdtId ? { ...p, x: Math.round(rawX), y: Math.round(rawY) } : p));
        } else {
          setPdts(prev => prev.map(p => p.id === draggingPdtId ? { ...p, x: x - 7.75, y: y - 7.75 } : p));
        }
        return;
      }
      if (draggingTotemId) {
        if (isRotatedAntiHorario) {
          const rawY = x + 35;
          const rawX = 545 - y;
          setTotens(prev => prev.map(t => t.id === draggingTotemId ? { ...t, x: Math.round(rawX), y: Math.round(rawY) } : t));
        } else {
          setTotens(prev => prev.map(t => t.id === draggingTotemId ? { ...t, x, y } : t));
        }
        return;
      }
      if (draggingAcumuloId) {
        const ac = acumulos.find(a => a.id === draggingAcumuloId);
        if (ac) {
          if (isRotatedAntiHorario) {
            const rawY = x + 35;
            const rawX = 545 - y - ac.w;
            setAcumulos(prev => prev.map(a => a.id === draggingAcumuloId ? { ...a, x: Math.round(rawX), y: Math.round(rawY) } : a));
          } else {
            setAcumulos(prev => prev.map(a => a.id === draggingAcumuloId ? { ...a, x: x - a.w / 2, y: y - a.h / 2 } : a));
          }
        }
        return;
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingPdtId(null);
    setDraggingTotemId(null);
    setDraggingAcumuloId(null);
  };

  const printDocument = () => {
    window.print();
  };

  // Restaurar layout original padrão oficial (Betim)
  const handleResetarLayoutPadrao = () => {
    if (window.confirm('Tem certeza que deseja restaurar o layout e as posições oficiais originais da Linha 3 (Betim)?')) {
      const padraoPdts = generateInitialPdts();
      setPdts(padraoPdts);
      setAcumulos(INITIAL_ACUMULOS);
      setDominios(INITIAL_DOMINIOS);
      setTotens(INITIAL_TOTENS);
      setTrechos(INITIAL_TRECHOS);
      setColaboradores(INITIAL_COLABORADORES);
      localStorage.setItem('stellantis_mapa_pdts_oficial', JSON.stringify(padraoPdts));
      localStorage.setItem('stellantis_acumulos_master', JSON.stringify(INITIAL_ACUMULOS));
      localStorage.setItem('stellantis_dominios_master', JSON.stringify(INITIAL_DOMINIOS));
      localStorage.setItem('stellantis_totens_master', JSON.stringify(INITIAL_TOTENS));
      localStorage.setItem('stellantis_trechos_master', JSON.stringify(INITIAL_TRECHOS));
      localStorage.setItem('stellantis_colaboradores_master', JSON.stringify(INITIAL_COLABORADORES));
    }
  };

  // Exportar Backup JSON
  const handleExportarJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      pdts,
      acumulos,
      dominios,
      totens,
      trechos,
      colaboradores,
      exportadoEm: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mapa_linha3_stellantis_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar Backup JSON
  const handleImportarJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.pdts)) {
          setPdts(parsed.pdts);
          if (Array.isArray(parsed.acumulos)) setAcumulos(parsed.acumulos);
          if (Array.isArray(parsed.dominios)) setDominios(parsed.dominios);
          if (Array.isArray(parsed.totens)) setTotens(parsed.totens);
          if (Array.isArray(parsed.trechos)) setTrechos(parsed.trechos);
          if (Array.isArray(parsed.colaboradores)) setColaboradores(parsed.colaboradores);
          alert('Mapa, totens, acúmulos e colaboradores importados com sucesso!');
        } else if (Array.isArray(parsed)) {
          setPdts(parsed);
          alert('PDTs do mapa importados com sucesso!');
        }
      } catch (err) {
        alert('Erro ao processar arquivo JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  // Identificação rápida das células de PDT
  const pdtMap = useMemo(() => {
    const map = new Map<string, MapaPdtRecord>();
    pdts.forEach(p => {
      if (p.linha === 'L3') {
        if (p.trechoTipo === 'PLANCIA') map.set(`PLAN-${p.numero}`, p);
        else if (p.trechoTipo === 'DOORS') map.set(`DOOR-${p.numero}`, p);
        else map.set(`SEQ-${p.numero}`, p);
      }
    });
    return map;
  }, [pdts]);

  const isTrechoVisivel = (trechoId?: string) => {
    if (selectedLinha !== 'L3' || !trechoId) return true;
    return trechosVisiveis.includes(trechoId);
  };

  const getTrechoIdFromTotem = (totemId: string) => {
    if (totemId.includes('PLAN')) return 'TRECHO-L3-PLANCIA';
    if (totemId.includes('BDOR')) return 'TRECHO-L3-BIG-DOORS';
    if (totemId.includes('DOR')) return 'TRECHO-L3-DOORS';
    if (totemId.includes('BSW')) return 'TRECHO-L3-BIG-SWIVEL';
    if (totemId.includes('SWV')) return 'TRECHO-L3-SWIVEL';
    if (totemId.includes('TRM')) return 'TRECHO-L3-TRIM';
    if (totemId.includes('CHS')) return 'TRECHO-L3-CHASSI';
    if (totemId.includes('BCH')) return 'TRECHO-L3-BIG-CHASSI';
    if (totemId.includes('FIN')) return 'TRECHO-L3-FINAL';
    return undefined;
  };

  const toggleTrechoVisibilidade = (trechoId: string) => {
    setTrechosVisiveis(prev => prev.includes(trechoId)
      ? prev.filter(id => id !== trechoId)
      : [...prev, trechoId]);
  };

  const handleMapClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!modoEdicao || draggingPdtId || draggingTotemId) return;
    const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
    const rawPosition = isRotatedAntiHorario
      ? { x: Math.max(0, Math.round(545 - y - 15.5)), y: Math.max(0, Math.round(x + 35)) }
      : { x: Math.max(0, Math.round(x - 7.75)), y: Math.max(0, Math.round(y - 7.75)) };
    setFormNovoPdt(prev => ({ ...prev, x: rawPosition.x, y: rawPosition.y }));
    setModalNovoPdtOpen(true);
  };

  // Salvar Edição do PDT (Atende à regra: 1 Totem por Domínio, Domínio gere Colaboradores)
  const handleSavePdtEdit = (updatedPdt: MapaPdtRecord) => {
    const dom = dominios.find(d => d.id === updatedPdt.dominioId);
    const totemIdFinal = dom ? dom.totemId : updatedPdt.totemId;

    const finalPdt: MapaPdtRecord = {
      ...updatedPdt,
      totemId: totemIdFinal,
      teamLeaderNome: dom?.teamLeaderNome || updatedPdt.teamLeaderNome,
      teamLeaderMatricula: dom?.teamLeaderMatricula || updatedPdt.teamLeaderMatricula
    };

    setPdts(prev => prev.map(p => p.id === finalPdt.id ? finalPdt : p));

    // Se um operador foi alocado, sincroniza o cadastro do colaborador
    if (finalPdt.operadorAtual && finalPdt.dominioId) {
      setColaboradores(prev => {
        const existe = prev.find(c => c.nome.toLowerCase() === finalPdt.operadorAtual?.toLowerCase());
        if (existe) {
          return prev.map(c => c.id === existe.id ? { ...c, pdtId: finalPdt.id, pdtCodigo: finalPdt.codigo, dominioId: finalPdt.dominioId! } : c);
        }
        return prev;
      });
    }

    setEditingPdt(null);
  };

  // Excluir PDT
  const handleDeletePdt = (pdtId: string) => {
    if (window.confirm('Confirma a remoção deste PDT da linha de produção?')) {
      setPdts(prev => prev.filter(p => p.id !== pdtId));
      setEditingPdt(null);
    }
  };

  // Salvar Novo PDT
  const handleSaveNovoPdt = () => {
    const dom = dominios.find(d => d.id === formNovoPdt.dominioId);
    const trecho = trechos.find(t => t.id === formNovoPdt.trechoId);
    const totemId = dom?.totemId || 'TOTEM-L3-BSW-01';

    const novo: MapaPdtRecord = {
      id: `${formNovoPdt.linha}-NEW-${Date.now().toString().slice(-4)}`,
      codigo: formNovoPdt.codigo,
      numero: formNovoPdt.numero,
      nome: formNovoPdt.nome,
      linha: formNovoPdt.linha,
      uteId: formNovoPdt.uteId,
      trechoId: formNovoPdt.trechoId,
      dominioId: formNovoPdt.dominioId,
      totemId: totemId,
      isTrechoIndependente: trecho?.isIndependente || false,
      trechoTipo: trecho?.tipo || 'PRINCIPAL',
      x: formNovoPdt.x,
      y: formNovoPdt.y,
      status: formNovoPdt.status,
      teamLeaderMatricula: dom?.teamLeaderMatricula || formNovoPdt.teamLeaderMatricula,
      teamLeaderNome: dom?.teamLeaderNome || formNovoPdt.teamLeaderNome,
      lider: dom?.liderNome || 'LÍDER MARCELO',
      shift: formNovoPdt.turno,
      area: trecho?.nome || 'Posto Adicional',
      tempoCicloReferencia: formNovoPdt.tempoCicloReferencia,
      operadorAtual: formNovoPdt.operadorAtual,
      totemData: createDefaultTotemData(formNovoPdt.codigo, formNovoPdt.linha, formNovoPdt.numero)
    };

    setPdts(prev => [...prev, novo]);
    setModalNovoPdtOpen(false);
  };

  // Salvar Novo Acúmulo
  const handleSaveNovoAcumulo = () => {
    const novoAcumulo: AcumuloLinhaRecord = {
      id: `AC-${formNovoAcumulo.linhaId}-${Date.now().toString().slice(-4)}`,
      ...formNovoAcumulo
    };
    setAcumulos(prev => [...prev, novoAcumulo]);
    setModalNovoAcumuloOpen(false);
  };

  // Salvar Edição de Acúmulo
  const handleSaveAcumuloEdit = (ac: AcumuloLinhaRecord) => {
    setAcumulos(prev => prev.map(item => item.id === ac.id ? ac : item));
    setEditingAcumulo(null);
  };

  // Excluir Acúmulo
  const handleDeleteAcumulo = (acumuloId: string) => {
    if (window.confirm('Confirma a remoção desta área de acúmulo da linha?')) {
      setAcumulos(prev => prev.filter(item => item.id !== acumuloId));
      setEditingAcumulo(null);
    }
  };

  // Salvar Novo Totem e Criar o Domínio Correspondente (1:1 rigoroso)
  const handleSaveNovoTotem = () => {
    const totemId = `TOTEM-${formNovoTotem.linhaId}-${Date.now().toString().slice(-4)}`;
    const dominioId = `DOM-${formNovoTotem.linhaId}-${Date.now().toString().slice(-4)}`;

    const novoDominio: DominioRecord = {
      id: dominioId,
      codigo: `DOM-${formNovoTotem.codigo.replace('TT-', '')}`,
      nome: `Domínio ${formNovoTotem.nome}`,
      trechoId: formNovoTotem.trechoId,
      uteId: formNovoTotem.uteId,
      linhaId: formNovoTotem.linhaId,
      teamLeaderNome: formNovoTotem.teamLeaderNome,
      teamLeaderMatricula: formNovoTotem.teamLeaderMatricula,
      liderNome: 'LÍDER GERAL',
      shift: '1º TURNO',
      totemId: totemId,
      pdtsIds: [],
      descricao: `Domínio gerado com Totem ${formNovoTotem.codigo}`
    };

    const novoTotem: TotemRecord = {
      id: totemId,
      codigo: formNovoTotem.codigo,
      nome: formNovoTotem.nome,
      dominioId: dominioId,
      linhaId: formNovoTotem.linhaId,
      status: 'ONLINE',
      ipAddress: formNovoTotem.ipAddress,
      versaoApp: 'v2.8.4',
      ultimaSincronizacao: new Date().toLocaleString('pt-BR'),
      x: formNovoTotem.x,
      y: formNovoTotem.y
    };

    setDominios(prev => [...prev, novoDominio]);
    setTotens(prev => [...prev, novoTotem]);
    setModalNovoTotemOpen(false);
  };

  // Salvar Edição de Totem & Domínio
  const handleSaveTotemEdit = (updatedTotem: TotemRecord) => {
    setTotens(prev => prev.map(t => t.id === updatedTotem.id ? updatedTotem : t));
    setEditingTotem(null);
  };

  const handleDeleteTotem = (totemId: string) => {
    if (window.confirm('Confirma a remoção deste totem do mapa?')) {
      setTotens(prev => prev.filter(t => t.id !== totemId));
      setEditingTotem(null);
    }
  };

  // Salvar Edição de Trecho
  const handleSaveTrechoEdit = (updatedTrecho: TrechoRecord) => {
    setTrechos(prev => prev.map(t => t.id === updatedTrecho.id ? updatedTrecho : t));
    setEditingTrecho(null);
  };

  // Salvar Novo Colaborador (Regra do Rodapé: Gestão via Domínio)
  const handleSaveNovoColaborador = () => {
    const novo: ColaboradorRecord = {
      id: `COLAB-${Date.now().toString().slice(-5)}`,
      ...formNovoColab
    };

    setColaboradores(prev => [...prev, novo]);

    // Se foi alocado em um PDT, atualiza o operadorAtual no PDT
    if (novo.pdtId) {
      setPdts(prev => prev.map(p => p.id === novo.pdtId ? { ...p, operadorAtual: novo.nome } : p));
    }

    setModalNovoColaboradorOpen(false);
    setFormNovoColab({
      matricula: 'ST' + Math.floor(10000 + Math.random() * 90000),
      nome: '',
      dominioId: 'DOM-L3-PLAN-01',
      pdtId: '',
      pdtCodigo: '',
      linhaId: 'L3',
      turno: '1º TURNO',
      funcao: 'Operador de Montagem',
      status: 'PRESENTE',
      nivelILUO: 2,
      dataAdmissao: new Date().toLocaleDateString('pt-BR')
    });
  };

  // Salvar Edição de Colaborador
  const handleSaveColaboradorEdit = (colab: ColaboradorRecord) => {
    setColaboradores(prev => prev.map(c => c.id === colab.id ? colab : c));
    if (colab.pdtId) {
      setPdts(prev => prev.map(p => p.id === colab.pdtId ? { ...p, operadorAtual: colab.nome } : p));
    }
    setEditingColaborador(null);
  };

  // Excluir Colaborador
  const handleDeleteColaborador = (colabId: string) => {
    if (window.confirm('Confirma a remoção deste colaborador do domínio?')) {
      const colab = colaboradores.find(c => c.id === colabId);
      if (colab && colab.pdtId) {
        setPdts(prev => prev.map(p => p.id === colab.pdtId ? { ...p, operadorAtual: '' } : p));
      }
      setColaboradores(prev => prev.filter(c => c.id !== colabId));
      setEditingColaborador(null);
    }
  };

  // --------------------------------------------------------------------------
  // Renderizadores SVG: PDTs, Totens e Acúmulos
  // --------------------------------------------------------------------------

  // Renderizar uma célula quadrada de PDT (Exatamente no estilo oficial da imagem)
  const renderPdtSquare = (
    key: string,
    numero: number,
    defaultX: number,
    defaultY: number,
    corBg: string,
    corTexto: string = '#ffffff',
    borderColor?: string
  ) => {
    const record = pdtMap.get(key);
    if (record && !isTrechoVisivel(record.trechoId)) return null;
    const rawX = record && record.x !== undefined ? record.x : defaultX;
    const rawY = record && record.y !== undefined ? record.y : defaultY;

    const { x: finalX, y: finalY } = getTransformedCoords(rawX, rawY, 15.5, 15.5);

    const isSelected = selectedPdt?.id === record?.id || editingPdt?.id === record?.id;
    const isHovered = hoveredPdt?.id === record?.id;
    const isDraggingThis = draggingPdtId === record?.id;
    const matchBusca = buscaTerm.trim() && (
      String(numero) === buscaTerm.trim() ||
      record?.codigo.toLowerCase().includes(buscaTerm.toLowerCase()) ||
      record?.operadorAtual?.toLowerCase().includes(buscaTerm.toLowerCase())
    );

    return (
      <g
        key={key}
        className={`interactive-cell transition-all duration-150 ${
          modoEdicao ? 'cursor-move hover:opacity-90' : 'cursor-pointer hover:opacity-90'
        }`}
        onClick={e => {
          e.stopPropagation();
          if (!record) return;
          if (modoEdicao) {
            setEditingPdt(record);
          } else {
            setSelectedPdt(record);
          }
        }}
        onMouseDown={e => {
          if (modoEdicao && record) {
            e.stopPropagation();
            setDraggingPdtId(record.id);
          }
        }}
        onMouseEnter={() => record && setHoveredPdt(record)}
        onMouseLeave={() => setHoveredPdt(null)}
      >
        <rect
          x={finalX}
          y={finalY}
          width={15.5}
          height={15.5}
          rx={2}
          fill={record?.status === 'COM_PENDENCIA' ? '#f59e0b' : record?.status === 'CRITICO' ? '#b91c1c' : corBg}
          stroke={isSelected ? '#ffffff' : matchBusca ? '#fbbf24' : isDraggingThis ? '#38bdf8' : modoEdicao ? '#ffffff' : (borderColor || corBg)}
          strokeWidth={isSelected || matchBusca || isDraggingThis ? 2 : modoEdicao ? 1.2 : 0.8}
          strokeDasharray={modoEdicao ? '3 1.5' : undefined}
          className={`${isHovered ? 'filter brightness-125' : ''} ${matchBusca ? 'animate-pulse' : ''}`}
        />
        <text
          x={finalX + 7.75}
          y={finalY + 10.75}
          textAnchor="middle"
          fill={corTexto}
          fontSize={numero >= 100 ? 6.5 : 7.5}
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          className="select-none pointer-events-none"
        >
          {numero}
        </text>
        {modoEdicao && (
          <title>Clique para editar ou arraste (X: {Math.round(rawX)}, Y: {Math.round(rawY)})</title>
        )}
      </g>
    );
  };

  // Renderizar indicador de totem oficial (1 totem por domínio)
  const renderTotemMarker = (totemId: string, defaultX: number, defaultY: number, label: string) => {
    if (!mostrarTotens) return null;
    const t = totens.find(item => item.id === totemId);
    if (!isTrechoVisivel(getTrechoIdFromTotem(totemId))) return null;
    const rawX = t?.x ?? defaultX;
    const rawY = t?.y ?? defaultY;
    const coords = getTransformedTotemCoords(rawX, rawY);

    const isSelected = selectedTotem?.id === totemId || editingTotem?.id === totemId;
    const isDraggingThis = draggingTotemId === totemId;

    return (
      <g 
        key={`totem-${totemId}`}
        className={`interactive-cell group ${modoEdicao ? 'cursor-move' : 'cursor-pointer'}`}
        onClick={e => {
          e.stopPropagation();
          if (!t) return;
          if (modoEdicao) {
            setEditingTotem(t);
          } else {
            setSelectedTotem(t);
          }
        }}
        onMouseDown={e => {
          if (modoEdicao && t) {
            e.stopPropagation();
            setDraggingTotemId(t.id);
          }
        }}
      >
        <circle 
          cx={coords.x} 
          cy={coords.y} 
          r={modoEdicao ? 5.5 : 4.5} 
          fill="#0284c7" 
          stroke={isSelected ? '#facc15' : isDraggingThis ? '#38bdf8' : '#ffffff'} 
          strokeWidth={isSelected || isDraggingThis ? 1.8 : 1} 
          strokeDasharray={modoEdicao ? '2 2' : undefined}
          className="group-hover:scale-125 transition-transform" 
        />
        <circle cx={coords.x} cy={coords.y} r={2} fill="#38bdf8" />
        <title>{label}</title>
      </g>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#090d16] text-slate-100 font-sans select-none overflow-hidden print:bg-white print:text-black">
      {/* 1. Barra de Ferramentas Superior — Configurações e Ações */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${modoEdicao ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
            <span className="font-bold text-sm tracking-wide">
              {modoEdicao ? 'Editor de Mapa & Hierarquia (Layout Builder)' : 'Mapa de Produção Oficial (Betim)'}
            </span>
            <span className="text-xs text-sky-400 font-mono bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
              {isRotatedAntiHorario ? 'Anti-horário (Paisagem)' : 'Retrato'}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700"></div>

          {/* Seletor de Linha */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setSelectedLinha('L3')}
              className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                selectedLinha === 'L3' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Linha 3 (Oficial Betim)
            </button>
            <button
              onClick={() => setSelectedLinha('L1')}
              className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                selectedLinha === 'L1' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Linha 1
            </button>
          </div>
        </div>

        {/* Controles de Busca, Modos, Rotação e Edição (Sem Zoom Manual) */}
        <div className="flex items-center gap-2">
          {/* Campo de Busca Rápida por Posto */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar PDT ou Operador..."
              value={buscaTerm}
              onChange={e => setBuscaTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 px-2.5 py-1 rounded-lg text-white text-xs font-mono placeholder:text-slate-500 w-36 focus:outline-none focus:border-sky-500"
            />
            {buscaTerm && (
              <button onClick={() => setBuscaTerm('')} className="absolute right-2 top-1 text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            )}
          </div>

          {/* Alternador de Totens */}
          <button
            onClick={() => setMostrarTotens(!mostrarTotens)}
            className={`px-2 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
              mostrarTotens ? 'bg-sky-950/60 text-sky-300 border-sky-600' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Exibir/Ocultar Totens Digitais"
          >
            <i className="fa-solid fa-desktop text-[10px]"></i> Totens
          </button>

          {/* Botão Girar Anti-horário / Retrato */}
          <button
            onClick={() => setIsRotatedAntiHorario(!isRotatedAntiHorario)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              isRotatedAntiHorario
                ? 'bg-sky-950/80 text-sky-300 border-sky-600 shadow'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Alternar entre Rotação Anti-Horária (Paisagem) e Retrato"
          >
            <i className="fa-solid fa-rotate-left"></i>
            <span>{isRotatedAntiHorario ? 'Anti-horário' : 'Girar 90°'}</span>
          </button>

          {/* Gestão de Colaboradores por Domínio (Regra do Rodapé) */}
          <button
            onClick={() => setModalGestaoColaboradoresOpen(true)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white rounded-lg text-xs font-bold border border-slate-700 transition flex items-center gap-1 cursor-pointer shadow-xs"
            title="Regra do Rodapé: Domínios gerenciam PDTs e Colaboradores"
          >
            <i className="fa-solid fa-users-gear text-xs"></i>
            <span>Colaboradores</span>
          </button>

          {/* Botão de Ativação do Modo Edição */}
          <button
            onClick={() => setModoEdicao(!modoEdicao)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shadow ${
              modoEdicao
                ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
            }`}
            title="Alternar entre visualização operacional e modo de edição visual"
          >
            <i className="fa-solid fa-pen-ruler"></i>
            <span>{modoEdicao ? 'Edição Ativa' : 'Editar Mapa'}</span>
          </button>

          {/* Botão Imprimir */}
          <button
            onClick={printDocument}
            className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
          >
            <i className="fa-solid fa-print"></i>
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Ferramentas de Edição Rápida (Exibida quando Modo Edição está Ativo) */}
      {modoEdicao && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 text-amber-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-amber-300">
            <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
            <span><strong>Modo Edição Ativo:</strong> Arraste PDTs e Totens, clique para editar ou clique em uma área vazia para acrescentar um PDT.</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setModalNovoPdtOpen(true)}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold shadow flex items-center gap-1 cursor-pointer"
            >
              <i className="fa-solid fa-plus"></i> Novo PDT
            </button>

            <button
              onClick={() => setModalNovoTotemOpen(true)}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shadow flex items-center gap-1 cursor-pointer"
              title="Cadastrar novo Totem e Domínio (1 Totem por Domínio)"
            >
              <i className="fa-solid fa-desktop"></i> Novo Totem
            </button>

            <button
              onClick={() => setModalTrechosOpen(true)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
              title="Editar nomes, UTEs e faixas de PDT dos trechos"
            >
              <i className="fa-solid fa-route"></i> Trechos
            </button>

            <button
              onClick={handleExportarJson}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
              title="Exportar backup completo em JSON"
            >
              <i className="fa-solid fa-download"></i> Exportar
            </button>

            <label
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
              title="Importar layout de arquivo JSON"
            >
              <i className="fa-solid fa-upload"></i> Importar
              <input type="file" accept=".json" onChange={handleImportarJson} className="hidden" />
            </label>

            <button
              onClick={handleResetarLayoutPadrao}
              className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg border border-red-800 cursor-pointer"
              title="Restaurar layout e coordenadas originais de Betim"
            >
              <i className="fa-solid fa-rotate-left"></i> Restaurar Layout
            </button>
          </div>
        </div>
      )}

      {/* 3. Área Central: Fundo Preto Quadriculado Técnico Industrial */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 overflow-hidden flex flex-col items-center justify-center p-2 sm:p-3 bg-[#090d16] text-white sis-grid-bg relative select-none"
      >
        <div className="w-full h-full max-h-[calc(100vh-140px)] flex flex-col bg-[#070b13] border border-slate-800/90 rounded-2xl shadow-2xl p-2 sm:p-3 relative overflow-hidden">
          {/* Header do Board Técnico */}
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-800/80 px-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
              <h1 className="text-xs sm:text-sm font-bold text-slate-100 font-mono tracking-wider uppercase">
                Linha 3 Betim • {isRotatedAntiHorario ? 'Layout Paisagem (Anti-Horário)' : 'Layout Retrato Oficial'}
              </h1>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 hidden sm:inline">
                150 PDTs • 9 Trechos
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalLegendaOpen(true)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono font-bold border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                title="Visualizar tabela de trechos e totens"
              >
                <i className="fa-solid fa-list-check"></i>
                <span className="hidden sm:inline">Legenda</span>
              </button>

              {modoEdicao && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/50 flex items-center gap-1.5 font-bold animate-pulse">
                  <i className="fa-solid fa-pen-ruler"></i> MODO EDIÇÃO
                </span>
              )}
            </div>
          </div>

          {/* SVG Enquadrado com Grade Quadriculada Técnica Preta */}
          <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden">
            <svg
              ref={svgRef}
              viewBox={isRotatedAntiHorario ? "0 0 780 300" : "0 0 680 820"}
              className="w-full h-full max-h-[calc(100vh-210px)] object-contain select-none"
              preserveAspectRatio="xMidYMid meet"
              onClick={handleMapClick}
            >
              {/* Grade Técnica Industrial de Fundo (Checkered Black Pattern) */}
              <defs>
                <pattern id="sis-tech-grid-small" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#1e293b" strokeWidth="0.6" opacity="0.45" />
                </pattern>
                <pattern id="sis-tech-grid-large" width="80" height="80" patternUnits="userSpaceOnUse">
                  <rect width="80" height="80" fill="url(#sis-tech-grid-small)" />
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#334155" strokeWidth="1" opacity="0.65" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="#070b13" rx="10" stroke="#1e293b" strokeWidth="1" />
              <rect width="100%" height="100%" fill="url(#sis-tech-grid-large)" rx="10" />
            {/* ============================================================== */}
            {/* 1. PLÂNCIA (1 AO 25) — AMARELO, INVERTED U-SHAPE NO TOPO DIREITO */}
            {/* ============================================================== */}
            {/* Coluna direita subindo: 1 a 12 */}
            {Array.from({ length: 12 }, (_, i) => {
              const num = i + 1;
              const x = 520;
              const y = 250 - i * 16.5;
              return renderPdtSquare(`PLAN-${num}`, num, x, y, '#facc15', '#000000', '#ca8a04');
            })}
            
            {/* Topo conector: 13 */}
            {renderPdtSquare('PLAN-13', 13, 503.5, 68.5, '#facc15', '#000000', '#ca8a04')}

            {/* Coluna esquerda descendo: 14 a 25 */}
            {Array.from({ length: 12 }, (_, i) => {
              const num = i + 14;
              const x = 487;
              const y = 68.5 + (i + 1) * 16.5;
              return renderPdtSquare(`PLAN-${num}`, num, x, y, '#facc15', '#000000', '#ca8a04');
            })}

            {/* Totens da Plância (PDT 1 e PDT 12) */}
            {renderTotemMarker('TOTEM-L3-PLAN-01', 542, 258, 'Totem Plância 01 (PDT 1)')}
            {renderTotemMarker('TOTEM-L3-PLAN-12', 542, 76, 'Totem Plância 02 (PDT 12)')}

            {/* ============================================================== */}
            {/* 2. DOORS (1 AO 17) — VERDE ESCURO, COLUNA SUBINDO EM U        */}
            {/* ============================================================== */}
            {/* Coluna esquerda subindo: 1 a 17 */}
            {Array.from({ length: 17 }, (_, i) => {
              const num = i + 1;
              const x = 405;
              const y = 350 - i * 16.5;
              return renderPdtSquare(`DOOR-${num}`, num, x, y, '#15803d', '#ffffff', '#166534');
            })}

            {/* Totens de Doors (PDT 1 e PDT 7) */}
            {renderTotemMarker('TOTEM-L3-DOR-01', 397, 358, 'Totem Doors 01 (PDT 1)')}
            {renderTotemMarker('TOTEM-L3-DOR-07', 397, 259, 'Totem Doors 02 (PDT 7)')}

            {/* ============================================================== */}
            {/* 3. BIG DOORS (18 AO 22) — AZUL CLARO / CIANO DESCENDO        */}
            {/* ============================================================== */}
            {Array.from({ length: 5 }, (_, i) => {
              const num = 22 - i;
              const x = 452;
              const y = 117 + i * 16.5;
              return renderPdtSquare(`DOOR-${num}`, num, x, y, '#38bdf8', '#ffffff', '#0284c7');
            })}

            {/* Totem Big Doors (PDT 18) */}
            {renderTotemMarker('TOTEM-L3-BDOR-18', 474, 183, 'Totem Big Doors (PDT 18)')}

            {/* ============================================================== */}
            {/* 4. BIG SWIVEL (1 AO 12) — VERDE CLARO, TRÊS COLUNAS */}
            {/* ============================================================== */}
            {Array.from({ length: 12 }, (_, i) => {
              const numero = i + 1;
              const posicao = BIG_SWIVEL_POSITIONS[numero];
              return renderPdtSquare(
                `SEQ-${numero}`,
                numero,
                posicao.x,
                posicao.y,
                '#22c55e',
                '#ffffff',
                '#16a34a'
              );
            })}

            {/* Totens Big Swivel (PDT 1 e PDT 6) */}
            {renderTotemMarker('TOTEM-L3-BSW-01', 473, 385, 'Totem Big Swivel 01 (PDT 1)')}
            {renderTotemMarker('TOTEM-L3-BSW-06', 473, 401.5, 'Totem Big Swivel 02 (PDT 6)')}

            {/* ============================================================== */}
            {/* 5. SWIVEL (13 AO 26) — LARANJA, PISTA HORIZONTAL DUPLA       */}
            {/* ============================================================== */}
            {/* Linha superior: 13 ao 19 */}
            {Array.from({ length: 7 }, (_, i) => {
              const num = 13 + i;
              const x = 385 + i * 16.5;
              const y = 445;
              return renderPdtSquare(`SEQ-${num}`, num, x, y, '#f97316', '#ffffff', '#ea580c');
            })}

            {/* Linha inferior: 26 ao 20 */}
            {[26, 25, 24, 23, 22, 21, 20].map((num, i) => {
              const x = 385 + i * 16.5;
              const y = 461.5;
              return renderPdtSquare(`SEQ-${num}`, num, x, y, '#f97316', '#ffffff', '#ea580c');
            })}

            {/* Totens Swivel (PDT 13 e PDT 20) */}
            {renderTotemMarker('TOTEM-L3-SWV-13', 377, 445, 'Totem Swivel 01 (PDT 13)')}
            {renderTotemMarker('TOTEM-L3-SWV-20', 506, 461.5, 'Totem Swivel 02 (PDT 20)')}

            {/* ============================================================== */}
            {/* 6. TRIM (27 AO 50) — AZUL ROYAL, COLUNA VERTICAL SUBINDO      */}
            {/* ============================================================== */}
            {Array.from({ length: 24 }, (_, i) => {
              const num = 27 + i;
              const x = 368.5;
              const y = 461.5 - i * 16.5;
              return renderPdtSquare(`SEQ-${num}`, num, x, y, '#2563eb', '#ffffff', '#1d4ed8');
            })}

            {/* Totens Trim (PDT 27, 32, 37, 42) */}
            {renderTotemMarker('TOTEM-L3-TRM-27', 360, 461.5, 'Totem Trim 01 (PDT 27)')}
            {renderTotemMarker('TOTEM-L3-TRM-32', 360, 379, 'Totem Trim 02 (PDT 32)')}
            {renderTotemMarker('TOTEM-L3-TRM-37', 360, 296.5, 'Totem Trim 03 (PDT 37)')}
            {renderTotemMarker('TOTEM-L3-TRM-42', 360, 214, 'Totem Trim 04 (PDT 42)')}

            {/* ============================================================== */}
            {/* 7. CHASSI (51 AO 93) — VERMELHO, COLUNA VERTICAL DESCENDO     */}
            {/* ============================================================== */}
            {Array.from({ length: 43 }, (_, i) => {
              const num = 51 + i;
              const x = 302.5;
              const y = 81.5 + i * 16.5;
              return renderPdtSquare(`SEQ-${num}`, num, x, y, '#ef4444', '#ffffff', '#dc2626');
            })}

            {/* Totens Chassi (PDT 51 e PDT 65) */}
            {renderTotemMarker('TOTEM-L3-CHS-51', 294, 89, 'Totem Chassi 01 (PDT 51)')}
            {renderTotemMarker('TOTEM-L3-CHS-65', 294, 320, 'Totem Chassi 02 (PDT 65)')}

            {/* ============================================================== */}
            {/* 8. BIG CHASSI (94 AO 108) — CIANO, COLUNA ADJACENTE DESCENDO  */}
            {/* ============================================================== */}
            {Array.from({ length: 15 }, (_, i) => {
              const num = 94 + i;
              const x = 345;
              const y = 494.5 + i * 16.5;
              return renderPdtSquare(`SEQ-${num}`, num, x, y, '#06b6d4', '#ffffff', '#0891b2');
            })}

            {/* Totens Big Chassi (PDT 95 e PDT 102) */}
            {renderTotemMarker('TOTEM-L3-BCH-95', 367, 511, 'Totem Big Chassi 01 (PDT 95)')}
            {renderTotemMarker('TOTEM-L3-BCH-102', 367, 626.5, 'Totem Big Chassi 02 (PDT 102)')}

            {/* ============================================================== */}
            {/* 9. FINAL (109 AO 150) — MAGENTA / ROXO, COLUNA SUBINDO       */}
            {/* ============================================================== */}
            {Array.from({ length: 42 }, (_, i) => {
              const num = 109 + i;
              const x = 280;
              const y = 750 - (i + 1) * 16.5;
              return renderPdtSquare(`SEQ-${num}`, num, x, y, '#d946ef', '#ffffff', '#a21caf');
            })}

            {/* Totens Final (PDT 109, 120, 130, 140) */}
            {renderTotemMarker('TOTEM-L3-FIN-109', 272, 733.5, 'Totem Final 01 (PDT 109)')}
            {renderTotemMarker('TOTEM-L3-FIN-120', 272, 552, 'Totem Final 02 (PDT 120)')}
            {renderTotemMarker('TOTEM-L3-FIN-130', 272, 387, 'Totem Final 03 (PDT 130)')}
            {renderTotemMarker('TOTEM-L3-FIN-140', 272, 222, 'Totem Final 04 (PDT 140)')}

            {/* PDTs adicionais criados pelo usuário que não estão na sequência padrão */}
            {pdts.filter(p => p.linha === selectedLinha && p.id.includes('NEW')).map(extraPdt => {
              return renderPdtSquare(extraPdt.id, extraPdt.numero, extraPdt.x, extraPdt.y, '#3b82f6', '#ffffff', '#1d4ed8');
            })}
          </svg>
          </div>

          {/* Faixa Inferior Compacta: Legenda de Trechos em Pills */}
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-800/80 px-2 shrink-0 text-[10px] font-mono text-slate-400 overflow-x-auto gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-300">TRECHOS:</span>
              {TRECHOS_OFICIAIS.map(trecho => {
                const ativo = trechosVisiveis.includes(trecho.id);
                return (
                  <button
                    key={trecho.id}
                    type="button"
                    onClick={() => toggleTrechoVisibilidade(trecho.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded border transition cursor-pointer ${
                      ativo ? 'opacity-100 ring-1 ring-white/20' : 'opacity-35 line-through'
                    }`}
                    style={{
                      color: trecho.corHex,
                      backgroundColor: `${trecho.corHex}18`,
                      borderColor: `${trecho.corHex}80`
                    }}
                    title={ativo ? `Ocultar ${trecho.nome}` : `Exibir ${trecho.nome}`}
                  >
                    <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: trecho.corHex }} />
                    {trecho.nome} ({trecho.pdtFaixa.replace(' AO ', '-')})
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setTrechosVisiveis(TRECHOS_OFICIAIS.map(trecho => trecho.id))}
                className="px-2 py-0.5 rounded border border-sky-600/70 bg-sky-950/60 text-sky-300 hover:bg-sky-900/70 transition cursor-pointer font-bold"
              >
                Exibir todos
              </button>
            </div>

            <button
              onClick={() => setModalLegendaOpen(true)}
              className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded text-[10px] border border-slate-700 transition cursor-pointer shrink-0 flex items-center gap-1"
            >
              <i className="fa-solid fa-table-list"></i> Tabela Completa
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Tabela de Legenda Oficial */}
      {modalLegendaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-list-check text-sky-400"></i>
                <h3 className="font-bold text-sm tracking-wide">LEGENDA DA LINHA DE PRODUÇÃO 3 (BETIM)</h3>
              </div>
              <button 
                onClick={() => setModalLegendaOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto max-h-[60vh]">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="py-2 px-2.5 font-bold">COR</th>
                    <th className="py-2 px-3 font-bold">TRECHO</th>
                    <th className="py-2 px-3 font-bold">FAIXA PDT</th>
                    <th className="py-2 px-3 font-bold text-center">TOTENS</th>
                    <th className="py-2 px-3 font-bold">POSIÇÃO TOTENS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {TRECHOS_OFICIAIS.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-2 px-2.5">
                        <div className="w-7 h-4 rounded shadow-xs border border-white/20" style={{ backgroundColor: t.corHex }} />
                      </td>
                      <td className="py-2 px-3 font-bold text-white">{t.nome}</td>
                      <td className="py-2 px-3 text-slate-300">{t.pdtFaixa}</td>
                      <td className="py-2 px-3 text-center font-bold text-sky-400">{t.totalTotens}</td>
                      <td className="py-2 px-3 text-slate-400 text-[11px]">{t.posicaoTotens}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setModalLegendaOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODAL DE EDIÇÃO COMPLETA DO PDT (MODO EDIÇÃO ATIVO)          */}
      {/* ============================================================== */}
      {editingPdt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-pen-to-square text-amber-400 text-lg"></i>
                <div>
                  <h3 className="font-bold text-base tracking-wide">
                    Editar Posto de Trabalho: {editingPdt.codigo}
                  </h3>
                  <p className="text-xs text-amber-300 font-mono">
                    Regra: Domínio gerencia PDTs & Colaboradores (1 Totem por Domínio)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEditingPdt(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Hierarquia: Linha -> UTE -> Trecho -> Domínio */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-[11px] font-bold text-sky-400 block border-b border-slate-800/80 pb-1">
                  1. Cadeia Hierárquica Industrial
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Linha de Produção:</label>
                    <select
                      value={editingPdt.linha}
                      onChange={e => setEditingPdt({ ...editingPdt, linha: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                    >
                      <option value="L3">Linha 3 (Betim)</option>
                      <option value="L1">Linha 1</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">UTE Responsável:</label>
                    <select
                      value={editingPdt.uteId}
                      onChange={e => setEditingPdt({ ...editingPdt, uteId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                    >
                      {utes.filter(u => u.linhaId === editingPdt.linha).map(u => (
                        <option key={u.id} value={u.id}>{u.codigo} — {u.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Trecho da Linha:</label>
                    <select
                      value={editingPdt.trechoId}
                      onChange={e => setEditingPdt({ ...editingPdt, trechoId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                    >
                      {trechos.filter(t => t.linhaId === editingPdt.linha).map(t => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-amber-300 font-bold block mb-1">
                      Domínio Responsável (1 Totem por Domínio):
                    </label>
                    <select
                      value={editingPdt.dominioId}
                      onChange={e => {
                        const d = dominios.find(item => item.id === e.target.value);
                        setEditingPdt({
                          ...editingPdt,
                          dominioId: e.target.value,
                          totemId: d?.totemId || editingPdt.totemId,
                          teamLeaderNome: d?.teamLeaderNome || editingPdt.teamLeaderNome,
                          teamLeaderMatricula: d?.teamLeaderMatricula || editingPdt.teamLeaderMatricula
                        });
                      }}
                      className="w-full bg-amber-950/40 border border-amber-600 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs font-bold"
                    >
                      {dominios.filter(d => d.linhaId === editingPdt.linha).map(d => (
                        <option key={d.id} value={d.id}>{d.codigo} — {d.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dados do Posto */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-[11px] font-bold text-sky-400 block border-b border-slate-800/80 pb-1">
                  2. Parâmetros do Posto de Trabalho (PDT)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Número PDT:</label>
                    <input
                      type="number"
                      value={editingPdt.numero}
                      onChange={e => setEditingPdt({ ...editingPdt, numero: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Código Operação:</label>
                    <input
                      type="text"
                      value={editingPdt.codigo}
                      onChange={e => setEditingPdt({ ...editingPdt, codigo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Status Operacional:</label>
                    <select
                      value={editingPdt.status}
                      onChange={e => setEditingPdt({ ...editingPdt, status: e.target.value as PdtStatus })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                    >
                      <option value="ATIVO">ATIVO (Normal)</option>
                      <option value="COM_PENDENCIA">COM PENDÊNCIA</option>
                      <option value="CRITICO">CRÍTICO (Grave)</option>
                      <option value="SEM_TOTEM">SEM TOTEM</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">TCT Alvo (s):</label>
                    <input
                      type="number"
                      value={editingPdt.tempoCicloReferencia}
                      onChange={e => setEditingPdt({ ...editingPdt, tempoCicloReferencia: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Nome da Operação / Descrição:</label>
                  <input
                    type="text"
                    value={editingPdt.nome}
                    onChange={e => setEditingPdt({ ...editingPdt, nome: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Gestão de Colaboradores (Regra do Rodapé: Domínio faz a gestão de colaboradores) */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-[11px] font-bold text-emerald-400">
                    3. Alocação de Colaborador (Gestão do Domínio)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormNovoColab({
                        ...formNovoColab,
                        dominioId: editingPdt.dominioId || 'DOM-L3-PLAN-01',
                        pdtId: editingPdt.id,
                        pdtCodigo: editingPdt.codigo
                      });
                      setModalNovoColaboradorOpen(true);
                    }}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                  >
                    + Cadastrar Novo Colaborador
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Selecionar do Banco do Domínio:</label>
                    <select
                      value={editingPdt.operadorAtual || ''}
                      onChange={e => {
                        const sel = colaboradores.find(c => c.nome === e.target.value);
                        setEditingPdt({
                          ...editingPdt,
                          operadorAtual: e.target.value,
                          shift: sel?.turno || editingPdt.shift
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    >
                      <option value="">-- Escolher Colaborador Cadastrado --</option>
                      {colaboradores
                        .filter(c => c.dominioId === editingPdt.dominioId)
                        .map(c => (
                          <option key={c.id} value={c.nome}>
                            {c.matricula} — {c.nome} ({c.funcao})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Ou Digitar Nome Manual:</label>
                    <input
                      type="text"
                      value={editingPdt.operadorAtual || ''}
                      onChange={e => setEditingPdt({ ...editingPdt, operadorAtual: e.target.value })}
                      placeholder="Nome do Operador de Montagem"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Turno de Trabalho:</label>
                    <select
                      value={editingPdt.shift || '1º TURNO'}
                      onChange={e => setEditingPdt({ ...editingPdt, shift: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    >
                      <option value="1º TURNO">1º TURNO (06:00 - 15:48)</option>
                      <option value="2º TURNO">2º TURNO (15:48 - 01:09)</option>
                      <option value="3º TURNO">3º TURNO (Noturno)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Team Leader Responsável:</label>
                    <input
                      type="text"
                      value={editingPdt.teamLeaderNome || ''}
                      onChange={e => setEditingPdt({ ...editingPdt, teamLeaderNome: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Coordenadas Finas no Mapa */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Coordenadas SVG (Arraste no mapa ou ajuste aqui):</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">X:</span>
                    <button 
                      type="button" 
                      onClick={() => setEditingPdt({ ...editingPdt, x: editingPdt.x - 1 })}
                      className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px]"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={editingPdt.x}
                      onChange={e => setEditingPdt({ ...editingPdt, x: Number(e.target.value) })}
                      className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-white text-xs font-mono text-center"
                    />
                    <button 
                      type="button" 
                      onClick={() => setEditingPdt({ ...editingPdt, x: editingPdt.x + 1 })}
                      className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px]"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Y:</span>
                    <button 
                      type="button" 
                      onClick={() => setEditingPdt({ ...editingPdt, y: editingPdt.y - 1 })}
                      className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px]"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={editingPdt.y}
                      onChange={e => setEditingPdt({ ...editingPdt, y: Number(e.target.value) })}
                      className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-white text-xs font-mono text-center"
                    />
                    <button 
                      type="button" 
                      onClick={() => setEditingPdt({ ...editingPdt, y: editingPdt.y + 1 })}
                      className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDeletePdt(editingPdt.id)}
                className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-xl text-xs font-bold border border-red-800 transition flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-trash"></i> Excluir PDT
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPdt(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSavePdtEdit(editingPdt)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <i className="fa-solid fa-floppy-disk"></i> Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL NOVO PDT (CRIAR POSTO SEGUINDO A HIERARQUIA)           */}
      {/* ============================================================== */}
      {modalNovoPdtOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-plus-circle text-amber-400 text-lg"></i>
                <h3 className="font-bold text-base">Cadastrar Novo PDT na Linha</h3>
              </div>
              <button onClick={() => setModalNovoPdtOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Linha:</label>
                  <select
                    value={formNovoPdt.linha}
                    onChange={e => setFormNovoPdt({ ...formNovoPdt, linha: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                  >
                    <option value="L3">Linha 3 (Betim)</option>
                    <option value="L1">Linha 1</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Trecho da Linha:</label>
                  <select
                    value={formNovoPdt.trechoId}
                    onChange={e => setFormNovoPdt({ ...formNovoPdt, trechoId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                  >
                    {trechos.filter(t => t.linhaId === formNovoPdt.linha).map(t => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Domínio Responsável (1 Totem):</label>
                  <select
                    value={formNovoPdt.dominioId}
                    onChange={e => setFormNovoPdt({ ...formNovoPdt, dominioId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                  >
                    {dominios.filter(d => d.linhaId === formNovoPdt.linha).map(d => (
                      <option key={d.id} value={d.id}>{d.codigo} — {d.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Número do PDT:</label>
                  <input
                    type="number"
                    value={formNovoPdt.numero}
                    onChange={e => setFormNovoPdt({ ...formNovoPdt, numero: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Código Operação:</label>
                  <input
                    type="text"
                    value={formNovoPdt.codigo}
                    onChange={e => setFormNovoPdt({ ...formNovoPdt, codigo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">TCT Alvo (s):</label>
                  <input
                    type="number"
                    value={formNovoPdt.tempoCicloReferencia}
                    onChange={e => setFormNovoPdt({ ...formNovoPdt, tempoCicloReferencia: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Nome / Descrição da Operação:</label>
                <input
                  type="text"
                  value={formNovoPdt.nome}
                  onChange={e => setFormNovoPdt({ ...formNovoPdt, nome: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Operador Titular:</label>
                  <input
                    type="text"
                    value={formNovoPdt.operadorAtual}
                    onChange={e => setFormNovoPdt({ ...formNovoPdt, operadorAtual: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Status Inicial:</label>
                  <select
                    value={formNovoPdt.status}
                    onChange={e => setFormNovoPdt({ ...formNovoPdt, status: e.target.value as PdtStatus })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                  >
                    <option value="ATIVO">ATIVO</option>
                    <option value="COM_PENDENCIA">COM PENDÊNCIA</option>
                    <option value="CRITICO">CRÍTICO</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalNovoPdtOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNovoPdt}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              >
                <i className="fa-solid fa-plus"></i> Cadastrar PDT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. MODAL NOVO TOTEM & DOMÍNIO (REGRA: 1 TOTEM POR DOMÍNIO)      */}
      {/* ============================================================== */}
      {modalNovoTotemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-desktop text-sky-400 text-lg"></i>
                <div>
                  <h3 className="font-bold text-base">Cadastrar Novo Totem & Domínio</h3>
                  <p className="text-[10px] text-sky-300 font-mono">Regra: Estritamente 1 Totem por Domínio</p>
                </div>
              </div>
              <button onClick={() => setModalNovoTotemOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Código Totem:</label>
                  <input
                    type="text"
                    value={formNovoTotem.codigo}
                    onChange={e => setFormNovoTotem({ ...formNovoTotem, codigo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Linha:</label>
                  <select
                    value={formNovoTotem.linhaId}
                    onChange={e => setFormNovoTotem({ ...formNovoTotem, linhaId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    <option value="L3">Linha 3 (Betim)</option>
                    <option value="L1">Linha 1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Nome do Totem / Domínio:</label>
                <input
                  type="text"
                  value={formNovoTotem.nome}
                  onChange={e => setFormNovoTotem({ ...formNovoTotem, nome: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Trecho Vinculado:</label>
                  <select
                    value={formNovoTotem.trechoId}
                    onChange={e => setFormNovoTotem({ ...formNovoTotem, trechoId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    {trechos.filter(t => t.linhaId === formNovoTotem.linhaId).map(t => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Endereço IP:</label>
                  <input
                    type="text"
                    value={formNovoTotem.ipAddress}
                    onChange={e => setFormNovoTotem({ ...formNovoTotem, ipAddress: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Team Leader Responsável:</label>
                  <input
                    type="text"
                    value={formNovoTotem.teamLeaderNome}
                    onChange={e => setFormNovoTotem({ ...formNovoTotem, teamLeaderNome: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Matrícula T-Leader:</label>
                  <input
                    type="text"
                    value={formNovoTotem.teamLeaderMatricula}
                    onChange={e => setFormNovoTotem({ ...formNovoTotem, teamLeaderMatricula: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Posição X no Mapa:</label>
                  <input
                    type="number"
                    value={formNovoTotem.x}
                    onChange={e => setFormNovoTotem({ ...formNovoTotem, x: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Posição Y no Mapa:</label>
                  <input
                    type="number"
                    value={formNovoTotem.y}
                    onChange={e => setFormNovoTotem({ ...formNovoTotem, y: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalNovoTotemOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNovoTotem}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              >
                <i className="fa-solid fa-plus"></i> Criar Totem & Domínio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. MODAL GERENCIAR TRECHOS DA LINHA (NOME, FAIXAS, UT, COR)    */}
      {/* ============================================================== */}
      {modalTrechosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-3xl w-full p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-route text-sky-400 text-lg"></i>
                <div>
                  <h3 className="font-bold text-base">Gerenciamento de Trechos da Linha</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Cadastre, edite e corrija nomes, faixas de PDT e UT/UTE correspondente
                  </p>
                </div>
              </div>
              <button onClick={() => setModalTrechosOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            {editingTrecho ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-sky-300">Editando Trecho: {editingTrecho.nome}</h4>
                  <button onClick={() => setEditingTrecho(null)} className="text-slate-400 hover:text-white">Voltar à lista</button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Nome do Trecho:</label>
                    <input
                      type="text"
                      value={editingTrecho.nome}
                      onChange={e => setEditingTrecho({ ...editingTrecho, nome: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">UTE Correspondente:</label>
                    <select
                      value={editingTrecho.uteId}
                      onChange={e => setEditingTrecho({ ...editingTrecho, uteId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white text-xs"
                    >
                      {utes.filter(u => u.linhaId === editingTrecho.linhaId).map(u => (
                        <option key={u.id} value={u.id}>{u.codigo} — {u.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">PDT Inicial:</label>
                    <input
                      type="number"
                      value={editingTrecho.pdtInicio}
                      onChange={e => setEditingTrecho({ ...editingTrecho, pdtInicio: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">PDT Final:</label>
                    <input
                      type="number"
                      value={editingTrecho.pdtFim}
                      onChange={e => setEditingTrecho({ ...editingTrecho, pdtFim: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Cor Oficial:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={editingTrecho.cor}
                        onChange={e => setEditingTrecho({ ...editingTrecho, cor: e.target.value })}
                        className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingTrecho.cor}
                        onChange={e => setEditingTrecho({ ...editingTrecho, cor: e.target.value })}
                        className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditingTrecho(null)} className="px-3 py-1 bg-slate-800 rounded text-xs">Cancelar</button>
                  <button onClick={() => handleSaveTrechoEdit(editingTrecho)} className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold">Salvar Trecho</button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                      <th className="py-2 px-2">COR</th>
                      <th className="py-2 px-2">TRECHO</th>
                      <th className="py-2 px-2">FAIXA PDT</th>
                      <th className="py-2 px-2">UTE VINCULADA</th>
                      <th className="py-2 px-2 text-center">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {trechos.filter(t => t.linhaId === selectedLinha).map(t => {
                      const ute = utes.find(u => u.id === t.uteId);
                      return (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-2 px-2">
                            <div className="w-5 h-5 rounded border border-black/20" style={{ backgroundColor: t.cor }} />
                          </td>
                          <td className="py-2 px-2 font-bold text-white">{t.nome}</td>
                          <td className="py-2 px-2 text-slate-300">{t.pdtInicio} ao {t.pdtFim} ({t.totalPdts} PDTs)</td>
                          <td className="py-2 px-2 text-sky-300">{ute?.nome || t.uteId}</td>
                          <td className="py-2 px-2 text-center">
                            <button
                              onClick={() => setEditingTrecho(t)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded text-xs transition cursor-pointer"
                            >
                              <i className="fa-solid fa-pen"></i> Editar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalTrechosOpen(false)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. MODAL GESTÃO DE COLABORADORES POR DOMÍNIO (REGRA RODAPÉ)   */}
      {/* ============================================================== */}
      {modalGestaoColaboradoresOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-4xl w-full p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-users-gear text-emerald-400 text-xl"></i>
                <div>
                  <h3 className="font-bold text-base">Gestão de Colaboradores & Domínios</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Regra Oficial: "Os Domínios é que fazem a gestão dos PDTs e o cadastro de colaboradores"
                  </p>
                </div>
              </div>
              <button onClick={() => setModalGestaoColaboradoresOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            {/* Barra de Filtro e Ação de Cadastro */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">Filtrar por Domínio:</span>
                <select
                  value={filtroDominioColab}
                  onChange={e => setFiltroDominioColab(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                >
                  <option value="TODOS">Todos os Domínios ({selectedLinha})</option>
                  {dominios.filter(d => d.linhaId === selectedLinha).map(d => (
                    <option key={d.id} value={d.id}>{d.codigo} — {d.nome}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setModalNovoColaboradorOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <i className="fa-solid fa-user-plus"></i> Novo Colaborador
              </button>
            </div>

            {/* Tabela Interativa de Colaboradores */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2 px-2">MATRÍCULA</th>
                    <th className="py-2 px-2">COLABORADOR</th>
                    <th className="py-2 px-2">DOMÍNIO VINCULADO</th>
                    <th className="py-2 px-2">POSTO ALOCADO (PDT)</th>
                    <th className="py-2 px-2">TURNO / FUNÇÃO</th>
                    <th className="py-2 px-2 text-center">NÍVEL ILUO</th>
                    <th className="py-2 px-2 text-center">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {colaboradores
                    .filter(c => c.linhaId === selectedLinha)
                    .filter(c => filtroDominioColab === 'TODOS' || c.dominioId === filtroDominioColab)
                    .map(c => {
                      const dom = dominios.find(d => d.id === c.dominioId);
                      return (
                        <tr key={c.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-2 px-2 text-slate-400 font-bold">{c.matricula}</td>
                          <td className="py-2 px-2">
                            <strong className="text-white block">{c.nome}</strong>
                            <span className="text-[10px] text-emerald-400">{c.status}</span>
                          </td>
                          <td className="py-2 px-2">
                            <span className="text-sky-300 font-bold block">{dom?.nome || c.dominioId}</span>
                            <span className="text-[10px] text-slate-500">Totem: {dom?.totemId || '1:1'}</span>
                          </td>
                          <td className="py-2 px-2">
                            {c.pdtCodigo ? (
                              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-800 text-[11px]">
                                {c.pdtCodigo}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">Banco de Reserva</span>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            <span className="text-slate-200 block">{c.funcao}</span>
                            <span className="text-[10px] text-slate-500">{c.turno}</span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              c.nivelILUO === 3 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              c.nivelILUO === 2 ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                              'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              {c.nivelILUO === 3 ? 'O (Instrutor)' : c.nivelILUO === 2 ? 'U (Autônomo)' : 'L (Treinando)'}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setEditingColaborador(c)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded text-[10px] transition cursor-pointer"
                                title="Editar Colaborador"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteColaborador(c.id)}
                                className="px-2 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white rounded text-[10px] transition cursor-pointer"
                                title="Excluir Colaborador"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalGestaoColaboradoresOpen(false)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 11. MODAL CADASTRO / EDIÇÃO DE COLABORADOR                     */}
      {/* ============================================================== */}
      {(modalNovoColaboradorOpen || editingColaborador) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-user-gear text-emerald-400 text-lg"></i>
                <h3 className="font-bold text-base">
                  {editingColaborador ? 'Editar Colaborador do Domínio' : 'Cadastrar Colaborador no Domínio'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setModalNovoColaboradorOpen(false);
                  setEditingColaborador(null);
                }} 
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {(() => {
              const current = editingColaborador || formNovoColab;
              const updateField = (field: string, value: any) => {
                if (editingColaborador) {
                  setEditingColaborador({ ...editingColaborador, [field]: value });
                } else {
                  setFormNovoColab({ ...formNovoColab, [field]: value });
                }
              };

              return (
                <div className="space-y-3 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Nome Completo:</label>
                      <input
                        type="text"
                        value={current.nome}
                        onChange={e => updateField('nome', e.target.value)}
                        placeholder="Nome do Operador"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Matrícula Stellantis:</label>
                      <input
                        type="text"
                        value={current.matricula}
                        onChange={e => updateField('matricula', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Domínio Responsável (Regra):</label>
                      <select
                        value={current.dominioId}
                        onChange={e => updateField('dominioId', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                      >
                        {dominios.filter(d => d.linhaId === current.linhaId).map(d => (
                          <option key={d.id} value={d.id}>{d.codigo} — {d.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Alocar em Posto (PDT):</label>
                      <select
                        value={current.pdtId || ''}
                        onChange={e => {
                          const p = pdts.find(item => item.id === e.target.value);
                          updateField('pdtId', e.target.value);
                          updateField('pdtCodigo', p?.codigo || '');
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                      >
                        <option value="">-- Banco de Reserva (Sem Posto Fixo) --</option>
                        {pdts.filter(p => p.linha === current.linhaId).map(p => (
                          <option key={p.id} value={p.id}>{p.codigo} — {p.nome} (PDT {p.numero})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Turno:</label>
                      <select
                        value={current.turno}
                        onChange={e => updateField('turno', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                      >
                        <option value="1º TURNO">1º TURNO</option>
                        <option value="2º TURNO">2º TURNO</option>
                        <option value="3º TURNO">3º TURNO</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Função:</label>
                      <input
                        type="text"
                        value={current.funcao}
                        onChange={e => updateField('funcao', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Nível ILUO:</label>
                      <select
                        value={current.nivelILUO}
                        onChange={e => updateField('nivelILUO', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                      >
                        <option value={1}>L (Treinamento)</option>
                        <option value={2}>U (Autônomo)</option>
                        <option value={3}>O (Instrutor)</option>
                        <option value={0}>I (Inicial)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setModalNovoColaboradorOpen(false);
                        setEditingColaborador(null);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        if (editingColaborador) {
                          handleSaveColaboradorEdit(editingColaborador);
                        } else {
                          handleSaveNovoColaborador();
                        }
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <i className="fa-solid fa-floppy-disk"></i> {editingColaborador ? 'Salvar Colaborador' : 'Cadastrar'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 12. MODAL DE INSPEÇÃO OPERACIONAL DO PDT (MODO NORMAL)         */}
      {/* ============================================================== */}
      {selectedPdt && !modoEdicao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`w-3.5 h-3.5 rounded-full ${
                  selectedPdt.status === 'ATIVO' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
                  selectedPdt.status === 'COM_PENDENCIA' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' :
                  'bg-red-500 shadow-[0_0_8px_#ef4444]'
                }`} />
                <div>
                  <h3 className="font-bold text-base tracking-wide flex items-center gap-2">
                    <span>{selectedPdt.codigo} — {selectedPdt.nome}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedPdt.area} • Linha {selectedPdt.linha}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPdt(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Status Operacional:</span>
                <strong className={`text-xs ${
                  selectedPdt.status === 'ATIVO' ? 'text-emerald-400' :
                  selectedPdt.status === 'COM_PENDENCIA' ? 'text-amber-400' : 'text-red-400'
                }`}>{selectedPdt.status}</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">TCT Referência:</span>
                <strong className="text-white text-xs">{selectedPdt.tempoCicloReferencia}s</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Domínio & Team Leader:</span>
                <strong className="text-sky-300 text-xs">{selectedPdt.teamLeaderNome || 'N/A'}</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Operador Titular Alocado:</span>
                <strong className="text-slate-200 text-xs">{selectedPdt.operadorAtual || 'Não alocado'}</strong>
              </div>
            </div>

            {selectedPdt.totemData?.pautaBriefing && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <span className="text-sky-400 font-bold block text-[11px]">Pauta do Briefing A1:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                  {selectedPdt.totemData.pautaBriefing.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedPdt(null);
                  setEditingPdt(selectedPdt);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-pen"></i> Editar este PDT
              </button>

              <button
                onClick={() => setSelectedPdt(null)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 13. MODAL DE INSPEÇÃO DO TOTEM DIGITAL                         */}
      {/* ============================================================== */}
      {selectedTotem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-desktop text-sky-400 text-base"></i>
                <div>
                  <h3 className="font-bold text-sm">{selectedTotem.nome}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Código: {selectedTotem.codigo} • {selectedTotem.linhaId}</span>
                </div>
              </div>
              <button onClick={() => setSelectedTotem(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Regra de Vínculo:</span>
                <span className="text-sky-300 font-bold">1 Totem por Domínio</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Status de Conexão:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {selectedTotem.status}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Endereço IP:</span>
                <span className="text-white font-bold">{selectedTotem.ipAddress}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Versão Totem App:</span>
                <span className="text-sky-300 font-bold">{selectedTotem.versaoApp}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Última Sincronização:</span>
                <span className="text-slate-300">{selectedTotem.ultimaSincronizacao}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedTotem(null);
                  setEditingTotem(selectedTotem);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-pen"></i> Editar Totem
              </button>

              <button
                onClick={() => setSelectedTotem(null)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 14. MODAL DE EDIÇÃO DO TOTEM & DOMÍNIO                         */}
      {/* ============================================================== */}
      {editingTotem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-pen text-sky-400 text-base"></i>
                <h3 className="font-bold text-sm">Editar Totem Digital: {editingTotem.codigo}</h3>
              </div>
              <button onClick={() => setEditingTotem(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Nome do Totem:</label>
                <input
                  type="text"
                  value={editingTotem.nome}
                  onChange={e => setEditingTotem({ ...editingTotem, nome: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Código Totem:</label>
                  <input
                    type="text"
                    value={editingTotem.codigo}
                    onChange={e => setEditingTotem({ ...editingTotem, codigo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Status:</label>
                  <select
                    value={editingTotem.status}
                    onChange={e => setEditingTotem({ ...editingTotem, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                    <option value="MANUTENCAO">MANUTENÇÃO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Endereço IP:</label>
                <input
                  type="text"
                  value={editingTotem.ipAddress || ''}
                  onChange={e => setEditingTotem({ ...editingTotem, ipAddress: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Posição X:</label>
                  <input
                    type="number"
                    value={editingTotem.x || 0}
                    onChange={e => setEditingTotem({ ...editingTotem, x: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Posição Y:</label>
                  <input
                    type="number"
                    value={editingTotem.y || 0}
                    onChange={e => setEditingTotem({ ...editingTotem, y: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDeleteTotem(editingTotem.id)}
                className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded text-xs font-bold border border-red-800"
              >
                Excluir Totem
              </button>
              <div className="flex gap-2">
                <button onClick={() => setEditingTotem(null)} className="px-3 py-1.5 bg-slate-800 rounded text-xs">Cancelar</button>
                <button onClick={() => handleSaveTotemEdit(editingTotem)} className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold">Salvar Totem</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      </div>
  );
}
