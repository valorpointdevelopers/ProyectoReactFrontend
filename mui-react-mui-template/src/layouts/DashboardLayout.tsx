import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Link as MUILink,
  useTheme,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  onToggleTheme?: () => void;
  mode?: "light" | "dark";
}

export default function DashboardLayout({
  children,
  onToggleTheme,
  mode = "light",
}: DashboardLayoutProps) {
  const theme = useTheme();
  const isLight = mode !== "dark";

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          backgroundColor: isLight ? theme.palette.background.paper : theme.palette.grey[900],
          color: isLight ? theme.palette.text.primary : theme.palette.grey[100],
          boxShadow: "none",
          borderBottom: `1px solid ${isLight ? "#e0e0e0" : theme.palette.grey[800]}`,
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: "bold", fontSize: "1.2rem" }}>
            Logo
          </Typography>

          {/* Enlaces centro */}
          <Box sx={{ display: "flex", gap: 3, mx: 4 }}>
            <MUILink component={RouterLink} to="#" underline="none" color="inherit" sx={{ "&:hover": { color: "primary.main" } }}>
              Política de privacidad
            </MUILink>
            <MUILink component={RouterLink} to="#" underline="none" color="inherit" sx={{ "&:hover": { color: "primary.main" } }}>
              Términos y condiciones
            </MUILink>
            <MUILink component={RouterLink} to="#" underline="none" color="inherit" sx={{ "&:hover": { color: "primary.main" } }}>
              Contáctanos
            </MUILink>
          </Box>

          {/* Switch tema (usa htmlColor para que NUNCA falle) */}
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
              {isLight ? (
                <DarkModeIcon htmlColor="#000" />
              ) : (
                <LightModeIcon htmlColor="#fff" />
              )}
            </IconButton>
          )}

          {/* Panel de control */}
          <Typography
            variant="body2"
            component={RouterLink}
            to="/panel/dashboard"
            sx={{ fontWeight: "bold", textDecoration: "none", color: "primary.main", "&:hover": { opacity: 0.8 } }}
          >
            PANEL DE CONTROL
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Contenido */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
        <Toolbar />
        {children || <Outlet />}
      </Box>
    </Box>
  );
}
