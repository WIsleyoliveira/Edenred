# Configuração do Firebase

## Passos para configurar o Firebase

### 1. Criar projeto no Firebase Console
1. Acesse https://console.firebase.google.com/
2. Clique em "Criar projeto" ou "Adicionar projeto"
3. Dê um nome ao projeto (ex: `sistema-consulta-cnpj`)
4. Configure o Google Analytics (opcional)
5. Aguarde a criação do projeto

### 2. Configurar Firestore Database
1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo de segurança:
   - **Modo de teste**: Permite leitura/escrita por 30 dias (para desenvolvimento)
   - **Modo bloqueado**: Requer regras de segurança (para produção)
4. Escolha a localização do banco de dados

### 3. Configurar Authentication
1. Vá para "Authentication" > "Sign-in method"
2. Habilite "Email/Password"
3. Opcional: Configure outros provedores (Google, etc.)

### 4. Obter credenciais
1. Vá para "Configurações do projeto" (ícone de engrenagem)
2. Na aba "Geral", role para baixo até "Seus aplicativos"
3. Clique em "Adicionar aplicativo" > "Web"
4. Dê um nome ao app (ex: `sistema-cnpj-web`)
5. Copie as credenciais para o arquivo `.env`

### 5. Configurar regras de segurança (Firestore)

#### Regras para desenvolvimento:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

#### Regras para produção:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para empresas
    match /companies/{companyId} {
      allow read, write: if request.auth != null;
    }
    
    // Regras para consultas
    match /consultations/{consultationId} {
      allow read, write: if request.auth != null;
    }
    
    // Regras para paisagens
    match /landscapes/{landscapeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Firebase:

```
FIREBASE_API_KEY=sua_api_key_aqui
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 7. Instalar dependências

```bash
cd backend
npm install
```

### 8. Executar a aplicação

```bash
npm run dev
```

### 9. Estrutura das coleções no Firestore

O sistema usará as seguintes coleções:

- **users**: Dados dos usuários do sistema
- **companies**: Empresas cadastradas
- **consultations**: Histórico de consultas CNPJ
- **landscapes**: Paisagens/imagens do sistema

### 10. Testar a conexão

Acesse `http://localhost:5000/health` para verificar se o servidor está funcionando.

### Troubleshooting

**Erro de permissão**: Verifique se as regras do Firestore estão configuradas corretamente.

**Erro de conexão**: Verifique se as credenciais do Firebase estão corretas no arquivo `.env`.

**Erro de autenticação**: Verifique se o Authentication está habilitado no console do Firebase.
