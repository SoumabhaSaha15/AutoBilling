import OutletLoading from "../OutletLoading";
import { FC, useEffect, Suspense } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/Auth/admin/AuthContext";
import HeaderSection from "../components/admin/HeaderSection";

const AdminLayout: FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.userDetails === null)
      auth.login(() => { }, () => { navigate('/login/admin'); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-300 dark:bg-gray-900">
        <HeaderSection />
        <Suspense fallback={<OutletLoading />}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}
export default AdminLayout;
