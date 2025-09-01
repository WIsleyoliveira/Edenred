"use client"

import { EdenredHeader } from "@/components/edenred-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingUp, Users, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CrossSellingPage() {
  const campanhas = [
    {
      id: 1,
      nome: "Campanha Ticket Restaurant",
      status: "Ativa",
      conversao: "12.5%",
      leads: 245,
      vendas: 31,
    },
    {
      id: 2,
      nome: "Campanha Ticket Alimentação",
      status: "Pausada",
      conversao: "8.3%",
      leads: 180,
      vendas: 15,
    },
    {
      id: 3,
      nome: "Campanha Ticket Car",
      status: "Ativa",
      conversao: "15.2%",
      leads: 120,
      vendas: 18,
    },
  ]

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    nome: "",
    produto: "",
    publico: "",
  })

  const handleCreateCampaign = () => {
    if (!newCampaign.nome || !newCampaign.produto || !newCampaign.publico) {
      alert("Por favor, preencha todos os campos")
      return
    }

    alert(`Campanha "${newCampaign.nome}" criada com sucesso!`)
    setShowCreateModal(false)
    setNewCampaign({ nome: "", produto: "", publico: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EdenredHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-edenred-red" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cross-Selling</h1>
                <p className="text-gray-600">Gerencie campanhas de vendas cruzadas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Leads</p>
                  <p className="text-2xl font-bold text-gray-900">545</p>
                </div>
                <Users className="h-8 w-8 text-edenred-red" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+18% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversões</p>
                  <p className="text-2xl font-bold text-gray-900">64</p>
                </div>
                <Target className="h-8 w-8 text-edenred-red" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+12% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-gray-900">11.7%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-edenred-red" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+2.3% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Campanhas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
                <CreditCard className="h-8 w-8 text-edenred-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campanhas Ativas</CardTitle>
                    <CardDescription>Gerencie suas campanhas de cross-selling</CardDescription>
                  </div>
                  <Button className="bg-edenred-red hover:bg-red-700" onClick={() => setShowCreateModal(true)}>
                    Nova Campanha
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campanhas.map((campanha) => (
                    <div key={campanha.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{campanha.nome}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={campanha.status === "Ativa" ? "default" : "secondary"}>
                              {campanha.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-edenred-red">{campanha.conversao}</div>
                          <div className="text-sm text-gray-600">Taxa de Conversão</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Leads Gerados:</span>
                          <span className="font-medium ml-2">{campanha.leads}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Vendas:</span>
                          <span className="font-medium ml-2">{campanha.vendas}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                        <Button size="sm" variant="outline">
                          Relatório
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Nova Campanha</CardTitle>
                <CardDescription>Configure uma nova campanha de cross-selling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome da Campanha</label>
                  <Input
                    placeholder="Ex: Campanha Ticket Restaurant"
                    value={newCampaign.nome}
                    onChange={(e) => setNewCampaign({ ...newCampaign, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Produto</label>
                  <Select
                    value={newCampaign.produto}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, produto: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Ticket Restaurant</SelectItem>
                      <SelectItem value="alimentacao">Ticket Alimentação</SelectItem>
                      <SelectItem value="car">Ticket Car</SelectItem>
                      <SelectItem value="cultura">Ticket Cultura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Público Alvo</label>
                  <Select
                    value={newCampaign.publico}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, publico: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novos">Novos Clientes</SelectItem>
                      <SelectItem value="existentes">Clientes Existentes</SelectItem>
                      <SelectItem value="inativos">Clientes Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-edenred-red hover:bg-red-700" onClick={handleCreateCampaign}>
                  Criar Campanha
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dicas de Cross-Selling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="font-medium">Segmente seu público</div>
                  <div className="text-gray-600">Direcione ofertas específicas para cada perfil de cliente.</div>
                </div>
                <div>
                  <div className="font-medium">Timing é importante</div>
                  <div className="text-gray-600">Ofereça produtos complementares no momento certo.</div>
                </div>
                <div>
                  <div className="font-medium">Monitore resultados</div>
                  <div className="text-gray-600">Acompanhe métricas para otimizar campanhas.</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Nova Campanha</CardTitle>
                <CardDescription>Preencha os dados da nova campanha</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome da Campanha</label>
                  <Input
                    placeholder="Ex: Campanha Ticket Restaurant"
                    value={newCampaign.nome}
                    onChange={(e) => setNewCampaign({ ...newCampaign, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Produto</label>
                  <Select
                    value={newCampaign.produto}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, produto: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Ticket Restaurant</SelectItem>
                      <SelectItem value="alimentacao">Ticket Alimentação</SelectItem>
                      <SelectItem value="car">Ticket Car</SelectItem>
                      <SelectItem value="cultura">Ticket Cultura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Público Alvo</label>
                  <Select
                    value={newCampaign.publico}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, publico: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novos">Novos Clientes</SelectItem>
                      <SelectItem value="existentes">Clientes Existentes</SelectItem>
                      <SelectItem value="inativos">Clientes Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1 bg-edenred-red hover:bg-red-700" onClick={handleCreateCampaign}>
                    Criar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
