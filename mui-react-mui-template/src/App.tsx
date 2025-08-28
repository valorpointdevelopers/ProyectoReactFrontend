import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import SignupForm from "./components/SignupForm"; // 👈 importar aquí

export default function App() {
  return (
    <Routes>
          <Route path="/signup" element={<SignupForm />} />
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
     
      </Route>
    </Routes>
  );
}
