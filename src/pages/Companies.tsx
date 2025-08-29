
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Building2, MapPin, Phone, Mail, Filter, Plus, Eye, Edit, Trash2, Download } from 'lucide-react'
import { apiService, type Company } from '../services/apiService'
import toast from 'react-hot-toast'

// Interface Company já importada do apiService

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [situacaoFilter, setSituacaoFilter] = useState('')
  const [porteFilter, setPorteFilter] = useState('')

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    filterCompanies()
  }, [searchTerm, situacaoFilter, porteFilter, companies])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      
      // Tentar buscar empresas da API
      const response = await apiService.getCompanies({ limit: 100 })
      
      if (response.success) {
        setCompanies(response.data.companies)
      } else {
        // Fallback para dados mock se a API não estiver funcionando
        const mockCompanies: Company[] = [
          {
            _id: '1',
            cnpj: '12.345.678/0001-90',
            razaoSocial: 'ANTONIO DISTRIBUIÇÃO LTDA',
            nomeFantasia: 'Antonio Distribuidora',
            situacao: 'ATIVA',
            porte: 'MÉDIA',
            telefone: '(11) 97463-2014',
            email: 'contato@antonio.com.br',
            endereco: {
              logradouro: 'Rua das Flores',
              numero: '123',
              cep: '01234-567',
              cidade: 'São Paulo',
              uf: 'SP'
            },
            atividade: 'Distribuição de Alimentos',
            createdAt: '2024-01-15T00:00:00.000Z'
          },
          {
            _id: '2',
            cnpj: '98.765.432/0001-10',
            razaoSocial: 'ELIANE SERVIÇOS E CONSULTORIA LTDA',
            nomeFantasia: 'Eliane Consultoria',
            situacao: 'ATIVA',
            porte: 'PEQUENA',
            telefone: '(11) 85642-2013',
            email: 'eliane@consultoria.com.br',
            endereco: {
              logradouro: 'Av. Paulista',
              numero: '456',
              cep: '01310-100',
              cidade: 'São Paulo',
              uf: 'SP'
            },
            atividade: 'Consultoria Empresarial',
            createdAt: '2024-02-10T00:00:00.000Z'
          },
          {
            _id: '3',
            cnpj: '11.222.333/0001-44',
            razaoSocial: 'LEA TECNOLOGIA E INOVAÇÃO S.A.',
            nomeFantasia: 'Lea Tech',
            situacao: 'ATIVA',
            porte: 'GRANDE',
            telefone: '(21) 87547-3921',
            email: 'contato@leatech.com.br',
            endereco: {
              logradouro: 'Rua do Ouvidor',
              numero: '789',
              cep: '20040-020',
              cidade: 'Rio de Janeiro',
              uf: 'RJ'
            },
            atividade: 'Desenvolvimento de Software',
            createdAt: '2024-03-05T00:00:00.000Z'
          },
          {
            _id: '4',
            cnpj: '55.666.777/0001-88',
            razaoSocial: 'ERIC INDÚSTRIAS METALÚRGICAS LTDA',
            nomeFantasia: 'Eric Metais',
            situacao: 'SUSPENSA',
            porte: 'MÉDIA',
            telefone: '(19) 99999-9999',
            email: 'eric@metalurgica.com.br',
            endereco: {
              logradouro: 'Distrito Industrial',
              numero: '1000',
              cep: '13100-000',
              cidade: 'Campinas',
              uf: 'SP'
            },
            atividade: 'Metalurgia',
            createdAt: '2024-04-12T00:00:00.000Z'
          }
        ]
        
        setCompanies(mockCompanies)
        toast.info('Usando dados de demonstração - API não disponível')
      }
      
    } catch (error: any) {
      console.error('Erro ao carregar empresas:', error)
      toast.error('Erro ao carregar dados das empresas')
      setCompanies([]) // Lista vazia em caso de erro
    } finally {
      setLoading(false)
    }
  }

  const filterCompanies = () => {
    let filtered = companies

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.cnpj.includes(searchTerm) ||
        c.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (situacaoFilter) {
      filtered = filtered.filter(c => c.situacao === situacaoFilter)
    }

    if (porteFilter) {
      filtered = filtered.filter(c => c.porte === porteFilter)
    }

    setFilteredCompanies(filtered)
  }

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case 'ATIVA':
        return <span className="badge-sucesso">ATIVA</span>
      case 'SUSPENSA':
        return <span className="badge-erro">SUSPENSA</span>
      case 'BAIXADA':
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">BAIXADA</span>
      default:
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{situacao}</span>
    }
  }

  const getPorteBadge = (porte: string) => {
    const colors = {
      'MICRO': 'bg-green-100 text-green-800',
      'PEQUENA': 'bg-blue-100 text-blue-800',
      'MÉDIA': 'bg-yellow-100 text-yellow-800',
      'GRANDE': 'bg-purple-100 text-purple-800'
    }
    
    return (
      <span className={`${colors[porte as keyof typeof colors] || 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-full text-sm font-semibold`}>
        {porte}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="titulo-principal text-4xl font-bold mb-2">Gestão de Empresas</h1>
                <p className="texto-elegante text-xl text-red-100">Base de dados completa de empresas brasileiras</p>
              </div>
              <div className="hidden md:flex items-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{companies.length}</div>
                  <div className="text-red-200 text-sm">Empresas Cadastradas</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros e Busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cartao-edenred mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por CNPJ, razão social ou nome fantasia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-80"
                />
              </div>

              <select
                value={situacaoFilter}
                onChange={(e) => setSituacaoFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todas as Situações</option>
                <option value="ATIVA">Ativa</option>
                <option value="SUSPENSA">Suspensa</option>
                <option value="BAIXADA">Baixada</option>
              </select>

              <select
                value={porteFilter}
                onChange={(e) => setPorteFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todos os Portes</option>
                <option value="MICRO">Microempresa</option>
                <option value="PEQUENA">Pequena</option>
                <option value="MÉDIA">Média</option>
                <option value="GRANDE">Grande</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button className="botao-edenred-secundario flex items-center">
                <Filter className="mr-2" size={18} />
                Filtros Avançados
              </button>
              <button className="botao-edenred-primario flex items-center">
                <Plus className="mr-2" size={18} />
                Nova Empresa
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabela de Empresas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cartao-edenred overflow-hidden"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="carregamento-edenred mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando empresas...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">CNPJ</th>
                    <th className="px-6 py-4 text-left font-semibold">RAZÃO SOCIAL</th>
                    <th className="px-6 py-4 text-left font-semibold">SITUAÇÃO</th>
                    <th className="px-6 py-4 text-left font-semibold">PORTE</th>
                    <th className="px-6 py-4 text-left font-semibold">CONTATO</th>
                    <th className="px-6 py-4 text-left font-semibold">LOCALIZAÇÃO</th>
                    <th className="px-6 py-4 text-left font-semibold">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCompanies.map((company) => (
                    <tr key={company._id} className="hover:bg-red-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-mono text-sm font-semibold">{company.cnpj}</div>
                          {company.nomeFantasia && (
                            <div className="text-xs text-gray-500">{company.nomeFantasia}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 max-w-xs">
                          {company.razaoSocial}
                        </div>
                        {company.atividade && (
                          <div className="text-xs text-gray-500 mt-1">{company.atividade}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getSituacaoBadge(company.situacao)}
                      </td>
                      <td className="px-6 py-4">
                        {getPorteBadge(company.porte)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {company.telefone && (
                            <div className="flex items-center text-sm">
                              <Phone size={14} className="mr-1 text-gray-400" />
                              {company.telefone}
                            </div>
                          )}
                          {company.email && (
                            <div className="flex items-center text-sm">
                              <Mail size={14} className="mr-1 text-gray-400" />
                              <span className="truncate max-w-32">{company.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {company.endereco && (
                          <div className="text-sm">
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-1 text-gray-400" />
                              <span className="font-medium">{company.endereco.cidade}/{company.endereco.uf}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              CEP: {company.endereco.cep}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors" title="Visualizar">
                            <Eye size={18} />
                          </button>
                          <button className="text-green-600 hover:text-green-800 transition-colors" title="Editar">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-800 transition-colors" title="Excluir">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nenhuma empresa encontrada</p>
                  <p className="text-gray-400 text-sm">Ajuste os filtros ou cadastre uma nova empresa</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Estatísticas Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
        >
          <div className="cartao-edenred text-center">
            <div className="text-2xl font-bold text-green-600">
              {companies.filter(c => c.situacao === 'ATIVA').length}
            </div>
            <p className="text-gray-600 font-semibold">Empresas Ativas</p>
          </div>
          
          <div className="cartao-edenred text-center">
            <div className="text-2xl font-bold text-blue-600">
              {companies.filter(c => c.porte === 'PEQUENA' || c.porte === 'MICRO').length}
            </div>
            <p className="text-gray-600 font-semibold">Pequeno Porte</p>
          </div>
          
          <div className="cartao-edenred text-center">
            <div className="text-2xl font-bold text-purple-600">
              {companies.filter(c => c.porte === 'MÉDIA' || c.porte === 'GRANDE').length}
            </div>
            <p className="text-gray-600 font-semibold">Médio/Grande Porte</p>
          </div>
          
          <div className="cartao-edenred text-center">
            <div className="text-2xl font-bold text-red-600">
              {companies.filter(c => c.situacao === 'SUSPENSA').length}
            </div>
            <p className="text-gray-600 font-semibold">Suspensas</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Companies
