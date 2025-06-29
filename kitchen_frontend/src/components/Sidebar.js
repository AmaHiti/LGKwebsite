import './Sidebar.css';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  AddCircle as AddCircleIcon,
  BusinessCenter as BusinessCenterIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Inventory as InventoryIcon,
  ListAlt as ListAltIcon,
  Menu as MenuIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import axios from 'axios';

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));  
  const [open, setOpen] = useState(false);  
  const navigate = useNavigate();  
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const response = await axios.get('http://localhost:4000/api/guides/get_guide', {
          headers: {
            token: token
          }
        });
        setUsername(response.data.user.supervisor_name); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching username:', error);
        setLoading(false);
      }
    };
  
    fetchUsername();
  }, []);
  
  const menuItems = [
    { text: 'Add Products', icon: <AddCircleIcon />, path: '/Add-products' },
    { text: 'List Products', icon: <FormatListBulletedIcon />, path: '/list-products' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/n-orders' },
    { text: 'All Users', icon: <PeopleIcon />, path: '/all-users' },
  ];

  return (
    <Box>
      {isMobile && (
        <AppBar position="sticky" sx={{ backgroundColor: '#FF8C42' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Kitchen</Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        sx={{
          width: 200,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 200,
            boxSizing: 'border-box',
            background: 'linear-gradient(to bottom, #FF8C42, #E86A33)',
            color: 'white',
          },
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,  
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          padding: '16px 8px',
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}>
          <Avatar 
            sx={{ 
              bgcolor: '#fff', 
              color: '#FF8C42',
              width: 56,
              height: 56, 
              mb: 1,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <BusinessCenterIcon sx={{ fontSize: 32 }} />
          </Avatar>
          
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            fontSize: '1rem',
            textAlign: 'center'
          }}>
            Kitchen Management
          </Typography>
          
          <Chip 
            label={loading ? "Loading..." : "Kitchen"} 
            variant="outlined" 
            size="small"
            sx={{ 
              color: '#fff', 
              borderColor: 'rgba(255,255,255,0.5)', 
              mt: 1,
              fontSize: '0.75rem',
              '& .MuiChip-label': {
                fontWeight: 500
              }
            }} 
          />
        </Box>

        <Box sx={{ overflow: 'auto', overflowX: 'hidden', mt: 1 }}>
          <List>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.text}>
                <ListItem 
                  button 
                  component={Link} 
                  to={item.path}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    },
                    borderRadius: '4px',
                    mx: 0.5,
                    mb: 0.25,
                    py: 1,
                    px: 1.5
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: '#fff',
                    minWidth: '36px'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '0.875rem'
                    }}
                  />
                </ListItem>
                {index < menuItems.length - 1 && (
                  <Divider sx={{ 
                    my: 0.25,
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    mx: 1
                  }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 'auto', p: 1 }}>
          <ListItem 
            button 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            sx={{
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.2)',
              },
              py: 1,
              px: 1.5
            }}
          >
            <ListItemIcon sx={{ 
              color: '#fff',
              minWidth: '36px'
            }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '0.875rem'
              }}
            />
          </ListItem>
        </Box>
      </Drawer>

      <Box sx={{ marginLeft: isMobile ? 0 : 200, transition: 'margin 0.3s' }}>
        {/* Main content area */}
      </Box>
    </Box>
  );
};

export default Sidebar;