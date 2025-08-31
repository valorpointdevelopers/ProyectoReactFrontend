import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { FiUser, FiMail, FiLock, FiPhone, FiKey, FiEye, FiEyeOff } from 'react-icons/fi';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  acceptPolicy: boolean;
}

const SignupForm: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    mobile: '',
    acceptPolicy: false,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8022/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.success) {
        setFormData({ name: '', email: '', password: '', mobile: '', acceptPolicy: false });
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al registrar el usuario.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Izquierda: bloque negro con texto */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#0e0e0e',
          color: '#fff',
          p: 8,
          borderTopRightRadius: '40px',
          borderBottomRightRadius: '40px',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'left' }}>
          Todo lo que necesitas para hacer crecer tu negocio en WhatsApp
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, textAlign: 'left' }}>
          Personaliza la comunicación y vende más con la plataforma de API de WhatsApp Business
          que automatiza el marketing, las ventas, el servicio y el soporte.
        </Typography>
      </Box>

      {/* Derecha: formulario */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 4,
            backgroundColor: 'transparent',
          }}
        >
          {/* Título y subtítulo */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 1, textAlign: 'left' }}
          >
            Comienza tu prueba gratuita
          </Typography>
          <Typography
            sx={{ color: theme.palette.text.secondary, mb: 3, textAlign: 'left' }}
          >
            Comienza con una cuenta de demostración en WaCRM
          </Typography>

          {/* Texto arriba del formulario */}
          <Typography
            align="center"
            sx={{ mb: 3, color: theme.palette.text.secondary, fontSize: 14 }}
          >
            Iniciar sesión o registrarse
          </Typography>

          {message && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: 'error.light',
                color: 'error.main',
                textAlign: 'center',
              }}
            >
              {message}
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tu correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="dense"
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiMail />
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              fullWidth
              size="small"
              placeholder="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="dense"
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              fullWidth
              size="small"
              placeholder="Tu nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="dense"
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiUser />
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              fullWidth
              size="small"
              placeholder="Tu número de móvil"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              margin="dense"
              sx={{ mb: 2 }}
              helperText="Ingresa el número de móvil con el código de país, por ejemplo: +12234556879"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiPhone />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                pattern: "^[+0-9]+$", // SOLO permite números y "+"
                title: "Solo se permiten números y el símbolo +",
              }}
              required
            />

            {/* Checkbox y helper text */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Checkbox
                checked={formData.acceptPolicy}
                onChange={handleChange}
                name="acceptPolicy"
                sx={{
                  color: theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  },
                }}
                required
              />
              <FormHelperText sx={{ mt: 0, color: theme.palette.text.secondary }}>
                Al hacer clic aquí, estás aceptando nuestra Política de privacidad, Términos y condiciones *
              </FormHelperText>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 20,
                py: 1.2,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
              startIcon={<FiKey />}
            >
              Registrarse
            </Button>

            {/* Texto debajo del botón */}
            <Typography
              align="center"
              sx={{ mt: 2, fontSize: 14, color: theme.palette.text.secondary }}
            >
              ¿Ya tienes una cuenta?{' '}
              <RouterLink to="/login" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                Iniciar sesión
              </RouterLink>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default SignupForm;
