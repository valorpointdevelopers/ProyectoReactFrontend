<<<<<<< HEAD
import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import RecuperarContraseña from './layouts/RecuperarContraseña'
=======
import React, { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DashboardLayout from "./layouts/DashboardLayout";
import LandingLayout from "./layouts/LandingLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import SignupForm from "./pages/SignupForm";
import RecuperarContraseña from "./pages/RecuperarContraseña"; 
import Login from "./pages/Login";
import WelcomeCard from "./components/WelcomeCard";
import baseTheme from "./theme";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");

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
>>>>>>> origin/omar

  return (
<<<<<<< HEAD
    <Routes>
      {/* Rutas con el layout principal */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
      </Route>

      {/* Rutas de autenticación */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<RecuperarContraseña />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
      </Route>
    </Routes>
  )
}
=======
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
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />

        {/* Panel administrativo con layout */}
        <Route
          path="/panel/*"
          element={<DashboardLayout onToggleTheme={toggleMode} mode={mode} />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
>>>>>>> origin/omar
