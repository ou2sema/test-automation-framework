import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  credentials: {
    user: { username: string; password: string; };
    wrong_user: { username: string; password: string; };
  };
  timeouts: {
    default: number;
    pageLoad: number;
    element: number;
  };
}

// Get current environment from env var or default to 'dev'
const currentEnv = process.env.TEST_ENV || 'dev';

const environments: Record<string, EnvironmentConfig> = {
  dev: {
    baseUrl: 'https://automationexercise.com/',
    apiUrl: 'https://automationexercise.com/api',
    credentials: {
      user: {
        username: process.env.ADMIN_USERNAME || 'ou2sema@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Jy535zi@GrypY'
      },
      wrong_user:{
        username: process.env.ADMIN_USERNAME || 'ou2sema@gmail.com',
        password: process.env.ADMIN_PASSWORD || '123456789'
      },
    
    },
    timeouts: {
      default: 10000,
      pageLoad: 30000,
      element: 5000
    }
  },
  staging: {
    baseUrl: 'https://automationexercise.com/',
    apiUrl: 'https://automationexercise.com/api',
    credentials: {
      user: {
        username: process.env.ADMIN_USERNAME || 'ou2sema@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Jy535zi@GrypY'
      },
      wrong_user:{
        username: process.env.ADMIN_USERNAME || 'ou2sema@gmail.com',
        password: process.env.ADMIN_PASSWORD || '123456789'
      },
    
    },
    timeouts: {
      default: 15000,
      pageLoad: 45000,
      element: 8000
    }
  },
  prod: {
    baseUrl: 'https://automationexercise.com/',
    apiUrl: 'https://automationexercise.com/api',
    credentials: {
      user: {
        username: process.env.ADMIN_USERNAME || 'ou2sema@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Jy535zi@GrypY'
     },
      wrong_user:{
        username: process.env.ADMIN_USERNAME || 'ou2sema@gmail.com',
        password: process.env.ADMIN_PASSWORD || '123456789'
      },
    
    },
    timeouts: {
      default: 20000,
      pageLoad: 60000,
      element: 10000
    }
  }
};

const environmentConfig: EnvironmentConfig = environments[currentEnv];

export default environmentConfig;