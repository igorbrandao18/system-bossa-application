import React from 'react';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
      navigate('/');
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data?.message || 'Erro ao fazer login', {
        variant: 'error',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'secondary.main',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}
          >
            Cinema Admin
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'text.secondary',
                  },
                  '&:hover fieldset': {
                    borderColor: 'text.primary',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'text.primary',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'text.secondary',
                  },
                  '&:hover fieldset': {
                    borderColor: 'text.primary',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'text.primary',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loginMutation.isPending}
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 