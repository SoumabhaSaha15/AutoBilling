import { FC, useEffect } from "react";
import base from './../utility/axios-base';
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../contexts/Toast/ToastContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { HiMail, HiLockClosed, HiKey } from "react-icons/hi";
import { AdminSubmit, type AdminSubmitType } from "../validator/admin";
import { Button, Label, TextInput } from "flowbite-react";
const AdminLogin: FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    try {
      base
        .get('/admin_login')
        .then((res) => res.status === 200 && navigate('/admin'))
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }, [])
  const { register, handleSubmit, formState: { errors } } = useForm<AdminSubmitType>({ resolver: zodResolver(AdminSubmit) });
  const formSubmit: SubmitHandler<AdminSubmitType> = async (data) => {
    try {
      let response = await base.post('/admin_login', data, { headers: { 'Content-Type': "application/json" } });
      if (response.status == 200) navigate('/admin');
      toast.open("login successful.", 'alert-success', true, 2000);
    } catch (e) {
      toast.open((e as Error)?.message || "", 'alert-error', true, 2000);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center">
        <form className="flex min-w-sm max-w-md md:w-md sm:w-sm flex-col gap-4" name="adminLogin" onSubmit={handleSubmit(formSubmit)}>
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
                Your password (double click to view)
                {errors.password && (<div className="text-red-500">{errors.password.message}</div>)}
              </Label>
            </div>
            <TextInput
              id="admin-password"
              type="password"
              placeholder="********"
              icon={HiLockClosed}
              {...register("password")}
              autoComplete="one-time-code"
              onDoubleClick={e => {
                let inputType = e.currentTarget.type;
                e.currentTarget.type = inputType == "text" ? "password" : "text";
              }}
              required
              shadow
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="admin-key">
                Admin key (double click to view)
                {errors.adminKey && (<div className="text-red-500">{errors.adminKey.message}</div>)}
              </Label>
            </div>
            <TextInput
              id="admin-key"
              placeholder="****-****-****-****"
              type="password"
              icon={HiKey}
              {...register("adminKey")}
              autoComplete="one-time-code"
              onDoubleClick={e => {
                let inputType = e.currentTarget.type;
                e.currentTarget.type = inputType == "text" ? "password" : "text";
              }}
              required
              shadow
            />
          </div>
          <Button type="submit">login to admin account</Button>
        </form>
    </div>
  );
}
export default AdminLogin;
