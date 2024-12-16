import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/login/Login';
import { apiService } from '../../services/api';

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate
  };
});

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    auth: {
      login: vi.fn()
    }
  }
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderLogin = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('should render login form', () => {
    renderLogin();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should show error when submitting empty form', async () => {
    renderLogin();
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    expect(screen.getByText('Preencha todos os campos')).toBeInTheDocument();
  });

  it('should call login API and redirect on successful login', async () => {
    const mockResponse = {
      access_token: 'fake-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN'
      }
    };

    (apiService.auth.login as any).mockResolvedValueOnce(mockResponse);

    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(apiService.auth.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(localStorage.getItem('token')).toBe(mockResponse.access_token);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('should show error message on login failure', async () => {
    const errorMessage = 'Credenciais inválidas';
    (apiService.auth.login as any).mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });

    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('should disable form during login attempt', async () => {
    (apiService.auth.login as any).mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
  });
}); 