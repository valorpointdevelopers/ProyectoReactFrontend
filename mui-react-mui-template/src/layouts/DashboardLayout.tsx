import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Chip,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
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
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
<<<<<<< HEAD
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
=======
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SyncLockIcon from '@mui/icons-material/SyncLock';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
>>>>>>> origin/develop

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
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
<<<<<<< HEAD
  const handleMenuClose = () => setAnchorEl(null);
=======

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
>>>>>>> origin/develop

  const handleSubscriptionClick = () => {
    handleMenuClose();
    setSubscriptionOpen(true);
  };
<<<<<<< HEAD
  const handleSubscriptionClose = () => setSubscriptionOpen(false);
=======

  const handleSubscriptionClose = () => {
    setSubscriptionOpen(false);
  };
>>>>>>> origin/develop

  const handleProfileClick = () => {
    handleMenuClose();
    setProfileOpen(true);
  };
<<<<<<< HEAD
  const handleProfileClose = () => setProfileOpen(false);

  const handlePlansClick = () => setPlansOpen(true);
  const handlePlansClose = () => setPlansOpen(false);
=======

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  const handlePlansClick = () => {
    setPlansOpen(true);
  };

  const handlePlansClose = () => {
    setPlansOpen(false);
  };
>>>>>>> origin/develop

  const handleViewPlansFromProfile = () => {
    handleProfileClose();
    handlePlansClick();
  };
<<<<<<< HEAD
=======

>>>>>>> origin/develop
  const handleViewPlansFromSubscription = () => {
    handleSubscriptionClose();
    handlePlansClick();
  };

  const toggleDrawer = () => setOpen(!open);

  const handleLogout = () => {
    handleMenuClose();
<<<<<<< HEAD
    navigate("/");
=======
    navigate('/');
>>>>>>> origin/develop
  };

  const SubscriptionItem = ({ icon, label, value }: any) => {
    const isCheck = value === true;
    const isNumber = typeof value === "number";
    const isString = typeof value === "string";

    return (
      <Grid container alignItems="center" sx={{ my: 1 }}>
        <Grid item xs={2}>
          {icon}
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1">{label}</Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
          {isCheck ? (
            <CheckCircleOutlineIcon color="success" />
          ) : isNumber ? (
            <Chip
              label={value}
<<<<<<< HEAD
              sx={{ backgroundColor: theme.palette.grey[300], fontWeight: "bold" }}
=======
              sx={{ backgroundColor: isLight ? theme.palette.grey[300] : theme.palette.grey[800], fontWeight: "bold" }}
>>>>>>> origin/develop
            />
          ) : isString ? (
            <Chip
              label={value}
<<<<<<< HEAD
              sx={{ backgroundColor: theme.palette.grey[300], fontWeight: "bold" }}
=======
              sx={{ backgroundColor: isLight ? theme.palette.grey[300] : theme.palette.grey[800], fontWeight: "bold" }}
>>>>>>> origin/develop
            />
          ) : null}
        </Grid>
      </Grid>
    );
  };

  const PlanCard = ({ title, price, oldPrice, days, features }: any) => (
<<<<<<< HEAD
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "none",
        border: "1px solid",
        borderColor: theme.palette.divider,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Box sx={{ my: 2, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="span"
            sx={{ textDecoration: "line-through", color: "gray" }}
          >
            {oldPrice}
          </Typography>
          <Typography variant="h2" component="span" sx={{ fontWeight: "bold", mx: 1 }}>
=======
    <Card sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 'none', border: '1px solid', borderColor: theme.palette.divider }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Box sx={{ my: 2, textAlign: 'center' }}>
          <Typography variant="h4" component="span" sx={{ textDecoration: 'line-through', color: 'gray' }}>
            {oldPrice}
          </Typography>
          <Typography variant="h2" component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
>>>>>>> origin/develop
            {price}
          </Typography>
        </Box>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
          {days} Días
        </Typography>
        {features.map((feature: any, index: any) => (
<<<<<<< HEAD
          <Box key={index} sx={{ display: "flex", alignItems: "center", my: 1 }}>
=======
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
>>>>>>> origin/develop
            <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="body2">{feature}</Typography>
          </Box>
        ))}
      </CardContent>
<<<<<<< HEAD
      <CardActions sx={{ justifyContent: "center", p: 2 }}>
=======
      <CardActions sx={{ justifyContent: 'center', p: 2 }}>
>>>>>>> origin/develop
        <Button
          variant="contained"
          fullWidth
          sx={{
<<<<<<< HEAD
            borderRadius: 1, // corregido
=======
            borderRadius: "999px",
>>>>>>> origin/develop
            py: 1.5,
            backgroundColor: "#000",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          <ShoppingCartIcon sx={{ mr: 1 }} />
          COMENZAR
        </Button>
      </CardActions>
    </Card>
  );

  const plans = [
    {
      title: "Everything",
      price: "$39",
      oldPrice: "$3999",
      days: 39,
      features: [
        "Instancias de WhatsApp (10)",
        "Calentador de WhatsApp",
        "Límite de agenda telefónica (399)",
        "Etiquetas de chat (1)",
        "Notas de chat (1)",
        "Chatbot",
        "Acceso API",
      ],
    },
    {
      title: "Trial",
      price: "$0",
      oldPrice: "$0",
      days: 10,
      features: [
        "Instancias de WhatsApp (99)",
        "Calentador de WhatsApp",
        "Límite de agenda telefónica (999)",
        "Etiquetas de chat (1)",
        "Notas de chat (1)",
        "Chatbot",
        "Acceso API",
      ],
    },
    {
      title: "Basic",
      price: "$19",
      oldPrice: "$99",
      days: 30,
      features: [
        "Instancias de WhatsApp (1)",
        "Calentador de WhatsApp",
        "Límite de agenda telefónica (99)",
        "Etiquetas de chat (1)",
        "Notas de chat (1)",
        "Chatbot",
        "Acceso API",
      ],
    },
    {
      title: "Full",
      price: "$20",
      oldPrice: "$50",
      days: 30,
      features: [
        "Instancias de WhatsApp (30)",
        "Calentador de WhatsApp",
        "Límite de agenda telefónica (30000)",
        "Etiquetas de chat (1)",
        "Notas de chat (1)",
        "Chatbot",
        "Acceso API",
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
<<<<<<< HEAD
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          borderRadius: 0, // barra sin esquinas ovaladas
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
=======
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
>>>>>>> origin/develop
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Whatsvaa
          </Typography>
          {onToggleTheme && (
            <IconButton
              onClick={onToggleTheme}
              color="inherit"
              sx={{
                mr: 2,
                borderRadius: 1, // corregido
                backgroundColor: isLight ? theme.palette.grey[200] : theme.palette.grey[700],
                "&:hover": {
                  backgroundColor: isLight ? theme.palette.grey[300] : theme.palette.grey[600],
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
          <IconButton
            color="inherit"
            component="a"
            href="https://github.com/tu-repo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
            aria-controls={menuOpen ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
          >
            <AccountCircleIcon />
          </IconButton>

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
            <MenuItem component={Link} to="/panel/instances" onClick={handleMenuClose}>
              <ListItemIcon>
                <AdbIcon fontSize="small" />
              </ListItemIcon>
              Administrar instancias
            </MenuItem>
            <MenuItem onClick={handleSubscriptionClick}>
              <ListItemIcon>
                <PaidIcon fontSize="small" />
              </ListItemIcon>
              Suscripción
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

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
<<<<<<< HEAD
          <NavItem to="panel-control" icon={<DashboardIcon />} label="Panel de control" />
          <NavItem to="inbox" icon={<ChatIcon />} label="Bandeja de entrada" />
          <NavItem to="calentador" icon={<ChatIcon />} label="Calentador de WhatsApp" />
          <NavItem to="contacts" icon={<ContactsIcon />} label="Agenda telefónica" />
          <NavItem to="/panel/flows" icon={<BuildIcon />} label="Constructor de flujos" />
          <NavItem to="campaxa" icon={<CampaignIcon />} label="Campañas & Chatbots" />
          <NavItem to="/panel/api" icon={<ApiIcon />} label="Acceso API" />
=======
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
            to="/panel/calentador"
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
          <NavItem
            to="/panel/api"
            icon={<ApiIcon />}
            label="Acceso API" />
>>>>>>> origin/develop
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
        <Toolbar />
        <Outlet />
      </Box>

      {/* Modal de Suscripción */}
<<<<<<< HEAD
      <Dialog open={subscriptionOpen} onClose={handleSubscriptionClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
=======
      <Dialog
        open={subscriptionOpen}
        onClose={handleSubscriptionClose}
        maxWidth="xs"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.background.paper, // Asegura el fondo del modal en modo oscuro
            color: theme.palette.text.primary,
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
>>>>>>> origin/develop
          <Box display="flex" alignItems="center">
            <Typography variant="h6">Suscripción</Typography>
            <IconButton
              aria-label="close"
              onClick={handleSubscriptionClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
<<<<<<< HEAD
                color: (theme) => theme.palette.grey[500],
=======
                color: theme.palette.text.secondary,
>>>>>>> origin/develop
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
<<<<<<< HEAD
          <Box
            sx={{ p: 2, display: "flex", alignItems: "center", backgroundColor: theme.palette.grey[100] }}
          >
            <Box component="span" role="img" aria-label="star" sx={{ mr: 1, fontSize: 24 }}>
=======
          <Box sx={{ p: 2, display: "flex", alignItems: "center", backgroundColor: theme.palette.action.hover }}>
            <Box
              component="span"
              role="img"
              aria-label="star"
              sx={{ mr: 1, fontSize: 24 }}
            >
>>>>>>> origin/develop
              ⭐
            </Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Te has suscrito a Trial
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
<<<<<<< HEAD
            <SubscriptionItem icon={<WhatsAppIcon />} label="Calentador de WhatsApp" value={true} />
            <SubscriptionItem icon={<WhatsAppIcon />} label="Instancias de WhatsApp" value={99} />
            <SubscriptionItem icon={<ApiIcon />} label="API de Acceso" value={true} />
            <SubscriptionItem icon={<AdbIcon />} label="Chatbot" value={true} />
            <SubscriptionItem icon={<ChatIcon />} label="Notas de chat" value={true} />
            <SubscriptionItem icon={<ChatIcon />} label="Etiquetas de chat" value={true} />
            <SubscriptionItem icon={<ContactsIcon />} label="Límite de agenda telefónica" value={999} />
            <SubscriptionItem icon={<AccessTimeIcon />} label="Días restantes del plan" value="en 2 días" />
=======
            <SubscriptionItem
              icon={<WhatsAppIcon />}
              label="Calentador de WhatsApp"
              value={true}
            />
            <SubscriptionItem
              icon={<WhatsAppIcon />}
              label="Instancias de WhatsApp"
              value={99}
            />
            <SubscriptionItem
              icon={<ApiIcon />}
              label="API de Acceso"
              value={true}
            />
            <SubscriptionItem
              icon={<AdbIcon />}
              label="Chatbot"
              value={true}
            />
            <SubscriptionItem
              icon={<ChatIcon />}
              label="Notas de chat"
              value={true}
            />
            <SubscriptionItem
              icon={<ChatIcon />}
              label="Etiquetas de chat"
              value={true}
            />
            <SubscriptionItem
              icon={<ContactsIcon />}
              label="Límite de agenda telefónica"
              value={999}
            />
            <SubscriptionItem
              icon={<AccessTimeIcon />}
              label="Días restantes del plan"
              value="en 2 días"
            />
>>>>>>> origin/develop
          </Box>
          <Box sx={{ p: 2, pt: 0, textAlign: "center" }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleViewPlansFromSubscription}
              sx={{
<<<<<<< HEAD
                borderRadius: 1, // corregido
=======
                borderRadius: "999px",
>>>>>>> origin/develop
                py: 1.5,
                backgroundColor: "#000",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              <Box component="span" role="img" aria-label="star" sx={{ mr: 1 }}>
                ⭐
              </Box>
              VER TODOS LOS PLANES
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de Perfil */}
<<<<<<< HEAD
      <Dialog open={profileOpen} onClose={handleProfileClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
=======
      <Dialog
        open={profileOpen}
        onClose={handleProfileClose}
        maxWidth="xs"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
>>>>>>> origin/develop
          <Box display="flex" alignItems="center">
            <Typography variant="h6">Perfil</Typography>
            <IconButton
              aria-label="close"
              onClick={handleProfileClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
<<<<<<< HEAD
                color: (theme) => theme.palette.grey[500],
=======
                color: theme.palette.text.secondary,
>>>>>>> origin/develop
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                defaultValue=""
                variant="outlined"
                InputProps={{
                  startAdornment: (
<<<<<<< HEAD
                    <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
=======
                    <ListItemIcon sx={{ minWidth: 0, mr: 1, color: 'inherit' }}>
>>>>>>> origin/develop
                      <DriveFileRenameOutlineIcon fontSize="small" />
                    </ListItemIcon>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo electrónico"
                defaultValue=""
                variant="outlined"
                InputProps={{
                  startAdornment: (
<<<<<<< HEAD
                    <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
=======
                    <ListItemIcon sx={{ minWidth: 0, mr: 1, color: 'inherit' }}>
>>>>>>> origin/develop
                      <MailOutlineIcon fontSize="small" />
                    </ListItemIcon>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
<<<<<<< HEAD
                label="Contraseña"
                type="password"
                defaultValue=""
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
=======
                label="Tu número de móvil"
                defaultValue=""
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <ListItemIcon sx={{ minWidth: 0, mr: 1, color: 'inherit' }}>
                      <WhatsAppIcon fontSize="small" />
                    </ListItemIcon>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <ListItemIcon sx={{ minWidth: 0, mr: 1, color: 'inherit' }}>
>>>>>>> origin/develop
                      <SyncLockIcon fontSize="small" />
                    </ListItemIcon>
                  ),
                }}
              />
            </Grid>
<<<<<<< HEAD
          </Grid>
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 1, // corregido
                py: 1.5,
                backgroundColor: "#000",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Guardar cambios
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleViewPlansFromProfile}
              sx={{
                borderRadius: 1, // corregido
                py: 1.5,
                backgroundColor: "#000",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              <Box component="span" role="img" aria-label="star" sx={{ mr: 1 }}>
                ⭐
              </Box>
              VER TODOS LOS PLANES
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de Planes */}
      <Dialog open={plansOpen} onClose={handlePlansClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6">Planes</Typography>
=======
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">
                Ignora esto si no quieres cambiar la contraseña
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <Box sx={{ p: 2, pt: 0, textAlign: "center" }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#007bff',
              "&:hover": {
                backgroundColor: '#0056b3',
              },
              py: 1.5,
              mt: 2
            }}
          >
            ENVIAR
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleViewPlansFromProfile}
            sx={{
              backgroundColor: '#000',
              "&:hover": {
                backgroundColor: '#333',
              },
              py: 1.5,
              mt: 1,
            }}
          >
            <Box component="span" role="img" aria-label="star" sx={{ mr: 1 }}>
              ⭐
            </Box>
            VER TODOS LOS PLANES
          </Button>
        </Box>
      </Dialog>

      {/* Nuevo Modal de Planes */}
      <Dialog
        open={plansOpen}
        onClose={handlePlansClose}
        maxWidth="xl"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { mx: 2, my: 2, backgroundColor: theme.palette.background.default },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6">Planes</Typography>
            </Box>
>>>>>>> origin/develop
            <IconButton
              aria-label="close"
              onClick={handlePlansClose}
              sx={{
<<<<<<< HEAD
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
=======
                color: theme.palette.text.secondary,
>>>>>>> origin/develop
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
<<<<<<< HEAD
          <Grid container spacing={2}>
            {plans.map((plan, index) => (
              <Grid item xs={12} md={6} key={index}>
=======
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {plans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
>>>>>>> origin/develop
                <PlanCard {...plan} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

<<<<<<< HEAD
export default DashboardLayout;
=======
export default DashboardLayout;
>>>>>>> origin/develop
