import React from "react";
import NotFound from "./pages/404"
import AdminPage from "./pages/admin/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import LandingPage from './pages/LandingPage'
import EmployeePage from "./pages/EmployeePage"
import LoginHeader from "./layouts/LoginHeader";
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeLayout from "./layouts/EmployeeLayout"
import AddProduct from "./pages/admin/AddProducts";
import ViewProducts from "./pages/admin/ViewProducts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminAuthProvider from "./contexts/Auth/admin/AuthProvider";
import EmployeeAuthProvider from "./contexts/Auth/employee/AuthProvider"
import CreateInvoice from "./pages/employee/CreateInvoice";
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={LandingPage} />

        <Route path="/login" Component={LoginHeader} >
          <Route index Component={EmployeeLogin} />
          <Route path="admin" Component={AdminLogin} />
          <Route path="employee" Component={EmployeeLogin} />
        </Route>

        <Route path="/admin" Component={() => <AdminAuthProvider children={<AdminLayout/>}/>} >
          <Route index Component={AdminPage} />
          <Route path="dashboard" Component={AdminPage} />
          <Route path="add-product" Component={AddProduct} />
          <Route path="view-products" Component={ViewProducts} />
        </Route>

        <Route path="/employee" Component={() => <EmployeeAuthProvider children={<EmployeeLayout/>} />} >
          <Route index Component={EmployeePage} />
          <Route path="create-invoice" Component={CreateInvoice} />
          <Route path="print-invoice/:id" Component={()=><>hello print invoice</>} />
        </Route>

        <Route path="*" Component={NotFound} /> {/* 404 route */}
      </Routes>
    </BrowserRouter>
  )
}
export default App;
