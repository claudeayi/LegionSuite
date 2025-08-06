import React from 'react';
import { 
  Card, CardContent, Typography, Box, 
  Chip, IconButton, useTheme
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Deal } from '../../types/crmTypes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
  sx?: any;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onEdit, sx }) => {
  const theme = useTheme();
  
  const getPriorityColor = () => {
    switch (deal.priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ 
      ...sx, 
      borderLeft: `4px solid ${theme.palette[getPriorityColor()].main}`,
      cursor: 'grab'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {deal.name}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => onEdit(deal)}>
              <Edit fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {deal.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Clôture prévue: 
          </Typography>
          <Typography variant="caption" fontWeight="bold" sx={{ ml: 1 }}>
            {format(new Date(deal.expectedClose), 'dd MMM yyyy', { locale: fr })}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
          <Chip 
            label={`${deal.probability}%`}
            size="small"
            color={deal.probability > 70 ? 'success' : deal.probability > 40 ? 'warning' : 'error'}
          />
          <Chip 
            label={deal.priority === 'high' ? 'Élevée' : deal.priority === 'medium' ? 'Moyenne' : 'Basse'}
            size="small"
            color={getPriorityColor()}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DealCard;