import { Avatar,DarkThemeToggle, Dropdown,DropdownItem,Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import { FC, useState, useEffect } from "react";
import AdminCard from './AdminCard';
import { useAuth } from '../../context/Auth/AuthContext';
const HeaderSection: FC = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  useEffect(() => {
    window.onresize = (_) => {
      setWidth(window.innerWidth);
    };
  }, []);
  const auth = useAuth();
  return (
    <Navbar fluid rounded className="bg-white shadow-sm sticky top-0 z-50">
      <NavbarToggle />
      <NavbarBrand href="#">
        <span className=" self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-gray-300">
          Auto Billing
        </span>
      </NavbarBrand>
      {(width < 768) ? (<>
        <div className="flex flex-wrap gap-2">
          <DarkThemeToggle />
          <Dropdown
            renderTrigger={()=>(<Avatar img={auth.userDetails?.profilePicture||'./logo.png'} rounded />)}
            className='rounded-3xl'
          >
            <DropdownItem className='rounded-3xl' >
              <AdminCard name={auth.userDetails?.name||""} email={auth.userDetails?.email||''} profilePicture={auth.userDetails?.profilePicture||''}/>
            </DropdownItem>
          </Dropdown>
        </div>
        <NavbarCollapse>
          <NavbarLink href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </NavbarLink>
          <NavbarLink href="#pricing" className="text-gray-700 hover:text-blue-600">
            Pricing
          </NavbarLink>
          <NavbarLink href="#about" className="text-gray-700 hover:text-blue-600">
            About
          </NavbarLink>
          <NavbarLink href="#contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </NavbarLink>
        </NavbarCollapse>
      </>) : (<>
        <NavbarCollapse>
          <NavbarLink href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </NavbarLink>
          <NavbarLink href="#pricing" className="text-gray-700 hover:text-blue-600">
            Pricing
          </NavbarLink>
          <NavbarLink href="#about" className="text-gray-700 hover:text-blue-600">
            About
          </NavbarLink>
          <NavbarLink href="#contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </NavbarLink>
        </NavbarCollapse>
        <div className="flex flex-wrap gap-2">
          <DarkThemeToggle />
          <Dropdown
            renderTrigger={()=>(<Avatar img={auth.userDetails?.profilePicture||'./logo.png'} rounded />)}
            className='rounded-3xl'
          >
            <DropdownItem className='rounded-3xl'>
              <AdminCard name={auth.userDetails?.name||""} email={auth.userDetails?.email||''} profilePicture={auth.userDetails?.profilePicture||''}/>
            </DropdownItem>
          </Dropdown>
        </div>
      </>)}
    </Navbar>
  );
}
export default HeaderSection;
