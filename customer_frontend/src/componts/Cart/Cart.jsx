import { Box, Button, FormControl, FormControlLabel, IconButton, Modal, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Badge } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('full');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [paymentError, setPaymentError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/get_user', {
          headers: {
            token
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();

    // Load cart items and ensure prices are numbers
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    const itemsWithNumericPrices = items.map(item => ({
      ...item,
      price: Number(item.price)
    }));
    setCartItems(itemsWithNumericPrices);
    setLoading(false);
  }, [navigate]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeItem = (productId) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };
 const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0).toFixed(2);
  };
  const handleOpenPaymentModal = () => {
    setPaymentError('');
    setOpenPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');
    
    // Basic validation
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardName) {
      setPaymentError('Please fill all card details');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    if (!user) {
      setPaymentError('User information not available');
      return;
    }

    try {
      const paymentData = {
        userId: user.CustomerID,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price
        })),
        paymentMethod,
        user: {
          customer_name: user.customer_name,
          email: user.email,
          tel_num: user.tel_num
        }
      };

      const response = await fetch('http://localhost:4000/api/order/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         token
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment processing failed');
      }

      // Payment successful
      localStorage.removeItem('cart');
      setCartItems([]);
      setOpenPaymentModal(false);
      
      navigate('/order-confirmation', { 
        state: { 
          orderId: data.orderId,
          amountPaid: data.amountPaid,
          paymentMethod,
          customerName: user.customer_name,
          email: user.email
        }
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography variant="h6">Loading your cart...</Typography>
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        p: 5,
        marginTop: '100px' 
      }}>
        <Typography variant="h5" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: 3,
      marginTop: '100px' 
    }}>
      {/* Cart Icon */}
      <Box sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
          <Badge badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)} 
                 color="error" 
                 overlap="circular">
            <ShoppingCartIcon style={{ fontSize: 30, color: '#333' }} />
          </Badge>
        </Link>
      </Box>

      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Your Shopping Cart
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 3 }}>
        {cartItems.map(item => (
          <Paper key={item.productId} sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            flexWrap: 'wrap'
          }}>
            <Box sx={{ 
              width: 100, 
              height: 100,
              flexShrink: 0
            }}>
              <img 
                src={`http://localhost:4000/images/${item.productImage}`} 
                alt={item.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  borderRadius: '4px' 
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                }}
              />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.category}
              </Typography>
            <Typography variant="body1" fontWeight="bold">
      LKR{Number(item.price).toFixed(2)}
    </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              flexShrink: 0
            }}>
              <IconButton 
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                size="small"
              >
                <RemoveIcon />
              </IconButton>
              
              <Typography>{item.quantity}</Typography>
              
              <IconButton 
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>
            
            <Typography variant="h6" sx={{ 
              minWidth: 80, 
              textAlign: 'right',
              flexShrink: 0
            }}>
              LKR{(item.price * item.quantity).toFixed(2)}
            </Typography>
            
            <IconButton 
              onClick={() => removeItem(item.productId)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Paper>
        ))}
      </Box>
      
      <Paper sx={{ 
        mt: 4, 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h5">
            Total: LKR{calculateTotal()}
          </Typography>
          {paymentMethod === 'advance' && (
            <Typography variant="body2" color="text.secondary">
              (30% advance: LKR{(parseFloat(calculateTotal()) * 0.3).toFixed(2)})
            </Typography>
          )}
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          sx={{ fontWeight: 'bold' }}
          onClick={handleOpenPaymentModal}
        >
          Proceed to Checkout
        </Button>
      </Paper>

      {/* Payment Modal */}
      <Modal
        open={openPaymentModal}
        onClose={handleClosePaymentModal}
        aria-labelledby="payment-modal-title"
        aria-describedby="payment-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Typography id="payment-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Payment Details
          </Typography>
          
          {paymentError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {paymentError}
            </Typography>
          )}
          
          <form onSubmit={handlePaymentSubmit}>
            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <RadioGroup
                aria-label="payment method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel 
                  value="full" 
                  control={<Radio />} 
                  label={`Full Payment (LKR${calculateTotal()})`} 
                />
              
              </RadioGroup>
            </FormControl>
            
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              sx={{ mb: 2 }}
              required
              inputProps={{
                pattern: '[0-9]{16}',
                title: 'Please enter a valid 16-digit card number'
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleCardChange}
                placeholder="MM/YY"
                required
                inputProps={{
                  pattern: '(0[1-9]|1[0-2])\/?([0-9]{2})',
                  title: 'Please enter a valid expiry date (MM/YY)'
                }}
              />
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCardChange}
                placeholder="123"
                required
                inputProps={{
                  pattern: '[0-9]{3,4}',
                  title: 'Please enter a valid CVV (3 or 4 digits)'
                }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Cardholder Name"
              name="cardName"
              value={cardDetails.cardName}
              onChange={handleCardChange}
              sx={{ mb: 3 }}
              required
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleClosePaymentModal}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                Pay {paymentMethod === 'advance' ? '30% Advance' : 'Full Amount'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Cart;