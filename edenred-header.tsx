"use client"

import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function EdenredHeader() {
  const pathname = usePathname()

  const menuItems = [
    { label: "EDUCAÇÃO", href: "/educacao" },
    { label: "DETALHES", href: "/detalhes" },
    { label: "HISTÓRICO", href: "/historico" },
    { label: "PROBLEMAS", href: "/problemas" },
    { label: "GPS", href: "/gps" },
    { label: "ANÁLISE", href: "/analise" },
    { label: "CONSULTA", href: "/consulta" },
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-[#E70000] text-white px-4 py-2">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span>Chat</span>
            <span>FAQ</span>
            <span>Cross-Selling</span>
            <span>Cross-Selling SMS</span>
            <span>Etapas</span>
            <span>Verificação CNPJ</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E70000] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="font-bold text-[#E70000] text-xl">EDENRED</span>
            </Link>

            <nav className="flex items-center gap-6">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <Link key={index} href={item.href} className="flex items-center gap-2">
                    <span
                      className={`text-sm hover:text-[#E70000] transition-colors ${
                        isActive ? "text-[#E70000] font-semibold" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-[#E70000]" />}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
