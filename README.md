# Sistema de Consulta CNPJ - Edenred Brasil

Sistema completo para consulta e gestão de empresas brasileiras, desenvolvido para a Edenred Brasil.

## 🏗️ Arquitetura

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + MongoDB
- **Autenticação**: JWT
- **APIs**: Integração com Receita Federal

## 🚀 Funcionalidades

### Frontend
- ✅ Sistema de login/autenticação
- ✅ Consulta CNPJ com wizard multi-etapas
- ✅ Dashboard com estatísticas
- ✅ Gestão de empresas
- ✅ Interface responsiva e moderna
- ✅ Comunicação real com backend

### Backend  
- ✅ API RESTful completa
- ✅ Autenticação JWT
- ✅ Middleware de segurança
- ✅ Rate limiting
- ✅ Validação de dados
- ✅ Integração com MongoDB
- ✅ Consulta CNPJ externa

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- MongoDB
- npm ou yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
npm run seed  # Popular banco com dados de exemplo
npm start     # Servidor rodando em http://localhost:3001
```

### Frontend
```bash
npm install
npm run dev   # Aplicação rodando em http://localhost:5173
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```bash
PORTA_SERVIDOR=3001
AMBIENTE_EXECUCAO=desenvolvimento
TIPO_BANCO_DADOS=mongodb
URL_CONEXAO_MONGODB=mongodb://localhost:27017/sistema_consulta_cnpj
CHAVE_SECRETA_JWT=sua_chave_secreta_jwt
ORIGENS_CORS_PERMITIDAS=http://localhost:5173,http://localhost:3000
```

## 👤 Usuário de Teste

Para testar o sistema:
- **Email**: teste@edenred.com  
- **Senha**: Test123456

## 🔗 Endpoints da API

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/companies` - Listar empresas
- `POST /api/consultations/cnpj` - Consultar CNPJ
- `GET /api/consultations` - Listar consultas
- `GET /health` - Health check

## 🏃‍♂️ Como usar

1. Execute o backend: `cd backend && npm start`
2. Execute o frontend: `npm run dev`
3. Acesse: http://localhost:5173
4. Faça login com as credenciais de teste
5. Use o sistema de consulta CNPJ

## ✨ Melhorias Implementadas

- **Comunicação Real**: Substituído sistema mock por API real
- **Autenticação Funcional**: Login/logout com JWT
- **Validação Completa**: Validações no frontend e backend
- **Tratamento de Erros**: Sistema robusto de tratamento de erros
- **Interface Moderna**: Design responsivo e interativo
- **Dados de Exemplo**: Script de seed para popular o banco

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router DOM
- React Hot Toast

### Backend
- Express.js
- MongoDB/Mongoose
- JWT
- Bcrypt
- CORS
- Helmet
- Rate Limiting

## 📁 Estrutura do Projeto

```
app_edenred/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços de API
│   └── config/            # Configurações
└── backend/               # Backend Node.js
    ├── src/
    │   ├── controllers/   # Controladores
    │   ├── models/        # Modelos MongoDB
    │   ├── routes/        # Rotas da API
    │   ├── middleware/    # Middlewares
    │   └── utils/         # Utilitários
    └── .env              # Variáveis de ambiente
```

## 🔒 Segurança

- Autenticação JWT
- Criptografia de senhas com bcrypt
- Rate limiting configurado
- Validação de dados rigorosa
- Headers de segurança com Helmet
- Sanitização de dados

---

**Desenvolvido para Edenred Brasil** 🇧🇷
