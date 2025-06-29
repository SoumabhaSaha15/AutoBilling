
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Card,TextInput } from "flowbite-react";
import BarCodeScanner, { BarcodeFormat } from "react-qr-barcode-scanner";
import { Link } from "react-router-dom";
import React from "react";


const BarCode: React.FC = () => {
  const [data, setData] = React.useState<null | string>(null);
  const [scanning, setScanning] = React.useState(true);

  return (<>
    <Navbar fluid rounded>
      <NavbarBrand as={Link} href="https://flowbite-react.com">
        <img src="/flowbite-react.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink as={Link} href="#">
          About
        </NavbarLink>
        <NavbarLink href="#">Services</NavbarLink>
        <NavbarLink href="#">Pricing</NavbarLink>
        <NavbarLink href="#">Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
    <Card
      className="max-w-sm"
      renderImage={() => {
        
      }}
    >
      <BarCodeScanner
          width={400}
          height={300}
          delay={2500}
          formats={[BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX]}
          onUpdate={(err, result) => {
            if (result) setData(() => {
              const x = result.getText()
              console.log(x, result.getBarcodeFormat());
              return x;
            });
            else {
              console.log((err as Error).message || "")
              setData(null);
            }
          }}
          stopStream={data?true:false}
        />
      <TextInput value={data?data:''}/>
      
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
      </p>
    </Card>
  </>)
}
export default BarCode;