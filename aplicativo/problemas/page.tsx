"use client"

import { EdenredHeader } from "@/components/edenred-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MessageCircle, Phone, Mail, Clock } from "lucide-react"

export default function ProblemasPage() {
  const tickets = [
    {
      id: "#2025-001",
      titulo: "Cartão não funciona no estabelecimento",
      status: "Em Andamento",
      prioridade: "Alta",
      data: "30/01/2025",
    },
    {
      id: "#2025-002",
      titulo: "Saldo incorreto no aplicativo",
      status: "Resolvido",
      prioridade: "Média",
      data: "28/01/2025",
    },
    {
      id: "#2025-003",
      titulo: "Dúvida sobre recarga automática",
      status: "Aguardando",
      prioridade: "Baixa",
      data: "25/01/2025",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <EdenredHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Problemas</h1>
          <p className="text-gray-600">Central de suporte e resolução de problemas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Abrir Novo Chamado</CardTitle>
                <CardDescription>Descreva seu problema para que possamos ajudá-lo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoria</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cartao">Problemas com Cartão</SelectItem>
                        <SelectItem value="saldo">Saldo e Recargas</SelectItem>
                        <SelectItem value="estabelecimento">Estabelecimentos</SelectItem>
                        <SelectItem value="app">Aplicativo/Site</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Prioridade</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Título do Problema</label>
                  <Input placeholder="Descreva brevemente o problema" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Descrição Detalhada</label>
                  <Textarea placeholder="Forneça o máximo de detalhes possível sobre o problema..." rows={4} />
                </div>
                <Button className="w-full bg-edenred-red hover:bg-red-700">Enviar Chamado</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meus Chamados</CardTitle>
                <CardDescription>Acompanhe o status dos seus chamados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-edenred-red" />
                        <div>
                          <h3 className="font-medium">{ticket.titulo}</h3>
                          <p className="text-sm text-gray-600">
                            {ticket.id} • {ticket.data}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            ticket.prioridade === "Alta"
                              ? "destructive"
                              : ticket.prioridade === "Média"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {ticket.prioridade}
                        </Badge>
                        <Badge
                          variant={
                            ticket.status === "Resolvido"
                              ? "default"
                              : ticket.status === "Em Andamento"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {ticket.status}
                        </Badge>
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
                <CardTitle>Contato Rápido</CardTitle>
                <CardDescription>Outras formas de entrar em contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <Phone className="h-4 w-4" />
                  0800 123 4567
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <Mail className="h-4 w-4" />
                  suporte@edenred.com.br
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <MessageCircle className="h-4 w-4" />
                  Chat Online
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-edenred-red" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Segunda a Sexta</span>
                  <span>8h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span>8h às 12h</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span>Fechado</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>Perguntas frequentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium">Como recarregar meu cartão?</div>
                    <div className="text-gray-600">Acesse a seção "Recargas" no menu principal.</div>
                  </div>
                  <div>
                    <div className="font-medium">Cartão bloqueado, o que fazer?</div>
                    <div className="text-gray-600">Entre em contato pelo telefone 0800.</div>
                  </div>
                  <div>
                    <div className="font-medium">Como consultar meu saldo?</div>
                    <div className="text-gray-600">Use o app ou acesse o site.</div>
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
