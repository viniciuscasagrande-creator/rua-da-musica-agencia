# DiskIngressos — Plataforma B2B de Distribuição Turística 2.0

## Parque Jaime Lerner (Rua da Música • Curitiba - PR) & Multi-Atrativo

Plataforma de alta escala desenvolvida para transformar a venda de ingressos do PDT DiskIngressos em um ecossistema completo de **Distribuição Turística B2B**, mantendo a DiskIngressos como **Core Transacional**.

Projetada inicialmente para o **Parque Jaime Lerner**, mas com **arquitetura multi-atrativo reutilizável** para futuros parques, museus e experiências turísticas (ex: MON, Serra Verde Express).

---

## 🏗️ Pilares da Arquitetura B2B 2.0

```text
                    PARQUE JAIME LERNER (ou Atrativo)
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │    DISKINGRESSOS    │
                       │   CORE TRANSACIONAL │
                       └──────────┬──────────┘
                                  │
                          API B2B TURISMO
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       │                          │                          │
       ▼                          ▼                          ▼
 Portal da Agência          Integração API             Link/QR Agência
       │                          │                          │
       └──────────────────────────┼──────────────────────────┘
                                  ▼
                         MOTOR COMERCIAL B2B
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       ▼                          ▼                          ▼
   Contratos               Tarifas/Regras               Comissões
       │                          │                          │
       ▼                          ▼                          ▼
   Reservas                    Pedidos                    Repasse
                                  │
                                  ▼
                         Ingresso / QR Master
```

### Funcionalidades Integradas:

1. **Motor Comercial por Agência:** Contratos comerciais versionados (taxa Disk padrão de 6%, comissão da agência, preço líquido, vigência, limites de crédito, prazos de faturamento 15/30 dias e bloqueio automático).
2. **Tarifário B2B Separado:** Tarifa Pública vs Tarifa Agência B2B vs Grupo 15+ vs Excursão Escolar vs Promocional.
3. **Reserva de Estoque Temporária (Holding com TTL):** Bloqueio temporário de vagas com contagem regressiva e liberação automática anti-overselling.
4. **Grupos & Manifesto Nominal de Passageiros:** `Grupo → Reserva → Passageiros → Ingressos`, com importador de planilhas Excel/CSV e validação.
5. **Voucher Master de Grupo:** Emissão de 1 único QR Code seguro (HMAC-SHA256) para liberação em lote de caravanas na catraca, ou bilhetes individuais nominais.
6. **Portal de Autoatendimento da Agência:** Painel com limite de crédito faturado, cota mensal, manifesto de caravanas, extrato e suporte.
7. **Central de Divulgação (Mídia Kit):** Fotos oficiais 4K, vídeos para redes, copies prontas para WhatsApp/Instagram e gerador de links com UTM.
8. **Atribuição Transparente:** Diferenciação entre Afiliado Divulgador (gerou lead no site B2C) e Agência B2B Direta (reserva de lote).
9. **API B2B Comercial & Webhooks:** Catálogo, cotação, holding, emissão e webhooks em tempo real com simulador interativo.
10. **Sandbox para Homologação:** Chaves de teste (`dk_test_...`) e de produção (`dk_live_...`).
11. **Dashboard Executivo Nacional:** 384 agências ativas, R$ 428 mil vendas B2B, 87 reservas, R$ 512 mil receita, ranking estadual (PR, SP, SC, RS, MG...) e top agências.
12. **Multi-Atrativo Reutilizável:** Chaveamento arquitetural pronto no topo do sistema.

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
