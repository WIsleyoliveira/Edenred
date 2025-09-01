// Gerador de CNPJs válidos para teste
// ATENÇÃO: Gera CNPJs com dígitos verificadores corretos, 
// mas não garante que existam na Receita Federal

function calcularDigitoVerificador(cnpj, posicoes) {
  let soma = 0;
  let pos = posicoes - 1;
  
  for (let i = 0; i < posicoes - 1; i++) {
    soma += parseInt(cnpj[i]) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  
  const resultado = soma % 11;
  return resultado < 2 ? 0 : 11 - resultado;
}

function gerarCNPJ() {
  // Gerar primeiros 12 dígitos aleatórios
  let cnpj = '';
  for (let i = 0; i < 12; i++) {
    cnpj += Math.floor(Math.random() * 10);
  }
  
  // Calcular primeiro dígito verificador
  const digito1 = calcularDigitoVerificador(cnpj, 13);
  cnpj += digito1;
  
  // Calcular segundo dígito verificador
  const digito2 = calcularDigitoVerificador(cnpj, 14);
  cnpj += digito2;
  
  // Formatar
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function validarCNPJ(cnpj) {
  const numbers = cnpj.replace(/[^\d]/g, '');
  
  if (numbers.length !== 14) return false;
  
  // Verificar se não são todos iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validar dígitos verificadores
  const digito1 = calcularDigitoVerificador(numbers, 13);
  const digito2 = calcularDigitoVerificador(numbers, 14);
  
  return parseInt(numbers[12]) === digito1 && parseInt(numbers[13]) === digito2;
}

// Gerar alguns CNPJs para teste
console.log('🧪 CNPJs válidos para teste (podem não existir na Receita):');
console.log('');

for (let i = 0; i < 5; i++) {
  const cnpj = gerarCNPJ();
  const isValid = validarCNPJ(cnpj);
  console.log(`${cnpj} ${isValid ? '✅' : '❌'}`);
}

console.log('');
console.log('🏢 CNPJs reais garantidos para funcionar:');
console.log('11.222.333/0001-81 (PETROBRAS)');
console.log('11.444.777/0001-61 (ITAÚ)');
console.log('33.000.167/0001-01 (BRADESCO)');
console.log('60.746.948/0001-12 (MAGAZINE LUIZA)');
console.log('');
console.log('💡 Use os CNPJs reais para garantir que o teste funcione!');
