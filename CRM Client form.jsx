import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  TextField, Button, Box, Grid, Typography, Paper, 
  FormControl, InputLabel, Select, MenuItem, Autocomplete
} from '@mui/material';
import { useApi } from '../../../core/hooks/useApi';
import { Tag } from '../types/crmTypes';

interface ClientFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

const ClientForm = ({ initialData, onSuccess }: ClientFormProps) => {
  const api = useApi();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      company: '',
      industry: '',
      status: 'lead',
      tags: [],
      address: '',
      notes: ''
    }
  });

  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: 'VIP' },
    { id: 2, name: 'Partenaire' },
    { id: 3, name: 'Potentiel élevé' }
  ]);

  const onSubmit = async (data: any) => {
    try {
      if (initialData) {
        await api.put(`/crm/clients/${initialData.id}`, data);
      } else {
        await api.post('/crm/clients', data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Modifier Client' : 'Nouveau Client'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Nom requis' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom Complet"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message as string}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Entreprise" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="email"
              control={control}
              rules={{ 
                required: 'Email requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message as string}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Téléphone" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Statut">
                    <MenuItem value="lead">Prospect</MenuItem>
                    <MenuItem value="active">Actif</MenuItem>
                    <MenuItem value="inactive">Inactif</MenuItem>
                    <MenuItem value="former">Ancien client</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Industrie</InputLabel>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Industrie">
                    <MenuItem value="technology">Technologie</MenuItem>
                    <MenuItem value="finance">Finance</MenuItem>
                    <MenuItem value="healthcare">Santé</MenuItem>
                    <MenuItem value="retail">Commerce de détail</MenuItem>
                    <MenuItem value="education">Éducation</MenuItem>
                    <MenuItem value="other">Autre</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={tags}
                  getOptionLabel={(option) => option.name}
                  value={field.value}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" placeholder="Ajouter un tag" />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Adresse" fullWidth multiline rows={2} />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField 
                  {...field} 
                  label="Notes" 
                  fullWidth 
                  multiline 
                  rows={4} 
                  placeholder="Notes sur le client..." 
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined">Annuler</Button>
              <Button type="submit" variant="contained">
                {initialData ? 'Mettre à jour' : 'Créer Client'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ClientForm;