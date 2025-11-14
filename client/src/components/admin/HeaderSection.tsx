import AdminCard from './AdminCard';
import { Link } from "react-router-dom";
import { type FC, useState, useEffect } from "react";
import { useAuth } from '../../contexts/Auth/admin/AuthContext';
import { Avatar, DarkThemeToggle, Dropdown, DropdownItem, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import _ from "lodash";
const HeaderSection: FC = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  useEffect(() => {
    window.onresize = _.throttle(() => setWidth(window.innerWidth), 1500);
    return () => { window.onresize = () => { } };
  }, []);
  const auth = useAuth();
  const DIV = (
    <div className="flex flex-wrap gap-2">
      <DarkThemeToggle />
      <Dropdown
        renderTrigger={() => (<Avatar img={auth.userDetails?.profilePicture || './logo.png'} rounded />)}
        className='rounded-xl'
      >
        <DropdownItem as={'div'} className='rounded-xl flex flex-col'>
          <AdminCard name={auth.userDetails?.name || ""} email={auth.userDetails?.email || ''} profilePicture={auth.userDetails?.profilePicture || ''} />
        </DropdownItem>
      </Dropdown>
    </div>
  );
  const NAVBAR_COLLAPSE = (
    <NavbarCollapse>
      <NavbarLink as={'div'} >
        <Link to="/admin/add-product" className="text-gray-800 dark:text-gray-400 hover:text-blue-600">
          add-product
        </Link>
      </NavbarLink>
      <NavbarLink as={'div'} >
        <Link to="/admin/view-products" className="text-gray-800 dark:text-gray-400 hover:text-blue-600">
          view-products
        </Link>
      </NavbarLink>
      <NavbarLink as={'div'} >
        <Link to="/admin" className="text-gray-800 dark:text-gray-400 hover:text-blue-600">
          dashboard
        </Link>
      </NavbarLink>
      <NavbarLink as={'div'}>
        <Link to="/admin/register-employee" className="text-gray-800 dark:text-gray-400 hover:text-blue-600">
          new-employee
        </Link>
      </NavbarLink>
    </NavbarCollapse>
  );

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
