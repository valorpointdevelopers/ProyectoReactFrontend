import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Box,
  useTheme,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import ContactsIcon from "@mui/icons-material/Contacts";
import BuildIcon from "@mui/icons-material/Build";
import CampaignIcon from "@mui/icons-material/Campaign";
import ApiIcon from "@mui/icons-material/Api";
import GitHubIcon from "@mui/icons-material/GitHub";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdbIcon from "@mui/icons-material/Adb";
import PaidIcon from "@mui/icons-material/Paid";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

interface DashboardLayoutProps {
  onToggleTheme?: () => void;
  mode?: "light" | "dark";
}

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const selected = location.pathname === to;
  return (
    <ListItemButton
      component={Link}
      to={to}
      selected={selected}
      sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onToggleTheme,
  mode = "light",
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isLight = mode === "light";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => setOpen(!open);

  const handleLogout = () => {
    handleMenuClose();
    // Lógica para cerrar sesión aquí
    console.log("Cerrar sesión");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Barra superior */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          {/* Botón hamburguesa */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo / título */}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Whatsvaa
          </Typography>

          {/* Botón cambio de tema */}
          {onToggleTheme && (
            <IconButton
              onClick={onToggleTheme}
              color="inherit"
              sx={{
                mr: 2,
                borderRadius: "999px",
                backgroundColor: isLight
                  ? theme.palette.grey[200]
                  : theme.palette.grey[700],
                "&:hover": {
                  backgroundColor: isLight
                    ? theme.palette.grey[300]
                    : theme.palette.grey[600],
                },
              }}
            >
              {isLight ? (
                <DarkModeIcon htmlColor="#000" />
              ) : (
                <LightModeIcon htmlColor="#fff" />
              )}
            </IconButton>
          )}

          {/* Enlace a GitHub */}
          <IconButton
            color="inherit"
            component="a"
            href="https://github.com/tu-repo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>

          {/* Perfil - Ahora con menú desplegable */}
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
            aria-controls={menuOpen ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
          >
            <AccountCircleIcon />
          </IconButton>

          {/* Componente del Menú */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* Opción para "Administrar instancias" */}
            <MenuItem component={Link} to="/panel/instances" onClick={handleMenuClose}>
              <ListItemIcon>
                <AdbIcon fontSize="small" />
              </ListItemIcon>
              Administrar instancias
            </MenuItem>
            {/* Opción para "Suscripción" */}
            <MenuItem component={Link} to="/panel/subscription" onClick={handleMenuClose}>
              <ListItemIcon>
                <PaidIcon fontSize="small" />
              </ListItemIcon>
              Suscripción
            </MenuItem>
            <Divider />
            {/* Opción para "Perfil" que navega a la nueva ruta */}
            <MenuItem component={Link} to="/panel/account" onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Perfil
            </MenuItem>
            {/* Opción para "Cerrar sesión" */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: 250,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          <NavItem
            to="panel-control"
            icon={<DashboardIcon />}
            label="Panel de control"
          />
          <NavItem
            to="inbox"
            icon={<ChatIcon />}
            label="Bandeja de entrada"
          />
          <NavItem
            to="calentador"
            icon={<ChatIcon />}
            label="Calentador de WhatsApp"
          />
          <NavItem
            to="contacts"
            icon={<ContactsIcon />}
            label="Agenda telefónica"
          />
          <NavItem
            to="/panel/flows"
            icon={<BuildIcon />}
            label="Constructor de flujos"
          />
          <NavItem
            to="campaxa"
            icon={<CampaignIcon />}
            label="Campañas & Chatbots"
          />
          <NavItem to="/panel/api" icon={<ApiIcon />} label="Acceso API" />
        </List>
      </Drawer>

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;