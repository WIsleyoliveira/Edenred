import { body, param, query, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

// Middleware para processar erros de validação
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Dados inválidos fornecidos',
      errors: errorMessages,
      code: 'VALIDATION_ERROR'
    });
  }
  
  next();
};

// Validações para usuário
export const validateUserRegistration = [
  body(['name', 'userName'])
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
    
  body().custom((value, { req }) => {
    if (!req.body.name && !req.body.userName) {
      throw new Error('Nome ou userName é obrigatório');
    }
    return true;
  }),
    
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail()
    .toLowerCase(),
    
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Senha deve ter entre 6 e 128 caracteres'),

  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail()
    .toLowerCase(),
    
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),

  handleValidationErrors
];

export const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail(),
    
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Tema deve ser "light" ou "dark"'),
    
  body('preferences.notifications')
    .optional()
    .isBoolean()
    .withMessage('Configuração de notificações deve ser boolean'),

  handleValidationErrors
];

// Validações para CNPJ
export const validateCNPJ = [
  body('cnpj')
    .custom((value) => {
      if (!value) {
        throw new Error('CNPJ é obrigatório');
      }
      
      // Aceitar tanto formato XX.XXX.XXX/XXXX-XX quanto apenas números
      const cnpjNumbers = value.replace(/[^\d]/g, '');
      
      if (cnpjNumbers.length !== 14) {
        throw new Error('CNPJ deve ter exatamente 14 dígitos');
      }
      
      // Verificar se não são todos os dígitos iguais
      if (/^(\d)\1+$/.test(cnpjNumbers)) {
        throw new Error('CNPJ inválido');
      }
      
      return true;
    })
    .withMessage('CNPJ deve ter 14 dígitos ou estar no formato XX.XXX.XXX/XXXX-XX'),

  handleValidationErrors
];

export const validateCompanyData = [
  body('cnpj')
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'),
    
  body('razaoSocial')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Razão social deve ter entre 2 e 200 caracteres'),
    
  body('nomeFantasia')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Nome fantasia não pode ter mais de 200 caracteres'),
    
  body('situacao')
    .optional()
    .isIn(['ATIVA', 'BAIXADA', 'SUSPENSA', 'INAPTA'])
    .withMessage('Situação deve ser ATIVA, BAIXADA, SUSPENSA ou INAPTA'),
    
  body('capitalSocial')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Capital social deve ser um número positivo'),
    
  body('porte')
    .optional()
    .isIn(['MEI', 'ME', 'EPP', 'MEDIO', 'GRANDE'])
    .withMessage('Porte deve ser MEI, ME, EPP, MEDIO ou GRANDE'),

  handleValidationErrors
];

// Validações para paisagens/galeria
export const validateLandscapeData = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Título deve ter entre 2 e 200 caracteres'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Descrição não pode ter mais de 1000 caracteres'),
    
  body('category')
    .optional()
    .isIn(['landscape', 'urban', 'nature', 'architecture', 'portrait', 'abstract', 'other'])
    .withMessage('Categoria inválida'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags devem ser um array'),
    
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Cada tag deve ter entre 1 e 50 caracteres'),
    
  body('location.name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nome da localização não pode ter mais de 100 caracteres'),
    
  body('location.coordinates.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude deve estar entre -90 e 90'),
    
  body('location.coordinates.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude deve estar entre -180 e 180'),

  handleValidationErrors
];

// Validação de parâmetros
export const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} deve ser um ID válido`),
    
  handleValidationErrors
];

// Validação de query parameters
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que 0'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser um número entre 1 e 100'),
    
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'name', '-name', 'updatedAt', '-updatedAt'])
    .withMessage('Campo de ordenação inválido'),

  handleValidationErrors
];

// Validação de busca
export const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de busca deve ter entre 1 e 100 caracteres'),
    
  query('category')
    .optional()
    .isIn(['landscape', 'urban', 'nature', 'architecture', 'portrait', 'abstract', 'other'])
    .withMessage('Categoria inválida'),
    
  query('tags')
    .optional()
    .isArray()
    .withMessage('Tags devem ser um array'),

  handleValidationErrors
];

// Rate limiting para diferentes endpoints
export const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Muitas tentativas. Tente novamente mais tarde.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Rate limits específicos (relaxados para desenvolvimento)
export const authRateLimit = createRateLimit(
  1 * 60 * 1000, // 1 minuto
  50, // 50 tentativas
  'Muitas tentativas de login. Tente novamente em 1 minuto.'
);

export const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutos
  100, // 100 requests
  'Limite de requisições excedido. Tente novamente em 15 minutos.'
);

export const uploadRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hora
  20, // 20 uploads
  'Limite de uploads excedido. Tente novamente em 1 hora.'
);

export const cnpjRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hora
  50, // 50 consultas
  'Limite de consultas CNPJ excedido. Tente novamente em 1 hora.'
);
