import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HeaderSection from "../components/employee/HeaderSection";
import { useAuth } from "../contexts/Auth/employee/AuthContext";
const AdminLayout: FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{
    if(auth.userDetails == null){
      auth.login(()=>{ },()=>{navigate('/login/admin');})
    }
  },[]);
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <HeaderSection />
        <Outlet/>
      </div>
    </>
  );
}
export default AdminLayout;
