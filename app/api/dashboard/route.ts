import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const servicos = [
    {
      titulo: "Cross-Selling",
      subtitulo: "MOBILE",
      icone: "CreditCard",
      cor: "bg-orange-100 text-orange-600",
      href: "/servicos/cross-selling",
    },
    {
      titulo: "Cross-Selling Loja",
      subtitulo: "MOBILE",
      icone: "FileText",
      cor: "bg-orange-100 text-orange-600",
      href: "/servicos/cross-selling-loja",
    },
    {
      titulo: "RH - Documentos",
      subtitulo: "MOBILE",
      icone: "FileText",
      cor: "bg-blue-100 text-blue-600",
      href: "/servicos/rh-documentos",
    },
    {
      titulo: "F1 - Planilha Horas em Loja",
      subtitulo: "MOBILE",
      icone: "BarChart3",
      cor: "bg-green-100 text-green-600",
      href: "/servicos/planilha-horas",
    },
    {
      titulo: "Lead Mercantivo",
      subtitulo: "MOBILE",
      icone: "Users",
      cor: "bg-purple-100 text-purple-600",
      href: "/servicos/lead-mercantivo",
    },
    {
      titulo: "Teste Forma Email",
      subtitulo: "MOBILE",
      icone: "FileText",
      cor: "bg-red-100 text-red-600",
      href: "/servicos/teste-email",
    },
  ]

  const estatisticas = [
    { rotulo: "Tarefas pendentes", valor: "3", cor: "bg-yellow-500" },
    { rotulo: "Itens pendentes do time grupo", valor: "1003", cor: "bg-green-500" },
    { rotulo: "Itens pendentes atrasados", valor: "1", cor: "bg-red-500" },
  ]

  return NextResponse.json({ servicos, estatisticas })
}
