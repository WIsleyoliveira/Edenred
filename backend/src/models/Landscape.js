import AdaptadorFirebase from '../config/adapters/firebaseAdapter.js';

// Validadores e utilitários para paisagens
class Landscape {
  constructor() {
    this.firebase = new AdaptadorFirebase();
  }

  // Validar dados da paisagem
  static validateLandscapeData(data) {
    const errors = [];

    if (!data.title) {
      errors.push('Título é obrigatório');
    } else if (data.title.length > 200) {
      errors.push('Título não pode ter mais de 200 caracteres');
    }

    if (data.description && data.description.length > 1000) {
      errors.push('Descrição não pode ter mais de 1000 caracteres');
    }

    if (!data.imageUrl) {
      errors.push('URL da imagem é obrigatória');
    }

    if (data.location?.coordinates?.latitude) {
      if (data.location.coordinates.latitude < -90 || data.location.coordinates.latitude > 90) {
        errors.push('Latitude deve estar entre -90 e 90');
      }
    }

    if (data.location?.coordinates?.longitude) {
      if (data.location.coordinates.longitude < -180 || data.location.coordinates.longitude > 180) {
        errors.push('Longitude deve estar entre -180 e 180');
      }
    }

    if (data.metadata?.fileSize && data.metadata.fileSize < 0) {
      errors.push('Tamanho do arquivo não pode ser negativo');
    }

    if (data.metadata?.dimensions?.width && data.metadata.dimensions.width < 0) {
      errors.push('Largura não pode ser negativa');
    }

    if (data.metadata?.dimensions?.height && data.metadata.dimensions.height < 0) {
      errors.push('Altura não pode ser negativa');
    }

    if (data.metadata?.format && !['jpeg', 'jpg', 'png', 'webp', 'gif'].includes(data.metadata.format.toLowerCase())) {
      errors.push('Formato deve ser: jpeg, jpg, png, webp ou gif');
    }

    if (data.category && !['landscape', 'urban', 'nature', 'architecture', 'portrait', 'abstract', 'other'].includes(data.category)) {
      errors.push('Categoria deve ser: landscape, urban, nature, architecture, portrait, abstract ou other');
    }

    if (data.status && !['active', 'inactive', 'pending', 'rejected'].includes(data.status)) {
      errors.push('Status deve ser: active, inactive, pending ou rejected');
    }

    if (!data.uploadedBy) {
      errors.push('ID do usuário que fez o upload é obrigatório');
    }

    if (data.views && data.views < 0) {
      errors.push('Número de visualizações não pode ser negativo');
    }

    return errors;
  }

  // Criar dados padrão para uma paisagem
  static createDefaultLandscapeData(data) {
    return {
      title: data.title?.trim() || '',
      description: data.description?.trim() || '',
      imageUrl: data.imageUrl || '',
      imagePublicId: data.imagePublicId || null,
      thumbnailUrl: data.thumbnailUrl || null,
      location: {
        name: data.location?.name?.trim() || '',
        coordinates: {
          latitude: data.location?.coordinates?.latitude || null,
          longitude: data.location?.coordinates?.longitude || null
        },
        country: data.location?.country?.trim() || 'Brasil',
        state: data.location?.state?.trim() || '',
        city: data.location?.city?.trim() || ''
      },
      metadata: {
        fileSize: data.metadata?.fileSize || 0,
        dimensions: {
          width: data.metadata?.dimensions?.width || 0,
          height: data.metadata?.dimensions?.height || 0
        },
        format: data.metadata?.format?.toLowerCase() || '',
        exif: {
          camera: data.metadata?.exif?.camera || '',
          lens: data.metadata?.exif?.lens || '',
          iso: data.metadata?.exif?.iso || null,
          aperture: data.metadata?.exif?.aperture || '',
          shutterSpeed: data.metadata?.exif?.shutterSpeed || '',
          focalLength: data.metadata?.exif?.focalLength || '',
          dateTaken: data.metadata?.exif?.dateTaken || null
        }
      },
      tags: (data.tags || []).map(tag => tag.toLowerCase().trim()),
      category: data.category || 'landscape',
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
      isFeatured: data.isFeatured || false,
      uploadedBy: data.uploadedBy,
      likes: data.likes || [],
      comments: data.comments || [],
      views: data.views || 0,
      status: data.status || 'active'
    };
  }

  // Contar likes
  static getLikesCount(likes) {
    return likes ? likes.length : 0;
  }

  // Contar comentários
  static getCommentsCount(comments) {
    return comments ? comments.length : 0;
  }

  // Verificar se é upload recente
  static isRecentUpload(createdAt) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(createdAt) > oneWeekAgo;
  }

  // Adicionar/remover like
  static async addLike(landscapeId, userId) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      const landscape = await firebase.buscarPaisagemPorId(landscapeId);
      if (!landscape) {
        throw new Error('Paisagem não encontrada');
      }

      const likes = landscape.likes || [];
      const existingLike = likes.find(like => like.user === userId);
      
      let updatedLikes;
      let action;

      if (existingLike) {
        // Remove like se já existe
        updatedLikes = likes.filter(like => like.user !== userId);
        action = 'removed';
      } else {
        // Adiciona like
        updatedLikes = [...likes, { user: userId, likedAt: new Date() }];
        action = 'added';
      }

      await firebase.atualizarPaisagem(landscapeId, { likes: updatedLikes });
      
      return { action, count: updatedLikes.length };
    } catch (error) {
      throw error;
    }
  }

  // Adicionar comentário
  static async addComment(landscapeId, userId, text) {
    if (!text || text.trim().length === 0) {
      throw new Error('Texto do comentário é obrigatório');
    }
    if (text.length > 500) {
      throw new Error('Comentário não pode ter mais de 500 caracteres');
    }

    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      const landscape = await firebase.buscarPaisagemPorId(landscapeId);
      if (!landscape) {
        throw new Error('Paisagem não encontrada');
      }

      const comments = landscape.comments || [];
      const newComment = {
        user: userId,
        text: text.trim(),
        createdAt: new Date()
      };

      const updatedComments = [...comments, newComment];
      await firebase.atualizarPaisagem(landscapeId, { comments: updatedComments });
      
      return newComment;
    } catch (error) {
      throw error;
    }
  }

  // Incrementar visualizações
  static async incrementView(landscapeId) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      const landscape = await firebase.buscarPaisagemPorId(landscapeId);
      if (!landscape) {
        throw new Error('Paisagem não encontrada');
      }

      const newViews = (landscape.views || 0) + 1;
      return await firebase.atualizarPaisagem(landscapeId, { views: newViews });
    } catch (error) {
      throw error;
    }
  }

  // Buscar paisagens populares
  static async findPopular(limit = 10) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      return await firebase.buscarPaisagens({ limit });
    } catch (error) {
      throw error;
    }
  }

  // Buscar paisagens em destaque
  static async findFeatured(limit = 5) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      // Implementação seria necessária no adaptador Firebase para filtrar por featured
      return await firebase.buscarPaisagens({ limit });
    } catch (error) {
      throw error;
    }
  }

  // Buscar paisagens por localização
  static async findByLocation(latitude, longitude, radiusInKm = 10) {
    const firebase = new AdaptadorFirebase();
    await firebase.conectar();
    
    try {
      // Implementação seria necessária no adaptador Firebase para busca geográfica
      // Por enquanto, retorna todas as paisagens
      return await firebase.buscarPaisagens({});
    } catch (error) {
      throw error;
    }
  }
}

export default Landscape;

// so pra enviar
