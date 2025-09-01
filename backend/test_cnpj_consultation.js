import { consultCNPJWithFallback, formatCNPJ } from './src/utils/cnpjService.js';
import { obterAdaptadorBanco } from './src/config/dbAdapter.js';
import Consultation from './src/models/Consultation.js';

// Configuração de teste
const TEST_CNPJ = '11.222.333/0001-81'; // CNPJ fictício para teste
const TEST_USER_ID = 'test-user-123';

async function testarConsultaCNPJ() {
  console.log('🧪 Iniciando teste de consulta CNPJ...\n');
  
  const db = obterAdaptadorBanco();
  const startTime = Date.now();
  
  try {
    // Conectar ao banco
    console.log('📡 Conectando ao banco de dados...');
    await db.conectar();
    console.log('✅ Conexão estabelecida!\n');
    
    // Criar dados da consulta
    console.log('📝 Criando dados da consulta...');
    const consultationData = Consultation.createDefaultConsultationData({
      cnpj: TEST_CNPJ,
      user: TEST_USER_ID,
      status: 'PENDING',
      metadata: {
        userAgent: 'Test Agent',
        ipAddress: '127.0.0.1'
      }
    });
    console.log('Dados da consulta:', consultationData);
    
    try {
      // Simular consulta à API
      console.log('\n🔍 Tentando consultar CNPJ nas APIs externas...');
      const apiResult = await consultCNPJWithFallback(TEST_CNPJ);
      
      // Atualizar dados da consulta com sucesso
      consultationData.status = 'SUCCESS';
      consultationData.source = apiResult.source;
      consultationData.result = apiResult.data;
      consultationData.responseTime = Consultation.calculateResponseTime(startTime);
      
      console.log('✅ Consulta à API bem-sucedida!');
      console.log('Fonte:', apiResult.source);
      
    } catch (apiError) {
      console.log('❌ Erro na consulta à API:', apiError.message);
      
      // Registrar erro na consulta
      consultationData.status = 'ERROR';
      consultationData.error = {
        message: apiError.message,
        code: 'API_ERROR',
        details: apiError.stack
      };
      consultationData.responseTime = Consultation.calculateResponseTime(startTime);
    }
    
    // Salvar consulta no banco de dados
    console.log('\n💾 Salvando consulta no banco de dados...');
    const savedConsultation = await db.criarConsulta(consultationData);
    
    console.log('✅ Consulta salva com sucesso!');
    console.log('ID da consulta:', savedConsultation.id);
    console.log('Status:', savedConsultation.status);
    console.log('Tempo de resposta:', savedConsultation.responseTime, 'ms');
    
    // Verificar se a consulta foi salva corretamente
    console.log('\n🔍 Verificando se a consulta foi salva...');
    const retrievedConsultation = await db.buscarConsultaPorId(savedConsultation.id);
    
    if (retrievedConsultation) {
      console.log('✅ Consulta encontrada no banco!');
      console.log('CNPJ:', retrievedConsultation.cnpj);
      console.log('Usuário:', retrievedConsultation.user);
      console.log('Data de criação:', retrievedConsultation.criadoEm);
    } else {
      console.log('❌ Consulta não encontrada no banco!');
    }
    
    // Listar consultas do usuário
    console.log('\n📋 Listando consultas do usuário...');
    const userConsultations = await db.buscarConsultasPorUsuario(TEST_USER_ID);
    console.log(`Encontradas ${userConsultations.length} consulta(s) do usuário`);
    
    // Obter estatísticas
    console.log('\n📊 Obtendo estatísticas do usuário...');
    const stats = await db.obterEstatisticasConsulta(TEST_USER_ID);
    console.log('Estatísticas:', stats);
    
    console.log('\n🎉 Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    // Desconectar do banco
    await db.desconectar();
    console.log('🔌 Desconectado do banco de dados');
  }
}

// Executar teste se o arquivo for executado diretamente
if (process.argv[1].includes('test_cnpj_consultation.js')) {
  testarConsultaCNPJ()
    .then(() => {
      console.log('\n✅ Script de teste finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erro fatal no teste:', error);
      process.exit(1);
    });
}

export default testarConsultaCNPJ;
