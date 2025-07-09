import React from "react";
import AdminLogin from "./pages/AdminLogin";
import LoginHeader from "./layouts/LoginHeader";
import AuthProvider from "./contexts/Auth/admin/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EmployeeLogin from "./pages/EmployeeLogin";
import NotFound from "./pages/404"
import LandingPage from './pages/LandingPage'
import AdminPage from "./pages/AdminPage";
import AdminLayout from "./layouts/AdminLayout";
import { type ReactNode } from 'react';
const WrapAdmin = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={LandingPage} />
        <Route path="/login" Component={LoginHeader} >
          <Route path="admin" Component={AdminLogin} />
          <Route path="employee" Component={EmployeeLogin} />
        </Route>
        <Route path="/admin" Component={() => <WrapAdmin children={<AdminLayout />} />} >
          <Route index Component={() => <WrapAdmin children={<AdminPage />} />} />
        </Route>
        <Route path="*" Component={NotFound} /> {/* 404 route */}
      </Routes>
    </BrowserRouter>
  )
}
export default App;
