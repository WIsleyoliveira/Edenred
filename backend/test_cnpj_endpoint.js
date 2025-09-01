import express from 'express';
import { consultCNPJWithFallback, formatCNPJ } from './src/utils/cnpjService.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint de teste sem autenticação
app.post('/test-cnpj', async (req, res) => {
  try {
    console.log('\n🧪 === TESTE CNPJ SEM AUTENTICAÇÃO ===');
    console.log('📋 Body:', req.body);
    
    const { cnpj } = req.body;
    
    if (!cnpj) {
      return res.status(400).json({
        success: false,
        message: 'CNPJ é obrigatório'
      });
    }
    
    console.log('🔍 Testando CNPJ:', cnpj);
    
    const formattedCNPJ = formatCNPJ(cnpj);
    console.log('📝 CNPJ formatado:', formattedCNPJ);
    
    console.log('🚀 Iniciando consulta com fallback...');
    const apiResult = await consultCNPJWithFallback(formattedCNPJ);
    
    console.log('✅ Sucesso! Fonte:', apiResult.source);
    
    res.json({
      success: true,
      message: `CNPJ consultado com sucesso via ${apiResult.source}`,
      data: {
        company: apiResult.data,
        source: apiResult.source
      }
    });
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    
    res.status(400).json({
      success: false,
      message: error.message,
      error: {
        name: error.name,
        stack: error.stack.split('\n').slice(0, 3).join('\n')
      }
    });
  }
});

// Endpoint de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`\n🧪 Servidor de teste rodando na porta ${PORT}`);
  console.log(`🔗 Teste: http://localhost:${PORT}/test-cnpj`);
  console.log(`❤️ Saúde: http://localhost:${PORT}/health`);
  console.log('\n📋 Exemplo de teste:');
  console.log(`curl -X POST -H "Content-Type: application/json" -d "{\\"cnpj\\": \\"11222333000181\\"}" http://localhost:${PORT}/test-cnpj`);
});
