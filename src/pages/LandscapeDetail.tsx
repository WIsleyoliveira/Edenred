
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Camera, Heart, Eye, Share2, Calendar, Tag } from 'lucide-react'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'

interface Landscape {
  _id: string
  title: string
  description: string
  imageUrl: string
  category: string
  location: {
    country: string
    region: string
    city?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  photographer: string
  likes: number
  viewCount: number
  tags: string[]
  createdAt: string
}

interface Comment {
  _id: string
  landscapeId: string
  userName: string
  content: string
  rating: number
  createdAt: string
  likes: number
  approved: boolean
}

const LandscapeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [landscape, setLandscape] = useState<Landscape | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(5)

  useEffect(() => {
    if (id) {
      fetchLandscapeDetail()
      fetchComments()
      incrementViewCount()
    }
  }, [id])

  const fetchLandscapeDetail = async () => {
    try {
      const landscape = await lumi.entities.landscapes.get(id!)
      setLandscape(landscape)
    } catch (error) {
      console.error('Erro ao carregar paisagem:', error)
      toast.error('Paisagem não encontrada')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { list } = await lumi.entities.comments.list()
      const landscapeComments = list.filter((comment: Comment) => 
        comment.landscapeId === id && comment.approved
      )
      setComments(landscapeComments)
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
    }
  }

  const incrementViewCount = async () => {
    try {
      if (id) {
        const currentLandscape = await lumi.entities.landscapes.get(id)
        await lumi.entities.landscapes.update(id, {
          viewCount: currentLandscape.viewCount + 1
        })
      }
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: landscape?.title,
          text: landscape?.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      // Fallback para copiar URL
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copiado para a área de transferência!')
    }
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await lumi.entities.comments.create({
        landscapeId: id!,
        userId: 'anonymous_user',
        userName: 'Visitante',
        content: newComment,
        rating: newRating,
        approved: true,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      setNewComment('')
      setNewRating(5)
      fetchComments()
      toast.success('Comentário adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
      toast.error('Erro ao adicionar comentário')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getAverageRating = () => {
    if (comments.length === 0) return 0
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0)
    return (sum / comments.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando paisagem...</p>
        </div>
      </div>
    )
  }

  if (!landscape) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏞️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paisagem não encontrada</h2>
          <Link to="/gallery" className="text-blue-600 hover:text-blue-700">
            ← Voltar para a galeria
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-96 md:h-[70vh] overflow-hidden"
      >
        <img
          src={landscape.imageUrl}
          alt={landscape.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        
        {/* Navigation */}
        <div className="absolute top-6 left-6">
          <Link
            to="/gallery"
            className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl hover:bg-white transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </Link>
        </div>

        {/* Actions */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            onClick={handleShare}
            className="p-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl hover:bg-white transition-colors"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 backdrop-blur-sm rounded-xl transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-900 hover:bg-white'
            }`}
          >
            <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            {landscape.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center space-x-6 text-lg"
          >
            <div className="flex items-center">
              <MapPin size={20} className="mr-2" />
              {landscape.location.city && `${landscape.location.city}, `}
              {landscape.location.region}, {landscape.location.country}
            </div>
            <div className="flex items-center">
              <Camera size={20} className="mr-2" />
              {landscape.photographer}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre esta paisagem</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {landscape.description}
              </p>

              {/* Tags */}
              {landscape.tags && landscape.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Tag size={20} className="mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {landscape.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{landscape.likes}</p>
                  <p className="text-gray-600">Curtidas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{landscape.viewCount}</p>
                  <p className="text-gray-600">Visualizações</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                    <span className="text-xl">⭐</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{getAverageRating()}</p>
                  <p className="text-gray-600">Avaliação</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatDate(landscape.createdAt)}</p>
                  <p className="text-gray-600">Publicado</p>
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Comentários ({comments.length})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={submitComment} className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deixe seu comentário</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avaliação
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>
                        {'⭐'.repeat(rating)} ({rating})
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Compartilhe sua opinião sobre esta paisagem..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
                
                <button
                  type="submit"
                  className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Enviar Comentário
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Seja o primeiro a comentar esta paisagem!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{comment.userName}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{'⭐'.repeat(comment.rating)}</span>
                            <span>•</span>
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Heart size={14} />
                          <span>{comment.likes}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhes da Localização</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">País</span>
                  <p className="text-gray-900">{landscape.location.country}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Região</span>
                  <p className="text-gray-900">{landscape.location.region}</p>
                </div>
                {landscape.location.city && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Cidade</span>
                    <p className="text-gray-900">{landscape.location.city}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Categoria</span>
                  <p className="text-gray-900 capitalize">{landscape.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Fotógrafo</span>
                  <p className="text-gray-900">{landscape.photographer}</p>
                </div>
              </div>

              {landscape.location.coordinates && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Coordenadas</h4>
                  <div className="text-sm text-gray-700">
                    <p>Lat: {landscape.location.coordinates.lat.toFixed(6)}</p>
                    <p>Lng: {landscape.location.coordinates.lng.toFixed(6)}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandscapeDetail

// so pra enviar
