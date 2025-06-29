import {
  Box,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import React from 'react';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Fallback if accessed directly without state
  if (!state) {
    return (
      <Box sx={{ textAlign: 'center', p: 5, marginTop: '100px' }}>
        <Typography variant="h5" gutterBottom>Order Not Found</Typography>
        <Typography sx={{ mb: 3 }}>This page requires order information.</Typography>
        <Button 
          variant="contained" 
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Return Home
        </Button>
      </Box>
    );
  }

  const { 
    orderId, 
    amountPaid, 
    paymentMethod, 
    customerName, 
    email,
    items = [] // Default empty array if items not passed
  } = state;

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: 3,
      marginTop: '100px'
    }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Thank You For Your Order!
          </Typography>
          <Typography variant="body1">
            A confirmation has been sent to <strong>{email}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Order ID: <strong>#{orderId}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Order Summary</Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">LKR{Number(item.price).toFixed(2)}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      LKR{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ width: 300 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 1
              }}>
                <Typography>Payment Method:</Typography>
                <Typography>
                  {paymentMethod === 'advance' ? '30% Advance' : 'Full Payment'}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 1
              }}>
                <Typography>Amount Paid:</Typography>
                <Typography fontWeight="bold">
                  LKR{Number(amountPaid).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            We've sent your order confirmation and receipt to {email}. 
            You'll receive another email when your order ships.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              startIcon={<EmailIcon />}
              onClick={() => window.location.href = `mailto:?body=Order%20ID:%20${orderId}`}
            >
              Email Receipt
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Need help? Contact our customer support at support@yourrestaurant.com
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderConfirmation;