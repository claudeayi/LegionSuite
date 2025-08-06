import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Box, Paper, Typography, Card, CardContent, IconButton, 
  Tooltip, Button, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import { Add, Edit, Delete, BarChart } from '@mui/icons-material';
import { useApi } from '../../../core/hooks/useApi';
import DealForm from './DealForm';

const DealPipeline = () => {
  const api = useApi();
  const [stages, setStages] = useState([
    { id: 'prospect', title: 'Prospects', deals: [] },
    { id: 'qualification', title: 'Qualification', deals: [] },
    { id: 'proposition', title: 'Proposition', deals: [] },
    { id: 'negociation', title: 'Négociation', deals: [] },
    { id: 'cloture', title: 'Clôture', deals: [] }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);

  // Charger les deals depuis l'API
  const loadDeals = async () => {
    try {
      const response = await api.get('/crm/deals');
      const deals = response.data;
      
      const updatedStages = stages.map(stage => ({
        ...stage,
        deals: deals.filter(deal => deal.stage === stage.id)
      }));
      
      setStages(updatedStages);
    } catch (error) {
      console.error('Error loading deals:', error);
    }
  };

  React.useEffect(() => {
    loadDeals();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceStage = stages.find(stage => stage.id === result.source.droppableId);
    const destStage = stages.find(stage => stage.id === result.destination.droppableId);
    const movedDeal = sourceStage.deals[result.source.index];
    
    // Mettre à jour le deal via l'API
    api.put(`/crm/deals/${movedDeal.id}`, { stage: destStage.id })
      .then(() => {
        const newStages = stages.map(stage => {
          if (stage.id === sourceStage.id) {
            return {
              ...stage,
              deals: stage.deals.filter((_, idx) => idx !== result.source.index)
            };
          }
          if (stage.id === destStage.id) {
            const newDeals = [...stage.deals];
            newDeals.splice(result.destination.index, 0, {
              ...movedDeal,
              stage: destStage.id
            });
            return { ...stage, deals: newDeals };
          }
          return stage;
        });
        setStages(newStages);
      });
  };

  const handleEditDeal = (deal) => {
    setCurrentDeal(deal);
    setOpenDialog(true);
  };

  const handleCreateDeal = () => {
    setCurrentDeal(null);
    setOpenDialog(true);
  };

  const handleSaveDeal = (dealData) => {
    const promise = currentDeal 
      ? api.put(`/crm/deals/${currentDeal.id}`, dealData)
      : api.post('/crm/deals', dealData);
    
    promise.then(() => {
      loadDeals();
      setOpenDialog(false);
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Pipeline des Transactions
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCreateDeal}
        >
          Nouvelle Transaction
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', overflowX: 'auto', p: 1, gap: 2, minHeight: '70vh' }}>
          {stages.map((stage) => (
            <Droppable key={stage.id} droppableId={stage.id}>
              {(provided) => (
                <Paper 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  sx={{ minWidth: 320, p: 2, bgcolor: 'background.paper' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      {stage.title} <small>({stage.deals.length})</small>
                    </Typography>
                    <Tooltip title="Statistiques de l'étape">
                      <IconButton size="small">
                        <BarChart fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  {stage.deals.map((deal, index) => (
                    <Draggable key={deal.id} draggableId={deal.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ mb: 2, cursor: 'grab', borderLeft: '4px solid', 
                                borderColor: deal.priority === 'high' ? 'error.main' : 
                                            deal.priority === 'medium' ? 'warning.main' : 'success.main' }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle1">{deal.name}</Typography>
                              <Box>
                                <Tooltip title="Modifier">
                                  <IconButton size="small" onClick={() => handleEditDeal(deal)}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                  <IconButton size="small">
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {deal.company}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="body2">
                                <strong>{deal.value.toLocaleString()} €</strong>
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(deal.expectedClose).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentDeal ? 'Modifier la Transaction' : 'Créer une Nouvelle Transaction'}
        </DialogTitle>
        <DialogContent>
          <DealForm 
            initialData={currentDeal} 
            onSuccess={handleSaveDeal} 
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DealPipeline;