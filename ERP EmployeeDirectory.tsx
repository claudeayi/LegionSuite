import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Avatar, IconButton, 
  InputAdornment, Button
} from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import EmployeeForm from './EmployeeForm';
import ERPService from '../../services/erpApi';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const fetchEmployees = async () => {
      const data = await ERPService.getEmployees();
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setOpenForm(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpenForm(true);
  };

  const handleSaveEmployee = () => {
    setOpenForm(false);
    const fetchEmployees = async () => {
      const data = await ERPService.getEmployees();
      setEmployees(data);
    };
    fetchEmployees();
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Annuaire des Employés</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCreateEmployee}
        >
          Nouvel Employé
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher employés..."
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
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Poste</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map(employee => (
              <TableRow key={employee.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={employee.photo} sx={{ mr: 2 }} />
                    {employee.name}
                  </Box>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditEmployee(employee)}>
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

      <EmployeeForm 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
      />
    </Box>
  );
};

export default EmployeeDirectory;