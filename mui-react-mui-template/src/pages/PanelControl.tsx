import * as React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import QrWhatsapp from "./QrWhatsapp";

const PanelControl: React.FC = () => {
  const theme = useTheme();
  const [openQR, setOpenQR] = React.useState(true); // 👈 aparece por defecto al entrar

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        p: 4, 
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Panel de Control
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {/* QR que aparece automáticamente */}
      <QrWhatsapp open={openQR} onClose={() => setOpenQR(false)} />

      <Grid container spacing={4}>
        {/* Sección de Resumen */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumen General
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Total de Chats</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>0</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Total de Contactos</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>0</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Chats Abiertos</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>0</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Sección de Actividad */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Actividad de Chats
            </Typography>
            <Box 
              sx={{ 
                height: 300, 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[800],
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Gráfica de Actividad (Sin Datos)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PanelControl;
