import { Button } from "@components/ui/button"
import { Card, CardContent } from "@components/ui/card"
import { Home, FileText, Users } from "lucide-react"
import Link from "next/link"

export function DashboardSidebar() {
  const itensMenu = [
    { icone: <Home className="w-5 h-5" />, rotulo: "Painel", href: "/dashboard", ativo: true },
    { icone: <FileText className="w-5 h-5" />, rotulo: "Gestão Comercial", href: "/gestao-comercial", ativo: false },
    { icone: <Users className="w-5 h-5" />, rotulo: "Consulta Clientes", href: "/consultar-clientes", ativo: false },
  ]

  return (
    <aside className="w-80 bg-[#E70000] text-white border-r">
      {/* Header */}
      <div className="p-4 border-b border-red-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#E70000] font-bold text-lg">E</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">EDENRED</h2>
            <p className="text-sm text-red-100">Painel</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="p-4 space-y-2">
        {itensMenu.map((itemMenu, indice) => (
          <Link key={indice} href={itemMenu.href}>
            <Button
              variant={itemMenu.ativo ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                itemMenu.ativo
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "text-red-100 hover:bg-red-600 hover:text-white"
              }`}
            >
              {itemMenu.icone}
              {itemMenu.rotulo}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Welcome Card */}
      <div className="p-4">
        
      </div>
    </aside>
  )
}
