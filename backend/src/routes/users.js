import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

// Dashboard do usuário
router.get('/dashboard', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Dashboard do usuário',
      data: {
        user: req.user,
        timestamp: new Date().toISOString()
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
