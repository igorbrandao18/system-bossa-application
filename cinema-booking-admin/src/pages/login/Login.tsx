import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, Container, Collapse } from '@mui/material';
import { authService } from '@/services/auth.service';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { access_token, user } = await authService.login(email, password);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Erro de login:', err);
      
      if (err.response?.status === 404) {
        setError('Servidor não encontrado. Verifique se a API está rodando.');
      } else if (err.response?.status === 401) {
        setError('Email ou senha incorretos');
      } else if (err.message === 'Acesso não autorizado') {
        setError('Você não tem permissão para acessar o painel admin');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
      
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#141414',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: 'primary.main',
          }}
        >
          Cinema Admin
        </Typography>

        <Collapse in={!!error}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              {error}
            </Alert>
          )}
        </Collapse>

        <TextField
          name="email"
          label="Email"
          type="email"
          required
          fullWidth
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          autoComplete="email"
          autoFocus
          error={!!error && !formData.email}
          sx={{ mb: 2 }}
        />

        <TextField
          name="password"
          label="Senha"
          type="password"
          required
          fullWidth
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          autoComplete="current-password"
          error={!!error && !formData.password}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Box>
    </Container>
  );
};

export default Login; 