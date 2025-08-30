import AdaptadorFirebase from '../config/adapters/firebaseAdapter.js';

// Validadores e utilitários para consultas
class Consultation {
  constructor() {
    this.firebase = new AdaptadorFirebase();
  }

  // Validar formato do CNPJ
  static validateCNPJ(cnpj) {
    if (!cnpj) return false;
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(cnpj);
  }

  // Validar dados da consulta
  static validateConsultationData(data) {
    const errors = [];

    if (!data.cnpj) {
      errors.push('CNPJ é obrigatório');
    } else if (!Consultation.validateCNPJ(data.cnpj)) {
      errors.push('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX');
    }

    if (!data.user) {
      errors.push('ID do usuário é obrigatório');
    }

    if (data.status && !['PENDING', 'SUCCESS', 'ERROR', 'NOT_FOUND'].includes(data.status)) {
      errors.push('Status deve ser: PENDING, SUCCESS, ERROR ou NOT_FOUND');
    }

    if (data.source && !['RECEITA_FEDERAL', 'CACHE', 'API_EXTERNA'].includes(data.source)) {
      errors.push('Source deve ser: RECEITA_FEDERAL, CACHE ou API_EXTERNA');
    }

    if (data.responseTime && data.responseTime < 0) {
      errors.push('Tempo de resposta não pode ser negativo');
    }

    if (data.notes && data.notes.length > 500) {
      errors.push('Notas não podem ter mais de 500 caracteres');
    }

    return errors;
  }

  // Criar dados padrão para uma consulta
  static createDefaultConsultationData(data) {
    return {
      cnpj: data.cnpj?.trim() || '',
      user: data.user || '',
      company: data.company || null,
      status: data.status || 'PENDING',
      source: data.source || 'RECEITA_FEDERAL',
      responseTime: data.responseTime || 0,
      result: data.result || null,
      error: data.error || { message: '', code: '', details: null },
      isFavorite: data.isFavorite || false,
      tags: (data.tags || []).map(tag => tag.toLowerCase().trim()),
      notes: data.notes?.trim() || '',
      metadata: {
        userAgent: data.metadata?.userAgent || '',
        ipAddress: data.metadata?.ipAddress || '',
        location: {
          country: data.metadata?.location?.country || '',
          city: data.metadata?.location?.city || '',
          region: data.metadata?.location?.region || ''
        }
      }
    };
  }

  // Verificar se foi consultado recentemente
  static isRecent(createdAt) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(createdAt) > oneHourAgo;
  }

  // Calcular tempo decorrido
  static getTimeAgo(createdAt) {
    const now = new Date();
    const diffInMs = now - new Date(createdAt);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hora${diffInHours > 1 ? 's' : ''} atrás`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''} atrás`;
    } else {
      return 'Agora mesmo';
    }
  }

  // Alternar favorito
  static async toggleFavorite(consultationId) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      const consultation = await firebase.buscarConsultaPorId(consultationId);
      if (!consultation) {
        throw new Error('Consulta não encontrada');
      }
      
      return await firebase.atualizarConsulta(consultationId, {
        isFavorite: !consultation.isFavorite
      });
    } catch (error) {
      throw error;
    }
  }

  // Calcular tempo de resposta
  static calculateResponseTime(startTime) {
    return Date.now() - startTime;
  }

  // Buscar consultas recentes do usuário
  static async findRecentByUser(userId, limit = 10) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      return await firebase.buscarConsultasPorUsuario(userId, { limit });
    } catch (error) {
      throw error;
    }
  }

  // Estatísticas do usuário
  static async getUserStats(userId) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      return await firebase.obterEstatisticasConsulta(userId);
    } catch (error) {
      throw error;
    }
  }
}

export default Consultation;

// so pra enviar
