import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { telefone } = await request.json()

  // Simular validação
  if (!telefone || telefone.length < 3) {
    return NextResponse.json({ erro: 'Telefone inválido' }, { status: 400 })
  }

  // Simular sucesso
  return NextResponse.json({ sucesso: true, mensagem: 'Login realizado com sucesso' })
}
