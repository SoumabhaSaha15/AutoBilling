import OutletLoading from "../OutletLoading";
import { FC, useEffect, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth/employee/AuthContext";
import HeaderSection from "../components/employee/HeaderSection";
const AdminLayout: FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.userDetails == null) {
      auth.login(() => { }, () => { navigate('/login/admin'); })
    }
  }, []);
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <HeaderSection />
        <Suspense fallback={<OutletLoading />} children={<Outlet />} />
      </div>
    </>
  );
}
export default AdminLayout;
