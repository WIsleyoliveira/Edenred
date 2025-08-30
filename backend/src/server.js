import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurações
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar configuração do banco
import { obterAdaptadorBanco } from './config/dbAdapter.js';

// Importar middlewares
import { apiRateLimit } from './middleware/validation.js';

// Importar rotas
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import companyRoutes from './routes/companies.js';
import consultationRoutes from './routes/consultations.js';
import landscapeRoutes from './routes/landscapes.js';
import uploadRoutes from './routes/upload.js';

const app = express();

// Importar inicialização do sistema
import { inicializarSistema } from './utils/initializeSystem.js';

// Inicialização assíncrona
const inicializarAplicacao = async () => {
  try {
    // Conectar ao banco de dados
    const adaptador = obterAdaptadorBanco();
    await adaptador.conectar();
    console.log('✅ Banco de dados conectado com sucesso');
    
    // Inicializar dados do sistema
    const resultado = await inicializarSistema();
    console.log('🎉 Sistema Edenred pronto para uso!');
    console.log('\n🔑 Credenciais disponíveis:');
    resultado.credenciais.forEach(cred => {
      console.log(`   ${cred.tipo}: ${cred.email} / ${cred.senha}`);
    });
    console.log('');
    
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
    process.exit(1);
  }
};

// Middlewares de segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"],
    },
  },
}));

// Configuração CORS
const opcoesCors = {
  origin: function (origin, callback) {
    // Em desenvolvimento, permitir todas as origens localhost
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      const allowedOrigins = process.env.ORIGENS_CORS_PERMITIDAS ? 
        process.env.ORIGENS_CORS_PERMITIDAS.split(',') : 
        ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Não permitido pelo CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(opcoesCors));

// Middlewares gerais
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if ((process.env.AMBIENTE_EXECUCAO || 'desenvolvimento') === 'desenvolvimento') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting global
app.use('/api/', apiRateLimit);

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando normalmente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.AMBIENTE_EXECUCAO || 'desenvolvimento'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API do Sistema de Consulta CNPJ',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      companies: '/api/companies',
      consultations: '/api/consultations',
      landscapes: '/api/landscapes',
      upload: '/api/upload'
    }
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/landscapes', landscapeRoutes);
app.use('/api/upload', uploadRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.originalUrl} não encontrada`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro capturado pelo middleware global:', err);

  let error = { ...err };
  error.message = err.message;

  // Erro de limite de tamanho do payload
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Arquivo muito grande. Tamanho máximo: 10MB',
      code: 'PAYLOAD_TOO_LARGE'
    });
  }

  // Erro padrão
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor',
    code: error.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.AMBIENTE_EXECUCAO === 'desenvolvimento' && { stack: err.stack })
  });
});

// Configurar porta
const PORT = process.env.PORTA_SERVIDOR || 5000;

// Inicializar app e banco
inicializarAplicacao();

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em modo ${process.env.AMBIENTE_EXECUCAO || 'desenvolvimento'}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}\n`);
});

// Lidar com fechamento graceful
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM recebido. Fechando servidor graciosamente...');
  server.close(() => {
    console.log('✅ Servidor fechado.');
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT recebido. Fechando servidor graciosamente...');
  server.close(() => {
    console.log('✅ Servidor fechado.');
    process.exit(0);
  });
});

// Lidar com rejeições de promises não capturadas
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default app;

// so pra enviar
