import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Login from './layouts/LoginLayout'

export default function App() {
  return (
    <Routes>
      {/* Rutas con el layout principal */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
      </Route>

      {/* Rutas de autenticación */}
      <Route element={<AuthLayout />}>
              <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  )
}