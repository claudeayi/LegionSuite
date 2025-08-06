import React from 'react';
import { 
  Box, Typography, List, ListItem, ListItemText, 
  ListItemAvatar, Avatar, Divider, Chip, Paper
} from '@mui/material';
import { 
  Email, Phone, MeetingRoom, Task, Note, Event 
} from '@mui/icons-material';
import { useApi } from '../../../core/hooks/useApi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ActivityTimeline = ({ clientId }: { clientId?: string }) => {
  const api = useApi();
  const [activities, setActivities] = React.useState([]);

  React.useEffect(() => {
    const url = clientId 
      ? `/crm/activities?clientId=${clientId}` 
      : '/crm/activities';
    
    api.get(url)
      .then(response => setActivities(response.data))
      .catch(error => console.error('Error loading activities:', error));
  }, [clientId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Email color="primary" />;
      case 'call': return <Phone color="primary" />;
      case 'meeting': return <MeetingRoom color="primary" />;
      case 'task': return <Task color="primary" />;
      case 'note': return <Note color="primary" />;
      case 'event': return <Event color="primary" />;
      default: return <Event color="primary" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'email': return 'primary';
      case 'call': return 'secondary';
      case 'meeting': return 'success';
      case 'task': return 'warning';
      case 'note': return 'info';
      case 'event': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chronologie des Activités
      </Typography>
      
      {activities.length === 0 ? (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
          Aucune activité enregistrée
        </Typography>
      ) : (
        <List sx={{ maxHeight: 500, overflow: 'auto' }}>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent' }}>
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1">
                        {activity.subject}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {format(new Date(activity.date), 'dd MMM yyyy HH:mm', { locale: fr })}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="text.primary">
                        {activity.description}
                      </Typography>
                      {activity.relatedTo && (
                        <Typography variant="caption">
                          Lié à: {activity.relatedTo.name}
                        </Typography>
                      )}
                      <Box sx={{ mt: 1 }}>
                        {activity.tags?.map(tag => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            sx={{ mr: 0.5, mt: 0.5 }} 
                            color={getActivityColor(activity.type)}
                          />
                        ))}
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ActivityTimeline;