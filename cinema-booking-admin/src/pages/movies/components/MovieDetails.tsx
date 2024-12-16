import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { apiService } from '@/services/api';

interface MovieDetailsProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
  onUpdate?: (updatedMovie: Movie) => void;
}

export const MovieDetails = ({ movie, open, onClose, onUpdate }: MovieDetailsProps) => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('inactive');

  useEffect(() => {
    if (movie) {
      setStatus(movie.status);
    }
  }, [movie]);

  const handleStatusChange = async () => {
    if (!movie) return;

    try {
      setLoading(true);
      const newStatus = status === 'active' ? 'inactive' : 'active';
      const updatedMovie = await apiService.movies.update(movie.id, {
        status: newStatus
      });
      setStatus(newStatus);
      onUpdate?.(updatedMovie);
    } catch (error) {
      console.error('Error updating movie status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!movie) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">{movie.title}</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={status === 'active'}
              onChange={handleStatusChange}
              disabled={loading}
            />
          }
          label={status === 'active' ? 'Active' : 'Inactive'}
        />
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Details" />
          <Tab label="Showtimes" />
        </Tabs>
      </Box>

      <DialogContent>
        {tab === 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={movie.posterPath || '/placeholder-movie.png'}
                alt={movie.title}
                sx={{ width: '100%', borderRadius: 1 }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-movie.png';
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  TMDB ID
                </Typography>
                <Typography>{movie.tmdbId}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Synopsis
              </Typography>
              <Typography paragraph>{movie.overview}</Typography>

              <Typography variant="h6" gutterBottom>
                Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Release Date
                  </Typography>
                  <Typography>
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rating
                  </Typography>
                  <Typography>
                    {movie.voteAverage ? (
                      <>
                        {movie.voteAverage.toFixed(1)} ({movie.voteCount} votes)
                      </>
                    ) : (
                      'No ratings yet'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Genres
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {movie.genres?.map((genre) => (
                      <Chip key={genre.id} label={genre.name} size="small" />
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            Showtimes management coming soon...
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}; 