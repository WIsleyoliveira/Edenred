// so pra enviar
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Search, BarChart3, Building2, Home, FileText, LogOut, User } from 'lucide-react'
import { apiService } from '../services/apiService'
import toast from 'react-hot-toast'

const BarraNavegacao: React.FC = () => {
  const [estaAberto, setEstaAberto] = useState(false)
  const [menuUsuario, setMenuUsuario] = useState(false)
  const localizacao = useLocation()
  const navigate = useNavigate()
  
  const usuario = apiService.getCurrentUser()
  
  const fazerLogout = async () => {
    try {
      await apiService.logout()
      toast.success('Logout realizado com sucesso!')
      // Força recarregamento da página para limpar o estado
      window.location.href = '/'
    } catch (error) {
      toast.error('Erro ao fazer logout')
      console.error('Erro no logout:', error)
    }
  }

  const navegacao = [
    { nome: 'Início', href: '/', icone: Home },
    { nome: 'Consulta CNPJ', href: '/consultation', icone: Search },
    { nome: 'Painel de Controle', href: '/dashboard', icone: BarChart3 },
    { nome: 'Empresas', href: '/companies', icone: Building2 },
  ]

  const estaAtivo = (caminho: string) => localizacao.pathname === caminho

  return (
    <nav className="navegacao-edenred sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Edenred Brasil */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-red-600"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  Edenred
                </h1>
                <p className="text-sm text-gray-500 font-medium -mt-1">Brasil</p>
              </div>
            </Link>
          </div>

          {/* Navegação Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {navegacao.map((item) => {
              const Icone = item.icone
              return (
                <Link
                  key={item.nome}
                  to={item.href}
                  className={`link-navegacao-edenred flex items-center space-x-2 ${
                    estaAtivo(item.href) ? 'active' : ''
                  }`}
                >
                  <Icone size={18} />
                  <span className="font-medium">{item.nome}</span>
                </Link>
              )
            })}
          </div>

          {/* Menu Usuário Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/consultation"
              className="botao-edenred-primario text-sm"
            >
              <Search size={16} className="mr-2" />
              Nova Consulta
            </Link>
            
            {/* Dropdown do Usuário */}
            <div className="relative">
              <button
                onClick={() => setMenuUsuario(!menuUsuario)}
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <User size={20} />
                <span className="text-sm font-medium">{usuario?.name || usuario?.userName || 'Usuário'}</span>
              </button>
              
              {menuUsuario && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{usuario?.name || usuario?.userName}</p>
                    <p className="text-xs text-gray-500">{usuario?.email}</p>
                  </div>
                  <button
                    onClick={fazerLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Menu Mobile */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setEstaAberto(!estaAberto)}
              className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              {estaAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navegação Mobile */}
      {estaAberto && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navegacao.map((item) => {
              const Icone = item.icone
              return (
                <Link
                  key={item.nome}
                  to={item.href}
                  onClick={() => setEstaAberto(false)}
                  className={`link-navegacao-edenred flex items-center space-x-3 w-full ${
                    estaAtivo(item.href) ? 'active' : ''
                  }`}
                >
                  <Icone size={20} />
                  <span className="font-medium">{item.nome}</span>
                </Link>
              )
            })}
            
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <Link
                to="/consultation"
                onClick={() => setEstaAberto(false)}
                className="botao-edenred-primario w-full justify-center"
              >
                <Search size={16} className="mr-2" />
                Nova Consulta
              </Link>
              
              {/* Informações do Usuário Mobile */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
                  <User size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{usuario?.name || usuario?.userName}</p>
                    <p className="text-xs text-gray-500">{usuario?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={fazerLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default BarraNavegacao
