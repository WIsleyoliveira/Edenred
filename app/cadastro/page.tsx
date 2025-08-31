"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { EdenredHeader } from "@/components/edenred-header"

export default function PaginaCadastro() {
  const router = useRouter()
  const [dadosFormulario, setDadosFormulario] = useState({
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    municipio: "",
    estado: "",
    telefone: "",
    email: "",
    setor: "",
    cargo: "",
    departamento: "",
    celular: "",
    servicos: [] as string[],
    acaoDeseja: "",
    produtos: [] as string[],
  })

  const tratarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulário enviado:", dadosFormulario)

    try {
      const resposta = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosFormulario),
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        alert(dados.mensagem)
        router.push("/dashboard")
      } else {
        alert(dados.erro || "Erro no cadastro")
      }
    } catch (erro) {
      alert("Erro de conexão")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <EdenredHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-600">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Cadastro de Empresa</h1>
          </div>

          <form onSubmit={tratarEnvio} className="space-y-6">
            {/* CNPJ Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#E70000]">Consultar disponibilidade do CNPJ da Empresa*</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cnpj" className="text-gray-700">
                      CNPJ
                    </Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0001-00"
                      value={dadosFormulario.cnpj}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, cnpj: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Data Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#E70000]">Cadastro Básico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="razaoSocial" className="text-gray-700">
                      Razão Social
                    </Label>
                    <Input
                      id="razaoSocial"
                      value={dadosFormulario.razaoSocial}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, razaoSocial: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nomeFantasia" className="text-gray-700">
                      Nome Fantasia
                    </Label>
                    <Input
                      id="nomeFantasia"
                      value={dadosFormulario.nomeFantasia}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, nomeFantasia: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cep" className="text-gray-700">
                      CEP
                    </Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={dadosFormulario.cep}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, cep: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endereco" className="text-gray-700">
                      Endereço
                    </Label>
                    <Input
                      id="endereco"
                      value={dadosFormulario.endereco}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, endereco: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Data Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#E70000]">Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone" className="text-gray-700">
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      placeholder="(11) 0000-0000"
                      value={dadosFormulario.telefone}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, telefone: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={dadosFormulario.email}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, email: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="setor" className="text-gray-700">
                      Setor
                    </Label>
                    <Input
                      id="setor"
                      value={dadosFormulario.setor}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, setor: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargo" className="text-gray-700">
                      Cargo
                    </Label>
                    <Input
                      id="cargo"
                      value={dadosFormulario.cargo}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, cargo: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#E70000]">Qual ação deseja realizar?</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={(value) => setDadosFormulario({ ...dadosFormulario, acaoDeseja: value })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contratar">Contratar</SelectItem>
                    <SelectItem value="consultar">Consultar</SelectItem>
                    <SelectItem value="renovar">Renovar</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Products Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#E70000]">Selecione os produtos disponíveis*</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Auxílio de Alimentação", "Auxílio de Refeição", "Cartão de Combustível"].map((produto) => (
                    <div key={produto} className="flex items-center space-x-2">
                      <Checkbox
                        id={produto}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setDadosFormulario({
                              ...dadosFormulario,
                              produtos: [...dadosFormulario.produtos, produto],
                            })
                          } else {
                            setDadosFormulario({
                              ...dadosFormulario,
                              produtos: dadosFormulario.produtos.filter((p: string) => p !== produto),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={produto} className="text-gray-700">
                        {produto}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-12 py-3 bg-[#E70000] hover:bg-red-700 text-white"
                size="lg"
              >
                OK
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
