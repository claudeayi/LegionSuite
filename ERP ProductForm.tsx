import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Product } from '../../types/erpTypes';
import ErpService from '../../services/erpApi';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = React.useState<Partial<Product>>({
    sku: '',
    name: '',
    description: '',
    category: '',
    unitPrice: 0,
    costPrice: 0,
    quantity: 0,
    minStock: 0,
    supplier: ''
  });

  React.useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async () => {
    try {
      let savedProduct;
      
      if (formData.id) {
        savedProduct = await ErpService.updateProduct(formData.id, formData);
      } else {
        savedProduct = await ErpService.createProduct(formData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      onSave(savedProduct);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>
        {formData.id ? 'Modifier Produit' : 'Créer un Nouveau Produit'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SKU"
              name="sku"
              value={formData.sku || ''}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                name="category"
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                label="Catégorie"
                required
              >
                <MenuItem value="electronics">Électronique</MenuItem>
                <MenuItem value="clothing">Vêtements</MenuItem>
                <MenuItem value="furniture">Meubles</MenuItem>
                <MenuItem value="food">Alimentation</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fournisseur"
              name="supplier"
              value={formData.supplier || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Prix de vente (€)"
              name="unitPrice"
              type="number"
              value={formData.unitPrice || 0}
              onChange={handleNumberChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Coût de revient (€)"
              name="costPrice"
              type="number"
              value={formData.costPrice || 0}
              onChange={handleNumberChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Quantité en stock"
              name="quantity"
              type="number"
              value={formData.quantity || 0}
              onChange={handleNumberChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Stock minimum"
              name="minStock"
              type="number"
              value={formData.minStock || 0}
              onChange={handleNumberChange}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!formData.sku || !formData.name || !formData.category}
        >
          {formData.id ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;