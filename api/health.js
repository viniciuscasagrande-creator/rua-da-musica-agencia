export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'diskingressos-equipe-vendas-b2b',
    operator: 'Parque Jaime Lerner — Rua da Música (Curitiba - PR)',
    productionUrl: 'https://rua-da-musica-agencia.vercel.app/',
    adminFeeBps: 600,
    surfaces: ['operator', 'agency', 'producer'],
    timestamp: new Date().toISOString()
  });
}
