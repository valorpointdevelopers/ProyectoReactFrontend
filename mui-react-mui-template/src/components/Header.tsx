import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";
import { DarkMode, LightMode } from '@mui/icons-material';

const navItems = [
  { text: 'Política de privacidad', path: '/privacy' },
  { text: 'Términos y condiciones', path: '/terms' },
  { text: 'Contacto', path: '/contact' },
];

const drawerWidth = 240;

interface HeaderProps {
  onToggleTheme: () => void;
  mode: 'light' | 'dark';
}

export default function Header({ onToggleTheme, mode }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleNavClick = (path: string) => {
    navigate(path);
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Whatsvaa
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => handleNavClick(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Panel de Control en móvil dentro del Drawer */}
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ textAlign: 'center' }} 
            onClick={() => handleNavClick('/panel/dashboard')}
          >
            <ListItemText 
              primary="PANEL DE CONTROL" 
              primaryTypographyProps={{ fontWeight: 'bold', color: 'primary' }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" position="static" color="default" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Whatsvaa CRM
            </Typography>
            
            {/* Vista Escritorio */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
              {navItems.map((item) => (
                <Button 
                  key={item.text} 
                  sx={{ color: 'text.primary' }} 
                  onClick={() => handleNavClick(item.path)}
                >
                  {item.text}
                </Button>
              ))}

              {/* Panel de Control en escritorio */}
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ borderRadius: 999, fontWeight: 'bold' }}
                onClick={() => navigate('/panel/dashboard')}
              >
                PANEL DE CONTROL
              </Button>

              <IconButton onClick={onToggleTheme} color="inherit" sx={{ ml: 1 }}>
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Box>

            {/* Vista Mobile: Panel de Control + menú hamburguesa */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ borderRadius: 999, fontWeight: 'bold' }}
                onClick={() => navigate('/panel/dashboard')}
              >
                PANEL DE CONTROL
              </Button>

              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer móvil */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
