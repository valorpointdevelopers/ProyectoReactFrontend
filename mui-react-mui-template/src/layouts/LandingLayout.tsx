import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Link as MUILink,
  Typography,
  Stack,
  IconButton,
  useTheme,
} from "@mui/material";
import RedeemIcon from "@mui/icons-material/Redeem";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import QrWhatsapp from "../pages/QrWhatsapp";

type Props = {
  children: React.ReactNode;
  onToggleTheme?: () => void;
  mode?: "light" | "dark";
};

export default function LandingLayout({ children, onToggleTheme, mode = "light" }: Props) {
  const theme = useTheme();
  const isLight = mode !== "dark";
  const location = useLocation();

  const [openQR, setOpenQR] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/panel/dashboard")) {
      setOpenQR(true);
    } else {
      setOpenQR(false);
    }
  }, [location]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: isLight ? "rgba(255,255,255,0.8)" : "rgba(18,18,18,0.8)",
          backdropFilter: "saturate(180%) blur(6px)",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 0, // 👈 elimina esquinas redondeadas
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 3 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Whatsvaa
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} sx={{ flexGrow: 1 }}>
            <MUILink component={RouterLink} to="#" underline="none" color="text.primary">
              Política de privacidad
            </MUILink>
            <MUILink component={RouterLink} to="#" underline="none" color="text.primary">
              Términos y condiciones
            </MUILink>
            <MUILink component={RouterLink} to="#" underline="none" color="text.primary">
              Contáctanos
            </MUILink>
          </Stack>

          {onToggleTheme && (
            <IconButton
              onClick={onToggleTheme}
              color="inherit"
              sx={{
                mr: 2,
                borderRadius: 1, // 👈 botón cuadrado suave, no ovalado
                backgroundColor: isLight ? theme.palette.grey[200] : theme.palette.grey[700],
                "&:hover": {
                  backgroundColor: isLight ? theme.palette.grey[300] : theme.palette.grey[600],
                },
              }}
            >
              {isLight ? <DarkModeIcon htmlColor="#000" /> : <LightModeIcon htmlColor="#fff" />}
            </IconButton>
          )}
          <Button
            component={RouterLink}
            to="/panel/dashboard"
            variant="contained"
            startIcon={<RedeemIcon />}
            sx={{
              borderRadius: 1, // 👈 sin bordes ovalados
              px: 2.5,
            }}
          >
            PANEL DE CONTROL
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ py: { xs: 6, md: 10 }, flexGrow: 1, overflowY: "auto" }}>
        {children}
      </Box>

      {/* QR encima del panel */}
      <QrWhatsapp open={openQR} onClose={() => setOpenQR(false)} />
    </Box>
  );
}
