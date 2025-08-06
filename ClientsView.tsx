import React, { useState } from 'react';
import { 
  Box, Typography, Button, Grid, Paper, 
  TextField, InputAdornment, IconButton
} from '@mui/material';
import { Add, Search, FilterList, ImportExport } from '@mui/icons-material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import ClientForm from '../components/ClientForm';
import CRMService from '../services/crmApi';
import { useApi } from '../../../core/hooks/useApi';

const ClientsView = () => {
  const api = useApi();
  const [clients, setClients] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nom', width: 200 },
    { field: 'company', headerName: 'Entreprise', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Téléphone', width: 150 },
    { 
      field: 'status', 
      headerName: 'Statut', 
      width: 150,
      renderCell: (params) => (
        <Box sx={{ 
          px: 1, 
          py: 0.5, 
          borderRadius: 1,
          bgcolor: params.value === 'active' ? 'success.light' : 
                   params.value === 'lead' ? 'info.light' : 
                   params.value === 'inactive' ? 'warning.light' : 'grey.200',
          color: 'common.white',
          fontWeight: 'bold'
        }}>
          {params.value === 'active' ? 'Actif' : 
           params.value === 'lead' ? 'Prospect' : 
           params.value === 'inactive' ? 'Inactif' : 'Ancien'}
        </Box>
      )
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button 
            size="small" 
            onClick={() => handleEditClient(params.row)}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
        </Box>
      )
    }
  ];

  React.useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await CRMService.getClients({ search: searchTerm });
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleCreateClient = () => {
    setSelectedClient(null);
    setOpenForm(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setOpenForm(true);
  };

  const handleSaveClient = () => {
    setOpenForm(false);
    loadClients();
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Clients</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCreateClient}
        >
          Nouveau Client
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher clients..."
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
            <Button startIcon={<FilterList />}>Filtres</Button>
            <Button startIcon={<ImportExport />}>Exporter</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 600, p: 1 }}>
        <DataGrid
          rows={filteredClients}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Paper>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedClient ? 'Modifier Client' : 'Nouveau Client'}
        </DialogTitle>
        <DialogContent>
          <ClientForm 
            initialData={selectedClient} 
            onSuccess={handleSaveClient} 
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ClientsView;