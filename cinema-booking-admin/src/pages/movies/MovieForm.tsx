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
  Autocomplete,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { apiService } from '../../services/api';
import { moviesService } from '../../services/movies.service';

interface Genre {
  id: string;
  tmdbId: number;
  name: string;
}

interface MovieFormData {
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: Date | null;
  genreIds: string[];
  posterPath: string;
  backdropPath: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
}

const initialFormData: MovieFormData = {
  title: '',
  originalTitle: '',
  overview: '',
  releaseDate: null,
  genreIds: [],
  posterPath: '',
  backdropPath: '',
  popularity: 0,
  voteAverage: 0,
  voteCount: 0,
};

export default function MovieForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<MovieFormData>(initialFormData);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGenres();
    if (isEditing) {
      fetchMovie();
    }
  }, [id]);

  const fetchGenres = async () => {
    try {
      const response = await moviesService.getGenres();
      setGenres(response);
    } catch (err: any) {
      console.error('Error fetching genres:', err);
      setError(err.response?.data?.message || 'Erro ao carregar gêneros');
    }
  };

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await moviesService.getById(id!);
      setFormData({
        title: response.title,
        originalTitle: response.originalTitle,
        overview: response.overview,
        releaseDate: new Date(response.releaseDate),
        genreIds: response.genres.map(g => g.id),
        posterPath: response.posterPath,
        backdropPath: response.backdropPath,
        popularity: response.popularity || 0,
        voteAverage: response.voteAverage || 0,
        voteCount: response.voteCount || 0,
      });
    } catch (err: any) {
      console.error('Error fetching movie:', err);
      setError(err.response?.data?.message || 'Erro ao carregar filme');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      if (isEditing) {
        await moviesService.update(id!, formData);
      } else {
        await moviesService.create(formData);
      }
      navigate('/movies');
    } catch (err: any) {
      console.error('Error saving movie:', err);
      setError(err.response?.data?.message || 'Erro ao salvar filme');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof MovieFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
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
          {isEditing ? 'Editar Filme' : 'Novo Filme'}
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
              <Grid item xs={12} md={8}>
                <TextField
                  label="Título"
                  value={formData.title}
                  onChange={handleChange('title')}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Data de Lançamento"
                  value={formData.releaseDate}
                  onChange={(date) => setFormData({ ...formData, releaseDate: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Título Original"
                  value={formData.originalTitle}
                  onChange={handleChange('originalTitle')}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Sinopse"
                  value={formData.overview}
                  onChange={handleChange('overview')}
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={genres}
                  getOptionLabel={(option) => option.name}
                  value={genres.filter((genre) => formData.genreIds.includes(genre.id))}
                  onChange={(_, newValue) => {
                    setFormData({
                      ...formData,
                      genreIds: newValue.map((genre) => genre.id),
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gêneros"
                      placeholder="Selecione os gêneros"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    ))
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Caminho do Poster"
                  value={formData.posterPath}
                  onChange={handleChange('posterPath')}
                  fullWidth
                  helperText="Caminho da imagem no TMDB (ex: /abc123.jpg)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Caminho do Banner"
                  value={formData.backdropPath}
                  onChange={handleChange('backdropPath')}
                  fullWidth
                  helperText="Caminho da imagem no TMDB (ex: /xyz789.jpg)"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Popularidade"
                  type="number"
                  value={formData.popularity}
                  onChange={handleChange('popularity')}
                  fullWidth
                  inputProps={{ step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Avaliação Média"
                  type="number"
                  value={formData.voteAverage}
                  onChange={handleChange('voteAverage')}
                  fullWidth
                  inputProps={{ step: 0.1, min: 0, max: 10 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Número de Votos"
                  type="number"
                  value={formData.voteCount}
                  onChange={handleChange('voteCount')}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/movies')}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
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