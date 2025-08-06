import React, { useState } from 'react';
import { 
  Box, Typography, Button, Grid, Paper, 
  TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, 
  TablePagination, IconButton, Tooltip
} from '@mui/material';
import { Add, Search, Edit, Delete, Inventory } from '@mui/icons-material';
import ProductForm from './ProductForm';
import ERPService from '../../services/erpApi';

const InventoryManager = () => {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  React.useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await ERPService.getInventory();
    setProducts(data);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setOpenForm(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleSaveProduct = () => {
    setOpenForm(false);
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      await ERPService.deleteProduct(id);
      loadProducts();
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Inventory sx={{ mr: 1 }} /> Gestion des Stocks
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCreateProduct}
        >
          Nouveau Produit
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined">Filtres</Button>
            <Button variant="outlined">Exporter</Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Stock min.</TableCell>
              <TableCell align="right">Coût unitaire</TableCell>
              <TableCell align="right">Prix</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right" sx={{ 
                    color: product.quantity <= product.minStock ? 'error.main' : 'inherit',
                    fontWeight: product.quantity <= product.minStock ? 'bold' : 'normal'
                  }}>
                    {product.quantity} {product.unit}
                  </TableCell>
                  <TableCell align="right">{product.minStock} {product.unit}</TableCell>
                  <TableCell align="right">
                    {product.cost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </TableCell>
                  <TableCell align="right">
                    {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Modifier">
                      <IconButton onClick={() => handleEditProduct(product)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton onClick={() => handleDeleteProduct(product.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <ProductForm 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </Box>
  );
};

export default InventoryManager;