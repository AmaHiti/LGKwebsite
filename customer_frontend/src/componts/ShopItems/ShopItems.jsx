import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ShopItems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [quantityErrors, setQuantityErrors] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const isWithinBusinessHours = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    // Sunday: 10am-8pm (10-20)
    if (day === 0) {
      return currentTime >= 10 && currentTime < 20;
    }
    // Monday-Thursday: 11am-9pm (11-21)
    else if (day >= 1 && day <= 4) {
      return currentTime >= 0.5 && currentTime < 24;
    }
    // Friday-Saturday: 11am-11pm (11-23)
    else if (day === 5 || day === 6) {
      return currentTime >= 11 && currentTime < 23;
    }
    
    return false;
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/product/get');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
          const initialQuantities = {};
          data.products.forEach(product => {
            initialQuantities[product.productId] = 1;
          });
          setQuantities(initialQuantities);
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    updateCartCount();
  }, []);

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value);
    const product = products.find(p => p.productId === productId);
    
    if (value === '') {
      setQuantities(prev => ({ ...prev, [productId]: '' }));
      setQuantityErrors(prev => ({ ...prev, [productId]: '' }));
      return;
    }

    if (isNaN(numValue)) {
      setQuantities(prev => ({ ...prev, [productId]: 1 }));
      setQuantityErrors(prev => ({ ...prev, [productId]: 'Must be a number' }));
      return;
    }

    if (numValue < 1) {
      setQuantities(prev => ({ ...prev, [productId]: 1 }));
      setQuantityErrors(prev => ({ ...prev, [productId]: 'Minimum 1' }));
      return;
    }

    if (numValue > product.stock) {
      setQuantities(prev => ({ ...prev, [productId]: product.stock }));
      setQuantityErrors(prev => ({ ...prev, [productId]: `Max ${product.stock}` }));
      return;
    }

    setQuantities(prev => ({ ...prev, [productId]: numValue }));
    setQuantityErrors(prev => ({ ...prev, [productId]: '' }));
  };

  const addToCart = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    // Check business hours
    if (!isWithinBusinessHours()) {
      alert('Sorry, our shop is currently closed. You can only add items to cart during business hours:\n\n' +
            'Mon-Thu: 11am-9pm\n' +
            'Fri-Sat: 11am-11pm\n' +
            'Sun: 10am-8pm');
      return;
    }

    const quantity = quantities[product.productId];
    if (!quantity || quantity < 1) {
      setQuantityErrors(prev => ({ ...prev, [product.productId]: 'Invalid quantity' }));
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.productId);

    if (existingItemIndex >= 0) {
      const newQuantity = cartItems[existingItemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        setQuantityErrors(prev => ({ ...prev, [product.productId]: `Only ${product.stock} available` }));
        return;
      }
      cartItems[existingItemIndex].quantity = newQuantity;
    } else {
      cartItems.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        productImage: product.productImage,
        category: product.category,
        stock: product.stock,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', color: '#666' }}>
      Loading products...
    </div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', color: '#e63946' }}>
      Error: {error}
    </div>;
  }

  if (products.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', color: '#666' }}>
      No products available
    </div>;
  }

  return (
    <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Shop Closed Banner */}
      {!isWithinBusinessHours() && (
        <div style={{
          backgroundColor: '#ffeb3b',
          color: '#333',
          padding: '10px',
          textAlign: 'center',
          marginBottom: '20px',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          ⚠️ Our shop is currently closed. Business hours: 
          Mon-Thu: 11am-9pm | Fri-Sat: 11am-11pm | Sun: 10am-8pm
        </div>
      )}

      {/* Cart Icon */}
      <div style={{
        position: 'absolute',
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
          <Badge badgeContent={cartCount} color="error" overlap="circular">
            <ShoppingCartIcon style={{ fontSize: 30, color: '#333' }} />
          </Badge>
        </Link>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '30px',
        paddingTop: '60px'
      }}>
        {products.map((product) => (
          <div key={product.productId} style={{
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
            }
          }}>
            {/* Product image links to detail page */}
            <Link 
              to={`/products/${product.productId}`} 
              style={{ 
                width: '50%', 
                height: '200px', 
                overflow: 'hidden',
                marginLeft: '25%',
                textDecoration: 'none'
              }}
            >
              <img 
                src={`http://localhost:4000/images/${product.productImage}`} 
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  e.target.style = { objectFit: 'contain', background: '#f5f5f5', padding: '20px' };
                }}
              />
            </Link>
            
            <div style={{ padding: '20px', flexGrow: 1 }}>
              <Link 
                to={`/products/${product.productId}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333', fontWeight: '600' }}>
                  {product.name}
                </h3>
              </Link>
              
              <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '12px', textTransform: 'capitalize' }}>
                {product.category}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <p style={{ fontWeight: 'bold', color: '#e63946', fontSize: '1.3rem', margin: '0' }}>
                  LKR{product.price}
                </p>
                
                <p style={{
                  fontSize: '0.85rem',
                  margin: '0',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: product.stock > 0 ? '#e8f5e9' : '#ffebee',
                  color: product.stock > 0 ? '#2e7d32' : '#c62828'
                }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ marginRight: '10px', fontSize: '0.9rem', color: '#666' }}>
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantities[product.productId] ?? 1}
                    onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                    style={{
                      width: '60px',
                      padding: '5px',
                      border: quantityErrors[product.productId] ? '1px solid #e63946' : '1px solid #ddd',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}
                    disabled={product.stock <= 0}
                  />
                </div>
                {quantityErrors[product.productId] && (
                  <p style={{ color: '#e63946', fontSize: '0.75rem', margin: '5px 0 0 0', textAlign: 'center' }}>
                    {quantityErrors[product.productId]}
                  </p>
                )}
              </div>
              
              <button 
                style={{
                  backgroundColor: product.stock > 0 && isWithinBusinessHours() ? '#4CAF50' : '#9e9e9e',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  width: '100%',
                  borderRadius: '5px',
                  cursor: product.stock > 0 && isWithinBusinessHours() ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  marginTop: 'auto',
                  opacity: quantityErrors[product.productId] ? 0.7 : 1
                }} 
                disabled={product.stock <= 0 || quantityErrors[product.productId] || !isWithinBusinessHours()}
                onClick={() => addToCart(product)}
              >
                {!isWithinBusinessHours() ? 'Shop Closed' : 
                 product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopItems;