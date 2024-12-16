import { Box, Button, Dialog, Typography, Table } from '@mui/material';
import { useState } from 'react';

const Rooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box>
      <Typography variant="h4">Salas</Typography>
      
      <Button 
        variant="contained" 
        onClick={() => setIsModalOpen(true)}
      >
        Adicionar Sala
      </Button>

      <Table>
        {/* Table content will be implemented later */}
      </Table>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        {/* Dialog content will be implemented later */}
      </Dialog>
    </Box>
  );
};

export default Rooms; 