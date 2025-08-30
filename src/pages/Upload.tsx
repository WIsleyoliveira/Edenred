
import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, FileText, Image, X, Check, AlertCircle, Download, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  status: 'uploading' | 'success' | 'error'
  progress: number
}

const Upload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={20} />
    return <FileText size={20} />
  }

  const simulateUpload = (file: File): UploadedFile => {
    const uploadFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0
    }

    // Simular progresso de upload
    const interval = setInterval(() => {
      setFiles(prev => 
        prev.map(f => {
          if (f.id === uploadFile.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100)
            const newStatus = newProgress === 100 ? 'success' : 'uploading'
            
            if (newProgress === 100) {
              clearInterval(interval)
              toast.success(`${file.name} enviado com sucesso!`)
            }
            
            return { ...f, progress: newProgress, status: newStatus }
          }
          return f
        })
      )
    }, 500)

    return uploadFile
  }

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']
    const maxSize = 10 * 1024 * 1024 // 10MB

    Array.from(selectedFiles).forEach(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`Tipo de arquivo não suportado: ${file.name}`)
        return
      }

      if (file.size > maxSize) {
        toast.error(`Arquivo muito grande: ${file.name}`)
        return
      }

      const uploadFile = simulateUpload(file)
      setFiles(prev => [...prev, uploadFile])
    })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const retryUpload = (id: string) => {
    setFiles(prev => 
      prev.map(f => 
        f.id === id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-8 shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
                <UploadIcon className="h-10 w-10 text-white" />
              </div>
              <h1 className="titre-principal text-4xl font-bold mb-2">Upload de Arquivos</h1>
              <p className="texte-elegant text-xl text-red-100">Envie documentos e imagens para o sistema Edenred</p>
            </div>
          </div>
        </motion.div>

        {/* Área de Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="carte-edenred mb-8"
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragOver 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-red-400 hover:bg-red-50/50'
            }`}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl">
                <UploadIcon className="h-12 w-12 text-red-600" />
              </div>
              
              <div>
                <h3 className="titre-secondaire text-2xl font-semibold text-gray-900 mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </h3>
                <p className="texte-elegant text-gray-600 mb-6">
                  Suporte para imagens (JPEG, PNG, GIF), PDFs e documentos de texto
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <label className="btn-edenred-primary cursor-pointer">
                    <UploadIcon className="mr-2" size={18} />
                    Selecionar Arquivos
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      accept="image/*,.pdf,.txt"
                    />
                  </label>
                  
                  <button className="btn-edenred-secondary">
                    <Eye className="mr-2" size={18} />
                    Visualizar Uploads
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-center text-blue-700 text-sm">
                  <AlertCircle size={16} className="mr-2" />
                  Tamanho máximo: 10MB por arquivo • Formatos: JPEG, PNG, GIF, PDF, TXT
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lista de Arquivos */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="carte-edenred"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-xl mb-6">
              <h3 className="font-bold text-center">
                📁 ARQUIVOS ENVIADOS ({files.length})
              </h3>
            </div>

            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {file.status === 'success' ? (
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                        ) : file.status === 'error' ? (
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getFileIcon(file.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {file.status === 'uploading' && (
                        <div className="w-32">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}%</p>
                        </div>
                      )}
                      
                      {file.status === 'success' && (
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            <Eye size={18} />
                          </button>
                          <button className="text-green-600 hover:text-green-800 transition-colors">
                            <Download size={18} />
                          </button>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <button
                          onClick={() => retryUpload(file.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Tentar Novamente
                        </button>
                      )}
                      
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {files.filter(f => f.status === 'success').length} de {files.length} arquivos enviados com sucesso
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setFiles(files.filter(f => f.status !== 'success'))}
                    className="btn-edenred-secondary text-sm"
                  >
                    Limpar Concluídos
                  </button>
                  
                  <button className="btn-edenred-primary text-sm">
                    <Download className="mr-2" size={16} />
                    Baixar Todos
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instruções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="carte-edenred mt-8"
        >
          <h3 className="titre-secondaire text-xl font-semibold mb-4">Instruções de Upload</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Tipos de Arquivo Aceitos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Image size={16} className="mr-2 text-blue-600" />
                  Imagens: JPEG, PNG, GIF
                </li>
                <li className="flex items-center">
                  <FileText size={16} className="mr-2 text-red-600" />
                  Documentos: PDF, TXT
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Limitações</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Tamanho máximo: 10MB por arquivo</li>
                <li>• Máximo de 50 arquivos por sessão</li>
                <li>• Upload simultâneo de até 5 arquivos</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Upload

// so pra enviar
