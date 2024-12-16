import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { authService } from '../services/auth.service';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          // Redirect to login if no token
          navigate('/login', { replace: true, state: { from: location } });
          return;
        }

        const isValid = await authService.verifyToken();
        if (!isValid) {
          // Token is invalid or expired
          authService.logout();
          navigate('/login', { replace: true, state: { from: location } });
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login', { replace: true, state: { from: location } });
      }
    };

    checkAuth();
  }, [navigate, location]);

  if (isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return children;
} 