import React from "react";
import { Link as RouterLink } from "react-router-dom";
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

type Props = {
  children: React.ReactNode;
  onToggleTheme?: () => void;
  mode?: "light" | "dark";
};

export default function LandingLayout({ children, onToggleTheme, mode = "light" }: Props) {
  const theme = useTheme();
  const isLight = mode !== "dark";

  return (
    <Box>
      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          backgroundColor: isLight ? "rgba(255,255,255,0.8)" : "rgba(18,18,18,0.8)",
          backdropFilter: "saturate(180%) blur(6px)",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 3 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Whatsvaa
            </Typography>
          </Box>

          {/* Enlaces centro */}
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

          {/* Botón cambio de tema con htmlColor */}
          {onToggleTheme && (
            <IconButton
              onClick={onToggleTheme}
              color="inherit"
              sx={{
                mr: 2,
                borderRadius: "999px",
                backgroundColor: isLight ? theme.palette.grey[200] : theme.palette.grey[700],
                "&:hover": { backgroundColor: isLight ? theme.palette.grey[300] : theme.palette.grey[600] },
              }}
            >
              {isLight ? <DarkModeIcon htmlColor="#000" /> : <LightModeIcon htmlColor="#fff" />}
            </IconButton>
          )}

          {/* Botón a Panel */}
          <Button
            component={RouterLink}
<<<<<<< HEAD
            to="/panel/panel"
=======
            to="/panel/dashboard"
>>>>>>> origin/main
            variant="contained"
            startIcon={<RedeemIcon />}
            sx={{ borderRadius: 999, px: 2.5 }}
          >
            PANEL DE CONTROL
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>{children}</Box>
    </Box>
  );
}
