import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import { styled } from '@mui/material/styles';

// Styled components
const FullWidthContainer = styled(Box)({
  width: '100vw',
  position: 'relative',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  overflow: 'hidden'
});

const OfferBanner = styled(Box)(({ theme }) => ({
  height: '400px',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, rgba(255,87,34,0.1) 0%, rgba(255,152,0,0.1) 100%)',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    height: '300px'
  }
}));

const OfferContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

const OfferImage = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    height: '40%'
  }
}));

const OfferDetails = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    height: '60%'
  }
}));

const CarouselButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255,255,255,0.9)',
  color: '#FF5722',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,1)'
  },
  zIndex: 2,
  width: '50px',
  height: '50px'
});

const CategoryTabs = styled(Tabs)({
  marginBottom: '24px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#FF5722',
    height: '4px'
  }
});

const CategoryTab = styled(Tab)({
  fontWeight: 'bold',
  fontSize: '1rem',
  textTransform: 'none',
  color: '#555',
  '&.Mui-selected': {
    color: '#FF5722'
  }
});

const MenuComponent = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const navigate = useNavigate();

  // Categories list
  const categories = ['All', 'Beverages', 'Meals', 'Desserts', 'Sides', 'Offers', 'Lunch'];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/product/get');
        if (response.data.success) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
          // Filter offer products
          const offers = response.data.products.filter(p => p.category === 'Offers');
          setOfferProducts(offers);
          // Initialize quantities
          const initialQuantities = {};
          response.data.products.forEach(product => {
            initialQuantities[product.productId] = 1;
          });
          setQuantities(initialQuantities);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    updateCartCount();
  }, []);

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
  };

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  // Handle quantity changes
  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value);
    const product = products.find(p => p.productId === productId);

    if (isNaN(numValue)) return;
    if (numValue < 1) return;
    if (numValue > (product?.stock || 1)) return;

    setQuantities(prev => ({ ...prev, [productId]: numValue }));
  };

  // Add to cart function
  const addToCart = (product) => {
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      navigate('/');
      return;
    }
    else {
       navigate('/cart');
    }

    const quantity = quantities[product.productId] || 1;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingIndex = cart.findIndex(item => item.productId === product.productId);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        productImage: product.productImage,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${quantity} ${product.name} added to cart!`);
  };

  // Carousel navigation
  const nextOffer = () => {
    setCurrentOfferIndex((prevIndex) => 
      prevIndex === offerProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevOffer = () => {
    setCurrentOfferIndex((prevIndex) => 
      prevIndex === 0 ? offerProducts.length - 1 : prevIndex - 1
    );
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h6">Loading menu...</Typography>
    </Container>
  );

  if (error) return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
      <Typography color="error">Error: {error}</Typography>
    </Container>
  );

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Cart Icon */}
      <Box sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: '10px',
        boxShadow: 3,
        cursor: 'pointer',
      }}>
        <Link to="/cart" style={{ color: 'inherit' }}>
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon fontSize="large" />
          </Badge>
        </Link>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', marginTop: '100px' }}>
        {/* Menu Header */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Our Menu
        </Typography>

        {/* Category Tabs */}
        <CategoryTabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {categories.map(category => (
            <CategoryTab key={category} value={category} label={category} />
          ))}
        </CategoryTabs>

        {/* Offers Banner (full width) */}
        {offerProducts.length > 0 && (
          <FullWidthContainer>
            <OfferBanner>
              {offerProducts.length > 1 && (
                <>
                  <CarouselButton onClick={prevOffer} sx={{ left: 20 }}>
                    <NavigateBeforeIcon fontSize="large" />
                  </CarouselButton>
                  <CarouselButton onClick={nextOffer} sx={{ right: 20 }}>
                    <NavigateNextIcon fontSize="large" />
                  </CarouselButton>
                </>
              )}
              
              {offerProducts.map((product, index) => (
                <OfferContent
                  key={product.productId}
                  sx={{
                    display: index === currentOfferIndex ? 'flex' : 'none',
                    opacity: index === currentOfferIndex ? 1 : 0,
                    transition: 'opacity 0.5s ease'
                  }}
                >
                  <OfferImage>
                    <img
                      src={`http://localhost:4000/images/${product.productImage}`}
                      alt={product.name}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                      }}
                    />
                  </OfferImage>
                  <OfferDetails>
                    <Chip
                      label="SPECIAL OFFER"
                      sx={{
                        backgroundColor: '#FF5722',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        mb: 2,
                        alignSelf: 'flex-start'
                      }}
                    />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF5722', mr: 2 }}>
                        LKR {product.price}
                      </Typography>
                      {product.stock > 0 ? (
                        <Chip label="In Stock" color="success" />
                      ) : (
                        <Chip label="Out of Stock" color="error" />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        type="number"
                        size="medium"
                        value={quantities[product.productId] || 1}
                        onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                        inputProps={{ min: 1, max: product.stock }}
                        sx={{ width: 100, mr: 2 }}
                      />
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        sx={{ 
                          backgroundColor: '#FF5722', 
                          '&:hover': { backgroundColor: '#E64A19' },
                          fontSize: '1.1rem',
                          padding: '12px 24px',
                          borderRadius: '8px'
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </OfferDetails>
                </OfferContent>
              ))}
            </OfferBanner>
          </FullWidthContainer>
        )}

        {/* Products Grid */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.productId}>
              <Card sx={{ 
                borderRadius: '16px', 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}>
                <CardActionArea component={Link} to={`/product/${product.productId}`} sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:4000/images/${product.productImage}`}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">LKR {product.price}</Typography>
                      <Chip 
                        label={product.category} 
                        color="primary" 
                        size="small"
                        sx={{ 
                          backgroundColor: product.category === 'Offers' ? '#FF5722' : '',
                          color: 'white'
                        }}
                      />
                    </Box>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ p: 2 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={quantities[product.productId] || 1}
                    onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                    inputProps={{ min: 1, max: product.stock }}
                    sx={{ width: 80, mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    sx={{ 
                      backgroundColor: '#FF5722', 
                      '&:hover': { backgroundColor: '#E64A19' },
                      flex: 1
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
            <Typography variant="h6">No products found in this category</Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2, backgroundColor: '#FF5722' }}
              onClick={() => setSelectedCategory('All')}
            >
              View All Products
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default MenuComponent;   