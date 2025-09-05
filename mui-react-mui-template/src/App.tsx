import React, { useMemo, useState } from "react";
// Se quitan useLocation y useNavigate de aquí para evitar el error de pantalla en blanco
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DashboardLayout from "./layouts/DashboardLayout";
import LandingLayout from "./layouts/LandingLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import SignupForm from "./pages/SignupForm";
import Phonebook from "./pages/Phonebook";
import RecuperarContrasena from "./pages/RecuperarContrasena"; 
import Login from "./pages/Login";
import WelcomeCard from "./components/WelcomeCard";
import baseTheme from "./theme";
import BandejadeEntrada from "./pages/BandejadeEntrada";
import CalentadorWhatsapp from "./pages/CalentadorWhatsapp";
import PanelControl from "./pages/PanelControl";
import CampaxaChat from "./pages/CampaxaChat";
import QrWhatsapp from "./pages/QrWhatsapp";
import Api from "./pages/Api";
import ConstructorFlujo from "./pages/ConstructorFlujos";
import InstancesPage from "./pages/InstancesPage"
import AccountPage from "./pages/AccountPage";
import { Box, Typography } from "@mui/material";


// Componente de ejemplo para las rutas que no tenemos
const PlaceholderPage = ({ title }: { title: string }) => (
  <Box sx={{p: 4}}><Typography variant="h2">{title}</Typography></Box>
);


function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Estas dos líneas se han quitado. No afectaban la funcionalidad visible
  // pero causaban que la app no se renderizara.
  // const location = useLocation();
  // const navigate = useNavigate();

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode,
          background: {
            default: mode === "light" ? "#ffffff" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
          text: {
            primary: mode === "light" ? "#1a1a1a" : "#ffffff",
            secondary: mode === "light" ? "#666666" : "#bbbbbb",
          },
        },
      }),
    [mode]
  );

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Landing pública */}
        <Route
          path="/"
          element={
            <LandingLayout onToggleTheme={toggleMode} mode={mode}>
              <WelcomeCard />
            </LandingLayout>
          }
        />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/panel-control" element={<PanelControl />} />

        {/* Rutas de ejemplo para la navegación del menú */}
        <Route path="/privacy" element={<PlaceholderPage title="Política de Privacidad"/>} />
        <Route path="/terms" element={<PlaceholderPage title="Términos y Condiciones"/>} />
        <Route path="/contact" element={<PlaceholderPage title="Contacto"/>} />
        
        {/* Panel administrativo con layout */}
        <Route
          path="/panel/*"
          element={<DashboardLayout onToggleTheme={toggleMode} mode={mode} />}
        >
          <Route path="inbox" element={<BandejadeEntrada />} />
          <Route path="calentador" element={<CalentadorWhatsapp />} />
          <Route path="contacts" element={<Phonebook />} />
          <Route path="panel-control" element={<PanelControl />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="campaxa" element={<CampaxaChat />} />
          <Route path="api" element={<Api />} />
          <Route path="flows" element={<ConstructorFlujo />} />
          <Route path="instances" element={<InstancesPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;