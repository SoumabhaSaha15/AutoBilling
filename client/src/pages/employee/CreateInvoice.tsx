import z from "zod";
import { useState, FC } from "react";
import { FaQrcode } from "react-icons/fa";
import base from "./../../utility/axios-base"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import flatenner from "./../../utility/zod-error-flattener";
import { useToast } from "../../contexts/Toast/ToastContext";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import BarCodeScanner, { BarcodeFormat } from "react-qr-barcode-scanner";
import { OrderValidator, OrderType, OrdersType, OrdersValidator, InvoiceValidator, InvoiceType } from '../../validator/order';
import { TextInput, Label, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Spinner, ButtonGroup } from "flowbite-react";

const CreateInvoice: FC = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [remountKey, setRemountKey] = useState<string>(() => crypto.randomUUID());
  const [stop, setStop] = useState<boolean>(false);
  const [list, setList] = useState<OrdersType>([]);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<OrderType>({ resolver: zodResolver(OrderValidator) });

  const restart = () => {
    setStop(false);
    setRemountKey(crypto.randomUUID());
  };
  const clear = () => {
    reset();
    restart();
  }
  const pause = () => setStop(true);

  const submitInVoice = () => {
    pause()
    setIsSubmitting(true);
    try {
      const invoiceData: Pick<InvoiceType, 'orders'> = InvoiceValidator.pick({ orders: true }).parse({ orders: list });
      base.post('/invoice', invoiceData).then((response) => {
        const { id } = InvoiceValidator.pick({ id: true }).parse(response.data);
        base.get(`/invoice/${id}`).then((res) => {
          setList([]);
          console.log(res.data)
        }).catch(console.error);
      }).catch(console.log);
    } catch (err) {
      toast.open((err instanceof z.ZodError) ? flatenner(err) : (err as Error).message, 'alert-error', true, 2500);
    }
    setTimeout(setIsSubmitting, 1200, false);
    restart();
  }

  const addProductIds: SubmitHandler<OrderType> = (data) => {
    setIsLoading(true);
    setList((prev) => {
      try {
        return OrdersValidator.parse([...prev, data]);
      } catch (err) {
        toast.open((err instanceof z.ZodError) ? flatenner(err) : (err as Error).message, 'alert-error', true, 2500);
        return prev;
      }
    });
    clear();
    setTimeout(setIsLoading, 1200, false);
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
            if (result) {
              setValue("id", result.getText());
              setStop(true);
            }
          }}
          stopStream={stop}
        />

        <ButtonGroup>
          <Button color="alternative" disabled={stop} onClick={pause}>pause</Button>
          <Button color="alternative" onClick={restart}>restart</Button>
          <Button color="alternative" onClick={clear}>clear</Button>
        </ButtonGroup>

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
          <Button
            type="submit"
            disabled={isLoading}
            children={
              (isLoading) ?
                (<><Spinner aria-label="submit" size="sm" className="mr-2" />{"...adding id"}</>) :
                ("add product id")
            }
          />
        </form>
      </div>

      {/* Right Column - Fixed Height with Table Scrollable */}
      <div className="min-w-full w-full h-[calc(100vh-80px)] grid grid-rows-[94%_5%] grid-cols-1 gap-[1%] bg-gray-300 dark:bg-gray-800 rounded-2xl p-2">
        {/* Added flex flex-col here to manage children's height */}
        <div className="overflow-auto rounded-2xl bg-gray-200 dark:bg-gray-900 min-h-full">
          {/* flex-grow allows this div to take up remaining space, min-h-0 prevents overflow issues */}
          <Table hoverable className="">
            <TableHead>
              <TableRow>
                <TableHeadCell children="Product id" />
                <TableHeadCell children="Quantity" />
                <TableHeadCell children={<span className="sr-only" children={"Delete"} />} />
              </TableRow>
            </TableHead>
            <TableBody className="divide-y rounded-2xl">
              {list.map(
                ({ id, quantity }) => (
                  <TableRow className=" bg-white dark:border-gray-700 dark:bg-gray-800" key={crypto.randomUUID()}>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" children={id} />
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" children={quantity} />
                    <TableCell children={<Button children={"Delete"} onClick={() => { setList((prev) => prev.filter(item => (id !== item.id))); }} color="red" />} />
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
        <Button
          type="submit"
          onClick={submitInVoice}
          disabled={isSubmitting}
          children={
            (isSubmitting) ?
              (<><Spinner aria-label="submit" size="md" className="mr-2" />{"createing invoice"}</>) :
              ("create invoice")
          }
        />
      </div>
    </div>
  );
}
export default CreateInvoice;
