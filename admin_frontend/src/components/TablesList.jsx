import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Table as MuiTable,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

const TablesList = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/get_tables');
        if (!response.ok) {
          throw new Error('Failed to fetch tables');
        }
        const data = await response.json();
        if (data.success) {
          // Sort tables by table_id
          const sortedTables = data.tables.sort((a, b) => a.table_id - b.table_id);
          setTables(sortedTables);
        } else {
          throw new Error('API request was not successful');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  }));

  const TableStatusChip = ({ status }) => {
    let color = 'default';
    if (status === 'available') color = 'success';
    if (status === 'occupied') color = 'error';
    if (status === 'reserved') color = 'warning';

    return (
      <Chip 
        label={status.toUpperCase()} 
        color={color} 
        size="small" 
        variant="outlined" 
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Restaurant Tables
      </Typography>

      {/* Grid View for larger screens */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
        <Grid container spacing={3}>
          {tables.map((table) => (
            <Grid item key={table.table_id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {table.primary_image_name ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:4000/images/${table.primary_image_name.replace(/\\/g, '/')}`}
                    alt={`Table ${table.table_number}`}
                  />
                ) : (
                  <Box sx={{ 
                    height: 140, 
                    bgcolor: 'grey.200', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      No Image
                    </Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    Table {table.table_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {table.table_type} • Capacity: {table.capacity}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {table.description || 'No description'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TableStatusChip status={table.status} />
                    
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Table View for smaller screens */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <TableContainer component={Paper}>
          <MuiTable sx={{ minWidth: 650 }} aria-label="tables list">
            <TableHead>
              <TableRow>
                <TableCell>Table</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Capacity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((table) => (
                <StyledTableRow key={table.table_id}>
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     {table.primary_image_name && (
                <img 
                  src={`http://localhost:4000/images/${table.primary_image_name.replace(/\\/g, '/')}`} 
                  alt={`Table ${table.table_number}`}
                  className="table-image"
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide broken images
                  }}
                />
              )}
                      {table.table_number}
                    </Box>
                  </TableCell>
                  <TableCell>{table.table_type}</TableCell>
                  <TableCell align="right">{table.capacity}</TableCell>
                  <TableCell>
                    <TableStatusChip status={table.status} />
                  </TableCell>
                  <TableCell>
                    <Button size="small">View</Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </Box>
    </div>
  );
};

export default TablesList;