import express from 'express';
import { consultCNPJ, getConsultations, getConsultationStats, toggleFavorite } from '../controllers/consultationController.js';
import { authenticate } from '../middleware/auth.js';
import { validateCNPJ, validatePagination, validateObjectId, cnpjRateLimit } from '../middleware/validation.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

/**
 * @route   POST /api/consultations/cnpj
 * @desc    Consultar CNPJ
 * @access  Private
 */
router.post('/cnpj', cnpjRateLimit, validateCNPJ, consultCNPJ);

/**
 * @route   GET /api/consultations
 * @desc    Listar consultas do usuário
 * @access  Private
 */
router.get('/', validatePagination, getConsultations);

/**
 * @route   GET /api/consultations/stats
 * @desc    Estatísticas de consultas
 * @access  Private
 */
router.get('/stats', getConsultationStats);

/**
 * @route   PATCH /api/consultations/:id/favorite
 * @desc    Favoritar/desfavoritar consulta
 * @access  Private
 */
router.patch('/:id/favorite', validateObjectId('id'), toggleFavorite);

export default router;
