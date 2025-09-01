"use client"

import { EdenredHeader } from "@components/edenred-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Badge } from "@components/ui/badge"
import { FileText, Upload, Download, Search, Filter, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"

export default function RHDocumentosPage() {
  const documentos = [
    {
      id: 1,
      nome: "Contrato de Trabalho - João Silva",
      tipo: "PDF",
      categoria: "Contratos",
      tamanho: "2.4 MB",
      data: "31/01/2025",
      status: "Aprovado",
    },
    {
      id: 2,
      nome: "Folha de Pagamento - Janeiro 2025",
      tipo: "XLSX",
      categoria: "Folha de Pagamento",
      tamanho: "1.8 MB",
      data: "30/01/2025",
      status: "Processando",
    },
    {
      id: 3,
      nome: "Declaração de Benefícios - Maria Santos",
      tipo: "PDF",
      categoria: "Benefícios",
      tamanho: "856 KB",
      data: "29/01/2025",
      status: "Aprovado",
    },
    {
      id: 4,
      nome: "Relatório de Férias - Q1 2025",
      tipo: "PDF",
      categoria: "Férias",
      tamanho: "1.2 MB",
      data: "28/01/2025",
      status: "Pendente",
    },
  ]

  const categorias = [
    { nome: "Contratos", count: 45, cor: "bg-blue-100 text-blue-600" },
    { nome: "Folha de Pagamento", count: 12, cor: "bg-green-100 text-green-600" },
    { nome: "Benefícios", count: 28, cor: "bg-purple-100 text-purple-600" },
    { nome: "Férias", count: 15, cor: "bg-orange-100 text-orange-600" },
    { nome: "Admissões", count: 8, cor: "bg-red-100 text-red-600" },
  ]

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
              <FileText className="h-8 w-8 text-edenred-red" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">RH - Documentos</h1>
                <p className="text-gray-600">Gerencie documentos de recursos humanos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Buscar Documentos</CardTitle>
                    <CardDescription>Encontre documentos por nome, categoria ou data</CardDescription>
                  </div>
                  <Button className="bg-edenred-red hover:bg-red-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Buscar documentos..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentos Recentes</CardTitle>
                <CardDescription>Últimos documentos adicionados ao sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentos.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.nome}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">{doc.tipo}</span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-gray-600">{doc.tamanho}</span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-gray-600">{doc.data}</span>
                          </div>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {doc.categoria}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            doc.status === "Aprovado"
                              ? "default"
                              : doc.status === "Processando"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {doc.status}
                        </Badge>
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
                <CardTitle>Categorias</CardTitle>
                <CardDescription>Documentos por categoria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categorias.map((categoria, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${categoria.cor.split(" ")[0]}`} />
                      <span className="text-sm font-medium">{categoria.nome}</span>
                    </div>
                    <Badge variant="secondary">{categoria.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload de Documento</CardTitle>
                <CardDescription>Adicione novos documentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Arraste arquivos aqui ou clique para selecionar</p>
                </div>
                <Button className="w-full bg-edenred-red hover:bg-red-700">Selecionar Arquivos</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total de Documentos</span>
                  <span className="font-bold">108</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Aprovados</span>
                  <span className="font-bold text-green-600">95</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pendentes</span>
                  <span className="font-bold text-yellow-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processando</span>
                  <span className="font-bold text-blue-600">5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
