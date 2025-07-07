import { FC } from "react";
import { Link } from "react-router-dom";
import base from './../utility/axios-base';
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../context/Toast/ToastContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { HiMail, HiLockClosed, HiKey } from "react-icons/hi";
import { AdminSubmit, type AdminSubmitType } from "../validator/admin";
import { Navbar, NavbarBrand, Button, Label, TextInput, DarkThemeToggle, } from "flowbite-react";
const AdminLogin: FC = () => {
  const { register, handleSubmit,formState:{errors,} } = useForm<AdminSubmitType>({ resolver: zodResolver(AdminSubmit) });
  const toast = useToast();
  const formSubmit: SubmitHandler<AdminSubmitType> = async (data) => {
    toast.open(data.adminKey,false,2000,'alert-error');
  };

  return (
    <div className="min-h-[100dvh] bg-gray-300 dark:bg-gray-900">
      <Navbar fluid rounded>
        <NavbarBrand as={Link} href="https://flowbite-react.com">
          <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Auto Billing</span>
        </NavbarBrand>
        <DarkThemeToggle />
      </Navbar>

      {/* form */}
      <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center">
        <form className="flex max-w-md min-w-md flex-col gap-4" name="adminLogin" onSubmit={handleSubmit(formSubmit)}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="admin-email">Your email</Label>
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
              <Label htmlFor="admin-password">Your password (double click to view)</Label>
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
                console.log(errors);
                toast.open(errors.password?.message||"",false,0,'alert-error');
              }}
              required
              shadow
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="admin-key">Admin key (double click to view)</Label>
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
    </div>
  );
}
export default AdminLogin;
