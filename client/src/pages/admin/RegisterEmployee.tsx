import { prettifyError } from "zod";
import base from '../../utility/axios-base';
import { GrUserWorker } from "react-icons/gr";
import { TbLockPassword } from "react-icons/tb";
import { FC, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useToast } from "../../contexts/Toast/ToastContext";
import { Button, Label, TextInput, FileInput, Spinner } from "flowbite-react";
import { type EmployeeRegisterType, EmployeeRegister, EmployeeRegisterResopnse } from "../../validator/employee";

const AddProduct: FC = () => {
  const defaultUrl = '/employee-worker.svg';
  const [previewUrl, setPreviewUrl] = useState(defaultUrl);
  const toast = useToast();
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<EmployeeRegisterType>({ resolver: zodResolver(EmployeeRegister) });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedImage = watch("profilePicture");

  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const objectUrl = URL.createObjectURL(watchedImage[0]);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else setPreviewUrl(defaultUrl);
  }, [watchedImage]);

  const newEmployeeSubmit: SubmitHandler<EmployeeRegisterType> = async (postData) => {
    try {
      const { data, status, statusText } = await base.postForm('/register_employee', postData)
      if (status != 200) {
        toast.open(statusText, 'alert-error', true, 5000);
        reset();
      }
      else {
        const safeParsed = EmployeeRegisterResopnse.safeParse(data);
        if (safeParsed.success) toast.open('product added id:' + safeParsed.data.id, 'alert-success', true, 5000);
        else toast.open(prettifyError(safeParsed.error), 'alert-error', true, 5000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center place-items-center">
      <form className="flex max-w-[95%] md:w-md sm:w-sm flex-col gap-4"
        name="Register Employee"
        onSubmit={handleSubmit(newEmployeeSubmit)}
        encType="multipart/form-data"
      >
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Register Employee</h3>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="profile-picture">
              {"Profile Picture (accepts .jpeg,.png,.webp max-size 1MB)"}
              {errors.profilePicture && (<div className="text-red-500">{errors.profilePicture.message}</div>)}
              <div className="flex flex-col items-center justify-center py-2">
                <img src={previewUrl} className="my-3 aspect-square w-1/2 rounded-xl bg-gray-50 dark:bg-gray-700" alt="image uploaded" />
              </div>
            </Label>

          </div>
          <FileInput
            id="profile-picture"
            {...register("profilePicture")}
            required
            accept="image/png, image/jpeg, image/webp"
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="employee-name">
              Employee name
              {errors.name && (<div className="text-red-500">{errors.name.message}</div>)}
            </Label>
          </div>
          <TextInput
            id="employee-name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
            icon={GrUserWorker}
            autoComplete="username"
            required shadow
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="employee-email">
              Employee email
              {errors.email && (<div className="text-red-500">{errors.email.message}</div>)}
            </Label>
          </div>
          <TextInput
            id="employee-email"
            type="email"
            placeholder="abc123@mail.com"
            icon={MdOutlineAlternateEmail}
            {...register("email")}
            autoComplete="email"
            required
            shadow
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="employee-password">
              Enter Password
              {errors.password && (<div className="text-red-500">{errors.password.message}</div>)}
            </Label>
          </div>
          <TextInput
            id="employee-password"
            placeholder="********"
            autoComplete="current-password"
            type="password"
            icon={TbLockPassword}
            {...register("password")}
            required
            shadow
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="disabled:bg-blue-950">{
          (isSubmitting) ?
            (<><Spinner aria-label="submit" size="sm" className="mr-2" />{"Registering new employee"}</>)
            : ("Register employee")
        }</Button>
      </form>
    </div>
  )
}
export default AddProduct;
