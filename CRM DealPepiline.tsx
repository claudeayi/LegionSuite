import React from 'react';
import { 
  Box, Typography, Button, Grid, Paper,
  useTheme, useMediaQuery
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Add } from '@mui/icons-material';
import DealCard from './DealCard';
import DealStageHeader from './DealStageHeader';
import { useCrmContext } from '../../context/CrmContext';
import CrmService from '../../services/crmApi';
import { Deal } from '../../types/crmTypes';

const STAGES = [
  { id: 'prospect', title: 'Prospects' },
  { id: 'qualification', title: 'Qualification' },
  { id: 'proposition', title: 'Proposition' },
  { id: 'negociation', title: 'Négociation' },
  { id: 'cloture', title: 'Clôture' }
];

const DealPipeline = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { deals, refreshDeals } = useCrmContext();
  const [openForm, setOpenForm] = React.useState(false);
  const [selectedDeal, setSelectedDeal] = React.useState<Deal | null>(null);

  const dealsByStage = STAGES.map(stage => ({
    ...stage,
    deals: deals.filter(deal => deal.stage === stage.id)
  }));

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const sourceStage = result.source.droppableId;
    const destinationStage = result.destination.droppableId;
    const dealId = result.draggableId;
    
    if (sourceStage === destinationStage) return;
    
    try {
      await CrmService.updateDealStage(dealId, destinationStage);
      refreshDeals();
    } catch (error) {
      console.error('Error updating deal stage:', error);
    }
  };

  const handleCreateDeal = () => {
    setSelectedDeal(null);
    setOpenForm(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setOpenForm(true);
  };

  const handleSaveDeal = () => {
    setOpenForm(false);
    refreshDeals();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Pipeline des Transactions</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCreateDeal}
        >
          Nouvelle Transaction
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2} sx={{ overflowX: 'auto', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
          {dealsByStage.map((stage) => (
            <Grid item key={stage.id} xs={12} md={2.4} minWidth={300}>
              <Droppable droppableId={stage.id}>
                {(provided) => (
                  <Paper 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ 
                      p: 2, 
                      height: '80vh', 
                      display: 'flex', 
                      flexDirection: 'column',
                      bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100'
                    }}
                  >
                    <DealStageHeader 
                      title={stage.title} 
                      count={stage.deals.length} 
                    />
                    
                    <Box sx={{ overflowY: 'auto', flex: 1, mt: 2 }}>
                      {stage.deals.map((deal, index) => (
                        <Draggable 
                          key={deal.id} 
                          draggableId={deal.id} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <DealCard 
                                deal={deal} 
                                onEdit={handleEditDeal}
                                sx={{ mb: 2 }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  </Paper>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      {openForm && (
        <DealForm 
          deal={selectedDeal} 
          onClose={() => setOpenForm(false)}
          onSave={handleSaveDeal}
        />
      )}
    </Box>
  );
};

// Composant DealForm serait dans un fichier séparé
const DealForm = ({ deal, onClose, onSave }) => (
  <div>Formulaire de transaction</div>
);

export default DealPipeline;