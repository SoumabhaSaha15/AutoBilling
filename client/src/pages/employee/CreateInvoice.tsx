import { useState, FC } from "react";
import { TextInput, Label, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { FaQrcode } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import BarCodeScanner, { BarcodeFormat } from "react-qr-barcode-scanner";
const CreateInvoice: FC = () => {
  const [data, setData] = useState<null | string>(null);
  return (<>
    <div className="grid h-[calc(100vh-64px)] bg-gray-400 dark:bg-gray-900 grid-cols-[100%] md:grid-cols-[34%_65%] gap-[1%] p-2 items-center">

      <div className="grid place-items-center min-w-full w-full h-full bg-gray-300 dark:bg-gray-800 rounded-2xl ">
        <BarCodeScanner
          width={400}
          height={400}
          delay={2500}
          formats={[BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX]}
          onUpdate={(_, result) => { (result) ? setData(() => result.getText()) : setData(null); }}
          stopStream={!!data}
        />


        <form className="w-[90%] flex flex-col gap-4">

          <div>
            <div className="mb-2 block">
              <Label htmlFor="product_id">Product id</Label>
            </div>
            <TextInput id="product_id" icon={FaQrcode} type="text" placeholder="product id" value={data ? data : "waiting..."} readOnly />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="quantity">Quantity</Label>
            </div>
            <TextInput id="quantity" type="number" icon={MdOutlineProductionQuantityLimits} required placeholder="1" />
          </div>

          <div className="flex items-center gap-2">
          </div>
          <Button type="submit">Add & scan next</Button>
        </form>
      </div>

      <div className="min-w-full w-full h-full bg-gray-300 dark:bg-gray-800 rounded-2xl">


        <div className="overflow-x-auto">
          <Table hoverable className="scale-90">
            <TableHead>
              <TableRow>
                <TableHeadCell>Product name</TableHeadCell>
                <TableHeadCell>Color</TableHeadCell>
                <TableHeadCell>Catagory</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Apple MacBook Pro 17"
                </TableCell>
                <TableCell>Sliver</TableCell>
                <TableCell>Laptop</TableCell>

              </TableRow>
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Microsoft Surface Pro
                </TableCell>
                <TableCell>White</TableCell>
                <TableCell>Laptop PC</TableCell>

              </TableRow>
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">Magic Mouse 2</TableCell>
                <TableCell>Black</TableCell>
                <TableCell>Accessories</TableCell>

              </TableRow>
            </TableBody>
          </Table>
        </div>


      </div>
    </div>
  </>)
}
export default CreateInvoice;
