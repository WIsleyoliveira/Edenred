"use client"

import { EdenredHeader } from "@components/edenred-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { FileText, Download, Eye, Calendar } from "lucide-react"

export default function DetalhesPage() {
  const documentos = [
    {
      id: 1,
      nome: "Relatório Mensal - Janeiro 2025",
      tipo: "PDF",
      tamanho: "2.4 MB",
      data: "31/01/2025",
      status: "Disponível",
    },
    {
      id: 2,
      nome: "Extrato de Benefícios",
      tipo: "PDF",
      tamanho: "1.8 MB",
      data: "30/01/2025",
      status: "Disponível",
    },
    {
      id: 3,
      nome: "Comprovante de Pagamento",
      tipo: "PDF",
      tamanho: "856 KB",
      data: "29/01/2025",
      status: "Disponível",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <EdenredHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Detalhes</h1>
          <p className="text-gray-600">Documentos, relatórios e informações detalhadas da sua conta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Documentos Recentes</CardTitle>
                <CardDescription>Seus documentos e relatórios mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentos.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-edenred-red" />
                        <div>
                          <h3 className="font-medium">{doc.nome}</h3>
                          <p className="text-sm text-gray-600">
                            {doc.tipo} • {doc.tamanho} • {doc.data}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{doc.status}</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm" className="bg-edenred-red hover:bg-red-700">
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
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
                <CardTitle>Resumo da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Saldo Atual</span>
                  <span className="font-bold text-edenred-red">R$ 2.450,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Último Crédito</span>
                  <span className="font-medium">R$ 800,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gastos do Mês</span>
                  <span className="font-medium">R$ 1.200,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cartões Ativos</span>
                  <span className="font-medium">15</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-edenred-red" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Crédito Automático</div>
                    <div className="text-gray-600">05/02/2025</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Relatório Mensal</div>
                    <div className="text-gray-600">28/02/2025</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Renovação de Contrato</div>
                    <div className="text-gray-600">15/03/2025</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
