import * as React from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  useTheme, // <-- Importado para acceder al tema
} from "@mui/material";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HttpIcon from '@mui/icons-material/Http';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import DescriptionIcon from '@mui/icons-material/Description';

// Importa la imagen del token
import TokenImage from "../images/token.png";

// Este componente simula la generación de un token API
const generateToken = () => {
  const token = Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2);
  return token;
};

// Componente para la sección de "Generar token"
const GenerateTokenSection = () => {
  const [token, setToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const theme = useTheme(); // <-- Usando el hook useTheme

  const handleGenerateToken = () => {
    setLoading(true);
    setCopied(false);
    setTimeout(() => {
      setToken(generateToken());
      setLoading(false);
    }, 1500);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        Gestión de Tokens API
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4, color: theme.palette.text.secondary }}>
        Utiliza tokens de para automatizar tareas y conectar tus servicios.
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <img src={TokenImage} alt="Token API" style={{ maxWidth: '100px', height: 'auto' }} />
      </Box>

      <Divider sx={{ my: 3, borderColor: isDarkMode ? theme.palette.grey[700] : undefined }} />

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleGenerateToken}
          disabled={loading}
          sx={{
            backgroundColor: isDarkMode ? theme.palette.primary.dark : '#4e89ae',
            '&:hover': {
              backgroundColor: isDarkMode ? theme.palette.primary.light : '#437aa0',
            },
            p: '10px 24px',
            fontSize: '1rem'
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Generar Nuevo Token"}
        </Button>
      </Box>

      {token && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
            Token Generado:
          </Typography>
          <TextField
            fullWidth
            value={token}
            variant="outlined"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleCopyToken}
                    edge="end"
                    color="primary"
                    aria-label="copy token"
                    sx={{ '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' } }}
                  >
                    {copied ? <CheckCircleOutlineIcon color="success" /> : <ContentCopyIcon color={isDarkMode ? 'primary' : 'action'} />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                color: theme.palette.text.primary
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? theme.palette.grey[800] : '#f1f4f8',
                '& fieldset': { borderColor: isDarkMode ? theme.palette.grey[700] : '#ddd' },
                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
              },
            }}
          />
          {copied && (
            <Alert severity="success" sx={{ mt: 2, display: 'inline-flex' }}>
              Token copiado al portapapeles.
            </Alert>
          )}
        </Box>
      )}

      <Divider sx={{ my: 4, borderColor: isDarkMode ? theme.palette.grey[700] : undefined }} />
    </Box>
  );
};

// Componente para la sección de "Método GET"
const GetMethodSection = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const theme = useTheme(); // <-- Usando el hook useTheme
  const isDarkMode = theme.palette.mode === 'dark';

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderTabContent = (tabIndex: number) => {
    const commonStyles = {
      p: 2,
      mb: 3,
      backgroundColor: isDarkMode ? theme.palette.grey[800] : '#f1f4f8',
      borderRadius: '8px',
    };

    const urlStyle = {
      color: isDarkMode ? theme.palette.info.light : '#4e89ae',
      fontWeight: 'bold',
      overflowWrap: 'break-word',
      fontFamily: 'monospace'
    };

    const paramStyle = {
      color: isDarkMode ? theme.palette.warning.light : '#c41151',
      fontWeight: 'bold',
    };

    const successStyle = { ...commonStyles, borderLeft: '4px solid #4caf50' };
    const failedStyle = { ...commonStyles, borderLeft: '4px solid #f44336' };
    const codeStyle = { fontFamily: 'monospace', color: theme.palette.text.primary };

    switch (tabIndex) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              1. Send a GET request to
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #4e89ae' }}>
              <Typography variant="body2" sx={urlStyle}>
                http://localhost:8022/api/v1/send-text?token=<span style={paramStyle}>TOKEN_HERE</span>&instance_id=<span style={paramStyle}>ID</span>&jid=<span style={paramStyle}>JID</span>&msg=<span style={paramStyle}>HELLO</span>
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              2. Indicators
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #fcef00ff' }}>
              <Box component="ul" sx={{ pl: 2, mb: 0, listStyleType: 'none', color: theme.palette.text.secondary }}>
                <li><Typography variant="body2"><span style={paramStyle}>token</span> = your token,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>msg</span> = your text message,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>instance_id</span> = instance ID,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>jid</span> = 91999999999@s.whatsapp.net</Typography></li>
              </Box>
            </Paper>
            
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              3. Success response
            </Typography>
            <Paper elevation={1} sx={successStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": true,
  "message": "Message sent successfully!",
  "response": "<RESPONSE>"
}`}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              4. Failed response
            </Typography>
            <Paper elevation={1} sx={failedStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": false,
  "message": "<REASON>"
}`}
              </Typography>
            </Paper>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              1. Send a GET request to
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #4e89ae' }}>
              <Typography variant="body2" sx={urlStyle}>
                http://localhost:8022/api/v1/send-image?token=<span style={paramStyle}>TOKEN_HERE</span>&instance_id=<span style={paramStyle}>ID</span>&jid=<span style={paramStyle}>JID</span>&caption=<span style={paramStyle}>CAPTION</span>&imageurl=<span style={paramStyle}>IMAGEURL</span>
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              2. Indicators
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #fcef00ff' }}>
              <Box component="ul" sx={{ pl: 2, mb: 0, listStyleType: 'none', color: theme.palette.text.secondary }}>
                <li><Typography variant="body2"><span style={paramStyle}>token</span> = your token,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>caption</span> = your image caption message,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>instance_id</span> = instance ID,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>jid</span> = 91999999999@s.whatsapp.net,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>imageurl</span> = https://someimage.com/image.jpg</Typography></li>
              </Box>
            </Paper>
            
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              3. Success response
            </Typography>
            <Paper elevation={1} sx={successStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": true,
  "message": "Message sent successfully!",
  "response": "<RESPONSE>"
}`}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              4. Failed response
            </Typography>
            <Paper elevation={1} sx={failedStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": false,
  "message": "<REASON>"
}`}
              </Typography>
            </Paper>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              1. Send a GET request to
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #4e89ae' }}>
              <Typography variant="body2" sx={urlStyle}>
                http://localhost:8022/api/v1/send-video?token=<span style={paramStyle}>TOKEN_HERE</span>&instance_id=<span style={paramStyle}>ID</span>&jid=<span style={paramStyle}>JID</span>&caption=<span style={paramStyle}>CAPTION</span>&videourl=<span style={paramStyle}>VIDEOURL</span>
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              2. Indicators
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #fcef00ff' }}>
              <Box component="ul" sx={{ pl: 2, mb: 0, listStyleType: 'none', color: theme.palette.text.secondary }}>
                <li><Typography variant="body2"><span style={paramStyle}>token</span> = your token,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>caption</span> = your video caption message,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>instance_id</span> = instance ID,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>jid</span> = 91999999999@s.whatsapp.net,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>videourl</span> = https://someimage.com/video.mp4</Typography></li>
              </Box>
            </Paper>
            
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              3. Success response
            </Typography>
            <Paper elevation={1} sx={successStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": true,
  "message": "Message sent successfully!",
  "response": "<RESPONSE>"
}`}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              4. Failed response
            </Typography>
            <Paper elevation={1} sx={failedStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": false,
  "message": "<REASON>"
}`}
              </Typography>
            </Paper>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              1. Send a GET request to
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #4e89ae' }}>
              <Typography variant="body2" sx={urlStyle}>
                http://localhost:8022/api/v1/send-audio?token=<span style={paramStyle}>TOKEN_HERE</span>&instance_id=<span style={paramStyle}>ID</span>&jid=<span style={paramStyle}>JID</span>&audiourl=<span style={paramStyle}>AUDIOURL</span>
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              2. Indicators
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #fcef00ff' }}>
              <Box component="ul" sx={{ pl: 2, mb: 0, listStyleType: 'none', color: theme.palette.text.secondary }}>
                <li><Typography variant="body2"><span style={paramStyle}>token</span> = your token,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>instance_id</span> = instance ID,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>jid</span> = 91999999999@s.whatsapp.net,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>audiourl</span> = https://someimage.com/audio.mp3</Typography></li>
              </Box>
            </Paper>
            
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              3. Success response
            </Typography>
            <Paper elevation={1} sx={successStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": true,
  "message": "Message sent successfully!",
  "response": "<RESPONSE>"
}`}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              4. Failed response
            </Typography>
            <Paper elevation={1} sx={failedStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": false,
  "message": "<REASON>"
}`}
              </Typography>
            </Paper>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              1. Send a GET request to
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #4e89ae' }}>
              <Typography variant="body2" sx={urlStyle}>
                http://localhost:8022/api/v1/send-doc?token=<span style={paramStyle}>TOKEN_HERE</span>&instance_id=<span style={paramStyle}>ID</span>&jid=<span style={paramStyle}>JID</span>&caption=<span style={paramStyle}>CAPTION</span>&docurl=<span style={paramStyle}>DOCURL</span>
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              2. Indicators
            </Typography>
            <Paper elevation={1} sx={{ ...commonStyles, borderLeft: '4px solid #fcef00ff' }}>
              <Box component="ul" sx={{ pl: 2, mb: 0, listStyleType: 'none', color: theme.palette.text.secondary }}>
                <li><Typography variant="body2"><span style={paramStyle}>token</span> = your token,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>instance_id</span> = instance ID,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>jid</span> = 91999999999@s.whatsapp.net,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>caption</span> = your caption,</Typography></li>
                <li><Typography variant="body2"><span style={paramStyle}>docurl</span> = https://someimage.com/somedoc.pdf</Typography></li>
              </Box>
            </Paper>
            
            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              3. Success response
            </Typography>
            <Paper elevation={1} sx={successStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": true,
  "message": "Message sent successfully!",
  "response": "<RESPONSE>"
}`}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
              4. Failed response
            </Typography>
            <Paper elevation={1} sx={failedStyle}>
              <Typography variant="body2" component="pre" sx={codeStyle}>
                {`{
  "success": false,
  "message": "<REASON>"
}`}
              </Typography>
            </Paper>
          </Box>
        );
      default:
        return <Box sx={{ p: 3 }}>Contenido no disponible para esta opción.</Box>;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        Enviar mensaje usando solicitud GET
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: isDarkMode ? theme.palette.grey[700] : 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="api request types" variant="fullWidth">
          <Tab
            icon={<ChatBubbleOutlineIcon color={tabValue === 0 ? 'primary' : 'inherit'} />}
            label="MENSAJE DE TEXTO"
            {...a11yProps(0)}
            sx={{
              color: isDarkMode && tabValue !== 0 ? theme.palette.grey[400] : undefined,
            }}
          />
          <Tab
            icon={<ImageIcon color={tabValue === 1 ? 'primary' : 'inherit'} />}
            label="ENVIAR IMAGEN"
            {...a11yProps(1)}
            sx={{
              color: isDarkMode && tabValue !== 1 ? theme.palette.grey[400] : undefined,
            }}
          />
          <Tab
            icon={<VideocamIcon color={tabValue === 2 ? 'primary' : 'inherit'} />}
            label="ENVIAR VIDEO"
            {...a11yProps(2)}
            sx={{
              color: isDarkMode && tabValue !== 2 ? theme.palette.grey[400] : undefined,
            }}
          />
          <Tab
            icon={<AudiotrackIcon color={tabValue === 3 ? 'primary' : 'inherit'} />}
            label="ENVIAR AUDIO"
            {...a11yProps(3)}
            sx={{
              color: isDarkMode && tabValue !== 3 ? theme.palette.grey[400] : undefined,
            }}
          />
          <Tab
            icon={<DescriptionIcon color={tabValue === 4 ? 'primary' : 'inherit'} />}
            label="ENVIAR DOCUMENTO"
            {...a11yProps(4)}
            sx={{
              color: isDarkMode && tabValue !== 4 ? theme.palette.grey[400] : undefined,
            }}
          />
        </Tabs>
      </Box>

      {renderTabContent(tabValue)}
    </Box>
  );
};

// Funciones de accesibilidad para las pestañas
function a11yProps(index: number) {
  return {
    id: `api-tab-${index}`,
    'aria-controls': `api-tabpanel-${index}`,
  };
}

const Api = () => {
  const [selectedMenuItem, setSelectedMenuItem] = React.useState("generarToken");
  const theme = useTheme(); // <-- Usando el hook useTheme
  const isDarkMode = theme.palette.mode === 'dark';

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "generarToken":
        return <GenerateTokenSection />;
      case "metodoGET":
        return <GetMethodSection />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: isDarkMode ? theme.palette.background.default : '#f5f7fa',
      color: theme.palette.text.primary,
    }}>
      {/* Sidebar de navegación */}
      <Paper elevation={1} sx={{
        width: 280,
        flexShrink: 0,
        backgroundColor: isDarkMode ? theme.palette.background.paper : '#ffffff',
        borderRight: `1px solid ${isDarkMode ? theme.palette.grey[800] : '#e0e0e0'}`,
        p: 2,
        borderRadius: '0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Automatiza tus otras tareas usando API
          </Typography>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedMenuItem === "generarToken"}
              onClick={() => setSelectedMenuItem("generarToken")}
              sx={{
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: isDarkMode ? theme.palette.primary.dark : '#e3f2fd',
                  '&:hover': {
                    backgroundColor: isDarkMode ? theme.palette.primary.main : '#d1e5fa',
                  },
                },
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0',
                },
              }}
            >
              <ListItemIcon>
                <VpnKeyIcon color={selectedMenuItem === "generarToken" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Generar token" sx={{ color: isDarkMode ? theme.palette.text.primary : 'inherit' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedMenuItem === "metodoGET"}
              onClick={() => setSelectedMenuItem("metodoGET")}
              sx={{
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: isDarkMode ? theme.palette.primary.dark : '#e3f2fd',
                  '&:hover': {
                    backgroundColor: isDarkMode ? theme.palette.primary.main : '#d1e5fa',
                  },
                },
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0',
                },
              }}
            >
              <ListItemIcon>
                <HttpIcon color={selectedMenuItem === "metodoGET" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Método GET" sx={{ color: isDarkMode ? theme.palette.text.primary : 'inherit' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          <Grid item xs={12} md={10}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', backgroundColor: isDarkMode ? theme.palette.background.paper : '#ffffff' }}>
              {renderContent()}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Api;