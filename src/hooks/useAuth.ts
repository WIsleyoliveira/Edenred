
import { useState, useEffect } from 'react'
import { lumi } from '../lib/lumi'

interface Usuario {
  idUsuario: string
  email: string
  nomeUsuario: string
  dataHoraCriacao: string
}

export function useAuth() {
  const [estaAutenticado, setEstaAutenticado] = useState(lumi.auth.isAuthenticated)
  const [usuario, setUsuario] = useState<Usuario | null>(lumi.auth.user)

  useEffect(() => {
    const cancelarInscricao = lumi.auth.onAuthChange(({ isAuthenticated, user }) => {
      setEstaAutenticado(isAuthenticated)
      setUsuario(user)
    })
    return () => cancelarInscricao()
  }, [])

  return { usuario, estaAutenticado }
}
