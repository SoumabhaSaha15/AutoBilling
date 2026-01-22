import base from './../utility/axios-base';
import OutletLoading from '../OutletLoading';
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../contexts/Toast/ToastContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { HiMail, HiLockClosed, HiKey } from "react-icons/hi";
import { AdminSubmit, type AdminSubmitType } from "../validator/admin";
import { Button, Label, TextInput, Spinner, Checkbox } from "flowbite-react";
const AdminLogin: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isKeyVisible, setIsKeyVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    try {
      base
        .get('/admin_login')
        .then((res) => {
          if (res.status === 200) navigate('/admin');
          else {
            setIsLoading(false);
            toast.open("No admin logged in please login.", 'alert-error', true, 2000);
          }
        })
        .catch(() => {
          toast.open("Failed to load admin login page", 'alert-error', true, 2000);
          setIsLoading(false);
        });
    } catch (e) {
      toast.open("Failed to load admin login page", 'alert-error', true, 2000);
      console.log(e);
    }
    return () => {
      setIsLoading(true);
      console.clear();
    };
  }, [navigate, toast]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminSubmitType>({ resolver: zodResolver(AdminSubmit) });
  const formSubmit: SubmitHandler<AdminSubmitType> = async (data) => {
    try {
      const response = await base.post('/admin_login', data);
      if (response.status == 200) navigate('/admin');
      else throw new Error(response.data?.message || "Login failed");
      toast.open("login successful.", 'alert-success', true, 2000);
    } catch (e) {
      toast.open((e as Error)?.message || "", 'alert-error', true, 2000);
    }
  };

  return (
    (isLoading) ?
      <OutletLoading />
      : (
        <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center place-items-center">
          <form className="flex max-w-[95%] md:w-md sm:w-sm flex-col gap-4" name="adminLogin" onSubmit={handleSubmit(formSubmit)}>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Login</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="admin-email">
                  Your email
                  {errors.email && (<div className="text-red-500">{errors.email.message}</div>)}
                </Label>
              </div>
              <TextInput
                id="admin-email"
                type="email"
                // className='w-[95%] md:w-md sm:w-sm'
                placeholder="name@flowbite.com"
                {...register("email")}
                icon={HiMail}
                autoComplete="email"
                required shadow
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="admin-password">
                  Your password
                  {errors.password && (<div className="text-red-500">{errors.password.message}</div>)}
                </Label>
              </div>
              <TextInput
                id="admin-password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="********"
                icon={HiLockClosed}
                {...register("password")}
                autoComplete="one-time-code"
                required
                shadow
              />
            </div>
            <div className="flex justify-between items-center gap-2">
              <Label htmlFor="ShowPassword">Show password</Label>
              <Checkbox id="ShowPassword" checked={isPasswordVisible} onChange={() => { setIsPasswordVisible(prev => !prev) }} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="admin-key">
                  Admin key
                  {errors.adminKey && (<div className="text-red-500">{errors.adminKey.message}</div>)}
                </Label>
              </div>
              <TextInput
                id="admin-key"
                // className='w-[95%] md:w-md sm:w-sm'
                placeholder="****-****-****-****"
                type={isKeyVisible ? "text" : "password"}
                icon={HiKey}
                {...register("adminKey")}
                autoComplete="one-time-code"
                required
                shadow
              />
            </div>
            <div className="flex justify-between items-center gap-2">
              <Label htmlFor="ShowKey">Show key</Label>
              <Checkbox id="ShowKey" checked={isKeyVisible} onChange={() => { setIsKeyVisible(prev => !prev) }} />
            </div>
            <Button type="submit" >
              {isSubmitting ? (<><Spinner aria-label="submit" size="sm" className="mr-2" />logging in</>) : "login to admin account"}
            </Button>
          </form>
        </div>)
  );
}
export default AdminLogin;
