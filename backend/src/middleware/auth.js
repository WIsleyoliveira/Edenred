import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar token JWT
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token existe no header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido. Por favor, faça login.',
        code: 'NO_TOKEN'
      });
    }

    try {
      // Verificar e decodificar o token
      const decoded = jwt.verify(token, process.env.CHAVE_SECRETA_JWT || 'chave_secreta_padrao');
      
      // Buscar o usuário no banco
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido. Usuário não encontrado.',
          code: 'INVALID_TOKEN'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Conta desativada. Entre em contato com o suporte.',
          code: 'ACCOUNT_DISABLED'
        });
      }

      // Adicionar usuário ao request
      req.user = user;
      next();

    } catch (jwtError) {
      let message = 'Token inválido ou expirado.';
      let code = 'INVALID_TOKEN';

      if (jwtError.name === 'TokenExpiredError') {
        message = 'Token expirado. Por favor, faça login novamente.';
        code = 'TOKEN_EXPIRED';
      } else if (jwtError.name === 'JsonWebTokenError') {
        message = 'Token malformado.';
        code = 'MALFORMED_TOKEN';
      }

      return res.status(401).json({
        success: false,
        message,
        code
      });
    }

  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware para verificar permissões de admin
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Permissões de administrador requeridas.',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }
};

// Middleware para verificar se o usuário é o próprio ou admin
export const requireOwnershipOrAdmin = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  
  if (req.user && (req.user._id.toString() === userId || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Você só pode acessar seus próprios recursos.',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }
};

// Middleware opcional de autenticação (não bloqueia se não houver token)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (jwtError) {
        // Ignora erros de token para autenticação opcional
        console.log('Token opcional inválido:', jwtError.message);
      }
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação opcional:', error);
    next();
  }
};

// Utilitário para gerar token JWT
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.CHAVE_SECRETA_JWT || 'chave_secreta_padrao',
    {
      expiresIn: process.env.TEMPO_EXPIRACAO_JWT || '7d'
    }
  );
};

// Utilitário para extrair informações do token sem verificar
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
