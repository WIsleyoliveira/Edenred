import express from 'express';
import Landscape from '../models/Landscape.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validatePagination, validateSearch } from '../middleware/validation.js';

const router = express.Router();

// Listar paisagens públicas
router.get('/', optionalAuth, validatePagination, validateSearch, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured } = req.query;
    
    const filter = { isPublic: true, status: 'active' };
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    
    const landscapes = await Landscape.find(filter)
      .populate('uploadedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Landscape.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        landscapes,
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

// Minhas paisagens
router.get('/my', authenticate, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const landscapes = await Landscape.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Landscape.countDocuments({ uploadedBy: req.user._id });
    
    res.json({
      success: true,
      data: {
        landscapes,
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

// so pra enviar
