import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../../services/api';

interface Showtime {
  id: string;
  movieId: string;
  movieTitle: string;
  theaterId: string;
  theaterName: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;
}

export default function Showtimes() {
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShowtimes();
  }, []);

  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      const response = await apiService.showtimes.getAll();
      setShowtimes(response);
      setError('');
    } catch (err: any) {
      console.error('Error fetching showtimes:', err);
      setError(err.response?.data?.message || 'Erro ao carregar sessões');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta sessão?')) {
      return;
    }

    try {
      await apiService.showtimes.delete(id);
      setShowtimes(showtimes.filter(showtime => showtime.id !== id));
    } catch (err: any) {
      console.error('Error deleting showtime:', err);
      setError(err.response?.data?.message || 'Erro ao excluir sessão');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Sessões
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/showtimes/new')}
        >
          Nova Sessão
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Filme</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Início</TableCell>
              <TableCell>Término</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell align="right">Lugares Disponíveis</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showtimes.map((showtime) => (
              <TableRow key={showtime.id}>
                <TableCell>{showtime.movieTitle}</TableCell>
                <TableCell>{showtime.theaterName}</TableCell>
                <TableCell>
                  {format(new Date(showtime.startTime), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  {format(new Date(showtime.endTime), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(showtime.price)}
                </TableCell>
                <TableCell align="right">{showtime.availableSeats}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/showtimes/${showtime.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(showtime.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {showtimes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhuma sessão encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 