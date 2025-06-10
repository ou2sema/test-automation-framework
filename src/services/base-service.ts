import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CustomWorld } from '../support/world';
import { Logger } from '../utils/logger';

export class BaseService {
  protected api: AxiosInstance;
  protected world: CustomWorld;
  protected logger: Logger;
  protected authToken: string | null = null;

  constructor(world: CustomWorld) {
    this.world = world;
    this.logger = new Logger(this.constructor.name);
    
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: world.environment.apiUrl,
      timeout: world.environment.timeouts.default,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Add request interceptor for logging
    this.api.interceptors.request.use((config) => {
      // Add auth token if available
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      
      this.logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });
    
    // Add response interceptor for logging
    this.api.interceptors.response.use(
      (response) => {
        this.logger.debug(`API Response: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        this.logger.error(`API Error: ${error.message}`);
        if (error.response) {
          this.logger.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
        }
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    this.logger.info('Auth token set for API requests');
  }
  
  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    this.logger.info('Auth token cleared');
  }
  
  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }
  
  /**
   * Make a POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }
  
  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }
  
  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }
  
  /**
   * Make a PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }
}