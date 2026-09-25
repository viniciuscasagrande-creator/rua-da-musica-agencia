import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados B2B - Parque Jaime Lerner...');

  // 1. Limpeza de dados prévios (ordem correta de chaves estrangeiras)
  console.log('🧹 Limpando tabelas anteriores...');
  try {
    await prisma.webhookDelivery.deleteMany();
    await prisma.webhookEndpoint.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.commissionEntry.deleteMany();
    await prisma.commissionRule.deleteMany();
    await prisma.saleAttribution.deleteMany();
    await prisma.salesLink.deleteMany();
    await prisma.salesAgent.deleteMany();
    await prisma.groupVoucher.deleteMany();
    await prisma.passenger.deleteMany();
    await prisma.groupReservation.deleteMany();
    await prisma.inventoryHold.deleteMany();
    await prisma.commercialContract.deleteMany();
    await prisma.pricingTier.deleteMany();
    await prisma.agency.deleteMany();
    await prisma.attraction.deleteMany();
  } catch (cleanErr) {
    console.log('Info de limpeza:', cleanErr.message);
  }

  // 2. Atrativo Principal: Parque Jaime Lerner
  console.log('📍 Criando atrativos...');
  const attractionParque = await prisma.attraction.create({
    data: {
      id: 'PRQ-JLERNER-001',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      name: 'Parque Jaime Lerner',
      slug: 'parque-jaime-lerner',
      city: 'Curitiba',
      state: 'PR',
      address: 'Rua da Música, 1000 - Abranches',
      generalCapacity: 3000,
      defaultFeeBps: 600, // 6.0% Taxa B2B
      active: true,
    }
  });

  const attractionMon = await prisma.attraction.create({
    data: {
      id: 'MON-CWB-002',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      name: 'Museu Oscar Niemeyer (Experiências)',
      slug: 'museu-oscar-niemeyer',
      city: 'Curitiba',
      state: 'PR',
      address: 'Rua Marechal Hermes, 999',
      generalCapacity: 4500,
      defaultFeeBps: 600,
      active: true,
    }
  });

  // 3. Tarifário B2B e Preços Parametrizados
  console.log('🎟️ Criando tarifário B2B...');
  const tiers = await Promise.all([
    prisma.pricingTier.create({
      data: {
        id: 'tier-inteira',
        attractionId: attractionParque.id,
        name: 'Ingresso Geral Inteira',
        tierType: 'AGENCY_B2B',
        basePriceCents: 3000, // R$ 30,00
        diskFeeBps: 600,      // 6%
        minQty: 1,
        active: true
      }
    }),
    prisma.pricingTier.create({
      data: {
        id: 'tier-meia',
        attractionId: attractionParque.id,
        name: 'Meia-Entrada Legal (Estudante/Idoso/PCD)',
        tierType: 'AGENCY_B2B',
        basePriceCents: 1500, // R$ 15,00
        diskFeeBps: 600,
        minQty: 1,
        active: true
      }
    }),
    prisma.pricingTier.create({
      data: {
        id: 'tier-tour',
        attractionId: attractionParque.id,
        name: 'Tour Arquitetônico Guiado',
        tierType: 'AGENCY_B2B',
        basePriceCents: 2500, // R$ 25,00
        diskFeeBps: 600,
        minQty: 1,
        active: true
      }
    }),
    prisma.pricingTier.create({
      data: {
        id: 'tier-educativo',
        attractionId: attractionParque.id,
        name: 'Educativo (Excursão Escolar)',
        tierType: 'EXCURSION_SCHOOL',
        basePriceCents: 2000, // R$ 20,00
        diskFeeBps: 600,
        minQty: 15,
        active: true
      }
    }),
    prisma.pricingTier.create({
      data: {
        id: 'tier-sunset',
        attractionId: attractionParque.id,
        name: 'Sunset Cultural VIP com Welcome Drink',
        tierType: 'PROMOTIONAL',
        basePriceCents: 4800, // R$ 48,00
        diskFeeBps: 600,
        minQty: 1,
        active: true
      }
    }),
    prisma.pricingTier.create({
      data: {
        id: 'tier-corp',
        attractionId: attractionParque.id,
        name: 'Grupo Corporativo / Incentivo',
        tierType: 'GROUP_15_PLUS',
        basePriceCents: 2600, // R$ 26,00
        diskFeeBps: 600,
        minQty: 15,
        active: true
      }
    })
  ]);

  // 4. Agências Credenciadas no Portal B2B
  console.log('🏢 Criando agências homologadas...');
  const agencyAg06 = await prisma.agency.create({
    data: {
      id: 'ag-06',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      legalName: 'Agência Turismo Brasil Operadora Nacional',
      tradeName: 'Agência Turismo Brasil',
      document: '10.554.891/0001-19',
      cadastur: '10.554.891/0001-19',
      contactName: 'Marcos Vinícius',
      email: 'marcos@turismobrasil.com.br',
      phone: '(41) 3210-9900',
      city: 'Curitiba',
      state: 'PR',
      status: 'ACTIVE',
      creditLimitCents: 8000000, // R$ 80.000,00
      creditUsedCents: 2780000,  // R$ 27.800,00
    }
  });

  const agencyAg01 = await prisma.agency.create({
    data: {
      id: 'ag-01',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      legalName: 'Mundo Brasil Agência de Viagens e Eventos Ltda',
      tradeName: 'Mundo Brasil Turismo',
      document: '18.245.912/0001-44',
      cadastur: '18.245.912/0001-44',
      contactName: 'Roberto Silveira',
      email: 'roberto@mundobrasiltur.com.br',
      phone: '(11) 3422-9800',
      city: 'São Paulo',
      state: 'SP',
      status: 'ACTIVE',
      creditLimitCents: 5000000,
      creditUsedCents: 1845000,
    }
  });

  const agencyAg02 = await prisma.agency.create({
    data: {
      id: 'ag-02',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      legalName: 'Viva Viagens Operadora e Receptivo Eireli',
      tradeName: 'Viva Viagens',
      document: '24.890.112/0001-08',
      cadastur: '24.890.112/0001-08',
      contactName: 'Fernanda Albuquerque',
      email: 'reservas@vivaviagens.com.br',
      phone: '(21) 2544-7711',
      city: 'Rio de Janeiro',
      state: 'RJ',
      status: 'ACTIVE',
      creditLimitCents: 3000000,
      creditUsedCents: 1260000,
    }
  });

  const agencyAg03 = await prisma.agency.create({
    data: {
      id: 'ag-03',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      legalName: 'Curitiba City Tour & Receptivo Ltda',
      tradeName: 'Curitiba Tour',
      document: '09.112.443/0001-92',
      cadastur: '09.112.443/0001-92',
      contactName: 'Carlos Eduardo Mendes',
      email: 'carlos@curitibatour.com.br',
      phone: '(41) 3039-4400',
      city: 'Curitiba',
      state: 'PR',
      status: 'ACTIVE',
      creditLimitCents: 4000000,
      creditUsedCents: 860000,
    }
  });

  const agencyAg04 = await prisma.agency.create({
    data: {
      id: 'ag-04',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      legalName: 'Sul Brasil Receptivo e Excursões Ltda',
      tradeName: 'Sul Turismo',
      document: '31.776.205/0001-30',
      cadastur: '31.776.205/0001-30',
      contactName: 'Patrícia Diniz',
      email: 'patricia@sulturismo.com.br',
      phone: '(48) 3221-8855',
      city: 'Florianópolis',
      state: 'SC',
      status: 'ACTIVE',
      creditLimitCents: 2000000,
      creditUsedCents: 640000,
    }
  });

  const agencyAg05 = await prisma.agency.create({
    data: {
      id: 'ag-05',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      legalName: 'Experiências Brasileiras Turismo e Cultura S/A',
      tradeName: 'Experiências BR',
      document: '42.009.617/0001-81',
      cadastur: '42.009.617/0001-81',
      contactName: 'Thiago Ramos',
      email: 'thiago@experienciasbr.com',
      phone: '(31) 3345-6677',
      city: 'Belo Horizonte',
      state: 'MG',
      status: 'PENDING',
      creditLimitCents: 1000000,
      creditUsedCents: 0,
    }
  });

  // 5. Contratos Comerciais Versionados (Motor Comercial 2.0)
  console.log('📜 Criando contratos comerciais...');
  await prisma.commercialContract.createMany({
    data: [
      {
        id: 'CTR-2026-001',
        agencyId: agencyAg01.id,
        attractionId: attractionParque.id,
        version: 2,
        diskFeeBps: 600, // 6%
        agencyCommissionBps: 1200, // 12%
        paymentTermsDays: 15,
        cancellationWindowHours: 48,
        status: 'ACTIVE',
        notes: 'Bônus de 2% para grupos acima de 40 passageiros'
      },
      {
        id: 'CTR-2026-002',
        agencyId: agencyAg02.id,
        attractionId: attractionParque.id,
        version: 1,
        diskFeeBps: 600,
        agencyCommissionBps: 1000, // 10%
        paymentTermsDays: 30,
        cancellationWindowHours: 24,
        status: 'ACTIVE',
        notes: 'Preço líquido direto acordado para dias úteis'
      },
      {
        id: 'CTR-2026-003',
        agencyId: agencyAg06.id,
        attractionId: attractionParque.id,
        version: 3,
        diskFeeBps: 600,
        agencyCommissionBps: 1500, // 15%
        paymentTermsDays: 30,
        cancellationWindowHours: 48,
        status: 'ACTIVE',
        notes: 'Parceiro Estratégico Regional - Emissão imediata via API'
      },
      {
        id: 'CTR-2026-004',
        agencyId: agencyAg05.id,
        attractionId: attractionParque.id,
        version: 1,
        diskFeeBps: 600,
        agencyCommissionBps: 1000,
        paymentTermsDays: 0, // Pré-pago
        cancellationWindowHours: 72,
        status: 'DRAFT',
        notes: 'Crédito liberado após 3ª compra liquidada'
      }
    ]
  });

  // 6. Reservas de Estoque Temporárias (Holds com TTL)
  console.log('⏳ Criando reservas de estoque temporárias (Holds)...');
  await prisma.inventoryHold.createMany({
    data: [
      {
        id: 'HOLD-781',
        attractionId: attractionParque.id,
        agencyId: agencyAg01.id,
        visitDate: new Date('2026-09-28T09:00:00Z'),
        quantity: 40,
        status: 'HELD',
        expiresAt: new Date(Date.now() + 4 * 3600 * 1000), // expira em 4 horas
        idempotencyKey: 'HOLD-KEY-781-AG01-2026'
      },
      {
        id: 'HOLD-782',
        attractionId: attractionParque.id,
        agencyId: agencyAg02.id,
        visitDate: new Date('2026-09-29T10:00:00Z'),
        quantity: 28,
        status: 'HELD',
        expiresAt: new Date(Date.now() + 2 * 3600 * 1000),
        idempotencyKey: 'HOLD-KEY-782-AG02-2026'
      },
      {
        id: 'HOLD-779',
        attractionId: attractionParque.id,
        agencyId: agencyAg03.id,
        visitDate: new Date('2026-09-27T14:00:00Z'),
        quantity: 50,
        status: 'EXPIRED',
        expiresAt: new Date(Date.now() - 24 * 3600 * 1000),
        idempotencyKey: 'HOLD-KEY-779-AG03-2026'
      }
    ]
  });

  // 7. Reservas de Grupo & Excursões
  console.log('🚌 Criando reservas de grupo e passageiros...');
  const res1089 = await prisma.groupReservation.create({
    data: {
      id: 'RES-B2B-1089',
      attractionId: attractionParque.id,
      agencyId: agencyAg06.id,
      groupName: 'Excursão Colégio Positivo 3º Ano',
      ticketTypeId: 'tier-educativo',
      quantity: 45,
      totalAmountCents: 66780, // R$ 667,80
      diskFeeAmountCents: 3780, // R$ 37,80 (6%)
      commissionAmountCents: 10017, // 15%
      status: 'CONFIRMED',
      expiresAt: new Date('2026-09-28T18:00:00Z'),
      orderId: 'PED-9237',
      paymentMethod: 'FATURADO_30D',
      idempotencyKey: 'IDEMP-RES-1089-2026',
      passengers: {
        create: [
          { fullName: 'Lucas Henrique Ferreira', documentNumber: '098.412.339-11', documentType: 'CPF', category: 'ESTUDANTE', seatOrTag: 'Poltrona 01' },
          { fullName: 'Beatriz Nogueira Soares', documentNumber: '102.584.992-04', documentType: 'CPF', category: 'ESTUDANTE', seatOrTag: 'Poltrona 02' },
          { fullName: 'Gabriel Siqueira Ramos', documentNumber: '088.129.404-55', documentType: 'CPF', category: 'ESTUDANTE', seatOrTag: 'Poltrona 03' },
          { fullName: 'Prof. Marcos Andrade (Guia)', documentNumber: '541.229.809-12', documentType: 'CPF', category: 'GUIA_CORTESIA', seatOrTag: 'Poltrona 04' },
          { fullName: 'Mariana Alencar Castro', documentNumber: '119.827.441-90', documentType: 'CPF', category: 'ESTUDANTE', seatOrTag: 'Poltrona 05' },
          { fullName: 'Rodrigo Mendes Cunha', documentNumber: '124.991.023-77', documentType: 'CPF', category: 'ESTUDANTE', seatOrTag: 'Poltrona 06' }
        ]
      },
      masterVoucher: {
        create: {
          masterQrCode: 'RM.B2B.MASTER.GRP101.99281a',
          signature: 'HMAC_SHA256_PARQUE_LERNER_99281a',
          isMasterOnly: true
        }
      }
    }
  });

  const res1088 = await prisma.groupReservation.create({
    data: {
      id: 'RES-B2B-1088',
      attractionId: attractionParque.id,
      agencyId: agencyAg01.id,
      groupName: 'Melhor Idade Excursões São Paulo',
      ticketTypeId: 'tier-meia',
      quantity: 32,
      totalAmountCents: 115540,
      diskFeeAmountCents: 6540,
      commissionAmountCents: 13864,
      status: 'CONFIRMED',
      expiresAt: new Date('2026-09-26T18:00:00Z'),
      orderId: 'PED-9218',
      paymentMethod: 'PIX_B2B',
      idempotencyKey: 'IDEMP-RES-1088-2026',
      passengers: {
        create: [
          { fullName: 'Dirce Fontes', documentNumber: '299.110.450-20', documentType: 'CPF', category: 'IDOSO', seatOrTag: '01' },
          { fullName: 'Sebastião Fontes', documentNumber: '288.401.320-11', documentType: 'CPF', category: 'IDOSO', seatOrTag: '02' },
          { fullName: 'Nair Maria Silva', documentNumber: '331.009.841-76', documentType: 'CPF', category: 'IDOSO', seatOrTag: '03' }
        ]
      },
      masterVoucher: {
        create: {
          masterQrCode: 'RM.B2B.MASTER.GRP102.7711ab',
          signature: 'HMAC_SHA256_PARQUE_LERNER_7711ab',
          isMasterOnly: false
        }
      }
    }
  });

  // 8. Equipe de Promoters & Divulgadores
  console.log('👥 Criando equipe de vendas e promoters...');
  const agentJoao = await prisma.salesAgent.create({
    data: {
      id: 'sa-01',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      name: 'João Silva',
      email: 'joao.silva@promoter.curitiba.br',
      phone: '(41) 99999-1234',
      status: 'ACTIVE',
      links: {
        create: [
          {
            id: 'link-joao-01',
            eventId: 'EVT-PARQUE-JAIME-LERNER-2026',
            code: 'joao-silva',
            utmSource: 'promoter',
            utmMedium: 'whatsapp',
            utmCampaign: 'primavera_cultural'
          }
        ]
      }
    }
  });

  const agentMaria = await prisma.salesAgent.create({
    data: {
      id: 'sa-02',
      producerId: 'PROD-PARQUE-JAIME-LERNER',
      name: 'Maria Souza',
      email: 'maria.souza@promoter.curitiba.br',
      phone: '(41) 98888-5678',
      status: 'ACTIVE',
      links: {
        create: [
          {
            id: 'link-maria-01',
            eventId: 'EVT-PARQUE-JAIME-LERNER-2026',
            code: 'maria-souza',
            utmSource: 'promoter',
            utmMedium: 'instagram',
            utmCampaign: 'sunset_vip'
          }
        ]
      }
    }
  });

  // 9. Chaves de API para Integração ERP B2B
  console.log('🔑 Criando chaves de API para agências...');
  await prisma.apiKey.create({
    data: {
      agencyId: agencyAg06.id,
      name: 'Integração ERP Produção - Agência Turismo Brasil',
      environment: 'PRODUCTION',
      keyPrefix: 'dk_live_',
      keyHash: 'hash_sha256_live_token_atb_2026',
      active: true,
      lastUsedAt: new Date()
    }
  });

  await prisma.apiKey.create({
    data: {
      agencyId: agencyAg01.id,
      name: 'Sandbox Testes B2B - Mundo Brasil',
      environment: 'SANDBOX',
      keyPrefix: 'dk_test_',
      keyHash: 'hash_sha256_test_token_mb_2026',
      active: true,
      lastUsedAt: new Date()
    }
  });

  // 10. Webhooks Endpoints & Histórico de Disparos
  console.log('📡 Criando endpoints de webhooks...');
  const webhookAg06 = await prisma.webhookEndpoint.create({
    data: {
      agencyId: agencyAg06.id,
      url: 'https://erp.turismobrasil.com.br/api/webhooks/parquejaimelerner',
      secret: 'whsec_b2b_turismobrasil_secret_key_2026',
      events: JSON.stringify(['reserva.confirmada', 'ingresso.emitido', 'reserva.expirada']),
      active: true,
      deliveries: {
        create: [
          {
            event: 'reserva.confirmada',
            payload: JSON.stringify({
              reservationId: 'RES-B2B-1089',
              groupName: 'Excursão Colégio Positivo 3º Ano',
              totalTickets: 45,
              totalAmount: 667.80,
              status: 'CONFIRMED'
            }),
            statusCode: 200,
            success: true
          },
          {
            event: 'ingresso.emitido',
            payload: JSON.stringify({
              voucherId: 'VCH-2026-901',
              voucherMode: 'MASTER_QR',
              qrCodeString: 'RM.B2B.eyJyaWQiOiJSRVMtQjJCLTEwODkiLCJhaWQiOiJhZy0wNiJ9.7f89d1'
            }),
            statusCode: 200,
            success: true
          }
        ]
      }
    }
  });

  console.log('✅ SEED CONCLUÍDO COM SUCESSO!');
  console.log(`📊 Estatísticas cadastradas no dev.db:`);
  console.log(`   - 2 Atrativos turísticos`);
  console.log(`   - 6 Categorias de ingressos B2B parametrizados`);
  console.log(`   - 6 Agências de turismo credenciadas`);
  console.log(`   - 4 Contratos comerciais com motor de taxas (6% Disk, comissões versionadas)`);
  console.log(`   - 3 Reservas temporárias de estoque (Holds) com TTL`);
  console.log(`   - 2 Reservas de grupo com manifesto de passageiros e vouchers Master HMAC`);
  console.log(`   - 2 Promoters e divulgadores com links UTM`);
  console.log(`   - 2 Chaves de API B2B (Live & Sandbox)`);
  console.log(`   - 1 Endpoint de webhook com registros de entrega`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
