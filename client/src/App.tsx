import Loading from "./Loading";
import { FC, lazy, Suspense } from "react";
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout"
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const EmployeeLogin = lazy(() => import("./pages/EmployeeLogin"));
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminAuthProvider from "./contexts/Auth/admin/AuthProvider";
import EmployeeAuthProvider from "./contexts/Auth/employee/AuthProvider"
const App: FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" Component={lazy(() => import('./pages/LandingPage'))} />

          <Route path="/login" Component={lazy(() => import("./layouts/LoginHeader"))} >
            <Route index Component={EmployeeLogin} />
            <Route path="admin" Component={lazy(() => import("./pages/AdminLogin"))} />
            <Route path="employee" Component={EmployeeLogin} />
          </Route>

          <Route path="/admin" Component={() => <AdminAuthProvider children={<AdminLayout />} />} >
            <Route index Component={AdminPage} />
            <Route path="dashboard" Component={AdminPage} />
            <Route path="add-product" Component={lazy(() => import("./pages/admin/AddProducts"))} />
            <Route path="view-products" Component={lazy(() => import("./pages/admin/ViewProducts"))} />
          </Route>

          <Route path="/employee" Component={() => <EmployeeAuthProvider children={<EmployeeLayout />} />} >
            <Route index Component={lazy(() => import("./pages/employee/EmployeePage"))} />
            <Route path="create-invoice" Component={lazy(() => import("./pages/employee/CreateInvoice"))} />
            <Route path="print-invoice/:id" Component={lazy(() => import("./pages/employee/ViewInvoice"))} />
          </Route>
          <Route path="*" Component={lazy(() => import("./pages/404"))} /> {/* 404 route */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
export default App;
