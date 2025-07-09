import { z } from "zod";
import { useState } from "react";
import base from './../../../utility/axios-base';
import { useToast } from "../../Toast/ToastContext";
import { AuthContext, UserDetailsSchema, type UserDetailsType } from "./AuthContext";


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<UserDetailsType>(null);
  const toast = useToast();
  const login = async (onSuccess: () => void = () => { }, onError: () => void = () => { }) => {
    try {
      const response = await base.get('/employee_login');
      if (response.status != 200) throw new Error(`error in fetching profile status message:${response.statusText}`);
      const parsedData = UserDetailsSchema.parse(response.data);
      setUserDetails(parsedData);
      onSuccess();
    } catch (e) {
      toast.open('Error login: '+(e as Error).message,'alert-error', true, 2000);
      console.error(e);
      onError();
    }
  };

  const logout = async (onSuccess: () => void = () => { }, onError: () => void = () => { }) => {
    try {
      if (userDetails == null) throw new Error(`No user logged in!!!`);
      const response = await base.get('/logout');
      if (response.status != 200) throw new Error(`Error in logging out status message:${response.statusText}`);
      const value = z.string().parse(response.data);
      toast.open(value,'alert-success');
      setUserDetails(null);
      onSuccess()
    } catch (err) {
      toast.open('Error logging out: ' + (err as Error).message,'alert-error', true, 2000, );
      console.error(err);
      onError();
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
}
