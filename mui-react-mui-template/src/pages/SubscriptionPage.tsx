import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import Badge from '@mui/material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import { NavLink } from 'react-router-dom'; // Importar NavLink si usas react-router-dom

const initialInstances: any[] = [];

const InstancesPage = () => {
  const [instances, setInstances] = React.useState(initialInstances);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSubscription, setOpenSubscription] = React.useState(false);
  const [newInstance, setNewInstance] = React.useState({
    name: '',
    phoneNumber: '',
    deepSync: false,
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleOpenSubscription = () => setOpenSubscription(true);
  const handleCloseSubscription = () => setOpenSubscription(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setNewInstance((prev) => ({
      ...prev,
      [name]: name === 'deepSync' ? checked : value,
    }));
  };

  const handleAddInstance = () => {
    if (newInstance.name && newInstance.phoneNumber) {
      const newId = instances.length > 0 ? instances.length + 1 : 1;
      
      const newInstanceData = {
        id: `inst_${newId}`,
        name: newInstance.name,
        isAvailable: false,
        phoneNumber: newInstance.phoneNumber,
        deepSync: newInstance.deepSync,
      };
      
      setInstances((prev) => [...prev, newInstanceData]);
      setNewInstance({ name: '', phoneNumber: '', deepSync: false });
      handleCloseDialog();
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert(`ID "${id}" copiado al portapapeles.`);
  };

  const handleDeleteInstance = (id: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la instancia con ID: ${id}?`)) {
      setInstances((prev) => prev.filter((inst) => inst.id !== id));
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Botón de ejemplo para abrir el modal */}
      <Button onClick={handleOpenSubscription}>Suscripción</Button>

      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: (theme) => theme.palette.background.default,
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Instancias de administrador
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleOpenDialog}
              sx={{
                bgcolor: '#000',
                color: '#fff',
                '&:hover': { bgcolor: '#333' },
                borderRadius: '8px',
                mr: 2,
              }}
            >
              Agregar instancia
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {instances.map((instance) => (
          <Grid item xs={12} key={instance.id}>
            <Paper elevation={3} sx={{
              p: 3,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge
                  color={instance.isAvailable ? "success" : "error"}
                  variant="dot"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  overlap="circular"
                >
                  <WhatsAppIcon sx={{ fontSize: 48, color: '#25D366' }} />
                </Badge>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {instance.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={instance.isAvailable ? 'disponible' : 'no disponible'}
                      size="small"
                      sx={{
                        bgcolor: instance.isAvailable ? '#e6ffe6' : '#f4f4f4',
                        color: instance.isAvailable ? '#1a6f1a' : '#666',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: { xs: 0, sm: 'auto' } }}>
                <Box sx={{ textAlign: 'right', mr: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 0.5 }} /> N/A
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    #{instance.phoneNumber}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleDeleteInstance(instance.id)}
                    sx={{ borderRadius: '8px' }}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleCopyId(instance.id)}
                    sx={{ borderRadius: '8px' }}
                  >
                    Copiar ID
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {instances.length === 0 && (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 5 }}>
          No hay instancias activas. Agrega una para comenzar.
        </Typography>
      )}

      {/* Aquí es donde se muestra el modal de suscripción */}
      <Dialog open={openSubscription} onClose={handleCloseSubscription} PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseSubscription}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <StarIcon sx={{ color: '#FFD700' }} />
            <Typography variant="h6" fontWeight="bold">
              Suscripción
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
              Te has suscrito a Trial
            </Typography>
            <List sx={{ width: '100%' }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#25D366' }} />
                </ListItemIcon>
                <ListItemText primary="Calentador de WhatsApp" />
                <Typography variant="body2" sx={{ ml: 'auto' }}>✅</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WhatsAppIcon sx={{ color: '#25D366' }} />
                </ListItemIcon>
                <ListItemText primary="Instancias de WhatsApp" />
                <Typography variant="body2" sx={{ ml: 'auto' }}>99</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#25D366' }} />
                </ListItemIcon>
                <ListItemText primary="API de Acceso" />
                <Typography variant="body2" sx={{ ml: 'auto' }}>✅</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#25D366' }} />
                </ListItemIcon>
                <ListItemText primary="Chatbot" />
                <Typography variant="body2" sx={{ ml: 'auto' }}>✅</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#25D366' }} />
                </ListItemIcon>
                <ListItemText primary="Notas de chat" />
                <Typography variant="body2" sx={{ ml: 'auto' }}>✅</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#25D366' }} />
                </ListItemIcon>
                <ListItemText primary="Etiquetas de chat" />
                <Typography variant="body2" sx={{ ml: 'auto' }}>✅</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#25D366' }} />
                </ListItemIcon>
                <ListItemText primary="Límite de agenda telefónica" />
                <Typography variant="body2" sx={{ ml: 'auto' }}>999</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#25D366' }} />
                </ListItemIcon>
                <ListItemText primary="Días restantes del plan" />
                <Typography variant="body2" sx={{ ml: 'auto' }}>en 2 días</Typography>
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button
            variant="contained"
            startIcon={<StarIcon />}
            sx={{
              bgcolor: '#000',
              color: '#fff',
              '&:hover': { bgcolor: '#333' },
              borderRadius: '8px',
              px: 3,
            }}
          >
            Ver todos los planes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstancesPage;