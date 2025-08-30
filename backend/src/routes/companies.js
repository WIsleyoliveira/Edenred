import express from 'express';
import Company from '../models/Company.js';
import { authenticate } from '../middleware/auth.js';
import { validatePagination, validateSearch } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

// Listar empresas
router.get('/', validatePagination, validateSearch, async (req, res) => {
  try {
    const { page = 1, limit = 10, q, situacao } = req.query;
    
    const filter = { addedBy: req.user._id };
    if (situacao) filter.situacao = situacao;
    
    let query = Company.find(filter);
    
    if (q) {
      query = query.or([
        { razaoSocial: { $regex: q, $options: 'i' } },
        { nomeFantasia: { $regex: q, $options: 'i' } },
        { cnpj: { $regex: q, $options: 'i' } }
      ]);
    }
    
    const companies = await query
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Company.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        companies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
