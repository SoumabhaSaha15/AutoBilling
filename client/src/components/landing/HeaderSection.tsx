import { DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import { FC, useState, useEffect } from "react";
import {Link} from 'react-router-dom';
const HeaderSection: FC = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  useEffect(() => {
    window.onresize = (_) => {
      setWidth(window.innerWidth);
    };
  }, []);
  return (
    <Navbar fluid rounded className="bg-white shadow-sm sticky top-0 z-50">
      <NavbarToggle />
      <NavbarBrand href="#">
        <span className=" self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-gray-300">
          Auto Billing
        </span>
      </NavbarBrand>
      {(width < 768) ? (<>
        <DarkThemeToggle />
        <NavbarCollapse>
          <NavbarLink href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </NavbarLink>
          <NavbarLink href="#about" className="text-gray-700 hover:text-blue-600">
            About
          </NavbarLink>
          <NavbarLink href="#contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </NavbarLink>
          {/* NavbarLink rendered as div because of parent anchor tag having child anchor & lead to hydration error */}
          <NavbarLink as={'div'}>
            <Link to="/login/admin" className="text-gray-400 hover:text-blue-600">
              Admin-Login
            </Link>
          </NavbarLink>
          <NavbarLink as={'div'}>
            <Link to="/login/employee" className="text-gray-400 hover:text-blue-600">
              Employee-Login
            </Link>
          </NavbarLink>
        </NavbarCollapse>
      </>) : (<>
        <NavbarCollapse>
          <NavbarLink href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </NavbarLink>
          <NavbarLink href="#about" className="text-gray-700 hover:text-blue-600">
            About
          </NavbarLink>
          <NavbarLink href="#contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </NavbarLink>
          <Link to="/login/admin" className="text-gray-400 hover:text-blue-600">
            Admin-Login
          </Link>
          <Link to="/login/employee" className="text-gray-400 hover:text-blue-600">
            Employee-Login
          </Link>
        </NavbarCollapse>
        <DarkThemeToggle />
      </>)}
    </Navbar>
  );
}
export default HeaderSection;
