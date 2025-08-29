import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  number: { type: String, trim: true },
  complement: { type: String, trim: true },
  neighborhood: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  country: { type: String, default: 'Brasil' }
}, { _id: false });

const contactSchema = new mongoose.Schema({
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  website: { type: String, trim: true }
}, { _id: false });

const companySchema = new mongoose.Schema({
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    unique: true,
    trim: true,
    match: [/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX']
  },
  razaoSocial: {
    type: String,
    required: [true, 'Razão social é obrigatória'],
    trim: true,
    maxlength: [200, 'Razão social não pode ter mais de 200 caracteres']
  },
  nomeFantasia: {
    type: String,
    trim: true,
    maxlength: [200, 'Nome fantasia não pode ter mais de 200 caracteres']
  },
  naturezaJuridica: {
    type: String,
    trim: true
  },
  situacao: {
    type: String,
    enum: ['ATIVA', 'BAIXADA', 'SUSPENSA', 'INAPTA'],
    default: 'ATIVA'
  },
  dataAbertura: {
    type: Date
  },
  capitalSocial: {
    type: Number,
    min: [0, 'Capital social não pode ser negativo']
  },
  cnae: {
    principal: {
      codigo: String,
      descricao: String
    },
    secundarias: [{
      codigo: String,
      descricao: String
    }]
  },
  address: addressSchema,
  contact: contactSchema,
  socios: [{
    nome: { type: String, trim: true },
    qualificacao: { type: String, trim: true },
    participacao: { type: Number, min: 0, max: 100 }
  }],
  porte: {
    type: String,
    enum: ['MEI', 'ME', 'EPP', 'MEDIO', 'GRANDE'],
    default: 'ME'
  },
  regimeTributario: {
    type: String,
    enum: ['SIMPLES', 'PRESUMIDO', 'REAL'],
    default: 'SIMPLES'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSource: {
    type: String,
    enum: ['RECEITA_FEDERAL', 'MANUAL', 'API_EXTERNA'],
    default: 'RECEITA_FEDERAL'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notas não podem ter mais de 1000 caracteres']
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes para melhor performance
companySchema.index({ cnpj: 1 });
companySchema.index({ razaoSocial: 'text', nomeFantasia: 'text' });
companySchema.index({ situacao: 1 });
companySchema.index({ addedBy: 1 });
companySchema.index({ createdAt: -1 });
companySchema.index({ tags: 1 });
companySchema.index({ 'cnae.principal.codigo': 1 });

// Virtual para formatar CNPJ
companySchema.virtual('cnpjFormatted').get(function() {
  return this.cnpj;
});

// Método para adicionar/remover dos favoritos
companySchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

// Middleware para atualizar lastUpdated
companySchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdated = new Date();
  }
  next();
});

// Virtual para contagem de consultas
companySchema.virtual('consultationCount', {
  ref: 'Consultation',
  localField: 'cnpj',
  foreignField: 'cnpj',
  count: true
});

const Company = mongoose.model('Company', companySchema);

export default Company;
