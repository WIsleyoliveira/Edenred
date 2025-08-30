#  **BACKEND COMPLETO COM FIREBASE + MONGODB**

##  **O QUE FOI CRIADO**

✅ **Backend Node.js/Express completo e profissional**  
✅ **Sistema de adaptadores MongoDB ↔ Firebase**  
✅ **Todas as variáveis em português brasileiro didático**  
✅ **Integração Firebase COMPLETA implementada**  
✅ **Funciona com MongoDB AGORA, Firebase quando quiser**

---

##  **SISTEMA DE BANCO DE DADOS FLEXÍVEL**

###  **Como Funciona:**
- **Agora**: Usando MongoDB (funcional)
- **Futuro**: Muda para Firebase apenas alterando uma variável
- **Código**: Iguais para ambos - adaptador traduz automaticamente

###  **Estrutura do Adaptador:**
```
backend/src/config/
├── dbAdapter.js              #  Controle principal (PT-BR)
├── adapters/
│   ├── mongodbAdapter.js     #  MongoDB (funcionando)
│   └── firebaseAdapter.js    #  Firebase (completo, pronto)
```

---

## **COMO USAR**

### 1. **MongoDB (Atual - Funcionando)**
```bash
# Instalar dependências
cd backend
npm install

# Executar servidor  
npm run dev

#  Pronto! Rodando em http://localhost:5001
```

### 2. **Firebase (Futuro - Migração)**
```bash
# 1. Instalar Firebase
npm install firebase

# 2. Alterar apenas UMA variável no .env:
TIPO_BANCO_DADOS=firebase

# 3. Configurar credenciais Firebase no .env:
CHAVE_API_FIREBASE=sua_chave_aqui
ID_PROJETO_FIREBASE=seu_projeto
# ... (outras configs)

# 4. Reiniciar servidor
npm run dev


```env
# ========================================
#  CONFIGURAÇÕES DO SERVIDOR
# ========================================
PORTA_SERVIDOR=5001
AMBIENTE_EXECUCAO=desenvolvimento

# ========================================
#  CONFIGURAÇÕES DO BANCO DE DADOS  
# ========================================
# Opções: 'mongodb' ou 'firebase'
TIPO_BANCO_DADOS=mongodb

# MongoDB (banco atual)
URL_CONEXAO_MONGODB=mongodb://localhost:27017/sistema_consulta_cnpj
NOME_BANCO_DADOS=sistema_consulta_cnpj

# Firebase (banco futuro)
CHAVE_API_FIREBASE=sua_chave_api_firebase_aqui
DOMINIO_AUTH_FIREBASE=seu-projeto.firebaseapp.com
ID_PROJETO_FIREBASE=seu-projeto-firebase
BUCKET_STORAGE_FIREBASE=seu-projeto.appspot.com
ID_REMETENTE_FIREBASE=123456789
ID_APP_FIREBASE=1:123456789:web:abcdef123456

# ========================================
#  CONFIGURAÇÕES DE AUTENTICAÇÃO
# ========================================
CHAVE_SECRETA_JWT=minha_chave_super_secreta_jwt_123456789_desenvolvimento
TEMPO_EXPIRACAO_JWT=7d
ROUNDS_CRIPTOGRAFIA_SENHA=12

# ========================================
#  CONFIGURAÇÕES DE CONSULTA CNPJ
# ========================================
URL_BASE_RECEITA_WS=https://www.receitaws.com.br/v1
CHAVE_API_CNPJ_EXTERNA=sua_chave_api_cnpj_aqui

# ========================================
#  CONFIGURAÇÕES DE UPLOAD DE ARQUIVOS
# ========================================
TAMANHO_MAXIMO_ARQUIVO=5000000
TIPOS_ARQUIVOS_PERMITIDOS=image/jpeg,image/png,image/gif,image/webp

# ========================================
#  CONFIGURAÇÕES DE SEGURANÇA
# ========================================
JANELA_LIMITE_REQUISICOES_MS=900000
MAXIMO_REQUISICOES_POR_JANELA=100
ORIGENS_CORS_PERMITIDAS=http://localhost:5173,http://localhost:3000
```

---

##  **FIREBASE ADAPTER**

###  **Funcionalidades Implementadas:**
-  **Autenticação completa** (registro, login, JWT)
-  **Sistema de empresas/CNPJ** (CRUD completo)
-  **Histórico de consultas** com estatísticas
-  **Galeria de paisagens** (upload, likes, comentários)
-  **Busca e filtros** avançados
-  **Paginação** otimizada
-  **Performance** otimizada para Firestore

###  **Estrutura Firebase (quando ativado):**
```
Firestore Collections:
├── usuarios/{id}        # Dados dos usuários
├── empresas/{id}        # Empresas/CNPJs consultadas  
├── consultas/{id}       # Histórico de consultas
└── paisagens/{id}       # Galeria de imagens
```

---

##  **ENDPOINTS DA API (Todos Funcionando)**

###  **Autenticação:**
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil
- `PUT /api/auth/profile` - Atualizar perfil

###  **Consulta CNPJ:**
- `POST /api/consultations/cnpj` - Consultar CNPJ
- `GET /api/consultations` - Histórico
- `GET /api/consultations/stats` - Estatísticas

###  **Empresas:**
- `GET /api/companies` - Listar empresas

###  **Paisagens:**
- `GET /api/landscapes` - Galeria pública
- `GET /api/landscapes/my` - Minhas paisagens

###  **Upload:**
- `POST /api/upload/image` - Upload de imagens

---

##  **MIGRAÇÃO MONGODB → FIREBASE**

### **Passo a Passo Super Simples:**

1. **Instalar Firebase:**
```bash
npm install firebase
```

2. **Criar projeto no Firebase:**
   - Acesse [Firebase Console](https://console.firebase.google.com)
   - Crie novo projeto
   - Ative Firestore Database
   - Copie as configurações

3. **Atualizar .env:**
```env
# Mudar apenas esta linha:
TIPO_BANCO_DADOS=firebase

# Adicionar configurações do Firebase:
CHAVE_API_FIREBASE=sua_chave_real_aqui
ID_PROJETO_FIREBASE=seu-projeto-real
# ... outras configs
```

4. **Reiniciar servidor:**
```bash
npm run dev
```

**PRONTO! Agora usando Firebase sem mudar uma linha de código!**

---

##  **SEGURANÇA IMPLEMENTADA**

-  **JWT Authentication** com refresh
-  **Rate Limiting** por endpoint
-  **Validação robusta** de dados
-  **Sanitização** automática
-  **CORS** configurável
-  **Helmet** para headers seguros
-  **Bcrypt** para senhas
-  **Soft delete** para usuários

---

##  **RECURSOS AVANÇADOS**

###  **Sistema de Consulta CNPJ:**
- Integração com **ReceitaWS** e **BrasilAPI**
- **Cache inteligente** (24h)
- **Fallback** automático entre APIs
- **Validação oficial** de CNPJ
- **Histórico completo** de consultas
- **Sistema de favoritos**

###  **Sistema de Galeria:**
- **Upload seguro** de imagens
- **Redimensionamento** automático
- **Sistema de likes** e comentários
- **Categorização** e tags
- **Busca avançada** por localização

###  **Analytics e Stats:**
- **Dashboard** de estatísticas
- **Tempo de resposta** das consultas
- **Taxa de sucesso** das APIs
- **Métricas** de usuário

---

##  **PRÓXIMOS PASSOS**

1. **Testar MongoDB** (atual):
```bash
cd backend
npm install
npm run dev
#  Funciona em http://localhost:5001
```

2. **Conectar Frontend** ao backend:
   - Base URL: `http://localhost:5001/api`
   - Headers: `Authorization: Bearer TOKEN`

3. **Migrar para Firebase** (quando quiser):
   - `npm install firebase`
   - Configurar .env
   - `TIPO_BANCO_DADOS=firebase`
   - Reiniciar servidor

4. **Deploy em produção**:
   - Heroku, Vercel, Railway, etc.
   - Configurar variáveis de produção

---

##  **O QUE VOCÊ TEM AGORA**

**Backend Node.js profissional e completo**  
 **MongoDB funcionando 100%**  
 **Firebase pronto para usar (só ativar)**  
 **Todas variáveis em português didático**  
 **Documentação completa**  
 **Arquitetura escalável e flexível**  
 **Segurança de nível enterprise**  
 **APIs RESTful padronizadas**  
 **Sistema de cache inteligente**  
 **Tratamento de erros robusto**

**🎉 Você tem o backend mais completo e flexível possível para seu sistema de consulta CNPJ!**

---

**Desenvolvido por NOVOCODIGO**

