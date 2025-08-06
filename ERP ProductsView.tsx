import React, { useState } from 'react';
import { 
  Box, Typography, Button, Grid, Paper, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, TextField,
  IconButton
} from '@mui/material';
import { Add, Search, Edit, Delete } from '@mui/icons-material';
import { useErpContext } from '../../context/ErpContext';
import ProductForm from '../../components/ProductManager/ProductForm';

const ProductsView = () => {
  const { products, loading, error, refreshProducts } = useErpContext();
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

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
    refreshProducts();
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Typography>Chargement des produits...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Produits</Typography>
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
          <Grid item xs={12} md={6}>
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
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.unitPrice} €</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditProduct(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {openForm && (
        <ProductForm 
          product={selectedProduct} 
          onClose={() => setOpenForm(false)}
          onSave={handleSaveProduct}
        />
      )}
    </Box>
  );
};

export default ProductsView;