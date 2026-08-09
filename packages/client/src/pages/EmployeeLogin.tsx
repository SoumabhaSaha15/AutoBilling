import base from '@/utility/axios-base';
import OutletLoading from '@/OutletLoading';
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/contexts/Toast/ToastContext";
import { Button, Label, TextInput, Spinner, Checkbox } from "flowbite-react";
import { EmployeeSubmit, type EmployeeSubmitType } from "@/validator/employee";
const EmployeeLogin: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    try {
      base
        .get('/employee_login')
        .then((res) => {
          if (res.status === 200) navigate('/employee')
          else {
            setIsLoading(false);
            toast.open("No employee logged pls login", 'alert-error', true, 2000);
          };
        })
        .catch((e) => {
          setIsLoading(false);
          toast.open("Failed to load employee login page", 'alert-error', true, 2000);
          console.error(e)
        });
    } catch (e) {
      console.error(e);
      toast.open("Failed to load employee login page", 'alert-error', true, 2000);
      setIsLoading(false);
    }
    return () => {
      setIsLoading(true);
      console.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmployeeSubmitType>({ resolver: zodResolver(EmployeeSubmit) });
  const formSubmit: SubmitHandler<EmployeeSubmitType> = async (data) => {
    try {
      const response = await base.post('/employee_login', data);
      if (response.status == 200) navigate('/employee');
      else throw new Error(response.data?.message || "Login failed");
      toast.open("login successful.", 'alert-success', true, 2000);
    } catch (e) {
      toast.open((e as Error)?.message || "", 'alert-error', true, 2000);
    }
  };

  return (
    (isLoading) ?
      <OutletLoading /> :
      (<div className="min-h-[calc(100dvh-64px)] grid items-center justify-center place-items-center">
        <form className="flex max-w-[95%] sm:w-sm md:w-md lg:w-lg flex-col gap-4" onSubmit={handleSubmit(formSubmit)}>
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
              type={isPasswordVisible ? "text" : "password"}
              icon={HiLockClosed}
              {...register("password")}
              onDoubleClick={e => {
                const inputType = e.currentTarget.type;
                e.currentTarget.type = inputType == "text" ? "password" : "text";
              }}
              required shadow
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <Label htmlFor="remember">Show password</Label>
            <Checkbox id="remember" checked={isPasswordVisible} onChange={() => setIsPasswordVisible(prev => !prev)} />
          </div>
          <Button type="submit">
            {isSubmitting ? (<><Spinner aria-label="submit" size="sm" className="mr-2" />logging in</>) : "login to employee account"}
          </Button>
        </form>
      </div>
      ));
}
export default EmployeeLogin;
