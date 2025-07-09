import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";


import { Navbar, NavbarBrand, DarkThemeToggle, } from "flowbite-react"
const LoginHeader: FC = () => {

  return (
    <>
      <div className="min-h-[100dvh] bg-gray-300 dark:bg-gray-900">
        <Navbar fluid rounded>
          <NavbarBrand as={Link} href="https://flowbite-react.com">
            <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Auto Billing</span>
          </NavbarBrand>
          <DarkThemeToggle />
        </Navbar>
        <Outlet />
      </div>
    </>
  );
}
export default LoginHeader;
