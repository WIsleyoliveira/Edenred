import AdaptadorFirebase from '../config/adapters/firebaseAdapter.js';

// Validadores e utilitários para empresas
class Company {
  constructor() {
    this.firebase = new AdaptadorFirebase();
  }

  // Validar formato do CNPJ
  static validateCNPJ(cnpj) {
    if (!cnpj) return false;
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(cnpj);
  }

  // Validar dados da empresa
  static validateCompanyData(data) {
    const errors = [];

    if (!data.cnpj) {
      errors.push('CNPJ é obrigatório');
    } else if (!Company.validateCNPJ(data.cnpj)) {
      errors.push('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX');
    }

    if (!data.razaoSocial) {
      errors.push('Razão social é obrigatória');
    } else if (data.razaoSocial.length > 200) {
      errors.push('Razão social não pode ter mais de 200 caracteres');
    }

    if (data.nomeFantasia && data.nomeFantasia.length > 200) {
      errors.push('Nome fantasia não pode ter mais de 200 caracteres');
    }

    if (data.situacao && !['ATIVA', 'BAIXADA', 'SUSPENSA', 'INAPTA'].includes(data.situacao)) {
      errors.push('Situação deve ser: ATIVA, BAIXADA, SUSPENSA ou INAPTA');
    }

    if (data.capitalSocial && data.capitalSocial < 0) {
      errors.push('Capital social não pode ser negativo');
    }

    if (data.porte && !['MEI', 'ME', 'EPP', 'MEDIO', 'GRANDE'].includes(data.porte)) {
      errors.push('Porte deve ser: MEI, ME, EPP, MEDIO ou GRANDE');
    }

    if (data.regimeTributario && !['SIMPLES', 'PRESUMIDO', 'REAL'].includes(data.regimeTributario)) {
      errors.push('Regime tributário deve ser: SIMPLES, PRESUMIDO ou REAL');
    }

    if (data.notes && data.notes.length > 1000) {
      errors.push('Notas não podem ter mais de 1000 caracteres');
    }

    if (!data.addedBy) {
      errors.push('ID do usuário que adicionou a empresa é obrigatório');
    }

    return errors;
  }

  // Criar dados padrão para uma empresa
  static createDefaultCompanyData(data) {
    return {
      cnpj: data.cnpj?.trim() || '',
      razaoSocial: data.razaoSocial?.trim() || '',
      nomeFantasia: data.nomeFantasia?.trim() || '',
      naturezaJuridica: data.naturezaJuridica?.trim() || '',
      situacao: data.situacao || 'ATIVA',
      dataAbertura: data.dataAbertura || null,
      capitalSocial: data.capitalSocial || 0,
      cnae: data.cnae || { principal: { codigo: '', descricao: '' }, secundarias: [] },
      address: {
        street: data.address?.street?.trim() || '',
        number: data.address?.number?.trim() || '',
        complement: data.address?.complement?.trim() || '',
        neighborhood: data.address?.neighborhood?.trim() || '',
        city: data.address?.city?.trim() || '',
        state: data.address?.state?.trim() || '',
        zipCode: data.address?.zipCode?.trim() || '',
        country: data.address?.country || 'Brasil'
      },
      contact: {
        phone: data.contact?.phone?.trim() || '',
        email: data.contact?.email?.toLowerCase().trim() || '',
        website: data.contact?.website?.trim() || ''
      },
      socios: data.socios || [],
      porte: data.porte || 'ME',
      regimeTributario: data.regimeTributario || 'SIMPLES',
      lastUpdated: new Date(),
      dataSource: data.dataSource || 'RECEITA_FEDERAL',
      tags: (data.tags || []).map(tag => tag.toLowerCase().trim()),
      notes: data.notes?.trim() || '',
      isFavorite: data.isFavorite || false,
      addedBy: data.addedBy
    };
  }

  // Formatar CNPJ
  static formatCNPJ(cnpj) {
    return cnpj;
  }

  // Alternar favorito
  static async toggleFavorite(companyId) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      const company = await firebase.buscarEmpresaPorId(companyId);
      if (!company) {
        throw new Error('Empresa não encontrada');
      }
      
      return await firebase.atualizarEmpresa(companyId, {
        isFavorite: !company.isFavorite
      });
    } catch (error) {
      throw error;
    }
  }
}

export default Company;

// so pra enviar
