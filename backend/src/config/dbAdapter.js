import dotenv from 'dotenv';
dotenv.config();

// Importar adaptadores
import AdaptadorFirebase from './adapters/firebaseAdapter.js';
import AdaptadorHibrido from './adapters/memoryAdapter.js';

class AdaptadorBancoDados {
  constructor() {
    this.adaptadorAtual = null;
    this.tipoAdaptador = process.env.TIPO_BANCO_DADOS || 'firebase';
    
    this.inicializar();
  }
  
  inicializar() {
    switch (this.tipoAdaptador.toLowerCase()) {
      case 'memory':
      case 'memoria':
        this.adaptadorAtual = new AdaptadorHibrido();
        break;
      case 'firebase':
      default:
        this.adaptadorAtual = new AdaptadorFirebase();
        break;
    }
    
    console.log(`🗄️ Usando banco de dados: ${this.tipoAdaptador.toUpperCase()}`);
  }
  
  // Métodos de usuário
  async criarUsuario(dadosUsuario) {
    return await this.adaptadorAtual.criarUsuario(dadosUsuario);
  }
  
  async buscarUsuarioPorId(id) {
    return await this.adaptadorAtual.buscarUsuarioPorId(id);
  }
  
  async buscarUsuarioPorEmail(email) {
    return await this.adaptadorAtual.buscarUsuarioPorEmail(email);
  }
  
  async atualizarUsuario(id, dadosAtualizacao) {
    return await this.adaptadorAtual.atualizarUsuario(id, dadosAtualizacao);
  }
  
  async deletarUsuario(id) {
    return await this.adaptadorAtual.deletarUsuario(id);
  }
  
  // Métodos de empresa
  async criarEmpresa(dadosEmpresa) {
    return await this.adaptadorAtual.criarEmpresa(dadosEmpresa);
  }
  
  async buscarEmpresaPorCNPJ(cnpj) {
    return await this.adaptadorAtual.buscarEmpresaPorCNPJ(cnpj);
  }
  
  async buscarEmpresasPorUsuario(idUsuario, filtros = {}) {
    return await this.adaptadorAtual.buscarEmpresasPorUsuario(idUsuario, filtros);
  }
  
  async atualizarEmpresa(id, dadosAtualizacao) {
    return await this.adaptadorAtual.atualizarEmpresa(id, dadosAtualizacao);
  }
  
  // Métodos de consulta
  async criarConsulta(dadosConsulta) {
    return await this.adaptadorAtual.criarConsulta(dadosConsulta);
  }
  
  async buscarConsultasPorUsuario(idUsuario, filtros = {}) {
    return await this.adaptadorAtual.buscarConsultasPorUsuario(idUsuario, filtros);
  }
  
  async atualizarConsulta(id, dadosAtualizacao) {
    return await this.adaptadorAtual.atualizarConsulta(id, dadosAtualizacao);
  }
  
  async obterEstatisticasConsulta(idUsuario) {
    return await this.adaptadorAtual.obterEstatisticasConsulta(idUsuario);
  }
  
  // Métodos de paisagem
  async criarPaisagem(dadosPaisagem) {
    return await this.adaptadorAtual.criarPaisagem(dadosPaisagem);
  }
  
  async buscarPaisagens(filtros = {}) {
    return await this.adaptadorAtual.buscarPaisagens(filtros);
  }
  
  async buscarPaisagensPorUsuario(idUsuario, filtros = {}) {
    return await this.adaptadorAtual.buscarPaisagensPorUsuario(idUsuario, filtros);
  }
  
  async atualizarPaisagem(id, dadosAtualizacao) {
    return await this.adaptadorAtual.atualizarPaisagem(id, dadosAtualizacao);
  }
  
  // Métodos de conexão
  async conectar() {
    return await this.adaptadorAtual.conectar();
  }
  
  async desconectar() {
    return await this.adaptadorAtual.desconectar();
  }
  
  // Verificação de saúde
  async verificarSaude() {
    return await this.adaptadorAtual.verificarSaude();
  }
}

// Singleton para garantir uma única instância
let instanciaBanco = null;

export const obterAdaptadorBanco = () => {
  if (!instanciaBanco) {
    instanciaBanco = new AdaptadorBancoDados();
  }
  return instanciaBanco;
};

export default AdaptadorBancoDados;
