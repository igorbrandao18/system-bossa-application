import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Movie as MovieIcon } from '@mui/icons-material';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        textAlign: 'center',
        p: 3,
      }}
    >
      <MovieIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      
      <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: '4rem', md: '6rem' } }}>
        404
      </Typography>
      
      <Typography variant="h4" gutterBottom>
        Página não encontrada
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        Desculpe, a página que você está procurando não existe ou foi removida.
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/dashboard')}
        sx={{ minWidth: 200 }}
      >
        Voltar ao Dashboard
      </Button>
    </Box>
  );
} 