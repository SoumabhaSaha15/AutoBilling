import { useState, FC, useEffect } from "react";
import { FaQrcode } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import BarCodeScanner, { BarcodeFormat } from "react-qr-barcode-scanner";
import { useForm, SubmitHandler } from "react-hook-form";
import { OrderValidator, OrderType, OrdersType } from "../../validator/order";
import { TextInput, Label, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Spinner } from "flowbite-react";
import { zodResolver } from "@hookform/resolvers/zod";
const remount_key = crypto.randomUUID();
const CreateInvoice: FC = () => {
  const [data, setData] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [remountKey, setRemountKey] = useState<string>(remount_key);
  const [stop, setStop] = useState<boolean>(false);
  const [list, setList] = useState<OrdersType>([]);
  useEffect(() => { if (data) setValue('id', data); }, [data])
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<OrderType>({ resolver: zodResolver(OrderValidator) });
  setValue('id', data || "");
  const addProductIds: SubmitHandler<OrderType> = (data) => {
    setIsLoading(true);
    setList(prev => [...prev, data]);
    reset();
    setData(null);
    setIsLoading(false);
    setStop(false);
    setRemountKey(crypto.randomUUID());
  }

  return (
    <div className="grid overflow-auto h-[calc(100dvh-60px)] bg-gray-400 dark:bg-gray-900 grid-cols-[100%] md:grid-cols-[34.75%_64.75%] gap-[0.5%] p-2 items-start">
      <div className="grid place-items-center min-w-full w-full h-[calc(100dvh-80px)] bg-gray-300 dark:bg-gray-800 rounded-2xl p-4">
        <BarCodeScanner
          key={remountKey}
          width={400}
          height={400}
          delay={2500}
          formats={[BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX]}
          onUpdate={(_, result) => {
            (result) ? setData(() => {
              setStop(true);
              return result.getText();
            }) : setData(null);
          }}
          stopStream={stop}
        />
        <form className="w-[90%] flex flex-col gap-4" onSubmit={handleSubmit(addProductIds)}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="productId">
                Product id
                {errors.id && <div className="text-red-500">{errors.id.message}</div>}
              </Label>
            </div>
            <TextInput
              id="productId"
              icon={FaQrcode}
              type="text"
              placeholder="product id"
              {...register('id')}
              readOnly
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="quantity">
                Quantity
                {errors.quantity && <div className="text-red-500">{errors.quantity.message}</div>}
              </Label>
            </div>
            <TextInput
              id="quantity"
              type="number"
              icon={MdOutlineProductionQuantityLimits}
              required
              {...register("quantity")}
              placeholder="1"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {(isLoading) ?
              (<><Spinner aria-label="submit" size="sm" className="mr-2" />{"adding id"}</>)
              : ("add product id")}
          </Button>
        </form>
      </div>

      {/* Right Column - Fixed Height with Table Scrollable */}
      <div className="min-w-full w-full h-[calc(100vh-80px)] grid grid-rows-[94%_5%] grid-cols-1 gap-[1%] bg-gray-300 dark:bg-gray-800 rounded-2xl p-2">
        {/* Added flex flex-col here to manage children's height */}
        <div className="overflow-auto rounded-2xl bg-gray-200 dark:bg-gray-900 min-h-full">
          {/* flex-grow allows this div to take up remaining space, min-h-0 prevents overflow issues */}
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell children="Product id" />
                <TableHeadCell children="Quantity" />
              </TableRow>
            </TableHead>
            <TableBody className="divide-y rounded-2xl">
              {list.map(({ id, quantity }) => (
                <TableRow className=" bg-white dark:border-gray-700 dark:bg-gray-800" key={crypto.randomUUID()}>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" children={id} />
                  <TableCell children={quantity} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button type="submit" > {/* Added mt-2 for spacing from the table */}
          Create Invoice
        </Button>
      </div>
    </div>
  );
}
export default CreateInvoice;
