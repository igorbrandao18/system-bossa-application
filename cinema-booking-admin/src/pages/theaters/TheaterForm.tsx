import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/api';

interface TheaterFormData {
  name: string;
  capacity: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  rows: string;
  seatsPerRow: string;
}

export default function TheaterForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<TheaterFormData>({
    name: '',
    capacity: '',
    status: 'ACTIVE',
    rows: '',
    seatsPerRow: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchTheater();
    }
  }, [id]);

  const fetchTheater = async () => {
    try {
      setLoading(true);
      const theater = await apiService.theaters.getById(id!);
      setFormData({
        name: theater.name,
        capacity: theater.capacity.toString(),
        status: theater.status,
        rows: theater.seatLayout.rows.toString(),
        seatsPerRow: theater.seatLayout.seatsPerRow.toString(),
      });
    } catch (err: any) {
      console.error('Error fetching theater:', err);
      setError(err.response?.data?.message || 'Erro ao carregar sala');
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
        capacity: parseInt(formData.capacity),
        status: formData.status,
        seatLayout: {
          rows: parseInt(formData.rows),
          seatsPerRow: parseInt(formData.seatsPerRow),
        },
      };

      if (isEditMode) {
        await apiService.theaters.update(id!, data);
      } else {
        await apiService.theaters.create(data);
      }

      navigate('/theaters');
    } catch (err: any) {
      console.error('Error saving theater:', err);
      setError(err.response?.data?.message || 'Erro ao salvar sala');
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

  const calculateCapacity = () => {
    const rows = parseInt(formData.rows) || 0;
    const seatsPerRow = parseInt(formData.seatsPerRow) || 0;
    const capacity = rows * seatsPerRow;
    setFormData(prev => ({
      ...prev,
      capacity: capacity.toString(),
    }));
  };

  useEffect(() => {
    calculateCapacity();
  }, [formData.rows, formData.seatsPerRow]);

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
        {isEditMode ? 'Editar Sala' : 'Nova Sala'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Fileiras"
                name="rows"
                type="number"
                value={formData.rows}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assentos por Fileira"
                name="seatsPerRow"
                type="number"
                value={formData.seatsPerRow}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacidade Total"
                name="capacity"
                type="number"
                value={formData.capacity}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <MenuItem value="ACTIVE">Ativa</MenuItem>
                  <MenuItem value="INACTIVE">Inativa</MenuItem>
                  <MenuItem value="MAINTENANCE">Em Manutenção</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/theaters')}
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