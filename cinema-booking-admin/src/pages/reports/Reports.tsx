import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../../services/api';

interface ReportFilters {
  startDate: Date;
  endDate: Date;
  type: 'SALES' | 'OCCUPANCY' | 'MOVIES';
}

interface ReportData {
  totalSales: number;
  totalBookings: number;
  averageOccupancy: number;
  topMovies: {
    movieId: string;
    title: string;
    totalBookings: number;
    totalRevenue: number;
  }[];
}

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    type: 'SALES',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<ReportData | null>(null);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const response = await apiService.reports.generate(filters);
      setData(response);
      setError('');
    } catch (err: any) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.message || 'Erro ao gerar relatório');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Relatórios
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Inicial"
                value={filters.startDate}
                onChange={(date) => date && setFilters({ ...filters, startDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Final"
                value={filters.endDate}
                onChange={(date) => date && setFilters({ ...filters, endDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Relatório</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as ReportFilters['type'] })}
                  label="Tipo de Relatório"
                >
                  <MenuItem value="SALES">Vendas</MenuItem>
                  <MenuItem value="OCCUPANCY">Ocupação</MenuItem>
                  <MenuItem value="MOVIES">Filmes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {data && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total de Vendas
                </Typography>
                <Typography variant="h4">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(data.totalSales)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total de Reservas
                </Typography>
                <Typography variant="h4">
                  {data.totalBookings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Taxa de Ocupação
                </Typography>
                <Typography variant="h4">
                  {data.averageOccupancy.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Filme</TableCell>
                    <TableCell align="right">Reservas</TableCell>
                    <TableCell align="right">Receita</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topMovies.map((movie) => (
                    <TableRow key={movie.movieId}>
                      <TableCell>{movie.title}</TableCell>
                      <TableCell align="right">{movie.totalBookings}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(movie.totalRevenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
} 