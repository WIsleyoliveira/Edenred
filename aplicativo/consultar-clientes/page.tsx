"use client"

import { useState } from "react"
import { EdenredHeader } from "@components/edenred-header"
import { DashboardSidebar } from "@components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { Badge } from "@components/ui/badge"
import { Search, Users, Building, Phone, Mail, MapPin, Calendar, CreditCard, Filter, Download, Eye } from "lucide-react"

export default function ConsultarClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [filterProduto, setFilterProduto] = useState("todos")

  const clientes = [
    {
      id: 1,
      razaoSocial: "Tech Solutions Ltda",
      nomeFantasia: "TechSol",
      cnpj: "12.345.678/0001-90",
      email: "contato@techsol.com.br",
      telefone: "(11) 3456-7890",
      endereco: "Av. Paulista, 1000 - São Paulo/SP",
      status: "Ativo",
      produtos: ["Ticket Restaurant", "Ticket Alimentação"],
      dataContrato: "2024-01-15",
      valorMensal: 8500,
      funcionarios: 120,
    },
    {
      id: 2,
      razaoSocial: "Inovação Corp S.A.",
      nomeFantasia: "InovaCorp",
      cnpj: "98.765.432/0001-10",
      email: "admin@inovacorp.com.br",
      telefone: "(11) 2345-6789",
      endereco: "Rua das Flores, 500 - São Paulo/SP",
      status: "Ativo",
      produtos: ["Ticket Car", "Ticket Cultura"],
      dataContrato: "2023-08-22",
      valorMensal: 12000,
      funcionarios: 85,
    },
    {
      id: 3,
      razaoSocial: "StartUp Digital ME",
      nomeFantasia: "StartDigital",
      cnpj: "11.222.333/0001-44",
      email: "info@startdigital.com.br",
      telefone: "(11) 4567-8901",
      endereco: "Rua da Inovação, 200 - São Paulo/SP",
      status: "Inativo",
      produtos: ["Ticket Restaurant"],
      dataContrato: "2023-12-10",
      valorMensal: 3500,
      funcionarios: 25,
    },
    {
      id: 4,
      razaoSocial: "Empresa Global Ltda",
      nomeFantasia: "Global Corp",
      cnpj: "55.666.777/0001-88",
      email: "contato@global.com.br",
      telefone: "(11) 5678-9012",
      endereco: "Av. Brasil, 1500 - Rio de Janeiro/RJ",
      status: "Ativo",
      produtos: ["Ticket Restaurant", "Ticket Alimentação", "Ticket Car"],
      dataContrato: "2022-05-30",
      valorMensal: 25000,
      funcionarios: 350,
    },
  ]

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cnpj.includes(searchTerm)

    const matchesStatus = filterStatus === "todos" || cliente.status.toLowerCase() === filterStatus.toLowerCase()

    const matchesProduto =
      filterProduto === "todos" ||
      cliente.produtos.some((produto) => produto.toLowerCase().includes(filterProduto.toLowerCase()))

    return matchesSearch && matchesStatus && matchesProduto
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <EdenredHeader />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-edenred-red" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Consultar Clientes</h1>
                <p className="text-gray-600">Gerencie e consulte informações dos clientes</p>
              </div>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
                  </div>
                  <Building className="h-8 w-8 text-edenred-red" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clientes Ativos</p>
                    <p className="text-2xl font-bold text-green-600">
                      {clientes.filter((c) => c.status === "Ativo").length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Receita Mensal</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R${" "}
                      {clientes
                        .filter((c) => c.status === "Ativo")
                        .reduce((sum, c) => sum + c.valorMensal, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-edenred-red" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Funcionários</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {clientes.reduce((sum, c) => sum + c.funcionarios, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-edenred-red" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Busca */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Buscar Cliente</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nome, CNPJ ou razão social..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Produto</label>
                  <Select value={filterProduto} onValueChange={setFilterProduto}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="restaurant">Ticket Restaurant</SelectItem>
                      <SelectItem value="alimentacao">Ticket Alimentação</SelectItem>
                      <SelectItem value="car">Ticket Car</SelectItem>
                      <SelectItem value="cultura">Ticket Cultura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="bg-edenred-red hover:bg-red-700 w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Clientes Encontrados ({filteredClientes.length})</CardTitle>
              <CardDescription>Lista completa de clientes cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClientes.map((cliente) => (
                  <div key={cliente.id} className="p-6 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{cliente.razaoSocial}</h3>
                          <Badge variant={cliente.status === "Ativo" ? "default" : "secondary"}>{cliente.status}</Badge>
                        </div>
                        <p className="text-gray-600 mb-1">{cliente.nomeFantasia}</p>
                        <p className="text-sm text-gray-500">{cliente.cnpj}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-edenred-red">
                          R$ {cliente.valorMensal.toLocaleString()}/mês
                        </p>
                        <p className="text-sm text-gray-600">{cliente.funcionarios} funcionários</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{cliente.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{cliente.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Contrato: {new Date(cliente.dataContrato).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{cliente.endereco}</span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Produtos Contratados:</p>
                      <div className="flex gap-2">
                        {cliente.produtos.map((produto, index) => (
                          <Badge key={index} variant="outline">
                            {produto}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" className="bg-edenred-red hover:bg-red-700">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
