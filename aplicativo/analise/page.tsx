"use client"

import { EdenredHeader } from "@/components/edenred-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Download } from "lucide-react"

export default function AnalisePage() {
  const dadosGastos = [
    { mes: "Jan", valor: 2400 },
    { mes: "Fev", valor: 2800 },
    { mes: "Mar", valor: 2200 },
    { mes: "Abr", valor: 3100 },
    { mes: "Mai", valor: 2900 },
    { mes: "Jun", valor: 3400 },
  ]

  const dadosCategoria = [
    { nome: "Alimentação", valor: 45, cor: "#E70000" },
    { nome: "Farmácia", valor: 25, cor: "#FF6B6B" },
    { nome: "Combustível", valor: 20, cor: "#4ECDC4" },
    { nome: "Outros", valor: 10, cor: "#45B7D1" },
  ]

  const dadosUsuarios = [
    { mes: "Jan", ativos: 85, novos: 12 },
    { mes: "Fev", ativos: 92, novos: 18 },
    { mes: "Mar", ativos: 88, novos: 15 },
    { mes: "Abr", ativos: 95, novos: 22 },
    { mes: "Mai", ativos: 98, novos: 19 },
    { mes: "Jun", ativos: 102, novos: 25 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <EdenredHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise</h1>
              <p className="text-gray-600">Relatórios e análises detalhadas do uso dos benefícios</p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="6meses">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1mes">Último mês</SelectItem>
                  <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                  <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                  <SelectItem value="1ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-edenred-red hover:bg-red-700">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gasto Total</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 18.800</p>
                </div>
                <DollarSign className="h-8 w-8 text-edenred-red" />
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
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">102</p>
                </div>
                <Users className="h-8 w-8 text-edenred-red" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+4% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Transações</p>
                  <p className="text-2xl font-bold text-gray-900">1.247</p>
                </div>
                <Calendar className="h-8 w-8 text-edenred-red" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">-2% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 15,08</p>
                </div>
                <TrendingUp className="h-8 w-8 text-edenred-red" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+8% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Gastos por Mês */}
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Mês</CardTitle>
              <CardDescription>Evolução dos gastos nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGastos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
                  <Bar dataKey="valor" fill="#E70000" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Categorias */}
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Categoria</CardTitle>
              <CardDescription>Distribuição dos gastos por tipo de benefício</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosCategoria}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="valor"
                    label={({ nome, valor }) => `${nome}: ${valor}%`}
                  >
                    {dadosCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Usuários</CardTitle>
            <CardDescription>Usuários ativos e novos usuários por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosUsuarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ativos" stroke="#E70000" strokeWidth={2} name="Usuários Ativos" />
                <Line type="monotone" dataKey="novos" stroke="#4ECDC4" strokeWidth={2} name="Novos Usuários" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
