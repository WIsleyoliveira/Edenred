import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from '../models/Company.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

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

const seedDatabase = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.URL_CONEXAO_MONGODB || 'mongodb://localhost:27017/sistema_consulta_cnpj');
    console.log('✅ Conectado ao MongoDB para seed');

    // Obter o usuário teste para associar às empresas
    let user = await User.findOne({ email: 'teste@edenred.com' });
    
    if (!user) {
      // Criar usuário teste se não existir
      const hashedPassword = await bcrypt.hash('Test123456', 12);
      user = await User.create({
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

    // Limpar empresas existentes
    await Company.deleteMany({});
    console.log('🗑️ Empresas existentes removidas');

    // Adicionar empresas de exemplo
    for (const companyData of companiesData) {
      await Company.create({
        ...companyData,
        addedBy: user._id
      });
    }

    console.log(`✅ ${companiesData.length} empresas de exemplo adicionadas`);
    console.log('🎉 Seed do banco de dados concluído com sucesso!');

    // Listar empresas criadas
    const companies = await Company.find().select('cnpj razaoSocial situacao');
    console.log('\n📋 Empresas criadas:');
    companies.forEach(company => {
      console.log(`  - ${company.cnpj} | ${company.razaoSocial} | ${company.situacao}`);
    });

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    // Desconectar do banco
    await mongoose.disconnect();
    console.log('\n✅ Desconectado do MongoDB');
    process.exit(0);
  }
};

// Executar seed se chamado diretamente
if (process.argv[1].endsWith('seedDatabase.js')) {
  seedDatabase();
}

export default seedDatabase;
