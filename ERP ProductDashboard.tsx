import React from 'react';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { useErpContext } from '../../context/ErpContext';
import ProductionCalendar from '../../components/ProductionScheduler/ProductionCalendar';
import WorkOrderList from '../../components/ProductionScheduler/WorkOrderList';

const ProductionDashboard = () => {
  const { workOrders, loading, error } = useErpContext();
  const theme = useTheme();

  if (loading) return <Typography>Chargement des ordres de production...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord de Production
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 500 }}>
            <Typography variant="h6" gutterBottom>
              Calendrier de Production
            </Typography>
            <ProductionCalendar workOrders={workOrders} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 500 }}>
            <Typography variant="h6" gutterBottom>
              Ordres de Production Actifs
            </Typography>
            <WorkOrderList workOrders={workOrders.filter(wo => wo.status === 'in-progress')} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductionDashboard;