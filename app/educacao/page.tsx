"use client"

import { EdenredHeader } from "@/components/edenred-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Award, TrendingUp } from "lucide-react"

export default function EducacaoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EdenredHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Educação</h1>
          <p className="text-gray-600">Programas educacionais e treinamentos para sua equipe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-edenred-red" />
                <div>
                  <CardTitle>Cursos Online</CardTitle>
                  <CardDescription>Treinamentos digitais interativos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Acesse nossa plataforma de cursos online com conteúdo especializado em benefícios corporativos.
              </p>
              <Button className="w-full bg-edenred-red hover:bg-red-700">Acessar Cursos</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-edenred-red" />
                <div>
                  <CardTitle>Workshops</CardTitle>
                  <CardDescription>Sessões presenciais e virtuais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Participe de workshops especializados para maximizar o uso dos benefícios.
              </p>
              <Button className="w-full bg-edenred-red hover:bg-red-700">Ver Agenda</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-edenred-red" />
                <div>
                  <CardTitle>Certificações</CardTitle>
                  <CardDescription>Programas de certificação</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Obtenha certificações reconhecidas no mercado de benefícios corporativos.
              </p>
              <Button className="w-full bg-edenred-red hover:bg-red-700">Iniciar Certificação</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-edenred-red" />
                Estatísticas de Aprendizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-edenred-red">1,250</div>
                  <div className="text-sm text-gray-600">Cursos Concluídos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-edenred-red">89%</div>
                  <div className="text-sm text-gray-600">Taxa de Aprovação</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-edenred-red">45</div>
                  <div className="text-sm text-gray-600">Workshops Realizados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-edenred-red">320</div>
                  <div className="text-sm text-gray-600">Certificados Emitidos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
