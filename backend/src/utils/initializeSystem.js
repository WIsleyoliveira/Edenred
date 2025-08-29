import { obterAdaptadorBanco } from '../config/dbAdapter.js';
import bcryptjs from 'bcryptjs';

// Dados de teste para serem inseridos
const dadosIniciais = {
  usuarios: [
    {
      userName: 'Admin Edenred',
      name: 'Admin Edenred',
      email: 'admin@edenred.com.br',
      password: '123456',
      role: 'admin',
      permissions: ['read', 'write', 'admin']
    },
    {
      userName: 'Consultor Edenred',
      name: 'Consultor Edenred', 
      email: 'consultor@edenred.com.br',
      password: 'consultor123',
      role: 'consultant',
      permissions: ['read', 'write']
    }
  ],
  empresas: [
    {
      cnpj: '12345678000190',
      razaoSocial: 'EMPRESA TESTE EDENRED LTDA',
      nomeFantasia: 'Edenred Teste',
      situacao: 'ATIVA',
      porte: 'MEDIO',
      telefone: '(11) 9999-8888',
      email: 'contato@teste.com.br',
      endereco: {
        logradouro: 'Rua das Empresas',
        numero: '123',
        cep: '01234-567',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      atividade: 'Atividades de consultoria em gestão empresarial'
    }
  ]
};

export const inicializarSistema = async () => {
  try {
    console.log('🚀 Inicializando sistema Edenred...');
    
    const db = obterAdaptadorBanco();
    
    // Verificar se usuários já existem
    const adminExistente = await db.buscarUsuarioPorEmail('admin@edenred.com.br');
    
    if (!adminExistente) {
      console.log('👥 Criando usuários padrão...');
      
      for (const usuario of dadosIniciais.usuarios) {
        try {
          await db.criarUsuario(usuario);
          console.log(`✅ Usuário criado: ${usuario.email}`);
        } catch (error) {
          console.log(`⚠️ Usuário ${usuario.email} já existe ou erro:`, error.message);
        }
      }
    } else {
      console.log('👥 Usuários já existem no sistema');
    }
    
    // Criar empresa de teste
    console.log('🏢 Verificando empresa de teste...');
    const empresaExistente = await db.buscarEmpresaPorCNPJ('12345678000190');
    
    if (!empresaExistente) {
      for (const empresa of dadosIniciais.empresas) {
        await db.criarEmpresa(empresa);
        console.log(`✅ Empresa criada: ${empresa.razaoSocial}`);
      }
    } else {
      console.log('🏢 Empresa de teste já existe');
    }
    
    console.log('🎉 Sistema inicializado com sucesso!');
    
    // Retornar credenciais de teste
    return {
      credenciais: [
        { email: 'admin@edenred.com.br', senha: '123456', tipo: 'Admin' },
        { email: 'consultor@edenred.com.br', senha: 'consultor123', tipo: 'Consultor' }
      ]
    };
    
  } catch (error) {
    console.error('❌ Erro ao inicializar sistema:', error);
    throw error;
  }
};

export default inicializarSistema;
