import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Traceability from "@/pages/Traceability";
import Inventory from "@/pages/Inventory";
import Suppliers from "@/pages/Suppliers";
import Deliveries from "@/pages/Deliveries";
import Prep from "@/pages/Prep";
import Recipes from "@/pages/Recipes";
import Cleaning from "@/pages/Cleaning";
import Roster from "@/pages/Roster";
import Timesheets from "@/pages/Timesheets";
import Analytics from "@/pages/Analytics";
import Staff from "@/pages/Staff";

function Protected({ children, manager }) {
  const { user, loading, isManager } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (manager && !isManager) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/traceability" element={<Protected><Traceability /></Protected>} />
          <Route path="/inventory" element={<Protected manager><Inventory /></Protected>} />
          <Route path="/suppliers" element={<Protected manager><Suppliers /></Protected>} />
          <Route path="/deliveries" element={<Protected manager><Deliveries /></Protected>} />
          <Route path="/prep" element={<Protected><Prep /></Protected>} />
          <Route path="/recipes" element={<Protected><Recipes /></Protected>} />
          <Route path="/cleaning" element={<Protected><Cleaning /></Protected>} />
          <Route path="/roster" element={<Protected><Roster /></Protected>} />
          <Route path="/timesheets" element={<Protected><Timesheets /></Protected>} />
          <Route path="/analytics" element={<Protected manager><Analytics /></Protected>} />
          <Route path="/staff" element={<Protected manager><Staff /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
