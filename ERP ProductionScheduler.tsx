import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Button, 
  FormControl, InputLabel, Select, MenuItem, 
  TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { Add, Today, Schedule } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import ERPService from '../../services/erpApi';

const ProductionScheduler = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000),
    status: 'planned'
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        ERPService.getProductionOrders(),
        ERPService.getProducts()
      ]);
      setOrders(ordersRes);
      setProducts(productsRes);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ERPService.createProductionOrder(formData);
      setOrders([...orders, response]);
      setFormData({
        productId: '',
        quantity: 1,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        status: 'planned'
      });
    } catch (error) {
      console.error('Erreur création commande:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planned': return 'primary';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Planification de Production
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nouvelle Commande
            </Typography>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Produit</InputLabel>
                <Select
                  value={formData.productId}
                  onChange={e => setFormData({...formData, productId: e.target.value})}
                  label="Produit"
                  required
                >
                  {products.map(product => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Quantité"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                required
                inputProps={{ min: 1 }}
              />

              <DatePicker
                label="Date de Début"
                value={formData.startDate}
                onChange={date => setFormData({...formData, startDate: date})}
                sx={{ mb: 2, width: '100%' }}
              />

              <DatePicker
                label="Date de Fin"
                value={formData.endDate}
                onChange={date => setFormData({...formData, endDate: date})}
                sx={{ mb: 2, width: '100%' }}
              />

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                startIcon={<Add />}
              >
                Planifier Production
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Commandes en Cours
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Début</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {products.find(p => p.id === order.productId)?.name || 'N/A'}
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{new Date(order.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={
                            order.status === 'planned' ? 'Planifiée' : 
                            order.status === 'in_progress' ? 'En cours' : 
                            order.status === 'completed' ? 'Terminée' : 'Annulée'
                          }
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductionScheduler;