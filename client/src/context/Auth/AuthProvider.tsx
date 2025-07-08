import { AuthContext, UserDetailsSchema, type UserDetailsType } from "./AuthContext";
import { useToast } from "../Toast/ToastContext";
import { useState } from "react";
import { z } from "zod";
import axios from "axios"
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<UserDetailsType>(null);
  const toast = useToast();

  const login = async (onSuccess: () => void = () => { }, onError: () => void = () => { }) => {
    try {
      const response = await axios.get(import.meta.env.VITE_USER_PROFILE);
      if (response.status != 200) throw new Error(`error in fetching profile status message:${response.statusText}`);
      const parsedData = UserDetailsSchema.parse(response.data);
      setUserDetails(parsedData);
      setTimeout(onSuccess, 1000);
    } catch (e) {
      toast.open('Error login: '+(e as Error).message,'alert-error', true, 2000);
      console.error(e);
      setTimeout(onError, 1000);
    }
  };

  const logout = async (onSuccess: () => void = () => { }, onError: () => void = () => { }) => {
    try {
      if (userDetails == null) throw new Error(`No user logged in!!!`);
      const response = await axios.get(import.meta.env.VITE_GOOGLE_LOGOUT);
      if (response.status != 200) throw new Error(`Error in logging out status message:${response.statusText}`);
      const value = z.object({ message: z.string() }).parse(response.data);
      toast.open(value.message);
      setUserDetails(null);
      setTimeout(onSuccess, 1000);
    } catch (err) {
      toast.open('Error logging out: ' + (err as Error).message,'alert-error', true, 2000, );
      console.error(err);
      setTimeout(onError, 1000);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
}
