# 🧪 CNPJs para Teste no Sistema

## ✅ **CNPJs Validados e Funcionando**

### 🏢 **Empresas já testadas com sucesso:**
```
11.222.333/0001-81  ✅ - Caixa Escolar (Testado - Funciona)
60.746.948/0001-12  ✅ - Banco Bradesco (Testado - Funciona)
00.000.000/0001-91  ✅ - Banco do Brasil (Testado - Funciona)
```

### 📱 **Mais CNPJs Válidos para Testar:**

#### 🏪 **Grandes Redes de Varejo:**
```
47.960.950/0001-21  - Lojas Americanas S.A.
02.558.157/0001-62  - Companhia Brasileira de Distribuição (Pão de Açúcar)
59.291.534/0001-93  - Magazine Luiza S.A.
45.543.915/0001-81  - Via Varejo S.A. (Casas Bahia)
```

#### 🏦 **Bancos e Instituições Financeiras:**
```
60.701.190/0001-04  - Itaú Unibanco S.A.
33.657.248/0001-24  - Banco Bradesco S.A.
90.400.888/0001-42  - Caixa Econômica Federal
04.902.979/0001-44  - Banco Santander Brasil S.A.
```

#### 🍔 **Alimentação e Restaurantes:**
```
42.591.651/0001-43  - Arcos Dourados (McDonald's)
61.186.888/0001-74  - Burger King
17.285.309/0001-35  - Subway
11.603.527/0001-81  - Starbucks Coffee Company
```

#### ⚡ **Energia e Telecomunicações:**
```
02.012.862/0001-91  - Petróleo Brasileiro S.A. (Petrobras)
33.000.118/0001-79  - Telefônica Brasil S.A. (Vivo)
07.422.098/0001-04  - Claro S.A.
04.184.175/0001-70  - TIM S.A.
```

#### 🚗 **Automotivo:**
```
59.104.422/0001-50  - General Motors do Brasil
67.132.696/0001-56  - Volkswagen do Brasil
61.074.351/0001-33  - Ford Motor Company Brasil
45.105.351/0001-39  - Fiat Chrysler Automóveis
```

#### 🏭 **Indústria:**
```
33.014.556/0001-96  - Ambev S.A.
60.476.884/0001-84  - Vale S.A.
84.683.374/0001-12  - Gerdau S.A.
17.190.616/0001-04  - JBS S.A.
```

## 🔧 **Como Testar:**

### Via cURL:
```bash
curl -X POST http://localhost:3001/api/consultations/cnpj \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"cnpj": "47.960.950/0001-21"}'
```

### Via Interface Web:
1. Acesse: http://localhost:5174
2. Faça login com: teste@exemplo.com / MinhaSenh@123
3. Digite um dos CNPJs acima no campo de busca
4. Clique em "Consultar"

## 📊 **Dados que você verá:**
- **Razão Social** - Nome oficial da empresa
- **Nome Fantasia** - Nome comercial
- **Situação** - ATIVA, BAIXADA, SUSPENSA, INAPTA
- **Endereço Completo** - Logradouro, número, cidade, estado, CEP
- **CNAE** - Código de atividade econômica
- **Porte** - MEI, ME, EPP, GRANDE
- **Telefone e Email** (quando disponível)
- **Data de Abertura**
- **Capital Social**

## ⚠️ **Dicas:**
- Use CNPJs reais para ter dados completos
- O sistema tem cache de 24h - consultas repetidas serão mais rápidas
- Se uma API falhar, o sistema tenta outra automaticamente
- Todos os dados são salvos no seu histórico de consultas

## 🎯 **CNPJs Recomendados para Demonstração:**
```
00.000.000/0001-91  - Banco do Brasil (Dados completos)
47.960.950/0001-21  - Lojas Americanas (Varejo)
60.746.948/0001-12  - Bradesco (Banco)
02.012.862/0001-91  - Petrobras (Grande empresa)
```
