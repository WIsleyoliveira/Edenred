import { obterAdaptadorBanco } from '../config/dbAdapter.js';
import { generateToken } from '../middleware/auth.js';

// Registrar novo usuário
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se usuário já existe
    const db = obterAdaptadorBanco();
    const existingUser = await db.buscarUsuarioPorEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está cadastrado no sistema',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }
    // Criar novo usuário via adaptador (Firebase)
    const createdUser = await db.criarUsuario({
      name: name.trim(),
      email,
      password
    });

    // Gerar token usando id retornado (adapter deve retornar id/uid)
    const token = generateToken(createdUser.id || createdUser.uid);

    // Responder
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: {
          id: createdUser.id || createdUser.uid,
          name: createdUser.name || name.trim(),
          email: createdUser.email,
          role: createdUser.role || 'user',
          avatar: createdUser.avatar || null,
          preferences: createdUser.preferences || {},
          createdAt: createdUser.criadoEm || new Date()
        },
        token
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Login de usuário
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Autenticar via adaptador
    const db = obterAdaptadorBanco();
    const authenticatedUser = await db.autenticarUsuario(email, password);

    if (!authenticatedUser) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Gerar token
    const token = generateToken(authenticatedUser.id || authenticatedUser.uid);

    // Atualizar último login (se adaptador suportar atualizar)
    try {
      await db.atualizarUsuario(authenticatedUser.id || authenticatedUser.uid, { lastLogin: new Date() });
    } catch (err) {
      // Ignora falhas de atualização de metadata
      console.warn('Aviso: não foi possível atualizar lastLogin via adaptador:', err.message || err);
    }

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: authenticatedUser.id || authenticatedUser.uid,
          name: authenticatedUser.name || authenticatedUser.userName || null,
          email: authenticatedUser.email,
          role: authenticatedUser.role || 'user',
          avatar: authenticatedUser.avatar || null,
          preferences: authenticatedUser.preferences || {},
          lastLogin: authenticatedUser.lastLogin || new Date(),
          createdAt: authenticatedUser.criadoEm || authenticatedUser.createdAt || new Date()
        },
        token
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Obter perfil do usuário logado
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('consultationCount');

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          lastLogin: user.lastLogin,
          consultationCount: user.consultationCount || 0,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Atualizar perfil
export const updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    const userId = req.user._id;

    const updateData = {};
    
    if (name) updateData.name = name.trim();
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Alterar senha
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Buscar usuário com senha
    const user = await User.findById(userId).select('+password');

    // Verificar senha atual
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual incorreta',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Verificar token
export const verifyToken = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token válido',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    }
  });
};

// Logout (invalidar token do lado cliente)
export const logout = async (req, res) => {
  // Como estamos usando JWT stateless, o logout é feito no frontend
  // removendo o token do storage. Aqui apenas retornamos sucesso.
  
  res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
};

// Deletar conta
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    // Buscar usuário com senha
    const user = await User.findById(userId).select('+password');

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha incorreta',
        code: 'INVALID_PASSWORD'
      });
    }

    // Desativar conta ao invés de deletar (soft delete)
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Conta desativada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// so pra enviar
