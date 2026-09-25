# DiskIngressos — Módulo Distribuição Turística B2B & Equipe de Vendas

## Parque Jaime Lerner (Rua da Música • Curitiba - PR)

Aplicação desenvolvida para modernização comercial do PDT DiskIngressos, integrando as duas frentes de venda e distribuição:

1. **Distribuição Turística B2B (Operador & Agências)**
2. **Central de Equipe de Vendas (Promoters & Divulgadores)**

---

## 🏗️ Visão Geral da Arquitetura

Conforme especificado no documento de escopo e no diagrama arquitetural:

- **Superfícies de Frontend (Design System Unificado):**
  - **Painel do Operador:** Gestão de canais credenciados, cotas de inventário por dia, tarifário parametrizável (taxa padrão de 6%), relatórios geográficos por estado e conciliação do Ledger.
  - **Portal da Agência de Turismo:** Wizard simplificado de 5 passos para reservas de grupos e excursões com emissão de vouchers e QR Codes em lote.
  - **Painel do Produtor (Equipe de Vendas):** Gestão de promoters, divulgadores, links rastreáveis, cupons de desconto, metas e motor de comissões.

- **Backend & Banco de Dados:**
  - **API:** Node.js com TypeScript / Express / NestJS, reaproveitando RBAC e autenticação existente do PDT.
  - **Banco:** PostgreSQL com transações ACID (`SELECT ... FOR UPDATE` para cota de inventário e evitar overselling).
  - **Financeiro / Auditoria:** Estrutura *append-only* (sem `UPDATE`/`DELETE` em lançamentos de comissão), garantindo reversão segura de estornos sem perda de histórico.
  - **Cache & Filas:** Redis + BullMQ para cálculo de comissões assíncronas, geração de vouchers em lote e webhooks.
  - **Validação de Ingressos:** QR Code assinado criptograficamente via HMAC-SHA256 (`src/server/services/voucherSigner.js`).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL (opcional para rodar com banco real; a aplicação possui mock data integrado para demonstração)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (se necessário)
cp .env.example .env

# 3. Iniciar o Frontend Vite (Porta 5173)
npm run dev

# 4. Iniciar o Servidor API Node.js/Express (Porta 3001)
npm run server

# 5. Executar lint / verificação de código
npm run lint

# 6. Gerar build de produção otimizado
npm run build
```

---

## 📁 Estrutura de Pastas

```text
├── prisma/
│   └── schema.prisma                  # Schema Prisma incremental com agentes, agências e reservas
├── public/
│   └── assets/                        # Assets oficiais do Parque Jaime Lerner e banners
├── src/
│   ├── components/
│   │   ├── Header.jsx                 # Topbar DiskIngressos com seletor de superfícies
│   │   ├── Sidebar.jsx                # Menu do operador com perfil do Parque Jaime Lerner
│   │   ├── BrazilMap.jsx              # Mapa SVG interativo do Brasil com distribuição por UF
│   │   ├── KPIStats.jsx               # Cards de indicadores operacionais (Receita, Cotas, Taxas)
│   │   ├── Charts.jsx                 # Gráfico de evolução de reservas e origem dos turistas
│   │   ├── SidePriceCard.jsx          # Composição do preço B2B (6%) e pipeline de 7 etapas
│   │   ├── AgencyTable.jsx            # Tabela de agências com filtros e paginação
│   │   ├── NewAgencyModal.jsx         # Cadastro e credenciamento de nova agência parceira
│   │   ├── AgencyDetailModal.jsx      # Visão detalhada da agência e ajuste de cota
│   │   ├── VoucherModal.jsx           # Voucher oficial com QR Code e simulador de catraca
│   │   ├── tabs/                      # Abas operacionais (Tarifário, Reservas, Financeiro)
│   │   ├── agency_portal/             # Portal exclusivo da agência parceira
│   │   └── promoters/                 # Módulo de Equipe de Vendas & Promoters
│   ├── server/
│   │   └── services/                  # Motores de inventário, conciliação e assinatura de voucher
│   ├── data/
│   │   └── mockData.js                # Base de dados consistente com os mockups
│   ├── App.jsx                        # Orquestrador de visualizações e estados globais
│   └── index.css                      # Tailwind CSS v4 styling
└── package.json
```
