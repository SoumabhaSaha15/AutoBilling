import React from "react";
import { Link } from "react-router-dom";
import { Navbar, NavbarBrand, Button, Label, TextInput, DarkThemeToggle } from "flowbite-react";
const AdminLogin: React.FC = () => {
  return (<div className="min-h-[100dvh] bg-gray-300 dark:bg-gray-900">
    <Navbar fluid rounded>
      <NavbarBrand as={Link} href="https://flowbite-react.com">
        <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Auto Billing</span>
      </NavbarBrand>
      <DarkThemeToggle />
    </Navbar>
    <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center">
      <form className="flex max-w-md min-w-md flex-col gap-4 ">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2">Your email</Label>
          </div>
          <TextInput id="email2" type="email" placeholder="name@flowbite.com" required shadow />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password2">Your password</Label>
          </div>
          <TextInput id="password2" type="password" required shadow />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="repeat-password">Admin key</Label>
          </div>
          <TextInput id="repeat-password" type="password" required shadow />
        </div>
        <Button type="submit">login to admin account</Button>
      </form>
    </div>
  </div>
  );
}
export default AdminLogin;