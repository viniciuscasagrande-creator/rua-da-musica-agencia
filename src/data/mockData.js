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
