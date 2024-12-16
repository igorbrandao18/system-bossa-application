import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { apiService } from '../../services/api';

interface ShowtimeFormData {
  movieId: string;
  theaterId: string;
  startTime: Date | null;
  endTime: Date | null;
  price: number;
}

const initialFormData: ShowtimeFormData = {
  movieId: '',
  theaterId: '',
  startTime: null,
  endTime: null,
  price: 0,
};

export default function ShowtimeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ShowtimeFormData>(initialFormData);
  const [movies, setMovies] = useState<any[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
    fetchTheaters();
    if (isEditing) {
      fetchShowtime();
    }
  }, [id]);

  const fetchMovies = async () => {
    try {
      const response = await apiService.movies.getAll();
      setMovies(response);
    } catch (err: any) {
      console.error('Error fetching movies:', err);
      setError(err.response?.data?.message || 'Erro ao carregar filmes');
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await apiService.theaters.getAll();
      setTheaters(response);
    } catch (err: any) {
      console.error('Error fetching theaters:', err);
      setError(err.response?.data?.message || 'Erro ao carregar salas');
    }
  };

  const fetchShowtime = async () => {
    try {
      setLoading(true);
      const response = await apiService.showtimes.getById(id!);
      setFormData({
        movieId: response.movieId,
        theaterId: response.theaterId,
        startTime: new Date(response.startTime),
        endTime: new Date(response.endTime),
        price: response.price,
      });
    } catch (err: any) {
      console.error('Error fetching showtime:', err);
      setError(err.response?.data?.message || 'Erro ao carregar sessão');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      if (isEditing) {
        await apiService.showtimes.update(id!, formData);
      } else {
        await apiService.showtimes.create(formData);
      }
      navigate('/showtimes');
    } catch (err: any) {
      console.error('Error saving showtime:', err);
      setError(err.response?.data?.message || 'Erro ao salvar sessão');
    } finally {
      setSaving(false);
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
          {isEditing ? 'Editar Sessão' : 'Nova Sessão'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Filme</InputLabel>
                  <Select
                    value={formData.movieId}
                    onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                    label="Filme"
                    required
                  >
                    {movies.map((movie) => (
                      <MenuItem key={movie.id} value={movie.id}>
                        {movie.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sala</InputLabel>
                  <Select
                    value={formData.theaterId}
                    onChange={(e) => setFormData({ ...formData, theaterId: e.target.value })}
                    label="Sala"
                    required
                  >
                    {theaters.map((theater) => (
                      <MenuItem key={theater.id} value={theater.id}>
                        {theater.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Horário de Início"
                  value={formData.startTime}
                  onChange={(date) => setFormData({ ...formData, startTime: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Horário de Término"
                  value={formData.endTime}
                  onChange={(date) => setFormData({ ...formData, endTime: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Preço"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  fullWidth
                  required
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/showtimes')}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 