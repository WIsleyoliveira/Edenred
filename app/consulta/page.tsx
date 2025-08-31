"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { EdenredHeader } from "@/components/edenred-header"

export default function ConsultaPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [formData, setFormData] = useState({
    cnpj: "",
    password: "",
  })

  const handleConsultar = async () => {
    if (!formData.cnpj || !formData.password) {
      alert("Por favor, preencha o CNPJ e a senha")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setShowResult(true)
      setLoading(false)
    }, 2000)
  }

  const handleIncluir = () => {
    if (!formData.cnpj || !formData.password) {
      alert("Por favor, preencha o CNPJ e a senha")
      return
    }
    router.push("/cadastro")
  }

  const handleExcluir = async () => {
    if (!formData.cnpj || !formData.password) {
      alert("Por favor, preencha o CNPJ e a senha")
      return
    }

    setLoading(true)
    setTimeout(() => {
      alert("CNPJ removido do sistema com sucesso!")
      setLoading(false)
      setFormData({ cnpj: "", password: "" })
    }, 1500)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-white">
        <EdenredHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-600">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Resultado da Consulta</h1>
            </div>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#E70000] flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Consulta Realizada com Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-green-800 mb-2">🎉 CONSULTADO COM SUCESSO!</h2>
                  <p className="text-green-700 font-medium">
                    A consulta do CNPJ foi realizada com êxito no sistema Edenred
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✓ CNPJ encontrado no sistema</p>
                  <p className="text-green-700 text-sm mt-1">Empresa ativa e disponível para contratação</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 text-sm">CNPJ Consultado</Label>
                    <p className="font-medium">{formData.cnpj}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Status</Label>
                    <p className="font-medium text-green-600">Ativo</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Território</Label>
                    <p className="font-medium">1100</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Disponível</Label>
                    <p className="font-medium text-green-600">Sim</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <Button
                    onClick={() => router.push("/cadastro")}
                    className="bg-[#E70000] hover:bg-red-700 text-white px-8"
                  >
                    Prosseguir com Cadastro
                  </Button>
                  <Button
                    onClick={() => {
                      setShowResult(false)
                      setFormData({ cnpj: "", password: "" })
                    }}
                    variant="outline"
                    className="border-[#E70000] text-[#E70000] hover:bg-red-50 px-8"
                  >
                    Nova Consulta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <EdenredHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-600">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Consulta</h1>
          </div>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#E70000]">Consultar disponibilidade do CNPJ da Empresa*</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-700 mb-2 block">CNPJ </Label>
                <Input
                  placeholder="00.000.000/0001-00"
                  value={formData.cnpj}
                  onChange={(e) => updateFormData("cnpj", e.target.value)}
                  className="border-gray-300"
                />
              </div>

              <div>
                <Label className="text-[#E70000] font-medium mb-2 block">
                  Digite sua senha para acessar o sistema:
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="border-gray-300 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={handleIncluir}
                  className="bg-[#E70000] hover:bg-red-700 text-white px-8 py-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Incluir
                </Button>
                <Button
                  onClick={handleExcluir}
                  className="bg-[#E70000] hover:bg-red-700 text-white px-8 py-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Excluir
                </Button>
                <Button
                  onClick={handleConsultar}
                  className="bg-[#E70000] hover:bg-red-700 text-white px-8 py-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Consultar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
