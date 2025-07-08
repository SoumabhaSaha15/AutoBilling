import { Footer, FooterLink, FooterBrand, FooterTitle, FooterLinkGroup, FooterDivider, FooterCopyright } from 'flowbite-react';
import { FC } from 'react';
const FooterSection: FC = () => {
  return (
    <Footer container>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <FooterBrand
              href="#"
              src="/logo.png"
              alt="Auto Billing Logo"
              name="Auto Billing"
              className="text-white"
            />
            <p className="text-gray-400 mt-4 max-w-sm">
              The most trusted billing platform for shopping malls worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <FooterTitle title="Product" className="text-black dark:text-white" />
              <FooterLinkGroup col>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Features</FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Pricing</FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Security</FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Integrations</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Company" className="text-black dark:text-white" />
              <FooterLinkGroup col>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">About</FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Careers</FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Press</FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Contact</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Support" className="text-black dark:text-white" />
              <FooterLinkGroup col>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Help Center</FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Documentation</FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">API Reference</FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-black dark:hover:text-white">Community</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright href="#" by="Auto Billing™" year={2025} className="text-gray-400" />
        </div>
      </div>
    </Footer>
  );
}
export default FooterSection;