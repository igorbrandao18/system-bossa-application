import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/api';

interface GenreFormData {
  name: string;
  tmdbId: string;
}

export default function GenreForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<GenreFormData>({
    name: '',
    tmdbId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchGenre();
    }
  }, [id]);

  const fetchGenre = async () => {
    try {
      setLoading(true);
      const genre = await apiService.genres.getById(id!);
      setFormData({
        name: genre.name,
        tmdbId: genre.tmdbId.toString(),
      });
    } catch (err: any) {
      console.error('Error fetching genre:', err);
      setError(err.response?.data?.message || 'Erro ao carregar gênero');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const data = {
        name: formData.name,
        tmdbId: parseInt(formData.tmdbId),
      };

      if (isEditMode) {
        await apiService.genres.update(id!, data);
      } else {
        await apiService.genres.create(data);
      }

      navigate('/admin/genres');
    } catch (err: any) {
      console.error('Error saving genre:', err);
      setError(err.response?.data?.message || 'Erro ao salvar gênero');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading && isEditMode) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={4}>
        {isEditMode ? 'Editar Gênero' : 'Novo Gênero'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="TMDB ID"
            name="tmdbId"
            type="number"
            value={formData.tmdbId}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/genres')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 