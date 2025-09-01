"use client"

import { EdenredHeader } from "@/components/edenred-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowUpDown } from "lucide-react"

export default function HistoricoPage() {
  const transacoes = [
    {
      id: 1,
      data: "31/01/2025",
      descricao: "Crédito Automático",
      valor: "+R$ 800,00",
      status: "Concluído",
      tipo: "Crédito",
    },
    {
      id: 2,
      data: "30/01/2025",
      descricao: "Restaurante ABC - Almoço",
      valor: "-R$ 25,50",
      status: "Concluído",
      tipo: "Débito",
    },
    {
      id: 3,
      data: "30/01/2025",
      descricao: "Farmácia XYZ - Medicamentos",
      valor: "-R$ 45,80",
      status: "Concluído",
      tipo: "Débito",
    },
    {
      id: 4,
      data: "29/01/2025",
      descricao: "Supermercado DEF - Compras",
      valor: "-R$ 120,00",
      status: "Concluído",
      tipo: "Débito",
    },
    {
      id: 5,
      data: "28/01/2025",
      descricao: "Posto de Combustível GHI",
      valor: "-R$ 85,00",
      status: "Pendente",
      tipo: "Débito",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <EdenredHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico</h1>
          <p className="text-gray-600">Acompanhe todas as transações e movimentações da sua conta</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Refine sua busca por período, tipo ou valor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar transação..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="credito">Crédito</SelectItem>
                  <SelectItem value="debito">Débito</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Últimas movimentações da sua conta</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowUpDown className="h-4 w-4" />
                Ordenar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transacoes.map((transacao) => (
                <div
                  key={transacao.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${transacao.tipo === "Crédito" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <div>
                      <h3 className="font-medium">{transacao.descricao}</h3>
                      <p className="text-sm text-gray-600">{transacao.data}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`font-bold ${transacao.tipo === "Crédito" ? "text-green-600" : "text-red-600"}`}>
                        {transacao.valor}
                      </div>
                    </div>
                    <Badge variant={transacao.status === "Concluído" ? "default" : "secondary"}>
                      {transacao.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Button variant="outline">Carregar Mais</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
