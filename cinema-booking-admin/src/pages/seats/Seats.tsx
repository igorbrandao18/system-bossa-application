import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Theater {
  id: string;
  name: string;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'STANDARD' | 'VIP';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  theaterId: string;
  price: number;
}

const Seats: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [formData, setFormData] = useState({
    row: '',
    number: '',
    type: 'STANDARD',
    status: 'AVAILABLE',
    theaterId: '',
    price: '',
  });

  useEffect(() => {
    fetchSeats();
    fetchTheaters();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/seats');
      const data = await response.json();
      setSeats(data);
    } catch (error) {
      console.error('Erro ao carregar assentos:', error);
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/theaters');
      const data = await response.json();
      setTheaters(data);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    }
  };

  const handleOpen = (seat?: Seat) => {
    if (seat) {
      setSelectedSeat(seat);
      setFormData({
        row: seat.row,
        number: seat.number.toString(),
        type: seat.type,
        status: seat.status,
        theaterId: seat.theaterId,
        price: seat.price.toString(),
      });
    } else {
      setSelectedSeat(null);
      setFormData({
        row: '',
        number: '',
        type: 'STANDARD',
        status: 'AVAILABLE',
        theaterId: '',
        price: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSeat(null);
    setFormData({
      row: '',
      number: '',
      type: 'STANDARD',
      status: 'AVAILABLE',
      theaterId: '',
      price: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const url = selectedSeat
        ? `http://localhost:3000/api/seats/${selectedSeat.id}`
        : 'http://localhost:3000/api/seats';

      const response = await fetch(url, {
        method: selectedSeat ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          row: formData.row,
          number: parseInt(formData.number),
          type: formData.type,
          status: formData.status,
          theaterId: formData.theaterId,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        handleClose();
        fetchSeats();
      }
    } catch (error) {
      console.error('Erro ao salvar assento:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este assento?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/seats/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchSeats();
        }
      } catch (error) {
        console.error('Erro ao excluir assento:', error);
      }
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button variant="contained" onClick={() => handleOpen()}>
          Novo Assento
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sala</TableCell>
              <TableCell>Fileira</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {seats.map((seat) => (
              <TableRow key={seat.id}>
                <TableCell>
                  {theaters.find((t) => t.id === seat.theaterId)?.name}
                </TableCell>
                <TableCell>{seat.row}</TableCell>
                <TableCell>{seat.number}</TableCell>
                <TableCell>{seat.type}</TableCell>
                <TableCell>{seat.status}</TableCell>
                <TableCell>R$ {seat.price.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    data-testid="edit-button"
                    onClick={() => handleOpen(seat)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    data-testid="delete-button"
                    onClick={() => handleDelete(seat.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedSeat ? 'Editar Assento' : 'Novo Assento'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Sala</InputLabel>
            <Select
              value={formData.theaterId}
              label="Sala"
              onChange={(e) => setFormData({ ...formData, theaterId: e.target.value })}
            >
              {theaters.map((theater) => (
                <MenuItem key={theater.id} value={theater.id}>
                  {theater.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Fileira"
            type="text"
            fullWidth
            value={formData.row}
            onChange={(e) => setFormData({ ...formData, row: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Número"
            type="number"
            fullWidth
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type}
              label="Tipo"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="STANDARD">STANDARD</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
              <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
              <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Preço"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Seats; 