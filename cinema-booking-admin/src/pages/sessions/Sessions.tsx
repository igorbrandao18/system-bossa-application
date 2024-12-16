import { Box, Button, Dialog, Typography } from '@mui/material';
import { useState } from 'react';

const Sessions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box>
      <Typography variant="h4">Sessões</Typography>
      
      <Button 
        variant="contained" 
        onClick={() => setIsModalOpen(true)}
      >
        Nova Sessão
      </Button>

      <Box role="grid">
        {/* Calendar content will be implemented later */}
      </Box>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        {/* Dialog content will be implemented later */}
      </Dialog>
    </Box>
  );
};

export default Sessions; 