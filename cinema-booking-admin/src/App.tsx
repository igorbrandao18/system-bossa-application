import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import theme from './theme';
import Layout from './components/layout/Layout';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Movies from './pages/movies/Movies';
import MovieForm from './pages/movies/MovieForm';
import Showtimes from './pages/showtimes/Showtimes';
import ShowtimeForm from './pages/showtimes/ShowtimeForm';
import Theaters from './pages/theaters/Theaters';
import TheaterForm from './pages/theaters/TheaterForm';
import Bookings from './pages/bookings/Bookings';
import BookingDetails from './pages/bookings/BookingDetails';
import Users from './pages/users/Users';
import UserForm from './pages/users/UserForm';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import NotFound from './pages/NotFound';
import RequireAuth from './components/RequireAuth';
import Genres from './pages/genres/Genres';
import GenreForm from './pages/genres/GenreForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<RequireAuth><Layout /></RequireAuth>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Movies */}
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/new" element={<MovieForm />} />
              <Route path="/movies/:id/edit" element={<MovieForm />} />
              
              {/* Showtimes */}
              <Route path="/showtimes" element={<Showtimes />} />
              <Route path="/showtimes/new" element={<ShowtimeForm />} />
              <Route path="/showtimes/:id" element={<ShowtimeForm />} />
              
              {/* Theaters */}
              <Route path="/theaters" element={<Theaters />} />
              <Route path="/theaters/new" element={<TheaterForm />} />
              <Route path="/theaters/:id/edit" element={<TheaterForm />} />
              
              {/* Bookings */}
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:id" element={<BookingDetails />} />
              
              {/* Users */}
              <Route path="/users" element={<Users />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/users/:id" element={<UserForm />} />
              
              {/* Reports */}
              <Route path="/reports" element={<Reports />} />
              
              {/* Settings */}
              <Route path="/settings" element={<Settings />} />
              
              {/* Genres */}
              <Route path="/genres" element={<Genres />} />
              <Route path="/genres/new" element={<GenreForm />} />
              <Route path="/genres/:id/edit" element={<GenreForm />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
