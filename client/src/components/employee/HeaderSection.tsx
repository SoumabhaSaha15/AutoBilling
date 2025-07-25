import { Avatar, DarkThemeToggle, Dropdown, DropdownItem, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import { useAuth } from '../../contexts/Auth/employee/AuthContext';
import {Link} from 'react-router-dom';
import EmployeeCard from './../employee/EmployeeCard';
import { FC, useState, useEffect } from "react";
const HeaderSection: FC = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  useEffect(() => {
    window.onresize = (_) => {
      setWidth(window.innerWidth);
    };
  }, []);
  const auth = useAuth();


  const DIV = (
    <div className="flex flex-wrap gap-2">
      <DarkThemeToggle />
      <Dropdown
        renderTrigger={() => (<Avatar img={auth.userDetails?.profilePicture || './logo.png'} rounded />)}
        className='rounded-3xl'
      >
        <DropdownItem className='rounded-3xl' >
          <EmployeeCard name={auth.userDetails?.name || ""} email={auth.userDetails?.email || ''} profilePicture={auth.userDetails?.profilePicture || ''} />
        </DropdownItem>
      </Dropdown>
    </div>
  )
  const NAVBAR_COLLAPSE = (
    <NavbarCollapse>
      <NavbarLink as={'div'} >
        <Link to="/employee/create-invoice" className="text-gray-800 dark:text-gray-400 hover:text-blue-600">
          create-invoice
        </Link>
      </NavbarLink>
      <NavbarLink href="/employee" className="text-gray-700 hover:text-blue-600">
        view-invoices
      </NavbarLink>
      <NavbarLink href="#about" className="text-gray-700 hover:text-blue-600">
        view-products
      </NavbarLink>
    </NavbarCollapse>
  )
  return (
    <Navbar fluid rounded className="bg-white shadow-sm sticky top-0 z-50">
      <NavbarToggle />
      <NavbarBrand href="#">
        <span className=" self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-gray-300">
          Auto Billing
        </span>
      </NavbarBrand>
      {(width < 768) ? (<>
        {DIV}
        {NAVBAR_COLLAPSE}
      </>) : (<>
        {NAVBAR_COLLAPSE}
        {DIV}
      </>)}
    </Navbar>
  );
}
export default HeaderSection;
