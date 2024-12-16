import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  MovieOutlined,
  EventSeatOutlined,
  ConfirmationNumberOutlined,
  AttachMoneyOutlined,
} from '@mui/icons-material';
import api from '@/services/api';

interface DashboardMetrics {
  totalMovies: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalMovies: 0,
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [moviesResponse, bookingsResponse] = await Promise.all([
        api.get('/movies'),
        api.get('/bookings'),
      ]);

      const movies = moviesResponse.data;
      const bookings = bookingsResponse.data;

      // Calculate metrics
      const totalMovies = movies.length;
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((acc: number, booking: any) => acc + booking.totalAmount, 0);
      const occupancyRate = 75; // This would normally be calculated based on total seats vs booked seats

      setMetrics({
        totalMovies,
        totalBookings,
        totalRevenue,
        occupancyRate,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, format = (v: any) => v }: any) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        bgcolor: 'background.paper',
      }}
    >
      <Icon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {format(value)}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total de Filmes"
            value={metrics.totalMovies}
            icon={MovieOutlined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Taxa de Ocupação"
            value={metrics.occupancyRate}
            icon={EventSeatOutlined}
            format={(value: number) => `${value}%`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total de Reservas"
            value={metrics.totalBookings}
            icon={ConfirmationNumberOutlined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Receita Total"
            value={metrics.totalRevenue}
            icon={AttachMoneyOutlined}
            format={(value: number) => `R$ ${value.toFixed(2)}`}
          />
        </Grid>
      </Grid>
    </Container>
  );
} 