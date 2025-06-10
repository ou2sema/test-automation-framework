import { BaseService } from './base-service';
import { CustomWorld } from '../support/world';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export class AuthService extends BaseService {
  constructor(world: CustomWorld) {
    super(world);
  }
  
  /**
   * Login via API
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    this.logger.info(`API Login with username: ${username}`);
    
    try {
      const response = await this.post<LoginResponse>('/auth/login', {
        username,
        password
      });
      
      // Set auth token for subsequent requests
      this.setAuthToken(response.data.token);
      
      // Return login response data
      return response.data;
    } catch (error) {
      this.logger.error(`Login failed for user ${username}`);
      throw error;
    }
  }
  
  /**
   * Logout via API
   */
  async logout(): Promise<void> {
    this.logger.info('API Logout');
    
    try {
      await this.post('/auth/logout');
      this.clearAuthToken();
    } catch (error) {
      this.logger.error('Logout failed');
      throw error;
    }
  }
  
  /**
   * Get current user info
   */
  async getCurrentUser() {
    this.logger.info('Getting current user info');
    
    try {
      const response = await this.get('/auth/me');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get current user info');
      throw error;
    }
  }
  
  /**
   * Register new user
   */
  async register(userData: { username: string; email: string; password: string }) {
    this.logger.info(`Registering new user: ${userData.username}`);
    
    try {
      const response = await this.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      this.logger.error(`Registration failed for user ${userData.username}`);
      throw error;
    }
  }
}