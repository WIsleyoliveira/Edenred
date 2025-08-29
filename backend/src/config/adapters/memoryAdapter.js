// Adaptador híbrido - funciona com MongoDB ou em memória
import bcryptjs from 'bcryptjs';

class AdaptadorHibrido {
  constructor() {
    // Dados em memória como fallback
    this.users = [
      {
        id: '66f0e1a1234567890abcdef0',
        _id: '66f0e1a1234567890abcdef0',
        name: 'Admin Edenred',
        userName: 'Admin Edenred',
        email: 'admin@edenred.com.br',
        password: bcryptjs.hashSync('123456', 10),
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        avatar: null,
        permissions: ['read', 'write', 'admin']
      },
      {
        id: '66f0e1a1234567890abcdef1',
        _id: '66f0e1a1234567890abcdef1',
        name: 'Consultor Edenred',
        userName: 'Consultor Edenred',
        email: 'consultor@edenred.com.br',
        password: bcryptjs.hashSync('consultor123', 10),
        role: 'consultant',
        isActive: true,
        createdAt: new Date(),
        avatar: null,
        permissions: ['read', 'write']
      }
    ];
    this.companies = [];
    this.consultations = [];
    this.landscapes = [];
    this.isConnected = false;
    this.usingMongoDB = false;
  }

  async conectar() {
    console.log('✅ Adaptador em Memória conectado com sucesso');
    this.isConnected = true;
    return true;
  }

  async desconectar() {
    console.log('🔒 Adaptador em Memória desconectado');
    this.isConnected = false;
    return true;
  }

  async verificarSaude() {
    return this.isConnected;
  }

  // MÉTODOS DE USUÁRIO
  async criarUsuario(userData) {
    const newUser = {
      id: String(this.users.length + 1),
      ...userData,
      password: await bcryptjs.hash(userData.password, 10),
      isActive: true,
      createdAt: new Date()
    };
    this.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async buscarUsuarioPorId(id) {
    const user = this.users.find(u => u.id === id && u.isActive);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async buscarUsuarioPorEmail(email) {
    const user = this.users.find(u => u.email === email && u.isActive);
    return user || null;
  }

  async atualizarUsuario(id, updateData) {
    const userIndex = this.users.findIndex(u => u.id === id && u.isActive);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = { ...this.users[userIndex], ...updateData };
    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  async deletarUsuario(id) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex].isActive = false;
    return this.users[userIndex];
  }

  // MÉTODOS DE EMPRESA
  async criarEmpresa(companyData) {
    const newCompany = {
      id: String(this.companies.length + 1),
      ...companyData,
      createdAt: new Date()
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  async buscarEmpresaPorCNPJ(cnpj) {
    return this.companies.find(c => c.cnpj === cnpj) || null;
  }

  async buscarEmpresasPorUsuario(userId, filters = {}) {
    const { page = 1, limit = 10 } = filters;
    const userCompanies = this.companies.filter(c => c.addedBy === userId);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: userCompanies.slice(startIndex, endIndex),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(userCompanies.length / limit),
        total: userCompanies.length,
        hasNext: endIndex < userCompanies.length,
        hasPrev: page > 1
      }
    };
  }

  async atualizarEmpresa(id, updateData) {
    const companyIndex = this.companies.findIndex(c => c.id === id);
    if (companyIndex === -1) return null;
    
    this.companies[companyIndex] = { ...this.companies[companyIndex], ...updateData };
    return this.companies[companyIndex];
  }

  // MÉTODOS DE CONSULTA
  async criarConsulta(consultationData) {
    const newConsultation = {
      id: String(this.consultations.length + 1),
      ...consultationData,
      createdAt: new Date(),
      status: consultationData.status || 'INICIADA'
    };
    this.consultations.push(newConsultation);
    return newConsultation;
  }

  async buscarConsultasPorUsuario(userId, filters = {}) {
    const { page = 1, limit = 10 } = filters;
    const userConsultations = this.consultations.filter(c => c.user === userId);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: userConsultations.slice(startIndex, endIndex),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(userConsultations.length / limit),
        total: userConsultations.length,
        hasNext: endIndex < userConsultations.length,
        hasPrev: page > 1
      }
    };
  }

  async atualizarConsulta(id, updateData) {
    const consultationIndex = this.consultations.findIndex(c => c.id === id);
    if (consultationIndex === -1) return null;
    
    this.consultations[consultationIndex] = { ...this.consultations[consultationIndex], ...updateData };
    return this.consultations[consultationIndex];
  }

  async obterEstatisticasConsulta(userId) {
    const userConsultations = this.consultations.filter(c => c.user === userId);
    
    return {
      total: userConsultations.length,
      completed: userConsultations.filter(c => c.status === 'CONCLUIDA').length,
      pending: userConsultations.filter(c => c.status === 'EM_ANDAMENTO').length,
      failed: userConsultations.filter(c => c.status === 'ERRO').length
    };
  }

  // MÉTODOS DE PAISAGEM
  async criarPaisagem(landscapeData) {
    const newLandscape = {
      id: String(this.landscapes.length + 1),
      ...landscapeData,
      createdAt: new Date()
    };
    this.landscapes.push(newLandscape);
    return newLandscape;
  }

  async buscarPaisagens(filters = {}) {
    const { page = 1, limit = 10 } = filters;
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: this.landscapes.slice(startIndex, endIndex),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(this.landscapes.length / limit),
        total: this.landscapes.length,
        hasNext: endIndex < this.landscapes.length,
        hasPrev: page > 1
      }
    };
  }

  async buscarPaisagensPorUsuario(userId, filters = {}) {
    const { page = 1, limit = 10 } = filters;
    const userLandscapes = this.landscapes.filter(l => l.uploadedBy === userId);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: userLandscapes.slice(startIndex, endIndex),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(userLandscapes.length / limit),
        total: userLandscapes.length,
        hasNext: endIndex < userLandscapes.length,
        hasPrev: page > 1
      }
    };
  }

  async atualizarPaisagem(id, updateData) {
    const landscapeIndex = this.landscapes.findIndex(l => l.id === id);
    if (landscapeIndex === -1) return null;
    
    this.landscapes[landscapeIndex] = { ...this.landscapes[landscapeIndex], ...updateData };
    return this.landscapes[landscapeIndex];
  }
}

export default AdaptadorHibrido;
