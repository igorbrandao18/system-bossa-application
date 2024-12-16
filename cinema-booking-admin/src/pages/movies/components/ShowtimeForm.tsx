import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { apiService } from '@/services/api';

interface ShowtimeFormProps {
  open: boolean;
  onClose: () => void;
  movieId: string;
  showtime?: Showtime | null;
  onSuccess: (showtime: Showtime) => void;
}

export const ShowtimeForm = ({ open, onClose, movieId, showtime, onSuccess }: ShowtimeFormProps) => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    theaterId: '',
    date: null,
    time: null,
    price: '',
  });

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const data = await apiService.theaters.getAll();
      setTheaters(data);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) return;

    try {
      setLoading(true);
      const startTime = new Date(formData.date);
      startTime.setHours(formData.time.getHours());
      startTime.setMinutes(formData.time.getMinutes());

      const data = {
        movieId,
        theaterId: formData.theaterId,
        startTime: startTime.toISOString(),
        price: Number(formData.price),
      };

      const response = showtime
        ? await apiService.showtimes.update(showtime.id, data)
        : await apiService.showtimes.create(data);

      onSuccess(response);
    } catch (error) {
      console.error('Error saving showtime:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {showtime ? 'Editar Sessão' : 'Nova Sessão'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
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
              <DatePicker
                label="Data"
                value={formData.date}
                onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TimePicker
                label="Horário"
                value={formData.time}
                onChange={(newValue) => setFormData({ ...formData, time: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Preço"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                fullWidth
                required
                InputProps={{
                  startAdornment: 'R$',
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 