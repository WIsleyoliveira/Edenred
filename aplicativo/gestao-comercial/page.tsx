"use client"

import { EdenredHeader } from "@components/edenred-header"
import { DashboardSidebar } from "@components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { TrendingUp, Users, Target, DollarSign, Calendar, FileText, Phone, Mail, Building } from "lucide-react"

export default function GestaoComercialPage() {
  const vendedores = [
    {
      id: 1,
      nome: "Carlos Silva",
      territorio: "São Paulo - Centro",
      meta: 50000,
      vendido: 42500,
      clientes: 25,
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Ana Santos",
      territorio: "São Paulo - Zona Sul",
      meta: 45000,
      vendido: 48200,
      clientes: 30,
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Roberto Lima",
      territorio: "Rio de Janeiro",
      meta: 40000,
      vendido: 35800,
      clientes: 22,
      status: "Ativo",
    },
  ]

  const oportunidades = [
    {
      id: 1,
      empresa: "Tech Solutions Ltda",
      cnpj: "12.345.678/0001-90",
      valor: 15000,
      produto: "Ticket Restaurant",
      status: "Negociação",
      vendedor: "Carlos Silva",
    },
    {
      id: 2,
      empresa: "Inovação Corp",
      cnpj: "98.765.432/0001-10",
      valor: 22000,
      produto: "Ticket Alimentação",
      status: "Proposta",
      vendedor: "Ana Santos",
    },
    {
      id: 3,
      empresa: "StartUp Digital",
      cnpj: "11.222.333/0001-44",
      valor: 8500,
      produto: "Ticket Car",
      status: "Qualificação",
      vendedor: "Roberto Lima",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <EdenredHeader />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-8 w-8 text-edenred-red" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestão Comercial</h1>
                <p className="text-gray-600">Gerencie vendas, metas e oportunidades</p>
              </div>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vendas do Mês</p>
                    <p className="text-2xl font-bold text-gray-900">R$ 126.500</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-edenred-red" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+15% vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Novos Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">18</p>
                  </div>
                  <Users className="h-8 w-8 text-edenred-red" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+22% vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-gray-900">24.5%</p>
                  </div>
                  <Target className="h-8 w-8 text-edenred-red" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+3.2% vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Oportunidades</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <FileText className="h-8 w-8 text-edenred-red" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance dos Vendedores */}
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Vendedores</CardTitle>
                <CardDescription>Acompanhe o desempenho da equipe comercial</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendedores.map((vendedor) => (
                    <div key={vendedor.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{vendedor.nome}</h3>
                          <p className="text-sm text-gray-600">{vendedor.territorio}</p>
                        </div>
                        <Badge variant="default">{vendedor.status}</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Meta:</span>
                          <p className="font-medium">R$ {vendedor.meta.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Vendido:</span>
                          <p className="font-medium text-green-600">R$ {vendedor.vendido.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Clientes:</span>
                          <p className="font-medium">{vendedor.clientes}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso da Meta</span>
                          <span>{Math.round((vendedor.vendido / vendedor.meta) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-edenred-red h-2 rounded-full"
                            style={{ width: `${Math.min((vendedor.vendido / vendedor.meta) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline de Oportunidades */}
            <Card>
              <CardHeader>
                <CardTitle>Pipeline de Oportunidades</CardTitle>
                <CardDescription>Acompanhe as oportunidades em andamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {oportunidades.map((oportunidade) => (
                    <div key={oportunidade.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{oportunidade.empresa}</h3>
                          <p className="text-sm text-gray-600">{oportunidade.cnpj}</p>
                        </div>
                        <Badge
                          variant={
                            oportunidade.status === "Negociação"
                              ? "default"
                              : oportunidade.status === "Proposta"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {oportunidade.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Valor:</span>
                          <p className="font-medium text-green-600">R$ {oportunidade.valor.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Produto:</span>
                          <p className="font-medium">{oportunidade.produto}</p>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-600">Vendedor:</span>
                        <span className="font-medium ml-2">{oportunidade.vendedor}</span>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Ligar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" className="bg-edenred-red hover:bg-red-700">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Ferramentas para gestão comercial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="bg-edenred-red hover:bg-red-700 h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Nova Oportunidade
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <FileText className="h-6 w-6 mb-2" />
                  Relatório de Vendas
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Target className="h-6 w-6 mb-2" />
                  Definir Metas
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Calendar className="h-6 w-6 mb-2" />
                  Agendar Reunião
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
