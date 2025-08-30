
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Trash2, MapPin, Eye, Calendar } from 'lucide-react'
import { lumi } from '../lib/lumi'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface Favorite {
  _id: string
  userId: string
  landscapeId: string
  note: string
  createdAt: string
}

interface Landscape {
  _id: string
  title: string
  imageUrl: string
  location: {
    country: string
    region: string
  }
  photographer: string
  likes: number
  viewCount: number
}

const Favorites: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [landscapes, setLandscapes] = useState<Record<string, Landscape>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFavorites()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      
      // Buscar favoritos do usuário
      const { list: favoritesList } = await lumi.entities.user_favorites.list()
      const userFavorites = favoritesList.filter((fav: Favorite) => fav.userId === user?.userId)
      setFavorites(userFavorites)

      // Buscar dados das paisagens
      if (userFavorites.length > 0) {
        const landscapePromises = userFavorites.map((fav: Favorite) =>
          lumi.entities.landscapes.get(fav.landscapeId).catch(() => null)
        )
        
        const landscapeResults = await Promise.all(landscapePromises)
        const landscapeMap: Record<string, Landscape> = {}
        
        landscapeResults.forEach((landscape, index) => {
          if (landscape) {
            landscapeMap[userFavorites[index].landscapeId] = landscape
          }
        })
        
        setLandscapes(landscapeMap)
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
      toast.error('Erro ao carregar favoritos')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string, landscapeTitle: string) => {
    try {
      await lumi.entities.user_favorites.delete(favoriteId)
      setFavorites(prev => prev.filter(fav => fav._id !== favoriteId))
      toast.success(`Removido dos favoritos: ${landscapeTitle}`)
    } catch (error) {
      console.error('Erro ao remover favorito:', error)
      toast.error('Erro ao remover favorito')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Não autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Entre para ver seus favoritos
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Faça login para salvar e gerenciar suas paisagens favoritas
          </p>
          <button
            onClick={() => lumi.auth.signIn()}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Heart className="mr-2" size={20} />
            Entrar Agora
          </button>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus favoritos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Minhas Paisagens Favoritas
          </h1>
          <p className="text-xl text-gray-600">
            {favorites.length} paisagem{favorites.length !== 1 ? 's' : ''} salva{favorites.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">💔</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Nenhuma paisagem favoritada ainda
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explore nossa galeria e salve as paisagens que mais tocam seu coração
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Explorar Galeria
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {favorites.map((favorite) => {
              const landscape = landscapes[favorite.landscapeId]
              
              if (!landscape) {
                return (
                  <motion.div
                    key={favorite._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="text-center text-gray-500">
                      <p className="mb-4">Paisagem não encontrada</p>
                      <button
                        onClick={() => removeFavorite(favorite._id, 'Paisagem removida')}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remover dos favoritos
                      </button>
                    </div>
                  </motion.div>
                )
              }

              return (
                <motion.div
                  key={favorite._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <Link to={`/landscape/${landscape._id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={landscape.imageUrl}
                        alt={landscape.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Favorite badge */}
                      <div className="absolute top-3 left-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <Heart className="h-4 w-4 text-white fill-current" />
                        </div>
                      </div>

                      {/* Stats overlay */}
                      <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          <Heart size={12} />
                          <span>{landscape.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          <Eye size={12} />
                          <span>{landscape.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link to={`/landscape/${landscape._id}`}>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {landscape.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin size={14} className="mr-1" />
                      <span>{landscape.location.region}, {landscape.location.country}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      Por {landscape.photographer}
                    </p>

                    {favorite.note && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-gray-700 text-sm italic">
                          "{favorite.note}"
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>Salvo em {formatDate(favorite.createdAt)}</span>
                      </div>
                      
                      <button
                        onClick={() => removeFavorite(favorite._id, landscape.title)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Remover dos favoritos"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Favorites

// so pra enviar
