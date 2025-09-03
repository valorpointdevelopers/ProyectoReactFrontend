import React, { useMemo, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DashboardLayout from "./layouts/DashboardLayout";
import LandingLayout from "./layouts/LandingLayout";
import Dashboard from "./pages/Dashboard";
import SignupForm from "./pages/SignupForm";
import Login from "./pages/Login";
import WelcomeCard from "./components/WelcomeCard";
import baseTheme from "./theme";
import BandejadeEntrada from "./pages/BandejadeEntrada";
import PanelControl from "./pages/PanelControl";
import CampaxaChat from "./pages/CampaxaChat";
import QrWhatsapp from "./pages/QrWhatsapp";
import Api from "./pages/Api";
import Instances from "./pages/InstancesPage";
import InstancesPage from "./pages/InstancesPage";
import Recuperar from "./pages/RecuperarContrasena";



function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const location = useLocation();
  const navigate = useNavigate();

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

        {/* Login / Registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/recuperar-contrasena" element={<Recuperar/>} />

        {/* Panel administrativo */}
        <Route
          path="/panel/*"
          element={<DashboardLayout onToggleTheme={toggleMode} mode={mode} />}
        >
          <Route path="inbox" element={<BandejadeEntrada />} />
          <Route path="panel-control" element={<PanelControl />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="campaxa" element={<CampaxaChat />} />
          <Route path="api" element={<Api />} />
          <Route path="instances" element={<InstancesPage />} />
          

        </Route>
      </Routes>

      {/* Overlay global */}
      {location.pathname === "/panel/panel-control" && (
        <QrWhatsapp
          open={true}
          onClose={() => navigate("/panel/dashboard")}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
