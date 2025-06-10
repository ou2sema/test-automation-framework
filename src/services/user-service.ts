import { BaseService } from './base-service';
import { CustomWorld } from '../support/world';

export class UserService extends BaseService {
  constructor(world: CustomWorld) {
    super(world);
  }
  
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string) {
    this.logger.info(`Getting user profile for ID: ${userId}`);
    
    try {
      const response = await this.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get user profile for ID: ${userId}`);
      throw error;
    }
  }
  
  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, profileData: any) {
    this.logger.info(`Updating user profile for ID: ${userId}`);
    
    try {
      const response = await this.put(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update user profile for ID: ${userId}`);
      throw error;
    }
  }
  
  /**
   * List users with pagination
   */
  async listUsers(page = 1, limit = 10) {
    this.logger.info(`Listing users: page ${page}, limit ${limit}`);
    
    try {
      const response = await this.get('/users', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      this.logger.error('Failed to list users');
      throw error;
    }
  }
  
  /**
   * Delete user
   */
  async deleteUser(userId: string) {
    this.logger.info(`Deleting user with ID: ${userId}`);
    
    try {
      const response = await this.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete user with ID: ${userId}`);
      throw error;
    }
  }
}