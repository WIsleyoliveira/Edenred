import axios from 'axios';

// Função para formatar CNPJ
export const formatCNPJ = (cnpj) => {
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length !== 14) {
    throw new Error('CNPJ deve ter 14 dígitos');
  }
  
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Função para remover formatação do CNPJ
export const cleanCNPJ = (cnpj) => {
  return cnpj.replace(/\D/g, '');
};

// Validar CNPJ (algoritmo oficial)
export const validateCNPJ = (cnpj) => {
  const numbers = cleanCNPJ(cnpj);
  
  if (numbers.length !== 14) return false;
  
  // Eliminar CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validar primeiro dígito verificador
  let sum = 0;
  let weight = 2;
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  const remainder1 = sum % 11;
  const digit1 = remainder1 < 2 ? 0 : 11 - remainder1;
  
  if (parseInt(numbers[12]) !== digit1) return false;
  
  // Validar segundo dígito verificador
  sum = 0;
  weight = 2;
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  const remainder2 = sum % 11;
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;
  
  return parseInt(numbers[13]) === digit2;
};

// Consultar CNPJ na ReceitaWS
export const consultCNPJReceitaWS = async (cnpj) => {
  try {
    const cleanedCNPJ = cleanCNPJ(cnpj);
    
    if (!validateCNPJ(cleanedCNPJ)) {
      throw new Error('CNPJ inválido');
    }
    
const url = `${process.env.URL_BASE_RECEITA_WS || 'https://www.receitaws.com.br/v1'}/cnpj/${cleanedCNPJ}`;
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'CNPJ-Consultation-System/1.0.0'
      }
    });
    
    if (response.data.status === 'ERROR') {
      throw new Error(response.data.message || 'Erro na consulta do CNPJ');
    }
    
    // Mapear resposta para nosso formato
    const companyData = {
      cnpj: formatCNPJ(response.data.cnpj),
      razaoSocial: response.data.nome,
      nomeFantasia: response.data.fantasia || response.data.nome,
      situacao: mapSituacao(response.data.situacao),
      dataAbertura: parseDate(response.data.abertura),
      capitalSocial: parseFloat(response.data.capital_social?.replace(/[^\d,]/g, '')?.replace(',', '.')) || 0,
      cnae: {
        principal: {
          codigo: response.data.atividade_principal?.[0]?.code,
          descricao: response.data.atividade_principal?.[0]?.text
        },
        secundarias: response.data.atividades_secundarias?.map(atividade => ({
          codigo: atividade.code,
          descricao: atividade.text
        })) || []
      },
      address: {
        street: response.data.logradouro,
        number: response.data.numero,
        complement: response.data.complemento,
        neighborhood: response.data.bairro,
        city: response.data.municipio,
        state: response.data.uf,
        zipCode: response.data.cep,
        country: 'Brasil'
      },
      contact: {
        phone: response.data.telefone,
        email: response.data.email
      },
      naturezaJuridica: response.data.natureza_juridica,
      porte: mapPorte(response.data.porte),
      dataSource: 'RECEITA_FEDERAL',
      lastUpdated: new Date()
    };
    
    return {
      success: true,
      data: companyData,
      source: 'RECEITA_FEDERAL'
    };
    
  } catch (error) {
    console.error('Erro na consulta ReceitaWS:', error);
    
    if (error.response?.status === 429) {
      throw new Error('Limite de consultas excedido. Tente novamente mais tarde.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('CNPJ não encontrado na Receita Federal.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout na consulta. Tente novamente.');
    }
    
    throw new Error(error.message || 'Erro na consulta do CNPJ');
  }
};

// API alternativa (BrasilAPI)
export const consultCNPJBrasilAPI = async (cnpj) => {
  try {
    const cleanedCNPJ = cleanCNPJ(cnpj);
    
    if (!validateCNPJ(cleanedCNPJ)) {
      throw new Error('CNPJ inválido');
    }
    
    const url = `https://brasilapi.com.br/api/cnpj/v1/${cleanedCNPJ}`;
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'CNPJ-Consultation-System/1.0.0'
      }
    });
    
    // Mapear resposta para nosso formato
    const companyData = {
      cnpj: formatCNPJ(response.data.cnpj),
      razaoSocial: response.data.razao_social,
      nomeFantasia: response.data.nome_fantasia || response.data.razao_social,
      situacao: mapSituacao(response.data.descricao_situacao_cadastral),
      dataAbertura: parseDate(response.data.data_inicio_atividade),
      capitalSocial: parseFloat(response.data.capital_social) || 0,
      cnae: {
        principal: {
          codigo: response.data.cnae_fiscal,
          descricao: response.data.cnae_fiscal_descricao
        },
        secundarias: response.data.cnaes_secundarios?.map(cnae => ({
          codigo: cnae.codigo,
          descricao: cnae.descricao
        })) || []
      },
      address: {
        street: response.data.logradouro,
        number: response.data.numero,
        complement: response.data.complemento,
        neighborhood: response.data.bairro,
        city: response.data.municipio,
        state: response.data.uf,
        zipCode: response.data.cep,
        country: 'Brasil'
      },
      contact: {
        phone: response.data.ddd_telefone_1,
        email: null
      },
      naturezaJuridica: response.data.natureza_juridica,
      porte: mapPorte(response.data.porte),
      dataSource: 'API_EXTERNA',
      lastUpdated: new Date()
    };
    
    return {
      success: true,
      data: companyData,
      source: 'API_EXTERNA'
    };
    
  } catch (error) {
    console.error('Erro na consulta BrasilAPI:', error);
    throw error;
  }
};

// Consulta com fallback entre APIs
export const consultCNPJWithFallback = async (cnpj) => {
  const errors = [];
  
  // Tentar ReceitaWS primeiro
  try {
    return await consultCNPJReceitaWS(cnpj);
  } catch (error) {
    errors.push({ service: 'ReceitaWS', error: error.message });
  }
  
  // Fallback para BrasilAPI
  try {
    return await consultCNPJBrasilAPI(cnpj);
  } catch (error) {
    errors.push({ service: 'BrasilAPI', error: error.message });
  }
  
  // Se todas as APIs falharam
  throw new Error(`Falha em todas as APIs de consulta: ${errors.map(e => `${e.service}: ${e.error}`).join('; ')}`);
};

// Funções auxiliares
const mapSituacao = (situacao) => {
  if (!situacao) return 'ATIVA';
  
  const situacaoUpper = situacao.toUpperCase();
  
  if (situacaoUpper.includes('ATIVA')) return 'ATIVA';
  if (situacaoUpper.includes('BAIXADA')) return 'BAIXADA';
  if (situacaoUpper.includes('SUSPENSA')) return 'SUSPENSA';
  if (situacaoUpper.includes('INAPTA')) return 'INAPTA';
  
  return 'ATIVA'; // Default
};

const mapPorte = (porte) => {
  if (!porte) return 'ME';
  
  const porteUpper = porte.toUpperCase();
  
  if (porteUpper.includes('MEI')) return 'MEI';
  if (porteUpper.includes('PEQUENO') || porteUpper.includes('ME')) return 'ME';
  if (porteUpper.includes('EPP')) return 'EPP';
  if (porteUpper.includes('MÉDIO') || porteUpper.includes('MEDIO')) return 'MEDIO';
  if (porteUpper.includes('GRANDE')) return 'GRANDE';
  
  return 'ME'; // Default
};

const parseDate = (dateString) => {
  if (!dateString) return null;
  
  // Formato DD/MM/YYYY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  
  // Formato ISO
  return new Date(dateString);
};

export default {
  formatCNPJ,
  cleanCNPJ,
  validateCNPJ,
  consultCNPJReceitaWS,
  consultCNPJBrasilAPI,
  consultCNPJWithFallback
};
