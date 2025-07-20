import z from "zod";
import { useState, FC } from "react";
import { FaQrcode } from "react-icons/fa";
import base from "./../../utility/axios-base"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import flatenner from "./../../utility/zod-error-flattener";
import { useToast } from "../../contexts/Toast/ToastContext";
import {MdOutlineProductionQuantityLimits} from "react-icons/md";
import { OrderValidator, OrderType, OrdersType, OrdersValidator, InvoiceValidator, InvoiceType } from '../../validator/order';
import { TextInput, Label, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Spinner, Modal, ModalBody, ModalHeader, } from "flowbite-react";

const CreateInvoice: FC = () => {
  const toast = useToast();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [list, setList] = useState<OrdersType>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderType>({ resolver: zodResolver(OrderValidator) });

  const submitInVoice = () => {
    setIsSubmitting(true);
    try {
      const invoiceData: Pick<InvoiceType, 'orders'> = InvoiceValidator.pick({ orders: true }).parse({ orders: list });
      base.post('/invoice', invoiceData).then((response) => {
        if(response.status === 200){
          const { id } = InvoiceValidator.pick({ id: true }).parse(response.data);
          toast.open(id, 'alert-success', true, 2000);
          setList([]);
        } else {
          toast.open(response.data, 'alert-error', true, 2000);
        }
      }).catch(console.log);
    } catch (err) {
      toast.open((err instanceof z.ZodError) ? flatenner(err) : (err as Error).message, 'alert-error', true, 2500);
    }
    setTimeout(setIsSubmitting, 1000, false);
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
    setTimeout(setIsLoading, 1000, false);
  }

  return (
    <div className="grid overflow-auto h-[calc(100dvh-60px)] bg-gray-400 dark:bg-gray-900 grid-cols-[100%] gap-[0.5%] p-2 items-start">
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
        <div className="grid grid-cols-[calc(80%-4px)_calc(20%-4px)] gap-2">
          <Button
            type="submit"
            className="rounded-2xl"
            onClick={submitInVoice}
            disabled={isSubmitting || list.length === 0}
            children={
              (isSubmitting) ?
                (<><Spinner aria-label="submit" size="md" className="mr-2" />{"createing invoice"}</>) :
                ("create invoice")
            }
          />
          <Button className="rounded-2xl" onClick={() => {
            reset();
            setOpenModal(true);
          }}>open forms</Button>
        </div>
      </div>

      <Modal show={openModal} onClose={()=>{setOpenModal(false)}} size="md" popup>
        <ModalHeader />
        <ModalBody>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(addProductIds)}>
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
              autoFocus
              placeholder="product id"
              {...register('id')}
              // readOnly
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
        </ModalBody>
      </Modal>
    </div>
  );
}
export default CreateInvoice;
