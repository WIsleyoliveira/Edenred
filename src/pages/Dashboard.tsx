
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Plus, BarChart3, TrendingUp, Users, FileText, Calendar, Eye, Edit, Trash2 } from 'lucide-react'
import { apiService, type Consultation } from '../services/apiService'
import toast from 'react-hot-toast'

// Interface já importada do apiService

const Dashboard: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')

  const [stats, setStats] = useState({
    total: 0,
    emNegociacao: 0,
    concluidas: 0,
    perdidas: 0
  })

  useEffect(() => {
    fetchConsultations()
  }, [])

  useEffect(() => {
    filterConsultations()
  }, [searchTerm, statusFilter, productFilter, consultations])

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      
      // Buscar consultas reais da API
      const response = await apiService.getConsultations({ limit: 100 })
      
      if (response.success) {
        const consultationsData = response.data.consultations
        setConsultations(consultationsData)
        
        // Calcular estatísticas
        setStats({
          total: consultationsData.length,
          emNegociacao: consultationsData.filter(c => c.status === 'PENDING' || c.status === 'SUCCESS').length,
          concluidas: consultationsData.filter(c => c.status === 'SUCCESS').length,
          perdidas: consultationsData.filter(c => c.status === 'ERROR').length
        })
      } else {
        // Fallback para dados mock se não conseguir carregar da API
        const mockData = [
          {
            _id: '1',
            cnpj: '12.345.678/0001-90',
            userId: 'user1',
            userName: 'Usuario Teste',
            step: 5,
            completed: false,
            status: 'SUCCESS',
            createdAt: '2024-04-18T00:00:00.000Z',
            updatedAt: '2024-04-18T00:00:00.000Z'
          }
        ]
        
        setConsultations(mockData)
        setStats({
          total: mockData.length,
          emNegociacao: 0,
          concluidas: 1,
          perdidas: 0
        })
      }
      
    } catch (error: any) {
      console.error('Erro ao carregar consultas:', error)
      toast.error('Erro ao carregar dados do painel')
      
      // Fallback em caso de erro
      setConsultations([])
      setStats({ total: 0, emNegociacao: 0, concluidas: 0, perdidas: 0 })
    } finally {
      setLoading(false)
    }
  }

  const filterConsultations = () => {
    let filtered = consultations

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.cnpj.includes(searchTerm) ||
        c.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.numero?.includes(searchTerm)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    if (productFilter) {
      filtered = filtered.filter(c => c.produto === productFilter)
    }

    setFilteredConsultations(filtered)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EM_NEGOCIACAO':
        return <span className="badge-em-andamento">EM NEGOCIAÇÃO</span>
      case 'EM_PROCESSAMENTO':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">EM PROCESSAMENTO</span>
      case 'CONCLUIDA_GANHA':
        return <span className="badge-sucesso">CONCLUÍDO E GANHO</span>
      case 'CONCLUIDA_PERDIDA':
        return <span className="badge-erro">CONCLUÍDO E PERDIDO</span>
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">{status}</span>
    }
  }

  const getProductBadge = (produto: string) => {
    const colors = {
      'FLEET': 'bg-blue-100 text-blue-800',
      'TICKET_RESTAURANT': 'bg-green-100 text-green-800',
      'PAY': 'bg-purple-100 text-purple-800',
      'ALIMENTA': 'bg-orange-100 text-orange-800',
      'ABASTECIMENTO': 'bg-indigo-100 text-indigo-800'
    }
    
    return (
      <span className={`${colors[produto as keyof typeof colors] || 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-full text-sm font-semibold`}>
        {produto}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho do Painel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="titulo-principal text-4xl font-bold mb-2">Painel de Controle</h1>
                <p className="texto-elegante text-xl text-red-100">Acompanhe suas indicações e performance</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-red-200 text-sm">Total</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.emNegociacao}</div>
                  <div className="text-red-200 text-sm">Em Andamento</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.concluidas}</div>
                  <div className="text-red-200 text-sm">Ganhas</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cards de Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="cartao-edenred text-center group hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            <p className="texto-elegante text-gray-600 font-semibold">Total de Indicações</p>
          </div>

          <div className="cartao-edenred text-center group hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl mb-4">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.emNegociacao}</h3>
            <p className="texto-elegante text-gray-600 font-semibold">Em Negociação</p>
          </div>

          <div className="cartao-edenred text-center group hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.concluidas}</h3>
            <p className="texto-elegante text-gray-600 font-semibold">Concluídas e Ganhas</p>
          </div>

          <div className="cartao-edenred text-center group hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl mb-4">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.perdidas}</h3>
            <p className="texto-elegante text-gray-600 font-semibold">Perdidas</p>
          </div>
        </motion.div>

        {/* Filtros e Busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cartao-edenred mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por CNPJ, razão social ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-80"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todos os Status</option>
                <option value="EM_NEGOCIACAO">Em Negociação</option>
                <option value="EM_PROCESSAMENTO">Em Processamento</option>
                <option value="CONCLUIDA_GANHA">Concluída e Ganha</option>
                <option value="CONCLUIDA_PERDIDA">Concluída e Perdida</option>
              </select>

              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todos os Produtos</option>
                <option value="FLEET">Fleet</option>
                <option value="TICKET_RESTAURANT">Ticket Restaurant</option>
                <option value="PAY">Pay</option>
                <option value="ALIMENTA">Alimenta</option>
                <option value="ABASTECIMENTO">Abastecimento</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button className="botao-edenred-secundario flex items-center">
                <Filter className="mr-2" size={18} />
                Filtros Avançados
              </button>
              <button className="botao-edenred-primario flex items-center">
                <Download className="mr-2" size={18} />
                Exportar
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabela de Indicações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cartao-edenred overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 mb-6 rounded-xl">
            <h3 className="font-bold text-center text-lg mb-4">
              🔍 ACOMPANHAR INDICAÇÕES
            </h3>
            <div className="text-center text-red-100 text-sm">
              FILTROS: NÚMERO | CNPJ | RAZÃO SOCIAL | PRODUTO | STATUS
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="carregamento-edenred mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando indicações...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">DATA</th>
                    <th className="px-6 py-4 text-left font-semibold">NÚMERO</th>
                    <th className="px-6 py-4 text-left font-semibold">CNPJ</th>
                    <th className="px-6 py-4 text-left font-semibold">RAZÃO SOCIAL</th>
                    <th className="px-6 py-4 text-left font-semibold">PRODUTO</th>
                    <th className="px-6 py-4 text-left font-semibold">STATUS</th>
                    <th className="px-6 py-4 text-left font-semibold">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredConsultations.map((consultation, index) => (
                    <tr key={consultation._id} className="hover:bg-red-50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {new Date(consultation.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 font-bold text-red-600">
                        {consultation.numero || `${String(index + 1).padStart(3, '0')}`}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">
                        {consultation.cnpj}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {consultation.razaoSocial || 'Não informado'}
                      </td>
                      <td className="px-6 py-4">
                        {getProductBadge(consultation.produto)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(consultation.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            <Eye size={18} />
                          </button>
                          <button className="text-green-600 hover:text-green-800 transition-colors">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-800 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredConsultations.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nenhuma indicação encontrada</p>
                  <p className="text-gray-400 text-sm">Ajuste os filtros ou faça uma nova consulta</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Botão de Nova Consulta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => window.location.href = '/consultation'}
            className="botao-edenred-primario text-lg px-8 py-4"
          >
            <Plus className="mr-3" size={20} />
            Nova Indicação
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
