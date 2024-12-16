import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';

interface SyncHistory {
  type: string;
  status: 'success' | 'error';
  message: string;
  timestamp: Date;
}

const Sync: React.FC = () => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [history, setHistory] = useState<SyncHistory[]>([]);

  const handleSync = async (type: string, endpoint: string) => {
    setLoading({ ...loading, [type]: true });

    try {
      const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: 'POST',
      });

      const data = await response.json();

      setHistory([
        {
          type,
          status: 'success',
          message: data.message || 'Sincronização concluída com sucesso',
          timestamp: new Date(),
        },
        ...history,
      ]);
    } catch (error) {
      setHistory([
        {
          type,
          status: 'error',
          message: 'Erro ao sincronizar',
          timestamp: new Date(),
        },
        ...history,
      ]);
    } finally {
      setLoading({ ...loading, [type]: false });
    }
  };

  const syncOptions = [
    {
      title: 'Filmes',
      description: 'Sincronizar catálogo completo de filmes do TMDB',
      endpoint: 'movies/sync',
    },
    {
      title: 'Gêneros',
      description: 'Atualizar lista de gêneros do TMDB',
      endpoint: 'genres/sync',
    },
    {
      title: 'Em Cartaz',
      description: 'Sincronizar filmes em cartaz do TMDB',
      endpoint: 'movies/now-playing/sync',
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Sincronização TMDB
      </Typography>

      <Grid container spacing={3} mb={3}>
        {syncOptions.map((option) => (
          <Grid item xs={12} md={4} key={option.title}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {option.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<SyncIcon />}
                  onClick={() => handleSync(option.title, option.endpoint)}
                  disabled={loading[option.title]}
                >
                  {loading[option.title] ? 'Sincronizando...' : 'Sincronizar'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {history.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Histórico de Sincronização
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {history.map((item, index) => (
              <Alert
                key={index}
                severity={item.status}
                role="alert"
              >
                <AlertTitle>{item.type}</AlertTitle>
                {item.message} - {item.timestamp.toLocaleTimeString()}
              </Alert>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Sync; 