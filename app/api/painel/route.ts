import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Mock data for the painel
  const dados = {
    servicos: [
      {
        titulo: "Gestão Comercial",
        subtitulo: "Vendas e Clientes",
        icone: "Users",
        cor: "bg-blue-100 text-blue-600",
        href: "/gestao-comercial"
      },
      {
        titulo: "Consultar Clientes",
        subtitulo: "Base de Dados",
        icone: "FileText",
        cor: "bg-green-100 text-green-600",
        href: "/consultar-clientes"
      },
      {
        titulo: "Histórico",
        subtitulo: "Transações",
        icone: "CreditCard",
        cor: "bg-purple-100 text-purple-600",
        href: "/historico"
      },
      {
        titulo: "Análise",
        subtitulo: "Relatórios",
        icone: "BarChart3",
        cor: "bg-orange-100 text-orange-600",
        href: "/analise"
      },
      {
        titulo: "GPS",
        subtitulo: "Localização",
        icone: "FileText",
        cor: "bg-red-100 text-red-600",
        href: "/gps"
      },
      {
        titulo: "Educação",
        subtitulo: "Treinamentos",
        icone: "Users",
        cor: "bg-indigo-100 text-indigo-600",
        href: "/educacao"
      }
    ],
    estatisticas: [
      {
        valor: "1,234",
        rotulo: "Clientes Ativos",
        cor: "bg-green-500"
      },
      {
        valor: "R$ 45.678",
        rotulo: "Receita Mensal",
        cor: "bg-blue-500"
      },
      {
        valor: "89%",
        rotulo: "Satisfação",
        cor: "bg-purple-500"
      }
    ]
  }

  return NextResponse.json(dados)
}
