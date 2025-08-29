//import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Dashboard from './pages/Dashboard'
import  SignupForm from './pages/SignupForm'
import Users from './pages/Users'
import RecuperarContrasena from './pages/RecuperarContrasena'
import React, { useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LandingLayout from "./layouts/LandingLayout";

import Login from "./pages/Login";
import WelcomeCard from "./components/WelcomeCard";
import baseTheme from "./theme";
export default App;

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

  return (
    <Routes>
      {/* Rutas con el layout principal */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignupForm />} />
      </Route>

      {/* Rutas de autenticación */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LandingLayout />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContrasena />} />
      </Route>
    </Routes>
  )
}
