# CNPJ Consultation System - Backend API

Backend completo para o sistema de consulta CNPJ com Node.js, Express e MongoDB.

Recursos

 ## pedi pro gpt fazer o readme, preguica, o mongo eu usei so pra ver se tava certo o fluxo do site, depois eu boto a firebase ou, a gente so conecta os dois 


##  Pré-requisitos

- Node.js 18+
- MongoDB 4.4+
- NPM ou Yarn

##  Instalação

1. **Clone o repositório e acesse o backend**
```bash
cd backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cnpj_consultation
JWT_SECRET=sua_chave_secreta_muito_forte_aqui_123456789
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

4. **Inicie o MongoDB**
```bash
# Se usando MongoDB local
mongod

# Ou use MongoDB Atlas (configure MONGODB_URI)
```

5. **Execute o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:5000`

##  Endpoints da API

###  Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|---------|
| POST | `/register` | Registrar usuário | Público |
| POST | `/login` | Login | Público |
| GET | `/profile` | Perfil do usuário | Privado |
| PUT | `/profile` | Atualizar perfil | Privado |
| POST | `/change-password` | Alterar senha | Privado |
| GET | `/verify` | Verificar token | Privado |
| POST | `/logout` | Logout | Privado |
| DELETE | `/account` | Deletar conta | Privado |

###  Consultas CNPJ (`/api/consultations`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|---------|
| POST | `/cnpj` | Consultar CNPJ | Privado |
| GET | `/` | Listar consultas | Privado |
| GET | `/stats` | Estatísticas | Privado |
| PATCH | `/:id/favorite` | Favoritar | Privado |

###  Empresas (`/api/companies`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|---------|
| GET | `/` | Listar empresas | Privado |

### 👥 Usuários (`/api/users`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|---------|
| GET | `/dashboard` | Dashboard | Privado |

### Paisagens (`/api/landscapes`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|---------|
| GET | `/` | Paisagens públicas | Público |
| GET | `/my` | Minhas paisagens | Privado |

###  Upload (`/api/upload`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|---------|
| POST | `/image` | Upload de imagem | Privado |

##  Exemplos de Uso

### Registrar Usuário
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "MinhaSenh@123",
    "confirmPassword": "MinhaSenh@123"
  }'
```

### Consultar CNPJ
```bash
curl -X POST http://localhost:5000/api/consultations/cnpj \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "cnpj": "11.222.333/0001-81"
  }'
```

### Upload de Imagem
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -F "image=@/caminho/para/imagem.jpg"
```

##  Segurança

### Rate Limiting
- **Autenticação**: 5 tentativas por 15 minutos
- **API Geral**: 100 requests por 15 minutos
- **Upload**: 20 uploads por hora
- **CNPJ**: 50 consultas por hora

### Validação
- Todos os inputs são validados
- CNPJ validado com algoritmo oficial
- Sanitização automática de dados

### Headers de Segurança
- Helmet configurado
- CORS restritivo
- XSS Protection
- NoSniff
- Frame Options

##  Monitoramento

### Health Check
```bash
GET /health
```

### Logs
- Logs estruturados com Morgan
- Diferentes níveis por ambiente
- Rotação automática de logs

##  Banco de Dados

### Modelos
- **User** - Usuários do sistema
- **Company** - Empresas/CNPJs
- **Consultation** - Histórico de consultas
- **Landscape** - Galeria de imagens

### Indexes
- Otimização para queries frequentes
- Indexes compostos para performance
- Text search em campos relevantes

##  Configuração Avançada

### Variáveis de Ambiente
```env
# Servidor
PORT=5000
NODE_ENV=development

# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/cnpj_consultation

# JWT
JWT_SECRET=chave_super_secreta
JWT_EXPIRE=7d

# APIs Externas
RECEITA_WS_BASE_URL=https://www.receitaws.com.br/v1

# Upload
MAX_FILE_SIZE=5000000
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

##  Deploy

### Usando PM2
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start src/server.js --name "cnpj-api"

# Ver logs
pm2 logs cnpj-api

# Restart
pm2 restart cnpj-api
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

##  Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Produção
npm start

# Executar testes
npm test

# Seed do banco de dados
npm run seed
```

##  Status Codes

- **200** - Sucesso
- **201** - Criado
- **400** - Erro de validação
- **401** - Não autorizado
- **403** - Proibido
- **404** - Não encontrado
- **429** - Rate limit excedido
- **500** - Erro interno



**Desenvolvido por wisley** 
