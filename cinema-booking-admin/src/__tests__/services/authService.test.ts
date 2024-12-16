import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../services/api';
import { authService } from '../../services/authService';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Mock the api module
vi.mock('../../services/api');

// Mock window.location
const mockLocation = {
  href: '',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('AuthService', () => {
  const mockCredentials = {
    email: 'admin@example.com',
    password: 'Admin@123'
  };

  // JWT token parts
  const jwtHeader = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const jwtPayload = {
    sub: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    iat: 1516239022
  };

  // Create base64 encoded parts
  const encodedHeader = Buffer.from(JSON.stringify(jwtHeader)).toString('base64').replace(/=/g, '');
  const encodedPayload = Buffer.from(JSON.stringify(jwtPayload)).toString('base64').replace(/=/g, '');
  const signature = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const mockResponse = {
    data: {
      access_token: `${encodedHeader}.${encodedPayload}.${signature}`,
      user: {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN'
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
    // Reset location
    mockLocation.href = '';
    // Reset API headers
    if (api.defaults.headers) {
      delete api.defaults.headers.common['Authorization'];
    }
  });

  describe('login', () => {
    it('should call the correct API endpoint with credentials', async () => {
      // Mock the API post method
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const response = await authService.login(mockCredentials);
      
      // Create token details
      const tokenParts = {
        fullToken: response.access_token,
        decoded: {
          header: JSON.parse(Buffer.from(response.access_token.split('.')[0], 'base64').toString()),
          payload: JSON.parse(Buffer.from(response.access_token.split('.')[1], 'base64').toString()),
          signature: response.access_token.split('.')[2]
        }
      };

      // Write to temp file
      const tempFile = path.join(os.tmpdir(), 'token-details.json');
      fs.writeFileSync(tempFile, JSON.stringify(tokenParts, null, 2));
      console.log('\nToken details written to:', tempFile);
      console.log('Content:', fs.readFileSync(tempFile, 'utf8'));

      // Verify API endpoint call
      expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
    });

    it('should store token and user data in localStorage after successful login', async () => {
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      await authService.login(mockCredentials);

      // Verify localStorage
      expect(localStorage.getItem('token')).toBe(mockResponse.data.access_token);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
    });

    it('should set Authorization header after successful login', async () => {
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      await authService.login(mockCredentials);

      // Verify Authorization header
      expect(api.defaults.headers.common['Authorization']).toBe(`Bearer ${mockResponse.data.access_token}`);
    });

    it('should throw error on failed login', async () => {
      const errorMessage = 'Invalid credentials';
      vi.mocked(api.post).mockRejectedValueOnce(new Error(errorMessage));

      await expect(authService.login(mockCredentials)).rejects.toThrow(errorMessage);
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      // Setup initial state
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '1' }));
      api.defaults.headers = {
        common: {
          'Authorization': 'Bearer test-token'
        }
      };
    });

    it('should clear localStorage and Authorization header', () => {
      authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(api.defaults.headers.common['Authorization']).toBeUndefined();
      expect(mockLocation.href).toBe('/login');
    });
  });
}); 