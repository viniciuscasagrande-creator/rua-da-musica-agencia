# DiskIngressos — Equipe de Vendas & Distribuição Turística B2B

**Link Oficial (Produção Vercel):** [https://rua-da-musica-agencia.vercel.app/](https://rua-da-musica-agencia.vercel.app/)

Ecossistema integrado ao **PDT DiskIngressos** para o **Parque Jaime Lerner (Rua da Música — Curitiba/PR)**, contemplando 3 superfícies operacionais:
1. **Painel do Operador (Parque Jaime Lerner):** Gestão B2B, agências credenciadas, tarifário com taxa administrativa de 6% (`600 bps`), estoque centralizado e vouchers de grupos.
2. **Portal da Agência Parceira:** Wizard de compra B2B em 5 etapas, reservas de excursões, emissão de vouchers QR Code, extrato de cota e kit de mídia.
3. **Painel do Produtor (Equipe de Vendas & Agências):** Gestão de Promoters e Divulgadores, 4 modelos de comissão, links rastreáveis + QR Code e razão financeiro *Append-Only* (`CommissionEntry`).

---

## Estrutura de Pastas do Projeto

```text
├── api/                          # Funções Serverless (Vercel API)
│   └── health.js                 # Healthcheck da operação B2B (/api/health)
├── docs/                         # Documentação, escopo e materiais de referência
│   ├── arquitetura/              # Diagrama de arquitetura e rascunho Prisma original
│   ├── arquivos-originais/       # Vídeo de demonstração (.mp4) e pacote de referência (.zip)
│   ├── escopo/                   # Escopo técnico (.docx), apresentação (.pdf) e instruções
│   └── telas-referencia/         # Capturas de tela originais de referência visual
├── prisma/                       # Modelagem de banco de dados PostgreSQL
│   └── schema.prisma             # Models: SalesAgent, Agency, AgencyEvent, GroupReservation, CommissionEntry...
├── server/                       # Regras de negócio backend (Node.js / TypeScript)
│   └── services/
│       ├── b2bDistributionService.ts  # Precificação B2B (6%) e reserva transacional com idempotência
│       └── salesTeamService.ts        # Cálculo de comissão e estorno append-only (REVERSAL)
├── src/                          # Aplicação Frontend (React 18 + Tailwind CSS v4 + Vite)
│   ├── components/
│   │   ├── agency_portal/        # Superfície 2: Portal da Agência e Wizard de Reserva B2B
│   │   ├── common/               # Modal de Voucher Oficial com QR Code e Check-in
│   │   ├── layout/               # Barra de navegação superior e seletor de superfícies
│   │   ├── operator_panel/       # Superfície 1: Painel do Operador (Parque Jaime Lerner)
│   │   └── producer_panel/       # Superfície 3: Painel do Produtor (Equipe de Vendas & Agências)
│   ├── data/
│   │   └── mockData.js           # Dados simulados alinhados ao Ledger e Estoque Único do PDT
│   ├── App.jsx                   # Roteamento das 3 superfícies
│   ├── index.css                 # Configuração Tailwind CSS v4
│   └── main.jsx                  # Ponto de entrada React
├── index.html                    # HTML principal com metadados OpenGraph e URL canônica
├── package.json                  # Dependências e scripts (dev, build, preview)
├── vercel.json                   # Configuração de deploy, cache e SPA rewrites na Vercel
└── vite.config.js                # Configuração do bundler Vite
```

---

## Comandos Principais

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento (http://localhost:5173/)
npm run dev

# Gerar build de produção (pasta dist/)
npm run build
```
