# Sistema de Consulta CNPJ - Firebase

Este é o backend do sistema de consulta CNPJ, agora migrado para usar **Firebase Firestore** como banco de dados principal.

## 🚀 Migração Concluída

O sistema foi completamente migrado do MongoDB para o Firebase, com as seguintes mudanças:

### ✅ O que foi implementado

1. **Adaptador Firebase completo** - Todos os métodos CRUD implementados
2. **Migração completa para Firebase** - Sistema 100% baseado em Firestore
3. **Atualização do servidor** - Middlewares desnecesários removidos
4. **Novo sistema de seed** - Script atualizado para Firebase
5. **Configuração de ambiente** - Variáveis atualizadas para Firebase

### 📦 Dependências atualizadas

**Removidas:**
- `mongoose` (não é mais necessário)
- Dependências relacionadas ao MongoDB

**Adicionadas:**
- `firebase` (^10.7.1)

## 🔧 Configuração

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar Firebase

Siga as instruções em `FIREBASE_SETUP.md` para:
- Criar projeto no Firebase Console
- Configurar Firestore Database
- Configurar Authentication
- Obter credenciais

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo:
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

TIPO_BANCO_DADOS=firebase
```

## 🎯 Como usar

### Executar em desenvolvimento

```bash
npm run dev
```

### Executar em produção

```bash
npm start
```

### Popular banco com dados de exemplo

```bash
npm run seed
```

### Executar testes

```bash
npm test
```

## 📊 Estrutura do Firestore

O sistema usa as seguintes coleções:

- **users** - Dados dos usuários do sistema
- **companies** - Empresas cadastradas  
- **consultations** - Histórico de consultas CNPJ
- **landscapes** - Paisagens/imagens do sistema

## 🔄 Adaptadores disponíveis

O sistema suporta múltiplos bancos através do padrão adapter:

- **firebase** (padrão) - Firebase Firestore
- **memory** - Banco em memória (para testes)

Configure no `.env`:
```
TIPO_BANCO_DADOS=firebase
# ou
TIPO_BANCO_DADOS=memory
```

## 🚨 Troubleshooting

### Erro de permissão no Firestore
Verifique as regras de segurança no Firebase Console.

### Erro de conexão
Confirme se as credenciais no `.env` estão corretas.

### Erro de autenticação
Verifique se o Authentication está habilitado no Firebase.

## 📝 Notas da migração

- Todos os IDs agora são strings (Firestore document IDs)
- As datas são armazenadas como Timestamp do Firebase
- As consultas foram adaptadas para a sintaxe do Firestore
- O sistema mantém compatibilidade total com a interface anterior

## 🔗 Links úteis

- [Firebase Console](https://console.firebase.google.com/)
- [Documentação Firestore](https://firebase.google.com/docs/firestore)
- [Documentação Firebase Auth](https://firebase.google.com/docs/auth)
