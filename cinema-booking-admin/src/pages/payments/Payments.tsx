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
  Typography,
} from '@mui/material';
import { Refresh as RefreshIcon, Info as InfoIcon } from '@mui/icons-material';

interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/payments');
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    }
  };

  const handleOpen = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundAmount('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPayment(null);
    setRefundAmount('');
  };

  const handleRefund = async () => {
    if (!selectedPayment || !refundAmount) return;

    try {
      const response = await fetch(`http://localhost:3000/api/payments/${selectedPayment.id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(refundAmount),
        }),
      });

      if (response.ok) {
        handleClose();
        fetchPayments();
      }
    } catch (error) {
      console.error('Erro ao processar reembolso:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isRefundButtonDisabled = () => {
    if (!selectedPayment || !refundAmount) return true;
    const amount = parseFloat(refundAmount);
    return amount <= 0 || amount > selectedPayment.amount;
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h6">Pagamentos</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchPayments}
        >
          Atualizar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID da Reserva</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Data</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.bookingId}</TableCell>
                <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    data-testid="details-button"
                    onClick={() => handleOpen(payment)}
                  >
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Detalhes do Pagamento</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <>
              <Typography variant="body1" gutterBottom>
                ID: {selectedPayment.id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Reserva: {selectedPayment.bookingId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Valor: R$ {selectedPayment.amount.toFixed(2)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Status: {selectedPayment.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Método: {selectedPayment.paymentMethod}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Data: {formatDate(selectedPayment.createdAt)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Última Atualização: {formatDate(selectedPayment.updatedAt)}
              </Typography>

              {selectedPayment.status === 'COMPLETED' && (
                <TextField
                  margin="dense"
                  label="Valor do Reembolso"
                  type="number"
                  fullWidth
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
          {selectedPayment?.status === 'COMPLETED' && (
            <Button
              onClick={handleRefund}
              disabled={isRefundButtonDisabled()}
            >
              Processar Reembolso
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments; 