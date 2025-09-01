import Consultation from '../models/Consultation.js';
import { consultCNPJWithFallback, formatCNPJ } from '../utils/cnpjService.js';
import { obterAdaptadorBanco } from '../config/dbAdapter.js';

// Consultar CNPJ
export const consultCNPJ = async (req, res) => {
  const startTime = Date.now();
  const db = obterAdaptadorBanco();
  
  try {
    console.log('\n🔥 === NOVA CONSULTA CNPJ ===');
    console.log('👤 Usuário:', req.user?.id || req.user?.uid || 'Não identificado');
    console.log('📋 Body da requisição:', req.body);
    
    await db.conectar();
    const { cnpj } = req.body;
    
    if (!cnpj) {
      console.log('❌ CNPJ não fornecido');
      return res.status(400).json({
        success: false,
        message: 'CNPJ é obrigatório',
        code: 'MISSING_CNPJ'
      });
    }
    
    console.log('🔍 CNPJ recebido:', cnpj);
    const formattedCNPJ = formatCNPJ(cnpj);
    console.log('📝 CNPJ formatado:', formattedCNPJ);
    
    // Criar dados padrão da consulta
    let consultationData = Consultation.createDefaultConsultationData({
      cnpj: formattedCNPJ,
      user: req.user.id || req.user.uid,
      status: 'PENDING',
      metadata: {
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip || ''
      }
    });

    try {
      // Verificar se empresa já existe no banco
      let company = await db.buscarEmpresaPorCNPJ(formattedCNPJ);
      
      // Verificar cache (menos de 24h)
      let isRecentCache = false;
      if (company && company.lastUpdated) {
        try {
          const lastUpdatedDate = company.lastUpdated instanceof Date 
            ? company.lastUpdated 
            : new Date(company.lastUpdated);
          isRecentCache = Date.now() - lastUpdatedDate.getTime() < 24 * 60 * 60 * 1000;
        } catch (error) {
          console.log('⚠️ Erro ao verificar data do cache, ignorando cache:', error.message);
          isRecentCache = false;
        }
      }
      
      if (isRecentCache) {
        // Usar cache
        consultationData.status = 'SUCCESS';
        consultationData.source = 'CACHE';
        consultationData.company = company.id;
        consultationData.result = company;
        consultationData.responseTime = Consultation.calculateResponseTime(startTime);
        
        // Salvar consulta no banco
        const savedConsultation = await db.criarConsulta(consultationData);
        
        return res.json({
          success: true,
          message: 'CNPJ consultado com sucesso (cache)',
          data: { company, consultation: savedConsultation }
        });
      }
      
      // Consultar APIs externas
      const apiResult = await consultCNPJWithFallback(formattedCNPJ);
      
      // Salvar/atualizar empresa
      if (company) {
        // Atualizar empresa existente
        company = await db.atualizarEmpresa(company.id, {
          ...apiResult.data,
          lastUpdated: new Date(),
          atualizadoPor: req.user.id || req.user.uid
        });
      } else {
        // Criar nova empresa
        company = await db.criarEmpresa({
          ...apiResult.data,
          adicionadoPor: req.user.id || req.user.uid
        });
      }
      
      // Atualizar dados da consulta
      consultationData.status = 'SUCCESS';
      consultationData.source = apiResult.source;
      consultationData.company = company.id;
      consultationData.result = apiResult.data;
      consultationData.responseTime = Consultation.calculateResponseTime(startTime);
      
      // Salvar consulta no banco
      const savedConsultation = await db.criarConsulta(consultationData);
      
      res.json({
        success: true,
        message: 'CNPJ consultado com sucesso',
        data: { company, consultation: savedConsultation }
      });
      
    } catch (error) {
      console.error('Erro na consulta da API:', error);
      
      // Registrar erro na consulta
      consultationData.status = 'ERROR';
      consultationData.error = {
        message: error.message,
        code: 'CONSULTATION_ERROR',
        details: error.stack
      };
      consultationData.responseTime = Consultation.calculateResponseTime(startTime);
      
      // Salvar consulta com erro no banco
      try {
        await db.criarConsulta(consultationData);
      } catch (saveError) {
        console.error('Erro ao salvar consulta com erro:', saveError);
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
        code: 'CONSULTATION_ERROR'
      });
    }

  } catch (error) {
    console.error('Erro na consulta CNPJ:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Listar consultas do usuário
export const getConsultations = async (req, res) => {
  const db = obterAdaptadorBanco();
  
  try {
    await db.conectar();
    const { page = 1, limit = 10, status, favorite } = req.query;
    
    const filtros = {
      limit: parseInt(limit),
      status,
      favorite: favorite === 'true'
    };
    
    const userId = req.user.id || req.user.uid;
    const consultations = await db.buscarConsultasPorUsuario(userId, filtros);
    
    // Calcular paginação
    const total = consultations.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedConsultations = consultations.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        consultations: paginatedConsultations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          total,
          hasNext: endIndex < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Erro ao listar consultas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Estatísticas de consultas
export const getConsultationStats = async (req, res) => {
  const db = obterAdaptadorBanco();
  
  try {
    await db.conectar();
    const userId = req.user.id || req.user.uid;
    const stats = await db.obterEstatisticasConsulta(userId);
    
    res.json({
      success: true,
      data: { stats }
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Favoritar consulta
export const toggleFavorite = async (req, res) => {
  const db = obterAdaptadorBanco();
  
  try {
    await db.conectar();
    const consultationId = req.params.id;
    const userId = req.user.id || req.user.uid;
    
    // Buscar consulta por ID
    const consultation = await Consultation.toggleFavorite(consultationId);
    
    res.json({
      success: true,
      message: consultation.isFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
      data: { consultation }
    });
    
  } catch (error) {
    console.error('Erro ao favoritar consulta:', error);
    
    if (error.message === 'Consulta não encontrada') {
      return res.status(404).json({
        success: false,
        message: 'Consulta não encontrada',
        code: 'CONSULTATION_NOT_FOUND'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};
