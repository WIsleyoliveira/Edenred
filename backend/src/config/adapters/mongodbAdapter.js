import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Importar modelos do MongoDB
import User from '../../models/User.js';
import Company from '../../models/Company.js';
import Consultation from '../../models/Consultation.js';
import Landscape from '../../models/Landscape.js';

class AdaptadorMongoDB {
  constructor() {
    this.isConnected = false;
  }
  
  async connect() {
    try {
      if (this.isConnected) return true;
      
      const conn = await mongoose.connect(
        process.env.URL_CONEXAO_MONGODB || 'mongodb://localhost:27017/sistema_consulta_cnpj'
      );
      
      this.isConnected = true;
      console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
      
      // Event listeners
      mongoose.connection.on('error', (err) => {
        console.error('❌ Erro na conexão MongoDB:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB desconectado');
        this.isConnected = false;
      });
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar MongoDB:', error);
      throw error;
    }
  }
  
  async disconnect() {
    if (this.isConnected) {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('🔒 MongoDB desconectado');
    }
  }
  
  async healthCheck() {
    try {
      if (!this.isConnected) return false;
      
      await mongoose.connection.db.admin().ping();
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // MÉTODOS DE USUÁRIO
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }
  
  async findUserById(id) {
    return await User.findById(id).select('-password');
  }
  
  async findUserByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }
  
  async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    }).select('-password');
  }
  
  async deleteUser(id) {
    return await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
  
  // MÉTODOS DE EMPRESA
  async createCompany(companyData) {
    const company = new Company(companyData);
    return await company.save();
  }
  
  async findCompanyByCNPJ(cnpj) {
    return await Company.findOne({ cnpj });
  }
  
  async findCompaniesByUser(userId, filters = {}) {
    const { page = 1, limit = 10, search, situacao } = filters;
    
    const query = { addedBy: userId };
    if (situacao) query.situacao = situacao;
    
    let mongoQuery = Company.find(query);
    
    if (search) {
      mongoQuery = mongoQuery.or([
        { razaoSocial: { $regex: search, $options: 'i' } },
        { nomeFantasia: { $regex: search, $options: 'i' } },
        { cnpj: { $regex: search, $options: 'i' } }
      ]);
    }
    
    const companies = await mongoQuery
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Company.countDocuments(query);
    
    return {
      data: companies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }
  
  async updateCompany(id, updateData) {
    return await Company.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });
  }
  
  // MÉTODOS DE CONSULTA
  async createConsultation(consultationData) {
    const consultation = new Consultation(consultationData);
    return await consultation.save();
  }
  
  async findConsultationsByUser(userId, filters = {}) {
    const { page = 1, limit = 10, status, favorite } = filters;
    
    const query = { user: userId };
    if (status) query.status = status;
    if (favorite === 'true') query.isFavorite = true;
    
    const consultations = await Consultation.find(query)
      .populate('company', 'razaoSocial nomeFantasia situacao')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Consultation.countDocuments(query);
    
    return {
      data: consultations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }
  
  async updateConsultation(id, updateData) {
    return await Consultation.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });
  }
  
  async getConsultationStats(userId) {
    return await Consultation.getUserStats(userId);
  }
  
  // MÉTODOS DE PAISAGEM
  async createLandscape(landscapeData) {
    const landscape = new Landscape(landscapeData);
    return await landscape.save();
  }
  
  async findLandscapes(filters = {}) {
    const { page = 1, limit = 10, category, featured, isPublic = true } = filters;
    
    const query = { isPublic, status: 'active' };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    
    const landscapes = await Landscape.find(query)
      .populate('uploadedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Landscape.countDocuments(query);
    
    return {
      data: landscapes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }
  
  async findLandscapesByUser(userId, filters = {}) {
    const { page = 1, limit = 10 } = filters;
    
    const landscapes = await Landscape.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Landscape.countDocuments({ uploadedBy: userId });
    
    return {
      data: landscapes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }
  
  async updateLandscape(id, updateData) {
    return await Landscape.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });
  }
}

// Wrappers em PT-BR para compatibilidade com AdaptadorBancoDados
AdaptadorMongoDB.prototype.conectar = AdaptadorMongoDB.prototype.connect;
AdaptadorMongoDB.prototype.desconectar = AdaptadorMongoDB.prototype.disconnect;
AdaptadorMongoDB.prototype.verificarSaude = AdaptadorMongoDB.prototype.healthCheck;
AdaptadorMongoDB.prototype.criarUsuario = AdaptadorMongoDB.prototype.createUser;
AdaptadorMongoDB.prototype.buscarUsuarioPorId = AdaptadorMongoDB.prototype.findUserById;
AdaptadorMongoDB.prototype.buscarUsuarioPorEmail = AdaptadorMongoDB.prototype.findUserByEmail;
AdaptadorMongoDB.prototype.atualizarUsuario = AdaptadorMongoDB.prototype.updateUser;
AdaptadorMongoDB.prototype.deletarUsuario = AdaptadorMongoDB.prototype.deleteUser;
AdaptadorMongoDB.prototype.criarEmpresa = AdaptadorMongoDB.prototype.createCompany;
AdaptadorMongoDB.prototype.buscarEmpresaPorCNPJ = AdaptadorMongoDB.prototype.findCompanyByCNPJ;
AdaptadorMongoDB.prototype.buscarEmpresasPorUsuario = AdaptadorMongoDB.prototype.findCompaniesByUser;
AdaptadorMongoDB.prototype.atualizarEmpresa = AdaptadorMongoDB.prototype.updateCompany;
AdaptadorMongoDB.prototype.criarConsulta = AdaptadorMongoDB.prototype.createConsultation;
AdaptadorMongoDB.prototype.buscarConsultasPorUsuario = AdaptadorMongoDB.prototype.findConsultationsByUser;
AdaptadorMongoDB.prototype.atualizarConsulta = AdaptadorMongoDB.prototype.updateConsultation;
AdaptadorMongoDB.prototype.obterEstatisticasConsulta = AdaptadorMongoDB.prototype.getConsultationStats;
AdaptadorMongoDB.prototype.criarPaisagem = AdaptadorMongoDB.prototype.createLandscape;
AdaptadorMongoDB.prototype.buscarPaisagens = AdaptadorMongoDB.prototype.findLandscapes;
AdaptadorMongoDB.prototype.buscarPaisagensPorUsuario = AdaptadorMongoDB.prototype.findLandscapesByUser;
AdaptadorMongoDB.prototype.atualizarPaisagem = AdaptadorMongoDB.prototype.updateLandscape;

export default AdaptadorMongoDB;
