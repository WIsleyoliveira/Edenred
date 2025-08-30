import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updatePassword, 
  deleteUser as deleteFirebaseUser 
} from 'firebase/auth';
import bcryptjs from 'bcryptjs';

class AdaptadorFirebase {
  constructor() {
    this.estaConectado = false;
    this.db = null;
    this.auth = null;
    
    console.log('🔥 Adaptador Firebase inicializado');
  }
  
  async conectar() {
    try {
  // Build Firebase config from environment and log a minimal debug snapshot.
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };

  // Minimal debug output (mask most of apiKey)
  const apiKey = firebaseConfig.apiKey;
  console.log('DEBUG Firebase config:', {
    apiKeyPresent: !!apiKey,
    apiKeyPreview: apiKey ? `*****${apiKey.slice(-4)}` : null,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });

  if (!apiKey) {
    throw new Error('FIREBASE_API_KEY não encontrada. Verifique seu .env e o nome da variável (FIREBASE_API_KEY).');
  }

  // Quick heuristic: most Firebase client API keys start with 'AIza'. If not, warn.
  if (typeof apiKey === 'string' && !apiKey.startsWith('AIza')) {
    console.warn('AVISO: FIREBASE_API_KEY não parece ser uma API key cliente do Firebase (não começa com "AIza"). Se este for um backend/servidor, considere usar firebase-admin com uma service account.');
  }

  const app = initializeApp(firebaseConfig);
      this.db = getFirestore(app);
      this.auth = getAuth(app);
      
      this.estaConectado = true;
      console.log('✅ Firebase conectado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar Firebase:', error);
      throw error;
    }
  }
  
  async desconectar() {
    this.estaConectado = false;
    console.log('🔌 Firebase desconectado');
  }
  
  async verificarSaude() {
    return this.estaConectado;
  }
  
  // MÉTODOS DE USUÁRIO
  async criarUsuario(dadosUsuario) {
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        dadosUsuario.email,
        dadosUsuario.password
      );
      
      const user = userCredential.user;
      
      // Salvar dados adicionais no Firestore usando o UID como ID do documento
      const userDocRef = doc(this.db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...dadosUsuario,
        uid: user.uid,
        criadoEm: Timestamp.now(),
        atualizadoEm: Timestamp.now()
      });
      
      return {
        id: user.uid,
        uid: user.uid,
        ...dadosUsuario,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      };
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Autenticar usuário usando Firebase Auth
  async autenticarUsuario(email, password) {
    try {
      // Tenta realizar sign in (retornará erro se credenciais inválidas)
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Buscar dados adicionais no Firestore usando o UID do Firebase Auth
      const userDoc = await getDoc(doc(this.db, 'users', user.uid));

      if (userDoc.exists()) {
        return {
          id: user.uid,
          uid: user.uid,
          ...userDoc.data()
        };
      }

      // Se não houver doc no Firestore, criar automaticamente para usuários existentes
      console.log('🔧 Criando documento Firestore para usuário existente:', user.uid);
      const userData = {
        email: user.email,
        name: user.displayName || 'Usuário',
        role: 'user',
        uid: user.uid,
        isActive: true,
        preferences: {
          theme: 'light',
          notifications: true
        },
        criadoEm: Timestamp.now(),
        atualizadoEm: Timestamp.now()
      };

      // Criar documento no Firestore
      await setDoc(doc(this.db, 'users', user.uid), userData);

      return {
        id: user.uid,
        uid: user.uid,
        ...userData,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      };
    } catch (error) {
      // Se credenciais inválidas, signInWithEmailAndPassword lançará erro — retornamos null para indicar falha de auth
      console.error('❌ Erro ao autenticar usuário no Firebase:', error.message || error);
      return null;
    }
  }
  
  async buscarUsuarioPorId(id) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', id));
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }
  
  async buscarUsuarioPorEmail(email) {
    try {
      const q = query(collection(this.db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por email:', error);
      throw error;
    }
  }
  
  async atualizarUsuario(id, dadosAtualizacao) {
    try {
      const userRef = doc(this.db, 'users', id);
      await updateDoc(userRef, {
        ...dadosAtualizacao,
        atualizadoEm: Timestamp.now()
      });
      
      const updatedDoc = await getDoc(userRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  }
  
  async deletarUsuario(id) {
    try {
      // Primeiro buscar o usuário para obter o UID
      const userDoc = await getDoc(doc(this.db, 'users', id));
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado');
      }
      
      const userData = userDoc.data();
      
      // Deletar do Firestore
      await deleteDoc(doc(this.db, 'users', id));
      
      // Deletar do Firebase Auth (se tiver UID)
      if (userData.uid) {
        // Nota: Para deletar usuário do Auth, precisa estar autenticado como admin
        // ou o próprio usuário. Esta implementação pode precisar de ajustes.
        console.log('⚠️  Deleção do Firebase Auth requer autenticação administrativa');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error);
      throw error;
    }
  }
  
  // MÉTODOS DE EMPRESA
  async criarEmpresa(dadosEmpresa) {
    try {
      const empresaRef = await addDoc(collection(this.db, 'companies'), {
        ...dadosEmpresa,
        criadoEm: Timestamp.now(),
        atualizadoEm: Timestamp.now()
      });
      
      return {
        id: empresaRef.id,
        ...dadosEmpresa,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      };
    } catch (error) {
      console.error('❌ Erro ao criar empresa:', error);
      throw error;
    }
  }
  
  async buscarEmpresaPorCNPJ(cnpj) {
    try {
      const q = query(collection(this.db, 'companies'), where('cnpj', '==', cnpj));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const empresaDoc = querySnapshot.docs[0];
        return {
          id: empresaDoc.id,
          ...empresaDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar empresa por CNPJ:', error);
      throw error;
    }
  }
  
  async buscarEmpresasPorUsuario(idUsuario, filtros = {}) {
    try {
      let q = query(collection(this.db, 'companies'), where('adicionadoPor', '==', idUsuario));
      
      if (filtros.search) {
        // Firebase não suporta OR queries facilmente, então fazemos filtro manual
        const allCompanies = await getDocs(q);
        const filteredCompanies = allCompanies.docs.filter(doc => {
          const data = doc.data();
          return data.razaoSocial?.toLowerCase().includes(filtros.search.toLowerCase()) ||
                 data.nomeFantasia?.toLowerCase().includes(filtros.search.toLowerCase());
        });
        
        return filteredCompanies.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      
      if (filtros.limit) {
        q = query(q, orderBy('criadoEm', 'desc'), filtros.limit);
      } else {
        q = query(q, orderBy('criadoEm', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar empresas por usuário:', error);
      throw error;
    }
  }
  
  async atualizarEmpresa(id, dadosAtualizacao) {
    try {
      const empresaRef = doc(this.db, 'companies', id);
      await updateDoc(empresaRef, {
        ...dadosAtualizacao,
        atualizadoEm: Timestamp.now()
      });
      
      const updatedDoc = await getDoc(empresaRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar empresa:', error);
      throw error;
    }
  }
  
  // MÉTODOS DE CONSULTA
  async criarConsulta(dadosConsulta) {
    try {
      const consultaRef = await addDoc(collection(this.db, 'consultations'), {
        ...dadosConsulta,
        criadoEm: Timestamp.now(),
        atualizadoEm: Timestamp.now()
      });
      
      return {
        id: consultaRef.id,
        ...dadosConsulta,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      };
    } catch (error) {
      console.error('❌ Erro ao criar consulta:', error);
      throw error;
    }
  }
  
  async buscarConsultasPorUsuario(idUsuario, filtros = {}) {
    try {
      let q = query(collection(this.db, 'consultations'), where('usuario', '==', idUsuario));
      
      if (filtros.limit) {
        q = query(q, orderBy('criadoEm', 'desc'), filtros.limit);
      } else {
        q = query(q, orderBy('criadoEm', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar consultas por usuário:', error);
      throw error;
    }
  }
  
  async atualizarConsulta(id, dadosAtualizacao) {
    try {
      const consultaRef = doc(this.db, 'consultations', id);
      await updateDoc(consultaRef, {
        ...dadosAtualizacao,
        atualizadoEm: Timestamp.now()
      });
      
      const updatedDoc = await getDoc(consultaRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar consulta:', error);
      throw error;
    }
  }
  
  async obterEstatisticasConsulta(idUsuario) {
    try {
      const q = query(collection(this.db, 'consultations'), where('usuario', '==', idUsuario));
      const querySnapshot = await getDocs(q);
      
      const totalConsultas = querySnapshot.size;
      const consultasComResultado = querySnapshot.docs.filter(doc => 
        doc.data().resultado && doc.data().resultado.status === 'success'
      ).length;
      
      const consultasComErro = querySnapshot.docs.filter(doc => 
        doc.data().resultado && doc.data().resultado.status === 'error'
      ).length;
      
      return {
        total: totalConsultas,
        sucesso: consultasComResultado,
        erro: consultasComErro,
        taxaSucesso: totalConsultas > 0 ? (consultasComResultado / totalConsultas) * 100 : 0
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      throw error;
    }
  }
  
  // MÉTODOS DE PAISAGEM
  async criarPaisagem(dadosPaisagem) {
    try {
      const paisagemRef = await addDoc(collection(this.db, 'landscapes'), {
        ...dadosPaisagem,
        criadoEm: Timestamp.now(),
        atualizadoEm: Timestamp.now()
      });
      
      return {
        id: paisagemRef.id,
        ...dadosPaisagem,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      };
    } catch (error) {
      console.error('❌ Erro ao criar paisagem:', error);
      throw error;
    }
  }
  
  async buscarPaisagens(filtros = {}) {
    try {
      let q = query(collection(this.db, 'landscapes'));
      
      if (filtros.search) {
        // Filtro manual para busca
        const allLandscapes = await getDocs(q);
        const filteredLandscapes = allLandscapes.docs.filter(doc => {
          const data = doc.data();
          return data.titulo?.toLowerCase().includes(filtros.search.toLowerCase()) ||
                 data.descricao?.toLowerCase().includes(filtros.search.toLowerCase());
        });
        
        return filteredLandscapes.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      
      q = query(q, orderBy('criadoEm', 'desc'));
      
      if (filtros.limit) {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.slice(0, filtros.limit).map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar paisagens:', error);
      throw error;
    }
  }
  
  async buscarPaisagensPorUsuario(idUsuario, filtros = {}) {
    try {
      let q = query(collection(this.db, 'landscapes'), where('usuario', '==', idUsuario));
      
      if (filtros.search) {
        // Filtro manual para busca
        const userLandscapes = await getDocs(q);
        const filteredLandscapes = userLandscapes.docs.filter(doc => {
          const data = doc.data();
          return data.titulo?.toLowerCase().includes(filtros.search.toLowerCase()) ||
                 data.descricao?.toLowerCase().includes(filtros.search.toLowerCase());
        });
        
        return filteredLandscapes.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      
      q = query(q, orderBy('criadoEm', 'desc'));
      
      if (filtros.limit) {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.slice(0, filtros.limit).map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar paisagens por usuário:', error);
      throw error;
    }
  }
  
  async atualizarPaisagem(id, dadosAtualizacao) {
    try {
      const paisagemRef = doc(this.db, 'landscapes', id);
      await updateDoc(paisagemRef, {
        ...dadosAtualizacao,
        atualizadoEm: Timestamp.now()
      });
      
      const updatedDoc = await getDoc(paisagemRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar paisagem:', error);
      throw error;
    }
  }
}

export default AdaptadorFirebase;
