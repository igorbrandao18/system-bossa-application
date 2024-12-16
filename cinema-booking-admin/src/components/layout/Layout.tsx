import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#141414' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',   
          p: 3,
          bgcolor: '#141414',
          position: 'relative',
          overflow: 'hidden',
          marginLeft: '240px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 