import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Checkbox, FormControlLabel, Button, Container, Card } from '@mui/material';


const useQuery = () => {
  const { search } = useLocation();
  // Convierte "?plan=Everything" a { plan: "Everything" }
  return useMemo(() => new URLSearchParams(search), [search]);
};

const PaySubscription = () => {
  const query = useQuery();
  // Obtener el nombre del plan, si no existe, usa "Plan Desconocido"
  const planName = query.get('plan') || 'Plan Desconocido'; 

  // Estado para manejar las casillas de verificación
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Determinar si el botón debe estar habilitado
  const isButtonEnabled = acceptedPrivacy && acceptedTerms;

  const handleCheckout = () => {
    if (isButtonEnabled) {
      console.log(`Procediendo al pago del plan: ${planName}`);
      // Lógica de pago real aquí...
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
        textAlign: 'center', 
        paddingTop: '50px', 
        paddingBottom: '50px',
        minHeight: '80vh'
    }}>
      
      {/* ... (Ilustración Placeholder) ... */}
      
      {/* 3. Mensaje Principal - USAR EL NOMBRE DEL PLAN */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        Revisando para el Plan: <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{planName}</Box>
      </Typography>

      {/* 4. Descripción/Detalle del Plan */}
      <Card 
        variant="outlined" 
        sx={{ 
          margin: '20px auto 40px', 
          padding: '10px 20px', 
          width: 'fit-content', 
          backgroundColor: '#f9f9f9'
        }}
      >
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          this plan has everything
        </Typography>
      </Card>
      
      {/* ... (Resto del contenido) ... */}
      
      <Button 
        variant="contained" 
        color="primary" 
        size="large"
        disabled={!isButtonEnabled}
        onClick={handleCheckout}
        sx={{ width: '100%', maxWidth: '300px' }}
      >
        Proceder al Pago
      </Button>
      
    </Container>
  );
};

export default PaySubscription;