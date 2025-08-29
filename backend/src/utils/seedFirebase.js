import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { obterAdaptadorBanco } from '../config/dbAdapter.js';

// Configurar ambiente
dotenv.config();

// Dados de exemplo para empresas
const companiesData = [
  {
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'ANTONIO DISTRIBUIÇÃO LTDA',
    nomeFantasia: 'Antonio Distribuidora',
    situacao: 'ATIVA',
    porte: 'MEDIO',
    capitalSocial: 500000,
    naturezaJuridica: 'Sociedade Empresária Limitada',
    dataAbertura: '2010-01-15T00:00:00.000Z',
    address: {
      zipCode: '01234-567',
      street: 'Rua das Flores',
      number: '123',
      complement: '',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP'
    },
    contact: {
      phone: '(11) 97463-2014',
      email: 'contato@antonio.com.br'
    },
    cnae: {
      principal: {
        codigo: '4610-7/01',
        descricao: 'Distribuição de Alimentos'
      }
    },
    lastUpdated: new Date()
  },
  {
    cnpj: '98.765.432/0001-10',
    razaoSocial: 'ELIANE SERVIÇOS E CONSULTORIA LTDA',
    nomeFantasia: 'Eliane Consultoria',
    situacao: 'ATIVA',
    porte: 'EPP',
    capitalSocial: 100000,
    naturezaJuridica: 'Sociedade Empresária Limitada',
    dataAbertura: '2015-02-10T00:00:00.000Z',
    address: {
      zipCode: '01310-100',
      street: 'Av. Paulista',
      number: '456',
      complement: 'Sala 301',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP'
    },
    contact: {
      phone: '(11) 85642-2013',
      email: 'eliane@consultoria.com.br'
    },
    cnae: {
      principal: {
        codigo: '7020-4/00',
        descricao: 'Consultoria Empresarial'
      }
    },
    lastUpdated: new Date()
  },
  {
    cnpj: '11.222.333/0001-44',
    razaoSocial: 'LEA TECNOLOGIA E INOVAÇÃO S.A.',
    nomeFantasia: 'Lea Tech',
    situacao: 'ATIVA',
    porte: 'GRANDE',
    capitalSocial: 2000000,
    naturezaJuridica: 'Sociedade Anônima',
    dataAbertura: '2018-03-05T00:00:00.000Z',
    address: {
      zipCode: '20040-020',
      street: 'Rua do Ouvidor',
      number: '789',
      complement: 'Andar 15',
      neighborhood: 'Centro',
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    contact: {
      phone: '(21) 87547-3921',
      email: 'contato@leatech.com.br'
    },
    cnae: {
      principal: {
        codigo: '6201-5/00',
        descricao: 'Desenvolvimento de Software'
      }
    },
    lastUpdated: new Date()
  },
  {
    cnpj: '55.666.777/0001-88',
    razaoSocial: 'ERIC INDÚSTRIAS METALÚRGICAS LTDA',
    nomeFantasia: 'Eric Metais',
    situacao: 'SUSPENSA',
    porte: 'MEDIO',
    capitalSocial: 800000,
    naturezaJuridica: 'Sociedade Empresária Limitada',
    dataAbertura: '2012-04-12T00:00:00.000Z',
    address: {
      zipCode: '13100-000',
      street: 'Distrito Industrial',
      number: '1000',
      complement: '',
      neighborhood: 'Industrial',
      city: 'Campinas',
      state: 'SP'
    },
    contact: {
      phone: '(19) 99999-9999',
      email: 'eric@metalurgica.com.br'
    },
    cnae: {
      principal: {
        codigo: '2511-0/00',
        descricao: 'Metalurgia'
      }
    },
    lastUpdated: new Date()
  }
];

const seedFirebase = async () => {
  try {
    // Conectar ao Firebase
    const adaptador = obterAdaptadorBanco();
    await adaptador.conectar();
    console.log('✅ Conectado ao Firebase para seed');

    // Buscar usuário teste
    let user = await adaptador.buscarUsuarioPorEmail('teste@edenred.com');
    
    if (!user) {
      // Criar usuário teste se não existir
      const hashedPassword = await bcrypt.hash('Test123456', 12);
      user = await adaptador.criarUsuario({
        name: 'Usuario Teste',
        email: 'teste@edenred.com',
        password: hashedPassword,
        role: 'user',
        preferences: {
          theme: 'light',
          notifications: true
        }
      });
      console.log('✅ Usuário teste criado');
    }

    console.log('📋 Verificando empresas existentes...');
    // Verificar se as empresas já existem para evitar duplicação
    const empresasExistentes = await adaptador.buscarEmpresasPorUsuario(user.id);
    const cnpjsExistentes = new Set(empresasExistentes.map(e => e.cnpj));

    // Adicionar empresas de exemplo
    console.log('📝 Adicionando empresas de exemplo...');
    for (const companyData of companiesData) {
      if (cnpjsExistentes.has(companyData.cnpj)) {
        console.log(`⚠️ Empresa com CNPJ ${companyData.cnpj} já existe, pulando...`);
        continue;
      }
      await adaptador.criarEmpresa({
        ...companyData,
        adicionadoPor: user.id
      });
    }

    console.log(`✅ ${companiesData.length} empresas de exemplo adicionadas`);
    console.log('🎉 Seed do Firebase concluído com sucesso!');

    // Listar empresas criadas
    const empresas = await adaptador.buscarEmpresasPorUsuario(user.id);
    console.log('\n📋 Empresas criadas:');
    empresas.forEach(empresa => {
      console.log(`  - ${empresa.cnpj} | ${empresa.razaoSocial} | ${empresa.situacao}`);
    });

  } catch (error) {
    console.error('❌ Erro no seed do Firebase:', error);
  } finally {
    // Desconectar
    const adaptador = obterAdaptadorBanco();
    await adaptador.desconectar();
    console.log('\n✅ Desconectado do Firebase');
    process.exit(0);
  }
};

// Executar seed se chamado diretamente
if (process.argv[1].endsWith('seedFirebase.js')) {
  seedFirebase();
}

export default seedFirebase;
