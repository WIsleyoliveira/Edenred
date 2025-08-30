import AdaptadorFirebase from '../config/adapters/firebaseAdapter.js';
import bcryptjs from 'bcryptjs';

// Validadores e utilitários para usuários
class User {
  constructor() {
    this.firebase = new AdaptadorFirebase();
  }

  // Validar formato do email
  static validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  }

  // Validar dados do usuário
  static validateUserData(data) {
    const errors = [];

    if (!data.name) {
      errors.push('Nome é obrigatório');
    } else if (data.name.length > 100) {
      errors.push('Nome não pode ter mais de 100 caracteres');
    }

    if (!data.email) {
      errors.push('Email é obrigatório');
    } else if (!User.validateEmail(data.email)) {
      errors.push('Email inválido');
    }

    if (!data.password) {
      errors.push('Senha é obrigatória');
    } else if (data.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (data.role && !['user', 'admin'].includes(data.role)) {
      errors.push('Role deve ser: user ou admin');
    }

    if (data.preferences?.theme && !['light', 'dark'].includes(data.preferences.theme)) {
      errors.push('Theme deve ser: light ou dark');
    }

    return errors;
  }

  // Criar dados padrão para um usuário
  static createDefaultUserData(data) {
    return {
      name: data.name?.trim() || '',
      email: data.email?.toLowerCase().trim() || '',
      password: data.password || '',
      role: data.role || 'user',
      avatar: data.avatar || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      lastLogin: data.lastLogin || null,
      preferences: {
        theme: data.preferences?.theme || 'light',
        notifications: data.preferences?.notifications !== undefined ? data.preferences.notifications : true
      }
    };
  }

  // Hash da senha
  static async hashPassword(password) {
    const saltRounds = parseInt(process.env.ROUNDS_CRIPTOGRAFIA_SENHA) || 12;
    return await bcryptjs.hash(password, saltRounds);
  }

  // Comparar senhas
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcryptjs.compare(candidatePassword, hashedPassword);
  }

  // Remover campos sensíveis
  static sanitizeUser(userData) {
    const sanitized = { ...userData };
    delete sanitized.password;
    delete sanitized.__v;
    return sanitized;
  }

  // Atualizar último login
  static async updateLastLogin(userId) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      return await firebase.atualizarUsuario(userId, {
        lastLogin: new Date()
      });
    } catch (error) {
      throw error;
    }
  }
}

export default User;

// so pra enviar
