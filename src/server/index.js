import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger for audit
app.use((req, res, next) => {
  console.log(`[PDT-API] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Mount API routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[PDT-API Error]:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro interno no servidor da DiskIngressos',
    message: err.message
  });
});

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 DiskIngressos PDT API REST rodando com sucesso!`);
  console.log(`📡 URL Base: http://localhost:${PORT}/api`);
  console.log(`🎫 Rotas B2B: http://localhost:${PORT}/api/b2b/agencies`);
  console.log(`👥 Equipe Vendas: http://localhost:${PORT}/api/sales-agents`);
  console.log(`=======================================================`);
});

// Error traps
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]:', reason);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

export default app;
