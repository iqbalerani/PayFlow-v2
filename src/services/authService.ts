import api from '../lib/api';

export interface User {
  id: string;
  walletAddress: string;
  displayName?: string;
  email?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface SIWEMessage {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
}

class AuthService {
  /**
   * Verify SIWE message and signature to authenticate user
   */
  async verify(message: string, signature: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/verify', {
      message,
      signature,
    });

    // Store token and user in localStorage
    if (response.data.token) {
      localStorage.setItem('payflow_token', response.data.token);
      localStorage.setItem('payflow_user', JSON.stringify(response.data.user));
    }

    return response.data;
  }

  /**
   * Refresh the current token
   */
  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post<{ success: boolean; token: string }>('/auth/refresh');

    if (response.data.token) {
      localStorage.setItem('payflow_token', response.data.token);
    }

    return { token: response.data.token };
  }

  /**
   * Logout user (clear local storage)
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('payflow_token');
      localStorage.removeItem('payflow_user');
    }
  }

  /**
   * Get current user from backend
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  }

  /**
   * Get stored token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('payflow_token');
  }

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('payflow_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Test login for development (no signature verification)
   * WARNING: Only use in development environment
   */
  async testLogin(walletAddress: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/test-login', {
      walletAddress,
    });

    // Store token and user in localStorage
    if (response.data.token) {
      localStorage.setItem('payflow_token', response.data.token);
      localStorage.setItem('payflow_user', JSON.stringify(response.data.user));
    }

    return response.data;
  }
}

export default new AuthService();
