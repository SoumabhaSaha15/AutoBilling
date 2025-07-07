import React from "react";
import AdminLogin from "./pages/AdminLogin";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EmployeeLogin from "./pages/EmployeeLogin";
import NotFound from "./pages/404"
import LandingPage from './pages/LandingPage'


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={LandingPage}/>
        <Route path="/admin-login" Component={AdminLogin}/>
        <Route path="/employee-login" Component={EmployeeLogin}/>
        <Route path="*" Component={NotFound}/> {/* 404 route */}
      </Routes>
    </BrowserRouter>
  )
}
export default App;