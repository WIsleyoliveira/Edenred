import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    trim: true,
    match: [/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'ERROR', 'NOT_FOUND'],
    default: 'PENDING'
  },
  source: {
    type: String,
    enum: ['RECEITA_FEDERAL', 'CACHE', 'API_EXTERNA'],
    default: 'RECEITA_FEDERAL'
  },
  responseTime: {
    type: Number, // em millisegundos
    min: 0
  },
  result: {
    type: mongoose.Schema.Types.Mixed, // Armazena a resposta completa da API
    default: null
  },
  error: {
    message: { type: String },
    code: { type: String },
    details: { type: mongoose.Schema.Types.Mixed }
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notas não podem ter mais de 500 caracteres']
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    location: {
      country: String,
      city: String,
      region: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes para melhor performance
consultationSchema.index({ user: 1, createdAt: -1 });
consultationSchema.index({ cnpj: 1 });
consultationSchema.index({ status: 1 });
consultationSchema.index({ createdAt: -1 });
consultationSchema.index({ isFavorite: 1 });

// Virtual para verificar se foi consultado recentemente
consultationSchema.virtual('isRecent').get(function() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return this.createdAt > oneHourAgo;
});

// Virtual para tempo decorrido desde a consulta
consultationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInMs = now - this.createdAt;
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
});

// Método para marcar/desmarcar como favorito
consultationSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

// Método para calcular tempo de resposta
consultationSchema.methods.calculateResponseTime = function(startTime) {
  this.responseTime = Date.now() - startTime;
  return this.responseTime;
};

// Método estático para buscar consultas recentes do usuário
consultationSchema.statics.findRecentByUser = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('company', 'razaoSocial nomeFantasia situacao');
};

// Método estático para estatísticas do usuário
consultationSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        successful: { $sum: { $cond: [{ $eq: ['$status', 'SUCCESS'] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$status', 'ERROR'] }, 1, 0] } },
        avgResponseTime: { $avg: '$responseTime' },
        favorites: { $sum: { $cond: ['$isFavorite', 1, 0] } }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    successful: 0,
    failed: 0,
    avgResponseTime: 0,
    favorites: 0
  };
};

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
