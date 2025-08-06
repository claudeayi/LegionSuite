import React from 'react';
import { 
  Box, Grid, Typography, Paper, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useApi } from '../../../core/hooks/useApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportsDashboard = () => {
  const api = useApi();
  const [timeframe, setTimeframe] = React.useState('month');
  const [metrics, setMetrics] = React.useState({
    dealsByStage: [],
    revenueTrend: [],
    activityTypes: [],
    leadSources: []
  });

  React.useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await api.get(`/crm/metrics?timeframe=${timeframe}`);
        setMetrics(response.data);
      } catch (error) {
        console.error('Error loading metrics:', error);
      }
    };
    
    loadMetrics();
  }, [timeframe]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Tableau de Bord CRM</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Période</InputLabel>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            label="Période"
          >
            <MenuItem value="week">7 derniers jours</MenuItem>
            <MenuItem value="month">Ce mois</MenuItem>
            <MenuItem value="quarter">Ce trimestre</MenuItem>
            <MenuItem value="year">Cette année</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Pipeline par étape */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Transactions par Étape
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={metrics.dealsByStage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Nombre" />
                <Bar dataKey="value" fill="#82ca9d" name="Valeur (€)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Répartition des activités */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Types d'Activités
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={metrics.activityTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {metrics.activityTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Tendance de revenu */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Tendance de Revenu
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={metrics.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="closed" fill="#00C49F" name="Clôturé" />
                <Bar dataKey="expected" fill="#FFBB28" name="Projeté" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sources de prospects */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Sources de Prospects
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={metrics.leadSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="source"
                  label
                >
                  {metrics.leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsDashboard;