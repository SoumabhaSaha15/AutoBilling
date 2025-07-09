import { FC, useEffect } from "react";
import base from './../utility/axios-base';
import { useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../contexts/Toast/ToastContext";
import { Button, Label, TextInput } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { EmployeeSubmit, type EmployeeSubmitType } from "../validator/employee";
const EmployeeLogin: FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    try {
      base
        .get('/employee_login')
        .then((res) => res.status === 200 && navigate('/employee'))
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }, []);
  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeSubmitType>({ resolver: zodResolver(EmployeeSubmit) });
  const formSubmit: SubmitHandler<EmployeeSubmitType> = async (data) => {
    try {
      let response = await base.post('/employee_login', data, { headers: { 'Content-Type': "application/json" } });
      if (response.status == 200) navigate('/employee');
      toast.open("login successful.", 'alert-success', true, 2000);
    } catch (e) {
      toast.open((e as Error)?.message || "", 'alert-error', true, 2000);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center">
      <form className="flex w-sm min-w-sm max-w-mg sm:w-sm md:w-md lg:w-lg flex-col gap-4" onSubmit={handleSubmit(formSubmit)}>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Employee Login</h3>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2">
              Your email
              {errors.email && (<div className="text-red-500">{errors.email.message}</div>)}
            </Label>
          </div>
          <TextInput
            id="email2"
            type="email"
            placeholder="name@flowbite.com"
            autoComplete="email"
            icon={HiMail}
            {...register("email")}
            required shadow
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password2">Your password (double click to view)
              {errors.password && (<div className="text-red-500">{errors.password.message}</div>)}
            </Label>
          </div>
          <TextInput
            placeholder="********"
            autoComplete="one-time-code"
            id="password2"
            type="password"
            icon={HiLockClosed}
            {...register("password")}
            onDoubleClick={e => {
              let inputType = e.currentTarget.type;
              e.currentTarget.type = inputType == "text" ? "password" : "text";
            }}
            required shadow
          />
        </div>
        <Button type="submit">login to employee account</Button>
      </form>
    </div>
  );
}
export default EmployeeLogin;
