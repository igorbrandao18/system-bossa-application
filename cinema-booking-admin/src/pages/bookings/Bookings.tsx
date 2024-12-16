import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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
  Chip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../../services/api';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  movieId: string;
  movieTitle: string;
  showTimeId: string;
  startTime: string;
  theaterId: string;
  theaterName: string;
  seats: string[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: string;
}

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.bookings.getAll();
      setBookings(response);
      setError('');
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return;
    }

    try {
      await apiService.bookings.cancel(id);
      setBookings(bookings.map(booking => 
        booking.id === id 
          ? { ...booking, status: 'CANCELLED' as const }
          : booking
      ));
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      setError(err.response?.data?.message || 'Erro ao cancelar reserva');
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Booking['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REFUNDED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPaymentStatusLabel = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'PAID':
        return 'Pago';
      case 'PENDING':
        return 'Pendente';
      case 'REFUNDED':
        return 'Reembolsado';
      default:
        return status;
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
          Reservas
        </Typography>
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
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Filme</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Data</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Pagamento</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id.slice(0, 8)}</TableCell>
                <TableCell>{booking.userName}</TableCell>
                <TableCell>{booking.movieTitle}</TableCell>
                <TableCell>{booking.theaterName}</TableCell>
                <TableCell>
                  {format(new Date(booking.startTime), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(booking.totalAmount)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getStatusLabel(booking.status)}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getPaymentStatusLabel(booking.paymentStatus)}
                    color={getPaymentStatusColor(booking.paymentStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Visualizar">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  {booking.status !== 'CANCELLED' && (
                    <Tooltip title="Cancelar">
                      <IconButton
                        color="error"
                        onClick={() => handleCancel(booking.id)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Nenhuma reserva encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 