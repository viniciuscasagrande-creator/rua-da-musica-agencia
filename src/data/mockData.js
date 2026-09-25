// Mock data for DiskIngressos - Distribuição Turística B2B (Parque Jaime Lerner - Curitiba)

export const OPERATOR_INFO = {
  id: "PRQ-JLERNER-001",
  name: "Parque Jaime Lerner",
  address: "Rua da Música • Curitiba - PR",
  shortAddress: "Curitiba - PR",
  tagline: "Cultura, música e experiências inesquecíveis",
  tags: [
    "Natureza e lazer",
    "Música e cultura",
    "Arquitetura icônica",
    "Ideal para grupos e excursões"
  ],
  adminUser: {
    name: "Parque Jaime Lerner",
    role: "Administrador",
    initials: "PL",
    email: "operacoes@parquejaimelerner.curitiba.br"
  },
  generalCapacity: 3000,
  inventoryAllocation: {
    siteDiskIngressos: 1500, // 50%
    bilheteriaLocal: 800,    // 26.7%
    agenciasB2B: 700        // 23.3%
  },
  defaultFeePercent: 6.0 // Taxa DiskIngressos de 6%
};

export const KPIS_OVERVIEW = {
  activeAgencies: { value: 42, change: "+16%", period: "vs. mês anterior", trend: "up" },
  servedStates: { value: 18, change: "+12%", period: "vs. mês anterior", trend: "up" },
  b2bBookings: { value: 1248, formatted: "1.248", change: "+28%", period: "vs. mês anterior", trend: "up" },
  distributedTickets: { value: 6842, formatted: "6.842", change: "+32%", period: "vs. mês anterior", trend: "up" },
  grossRevenue: { value: 214320.00, formatted: "R$ 214.320,00", change: "+30%", period: "vs. mês anterior", trend: "up" },
  diskFees: { value: 12859.20, formatted: "R$ 12.859,20", note: "6% sobre os ingressos", trend: "neutral" }
};

export const TICKET_CATALOG = [
  {
    id: "ing-inteira",
    name: "Inteira",
    description: "Público geral (12 anos ou mais)",
    basePrice: 30.00,
    feePercent: 6.0,
    feeAmount: 1.80,
    finalPrice: 31.80,
    icon: "user",
    popular: true
  },
  {
    id: "ing-meia",
    name: "Meia-entrada",
    description: "Estudantes, idosos, PCD (conforme lei federal e estadual)",
    basePrice: 15.00,
    feePercent: 6.0,
    feeAmount: 0.90,
    finalPrice: 15.90,
    icon: "users",
    popular: true
  },
  {
    id: "ing-tour",
    name: "Tour Guiado",
    description: "Visita guiada pelos principais espaços e história arquitetônica",
    basePrice: 20.00,
    feePercent: 6.0,
    feeAmount: 1.20,
    finalPrice: 21.20,
    icon: "compass",
    popular: false
  },
  {
    id: "ing-educativo",
    name: "Educativo (Escolas)",
    description: "Grupos escolares do ensino fundamental e médio (mín. 15 pessoas)",
    basePrice: 12.00,
    feePercent: 6.0,
    feeAmount: 0.72,
    finalPrice: 12.72,
    icon: "graduation-cap",
    popular: false
  },
  {
    id: "ing-corp",
    name: "Grupo Corporativo",
    description: "Eventos corporativos, convenções e programas de incentivo",
    basePrice: 25.00,
    feePercent: 6.0,
    feeAmount: 1.50,
    finalPrice: 26.50,
    icon: "briefcase",
    popular: false
  }
];

export const STATES_DISTRIBUTION = [
  { uf: "PR", name: "Paraná", percentage: 28, tickets: 1915, color: "#1d4ed8" },
  { uf: "SP", name: "São Paulo", percentage: 18, tickets: 1231, color: "#2563eb" },
  { uf: "SC", name: "Santa Catarina", percentage: 12, tickets: 821, color: "#3b82f6" },
  { uf: "RJ", name: "Rio de Janeiro", percentage: 10, tickets: 684, color: "#60a5fa" },
  { uf: "MG", name: "Minas Gerais", percentage: 8, tickets: 547, color: "#93c5fd" },
  { uf: "Outros", name: "Outros Estados (13)", percentage: 24, tickets: 1644, color: "#cbd5e1" }
];

export const EVOLUTION_DATA = [
  { date: "01/09", reservas: 48, ingressos: 210, receita: 6720 },
  { date: "03/09", reservas: 55, ingressos: 260, receita: 8320 },
  { date: "05/09", reservas: 68, ingressos: 310, receita: 9920 },
  { date: "07/09", reservas: 92, ingressos: 480, receita: 15360 },
  { date: "09/09", reservas: 74, ingressos: 360, receita: 11520 },
  { date: "11/09", reservas: 85, ingressos: 420, receita: 13440 },
  { date: "13/09", reservas: 98, ingressos: 490, receita: 15680 },
  { date: "15/09", reservas: 110, ingressos: 550, receita: 17600 },
  { date: "17/09", reservas: 125, ingressos: 610, receita: 19520 },
  { date: "19/09", reservas: 142, ingressos: 720, receita: 23040 },
  { date: "21/09", reservas: 130, ingressos: 680, receita: 21760 },
  { date: "23/09", reservas: 152, ingressos: 780, receita: 24960 },
  { date: "25/09", reservas: 168, ingressos: 830, receita: 26560 },
  { date: "27/09", reservas: 145, ingressos: 720, receita: 23040 },
  { date: "30/09", reservas: 155, ingressos: 790, receita: 25280 }
];

export const AGENCIES_LIST = [
  {
    id: "ag-01",
    name: "Mundo Brasil Turismo",
    legalName: "Mundo Brasil Agência de Viagens e Eventos Ltda",
    cnpj: "18.245.912/0001-44",
    city: "São Paulo",
    state: "SP",
    location: "São Paulo - SP",
    status: "Ativa",
    quotaLimit: 2000,
    quotaUsed: 1480,
    reservationsCount: 320,
    ticketsCount: 1480,
    revenue: 46464.00,
    diskFeeAmount: 2787.84,
    contactName: "Roberto Silveira",
    email: "roberto@mundobrasiltur.com.br",
    phone: "(11) 3422-9800",
    avatarBg: "bg-blue-600",
    initials: "MB",
    contractDate: "15/01/2026",
    paymentTerms: "Faturamento 15 dias"
  },
  {
    id: "ag-02",
    name: "Viva Viagens",
    legalName: "Viva Viagens Operadora e Receptivo Eireli",
    cnpj: "24.890.112/0001-08",
    city: "Rio de Janeiro",
    state: "RJ",
    location: "Rio de Janeiro - RJ",
    status: "Ativa",
    quotaLimit: 1500,
    quotaUsed: 980,
    reservationsCount: 218,
    ticketsCount: 980,
    revenue: 30828.00,
    diskFeeAmount: 1849.68,
    contactName: "Fernanda Albuquerque",
    email: "reservas@vivaviagens.com.br",
    phone: "(21) 2544-7711",
    avatarBg: "bg-emerald-600",
    initials: "VV",
    contractDate: "03/02/2026",
    paymentTerms: "Faturamento 15 dias"
  },
  {
    id: "ag-03",
    name: "Curitiba Tour",
    legalName: "Curitiba City Tour & Receptivo Ltda",
    cnpj: "09.112.443/0001-92",
    city: "Curitiba",
    state: "PR",
    location: "Curitiba - PR",
    status: "Ativa",
    quotaLimit: 1000,
    quotaUsed: 860,
    reservationsCount: 185,
    ticketsCount: 860,
    revenue: 27048.00,
    diskFeeAmount: 1622.88,
    contactName: "Carlos Eduardo Mendes",
    email: "carlos@curitibatour.com.br",
    phone: "(41) 3039-4400",
    avatarBg: "bg-teal-600",
    initials: "CT",
    contractDate: "10/11/2025",
    paymentTerms: "Faturamento 30 dias"
  },
  {
    id: "ag-04",
    name: "Sul Turismo",
    legalName: "Sul Brasil Receptivo e Excursões Ltda",
    cnpj: "31.776.205/0001-30",
    city: "Florianópolis",
    state: "SC",
    location: "Florianópolis - SC",
    status: "Ativa",
    quotaLimit: 800,
    quotaUsed: 640,
    reservationsCount: 142,
    ticketsCount: 640,
    revenue: 20352.00,
    diskFeeAmount: 1221.12,
    contactName: "Patrícia Diniz",
    email: "patricia@sulturismo.com.br",
    phone: "(48) 3221-8855",
    avatarBg: "bg-indigo-600",
    initials: "ST",
    contractDate: "20/03/2026",
    paymentTerms: "Faturamento 15 dias"
  },
  {
    id: "ag-05",
    name: "Experiências BR",
    legalName: "Experiências Brasileiras Turismo e Cultura S/A",
    cnpj: "42.009.617/0001-81",
    city: "Belo Horizonte",
    state: "MG",
    location: "Belo Horizonte - MG",
    status: "Pendente",
    quotaLimit: 500,
    quotaUsed: 420,
    reservationsCount: 96,
    ticketsCount: 420,
    revenue: 13356.00,
    diskFeeAmount: 801.36,
    contactName: "Thiago Ramos",
    email: "thiago@experienciasbr.com",
    phone: "(31) 3345-6677",
    avatarBg: "bg-amber-600",
    initials: "EB",
    contractDate: "12/09/2026",
    paymentTerms: "Aguardando Aprovação de Crédito"
  },
  {
    id: "ag-06",
    name: "Agência Turismo Brasil",
    legalName: "Agência Turismo Brasil Operadora Nacional",
    cnpj: "10.554.891/0001-19",
    city: "Curitiba",
    state: "PR",
    location: "Curitiba - PR",
    status: "Ativa",
    quotaLimit: 1200,
    quotaUsed: 590,
    reservationsCount: 112,
    ticketsCount: 590,
    revenue: 18762.00,
    diskFeeAmount: 1125.72,
    contactName: "Marcos Vinícius",
    email: "marcos@turismobrasil.com.br",
    phone: "(41) 3210-9900",
    avatarBg: "bg-blue-700",
    initials: "AT",
    contractDate: "05/04/2026",
    paymentTerms: "Faturamento 15 dias"
  },
  {
    id: "ag-07",
    name: "Rota Sul Viagens",
    legalName: "Rota Sul Agência de Viagens Ltda",
    cnpj: "05.342.119/0001-52",
    city: "Porto Alegre",
    state: "RS",
    location: "Porto Alegre - RS",
    status: "Ativa",
    quotaLimit: 750,
    quotaUsed: 380,
    reservationsCount: 78,
    ticketsCount: 380,
    revenue: 12084.00,
    diskFeeAmount: 725.04,
    contactName: "Juliana Becker",
    email: "juliana@rotasul.com.br",
    phone: "(51) 3322-1144",
    avatarBg: "bg-violet-600",
    initials: "RS",
    contractDate: "18/05/2026",
    paymentTerms: "Faturamento 15 dias"
  }
];

export const BOOKINGS_LIST = [
  {
    id: "RES-B2B-1089",
    agencyId: "ag-06",
    agencyName: "Agência Turismo Brasil",
    groupName: "Excursão Colégio Positivo 3º Ano",
    visitDate: "2026-09-28",
    visitTime: "09:00",
    ticketsCount: 45,
    items: [
      { ticketName: "Educativo (Escolas)", quantity: 40, unitPrice: 12.72, total: 508.80 },
      { ticketName: "Inteira (Monitores/Professores)", quantity: 5, unitPrice: 31.80, total: 159.00 }
    ],
    totalAmount: 667.80,
    baseAmount: 630.00,
    diskFeeAmount: 37.80,
    guideName: "Cláudio Sampaio (Cadastur: 18.092.332-PR)",
    transport: "Ônibus Marcopolo G7 - Placa BEQ-4G90",
    status: "Voucher emitido",
    qrCode: "DISK-B2B-RES1089-9821-VALID",
    createdAt: "2026-09-24 10:15",
    paymentStatus: "Faturado (Cota B2B)",
    checkinCount: 0
  },
  {
    id: "RES-B2B-1088",
    agencyId: "ag-01",
    agencyName: "Mundo Brasil Turismo",
    groupName: "Melhor Idade Excursões São Paulo",
    visitDate: "2026-09-26",
    visitTime: "10:00",
    ticketsCount: 32,
    items: [
      { ticketName: "Meia-entrada (Idosos)", quantity: 30, unitPrice: 15.90, total: 477.00 },
      { ticketName: "Tour Guiado", quantity: 32, unitPrice: 21.20, total: 678.40 }
    ],
    totalAmount: 1155.40,
    baseAmount: 1090.00,
    diskFeeAmount: 65.40,
    guideName: "Valéria Toledo (Cadastur: 26.114.901-SP)",
    transport: "Ônibus Irizar - Placa FOX-8821",
    status: "Confirmado",
    qrCode: "DISK-B2B-RES1088-7712-VALID",
    createdAt: "2026-09-23 15:40",
    paymentStatus: "Pago via PIX B2B",
    checkinCount: 0
  },
  {
    id: "RES-B2B-1087",
    agencyId: "ag-03",
    agencyName: "Curitiba Tour",
    groupName: "City Tour Curitiba Cultural - Manhã",
    visitDate: "2026-09-24",
    visitTime: "09:00",
    ticketsCount: 22,
    items: [
      { ticketName: "Inteira", quantity: 18, unitPrice: 31.80, total: 572.40 },
      { ticketName: "Meia-entrada", quantity: 4, unitPrice: 15.90, total: 63.60 }
    ],
    totalAmount: 636.00,
    baseAmount: 600.00,
    diskFeeAmount: 36.00,
    guideName: "Carlos Eduardo Mendes",
    transport: "Micro-ônibus Volare - Placa BRA-3E12",
    status: "Concluído",
    qrCode: "DISK-B2B-RES1087-1123-CHECKIN",
    createdAt: "2026-09-22 09:12",
    paymentStatus: "Faturado (Cota B2B)",
    checkinCount: 22
  },
  {
    id: "RES-B2B-1086",
    agencyId: "ag-02",
    agencyName: "Viva Viagens",
    groupName: "Incentivo Corporativo Farmacêutica",
    visitDate: "2026-09-27",
    visitTime: "14:00",
    ticketsCount: 50,
    items: [
      { ticketName: "Grupo Corporativo", quantity: 50, unitPrice: 26.50, total: 1325.00 },
      { ticketName: "Tour Guiado", quantity: 50, unitPrice: 21.20, total: 1060.00 }
    ],
    totalAmount: 2385.00,
    baseAmount: 2250.00,
    diskFeeAmount: 135.00,
    guideName: "Marina Bastos",
    transport: "2x Vans Executivas Sprinter",
    status: "Pré-reservado",
    qrCode: "DISK-B2B-RES1086-4432-PENDING",
    createdAt: "2026-09-24 11:55",
    paymentStatus: "Aguardando Confirmação",
    checkinCount: 0
  }
];

export const OPERATIONAL_PIPELINE_STEPS = [
  { step: 1, title: "Inventário & Cotas", desc: "Parque libera capacidade central e define cotas por canal (Site / Bilheteria / B2B)" },
  { step: 2, title: "Reserva B2B", desc: "Agência reserva ingressos pelo Portal B2B com preços parametrizados" },
  { step: 3, title: "Pacote Turístico", desc: "Agência adiciona hotel, transporte e guia privativo no pacote final" },
  { step: 4, title: "Venda ao Turista", desc: "Cliente final adquire o pacote turístico comercializado pela agência" },
  { step: 5, title: "Emissão de Vouchers", desc: "Sistema DiskIngressos gera vouchers com QR Code individual ou em lote" },
  { step: 6, title: "Validação na Entrada", desc: "Equipe do Parque Jaime Lerner valida os vouchers na catraca via app PDT" },
  { step: 7, title: "Conciliação & Repasse", desc: "Ledger processa taxa de 6% e credita saldo líquido ao operador" }
];

export const COMMISSION_RULES_DATA = [
  {
    id: "RULE-B2B-01",
    agencyId: "ag-01",
    agencyName: "Mundo Brasil Turismo",
    model: "Progressiva por Faixas",
    description: "0-500 ingressos: 5% | 501-1000: 7% | 1001+: 9%",
    rateBps: 700,
    currentTier: "Tier 2 (7%)",
    accruedAmount: 3252.48,
    paidAmount: 2450.00,
    pendingAmount: 802.48,
    status: "Ativa"
  },
  {
    id: "RULE-B2B-02",
    agencyId: "ag-02",
    agencyName: "Viva Viagens",
    model: "Valor Fixo por Ingresso",
    description: "R$ 3,50 por visitante em grupos corporativos",
    rateBps: null,
    fixedPerTicket: 3.50,
    currentTier: "Fixo Corporativo",
    accruedAmount: 3430.00,
    paidAmount: 2800.00,
    pendingAmount: 630.00,
    status: "Ativa"
  },
  {
    id: "RULE-B2B-03",
    agencyId: "ag-03",
    agencyName: "Curitiba Tour",
    model: "Percentual Direto",
    description: "6% sobre o total de vendas faturadas no mês",
    rateBps: 600,
    currentTier: "Taxa Padrão B2B",
    accruedAmount: 1622.88,
    paidAmount: 1622.88,
    pendingAmount: 0.00,
    status: "Ativa"
  },
  {
    id: "RULE-B2B-04",
    agencyId: "ag-04",
    agencyName: "Sul Turismo",
    model: "Percentual Direto",
    description: "5% sobre vendas confirmadas de excursões escolares",
    rateBps: 500,
    currentTier: "Educativo",
    accruedAmount: 1017.60,
    paidAmount: 800.00,
    pendingAmount: 217.60,
    status: "Ativa"
  }
];

export const TURNSTILES_DATA = [
  {
    id: "CAT-01",
    name: "Catraca 01 - Portaria Principal",
    location: "Entrada Central (Rua da Música)",
    status: "Operando",
    todayCheckins: 842,
    capacityPerHour: 400,
    ipAddress: "192.168.10.101",
    lastPing: "Agora mesmo"
  },
  {
    id: "CAT-02",
    name: "Catraca 02 - Excursões & Grupos B2B",
    location: "Desembarque de Ônibus de Turismo",
    status: "Operando",
    todayCheckins: 512,
    capacityPerHour: 600,
    ipAddress: "192.168.10.102",
    lastPing: "Agora mesmo"
  },
  {
    id: "CAT-03",
    name: "Catraca 03 - Entrada Sul / Bosque",
    location: "Acesso Lateral",
    status: "Operando",
    todayCheckins: 290,
    capacityPerHour: 300,
    ipAddress: "192.168.10.103",
    lastPing: "2 min atrás"
  },
  {
    id: "CAT-04",
    name: "Catraca 04 - VIP & Acessibilidade PCD",
    location: "Foyer do Auditório Jaime Lerner",
    status: "Operando",
    todayCheckins: 114,
    capacityPerHour: 200,
    ipAddress: "192.168.10.104",
    lastPing: "Agora mesmo"
  }
];

export const VOUCHERS_LIST_DATA = [
  {
    id: "VCH-2026-901",
    reservationId: "RES-B2B-1089",
    agencyName: "Agência Turismo Brasil",
    groupName: "Excursão Colégio Positivo 3º Ano",
    ticketType: "Lote Misto (40x Escolar, 5x Inteira)",
    totalTickets: 45,
    validatedCount: 0,
    visitDate: "2026-09-28",
    visitTime: "09:00",
    qrCodeString: "DISK.B2B.eyJyaWQiOiJSRVMtQjJCLTEwODkiLCJhaWQiOiJhZy0wNiJ9.7f89d1",
    status: "Aguardando Check-in",
    issuedAt: "2026-09-24 10:15"
  },
  {
    id: "VCH-2026-902",
    reservationId: "RES-B2B-1088",
    agencyName: "Mundo Brasil Turismo",
    groupName: "Melhor Idade Excursões São Paulo",
    ticketType: "30x Meia-entrada + 32x Tour Guiado",
    totalTickets: 32,
    validatedCount: 0,
    visitDate: "2026-09-26",
    visitTime: "10:00",
    qrCodeString: "DISK.B2B.eyJyaWQiOiJSRVMtQjJCLTEwODgiLCJhaWQiOiJhZy0wMSJ9.4a22b9",
    status: "Aguardando Check-in",
    issuedAt: "2026-09-23 15:40"
  },
  {
    id: "VCH-2026-903",
    reservationId: "RES-B2B-1087",
    agencyName: "Curitiba Tour",
    groupName: "City Tour Curitiba Cultural - Manhã",
    ticketType: "18x Inteira, 4x Meia-entrada",
    totalTickets: 22,
    validatedCount: 22,
    visitDate: "2026-09-24",
    visitTime: "09:00",
    qrCodeString: "DISK.B2B.eyJyaWQiOiJSRVMtQjJCLTEwODciLCJhaWQiOiJhZy0wMyJ9.9c11e4",
    status: "Check-in Concluído",
    issuedAt: "2026-09-22 09:12"
  }
];

export const RBAC_OPERATOR_PERMISSIONS = [
  { id: "perm-sell", name: "Vender Ingressos B2B", desc: "Emitir pedidos e reservas para agências credenciadas", defaultActive: true },
  { id: "perm-quotas", name: "Gerenciar Cotas e Limites", desc: "Aumentar ou suspender limites mensais de agências parceiras", defaultActive: true },
  { id: "perm-pricing", name: "Parametrizar Tarifário e Taxa 6%", desc: "Alterar preços-base e taxa administrativa DiskIngressos", defaultActive: true },
  { id: "perm-complimentary", name: "Emitir Cortesias Operacionais", desc: "Liberar gratuidades para guias de turismo e motoristas", defaultActive: true },
  { id: "perm-gate-checkin", name: "Fiscalização e Catraca", desc: "Validar QR Codes e autorizar entradas em lote", defaultActive: true },
  { id: "perm-ledger-audit", name: "Conciliação Financeira / Ledger", desc: "Consultar repasses líquidos e autorizar reversões de estorno", defaultActive: false }
];

// =========================================================================
// B2B 2.0 PLATAFORMA DE DISTRIBUIÇÃO TURÍSTICA - NOVOS MODELOS
// =========================================================================

// 1. Multi-Atrativo (Arquitetura Reutilizável)
export const ATTRACTIONS_LIST = [
  {
    id: "PRQ-JLERNER-001",
    name: "Parque Jaime Lerner",
    slug: "parque-jaime-lerner",
    city: "Curitiba",
    state: "PR",
    address: "Rua da Música, 1000",
    generalCapacity: 3000,
    active: true,
    thumbnail: "/assets/parque-thumb.jpg",
    banner: "/assets/parque-banner.jpg",
    sunset: "/assets/parque-sunset.jpg",
    category: "Parque Cultural & Arquitetura",
    defaultFeePercent: 6.0
  },
  {
    id: "MON-CWB-002",
    name: "Museu Oscar Niemeyer (Experiências)",
    slug: "museu-oscar-niemeyer",
    city: "Curitiba",
    state: "PR",
    address: "Rua Marechal Hermes, 999",
    generalCapacity: 4500,
    active: true,
    thumbnail: "https://images.unsplash.com/photo-1544535830-92fe6060c5a2?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1544535830-92fe6060c5a2?auto=format&fit=crop&w=1200&q=80",
    category: "Artes Visuais & Design",
    defaultFeePercent: 6.0
  },
  {
    id: "SERRA-VERDE-003",
    name: "Trem Serra Verde Express",
    slug: "serra-verde-express",
    city: "Morretes / Curitiba",
    state: "PR",
    address: "Estação Ferroviária de Curitiba",
    generalCapacity: 1200,
    active: true,
    thumbnail: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
    category: "Turismo Ferroviário & Ecoturismo",
    defaultFeePercent: 6.0
  }
];

// 2. Dashboard Nacional Consolidado (Conforme solicitado)
export const NATIONAL_DASHBOARD_METRICS = {
  activeAgencies: 384,
  b2bSalesAmount: 428150.00,
  activeReservations: 87,
  totalRevenue: 512400.00,
  ticketsSold: 4821,
  totalCommissions: 31250.00,
  conversionRate: 68,
  coveredStates: 19,
  stateRankings: [
    { uf: "PR", name: "Paraná", percentage: 42, count: 2025, revenue: 215200 },
    { uf: "SP", name: "São Paulo", percentage: 28, count: 1350, revenue: 143500 },
    { uf: "SC", name: "Santa Catarina", percentage: 12, count: 578, revenue: 61480 },
    { uf: "RS", name: "Rio Grande do Sul", percentage: 9, count: 434, revenue: 46110 },
    { uf: "MG", name: "Minas Gerais", percentage: 5, count: 241, revenue: 25620 },
    { uf: "Outros", name: "Demais Estados (14)", percentage: 4, count: 193, revenue: 20490 }
  ],
  topAgencies: [
    { name: "Turismo ABC", salesCount: 487, revenue: 51800, uf: "PR", badge: "Diamante" },
    { name: "Viagens XYZ", salesCount: 361, revenue: 38400, uf: "SP", badge: "Ouro" },
    { name: "Operadora 123", salesCount: 298, revenue: 31700, uf: "SC", badge: "Ouro" },
    { name: "CVC Curitiba", salesCount: 245, revenue: 26100, uf: "PR", badge: "Prata" },
    { name: "Serra Verde Express", salesCount: 210, revenue: 22350, uf: "PR", badge: "Prata" }
  ]
};

// 3. Contratos Comerciais Versionados por Agência (Motor Comercial 2.0)
export const COMMERCIAL_CONTRACTS = [
  {
    id: "CTR-2026-001",
    agencyId: "ag-01",
    agencyName: "Mundo Brasil Turismo",
    version: 2,
    diskFeePercent: 6.0,
    agencyCommissionPercent: 12.0,
    netPriceEnabled: false,
    minTicketsPerBooking: 10,
    paymentTerms: "Faturado 15 Dias",
    paymentTermsDays: 15,
    creditLimit: 50000.00,
    creditUsed: 18450.00,
    creditAvailable: 31550.00,
    cancellationWindowHours: 48,
    status: "Vigente",
    validUntil: "31/12/2026",
    authorizedProducts: ["Todos os Ingressos", "Pôr do Sol VIP", "Tours Guiados"],
    specialRule: "Bônus de 2% para grupos acima de 40 passageiros"
  },
  {
    id: "CTR-2026-002",
    agencyId: "ag-02",
    agencyName: "Viagens CWB Excursões",
    version: 1,
    diskFeePercent: 6.0,
    agencyCommissionPercent: 10.0,
    netPriceEnabled: true,
    netPriceAmount: 24.00,
    minTicketsPerBooking: 5,
    paymentTerms: "Faturado 30 Dias",
    paymentTermsDays: 30,
    creditLimit: 30000.00,
    creditUsed: 12600.00,
    creditAvailable: 17400.00,
    cancellationWindowHours: 24,
    status: "Vigente",
    validUntil: "31/10/2026",
    authorizedProducts: ["Ingresso Geral", "Excursão Escolar"],
    specialRule: "Preço líquido direto acordado para dias úteis"
  },
  {
    id: "CTR-2026-003",
    agencyId: "ag-06",
    agencyName: "Agência Turismo Brasil",
    version: 3,
    diskFeePercent: 6.0,
    agencyCommissionPercent: 15.0,
    netPriceEnabled: false,
    minTicketsPerBooking: 1,
    paymentTerms: "Faturado 30 Dias",
    paymentTermsDays: 30,
    creditLimit: 80000.00,
    creditUsed: 27800.00,
    creditAvailable: 52200.00,
    cancellationWindowHours: 48,
    status: "Vigente",
    validUntil: "31/12/2026",
    authorizedProducts: ["Todos os Ingressos", "Tours Guiados", "Excursões"],
    specialRule: "Parceiro Estratégico Regional - Emissão imediata via API"
  },
  {
    id: "CTR-2026-004",
    agencyId: "ag-05",
    agencyName: "Schultz Operadora",
    version: 1,
    diskFeePercent: 6.0,
    agencyCommissionPercent: 10.0,
    netPriceEnabled: false,
    minTicketsPerBooking: 15,
    paymentTerms: "Pré-pago / PIX Instantâneo",
    paymentTermsDays: 0,
    creditLimit: 10000.00,
    creditUsed: 0.00,
    creditAvailable: 10000.00,
    cancellationWindowHours: 72,
    status: "Em Homologação",
    validUntil: "15/12/2026",
    authorizedProducts: ["Ingresso Geral", "Educativo"],
    specialRule: "Crédito liberado após 3ª compra liquidada"
  }
];

// 4. Tarifário B2B Separado do Preço Público
export const TIERED_PRICING_CATALOG = [
  {
    id: "tier-inteira",
    name: "Ingresso Geral Inteira",
    publicPrice: 40.00,
    agencyB2BPrice: 30.00,
    groupPrice15Plus: 26.00,
    schoolExcursionPrice: 20.00,
    promoPrice: 28.00,
    diskFeePercent: 6.0,
    netRetentionPark: 28.20,
    description: "Acesso integral aos circuitos, jardins sonoros e pavilhões arquitetônicos."
  },
  {
    id: "tier-meia",
    name: "Meia-Entrada Legal",
    publicPrice: 20.00,
    agencyB2BPrice: 15.00,
    groupPrice15Plus: 13.00,
    schoolExcursionPrice: 10.00,
    promoPrice: 14.00,
    diskFeePercent: 6.0,
    netRetentionPark: 14.10,
    description: "Estudantes, idosos 60+, PCDs, doadores de sangue e professores do Paraná."
  },
  {
    id: "tier-tour",
    name: "Tour Arquitetônico Guiado",
    publicPrice: 35.00,
    agencyB2BPrice: 25.00,
    groupPrice15Plus: 22.00,
    schoolExcursionPrice: 16.00,
    promoPrice: 24.00,
    diskFeePercent: 6.0,
    netRetentionPark: 23.50,
    description: "Visita com arquiteto curador explicando o legado urbanístico de Jaime Lerner."
  },
  {
    id: "tier-sunset",
    name: "Sunset Cultural (Experiência VIP)",
    publicPrice: 60.00,
    agencyB2BPrice: 48.00,
    groupPrice15Plus: 42.00,
    schoolExcursionPrice: 35.00,
    promoPrice: 45.00,
    diskFeePercent: 6.0,
    netRetentionPark: 45.12,
    description: "Entrada ao entardecer com apresentação musical acústica e kit de boas-vindas."
  }
];

// 5. Reserva de Estoque Temporária com TTL (Holding / Auto-Release)
export const INVENTORY_HOLDS = [
  {
    id: "HOLD-781",
    agencyName: "Mundo Brasil Turismo",
    groupName: "Excursão Positivo Curitiba (40 pax)",
    date: "2026-09-28",
    quantity: 40,
    heldAt: "25/09/2026 09:30",
    expiresAt: "25/09/2026 17:30",
    minutesRemaining: 418,
    status: "HELD",
    actionRequired: "Aguardando confirmação de lista de passageiros"
  },
  {
    id: "HOLD-782",
    agencyName: "Viagens CWB Excursões",
    groupName: "Grupo Terceira Idade Joinville",
    date: "2026-09-29",
    quantity: 28,
    heldAt: "25/09/2026 08:15",
    expiresAt: "25/09/2026 14:15",
    minutesRemaining: 223,
    status: "HELD",
    actionRequired: "Aguardando aprovação de crédito faturado"
  },
  {
    id: "HOLD-779",
    agencyName: "Curitiba Tour",
    groupName: "Convenção Regional de Corretores",
    date: "2026-09-27",
    quantity: 50,
    heldAt: "24/09/2026 10:00",
    expiresAt: "24/09/2026 18:00",
    minutesRemaining: 0,
    status: "RELEASED",
    actionRequired: "Expirada por falta de confirmação (lugares liberados)"
  }
];

// 6. Grupos, Excursões e Manifesto de Passageiros
export const GROUP_RESERVATIONS_WITH_MANIFEST = [
  {
    id: "GRP-2026-101",
    bookingCode: "RES-B2B-1089",
    agencyName: "Agência Turismo Brasil",
    groupName: "Excursão Colégio Positivo 3º Ano",
    responsibleName: "Prof. Marcos Andrade",
    responsiblePhone: "(41) 99871-3320",
    visitDate: "2026-09-28",
    visitTime: "09:00",
    totalPassengers: 45,
    checkedInCount: 0,
    voucherMode: "VOUCHER_MASTER", // 1 Voucher Master para o ônibus todo
    masterQrCode: "DISK.B2B.MASTER.GRP101.99281a",
    passengers: [
      { id: "pax-1", name: "Lucas Henrique Ferreira", doc: "098.412.339-11", type: "ESTUDANTE", seat: "Poltrona 01", checkin: false },
      { id: "pax-2", name: "Beatriz Nogueira Soares", doc: "102.584.992-04", type: "ESTUDANTE", seat: "Poltrona 02", checkin: false },
      { id: "pax-3", name: "Gabriel Siqueira Ramos", doc: "088.129.404-55", type: "ESTUDANTE", seat: "Poltrona 03", checkin: false },
      { id: "pax-4", name: "Prof. Marcos Andrade (Guia)", doc: "541.229.809-12", type: "GUIA_CORTESIA", seat: "Poltrona 04", checkin: false },
      { id: "pax-5", name: "Mariana Alencar Castro", doc: "119.827.441-90", type: "ESTUDANTE", seat: "Poltrona 05", checkin: false },
      { id: "pax-6", name: "Rodrigo Mendes Cunha", doc: "124.991.023-77", type: "ESTUDANTE", seat: "Poltrona 06", checkin: false }
    ]
  },
  {
    id: "GRP-2026-102",
    bookingCode: "RES-B2B-1088",
    agencyName: "Mundo Brasil Turismo",
    groupName: "Melhor Idade Excursões São Paulo",
    responsibleName: "Sra. Dirce Fontes",
    responsiblePhone: "(11) 98112-9980",
    visitDate: "2026-09-26",
    visitTime: "10:00",
    totalPassengers: 32,
    checkedInCount: 0,
    voucherMode: "INDIVIDUAL", // Ingressos nominais individuais
    masterQrCode: "DISK.B2B.MASTER.GRP102.7711ab",
    passengers: [
      { id: "pax-10", name: "Dirce Fontes", doc: "299.110.450-20", type: "IDOSO", seat: "01", checkin: false },
      { id: "pax-11", name: "Sebastião Fontes", doc: "288.401.320-11", type: "IDOSO", seat: "02", checkin: false },
      { id: "pax-12", name: "Nair Maria Silva", doc: "331.009.841-76", type: "IDOSO", seat: "03", checkin: false }
    ]
  }
];

// 7. Central de Divulgação (Mídia Kit Oficial & Atribuição de Afiliado)
export const MARKETING_COLLATERAL_KIT = {
  photos: [
    { id: "ph-1", title: "Entrada Principal e Pórtico Musical", size: "8.4 MB (4K)", dimensions: "3840x2160", url: "/assets/parque-banner.jpg", category: "Arquitetura" },
    { id: "ph-2", title: "Pôr do Sol no Anfiteatro Natural", size: "6.1 MB (4K)", dimensions: "3840x2160", url: "/assets/parque-sunset.jpg", category: "Sunset" },
    { id: "ph-3", title: "Jardins Sonoros & Paisagismo", size: "5.8 MB (4K)", dimensions: "3840x2160", url: "/assets/parque-thumb.jpg", category: "Natureza" },
    { id: "ph-4", title: "Totem Promocional & Banner Vertical", size: "4.2 MB", dimensions: "1080x1920", url: "/assets/sidebar-bottom-promo.jpg", category: "Social" }
  ],
  videos: [
    { id: "vd-1", title: "Vídeo Oficial Promocional 60s (Curitiba Encanta)", format: "MP4 4K / 60fps", duration: "01:00", url: "https://assets.diskingressos.com.br/videos/parque-lerner-promo.mp4" },
    { id: "vd-2", title: "Reels / TikTok Vertical 30s (Experiência Musical)", format: "MP4 1080x1920", duration: "00:30", url: "https://assets.diskingressos.com.br/videos/parque-lerner-reels.mp4" }
  ],
  campaignCopies: [
    {
      id: "cp-1",
      target: "WhatsApp para Grupos & Excursões",
      text: "🚌 Leve seu grupo para conhecer o novo Parque Jaime Lerner na Rua da Música em Curitiba! Uma experiência que une arquitetura inovadora, natureza exuberante e apresentações musicais diárias. Valores especiais para excursões escolares e melhor idade com reserva B2B facilitada e voucher unificado para entrada rápida na catraca. Reserve suas datas antes que as cotas do mês se esgotem!"
    },
    {
      id: "cp-2",
      target: "Instagram & Redes Sociais",
      text: "🎶 Curitiba tem um novo cartão postal que você precisa viver! O Parque Jaime Lerner na Rua da Música traz o encontro perfeito entre natureza e arte sonora. Garanta seus ingressos e viva essa experiência única! Link exclusivo na bio."
    }
  ]
};

// 8. Atribuição: Afiliado Divulgador vs Agência Vendedora B2B
export const ATTRIBUTION_COMPARISON_DATA = [
  {
    id: "ATRIB-901",
    date: "25/09/2026",
    channelType: "AFILIADO_DIVULGACAO",
    actorName: "Curitiba Cult Blog (Afiliado)",
    clientName: "Mariana Costa",
    action: "Divulgação com Link Rastreado / UTM",
    transactionChannel: "Site DiskIngressos Público (B2C)",
    ticketQty: 4,
    orderTotal: 160.00,
    commissionPct: 4.0,
    commissionAmount: 6.40,
    status: "Atribuído"
  },
  {
    id: "ATRIB-902",
    date: "25/09/2026",
    channelType: "AGENCIA_B2B_DIRETA",
    actorName: "Mundo Brasil Turismo",
    clientName: "Excursão Colégio Positivo",
    action: "Reserva de Cota B2B em Lote",
    transactionChannel: "Portal B2B Agência / API",
    ticketQty: 45,
    orderTotal: 1350.00,
    commissionPct: 12.0,
    commissionAmount: 162.00,
    status: "Liquidado em Conta"
  }
];

// 9. API B2B Comercial & Webhooks (Documentação Interativa)
export const B2B_API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/b2b/catalog",
    title: "Catálogo de Produtos & Tarifário",
    desc: "Retorna a grade de ingressos disponíveis com tarifas públicas e tarifas negociadas da agência."
  },
  {
    method: "POST",
    path: "/api/b2b/quote",
    title: "Cotação Comercial em Tempo Real",
    desc: "Calcula preço líquido, taxa Disk (6%), comissão da agência e descontos progressivos por quantidade."
  },
  {
    method: "POST",
    path: "/api/b2b/holds",
    title: "Reserva Temporária de Estoque (Hold)",
    desc: "Segura até N lugares para uma data por um período configurável (TTL) com garantia anti-overselling."
  },
  {
    method: "POST",
    path: "/api/b2b/reservations/confirm",
    title: "Confirmação & Emissão de Pedido",
    desc: "Liquida a reserva (via limite faturado ou PIX instantâneo) e gera os identificadores para vouchers."
  },
  {
    method: "POST",
    path: "/api/b2b/manifest",
    title: "Manifesto Nominal de Passageiros",
    desc: "Envia a relação de passageiros do grupo (Nome, CPF/Documento, Categoria) via JSON ou payload."
  },
  {
    method: "POST",
    path: "/api/b2b/vouchers/issue-group",
    title: "Emissão de Voucher Master / Lote",
    desc: "Gera o Voucher Master unificado com assinatura HMAC-SHA256 ou bilhetes nominais com QR Codes individuais."
  }
];

export const WEBHOOKS_LOG_DATA = [
  {
    id: "wh-001",
    event: "reserva.confirmada",
    timestamp: "25/09/2026 10:14:22",
    agency: "Agência Turismo Brasil",
    payload: {
      reservationId: "RES-B2B-1089",
      groupName: "Excursão Colégio Positivo 3º Ano",
      totalTickets: 45,
      totalAmount: 1431.00,
      status: "CONFIRMED"
    },
    status: 200,
    response: "OK (Acknowledged)"
  },
  {
    id: "wh-002",
    event: "ingresso.emitido",
    timestamp: "25/09/2026 10:14:23",
    agency: "Agência Turismo Brasil",
    payload: {
      voucherId: "VCH-2026-901",
      voucherMode: "MASTER_QR",
      qrCodeString: "DISK.B2B.eyJyaWQiOiJSRVMtQjJCLTEwODkiLCJhaWQiOiJhZy0wNiJ9.7f89d1"
    },
    status: 200,
    response: "OK"
  },
  {
    id: "wh-003",
    event: "reserva.expirada",
    timestamp: "24/09/2026 18:00:01",
    agency: "Curitiba Tour",
    payload: {
      holdId: "HOLD-779",
      quantityReleased: 50,
      reason: "TTL Expirado sem confirmação nominal"
    },
    status: 200,
    response: "OK"
  }
];

// =========================================================================
// MÓDULO RELATÓRIOS & INTELIGÊNCIA OPERACIONAL (AGÊNCIA → VENDA → ACESSO)
// =========================================================================

export const REPORTS_EXECUTIVE_DATA = {
  totalAgencies: 487,
  activeWithSales: 291,
  ticketsSold: 8421,
  grossSalesAmount: 842100.00,
  actualParkAccesses: 6937,
  utilizationRate: 82.4
};

// Venda × Acesso: Cruzamento por Agência com Drill-down nos acessos individuais
export const AGENCY_SALES_VS_ACCESS_DATA = [
  {
    id: "ag-01",
    name: "Agência Turismo ABC",
    city: "Curitiba",
    state: "PR",
    ordersCount: 428,
    ticketsSold: 1284,
    revenue: 128400.00,
    ticketsUsed: 1037,
    ticketsUnused: 247,
    utilizationRate: 80.8,
    cancelledTickets: 31,
    commissionAmount: 10272.00,
    accessLogs: [
      { time: "25/09 10:42", ticketId: "ING-82741", orderId: "PED-9241", qrCode: "•••8721", product: "Entrada Parque", gate: "Catraca 01 - Principal", status: "Autorizado" },
      { time: "25/09 10:41", ticketId: "ING-82738", orderId: "PED-9237", qrCode: "•••3491", product: "Entrada Parque", gate: "Catraca 02 - Grupos", status: "Autorizado" },
      { time: "25/09 10:40", ticketId: "ING-82722", orderId: "PED-9218", qrCode: "•••1942", product: "Entrada Parque", gate: "Catraca 01 - Principal", status: "Autorizado" },
      { time: "25/09 10:38", ticketId: "ING-82691", orderId: "PED-9204", qrCode: "•••9912", product: "Sunset Cultural VIP", gate: "Catraca 03 - VIP", status: "Recusado" }
    ]
  },
  {
    id: "ag-02",
    name: "Viagens CWB Excursões",
    city: "São Paulo",
    state: "SP",
    ordersCount: 312,
    ticketsSold: 980,
    revenue: 98000.00,
    ticketsUsed: 842,
    ticketsUnused: 138,
    utilizationRate: 85.9,
    cancelledTickets: 14,
    commissionAmount: 9800.00,
    accessLogs: [
      { time: "25/09 10:35", ticketId: "ING-82650", orderId: "PED-9188", qrCode: "•••4512", product: "Excursão Escolar", gate: "Catraca 02 - Grupos", status: "Autorizado" },
      { time: "25/09 10:34", ticketId: "ING-82649", orderId: "PED-9188", qrCode: "•••4513", product: "Excursão Escolar", gate: "Catraca 02 - Grupos", status: "Autorizado" }
    ]
  },
  {
    id: "ag-03",
    name: "Mundo Brasil Turismo",
    city: "São Paulo",
    state: "SP",
    ordersCount: 480,
    ticketsSold: 1540,
    revenue: 154000.00,
    ticketsUsed: 1290,
    ticketsUnused: 250,
    utilizationRate: 83.7,
    cancelledTickets: 22,
    commissionAmount: 18480.00,
    accessLogs: [
      { time: "25/09 10:30", ticketId: "ING-82600", orderId: "PED-9150", qrCode: "•••6781", product: "Tour Arquitetônico", gate: "Catraca 01 - Principal", status: "Autorizado" }
    ]
  },
  {
    id: "ag-04",
    name: "Operadora 123 Sul",
    city: "Florianópolis",
    state: "SC",
    ordersCount: 195,
    ticketsSold: 640,
    revenue: 64000.00,
    ticketsUsed: 510,
    ticketsUnused: 130,
    utilizationRate: 79.6,
    cancelledTickets: 8,
    commissionAmount: 6400.00,
    accessLogs: [
      { time: "25/09 09:55", ticketId: "ING-82510", orderId: "PED-9080", qrCode: "•••1124", product: "Entrada Parque", gate: "Catraca 01 - Principal", status: "Autorizado" }
    ]
  }
];

// Relatório Geográfico Nacional Consolidado
export const GEOGRAPHIC_NATIONAL_DATA = [
  { stateUf: "PR", stateName: "Paraná", agenciesCount: 82, activeSelling: 61, ticketsSold: 3842, revenue: 384200.00, sharePct: 45.6 },
  { stateUf: "SP", stateName: "São Paulo", agenciesCount: 74, activeSelling: 48, ticketsSold: 2917, revenue: 291700.00, sharePct: 34.6 },
  { stateUf: "SC", stateName: "Santa Catarina", agenciesCount: 41, activeSelling: 32, ticketsSold: 1683, revenue: 168300.00, sharePct: 20.0 },
  { stateUf: "RS", stateName: "Rio Grande do Sul", agenciesCount: 37, activeSelling: 25, ticketsSold: 1284, revenue: 128400.00, sharePct: 15.2 },
  { stateUf: "MG", stateName: "Minas Gerais", agenciesCount: 29, activeSelling: 17, ticketsSold: 892, revenue: 89200.00, sharePct: 10.6 }
];

// Relatório de Agências Sem Produção (Ação Comercial Imediata)
export const AGENCIES_ZERO_SALES_DATA = [
  { id: "ag-901", name: "Turismo ABC Campinas", city: "Campinas", state: "SP", registeredAt: "03/08/2026", lastSale: "Nunca vendeu", daysInactive: 53, contactName: "Ana Clara Silva", phone: "(19) 98711-2233" },
  { id: "ag-902", name: "Viagens XPTO Norte", city: "Londrina", state: "PR", registeredAt: "12/07/2026", lastSale: "42 dias atrás", daysInactive: 42, contactName: "Carlos Eduardo", phone: "(43) 99122-4455" },
  { id: "ag-903", name: "Turismo Sul Catarinense", city: "Joinville", state: "SC", registeredAt: "01/06/2026", lastSale: "67 dias atrás", daysInactive: 67, contactName: "Patrícia Souza", phone: "(47) 98844-7711" },
  { id: "ag-904", name: "Belo Horizonte Viagens", city: "Belo Horizonte", state: "MG", registeredAt: "15/08/2026", lastSale: "Nunca vendeu", daysInactive: 41, contactName: "Rodrigo Toledo", phone: "(31) 98455-9900" }
];

// Relatório de Campanhas de Marketing
export const MARKETING_CAMPAIGNS_DATA = [
  {
    id: "CAMP-FERIAS-2026",
    title: "Férias no Parque Jaime Lerner",
    period: "01/12/2026 → 31/01/2027",
    status: "Ativa",
    participatingAgencies: 127,
    linksGenerated: 189,
    clicksCount: 18420,
    ordersCount: 824,
    ticketsSold: 1471,
    revenue: 147100.00,
    ticketsUsed: 1038,
    ticketsUnused: 433,
    conversionPct: 4.47
  },
  {
    id: "CAMP-PRIMAVERA-2026",
    title: "Primavera Cultural na Rua da Música",
    period: "01/09/2026 → 30/11/2026",
    status: "Ativa",
    participatingAgencies: 94,
    linksGenerated: 142,
    clicksCount: 12150,
    ordersCount: 510,
    ticketsSold: 980,
    revenue: 98000.00,
    ticketsUsed: 712,
    ticketsUnused: 268,
    conversionPct: 4.20
  }
];

// Acessos das Catracas em Tempo Real
export const REAL_TIME_GATE_ACCESS_LOGS = [
  { id: "acc-101", time: "10:42", date: "25/09/2026", ticketId: "ING-82741", orderId: "PED-9241", qrCode: "•••8721", agencyName: "Agência Turismo ABC", product: "Entrada Geral Parque", gate: "Catraca 01 - Principal", status: "Autorizado", attendeeName: "Lucas H. Ferreira" },
  { id: "acc-102", time: "10:41", date: "25/09/2026", ticketId: "ING-82738", orderId: "PED-9237", qrCode: "•••3491", agencyName: "Agência Turismo ABC", product: "Entrada Geral Parque", gate: "Catraca 02 - Grupos", status: "Autorizado", attendeeName: "Beatriz N. Soares" },
  { id: "acc-103", time: "10:40", date: "25/09/2026", ticketId: "ING-82722", orderId: "PED-9218", qrCode: "•••1942", agencyName: "Mundo Brasil Turismo", product: "Entrada Geral Parque", gate: "Catraca 01 - Principal", status: "Autorizado", attendeeName: "Gabriel S. Ramos" },
  { id: "acc-104", time: "10:38", date: "25/09/2026", ticketId: "ING-82691", orderId: "PED-9204", qrCode: "•••9912", agencyName: "Agência Turismo ABC", product: "Sunset Cultural VIP", gate: "Catraca 03 - VIP", status: "Recusado", reason: "Ingresso já utilizado às 09:15", attendeeName: "Desconhecido" },
  { id: "acc-105", time: "10:35", date: "25/09/2026", ticketId: "ING-82650", orderId: "PED-9188", qrCode: "•••4512", agencyName: "Viagens CWB Excursões", product: "Excursão Escolar", gate: "Catraca 02 - Grupos", status: "Autorizado", attendeeName: "Mariana Alencar" }
];

// Produtos e Pacotes B2B Comercializáveis
export const PRODUCTS_AND_PACKAGES_DATA = [
  {
    id: "PROD-01",
    name: "Ingresso Parque Jaime Lerner - Geral",
    category: "Ingresso Regular",
    authorizedAgencies: "Todas as Homologadas",
    publicPrice: 40.00,
    b2bPrice: 30.00,
    marginB2B: 25.0,
    validity: "Qualquer dia (Terça a Domingo)",
    status: "Ativo"
  },
  {
    id: "PROD-02",
    name: "Sunset Cultural VIP com Welcome Drink",
    category: "Experiência Premium",
    authorizedAgencies: "Agências Ouro e Diamante",
    publicPrice: 60.00,
    b2bPrice: 48.00,
    marginB2B: 20.0,
    validity: "Sextas e Sábados (17:00)",
    status: "Ativo"
  },
  {
    id: "PROD-03",
    name: "Pacote Excursão Escolar + Tour Arquitetônico",
    category: "Pacote de Grupo (Mín. 20 pax)",
    authorizedAgencies: "Agências de Turismo Pedagógico",
    publicPrice: 50.00,
    b2bPrice: 28.00,
    marginB2B: 44.0,
    validity: "Dias Úteis com Agendamento Prévio",
    status: "Ativo"
  },
  {
    id: "PROD-04",
    name: "Combo Curitiba Cultural: Parque Lerner + MON",
    category: "Passaporte Integrado",
    authorizedAgencies: "Operadoras Nacionais",
    publicPrice: 75.00,
    b2bPrice: 55.00,
    marginB2B: 26.6,
    validity: "Válido por 3 dias",
    status: "Ativo"
  }
];

// Vendas e Pedidos Originados pelas Agências
export const ORDERS_SALES_LIST = [
  { id: "PED-9241", date: "25/09/2026 09:12", agencyName: "Agência Turismo ABC", buyerName: "Lucas Henrique Ferreira", product: "Ingresso Geral (3x)", totalTickets: 3, totalAmount: 90.00, paymentStatus: "Pago", channel: "Portal B2B", usedTickets: 3 },
  { id: "PED-9237", date: "25/09/2026 08:44", agencyName: "Agência Turismo ABC", buyerName: "Caravana Positivo", product: "Excursão Escolar (45x)", totalTickets: 45, totalAmount: 1431.00, paymentStatus: "Faturado 30D", channel: "API B2B", usedTickets: 45 },
  { id: "PED-9218", date: "24/09/2026 16:30", agencyName: "Mundo Brasil Turismo", buyerName: "Melhor Idade SP", product: "Ingresso Geral + Tour (32x)", totalTickets: 32, totalAmount: 1024.00, paymentStatus: "Pago", channel: "Portal B2B", usedTickets: 28 },
  { id: "PED-9204", date: "24/09/2026 14:15", agencyName: "Viagens CWB Excursões", buyerName: "Família Silveira", product: "Sunset Cultural (4x)", totalTickets: 4, totalAmount: 192.00, paymentStatus: "Pago", channel: "Link UTM Afiliado", usedTickets: 4 }
];
