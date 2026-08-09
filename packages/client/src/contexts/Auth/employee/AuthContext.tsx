import z from "zod";
import { createContext, useContext, type Context } from "react";

export const UserDetailsSchema = z.object({
  name: z.string(),
  email: z.email(),
  profilePicture: z.url({ message: "value is not propper url" })
    .startsWith(
      "https://res.cloudinary.com/",
      { message: "not a propper profilePicture url" }
    ),
  id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId format",
  }),
});

export type UserDetailsType = z.infer<typeof UserDetailsSchema> | null;
export type AuthContextProps = {
  login: (onSuccess?: () => void, onError?: () => void) => Promise<void>;
  logout: (onSuccess?: () => void, onError?: () => void) => Promise<void>;
  userDetails: UserDetailsType | null;
};
export const AuthContext: Context<AuthContextProps> = createContext<AuthContextProps>({
  login: async (onSuccess: () => void = () => { }, onError: () => void = () => { }) => {
    console.log(`User logged in`);
    onSuccess();
    onError();
  },
  logout: async (onSuccess: () => void = () => { }, onError: () => void = () => { }) => {
    console.log(`User logged out`);
    onSuccess();
    onError();
  },
  userDetails: null,
});
export const useAuth = () => useContext(AuthContext);
