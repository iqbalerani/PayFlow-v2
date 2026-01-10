import api from '../lib/api';
import { User } from './authService';

export interface UserProfile extends User {
  autoApproval: boolean;
  emailNotify: boolean;
  createdAt: string;
}

export interface UpdateUserData {
  displayName?: string;
  email?: string;
  autoApproval?: boolean;
  emailNotify?: boolean;
}

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<{ user: UserProfile }>('/user');
    return response.data.user;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserData): Promise<UserProfile> {
    const response = await api.patch<{ user: UserProfile }>('/user', data);

    // Update stored user in localStorage
    const storedUser = localStorage.getItem('payflow_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      localStorage.setItem('payflow_user', JSON.stringify({ ...user, ...data }));
    }

    return response.data.user;
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>('/user');

    // Clear local storage
    localStorage.removeItem('payflow_token');
    localStorage.removeItem('payflow_user');

    return response.data;
  }
}

export default new UserService();
