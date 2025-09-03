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
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// Eliminado: import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import Badge from '@mui/material/Badge';

const initialInstances: any[] = [];

const InstancesPage = () => {
  const [instances, setInstances] = React.useState(initialInstances);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newInstance, setNewInstance] = React.useState({
    name: '',
    phoneNumber: '',
    deepSync: false,
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

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
            {/**/}
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Agregar nueva instancia</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre de la instancia"
            type="text"
            fullWidth
            variant="outlined"
            value={newInstance.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phoneNumber"
            label="Número de teléfono"
            type="tel"
            fullWidth
            variant="outlined"
            value={newInstance.phoneNumber}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Switch
                name="deepSync"
                checked={newInstance.deepSync}
                onChange={handleInputChange}
              />
            }
            label="Sincronizar WhatsApp profundamente"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleAddInstance} variant="contained" sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}>
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstancesPage;