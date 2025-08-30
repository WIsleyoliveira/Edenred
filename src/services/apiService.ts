import { API_URL } from '../config/api.js';

// Tipos
export interface User {
  _id: string;
  email: string;
  userName: string;
  role: string;
  createdAt: string;
}

export interface Company {
  _id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: string;
  porte: string;
  telefone?: string;
  email?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    cep: string;
    cidade: string;
    uf: string;
  };
  atividade?: string;
  createdAt: string;
}

export interface Consultation {
  _id: string;
  cnpj: string;
  userId: string;
  userName: string;
  step: number;
  completed: boolean;
  companyData?: any;
  formData?: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_URL;
    // Tentar recuperar token do localStorage
    this.token = localStorage.getItem('auth_token');
  }

  // Configurar headers de autenticação
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Método genérico para fazer requisições
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(includeAuth),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ========================================
  // AUTENTICAÇÃO
  // ========================================

  async login(email: string, password: string): Promise<{ success: boolean; user: User; token: string }> {
    const response = await this.request<{ success: boolean; user: User; token: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      false
    );

    if (response.success && response.token) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData: {
    userName: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; user: User; token: string }> {
    const response = await this.request<{ success: boolean; user: User; token: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      false
    );

    if (response.success && response.token) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  async verifyToken(): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>('/api/auth/verify');
  }

  async getProfile(): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>('/api/auth/profile');
  }

  // ========================================
  // EMPRESAS
  // ========================================

  async getCompanies(params: {
    page?: number;
    limit?: number;
    q?: string;
    situacao?: string;
  } = {}): Promise<{
    success: boolean;
    data: {
      companies: Company[];
      pagination: {
        currentPage: number;
        totalPages: number;
        total: number;
      };
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.q) searchParams.set('q', params.q);
    if (params.situacao) searchParams.set('situacao', params.situacao);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/companies?${queryString}` : '/api/companies';
    
    return this.request<{
      success: boolean;
      data: {
        companies: Company[];
        pagination: {
          currentPage: number;
          totalPages: number;
          total: number;
        };
      };
    }>(endpoint);
  }

  // ========================================
  // CONSULTAS CNPJ
  // ========================================

  async consultCNPJ(cnpj: string): Promise<{
    success: boolean;
    data: {
      company: Company;
      consultation: Consultation;
    };
  }> {
    return this.request<{
      success: boolean;
      data: {
        company: Company;
        consultation: Consultation;
      };
    }>('/api/consultations/cnpj', {
      method: 'POST',
      body: JSON.stringify({ cnpj }),
    });
  }

  async getConsultations(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<{
    success: boolean;
    data: {
      consultations: Consultation[];
      pagination: {
        currentPage: number;
        totalPages: number;
        total: number;
      };
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.status) searchParams.set('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/consultations?${queryString}` : '/api/consultations';
    
    return this.request<{
      success: boolean;
      data: {
        consultations: Consultation[];
        pagination: {
          currentPage: number;
          totalPages: number;
          total: number;
        };
      };
    }>(endpoint);
  }

  async getConsultationStats(): Promise<{
    success: boolean;
    data: {
      total: number;
      emAndamento: number;
      concluidas: number;
      favoritas: number;
      hoje: number;
      semana: number;
      mes: number;
    };
  }> {
    return this.request<{
      success: boolean;
      data: {
        total: number;
        emAndamento: number;
        concluidas: number;
        favoritas: number;
        hoje: number;
        semana: number;
        mes: number;
      };
    }>('/api/consultations/stats');
  }

  async toggleFavorite(consultationId: string): Promise<{ success: boolean; isFavorite: boolean }> {
    return this.request<{ success: boolean; isFavorite: boolean }>(
      `/api/consultations/${consultationId}/favorite`,
      { method: 'PATCH' }
    );
  }

  // ========================================
  // UTILITÁRIOS
  // ========================================

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Obter usuário do localStorage
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Verificar se o servidor está online
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Exportar instância única
export const apiService = new ApiService();
export default apiService;

// so pra enviar
