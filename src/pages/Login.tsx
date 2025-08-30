import React, { useState } from "react"
import { apiService } from '../services/apiService'
import toast from 'react-hot-toast'

export default function Entrar({ aoEntrar }: { aoEntrar: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const lidarComEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    
    try {
      const response = await apiService.login(email, password)
      
      if (response.success) {
        toast.success('Login realizado com sucesso!')
        aoEntrar() // libera o acesso ao usuário autenticado
      }
    } catch (error: any) {
      console.error('Erro no login:', error)
      toast.error(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl shadow-xl bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-red-700 to-red-600 h-40 flex flex-col items-center justify-center relative">
          <div className="h-12 w-12 rounded-full bg-white text-red-600 flex items-center justify-center font-semibold text-lg shadow-sm">
            T
          </div>
          <h1 className="mt-4 text-white text-2xl font-bold">Território Edenred</h1>
        </div>

        <form className="p-8 space-y-6" onSubmit={lidarComEnvio}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-700 font-semibold">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 placeholder-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-700 font-semibold">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Entrando...
              </>
            ) : (
              'Continuar'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
