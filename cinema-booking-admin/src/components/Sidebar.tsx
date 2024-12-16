import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import GridViewIcon from '@mui/icons-material/GridView';
import MovieIcon from '@mui/icons-material/Movie';
import WeekendIcon from '@mui/icons-material/Weekend';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import ChairIcon from '@mui/icons-material/Chair';
import PaymentIcon from '@mui/icons-material/Payment';
import SyncIcon from '@mui/icons-material/Sync';
import { authService } from '@/services/auth.service';

const menuItems = [
  {
    title: 'GERAL',
    items: [
      { title: 'Dashboard', icon: <GridViewIcon />, path: '/dashboard' },
    ],
  },
  {
    title: 'GERENCIAMENTO',
    items: [
      { title: 'Filmes', icon: <MovieIcon />, path: '/movies' },
      { title: 'Gêneros', icon: <CategoryIcon />, path: '/genres' },
      { title: 'Salas', icon: <WeekendIcon />, path: '/theaters' },
      { title: 'Assentos', icon: <ChairIcon />, path: '/seats' },
      { title: 'Sessões', icon: <CalendarMonthIcon />, path: '/showtimes' },
      { title: 'Reservas', icon: <ConfirmationNumberIcon />, path: '/bookings' },
      { title: 'Pagamentos', icon: <PaymentIcon />, path: '/payments' },
    ],
  },
  {
    title: 'ADMINISTRAÇÃO',
    items: [
      { title: 'Usuários', icon: <PeopleIcon />, path: '/users' },
      { title: 'Relatórios', icon: <AssessmentIcon />, path: '/reports' },
      { title: 'Sincronização', icon: <SyncIcon />, path: '/sync' },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: '#1a1a1a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Logo & User */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #E50914, #B20710)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Cinema Admin
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#E50914',
              fontSize: '0.9rem',
            }}
          >
            A
          </Avatar>
          <Box>
            <Typography variant="body2">Admin</Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.75rem',
              }}
            >
              admin@cinema.com
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {menuItems.map((section) => (
          <Box key={section.title} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 1,
                display: 'block',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.7rem',
                letterSpacing: '0.5px',
              }}
            >
              {section.title}
            </Typography>
            <List sx={{ py: 0 }}>
              {section.items.map((item) => (
                <ListItem
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    py: 1,
                    px: 2,
                    cursor: 'pointer',
                    bgcolor: location.pathname === item.path
                      ? 'rgba(229, 9, 20, 0.15)'
                      : 'transparent',
                    color: location.pathname === item.path
                      ? '#E50914'
                      : 'white',
                    '&:hover': {
                      bgcolor: 'rgba(229, 9, 20, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: location.pathname === item.path
                        ? '#E50914'
                        : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.path ? 500 : 400,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* Logout */}
      <ListItem
        onClick={handleLogout}
        sx={{
          py: 1,
          px: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(229, 9, 20, 0.1)',
            '& .MuiListItemIcon-root': {
              color: '#E50914',
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 32,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText
          primary="Sair"
          primaryTypographyProps={{
            fontSize: '0.9rem',
          }}
        />
      </ListItem>
    </Box>
  );
};

export default Sidebar;