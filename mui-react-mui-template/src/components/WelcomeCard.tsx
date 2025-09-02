import { Box, Button, Typography, Grid } from "@mui/material";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import { useNavigate } from "react-router-dom";
import heroBanner from "../images/hero_banner.png"; // 👈 Importamos la imagen

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

      {/* Columna derecha: imagen hero_banner */}
      <Grid item xs={12} md={5}>
        <Box
          component="img"
          src={heroBanner}
          alt="Hero Banner"
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 4,
            boxShadow: "0 12px 32px rgba(0,0,0,.15)",
          }}
        />
      </Grid>
    </Grid>
  );
}
