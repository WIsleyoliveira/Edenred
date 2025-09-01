import { obterAdaptadorBanco } from './src/config/dbAdapter.js';

async function verificarUsuarios() {
  const db = obterAdaptadorBanco();
  
  try {
    console.log('🔍 Verificando usuários no banco de dados...\n');
    
    await db.conectar();
    
    // Esta função não existe no adaptador, então vamos usar uma forma alternativa
    // Vamos tentar buscar por emails comuns
    const emailsComuns = [
      'admin@edenred.com',
      'user@edenred.com', 
      'test@test.com',
      'admin@admin.com',
      'user@user.com'
    ];
    
    for (const email of emailsComuns) {
      try {
        const user = await db.buscarUsuarioPorEmail(email);
        if (user) {
          console.log(`👤 Usuário encontrado:`);
          console.log(`   Email: ${user.email}`);
          console.log(`   ID: ${user.id}`);
          console.log(`   Nome: ${user.name || 'N/A'}`);
          console.log(`   Role: ${user.role || 'N/A'}`);
          console.log(`   isActive: ${user.isActive}`);
          console.log(`   Criado em: ${user.criadoEm || 'N/A'}`);
          console.log('');
        }
      } catch (error) {
        // Ignora erros de usuário não encontrado
      }
    }
    
    console.log('✅ Verificação concluída');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await db.desconectar();
    process.exit(0);
  }
}

verificarUsuarios();
