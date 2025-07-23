import OutletLoading from "../OutletLoading";
import { FC, useEffect, Suspense } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import HeaderSection from "../components/admin/HeaderSection";
import { useAuth } from "../contexts/Auth/admin/AuthContext";
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
      <div className="min-h-screen bg-gray-300 dark:bg-gray-900">
        <HeaderSection />
        <Suspense fallback={<OutletLoading />} children={<Outlet />} />
      </div>
    </>
  );
}
export default AdminLayout;
