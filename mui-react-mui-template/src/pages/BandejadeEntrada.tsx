import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EventIcon from "@mui/icons-material/Event";
import welcomeCats from "../images/no-chat-found.svg";

const BandejaEntrada: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      height="100vh"
      width="100%"
      bgcolor={theme.palette.background.default}
      overflow="hidden"
      sx={{ flexDirection: { xs: "column", sm: "row" } }}
    >
      {/* Panel lateral izquierdo */}
      <Paper
        elevation={1}
        sx={{
          width: { xs: "100%", sm: "300px" },
          p: 2,
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
          
          height: { xs: "auto", sm: "100vh" },
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {/* Buscador */}
        <Box display="flex" gap={1} alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Botones de búsqueda */}
        <Box 
          display="flex" 
          gap={1} 
          mb={2}
          sx={{ flexDirection: { xs: "column", sm: "row" } }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Número de teléfono"
            fullWidth
          />
          <TextField
            variant="outlined"
            size="small"
            placeholder="Nombre"
            fullWidth
          />
        </Box>

        {/* Filtro */}
        <Box display="flex" alignItems="center" gap={1}>
          <Select size="small" fullWidth defaultValue="todos">
            <MenuItem value="todos">Todos los chats</MenuItem>
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
            <MenuItem value="otros">Otros</MenuItem>
          </Select>
          <IconButton color="success">
            <WhatsAppIcon />
          </IconButton>
          <IconButton color="primary">
            <EventIcon />
          </IconButton>
        </Box>
        
        <Box flex={1} /> 
      </Paper>

      {/* Panel derecho */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        bgcolor={theme.palette.background.default}
        color={theme.palette.text.primary}
        height="100vh"
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <img
          src={welcomeCats}
          alt="Welcome cats"
          style={{
            width: "200px",
            marginBottom: "16px",
            filter: isDark ? "invert(1)" : "none",
          }}
        />
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: theme.palette.text.primary, mb: 1 }}
        >
          WELCOME
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Ups. no se encontró ninguna lista de chat
        </Typography>
      </Box>
    </Box>
  );
};

export default BandejaEntrada;