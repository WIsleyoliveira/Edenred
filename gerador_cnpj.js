#!/usr/bin/env node

/**
 * 🧪 Gerador de CNPJ Válido para Testes
 * 
 * Este script gera CNPJs numericamente válidos para teste
 * Uso: node gerador_cnpj.js [quantidade]
 */

function gerarCNPJ() {
  // Gerar os primeiros 12 dígitos
  let cnpj = '';
  for (let i = 0; i < 12; i++) {
    cnpj += Math.floor(Math.random() * 10).toString();
  }
  
  // Calcular primeiro dígito verificador
  let soma = 0;
  let peso = 2;
  
  for (let i = 11; i >= 0; i--) {
    soma += parseInt(cnpj[i]) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  
  const resto1 = soma % 11;
  const digito1 = resto1 < 2 ? 0 : 11 - resto1;
  cnpj += digito1.toString();
  
  // Calcular segundo dígito verificador
  soma = 0;
  peso = 2;
  
  for (let i = 12; i >= 0; i--) {
    soma += parseInt(cnpj[i]) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  
  const resto2 = soma % 11;
  const digito2 = resto2 < 2 ? 0 : 11 - resto2;
  cnpj += digito2.toString();
  
  return cnpj;
}

function formatarCNPJ(cnpj) {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// Quantidade de CNPJs para gerar
const quantidade = process.argv[2] ? parseInt(process.argv[2]) : 5;

console.log('🧪 CNPJs Válidos Gerados para Teste:\\n');

for (let i = 0; i < quantidade; i++) {
  const cnpj = gerarCNPJ();
  const cnpjFormatado = formatarCNPJ(cnpj);
  console.log(`${cnpjFormatado}  (${cnpj})`);
}

console.log('\\n⚠️  Nota: Estes CNPJs são numericamente válidos mas podem não');
console.log('   existir na Receita Federal. Use os CNPJs reais da lista para');
console.log('   obter dados completos das empresas.\\n');

console.log('🎯 Para teste com dados reais, use:');
console.log('   00.000.000/0001-91 - Banco do Brasil');
console.log('   47.960.950/0001-21 - Magazine Luiza');
console.log('   60.746.948/0001-12 - Bradesco');
