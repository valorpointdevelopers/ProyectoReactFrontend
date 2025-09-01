import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';

const StatsSection: React.FC = () => {
  return (
    <Box sx={{ mt: 6 }}>
      {/* Título de la sección */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 3,
          color: '#000',
          fontSize: '1.5rem'
        }}
      >
        Dashboard
      </Typography>

      {/* Grid de estadísticas */}
      <Grid container spacing={3}>
        {/* USUARIOS */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#666',
                fontSize: '0.9rem',
                mb: 1
              }}
            >
              USUARIOS
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: '#000',
                mb: 1
              }}
            >
              1,284
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#4caf50',
                fontSize: '0.8rem'
              }}
            >
              +12 hoy
            </Typography>
          </Paper>
        </Grid>

        {/* VENTAS */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#666',
                fontSize: '0.9rem',
                mb: 1
              }}
            >
              VENTAS
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: '#000',
                mb: 1
              }}
            >
              $23,900
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#4caf50',
                fontSize: '0.8rem'
              }}
            >
              +8% semanal
            </Typography>
          </Paper>
        </Grid>

        {/* TICKETS */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#666',
                fontSize: '0.9rem',
                mb: 1
              }}
            >
              TICKETS
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: '#000',
                mb: 1
              }}
            >
              73
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontSize: '0.8rem'
              }}
            >
              5 abiertos
            </Typography>
          </Paper>
        </Grid>

        {/* TASA DE ERROR */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#666',
                fontSize: '0.9rem',
                mb: 1
              }}
            >
              TASA DE ERROR
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: '#000',
                mb: 1
              }}
            >
              0.34%
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#f44336',
                fontSize: '0.8rem'
              }}
            >
              -0.02% vs ayer
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsSection;