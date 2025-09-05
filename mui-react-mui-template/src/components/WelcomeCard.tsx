import { Box, Button, Typography, Grid } from "@mui/material";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import { useNavigate } from "react-router-dom";
import heroBanner from "../images/hero_banner.png";

export default function WelcomeCard() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, md: 8 },
        py: { xs: 4, md: 8 },
      }}
    >
      <Grid
        container
        spacing={{ xs: 4, md: 8 }}
        alignItems="center"
        justifyContent="center"
      >
        {/* Columna de texto */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            textAlign: { xs: "center", md: "left" },
            order: { xs: 2, md: 1 },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <WifiRoundedIcon fontSize="large" sx={{ opacity: 0.8 }} />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              fontSize: { xs: 32, sm: 44, md: 64 },
              letterSpacing: -0.5,
              mb: 2,
            }}
          >
            Haz crecer tu negocio con Whatsvaa
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, mx: { xs: "auto", md: 0 }, maxWidth: 520 }}
          >
            Bienvenido a Whatsvaa, la plataforma que impulsa tu crecimiento 🚀
          </Typography>

          {/* Botones */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column", // 🔹 siempre en columna
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-start" },
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              size="large"
              fullWidth={true}
              sx={{
                borderRadius: 999,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                maxWidth: { xs: "100%", sm: "auto" },
              }}
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

        {/* Columna de la imagen */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            order: { xs: 1, md: 2 },
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            src={heroBanner}
            alt="Hero Banner"
            sx={{
              width: { xs: "80%", sm: "70%", md: "100%" },
              maxWidth: 420,
              height: "auto",
              mx: "auto",
              borderRadius: 4,
              boxShadow: "0 12px 32px rgba(0,0,0,.15)",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
