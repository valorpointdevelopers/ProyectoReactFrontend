import { Box, Button, Typography, Grid, Paper } from "@mui/material";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import { useNavigate } from "react-router-dom";



export default function WelcomeCard() {
    const navigate = useNavigate();
  return (
    <Grid
      container
      spacing={{ xs: 4, md: 8 }}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "85vh", // más alto
        px: { xs: 3, md: 8 }, // padding lateral más grande
      }}
    >
      {/* Columna izquierda: texto */}
      <Grid item xs={12} md={7}>
        <Box sx={{ mb: 3, opacity: 0.8 }}>
          <WifiRoundedIcon fontSize="large" />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            lineHeight: 1.1,
            fontSize: { xs: 40, sm: 52, md: 64 }, // más grande
            letterSpacing: -0.5,
            mb: 2,
          }}
        >
          Haz crecer tu negocio con Whatsvaa
        </Typography>

        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600 }}
        >
          Bienvenido a Whatsvaa, la plataforma que impulsa tu crecimiento 🚀
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: 999, px: 4, py: 1.5, fontWeight: 700 }}
            onClick={() => navigate("/login")} 

          >
            COMENZAR
          </Button>

          <Button
            variant="text"
            size="large"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Reservar una demostración →
          </Button>
        </Box>
      </Grid>

      {/* Columna derecha: card degradado */}
      <Grid item xs={12} md={5}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            height: { xs: 300, md: 400 }, // más grande
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          }}
        >
          {/* Decoraciones */}
          <Box
            sx={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              top: -80,
              right: -80,
              opacity: 0.2,
              background: "radial-gradient(circle, white, transparent 60%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 240,
              height: 240,
              borderRadius: "50%",
              bottom: -70,
              left: -50,
              opacity: 0.15,
              background: "radial-gradient(circle, white, transparent 60%)",
            }}
          />

          {/* Contenido */}
          <Box sx={{ textAlign: "center", color: "white" }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: "#00C853",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 800,
                mx: "auto",
                mb: 2,
                boxShadow: "0 16px 40px rgba(0,0,0,.25)",
              }}
            >
              W
            </Box>
            <Typography sx={{ fontSize: 26, fontStyle: "italic", opacity: 0.9 }}>
              Whatsvaa CRM
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
