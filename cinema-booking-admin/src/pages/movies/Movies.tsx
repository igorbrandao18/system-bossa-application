import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Sync as SyncIcon } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  popularity: number | null;
  voteAverage: number | null;
  voteCount: number;
  genres: Genre[];
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Genre {
  id: string;
  name: string;
}

interface PaginatedMovies {
  items: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 20;

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Memoize the getRatingColor function
  const getRatingColor = useCallback((rating: number): string => {
    if (rating >= 8) return '#2e7d32';
    if (rating >= 6) return '#1976d2';
    if (rating >= 4) return '#ed6c02';
    return '#d32f2f';
  }, []);

  const fetchMovies = useCallback(async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching movies for page:', currentPage);
      const data = await apiService.movies.getAll(currentPage, ITEMS_PER_PAGE);
      console.log('Movies data:', data);

      // Handle both paginated and non-paginated responses
      if (Array.isArray(data)) {
        // If data is an array, it's a direct list of movies
        setMovies(data);
        // Calculate total pages based on array length
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      } else if (data && Array.isArray(data.items)) {
        // If data has items property, it's paginated
        setMovies(data.items);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('Invalid response format:', data);
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('Movies component mounted, fetching movies...');
    fetchMovies(page);
  }, [page, fetchMovies]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSync = async () => {
    if (syncing) return;
    
    try {
      setSyncing(true);
      setError(null);
      console.log('Starting TMDB sync...');
      await apiService.movies.sync();
      console.log('Sync completed, fetching updated movies...');
      await fetchMovies(1); // Reset to first page after sync
      setPage(1);
    } catch (error) {
      console.error('Error syncing movies:', error);
      setError('Failed to sync movies. Please try again later.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        await apiService.movies.delete(id);
        await fetchMovies(page);
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  // Memoize filtered movies to prevent unnecessary recalculations
  const filteredMovies = useMemo(() => {
    if (!movies) return [];
    
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );

    // If we received a direct array, handle pagination locally
    if (Array.isArray(movies)) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return filtered.slice(start, end);
    }

    return filtered;
  }, [movies, search, page]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4">Gerenciamento de Filmes</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={handleSync}
            disabled={syncing}
          >
            Sincronizar com TMDB
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/movies/new')}
          >
            Adicionar Filme
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search movies..."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* Movies Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Poster</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>Genres</TableCell>
              <TableCell>Rating (Votes)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredMovies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No movies found
                </TableCell>
              </TableRow>
            ) : (
              filteredMovies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>
                    <Box
                      component="img"
                      src={movie.posterPath ? `https://image.tmdb.org/t/p/w92${movie.posterPath}` : '/placeholder-movie.png'}
                      alt={movie.title}
                      sx={{
                        width: 50,
                        height: 75,
                        objectFit: 'cover',
                        borderRadius: 1,
                        boxShadow: 1,
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-movie.png';
                      }}
                    />
                  </TableCell>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {movie.genres.map((genre) => (
                        <Chip key={genre.id} label={genre.name} size="small" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {typeof movie.voteAverage === 'number' ? (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '1rem',
                              color: getRatingColor(movie.voteAverage),
                              bgcolor: `${getRatingColor(movie.voteAverage)}15`,
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {movie.voteAverage.toFixed(1)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ({movie.voteCount.toLocaleString()} votes)
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No ratings yet
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={movie.status === 'active' ? 'Active' : 'Inactive'}
                      color={movie.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => navigate(`/admin/movies/${movie.id}/edit`)}
                      color="primary"
                      title="Edit movie"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(movie.id)}
                      color="error"
                      title="Delete movie"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default Movies; 