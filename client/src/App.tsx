import React from "react";
import AdminLogin from "./pages/AdminLogin";
import AuthProvider from "./context/Auth/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EmployeeLogin from "./pages/EmployeeLogin";
import NotFound from "./pages/404"
import LandingPage from './pages/LandingPage'
import AdminPage from "./pages/AdminPage";
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
        <Route path="/admin-login" Component={() => <WrapAdmin children={<AdminLogin />} />} />
        <Route path="/admin-page" Component={() => <WrapAdmin children={<AdminPage />} />} />
        <Route path="/employee-login" Component={EmployeeLogin} />
        <Route path="*" Component={NotFound} /> {/* 404 route */}
      </Routes>
    </BrowserRouter>
  )
}
export default App;
