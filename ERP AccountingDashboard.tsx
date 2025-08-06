import React, { useState } from 'react';
import { 
  Box, Grid, Typography, Paper, Tabs, Tab, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination
} from '@mui/material';
import { 
  AccountBalance, Receipt, Payment, TrendingUp 
} from '@mui/icons-material';
import ERPService from '../../services/erpApi';

const AccountingDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [financialData, setFinancialData] = useState({
    balance: 0,
    revenue: 0,
    expenses: 0,
    profit: 0,
    transactions: [],
    accounts: []
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await ERPService.getFinancialData();
      setFinancialData(data);
    };
    fetchData();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Overview
        return (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <AccountBalance fontSize="large" color="primary" />
                <Typography variant="h6">Solde</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {financialData.balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <TrendingUp fontSize="large" color="success" />
                <Typography variant="h6">Revenus</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {financialData.revenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Payment fontSize="large" color="error" />
                <Typography variant="h6">Dépenses</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {financialData.expenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Receipt fontSize="large" color="warning" />
                <Typography variant="h6">Profit</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: financialData.profit >= 0 ? 'success.main' : 'error.main' }}>
                  {financialData.profit.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );
      case 1: // Transactions
        return (
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Compte</TableCell>
                    <TableCell align="right">Débit</TableCell>
                    <TableCell align="right">Crédit</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {financialData.transactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.account}</TableCell>
                        <TableCell align="right">
                          {transaction.type === 'debit' ? 
                            transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : ''}
                        </TableCell>
                        <TableCell align="right">
                          {transaction.type === 'credit' ? 
                            transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : ''}
                        </TableCell>
                        <TableCell>
                          <Box component="span" sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: transaction.status === 'paid' ? 'success.light' : 
                                     transaction.status === 'pending' ? 'warning.light' : 'error.light',
                            color: 'common.white'
                          }}>
                            {transaction.status === 'paid' ? 'Payé' : 
                             transaction.status === 'pending' ? 'En attente' : 'Rejeté'}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={financialData.transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        );
      case 2: // Accounts
        return (
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom du Compte</TableCell>
                    <TableCell>Numéro</TableCell>
                    <TableCell align="right">Solde</TableCell>
                    <TableCell>Devise</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {financialData.accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.number}</TableCell>
                      <TableCell align="right">
                        {account.balance.toLocaleString('fr-FR', { style: 'currency', currency: account.currency })}
                      </TableCell>
                      <TableCell>{account.currency}</TableCell>
                      <TableCell>{account.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Tableau de Bord Comptable
      </Typography>
      
      <Tabs value={tabValue} onChange={handleChangeTab} sx={{ mb: 2 }}>
        <Tab label="Aperçu" />
        <Tab label="Transactions" />
        <Tab label="Comptes" />
        <Tab label="Rapports" />
      </Tabs>
      
      {renderTabContent()}
    </Box>
  );
};

export default AccountingDashboard;