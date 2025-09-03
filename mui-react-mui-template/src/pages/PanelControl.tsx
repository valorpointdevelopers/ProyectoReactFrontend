import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import QrWhatsapp from "./QrWhatsapp"; // importa tu modal

const PanelControl: React.FC = () => {
  const theme = useTheme();
  const [openQR, setOpenQR] = useState(false); // estado para controlar el modal

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 4,

        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >

      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}
      >
        Panel de Control
      </Typography>
      <Divider sx={{ mb: 4, bgcolor: theme.palette.divider }} />

      {/* Botón para abrir el QR */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => setOpenQR(true)}
      >
        Abrir QR WhatsApp
      </Button>


      <Grid container spacing={4}>
        {/* Sección de Resumen */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Resumen General
            </Typography>
            <Divider sx={{ mb: 2, bgcolor: theme.palette.divider }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Total de Chats</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  0
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Total de Contactos</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  0
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Chats Abiertos</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  0
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Chats Pendientes</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  0
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Chats Resueltos</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  0
                </Typography>
           
      
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Sección de Actividad */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Actividad de Chats
            </Typography>
            <Box
              sx={{
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[800],
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[600]
                      : theme.palette.grey[400],
                }}
              >
    
                Gráfica de Actividad (Sin Datos)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Sección de Métricas Adicionales */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Métricas Adicionales
            </Typography>
            <Box
              sx={{
                height: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[800],
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[600]
                      : theme.palette.grey[400],
                }}
              >
                Gráfica de Flujos (Sin Datos)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Sección de Tarjetas de Información */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Información del Bot
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: theme.palette.divider,
                }}
              >
                <Typography>Total de Chatbots</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  0
                </Typography>
              </Paper>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: theme.palette.divider,
                }}
              >
                <Typography>Total de flujos de chatbot</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  0
                </Typography>
              </Paper>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: theme.palette.divider,
                }}
              >
                <Typography>Total de Campañas</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  0
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de QR */}
      <QrWhatsapp open={openQR} onClose={() => setOpenQR(false)} />
    </Box>
  );
};

export default PanelControl;
