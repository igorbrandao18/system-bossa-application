import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
import Movies from '@/pages/movies/Movies';
import Genres from '@/pages/genres/Genres';
import Theaters from '@/pages/theaters/Theaters';
import Seats from '@/pages/seats/Seats';
import Showtimes from '@/pages/showtimes/Showtimes';
import Bookings from '@/pages/bookings/Bookings';
import Payments from '@/pages/payments/Payments';
import Users from '@/pages/users/Users';
import Reports from '@/pages/reports/Reports';
import Sync from '@/pages/sync/Sync';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/movies',
        element: <Movies />,
      },
      {
        path: '/genres',
        element: <Genres />,
      },
      {
        path: '/theaters',
        element: <Theaters />,
      },
      {
        path: '/seats',
        element: <Seats />,
      },
      {
        path: '/showtimes',
        element: <Showtimes />,
      },
      {
        path: '/bookings',
        element: <Bookings />,
      },
      {
        path: '/payments',
        element: <Payments />,
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/reports',
        element: <Reports />,
      },
      {
        path: '/sync',
        element: <Sync />,
      },
    ],
  },
]);
