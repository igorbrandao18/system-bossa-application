import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../../services/api';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  movieId: string;
  movieTitle: string;
  showTimeId: string;
  startTime: string;
  endTime: string;
  theaterId: string;
  theaterName: string;
  seats: {
    id: string;
    row: string;
    number: number;
    type: string;
  }[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: string;
}

export default function BookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await apiService.bookings.getById(id!);
      setBooking(response);
      setError('');
    } catch (err: any) {
      console.error('Error fetching booking:', err);
      setError(err.response?.data?.message || 'Erro ao carregar reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return;
    }

    try {
      await apiService.bookings.cancel(id!);
      setBooking(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
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

  if (!booking) {
    return (
      <Box>
        <Alert severity="error">Reserva não encontrada</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/bookings')}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/bookings')}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1">
            Detalhes da Reserva
          </Typography>
        </Box>

        {booking.status !== 'CANCELLED' && (
          <Button
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancelar Reserva
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" gap={2} alignItems="center">
              <Typography variant="h6" component="h2">
                #{booking.id.slice(0, 8)}
              </Typography>
              <Chip
                label={getStatusLabel(booking.status)}
                color={getStatusColor(booking.status)}
              />
              <Chip
                label={getPaymentStatusLabel(booking.paymentStatus)}
                color={getPaymentStatusColor(booking.paymentStatus)}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Cliente
            </Typography>
            <Typography variant="body1">
              {booking.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booking.userEmail}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data da Reserva
            </Typography>
            <Typography variant="body1">
              {format(new Date(booking.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Filme
            </Typography>
            <Typography variant="body1">
              {booking.movieTitle}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Sala
            </Typography>
            <Typography variant="body1">
              {booking.theaterName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Sessão
            </Typography>
            <Typography variant="body1">
              {format(new Date(booking.startTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Assentos
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {booking.seats.map((seat) => (
                <Chip
                  key={seat.id}
                  label={`${seat.row}${seat.number}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">
                Valor Total
              </Typography>
              <Typography variant="h6">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(booking.totalAmount)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
} 