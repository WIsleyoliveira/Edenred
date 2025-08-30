
/**
 * Cliente mock do Lumi para substituir o SDK.
 * Usa os JSONs em src/entities e localStorage para persistência simples no navegador.
 *
 * API mínima implementada (funções usadas pelo projeto):
 * - lumi.auth.isAuthenticated
 * - lumi.auth.user
 * - lumi.auth.onAuthChange(cb) -> unsubscribe
 * - lumi.auth.signIn()
 * - lumi.auth.signOut()
 *
 * - lumi.entities.companies.list()
 * - lumi.entities.landscapes.list()
 * - lumi.entities.landscapes.get(id)
 * - lumi.entities.landscapes.update(id, data)
 * - lumi.entities.consultations.create(data)
 * - lumi.entities.consultations.update(id, data)
 * - lumi.entities.consultations.list()
 * - lumi.entities.comments.list(query)
 * - lumi.entities.comments.create(data)
 * - lumi.entities.user_favorites.list(userId)
 * - lumi.entities.user_favorites.delete(favId)
 *
 * Observação: é uma implementação para desenvolvimento local / modo demo.
 */

import companiesData from '../entities/companies.json'
import landscapesData from '../entities/landscapes.json'
import consultationsDataRaw from '../entities/consultations.json'
import commentsDataRaw from '../entities/comments.json'
import userFavoritesDataRaw from '../entities/user_favorites.json'

type Callback = (payload: any) => void

// clonar dados iniciais
let companies = JSON.parse(JSON.stringify(companiesData))
let landscapes = JSON.parse(JSON.stringify(landscapesData))
let consultations = JSON.parse(JSON.stringify(consultationsDataRaw))
let comments = JSON.parse(JSON.stringify(commentsDataRaw))
let userFavorites = JSON.parse(JSON.stringify(userFavoritesDataRaw))

// helpers de persistência (localStorage) para simular backend persistente no navegador
const STORAGE_KEYS = {
  consultations: 'demo_consultations_v1',
  comments: 'demo_comments_v1',
  favorites: 'demo_favorites_v1',
  authUser: 'demo_auth_user_v1'
}

function loadFromStorage() {
  try {
    const s = localStorage.getItem(STORAGE_KEYS.consultations)
    if (s) consultations = JSON.parse(s)
    const s2 = localStorage.getItem(STORAGE_KEYS.comments)
    if (s2) comments = JSON.parse(s2)
    const s3 = localStorage.getItem(STORAGE_KEYS.favorites)
    if (s3) userFavorites = JSON.parse(s3)
  } catch (e) {
    console.warn('Erro ao carregar dados do localStorage (ignorar em ambiente de build):', e)
  }
}
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.consultations, JSON.stringify(consultations))
    localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments))
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(userFavorites))
  } catch (e) {
    console.warn('Erro ao salvar dados no localStorage (ignorar em ambiente de build):', e)
  }
}

// carregar do storage ao iniciar (no navegador)
if (typeof window !== 'undefined') {
  loadFromStorage()
}

let authUser = null
let subscribers: Callback[] = []

// tentar carregar usuário do localStorage (simula "lembrar sessão")
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.authUser)
    if (raw) authUser = JSON.parse(raw)
  } catch {}
}

const auth = {
  get isAuthenticated() {
    return !!authUser
  },
  get user() {
    return authUser
  },
  onAuthChange(cb: Callback) {
    subscribers.push(cb)
    // retornar função de unsubscribe
    return () => {
      subscribers = subscribers.filter(s => s !== cb)
    }
  },
  async signIn() {
    // Sign in demo: cria um usuário demo e notifica
    authUser = {
      userId: 'demo-user-1',
      email: 'demo@example.com',
      userName: 'Demo User',
      createdTime: new Date().toISOString()
    }
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(authUser)) } catch {}
    }
    subscribers.forEach(s => s({ isAuthenticated: true, user: authUser }))
    return authUser
  },
  async signOut() {
    authUser = null
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(STORAGE_KEYS.authUser) } catch {}
    }
    subscribers.forEach(s => s({ isAuthenticated: false, user: null }))
  }
}

// utilitário para criar IDs simples
function makeId(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9)
}

const entities = {
  companies: {
    async list() {
      // retorna a lista de companies (simulada)
      return JSON.parse(JSON.stringify(companies))
    }
  },
  landscapes: {
    async list() {
      return JSON.parse(JSON.stringify(landscapes))
    },
    async get(id: string) {
      const found = landscapes.find((l: any) => l._id === id)
      if (!found) return null
      return JSON.parse(JSON.stringify(found))
    },
    async update(id: string, data: any) {
      const idx = landscapes.findIndex((l: any) => l._id === id)
      if (idx === -1) throw new Error('Landscape not found')
      landscapes[idx] = { ...landscapes[idx], ...data }
      // salvar no localStorage para persistência
      saveToStorage()
      return JSON.parse(JSON.stringify(landscapes[idx]))
    }
  },
  consultations: {
    async create(data: any) {
      const item = { _id: makeId('consult_'), ...data, createdAt: new Date().toISOString() }
      consultations.push(item)
      saveToStorage()
      return JSON.parse(JSON.stringify(item))
    },
    async update(id: string, data: any) {
      const idx = consultations.findIndex((c: any) => c._id === id)
      if (idx === -1) throw new Error('Consultation not found')
      consultations[idx] = { ...consultations[idx], ...data }
      saveToStorage()
      return JSON.parse(JSON.stringify(consultations[idx]))
    },
    async list() {
      return JSON.parse(JSON.stringify(consultations))
    }
  },
  comments: {
    async list(query: any = {}) {
      // suporta filtrar por landscapeId
      let list = comments.slice()
      if (query.landscapeId) {
        list = list.filter((c: any) => c.landscapeId === query.landscapeId)
      }
      return JSON.parse(JSON.stringify(list))
    },
    async create(data: any) {
      const item = { _id: makeId('comment_'), createdAt: new Date().toISOString(), ...data }
      comments.push(item)
      saveToStorage()
      return JSON.parse(JSON.stringify(item))
    }
  },
  user_favorites: {
    async list(userId?: string) {
      if (!userId && authUser) userId = authUser.userId
      if (!userId) return []
      return JSON.parse(JSON.stringify(userFavorites.filter((f: any) => f.userId === userId)))
    },
    async delete(favId: string) {
      const idx = userFavorites.findIndex((f: any) => f._id === favId)
      if (idx === -1) throw new Error('Favorite not found')
      userFavorites.splice(idx, 1)
      saveToStorage()
      return true
    },
    async create(data: any) {
      const item = { _id: makeId('fav_'), createdAt: new Date().toISOString(), ...data }
      userFavorites.push(item)
      saveToStorage()
      return JSON.parse(JSON.stringify(item))
    }
  }
}

export const lumi = {
  auth,
  entities
}

export default lumi

// so pra enviar

// so pra enviar
