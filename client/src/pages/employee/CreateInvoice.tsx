import { z } from 'zod'
import { useState, FC } from 'react';
import { FaQrcode } from "react-icons/fa";
import base from "./../../utility/axios-base"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { LuTrash2, LuPlus, LuUpload } from 'react-icons/lu';
import flatenner from "./../../utility/zod-error-flattener";
import { useToast } from "../../contexts/Toast/ToastContext";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { OrderValidator, OrderType, OrdersType, OrdersValidator, InvoiceValidator, InvoiceType } from '../../validator/order';
import { Card, Button, Label, TextInput, Table, TableBody, TableHead, TableCell, TableRow, TableHeadCell, Modal, ModalBody, ModalHeader, Spinner } from 'flowbite-react';

const CreateInvoice: FC = () => {
  const toast = useToast();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customerEmail, setCustomerEmail] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [list, setList] = useState<OrdersType>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderType>({ resolver: zodResolver(OrderValidator) });


  const submitInVoice = () => {
    setIsSubmitting(true);
    try {
      const invoiceData: Pick<InvoiceType, 'orders'> & Pick<InvoiceType, 'customerEmail'> = InvoiceValidator.pick({ orders: true, customerEmail: true }).parse({ orders: list, customerEmail: customerEmail });
      base.post('/invoice', invoiceData).then((response) => {
        if (response.status === 200) {
          const { id } = InvoiceValidator.pick({ id: true }).parse(response.data);
          toast.open(id, 'alert-success', true, 2000);
          setList([]);
          setCustomerEmail('');
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
    <div className="max-w-4xl mx-auto p-6 space-y-6 overflow-auto">
      <Card>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerEmail" />
            <TextInput
              id="customerEmail"
              type="email"
              value={customerEmail}
              onInput={(e) => { setCustomerEmail(e.currentTarget.value || '') }}
              placeholder="customer@example.com"
              required
            />
          </div>
        </div>
      </Card>
      <div className='flex flex-row flex-wrap gap-3'>
        <Button
          color="green"
          className='w-[calc(50%-6px)]'
          onClick={submitInVoice}
          disabled={isSubmitting || list.length === 0}
          children={(isSubmitting) ?
            (<><Spinner aria-label="submit" size="md" className="mr-2" />{"createing invoice"}</>) : (<><LuUpload className="mr-2 h-4 w-4" />
              Upload Invoice</>)}
        />

        <Button
          onClick={() => {
            reset();
            setOpenModal(true);
          }}
          color="blue"
          className='w-[calc(50%-6px)]'
          children={<><LuPlus className="mr-2 h-4 w-4" />Add Item</>}
        />
        <Modal show={openModal} onClose={() => { setOpenModal(false) }} size="md" popup>
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

      {/* Table Card */}
      <Card>
        {list.length > 0 ? (
          <div className="overflow-x-auto shadow-xs shadow-black rounded">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Product ID</TableHeadCell>
                  <TableHeadCell>Quantity</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {list.map((item, i) => {
                  return (
                    <TableRow key={i} >
                      <TableCell>
                        {item.id}
                      </TableCell>
                      <TableCell>
                        {item.quantity}
                      </TableCell>
                      <TableCell>
                        <Button
                          color="red"
                          size="sm"
                          className='rounded-2xl'
                          onClick={() => { setList((prev) => prev.filter(it => (item.id !== it.id))); }}
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <LuPlus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">No items added</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first invoice item.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
export default CreateInvoice;
