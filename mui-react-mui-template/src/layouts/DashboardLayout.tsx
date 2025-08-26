import * as React from 'react'
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Divider, Tooltip, Menu, MenuItem, Avatar
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import GitHubIcon from '@mui/icons-material/GitHub'
import { ColorModeContext } from '../theme'

const drawerWidth = 260

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const location = useLocation()
  const selected = location.pathname === to
  return (
    <ListItemButton component={Link} to={to} selected={selected} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  )
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const colorMode = React.useContext(ColorModeContext)
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const toggleDrawer = () => setMobileOpen(!mobileOpen)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    handleClose()
    navigate("/profile") // 🔹 asegúrate de tener esta ruta
  }

  const handleLogout = () => {
    handleClose()
    console.log("Cerrando sesión...")
    // localStorage.removeItem("token")
    navigate("/login")
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700}>React + MUI Starter</Typography>
        <Typography variant="body2" color="text.secondary">Plantilla lista para CRUD</Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, pt: 1 }}>
        <NavItem to="/dashboard" icon={<DashboardIcon />} label="Dashboard" />
        <NavItem to="/users" icon={<PeopleIcon />} label="Usuarios" />
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Repositorio base">
          <IconButton component="a" href="https://github.com/" target="_blank" rel="noreferrer">
            <GitHubIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Cambiar tema claro/oscuro">
          <IconButton onClick={colorMode.toggleColorMode} aria-label="toggle theme">
            <Brightness7Icon sx={{ display: { xs: 'none' } }} />
            <Brightness4Icon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel
          </Typography>

          {/* Botón de usuario */}
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar sx={{ bgcolor: 'secondary.main' }}>U</Avatar>
          </IconButton>

          {/* Menú desplegable */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>Ver perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
