
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Heart, Eye } from 'lucide-react'
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
  }
  photographer: string
  likes: number
  viewCount: number
  tags: string[]
}

const Gallery: React.FC = () => {
  const [landscapes, setLandscapes] = useState<Landscape[]>([])
  const [filteredLandscapes, setFilteredLandscapes] = useState<Landscape[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('all')

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'montanha', label: 'Montanhas' },
    { value: 'praia', label: 'Praias' },
    { value: 'floresta', label: 'Florestas' },
    { value: 'lago', label: 'Lagos' },
    { value: 'campo', label: 'Campos' },
    { value: 'deserto', label: 'Desertos' },
    { value: 'cidade', label: 'Cidades' }
  ]

  useEffect(() => {
    fetchLandscapes()
  }, [])

  useEffect(() => {
    filterLandscapes()
  }, [landscapes, searchTerm, selectedCategory, selectedCountry])

  const fetchLandscapes = async () => {
    try {
      setLoading(true)
      const { list } = await lumi.entities.landscapes.list()
      setLandscapes(list)
    } catch (error) {
      console.error('Erro ao carregar paisagens:', error)
      toast.error('Erro ao carregar galeria')
    } finally {
      setLoading(false)
    }
  }

  const filterLandscapes = () => {
    let filtered = landscapes

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(landscape => 
        landscape.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        landscape.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        landscape.photographer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        landscape.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(landscape => landscape.category === selectedCategory)
    }

    // Filtro por país
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(landscape => landscape.location.country === selectedCountry)
    }

    setFilteredLandscapes(filtered)
  }

  const getUniqueCountries = () => {
    const countries = [...new Set(landscapes.map(landscape => landscape.location.country))]
    return countries.sort()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando paisagens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Galeria de Paisagens
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore {landscapes.length} paisagens deslumbrantes de fotógrafos talentosos
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar paisagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Todos os países</option>
                {getUniqueCountries().map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-gray-600 font-medium">
                {filteredLandscapes.length} paisagem{filteredLandscapes.length !== 1 ? 's' : ''} encontrada{filteredLandscapes.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        {filteredLandscapes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Nenhuma paisagem encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termos de busca
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredLandscapes.map((landscape) => (
              <motion.div
                key={landscape._id}
                variants={itemVariants}
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
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
                        {categories.find(cat => cat.value === landscape.category)?.label}
                      </span>
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
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {landscape.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin size={14} className="mr-1" />
                      <span className="line-clamp-1">
                        {landscape.location.city && `${landscape.location.city}, `}
                        {landscape.location.region}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {landscape.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        {landscape.photographer}
                      </span>
                      <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                        Ver detalhes →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Gallery

// so pra enviar
