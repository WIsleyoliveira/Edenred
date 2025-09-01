"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { FileText, CreditCard, Users, BarChart3, Bell, User, ChevronRight, Download } from "lucide-react"
import { DashboardSidebar } from "@components/dashboard-sidebar"
import Link from "next/link"

export default function PaginaPainel() {
  const [servicos, setServicos] = useState<any[]>([])
  const [estatisticas, setEstatisticas] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  const mapaIcones = {
    CreditCard: CreditCard,
    FileText: FileText,
    Users: Users,
    BarChart3: BarChart3,
  }

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resposta = await fetch('/api/painel')
        const dados = await resposta.json()
        setServicos(dados.servicos)
        setEstatisticas(dados.estatisticas)
      } catch (erro) {
        console.error('Erro ao buscar dados do painel:', erro)
      } finally {
        setCarregando(false)
      }
    }

    buscarDados()
  }, [])

  if (carregando) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bem vindo ao Território</h1>
            <p className="text-gray-600 mt-1">
              Ao acessar a plataforma você poderá de forma rápida e fácil, comunicar-se e trocar ideias e opiniões com
              outros usuários através do módulo de comunicação.
            </p>
            <p className="text-gray-600">
              Também poderá acompanhar suas atividades, acessar o aplicativo SLA e ter acesso.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-red-500">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Grade de Serviços */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicos.map((servico, indice) => (
              <Link key={indice} href={servico.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${servico.cor}`}>
                        {React.createElement(mapaIcones[servico.icone as keyof typeof mapaIcones] || FileText, { className: "w-6 h-6" })}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900">{servico.titulo}</h3>
                        <Badge variant="secondary" className="text-xs mt-1 bg-gray-100 text-gray-600">
                          {servico.subtitulo}
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Cartões de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estatisticas.map((estatistica, indice) => (
              <Card key={indice} className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${estatistica.cor}`} />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{estatistica.valor}</p>
                      <p className="text-sm text-gray-600">{estatistica.rotulo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Transferências que necessitam hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                  <span className="text-sm text-gray-600">Não há</span>
                </div>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
