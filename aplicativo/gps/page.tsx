"use client"

import { EdenredHeader } from "@/components/edenred-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock, Star, Phone } from "lucide-react"

export default function GpsPage() {
  const estabelecimentos = [
    {
      id: 1,
      nome: "Restaurante Bom Sabor",
      categoria: "Alimentação",
      distancia: "0.2 km",
      avaliacao: 4.5,
      endereco: "Rua das Flores, 123 - Centro",
      telefone: "(11) 1234-5678",
      horario: "Aberto até 22h",
      aceita: ["Ticket Restaurant", "Ticket Alimentação"],
    },
    {
      id: 2,
      nome: "Farmácia Saúde Total",
      categoria: "Farmácia",
      distancia: "0.5 km",
      avaliacao: 4.2,
      endereco: "Av. Principal, 456 - Centro",
      telefone: "(11) 2345-6789",
      horario: "Aberto 24h",
      aceita: ["Ticket Farmácia"],
    },
    {
      id: 3,
      nome: "Supermercado Economia",
      categoria: "Supermercado",
      distancia: "0.8 km",
      avaliacao: 4.0,
      endereco: "Rua do Comércio, 789 - Vila Nova",
      telefone: "(11) 3456-7890",
      horario: "Aberto até 23h",
      aceita: ["Ticket Alimentação", "Ticket Restaurant"],
    },
    {
      id: 4,
      nome: "Posto Shell",
      categoria: "Combustível",
      distancia: "1.2 km",
      avaliacao: 4.3,
      endereco: "Rodovia BR-101, Km 15",
      telefone: "(11) 4567-8901",
      horario: "Aberto 24h",
      aceita: ["Ticket Car"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <EdenredHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GPS</h1>
          <p className="text-gray-600">Encontre estabelecimentos credenciados próximos a você</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Buscar Estabelecimentos</CardTitle>
                <CardDescription>Digite o endereço ou use sua localização atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input placeholder="Digite o endereço ou CEP..." className="flex-1" />
                  <Button className="bg-edenred-red hover:bg-red-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                  <Button variant="outline">
                    <Navigation className="h-4 w-4 mr-2" />
                    Minha Localização
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estabelecimentos Próximos</CardTitle>
                <CardDescription>Encontrados 4 estabelecimentos na sua região</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estabelecimentos.map((local) => (
                    <div key={local.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{local.nome}</h3>
                          <p className="text-gray-600">{local.categoria}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{local.avaliacao}</span>
                          </div>
                          <Badge variant="outline">{local.distancia}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {local.endereco}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          {local.telefone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {local.horario}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {local.aceita.map((ticket, index) => (
                            <Badge key={index} className="bg-edenred-red/10 text-edenred-red hover:bg-edenred-red/20">
                              {ticket}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Navigation className="h-4 w-4 mr-1" />
                            Rota
                          </Button>
                          <Button size="sm" className="bg-edenred-red hover:bg-red-700">
                            Detalhes
                          </Button>
                        </div>
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
                <CardTitle>Filtros</CardTitle>
                <CardDescription>Refine sua busca</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <div className="space-y-2">
                    {["Alimentação", "Farmácia", "Supermercado", "Combustível", "Cultura"].map((categoria) => (
                      <label key={categoria} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{categoria}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Distância Máxima</label>
                  <select className="w-full p-2 border rounded">
                    <option>Até 1 km</option>
                    <option>Até 2 km</option>
                    <option>Até 5 km</option>
                    <option>Até 10 km</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de Ticket</label>
                  <div className="space-y-2">
                    {["Ticket Restaurant", "Ticket Alimentação", "Ticket Farmácia", "Ticket Car"].map((ticket) => (
                      <label key={ticket} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{ticket}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-edenred-red hover:bg-red-700">Aplicar Filtros</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Use o filtro por tipo de ticket para encontrar estabelecimentos que aceitem especificamente o seu
                  benefício.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
