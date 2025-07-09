import React from "react";
import { Button, Label, TextInput } from "flowbite-react";
const EmployeeLogin: React.FC = () => {
  return (
    <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center">
      <form className="flex w-xs min-w-xs max-w-md md:w-sm sm:w-xs flex-col gap-4">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Employee Login</h3>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2">Your email</Label>
          </div>
          <TextInput
            id="email2"
            type="email"
            placeholder="name@flowbite.com"
            autoComplete="email"
            required shadow
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password2">Your password</Label>
          </div>
          <TextInput
            placeholder="********"
            autoComplete="one-time-code"
            id="password2"
            type="password"
            required shadow
          />
        </div>
        <Button type="submit">login to admin account</Button>
      </form>
    </div>
  );
}
export default EmployeeLogin;
