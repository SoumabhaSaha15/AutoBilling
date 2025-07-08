import {FC,useEffect} from "react";
import { useAuth } from "../context/Auth/AuthContext";
import HeaderSection from "../components/admin/HeaderSection";
const AdminPage:FC = () =>{
  const auth = useAuth();
  useEffect(()=>{
    auth.login();
  },[]);
  return(
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeaderSection/>
      wellcome to admin page
    </div>
  );
}
export default AdminPage
