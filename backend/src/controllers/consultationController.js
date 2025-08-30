import Consultation from '../models/Consultation.js';
import Company from '../models/Company.js';
import { consultCNPJWithFallback, formatCNPJ } from '../utils/cnpjService.js';

// Consultar CNPJ
export const consultCNPJ = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { cnpj } = req.body;
    const formattedCNPJ = formatCNPJ(cnpj);
    
    // Criar registro de consulta
    const consultation = new Consultation({
      cnpj: formattedCNPJ,
      user: req.user._id,
      status: 'PENDING',
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    try {
      // Verificar se já existe no banco
      let company = await Company.findOne({ cnpj: formattedCNPJ });
      
      if (company && Date.now() - company.lastUpdated < 24 * 60 * 60 * 1000) {
        // Usar cache se menos de 24h
        consultation.status = 'SUCCESS';
        consultation.source = 'CACHE';
        consultation.company = company._id;
        consultation.result = company.toObject();
        consultation.calculateResponseTime(startTime);
        
        await consultation.save();
        
        return res.json({
          success: true,
          message: 'CNPJ consultado com sucesso (cache)',
          data: { company, consultation }
        });
      }
      
      // Consultar APIs externas
      const apiResult = await consultCNPJWithFallback(formattedCNPJ);
      
      // Salvar/atualizar empresa
      if (company) {
        Object.assign(company, apiResult.data);
        await company.save();
      } else {
        company = await Company.create({
          ...apiResult.data,
          addedBy: req.user._id
        });
      }
      
      // Atualizar consulta
      consultation.status = 'SUCCESS';
      consultation.source = apiResult.source;
      consultation.company = company._id;
      consultation.result = apiResult.data;
      consultation.calculateResponseTime(startTime);
      
      await consultation.save();
      
      res.json({
        success: true,
        message: 'CNPJ consultado com sucesso',
        data: { company, consultation }
      });
      
    } catch (error) {
      // Registrar erro na consulta
      consultation.status = 'ERROR';
      consultation.error = {
        message: error.message,
        code: 'CONSULTATION_ERROR'
      };
      consultation.calculateResponseTime(startTime);
      
      await consultation.save();
      
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
  try {
    const { page = 1, limit = 10, status, favorite } = req.query;
    
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (favorite === 'true') filter.isFavorite = true;
    
    const consultations = await Consultation.find(filter)
      .populate('company', 'razaoSocial nomeFantasia situacao')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Consultation.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        consultations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
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
  try {
    const stats = await Consultation.getUserStats(req.user._id);
    
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
  try {
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consulta não encontrada',
        code: 'CONSULTATION_NOT_FOUND'
      });
    }
    
    if (consultation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para esta consulta',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    await consultation.toggleFavorite();
    
    res.json({
      success: true,
      message: consultation.isFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
      data: { consultation }
    });
    
  } catch (error) {
    console.error('Erro ao favoritar consulta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// so pra enviar
