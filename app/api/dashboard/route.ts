import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const services = [
    {
      title: "Cross-Selling",
      subtitle: "MOBILE",
      icon: "CreditCard",
      color: "bg-orange-100 text-orange-600",
      href: "/servicos/cross-selling",
    },
    {
      title: "Cross-Selling Loja",
      subtitle: "MOBILE",
      icon: "FileText",
      color: "bg-orange-100 text-orange-600",
      href: "/servicos/cross-selling-loja",
    },
    {
      title: "RH - Documentos",
      subtitle: "MOBILE",
      icon: "FileText",
      color: "bg-blue-100 text-blue-600",
      href: "/servicos/rh-documentos",
    },
    {
      title: "F1 - Planilha Horas em Loja",
      subtitle: "MOBILE",
      icon: "BarChart3",
      color: "bg-green-100 text-green-600",
      href: "/servicos/planilha-horas",
    },
    {
      title: "Lead Mercantivo",
      subtitle: "MOBILE",
      icon: "Users",
      color: "bg-purple-100 text-purple-600",
      href: "/servicos/lead-mercantivo",
    },
    {
      title: "Teste Forma Email",
      subtitle: "MOBILE",
      icon: "FileText",
      color: "bg-red-100 text-red-600",
      href: "/servicos/teste-email",
    },
  ]

  const stats = [
    { label: "Tarefas pendentes", value: "3", color: "bg-yellow-500" },
    { label: "Itens pendentes do time grupo", value: "1003", color: "bg-green-500" },
    { label: "Itens pendentes atrasados", value: "1", color: "bg-red-500" },
  ]

  return NextResponse.json({ services, stats })
}
