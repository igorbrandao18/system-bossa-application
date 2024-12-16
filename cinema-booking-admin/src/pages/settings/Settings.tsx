import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { apiService } from '../../services/api';

interface SettingsData {
  tmdbApiKey: string;
  tmdbLanguage: string;
  emailNotifications: boolean;
  bookingExpirationTime: number;
  defaultTicketPrice: number;
  maxSeatsPerBooking: number;
  maintenanceMode: boolean;
}

const initialSettings: SettingsData = {
  tmdbApiKey: '',
  tmdbLanguage: 'pt-BR',
  emailNotifications: true,
  bookingExpirationTime: 15,
  defaultTicketPrice: 0,
  maxSeatsPerBooking: 6,
  maintenanceMode: false,
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.settings.getAll();
      setSettings(response);
      setError('');
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError(err.response?.data?.message || 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await apiService.settings.update(settings);
      setSuccess('Configurações salvas com sucesso!');
      setError('');
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || 'Erro ao salvar configurações');
      setSuccess('');
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
          Configurações
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Configurações da API TMDB
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Chave da API TMDB"
                  value={settings.tmdbApiKey}
                  onChange={(e) => setSettings({ ...settings, tmdbApiKey: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Idioma TMDB"
                  value={settings.tmdbLanguage}
                  onChange={(e) => setSettings({ ...settings, tmdbLanguage: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Configurações de Reservas
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Preço Padrão do Ingresso"
                  type="number"
                  value={settings.defaultTicketPrice}
                  onChange={(e) => setSettings({ ...settings, defaultTicketPrice: Number(e.target.value) })}
                  fullWidth
                  required
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Tempo de Expiração da Reserva (minutos)"
                  type="number"
                  value={settings.bookingExpirationTime}
                  onChange={(e) => setSettings({ ...settings, bookingExpirationTime: Number(e.target.value) })}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Máximo de Assentos por Reserva"
                  type="number"
                  value={settings.maxSeatsPerBooking}
                  onChange={(e) => setSettings({ ...settings, maxSeatsPerBooking: Number(e.target.value) })}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Outras Configurações
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    />
                  }
                  label="Ativar notificações por email"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    />
                  }
                  label="Modo de manutenção"
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : 'Salvar Configurações'}
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