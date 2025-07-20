import { FC } from "react";
import { Outlet,Link } from "react-router-dom";
import { Navbar, NavbarBrand, DarkThemeToggle, } from "flowbite-react"
const LoginHeader: FC = () => {

  return (
    <>
      <div className="min-h-[100dvh] bg-gray-300 dark:bg-gray-900">
        <Navbar fluid rounded>
          <Link to="/">
            <NavbarBrand>
              <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="auto billing logo" />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Auto Billing</span>
            </NavbarBrand>
          </Link>
          <DarkThemeToggle />
        </Navbar>
        <Outlet />
      </div>
    </>
  );
}
export default LoginHeader;
