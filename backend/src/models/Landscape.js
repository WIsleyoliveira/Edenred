import mongoose from 'mongoose';

const landscapeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [200, 'Título não pode ter mais de 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Descrição não pode ter mais de 1000 caracteres']
  },
  imageUrl: {
    type: String,
    required: [true, 'URL da imagem é obrigatória']
  },
  imagePublicId: {
    type: String, // Para cloudinary ou similar
    default: null
  },
  thumbnailUrl: {
    type: String,
    default: null
  },
  location: {
    name: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude deve estar entre -90 e 90'],
        max: [90, 'Latitude deve estar entre -90 e 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude deve estar entre -180 e 180'],
        max: [180, 'Longitude deve estar entre -180 e 180']
      }
    },
    country: {
      type: String,
      trim: true,
      default: 'Brasil'
    },
    state: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    }
  },
  metadata: {
    fileSize: {
      type: Number,
      min: 0
    },
    dimensions: {
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 }
    },
    format: {
      type: String,
      enum: ['jpeg', 'jpg', 'png', 'webp', 'gif'],
      lowercase: true
    },
    exif: {
      camera: String,
      lens: String,
      iso: Number,
      aperture: String,
      shutterSpeed: String,
      focalLength: String,
      dateTaken: Date
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['landscape', 'urban', 'nature', 'architecture', 'portrait', 'abstract', 'other'],
    default: 'landscape'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comentário não pode ter mais de 500 caracteres']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'rejected'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes para melhor performance
landscapeSchema.index({ title: 'text', description: 'text', tags: 'text' });
landscapeSchema.index({ uploadedBy: 1, createdAt: -1 });
landscapeSchema.index({ category: 1 });
landscapeSchema.index({ isPublic: 1, status: 1 });
landscapeSchema.index({ isFeatured: 1 });
landscapeSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
landscapeSchema.index({ tags: 1 });

// Virtuals
landscapeSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

landscapeSchema.virtual('commentsCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

landscapeSchema.virtual('isRecentUpload').get(function() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.createdAt > oneWeekAgo;
});

// Métodos de instância
landscapeSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  
  if (existingLike) {
    // Remove like se já existe
    this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
    return { action: 'removed', count: this.likes.length };
  } else {
    // Adiciona like
    this.likes.push({ user: userId });
    return { action: 'added', count: this.likes.length };
  }
};

landscapeSchema.methods.addComment = function(userId, text) {
  this.comments.push({ user: userId, text });
  return this.comments[this.comments.length - 1];
};

landscapeSchema.methods.incrementView = function() {
  this.views += 1;
  return this.save();
};

// Métodos estáticos
landscapeSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isPublic: true, status: 'active' })
    .sort({ views: -1, likes: -1 })
    .limit(limit)
    .populate('uploadedBy', 'name avatar');
};

landscapeSchema.statics.findFeatured = function(limit = 5) {
  return this.find({ isPublic: true, status: 'active', isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('uploadedBy', 'name avatar');
};

landscapeSchema.statics.findByLocation = function(latitude, longitude, radiusInKm = 10) {
  return this.find({
    isPublic: true,
    status: 'active',
    'location.coordinates.latitude': {
      $gte: latitude - (radiusInKm / 111.32),
      $lte: latitude + (radiusInKm / 111.32)
    },
    'location.coordinates.longitude': {
      $gte: longitude - (radiusInKm / (111.32 * Math.cos(latitude * Math.PI / 180))),
      $lte: longitude + (radiusInKm / (111.32 * Math.cos(latitude * Math.PI / 180)))
    }
  });
};

const Landscape = mongoose.model('Landscape', landscapeSchema);

export default Landscape;
