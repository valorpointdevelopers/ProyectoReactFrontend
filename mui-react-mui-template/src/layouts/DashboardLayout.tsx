// DashboardLayout adaptado al proyecto final
import React, { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
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
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import DashboardIcon from "@mui/icons-material/Dashboard"
import ChatIcon from "@mui/icons-material/Chat"
import ContactsIcon from "@mui/icons-material/Contacts"
import BuildIcon from "@mui/icons-material/Build"
import CampaignIcon from "@mui/icons-material/Campaign"
import ApiIcon from "@mui/icons-material/Api"
import GitHubIcon from "@mui/icons-material/GitHub"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"

interface DashboardLayoutProps {
  onToggleTheme?: () => void
  mode?: "light" | "dark"
}

type NavItemProps = {
  to: string
  icon: React.ReactNode
  label: string
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation()
  const selected = location.pathname === to
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
  )
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onToggleTheme,
  mode = "light",
}) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isLight = mode === "light"

  const toggleDrawer = () => setOpen(!open)

  return (
    <Box sx={{ display: "flex" }}>
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

          {/* Perfil */}
          <IconButton color="inherit" component={Link} to="/perfil">
            <AccountCircleIcon />
          </IconButton>
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
            to="/panel/dashboard"
            icon={<DashboardIcon />}
            label="Panel de control"
          />
          <NavItem to="/inbox" icon={<ChatIcon />} label="Bandeja de entrada" />
          <NavItem
            to="/panel/contacts"
            icon={<ContactsIcon />}
            label="Agenda telefónica"
          />
          <NavItem
            to="/flows"
            icon={<BuildIcon />}
            label="Constructor de flujos"
          />
          <NavItem
            to="/campaigns"
            icon={<CampaignIcon />}
            label="Campañas & Chatbots"
          />
          <NavItem to="/api" icon={<ApiIcon />} label="Acceso API" />
        </List>
      </Drawer>

      {/* Contenido */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default DashboardLayout
